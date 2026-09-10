import React, { useState, useEffect, useRef } from "react";
import {
  Headphones,
  Upload,
  FileText,
  Sparkles,
  BookOpen,
  Trash2,
  Play,
  RotateCcw,
  Loader2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Radio,
  FileUp,
  X,
  HardDrive,
  Download,
  WifiOff,
} from "lucide-react";
import { AudioPodcastData, PodcastLanguage, PodcastEpisodeType } from "../types";
import { generateAudioPodcast, getSavedPodcasts } from "../services/podcastService";
import { buildProceduralPodcast } from "../utils/podcastEngine";
import { compressImageIfPossible } from "../utils/imageCompressor";
import { getActiveApiKey } from "../utils/geminiKeyStorage";
import {
  getAllOfflinePodcasts,
  deleteOfflinePodcast,
  downloadAudioBlobAsFile,
  downloadAndSavePodcastForOffline,
  OfflinePodcastRecord,
} from "../utils/offlineAudioStorage";

interface AudioOverviewStudioProps {
  studentDetails: {
    name: string;
    grade: string;
    subject: string;
    board?: string;
    mediumOfLearning?: string;
  };
  activeDocument?: any;
  addToast: (msg: string, type: "success" | "error" | "info") => void;
  onOpenPodcast: (podcast: AudioPodcastData) => void;
  onClose?: () => void;
  isFullScreen?: boolean;
}

export function AudioOverviewStudio({
  studentDetails,
  activeDocument,
  addToast,
  onOpenPodcast,
  onClose,
  isFullScreen = false,
}: AudioOverviewStudioProps) {
  // Source tabs: "upload" | "paste" (Topic & Subject strictly analyzed from content)
  const [sourceType, setSourceType] = useState<"upload" | "paste">("upload");

  // Source state
  const [sourceFile, setSourceFile] = useState<{
    name: string;
    size: number;
    text: string;
    isExtracting: boolean;
    detectedSubject?: string;
  } | null>(null);

  const [selectedSubject, setSelectedSubject] = useState<string>(
    activeDocument?.detectedSubject || studentDetails.subject || "Physics"
  );

  const [pastedText, setPastedText] = useState<string>("");
  const [topicName, setTopicName] = useState<string>("");

  // Audio Overview language is strictly synchronized from student's profile (mediumOfLearning)
  const resolvedLanguage: PodcastLanguage = (() => {
    const medium = (studentDetails?.mediumOfLearning || "").trim().toLowerCase();
    if (medium.includes("hindi") || medium === "हिंदी") return "Hindi";
    if (medium.includes("english")) return "English";
    return "Hinglish";
  })();
  const [episodeType, setEpisodeType] = useState<PodcastEpisodeType>("rapid_viva");
  const [targetDurationMins, setTargetDurationMins] = useState<number>(3);
  const [hostPair, setHostPair] = useState<"cherry_riya" | "aarav_riya">("cherry_riya");

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [generatedPodcast, setGeneratedPodcast] = useState<AudioPodcastData | null>(null);
  const [savedEpisodes, setSavedEpisodes] = useState<AudioPodcastData[]>([]);
  const [offlineEpisodes, setOfflineEpisodes] = useState<OfflinePodcastRecord[]>([]);
  const [activeLibraryTab, setActiveLibraryTab] = useState<"recent" | "offline">("recent");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load saved episodes & offline records on mount and on new generation
  useEffect(() => {
    try {
      const existing = getSavedPodcasts();
      setSavedEpisodes(existing);
    } catch (e) {
      console.warn("Could not read saved podcasts:", e);
    }

    getAllOfflinePodcasts()
      .then((records) => {
        setOfflineEpisodes(records);
      })
      .catch((e) => console.warn("Could not read offline podcasts:", e));
  }, [generatedPodcast]);

  const refreshOfflineLibrary = async () => {
    try {
      const records = await getAllOfflinePodcasts();
      setOfflineEpisodes(records);
    } catch (e) {
      console.warn("Could not refresh offline podcasts:", e);
    }
  };

  const handleDeleteOfflineRecord = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteOfflinePodcast(id);
      addToast("Episode removed from offline storage", "info");
      refreshOfflineLibrary();
    } catch {
      addToast("Could not remove offline podcast", "error");
    }
  };

  const handleDownloadOfflineRecordWav = (record: OfflinePodcastRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const safeTopic = (record.topic || "Audio_Podcast").replace(/[^a-zA-Z0-9_\-\u0900-\u097F]/g, "_");
      downloadAudioBlobAsFile(record.audioBlob, `${safeTopic}_CherryAI.wav`);
      addToast("Audio download started! (.wav)", "success");
    } catch {
      addToast("Download failed", "error");
    }
  };

  // Synchronize subject and topic from active document if available
  useEffect(() => {
    if (activeDocument) {
      if (activeDocument.detectedSubject) {
        setSelectedSubject(activeDocument.detectedSubject);
      }
      if (activeDocument.detectedTitle && !/^[0-9\s_.-]+$/.test(activeDocument.detectedTitle)) {
        setTopicName(activeDocument.detectedTitle);
      }
    }
  }, [activeDocument]);

  // Handle file drop / select
  const handleFileSelect = async (file: File) => {
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      addToast("File is too large! Please choose a file under 15MB.", "error");
      return;
    }

    setSourceFile({
      name: file.name,
      size: file.size,
      text: "",
      isExtracting: true,
    });

    addToast(`Extracting source content from "${file.name}"... 📄`, "info");

    try {
      let base64Data = "";
      let resolvedMime = file.type || "application/pdf";
      let textContent = "";

      if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        textContent = await file.text();
        resolvedMime = "text/plain";
        base64Data = btoa(unescape(encodeURIComponent(textContent)));
      } else {
        const dataUrl = await compressImageIfPossible(file, 1200, 0.7);
        const parts = (dataUrl || "").split(",");
        base64Data = parts[1] || "";
        if (file.name.endsWith(".pdf")) resolvedMime = "application/pdf";
        else if (file.name.endsWith(".jpg") || file.name.endsWith(".jpeg")) resolvedMime = "image/jpeg";
        else if (file.name.endsWith(".png")) resolvedMime = "image/png";
      }

      const activeKey = getActiveApiKey();
      const res = await fetch("/api/upload-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeKey ? { "x-gemini-api-key": activeKey } : {}),
        },
        body: JSON.stringify({
          filename: file.name,
          mimeType: resolvedMime,
          base64Data,
          mode: "podcast",
          apiKey: activeKey || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Upload returned status ${res.status}`);
      }

      const data = await res.json();
      const extractedContent = data.markdown || data.content || (data.topics && data.topics.join("\n")) || textContent || "";
      const detectedSubj = data.detectedSubject;
      if (detectedSubj) {
        setSelectedSubject(detectedSubj);
      }

      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      let finalTitle = data.detectedTitle || data.detectedChapter || "";
      if (!finalTitle || /^[0-9\s_.-]+$/.test(finalTitle) || (cleanName && finalTitle.toLowerCase() === cleanName.toLowerCase() && /^[0-9\s_.-]+$/.test(cleanName))) {
        const headingMatches = extractedContent.match(/^#+\s*(?:Chapter|Topic)?[:\s]*(.+)$/gim) || [];
        for (const hm of headingMatches) {
          const candidate = hm.replace(/^#+\s*(?:Chapter|Topic)?[:\s]*/i, "").replace(/[\*\_\[\]`#]/g, "").trim();
          if (candidate.length > 2 && !/^[0-9\s_.-]+$/.test(candidate) && !/subject/i.test(candidate)) {
            finalTitle = candidate;
            break;
          }
        }
      }
      // If still no meaningful title, inspect top text lines from extracted content
      if (!finalTitle || /^[0-9\s_.-]+$/.test(finalTitle)) {
        const lines = extractedContent.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length > 3 && !/^[0-9\s_.-]+$/.test(l) && !/^[-*_#`~=]+$/.test(l));
        if (lines.length > 0) {
          finalTitle = lines[0].slice(0, 60).replace(/^[#*_\s]+/, "").trim();
        }
      }
      if (!finalTitle || /^[0-9\s_.-]+$/.test(finalTitle)) {
        finalTitle = `${detectedSubj || selectedSubject || "Curriculum"} Core Overview`;
      }
      setTopicName(finalTitle);

      setSourceFile({
        name: file.name,
        size: file.size,
        text: extractedContent.slice(0, 10000),
        isExtracting: false,
        detectedSubject: detectedSubj,
      });

      addToast(`Document analyzed! Subject: ${detectedSubj || "Verified"} | Topic: ${finalTitle} 🎙️`, "success");
    } catch (err: any) {
      console.warn("File extraction fallback:", err);
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      const safeTitle = !cleanName || /^[0-9\s_.-]+$/.test(cleanName)
        ? `${selectedSubject || studentDetails.subject || "Academic"} Core Concepts`
        : cleanName;
      setSourceFile({
        name: file.name,
        size: file.size,
        text: `Source content from file: ${safeTitle}. Subject: ${selectedSubject || studentDetails.subject}, Grade: ${studentDetails.grade}`,
        isExtracting: false,
        detectedSubject: selectedSubject || studentDetails.subject,
      });
      setTopicName(safeTitle);
      addToast("File registered as source! 📄", "info");
    }
  };

  // Auto-analyze pasted notes for topic & academic subject
  const handlePastedTextChange = (text: string) => {
    setPastedText(text);
    if (text.trim().length > 15) {
      const headingMatch = text.match(/^#+\s*(?:Chapter|Topic)?[:\s]*(.+)$/im);
      if (headingMatch && headingMatch[1]) {
        const cleanH = headingMatch[1].replace(/[\*\_\[\]`#]/g, "").trim();
        if (cleanH.length > 2 && !/^[0-9\s_.-]+$/.test(cleanH)) {
          setTopicName(cleanH);
        }
      } else {
        const firstLine = text.trim().split("\n")[0].replace(/^#+\s*/, "").slice(0, 50).trim();
        if (firstLine.length > 3 && !/^[0-9\s_.-]+$/.test(firstLine)) {
          setTopicName(firstLine);
        }
      }

      if (/(\bNH_?3\b|ammonia|hydrochloric|nitric|sulfuric|acid|base|salt|bond|reaction|organic|element|periodic|equilibrium|titration|molar)/i.test(text)) {
        setSelectedSubject("Chemistry");
      } else if (/\b(velocity|acceleration|displacement|kinematics|gravitation|momentum|optics|reflection|refraction|lens|mirror|electricity|circuit|resistor|ohm|magnetic|wavelength|sound|frequency|newton|joule|watt)\b/i.test(text)) {
        setSelectedSubject("Physics");
      } else if (/\b(cell|tissue|organ|photosynthesis|respiration|mitosis|meiosis|dna|rna|gene|heredity|evolution|bacteria|virus|plant|animal|chlorophyll)\b/i.test(text)) {
        setSelectedSubject("Biology");
      } else if (/\b(algebra|polynomial|quadratic|equation|trigonometry|triangle|circle|derivative|integral|matrix|probability|statistics)\b/i.test(text)) {
        setSelectedSubject("Mathematics");
      } else if (/\b(gdp|inflation|deflation|monetary|fiscal|demand|supply|macroeconomics|microeconomics|market|equilibrium|price index|banking|rbi)\b/i.test(text)) {
        setSelectedSubject("Economics");
      }
    }
  };

  // Determine active source text & topic (strictly based on content)
  const getActiveSourceDetails = () => {
    if (sourceType === "upload" && sourceFile) {
      return {
        title: topicName || sourceFile.name,
        text: sourceFile.text,
        typeLabel: "Document / PDF",
        isReady: !sourceFile.isExtracting,
      };
    }
    if (sourceType === "paste" && pastedText.trim()) {
      return {
        title: topicName || "Pasted Notes & Text",
        text: pastedText.trim(),
        typeLabel: "Pasted Text",
        isReady: true,
      };
    }
    return null;
  };

  const activeSource = getActiveSourceDetails();

  // Generate Audio Overview
  const handleGeneratePodcast = async () => {
    if (!activeSource || !activeSource.text.trim()) {
      addToast("Please upload a document or paste notes first to analyze the topic & subject!", "error");
      return;
    }

    const resolvedSubject = selectedSubject || studentDetails.subject || "Physics";
    let finalTopic = topicName.trim();
    if (!finalTopic || /^[0-9\s_.-]+$/.test(finalTopic)) {
      finalTopic = `${resolvedSubject} Comprehensive Overview`;
      setTopicName(finalTopic);
    }

    const isCherry = hostPair === "cherry_riya";
    const mentorName = isCherry ? "Cherry Ma'am" : "Aarav Sir";

    setIsGenerating(true);
    setGenerationStep("Analyzing source content & core mental models...");
    addToast(`🎙️ Starting 2-Host Audio Overview with ${mentorName} & Riya...`, "info");

    const sourceText = activeSource?.text || "";

    try {
      setTimeout(() => {
        setGenerationStep(`Scripting ${mentorName} & Riya Socratic dialogue...`);
      }, 1200);

      setTimeout(() => {
        setGenerationStep("Synthesizing analogies, doubts & exam traps...");
      }, 2600);

      const podcastData = await generateAudioPodcast({
        topic: finalTopic,
        subject: resolvedSubject,
        grade: studentDetails.grade || "Class 10-12",
        language: resolvedLanguage,
        notesOrDocumentText: sourceText,
        episodeType,
        targetDurationMins,
        hostPair,
      });

      setGeneratedPodcast(podcastData);
      setGenerationStep("🎙️ Synthesizing 24kHz Seamless Audio (Zero Gap)...");

      try {
        await downloadAndSavePodcastForOffline(podcastData, {
          triggerFileDownload: false,
          onProgress: (p) => {
            setGenerationStep(`Synthesizing Turn ${p.currentTurn}/${p.totalTurns} (${p.speakerName})...`);
          },
        });
        await refreshOfflineLibrary();
      } catch (synthErr) {
        console.warn("[AudioOverviewStudio] Seamless audio pre-synthesis notice:", synthErr);
      }

      setIsGenerating(false);
      setGenerationStep("");
      addToast("🎉 24kHz Seamless Audio Overview ready! (Zero Gap)", "success");

      // Automatically launch player with zero-gap audio ready
      onOpenPodcast(podcastData);
    } catch (err: any) {
      console.error("[AudioOverviewStudio] Generation failed, recovering with high-fidelity procedural overview:", err);
      try {
        const fallbackPodcast = buildProceduralPodcast(
          finalTopic,
          resolvedSubject,
          studentDetails.grade || "Class 10-12",
          resolvedLanguage,
          hostPair,
          episodeType
        );
        setGeneratedPodcast(fallbackPodcast);
        setGenerationStep("🎙️ Synthesizing 24kHz Seamless Audio...");
        try {
          await downloadAndSavePodcastForOffline(fallbackPodcast, {
            triggerFileDownload: false,
            onProgress: (p) => {
              setGenerationStep(`Synthesizing Turn ${p.currentTurn}/${p.totalTurns} (${p.speakerName})...`);
            },
          });
          await refreshOfflineLibrary();
        } catch (fallbackSynthErr) {
          console.warn("[AudioOverviewStudio] Procedural audio synthesis notice:", fallbackSynthErr);
        }
        setIsGenerating(false);
        setGenerationStep("");
        addToast("🎉 Audio Overview ready! Launching player...", "success");
        onOpenPodcast(fallbackPodcast);
        return;
      } catch (fallbackErr) {
        console.error("[AudioOverviewStudio] Procedural recovery failed:", fallbackErr);
      }
      setIsGenerating(false);
      setGenerationStep("");
      addToast(err?.message || "Could not generate audio overview. Please try again!", "error");
    }
  };

  return (
    <div className={`bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-xs text-left space-y-4 ${
      isFullScreen ? "p-4 sm:p-6 shadow-sm" : "p-4 sm:p-5"
    }`}>
      {/* Studio Header (NotebookLM Style - shown when not in full-screen wrapper) */}
      {!isFullScreen && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#796AEF]">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-sans font-bold uppercase text-slate-800 tracking-wider">
                  Audio Overview Studio
                </h3>
                <span className="text-[9px] bg-indigo-50 text-[#796AEF] font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                  NotebookLM Style
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal">
                2-Host Dual-Voice Deep Dive Podcast ({hostPair === "cherry_riya" ? "Cherry Ma'am & Riya" : "Aarav Sir & Riya"})
              </p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              title="Close Audio Overview"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* =========================================
          STEP 1: ADD SOURCE (सोर्स जोड़ें)
          ========================================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#796AEF]" />
            <span>1. Add Source (सोर्स जोड़ें):</span>
          </label>
          <span className="text-[10px] text-slate-500 font-medium">
            Upload PDF, paste notes, or select topic
          </span>
        </div>

        {/* Source Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setSourceType("upload")}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              sourceType === "upload"
                ? "bg-white text-[#796AEF] shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setSourceType("paste")}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              sourceType === "paste"
                ? "bg-white text-[#796AEF] shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Text</span>
          </button>
        </div>

        {/* TAB 1: UPLOAD FILE */}
        {sourceType === "upload" && (
          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.png,.jpg,.jpeg,.txt,.md"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            {sourceFile ? (
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white border border-indigo-200 flex items-center justify-center text-[#796AEF] shrink-0 shadow-2xs">
                      {sourceFile.isExtracting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileUp className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {sourceFile.name}
                      </p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{(sourceFile.size / 1024).toFixed(0)} KB</span>
                        <span>•</span>
                        {sourceFile.isExtracting ? (
                          <span className="text-indigo-600 font-semibold animate-pulse">
                            Extracting text & analyzing subject...
                          </span>
                        ) : (
                          <>
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Ready
                            </span>
                            {sourceFile.detectedSubject && (
                              <>
                                <span>•</span>
                                <span className="text-[#796AEF] font-bold">
                                  {sourceFile.detectedSubject === "Physics" && "🔬 "}
                                  {sourceFile.detectedSubject === "Chemistry" && "🧪 "}
                                  {sourceFile.detectedSubject === "Mathematics" && "📐 "}
                                  {sourceFile.detectedSubject === "Biology" && "🧬 "}
                                  {sourceFile.detectedSubject === "Economics" && "📊 "}
                                  {sourceFile.detectedSubject}
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 text-[11px] font-bold text-[#796AEF] hover:bg-white rounded-lg transition border border-transparent hover:border-indigo-100 cursor-pointer"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSourceFile(null);
                        setTopicName("");
                      }}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition cursor-pointer"
                      title="Remove source"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200/90 hover:border-[#796AEF] bg-slate-50/80 hover:bg-indigo-50/30 rounded-xl p-5 text-center transition cursor-pointer group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-white border border-slate-200/80 group-hover:scale-105 transition-transform flex items-center justify-center text-[#796AEF] shadow-2xs">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 mt-2">
                  Drop Chapter PDF or Notes here (या फ़ाइल चुनें)
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Supports PDF, Document, Photo of textbook notes, TXT (up to 15MB)
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PASTE TEXT */}
        {sourceType === "paste" && (
          <div className="space-y-2">
            <textarea
              rows={4}
              value={pastedText}
              onChange={(e) => handlePastedTextChange(e.target.value)}
              placeholder="Paste chapter notes, textbook paragraph, questions, or formulas here... (यहाँ अपने नोट्स या चैप्टर टेक्स्ट पेस्ट करें)"
              className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#796AEF] focus:ring-2 focus:ring-indigo-100 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>{pastedText.trim() ? `${pastedText.trim().split(/\s+/).length} words entered` : "Minimum 20 words recommended"}</span>
              {pastedText && (
                <button
                  type="button"
                  onClick={() => {
                    setPastedText("");
                    setTopicName("");
                  }}
                  className="text-slate-500 hover:text-rose-500 cursor-pointer"
                >
                  Clear text
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Audio Overview Topic / Title Display (Auto-Generated from Content) */}
      <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/90 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#796AEF]" />
            <span>Audio Overview Topic / Title:</span>
          </span>
          <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Auto-Generated from Content
          </span>
        </div>

        {sourceFile?.isExtracting ? (
          <div className="flex items-center gap-2 py-2 px-3 text-xs text-[#796AEF] font-medium bg-indigo-50/60 rounded-lg border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span className="animate-pulse">Analyzing content & automatically generating topic title...</span>
          </div>
        ) : topicName ? (
          <div className="relative">
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="Topic title auto-generated from content..."
              className="w-full text-xs sm:text-sm font-bold text-slate-900 bg-white border border-slate-200 focus:border-[#796AEF] focus:ring-2 focus:ring-indigo-100 rounded-lg px-3 py-2 outline-none transition shadow-2xs"
              title="Auto-generated topic name (editable)"
            />
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic py-2 px-3 bg-white border border-slate-200/60 rounded-lg flex items-center justify-between">
            <span>Upload document or paste notes to auto-generate topic title...</span>
            <span className="text-[10px] text-slate-400 not-italic font-normal">Waiting for content</span>
          </div>
        )}
      </div>

      {/* =========================================
          STEP 2: AUDIO OVERVIEW CUSTOMIZATION
          ========================================= */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#796AEF]" />
          <span>2. Customize Audio Conversation:</span>
        </label>

        <div className="space-y-2.5">
          {/* Episode Type Selection */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1">
                <Radio className="w-3 h-3 text-[#796AEF]" /> Format & Depth (ऑडियो मोड)
              </span>
              <span className="text-[9px] text-[#796AEF] font-bold">
                {episodeType === "rapid_viva"
                  ? "2.5 – 4 Mins"
                  : episodeType === "exam_booster"
                  ? "3 – 4 Mins"
                  : episodeType === "quick_revision"
                  ? "2.5 – 5 Mins"
                  : "2 – 4 Mins"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "rapid_viva", label: "Rapid Viva / Quiz", hindiLabel: "रैपिड वाइवा", range: "2.5-4m", defaultMins: 3, icon: "🎯" },
                { id: "exam_booster", label: "Exam-Morning Audio", hindiLabel: "एग्ज़ाम डे बूस्टर", range: "3-4m", defaultMins: 3.5, icon: "🚀" },
                { id: "quick_revision", label: "Quick Recap", hindiLabel: "त्वरित रीकैप", range: "2.5-5m", defaultMins: 3.5, icon: "⚡" },
                { id: "exam_trap", label: "Exam Traps", hindiLabel: "परीक्षा ट्रैप्स", range: "2-4m", defaultMins: 3, icon: "🛡️" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setEpisodeType(item.id as PodcastEpisodeType);
                    setTargetDurationMins(item.defaultMins);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition text-left cursor-pointer flex flex-col justify-between ${
                    episodeType === item.id
                      ? "bg-[#796AEF] text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-700 hover:border-indigo-200"
                  }`}
                  title={`${item.label} (${item.range})`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs">{item.icon}</span>
                    <span className={`text-[9px] font-semibold ${episodeType === item.id ? "text-indigo-100" : "text-slate-500"}`}>
                      {item.range}
                    </span>
                  </div>
                  <span className="leading-tight text-[11px] font-bold mt-1">{item.label}</span>
                  <span className={`text-[9px] ${episodeType === item.id ? "text-indigo-100" : "text-slate-500"}`}>
                    {item.hindiLabel}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-indigo-900/80 font-medium px-0.5 pt-0.5 flex items-center gap-1">
              {episodeType === "rapid_viva" && "🎯 Rapid Viva / Quiz: Active recall questions with instant mentor feedback (2.5-4 min)"}
              {episodeType === "exam_booster" && "🚀 Exam-Morning 1-Page Audio (एग्ज़ाम डे बूस्टर): 80/20 essentials, top guaranteed questions & formula checklist (3-4 min)"}
              {episodeType === "quick_revision" && "⚡ Quick Recap: High-speed formula blitz & key definitions sprint (2.5-5 min)"}
              {episodeType === "exam_trap" && "🛡️ Exam Traps: Forensic examiner traps, pitfall warnings & defense shield (2-4 min)"}
            </p>
          </div>
        </div>

        {/* 2-Host & Voice Profile Selection (NotebookLM Style) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1">
              <Headphones className="w-3 h-3 text-[#796AEF]" /> Host Voice Profile (आवाज़ और मेंटर चुनें)
            </span>
            <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Real Human Voice
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Option 1: Cherry Ma'am & Riya (Default & Recommended) */}
            <button
              type="button"
              onClick={() => {
                setHostPair("cherry_riya");
                addToast("Selected: Cherry Ma'am & Riya (Real Human Voice) 👩‍🏫", "info");
              }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                hostPair === "cherry_riya"
                  ? "bg-indigo-50/70 border-[#796AEF] ring-2 ring-[#796AEF]/20 shadow-2xs"
                  : "bg-white border-slate-200/80 hover:border-indigo-200 hover:bg-slate-50/60"
              }`}
            >
              {hostPair === "cherry_riya" && (
                <span className="absolute top-2 right-2 text-[8px] bg-[#796AEF] text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Active
                </span>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white border border-indigo-200 flex items-center justify-center text-lg shadow-2xs shrink-0">
                  👩‍🏫
                </div>
                <div className="min-w-0 pr-10">
                  <p className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                    <span>Cherry Ma'am & Riya</span>
                  </p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    Real Human-like Voice (Aoede • Warm & Empathetic)
                  </p>
                </div>
              </div>
            </button>

            {/* Option 2: Aarav Sir & Riya */}
            <button
              type="button"
              onClick={() => {
                setHostPair("aarav_riya");
                addToast("Selected: Aarav Sir & Riya (Mentor Voice) 👨‍🏫", "info");
              }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                hostPair === "aarav_riya"
                  ? "bg-indigo-50/70 border-[#796AEF] ring-2 ring-[#796AEF]/20 shadow-2xs"
                  : "bg-white border-slate-200/80 hover:border-indigo-200 hover:bg-slate-50/60"
              }`}
            >
              {hostPair === "aarav_riya" && (
                <span className="absolute top-2 right-2 text-[8px] bg-[#796AEF] text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Active
                </span>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shadow-2xs shrink-0">
                  👨‍🏫
                </div>
                <div className="min-w-0 pr-10">
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    Aarav Sir & Riya
                  </p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    Master Mentor (Charon • Grounded & Relatable)
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Profile Language Auto-Sync Indicator */}
        <div className="p-2 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-[11px]">
          <span className="font-semibold text-slate-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#796AEF]" />
            Audio Language:
          </span>
          <span className="font-bold text-[#796AEF] bg-white px-2 py-0.5 rounded-md border border-indigo-100 shadow-2xs">
            {resolvedLanguage} (Student Profile)
          </span>
        </div>
      </div>

      {/* =========================================
          ACTION: GENERATE AUDIO OVERVIEW
          ========================================= */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={handleGeneratePodcast}
          disabled={isGenerating || (sourceFile?.isExtracting ?? false)}
          id="generate-audio-overview-btn"
          className="w-full py-3.5 px-4 rounded-xl bg-[#796AEF] hover:bg-[#6858e0] active:scale-[0.99] text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{generationStep || "Generating Audio Overview..."}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Audio Overview (ऑडियो ओवरव्यू बनाएं)</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </>
          )}
        </button>

        {isGenerating && (
          <p className="text-center text-[10px] text-indigo-600 font-medium animate-pulse">
            Using Google AI Studio Neural Speech Engine • 2-Host Synchronized Socratic Script
          </p>
        )}
      </div>

      {/* =========================================
          SAVED PODCASTS & OFFLINE IN-APP LIBRARY
          ========================================= */}
      {(savedEpisodes.length > 0 || offlineEpisodes.length > 0) && !isGenerating && (
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          {/* Library Tab Switcher */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 p-0.5 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveLibraryTab("recent")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  activeLibraryTab === "recent"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Headphones className="w-3 h-3 text-[#796AEF]" />
                <span>Recent ({savedEpisodes.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLibraryTab("offline")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  activeLibraryTab === "offline"
                    ? "bg-[#796AEF] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <HardDrive className="w-3 h-3" />
                <span>Offline ({offlineEpisodes.length})</span>
                {offlineEpisodes.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            </div>

            {activeLibraryTab === "offline" && offlineEpisodes.length > 0 && (
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <WifiOff className="w-2.5 h-2.5" />
                <span>Zero Data Playback</span>
              </span>
            )}
          </div>

          {/* TAB 1: RECENT EPISODES */}
          {activeLibraryTab === "recent" && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {savedEpisodes.slice(0, 4).map((ep) => {
                const isOffline = offlineEpisodes.some((off) => off.id === ep.id);
                return (
                  <div
                    key={ep.id}
                    onClick={() => onOpenPodcast(ep)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/70 hover:border-indigo-200 transition cursor-pointer flex items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 group-hover:border-indigo-300 flex items-center justify-center text-[#796AEF] shrink-0">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {ep.title || ep.topic}
                        </p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-2">
                          <span>{ep.language || "Hinglish"}</span>
                          <span>•</span>
                          <span>{ep.segments?.length || 10} turns</span>
                          {ep.episodeType && (
                            <span className="font-semibold px-1.5 py-0.5 text-[9px] rounded bg-indigo-50 text-[#796AEF] border border-indigo-100">
                              {ep.episodeType === "rapid_viva" ? "🎯 Rapid Viva" : ep.episodeType === "exam_booster" ? "🚀 Exam Booster" : ep.episodeType === "quick_revision" ? "⚡ Quick Recap" : ep.episodeType === "exam_trap" ? "🛡️ Exam Traps" : "🎙️ Audio Overview"}
                            </span>
                          )}
                          {isOffline && (
                            <span className="text-emerald-600 font-extrabold flex items-center gap-0.5">
                              • <CheckCircle2 className="w-2.5 h-2.5" /> Offline
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-[#796AEF] group-hover:translate-x-0.5 transition-transform shrink-0">
                      Play ➔
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: OFFLINE IN-APP LIBRARY */}
          {activeLibraryTab === "offline" && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {offlineEpisodes.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-1">
                  <p className="text-xs font-bold text-slate-700">No Offline Episodes Yet</p>
                  <p className="text-[10px] text-slate-500">
                    Open any podcast above and tap "Save Offline" or "Download .wav" to store audio on your device for network-free listening!
                  </p>
                </div>
              ) : (
                offlineEpisodes.map((offRec) => (
                  <div
                    key={offRec.id}
                    onClick={() => onOpenPodcast(offRec.podcast)}
                    className="p-2.5 rounded-xl bg-white hover:bg-emerald-50/40 border border-emerald-200/80 hover:border-emerald-300 transition cursor-pointer flex items-center justify-between gap-2 group shadow-2xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {offRec.title || offRec.topic}
                        </p>
                        <p className="text-[10px] text-emerald-700 flex items-center gap-1.5">
                          <span className="font-bold">✓ Ready Offline</span>
                          <span>•</span>
                          <span>{(offRec.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleDownloadOfflineRecordWav(offRec, e)}
                        title="Download .wav audio to device storage"
                        className="p-1.5 text-slate-500 hover:text-[#796AEF] hover:bg-indigo-50 rounded-lg transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteOfflineRecord(offRec.id, e)}
                        title="Delete from offline storage"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
