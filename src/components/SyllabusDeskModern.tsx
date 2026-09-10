import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  ArrowLeft, User, Sparkles, CheckCircle, Upload, RefreshCw, Youtube, Video, FileText,
  ChevronRight, GraduationCap, BookOpen, Clock, History, Play, Check, Flame, HelpCircle,
  Mic, MessageSquare, Target, Award, TrendingUp, UploadCloud, FileUp, Trash2, Paperclip,
  CheckCircle2, Info, Home, Headphones, Radio, X
} from "lucide-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { HomeworkMaker } from "./HomeworkMaker";
import { ProblemGuideChat } from "./ProblemGuideChat";
import { ConceptInfographicPoster } from "./ConceptInfographicPoster";
import { PYQUploadStudio } from "./PYQUploadStudio";
import { PYQReportsHub } from "./PYQReportsHub";
import { PYQValidationAlertModal } from "./PYQValidationAlertModal";
import { PYQ8020ReportModal } from "./PYQ8020ReportModal";
import { PYQWeightageHeatmapModal } from "./PYQWeightageHeatmapModal";
import { AIPredictedPaperModal } from "./AIPredictedPaperModal";
import { ConceptInfographicData, PYQ8020AnalysisReport, PYQWeightageHeatmapReport, AIPredictedPaperReport, AudioPodcastData } from "../types";
import { safeSavePastSessions } from "../utils/safeStorage";
import { saveActiveLearningContext } from "../utils/activeLearningStore";
import { compressImageIfPossible } from "../utils/imageCompressor";
import { generateUniversalFallback, adaptUniversalToLegacy } from "../utils/distillationEngine";
import { getCurated8020Report, getCuratedWeightageHeatmapReport, getCuratedPredictedPaperReport } from "../utils/pyqAnalysisEngine";
import { getTranslations } from "../utils/i18n";
import { getActiveApiKey } from "../utils/geminiKeyStorage";
import { AudioOverviewStudio } from "./AudioOverviewStudio";

interface SyllabusDeskModernProps {
  studentDetails: {
    name: string;
    grade: string;
    subject: string;
    board?: string;
    mediumOfLearning?: string;
  };
  setStudentDetails: React.Dispatch<React.SetStateAction<any>>;
  activeDocument: any;
  setActiveDocument: React.Dispatch<React.SetStateAction<any>>;
  uploadMode: "guide" | "explain" | "mistake" | "homework" | "doubt" | "socratic" | "cheatsheet" | "pyq" | "podcast";
  setUploadMode: (mode: "guide" | "explain" | "mistake" | "homework" | "doubt" | "socratic" | "cheatsheet" | "pyq" | "podcast") => void;
  youtubeUrl: string;
  setYoutubeUrl: (url: string) => void;
  isYoutubeLoading: boolean;
  setIsYoutubeLoading: (loading: boolean) => void;
  isUploading: boolean;
  handleFileUpload: (file: File) => void;
  setCurrentScreen: (screen: "home" | "syllabus" | "classroom" | "quiz" | "lab" | "profile") => void;
  setShowStudentAccountHub: (show: boolean) => void;
  addToast: (msg: string, type: "success" | "error" | "info") => void;
  auth: any;
  db: any;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setSessionId: React.Dispatch<React.SetStateAction<any>>;
  setDialogueHistory: React.Dispatch<React.SetStateAction<any>>;
  setCustomBoardContent: React.Dispatch<React.SetStateAction<any>>;
  setTopicBoardsContent: React.Dispatch<React.SetStateAction<any>>;
  setPastSessions: React.Dispatch<React.SetStateAction<any>>;
  loadPastSessions: (uid: string) => void;
  disconnect: () => void;
  setUploadedButWaitingWakeup: React.Dispatch<React.SetStateAction<any>>;
  setActiveTopicIndex: React.Dispatch<React.SetStateAction<any>>;
  extractYoutubeId: (url: string) => string | null;
  pastSessions?: any[];
  handleLoadPastSession?: (sess: any) => void;
  onOpenAudioPodcast?: (podcast: AudioPodcastData) => void;
}

export const SyllabusDeskModern: React.FC<SyllabusDeskModernProps> = ({
  studentDetails,
  setStudentDetails,
  activeDocument,
  setActiveDocument,
  uploadMode,
  setUploadMode,
  youtubeUrl,
  setYoutubeUrl,
  isYoutubeLoading,
  setIsYoutubeLoading,
  isUploading,
  handleFileUpload,
  setCurrentScreen,
  setShowStudentAccountHub,
  addToast,
  auth,
  db,
  user,
  setUser,
  setSessionId,
  setDialogueHistory,
  setCustomBoardContent,
  setTopicBoardsContent,
  setPastSessions,
  loadPastSessions,
  disconnect,
  setUploadedButWaitingWakeup,
  setActiveTopicIndex,
  extractYoutubeId,
  pastSessions = [],
  handleLoadPastSession,
  onOpenAudioPodcast,
}) => {
  const t = useMemo(() => getTranslations(studentDetails.mediumOfLearning), [studentDetails.mediumOfLearning]);

  // Local state for interactive UI micro-tabs inside content cards
  const [contentTab, setContentTab] = useState<"upload" | "youtube">("upload");
  const [showTopicPrompt, setShowTopicPrompt] = useState(false);
  const [directStudySubMode, setDirectStudySubMode] = useState<"choose" | "type">("choose");
  const [typedTopic, setTypedTopic] = useState("");

  // Visual Cheat Sheet state
  const [cheatSheetData, setCheatSheetData] = useState<ConceptInfographicData | null>(null);
  const [loadingCheatSheet, setLoadingCheatSheet] = useState(false);
  const [cheatSheetTopicInput, setCheatSheetTopicInput] = useState("");

  // 🎯 10-Year PYQ 80/20 Analysis State (Phase 1)
  const [showPYQ8020Modal, setShowPYQ8020Modal] = useState(false);
  const [pyq8020Report, setPyq8020Report] = useState<PYQ8020AnalysisReport | null>(null);
  const [loadingPYQ8020, setLoadingPYQ8020] = useState(false);

  // 🗺️ 10-Year Marking Weightage Heatmap State (Phase 2)
  const [showHeatmapModal, setShowHeatmapModal] = useState(false);
  const [heatmapReport, setHeatmapReport] = useState<PYQWeightageHeatmapReport | null>(null);
  const [loadingHeatmap, setLoadingHeatmap] = useState(false);

  // 🎲 2026 Board Examination AI Predicted Paper State (Phase 3)
  const [showPredictedPaperModal, setShowPredictedPaperModal] = useState(false);
  const [predictedPaperReport, setPredictedPaperReport] = useState<AIPredictedPaperReport | null>(null);
  const [loadingPredictedPaper, setLoadingPredictedPaper] = useState(false);

  // 📄 Dedicated Custom PYQ Document Upload State
  const [showPYQReportsHub, setShowPYQReportsHub] = useState(false);
  const pyqFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPYQ, setIsUploadingPYQ] = useState(false);
  const [uploadedPYQName, setUploadedPYQName] = useState<string>("");

  // 🎯 Target Board Grade check: PYQ Intelligence is strictly available for Class 10 & 12
  const isPYQEligible = React.useMemo(() => {
    const g = (studentDetails.grade || "Class 10").toString().toLowerCase().trim();
    const isClass10 = /\b10(th)?\b/i.test(g) || g.includes("class 10") || g.includes("grade 10") || g === "10" || g === "10th" || g.includes("tenth") || g.includes("class x");
    const isClass12 = /\b12(th)?\b/i.test(g) || g.includes("class 12") || g.includes("grade 12") || g === "12" || g === "12th" || g.includes("twelfth") || g.includes("class xii");
    return isClass10 || isClass12;
  }, [studentDetails.grade]);

  // Auto fallback to "explain" if current grade is not Class 10 or 12
  useEffect(() => {
    if (!isPYQEligible && uploadMode === "pyq") {
      setUploadMode("explain");
    }
  }, [isPYQEligible, uploadMode, setUploadMode]);

  // 🛡️ PYQ AI Validation Guardrail Alert State
  const [pyqValidationAlert, setPyqValidationAlert] = useState<{
    isOpen: boolean;
    fileName: string;
    reason?: string;
    detectedDocType?: string;
    detectedSubject?: string;
    pendingDoc?: any;
  } | null>(null);

  const handlePYQFileUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      addToast("File size too large. Please select a file under 25MB.", "error");
      return;
    }

    setIsUploadingPYQ(true);
    addToast(`Extracting questions, formulas & patterns from "${file.name}"... ⏳`, "info");

    try {
      let resolvedMime = file.type || "";
      if (!resolvedMime || resolvedMime === "application/octet-stream") {
        const lower = file.name.toLowerCase();
        if (lower.endsWith(".pdf")) resolvedMime = "application/pdf";
        else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) resolvedMime = "image/jpeg";
        else if (lower.endsWith(".png")) resolvedMime = "image/png";
        else if (lower.endsWith(".webp")) resolvedMime = "image/webp";
        else if (lower.endsWith(".txt")) resolvedMime = "text/plain";
        else resolvedMime = "application/pdf";
      }

      const dataUrl = await compressImageIfPossible(file, 1400, 0.75);
      const parts = dataUrl.split(",");
      const base64Data = parts[1] || "";
      const mimeMatch = parts[0]?.match(/:(.*?);/);
      const finalMime = (mimeMatch && mimeMatch[1]) ? mimeMatch[1] : resolvedMime;

      const activeKey = getActiveApiKey();
      const uploadRes = await fetch("/api/upload-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeKey ? { "x-gemini-api-key": activeKey } : {}),
        },
        body: JSON.stringify({
          filename: file.name,
          mimeType: finalMime,
          base64Data,
          mode: "pyq",
          apiKey: activeKey || undefined,
        })
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to process document");
      }

      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        throw new Error(uploadData.error || "Failed to parse document");
      }

      const isQP = uploadData.isQuestionPaper !== false;
      const newDoc = {
        name: file.name,
        type: file.type,
        markdown: uploadData.markdown || "",
        detectedSubject: uploadData.detectedSubject,
        detectedGrade: uploadData.detectedGrade,
        detectedBoard: uploadData.detectedBoard,
        isQuestionPaper: isQP,
        validationReason: uploadData.validationReason,
        detectedDocType: uploadData.detectedDocType
      };

      // ⚠️ Validation Guardrail: If file is not an exam question paper
      if (!isQP) {
        setPyqValidationAlert({
          isOpen: true,
          fileName: file.name,
          reason: uploadData.validationReason || "AI analysis ke mutabik is document me exam questions, marks ya problem statements nahi mile.",
          detectedDocType: uploadData.detectedDocType || "non_question_paper",
          detectedSubject: uploadData.detectedSubject,
          pendingDoc: newDoc
        });
        addToast(`⚠️ Non-question paper detected in "${file.name}". Please choose an option.`, "info");
        return;
      }

      // Valid Question Paper
      setActiveDocument(newDoc);
      setUploadedPYQName(file.name);

      if (uploadData.detectedSubject) {
        setStudentDetails((prev: any) => ({ ...prev, subject: uploadData.detectedSubject }));
      }

      // Reset stale reports so fresh custom AI generation occurs
      setPyq8020Report(null);
      setHeatmapReport(null);
      setPredictedPaperReport(null);

      // Instantly open the dedicated PYQ Reports Hub page
      setShowPYQReportsHub(true);

      addToast(`🎉 Custom PYQ Paper "${file.name}" loaded! Tap any report below to inspect custom analysis.`, "success");
    } catch (err: any) {
      console.error("PYQ Upload Error:", err);
      addToast("Could not parse file. Reverting to verified 10-Year National Exam Database.", "error");
    } finally {
      setIsUploadingPYQ(false);
      if (pyqFileInputRef.current) pyqFileInputRef.current.value = "";
    }
  };

  const handleValidationUseNationalDB = () => {
    setPyqValidationAlert(null);
    setUploadedPYQName("");
    setActiveDocument(null);
    setPyq8020Report(null);
    setHeatmapReport(null);
    setPredictedPaperReport(null);
    setShowPYQReportsHub(true);
    addToast(`✨ Switched to 10-Year National Board Question Bank for ${studentDetails.subject}!`, "success");
  };

  const handleValidationUploadAnother = () => {
    setPyqValidationAlert(null);
    pyqFileInputRef.current?.click();
  };

  const handleValidationSwitchMode = (targetMode: "explain" | "cheatsheet" | "doubt") => {
    if (pyqValidationAlert?.pendingDoc) {
      setActiveDocument(pyqValidationAlert.pendingDoc);
    }
    setPyqValidationAlert(null);
    setUploadMode(targetMode);
    addToast(`Document converted to ${targetMode.toUpperCase()} mode!`, "success");
  };

  const handleValidationProceedAnyway = () => {
    if (pyqValidationAlert?.pendingDoc) {
      setActiveDocument(pyqValidationAlert.pendingDoc);
      setUploadedPYQName(pyqValidationAlert.fileName);
      if (pyqValidationAlert.detectedSubject) {
        setStudentDetails((prev: any) => ({ ...prev, subject: pyqValidationAlert.detectedSubject }));
      }
      setPyq8020Report(null);
      setHeatmapReport(null);
      setPredictedPaperReport(null);
      setShowPYQReportsHub(true);
    }
    setPyqValidationAlert(null);
    addToast(`Proceeding with "${pyqValidationAlert?.fileName}" in Custom PYQ Mode.`, "info");
  };

  const handleClearUploadedPYQ = () => {
    setUploadedPYQName("");
    setActiveDocument(null);
    setPyq8020Report(null);
    setHeatmapReport(null);
    setPredictedPaperReport(null);
    addToast("Switched back to verified 10-Year National Exam Database (CBSE 2016-2026).", "info");
  };

  const handleFetchPredictedPaper = async () => {
    setLoadingPredictedPaper(true);
    try {
      const response = await fetch("/api/pyq-predicted-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: studentDetails.subject || "Mathematics",
          grade: studentDetails.grade || "Class 10th",
          board: studentDetails.board || "CBSE",
          pyqDocumentText: activeDocument?.markdown || ""
        })
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data) {
          setPredictedPaperReport(resData.data);
          addToast("2026 AI Predicted Paper Generated! 🎲", "success");
          return;
        }
      }
      throw new Error("Predicted Paper API returned non-success");
    } catch (err: any) {
      console.warn("Using curated Predicted Paper report:", err);
      const fallbackPaper = getCuratedPredictedPaperReport(
        studentDetails.subject || "Mathematics",
        studentDetails.grade || "Class 10th",
        studentDetails.board || "CBSE"
      );
      setPredictedPaperReport(fallbackPaper);
      addToast("Loaded 2026 AI Predicted Board Paper & Marking Scheme! 🎲", "info");
    } finally {
      setLoadingPredictedPaper(false);
    }
  };

  const handleOpenPredictedPaper = async () => {
    setShowPredictedPaperModal(true);
    if (!predictedPaperReport) {
      await handleFetchPredictedPaper();
    }
  };

  const handleFetchHeatmap = async () => {
    setLoadingHeatmap(true);
    try {
      const response = await fetch("/api/pyq-marking-heatmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: studentDetails.subject || "Mathematics",
          grade: studentDetails.grade || "Class 10th",
          board: studentDetails.board || "CBSE",
          pyqDocumentText: activeDocument?.markdown || ""
        })
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data) {
          setHeatmapReport(resData.data);
          addToast("Marking Weightage Heatmap Generated! 🗺️", "success");
          return;
        }
      }
      throw new Error("Heatmap API returned non-success");
    } catch (err: any) {
      console.warn("Using curated Weightage Heatmap domain report:", err);
      const fallbackReport = getCuratedWeightageHeatmapReport(
        studentDetails.subject || "Mathematics",
        studentDetails.grade || "Class 10th",
        studentDetails.board || "CBSE"
      );
      setHeatmapReport(fallbackReport);
      addToast("Loaded 10-Year Marking Blueprint & Section Heatmap! 🗺️", "info");
    } finally {
      setLoadingHeatmap(false);
    }
  };

  const handleOpenHeatmap = async () => {
    setShowHeatmapModal(true);
    if (!heatmapReport) {
      await handleFetchHeatmap();
    }
  };

  const handleFetchPYQ8020 = async () => {
    setLoadingPYQ8020(true);
    try {
      const response = await fetch("/api/pyq-analyze-8020", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: studentDetails.subject || "Mathematics",
          grade: studentDetails.grade || "Class 10th",
          board: studentDetails.board || "CBSE",
          pyqDocumentText: activeDocument?.markdown || ""
        })
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data) {
          setPyq8020Report(resData.data);
          addToast("10-Year PYQ 80/20 Analysis Generated! 🎯", "success");
          return;
        }
      }
      throw new Error("PYQ 80/20 analysis API returned non-success");
    } catch (err: any) {
      console.warn("Using curated 80/20 domain report:", err);
      const fallbackReport = getCurated8020Report(
        studentDetails.subject || "Mathematics",
        studentDetails.grade || "Class 10th",
        studentDetails.board || "CBSE"
      );
      setPyq8020Report(fallbackReport);
      addToast("Loaded 10-Year High-Yield Guaranteed Blueprint! 🎯", "info");
    } finally {
      setLoadingPYQ8020(false);
    }
  };

  const handleOpenPYQ8020 = async () => {
    setShowPYQ8020Modal(true);
    if (!pyq8020Report) {
      await handleFetchPYQ8020();
    }
  };

  const handleGenerateCheatSheet = async (topicToGen?: string) => {
    const finalTopic = (topicToGen || cheatSheetTopicInput || studentDetails.subject || "Important Concepts").trim();
    if (!finalTopic) {
      addToast("Please enter a chapter or topic name! 📝", "info");
      return;
    }

    setLoadingCheatSheet(true);
    try {
      const response = await fetch("/api/generate-concept-infographic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: finalTopic,
          topicTitle: finalTopic,
          subject: studentDetails.subject || "Science",
          grade: studentDetails.grade || "Class 10",
          board: studentDetails.board || "CBSE",
          chapter: finalTopic,
          blackboardContent: ""
        })
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data) {
          setCheatSheetData(resData.data);
          addToast("Visual Cheat Sheet Generated! ⚡", "success");
          return;
        }
      }
      throw new Error("API request failed");
    } catch (err: any) {
      console.warn("Server generation issue, activating client-side distillation engine:", err);
      try {
        const fallbackUniversal = generateUniversalFallback(
          finalTopic,
          studentDetails.subject || "Science",
          studentDetails.grade || "Class 10",
          ""
        );
        const fallbackData = adaptUniversalToLegacy(fallbackUniversal);
        setCheatSheetData(fallbackData);
        addToast("Visual Cheat Sheet Generated! ⚡", "success");
      } catch (fallbackErr) {
        console.error("Error generating cheat sheet:", fallbackErr);
        addToast("Could not generate visual cheat sheet. Please try again!", "error");
      }
    } finally {
      setLoadingCheatSheet(false);
    }
  };

  const handleCheatSheetFileUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      addToast("File size too large. Please select a file under 15MB.", "error");
      return;
    }

    setLoadingCheatSheet(true);
    addToast(`Reading & extracting document insights for Visual Cheat Sheet... ⚡`, "info");

    let cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/^[0-9a-fA-F_-]{10,}/, "").trim();
    if (/^[0-9\s_.-]+$/.test(cleanTitle)) {
      cleanTitle = "";
    }
    let detectedSubj = studentDetails.subject || "Science";
    let extractedMarkdown = "";
    let dataUrl = "";
    let finalMime = "";

    try {
      let resolvedMime = file.type || "";
      if (!resolvedMime || resolvedMime === "application/octet-stream") {
        const lower = file.name.toLowerCase();
        if (lower.endsWith(".pdf")) resolvedMime = "application/pdf";
        else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) resolvedMime = "image/jpeg";
        else if (lower.endsWith(".png")) resolvedMime = "image/png";
        else if (lower.endsWith(".webp")) resolvedMime = "image/webp";
        else if (lower.endsWith(".txt")) resolvedMime = "text/plain";
        else resolvedMime = "application/pdf";
      }

      dataUrl = await compressImageIfPossible(file, 1200, 0.70);
      if (!dataUrl) {
        throw new Error("Failed to read document contents safely.");
      }

      const parts = dataUrl.split(",");
      const base64Data = parts[1] || "";
      const mimeMatch = parts[0]?.match(/:(.*?);/);
      finalMime = (mimeMatch && mimeMatch[1]) ? mimeMatch[1] : resolvedMime;

      let extractedSubtopics: string[] = [];

      // Step 1: Deep OCR & Content Extraction from uploaded document
      try {
        const uploadRes = await fetch("/api/upload-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            mimeType: finalMime,
            base64Data,
            mode: "cheatsheet",
          })
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.success) {
            extractedMarkdown = uploadData.markdown || "";
            if (uploadData.detectedSubject) {
              detectedSubj = uploadData.detectedSubject;
              setStudentDetails((prev: any) => ({ ...prev, subject: uploadData.detectedSubject }));
            }
            if (uploadData.detectedTitle && !/^[0-9\s_.-]+$/.test(uploadData.detectedTitle)) {
              cleanTitle = uploadData.detectedTitle;
            } else if (uploadData.detectedChapter && !/^[0-9\s_.-]+$/.test(uploadData.detectedChapter)) {
              cleanTitle = uploadData.detectedChapter;
            }

            // Extract true chapter title from extracted markdown headers if not already set
            if (extractedMarkdown) {
              const headerMatch = extractedMarkdown.match(/^#+\s*Chapter:\s*(.+)$/im) ||
                                  extractedMarkdown.match(/^#+\s*Topic:\s*(.+)$/im) ||
                                  extractedMarkdown.match(/^#+\s*(.+)$/m) || 
                                  extractedMarkdown.match(/^Title:\s*(.+)$/im) ||
                                  extractedMarkdown.match(/^Chapter:\s*(.+)$/im) ||
                                  extractedMarkdown.match(/^Topic:\s*(.+)$/im);
              if (headerMatch && headerMatch[1]) {
                const rawHeading = headerMatch[1].replace(/[\*\_\[\]`#]/g, "").trim();
                if (rawHeading.length > 2 && !rawHeading.toLowerCase().startsWith("file_") && !rawHeading.toLowerCase().startsWith("slide_") && !/^[0-9\s_.-]+$/.test(rawHeading)) {
                  cleanTitle = rawHeading;
                }
              }

              // Extract subtopics from all # headings in the document
              const headingMatches = extractedMarkdown.match(/^#+\s*(.+)$/gm);
              if (headingMatches && headingMatches.length > 0) {
                extractedSubtopics = headingMatches.map(h => h.replace(/^#+\s*/, "").replace(/[\*\_\[\]`#]/g, "").trim()).filter(h => h && !/^[0-9\s_.-]+$/.test(h));
              }

              // Deep check for Chemistry content
              if (extractedMarkdown.match(/(\bNH_?3\b|ammonia|haber|hydrochloric|nitric|sulfuric|acid|base|salt|bond|reaction|organic|element|periodic|equilibrium|titration|catalyst|oxidation|reduction|covalent|ionic|valency|molar mass|vapour density)/i)) {
                detectedSubj = "Chemistry";
                setStudentDetails((prev: any) => ({ ...prev, subject: "Chemistry" }));
              }
            }
          }
        }
      } catch (uploadErr) {
        console.warn("Upload document parsing offline/fallback:", uploadErr);
      }

      if (!cleanTitle || cleanTitle.length < 3 || /^[0-9\s_.-]+$/.test(cleanTitle)) {
        cleanTitle = detectedSubj === "Chemistry" ? "Study of Compounds: Ammonia & Chemical Reactions" : `${detectedSubj} Chapter`;
      }

      addToast(`Synthesizing Visual Cheat Sheet for ${cleanTitle}... 🎨`, "info");

      // Step 2 & 3: Extract structured insights and synthesize 1-page Infographic Poster
      try {
        const infoRes = await fetch("/api/generate-concept-infographic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: cleanTitle,
            topicTitle: cleanTitle,
            subject: detectedSubj,
            grade: studentDetails.grade || "Class 10",
            board: studentDetails.board || "CBSE",
            chapter: cleanTitle,
            topics: extractedSubtopics.length > 0 ? extractedSubtopics : [cleanTitle],
            blackboardContent: extractedMarkdown
          })
        });

        if (infoRes.ok) {
          const infoData = await infoRes.json();
          if (infoData.success && infoData.data) {
            const finalData = { ...infoData.data };
            if (dataUrl && (finalMime.startsWith("image/") || file.name.match(/\.(jpg|jpeg|png|webp)$/i))) {
              finalData.originalUploadedImageUrl = dataUrl;
            }
            setCheatSheetData(finalData);
            addToast("Visual Cheat Sheet created from document! ⚡", "success");
            return;
          }
        }
      } catch (genErr) {
        console.warn("Infographic endpoint unreachable, using client synthesis:", genErr);
      }

      // Client-Side Distillation Fallback
      const fallbackUniversal = generateUniversalFallback(
        cleanTitle,
        detectedSubj,
        studentDetails.grade || "Class 10",
        extractedMarkdown || ""
      );
      const fallbackData = adaptUniversalToLegacy(fallbackUniversal);
      if (dataUrl && (finalMime.startsWith("image/") || file.name.match(/\.(jpg|jpeg|png|webp)$/i))) {
        fallbackData.originalUploadedImageUrl = dataUrl;
      }
      setCheatSheetData(fallbackData);
      addToast("Visual Cheat Sheet created from document! ⚡", "success");
    } catch (err: any) {
      console.error("Error processing cheat sheet upload:", err);
      // Final resilient client fallback
      try {
        const fallbackUniversal = generateUniversalFallback(
          cleanTitle || "Core Concepts",
          detectedSubj,
          studentDetails.grade || "Class 10",
          extractedMarkdown || ""
        );
        const fallbackData = adaptUniversalToLegacy(fallbackUniversal);
        if (dataUrl && (finalMime.startsWith("image/") || file.name.match(/\.(jpg|jpeg|png|webp)$/i))) {
          fallbackData.originalUploadedImageUrl = dataUrl;
        }
        setCheatSheetData(fallbackData);
        addToast("Visual Cheat Sheet created! ⚡", "success");
      } catch (e) {
        addToast(err?.message || "Failed to process document for cheat sheet. Try selecting a topic directly.", "error");
      }
    } finally {
      setLoadingCheatSheet(false);
    }
  };

  const handleStartOpenBlackboard = async () => {
    setShowTopicPrompt(false);

    let currentUser = auth.currentUser || user;
    if (!currentUser) {
      try {
        const anonResult = await signInAnonymously(auth);
        currentUser = anonResult.user;
      } catch (err) {
        console.warn("Anonymous sign-in failed during direct open board, using local guest fallback:", err);
        currentUser = {
          uid: "local_guest_student",
          displayName: studentDetails.name || "Guest Student",
          isAnonymous: true,
        } as any;
        setUser(currentUser);
        localStorage.setItem("local_active_user", JSON.stringify(currentUser));
      }
    }

    const newSessionId = "session_open_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    setSessionId(newSessionId);
    setDialogueHistory([]);
    setCustomBoardContent("");
    setTopicBoardsContent({});

    // Open Blackboard blank canvas mode - no pre-locked topics, Cherry asks the student via voice!
    const openBoardDoc = {
      filename: "Open_Blackboard_Classroom.md",
      mimeType: "text/markdown",
      mode: "open_board",
      markdown: `# 🎙️ Cherry Ma'am Live 1-on-1 Classroom\n\n### 🌟 "Namaste ${studentDetails.name || "beta"}! Blackboard bilkul ready hai."\n- 🎤 **Direct Voice Mode Active**: Aapko jo bhi puchhna ya samajhna hai, seedhe mic se boliye!\n- ✍️ **Instant Chalk Notes**: Cherry Ma'am aapke bolte hi board par step-by-step likhkar samjhayengi.\n- 💡 **Ask Anything**: Koi bhi topic, formula derivation, numerical doubt, ya *'Kyun & Kaise'* sawaal puchiye!`
    };

    setActiveDocument(openBoardDoc);
    setActiveTopicIndex(0);
    setCurrentScreen("classroom");

    if (currentUser) {
      const newSessionObj = {
        sessionId: newSessionId,
        userId: currentUser.uid,
        grade: studentDetails.grade,
        subject: studentDetails.subject || "General",
        activeDocumentName: openBoardDoc.filename,
        customBoardContent: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const cachedKey = `pastSessions_${currentUser.uid}`;
      const cachedStr = localStorage.getItem(cachedKey);
      let sessions = [];
      if (cachedStr) {
        try { sessions = JSON.parse(cachedStr); } catch (_) {}
      }
      sessions = [newSessionObj, ...sessions.filter((s: any) => s.sessionId !== newSessionId)];
      safeSavePastSessions(currentUser.uid, sessions);
      setPastSessions(sessions);

      if (currentUser.uid !== "local_guest_student" && !currentUser.uid.startsWith("local_")) {
        const sessionRef = doc(db, "classSessions", newSessionId);
        setDoc(sessionRef, {
          sessionId: newSessionId,
          userId: currentUser.uid,
          grade: studentDetails.grade,
          subject: studentDetails.subject || "General",
          activeDocumentName: openBoardDoc.filename,
          customBoardContent: "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }).then(() => {
          loadPastSessions(currentUser!.uid);
        }).catch((dbErr) => {
          console.warn("Could not sync session in background:", dbErr);
        });
      }
    }
    addToast("Open Blackboard Active! Cherry Ma'am is ready to listen to your voice! 🎙️✨", "success");
  };

  const handleStartDirectStudy = async (overrideTopic?: string) => {
    const rawTitle = overrideTopic || typedTopic;
    if (!rawTitle.trim()) return;
    const topicTitle = rawTitle.trim();
    setShowTopicPrompt(false);

    let currentUser = auth.currentUser || user;
    if (!currentUser) {
      try {
        const anonResult = await signInAnonymously(auth);
        currentUser = anonResult.user;
      } catch (err) {
        console.warn("Anonymous sign-in failed during direct study, using local guest fallback:", err);
        currentUser = {
          uid: "local_guest_student",
          displayName: studentDetails.name || "Guest Student",
          isAnonymous: true,
        } as any;
        setUser(currentUser);
        localStorage.setItem("local_active_user", JSON.stringify(currentUser));
      }
    }

    // Smart Subject Auto-Detection!
    let finalSubject = studentDetails.subject || "Mathematics";
    const titleLower = topicTitle.toLowerCase();
    
    // Physics keywords
    const physicsTerms = ["force", "motion", "gravity", "gravitation", "sound", "light", "wave", "optics", "thermo", "electric", "magnet", "energy", "velocity", "acceleration", "friction", "newton", "einstein", "speed", "lens", "mirror", "heat", "current", "voltage", "resistance", "ohm", "circuit", "pressure", "work", "power", "density", "physics", "भौतिक"];
    // Chemistry keywords
    const chemistryTerms = ["chemical", "reaction", "bond", "atom", "molecule", "element", "acid", "base", "salt", "organic", "polymer", "catalyst", "electron", "proton", "neutron", "gas", "matter", "periodic", "metal", "non-metal", "carbon", "compound", "chemistry", "रसायन"];
    // Mathematics keywords
    const mathTerms = ["math", "fraction", "algebra", "calculus", "geometry", "trigonometry", "ratio", "number", "sum", "multiply", "divide", "theorem", "matrix", "vector", "percent", "probability", "statistics", "integral", "derivative", "equation", "arithmetic", "triangle", "circle", "square", "rectangle", "polygon", "graph", "coordinate", "angle", "division", "multiplication", "addition", "subtraction", "decimal", "integer", "rational", "irrational", "set theory", "function", "quadrilat", "polynomial", "quadratic", "linear", "ap", "arithmetic progression", "gp", "geometric progression", "logarithm", "sine", "cosine", "tangent", "secant", "cosecant", "cotangent", "derivative", "differentiation", "integration", "mathematics", "गणित"];
    // Biology / Science keywords
    const scienceTerms = ["science", "cell", "plant", "animal", "human", "digestion", "evolution", "organism", "biology", "photosynthesis", "respiration", "reproduction", "heredity", "tissue", "disease", "health", "ecology", "environment", "neuron", "brain", "heart", "kidney", "lung", "blood", "gene", "chromosome", "dna", "rna", "virus", "bacteria", "fungus", "nutrition", "hormone", "enzyme", "ecosystem", "science", "विज्ञान"];

    let detectedSubject = null;
    if (physicsTerms.some(term => titleLower.includes(term))) {
      detectedSubject = "Physics";
    } else if (chemistryTerms.some(term => titleLower.includes(term))) {
      detectedSubject = "Chemistry";
    } else if (mathTerms.some(term => titleLower.includes(term))) {
      detectedSubject = "Mathematics";
    } else if (scienceTerms.some(term => titleLower.includes(term))) {
      detectedSubject = "All Science";
    }

    if (detectedSubject && detectedSubject !== studentDetails.subject) {
      finalSubject = detectedSubject;
      setStudentDetails((prev: any) => ({ ...prev, subject: detectedSubject }));
      addToast(`Aha! Identified "${topicTitle}" as a ${detectedSubject} topic. Automatically matching your subject selection! ✨`, "info");
      
      if (currentUser && !currentUser.isAnonymous) {
        const profileRef = doc(db, "studentProfiles", currentUser.uid);
        setDoc(profileRef, { subject: detectedSubject }, { merge: true })
          .catch((e) => console.warn("Could not sync subject:", e));
      }
    }

    const newSessionId = "session_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    setSessionId(newSessionId);
    setDialogueHistory([]);
    setCustomBoardContent("");
    setTopicBoardsContent({});

    // Create a beautifully structured custom syllabus markdown for the typed topic so Cherry lectures on it perfectly!
    const syntheticDoc = {
      filename: `${topicTitle}.md`,
      mimeType: "text/markdown",
      markdown: `# 1. Introduction to ${topicTitle}\nWelcome! Let's build a rock-solid foundation for "${topicTitle}". In this introductory slide, we'll discover the primary core essence, significance, and fundamental roadmap of our topic. Let's make learning super engaging!\n\n# 2. Core Concepts & Definitions of ${topicTitle}\nLet's look at the key concepts, core formulas, essential rules, and definitions of "${topicTitle}". Please note down these formulas and definitions carefully on your blackboard!\n\n# 3. Practical Example & Solved Problems\nLet's solve a real-world numerical or conceptual problem step-by-step to see "${topicTitle}" in action. This will help us master the practical applications!\n\n# 4. Interactive Quiz & Doubts Session\nIt's time to test your understanding! Let's clear any doubts and make sure you have understood "${topicTitle}" completely. Ask any questions you have!`
    };
    setActiveDocument(syntheticDoc);
    setActiveTopicIndex(0);
    setCurrentScreen("classroom");

    if (currentUser) {
      const newSessionObj = {
        sessionId: newSessionId,
        userId: currentUser.uid,
        grade: studentDetails.grade,
        subject: finalSubject,
        activeDocumentName: syntheticDoc.filename,
        customBoardContent: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const cachedKey = `pastSessions_${currentUser.uid}`;
      const cachedStr = localStorage.getItem(cachedKey);
      let sessions = [];
      if (cachedStr) {
        try { sessions = JSON.parse(cachedStr); } catch (_) {}
      }
      sessions = [newSessionObj, ...sessions.filter((s: any) => s.sessionId !== newSessionId)];
      safeSavePastSessions(currentUser.uid, sessions);
      setPastSessions(sessions);

      if (currentUser.uid !== "local_guest_student" && !currentUser.uid.startsWith("local_")) {
        const sessionRef = doc(db, "classSessions", newSessionId);
        setDoc(sessionRef, {
          sessionId: newSessionId,
          userId: currentUser.uid,
          grade: studentDetails.grade,
          subject: finalSubject,
          activeDocumentName: syntheticDoc.filename,
          customBoardContent: "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }).then(() => {
          loadPastSessions(currentUser!.uid);
        }).catch((dbErr) => {
          console.warn("Could not sync session in background:", dbErr);
        });
      }
    }
    addToast(`Starting Blackboard Lecture on: ${topicTitle}! 🖊️🎨`, "success");
  };

  // Load past sessions locally as fallback if needed
  useEffect(() => {
    if (user && user.uid) {
      loadPastSessions(user.uid);
    }
  }, [user, loadPastSessions]);

  return (
    <div className="flex-1 flex flex-col justify-between z-10 w-full select-none bg-[#F8FAFC] overflow-hidden max-h-[100dvh] font-sans text-slate-800 antialiased" id="premium-study-desk-root">
      
      {/* =========================================
          PREMIUM APP HEADER BAR (Uniform 52px Native Header)
          ========================================= */}
      <div className="w-full h-[52px] min-h-[52px] max-h-[52px] px-3.5 sm:px-5 flex items-center justify-between shrink-0 border-b border-slate-200/80 bg-white shadow-2xs z-20">
        <button
          type="button"
          onClick={() => setCurrentScreen("home")}
          className="flex items-center gap-2 text-left group cursor-pointer transition-all active:scale-95"
          title="Home / Welcome Screen"
          id="desk-home-splash-btn"
        >
          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 text-[#796AEF] flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-indigo-200 transition-all shrink-0">
            <span className="text-base leading-none">🍒</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-sans font-extrabold uppercase tracking-wide text-slate-900">
              Study Desk
            </span>
            <Home className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#796AEF] transition-colors" />
          </div>
        </button>

        {/* Compact Native Profile Pill */}
        <button
          type="button"
          onClick={() => setShowStudentAccountHub(true)}
          className="flex items-center gap-1.5 p-1 pr-2.5 bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-indigo-200 rounded-full cursor-pointer active:scale-95 transition-all shadow-xs text-left"
          title="Open Student Profile & Hub"
          id="profile-passport-trigger"
        >
          <div className="w-7 h-7 rounded-full bg-[#796AEF] text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
            {studentDetails.name ? studentDetails.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
          </div>
          {studentDetails.name && (
            <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[90px] truncate leading-none">
              {studentDetails.name.split(" ")[0]}
            </span>
          )}
          <span className="text-[10px] bg-indigo-50 text-[#796AEF] px-2 py-0.5 rounded-full font-bold border border-indigo-100/80 shrink-0">
            {studentDetails.grade || "Class 10"}
          </span>
        </button>
      </div>

      {/* =========================================
          MAIN WORKSPACE LAYOUT (Scrollable Page Body)
          ========================================= */}
      <div className="space-y-3.5 flex-1 flex flex-col justify-start overflow-y-auto px-3.5 py-3 md:px-6 pr-0.5 pb-24 sm:pb-8">
        
        {/* PREMIUM VISUAL PASSPORT / WELCOME BANNER */}
        <div className="bg-white text-slate-900 p-4 sm:p-5 rounded-2xl sm:rounded-3xl text-left relative overflow-hidden shadow-xs shrink-0 border border-slate-200/90">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-50/70 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-start relative z-10 gap-3">
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1.5 text-[9px] bg-indigo-50 text-[#796AEF] border border-indigo-100/80 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-sans">
                <Sparkles className="w-3 h-3 text-[#796AEF]" /> Active Study Room
              </span>
              <h3 className="text-base sm:text-lg font-extrabold mt-1.5 tracking-tight leading-snug text-slate-900">
                Namaste, {studentDetails.name || "Student"}! 👋
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-normal max-w-sm">
                Welcome to your interactive study room! Choose a subject, upload homework notes or start a direct class below.
              </p>
            </div>
            
            {/* Animated Learning Streak Card */}
            <div className="flex flex-col items-center bg-gradient-to-b from-amber-50 to-amber-100/30 border border-amber-200/80 rounded-2xl p-2 px-2.5 shrink-0 shadow-xs">
              <Flame className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
              <span className="text-[10.5px] font-black mt-0.5 text-amber-950">1 Day</span>
              <span className="text-[7px] font-sans text-amber-700 uppercase font-bold tracking-wider leading-none">Streak</span>
            </div>
          </div>
          
          {/* Quick learning passport details */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between relative z-10 text-[9.5px] font-sans flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/70 flex items-center gap-1 font-bold text-slate-800">
                <GraduationCap className="w-3.5 h-3.5 text-[#796AEF]" /> {studentDetails.grade}
              </span>
              <span className="bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/70 flex items-center gap-1 font-bold text-slate-800">
                <BookOpen className="w-3.5 h-3.5 text-[#796AEF]" /> {studentDetails.subject}
              </span>
            </div>
            
            <span className="text-[#796AEF] font-bold uppercase tracking-widest text-[8.5px] flex items-center gap-1.5 bg-indigo-50/60 px-2 py-0.5 rounded-lg border border-indigo-100/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#796AEF] animate-pulse" /> System Live
            </span>
          </div>
        </div>

        {/* =========================================
            STEP 1: CHOOSE SUBJECT (BENTO GRID DESIGN)
            ========================================= */}
        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 shadow-xs text-left space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-sans font-bold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#796AEF]" /> {t.deskSelectSubject}
            </h4>
            <span className="text-[8.5px] bg-indigo-50 text-[#796AEF] font-sans font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-indigo-100">Step 1 of 2</span>
          </div>

          {/* Personalized Curriculum Header Indicator Badge */}
          <div className="flex items-center justify-between bg-slate-50/80 border border-slate-200/80 rounded-xl px-3 py-1.5 text-[10px] text-slate-800">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[8.5px] font-bold bg-white text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200/80 font-sans uppercase shadow-2xs">
                🏛️ {studentDetails.board || "CBSE"}
              </span>
              <span className="text-[8.5px] font-bold bg-white text-[#796AEF] px-2 py-0.5 rounded-lg border border-slate-200/80 font-sans shadow-2xs">
                🎓 {studentDetails.grade || "Class 10"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowStudentAccountHub(true)}
              className="text-[9.5px] font-bold text-[#796AEF] hover:text-[#6858e0] hover:underline transition-all font-sans shrink-0 cursor-pointer flex items-center gap-1"
            >
              <span>{t.btnChangeProfile}</span>
              <span>✏️</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {(() => {
              const isSeniorSecondary = 
                studentDetails.grade === "Class 11" || 
                studentDetails.grade === "Class 12" || 
                studentDetails.grade === "JEE/NEET Prep" || 
                studentDetails.grade === "College Level";

              const isMiddleSchool = 
                studentDetails.grade === "Class 6" || 
                studentDetails.grade === "Class 7" || 
                studentDetails.grade === "Class 8";

              const curBoard = studentDetails.board || "CBSE";

              // Dynamic curriculum-aligned subject listing
              let defaultSubjects: string[] = [];

              if (isSeniorSecondary) {
                // Class 11, 12, JEE/NEET, College Level
                if (curBoard === "ICSE" || curBoard === "ISC") {
                  defaultSubjects = ["Physics", "Chemistry", "Biology", "Mathematics", "Computer Science", "English"];
                } else if (curBoard === "CBSE") {
                  defaultSubjects = ["Physics", "Chemistry", "Biology", "Mathematics", "Computer Science", "Economics", "English"];
                } else {
                  defaultSubjects = ["Physics", "Chemistry", "Biology", "Mathematics", "Computer Science", "English"];
                }
              } else if (isMiddleSchool) {
                if (curBoard === "ICSE") {
                  defaultSubjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Applications", "English"];
                } else if (curBoard === "CBSE") {
                  defaultSubjects = ["Mathematics", "All Science", "Social Science", "Environmental Studies", "English"];
                } else {
                  defaultSubjects = ["Mathematics", "All Science", "Social Science", "English"];
                }
              } else {
                if (curBoard === "ICSE") {
                  defaultSubjects = ["Physics", "Chemistry", "Biology", "Mathematics", "Computer Applications", "English"];
                } else if (curBoard === "CBSE") {
                  defaultSubjects = ["Mathematics", "All Science", "Physics", "Chemistry", "Biology", "Social Science", "English"];
                } else {
                  defaultSubjects = ["Mathematics", "All Science", "Social Science", "English"];
                }
              }

              const dynamicSubjects四周 = [...defaultSubjects];
              const detected = activeDocument?.detectedSubject;
              if (detected && !dynamicSubjects四周.includes(detected)) {
                dynamicSubjects四周.push(detected);
              }
              if (studentDetails.subject && !dynamicSubjects四周.includes(studentDetails.subject)) {
                dynamicSubjects四周.push(studentDetails.subject);
              }
              
              return dynamicSubjects四周.map((subj) => {
                let translation = "विशेष विषय";
                let subjectIcon不易 = "📚";
  
                if (subj === "Mathematics") {
                  translation = "गणित (📐)";
                  subjectIcon不易 = "📐";
                } else if (subj === "Physics") {
                  translation = "भौतिकी (⚛️)";
                  subjectIcon不易 = "⚛️";
                } else if (subj === "Chemistry") {
                  translation = "रसायन (🧪)";
                  subjectIcon不易 = "🧪";
                } else if (subj === "Biology") {
                  translation = "जीव विज्ञान (🌿)";
                  subjectIcon不易 = "🌿";
                } else if (subj === "All Science") {
                  translation = "विज्ञान (🔬)";
                  subjectIcon不易 = "🔬";
                } else if (subj === "Computer Science" || subj === "Computer Applications") {
                  translation = "कंप्यूटर (💻)";
                  subjectIcon不易 = "💻";
                } else if (subj === "Economics") {
                  translation = "अर्थशास्त्र (📊)";
                  subjectIcon不易 = "📊";
                } else if (subj === "Social Science") {
                  translation = "सामाजिक विज्ञान (🌍)";
                  subjectIcon不易 = "🌍";
                } else if (subj === "Environmental Studies") {
                  translation = "पर्यावरण अध्ययन (🌱)";
                  subjectIcon不易 = "🌱";
                } else if (subj === "English") {
                  translation = "अंग्रेजी (📝)";
                  subjectIcon不易 = "📝";
                }

                const isAutoDetected = !defaultSubjects.includes(subj);
                const isActive = studentDetails.subject === subj;

                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={async () => {
                      setStudentDetails((prev: any) => ({ ...prev, subject: subj }));
                      const currentUser = auth.currentUser;
                      if (currentUser && !currentUser.isAnonymous) {
                        const profileRef置 = doc(db, "studentProfiles", currentUser.uid);
                        setDoc(profileRef置, { subject: subj }, { merge: true })
                          .catch((e) => console.warn("Could not sync subject:", e));
                      }
                      addToast(`Subject set to ${subj}! 📚`, "success");
                    }}
                    className={`p-3 border rounded-2xl transition-all duration-200 font-bold cursor-pointer flex items-center gap-2.5 text-left leading-tight active:scale-[0.98] group relative overflow-hidden ${
                      isActive 
                        ? "bg-[#796AEF] text-white border-[#796AEF] shadow-xs ring-2 ring-[#796AEF]/25 ring-offset-1" 
                        : "bg-slate-50/70 border-slate-200/80 text-slate-900 hover:bg-white hover:border-indigo-200 hover:shadow-xs"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? "bg-white/20 text-white" : "bg-white border border-slate-200/80 text-slate-800 shadow-3xs"
                    }`}>
                      {subjectIcon不易}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[11px] font-bold truncate flex items-center gap-1 leading-tight ${isActive ? "text-white" : "text-slate-900"}`}>
                        {subj}
                        {isAutoDetected && (
                          <Sparkles className="w-2.5 h-2.5 text-[#796AEF] animate-pulse" />
                        )}
                      </p>
                      <p className={`text-[8.5px] font-sans mt-0.5 leading-tight truncate ${isActive ? "text-white/85" : "text-slate-500 font-medium"}`}>
                        {translation}
                      </p>
                    </div>
                    {isActive && (
                      <div className="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center shrink-0 text-white text-[8px] font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                );
              });
            })()}
          </div>
        </div>

        {/* =========================================
            STEP 2: CHOOSE LEARNING MODE
            ========================================= */}
        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-xs text-left space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <h4 className="text-[11px] font-sans font-bold uppercase text-slate-800 tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#796AEF]" /> Choose Learning Mode
            </h4>
            <span className="text-[8.5px] bg-indigo-50 text-[#796AEF] font-sans font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-indigo-100">Step 2 of 2</span>
          </div>

          {/* Horizontally Scrollable Modern Learning Mode Pill Grid */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 overflow-x-auto scrollbar-none scroll-smooth">
            <button
              type="button"
              onClick={() => {
                setUploadMode("guide");
                addToast("Mode set: Problem Guide (गाइड)! 🧭", "info");
              }}
              className={`shrink-0 py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-center select-none whitespace-nowrap active:scale-95 ${
                uploadMode === "guide" || uploadMode === "socratic"
                  ? "bg-[#796AEF] text-white shadow-xs font-bold ring-2 ring-[#796AEF]/20"
                  : "bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:border-indigo-200 font-semibold"
              }`}
            >
              <span className="text-sm">🧭</span>
              <span className="text-xs font-bold tracking-tight">Guide (गाइड)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUploadMode("explain");
                addToast("Mode set: Concept Explainer Teaching! 📖", "info");
              }}
              className={`shrink-0 py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-center select-none whitespace-nowrap active:scale-95 ${
                uploadMode === "explain"
                  ? "bg-[#796AEF] text-white shadow-xs font-bold ring-2 ring-[#796AEF]/20"
                  : "bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:border-indigo-200 font-semibold"
              }`}
            >
              <span className="text-sm">📖</span>
              <span className="text-xs font-bold tracking-tight">Explainer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUploadMode("mistake");
                addToast("Mode set: Find & Explain My Mistake! 🔍", "info");
              }}
              className={`shrink-0 py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-center select-none whitespace-nowrap active:scale-95 ${
                uploadMode === "mistake"
                  ? "bg-[#796AEF] text-white shadow-xs font-bold ring-2 ring-[#796AEF]/20"
                  : "bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:border-indigo-200 font-semibold"
              }`}
            >
              <span className="text-sm">🔍</span>
              <span className="text-xs font-bold tracking-tight">Find Mistake</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUploadMode("doubt");
                addToast("Mode set: Dedicated Doubt Solver! 💡", "info");
              }}
              className={`shrink-0 py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-center select-none whitespace-nowrap active:scale-95 ${
                uploadMode === "doubt"
                  ? "bg-[#796AEF] text-white shadow-xs font-bold ring-2 ring-[#796AEF]/20"
                  : "bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:border-indigo-200 font-semibold"
              }`}
            >
              <span className="text-sm">💡</span>
              <span className="text-xs font-bold tracking-tight">Doubt Solver</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUploadMode("homework");
                addToast("Mode set: Home Work Maker! 📝", "info");
              }}
              className={`shrink-0 py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-center select-none whitespace-nowrap active:scale-95 ${
                uploadMode === "homework"
                  ? "bg-[#796AEF] text-white shadow-xs font-bold ring-2 ring-[#796AEF]/20"
                  : "bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:border-indigo-200 font-semibold"
              }`}
            >
              <span className="text-sm">📝</span>
              <span className="text-xs font-bold tracking-tight">HW Maker</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUploadMode("cheatsheet");
                addToast("Mode set: Visual Cheat Sheet (इन्फोग्राफिक)! ⚡", "info");
              }}
              className={`shrink-0 py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-center select-none whitespace-nowrap active:scale-95 ${
                uploadMode === "cheatsheet"
                  ? "bg-[#796AEF] text-white shadow-xs font-bold ring-2 ring-[#796AEF]/20"
                  : "bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:border-indigo-200 font-semibold"
              }`}
            >
              <span className="text-sm">⚡</span>
              <span className="text-xs font-bold tracking-tight">Cheat Sheet</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUploadMode("podcast");
                addToast("Mode set: Audio Overview (NotebookLM Podcast)! 🎙️", "info");
              }}
              className={`shrink-0 py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-center select-none whitespace-nowrap active:scale-95 ${
                uploadMode === "podcast"
                  ? "bg-[#796AEF] text-white shadow-xs font-bold ring-2 ring-[#796AEF]/20"
                  : "bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:border-indigo-200 font-semibold"
              }`}
            >
              <span className="text-sm">🎙️</span>
              <span className="text-xs font-bold tracking-tight">Audio Overview</span>
            </button>

            {isPYQEligible && (
              <button
                type="button"
                onClick={() => {
                  setUploadMode("pyq");
                  addToast("Mode set: 10-Year PYQ & Board Exam Intelligence! 📄", "info");
                }}
                className={`shrink-0 py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-center select-none whitespace-nowrap active:scale-95 ${
                  uploadMode === "pyq"
                    ? "bg-[#796AEF] text-white shadow-xs font-bold ring-2 ring-[#796AEF]/20"
                    : "bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:border-indigo-200 font-semibold"
                }`}
              >
                <span className="text-sm">📄</span>
                <span className="text-xs font-bold tracking-tight">PYQ Intel</span>
              </button>
            )}
          </div>

          {/* Clean Multiline Description Card */}
          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/70 text-[11px] text-slate-600 leading-relaxed">
            {uploadMode === "guide" || uploadMode === "socratic" ? (
              <p><strong className="text-slate-900">Problem Guide (गाइड):</strong> Step-by-step deconstruction & Socratic micro-hints for numericals.</p>
            ) : uploadMode === "explain" ? (
              <p><strong className="text-slate-900">Explainer Mode:</strong> Structured chapter concepts on blackboard with formulas & diagrams.</p>
            ) : uploadMode === "mistake" ? (
              <p><strong className="text-slate-900">Find Mistake:</strong> Scans notebook page, isolates calculation slips, and demonstrates correction.</p>
            ) : uploadMode === "doubt" ? (
              <p><strong className="text-slate-900">Doubt Solver:</strong> Upload difficult questions or exam doubts to resolve on chalkboard.</p>
            ) : uploadMode === "homework" ? (
              <p><strong className="text-slate-900">Home Work Maker:</strong> Instant notebook-ready step-by-step solutions formatted for your copy.</p>
            ) : uploadMode === "cheatsheet" ? (
              <p><strong className="text-[#796AEF]">Visual Cheat Sheet:</strong> Upload chapter PDF or notes to generate a 1-page high-yield visual infographic poster.</p>
            ) : uploadMode === "podcast" ? (
              <p><strong className="text-[#796AEF] font-bold">Audio Overview (पॉडकास्ट):</strong> Add source (PDF, notes, or topic) to generate a NotebookLM-style 2-host dual-voice deep dive audio conversation.</p>
            ) : uploadMode === "pyq" && isPYQEligible ? (
              <p><strong className="text-[#796AEF] font-bold">10-Year PYQ Intelligence:</strong> Upload your Question Paper PDF to analyze recurrence patterns, weightage heatmaps & 2026 predicted papers.</p>
            ) : (
              <p><strong className="text-slate-900">Explainer Mode:</strong> Structured chapter concepts on blackboard with formulas & diagrams.</p>
            )}
          </div>
        </div>

        {/* =========================================
            CONTENT SOURCE CONTAINER (PROBLEM GUIDE CHAT, HOMEWORK MAKER, CHEAT SHEET STUDIO, OR UPLOAD/YOUTUBE DECK)
            ========================================= */}
        {uploadMode === "guide" || uploadMode === "socratic" ? (
          <div className="bg-white border border-slate-200/80 rounded-[28px] p-0 shadow-md text-left h-[calc(100vh-140px)] min-h-[580px] max-h-[920px] flex flex-col overflow-hidden">
            <ProblemGuideChat
              studentName={studentDetails.name}
              grade={studentDetails.grade}
              subject={studentDetails.subject}
              board={studentDetails.board}
              mediumOfLearning={studentDetails.mediumOfLearning}
              addToast={addToast}
              onClose={() => {
                setUploadMode("explain");
                addToast("Exited Problem Guide", "info");
              }}
            />
          </div>
        ) : uploadMode === "homework" ? (
          <div className="bg-white border border-slate-200/80 rounded-[28px] p-0 shadow-md text-left h-[calc(100vh-140px)] min-h-[580px] max-h-[920px] flex flex-col overflow-hidden">
            <HomeworkMaker
              studentName={studentDetails.name}
              grade={studentDetails.grade}
              subject={studentDetails.subject}
              board={studentDetails.board}
              mediumOfLearning={studentDetails.mediumOfLearning}
              addToast={addToast}
              onClose={() => {
                setUploadMode("explain");
                addToast("Exited Home Work Maker", "info");
              }}
            />
          </div>
        ) : uploadMode === "cheatsheet" ? (
          <div className="bg-white border border-[#EFF1F5] rounded-[24px] p-4 sm:p-5 shadow-xs text-left space-y-4">
            {/* Studio Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFF1F5] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#796AEF]" />
                <h4 className="text-xs sm:text-sm font-sans font-bold uppercase text-[#1E293B] tracking-wider flex items-center gap-2">
                  <span>⚡ Visual Cheat Sheet Studio</span>
                  <span className="text-[9px] bg-[#F6F7FB] text-[#796AEF] font-bold px-2 py-0.5 rounded-full tracking-normal capitalize font-sans border border-[#EFF1F5]">
                    1-Page Infographic Poster
                  </span>
                </h4>
              </div>
              {cheatSheetData && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const topicName = cheatSheetData.mainTitle || cheatSheetData.header?.chapter || "Chapter Concept";
                      setUploadMode("explain");
                      handleStartDirectStudy(topicName);
                    }}
                    className="px-3 py-1.5 bg-[#796AEF] hover:bg-[#6858e0] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Start Live Lecture</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheatSheetData(null)}
                    className="px-3 py-1.5 bg-[#F6F7FB] hover:bg-slate-100 text-[#1E293B] border border-[#EFF1F5] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>New Poster</span>
                  </button>
                </div>
              )}
            </div>

            {loadingCheatSheet ? (
              <div className="py-14 px-6 flex flex-col items-center justify-center text-center space-y-4 bg-[#F6F7FB] rounded-3xl border border-[#EFF1F5]">
                <div className="relative">
                  <div className="w-14 h-14 border-4 border-[#EFF1F5] border-t-[#796AEF] rounded-full animate-spin"></div>
                  <Sparkles className="w-6 h-6 text-[#796AEF] absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#1E293B] font-sans tracking-tight">
                    Synthesizing 1-Page Visual Cheat Sheet...
                  </h4>
                  <p className="text-xs text-[#4A4E5A] max-w-md font-normal">
                    Analyzing chapter laws, defining formulas, key takeaways & structured illustrations.
                  </p>
                </div>
              </div>
            ) : cheatSheetData ? (
              <div className="space-y-3">
                <ConceptInfographicPoster
                  data={cheatSheetData}
                  onRegenerate={() => handleGenerateCheatSheet(cheatSheetData.mainTitle)}
                  onClose={() => {
                    setCheatSheetData(null);
                    addToast("Exited Visual Cheat Sheet Poster", "info");
                  }}
                  onStartLecture={(topicName) => {
                    setCheatSheetData(null);
                    setUploadMode("explain");
                    handleStartDirectStudy(topicName);
                  }}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* PDF / Document Upload Area */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleCheatSheetFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => document.getElementById("file-cheatsheet-upload")?.click()}
                  className="border-2 border-dashed border-[#EFF1F5] hover:border-[#796AEF] bg-[#F6F7FB] hover:bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-3 transition-all duration-300 cursor-pointer group min-h-[140px] active:scale-[0.99] relative shadow-xs"
                >
                  <input
                    type="file"
                    id="file-cheatsheet-upload"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleCheatSheetFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="p-3.5 rounded-2xl bg-white border border-[#EFF1F5] group-hover:scale-105 transition-transform shadow-xs text-[#796AEF]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-bold text-[#1E293B]">
                      📄 Upload Chapter PDF or Notes ➔ Generate Instant Infographic
                    </p>
                    <p className="text-[10px] sm:text-xs text-[#4A4E5A] max-w-sm mx-auto font-normal">
                      Drag & drop your chapter PDF, book photo, or notes here. AI extracts core formulas, laws & visuals!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : uploadMode === "podcast" ? (
          <div className="py-10 text-center space-y-3 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#796AEF] mx-auto animate-pulse">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Audio Overview Studio</h4>
              <p className="text-xs text-slate-500 mt-0.5">The full screen studio page is active.</p>
            </div>
            <button
              type="button"
              onClick={() => setUploadMode("explain")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Explainer</span>
            </button>
          </div>
        ) : uploadMode === "pyq" && isPYQEligible ? (
          <>
            <PYQUploadStudio
              studentDetails={{
                name: studentDetails.name,
                grade: studentDetails.grade,
                subject: studentDetails.subject,
                board: studentDetails.board || "CBSE",
              }}
              uploadedPYQName={uploadedPYQName}
              isUploading={isUploadingPYQ}
              onUploadFile={handlePYQFileUpload}
              addToast={addToast}
            />

            {showPYQReportsHub && (
              <PYQReportsHub
                studentDetails={{
                  name: studentDetails.name,
                  grade: studentDetails.grade,
                  subject: studentDetails.subject,
                  board: studentDetails.board || "CBSE",
                }}
                uploadedPYQName={uploadedPYQName}
                onBackToDesk={() => setShowPYQReportsHub(false)}
                onOpenReport1_8020={handleOpenPYQ8020}
                onOpenReport2_Heatmap={handleOpenHeatmap}
                onOpenReport3_PredictedPaper={handleOpenPredictedPaper}
                onUploadNewPaper={() => {
                  setShowPYQReportsHub(false);
                  pyqFileInputRef.current?.click();
                }}
                onResetToNationalDB={handleClearUploadedPYQ}
                loading8020={loadingPYQ8020}
                loadingHeatmap={loadingHeatmap}
                loadingPredictedPaper={loadingPredictedPaper}
                pyq8020Report={pyq8020Report}
                heatmapReport={heatmapReport}
                predictedPaperReport={predictedPaperReport}
              />
            )}
          </>
        ) : (
          <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 shadow-xs text-left space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <h4 className="text-xs font-sans font-bold uppercase text-slate-800 tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#796AEF]" />
                <span>Upload Content</span>
              </h4>

              {uploadMode === "explain" && (
                <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200/80 shadow-2xs gap-1">
                  <button
                    type="button"
                    onClick={() => setContentTab("upload")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                      contentTab === "upload"
                        ? "bg-[#796AEF] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white font-semibold"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Document</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentTab("youtube")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                      contentTab === "youtube"
                        ? "bg-[#796AEF] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white font-semibold"
                    }`}
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>YouTube</span>
                  </button>
                </div>
              )}
            </div>

          {/* Tab 1: Upload Documents */}
          {(uploadMode === "mistake" || uploadMode === "doubt" || contentTab === "upload") && (
            <div className="space-y-3">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => document.getElementById("file-syllabus-upload-modern")?.click()}
                className="border-2 border-dashed border-slate-200/90 hover:border-[#796AEF] bg-slate-50/60 hover:bg-indigo-50/20 rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-3 transition-all duration-300 cursor-pointer group min-h-[150px] active:scale-[0.99] relative overflow-hidden shadow-2xs"
              >
                <input
                  type="file"
                  id="file-syllabus-upload-modern"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                
                {isUploading ? (
                  <div className="space-y-2.5 flex flex-col items-center z-10">
                    <RefreshCw className="w-6 h-6 text-[#796AEF] animate-spin" />
                    <p className="text-[11px] font-sans font-bold text-[#796AEF] uppercase tracking-wider animate-pulse leading-none">
                      Analyzing Content...
                    </p>
                    <p className="text-[9.5px] text-slate-500 leading-normal max-w-[220px] font-normal">
                      {uploadMode === "mistake"
                        ? "Scanning calculation lines and math steps..."
                        : uploadMode === "doubt"
                        ? "Extracting questions & preparing blackboard doubt solver..."
                        : "Mapping index chapters & study units..."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 group-hover:scale-105 group-hover:border-indigo-200 group-hover:shadow-sm transition-all shadow-xs text-[#796AEF]">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 z-10">
                      <p className="text-xs font-bold text-slate-800 leading-snug font-sans">
                        {uploadMode === "mistake" 
                          ? "Upload Homework / Notebook Page"
                          : uploadMode === "doubt"
                          ? "Upload Problem or Question"
                          : "Upload Course Notes or Textbook PDF"}
                      </p>
                      <p className="text-[9.5px] text-slate-500 max-w-[260px] mx-auto leading-normal font-normal">
                        Drag PDF, PNG, JPG files here or tap to browse from device (Max 25MB)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: YouTube Lecture URL */}
          {uploadMode === "explain" && contentTab === "youtube" && (
            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-3.5 space-y-3 shadow-3xs text-left animate-fade-in">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-red-600 rounded-xl text-white shrink-0 shadow-xs">
                  <Youtube className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#0a3641] uppercase tracking-wider flex items-center gap-1 leading-none">
                    Import YouTube Course Lecture
                  </p>
                  <p className="text-[8.5px] text-slate-500 font-medium leading-normal mt-1">
                    Cherry Ma'am reads the lecture, extracts sequential blackboard topics, and designs active slides!
                  </p>
                </div>
              </div>

              <div className="flex gap-1.5 items-center">
                <input
                  type="text"
                  placeholder={t.deskPasteYouTube}
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                  }}
                  disabled={isYoutubeLoading}
                  className="flex-1 text-[11px] font-mono py-2 px-3 border border-red-150 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200 bg-white rounded-xl transition-all shadow-3xs"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!youtubeUrl.trim()) {
                      addToast("Please enter a valid YouTube URL first! 🎥", "error");
                      return;
                    }
                    const vidId = extractYoutubeId(youtubeUrl);
                    if (!vidId) {
                      addToast("Could not recognize a valid YouTube Video ID! ❌", "error");
                      return;
                    }

                    const newSessionId = "session_yt_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
                    setSessionId(newSessionId);

                    setIsYoutubeLoading(true);
                    addToast("Initiating lecture content generation...", "info");
                    
                    const anim1 = setTimeout(() => addToast(`Analyzing YouTube Video...`, "info"), 1000);
                    const anim2 = setTimeout(() => addToast(`Designing customized study module...`, "info"), 2200);
                    
                    try {
                      const resYt = await fetch("/api/parse-youtube", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          youtubeUrl: youtubeUrl,
                          grade: studentDetails.grade || "Class 10",
                          board: studentDetails.board || "CBSE",
                          subject: studentDetails.subject || "Mathematics",
                          medium: studentDetails.mediumOfLearning || "Hinglish",
                          sessionId: newSessionId,
                        }),
                      });

                      clearTimeout(anim1);
                      clearTimeout(anim2);

                      if (!resYt.ok) {
                        const rawErrText = await resYt.text().catch(() => "");
                        let errorMsg = "Server could not generate curriculum";
                        if (rawErrText.trim().startsWith("{")) {
                          try {
                            const errData = JSON.parse(rawErrText);
                            errorMsg = errData.error || errorMsg;
                          } catch (_) {}
                        }
                        throw new Error(errorMsg);
                      }

                      const rawText = await resYt.text();
                      if (!rawText.trim().startsWith("{")) {
                        throw new Error("The YouTube parser received an invalid/empty response from the server.");
                      }
                      const result = JSON.parse(rawText);
                      setIsYoutubeLoading(false);
                      addToast("Success! Beautiful board curriculum generated! 🎉", "success");
                      
                      const finalSubj = result.detectedSubject || studentDetails.subject;
                      setStudentDetails((prev: any) => ({ ...prev, subject: finalSubj }));

                      disconnect();
                      setDialogueHistory([]);
                      setUploadedButWaitingWakeup(true);

                      const activeDocObj = {
                        filename: result.filename,
                        mimeType: "video/youtube",
                        markdown: result.markdown,
                        mode: "explain",
                        detectedSubject: result.detectedSubject,
                      };

                      setActiveDocument(activeDocObj);
                      setActiveTopicIndex(0);
                      
                      // Explicitly push active document to server session to guarantee sync
                      fetch("/api/active-document", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          sessionId: newSessionId,
                          activeDocument: activeDocObj
                        })
                      }).catch((e) => console.warn("Failed to sync YouTube active doc:", e));

                      // Capture in Universal Active Learning Store for instant Mind Map generation
                      saveActiveLearningContext({
                        sourceMode: "explainer_youtube",
                        title: result.filename || "YouTube Video Lecture",
                        subject: finalSubj,
                        grade: studentDetails.grade,
                        board: studentDetails.board,
                        mediumOfLearning: studentDetails.mediumOfLearning,
                        documentMarkdown: result.markdown || "",
                        blackboardContent: "",
                        sessionId: newSessionId,
                        metadata: {
                          mimeType: "video/youtube",
                          detectedSubject: result.detectedSubject
                        }
                      });

                      setCurrentScreen("classroom");
                      
                      const syncYTSession = async () => {
                        let currentUser = auth.currentUser || user;
                        if (!currentUser) {
                          try {
                            const anonResult = await signInAnonymously(auth);
                            currentUser = anonResult.user;
                          } catch (err) {
                            console.warn("Anonymous login failed during YouTube sync, using guest fallback:", err);
                            currentUser = {
                              uid: "local_guest_student",
                              displayName: studentDetails.name || "Guest Student",
                              isAnonymous: true,
                            } as any;
                            setUser(currentUser);
                            localStorage.setItem("local_active_user", JSON.stringify(currentUser));
                          }
                        }
                        
                        if (currentUser) {
                          const newSessionObj = {
                            sessionId: newSessionId,
                            userId: currentUser.uid,
                            grade: studentDetails.grade,
                            subject: finalSubj,
                            activeDocumentName: result.filename,
                            activeDocumentMarkdown: result.markdown || "",
                            documentMarkdown: result.markdown || "",
                            sourceMode: "explainer_youtube",
                            customBoardContent: "",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                          };

                          const cachedKey = `pastSessions_${currentUser.uid}`;
                          const cachedStr = localStorage.getItem(cachedKey);
                          let sessions = [];
                          if (cachedStr) {
                            try { sessions = JSON.parse(cachedStr); } catch (_) {}
                          }
                          sessions = [newSessionObj, ...sessions.filter((s: any) => s.sessionId !== newSessionId)];
                          safeSavePastSessions(currentUser.uid, sessions);
                          setPastSessions(sessions);

                          if (currentUser.uid !== "local_guest_student" && !currentUser.uid.startsWith("local_")) {
                            const profileRef = doc(db, "studentProfiles", currentUser.uid);
                            setDoc(profileRef, { subject: finalSubj, updatedAt: serverTimestamp() }, { merge: true })
                              .catch(err => console.warn("Could not sync subject:", err));

                            const sessionRef = doc(db, "classSessions", newSessionId);
                            setDoc(sessionRef, {
                              sessionId: newSessionId,
                              userId: currentUser.uid,
                              grade: studentDetails.grade,
                              subject: finalSubj,
                              activeDocumentName: result.filename,
                              activeDocumentMarkdown: result.markdown || "",
                              documentMarkdown: result.markdown || "",
                              sourceMode: "explainer_youtube",
                              customBoardContent: "",
                              createdAt: serverTimestamp(),
                              updatedAt: serverTimestamp()
                            }).then(() => {
                              loadPastSessions(currentUser!.uid);
                            }).catch(() => {});
                          }
                        }
                      };
                      syncYTSession();
                    } catch (ytErr: any) {
                      clearTimeout(anim1);
                      clearTimeout(anim2);
                      setIsYoutubeLoading(false);
                      console.error("[YouTube Parser UI] Error:", ytErr);
                      addToast(`Failed to parse: ${ytErr.message || "Unknown error"}`, "error");
                    }
                  }}
                  disabled={isYoutubeLoading || !youtubeUrl.trim() || !extractYoutubeId(youtubeUrl)}
                  className={`px-4 py-2 rounded-xl border flex items-center justify-center gap-1 transition-all active:scale-95 duration-200 text-[10px] font-black shrink-0 uppercase tracking-wider ${
                    extractYoutubeId(youtubeUrl) && !isYoutubeLoading
                      ? "bg-red-600 hover:bg-red-700 text-white border-red-700 shadow-sm cursor-pointer"
                      : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  }`}
                >
                  {isYoutubeLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Video className="w-3.5 h-3.5" />
                  )}
                  <span>{t.deskImportYT}</span>
                </button>
              </div>

              {youtubeUrl.trim() && extractYoutubeId(youtubeUrl) && (
                <div className="border border-red-100 bg-white rounded-xl p-2.5 flex items-center gap-2.5 shadow-3xs animate-fade-in">
                  <div className="relative w-16 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center shadow-xs">
                    <img
                      src={`https://img.youtube.com/vi/${extractYoutubeId(youtubeUrl)}/hqdefault.jpg`}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0 flex-1 leading-none">
                    <p className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-0.5 tracking-wide">
                      <CheckCircle className="w-3 h-3 text-emerald-500" /> {t.deskYTConnected}
                    </p>
                    <p className="text-[8.5px] text-slate-400 font-mono truncate mt-1">
                      ID: {extractYoutubeId(youtubeUrl)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        )}



        {/* =========================================
            DIRECT BLACKBOARD STUDY LAUNCHER
            ========================================= */}
        {uploadMode !== "homework" && uploadMode !== "guide" && uploadMode !== "cheatsheet" && uploadMode !== "podcast" && (
          <button
            type="button"
            onClick={() => {
              setTypedTopic("");
              setDirectStudySubMode("choose");
              setShowTopicPrompt(true);
            }}
            className="w-full py-4 px-5 rounded-2xl bg-[#796AEF] hover:bg-[#6858e0] text-white flex items-center justify-between transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] group"
            id="direct-study-launch-btn"
          >
            <div className="flex items-center space-x-2.5 text-left">
              <span className="text-base">🎨</span>
              <div>
                <p className="text-xs font-black uppercase tracking-wider leading-none">
                  Direct Study: Live Blackboard
                </p>
                <p className="text-[10px] text-white/80 font-normal leading-tight mt-0.5">
                  Pick chapter topic or type custom topic to start class
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </button>
        )}
      </div>



      {/* =========================================
          DIRECT STUDY MODE SELECTION & TOPIC PROMPT MODAL
          ========================================= */}
      {showTopicPrompt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] border border-[#EFF1F5] shadow-xl w-full max-w-md overflow-hidden animate-scale-up text-left">
            {/* Header */}
            <div className="bg-[#796AEF] px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <h3 className="text-xs font-bold tracking-wider uppercase font-sans">
                  {directStudySubMode === "type" ? t.deskTopicInputTitle : t.deskTopicModalTitle}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setShowTopicPrompt(false);
                  setDirectStudySubMode("choose");
                }} 
                className="text-white/80 hover:text-white hover:scale-110 transition-all text-sm font-bold cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {directStudySubMode === "choose" ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-sans text-[#796AEF] font-bold uppercase tracking-wider">
                      {t.deskTopicModalTitle}
                    </p>
                    <p className="text-xs text-[#4A4E5A] leading-normal font-normal">
                      {t.deskTopicModalSubtitle}
                    </p>
                  </div>

                  {/* Choice 1: Instant Open Blackboard (Voice 1-on-1 Mode) */}
                  <button
                    type="button"
                    onClick={handleStartOpenBlackboard}
                    className="w-full p-4 rounded-2xl border border-[#EFF1F5] bg-[#F6F7FB] hover:bg-slate-100 transition-all duration-200 text-left group cursor-pointer shadow-xs flex items-start gap-3.5 relative overflow-hidden"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#796AEF] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wide flex items-center gap-1.5">
                          <span>🎙️ {t.deskDirectStudyVoice || "Live Voice 1-on-1 (Instant Blackboard)"}</span>
                        </h4>
                        <span className="text-[9px] font-sans font-bold text-[#796AEF] bg-white px-2 py-0.5 rounded-full border border-[#EFF1F5] shadow-2xs">
                          {t.deskVoiceFastest || "⚡ Fastest • Instant"}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4A4E5A] font-normal leading-relaxed mt-1">
                        {t.deskVoiceDesc || "Talk directly with Cherry Ma'am in real-time. Just speak your doubt, and she will draw and solve every step on the chalkboard."}
                      </p>
                    </div>
                  </button>

                  {/* Choice 2: Enter Specific Topic Name */}
                  <button
                    type="button"
                    onClick={() => setDirectStudySubMode("type")}
                    className="w-full p-4 rounded-2xl border border-[#EFF1F5] bg-white hover:bg-slate-50 transition-all duration-200 text-left group cursor-pointer shadow-xs flex items-start gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F6F7FB] text-[#796AEF] border border-[#EFF1F5] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wide flex items-center gap-1.5">
                          <span>✍️ {t.deskDirectStudyType || "Type Topic or Chapter Name"}</span>
                        </h4>
                        <span className="text-[9px] font-sans font-bold text-[#796AEF] bg-white px-2 py-0.5 rounded-full border border-[#EFF1F5] shadow-2xs">
                          Custom Notes
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4A4E5A] font-normal leading-relaxed mt-1">
                        {t.deskTypeDesc || "Enter any concept, formula, or chapter you want to master. Cherry Ma'am will prepare structured chalkboard slides and teach you."}
                      </p>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <p className="text-[9px] font-sans text-[#796AEF] font-bold uppercase tracking-wider">{t.deskTopicInputTitle}</p>
                    <p className="text-[11px] text-[#4A4E5A] leading-normal font-normal">
                      {t.deskTopicInputSubtitle}
                    </p>
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      placeholder="e.g., Newton's Laws of Motion, Fractions, Sound..."
                      value={typedTopic}
                      onChange={(e) => setTypedTopic(e.target.value)}
                      className="w-full px-4 py-3.5 bg-[#F6F7FB] border border-[#EFF1F5] rounded-xl text-xs text-[#1E293B] placeholder-[#4A4E5A]/60 focus:outline-none focus:border-[#796AEF] font-normal transition-all shadow-xs"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && typedTopic.trim()) {
                          handleStartDirectStudy();
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setDirectStudySubMode("choose")}
                      className="flex-1 py-3 border border-[#EFF1F5] text-[#4A4E5A] rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 active:scale-98 transition-all cursor-pointer"
                    >
                      {t.deskBack}
                    </button>
                    <button
                      type="button"
                      onClick={handleStartDirectStudy}
                      disabled={!typedTopic.trim()}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${
                        typedTopic.trim() 
                          ? "bg-[#796AEF] text-white hover:bg-[#6858e0] shadow-xs" 
                          : "bg-[#F6F7FB] text-[#4A4E5A]/50 border border-[#EFF1F5] cursor-not-allowed"
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5 stroke-[2.5]" />
                      {t.deskStartLecture}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🎯 10-Year PYQ 80/20 Guaranteed Repeat Topics Modal (Phase 1) */}
      <PYQ8020ReportModal
        isOpen={showPYQ8020Modal}
        onClose={() => setShowPYQ8020Modal(false)}
        report={pyq8020Report}
        isLoading={loadingPYQ8020}
        onRefreshOrReanalyze={handleFetchPYQ8020}
        studentName={studentDetails.name}
        addToast={addToast}
      />

      {/* 🗺️ 10-Year Marking Weightage & Section Heatmap Modal (Phase 2) */}
      <PYQWeightageHeatmapModal
        isOpen={showHeatmapModal}
        onClose={() => setShowHeatmapModal(false)}
        report={heatmapReport}
        isLoading={loadingHeatmap}
        onRefreshOrReanalyze={handleFetchHeatmap}
        studentName={studentDetails.name}
        addToast={addToast}
      />

      {/* 🎲 2026 Board Examination AI Predicted Paper Modal (Phase 3) */}
      <AIPredictedPaperModal
        isOpen={showPredictedPaperModal}
        onClose={() => setShowPredictedPaperModal(false)}
        report={predictedPaperReport}
        isLoading={loadingPredictedPaper}
        onRefreshOrReanalyze={handleFetchPredictedPaper}
        studentName={studentDetails.name}
        addToast={addToast}
      />

      {/* ⚠️ AI Validation Guardrail & Fallback Modal */}
      {pyqValidationAlert && (
        <PYQValidationAlertModal
          isOpen={pyqValidationAlert.isOpen}
          fileName={pyqValidationAlert.fileName}
          reason={pyqValidationAlert.reason}
          detectedDocType={pyqValidationAlert.detectedDocType}
          detectedSubject={pyqValidationAlert.detectedSubject}
          currentSubject={studentDetails.subject || "Mathematics"}
          currentGrade={studentDetails.grade || "Class 10th"}
          onUseNationalDB={handleValidationUseNationalDB}
          onUploadAnother={handleValidationUploadAnother}
          onSwitchToMode={handleValidationSwitchMode}
          onProceedAnyway={handleValidationProceedAnyway}
          onClose={() => setPyqValidationAlert(null)}
        />
      )}

      {/* =========================================
          FULL-SCREEN PAGE: AUDIO OVERVIEW STUDIO (NEW PAGE)
          ========================================= */}
      {uploadMode === "podcast" && (
        <div
          id="audio-overview-studio-fullscreen-page"
          className="fixed inset-0 z-[160] bg-slate-50 flex flex-col overflow-hidden animate-in fade-in duration-200"
        >
          {/* Native Mobile App Header */}
          <div className="bg-white border-b border-slate-200/80 px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between shadow-2xs shrink-0">
            <button
              type="button"
              id="close-fullscreen-studio-back-btn"
              onClick={() => {
                setUploadMode("explain");
                addToast("Returned to Syllabus Desk", "info");
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-[#796AEF]" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#796AEF]">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 font-sans leading-tight">
                    Audio Overview Studio
                  </h2>
                  <span className="text-[8.5px] bg-indigo-50 text-[#796AEF] font-extrabold px-2 py-0.5 rounded-full border border-indigo-100">
                    NotebookLM
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-none">
                  2-Host Dual-Voice Deep Dive Podcast
                </p>
              </div>
            </div>

            <button
              type="button"
              id="close-fullscreen-studio-x-btn"
              onClick={() => {
                setUploadMode("explain");
              }}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              title="Close Audio Overview Studio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Page Body (Mobile-First Centered Container) */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 pb-20 sm:pb-10 flex justify-center">
            <div className="w-full max-w-lg">
              <AudioOverviewStudio
                studentDetails={studentDetails}
                activeDocument={activeDocument}
                addToast={addToast}
                isFullScreen={true}
                onOpenPodcast={(podcast) => {
                  if (onOpenAudioPodcast) {
                    onOpenAudioPodcast(podcast);
                  } else {
                    window.dispatchEvent(new CustomEvent("cherry_open_audio_podcast", { detail: podcast }));
                  }
                }}
                onClose={() => {
                  setUploadMode("explain");
                  addToast("Exited Audio Overview", "info");
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
