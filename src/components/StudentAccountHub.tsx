/**
 * StudentAccountHub.tsx - Student Profile & Learning Analytics Hub
 * UTF-8 encoded
 */
import { StudentReportCardModal } from "./StudentReportCardModal";
import { ReferAndEarnHub } from "./ReferAndEarnHub";
import { InAppBookReaderModal } from "./InAppBookReaderModal";
import { GeminiApiKeyModal } from "./GeminiApiKeyModal";
import { isCustomApiKeyConfigured, getAllStoredApiKeys } from "../utils/geminiKeyStorage";
import React, { useState, useEffect, useMemo } from "react";
import {
  User,
  Award,
  Calendar,
  Clock,
  BookOpen,
  Headphones,
  Download,
  Trash2,
  Edit3,
  LogOut,
  Sparkles,
  Home,
  X,
  LayoutGrid,
  FileText,
  Share2,
  Shield,
  Bookmark,
  HardDriveDownload,
  Search,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Youtube,
  Brain,
  ChevronLeft,
  HelpCircle,
  RefreshCw,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Heart,
  Volume2,
  VolumeX,
  MessageSquare,
  Copy,
  Check,
  Zap,
  Film,
  Smartphone,
  Send,
  Flame,
  ThumbsUp,
  Video as VideoIcon,
  Camera,
  Image as ImageIcon,
  Eye,
  ZoomIn,
  Layers,
  Shuffle,
  Lightbulb,
  Printer,
  CheckCircle2,
  SlidersHorizontal,
  ArrowUpDown,
  Grid,
  List,
  ListOrdered,
  Star,
  ListTodo,
  CheckSquare,
  Square,
  Target,
  TrendingUp,
  Radio,
  Gauge,
  Activity,
  CheckCircle,
  Crosshair,
  Hourglass,
  BarChart2,
  PieChart,
  Filter,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  RotateCw,
  Key,
} from "lucide-react";
import katex from "katex";
import { generateAudioPodcast, getSavedPodcasts } from "../services/podcastService";
import { db, auth } from "../lib/firebase"; // Import database configuration
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { sanitizeSvg } from "../utils/sanitizeSvg";
import { parseAndRenderDiagramTag } from "../utils/parametricPrimitives";
import { getTranslations } from "../utils/i18n";
import { KiaraCounselor } from "./KiaraCounselor";
import { KiaraLiveVoiceModal } from "./KiaraLiveVoiceModal";
import { MathRenderer } from "./MathRenderer";
import { safeSetItem } from "../utils/safeStorage";
import {
  getUnifiedRevisionPayload,
  getActiveLearningContext,
  saveActiveLearningContext,
} from "../utils/activeLearningStore";
import { ConceptInfographicPoster } from "./ConceptInfographicPoster";
import { CurriculumBlindspotTracker } from "./CurriculumBlindspotTracker";
import { PrerequisiteGapFinder } from "./PrerequisiteGapFinder";
import { ExamSpeedSprintSimulator } from "./ExamSpeedSprintSimulator";
import { GitFork, Compass } from "lucide-react";
import { ConceptInfographicData } from "../types";

const DIMENSION_DETAILS = [
  {
    name: "🎯 Concept Clarity",
    icon: "🎯",
    description:
      "Evaluates your capability to synthesize formulas and apply them to novel, non-routine application questions. True mastery means recognizing which formula to use under variable conditions.",
    recommendation:
      "Your concept clarity is currently at {score}%. Great work! Ensure you are practicing cross-concept whiteboard problem sets to build deductive flexibility.",
    benefit:
      "Equips you to tackle higher-order thinking (HOTS) board-exam questions and easily crack advanced competitive exams.",
  },
  {
    name: "📖 Theoretical Understanding",
    icon: "📖",
    description:
      "Measures recall of exact textbook definitions, scientific/mathematical constants, core classroom theorems, and textbook-grade proofs.",
    recommendation:
      "Your core theoretical core score is {score}%. Re-read slide summaries and use the direct hand-handbook PDFs to memorize formal definitions precisely.",
    benefit:
      "Allows you to write highly structured, formal answers that score 100% marks from strict board examiners.",
  },
  {
    name: "🧮 Calculation Precision",
    icon: "🧮",
    description:
      "Tracks algebraic accuracy, arithmetic transposition precision, algebraic sign changes, and step-by-step mathematical reasoning.",
    recommendation:
      "Your calculation precision is at {score}%. Silly errors are usually due to transposing terms too quickly. Write out every single algebraic step on your scratchpad.",
    benefit:
      "Completely eliminates exam-day calculation slip-ups and builds high confidence during high-pressure timed exams.",
  },
  {
    name: "⚡ Formula Recall & Recall",
    icon: "⚡",
    description:
      "Gauges rapid recall of standard formulas, units of measurement, coefficients of equations, and historical/scientific facts discussed on chalkboard.",
    recommendation:
      "Your formula recall is at {score}%. Boost this immediately by opening the Smart Revision tab and playing the AI flashcards for 5 minutes daily.",
    benefit:
      "Saves critical minutes during timed tests, leaving you with surplus time to review and polish your calculations.",
  },
  {
    name: "🔥 Socratic Stamina & Consistency",
    icon: "🔥",
    description:
      "Monitors overall active learning consistency. Derived directly from lecture classes attended, custom handbooks generated, and slide snapshots saved.",
    recommendation:
      "Your Socratic engagement is {score}%. Attend live sessions with Cherry Ma'am consistently, ask interactive questions, and save chalkboard snapshot formulations to keep this at 100%.",
    benefit:
      "Transforms studying from exhausting late-night cram sessions to steady, permanent cognitive absorption.",
  },
];

const ANALYTICS_SUITE_TABS = [
  {
    id: "macro" as const,
    num: "1",
    label: "Macro Overview",
    subtitle: "समग्र विश्लेषण",
    subtitleEn: "Overall Analysis",
    icon: Target,
    desc: "🎯 समग्र विश्लेषण • आपकी कुल तैयारी, 5-D रडार, बोर्ड रेडीनेस व AI स्टडी टाइमटेबल",
    descEn: "🎯 Overall Analysis • Exam Readiness, 5-D Radar, Blueprint & Timetable",
  },
  {
    id: "micro" as const,
    num: "2",
    label: "Micro Overview",
    subtitle: "गलतियों का विश्लेषण",
    subtitleEn: "Error Diagnostics",
    icon: Crosshair,
    desc: "🔬 माइक्रो विश्लेषण • सिली मिस्टेक व ट्रैप्स वर्गीकरण मैट्रिक्स",
    descEn: "🔬 Micro Diagnostics • Silly Mistakes & Exam Trap Classification",
  },
  {
    id: "retention" as const,
    num: "3",
    label: "Memory Decay",
    subtitle: "स्मृति व रिवीज़न",
    subtitleEn: "Retention & Revision",
    icon: Hourglass,
    desc: "🧠 मेमोरी व रिवीज़न • एबिंगहॉस फॉरगेटिंग कर्व व स्मार्ट फ़्लैशकार्ड्स",
    descEn: "🧠 Retention & Revision • Ebbinghaus Forgetting Curve & Spaced Repetition",
  },
  {
    id: "agility" as const,
    num: "4",
    label: "Agility & Stamina",
    subtitle: "गति व स्टैमिना",
    subtitleEn: "Speed & Stamina",
    icon: Gauge,
    desc: "⚡ गति व स्टैमिना • स्पीड-एक्यूरेसी 4-क्वाड्रेंट व थकान प्रोग्रेशन",
    descEn: "⚡ Speed & Stamina • Speed vs Accuracy Matrix & Cognitive Fatigue Curve",
  },
  {
    id: "curriculum" as const,
    num: "5",
    label: "Syllabus Radar",
    subtitle: "80/20 वेटेज",
    subtitleEn: "80/20 Weightage",
    icon: Compass,
    desc: "🗺️ सिलेबस व वेटेज • 80/20 उच्च-प्राथमिकता वाले चैप्टर्स व ब्लाइंडस्पॉट्स",
    descEn: "🗺️ Syllabus & Weightage • 80/20 High-Yield Chapters & Blindspots",
  },
  {
    id: "prerequisites" as const,
    num: "6",
    label: "Prereq Graph",
    subtitle: "बुनियादी कमियाँ",
    subtitleEn: "Foundational Gaps",
    icon: GitFork,
    desc: "🔗 प्रिरिक्विज़िट ट्री • बुनियादी समझ व फाउंडेशन गैप्स ट्रैकर",
    descEn: "🔗 Prerequisite Tree • Conceptual Foundations & Root Gap Tracker",
  },
  {
    id: "sprint" as const,
    num: "7",
    label: "Speed Sprint",
    subtitle: "टाइम-पेसिंग टेस्ट",
    subtitleEn: "Time-Pacing Test",
    icon: Gauge,
    desc: "⏱️ स्पीड स्प्रिंट • परीक्षा टाइम-पेसिंग व पैनिक-फ्री टाइमर टेस्ट",
    descEn: "⏱️ Speed Sprint • Exam Time-Pacing & 7-Day Board Score Booster",
  },
];

interface BoardSnapshot {
  id: string;
  snapshotId: string;
  userId: string;
  topicTitle: string;
  description: string;
  imgData: string; // Base64 Compressed Image
  timestamp: any;
  subject?: string;
  grade?: string;
  topicIndex?: number;
}

interface StudentAccountHubProps {
  onClose: () => void;
  studentName: string;
  grade: string;
  subject: string;
  board?: string;
  mediumOfLearning?: string;
  totalSessionsCount?: number;
  onRefreshProfile?: () => void;
  onSignOut?: () => void;
  customBoardContent?: string;
  pastSessions?: any[];
  sessionSnapshots?: any[];
  topics?: string[];
  activeTopicIndex?: number;
  topicBoardsContent?: Record<number, string>;
  sessionId?: string | null;
  activeDocument?: any;
  onEnterClassroom?: () => void;
  onDiscussWithCherry?: (topicDetails: {
    topic: string;
    question?: string;
    answer?: string;
    hint?: string;
    conceptTested?: string;
    subject?: string;
  }) => void;
}

const escapeHTML = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const sanitizeTitleForPDF = (
  title: string,
  fallbackSubject?: string,
  topicList?: string[],
): string => {
  let firstTopicHeader = "";
  if (topicList && topicList.length > 0) {
    firstTopicHeader = (topicList[0].split("\n")[0] || "")
      .replace(/[#*_]/g, "")
      .replace(/\.(md|markdown|txt|pdf|docx|jpg|jpeg|png|webp|gif)\b/gi, "")
      .trim();
  }

  if (!title) {
    if (firstTopicHeader) {
      return fallbackSubject
        ? `${fallbackSubject} • ${firstTopicHeader}`
        : firstTopicHeader;
    }
    return fallbackSubject
      ? `${fallbackSubject} Classroom Notes`
      : "Classroom Lecture Notes";
  }

  let clean = (title || "")
    .trim()
    .replace(/\.(md|markdown|txt|pdf|docx|jpg|jpeg|png|webp|gif)$/i, "")
    .replace(/\.(md|markdown|txt|pdf|docx|jpg|jpeg|png|webp|gif)\b/gi, "")
    .replace(/^["']|["']$/g, "")
    .replace(/[\_]/g, " ")
    .trim();

  const isRawFileId =
    /^\d{8,}$/.test(clean) ||
    (clean.length > 20 && /^[0-9a-fA-F\-]+$/.test(clean));

  if (isRawFileId) {
    if (firstTopicHeader) {
      return fallbackSubject
        ? `${fallbackSubject} • ${firstTopicHeader}`
        : firstTopicHeader;
    }
    return fallbackSubject
      ? `${fallbackSubject} Lecture Handout`
      : "Classroom Study Handout";
  }

  return clean;
};

const compileWhiteboardToHTML = (markdown: string): string => {
  if (!markdown || !markdown.trim()) {
    return `<div style="text-align: center; color: #94a3b8; font-family: sans-serif; padding: 20px; font-size: 12px; font-style: italic; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px dashed rgba(255,255,255,0.12);">No blackboard notes written on this topic yet.</div>`;
  }

  // 1. Strip <board> and </board> tags & markdown code block fences wrapping SVG/diagrams
  let cleaned = markdown
    .replace(/<\/?board>/gi, "")
    .replace(/```(?:xml|html|svg|markdown|text|latex|math)?/gi, "")
    .replace(/```/g, "")
    .trim();

  // Convert geometric LaTeX macros to high-fidelity Unicode symbols
  cleaned = cleaned
    .replace(/\\{1,4}hexagon\b/g, "⬡")
    .replace(/\\{1,4}pentagon\b/g, "⬠")
    .replace(/\\{1,4}octagon\b/g, "⯃")
    .replace(/\\{1,4}heptagon\b/g, "⬡")
    .replace(/\\{1,4}triangle\b/g, "△")
    .replace(/\\{1,4}square\b/g, "☐")
    .replace(/\\{1,4}circle\b/g, "◯")
    .replace(/\\{1,4}bigcirc\b/g, "◯")
    .replace(/\\{1,4}rectangle\b/g, "▭")
    .replace(/\\{1,4}parallelogram\b/g, "▱")
    .replace(/\\{1,4}trapezoid\b/g, "⏢")
    .replace(/\\{1,4}kite\b/g, "⬨")
    .replace(/\\{1,4}rhombus\b/g, "◊");

  // Pre-normalize LaTeX markdown delimiters to standard $ and $$ for easier matching
  let normalized = cleaned
    .replace(/\\\[/g, "$$")
    .replace(/\\\]/g, "$$")
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$");

  // Helper to format an SVG or parametric diagram cleanly into a printable PDF container
  const formatSvgForPDF = (rawSvgOrDiagram: string): string => {
    try {
      let processed = rawSvgOrDiagram.trim();
      if (!processed) return "";

      // 1. Resolve parametric <diagram> or <primitive> tags instantly
      if (
        processed.toLowerCase().includes("<diagram") ||
        processed.toLowerCase().includes("<primitive")
      ) {
        const primitiveSvg = parseAndRenderDiagramTag(processed);
        if (primitiveSvg) {
          processed = primitiveSvg;
        }
      }

      // 2. Auto-close unclosed <svg> tag if cut off
      if (
        processed.toLowerCase().includes("<svg") &&
        !processed.toLowerCase().includes("</svg>")
      ) {
        processed = processed + "\n</svg>";
      }

      // 3. Ensure viewBox exists if missing
      if (!processed.includes("viewBox") && !processed.includes("viewbox")) {
        processed = processed.replace(/<svg/i, "<svg viewBox='0 0 400 250'");
      }

      // 4. Ensure SVG is responsive and max-width constrained for PDF print
      processed = processed.replace(
        /\b(width|height)\s*=\s*(['"])[^'"]*\2/gi,
        "",
      );
      processed = processed.replace(
        /<svg([^>]*)>/i,
        `<svg$1 width="100%" height="auto" style="max-height: 280px; max-width: 520px; margin: 0 auto; display: block;">`,
      );

      // 5. Clean LaTeX formulas inside <text> / <tspan> if present
      processed = processed.replace(
        /<tspan\b([^>]*)>([\s\S]*?)<\/tspan>/gi,
        (match, attrs, content) => {
          return `<tspan${attrs}>${content
            .replace(/\\vec\{([a-zA-Z0-9]+)\}/g, "$1→")
            .replace(/\\([a-zA-Z]+)/g, "$1")
            .replace(/[{}]/g, "")}</tspan>`;
        },
      );
      processed = processed.replace(
        /<text\b([^>]*)>([\s\S]*?)<\/text>/gi,
        (match, attrs, content) => {
          return `<text${attrs}>${content
            .replace(/\\vec\{([a-zA-Z0-9]+)\}/g, "$1→")
            .replace(/\\([a-zA-Z]+)/g, "$1")
            .replace(/[{}]/g, "")}</text>`;
        },
      );

      const safeSvg = sanitizeSvg(processed);

      return `
        <div class="vector-diagram-pdf-card" style="margin: 16px auto; padding: 14px; background: #061c18; border: 1.5px solid rgba(103, 232, 249, 0.4); border-radius: 12px; text-align: center; page-break-inside: avoid; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.25); -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;">
          <div style="font-size: 9.5px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #67e8f9; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; text-align: left; display: flex; align-items: center; gap: 6px;">
            <span>📐 Blackboard Vector Diagram</span>
          </div>
          <div class="vector-svg-stage" style="display: flex; justify-content: center; align-items: center; width: 100%;">
            ${safeSvg}
          </div>
        </div>
      `;
    } catch (err) {
      console.error("formatSvgForPDF error:", err);
      return "";
    }
  };

  // 2. Extract SVG and Diagram blocks first and replace with unique atomic placeholders
  const svgBlocks: string[] = [];
  let tokenized = "";
  let remaining = normalized;

  while (remaining.length > 0) {
    const lower = remaining.toLowerCase();
    const svgIdx = lower.indexOf("<svg");
    const diagIdx = lower.indexOf("<diagram");
    const primIdx = lower.indexOf("<primitive");

    const validIndices = [svgIdx, diagIdx, primIdx].filter((i) => i !== -1);
    if (validIndices.length === 0) {
      tokenized += remaining;
      break;
    }

    const matchIdx = Math.min(...validIndices);
    if (matchIdx > 0) {
      tokenized += remaining.slice(0, matchIdx);
    }

    const rest = remaining.slice(matchIdx);
    const restLower = rest.toLowerCase();

    if (restLower.startsWith("<svg")) {
      const closeIdx = restLower.indexOf("</svg>");
      if (closeIdx !== -1) {
        const svgContent = rest.slice(0, closeIdx + 6);
        const blockPlaceholder = `\n\n@@SVG_BLOCK_${svgBlocks.length}@@\n\n`;
        svgBlocks.push(formatSvgForPDF(svgContent));
        tokenized += blockPlaceholder;
        remaining = rest.slice(closeIdx + 6);
      } else {
        // Unclosed <svg>
        const blockPlaceholder = `\n\n@@SVG_BLOCK_${svgBlocks.length}@@\n\n`;
        svgBlocks.push(formatSvgForPDF(rest));
        tokenized += blockPlaceholder;
        break;
      }
    } else {
      // <diagram> or <primitive>
      const closeTagIdx = rest.indexOf(">");
      if (closeTagIdx !== -1) {
        const tagContent = rest.slice(0, closeTagIdx + 1);
        const blockPlaceholder = `\n\n@@SVG_BLOCK_${svgBlocks.length}@@\n\n`;
        svgBlocks.push(formatSvgForPDF(tagContent));
        tokenized += blockPlaceholder;
        remaining = rest.slice(closeTagIdx + 1);
      } else {
        const blockPlaceholder = `\n\n@@SVG_BLOCK_${svgBlocks.length}@@\n\n`;
        svgBlocks.push(formatSvgForPDF(rest));
        tokenized += blockPlaceholder;
        break;
      }
    }
  }

  // 3. Split content by display math blocks and SVG placeholders
  const blockRegex =
    /(@@SVG_BLOCK_\d+@@|\$\$[\s\S]*?\$\$|\\begin\s*\{\s*[a-zA-Z*]+\s*\}[\s\S]*?\\end\s*\{\s*[a-zA-Z*]+\s*\})/gi;
  const parts = tokenized.split(blockRegex);

  let htmlResult = "";

  parts.forEach((part) => {
    const trimmed = part.trim();
    if (!trimmed) return;

    // Check if SVG block placeholder
    const svgMatch = trimmed.match(/^@@SVG_BLOCK_(\d+)@@$/);
    if (svgMatch) {
      const blockIndex = parseInt(svgMatch[1], 10);
      if (svgBlocks[blockIndex]) {
        htmlResult += svgBlocks[blockIndex];
      }
      return;
    }

    const isBlockMath =
      (trimmed.startsWith("$$") && trimmed.endsWith("$$")) ||
      /^\\begin\s*\{\s*[a-zA-Z*]+\s*\}/i.test(trimmed);

    if (isBlockMath) {
      const isEnv = /^\\begin\s*\{\s*[a-zA-Z*]+\s*\}/i.test(trimmed);
      let formula = isEnv ? trimmed : trimmed.slice(2, -2).trim();

      // Clean up double-backslashes inside formulas (preventing duplicate escaping)
      formula = formula.replace(/\\\\([a-zA-Z]+)/g, "\\$1");
      formula = formula.replace(/\\\\([{}_^#&%|()[\]])/g, "\\$1");
      // Normalize spaces inside \begin / \end{
      formula = formula.replace(
        /\\begin\s*\{\s*([a-zA-Z*]+)\s*\}/gi,
        "\\begin{$1}",
      );
      formula = formula.replace(
        /\\end\s*\{\s*([a-zA-Z*]+)\s*\}/gi,
        "\\end{$1}",
      );

      try {
        const formulaHtml = katex.renderToString(formula, {
          displayMode: true,
          throwOnError: false,
        });
        htmlResult += `
          <div class="block-math-pdf-container">
            ${formulaHtml}
          </div>
        `;
      } catch (err) {
        htmlResult += `<div class="error-math-pdf">${escapeHTML(formula)}</div>`;
      }
    } else {
      // Process lines for regular text, headings, lists, and inline math
      const lines = part.split(/\n+/);
      lines.forEach((line) => {
        let trimmedLine = line.trim();
        if (!trimmedLine) return;

        // Check if standalone SVG placeholder in line
        const inlineSvgMatch = trimmedLine.match(/^@@SVG_BLOCK_(\d+)@@$/);
        if (inlineSvgMatch) {
          const blockIndex = parseInt(inlineSvgMatch[1], 10);
          if (svgBlocks[blockIndex]) {
            htmlResult += svgBlocks[blockIndex];
          }
          return;
        }

        // Convert HEADING: and SUB-HEADING: prefixes (supporting markdown bold/italic variants) to standard headings
        const rawCleanPrefix = trimmedLine.replace(/^[*_~`#\s]+/, "");
        if (
          /^(HEADING|TITLE|MAIN HEADING|MAIN TITLE|TOPIC|MAIN TOPIC|TOPIC HEADING)\s*(1|2)?\s*:\s*/i.test(
            rawCleanPrefix,
          )
        ) {
          const titleContent = rawCleanPrefix
            .replace(
              /^(HEADING|TITLE|MAIN HEADING|MAIN TITLE|TOPIC|MAIN TOPIC|TOPIC HEADING)\s*(1|2)?\s*:\s*/i,
              "",
            )
            .replace(/[*_~`]+$/, "")
            .trim();
          trimmedLine = `### ${titleContent}`;
        } else if (
          /^(SUB-HEADING|SUBHEADING|SUB\s*HEADING|SUB-TITLE|SUBTITLE|SUB\s*TITLE|SUB-TOPIC|SUBTOPIC|SUB\s*TOPIC)\s*(1|2)?\s*:\s*/i.test(
            rawCleanPrefix,
          )
        ) {
          const subTitleContent = rawCleanPrefix
            .replace(
              /^(SUB-HEADING|SUBHEADING|SUB\s*HEADING|SUB-TITLE|SUBTITLE|SUB\s*TITLE|SUB-TOPIC|SUBTOPIC|SUB\s*TOPIC)\s*(1|2)?\s*:\s*/i,
              "",
            )
            .replace(/[*_~`]+$/, "")
            .trim();
          trimmedLine = `#### ${subTitleContent}`;
        }

        // Check if line is a bullet/list item
        const isBullet =
          trimmedLine.startsWith("-") ||
          trimmedLine.startsWith("*") ||
          trimmedLine.startsWith("•");
        // Check if line is a definition list item (contains ":" or labels like "🌟")
        const isDefinition =
          trimmedLine.includes(":") &&
          (trimmedLine.startsWith("🌟") ||
            trimmedLine.startsWith("💡") ||
            trimmedLine.startsWith("📌"));
        // Check if heading
        const isSubHeading = trimmedLine.startsWith("####");
        const isHeading =
          trimmedLine.startsWith("📌") ||
          trimmedLine.startsWith("#") ||
          trimmedLine.startsWith("###");

        // Parse inline math $...$
        let parsedLine = trimmedLine;

        // Find $...$ inline math segments
        const inlineMathRegex = /\$([\s\S]*?)\$/g;
        parsedLine = parsedLine.replace(inlineMathRegex, (match, formula) => {
          try {
            return katex.renderToString(formula, {
              displayMode: false,
              throwOnError: false,
            });
          } catch {
            return match;
          }
        });

        // Parse Markdown formatting like bold **...** and italics _..._ / *...*
        parsedLine = parsedLine.replace(
          /\*\*(.*?)\*\*/g,
          "<strong>$1</strong>",
        );
        parsedLine = parsedLine.replace(/_([^_]+)_/g, "<em>$1</em>");
        parsedLine = parsedLine.replace(/`([^`]+)`/g, "<code>$1</code>");

        if (isSubHeading) {
          const subHeadingText = parsedLine.replace(/^####\s*/g, "").trim();
          htmlResult += `<h4 class="subheading-pdf" style="color: #67e8f9; font-size: 12.5px; font-weight: 700; margin-top: 12px; margin-bottom: 6px; font-family: 'Space Grotesk', sans-serif; letter-spacing: 0.2px;">🔹 ${subHeadingText}</h4>`;
        } else if (isHeading) {
          const headingText = parsedLine.replace(/^📌|^#+\s*/g, "").trim();
          const cleanHeading = headingText.toLowerCase();

          let headingColor = "#fbbf24"; // Rich warm gold default for headings
          if (
            cleanHeading.includes("formula") ||
            cleanHeading.includes("equation") ||
            cleanHeading.includes("math") ||
            cleanHeading.includes("variable")
          ) {
            headingColor = "#bae6fd"; // Pastel sky-blue
          } else if (
            cleanHeading.includes("tip") ||
            cleanHeading.includes("exam") ||
            cleanHeading.includes("warning")
          ) {
            headingColor = "#fca5a5"; // Pastel pink
          }

          htmlResult += `<h3 class="heading-pdf" style="color: ${headingColor}; border-bottom: 1px solid ${headingColor}30; font-size: 14px; font-weight: 800; padding-bottom: 3px; margin-top: 14px; margin-bottom: 8px; font-family: 'Space Grotesk', sans-serif; letter-spacing: 0.3px;">📌 ${headingText}</h3>`;
        } else if (isDefinition) {
          const colonIdx = parsedLine.indexOf(":");
          const label = parsedLine.substring(0, colonIdx).trim();
          const detail = parsedLine.substring(colonIdx + 1).trim();

          const cleanLabel = label.toLowerCase();
          let borderCol = "#fbbf24"; // Rich warm gold
          let bgCol = "rgba(251, 191, 36, 0.08)";
          let txtCol = "#fbbf24";
          let emoji = "🌟";

          if (
            /^(warning|alert|tip|hint|exam\s*tip|instruction|danger|attention|caution|error|question|answer|exercise|problem|चेतावनी|सुझाव|प्रश्न|उत्तर)$/i.test(
              cleanLabel,
            ) ||
            cleanLabel.includes("tip") ||
            cleanLabel.includes("warning") ||
            cleanLabel.includes("attention") ||
            cleanLabel.includes("danger")
          ) {
            borderCol = "#fca5a5"; // Pink
            bgCol = "rgba(252, 165, 165, 0.05)";
            txtCol = "#fca5a5";
            emoji = "🌸";
          } else if (
            /^(formula|equation|theorem|lemma|corollary|proof|identity|variable|math|physics|equation|maths|सूत्र|समीकरण)$/i.test(
              cleanLabel,
            ) ||
            cleanLabel.includes("formula") ||
            cleanLabel.includes("equation") ||
            cleanLabel.includes("theorem")
          ) {
            borderCol = "#bae6fd"; // Sky-Blue
            bgCol = "rgba(186, 230, 253, 0.05)";
            txtCol = "#bae6fd";
            emoji = "📐";
          }

          htmlResult += `
            <div class="def-pdf-card" style="border-left-color: ${borderCol}; background-color: ${bgCol}; margin-bottom: 8px;">
              <span class="def-pdf-label" style="color: ${txtCol};">${emoji} ${label}</span>
              <span class="def-pdf-detail">${detail}</span>
            </div>
          `;
        } else if (isBullet) {
          const bulletText = parsedLine.replace(/^[-*•]\s*/, "").trim();
          if (
            bulletText &&
            bulletText !== "--" &&
            bulletText !== "---" &&
            bulletText !== "-" &&
            bulletText !== "—"
          ) {
            htmlResult += `<li class="bullet-pdf" style="margin-bottom: 4px;">${bulletText}</li>`;
          }
        } else {
          if (
            parsedLine !== "--" &&
            parsedLine !== "---" &&
            parsedLine !== "-"
          ) {
            htmlResult += `<p class="paragraph-pdf" style="margin-bottom: 8px;">${parsedLine}</p>`;
          }
        }
      });
    }
  });

  return htmlResult;
};

const renderTextWithKaTeX = (
  text: string,
  search?: string,
): React.ReactNode[] => {
  if (!text) return [];

  // Normalize latex delimiters
  let normalized = text
    .replace(/\\\[/g, "$$")
    .replace(/\\\]/g, "$$")
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$");

  const regex = /(\$\$[\s\S]*?\External?\$\$|\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
  const standardRegex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
  const parts = normalized.split(standardRegex);

  return parts.map((part, index) => {
    const trimmed = part.trim();
    if (!trimmed) return <span key={index}>{part}</span>;

    const isDisplayMath = trimmed.startsWith("$$") && trimmed.endsWith("$$");
    const isInlineMath = trimmed.startsWith("$") && trimmed.endsWith("$");

    if (isDisplayMath) {
      const formula = trimmed.slice(2, -2).trim();
      try {
        const html = katex.renderToString(formula, {
          displayMode: true,
          throwOnError: false,
        });
        return (
          <div
            key={index}
            className="my-2.5 overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-800 scrollbar-track-transparent"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (err) {
        return (
          <code
            key={index}
            className="block text-red-500 bg-red-50 p-2 rounded text-[10px]"
          >
            {formula}
          </code>
        );
      }
    } else if (isInlineMath) {
      const formula = trimmed.slice(1, -1).trim();
      try {
        const html = katex.renderToString(formula, {
          displayMode: false,
          throwOnError: false,
        });
        return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
      } catch (err) {
        return (
          <code
            key={index}
            className="text-red-500 bg-red-50 px-1 rounded text-[10px]"
          >
            {formula}
          </code>
        );
      }
    }

    if (search && search.trim()) {
      const cleanSearch = search
        .trim()
        .replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"); // escape regex
      const highlightRegex = new RegExp(`(${cleanSearch})`, "gi");
      const textParts = part.split(highlightRegex);
      return (
        <span key={index}>
          {textParts.map((tPart, tIdx) =>
            highlightRegex.test(tPart) ? (
              <mark
                key={tIdx}
                className="bg-yellow-200 text-slate-900 font-extrabold rounded-xs px-0.5 shadow-xs border border-yellow-300/30"
              >
                {tPart}
              </mark>
            ) : (
              tPart
            ),
          )}
        </span>
      );
    }

    return <span key={index}>{part}</span>;
  });
};

// KaTeX HTML rendering memoization cache for ultra-smooth UI transitions
const katexRenderCache: Record<string, string> = {};
const renderKaTeXHtmlSafe = (formulaStr?: string): string => {
  if (!formulaStr) return "";
  if (katexRenderCache[formulaStr]) return katexRenderCache[formulaStr];
  try {
    const rendered = katex.renderToString(formulaStr, {
      displayMode: false,
      throwOnError: false,
    });
    katexRenderCache[formulaStr] = rendered;
    return rendered;
  } catch {
    return formulaStr;
  }
};

export const StudentAccountHub: React.FC<StudentAccountHubProps> = ({
  onClose,
  studentName,
  grade,
  subject,
  board = "CBSE",
  mediumOfLearning = "Hinglish",
  totalSessionsCount = 0,
  onRefreshProfile,
  customBoardContent = "",
  pastSessions = [],
  sessionSnapshots = [],
  topics = [],
  activeTopicIndex = 0,
  topicBoardsContent = {},
  sessionId = null,
  activeDocument = null,
  onEnterClassroom,
  onDiscussWithCherry,
  onSignOut,
}) => {
  const t = getTranslations(mediumOfLearning);
  const isEnglish = (mediumOfLearning || "").trim().toLowerCase() === "english";

  // Compact single-line labels for mobile header tabs (Option 1)
  const mobileKiaraLabel = useMemo(
    () =>
      t.kiaraTab
        .replace(/ (Counselor|काउंसलर|কাউন্সেলর|କାଉନସିଲର୍|समुपदेशक)/i, "")
        .trim(),
    [t.kiaraTab],
  );
  const mobileAnalyticsLabel = useMemo(
    () =>
      t.performanceTab
        .replace(/(Performance|परफॉर्मेंस|পারফরম্যান্স|ପ୍ରଦର୍ଶନ|कामगिरी) /i, "")
        .trim(),
    [t.performanceTab],
  );
  const mobileBooksLabel = useMemo(
    () =>
      t.booksTab
        .replace(/(Study|स्टडी|স্টাডি|ପାଠ୍ୟ|अभ्यास) /i, "")
        .trim(),
    [t.booksTab],
  );
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [snapshots, setSnapshots] = useState<BoardSnapshot[]>([]);
  const [activeDesktopTab, setActiveDesktopTab] = useState<
    "books" | "stats" | "counselor" | "referral"
  >("stats");
  const [activeDimensionIndex, setActiveDimensionIndex] = useState<number>(0);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [isKiaraVoiceModalOpen, setIsKiaraVoiceModalOpen] =
    useState<boolean>(false);
  const [isKiaraFullScreenOpen, setIsKiaraFullScreenOpen] =
    useState<boolean>(false);
  const [kiaraVoiceInitialTopic, setKiaraVoiceInitialTopic] =
    useState<string>("");

  // Phase 1: Micro-Diagnostics & Mistake Matrix States
  const [performanceWorkspaceTab, setPerformanceWorkspaceTab] = useState<
    | "macro"
    | "micro"
    | "retention"
    | "agility"
    | "curriculum"
    | "prerequisites"
    | "sprint"
  >("macro");

  // Phase 3: Cognitive Agility, Speed-Accuracy Matrix & Exam Stamina States
  const [staminaQuadrantFilter, setStaminaQuadrantFilter] = useState<
    "all" | "flow" | "overthink" | "rushing" | "roadblock"
  >("all");
  const [staminaActiveSubject, setStaminaActiveSubject] =
    useState<string>("all");
  const [selectedAgilityDrillTopic, setSelectedAgilityDrillTopic] = useState<
    any | null
  >(null);
  const [activeSprintSeconds, setActiveSprintSeconds] = useState<number>(60);
  const [isSprintRunning, setIsSprintRunning] = useState<boolean>(false);
  const [sprintStepIndex, setSprintStepIndex] = useState<number>(0);
  const [sprintScore, setSprintScore] = useState<number>(0);

  // Phase 2: Spaced Repetition & Retention States
  const [retentionFilterUrgency, setRetentionFilterUrgency] = useState<
    "all" | "critical" | "warning" | "stable"
  >("all");
  const [retentionActiveSubject, setRetentionActiveSubject] =
    useState<string>("all");
  const [retentionViewMode, setRetentionViewMode] = useState<
    "carousel" | "list"
  >("carousel");
  const [staminaViewMode, setStaminaViewMode] = useState<"carousel" | "list">(
    "carousel",
  );
  const [selectedRetentionFlashcard, setSelectedRetentionFlashcard] = useState<
    any | null
  >(null);
  const [activeFlashcardFlipped, setActiveFlashcardFlipped] =
    useState<boolean>(false);
  const [microSubjectFilter, setMicroSubjectFilter] = useState<string>("all");
  const [microMasteryFilter, setMicroMasteryFilter] = useState<
    "all" | "critical" | "practicing" | "mastered"
  >("all");
  const [microMistakeFilter, setMicroMistakeFilter] = useState<
    "all" | "conceptual" | "calculation" | "formula" | "speed"
  >("all");
  const [microSearchQuery, setMicroSearchQuery] = useState<string>("");
  const [microViewMode, setMicroViewMode] = useState<"carousel" | "list">(
    "carousel",
  );
  const [selectedDrillSubtopic, setSelectedDrillSubtopic] = useState<
    any | null
  >(null);

  // Overhauled Archived PDF system core states
  const [bookHubActiveTab, setBookHubActiveTab] = useState<"books" | "slates">(
    "books",
  );
  const [archiveSearchQuery, setArchiveSearchQuery] = useState("");
  const [selectedBookSubjectFilter, setSelectedBookSubjectFilter] =
    useState<string>("all");
  const [booksViewMode, setBooksViewMode] = useState<"grid" | "carousel">(
    "grid",
  );
  const [bookSortOrder, setBookSortOrder] = useState<
    "newest" | "oldest" | "title" | "topics"
  >("newest");
  const booksScrollContainerRef = React.useRef<HTMLDivElement>(null);
  const bookSearchInputRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for quick library search (Press "/" or "Ctrl+K")
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        activeDesktopTab === "books" &&
        (e.key === "/" ||
          ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"))
      ) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== "input" && activeTag !== "textarea") {
          e.preventDefault();
          bookSearchInputRef.current?.focus();
          bookSearchInputRef.current?.select();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeDesktopTab]);
  const statsScrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Smooth scroll to top when switching analytics sub-tabs (Macro / Micro / Retention / Agility)
  useEffect(() => {
    if (statsScrollContainerRef.current) {
      statsScrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [performanceWorkspaceTab]);
  const [currentBookHorizontalIndex, setCurrentBookHorizontalIndex] =
    useState(0);

  // In-App Quick Reader Modal States
  const [selectedBookForReader, setSelectedBookForReader] = useState<
    any | null
  >(null);
  const [readerActiveTopicIndex, setReaderActiveTopicIndex] =
    useState<number>(0);
  const [readerTheme, setReaderTheme] = useState<"chalkboard" | "paper">(
    "chalkboard",
  );
  const [readerCopied, setReaderCopied] = useState<boolean>(false);

  // Starred / Favorite Books (Persisted)
  const [starredBookIds, setStarredBookIds] = useState<Record<string, boolean>>(
    () => {
      try {
        const saved =
          typeof window !== "undefined"
            ? localStorage.getItem("cherry_starred_books")
            : null;
        return saved ? JSON.parse(saved) : {};
      } catch (_) {
        return {};
      }
    },
  );

  const toggleStarBook = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStarredBookIds((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem("cherry_starred_books", JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  // TTS Speech Narration State
  const [speakingCardId, setSpeakingCardId] = useState<string | null>(null);

  const handleSpeakText = (
    text: string,
    cardId: string,
    e?: React.MouseEvent,
  ) => {
    if (e) e.stopPropagation();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingCardId === cardId) {
      window.speechSynthesis.cancel();
      setSpeakingCardId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/\\\[|\\\]|\\\(/g, "")
      .replace(/\$\$/g, "")
      .replace(/\$/g, "")
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "$1 over $2")
      .replace(/\\cdot/g, " times ")
      .replace(/\\times/g, " times ")
      .replace(/\\pm/g, " plus or minus ")
      .replace(/\\approx/g, " approximately ")
      .replace(/\\neq/g, " not equal to ")
      .replace(/\\le/g, " less than or equal to ")
      .replace(/\\ge/g, " greater than or equal to ")
      .replace(/\\theta/g, " theta ")
      .replace(/\\pi/g, " pi ")
      .replace(/[\#\*\_]/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onend = () => setSpeakingCardId(null);
    utterance.onerror = () => setSpeakingCardId(null);
    setSpeakingCardId(cardId);
    window.speechSynthesis.speak(utterance);
  };

  // Quick Practice Quiz States
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizCurrentIndex, setQuizCurrentIndex] = useState<number>(0);

  // Phase 4 States: Official Report Card Modal & Weekly Study Timetable Planner
  const [isReportCardModalOpen, setIsReportCardModalOpen] =
    useState<boolean>(false);
  const [activePlannerDayIndex, setActivePlannerDayIndex] = useState<number>(0);
  const [completedPlannerTasks, setCompletedPlannerTasks] = useState<
    Record<string, boolean>
  >(() => {
    try {
      const saved =
        typeof window !== "undefined"
          ? localStorage.getItem("cherry_study_planner_tasks")
          : null;
      return saved ? JSON.parse(saved) : {};
    } catch (_) {
      return {};
    }
  });

  const togglePlannerTask = (taskId: string) => {
    setCompletedPlannerTasks((prev) => {
      const updated = { ...prev, [taskId]: !prev[taskId] };
      try {
        localStorage.setItem(
          "cherry_study_planner_tasks",
          JSON.stringify(updated),
        );
      } catch (_) {}
      return updated;
    });
  };

  // Phase 4: Batch Export Snapshots Album in Markdown/HTML
  const handleBatchExportSnapshotsMarkdown = () => {
    const list = snapshots && snapshots.length > 0 ? snapshots : [];
    if (list.length === 0) return;

    let md = `# 📸 Blackboard Derivations & Chalkboard Slates Album\n\n`;
    md += `*Student: ${studentName || "Scholar"} | Grade: ${grade || "Class 10"} | Board: ${board || "CBSE"} | Subject: ${subject || "Mathematics"}*\n`;
    md += `*Generated via Cherry AI Socratic Classroom on ${new Date().toLocaleDateString()}*\n\n`;
    md += `---\n\n`;

    list.forEach((snap, idx) => {
      md += `## Slide ${idx + 1}: ${snap.topicTitle || "Lecture Derivation"}\n`;
      md += `**Subject**: ${snap.subject || subject || "Science"} | **Timestamp**: ${new Date(snap.timestamp).toLocaleString()}\n\n`;
      if (snap.description) {
        md += `> ${snap.description}\n\n`;
      }
      if (
        snap.latexEquations &&
        Array.isArray(snap.latexEquations) &&
        snap.latexEquations.length > 0
      ) {
        md += `### Key Mathematical Formulas:\n`;
        snap.latexEquations.forEach((eq: string) => {
          md += `$$\n${eq}\n$$\n\n`;
        });
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Blackboard_Snapshots_Album_${(studentName || "Student").replace(/\s+/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Full Revision Study Pack Export Handler
  const handleExportStudyPack = () => {
    if (!activeRevisionSession || !revisionDeckData) return;
    const cards = revisionDeckData.flashcards || [];
    const nodes = revisionDeckData.mindMap?.nodes || [];
    const summary = revisionDeckData.summary || {};

    let markdown = `# ${activeRevisionSession.processedTitle || "Classroom Study Pack"}\n\n`;
    markdown += `*Subject: ${activeRevisionSession.inferredSubject || activeRevisionSession.subject || subject || "Science"} | Grade: Class ${activeRevisionSession.grade || grade || "10"} | Generated via Cherry Ma'am AI Classroom*\n\n`;
    markdown += `---\n\n## 📖 Executive Chapter Summary\n\n${summary.overview || activeRevisionSession.customBoardContent || "Comprehensive chapter overview notes."}\n\n`;

    if (
      summary.keyTakeaways &&
      Array.isArray(summary.keyTakeaways) &&
      summary.keyTakeaways.length > 0
    ) {
      markdown += `### 🌟 Key Takeaways\n\n`;
      summary.keyTakeaways.forEach((k: string) => {
        markdown += `- ${k}\n`;
      });
      markdown += `\n`;
    }

    if (nodes.length > 0) {
      markdown += `## 🧠 Mind Map Conceptual Hierarchy\n\n`;
      nodes.forEach((n: any, i: number) => {
        markdown += `### ${i + 1}. ${n.topicName || "Concept"}\n`;
        if (n.keyFormula)
          markdown += `- **Key Formula/Law**: ${n.keyFormula}\n`;
        if (n.examTip) markdown += `- **Board Exam Tip**: ${n.examTip}\n`;
        if (Array.isArray(n.coreConcepts || n.keyConcepts)) {
          (n.coreConcepts || n.keyConcepts).forEach((c: string) => {
            markdown += `- ${c}\n`;
          });
        }
        markdown += `\n`;
      });
    }

    if (cards.length > 0) {
      markdown += `## ❓ Active Recall Flashcards\n\n`;
      cards.forEach((c: any, i: number) => {
        markdown += `#### Card ${i + 1}: ${c.question}\n`;
        markdown += `**Answer**: ${c.answer}\n`;
        if (c.hint) markdown += `*Hint*: ${c.hint}\n`;
        markdown += `\n`;
      });
    }

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(activeRevisionSession.processedTitle || "Study_Pack").replace(/[^a-zA-Z0-9_-]/g, "_")}_Revision_Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper for 3D Book Spine and Radiant Subject Themes
  const getSubjectBookTheme = (subj: string) => {
    const s = (subj || "").toLowerCase();
    if (s.includes("math")) {
      return {
        name: "Mathematics",
        icon: "📐",
        spineBg: "from-[#022c22] via-[#064e3b] to-[#022c22]",
        spineBorder: "border-emerald-500/40",
        accentPillBg:
          "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        glowColor: "rgba(16, 185, 129, 0.15)",
        badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        gradientBar: "from-emerald-400 to-teal-500",
        pageEdge: "border-r-4 border-emerald-900/30",
        chalkAccent: "text-emerald-300",
        tagColor: "#34d399",
      };
    }
    if (s.includes("phys")) {
      return {
        name: "Physics",
        icon: "⚡",
        spineBg: "from-[#082f49] via-[#0369a1] to-[#082f49]",
        spineBorder: "border-sky-500/40",
        accentPillBg: "bg-sky-500/20 text-sky-300 border-sky-500/40",
        glowColor: "rgba(14, 165, 233, 0.15)",
        badgeBg: "bg-sky-50 text-sky-800 border-sky-200",
        gradientBar: "from-sky-400 to-blue-500",
        pageEdge: "border-r-4 border-sky-900/30",
        chalkAccent: "text-sky-300",
        tagColor: "#38bdf8",
      };
    }
    if (s.includes("chem")) {
      return {
        name: "Chemistry",
        icon: "🧪",
        spineBg: "from-[#451a03] via-[#78350f] to-[#451a03]",
        spineBorder: "border-amber-500/40",
        accentPillBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        glowColor: "rgba(245, 158, 11, 0.15)",
        badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
        gradientBar: "from-amber-400 to-orange-500",
        pageEdge: "border-r-4 border-amber-900/30",
        chalkAccent: "text-amber-300",
        tagColor: "#fbbf24",
      };
    }
    if (s.includes("bio")) {
      return {
        name: "Biology",
        icon: "🌱",
        spineBg: "from-[#064e3b] via-[#047857] to-[#064e3b]",
        spineBorder: "border-indigo-500/40",
        accentPillBg: "bg-indigo-50/700/20 text-indigo-300 border-indigo-500/40",
        glowColor: "rgba(20, 184, 166, 0.15)",
        badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
        gradientBar: "from-teal-400 to-emerald-500",
        pageEdge: "border-r-4 border-slate-800/30",
        chalkAccent: "text-indigo-300",
        tagColor: "#2dd4bf",
      };
    }
    return {
      name: subj || "Science",
      icon: "🔬",
      spineBg: "from-[#2e1065] via-[#581c87] to-[#2e1065]",
      spineBorder: "border-purple-500/40",
      accentPillBg: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      glowColor: "rgba(168, 85, 247, 0.15)",
      badgeBg: "bg-purple-50 text-purple-800 border-purple-200",
      gradientBar: "from-purple-400 to-indigo-500",
      pageEdge: "border-r-4 border-purple-900/30",
      chalkAccent: "text-purple-300",
      tagColor: "#c084fc",
    };
  };

  const handleBooksHorizontalScroll = (direction: "prev" | "next") => {
    if (!booksScrollContainerRef.current) return;
    const container = booksScrollContainerRef.current;
    const itemWidth = container.clientWidth;
    const newScrollLeft =
      direction === "next"
        ? container.scrollLeft + itemWidth
        : container.scrollLeft - itemWidth;
    container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  };

  const handleBooksScrollUpdate = () => {
    if (!booksScrollContainerRef.current) return;
    const container = booksScrollContainerRef.current;
    const itemWidth = container.clientWidth;
    if (itemWidth > 0) {
      const idx = Math.round(container.scrollLeft / itemWidth);
      setCurrentBookHorizontalIndex(
        Math.max(0, Math.min(idx, (filteredBooks.length || 1) - 1)),
      );
    }
  };

  // Helper to infer or normalize subject for chapter books
  const inferBookSubject = (sess: any): string => {
    if (
      sess.subject &&
      typeof sess.subject === "string" &&
      sess.subject.trim()
    ) {
      const s = sess.subject.trim();
      if (s.toLowerCase().includes("math")) return "Mathematics";
      if (s.toLowerCase().includes("phys")) return "Physics";
      if (s.toLowerCase().includes("chem")) return "Chemistry";
      if (s.toLowerCase().includes("bio")) return "Biology";
      if (s.toLowerCase().includes("sci")) return "Science";
      return s;
    }
    const chalkText =
      sess.customBoardContent ||
      (sess.topicBoardsContent
        ? Object.values(sess.topicBoardsContent).join(" ")
        : "");
    const text =
      `${sess.activeDocumentName || ""} ${sess.title || ""} ${(sess.topics || []).join(" ")} ${chalkText}`.toLowerCase();

    // Check Chemistry first so ammonia/haber/acids/reactions/compounds are accurately recognized
    if (
      text.match(
        /ammonia|haber|nh3|hydrochloric|nitric|sulfuric|acid|base|salt|bond|reaction|organic|element|periodic|chemical|equilibrium|solution|electrochem|compound|hybridization|carbon|metal|atom|redox|titration|precipitation|catalyst|oxidation|reduction|mole|molarity|alkali|alkaline|halogen|valency|isomerism|hydrocarbon|ester|aldehyde|ketone|polymer|le chatelier|exothermic|endothermic|solubility|odour|gas/,
      )
    ) {
      return "Chemistry";
    }
    if (
      text.match(
        /trigonometr|algebra|calculus|derivative|integral|differential|geometry|matrix|determinant|quadratic|arithmetic|probability|polynomial|height|distance|triangle|circle|vector|parabola|hyperbola|ellipse|coordinate|logarithm|permutation|combination|binomial|limit|continuity/,
      )
    ) {
      return "Mathematics";
    }
    if (
      text.match(
        /cell|plant|photosynthe|genetic|dna|rna|circulation|respiration|organism|biotech|ecolog|human|tissue|reproduction|heart|blood|neuron|brain|kidney|digestion|endocrine|hormone|chromosome|mitosis|meiosis|ecosystem|bacteria|virus|fungi|enzyme|chlorophyll|stomata/,
      )
    ) {
      return "Biology";
    }
    if (
      text.match(
        /kinematic|motion|gravity|force|newton|momentum|energy|work|power|ohm|current|optics|lens|mirror|thermodynamic|magnetic|electromagnet|wave|frequency|wavelength|friction|light|circuit|volt|ampere|refraction|reflection|capacit|resistor|inductor|photoelectric|nuclear|doppler|torque|rotational|fluids|pressure|buoyancy|snell/,
      )
    ) {
      return "Physics";
    }
    return subject || "Science";
  };

  // Processed list of past sessions + Active Learning Context
  const allBooks = useMemo(() => {
    // Check if there is an active document or active chalkboard session not yet present in pastSessions
    const activeCtx = getActiveLearningContext();
    const existingSessionIds = new Set(
      pastSessions.map((s) => s.sessionId).filter(Boolean),
    );
    const existingDocNames = new Set(
      pastSessions.map((s) => s.activeDocumentName).filter(Boolean),
    );

    let synthesizedActiveBooks: any[] = [];
    if (
      activeDocument &&
      (activeDocument.markdown || activeDocument.filename)
    ) {
      const docName = activeDocument.filename || "Active Study Document";
      if (
        !existingDocNames.has(docName) &&
        (!sessionId || !existingSessionIds.has(sessionId))
      ) {
        synthesizedActiveBooks.push({
          sessionId: sessionId || "active_live_session",
          isLiveActive: true,
          activeDocumentName: docName,
          activeDocumentMarkdown: activeDocument.markdown || "",
          documentMarkdown: activeDocument.markdown || "",
          sourceMode:
            activeDocument.mimeType === "video/youtube"
              ? "explainer_youtube"
              : "explainer_doc",
          subject: activeDocument.detectedSubject || subject,
          grade: grade,
          board: board,
          customBoardContent: customBoardContent || "",
          topicBoardsContent: topicBoardsContent,
          topics: topics && topics.length > 0 ? topics : [docName],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } else if (
      activeCtx &&
      (activeCtx.documentMarkdown || activeCtx.blackboardContent) &&
      activeCtx.sessionId &&
      !existingSessionIds.has(activeCtx.sessionId)
    ) {
      synthesizedActiveBooks.push({
        sessionId: activeCtx.sessionId,
        isLiveActive: true,
        activeDocumentName: activeCtx.title || "Active Learning Session",
        activeDocumentMarkdown: activeCtx.documentMarkdown || "",
        documentMarkdown: activeCtx.documentMarkdown || "",
        sourceMode: activeCtx.sourceMode || "live_blackboard",
        subject: activeCtx.subject || subject,
        grade: activeCtx.grade || grade,
        board: activeCtx.board || board,
        customBoardContent:
          activeCtx.blackboardContent || customBoardContent || "",
        topicBoardsContent: topicBoardsContent,
        topics:
          activeCtx.topics && activeCtx.topics.length > 0
            ? activeCtx.topics
            : topics || [],
        createdAt: activeCtx.lastUpdated || new Date().toISOString(),
        updatedAt: activeCtx.lastUpdated || new Date().toISOString(),
      });
    }

    const combinedList = [...synthesizedActiveBooks, ...pastSessions];

    return combinedList.map((sess, index) => {
      const originalTitle =
        sess.activeDocumentName ||
        sess.title ||
        `Class Lecture Hand-Handbook #${combinedList.length - index}`;
      const creationDate = sess.createdAt || sess.updatedAt;
      let dateString = sess.isLiveActive
        ? "🟢 Active Now (Live Context)"
        : "Recently Synced";
      if (creationDate && !sess.isLiveActive) {
        try {
          const date = creationDate.toDate
            ? creationDate.toDate()
            : new Date(
                creationDate.seconds
                  ? creationDate.seconds * 1000
                  : creationDate,
              );
          const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          const dayVal = String(date.getDate()).padStart(2, "0");
          const monthVal = months[date.getMonth()];
          const yearVal = date.getFullYear();
          let hours = date.getHours();
          const minutes = String(date.getMinutes()).padStart(2, "0");
          const ampm = hours >= 12 ? "PM" : "AM";
          hours = hours % 12;
          hours = hours ? hours : 12;
          const timeVal = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
          dateString = `${dayVal} ${monthVal} ${yearVal}, ${timeVal}`;
        } catch (e) {
          dateString = "Recently Synced";
        }
      }

      // Infer appropriate sourceMode
      const resolvedSourceMode =
        sess.sourceMode ||
        (sess.mimeType === "video/youtube" ||
        (sess.activeDocumentName && sess.activeDocumentName.includes("YouTube"))
          ? "explainer_youtube"
          : sess.documentMarkdown || sess.activeDocumentMarkdown
            ? "explainer_doc"
            : "live_blackboard");

      return {
        ...sess,
        processedTitle: originalTitle,
        formattedDateTime: dateString,
        index: combinedList.length - index,
        inferredSubject: inferBookSubject(sess),
        sourceMode: resolvedSourceMode,
        documentMarkdown:
          sess.documentMarkdown || sess.activeDocumentMarkdown || "",
        activeDocumentMarkdown:
          sess.activeDocumentMarkdown || sess.documentMarkdown || "",
      };
    });
  }, [
    pastSessions,
    subject,
    activeDocument,
    sessionId,
    customBoardContent,
    topicBoardsContent,
    topics,
    grade,
    board,
  ]);

  // Dynamic Subject Counts for Books Filter Tabs
  const bookSubjectCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allBooks.length,
      starred: 0,
      Mathematics: 0,
      Physics: 0,
      Chemistry: 0,
      Biology: 0,
      Science: 0,
    };
    allBooks.forEach((b) => {
      const subj = b.inferredSubject;
      counts[subj] = (counts[subj] || 0) + 1;
      const bKey = b.sessionId || b.id || `book_${b.index}`;
      if (starredBookIds[bKey]) {
        counts.starred = (counts.starred || 0) + 1;
      }
    });
    return counts;
  }, [allBooks, starredBookIds]);

  const filteredBooks = useMemo(() => {
    let result = [...allBooks];
    // 1. Subject filter
    if (selectedBookSubjectFilter === "starred") {
      result = result.filter(
        (b) => !!starredBookIds[b.sessionId || b.id || `book_${b.index}`],
      );
    } else if (selectedBookSubjectFilter !== "all") {
      result = result.filter(
        (b) =>
          b.inferredSubject.toLowerCase() ===
          selectedBookSubjectFilter.toLowerCase(),
      );
    }
    // 2. Search query filter
    if (archiveSearchQuery.trim()) {
      const q = archiveSearchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          (b.processedTitle && b.processedTitle.toLowerCase().includes(q)) ||
          (b.inferredSubject && b.inferredSubject.toLowerCase().includes(q)) ||
          (b.formattedDateTime &&
            b.formattedDateTime.toLowerCase().includes(q)) ||
          (Array.isArray(b.topics) &&
            b.topics.some((t: string) => t.toLowerCase().includes(q))),
      );
    }
    // 3. Sort Order
    if (bookSortOrder === "oldest") {
      result = [...result].reverse();
    } else if (bookSortOrder === "title") {
      result = [...result].sort((a, b) =>
        (a.processedTitle || "").localeCompare(b.processedTitle || ""),
      );
    } else if (bookSortOrder === "topics") {
      result = [...result].sort(
        (a, b) => (b.topics?.length || 1) - (a.topics?.length || 1),
      );
    }
    return result;
  }, [
    allBooks,
    selectedBookSubjectFilter,
    archiveSearchQuery,
    bookSortOrder,
    starredBookIds,
  ]);

  // Helper to infer or normalize subject for snapshots
  const inferSnapshotSubject = (snap: any): string => {
    if (
      snap.subject &&
      typeof snap.subject === "string" &&
      snap.subject.trim()
    ) {
      const s = snap.subject.trim();
      if (s.toLowerCase().includes("math")) return "Mathematics";
      if (s.toLowerCase().includes("phys")) return "Physics";
      if (s.toLowerCase().includes("chem")) return "Chemistry";
      if (s.toLowerCase().includes("bio")) return "Biology";
      if (s.toLowerCase().includes("sci")) return "Science";
      return s;
    }
    const text =
      `${snap.topicTitle || ""} ${snap.description || ""}`.toLowerCase();
    if (
      text.match(
        /ammonia|haber|nh3|hydrochloric|nitric|sulfuric|acid|base|salt|bond|reaction|organic|element|periodic|chemical|equilibrium|solution|electrochem|compound|hybridization|carbon|metal|atom|redox|titration|precipitation|catalyst|oxidation|reduction|mole|molarity|alkali|alkaline|halogen|valency|isomerism|hydrocarbon|ester|aldehyde|ketone|polymer|le chatelier|exothermic|endothermic|solubility|odour/,
      )
    ) {
      return "Chemistry";
    }
    if (
      text.match(
        /trigonometr|algebra|calculus|derivative|integral|differential|geometry|matrix|determinant|quadratic|arithmetic|probability|polynomial|height|distance|triangle|circle|vector|parabola|hyperbola|ellipse|coordinate|logarithm|permutation|combination|binomial|limit|continuity/,
      )
    ) {
      return "Mathematics";
    }
    if (
      text.match(
        /cell|plant|photosynthe|genetic|dna|rna|circulation|respiration|organism|biotech|ecolog|human|tissue|reproduction|heart|blood|neuron|brain|kidney|digestion|endocrine|hormone|chromosome|mitosis|meiosis|ecosystem|bacteria|virus|fungi|enzyme|chlorophyll|stomata/,
      )
    ) {
      return "Biology";
    }
    if (
      text.match(
        /kinematic|motion|gravity|force|newton|momentum|energy|work|power|ohm|current|optics|lens|mirror|thermodynamic|magnetic|electromagnet|wave|frequency|wavelength|friction|light|circuit|volt|ampere|refraction|reflection|capacit|resistor|inductor|photoelectric|nuclear|doppler|torque|rotational|fluids|pressure|buoyancy|snell/,
      )
    ) {
      return "Physics";
    }
    return subject || "Science";
  };

  // Combine Firestore snapshots and memory session snapshots with Intelligent Topic-Level Deduplication
  const allSnapshots = useMemo(() => {
    const combined: BoardSnapshot[] = [];
    const pushIfUnique = (s: any) => {
      if (!s || !s.imgData) return;
      const sub = inferSnapshotSubject(s);
      // Look for existing snapshot of the same topic (by snapshotId, topicIndex, or topicTitle within subject)
      const existingIdx = combined.findIndex(
        (fb) =>
          fb.snapshotId === s.snapshotId ||
          (typeof s.topicIndex === "number" &&
            typeof fb.topicIndex === "number" &&
            fb.topicIndex === s.topicIndex &&
            fb.subject?.toLowerCase() === sub.toLowerCase()) ||
          (fb.topicTitle?.trim().toLowerCase() ===
            (s.topicTitle || "").trim().toLowerCase() &&
            fb.subject?.toLowerCase() === sub.toLowerCase()),
      );

      const normalized: BoardSnapshot = {
        id:
          s.id ||
          `snap_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        snapshotId: s.snapshotId || s.id || `snap_${Date.now()}`,
        userId: s.userId,
        topicTitle: s.topicTitle || "Classroom Board Snapshot",
        description:
          s.description || "Interactive calculation whiteboard screenshot.",
        imgData: s.imgData,
        subject: sub,
        grade: s.grade || grade || "Class 10",
        topicIndex: typeof s.topicIndex === "number" ? s.topicIndex : undefined,
        timestamp: s.timestamp,
      };

      if (existingIdx >= 0) {
        // Replace with the updated / latest version for this topic
        combined[existingIdx] = normalized;
      } else {
        combined.push(normalized);
      }
    };

    snapshots.forEach(pushIfUnique);
    if (sessionSnapshots && sessionSnapshots.length > 0) {
      sessionSnapshots.forEach(pushIfUnique);
    }
    return combined;
  }, [snapshots, sessionSnapshots, subject, grade]);

  const [loadingSnapshots, setLoadingSnapshots] = useState(false);
  const [selectedSnapshotForModal, setSelectedSnapshotForModal] =
    useState<BoardSnapshot | null>(null);
  const [snapshotSearchQuery, setSnapshotSearchQuery] = useState("");
  const [selectedSnapshotSubjectFilter, setSelectedSnapshotSubjectFilter] =
    useState<string>("all");
  const [snapshotsViewMode, setSnapshotsViewMode] = useState<
    "grid" | "carousel"
  >("grid");
  const snapshotScrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [currentSnapshotHorizontalIndex, setCurrentSnapshotHorizontalIndex] =
    useState(0);

  const handleSnapshotHorizontalScroll = (direction: "prev" | "next") => {
    if (!snapshotScrollContainerRef.current) return;
    const container = snapshotScrollContainerRef.current;
    const itemWidth = container.clientWidth;
    const newScrollLeft =
      direction === "next"
        ? container.scrollLeft + itemWidth
        : container.scrollLeft - itemWidth;
    container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  };

  const handleSnapshotScrollUpdate = () => {
    if (!snapshotScrollContainerRef.current) return;
    const container = snapshotScrollContainerRef.current;
    const itemWidth = container.clientWidth;
    if (itemWidth > 0) {
      const idx = Math.round(container.scrollLeft / itemWidth);
      setCurrentSnapshotHorizontalIndex(
        Math.max(0, Math.min(idx, (filteredSnapshots.length || 1) - 1)),
      );
    }
  };

  // Dynamic Subject Counts for Filter Tabs
  const snapshotSubjectCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allSnapshots.length,
      Mathematics: 0,
      Physics: 0,
      Chemistry: 0,
      Biology: 0,
      Science: 0,
      General: 0,
    };
    allSnapshots.forEach((snap) => {
      const subj = inferSnapshotSubject(snap);
      counts[subj] = (counts[subj] || 0) + 1;
    });
    return counts;
  }, [allSnapshots]);

  const filteredSnapshots = useMemo(() => {
    let result = allSnapshots;
    // 1. Subject filter
    if (selectedSnapshotSubjectFilter !== "all") {
      result = result.filter(
        (s) =>
          inferSnapshotSubject(s).toLowerCase() ===
          selectedSnapshotSubjectFilter.toLowerCase(),
      );
    }
    // 2. Search query filter
    if (snapshotSearchQuery.trim()) {
      const q = snapshotSearchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          (s.topicTitle && s.topicTitle.toLowerCase().includes(q)) ||
          (s.description && s.description.toLowerCase().includes(q)) ||
          (s.subject && s.subject.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [allSnapshots, selectedSnapshotSubjectFilter, snapshotSearchQuery]);

  // Smart Revision Deck States
  const [activeRevisionSession, setActiveRevisionSession] = useState<
    any | null
  >(null);
  const [revisionDeckData, setRevisionDeckData] = useState<any | null>(null);
  const [loadingRevision, setLoadingRevision] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);
  const [showFlashcardHint, setShowFlashcardHint] = useState(false);

  // New highly interactive states
  const [activeRevisionTab, setActiveRevisionTab] = useState<
    "flashcards" | "mindmap" | "summary" | "quiz"
  >("flashcards");
  const [cardRatings, setCardRatings] = useState<
    Record<string, "hard" | "medium" | "easy">
  >({});
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>(
    {},
  );
  const [mindMapSearch, setMindMapSearch] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Record<number, boolean>>({
    0: true,
  });
  const [isVisualMapCollapsed, setIsVisualMapCollapsed] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth < 768 : true;
  });
  const [mindMapQuickFilter, setMindMapQuickFilter] = useState<
    "all" | "formulas" | "tips" | "concepts"
  >("all");
  const [lastSelectedNodeId, setLastSelectedNodeId] = useState<number | null>(
    null,
  );
  const [selectedSubNode, setSelectedSubNode] = useState<{
    nodeId: number;
    subIdx: number;
  } | null>(null);
  const [mindMapViewMode, setMindMapViewMode] = useState<
    "interactive" | "list"
  >("interactive");
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [mindMapStyle, setMindMapStyle] = useState<"slate" | "pastel">(
    "pastel",
  );

  // Helper to determine active revision source mode details and styling
  const getSourceBadgeInfo = (sess: any) => {
    if (!sess)
      return {
        label: "Generated from Classroom Notes",
        shortLabel: "🏫 CLASS NOTES",
        icon: "🏫",
        bgClass: "bg-indigo-50/700/20 text-indigo-300 border-indigo-500/40",
        badgeColor: "#0d9488",
        description: "Classroom conceptual notes",
      };

    const mode = sess.sourceMode;
    const isDoc =
      mode === "explainer_doc" ||
      !!sess.documentMarkdown ||
      !!sess.activeDocumentMarkdown;
    const isYoutube =
      mode === "explainer_youtube" ||
      sess.mimeType === "video/youtube" ||
      sess.processedTitle?.includes("YouTube") ||
      sess.processedTitle?.includes("(ID: ");
    const isDoubt = mode === "doubt_solver";
    const isMistake = mode === "mistake_vault";

    if (isDoc) {
      return {
        label: "Generated from Explainer Mode Document",
        shortLabel: "📄 EXPLAINER DOC",
        icon: "📄",
        bgClass: "bg-emerald-500/25 text-emerald-200 border-emerald-400/50",
        badgeColor: "#059669",
        description:
          "Parsed directly from uploaded document curriculum & notes",
      };
    }
    if (isYoutube) {
      return {
        label: "Generated from YouTube Video Lecture",
        shortLabel: "🎥 YOUTUBE LECTURE",
        icon: "🎥",
        bgClass: "bg-rose-500/25 text-rose-200 border-rose-400/50",
        badgeColor: "#e11d48",
        description:
          "Synthesized from YouTube video lesson transcript & curriculum",
      };
    }
    if (isDoubt) {
      return {
        label: "Generated from 1-on-1 Doubt Solver",
        shortLabel: "💡 DOUBT SOLVER",
        icon: "💡",
        bgClass: "bg-amber-500/25 text-amber-200 border-amber-400/50",
        badgeColor: "#d97706",
        description:
          "Constructed from interactive doubt clarification & answers",
      };
    }
    if (isMistake) {
      return {
        label: "Generated from Mistake Vault Analysis",
        shortLabel: "🛡️ MISTAKE VAULT",
        icon: "🛡️",
        bgClass: "bg-purple-500/25 text-purple-200 border-purple-400/50",
        badgeColor: "#7c3aed",
        description: "Extracted from quiz mistakes & high-yield error patterns",
      };
    }
    return {
      label: "Generated from Today's Live Blackboard",
      shortLabel: "🏫 LIVE BLACKBOARD",
      icon: "🏫",
      bgClass: "bg-indigo-900/25 text-indigo-200 border-indigo-400/50",
      badgeColor: "#0d9488",
      description:
        "Direct from teacher's live chalkboard formulas & derivations",
    };
  };

  // Keyboard navigation for flashcards in Smart Revision
  useEffect(() => {
    if (!activeRevisionSession || activeRevisionTab !== "flashcards") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName))
        return;

      const total = revisionDeckData?.flashcards?.length || 0;
      if (total === 0) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentFlashcardIndex((prev) => {
          if (prev > 0) {
            setIsFlashcardFlipped(false);
            setShowFlashcardHint(false);
            return prev - 1;
          }
          return prev;
        });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentFlashcardIndex((prev) => {
          if (prev < total - 1) {
            setIsFlashcardFlipped(false);
            setShowFlashcardHint(false);
            return prev + 1;
          }
          return prev;
        });
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsFlashcardFlipped((prev) => !prev);
      } else if (e.key.toLowerCase() === "h") {
        e.preventDefault();
        setShowFlashcardHint((prev) => !prev);
      } else if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        const currentCard =
          revisionDeckData?.flashcards?.[currentFlashcardIndex];
        if (currentCard) {
          const cardId = currentCard.id || String(currentFlashcardIndex);
          toggleCardMastery(cardId);
        }
      } else if (
        isFlashcardFlipped &&
        (e.key === "1" || e.key === "2" || e.key === "3")
      ) {
        e.preventDefault();
        const currentCard =
          revisionDeckData?.flashcards?.[currentFlashcardIndex];
        if (currentCard) {
          const cardId = currentCard.id || String(currentFlashcardIndex);
          if (e.key === "1") handleRateCard(cardId, "hard");
          else if (e.key === "2") handleRateCard(cardId, "medium");
          else if (e.key === "3") handleRateCard(cardId, "easy");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    activeRevisionSession,
    activeRevisionTab,
    revisionDeckData,
    currentFlashcardIndex,
    isFlashcardFlipped,
  ]);

  const getPastelTheme = (index: number) => {
    const themes = [
      {
        fill: "#ffccd5",
        stroke: "#db2777",
        text: "#831843",
        badgeBg: "#fbc4b6",
        badgeText: "#450a0a",
      }, // Pink
      {
        fill: "#ffe3cc",
        stroke: "#ea580c",
        text: "#7c2d12",
        badgeBg: "#fed7aa",
        badgeText: "#431407",
      }, // Peach Orange
      {
        fill: "#f3e8ff",
        stroke: "#7c3aed",
        text: "#4c1d95",
        badgeBg: "#e9d5ff",
        badgeText: "#2e1065",
      }, // Lavender Purple
      {
        fill: "#e2faf5",
        stroke: "#0d9488",
        text: "#115e59",
        badgeBg: "#ccfbf1",
        badgeText: "#042f2e",
      }, // Mint Green
      {
        fill: "#fff9db",
        stroke: "#eab308",
        text: "#713f12",
        badgeBg: "#fef08a",
        badgeText: "#422006",
      }, // Soft Yellow
    ];
    return themes[index % themes.length];
  };

  const getSubNodePastelTheme = (parentIdx: number) => {
    const subThemes = [
      { fill: "#ccfbf1", stroke: "#0d9488", text: "#042f2e" }, // Mint Green
      { fill: "#f3e8ff", stroke: "#7c3aed", text: "#2e1065" }, // Lavender Purple
      { fill: "#ffe3cc", stroke: "#ea580c", text: "#431407" }, // Orange/Peach
      { fill: "#ffccd5", stroke: "#db2777", text: "#831843" }, // Coral/Pink
      { fill: "#fff9db", stroke: "#eab308", text: "#422006" }, // Soft Yellow
    ];
    return subThemes[(parentIdx + 1) % subThemes.length];
  };

  const getSubItems = (node: any) => {
    if (!node) return [];
    const concepts = node.keyConcepts || node.coreConcepts || [];
    const takeaways = node.subNodes || node.quickTakeaways || [];
    const items: {
      type: "concept" | "formula" | "tip";
      text: string;
      label: string;
    }[] = [];

    if (node.keyFormula) {
      items.push({
        type: "formula",
        text: node.keyFormula,
        label: "📐 Formula",
      });
    }

    concepts.forEach((concept: string, idx: number) => {
      items.push({
        type: "concept",
        text: concept,
        label: `🧠 Concept ${idx + 1}`,
      });
    });

    takeaways.forEach((takeaway: string, idx: number) => {
      items.push({
        type: "tip",
        text: takeaway,
        label: `💡 Exam Tip ${idx + 1}`,
      });
    });

    return items;
  };

  const totalCards = revisionDeckData?.flashcards?.length || 0;

  const handleOpenRevisionDeck = (sess: any, data: any) => {
    setActiveRevisionSession(sess);
    setRevisionDeckData(data);
    setCurrentFlashcardIndex(0);
    setIsFlashcardFlipped(false);
    setShowFlashcardHint(false);
    setMindMapSearch("");
    setActiveRevisionTab("flashcards");
    setExpandedNodes({ 0: true });
    setMindMapQuickFilter("all");
    setLastSelectedNodeId(null);
    setSelectedSubNode(null);
    setMindMapViewMode("interactive");
    setIsMapFullscreen(false);
    setIsVisualMapCollapsed(
      typeof window !== "undefined" ? window.innerWidth < 768 : true,
    );

    // Load mastery & ratings cache from local storage
    const storageKey = `revision_mastery_${sess.sessionId || sess.index}`;
    const ratingsKey = `revision_ratings_${sess.sessionId || sess.index}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setMasteredCards(JSON.parse(saved));
      } else {
        setMasteredCards({});
      }
      const savedRatings = localStorage.getItem(ratingsKey);
      if (savedRatings) {
        setCardRatings(JSON.parse(savedRatings));
      } else {
        setCardRatings({});
      }
    } catch (_) {
      setMasteredCards({});
      setCardRatings({});
    }
  };

  const handleCloseRevisionDeck = () => {
    setActiveRevisionSession(null);
    setRevisionDeckData(null);
    setMasteredCards({});
    setCardRatings({});
    setShowFlashcardHint(false);
    setMindMapSearch("");
    setMindMapQuickFilter("all");
    setLastSelectedNodeId(null);
    setSelectedSubNode(null);
    setMindMapViewMode("interactive");
    setIsMapFullscreen(false);
  };

  const handleShuffleFlashcards = () => {
    if (
      !revisionDeckData?.flashcards ||
      revisionDeckData.flashcards.length <= 1
    )
      return;
    const shuffled = [...revisionDeckData.flashcards].sort(
      () => Math.random() - 0.5,
    );
    setRevisionDeckData((prev: any) => ({ ...prev, flashcards: shuffled }));
    setCurrentFlashcardIndex(0);
    setIsFlashcardFlipped(false);
    setShowFlashcardHint(false);
  };

  const handleResetMastery = () => {
    if (!activeRevisionSession) return;
    const storageKey = `revision_mastery_${activeRevisionSession.sessionId || activeRevisionSession.index}`;
    const ratingsKey = `revision_ratings_${activeRevisionSession.sessionId || activeRevisionSession.index}`;
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(ratingsKey);
    } catch (_) {}
    setMasteredCards({});
    setCardRatings({});
  };

  const handleDownloadMindMap = (format: "png" | "svg" | "pdf") => {
    // Helper to transform LaTeX formulas into clean, readable Unicode math text
    const formatLatexToReadable = (text: string): string => {
      if (!text) return "";
      let formatted = text;

      const subscripts: { [key: string]: string } = {
        "0": "₀",
        "1": "₁",
        "2": "₂",
        "3": "₃",
        "4": "₄",
        "5": "₅",
        "6": "₆",
        "7": "₇",
        "8": "₈",
        "9": "₉",
        a: "ₐ",
        e: "ₑ",
        o: "ₒ",
        x: "ₓ",
        h: "ₕ",
        k: "ₖ",
        l: "ₗ",
        m: "ₘ",
        n: "ₙ",
        p: "ₚ",
        s: "ₛ",
        t: "ₜ",
        i: "ᵢ",
        j: "ⱼ",
      };

      // Convert subscripts first to eliminate nested braces
      for (let i = 0; i < 5; i++) {
        formatted = formatted.replace(/_\{([a-zA-Z0-9]+)\}/g, (_, chars) => {
          return chars
            .split("")
            .map((c: string) => subscripts[c] || c)
            .join("");
        });
        formatted = formatted.replace(
          /_([a-zA-Z0-9])/g,
          (_, char) => subscripts[char] || char,
        );
      }

      // Replace LaTeX frac with division slash
      for (let i = 0; i < 5; i++) {
        formatted = formatted.replace(
          /\\frac\{([^{}]+)\}\{([^{}]+)\}/g,
          "$1/$2",
        );
        formatted = formatted.replace(
          /\\frac\(([^()]+)\)\(([^()]+)\)/g,
          "$1/$2",
        );
      }

      // LaTeX macros mapping
      formatted = formatted.replace(/\\neq\b/g, "≠");
      formatted = formatted.replace(/\\neq/g, "≠");
      formatted = formatted.replace(/\\quad\b/g, "  ");
      formatted = formatted.replace(/\\text\{([^{}]+)\}/g, "$1");
      formatted = formatted.replace(/\\Rightarrow\b/g, "⇒");
      formatted = formatted.replace(/\\Rightarrow/g, "⇒");
      formatted = formatted.replace(/\\dots\b/g, "...");
      formatted = formatted.replace(/\\dots/g, "...");
      formatted = formatted.replace(/\\cdot\b/g, "·");
      formatted = formatted.replace(/\\cdot/g, "·");
      formatted = formatted.replace(/\\pm\b/g, "±");
      formatted = formatted.replace(/\\pm/g, "±");
      formatted = formatted.replace(/\\ge\b/g, "≥");
      formatted = formatted.replace(/\\le\b/g, "≤");
      formatted = formatted.replace(/\\geq\b/g, "≥");
      formatted = formatted.replace(/\\leq\b/g, "≤");
      formatted = formatted.replace(/\\ge/g, "≥");
      formatted = formatted.replace(/\\le/g, "≤");
      formatted = formatted.replace(/\\geq/g, "≥");
      formatted = formatted.replace(/\\leq/g, "≤");
      formatted = formatted.replace(/\\approx\b/g, "≈");
      formatted = formatted.replace(/\\approx/g, "≈");

      // Greek letters mapping
      formatted = formatted.replace(/\\alpha\b/g, "α");
      formatted = formatted.replace(/\\beta\b/g, "β");
      formatted = formatted.replace(/\\gamma\b/g, "γ");
      formatted = formatted.replace(/\\theta\b/g, "θ");
      formatted = formatted.replace(/\\delta\b/g, "δ");
      formatted = formatted.replace(/\\Delta\b/g, "Δ");
      formatted = formatted.replace(/\\lambda\b/g, "λ");
      formatted = formatted.replace(/\\pi\b/g, "π");
      formatted = formatted.replace(/\\omega\b/g, "ω");
      formatted = formatted.replace(/\\phi\b/g, "φ");
      formatted = formatted.replace(/\\sigma\b/g, "σ");
      formatted = formatted.replace(/\\mu\b/g, "μ");
      formatted = formatted.replace(/\\tau\b/g, "τ");

      // Remove math dollar boundaries
      formatted = formatted.replace(/\$\$/g, "");
      formatted = formatted.replace(/\$/g, "");

      // Normalize spaces
      formatted = formatted.replace(/ \s+/g, " ");

      return formatted.trim();
    };

    // Utility functions to wrap text elegantly
    const wrapText = (text: string, maxCharsPerLine: number = 28): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = "";

      words.forEach((word) => {
        if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
          currentLine = (currentLine + " " + word).trim();
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      });
      if (currentLine) {
        lines.push(currentLine);
      }
      return lines;
    };

    const wrapParentText = (text: string, maxLen: number = 22): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = "";
      words.forEach((word) => {
        if ((currentLine + " " + word).trim().length <= maxLen) {
          currentLine = (currentLine + " " + word).trim();
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      });
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    // Helper to generate the beautifully crafted, high-definition complete SVG
    const generateFullDetailedMindMapSVG = () => {
      const nodes = revisionDeckData?.mindMap?.nodes || [];
      const subjectName =
        activeRevisionSession?.subject || subject || "Syllabus";
      const chapterTitle =
        activeRevisionSession?.processedTitle ||
        revisionDeckData?.mindMap?.title ||
        "Concept Mind Map";
      const gradeLevel = grade || "10";

      // Canvas config for complete layout
      const width = 1600;
      const height = 1200;
      const cx = 800;
      const cy = 600;
      const rx = 380;
      const ry = 280;
      const subDist = 210; // Comfortable distance for fanning out cards

      let svgContent = "";

      // 1. Gradients and Filters definition
      if (mindMapStyle === "pastel") {
        svgContent += `
          <defs>
            <linearGradient id="dl-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FAF6F0" />
              <stop offset="100%" stop-color="#FAF6F0" />
            </linearGradient>
            <linearGradient id="dl-hub-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#b4a4eb" />
              <stop offset="100%" stop-color="#9f86f0" />
            </linearGradient>
            <linearGradient id="dl-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#fcfbf9" />
            </linearGradient>
            <filter id="dl-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000000" flood-opacity="0.08" />
            </filter>
            <marker id="dl-arrow-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4b5563" />
            </marker>
          </defs>
        `;
      } else {
        svgContent += `
          <defs>
            <linearGradient id="dl-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#021417" />
              <stop offset="50%" stop-color="#051e22" />
              <stop offset="100%" stop-color="#0c2e2c" />
            </linearGradient>
            <linearGradient id="dl-hub-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0d9488" />
              <stop offset="100%" stop-color="#0f766e" />
            </linearGradient>
            <linearGradient id="dl-node-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#114c47" />
              <stop offset="100%" stop-color="#0d3c38" />
            </linearGradient>
            <linearGradient id="dl-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#071b1e" />
              <stop offset="100%" stop-color="#031113" />
            </linearGradient>
            <filter id="dl-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000000" flood-opacity="0.6" />
            </filter>
          </defs>
        `;
      }

      // Backdrop
      svgContent += `
        <rect width="${width}" height="${height}" fill="url(#dl-bg-grad)" />
        
        <!-- Background organic grid design -->
        <g opacity="${mindMapStyle === "pastel" ? "0.6" : "0.12"}">
      `;
      for (let x = 0; x < width; x += 32) {
        for (let y = 0; y < height; y += 32) {
          svgContent += `<circle cx="${x}" cy="${y}" r="1" fill="${mindMapStyle === "pastel" ? "#e5dcd0" : "#2dd4bf"}" />`;
        }
      }
      svgContent += `</g>`;

      // Outer safety border ring
      svgContent += `
        <circle cx="${cx}" cy="${cy}" r="${rx}" fill="none" stroke="${mindMapStyle === "pastel" ? "#e5dcd0" : "#114c47"}" stroke-width="1.5" stroke-dasharray="12 12" opacity="0.4" />
        <circle cx="${cx}" cy="${cy}" r="${rx + subDist}" fill="none" stroke="${mindMapStyle === "pastel" ? "#e5dcd0" : "#2dd4bf"}" stroke-width="1" stroke-dasharray="6 8" opacity="0.3" />
      `;

      // 2. Draw Connection Lines: Hub to Parent Nodes
      const N = nodes.length || 1;
      nodes.forEach((_: any, index: number) => {
        const angle = (2 * Math.PI * index) / N - Math.PI / 2;
        const targetX = cx + rx * Math.cos(angle);
        const targetY = cy + ry * Math.sin(angle);

        const pTheme = getPastelTheme(index);

        if (mindMapStyle === "pastel") {
          svgContent += `
            <!-- Connection to Topic ${index + 1} -->
            <line 
              x1="${cx}" 
              y1="${cy}" 
              x2="${targetX}" 
              y2="${targetY}" 
              stroke="${pTheme.stroke}" 
              stroke-width="2" 
              stroke-linecap="round"
              marker-end="url(#dl-arrow-head)"
            />
          `;
        } else {
          svgContent += `
            <!-- Connection to Topic ${index + 1} -->
            <line 
              x1="${cx}" 
              y1="${cy}" 
              x2="${targetX}" 
              y2="${targetY}" 
              stroke="#114c47" 
              stroke-width="3.5" 
              stroke-linecap="round"
            />
            <line 
              x1="${cx}" 
              y1="${cy}" 
              x2="${targetX}" 
              y2="${targetY}" 
              stroke="#2dd4bf" 
              stroke-width="1.5" 
              stroke-dasharray="8 6" 
              opacity="0.75"
            />
          `;
        }
      });

      // 3. Draw Sub-branch Connections and Detailed Cards
      nodes.forEach((node: any, index: number) => {
        const angle = (2 * Math.PI * index) / N - Math.PI / 2;
        const targetX = cx + rx * Math.cos(angle);
        const targetY = cy + ry * Math.sin(angle);

        const subItems = getSubItems(node);
        const K = subItems.length;
        if (K === 0) return;

        // Categorize node into sector (left, right, top, bottom) to prevent overlapping
        let sector: "top" | "bottom" | "left" | "right" = "top";
        if (targetX < cx - 80) {
          sector = "left";
        } else if (targetX > cx + 80) {
          sector = "right";
        } else if (targetY < cy) {
          sector = "top";
        } else {
          sector = "bottom";
        }

        subItems.forEach((subItem: any, i: number) => {
          let subX = targetX;
          let subY = targetY;
          let parentConnectorX = targetX;
          let parentConnectorY = targetY;
          let childConnectorX = targetX;
          let childConnectorY = targetY;

          const cardW = 195;
          const cardH = 95;

          if (sector === "left") {
            // Stack vertically in a column on the left side
            const vSpacing = 112;
            const startY = targetY - ((K - 1) * vSpacing) / 2;
            subX = targetX - 225;
            subY = startY + i * vSpacing;

            parentConnectorX = targetX - 105; // Left edge of parent capsule
            parentConnectorY = targetY;
            childConnectorX = subX + cardW / 2; // Right edge of child card
            childConnectorY = subY;
          } else if (sector === "right") {
            // Stack vertically in a column on the right side
            const vSpacing = 112;
            const startY = targetY - ((K - 1) * vSpacing) / 2;
            subX = targetX + 225;
            subY = startY + i * vSpacing;

            parentConnectorX = targetX + 105; // Right edge of parent capsule
            parentConnectorY = targetY;
            childConnectorX = subX - cardW / 2; // Left edge of child card
            childConnectorY = subY;
          } else if (sector === "top") {
            // Align horizontally above
            if (K <= 3) {
              const hSpacing = 215;
              const startX = targetX - ((K - 1) * hSpacing) / 2;
              subX = startX + i * hSpacing;
              subY = targetY - 145;
            } else {
              // Split into two neat rows to prevent side-clipping
              const row1Count = Math.min(3, Math.ceil(K / 2));
              const row2Count = K - row1Count;
              if (i < row1Count) {
                const startX = targetX - ((row1Count - 1) * 215) / 2;
                subX = startX + i * 215;
                subY = targetY - 105;
              } else {
                const row2Idx = i - row1Count;
                const startX = targetX - ((row2Count - 1) * 215) / 2;
                subX = startX + row2Idx * 215;
                subY = targetY - 220;
              }
            }

            parentConnectorX = targetX;
            parentConnectorY = targetY - 28; // Top edge of parent capsule
            childConnectorX = subX;
            childConnectorY = subY + cardH / 2; // Bottom edge of child card
          } else {
            // Align horizontally below
            if (K <= 3) {
              const hSpacing = 215;
              const startX = targetX - ((K - 1) * hSpacing) / 2;
              subX = startX + i * hSpacing;
              subY = targetY + 145;
            } else {
              const row1Count = Math.min(3, Math.ceil(K / 2));
              const row2Count = K - row1Count;
              if (i < row1Count) {
                const startX = targetX - ((row1Count - 1) * 215) / 2;
                subX = startX + i * 215;
                subY = targetY + 105;
              } else {
                const row2Idx = i - row1Count;
                const startX = targetX - ((row2Count - 1) * 215) / 2;
                subX = startX + row2Idx * 215;
                subY = targetY + 220;
              }
            }

            parentConnectorX = targetX;
            parentConnectorY = targetY + 28; // Bottom edge of parent capsule
            childConnectorX = subX;
            childConnectorY = subY - cardH / 2; // Top edge of child card
          }

          const cardX = subX - cardW / 2;
          const cardY = subY - cardH / 2;

          const pTheme = getPastelTheme(index);
          const subTheme = getSubNodePastelTheme(index);

          let typeLabel = "";
          let accentColor = "#38bdf8"; // Concept (sky blue)
          if (subItem.type === "formula") {
            typeLabel = "📐 RULE / FORMULA";
            accentColor =
              mindMapStyle === "pastel" ? subTheme.stroke : "#f59e0b"; // Formula (amber)
          } else if (subItem.type === "tip") {
            typeLabel = "💡 EXAM PRO-TIP";
            accentColor =
              mindMapStyle === "pastel" ? subTheme.stroke : "#10b981"; // Tip (emerald)
          } else {
            typeLabel = "🧠 KEY CONCEPT";
            accentColor =
              mindMapStyle === "pastel" ? subTheme.stroke : "#38bdf8";
          }

          // Connector line from parent node to sub-card
          if (mindMapStyle === "pastel") {
            svgContent += `
              <line 
                x1="${parentConnectorX}" 
                y1="${parentConnectorY}" 
                x2="${childConnectorX}" 
                y2="${childConnectorY}" 
                stroke="${pTheme.stroke}" 
                stroke-width="1.5" 
                marker-end="url(#dl-arrow-head)"
              />
            `;
          } else {
            svgContent += `
              <line 
                x1="${parentConnectorX}" 
                y1="${parentConnectorY}" 
                x2="${childConnectorX}" 
                y2="${childConnectorY}" 
                stroke="${accentColor}" 
                stroke-width="1.8" 
                stroke-dasharray="4 3.5" 
                opacity="0.85"
              />
              <circle cx="${childConnectorX}" cy="${childConnectorY}" r="3.5" fill="${accentColor}" />
            `;
          }

          const cardFill =
            mindMapStyle === "pastel" ? subTheme.fill : "url(#dl-card-grad)";
          const cardStroke =
            mindMapStyle === "pastel" ? subTheme.stroke : accentColor;
          const labelFill =
            mindMapStyle === "pastel" ? subTheme.text : accentColor;
          const textFill =
            mindMapStyle === "pastel" ? subTheme.text : "#e2e8f0";

          // Beautiful detailed card container with shadow
          svgContent += `
            <g filter="url(#dl-shadow)">
              <rect 
                x="${cardX}" 
                y="${cardY}" 
                width="${cardW}" 
                height="${cardH}" 
                rx="12" 
                ry="12" 
                fill="${cardFill}" 
                stroke="${cardStroke}" 
                stroke-width="1.5" 
              />
              
              <!-- Subtle accent top header plate -->
              <path 
                d="M ${cardX + 12} ${cardY} L ${cardX + cardW - 12} ${cardY} A 12 12 0 0 1 ${cardX + cardW} ${cardY + 12} L ${cardX + cardW} ${cardY + 22} L ${cardX} ${cardY + 22} L ${cardX} ${cardY + 12} A 12 12 0 0 1 ${cardX + 12} ${cardY} Z" 
                fill="${cardStroke}" 
                opacity="0.08"
              />
              
              <!-- Header badge text inside card -->
              <text 
                x="${subX}" 
                y="${cardY + 14}" 
                text-anchor="middle" 
                fill="${labelFill}" 
                font-size="8.5" 
                font-weight="900" 
                font-family="'JetBrains Mono', monospace" 
                letter-spacing="1"
              >
                ${typeLabel}
              </text>
          `;

          // Wrap actual detailed text content beautifully
          const readableText = formatLatexToReadable(subItem.text);
          const wrappedLines = wrapText(readableText, 28);
          const displayLines = wrappedLines.slice(0, 4); // Show maximum 4 lines to fit card neatly
          const lineCount = displayLines.length;

          // Vertically center the text lines inside card body
          const textBlockHeight = lineCount * 12;
          const startY = subY + 11 - textBlockHeight / 2;

          displayLines.forEach((lineText: string, lineIdx: number) => {
            // Escape any XML entities to ensure output SVG parses cleanly
            const escapedText = lineText
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&apos;");

            const isLastLineTruncated =
              lineIdx === 3 && wrappedLines.length > 4;
            const lineToRender = isLastLineTruncated
              ? escapedText.slice(0, 24) + "..."
              : escapedText;

            svgContent += `
              <text 
                x="${subX}" 
                y="${startY + lineIdx * 12}" 
                text-anchor="middle" 
                fill="${textFill}" 
                font-size="8.5" 
                font-weight="600" 
                font-family="'Inter', system-ui, sans-serif"
              >
                ${lineToRender}
              </text>
            `;
          });

          svgContent += `</g>`;
        });
      });

      // 4. Draw Parent Node Capsules (Drawn on top of lines for high-quality layering)
      nodes.forEach((node: any, index: number) => {
        const angle = (2 * Math.PI * index) / N - Math.PI / 2;
        const targetX = cx + rx * Math.cos(angle);
        const targetY = cy + ry * Math.sin(angle);

        const capW = 210;
        const capH = 56;
        const capX = targetX - capW / 2;
        const capY = targetY - capH / 2;

        const topicName = node.topicName || `Topic ${index + 1}`;
        const wrappedName = wrapParentText(topicName, 22);

        const pTheme = getPastelTheme(index);

        if (mindMapStyle === "pastel") {
          svgContent += `
            <!-- Topic Capsule ${index + 1} -->
            <g filter="url(#dl-shadow)">
              <rect 
                x="${capX}" 
                y="${capY}" 
                width="${capW}" 
                height="${capH}" 
                rx="14" 
                ry="14" 
                fill="${pTheme.fill}" 
                stroke="${pTheme.stroke}" 
                stroke-width="2" 
              />
              
              <!-- Left-side vertical indicator strip -->
              <rect 
                x="${capX + 8}" 
                y="${capY + 8}" 
                width="4" 
                height="${capH - 16}" 
                rx="2" 
                fill="${pTheme.stroke}" 
              />
              
              <!-- Bullet Badge counter index -->
              <circle 
                cx="${capX + 26}" 
                cy="${targetY}" 
                r="10" 
                fill="${pTheme.stroke}" 
                stroke="${pTheme.text}" 
                stroke-width="1.5" 
              />
              <text 
                x="${capX + 26}" 
                y="${targetY + 3.5}" 
                text-anchor="middle" 
                fill="#ffffff" 
                font-size="9" 
                font-weight="900" 
                font-family="'JetBrains Mono', monospace"
              >
                ${index + 1}
              </text>
          `;

          if (wrappedName.length <= 1) {
            const line = wrappedName[0] || topicName;
            svgContent += `
              <text 
                x="${capX + 46}" 
                y="${targetY + 4}" 
                fill="${pTheme.text}" 
                font-size="11.5" 
                font-weight="800" 
                font-family="'Inter', system-ui, sans-serif"
                letter-spacing="0.3"
              >
                ${line.toUpperCase()}
              </text>
            `;
          } else {
            svgContent += `
              <text 
                x="${capX + 46}" 
                y="${targetY - 2}" 
                fill="${pTheme.text}" 
                font-size="10.5" 
                font-weight="800" 
                font-family="'Inter', system-ui, sans-serif"
                letter-spacing="0.3"
              >
                ${wrappedName[0].toUpperCase()}
              </text>
              <text 
                x="${capX + 46}" 
                y="${targetY + 10}" 
                fill="${pTheme.stroke}" 
                font-size="9.5" 
                font-weight="800" 
                font-family="'Inter', system-ui, sans-serif"
                letter-spacing="0.3"
              >
                ${wrappedName[1].toUpperCase()}
              </text>
            `;
          }
        } else {
          svgContent += `
            <!-- Topic Capsule ${index + 1} -->
            <g filter="url(#dl-shadow)">
              <rect 
                x="${capX}" 
                y="${capY}" 
                width="${capW}" 
                height="${capH}" 
                rx="14" 
                ry="14" 
                fill="url(#dl-node-grad)" 
                stroke="#0f766e" 
                stroke-width="2" 
              />
              
              <!-- Left-side vertical indicator strip -->
              <rect 
                x="${capX + 8}" 
                y="${capY + 8}" 
                width="4" 
                height="${capH - 16}" 
                rx="2" 
                fill="#2dd4bf" 
              />
              
              <!-- Bullet Badge counter index -->
              <circle 
                cx="${capX + 26}" 
                cy="${targetY}" 
                r="10" 
                fill="#0c2e2c" 
                stroke="#2dd4bf" 
                stroke-width="1.5" 
              />
              <text 
                x="${capX + 26}" 
                y="${targetY + 3.5}" 
                text-anchor="middle" 
                fill="#2dd4bf" 
                font-size="9" 
                font-weight="900" 
                font-family="'JetBrains Mono', monospace"
              >
                ${index + 1}
              </text>
          `;

          if (wrappedName.length <= 1) {
            const line = wrappedName[0] || topicName;
            svgContent += `
              <text 
                x="${capX + 46}" 
                y="${targetY + 4}" 
                fill="#ffffff" 
                font-size="11.5" 
                font-weight="800" 
                font-family="'Inter', system-ui, sans-serif"
                letter-spacing="0.3"
              >
                ${line.toUpperCase()}
              </text>
            `;
          } else {
            svgContent += `
              <text 
                x="${capX + 46}" 
                y="${targetY - 2}" 
                fill="#ffffff" 
                font-size="10.5" 
                font-weight="800" 
                font-family="'Inter', system-ui, sans-serif"
                letter-spacing="0.3"
              >
                ${wrappedName[0].toUpperCase()}
              </text>
              <text 
                x="${capX + 46}" 
                y="${targetY + 10}" 
                fill="#2dd4bf" 
                font-size="9.5" 
                font-weight="800" 
                font-family="'Inter', system-ui, sans-serif"
                letter-spacing="0.3"
              >
                ${wrappedName[1].toUpperCase()}
              </text>
            `;
          }
        }

        svgContent += `</g>`;
      });

      // 5. Draw Central Hub Bubble (Drawn on top at exact center)
      const hubW = 290;
      const hubH = 92;
      const hubX = cx - hubW / 2;
      const hubY = cy - hubH / 2;

      if (mindMapStyle === "pastel") {
        svgContent += `
          <!-- Central Hub -->
          <g filter="url(#dl-shadow)">
            <rect 
              x="${hubX}" 
              y="${hubY}" 
              width="${hubW}" 
              height="${hubH}" 
              rx="24" 
              ry="24" 
              fill="url(#dl-hub-grad)" 
              stroke="#7c3aed" 
              stroke-width="3" 
            />
            <!-- Highlighting Yellow crown banner -->
            <rect 
              x="${cx - 65}" 
              y="${hubY - 6}" 
              width="130" 
              height="18" 
              rx="6" 
              ry="6" 
              fill="#ffca28" 
            />
            <text 
              x="${cx}" 
              y="${hubY + 6}" 
              text-anchor="middle" 
              fill="#3e2723" 
              font-size="8.5" 
              font-weight="900" 
              font-family="'JetBrains Mono', monospace" 
              letter-spacing="1.5"
            >
              REVISION CENTER
            </text>
            
            <text 
              x="${cx}" 
              y="${cy + 8}" 
              text-anchor="middle" 
              fill="#ffffff" 
              font-size="14" 
              font-weight="900" 
              font-family="'Inter', system-ui, sans-serif" 
              letter-spacing="0.5"
            >
              ${subjectName.toUpperCase()}
            </text>
            
            <text 
              x="${cx}" 
              y="${cy + 27}" 
              text-anchor="middle" 
              fill="#fdfaf6" 
              font-size="9.5" 
              font-weight="800" 
              font-family="'Inter', system-ui, sans-serif" 
              letter-spacing="0.5"
              opacity="0.9"
            >
              CLASS ${gradeLevel} • ${chapterTitle.toUpperCase().slice(0, 36)}
            </text>
          </g>
        `;
      } else {
        svgContent += `
          <!-- Central Hub -->
          <g filter="url(#dl-shadow)">
            <rect 
              x="${hubX}" 
              y="${hubY}" 
              width="${hubW}" 
              height="${hubH}" 
              rx="24" 
              ry="24" 
              fill="url(#dl-hub-grad)" 
              stroke="#2dd4bf" 
              stroke-width="3" 
            />
            <!-- Highlighting Orange crown banner -->
            <rect 
              x="${cx - 65}" 
              y="${hubY - 6}" 
              width="130" 
              height="18" 
              rx="6" 
              ry="6" 
              fill="#f59e0b" 
            />
            <text 
              x="${cx}" 
              y="${hubY + 6}" 
              text-anchor="middle" 
              fill="#0f172a" 
              font-size="8.5" 
              font-weight="900" 
              font-family="'JetBrains Mono', monospace" 
              letter-spacing="1.5"
            >
              REVISION CENTER
            </text>
            
            <text 
              x="${cx}" 
              y="${cy + 8}" 
              text-anchor="middle" 
              fill="#ffffff" 
              font-size="14" 
              font-weight="900" 
              font-family="'Inter', system-ui, sans-serif" 
              letter-spacing="0.5"
            >
              ${subjectName.toUpperCase()}
            </text>
            
            <text 
              x="${cx}" 
              y="${cy + 27}" 
              text-anchor="middle" 
              fill="#e2e8f0" 
              font-size="9.5" 
              font-weight="800" 
              font-family="'Inter', system-ui, sans-serif" 
              letter-spacing="0.5"
              opacity="0.9"
            >
              CLASS ${gradeLevel} • ${chapterTitle.toUpperCase().slice(0, 36)}
            </text>
          </g>
        `;
      }

      // Wrapping inside proper standard XML container
      const finalSvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 ${width} ${height}" 
  width="${width}" 
  height="${height}"
>
  <style>
    text {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      user-select: none;
    }
  </style>
  ${svgContent}
</svg>`;

      return finalSvg;
    };

    const title = revisionDeckData?.mindMap?.title || "Concept_Mind_Map";
    const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, "_").replace(/__+/g, "_");
    const subName = (
      activeRevisionSession?.subject ||
      subject ||
      "Syllabus"
    ).replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `${cleanTitle}_${subName}`;

    const svgString = generateFullDetailedMindMapSVG();

    if (format === "svg") {
      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === "pdf") {
      // PDF print window with embedded high-resolution SVG
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>${title} - Concept Mind Map</title>
              <style>
                @page { size: landscape; margin: 8mm; }
                body {
                  margin: 0;
                  padding: 12px;
                  background: #ffffff;
                  color: #0f172a;
                  font-family: system-ui, -apple-system, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                }
                .header {
                  text-align: center;
                  margin-bottom: 12px;
                  width: 100%;
                }
                .header h1 {
                  font-size: 18px;
                  font-weight: 900;
                  color: #0d9488;
                  margin: 0 0 4px 0;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                .header p {
                  font-size: 11px;
                  color: #64748b;
                  margin: 0;
                  font-weight: 600;
                }
                .svg-container {
                  width: 100%;
                  max-width: 1000px;
                  display: flex;
                  justify-content: center;
                }
                .svg-container svg {
                  width: 100%;
                  height: auto;
                  max-height: 85vh;
                  border-radius: 12px;
                }
                @media print {
                  body { padding: 0; }
                  button { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>${title}</h1>
                <p>Cherry AI Smart Revision Concept Map • Class ${grade} • ${subName.replace(/_/g, " ")}</p>
              </div>
              <div class="svg-container">
                ${svgString}
              </div>
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                  }, 400);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } else {
      // PNG format - convert SVG to high-definition Canvas
      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);

      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Super high resolution rendering (1600x1200)
        canvas.width = 1600;
        canvas.height = 1200;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Draw SVG onto canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Clean up object URL
        URL.revokeObjectURL(url);

        // Download PNG
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      img.onerror = () => {
        // Fallback to direct SVG if PNG rendering fails due to canvas security/conversions
        const fallbackLink = document.createElement("a");
        fallbackLink.href = url;
        fallbackLink.download = `${filename}.svg`;
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        document.body.removeChild(fallbackLink);
      };

      img.src = url;
    }
  };

  const toggleCardMastery = (cardId: string) => {
    if (!activeRevisionSession) return;
    setMasteredCards((prev) => {
      const updated = { ...prev, [cardId]: !prev[cardId] };
      const storageKey = `revision_mastery_${activeRevisionSession.sessionId || activeRevisionSession.index}`;
      safeSetItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  const handleRateCard = (
    cardId: string,
    rating: "hard" | "medium" | "easy",
  ) => {
    if (!activeRevisionSession) return;

    // Update rating state and localStorage
    setCardRatings((prev) => {
      const updated = { ...prev, [cardId]: rating };
      const ratingsKey = `revision_ratings_${activeRevisionSession.sessionId || activeRevisionSession.index}`;
      safeSetItem(ratingsKey, JSON.stringify(updated));
      return updated;
    });

    // Update mastery status based on rating: easy/medium counts as mastered/understood, hard unmarks mastery
    setMasteredCards((prev) => {
      const isMastered = rating === "easy" || rating === "medium";
      const updated = { ...prev, [cardId]: isMastered };
      const storageKey = `revision_mastery_${activeRevisionSession.sessionId || activeRevisionSession.index}`;
      safeSetItem(storageKey, JSON.stringify(updated));
      return updated;
    });

    // If there is a next card, smoothly advance after a small 350ms delay
    const total = revisionDeckData?.flashcards?.length || 0;
    if (currentFlashcardIndex < total - 1) {
      setTimeout(() => {
        setCurrentFlashcardIndex((prev) => prev + 1);
        setIsFlashcardFlipped(false);
        setShowFlashcardHint(false);
      }, 350);
    }
  };

  const handleDiscussWithCherry = (card: any) => {
    const concept =
      card.conceptTested ||
      card.question?.substring(0, 60) ||
      "Revision Concept";
    const question = card.question || "";
    const answer = card.answer || "";
    const hint = card.hint || "";
    const cardSubject =
      activeRevisionSession?.inferredSubject ||
      activeRevisionSession?.subject ||
      subject ||
      "Mathematics";

    if (onDiscussWithCherry) {
      onDiscussWithCherry({
        topic: concept,
        question,
        answer,
        hint,
        conceptTested: card.conceptTested,
        subject: cardSubject,
      });
    } else if (onEnterClassroom) {
      onEnterClassroom();
    }
  };

  const toggleNodeExpansion = (nodeIdx: number) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeIdx]: !prev[nodeIdx],
    }));
    setLastSelectedNodeId(nodeIdx);
    setSelectedSubNode(null);
  };

  const handleSvgNodeClick = (nodeIdx: number) => {
    setExpandedNodes({ [nodeIdx]: true });
    setLastSelectedNodeId(nodeIdx);
    setSelectedSubNode(null);
    setTimeout(() => {
      const element = document.getElementById(`mindmap-node-${nodeIdx}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleGenerateRevisionDeck = async (sess: any) => {
    setActiveRevisionSession(sess);
    setLoadingRevision(true);
    setRevisionDeckData(null);
    setCurrentFlashcardIndex(0);
    setIsFlashcardFlipped(false);
    setMindMapSearch("");
    setMindMapQuickFilter("all");
    setLastSelectedNodeId(null);
    setSelectedSubNode(null);
    setMindMapViewMode("interactive");
    setIsMapFullscreen(false);

    try {
      const payload = getUnifiedRevisionPayload(sess);

      const response = await fetch("/api/generate-revision-deck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionTitle: payload.sessionTitle,
          subject: payload.subject || sess.subject || subject,
          topics: payload.topics || [],
          sourceMode: payload.sourceMode,
          documentMarkdown:
            sess.documentMarkdown || sess.activeDocumentMarkdown || "",
          blackboardContent: payload.combinedContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Generation request failed");
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        safeSetItem(
          `revision_deck_${sess.sessionId || sess.index}`,
          JSON.stringify(resData.data),
        );
        handleOpenRevisionDeck(sess, resData.data);
      } else {
        throw new Error(resData.error || "Invalid response structure");
      }
    } catch (error) {
      console.error("Error generating revision deck:", error);
      alert(
        "Sorry, could not generate revision deck at this time. Please try again!",
      );
      setActiveRevisionSession(null);
    } finally {
      setLoadingRevision(false);
    }
  };

  const [activeTab, setActiveTab] = useState<"activity" | "gallery">(
    "activity",
  );
  const [activeMobileSubTab, setActiveMobileSubTab] = useState<
    "profile" | "books" | "stats" | "counselor" | "referral"
  >("stats");
  const [editingProfile, setEditingProfile] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(() => isCustomApiKeyConfigured());
  const [keyCount, setKeyCount] = useState(() => getAllStoredApiKeys().length);

  useEffect(() => {
    setHasCustomKey(isCustomApiKeyConfigured());
    setKeyCount(getAllStoredApiKeys().length);
  }, [showApiKeyModal]);

  // States for student editable metrics
  const [editName, setEditName] = useState(studentName);
  const [editGrade, setEditGrade] = useState(grade);
  const [editBoard, setEditBoard] = useState(board);
  const [editMediumOfLearning, setEditMediumOfLearning] =
    useState(mediumOfLearning);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    setEditName(studentName);
    setEditGrade(grade);
    setEditBoard(board);
    setEditMediumOfLearning(mediumOfLearning);
  }, [studentName, grade, board, mediumOfLearning]);

  const currentUser =
    auth.currentUser ||
    (() => {
      const cached = localStorage.getItem("local_active_user");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (_) {}
      }
      return {
        uid: "local_guest_student",
        displayName: "Student",
        isAnonymous: true,
      };
    })();

  // Retrieve blackboard snapshots from Firebase & local fallback keys
  const fetchSnapshots = async () => {
    const uid = currentUser?.uid || "local_guest_student";
    setLoadingSnapshots(true);
    try {
      if (uid === "local_guest_student" || uid.startsWith("local_")) {
        throw new Error("Local guest user bypassed database fetch");
      }
      const snapRef = collection(db, "studentProfiles", uid, "boardSnapshots");
      const q = query(snapRef, orderBy("timestamp", "desc"), limit(40));
      const snapshotDocs = await getDocs(q);
      const parsed = snapshotDocs.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          snapshotId: d.snapshotId || docSnap.id,
          userId: d.userId,
          topicTitle: d.topicTitle || "Classroom Board Snapshot",
          description:
            d.description || "Interactive calculation whiteboard screenshot.",
          imgData: d.imgData,
          subject: d.subject,
          grade: d.grade,
          topicIndex: d.topicIndex,
          timestamp: d.timestamp,
        } as BoardSnapshot;
      });
      setSnapshots(parsed);
      safeSetItem(`snapshots_${uid}`, JSON.stringify(parsed));
    } catch (e) {
      const cachedStr =
        localStorage.getItem(`snapshots_${uid}`) ||
        localStorage.getItem("snapshots_local_guest_student") ||
        localStorage.getItem("snapshots_guest") ||
        localStorage.getItem("all_board_snapshots");
      if (cachedStr) {
        try {
          setSnapshots(JSON.parse(cachedStr));
        } catch (_) {}
      }
    } finally {
      setLoadingSnapshots(false);
    }
  };

  // Real-time snapshots and quiz attempts listeners
  useEffect(() => {
    const uid = currentUser?.uid || "local_guest_student";
    const isGuest = uid === "local_guest_student" || uid.startsWith("local_");
    if (isGuest) {
      // Local Guest fallbacks - load across all storage keys
      const cachedSnapsStr =
        localStorage.getItem(`snapshots_${uid}`) ||
        localStorage.getItem("snapshots_local_guest_student") ||
        localStorage.getItem("snapshots_guest") ||
        localStorage.getItem("all_board_snapshots");
      if (cachedSnapsStr) {
        try {
          setSnapshots(JSON.parse(cachedSnapsStr));
        } catch (_) {}
      }
      const cachedQuizzes = localStorage.getItem(
        `guest_quiz_attempts_${subject}`,
      );
      if (cachedQuizzes) {
        try {
          setQuizAttempts(JSON.parse(cachedQuizzes));
        } catch (_) {}
      }
      return;
    }

    // 1. Real-time board snapshots listener
    const snapRef = collection(db, "studentProfiles", uid, "boardSnapshots");
    const qSnaps = query(snapRef, orderBy("timestamp", "desc"), limit(40));
    const unsubSnaps = onSnapshot(
      qSnaps,
      (snapshotDocs) => {
        const parsed = snapshotDocs.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            snapshotId: d.snapshotId || docSnap.id,
            userId: d.userId,
            topicTitle: d.topicTitle || "Classroom Board Snapshot",
            description:
              d.description || "Interactive calculation whiteboard screenshot.",
            imgData: d.imgData,
            subject: d.subject,
            grade: d.grade,
            topicIndex: d.topicIndex,
            timestamp: d.timestamp,
          } as BoardSnapshot;
        });
        setSnapshots(parsed);
        safeSetItem(`snapshots_${uid}`, JSON.stringify(parsed));
      },
      (error) => {
        console.warn(
          "Realtime board snapshots listener failed, using local cache:",
          error,
        );
        const cachedSnapsStr =
          localStorage.getItem(`snapshots_${uid}`) ||
          localStorage.getItem("snapshots_local_guest_student") ||
          localStorage.getItem("all_board_snapshots");
        if (cachedSnapsStr) {
          try {
            setSnapshots(JSON.parse(cachedSnapsStr));
          } catch (_) {}
        }
      },
    );

    // 2. Real-time quiz attempts listener
    const attemptsRef = collection(db, "studentProfiles", uid, "quizAttempts");
    const qQuizzes = query(
      attemptsRef,
      orderBy("timestamp", "desc"),
      limit(50),
    );
    const unsubQuizzes = onSnapshot(
      qQuizzes,
      (snapshotDocs) => {
        const parsed = snapshotDocs.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            attemptId: docSnap.id,
            timestamp: d.timestamp,
            score: d.score,
            total: d.total,
            accuracy: d.accuracy,
            source: d.source,
            docName: d.docName,
            subject: d.subject,
            grade: d.grade,
            history: d.history || [],
          };
        });
        setQuizAttempts(parsed);
        safeSetItem(`quizAttempts_${uid}`, JSON.stringify(parsed));
      },
      (error) => {
        console.warn("Realtime quiz attempts listener failed:", error);
      },
    );

    return () => {
      unsubSnaps();
      unsubQuizzes();
    };
  }, [currentUser?.uid, subject]);

  // Compute dashboard statistics in real-time
  const dashboardStats = useMemo(() => {
    // Filter attempts for currently selected subject, or use all as fallback if active subject has no attempts
    let subjectAttempts = quizAttempts.filter(
      (a) => (a.subject || "").toLowerCase() === subject.toLowerCase(),
    );
    if (subjectAttempts.length === 0) {
      subjectAttempts = quizAttempts; // Fallback to all
    }

    // Default dimensions if no attempts are recorded
    let conceptClarity = 75;
    let theoreticalCore = 70;
    let calculationPrecision = 60;
    let formulaRecall = 65;

    // Strengths & Growth lists
    let strengths: Array<{ concept: string; category: string }> = [];
    let growths: Array<{
      concept: string;
      category: string;
      explanation: string;
    }> = [];

    if (subjectAttempts.length > 0) {
      // Gather all question answers
      let conceptCorrect = 0,
        conceptTotal = 0;
      let theoryCorrect = 0,
        theoryTotal = 0;
      let calcCorrect = 0,
        calcTotal = 0;
      let formulaCorrect = 0,
        formulaTotal = 0;

      subjectAttempts.forEach((attempt) => {
        const history = attempt.history || [];
        history.forEach((h: any) => {
          const category = (h.cognitiveCategory || "").toLowerCase();
          const isCorrect = !!h.isCorrect;

          if (category.includes("concept") || category.includes("clarity")) {
            conceptTotal++;
            if (isCorrect) conceptCorrect++;
          } else if (
            category.includes("theory") ||
            category.includes("theoretical") ||
            category.includes("core")
          ) {
            theoryTotal++;
            if (isCorrect) theoryCorrect++;
          } else if (
            category.includes("calculation") ||
            category.includes("solving") ||
            category.includes("precision")
          ) {
            calcTotal++;
            if (isCorrect) calcCorrect++;
          } else if (
            category.includes("formula") ||
            category.includes("retention") ||
            category.includes("recall")
          ) {
            formulaTotal++;
            if (isCorrect) formulaCorrect++;
          }

          // Gather strengths and growths
          if (isCorrect) {
            if (
              h.conceptTested &&
              !strengths.some((s) => s.concept === h.conceptTested)
            ) {
              strengths.push({
                concept: h.conceptTested,
                category: h.cognitiveCategory || "Topic Mastery",
              });
            }
          } else {
            if (
              h.conceptTested &&
              !growths.some((g) => g.concept === h.conceptTested)
            ) {
              growths.push({
                concept: h.conceptTested,
                category: h.cognitiveCategory || "Topic Mastery",
                explanation:
                  h.explanation ||
                  h.theoryTested ||
                  "A quick chalkboard review will help solidify this concept!",
              });
            }
          }
        });
      });

      if (conceptTotal > 0)
        conceptClarity = Math.round((conceptCorrect / conceptTotal) * 100);
      if (theoryTotal > 0)
        theoreticalCore = Math.round((theoryCorrect / theoryTotal) * 100);
      if (calcTotal > 0)
        calculationPrecision = Math.round((calcCorrect / calcTotal) * 100);
      if (formulaTotal > 0)
        formulaRecall = Math.round((formulaCorrect / formulaTotal) * 100);
    }

    // Classroom Engagement / Socratic Stamina calculation
    const classesSess = pastSessions?.length || 0;
    const totalSnapshots = snapshots?.length || 0;
    const totalQuizzes = quizAttempts?.length || 0;
    const masteredCount = Object.keys(masteredCards).filter(
      (k) => masteredCards[k],
    ).length;

    const sessionScore = Math.min(45, classesSess * 15);
    const snapScore = Math.min(25, totalSnapshots * 5);
    const quizScore = Math.min(20, totalQuizzes * 10);
    const cardScore = Math.min(10, masteredCount * 2);

    const socraticStamina = Math.min(
      100,
      Math.max(30, sessionScore + snapScore + quizScore + cardScore),
    );

    // Default lists if empty to keep dashboard lively
    if (strengths.length === 0) {
      strengths = [
        {
          concept: "Linear Equation Formulation",
          category: "Conceptual Application",
        },
        {
          concept: "Standard Chalkboard Definitions",
          category: "Theoretical Core",
        },
      ];
    }
    if (growths.length === 0) {
      growths = [
        {
          concept: "Multi-Step Calculation Flow",
          category: "Calculations & Solving",
          explanation:
            "Watch for signs when transposing terms across algebraic equations.",
        },
        {
          concept: "Formulas for Area & Volume",
          category: "Formula Retention",
          explanation:
            "Practice active recall on area coefficients of common geometric shapes.",
        },
      ];
    }

    return {
      conceptClarity,
      theoreticalCore,
      calculationPrecision,
      formulaRecall,
      socraticStamina,
      strengths,
      growths,
      subjectAttempts,
    };
  }, [quizAttempts, subject, pastSessions, snapshots, masteredCards]);

  // Phase 1: Micro-Diagnostics & Granular Sub-Topic Catalog Engine
  const microDiagnosticsData = useMemo(() => {
    // Standard Syllabus Sub-Topic Pools
    const SUBTOPIC_CATALOG: Array<{
      id: string;
      name: string;
      chapter: string;
      subject: string;
      defaultMastery: number;
      benchmarkLatencySec: number;
      dominantMistake: "conceptual" | "calculation" | "formula" | "speed";
      keyFormulas: string[];
      prescriptionHint: string;
      typicalQuestion: string;
      explanation: string;
    }> = [
      // Mathematics
      {
        id: "math-quad-1",
        name: "Quadratic Formula & Discriminant Analysis",
        chapter: "Quadratic Equations",
        subject: "Mathematics",
        defaultMastery: 58,
        benchmarkLatencySec: 55,
        dominantMistake: "calculation",
        keyFormulas: [
          "x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}",
          "D = b^2 - 4ac",
        ],
        prescriptionHint:
          "Pay special attention to negative signs inside b^2 - 4ac when b is negative.",
        typicalQuestion:
          "Find the roots of 2x^2 - 7x + 3 = 0 using the quadratic formula.",
        explanation:
          "Keep sign brackets explicit: -(-7) = +7, and (-7)^2 = 49.",
      },
      {
        id: "math-trig-1",
        name: "Trigonometric Identities & Pythagorean Relations",
        chapter: "Trigonometry",
        subject: "Mathematics",
        defaultMastery: 52,
        benchmarkLatencySec: 65,
        dominantMistake: "formula",
        keyFormulas: [
          "\sin^2\theta + \cos^2\theta = 1",
          "1 + \tan^2\theta = \sec^2\theta",
          "1 + \cot^2\theta = \csc^2\theta",
        ],
        prescriptionHint:
          "Convert complex expressions into terms of sin and cos first to eliminate terms cleanly.",
        typicalQuestion:
          "Prove that (sin θ + cos θ)^2 + (sin θ - cos θ)^2 = 2.",
        explanation:
          "Expanding (sin^2 + 2sin cos + cos^2) + (sin^2 - 2sin cos + cos^2) leaves 2(sin^2 + cos^2) = 2.",
      },
      {
        id: "math-calc-1",
        name: "Chain Rule & Differentiation Precision",
        chapter: "Calculus",
        subject: "Mathematics",
        defaultMastery: 74,
        benchmarkLatencySec: 50,
        dominantMistake: "conceptual",
        keyFormulas: ["\frac{d}{dx}[f(g(x))] = f'(g(x)) \cdot g'(x)"],
        prescriptionHint:
          "Always differentiate the outer function first, then multiply by the derivative of the inner layer.",
        typicalQuestion: "Differentiate y = sin(3x^2 + 5) with respect to x.",
        explanation:
          "dy/dx = cos(3x^2 + 5) * d/dx(3x^2 + 5) = 6x cos(3x^2 + 5).",
      },
      {
        id: "math-geom-1",
        name: "Coordinate Geometry: Distance & Section Formula",
        chapter: "Coordinate Geometry",
        subject: "Mathematics",
        defaultMastery: 86,
        benchmarkLatencySec: 40,
        dominantMistake: "speed",
        keyFormulas: [
          "d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}",
          "P = \left(\frac{m x_2 + n x_1}{m+n}, \frac{m y_2 + n y_1}{m+n}\right)",
        ],
        prescriptionHint:
          "Write coordinate points with explicit indices (x1, y1) and (x2, y2) to prevent swapping.",
        typicalQuestion:
          "Find the distance between points A(3, -2) and B(7, 1).",
        explanation:
          "d = sqrt((7-3)^2 + (1 - (-2))^2) = sqrt(16 + 9) = sqrt(25) = 5 units.",
      },
      {
        id: "math-prob-1",
        name: "Conditional Probability & Bayes' Theorem",
        chapter: "Probability & Statistics",
        subject: "Mathematics",
        defaultMastery: 62,
        benchmarkLatencySec: 70,
        dominantMistake: "conceptual",
        keyFormulas: [
          "P(A|B) = \frac{P(A \cap B)}{P(B)}",
          "P(B) = \sum P(B|A_i)P(A_i)",
        ],
        prescriptionHint:
          "Clearly define events A and B before substituting into conditional probability formulas.",
        typicalQuestion:
          "Two dice are rolled. Given that the sum is 8, find the probability that one die is 3.",
        explanation:
          "Possible pairs with sum 8 are (2,6),(3,5),(4,4),(5,3),(6,2). Pairs with a 3 are (3,5) and (5,3). P = 2/5.",
      },
      // Physics
      {
        id: "phy-kin-1",
        name: "Kinematic Equations & Projectile Motion",
        chapter: "Kinematics",
        subject: "Physics",
        defaultMastery: 64,
        benchmarkLatencySec: 60,
        dominantMistake: "calculation",
        keyFormulas: [
          "v = u + at",
          "s = ut + \frac{1}{2}at^2",
          "v^2 = u^2 + 2as",
          "H_{max} = \frac{u^2 \sin^2\theta}{2g}",
        ],
        prescriptionHint:
          "Choose an explicit sign convention (+y upward, -y downward) before writing equations.",
        typicalQuestion:
          "A ball thrown upwards reaches max height in 3s. Find initial velocity (g = 9.8 m/s^2).",
        explanation: "At max height v = 0. 0 = u - (9.8)(3) => u = 29.4 m/s.",
      },
      {
        id: "phy-elec-1",
        name: "Current Electricity: Kirchhoff's Laws & Circuit Loops",
        chapter: "Current Electricity",
        subject: "Physics",
        defaultMastery: 54,
        benchmarkLatencySec: 75,
        dominantMistake: "conceptual",
        keyFormulas: ["\sum I = 0", "\sum \Delta V = \sum IR"],
        prescriptionHint:
          "Follow loop traversal direction consistently; entering negative battery terminal gives +E.",
        typicalQuestion:
          "Apply KVL to a closed mesh containing a 12V battery and 4Ω, 2Ω resistors.",
        explanation: "Net loop emf: 12 - 4I - 2I = 0 => 6I = 12 => I = 2A.",
      },
      {
        id: "phy-opt-1",
        name: "Lens Formula & Sign Convention (Ray Optics)",
        chapter: "Ray & Wave Optics",
        subject: "Physics",
        defaultMastery: 78,
        benchmarkLatencySec: 45,
        dominantMistake: "formula",
        keyFormulas: [
          "\frac{1}{f} = \frac{1}{v} - \frac{1}{u}",
          "m = \frac{v}{u}",
        ],
        prescriptionHint:
          "Remember for lenses: 1/f = 1/v - 1/u (minus sign), whereas mirrors use plus.",
        typicalQuestion:
          "An object is placed 20cm before a convex lens (f = 10cm). Find image distance v.",
        explanation:
          "u = -20cm, f = +10cm. 1/v = 1/f + 1/u = 1/10 - 1/20 = 1/20 => v = +20cm (real image).",
      },
      {
        id: "phy-thermo-1",
        name: "First Law of Thermodynamics & Heat Engines",
        chapter: "Thermodynamics",
        subject: "Physics",
        defaultMastery: 82,
        benchmarkLatencySec: 50,
        dominantMistake: "speed",
        keyFormulas: [
          "\Delta Q = \Delta U + W",
          "W = P\Delta V",
          "\eta = 1 - \frac{T_2}{T_1}",
        ],
        prescriptionHint:
          "For isothermal processes, ΔU = 0 so ΔQ = W. Temperatures must always be in Kelvin.",
        typicalQuestion:
          "Find efficiency of a Carnot engine working between 600K and 300K.",
        explanation: "eta = 1 - (300/600) = 1 - 0.5 = 50%.",
      },
      // Chemistry
      {
        id: "chem-bond-1",
        name: "VSEPR Theory, Molecular Geometry & Hybridization",
        chapter: "Chemical Bonding",
        subject: "Chemistry",
        defaultMastery: 60,
        benchmarkLatencySec: 55,
        dominantMistake: "conceptual",
        keyFormulas: [
          "\text{Steric No.} = \sigma\text{-bonds} + \text{Lone Pairs}",
          "sp^3d \rightarrow \text{Trigonal Bipyramidal}",
        ],
        prescriptionHint:
          "Count valence electrons of central atom and lone pairs before predicting molecular shape.",
        typicalQuestion: "Determine hybridization and shape of XeF4 molecule.",
        explanation:
          "Xe has 8 valence e-. 4 bonds + 2 lone pairs = Steric No. 6 => sp^3d^2 hybridization, Square Planar shape.",
      },
      {
        id: "chem-thermo-1",
        name: "Gibbs Free Energy & Spontaneity (ΔG = ΔH - TΔS)",
        chapter: "Thermodynamics",
        subject: "Chemistry",
        defaultMastery: 56,
        benchmarkLatencySec: 60,
        dominantMistake: "calculation",
        keyFormulas: [
          "\Delta G^\circ = \Delta H^\circ - T\Delta S^\circ",
          "\Delta G^\circ = -RT\ln K",
        ],
        prescriptionHint:
          "Units mismatch trap: Convert ΔS from J/(mol·K) to kJ/(mol·K) before subtracting from ΔH.",
        typicalQuestion:
          "A reaction has ΔH = -40 kJ and ΔS = -100 J/K at 298K. Is it spontaneous?",
        explanation:
          "TΔS = 298 * (-0.1 kJ/K) = -29.8 kJ. ΔG = -40 - (-29.8) = -10.2 kJ (< 0, so Spontaneous).",
      },
      {
        id: "chem-org-1",
        name: "Nucleophilic Substitution (SN1 vs SN2 Mechanisms)",
        chapter: "Organic Chemistry",
        subject: "Chemistry",
        defaultMastery: 72,
        benchmarkLatencySec: 50,
        dominantMistake: "formula",
        keyFormulas: [
          "\text{SN1: 3}^\circ > 2^\circ > 1^\circ\text{ (Carbocation)}",
          "\text{SN2: 1}^\circ > 2^\circ > 3^\circ\text{ (Inversion)}",
        ],
        prescriptionHint:
          "SN2 is favored by primary halides and polar aprotic solvents with backside attack (Walden Inversion).",
        typicalQuestion:
          "Which substrate reacts fastest via SN2: 1-bromobutane or 2-bromobutane?",
        explanation:
          "1-bromobutane is primary, having less steric hindrance for nucleophilic attack.",
      },
      // Biology & Science
      {
        id: "bio-gen-1",
        name: "Mendelian Dihybrid Cross & Independent Assortment",
        chapter: "Genetics & Inheritance",
        subject: "Biology",
        defaultMastery: 65,
        benchmarkLatencySec: 55,
        dominantMistake: "calculation",
        keyFormulas: [
          "\text{F2 Phenotypic Ratio: } 9:3:3:1",
          "\text{Gametes} = 2^n",
        ],
        prescriptionHint:
          "Use branch diagram method for multi-gene crosses instead of drawing massive Punnett squares.",
        typicalQuestion:
          "In a cross RrYy x RrYy, what proportion of offspring will be round green (R_yy)?",
        explanation:
          "P(Round R_) = 3/4. P(Green yy) = 1/4. P(Round Green) = 3/4 * 1/4 = 3/16.",
      },
      {
        id: "bio-phys-1",
        name: "Cellular Respiration & ATP Yield Calculation",
        chapter: "Plant & Cell Physiology",
        subject: "Biology",
        defaultMastery: 75,
        benchmarkLatencySec: 45,
        dominantMistake: "formula",
        keyFormulas: [
          "1\text{ NADH} \approx 2.5\text{ ATP}",
          "1\text{ FADH}_2 \approx 1.5\text{ ATP}",
          "\text{Net} \approx 30-32\text{ ATP}",
        ],
        prescriptionHint:
          "Remember glycolysis generates net 2 ATP directly and 2 NADH in cytoplasm.",
        typicalQuestion:
          "How many ATPs are yielded in complete aerobic breakdown of one glucose molecule?",
        explanation:
          "Net total is approximately 30 to 32 ATP depending on the shuttle system.",
      },
    ];

    // Combine real quiz attempts with topic catalog
    const allAttempts = quizAttempts || [];

    // Aggregate real question logs
    const realQuestionLogs: Record<string, any[]> = {};
    let totalAttemptsAnalyzed = 0;
    let mistakeCounts = {
      conceptual: 0,
      calculation: 0,
      formula: 0,
      speed: 0,
    };
    let totalLatencySec = 0;
    let latencyCount = 0;

    allAttempts.forEach((attempt) => {
      const history = attempt.history || [];
      history.forEach((q: any) => {
        totalAttemptsAnalyzed++;
        const testedConcept = (q.conceptTested || q.topic || "").toLowerCase();
        const isCorrect = !!q.isCorrect;
        const latency = q.timeTakenSec || Math.floor(35 + Math.random() * 30);
        totalLatencySec += latency;
        latencyCount++;

        // Determine mistake archetype
        let mType: "conceptual" | "calculation" | "formula" | "speed" =
          "conceptual";
        const cat = (q.cognitiveCategory || "").toLowerCase();
        if (cat.includes("calc") || cat.includes("precision"))
          mType = "calculation";
        else if (cat.includes("formula") || cat.includes("recall"))
          mType = "formula";
        else if (latency < 20 || latency > 90) mType = "speed";
        else mType = "conceptual";

        if (!isCorrect) {
          mistakeCounts[mType]++;
        }

        // Map into subtopics
        SUBTOPIC_CATALOG.forEach((sub) => {
          if (
            testedConcept.includes(sub.name.toLowerCase()) ||
            testedConcept.includes(sub.chapter.toLowerCase()) ||
            (q.subject && q.subject.toLowerCase() === sub.subject.toLowerCase())
          ) {
            if (!realQuestionLogs[sub.id]) realQuestionLogs[sub.id] = [];
            realQuestionLogs[sub.id].push({
              question: q.question || sub.typicalQuestion,
              userAnswer:
                q.userAnswer ||
                (isCorrect ? "Correct Option" : "Incorrect Option"),
              correctAnswer: q.correctAnswer || "Correct Standard Solution",
              isCorrect,
              explanation: q.explanation || sub.explanation,
              latencySec: latency,
              mistakeType: mType,
              conceptTested: q.conceptTested || sub.name,
            });
          }
        });
      });
    });

    // Populate processed subtopics
    const processedSubtopics = SUBTOPIC_CATALOG.map((item) => {
      const logs = realQuestionLogs[item.id] || [];
      let mastery = item.defaultMastery;
      let totalQ = logs.length;
      let correctQ = logs.filter((l) => l.isCorrect).length;
      let avgLatency = item.benchmarkLatencySec;

      if (totalQ > 0) {
        mastery = Math.round((correctQ / totalQ) * 100);
        avgLatency = Math.round(
          logs.reduce((acc, l) => acc + l.latencySec, 0) / totalQ,
        );
      } else {
        // Synthesize dynamic realism from dashboardStats
        if (item.subject.toLowerCase() === subject.toLowerCase()) {
          if (item.dominantMistake === "calculation") {
            mastery = Math.max(
              40,
              Math.min(95, dashboardStats.calculationPrecision),
            );
          } else if (item.dominantMistake === "formula") {
            mastery = Math.max(40, Math.min(95, dashboardStats.formulaRecall));
          } else {
            mastery = Math.max(40, Math.min(95, dashboardStats.conceptClarity));
          }
        }
      }

      // Archetype distribution for this subtopic
      const itemMistakes = {
        conceptual:
          logs.filter((l) => !l.isCorrect && l.mistakeType === "conceptual")
            .length ||
          (mastery < 70 && item.dominantMistake === "conceptual" ? 3 : 1),
        calculation:
          logs.filter((l) => !l.isCorrect && l.mistakeType === "calculation")
            .length ||
          (mastery < 70 && item.dominantMistake === "calculation" ? 4 : 1),
        formula:
          logs.filter((l) => !l.isCorrect && l.mistakeType === "formula")
            .length ||
          (mastery < 70 && item.dominantMistake === "formula" ? 3 : 1),
        speed:
          logs.filter((l) => !l.isCorrect && l.mistakeType === "speed")
            .length ||
          (mastery < 70 && item.dominantMistake === "speed" ? 2 : 1),
      };

      const masteryStatus: "critical" | "practicing" | "mastered" =
        mastery >= 80 ? "mastered" : mastery >= 60 ? "practicing" : "critical";

      return {
        ...item,
        masteryScore: mastery,
        accuracy: totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : mastery,
        totalAttempts: totalQ > 0 ? totalQ : 4,
        avgLatencySec: avgLatency,
        masteryStatus,
        mistakeBreakdown: itemMistakes,
        recentQuestions:
          logs.length > 0
            ? logs
            : [
                {
                  question: item.typicalQuestion,
                  userAnswer:
                    mastery >= 75
                      ? "Step-by-Step Verified Answer"
                      : "Common Misstep / Calculation Error",
                  correctAnswer: "Standard Model Solution",
                  isCorrect: mastery >= 75,
                  explanation: item.explanation,
                  latencySec: item.benchmarkLatencySec,
                  mistakeType: item.dominantMistake,
                  conceptTested: item.name,
                },
              ],
      };
    });

    const totalErrors = Math.max(
      1,
      mistakeCounts.conceptual +
        mistakeCounts.calculation +
        mistakeCounts.formula +
        mistakeCounts.speed,
    );
    const overallAvgLatency =
      latencyCount > 0 ? Math.round(totalLatencySec / latencyCount) : 52;

    // Filter by subject, mastery, mistake type, search
    const filteredSubtopics = processedSubtopics.filter((sub) => {
      // Subject filter
      if (
        microSubjectFilter !== "all" &&
        sub.subject.toLowerCase() !== microSubjectFilter.toLowerCase()
      ) {
        return false;
      }
      // Mastery filter
      if (
        microMasteryFilter !== "all" &&
        sub.masteryStatus !== microMasteryFilter
      ) {
        return false;
      }
      // Mistake filter
      if (
        microMistakeFilter !== "all" &&
        sub.dominantMistake !== microMistakeFilter
      ) {
        return false;
      }
      // Search
      if (microSearchQuery.trim()) {
        const q = microSearchQuery.toLowerCase();
        return (
          sub.name.toLowerCase().includes(q) ||
          sub.chapter.toLowerCase().includes(q) ||
          sub.subject.toLowerCase().includes(q)
        );
      }
      return true;
    });

    const criticalGapsCount = processedSubtopics.filter(
      (s) => s.masteryStatus === "critical",
    ).length;
    const practicingCount = processedSubtopics.filter(
      (s) => s.masteryStatus === "practicing",
    ).length;
    const masteredCount = processedSubtopics.filter(
      (s) => s.masteryStatus === "mastered",
    ).length;

    return {
      subtopics: filteredSubtopics,
      allSubtopics: processedSubtopics,
      criticalGapsCount,
      practicingCount,
      masteredCount,
      overallAvgLatency,
      mistakeDistribution: {
        conceptual: {
          count: mistakeCounts.conceptual || 8,
          percent: Math.round(
            ((mistakeCounts.conceptual || 8) / (totalErrors + 14)) * 100,
          ),
          title: "Conceptual Gap",
          icon: "🎯",
          color: "text-rose-600 bg-rose-50 border-rose-200",
          remedy: "Socratic Proof & Visual Derivation on Blackboard",
        },
        calculation: {
          count: mistakeCounts.calculation || 11,
          percent: Math.round(
            ((mistakeCounts.calculation || 11) / (totalErrors + 14)) * 100,
          ),
          title: "Calculation Slip",
          icon: "🧮",
          color: "text-amber-600 bg-amber-50 border-amber-200",
          remedy: "Step-by-Step Scratchpad & Sign Verification",
        },
        formula: {
          count: mistakeCounts.formula || 6,
          percent: Math.round(
            ((mistakeCounts.formula || 6) / (totalErrors + 14)) * 100,
          ),
          title: "Formula Misrecall",
          icon: "⚡",
          color: "text-purple-600 bg-purple-50 border-purple-200",
          remedy: "KaTeX Formula Flashcards & Dimensional Checks",
        },
        speed: {
          count: mistakeCounts.speed || 4,
          percent: Math.round(
            ((mistakeCounts.speed || 4) / (totalErrors + 14)) * 100,
          ),
          title: "Speed / Panic Trap",
          icon: "⏱️",
          color: "text-sky-600 bg-sky-50 border-sky-200",
          remedy: "45s Timed Sprints & Elimination Technique",
        },
      },
    };
  }, [
    quizAttempts,
    subject,
    dashboardStats,
    microSubjectFilter,
    microMasteryFilter,
    microMistakeFilter,
    microSearchQuery,
  ]);

  // Phase 2: Ebbinghaus Forgetting Curve & Spaced Repetition Decay Engine
  const retentionEngineData = useMemo(() => {
    // Current timestamp reference (in days)
    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;

    // Subtopics catalog with realistic past study milestones
    const MEMORY_TRACKS: Array<{
      id: string;
      topicName: string;
      chapter: string;
      subject: string;
      initialStrength: number; // 0 - 100
      lastStudiedDaysAgo: number;
      repetitionCount: number; // 1, 2, 3, 4+
      halfLifeDays: number; // Stability S in Ebbinghaus R = e^(-t/S)
      keyPoints: string[];
      flashcardPrompt: string;
      flashcardAnswer: string;
      formulaKatex?: string;
    }> = [
      {
        id: "eb-quad",
        topicName: "Quadratic Equations: Discriminant & Nature of Roots",
        chapter: "Quadratic Equations",
        subject: "Mathematics",
        initialStrength: 90,
        lastStudiedDaysAgo: 8,
        repetitionCount: 2,
        halfLifeDays: 5.5,
        keyPoints: [
          "D > 0: Two distinct real roots",
          "D = 0: Real and equal roots (x = -b / 2a)",
          "D < 0: Complex conjugate roots",
        ],
        flashcardPrompt:
          "What is the condition for equal roots in ax² + bx + c = 0, and what are the roots?",
        flashcardAnswer:
          "Discriminant D = b² - 4ac = 0. The equal roots are given by x = -b / (2a).",
        formulaKatex: "D = b^2 - 4ac \\ge 0",
      },
      {
        id: "eb-trig",
        topicName: "Trigonometric Compound Angles & Identites",
        chapter: "Trigonometry",
        subject: "Mathematics",
        initialStrength: 85,
        lastStudiedDaysAgo: 14,
        repetitionCount: 1,
        halfLifeDays: 4.0,
        keyPoints: [
          "sin(A ± B) = sin A cos B ± cos A sin B",
          "cos(A ± B) = cos A cos B ∓ sin A sin B",
          "tan(A + B) = (tan A + tan B) / (1 - tan A tan B)",
        ],
        flashcardPrompt: "State the expansion of cos(A + B) and cos(A - B).",
        flashcardAnswer:
          "cos(A + B) = cos A cos B - sin A sin B, and cos(A - B) = cos A cos B + sin A sin B (sign flips).",
        formulaKatex: "\\cos(A \\pm B) = \\cos A \\cos B \\mp \\sin A \\sin B",
      },
      {
        id: "eb-calc",
        topicName: "Definite Integrals & Fundamental Theorem of Calculus",
        chapter: "Calculus",
        subject: "Mathematics",
        initialStrength: 95,
        lastStudiedDaysAgo: 2,
        repetitionCount: 3,
        halfLifeDays: 12.0,
        keyPoints: [
          "∫_a^b f(x) dx = F(b) - F(a)",
          "King's Property: ∫_0^a f(x)dx = ∫_0^a f(a - x)dx",
          "Odd function symmetry: ∫_-a^a f(x)dx = 0 if f(-x) = -f(x)",
        ],
        flashcardPrompt:
          "State King's Property of definite integrals for ∫_0^a f(x) dx.",
        flashcardAnswer:
          "∫_0^a f(x) dx = ∫_0^a f(a - x) dx. This is extremely useful for evaluating trigonometric fractions.",
        formulaKatex: "\\int_0^a f(x)\\,dx = \\int_0^a f(a - x)\\,dx",
      },
      {
        id: "eb-kin",
        topicName: "Projectile Motion: Time of Flight & Maximum Height",
        chapter: "Kinematics",
        subject: "Physics",
        initialStrength: 92,
        lastStudiedDaysAgo: 11,
        repetitionCount: 2,
        halfLifeDays: 6.0,
        keyPoints: [
          "Time of Flight T = (2u sin θ) / g",
          "Maximum Height H = (u² sin² θ) / (2g)",
          "Horizontal Range R = (u² sin 2θ) / g",
        ],
        flashcardPrompt:
          "What angle of projection yields the maximum horizontal range on flat ground?",
        flashcardAnswer:
          "θ = 45° yields maximum range R_max = u² / g because sin(2 * 45°) = sin(90°) = 1.",
        formulaKatex:
          "R_{max} = \\frac{u^2}{g} \\quad (\\text{at } \\theta = 45^\\circ)",
      },
      {
        id: "eb-kirch",
        topicName:
          "Current Electricity: Kirchhoff's Mesh Rules & Wheatstone Bridge",
        chapter: "Current Electricity",
        subject: "Physics",
        initialStrength: 80,
        lastStudiedDaysAgo: 18,
        repetitionCount: 1,
        halfLifeDays: 3.8,
        keyPoints: [
          "KCL (Junction Rule): Conservation of electric charge (∑ I = 0)",
          "KVL (Loop Rule): Conservation of energy (∑ ΔV = 0)",
          "Balanced Wheatstone Bridge: P / Q = R / S => Galvanometer current = 0",
        ],
        flashcardPrompt:
          "Which conservation law underpins Kirchhoff's First Law (KCL) and Second Law (KVL)?",
        flashcardAnswer:
          "KCL is based on the Law of Conservation of Charge; KVL is based on the Law of Conservation of Energy.",
        formulaKatex: "\\frac{P}{Q} = \\frac{R}{S} \\implies I_g = 0",
      },
      {
        id: "eb-optics",
        topicName: "Ray Optics: Total Internal Reflection & Snell's Law",
        chapter: "Optics",
        subject: "Physics",
        initialStrength: 88,
        lastStudiedDaysAgo: 4,
        repetitionCount: 3,
        halfLifeDays: 14.0,
        keyPoints: [
          "Snell's Law: n1 sin θ1 = n2 sin θ2",
          "Critical Angle condition: sin θ_c = n2 / n1 (where n1 > n2)",
          "TIR occurs when light travels from denser to rarer medium at angle > θ_c",
        ],
        flashcardPrompt:
          "What are the two mandatory conditions for Total Internal Reflection (TIR) to occur?",
        flashcardAnswer:
          "1. Light must travel from a denser optical medium to a rarer medium. 2. Angle of incidence must exceed the critical angle (i > c).",
        formulaKatex:
          "\\sin \\theta_c = \\frac{n_{\\text{rare}}}{n_{\\text{dense}}}",
      },
      {
        id: "eb-chem-bond",
        topicName: "Chemical Bonding: Hybridization & Molecular Orbital Theory",
        chapter: "Chemical Bonding",
        subject: "Chemistry",
        initialStrength: 84,
        lastStudiedDaysAgo: 21,
        repetitionCount: 1,
        halfLifeDays: 3.5,
        keyPoints: [
          "Bond Order = 0.5 * (N_b - N_a)",
          "Paramagnetism occurs when unpaired electrons exist in MOs (e.g. O2)",
          "Diamagnetic species have all paired electrons (e.g. N2)",
        ],
        flashcardPrompt:
          "Why is the Oxygen molecule (O2) paramagnetic according to MOT?",
        flashcardAnswer:
          "O2 has 16 electrons, resulting in 2 unpaired electrons in degenerate antibonding π*2px and π*2py orbitals.",
        formulaKatex: "\\text{Bond Order} = \\frac{N_b - N_a}{2}",
      },
      {
        id: "eb-chem-thermo",
        topicName: "Thermodynamics: Enthalpy, Entropy & Spontaneity",
        chapter: "Thermodynamics",
        subject: "Chemistry",
        initialStrength: 86,
        lastStudiedDaysAgo: 6,
        repetitionCount: 2,
        halfLifeDays: 7.0,
        keyPoints: [
          "ΔG = ΔH - TΔS",
          "ΔG < 0: Strictly spontaneous process",
          "ΔG = 0: Dynamic chemical equilibrium",
        ],
        flashcardPrompt:
          "At what temperature does a non-spontaneous endothermic reaction (ΔH > 0, ΔS > 0) become spontaneous?",
        flashcardAnswer:
          "When temperature T > (ΔH / ΔS), the -TΔS term dominates and makes ΔG negative (< 0).",
        formulaKatex:
          "\\Delta G^\\circ = \\Delta H^\\circ - T\\Delta S^\\circ < 0",
      },
      {
        id: "eb-bio-gen",
        topicName: "Genetics: Mendelian Inheritance & Chromosomal Mapping",
        chapter: "Genetics",
        subject: "Biology",
        initialStrength: 88,
        lastStudiedDaysAgo: 16,
        repetitionCount: 1,
        halfLifeDays: 4.2,
        keyPoints: [
          "Law of Segregation: Alleles separate during gamete formation",
          "Law of Independent Assortment: Dihybrid 9:3:3:1 ratio",
          "Linkage violates independent assortment (discovered by Morgan in Drosophila)",
        ],
        flashcardPrompt:
          "Why does genetic linkage deviate from Mendel's Law of Independent Assortment?",
        flashcardAnswer:
          "Linked genes sit close together on the same chromosome and tend to be inherited together without recombining.",
        formulaKatex:
          "\\text{Recombination Freq} = \\frac{\\text{Recombinant Offspring}}{\\text{Total Offspring}} \\times 100",
      },
    ];

    // Compute retention decay scores using Ebbinghaus Model: R = S0 * e^(-t / S)
    const computedItems = MEMORY_TRACKS.map((item) => {
      // Time t in days
      const t = item.lastStudiedDaysAgo;
      // Exponential decay: R = initial * exp(-t / halfLife)
      const retentionDecimal = Math.exp(-t / item.halfLifeDays);
      const currentRetentionPercent = Math.max(
        12,
        Math.min(100, Math.round(item.initialStrength * retentionDecimal)),
      );

      // Next optimal review day according to Leitner schedule (1, 3, 7, 14, 30 days)
      const reviewIntervals = [1, 3, 7, 14, 30];
      const nextReviewDays =
        reviewIntervals[
          Math.min(reviewIntervals.length - 1, item.repetitionCount)
        ];
      const daysOverdue = Math.max(0, t - nextReviewDays);

      // Urgency Classification
      let urgency: "critical" | "warning" | "stable" = "stable";
      let urgencyLabel = "Optimal Retention";
      let urgencyColor = "text-emerald-700 bg-emerald-50 border-emerald-200";

      if (currentRetentionPercent < 50 || daysOverdue >= 5) {
        urgency = "critical";
        urgencyLabel = "Immediate Revision Due";
        urgencyColor = "text-rose-700 bg-rose-50 border-rose-200";
      } else if (currentRetentionPercent < 72 || daysOverdue > 0) {
        urgency = "warning";
        urgencyLabel = "Decaying (Review Soon)";
        urgencyColor = "text-amber-700 bg-amber-50 border-amber-200";
      }

      // Memory Curve Projection Points: Day 0, Day 1, Day 3, Day 7, Day 14, Day 30
      const curveTimeline = [
        { day: 0, r: 100 },
        { day: 1, r: Math.round(100 * Math.exp(-1 / item.halfLifeDays)) },
        { day: 3, r: Math.round(100 * Math.exp(-3 / item.halfLifeDays)) },
        { day: 7, r: Math.round(100 * Math.exp(-7 / item.halfLifeDays)) },
        { day: 14, r: Math.round(100 * Math.exp(-14 / item.halfLifeDays)) },
        { day: 30, r: Math.round(100 * Math.exp(-30 / item.halfLifeDays)) },
      ];

      return {
        ...item,
        currentRetention: currentRetentionPercent,
        daysOverdue,
        nextReviewDays,
        urgency,
        urgencyLabel,
        urgencyColor,
        curveTimeline,
      };
    });

    // Filter by subject and urgency
    const filtered = computedItems.filter((item) => {
      if (
        retentionActiveSubject !== "all" &&
        item.subject.toLowerCase() !== retentionActiveSubject.toLowerCase()
      ) {
        return false;
      }
      if (
        retentionFilterUrgency !== "all" &&
        item.urgency !== retentionFilterUrgency
      ) {
        return false;
      }
      return true;
    });

    const criticalCount = computedItems.filter(
      (i) => i.urgency === "critical",
    ).length;
    const warningCount = computedItems.filter(
      (i) => i.urgency === "warning",
    ).length;
    const stableCount = computedItems.filter(
      (i) => i.urgency === "stable",
    ).length;
    const avgRetention = Math.round(
      computedItems.reduce((acc, i) => acc + i.currentRetention, 0) /
        computedItems.length,
    );

    return {
      items: filtered,
      allItems: computedItems,
      criticalCount,
      warningCount,
      stableCount,
      avgRetention,
    };
  }, [retentionFilterUrgency, retentionActiveSubject]);

  // Phase 3: Cognitive Agility, Speed-Accuracy Quadrant Matrix & Socratic Stamina Engine
  const staminaAnalyticsData = useMemo(() => {
    // Topics catalog with accuracy and average latency metrics
    const AGILITY_TOPICS: Array<{
      id: string;
      topicName: string;
      chapter: string;
      subject: string;
      accuracy: number; // 0 - 100%
      avgLatencySec: number; // seconds
      benchmarkSec: number;
      dominantSlip: string;
      speedStrategy: string;
      rapidFireQuestion: string;
      rapidFireOptions: string[];
      correctOptionIndex: number;
      explanation: string;
    }> = [
      {
        id: "ag-calc-chain",
        topicName: "Calculus: Chain Rule & Multi-Layer Differentiation",
        chapter: "Calculus",
        subject: "Mathematics",
        accuracy: 92,
        avgLatencySec: 32,
        benchmarkSec: 45,
        dominantSlip: "None (High Automaticity)",
        speedStrategy:
          "Outer-to-inner peeling method without rewriting auxiliary variables.",
        rapidFireQuestion: "Differentiate y = (3x² - 5)⁴ with respect to x.",
        rapidFireOptions: [
          "24x(3x² - 5)³",
          "12x(3x² - 5)³",
          "4(3x² - 5)³",
          "24(3x² - 5)³",
        ],
        correctOptionIndex: 0,
        explanation:
          "dy/dx = 4(3x² - 5)³ * d/dx(3x² - 5) = 4(3x² - 5)³ * 6x = 24x(3x² - 5)³.",
      },
      {
        id: "ag-quad-roots",
        topicName: "Quadratic Equations: Sum & Product of Roots (Vieta's)",
        chapter: "Algebra",
        subject: "Mathematics",
        accuracy: 88,
        avgLatencySec: 28,
        benchmarkSec: 40,
        dominantSlip: "Occasional sign reversal in -b/a",
        speedStrategy:
          "Instant Vieta inspection: sum = -b/a, product = c/a directly from standard form.",
        rapidFireQuestion:
          "For 2x² - 8x + 6 = 0, what is the sum and product of the roots (α + β, αβ)?",
        rapidFireOptions: [
          "Sum = 4, Product = 3",
          "Sum = -4, Product = 3",
          "Sum = 4, Product = -3",
          "Sum = 8, Product = 6",
        ],
        correctOptionIndex: 0,
        explanation: "Sum = -(-8)/2 = 4. Product = 6/2 = 3.",
      },
      {
        id: "ag-int-parts",
        topicName: "Integration by Parts & ILATE Hierarchy",
        chapter: "Calculus",
        subject: "Mathematics",
        accuracy: 84,
        avgLatencySec: 68,
        benchmarkSec: 50,
        dominantSlip: "Over-writing intermediate algebra steps",
        speedStrategy:
          "Use tabular DI (Derivative-Integral) method for polynomial-exponential products.",
        rapidFireQuestion: "Evaluate ∫ x · e^(2x) dx.",
        rapidFireOptions: [
          "(x/2 - 1/4) e^(2x) + C",
          "(x/2 + 1/4) e^(2x) + C",
          "x e^(2x) - 2 e^(2x) + C",
          "(x - 1/2) e^(2x) + C",
        ],
        correctOptionIndex: 0,
        explanation:
          "Using tabular integration: D: x -> 1 -> 0, I: e^(2x) -> 1/2 e^(2x) -> 1/4 e^(2x). Result = 1/2 x e^(2x) - 1/4 e^(2x) + C.",
      },
      {
        id: "ag-trig-sub",
        topicName: "Trigonometric Transformations & Product-to-Sum",
        chapter: "Trigonometry",
        subject: "Mathematics",
        accuracy: 86,
        avgLatencySec: 62,
        benchmarkSec: 45,
        dominantSlip: "Hesitation between 2sinAcosB formulas",
        speedStrategy:
          "Recall 2sinAcosB = sin(A+B) + sin(A-B) as alternating sum.",
        rapidFireQuestion: "Express 2 sin(4θ) cos(2θ) as a sum of sines.",
        rapidFireOptions: [
          "sin(6θ) + sin(2θ)",
          "sin(6θ) - sin(2θ)",
          "cos(6θ) + cos(2θ)",
          "2 sin(6θ)",
        ],
        correctOptionIndex: 0,
        explanation:
          "2 sin A cos B = sin(A+B) + sin(A-B). Here A=4θ, B=2θ => sin(6θ) + sin(2θ).",
      },
      {
        id: "ag-kin-proj",
        topicName: "Projectile Motion: Maximum Range & Complementary Angles",
        chapter: "Kinematics",
        subject: "Physics",
        accuracy: 45,
        avgLatencySec: 22,
        benchmarkSec: 45,
        dominantSlip:
          "Impulsive rushing without reading flat vs inclined plane",
        speedStrategy:
          "Enforce 5-second problem diagramming before selecting formula.",
        rapidFireQuestion:
          "For projection angles θ and (90° - θ) at the same initial speed u, what is the ratio of horizontal ranges R1 : R2?",
        rapidFireOptions: ["1 : 1", "tan θ : 1", "sin θ : cos θ", "1 : 2"],
        correctOptionIndex: 0,
        explanation:
          "Horizontal range R = u² sin(2θ)/g. Since sin(2(90°-θ)) = sin(180°-2θ) = sin(2θ), the ranges are identical (1:1).",
      },
      {
        id: "ag-elec-coulomb",
        topicName: "Electrostatics: Coulomb's Law & Vector Superposition",
        chapter: "Electrostatics",
        subject: "Physics",
        accuracy: 52,
        avgLatencySec: 26,
        benchmarkSec: 50,
        dominantSlip: "Misplacing attraction/repulsion arrow directions",
        speedStrategy:
          "Draw explicit force vectors with charge signs at the test charge.",
        rapidFireQuestion:
          "If the distance between two point charges is halved and both charges are doubled, the electrostatic force becomes:",
        rapidFireOptions: ["16 times", "4 times", "8 times", "2 times"],
        correctOptionIndex: 0,
        explanation:
          "F = k q1 q2 / r². If q1, q2 double and r becomes r/2, F' = k(2)(2)/(1/2)² = 4 / (1/4) = 16 F.",
      },
      {
        id: "ag-optics-lens",
        topicName: "Ray Optics: Lens Maker's Formula & Thin Lens Combination",
        chapter: "Optics",
        subject: "Physics",
        accuracy: 42,
        avgLatencySec: 74,
        benchmarkSec: 50,
        dominantSlip: "Sign convention ambiguity in concave/convex radii",
        speedStrategy:
          "First-principles Cartesian sign convention drill on digital chalkboard.",
        rapidFireQuestion:
          "An equiconvex lens of focal length f is cut into two equal halves along the principal axis. The focal length of each half is:",
        rapidFireOptions: ["f", "2f", "f / 2", "4f"],
        correctOptionIndex: 0,
        explanation:
          "Cutting along the principal axis retains the same radius of curvature and refractive index, so focal length remains f.",
      },
      {
        id: "ag-chem-thermo",
        topicName: "Thermodynamics: Hess's Law & Enthalpy of Formation",
        chapter: "Thermodynamics",
        subject: "Chemistry",
        accuracy: 48,
        avgLatencySec: 78,
        benchmarkSec: 55,
        dominantSlip: "Reversing reaction stoichiometry signs incorrectly",
        speedStrategy:
          "Box target equation elements and multiply row-by-row systematically.",
        rapidFireQuestion:
          "For the reaction N2(g) + 3H2(g) -> 2NH3(g), what is the relation between ΔH and ΔU?",
        rapidFireOptions: [
          "ΔH = ΔU - 2RT",
          "ΔH = ΔU + 2RT",
          "ΔH = ΔU - RT",
          "ΔH = ΔU + RT",
        ],
        correctOptionIndex: 0,
        explanation:
          "Δn_g = 2 - (1 + 3) = -2. Using ΔH = ΔU + Δn_g RT => ΔH = ΔU - 2RT.",
      },
      {
        id: "ag-chem-rate",
        topicName: "Chemical Kinetics: Arrhenius Equation & Activation Energy",
        chapter: "Chemical Kinetics",
        subject: "Chemistry",
        accuracy: 90,
        avgLatencySec: 36,
        benchmarkSec: 45,
        dominantSlip: "Minor unit mismatch (J vs kJ)",
        speedStrategy:
          "Inspect slope m = -Ea / (2.303 R) from log k vs 1/T graphs directly.",
        rapidFireQuestion:
          "If a reaction's rate doubles when temperature increases from 300 K to 310 K, the temperature coefficient is:",
        rapidFireOptions: ["2", "1.5", "3", "0.5"],
        correctOptionIndex: 0,
        explanation:
          "Temperature coefficient μ = Rate at (T+10) / Rate at T = 2.",
      },
    ];

    // Compute Speed-Accuracy Quadrant Classification
    // Quadrants:
    // 1. Flow State (High Accuracy >= 75%, Fast Latency <= 45s) -> Emerald
    // 2. Overthink / Deep Thinker (High Accuracy >= 75%, Slow Latency > 45s) -> Sky/Blue
    // 3. Impulsive Rushing (Low Accuracy < 75%, Fast Latency <= 45s) -> Amber
    // 4. Cognitive Roadblock (Low Accuracy < 75%, Slow Latency > 45s) -> Rose
    const classifiedTopics = AGILITY_TOPICS.map((item) => {
      const isHighAcc = item.accuracy >= 75;
      const isFast = item.avgLatencySec <= 45;

      let quadrant: "flow" | "overthink" | "rushing" | "roadblock" = "flow";
      let quadrantTitle = "Flow State (Automaticity)";
      let quadrantBadge = "⚡ Optimal Mastery";
      let quadrantColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
      let prescription =
        "Maintain high-speed automaticity with weekly spaced recall.";

      if (isHighAcc && !isFast) {
        quadrant = "overthink";
        quadrantTitle = "Over-Calculation / Deep Deliberation";
        quadrantBadge = "⏱️ Slow but Accurate";
        quadrantColor = "text-sky-700 bg-sky-50 border-sky-200";
        prescription =
          "Learn algebraic shortcuts and tabular methods to save 30+ seconds per problem.";
      } else if (!isHighAcc && isFast) {
        quadrant = "rushing";
        quadrantTitle = "Impulsive Rushing / Panic Trap";
        quadrantBadge = "⚠️ Rushed Mistakes";
        quadrantColor = "text-amber-700 bg-amber-50 border-amber-200";
        prescription =
          "Enforce 5-second diagram verification before selecting an answer choice.";
      } else if (!isHighAcc && !isFast) {
        quadrant = "roadblock";
        quadrantTitle = "Cognitive Roadblock / Concept Gap";
        quadrantBadge = "🔴 Critical Bottleneck";
        quadrantColor = "text-rose-700 bg-rose-50 border-rose-200";
        prescription =
          "First-principles derivation with Cherry Ma'am on chalkboard to rebuild foundation.";
      }

      return {
        ...item,
        quadrant,
        quadrantTitle,
        quadrantBadge,
        quadrantColor,
        prescription,
      };
    });

    // Filter by subject and quadrant
    const filteredTopics = classifiedTopics.filter((t) => {
      if (
        staminaActiveSubject !== "all" &&
        t.subject.toLowerCase() !== staminaActiveSubject.toLowerCase()
      ) {
        return false;
      }
      if (
        staminaQuadrantFilter !== "all" &&
        t.quadrant !== staminaQuadrantFilter
      ) {
        return false;
      }
      return true;
    });

    const flowCount = classifiedTopics.filter(
      (t) => t.quadrant === "flow",
    ).length;
    const overthinkCount = classifiedTopics.filter(
      (t) => t.quadrant === "overthink",
    ).length;
    const rushingCount = classifiedTopics.filter(
      (t) => t.quadrant === "rushing",
    ).length;
    const roadblockCount = classifiedTopics.filter(
      (t) => t.quadrant === "roadblock",
    ).length;

    // Socratic Session Fatigue Degradation Timeline
    const sessionFatigueCurve = [
      {
        phase: "Warm-Up (0–10m)",
        accuracy: 88,
        latencySec: 36,
        cognitiveLoad: 42,
        status: "Calibrated",
      },
      {
        phase: "Peak Flow (10–25m)",
        accuracy: 94,
        latencySec: 29,
        cognitiveLoad: 28,
        status: "Zone of Genius",
      },
      {
        phase: "Cognitive Friction (25–40m)",
        accuracy: 79,
        latencySec: 46,
        cognitiveLoad: 68,
        status: "Early Fatigue",
      },
      {
        phase: "Exhaustion Dip (40m+)",
        accuracy: 63,
        latencySec: 64,
        cognitiveLoad: 89,
        status: "Socratic Dip",
      },
    ];

    // Predictive Exam Readiness Forecast
    const projectedRawScore = Math.min(
      96,
      Math.max(
        68,
        Math.round(
          (flowCount * 96 +
            overthinkCount * 88 +
            rushingCount * 65 +
            roadblockCount * 45) /
            Math.max(1, classifiedTopics.length),
        ),
      ),
    );
    const confidenceMargin = 4;
    const agilityScore = Math.round(
      ((flowCount * 1.0 +
        overthinkCount * 0.75 +
        rushingCount * 0.5 +
        roadblockCount * 0.3) /
        classifiedTopics.length) *
        100,
    );

    return {
      topics: filteredTopics,
      allTopics: classifiedTopics,
      flowCount,
      overthinkCount,
      rushingCount,
      roadblockCount,
      sessionFatigueCurve,
      projectedRawScore,
      confidenceMargin,
      agilityScore,
      optimalFocusMinutes: 25,
    };
  }, [staminaQuadrantFilter, staminaActiveSubject]);

  const lowestMetric = useMemo(() => {
    const metrics = [
      {
        name: "Concept Clarity",
        score: dashboardStats.conceptClarity,
        icon: "🎯",
      },
      {
        name: "Theoretical Core",
        score: dashboardStats.theoreticalCore,
        icon: "📖",
      },
      {
        name: "Calculation Precision",
        score: dashboardStats.calculationPrecision,
        icon: "⚡",
      },
      {
        name: "Formula Recall",
        score: dashboardStats.formulaRecall,
        icon: "🧠",
      },
      {
        name: "Socratic Stamina",
        score: dashboardStats.socraticStamina,
        icon: "🔥",
      },
    ];
    return metrics.reduce(
      (min, m) => (m.score < min.score ? m : min),
      metrics[0],
    );
  }, [dashboardStats]);

  const reportCardData: any = useMemo(() => {
    return {
      studentName: studentName || "Student",
      grade: grade || "Class 10",
      subject: subject || "Science",
      board: board || "CBSE",
      mediumOfLearning: mediumOfLearning || "English",
      totalSessionsCount: totalSessionsCount || allBooks.length,
      totalSnapshotsCount: allSnapshots.length,
      totalQuizzesCount: quizAttempts?.length || pastSessions?.length || 0,
      masteryScore: dashboardStats.overallMastery || 88,
      conceptClarity: dashboardStats.conceptClarity || 90,
      theoreticalCore: dashboardStats.theoreticalCore || 85,
      calculationPrecision: dashboardStats.calculationPrecision || 88,
      formulaRecall: dashboardStats.formulaRecall || 86,
      socraticStamina: dashboardStats.socraticStamina || 92,
      strengths: dashboardStats.strengths || [
        { concept: "Core Concept Analysis", category: "Conceptual" },
        { concept: "Systematic Step Reasoning", category: "Application" },
      ],
      growths: dashboardStats.growths || [
        {
          concept: "Time Pacing in Timed Drills",
          category: "Speed",
          explanation:
            "Practice with the Speed Sprint Simulator to decrease problem solving latency.",
        },
      ],
      recentQuizAccuracy: 88,
      studyStreakDays: 5,
      retentionCriticalCount: 0,
      retentionMasteredCount: allSnapshots.length || 3,
    };
  }, [
    studentName,
    grade,
    subject,
    board,
    mediumOfLearning,
    totalSessionsCount,
    allBooks.length,
    allSnapshots.length,
    quizAttempts?.length,
    pastSessions?.length,
    dashboardStats,
  ]);

  // Persist synced performance analytics for Kiara Counselor & Live Voice across all views
  useEffect(() => {
    try {
      const statsPayload = {
        conceptClarity: dashboardStats.conceptClarity,
        theoreticalCore: dashboardStats.theoreticalCore,
        calculationPrecision: dashboardStats.calculationPrecision,
        formulaRecall: dashboardStats.formulaRecall,
        socraticStamina: dashboardStats.socraticStamina,
        strengths: dashboardStats.strengths || [],
        growths: dashboardStats.growths || [],
        totalQuizzes: quizAttempts?.length || 0,
        classesCompleted: pastSessions?.length || 0,
        snapshotsSaved: snapshots?.length || 0,
        lowestMetric: lowestMetric,
      };
      safeSetItem(
        "maestry_student_performance_analytics",
        JSON.stringify(statsPayload),
      );
    } catch (e) {}
  }, [
    dashboardStats,
    quizAttempts?.length,
    pastSessions?.length,
    snapshots?.length,
    lowestMetric,
  ]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSavingProfile(true);
    try {
      const profileData = {
        name: editName,
        grade: editGrade,
        subject: subject || "Mathematics", // dynamic per session/mode, retained for backward compatibility
        board: editBoard,
        mediumOfLearning: editMediumOfLearning,
      };
      safeSetItem(
        `studentProfile_${currentUser.uid}`,
        JSON.stringify(profileData),
      );

      if (
        currentUser.uid !== "local_guest_student" &&
        !currentUser.uid.startsWith("local_")
      ) {
        const profileRef = doc(db, "studentProfiles", currentUser.uid);
        await updateDoc(profileRef, {
          ...profileData,
          updatedAt: serverTimestamp(),
        });
      }
      setEditingProfile(false);
      if (onRefreshProfile) onRefreshProfile();
    } catch (err) {
      console.warn(
        "Failed saving student updates to Firestore, saved locally:",
        err,
      );
      setEditingProfile(false);
      if (onRefreshProfile) onRefreshProfile();
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteSnapshot = async (id: string) => {
    const uid = currentUser?.uid || "local_guest_student";
    if (!confirm("Are you sure you want to delete this board snapshot?"))
      return;
    try {
      // Delete from all local storage caches
      const cleanKey = (k: string) => {
        const cachedStr = localStorage.getItem(k);
        if (cachedStr) {
          try {
            const localSnaps = JSON.parse(cachedStr);
            const filtered = localSnaps.filter(
              (s: any) => s.id !== id && s.snapshotId !== id,
            );
            safeSetItem(k, JSON.stringify(filtered));
          } catch (_) {}
        }
      };

      cleanKey(`snapshots_${uid}`);
      cleanKey("snapshots_local_guest_student");
      cleanKey("all_board_snapshots");

      setSnapshots((prev) =>
        prev.filter((s) => s.id !== id && s.snapshotId !== id),
      );

      if (uid !== "local_guest_student" && !uid.startsWith("local_")) {
        await deleteDoc(doc(db, "studentProfiles", uid, "boardSnapshots", id));
      }
    } catch (e) {
      console.warn(
        "Failed deleting snapshot from Firestore, deleted locally:",
        e,
      );
    }
  };

  const handleDownloadImage = (snapshot: BoardSnapshot) => {
    try {
      const link = document.createElement("a");
      link.href = snapshot.imgData;
      link.download = `${snapshot.topicTitle.replace(/[^a-zA-Z0-9]/g, "_")}_board.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed downloading snapshot image file:", err);
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return "Just now";
    try {
      const date = ts.toDate ? ts.toDate() : new Date(ts);
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Saved Topic";
    }
  };

  const [generatingPodcastBookId, setGeneratingPodcastBookId] = useState<string | null>(null);

  const handleTriggerBookPodcast = async (book: any) => {
    if (!book) return;
    const bookId = book.sessionId || book.id || `book_${book.index || 0}`;
    if (generatingPodcastBookId === bookId) return;

    const bookTitle =
      book.activeDocumentName ||
      book.title ||
      (book.topics && book.topics[0]) ||
      "Classroom Lesson";
    const bookSubject = book.inferredSubject || book.subject || subject || "Science";
    const bookGrade = book.grade || grade || "Class 10-12";
    const bookContent =
      book.customBoardContent ||
      book.documentMarkdown ||
      (book.topicBoardsContent && Object.values(book.topicBoardsContent).join("\n\n")) ||
      "";

    // 1. Check if we have a saved cached podcast for this topic
    const saved = getSavedPodcasts();
    const existing = saved.find(
      (p) => p.topic.toLowerCase().trim() === bookTitle.toLowerCase().trim()
    );

    if (existing) {
      window.dispatchEvent(
        new CustomEvent("cherry_open_audio_podcast", { detail: existing })
      );
      return;
    }

    // 2. Generate new 2-minute audio overview
    setGeneratingPodcastBookId(bookId);

    try {
      const podcastData = await generateAudioPodcast({
        topic: bookTitle,
        subject: bookSubject,
        grade: bookGrade,
        language: (mediumOfLearning?.toLowerCase().includes("hindi")
          ? "Hindi"
          : mediumOfLearning?.toLowerCase().includes("english")
          ? "English"
          : "Hinglish") as any,
        notesOrDocumentText: bookContent,
        episodeType: "quick_revision",
        targetDurationMins: 8,
      });

      window.dispatchEvent(
        new CustomEvent("cherry_open_audio_podcast", { detail: podcastData })
      );
    } catch (err: any) {
      console.error("[StudentAccountHub] Failed to generate podcast:", err);
    } finally {
      setGeneratingPodcastBookId(null);
    }
  };

  const handleExportSessionToPDF = (sess: any) => {
    try {
      const isCurrentSessionObj = !sess || sess.sessionId === sessionId;
      const sessTopics =
        sess && sess.topics ? sess.topics : isCurrentSessionObj ? topics : [];
      const sessTopicBoards =
        sess && sess.topicBoardsContent
          ? sess.topicBoardsContent
          : isCurrentSessionObj
            ? topicBoardsContent
            : {};
      const sessCustomBoard =
        sess && sess.customBoardContent
          ? sess.customBoardContent
          : isCurrentSessionObj
            ? customBoardContent
            : "";

      const activeSubjectName = sess?.subject || subject || "Hindi";
      const rawTitle =
        sess && sess.activeDocumentName
          ? sess.activeDocumentName
          : isCurrentSessionObj
            ? `${activeSubjectName} - Active Classroom Session`
            : "Classroom Lecture Notes";

      const cleanSessionTitle = sanitizeTitleForPDF(
        rawTitle,
        activeSubjectName,
        sessTopics,
      );

      const sessionDateStr =
        sess && sess.updatedAt?.seconds
          ? new Date(sess.updatedAt.seconds * 1000).toLocaleString()
          : new Date().toLocaleString();

      let compiledHtml = "";

      if (sessTopics && sessTopics.length > 0) {
        // Compile all topic sequential parts with their chalk content!
        sessTopics.forEach((topicText: string, index: number) => {
          const headerLine = topicText.split("\n")[0] || "";
          const rawHeader =
            headerLine.replace(/[\#\*\_]/g, "").trim() ||
            `Topic Part ${index + 1}`;
          const cleanHeader = sanitizeTitleForPDF(rawHeader);

          const boardContentForTopic = sessTopicBoards[index] || "";

          // Fallback to custom board content for first page if empty
          let displayNotes = boardContentForTopic;
          if (index === 0 && !displayNotes && sessCustomBoard) {
            displayNotes = sessCustomBoard;
          }

          const cleanNotes = displayNotes ? displayNotes.trim() : "";
          const hasContent = Boolean(cleanNotes && cleanNotes.length > 0);

          if (hasContent) {
            const notesHTML = compileWhiteboardToHTML(cleanNotes);

            compiledHtml += `
              <div class="pdf-page-wrapper" style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1.5px dashed rgba(255, 255, 255, 0.15); page-break-inside: avoid;">
                <div class="slide-header" style="display: flex; justify-content: space-between; font-size: 10px; font-family: 'JetBrains Mono', monospace; color: #67e8f9; font-weight: bold; padding-bottom: 8px; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08);">
                  <span>📝 TOPIC SECTION ${index + 1}</span>
                  <span>CHERRY LECTURE HANDOUT</span>
                </div>
                <h2 class="slide-title" style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; color: #ffffff; margin-top: 0; margin-bottom: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                  📌 ${cleanHeader}
                </h2>
                <div class="parsed-latex-topic-content font-chalk text-left" style="background-color: #0b241e; border: 1.5px solid rgba(103, 232, 249, 0.2); color: #f3f4f6; padding: 20px; border-radius: 12px; font-family: 'Inter', sans-serif; font-size: 12.5px; line-height: 1.7; box-shadow: inset 0 2px 6px rgba(0,0,0,0.3);">
                  ${notesHTML}
                </div>
              </div>
            `;
          }
        });
      } else {
        // Fallback for single general topic
        const cleanContent = sessCustomBoard ? sessCustomBoard.trim() : "";
        const notesHTML = compileWhiteboardToHTML(cleanContent);
        compiledHtml += `
          <div class="pdf-page-wrapper" style="margin-bottom: 24px; page-break-inside: avoid;">
            <div class="slide-header" style="display: flex; justify-content: space-between; font-size: 10px; font-family: 'JetBrains Mono', monospace; color: #67e8f9; font-weight: bold; padding-bottom: 8px; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <span>📝 BLACKBOARD SHEET</span>
              <span>CHERRY LECTURE HANDOUT</span>
            </div>
            <h2 class="slide-title" style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; color: #ffffff; margin-top: 0; margin-bottom: 12px; font-weight: 800; text-transform: uppercase;">
              📌 Main Chalkboard Calculations
            </h2>
            <div class="parsed-latex-topic-content font-chalk text-left" style="background-color: #0b241e; border: 1.5px solid rgba(103, 232, 249, 0.2); color: #f3f4f6; padding: 20px; border-radius: 12px; font-family: 'Inter', sans-serif; font-size: 12.5px; line-height: 1.7; box-shadow: inset 0 2px 6px rgba(0,0,0,0.3);">
              ${notesHTML}
            </div>
          </div>
        `;
      }

      // 2. Open pop-up window formatted perfectly as a digital Blackboard hand-book
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert(
          "Pop-up blocker is preventing PDF generation. Please allow pop-ups for this site to export study materials!",
        );
        return;
      }

      const bookTitle = `${cleanSessionTitle} - Blackboard Book`;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${bookTitle.replace(/[^a-zA-Z0-9]/g, "_")}</title>
          <meta charset="utf-8">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;505;600;700;850&family=Space+Grotesk:wght@600;750;850&family=JetBrains+Mono&display=swap">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
          <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
          <style>
            body {
              font-family: 'Inter', system-ui, sans-serif;
              color: #f1f5f9;
              line-height: 1.6;
              margin: 0;
              padding: 30px;
              background-color: #041411; /* Dark aesthetic blackboard classroom canvas background */
            }
            .book-container {
              max-width: 860px;
              margin: 0 auto;
              background: #061c18; /* Rich slate dark green board sheet */
              border: 1.5px solid rgba(245, 158, 11, 0.25);
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            }
            .print-header {
              border-bottom: 2px solid #f59e0b;
              padding-bottom: 16px;
              margin-bottom: 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .print-title {
              font-family: 'Space Grotesk', sans-serif;
              color: #ffffff;
              font-size: 20px;
              font-weight: 850;
              letter-spacing: -0.5px;
              margin: 0;
              text-transform: uppercase;
            }
            .print-subtitle {
              color: #fbbf24;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              margin: 4px 0 0 0;
            }
            .print-brand {
              font-family: 'Space Grotesk', sans-serif;
              font-weight: 800;
              font-size: 11px;
              color: #061c18;
              background-color: #f59e0b;
              padding: 6px 14px;
              border-radius: 8px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
              background-color: rgba(245, 158, 11, 0.05);
              padding: 18px;
              border-radius: 12px;
              margin-bottom: 30px;
              border: 1px solid rgba(245, 158, 11, 0.15);
            }
            .meta-item {
              display: flex;
              flex-direction: column;
            }
            .meta-label {
              font-size: 9px;
              font-family: 'JetBrains Mono', monospace;
              text-transform: uppercase;
              color: #94a3b8;
              font-weight: 700;
              letter-spacing: 0.5px;
            }
            .meta-value {
              font-size: 12px;
              font-weight: 700;
              color: #ffffff;
              margin-top: 2px;
            }
            .block-math-pdf-container {
              background: rgba(255,255,255,0.04);
              border-radius: 8px;
              padding: 16px;
              margin: 16px 0;
              overflow-x: auto;
              border-left: 3.5px solid #f59e0b;
              text-align: center;
              box-shadow: inset 0 1px 4px rgba(0,0,0,0.2);
            }
            .block-math-pdf-container .katex-display {
              margin: 0;
            }
            .def-pdf-card {
              border-left: 4px solid #f59e0b;
              background-color: rgba(255,255,255,0.03);
              padding: 12px;
              border-radius: 0 8px 8px 0;
              margin: 12px 0;
            }
            .def-pdf-label {
              display: block;
              font-weight: 800;
              font-family: 'Space Grotesk', sans-serif;
              font-size: 11px;
              color: #fbbf24;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 2px;
            }
            .def-pdf-detail {
              font-size: 12px;
              color: #e2e8f0;
            }
            .heading-pdf {
              font-family: 'Space Grotesk', sans-serif;
              font-size: 13px;
              color: #fbbf24;
              border-bottom: 1px solid rgba(255,255,255,0.1);
              padding-bottom: 4px;
              margin-top: 20px;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .vector-diagram-pdf-card {
              margin: 16px auto;
              padding: 14px;
              background: #061c18 !important;
              border: 1.5px solid rgba(103, 232, 249, 0.4) !important;
              border-radius: 12px;
              text-align: center;
              page-break-inside: avoid;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .vector-diagram-pdf-card svg {
              max-height: 280px;
              max-width: 520px;
              width: 100%;
              height: auto;
              margin: 0 auto;
              display: block;
            }
            .print-footer {
              margin-top: 40px;
              border-top: 1px solid rgba(245, 158, 11, 0.2);
              padding-top: 16px;
              font-size: 10.5px;
              color: #cbd5e1;
              font-weight: 600;
              text-transform: uppercase;
              text-align: center;
              letter-spacing: 1px;
            }
            .action-panel {
              background: #082621;
              border: 1.5px dashed rgba(245, 158, 11, 0.3);
              border-radius: 12px;
              padding: 16px;
              margin-bottom: 24px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              color: white;
            }
            .action-btn {
              background-color: #f59e0b;
              color: #061c18;
              border: none;
              padding: 10px 20px;
              font-size: 12px;
              font-family: 'Space Grotesk', sans-serif;
              font-weight: 800;
              border-radius: 8px;
              cursor: pointer;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              transition: all 0.2s;
            }
            .action-btn:hover {
              background-color: #d97706;
              transform: translateY(-1px);
            }
            @media print {
              .no-print {
                display: none !important;
              }
              body {
                padding: 0;
                background-color: transparent;
                color: #000000 !important;
              }
              .book-container {
                border: none;
                padding: 0;
                box-shadow: none;
                background: transparent !important;
              }
              .print-header {
                border-bottom: 2px solid #0f766e !important;
              }
              .print-title {
                color: #1e293b !important;
              }
              .print-subtitle {
                color: #0f766e !important;
                font-weight: 800 !important;
              }
              .print-brand {
                border: 1.5px solid #0f766e !important;
                background-color: transparent !important;
                color: #0f766e !important;
              }
              .slide-header {
                color: #0f766e !important;
                border-bottom-color: #e2e8f0 !important;
              }
              .slide-title {
                color: #0f172a !important;
              }
              .meta-grid {
                background-color: #f1f5f9 !important;
                border: 1px solid #cbd5e1 !important;
              }
              .meta-value {
                color: #1e293b !important;
              }
              .meta-label {
                color: #64748b !important;
              }
              .parsed-latex-topic-content {
                background-color: #f8fafc !important;
                border: 1.5px solid #e2e8f0 !important;
                color: #1e293b !important;
                box-shadow: none !important;
              }
              .block-math-pdf-container {
                background: #f1f5f9 !important;
                border-left-color: #0f766e !important;
              }
              .heading-pdf {
                color: #0f766e !important;
                border-bottom-color: #cbd5e1 !important;
                font-weight: 800 !important;
              }
              .subheading-pdf {
                color: #0369a1 !important;
                font-weight: 700 !important;
              }
              .def-pdf-card {
                border-left-color: #0f766e !important;
              }
              .def-pdf-label {
                color: #0f766e !important;
              }
              .def-pdf-detail {
                color: #334155 !important;
              }
              .empty-topic-compact {
                background-color: #f8fafc !important;
                border-color: #cbd5e1 !important;
              }
              .empty-topic-compact .empty-topic-title {
                color: #475569 !important;
              }
              .empty-topic-compact .empty-topic-badge {
                color: #94a3b8 !important;
              }
              .vector-diagram-pdf-card {
                background: #061c18 !important;
                border: 1.5px solid #0284c7 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                page-break-inside: avoid !important;
              }
              .vector-diagram-pdf-card svg {
                display: block !important;
                max-height: 280px !important;
              }
              .print-footer {
                border-top-color: #cbd5e1 !important;
                color: #64748b !important;
              }
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="action-panel no-print">
            <div style="text-align: left;">
              <span style="font-size: 13px; font-weight: 850; color: #ffffff;">Board-Book Generation Center</span>
              <p style="font-size: 11px; color: #cbd5e1; margin: 4px 0 0 0;">Review your formatted math calculations & chalkboard slides, then tap below to download as a secure PDF.</p>
            </div>
            <button class="action-btn" onclick="window.print()">🖨️ Save as PDF / Print Book</button>
          </div>

          <div class="book-container">
            <div class="print-header">
              <div style="text-align: left;">
                <h1 class="print-title">${cleanSessionTitle}</h1>
                <p class="print-subtitle">Maestry Whiteboard Session Study Handout</p>
              </div>
              <div class="print-brand">
                Cherry Ma'am
              </div>
            </div>

            <div class="meta-grid">
              <div class="meta-item">
                <span class="meta-label">Prepared For</span>
                <span class="meta-value">${studentName || "Cherry's Student"}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Class Year & Subject</span>
                <span class="meta-value">${grade} • ${subject}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Class Topic</span>
                <span class="meta-value">${cleanSessionTitle}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Saved Time</span>
                <span class="meta-value">${sessionDateStr}</span>
              </div>
            </div>

            <div class="notes-section">
              ${compiledHtml}
            </div>

            <div class="print-footer">
              Study material synchronized via Maestry Cloud Sync • Optimized for PDF Printout 🌸
            </div>
          </div>

          <script>
            window.addEventListener('DOMContentLoaded', () => {
              if (window.renderMathInElement) {
                renderMathInElement(document.body, {
                  delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                  ]
                });
              }
              setTimeout(() => {
                window.print();
              }, 800);
            });
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error("Single Session PDF download compilation failed:", err);
    }
  };

  const handleExportToPDF = (
    sessionTitle: string,
    latexContent: string,
    timestampStr: string,
  ) => {
    try {
      const cleanTitle = sanitizeTitleForPDF(sessionTitle, subject, topics);
      // 1. Compile LaTeX blackboard to highly formatted print-ready HTML
      const parsedHTML = compileWhiteboardToHTML(latexContent);

      // 2. Open pop-up window for clean native system printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert(
          "Pop-up blocker is preventing PDF generation. Please allow pop-ups for this site to export study materials!",
        );
        return;
      }

      // 3. Populate HTML template styled perfectly for print-to-PDF output
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Session Study Notes - ${sessionTitle.replace(/[^a-zA-Z0-9]/g, "_")}</title>
          <meta charset="utf-8">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/katex.min.css">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&family=JetBrains+Mono&display=swap');
            
            body {
              font-family: 'Inter', system-ui, sans-serif;
              color: #1e293b;
              line-height: 1.6;
              margin: 0;
              padding: 45px;
              background-color: #ffffff;
            }
            .print-header {
              border-bottom: 2px dashed #0f766e;
              padding-bottom: 16px;
              margin-bottom: 28px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .header-main {
              flex: 1;
            }
            .print-title {
              font-family: 'Space Grotesk', sans-serif;
              color: #0f3c42;
              font-size: 24px;
              font-weight: 800;
              letter-spacing: -0.5px;
              margin: 0;
              text-transform: uppercase;
            }
            .print-subtitle {
              color: #0f766e;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin: 6px 0 0 0;
            }
            .print-brand {
              text-align: right;
              font-family: 'Space Grotesk', sans-serif;
              font-weight: 700;
              font-size: 11px;
              color: #0f766e;
              border: 1.5px solid #0f766e;
              padding: 4px 10px;
              border-radius: 8px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              background: #f0fdfa;
              border: 1px solid #ccfbf1;
              border-radius: 12px;
              padding: 16px;
              margin-bottom: 32px;
              font-size: 12.5px;
            }
            .meta-item {
              display: flex;
              flex-direction: column;
            }
            .meta-label {
              color: #0d9488;
              font-weight: 700;
              text-transform: uppercase;
              font-size: 9.5px;
              letter-spacing: 0.8px;
            }
            .meta-value {
              color: #1e293b;
              font-weight: 650;
              margin-top: 3px;
            }
            .notes-section {
              margin-top: 20px;
              min-height: 300px;
            }
            .heading-pdf {
              font-family: 'Space Grotesk', sans-serif;
              color: #0c4f52;
              font-size: 17px;
              font-weight: 750;
              margin-top: 28px;
              margin-bottom: 12px;
              border-left: 4.5px solid #14b8a6;
              padding-left: 12px;
              page-break-after: avoid;
            }
            .paragraph-pdf {
              font-size: 13px;
              margin-bottom: 12px;
              color: #334155;
              text-align: justify;
            }
            .bullet-pdf {
              font-size: 13px;
              margin-bottom: 8px;
              color: #334155;
              margin-left: 24px;
              list-style-type: square;
            }
            .block-math-pdf-container {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
              overflow-x: auto;
              page-break-inside: avoid;
              box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.02);
            }
            .katex-display {
              margin: 0.5em 0 !important;
              overflow-x: auto;
              overflow-y: hidden;
            }
            .def-pdf-card {
              background: #fffbeb;
              border-left: 4.5px solid #f59e0b;
              border-radius: 4px 10px 10px 4px;
              padding: 14px 18px;
              margin: 18px 0;
              page-break-inside: avoid;
            }
            .def-pdf-label {
              display: block;
              font-size: 10px;
              text-transform: uppercase;
              font-weight: 800;
              color: #b45309;
              letter-spacing: 0.8px;
            }
            .def-pdf-detail {
              display: block;
              font-size: 12.5px;
              color: #78350f;
              margin-top: 5px;
              font-weight: 500;
            }
            code {
              font-family: 'JetBrains Mono', monospace;
              background-color: #f1f5f9;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 12px;
              color: #0f172a;
              border: 1px solid #e2e8f0;
            }
            strong {
              color: #0f172a;
              font-weight: 700;
            }
            .error-math-pdf {
              color: #ef4444;
              font-family: 'JetBrains Mono', monospace;
              background: #fef2f2;
              border: 1px solid #fee2e2;
              padding: 12px;
              border-radius: 10px;
              margin: 12px 0;
              font-size: 11px;
            }
            .print-footer {
              margin-top: 60px;
              border-top: 1.5px solid #e2e8f0;
              padding-top: 20px;
              text-align: center;
              font-size: 10.5px;
              color: #64748b;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
              page-break-inside: avoid;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none;
              }
              @page {
                size: A4;
                margin: 2cm;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <div class="header-main">
              <h1 class="print-title">${cleanTitle}</h1>
              <p class="print-subtitle">Maestry Interactive Classroom Handout</p>
            </div>
            <div class="print-brand">
              Cherry Ma'am
            </div>
          </div>

          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">Prepared For</span>
              <span class="meta-value">\${studentName || "Cherry's Student"}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Class Year & Subject</span>
              <span class="meta-value">\${grade} • \${subject}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Class Topic</span>
              <span class="meta-value">\${cleanTitle}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Saved Time</span>
              <span class="meta-value">\${timestampStr}</span>
            </div>
          </div>

          <div class="notes-section">
            \${parsedHTML}
          </div>

          <div class="print-footer">
            Study material synchronized via Maestry Cloud Sync • Optimized for PDF Printout 🌸
          </div>

          <script>
            window.addEventListener('DOMContentLoaded', () => {
              setTimeout(() => {
                window.print();
              }, 600);
            });
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error("PDF generator crash details:", err);
    }
  };

  const handleExportCombinedPDF = () => {
    try {
      const isSnapshotsEmpty = !allSnapshots || allSnapshots.length === 0;

      const bookTitle = `${subject} Combined Blackboard Lecture-Book`;
      const subTitle = isSnapshotsEmpty
        ? "Syllabus Taught Sequence Handouts"
        : "Whiteboard Snapped Lecture Pages";

      let combinedHtml = "";

      const sortedSnapshots = [...allSnapshots].sort((a, b) => {
        const timeA = a.timestamp?.seconds
          ? a.timestamp.seconds * 1000
          : new Date(a.timestamp).getTime();
        const timeB = b.timestamp?.seconds
          ? b.timestamp.seconds * 1000
          : new Date(b.timestamp).getTime();
        return timeA - timeB;
      });

      if (!isSnapshotsEmpty) {
        sortedSnapshots.forEach((item, index) => {
          const dateStr = formatDate(item.timestamp);
          const cleanSlideTitle = sanitizeTitleForPDF(item.topicTitle);
          combinedHtml += `
            <div class="pdf-page-wrapper">
              <div class="slide-header">
                <span class="slide-number">BOARD SLIDE #${String(index + 1).padStart(2, "0")}</span>
                <span class="slide-time">📅 ${dateStr}</span>
              </div>
              
              <h2 class="slide-title">📌 ${cleanSlideTitle}</h2>
              
              <div class="chalkboard-frame-container">
                ${
                  item.imgData
                    ? `
                  <img src="${item.imgData}" alt="${cleanSlideTitle}" class="chalkboard-image" referrerpolicy="no-referrer" />
                `
                    : `
                  <div class="no-image-placeholder">Visual Board Frame Preview Pending</div>
                `
                }
              </div>

              <div class="slide-notes-card">
                <div class="notes-badge">🎓 TOPIC EXPLANATION & STUDY NOTE</div>
                <p class="notes-text">${item.description || "Interactive whiteboard derivations, drawings, and chalkboard notes."}</p>
              </div>
            </div>
          `;
        });
      } else if (topics && topics.length > 0) {
        // Compile ALL topics/slides from active syllabus in chronological sequence! This is an amazing feature!
        topics.forEach((topicContent, index) => {
          const rawHeading =
            topicContent.split("\n")[0].replace(/[#*]/g, "").trim() ||
            `Topic ${index + 1}`;
          const headingText = sanitizeTitleForPDF(rawHeading);
          const contentHTML = compileWhiteboardToHTML(topicContent);

          combinedHtml += `
            <div class="pdf-page-wrapper">
              <div class="slide-header">
                <span class="slide-number">SYLLABUS TOPIC #${String(index + 1).padStart(2, "0")}</span>
                <span class="slide-time">📚 Sequence Taught Material</span>
              </div>
              
              <h2 class="slide-title">📌 ${headingText}</h2>
              
              <div class="parsed-latex-topic-content">
                ${contentHTML}
              </div>
            </div>
          `;
        });
      } else {
        const fallbackHTML = compileWhiteboardToHTML(
          customBoardContent ||
            "No active whiteboard chalkboard notes compiled in active lecture workspace yet.",
        );
        combinedHtml += `
          <div class="pdf-page-wrapper">
            <div class="slide-header">
              <span class="slide-number">ACTIVE SLATE BOARD</span>
              <span class="slide-time">📸 Instant Handout</span>
            </div>
            <h2 class="slide-title">📌 Active Whiteboard Formulas</h2>
            <div class="parsed-latex-topic-content">
              ${fallbackHTML}
            </div>
          </div>
        `;
      }

      const finalHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${bookTitle} - ${studentName || "Cherry's Student"}</title>
          <meta charset="utf-8">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&family=JetBrains+Mono&display=swap">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
          <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
          <style>
            body {
              font-family: 'Inter', system-ui, sans-serif;
              color: #1e293b;
              line-height: 1.6;
              margin: 0;
              padding: 30px;
              background-color: #f8fafc;
            }
            .book-container {
              max-width: 840px;
              margin: 0 auto;
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.03);
            }
            .print-header {
              border-bottom: 2px solid #0f766e;
              padding-bottom: 16px;
              margin-bottom: 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .print-title {
              font-family: 'Space Grotesk', sans-serif;
              color: #0f3c42;
              font-size: 21px;
              font-weight: 850;
              letter-spacing: -0.5px;
              margin: 0;
              text-transform: uppercase;
            }
            .print-subtitle {
              color: #0d9488;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              margin: 4px 0 0 0;
            }
            .print-brand {
              font-family: 'Space Grotesk', sans-serif;
              font-weight: 800;
              font-size: 11px;
              color: #0f766e;
              border: 2px solid #0f766e;
              padding: 6px 12px;
              border-radius: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
              background: #f0fdfa;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 12px;
              background: #f1f5f9;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 12px 18px;
              margin-bottom: 30px;
              font-size: 11px;
            }
            .meta-item {
              display: flex;
              flex-direction: column;
              text-align: left;
            }
            .meta-label {
              color: #64748b;
              font-weight: 700;
              text-transform: uppercase;
              font-size: 9px;
              letter-spacing: 0.8px;
            }
            .meta-value {
              color: #0f172a;
              font-weight: 700;
              margin-top: 2px;
            }
            .instructions-box {
              background-color: #fffbeb;
              border: 1px solid #fef3c7;
              border-left: 4px solid #f59e0b;
              border-radius: 8px;
              padding: 12px 16px;
              margin-bottom: 24px;
              text-align: left;
              font-size: 11.5px;
              color: #78350f;
            }
            .pdf-page-wrapper {
              page-break-after: always;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 24px;
              margin-bottom: 30px;
              background: #ffffff;
            }
            .pdf-page-wrapper:last-child {
              page-break-after: avoid;
              margin-bottom: 0;
            }
            .slide-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #f1f5f9;
              padding-bottom: 10px;
              margin-bottom: 16px;
              font-family: 'JetBrains Mono', monospace;
              font-size: 10.5px;
              color: #0d9488;
              font-weight: bold;
            }
            .slide-number {
              background: rgba(13, 148, 136, 0.1);
              color: #0f766e;
              padding: 2px 8px;
              border-radius: 4px;
            }
            .slide-time {
              color: #64748b;
            }
            .slide-title {
              font-family: 'Space Grotesk', sans-serif;
              color: #0f3c42;
              font-size: 16.5px;
              font-weight: 800;
              margin: 0 0 16px 0;
              text-align: left;
            }
            .chalkboard-frame-container {
              background: #0c201a;
              border-radius: 12px;
              padding: 8px;
              aspect-ratio: 16 / 9;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid #0a2d24;
              box-shadow: 0 4px 12px rgba(0,0,0,0.08);
              margin-bottom: 16px;
              overflow: hidden;
            }
            .chalkboard-image {
              width: 100%;
              height: 105%;
              object-fit: contain;
              border-radius: 8px;
            }
            .no-image-placeholder {
              color: #10b981;
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
            }
            .slide-notes-card {
              background: #f0fdfa;
              border-left: 4px solid #0d9488;
              border-radius: 4px 12px 12px 4px;
              padding: 12px 16px;
              text-align: left;
            }
            .notes-badge {
              font-family: 'JetBrains Mono', monospace;
              color: #0d9488;
              font-size: 9px;
              font-weight: bold;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            .notes-text {
              font-size: 11.5px;
              color: #334155;
              margin: 0;
              font-weight: 500;
              line-height: 1.5;
            }
            .parsed-latex-topic-content {
              text-align: left;
              font-size: 12px;
              color: #0f172a;
              background: #faf8f5;
              border: 1px solid #edd1d1;
              padding: 18px;
              border-radius: 12px;
              font-family: 'Inter', system-ui, sans-serif;
              line-height: 1.6;
            }
            .parsed-latex-topic-content h1, .parsed-latex-topic-content h2, .parsed-latex-topic-content h3 {
              font-family: 'Space Grotesk', sans-serif;
              color: #0f3c42;
              margin-top: 0;
            }
            .parsed-latex-topic-content code {
              font-family: 'JetBrains Mono', monospace;
              background: #eaebf0;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 11px;
            }
            .vector-diagram-pdf-card {
              margin: 16px auto;
              padding: 14px;
              background: #061c18 !important;
              border: 1.5px solid rgba(103, 232, 249, 0.4) !important;
              border-radius: 12px;
              text-align: center;
              page-break-inside: avoid;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .vector-diagram-pdf-card svg {
              max-height: 280px;
              max-width: 520px;
              width: 100%;
              height: auto;
              margin: 0 auto;
              display: block;
            }
            .print-footer {
              margin-top: 40px;
              border-top: 1px solid #e2e8f0;
              padding-top: 16px;
              text-align: center;
              font-size: 10px;
              color: #94a3b8;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .action-blocks {
              display: flex;
              gap: 12px;
              margin-bottom: 24px;
              justify-content: center;
            }
            .action-btn {
              background: #0f766e;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: bold;
              font-family: 'Space Grotesk', sans-serif;
              cursor: pointer;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              transition: background 0.2s;
            }
            .action-btn:hover {
              background: #0d9488;
            }
            .action-btn-alt {
              background: #e2e8f0;
              color: #334155;
            }
            .action-btn-alt:hover {
              background: #cbd5e1;
            }

            @media print {
              body {
                padding: 0;
                background-color: #ffffff;
              }
              .book-container {
                border: none;
                padding: 0;
                box-shadow: none;
                max-width: 100%;
              }
              .instructions-box, .action-blocks {
                display: none !important;
              }
              .pdf-page-wrapper {
                border: none;
                padding: 20px 0;
                margin-bottom: 0;
                page-break-after: always;
              }
              .pdf-page-wrapper:last-child {
                page-break-after: avoid;
              }
              .vector-diagram-pdf-card {
                background: #061c18 !important;
                border: 1.5px solid #0284c7 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                page-break-inside: avoid !important;
              }
              .vector-diagram-pdf-card svg {
                display: block !important;
                max-height: 280px !important;
              }
              @page {
                size: A4 portrait;
                margin: 1.5cm;
              }
            }
          </style>
        </head>
        <body>
          <div class="book-container">
            <div class="action-blocks">
              <button class="action-btn" onclick="window.print()">🖨️ Save as PDF / Print Book</button>
              <button class="action-btn action-btn-alt" onclick="window.close()">❌ Close Book</button>
            </div>

            <div class="instructions-box">
              <strong>📘 Direct PDF Save Option:</strong> Click the <strong>"Save as PDF / Print Book"</strong> button above, or press <strong>Ctrl + P</strong> (Cmd + P on Mac). Choose <strong>"Save as PDF"</strong> as your destination, and hit save!
            </div>

            <div class="print-header">
              <div class="header-main">
                <h1 class="print-title">${bookTitle}</h1>
                <p class="print-subtitle">${subTitle}</p>
              </div>
              <div class="print-brand">
                Maestry Learning Sync
              </div>
            </div>

            <div class="meta-grid">
              <div class="meta-item">
                <span class="meta-label">Student Name</span>
                <span class="meta-value">${escapeHTML(studentName || "Cherry's Student")}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Class Year</span>
                <span class="meta-value">${escapeHTML(grade)}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Subject Standard</span>
                <span class="meta-value">${escapeHTML(subject)}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Taught Chronology</span>
                <span class="meta-value">${new Date().toLocaleDateString([], { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>

            <div class="board-pages-container">
              ${combinedHtml}
            </div>

            <div class="print-footer">
              Digital Lecture Copy Synchronized via Maestry Cloud • Secure Verification PDF
            </div>
          </div>

          <script>
            document.addEventListener("DOMContentLoaded", function() {
              renderMathInElement(document.body, {
                delimiters: [
                  {left: '$$', right: '$$', display: true},
                  {left: '$', right: '$', display: false},
                  {left: '\\\\(', right: '\\\\)', display: false},
                  {left: '\\\\[', right: '\\\\]', display: true}
                ],
                throwOnError: false
              });
              setTimeout(() => {
                window.print();
              }, 600);
            });
          </script>
        </body>
        </html>
      `;

      const blob = new Blob([finalHtml], { type: "text/html;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Maestry_Lecture_Book_${subject.replace(/[^a-zA-Z0-9]/g, "_")}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Combined PDF export error:", err);
    }
  };

  return (
    <div className="absolute inset-0 bg-white flex flex-col z-30 overflow-hidden">
      <div className="bg-white w-full h-full flex flex-col overflow-hidden relative">
        {/* =========================================
            PREMIUM APP HEADER BAR (Uniform 52px Native Header)
            ========================================= */}
        <div className="w-full h-[52px] min-h-[52px] max-h-[52px] px-3.5 sm:px-5 flex items-center justify-between border-b border-slate-200/80 bg-white shrink-0 shadow-2xs z-20">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 text-[#796AEF] flex items-center justify-center shadow-xs shrink-0">
              <User className="w-4 h-4 text-[#796AEF]" />
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-xs sm:text-sm font-sans font-extrabold uppercase tracking-wide text-slate-900 truncate">
                Student Hub
              </h3>
              <span className="text-[9.5px] font-mono font-bold bg-indigo-50 text-[#796AEF] px-1.5 py-0.5 rounded-full border border-indigo-100/80 shrink-0">
                {grade || "Class 10"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 rounded-full cursor-pointer active:scale-95 transition-all text-[11px] font-bold shadow-2xs shrink-0"
            title="Back to Study Desk"
          >
            <Home className="w-3.5 h-3.5 text-[#796AEF]" />
            <span className="hidden xs:inline text-[10.5px]">Desk</span>
          </button>
        </div>

        {/* Unified Tab bar Selector */}
        <div className="border-b border-[#EFF1F5] bg-white shrink-0 select-none shadow-2xs">
          {/* Mobile view tabs - Option 1: Compact Clean Labels & Single Line */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => {
                setActiveMobileSubTab("profile");
                setIsKiaraFullScreenOpen(false);
              }}
              className={`flex-1 py-2 px-1 text-[11px] sm:text-[11.5px] font-bold uppercase tracking-tight text-center border-b-2 transition-all whitespace-nowrap overflow-hidden flex items-center justify-center gap-1 ${
                activeMobileSubTab === "profile"
                  ? "border-[#796AEF] text-[#796AEF] bg-indigo-50/40 font-bold"
                  : "border-transparent text-[#4A4E5A] hover:text-[#1E293B]"
              }`}
            >
              <span>👤</span>
              <span className="truncate">{t.profileTab}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsKiaraFullScreenOpen(true);
                setActiveMobileSubTab("counselor");
                setActiveDesktopTab("counselor");
              }}
              className={`flex-1 py-2 px-1 text-[11px] sm:text-[11.5px] font-bold uppercase tracking-tight text-center border-b-2 transition-all whitespace-nowrap overflow-hidden flex items-center justify-center gap-1 ${
                activeMobileSubTab === "counselor" || isKiaraFullScreenOpen
                  ? "border-[#796AEF] text-[#796AEF] bg-indigo-50/40 font-bold"
                  : "border-transparent text-[#4A4E5A] hover:text-[#1E293B]"
              }`}
            >
              <span>👩‍🎓</span>
              <span className="truncate">{mobileKiaraLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMobileSubTab("stats");
                setActiveDesktopTab("stats");
                setIsKiaraFullScreenOpen(false);
              }}
              className={`flex-1 py-2 px-1 text-[11px] sm:text-[11.5px] font-bold uppercase tracking-tight text-center border-b-2 transition-all whitespace-nowrap overflow-hidden flex items-center justify-center gap-1 ${
                activeMobileSubTab === "stats"
                  ? "border-[#796AEF] text-[#796AEF] bg-indigo-50/40 font-bold"
                  : "border-transparent text-[#4A4E5A] hover:text-[#1E293B]"
              }`}
            >
              <span>📊</span>
              <span className="truncate">{mobileAnalyticsLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMobileSubTab("books");
                setActiveDesktopTab("books");
                setIsKiaraFullScreenOpen(false);
              }}
              className={`flex-1 py-2 px-1 text-[11px] sm:text-[11.5px] font-bold uppercase tracking-tight text-center border-b-2 transition-all whitespace-nowrap overflow-hidden flex items-center justify-center gap-1 ${
                activeMobileSubTab === "books"
                  ? "border-[#796AEF] text-[#796AEF] bg-indigo-50/40 font-bold"
                  : "border-transparent text-[#4A4E5A] hover:text-[#1E293B]"
              }`}
            >
              <span>📚</span>
              <span className="truncate">{mobileBooksLabel}</span>
            </button>
          </div>

          {/* Desktop view tabs */}
          <div className="hidden md:flex justify-end px-6 py-2.5 gap-3 bg-[#F6F7FB] border-b border-[#EFF1F5]">
            <div className="text-xs font-sans font-bold text-[#4A4E5A] flex items-center mr-auto">
              🎯 Classroom Hub Workspaces:
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveMobileSubTab("stats");
                setActiveDesktopTab("stats");
                setIsKiaraFullScreenOpen(false);
              }}
              className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeDesktopTab === "stats" && activeMobileSubTab !== "profile"
                  ? "bg-[#796AEF] text-white shadow-xs font-bold"
                  : "text-[#4A4E5A] hover:text-[#1E293B] bg-white hover:bg-[#F6F7FB] border border-[#EFF1F5]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>📊 {t.performanceTab}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsKiaraFullScreenOpen(true);
                setActiveMobileSubTab("counselor");
                setActiveDesktopTab("counselor");
              }}
              className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                (activeDesktopTab === "counselor" || isKiaraFullScreenOpen) &&
                activeMobileSubTab !== "profile"
                  ? "bg-[#796AEF] text-white shadow-xs font-bold"
                  : "text-[#1E293B] hover:text-[#796AEF] bg-white hover:bg-[#F6F7FB] border border-[#EFF1F5]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>👩‍🎓 {t.kiaraTab}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMobileSubTab("books");
                setActiveDesktopTab("books");
                setIsKiaraFullScreenOpen(false);
              }}
              className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeDesktopTab === "books" && activeMobileSubTab !== "profile"
                  ? "bg-[#796AEF] text-white shadow-xs font-bold"
                  : "text-[#4A4E5A] hover:text-[#1E293B] bg-white hover:bg-[#F6F7FB] border border-[#EFF1F5]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>📚 {t.booksTab}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden bg-[#F6F7FB]">
          {/* Left Sidebar: Student Profile Parameter Controls & Milestones */}
          <div
            className={`${activeMobileSubTab === "profile" ? "flex flex-1 min-h-0" : "hidden md:flex"} w-full md:w-80 bg-[#F6F7FB] border-r border-[#EFF1F5] p-4 sm:p-5 pb-36 sm:pb-8 flex-col justify-between overflow-y-auto md:shrink-0 select-none`}
          >
            <div className="space-y-4">
              {/* Profile Details section - Modern Student Identity Hero Card */}
              <div className="bg-white border border-[#EFF1F5] rounded-2xl p-4 shadow-xs text-left">
                {editingProfile ? (
                  <form
                    onSubmit={handleUpdateProfile}
                    className="space-y-3 text-left"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#EFF1F5]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B] flex items-center gap-1.5 font-sans">
                        <Edit3 className="w-3.5 h-3.5 text-[#796AEF]" /> Edit Profile
                      </h4>
                      <span className="text-[10px] text-[#4A4E5A] font-sans">
                        ID Settings
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-sans text-[#4A4E5A] uppercase font-bold">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-[#F6F7FB] border border-[#EFF1F5] focus:border-[#796AEF] rounded-xl px-3 py-1.5 text-xs font-bold text-[#1E293B] focus:outline-none focus:ring-1 focus:ring-[#796AEF]"
                        placeholder="Your Name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-sans text-[#4A4E5A] uppercase font-bold">
                          Class / Grade
                        </label>
                        <select
                          value={editGrade}
                          onChange={(e) => setEditGrade(e.target.value)}
                          className="w-full bg-[#F6F7FB] border border-[#EFF1F5] text-[#1E293B] font-semibold rounded-xl px-2 py-1.5 text-xs focus:outline-none cursor-pointer"
                        >
                          <option value="Class 6">Class 6</option>
                          <option value="Class 7">Class 7</option>
                          <option value="Class 8">Class 8</option>
                          <option value="Class 9">Class 9</option>
                          <option value="Class 10">Class 10</option>
                          <option value="Class 11">Class 11</option>
                          <option value="Class 12">Class 12</option>
                          <option value="NEET">NEET</option>
                          <option value="JEE">JEE</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-sans text-[#4A4E5A] uppercase font-bold">
                          Board
                        </label>
                        <select
                          value={editBoard}
                          onChange={(e) => setEditBoard(e.target.value)}
                          className="w-full bg-[#F6F7FB] border border-[#EFF1F5] text-[#1E293B] font-semibold rounded-xl px-2 py-1.5 text-xs focus:outline-none cursor-pointer"
                        >
                          <option value="CBSE">CBSE</option>
                          <option value="ICSE">ICSE / ISC</option>
                          <option value="UP Board">UP Board</option>
                          <option value="MP Board">MP Board</option>
                          <option value="Rajasthan Board">RBSE</option>
                          <option value="Maharashtra Board">MSBSHSE</option>
                          <option value="Bihar Board">BSEB</option>
                          <option value="Jharkhand Board">Jharkhand Board (JAC)</option>
                          <option value="Odisha Board">Odisha Board (CHSE/BSE)</option>
                          <option value="West Bengal Board">West Bengal Board (WBBSE/WBCHSE)</option>
                          <option value="Other State Board">Other Board</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-sans text-[#4A4E5A] uppercase font-bold">
                        Medium / Language
                      </label>
                      <select
                        value={editMediumOfLearning}
                        onChange={(e) =>
                          setEditMediumOfLearning(e.target.value)
                        }
                        className="w-full bg-[#F6F7FB] border border-[#EFF1F5] text-[#1E293B] font-semibold rounded-xl px-2.5 py-1.5 text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="Hinglish">Hinglish</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Bengali">Bengali (বাংলা)</option>
                        <option value="Odisha">Odisha / Odia (ଓଡ଼ିଆ)</option>
                        <option value="Marathi">Marathi (मराठी)</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-1.5">
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="flex-1 bg-[#796AEF] hover:bg-[#6858e0] text-white text-[11.5px] font-bold tracking-wider uppercase py-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        {savingProfile ? "Saving..." : "Save updates"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProfile(false)}
                        className="px-3 border border-[#EFF1F5] text-[#4A4E5A] hover:bg-[#F6F7FB] text-[11.5px] uppercase font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    {/* Header: Avatar, Name & Edit Button */}
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Student Avatar */}
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#796AEF] text-white flex items-center justify-center text-base sm:text-lg font-bold shadow-xs">
                            {(studentName || "S")
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"
                            title="Active Scholar"
                          />
                        </div>

                        {/* Name & Account Type */}
                        <div className="min-w-0">
                          <h3 className="font-bold text-[#1E293B] text-sm sm:text-base leading-tight truncate">
                            {studentName || "Cherry's Student"}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                            <span className="text-[11px] font-bold text-emerald-700 truncate">
                              {currentUser?.isAnonymous
                                ? "Guest Profile (Local)"
                                : "Verified Scholar"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => setEditingProfile(true)}
                        className="shrink-0 px-2.5 py-1.5 bg-[#F6F7FB] hover:bg-indigo-50 text-[#1E293B] hover:text-[#796AEF] border border-[#EFF1F5] hover:border-indigo-200 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold shadow-2xs group active:scale-95"
                        title="Edit Profile Particulars"
                      >
                        <Edit3 className="w-3 h-3 text-[#4A4E5A] group-hover:text-[#796AEF] transition-colors" />
                        <span>Edit</span>
                      </button>
                    </div>

                    {/* Meta Badges Grid / Tag Strip */}
                    <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                      <div className="bg-[#F6F7FB] border border-[#EFF1F5] rounded-xl p-1.5 text-center">
                        <span className="text-[11px] font-sans uppercase font-bold text-[#796AEF] block leading-tight">
                          Class
                        </span>
                        <span className="text-[12px] font-bold text-[#1E293B] block truncate mt-0.5">
                          {grade}
                        </span>
                      </div>

                      <div className="bg-[#F6F7FB] border border-[#EFF1F5] rounded-xl p-1.5 text-center">
                        <span className="text-[11px] font-sans uppercase font-bold text-[#4A4E5A] block leading-tight">
                          Board
                        </span>
                        <span className="text-[12px] font-bold text-[#1E293B] block truncate mt-0.5">
                          {board}
                        </span>
                      </div>

                      <div className="bg-[#F6F7FB] border border-[#EFF1F5] rounded-xl p-1.5 text-center">
                        <span className="text-[11px] font-sans uppercase font-bold text-[#4A4E5A] block leading-tight">
                          Medium
                        </span>
                        <span className="text-[12px] font-bold text-[#1E293B] block truncate mt-0.5">
                          {mediumOfLearning}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Milestones & Progress scorecard */}
              <div className="space-y-3 pt-1">
                <h3 className="text-[11px] uppercase font-sans font-bold tracking-wider text-[#1E293B] flex items-center gap-1.5 pb-2 border-b border-[#EFF1F5]">
                  <Award className="w-3.5 h-3.5 text-[#796AEF]" /> Academic Progress
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white border border-[#EFF1F5] rounded-2xl p-3 flex flex-col justify-between text-left shadow-xs">
                    <span className="text-[10.5px] font-sans text-[#4A4E5A] block uppercase font-semibold">
                      Classes
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-lg font-bold text-[#1E293B]">
                        {totalSessionsCount}
                      </span>
                      <span className="text-sm">📈</span>
                    </div>
                  </div>

                  <div className="bg-white border border-[#EFF1F5] rounded-2xl p-3 flex flex-col justify-between text-left shadow-xs">
                    <span className="text-[10.5px] font-sans text-[#4A4E5A] block uppercase font-semibold">
                      Slides Saved
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-lg font-bold text-[#1E293B]">
                        {allSnapshots.length}
                      </span>
                      <span className="text-sm">📸</span>
                    </div>
                  </div>
                </div>

                {/* Active Scholar Badge - Cohesive Light Theme Card */}
                <div className="bg-white border border-[#EFF1F5] rounded-2xl p-3.5 text-left shadow-xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center text-sm shrink-0 shadow-2xs">
                    🏆
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
                        Active Scholar Badge
                      </h4>
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-100/70 text-amber-800 text-[10.5px] font-bold">
                        UNLOCKED
                      </span>
                    </div>
                    <p className="text-[11.5px] text-[#4A4E5A] font-normal mt-1 leading-relaxed">
                      Automatically unlocked for participating in live lectures and compiling direct board-books!
                    </p>
                  </div>
                </div>

                {/* Refer & Earn 5-Level Plan Card - Harmonious Modern Card */}
                <div className="bg-white border border-[#EFF1F5] rounded-2xl p-4 text-left space-y-3 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#F6F7FB] border border-[#EFF1F5] text-amber-500 flex items-center justify-center text-sm shadow-2xs">
                        🎁
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1E293B] font-sans">
                          Refer & Earn
                        </h4>
                        <span className="text-[10.5px] font-semibold text-[#4A4E5A] uppercase tracking-wider block">
                          5-Level Income Plan
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10.5px] font-sans font-bold">
                      ₹50 + ₹50
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#4A4E5A] leading-relaxed">
                    1st Level Direct: <strong className="text-emerald-700 font-bold">₹50</strong> • 5th Level Indirect: <strong className="text-[#796AEF] font-bold">₹50</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMobileSubTab("referral");
                      setActiveDesktopTab("referral");
                      setIsKiaraFullScreenOpen(false);
                    }}
                    className="w-full bg-[#796AEF] hover:bg-[#6858e0] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                  >
                    <span>Open Refer & Earn Hub 🚀</span>
                  </button>
                </div>

                {/* Kiara AI Student Counselor Card - Clean Modern Card */}
                <div className="bg-white border border-[#EFF1F5] rounded-2xl p-4 text-left space-y-3 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200/80 text-purple-600 flex items-center justify-center text-sm shadow-2xs shrink-0">
                        👩‍🎓
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-[#1E293B] font-sans truncate">
                            Kiara AI
                          </h4>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[10.5px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            Online
                          </span>
                        </div>
                        <span className="text-[10.5px] font-semibold text-[#4A4E5A] uppercase tracking-wider block">
                          Mindset & Study Counselor
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11.5px] text-[#4A4E5A] leading-relaxed">
                    Exam anxiety, revision routine, or mnemonics? Ask Kiara anytime.
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsKiaraFullScreenOpen(true);
                        setActiveMobileSubTab("counselor");
                        setActiveDesktopTab("counselor");
                      }}
                      className="bg-[#796AEF] hover:bg-[#6858e0] text-white text-xs font-bold py-2.5 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span className="truncate">Chat (Full)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsKiaraVoiceModalOpen(true);
                      }}
                      className="bg-white hover:bg-[#F6F7FB] text-[#1E293B] border border-[#EFF1F5] text-xs font-bold py-2.5 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
                    >
                      <Radio className="w-3.5 h-3.5 text-[#796AEF] animate-pulse" />
                      <span className="truncate">Live Voice 🎙️</span>
                    </button>
                  </div>
                </div>

                {/* Personal Gemini API Key (BYOK) - Placed at the very bottom of Profile Page */}
                <div className="bg-white border border-[#EFF1F5] rounded-2xl p-4 text-left space-y-3 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-2xs shrink-0 border ${
                        hasCustomKey
                          ? "bg-emerald-50 border-emerald-200/80 text-emerald-600"
                          : "bg-indigo-50 border-indigo-200/80 text-[#796AEF]"
                      }`}>
                        <Key className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-[#1E293B] font-sans truncate">
                            Gemini API Key
                          </h4>
                          <span className={`px-1.5 py-0.5 rounded-full border text-[10.5px] font-sans font-bold ${
                            hasCustomKey
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}>
                            {hasCustomKey ? (keyCount > 1 ? `${keyCount} KEYS ACTIVE` : "CONNECTED") : "DEFAULT"}
                          </span>
                        </div>
                        <span className="text-[10.5px] font-semibold text-[#4A4E5A] uppercase tracking-wider block">
                          BYOK Multi-Key Pool
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-[#4A4E5A] leading-relaxed">
                    {hasCustomKey
                      ? keyCount > 1
                        ? `${keyCount} Gemini API keys configured with auto-failover protection for zero interruptions.`
                        : "Your personal Google AI Studio Key is connected for 1-on-1 AI lectures."
                      : "Connect your free Gemini API Key for zero rate limits and high-speed AI lectures."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowApiKeyModal(true)}
                    className={`w-full text-xs font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-95 ${
                      hasCustomKey
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-[#796AEF] hover:bg-[#6858e0] text-white"
                    }`}
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{hasCustomKey ? "Manage Key Pool 🔑" : "Connect Gemini API Key (BYOK) 🔑"}</span>
                  </button>
                </div>
              </div>

              {/* Account & Session Management Card */}
              {onSignOut && (
                <div className="bg-white border border-[#EFF1F5] rounded-2xl p-4 shadow-xs text-left space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#1E293B] font-sans truncate">
                        Account Session
                      </h4>
                      <span className="text-[11px] font-semibold text-[#4A4E5A] block truncate">
                        {currentUser?.email || (currentUser?.isAnonymous ? "Guest Scholar Session" : "Verified Student")}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-[#4A4E5A] leading-relaxed">
                    Switch account or sign out from this device safely. Your learning history and notes remain securely synced.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full text-xs font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 shadow-xs active:scale-95"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Log Out of Account 🚪</span>
                  </button>
                </div>
              )}
            </div>

            <div className="text-[11px] text-[#4A4E5A] font-sans text-left pt-4 border-t border-[#EFF1F5] mt-4 leading-relaxed">
              * Classroom Handbooks are automatically formatted into optimized multi-page books using integrated LaTeX formulas.
            </div>
          </div>

          {/* Right Column: Unified Board-Book Hub (Main Arena) */}
          <div
            className={`${activeMobileSubTab === "books" || activeMobileSubTab === "stats" || activeMobileSubTab === "counselor" || activeMobileSubTab === "referral" ? "flex" : "hidden md:flex"} flex-1 p-3.5 sm:p-5 pb-36 sm:pb-10 flex-col space-y-4 overflow-y-auto text-left min-h-0 bg-[#F6F7FB]`}

            ref={statsScrollContainerRef}
          >
            {/* Premium Header - Unified Performance Hub */}
            {activeDesktopTab !== "stats" && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EFF1F5] pb-2.5 gap-2 shrink-0 select-none">
                <div className="flex items-center gap-2 min-w-0">
                  {activeDesktopTab === "referral" ? (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1E293B] truncate">
                        Refer & Earn • 5-Level Compensation Hub
                      </h3>
                    </>
                  ) : activeDesktopTab === "counselor" ? (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1E293B] truncate">
                        Kiara • AI Mindset & Academic Success Counselor
                      </h3>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 text-[#796AEF] shrink-0" />
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1E293B] truncate">
                        Classroom Study Handbooks (Board-Books)
                      </h3>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] bg-white text-[#796AEF] border border-[#EFF1F5] px-2.5 py-1 rounded-xl font-bold uppercase tracking-wider shadow-2xs font-sans">
                    {subject} • {grade}
                  </span>
                </div>
              </div>
            )}

            {activeDesktopTab === "referral" ||
            activeMobileSubTab === "referral" ? (
              <div className="flex-1 p-2 sm:p-4 text-left min-h-[600px]">
                <ReferAndEarnHub
                  studentName={studentName}
                  userUid={currentUser?.uid}
                  onClose={() => {
                    setActiveMobileSubTab("profile");
                    setActiveDesktopTab("stats");
                  }}
                />
              </div>
            ) : activeDesktopTab === "counselor" ||
            activeMobileSubTab === "counselor" ||
            isKiaraFullScreenOpen ? (
              <div className="flex-1 min-h-[620px] text-left">
                <KiaraCounselor
                  studentName={studentName}
                  grade={grade}
                  subject={subject}
                  board={board}
                  mediumOfLearning={mediumOfLearning}
                  analytics={{
                    conceptClarity: dashboardStats.conceptClarity,
                    theoreticalCore: dashboardStats.theoreticalCore,
                    calculationPrecision: dashboardStats.calculationPrecision,
                    formulaRecall: dashboardStats.formulaRecall,
                    socraticStamina: dashboardStats.socraticStamina,
                    strengths: dashboardStats.strengths,
                    growths: dashboardStats.growths,
                    totalQuizzes: quizAttempts?.length || 0,
                    classesCompleted: pastSessions?.length || 0,
                    snapshotsSaved: snapshots?.length || 0,
                    lowestMetric: lowestMetric,
                  }}
                  onNavigateToClassroom={onEnterClassroom}
                  onStartVoiceCall={(topic?: string) => {
                    setKiaraVoiceInitialTopic(topic || "");
                    setIsKiaraVoiceModalOpen(true);
                  }}
                  onClose={() => {
                    setActiveDesktopTab("stats");
                    setActiveMobileSubTab("profile");
                    setIsKiaraFullScreenOpen(false);
                  }}
                />
              </div>
            ) : activeDesktopTab === "stats" ? (
              <div className="space-y-4 animate-fade-in text-left">
                {/* Performance Workspace Mode Sub-Tabs - Clean Mobile-First Navigation */}
                <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-[#EFF1F5] shadow-xs select-none space-y-2.5 text-left">
                  {/* Top Bar with Status and Current Dimension Indicator */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#796AEF] animate-pulse"></span>
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1E293B] font-sans">
                        Analytics & Diagnostic Suite
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#796AEF] border border-indigo-200/50">
                        7 Modules
                      </span>
                    </div>
                    <span className="text-[11px] text-[#4A4E5A] font-medium hidden sm:inline">
                      Swipe to switch diagnostic views • 100% Student-Centric
                    </span>
                  </div>

                  {/* Active Tab Explanatory Guidance Banner */}
                  {(() => {
                    const activeTabInfo = ANALYTICS_SUITE_TABS.find(
                      (t) => t.id === performanceWorkspaceTab
                    );
                    return activeTabInfo ? (
                      <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-slate-50 border border-indigo-100/80 rounded-xl px-3 py-2 flex items-center justify-between gap-2 shadow-2xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-[#796AEF] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                            {activeTabInfo.num}
                          </span>
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {isEnglish ? (activeTabInfo.descEn || activeTabInfo.desc) : activeTabInfo.desc}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#796AEF] bg-white px-2 py-0.5 rounded-md border border-indigo-200/60 shrink-0">
                          Active View
                        </span>
                      </div>
                    ) : null;
                  })()}

                  {/* Scrollable Mobile-First Sub-Tabs Strip */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 px-0.5 scrollbar-thin">
                    {ANALYTICS_SUITE_TABS.map((tab) => {
                      const isActive = performanceWorkspaceTab === tab.id;
                      const IconComp = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setPerformanceWorkspaceTab(tab.id)}
                          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer border min-h-[44px] ${
                            isActive
                              ? "bg-[#796AEF] text-white border-[#796AEF] shadow-xs font-bold"
                              : "text-[#4A4E5A] hover:text-[#1E293B] bg-[#F6F7FB] hover:bg-slate-100/80 border-[#EFF1F5]"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-mono font-bold shrink-0 ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-slate-200/80 text-slate-700"
                            }`}
                          >
                            {tab.num}
                          </span>
                          <IconComp
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isActive ? "text-white" : "text-[#796AEF]"
                            }`}
                          />
                          <div className="flex flex-col text-left leading-tight">
                            <span className="whitespace-nowrap font-bold">
                              {tab.label}
                            </span>
                            <span
                              className={`text-[9.5px] font-normal ${
                                isActive ? "text-indigo-100" : "text-slate-500"
                              }`}
                            >
                              {isEnglish ? (tab.subtitleEn || tab.subtitle) : tab.subtitle}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {performanceWorkspaceTab === "macro" ? (
                  <>
                    {/* Executive Student Snapshot Card - 1-Glance Overview */}
                    {(() => {
                      const examReadinessScore = Math.min(
                        100,
                        Math.max(
                          10,
                          Math.round(
                            dashboardStats.conceptClarity * 0.25 +
                              dashboardStats.theoreticalCore * 0.2 +
                              dashboardStats.calculationPrecision * 0.25 +
                              dashboardStats.formulaRecall * 0.15 +
                              dashboardStats.socraticStamina * 0.15
                          )
                        )
                      );
                      const topStrength = [
                        { name: "Concept Clarity", score: dashboardStats.conceptClarity, icon: "🎯" },
                        { name: "Theoretical Core", score: dashboardStats.theoreticalCore, icon: "📖" },
                        { name: "Calculations", score: dashboardStats.calculationPrecision, icon: "🧮" },
                        { name: "Formula Recall", score: dashboardStats.formulaRecall, icon: "⚡" },
                        { name: "Socratic Stamina", score: dashboardStats.socraticStamina, icon: "🔥" },
                      ].sort((a, b) => b.score - a.score)[0];

                      const priorityFocus = [
                        { 
                          name: "Concept Clarity", 
                          score: dashboardStats.conceptClarity, 
                          icon: "🎯", 
                          tip: isEnglish ? "Strengthen core concepts with blackboard practice" : "Whiteboard practice से कॉन्सेप्ट मजबूत करें" 
                        },
                        { 
                          name: "Theoretical Core", 
                          score: dashboardStats.theoreticalCore, 
                          icon: "📖", 
                          tip: isEnglish ? "Revise handbook definitions and textbook proofs" : "हैंडबुक डेफिनिशन्स व नोट्स दोहराएं" 
                        },
                        { 
                          name: "Calculations", 
                          score: dashboardStats.calculationPrecision, 
                          icon: "🧮", 
                          tip: isEnglish ? "Verify step-by-step signs, units & arithmetic" : "स्टेप-बाय-स्टेप साइन व यूनिट्स चेक करें" 
                        },
                        { 
                          name: "Formula Recall", 
                          score: dashboardStats.formulaRecall, 
                          icon: "⚡", 
                          tip: isEnglish ? "Do 5-minute daily flashcard spaced repetition" : "स्मार्ट फ़्लैशकार्ड्स से रोज़ 5 मिनट रिवीज़न करें" 
                        },
                        { 
                          name: "Socratic Stamina", 
                          score: dashboardStats.socraticStamina, 
                          icon: "🔥", 
                          tip: isEnglish ? "Attend live lectures & take interactive quizzes" : "लाइव लेक्चर्स व क्विज़ में नियमित भाग लें" 
                        },
                      ].sort((a, b) => a.score - b.score)[0];

                      return (
                        <div className="bg-white border border-[#EFF1F5] rounded-2xl p-4 sm:p-5 shadow-xs text-left space-y-3.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#EFF1F5]">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 rounded-xl bg-indigo-50 text-[#796AEF] border border-indigo-200/60 text-sm">
                                📊
                              </span>
                              <div>
                                <h4 className="text-xs sm:text-sm font-bold text-[#1E293B] uppercase tracking-wider font-sans">
                                  {isEnglish ? "Quick Academic Health Check • Executive Summary" : "Quick Academic Health Check • तैयारी का संक्षिप्त सारांश"}
                                </h4>
                                <p className="text-[11px] text-[#4A4E5A] font-sans">
                                  {isEnglish ? "Overall exam readiness status and high-priority focus for today" : "आपकी समग्र तैयारी की स्थिति और आज का सबसे महत्वपूर्ण फ़ोकस"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* 3 Quick Snapshot Highlights */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Card 1: Readiness */}
                            <div className="bg-gradient-to-br from-indigo-50/80 to-slate-50 border border-indigo-100 rounded-xl p-3 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-700">
                                  🎯 Board Readiness
                                </span>
                                <span className="text-xs font-bold text-[#796AEF]">
                                  {examReadinessScore}%
                                </span>
                              </div>
                              <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-indigo-100">
                                <div
                                  className="h-full bg-[#796AEF] rounded-full transition-all duration-500"
                                  style={{ width: `${examReadinessScore}%` }}
                                />
                              </div>
                              <p className="text-[10.5px] text-slate-600 font-medium">
                                {examReadinessScore >= 80 
                                  ? (isEnglish ? "Excellent Pacing • High-Score Track" : "उत्कृष्ट गति • टॉप स्कोर की ओर") 
                                  : (isEnglish ? "In Progress • Consistent Practice Required" : "प्रगतिशील • निरंतर अभ्यास आवश्यक")}
                              </p>
                            </div>

                            {/* Card 2: Top Strength */}
                            <div className="bg-gradient-to-br from-emerald-50/80 to-slate-50 border border-emerald-100 rounded-xl p-3 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-700">
                                  {isEnglish ? "🌟 Top Strength" : "🌟 मुख्य ताकत"}
                                </span>
                                <span className="text-xs font-bold text-emerald-800">
                                  {topStrength.score}%
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 pt-0.5">
                                <span className="text-sm">{topStrength.icon}</span>
                                <span className="text-xs font-bold text-slate-800 truncate">
                                  {topStrength.name}
                                </span>
                              </div>
                              <p className="text-[10.5px] text-emerald-800/80 font-medium">
                                {isEnglish ? "Strong mastery • High scoring reliability" : "मजबूत पकड़ • परीक्षा में भरोसेमंद अंक"}
                              </p>
                            </div>

                            {/* Card 3: Priority Focus */}
                            <div className="bg-gradient-to-br from-amber-50/80 to-slate-50 border border-amber-100 rounded-xl p-3 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-800">
                                  {isEnglish ? "⚠️ Priority Area" : "⚠️ प्राथमिक सुधार"}
                                </span>
                                <span className="text-xs font-bold text-amber-900">
                                  {priorityFocus.score}%
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 pt-0.5">
                                <span className="text-sm">{priorityFocus.icon}</span>
                                <span className="text-xs font-bold text-slate-800 truncate">
                                  {priorityFocus.name}
                                </span>
                              </div>
                              <p className="text-[10.5px] text-amber-900/80 font-medium truncate" title={priorityFocus.tip}>
                                {priorityFocus.tip}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Main Bento Grid layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                      {/* TILE 1: Radar Chart (Cognitive Mastery Dimensions) - Spans 2 columns on desktop */}
                      {(() => {
                        // Calculate Radar points
                        const width = 300;
                        const height = 300;
                        const cx = width / 2;
                        const cy = height / 2;
                        const rMax = 80;

                        // 5 Dimensions matching the discussed points
                        const keys = [
                          {
                            label: "Concept Clarity",
                            val: dashboardStats.conceptClarity,
                            icon: "🎯",
                          },
                          {
                            label: "Theoretical Core",
                            val: dashboardStats.theoreticalCore,
                            icon: "📖",
                          },
                          {
                            label: "Calculations",
                            val: dashboardStats.calculationPrecision,
                            icon: "🧮",
                          },
                          {
                            label: "Formula Recall",
                            val: dashboardStats.formulaRecall,
                            icon: "⚡",
                          },
                          {
                            label: "Socratic Stamina",
                            val: dashboardStats.socraticStamina,
                            icon: "🔥",
                          },
                        ];

                        const points = keys.map((key, i) => {
                          const angle = ((-90 + i * 72) * Math.PI) / 180;
                          const length = rMax * (key.val / 100);
                          const x = cx + Math.cos(angle) * length;
                          const y = cy + Math.sin(angle) * length;
                          return {
                            x,
                            y,
                            label: key.label,
                            score: key.val,
                            angle,
                          };
                        });

                        const pointsStr = points
                          .map((p) => `${p.x},${p.y}`)
                          .join(" ");

                        // Grid Polygons
                        const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

                        const dim = DIMENSION_DETAILS[activeDimensionIndex];
                        const dimensionScore =
                          activeDimensionIndex === 0
                            ? dashboardStats.conceptClarity
                            : activeDimensionIndex === 1
                              ? dashboardStats.theoreticalCore
                              : activeDimensionIndex === 2
                                ? dashboardStats.calculationPrecision
                                : activeDimensionIndex === 3
                                  ? dashboardStats.formulaRecall
                                  : dashboardStats.socraticStamina;

                        return (
                          <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between text-left space-y-4">
                            {/* Card Header */}
                            <div className="flex items-center justify-between w-full pb-2.5 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-xl bg-indigo-50 text-[#796AEF] border border-indigo-100/90 flex items-center justify-center text-xs shadow-2xs shrink-0">
                                  <Target className="w-4 h-4 text-[#796AEF]" />
                                </span>
                                <div>
                                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 font-mono">
                                    Micro-Cognitive Dimensions
                                  </h4>
                                  <span className="text-[10.5px] font-mono text-slate-400 font-medium">
                                    5-Axis Mastery Analysis
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10.5px] font-mono font-bold bg-indigo-50 text-[#796AEF] border border-indigo-100/90 px-2.5 py-0.5 rounded-full">
                                Real-time Sync
                              </span>
                            </div>

                            {/* Middle section: Radar SVG on left, Selected Dimension Insights on right */}
                            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-5 justify-between flex-1">
                              {/* SVG Radar Chart container */}
                              <div className="flex-1 flex flex-col items-center justify-center w-full py-1">
                                <div className="w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] relative flex items-center justify-center">
                                  <svg
                                    viewBox={`0 0 ${width} ${height}`}
                                    className="w-full h-full overflow-visible select-none"
                                  >
                                    {/* Background Grids */}
                                    {gridLevels.map((lvl, idx) => {
                                      const gridPoints = Array.from(
                                        { length: 5 },
                                        (_, i) => {
                                          const angle =
                                            ((-90 + i * 72) * Math.PI) / 180;
                                          const x =
                                            cx + Math.cos(angle) * rMax * lvl;
                                          const y =
                                            cy + Math.sin(angle) * rMax * lvl;
                                          return `${x},${y}`;
                                        },
                                      ).join(" ");

                                      return (
                                        <polygon
                                          key={idx}
                                          points={gridPoints}
                                          className="fill-none stroke-slate-200"
                                          strokeWidth="1"
                                          strokeDasharray={
                                            idx < 4 ? "3,3" : "none"
                                          }
                                        />
                                      );
                                    })}

                                    {/* Spoke lines */}
                                    {Array.from({ length: 5 }, (_, i) => {
                                      const angle =
                                        ((-90 + i * 72) * Math.PI) / 180;
                                      const x = cx + Math.cos(angle) * rMax;
                                      const y = cy + Math.sin(angle) * rMax;
                                      return (
                                        <line
                                          key={i}
                                          x1={cx}
                                          y1={cy}
                                          x2={x}
                                          y2={y}
                                          className="stroke-slate-200"
                                          strokeWidth="1"
                                        />
                                      );
                                    })}

                                    {/* Performance Polygon Area with gradient */}
                                    <polygon
                                      points={pointsStr}
                                      className="fill-[#796AEF]/15 stroke-[#796AEF]"
                                      strokeWidth="2.5"
                                      strokeLinejoin="round"
                                    />

                                    {/* Vertex interactive markers */}
                                    {points.map((p, i) => {
                                      const labelAngle = p.angle;
                                      const labelDist = rMax + 20;
                                      const lx =
                                        cx + Math.cos(labelAngle) * labelDist;
                                      const ly =
                                        cy + Math.sin(labelAngle) * labelDist;

                                      const isSelected =
                                        activeDimensionIndex === i;

                                      return (
                                        <g
                                          key={i}
                                          className="cursor-pointer"
                                          onClick={() =>
                                            setActiveDimensionIndex(i)
                                          }
                                        >
                                          {/* Invisible large hit-target */}
                                          <circle
                                            cx={p.x}
                                            cy={p.y}
                                            r="16"
                                            fill="transparent"
                                          />
                                          {/* Glowing active point */}
                                          {isSelected && (
                                            <circle
                                              cx={p.x}
                                              cy={p.y}
                                              r="8"
                                              className="fill-[#796AEF]/25 animate-ping"
                                            />
                                          )}
                                          {/* Score vertex circle */}
                                          <circle
                                            cx={p.x}
                                            cy={p.y}
                                            r={isSelected ? "5.5" : "4.5"}
                                            className={
                                              isSelected
                                                ? "fill-[#796AEF] stroke-white"
                                                : "fill-white stroke-[#796AEF]"
                                            }
                                            strokeWidth="2"
                                          />
                                          {/* Label text */}
                                          <text
                                            x={lx}
                                            y={ly}
                                            textAnchor="middle"
                                            alignmentBaseline="middle"
                                            className={`text-[10px] font-bold font-mono transition-all ${
                                              isSelected
                                                ? "fill-[#796AEF] font-black"
                                                : "fill-slate-700"
                                            }`}
                                          >
                                            {keys[i].icon} {p.label} ({p.score}%)
                                          </text>
                                        </g>
                                      );
                                    })}
                                  </svg>
                                </div>
                              </div>

                              {/* Interactive Dimension Educator Insights box */}
                              <div className="w-full md:w-72 lg:w-80 bg-slate-50/80 border border-slate-200/80 p-4 rounded-2xl flex flex-col justify-between space-y-3 min-h-[220px]">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                                    <span className="text-[10.5px] font-mono font-bold text-[#796AEF] uppercase tracking-wider flex items-center gap-1.5">
                                      <span>{dim.icon}</span>
                                      <span>Selected Dimension</span>
                                    </span>
                                    <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-full border border-slate-200/80 shadow-2xs">
                                      {dimensionScore}%
                                    </span>
                                  </div>
                                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                                    {dim.name}
                                  </h4>
                                  <p className="text-[11.5px] text-slate-600 font-medium leading-relaxed">
                                    {dim.description}
                                  </p>
                                </div>

                                <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1 shadow-2xs">
                                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 tracking-wider flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                                    <span>Cherry Ma'am's Strategic Advice:</span>
                                  </span>
                                  <p className="text-[11.5px] text-slate-800 font-semibold leading-normal italic">
                                    "
                                    {dim.recommendation.replace(
                                      "{score}",
                                      dimensionScore.toString(),
                                    )}
                                    "
                                  </p>
                                </div>

                                <div className="text-[10.5px] font-mono text-slate-500 font-medium flex items-center gap-1 pt-0.5">
                                  <span>💡</span>
                                  <span>{isEnglish ? "Tap points on the radar chart to view personalized advice." : "रेडार चार्ट के बिंदुओं पर टैप करके सलाह देखें।"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* TILE 2: Consistency, Milestone & Badges Progress */}
                      <div className="bg-white border border-[#EFF1F5] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4 text-left">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-[#EFF1F5] pb-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E293B] font-sans flex items-center gap-1.5">
                              🏆 Consistency Milestone
                            </span>
                            <span className="text-[10.5px] font-bold text-[#4A4E5A] font-sans">
                              Target: Scholar
                            </span>
                          </div>

                          {/* Dynamic Gauge details */}
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  className="stroke-[#EFF1F5]"
                                  strokeWidth="4.5"
                                  fill="transparent"
                                />
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  className="stroke-amber-500 transition-all duration-500"
                                  strokeWidth="4.5"
                                  fill="transparent"
                                  strokeDasharray="175.9"
                                  strokeDashoffset={
                                    175.9 -
                                    (175.9 * dashboardStats.socraticStamina) /
                                      100
                                  }
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="absolute text-xs font-bold text-[#1E293B]">
                                {dashboardStats.socraticStamina}%
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
                                Socratic Stamina
                              </span>
                              <p className="text-[11.5px] text-[#4A4E5A] leading-relaxed">
                                Calculated dynamically based on your classroom attendance, notes saved, and quiz participation.
                              </p>
                            </div>
                          </div>

                          {/* Classroom Real-time sync list */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div className="bg-[#F6F7FB] border border-[#EFF1F5] rounded-xl p-2.5 text-center">
                              <span className="text-sm font-bold text-[#1E293B] block">
                                {pastSessions?.length || 0}
                              </span>
                              <span className="text-[10.5px] text-[#4A4E5A] font-bold uppercase tracking-wider block">
                                Classes Done
                              </span>
                            </div>
                            <div className="bg-[#F6F7FB] border border-[#EFF1F5] rounded-xl p-2.5 text-center">
                              <span className="text-sm font-bold text-[#1E293B] block">
                                {snapshots?.length || 0}
                              </span>
                              <span className="text-[10.5px] text-[#4A4E5A] font-bold uppercase tracking-wider block">
                                Saved Notes
                              </span>
                            </div>
                            <div className="bg-[#F6F7FB] border border-[#EFF1F5] rounded-xl p-2.5 text-center">
                              <span className="text-sm font-bold text-[#1E293B] block">
                                {quizAttempts?.length || 0}
                              </span>
                              <span className="text-[10.5px] text-[#4A4E5A] font-bold uppercase tracking-wider block">
                                Quizzes Taken
                              </span>
                            </div>
                            <div className="bg-[#F6F7FB] border border-[#EFF1F5] rounded-xl p-2.5 text-center">
                              <span className="text-sm font-bold text-[#1E293B] block">
                                {
                                  Object.keys(masteredCards).filter(
                                    (k) => masteredCards[k],
                                  ).length
                                }
                              </span>
                              <span className="text-[10.5px] text-[#4A4E5A] font-bold uppercase tracking-wider block">
                                Decks Mastered
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Unlocked Badges Row */}
                        <div className="pt-3 border-t border-[#EFF1F5] space-y-2">
                          <span className="text-[10.5px] font-bold uppercase text-[#4A4E5A] tracking-wider block">
                            🏆 Earned Scholars Badges:
                          </span>
                          <div className="flex gap-2 flex-wrap">
                            {pastSessions?.length > 0 && (
                              <span
                                className="bg-emerald-50 text-emerald-800 border border-emerald-200/70 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold"
                                title="Attended at least 1 live session with Cherry Ma'am"
                              >
                                🌿 Chalkboard Pioneer
                              </span>
                            )}
                            {snapshots?.length > 0 && (
                              <span
                                className="bg-indigo-50 text-[#796AEF] border border-indigo-200/70 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold"
                                title="Saved chalkboard whiteboard equations"
                              >
                                📸 Formula Archivist
                              </span>
                            )}
                            {quizAttempts?.length > 0 && (
                              <span
                                className="bg-purple-50 text-purple-800 border border-purple-200/70 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold"
                                title="Completed at least 1 practice classroom quiz"
                              >
                                📝 Quiz Conqueror
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* TILE 3: Performance Trend & Accuracy Timeline (Smooth Wavy Area/Line Chart) - Spans 2 columns */}
                      <div className="lg:col-span-2 bg-white border border-[#EFF1F5] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4 text-left">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between border-b border-[#EFF1F5] pb-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E293B] font-sans flex items-center gap-1.5">
                              📈 Classroom Quiz Accuracy Trendline
                            </span>
                            <span className="text-[10.5px] font-bold text-[#4A4E5A] font-sans">
                              Timeline Order
                            </span>
                          </div>
                          <p className="text-[11px] text-[#4A4E5A] leading-relaxed">
                            Tracks your accuracy percentages chronologically across your class test sittings to visualize your learning trajectory.
                          </p>
                        </div>

                        {/* Elegant custom inline SVG Line Chart */}
                        <div className="h-44 w-full relative flex items-center justify-center">
                          {(() => {
                            // Chronological attempts (ascending order of timestamp)
                            const chronological = [
                              ...dashboardStats.subjectAttempts,
                            ].reverse();
                            const count = chronological.length;

                            if (count === 0) {
                              // Display a beautiful mock visual path for "Initial Baseline"
                              return (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-2 bg-[#F6F7FB] rounded-2xl border border-dashed border-[#EFF1F5] p-4 select-none">
                                  <span className="text-lg">⏳</span>
                                  <div className="space-y-0.5">
                                    <h6 className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wide">
                                      No Test History Available Yet
                                    </h6>
                                    <p className="text-[11px] text-[#4A4E5A] max-w-xs mx-auto leading-relaxed">
                                      Take your first classroom-aligned Quick Quiz to unlock your dynamic learning accuracy trendline and watch your curve grow!
                                    </p>
                                  </div>
                                </div>
                              );
                            }

                            // Dimensions
                            const w = 480;
                            const h = 150;
                            const paddingX = 40;
                            const paddingY = 20;

                            const chartW = w - paddingX * 2;
                            const chartH = h - paddingY * 2;

                            // Map chronological attempts to chart points
                            const points = chronological.map((att, i) => {
                              const x =
                                paddingX +
                                (count > 1
                                  ? (i / (count - 1)) * chartW
                                  : chartW / 2);
                              // Accuracy: 0 to 100
                              const y =
                                h - paddingY - (att.accuracy / 100) * chartH;
                              return {
                                x,
                                y,
                                accuracy: att.accuracy,
                                date:
                                  att.docName?.split("•")?.[0]?.trim() ||
                                  "Quiz",
                              };
                            });

                            // Draw curved path using cubic Bézier curves (smooth wavy curve)
                            let dPath = "";
                            if (points.length === 1) {
                              dPath = `M ${points[0].x - 10} ${points[0].y} L ${points[0].x + 10} ${points[0].y}`;
                            } else if (points.length > 1) {
                              dPath = `M ${points[0].x} ${points[0].y}`;
                              for (let i = 0; i < points.length - 1; i++) {
                                const curr = points[i];
                                const next = points[i + 1];
                                const cp1X = curr.x + (next.x - curr.x) / 2;
                                const cp1Y = curr.y;
                                const cp2X = curr.x + (next.x - curr.x) / 2;
                                const cp2Y = next.y;
                                dPath += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${next.x} ${next.y}`;
                              }
                            }

                            // Area path (closed polygon back to bottom axis for gradient filling)
                            let dArea = "";
                            if (points.length > 1) {
                              dArea = `${dPath} L ${points[points.length - 1].x} ${h - paddingY} L ${points[0].x} ${h - paddingY} Z`;
                            }

                            return (
                              <svg
                                viewBox={`0 0 ${w} ${h}`}
                                className="w-full h-full overflow-visible select-none"
                              >
                                <defs>
                                  <linearGradient
                                    id="chartAreaGrad"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor="#796AEF"
                                      stopOpacity="0.2"
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor="#796AEF"
                                      stopOpacity="0.0"
                                    />
                                  </linearGradient>
                                </defs>

                                {/* Horizontal gridlines */}
                                {[0, 25, 50, 75, 100].map((val) => {
                                  const y = h - paddingY - (val / 100) * chartH;
                                  return (
                                    <g key={val}>
                                      <line
                                        x1={paddingX}
                                        y1={y}
                                        x2={w - paddingX}
                                        y2={y}
                                        className="stroke-[#EFF1F5]"
                                        strokeWidth="1"
                                        strokeDasharray="2,2"
                                      />
                                      <text
                                        x={paddingX - 8}
                                        y={y + 3}
                                        textAnchor="end"
                                        className="text-[9.5px] font-sans font-bold fill-[#4A4E5A]"
                                      >
                                        {val}%
                                      </text>
                                    </g>
                                  );
                                })}

                                {/* Smooth Gradient Area Fill */}
                                {dArea && (
                                  <path
                                    d={dArea}
                                    fill="url(#chartAreaGrad)"
                                  />
                                )}

                                {/* Crisp wavy line path */}
                                {dPath && (
                                  <path
                                    d={dPath}
                                    fill="none"
                                    className="stroke-[#796AEF]"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                  />
                                )}

                                {/* Point circles & tooltips */}
                                {points.map((p, idx) => (
                                  <g key={idx} className="cursor-pointer group">
                                    <circle
                                      cx={p.x}
                                      cy={p.y}
                                      r="7"
                                      className="fill-[#796AEF]/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                      strokeWidth="0"
                                    />
                                    <circle
                                      cx={p.x}
                                      cy={p.y}
                                      r="4.5"
                                      className="fill-[#796AEF] stroke-white"
                                      strokeWidth="2"
                                    />

                                    {/* Label index below point */}
                                    <text
                                      x={p.x}
                                      y={h - paddingY + 12}
                                      textAnchor="middle"
                                      className="text-[9px] font-sans font-bold fill-[#4A4E5A]"
                                    >
                                      #{idx + 1}
                                    </text>

                                    {/* Mini overlay tooltip on hover */}
                                    <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                                      <rect
                                        x={p.x - 30}
                                        y={p.y - 24}
                                        width="60"
                                        height="16"
                                        rx="6"
                                        className="fill-[#1E293B]"
                                      />
                                      <text
                                        x={p.x}
                                        y={p.y - 13}
                                        textAnchor="middle"
                                        className="text-[9.5px] font-bold fill-white"
                                      >
                                        {p.accuracy}% Correct
                                      </text>
                                    </g>
                                  </g>
                                ))}
                              </svg>
                            );
                          })()}
                        </div>

                        <div className="flex items-center justify-between text-[10.5px] font-sans text-[#4A4E5A] pt-2 border-t border-[#EFF1F5]">
                          <span>⬅️ Earlier attempts</span>
                          <span>Latest sittings ➡️</span>
                        </div>
                      </div>

                      {/* TILE 4: Conceptual Strengths (Mastery Highlights) */}
                      <div className="bg-white border border-[#EFF1F5] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4 text-left">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-[#EFF1F5] pb-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-sans flex items-center gap-1.5">
                              🏆 Conceptual Strengths
                            </span>
                            <span className="text-[10.5px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200/60 font-sans">
                              Verified
                            </span>
                          </div>
                          <p className="text-[11px] text-[#4A4E5A] leading-relaxed">
                            Topics & theories where you have demonstrated flawless accuracy and solid deductive clarity in class tests.
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:hidden pb-0.5 text-[11px] text-emerald-700 font-bold">
                          <span>← Swipe Verified Strengths →</span>
                          <span>{dashboardStats.strengths.length} Topics</span>
                        </div>
                        <div className="flex sm:flex-col overflow-x-auto sm:overflow-visible gap-2.5 pb-2 sm:pb-0 scrollbar-thin snap-x snap-mandatory">
                          {dashboardStats.strengths
                            .slice(0, 4)
                            .map((str, idx) => (
                              <div
                                key={idx}
                                className="bg-[#F6F7FB] border border-[#EFF1F5] p-3 rounded-xl text-left flex items-start gap-2.5 w-[76vw] sm:w-auto shrink-0 sm:shrink snap-center shadow-2xs"
                              >
                                <span className="p-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs shrink-0 font-bold border border-emerald-200/60">
                                  ✓
                                </span>
                                <div className="space-y-0.5 min-w-0">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                                    {str.category}
                                  </span>
                                  <p className="text-[11.5px] text-[#1E293B] font-bold leading-tight">
                                    {str.concept}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>

                        <div className="text-[10.5px] text-emerald-800 font-semibold bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/60 flex items-center gap-1 justify-center">
                          <span>
                            💎 Keep it up! These are ready for board revisions.
                          </span>
                        </div>
                      </div>

                      {/* TILE 5: Growth Areas & Recommendations */}
                      <div className="bg-white border border-[#EFF1F5] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4 text-left">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-[#EFF1F5] pb-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 font-sans flex items-center gap-1.5">
                              ⚠️ Mastery Focus Areas
                            </span>
                            <span className="text-[10.5px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200/60 font-sans">
                              Action Needed
                            </span>
                          </div>
                          <p className="text-[11px] text-[#4A4E5A] leading-relaxed">
                            Questions and concepts where revision will directly boost your accuracy score.
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:hidden pb-0.5 text-[11px] text-amber-700 font-bold">
                          <span>← Swipe Growth Areas →</span>
                          <span>{dashboardStats.growths.length} Focus Points</span>
                        </div>
                        <div className="flex sm:flex-col overflow-x-auto sm:overflow-visible gap-2.5 pb-2 sm:pb-0 scrollbar-thin snap-x snap-mandatory">
                          {dashboardStats.growths.slice(0, 3).map((g, idx) => (
                            <div
                              key={idx}
                              className="bg-[#F6F7FB] border border-[#EFF1F5] p-3 rounded-xl text-left space-y-2 w-[76vw] sm:w-auto shrink-0 sm:shrink snap-center shadow-2xs"
                            >
                              <div className="flex items-start gap-2">
                                <span className="p-1 bg-amber-50 text-amber-700 rounded-lg text-xs shrink-0 font-bold border border-amber-200/60">
                                  !
                                </span>
                                <div className="min-w-0">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                                    {g.category}
                                  </span>
                                  <p className="text-[11.5px] text-[#1E293B] font-bold leading-tight">
                                    {g.concept}
                                  </p>
                                </div>
                              </div>
                              <p className="text-[11px] text-[#4A4E5A] font-medium bg-white p-2 rounded-xl border border-[#EFF1F5] leading-relaxed">
                                {g.explanation}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="text-[10.5px] text-amber-800 font-semibold bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 flex items-center gap-1 justify-center">
                          <span>
                            📖 Practice flashcards to master these topics!
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PHASE 4: Board Exam Readiness Index & Projected Score Estimator */}
                    {(() => {
                      const examReadinessScore = Math.min(
                        100,
                        Math.max(
                          10,
                          Math.round(
                            dashboardStats.conceptClarity * 0.25 +
                              dashboardStats.theoreticalCore * 0.2 +
                              dashboardStats.calculationPrecision * 0.25 +
                              dashboardStats.formulaRecall * 0.15 +
                              dashboardStats.socraticStamina * 0.15,
                          ),
                        ),
                      );
                      const projectedPercentile = Math.min(
                        99.4,
                        75 + (examReadinessScore - 50) * 0.45,
                      ).toFixed(1);
                      const gradeBand =
                        examReadinessScore >= 90
                          ? "A1 (91–100%) • Top Distinction"
                          : examReadinessScore >= 80
                            ? "A2 (81–90%) • Outstanding"
                            : examReadinessScore >= 70
                              ? "B1 (71–80%) • Solid Merit"
                              : examReadinessScore >= 60
                                ? "B2 (61–70%) • Good Progress"
                                : "C1 (51–60%) • Foundation Reinforcement Needed";

                      return (
                        <div className="bg-white border border-[#EFF1F5] rounded-2xl p-4 sm:p-5 text-[#1E293B] shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5 text-left">
                          <div className="space-y-2.5 max-w-xl z-10">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#796AEF] border border-indigo-200/60 text-[10.5px] font-bold uppercase tracking-wider font-sans">
                                🎯 Board Readiness Metric
                              </span>
                              <span className="text-[11px] font-sans font-semibold text-[#4A4E5A]">
                                Curriculum: {grade || "Class 10"} •{" "}
                                {board || "CBSE"}
                              </span>
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-[#1E293B] tracking-tight flex items-center gap-2">
                              <span>Target Board Exam Readiness Index</span>
                              <span className="text-[#796AEF] font-bold">
                                ({examReadinessScore}%)
                              </span>
                            </h3>
                            <p className="text-xs text-[#4A4E5A] font-sans leading-relaxed">
                              Predicted Grade Band:{" "}
                              <strong className="text-[#1E293B] font-bold">
                                {gradeBand}
                              </strong>{" "}
                              • Estimated Percentile:{" "}
                              <strong className="text-emerald-700 font-bold">
                                Top {projectedPercentile}%
                              </strong>{" "}
                              nationwide.
                            </p>
                            <div className="w-full bg-[#F6F7FB] h-2.5 rounded-full overflow-hidden border border-[#EFF1F5]">
                              <div
                                className="h-full bg-[#796AEF] rounded-full transition-all duration-500"
                                style={{ width: `${examReadinessScore}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 z-10 w-full md:w-auto">
                            <button
                              type="button"
                              onClick={() => setIsReportCardModalOpen(true)}
                              className="px-4 py-2.5 bg-[#796AEF] hover:bg-[#6858e0] active:scale-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                            >
                              <FileText className="w-4 h-4 stroke-[2.5]" />
                              <span>Generate Report Card 🎓</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsKiaraVoiceModalOpen(true)}
                              className="px-4 py-2.5 bg-[#F6F7FB] hover:bg-slate-100 active:scale-95 text-[#1E293B] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#EFF1F5] shadow-2xs"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>Kiara Strategy Call 🎙️</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* PHASE 4: Weekly AI Smart Study Timetable & Daily Revision Planner */}
                    {(() => {
                      const days = [
                        {
                          day: "Monday",
                          title: "Core Theory & Definitions",
                          icon: "📖",
                          theme: "Theoretical Foundations",
                          focus:
                            "Deep definition memorization & theorem statements",
                          tasks: [
                            {
                              id: "mon-1",
                              label: `Review 5 key theorems for ${subject || "Mathematics"} from Chapter Books`,
                            },
                            {
                              id: "mon-2",
                              label: "Practice 1 foundational conceptual derivation",
                            },
                            {
                              id: "mon-3",
                              label: "Take 1 quick 5-question baseline quiz",
                            },
                          ],
                        },
                        {
                          day: "Tuesday",
                          title: "Formula & Identity Sprint",
                          icon: "⚡",
                          theme: "Formula Recall Acceleration",
                          focus:
                            "Instant flashcard recall without looking at answer keys",
                          tasks: [
                            {
                              id: "tue-1",
                              label: "Run through 15 flashcards in Speed Mode",
                            },
                            {
                              id: "tue-2",
                              label: "Derive key identity equations on scratchpad",
                            },
                            {
                              id: "tue-3",
                              label: "Bookmark tricky formulas into personal notebook",
                            },
                          ],
                        },
                        {
                          day: "Wednesday",
                          title: "Numerical & Precision Drills",
                          icon: "🧮",
                          theme: "Calculation Accuracy",
                          focus:
                            "Step-by-step arithmetic without sign or rounding errors",
                          tasks: [
                            {
                              id: "wed-1",
                              label: "Solve 3 multi-step calculation problems",
                            },
                            {
                              id: "wed-2",
                              label: "Verify unit conversions and final decimal precision",
                            },
                            {
                              id: "wed-3",
                              label: "Check working steps against blackboard notes",
                            },
                          ],
                        },
                        {
                          day: "Thursday",
                          title: "Blindspot & Error Eradication",
                          icon: "🔍",
                          theme: "Targeted Weak-Zone Remediation",
                          focus:
                            "Re-attempt previously missed questions until 100% clear",
                          tasks: [
                            {
                              id: "thu-1",
                              label: "Re-take 1 quiz with previous mistakes",
                            },
                            {
                              id: "thu-2",
                              label: "Ask Cherry Ma'am during live lecture for doubts",
                            },
                            {
                              id: "thu-3",
                              label: "Summarize 1 tricky concept in own words",
                            },
                          ],
                        },
                        {
                          day: "Friday",
                          title: "Socratic Speed & Rapid Fire",
                          icon: "🔥",
                          theme: "Cognitive Agility & Pace",
                          focus:
                            "Solve questions under 60-second exam countdown pressure",
                          tasks: [
                            {
                              id: "fri-1",
                              label: "Complete 1 Speed Sprint test in under 5 minutes",
                            },
                            {
                              id: "fri-2",
                              label: "Eliminate wrong MCQ options using mental shortcuts",
                            },
                            {
                              id: "fri-3",
                              label: "Log timing benchmarks on Agility radar",
                            },
                          ],
                        },
                        {
                          day: "Saturday",
                          title: "Comprehensive Mock Sitting",
                          icon: "🎯",
                          theme: "Full Syllabus Integration",
                          focus:
                            "Simulated board exam condition with mixed chapter questions",
                          tasks: [
                            {
                              id: "sat-1",
                              label: "Take complete 15-question mixed chapter exam",
                            },
                            {
                              id: "sat-2",
                              label: "Analyze Cognitive Radar shifts post-test",
                            },
                            {
                              id: "sat-3",
                              label: "Export/Print updated Performance Report Card",
                            },
                          ],
                        },
                        {
                          day: "Sunday",
                          title: "Consolidation & Strategy Reset",
                          icon: "🧘",
                          theme: "Reflection & Next Week Planning",
                          focus:
                            "Relax, review overall progress, and sync with Kiara AI counselor",
                          tasks: [
                            {
                              id: "sun-1",
                              label: "Review weekly accuracy gains and earned badges",
                            },
                            {
                              id: "sun-2",
                              label: "Discuss study mindset & exam pacing with Kiara AI",
                            },
                            {
                              id: "sun-3",
                              label: "Prepare chapter goals for the upcoming week",
                            },
                          ],
                        },
                      ];

                      const currentDayPlan =
                        days[activePlannerDayIndex] || days[0];

                      return (
                        <div className="bg-white border border-[#EFF1F5] rounded-2xl p-4 sm:p-5 shadow-xs text-left space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFF1F5]">
                            <div className="flex items-center gap-2.5">
                              <span className="p-1.5 rounded-xl bg-indigo-50 text-[#796AEF] border border-indigo-200/60 text-sm">
                                📅
                              </span>
                              <div>
                                <h4 className="text-xs sm:text-sm font-bold text-[#1E293B] uppercase tracking-wider font-sans">
                                  Personalized AI Study Timetable & Daily Planner
                                </h4>
                                <p className="text-[11px] text-[#4A4E5A] font-sans">
                                  Structured 7-day revision regimen aligned with your{" "}
                                  <strong className="text-[#796AEF] font-bold">
                                    Cognitive Radar
                                  </strong>{" "}
                                  deficits
                                </p>
                              </div>
                            </div>

                            {/* Status badge */}
                            <div className="flex items-center gap-2.5 bg-[#F6F7FB] px-3 py-1.5 rounded-xl border border-[#EFF1F5] shrink-0 self-start sm:self-auto shadow-2xs">
                              <div className="text-right">
                                <span className="text-[10px] font-sans uppercase font-bold text-[#4A4E5A] block">
                                  Today's Focus
                                </span>
                                <span className="text-xs font-bold text-[#1E293B]">
                                  {currentDayPlan.theme}
                                </span>
                              </div>
                              <div className="w-7 h-7 rounded-xl bg-indigo-50 text-[#796AEF] flex items-center justify-center text-xs font-bold border border-indigo-200/60">
                                {currentDayPlan.icon}
                              </div>
                            </div>
                          </div>

                          {/* Day pills selector strip */}
                          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 px-0.5 scrollbar-thin">
                            {days.map((d, idx) => {
                              const isActive = activePlannerDayIndex === idx;
                              return (
                                <button
                                  key={d.day}
                                  type="button"
                                  onClick={() => setActivePlannerDayIndex(idx)}
                                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                                    isActive
                                      ? "bg-[#796AEF] text-white border-[#796AEF] shadow-xs font-bold"
                                      : "bg-[#F6F7FB] hover:bg-slate-100 text-[#4A4E5A] hover:text-[#1E293B] border-[#EFF1F5]"
                                  }`}
                                >
                                  <span>{d.icon}</span>
                                  <span>{d.day.slice(0, 3)}</span>
                                  {idx ===
                                    (new Date().getDay() === 0
                                      ? 6
                                      : new Date().getDay() - 1) && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Current selected day revision card */}
                          <div className="bg-[#F6F7FB] border border-[#EFF1F5] rounded-2xl p-4 space-y-3">
                            <div className="flex items-center justify-between border-b border-[#EFF1F5] pb-2">
                              <div>
                                <span className="text-[10.5px] font-bold uppercase text-[#796AEF] tracking-wider font-sans">
                                  {currentDayPlan.day} • {currentDayPlan.theme}
                                </span>
                                <h5 className="text-xs sm:text-sm font-bold text-[#1E293B] mt-0.5">
                                  {currentDayPlan.title}
                                </h5>
                              </div>
                              <span className="text-[11px] text-[#4A4E5A] italic hidden sm:inline font-sans">
                                Focus: {currentDayPlan.focus}
                              </span>
                            </div>

                            {/* Tasks checklist */}
                            <div className="space-y-2">
                              {currentDayPlan.tasks.map((task) => {
                                const isDone = completedPlannerTasks[task.id];
                                return (
                                  <div
                                    key={task.id}
                                    onClick={() =>
                                      togglePlannerTask(task.id)
                                    }
                                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                                      isDone
                                        ? "bg-emerald-50/70 border-emerald-300/60 text-emerald-950"
                                        : "bg-white border-[#EFF1F5] hover:border-indigo-300 text-[#1E293B] shadow-2xs"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div
                                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                                          isDone
                                            ? "bg-emerald-600 text-white"
                                            : "border-2 border-[#CBD5E1] bg-white"
                                        }`}
                                      >
                                        {isDone && (
                                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        )}
                                      </div>
                                      <span
                                        className={`text-xs font-semibold truncate ${
                                          isDone
                                            ? "line-through text-emerald-900/70"
                                            : "text-[#1E293B]"
                                        }`}
                                      >
                                        {task.label}
                                      </span>
                                    </div>

                                    {task.id.includes("-1") && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onEnterClassroom();
                                        }}
                                        className="px-2.5 py-1 bg-[#796AEF] hover:bg-[#6858e0] text-white rounded-lg text-[10px] font-bold shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                                      >
                                        <span>Start 🚀</span>
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </>

                ) : performanceWorkspaceTab === "micro" ? (
                  /* PHASE 1: MICRO OVERVIEW & ERROR CLASSIFICATION MATRIX VIEW */
                  <div className="space-y-4 sm:space-y-5 animate-fade-in text-left">
                    {/* Micro Diagnostic Hero Bar */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-slate-900 shadow-2xs relative overflow-hidden space-y-4">
                      {/* Top Info Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#796AEF] border border-indigo-100/90 text-[11px] font-bold shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#796AEF] animate-pulse" />
                              Micro Overview
                            </span>
                            <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100/90 px-2.5 py-0.5 rounded-full border border-slate-200/80">
                              {subject} • {grade}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                            Sub-Topic Mastery &amp; Error Matrix
                          </h3>
                          <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-2xl">
                            Granular diagnostic of conceptual gaps, arithmetic precision, formula retention, and pacing health.
                          </p>
                        </div>
                      </div>

                      {/* 4 Summary Metrics - Clean 2x2 on Mobile, 4x1 on Desktop */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 border-t border-slate-100">
                        <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 text-left transition-all hover:bg-white hover:shadow-2xs">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                            Total Topics
                          </span>
                          <div className="flex items-baseline gap-1 my-1">
                            <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                              {microDiagnosticsData.allSubtopics.length}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">sub-topics</span>
                          </div>
                          <span className="text-[10.5px] text-slate-500 font-medium block">
                            Curriculum Scope
                          </span>
                        </div>

                        <div className="bg-rose-50/40 border border-rose-200/70 rounded-xl p-3 text-left transition-all hover:bg-rose-50/80 hover:shadow-2xs">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 block">
                            Critical Gaps
                          </span>
                          <div className="flex items-baseline gap-1 my-1">
                            <span className="text-xl sm:text-2xl font-black text-rose-600 font-mono">
                              {microDiagnosticsData.criticalGapsCount}
                            </span>
                            <span className="text-[10px] text-rose-400 font-mono">&lt;60% score</span>
                          </div>
                          <span className="text-[10.5px] text-rose-600 font-medium block">
                            High Priority Fix
                          </span>
                        </div>

                        <div className="bg-amber-50/40 border border-amber-200/70 rounded-xl p-3 text-left transition-all hover:bg-amber-50/80 hover:shadow-2xs">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 block">
                            In Progress
                          </span>
                          <div className="flex items-baseline gap-1 my-1">
                            <span className="text-xl sm:text-2xl font-black text-amber-600 font-mono">
                              {microDiagnosticsData.practicingCount}
                            </span>
                            <span className="text-[10px] text-amber-500 font-mono">60–84%</span>
                          </div>
                          <span className="text-[10.5px] text-amber-600 font-medium block">
                            Approaching Mastery
                          </span>
                        </div>

                        <div className="bg-emerald-50/40 border border-emerald-200/70 rounded-xl p-3 text-left transition-all hover:bg-emerald-50/80 hover:shadow-2xs">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 block">
                            Avg Latency
                          </span>
                          <div className="flex items-baseline gap-1 my-1">
                            <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">
                              {microDiagnosticsData.overallAvgLatency}s
                            </span>
                            <span className="text-[10px] text-emerald-500 font-mono">/ question</span>
                          </div>
                          <span className="text-[10.5px] text-emerald-600 font-medium block">
                            Pacing Health
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 1: 4-WAY MISTAKE CLASSIFICATION MATRIX */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5 text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-[#796AEF] border border-indigo-100/90 flex items-center justify-center text-xs shadow-2xs shrink-0">
                              <Crosshair className="w-3.5 h-3.5 text-[#796AEF]" />
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                              Error Classification Matrix
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Tap any mistake archetype to filter and target vulnerable sub-topics.
                          </p>
                        </div>

                        {microMistakeFilter !== "all" && (
                          <button
                            type="button"
                            onClick={() => setMicroMistakeFilter("all")}
                            className="text-[11px] font-bold text-[#796AEF] bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200/80 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-2xs min-h-[36px]"
                          >
                            <X className="w-3.5 h-3.5" /> <span>Clear Filter (Reset)</span>
                          </button>
                        )}
                      </div>

                      {/* 4 Mistake Archetype Cards */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                        {/* 1. Conceptual Gap */}
                        <div
                          onClick={() =>
                            setMicroMistakeFilter(
                              microMistakeFilter === "conceptual" ? "all" : "conceptual",
                            )
                          }
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[128px] ${
                            microMistakeFilter === "conceptual"
                              ? "bg-rose-50/90 border-rose-500 ring-2 ring-rose-400/40 shadow-xs"
                              : "bg-white hover:bg-rose-50/30 border-slate-200/80 hover:border-rose-300"
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-base">🎯</span>
                                <span className="text-xs font-bold text-slate-900 tracking-tight">
                                  Conceptual
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                                {microDiagnosticsData.mistakeDistribution.conceptual.percent}%
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                              Misunderstanding fundamental rules, theorems, or core definitions.
                            </p>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-rose-500 rounded-full transition-all"
                                style={{
                                  width: `${microDiagnosticsData.mistakeDistribution.conceptual.percent}%`,
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                              <span className="text-rose-600">Visual Derivations</span>
                              {microMistakeFilter === "conceptual" && (
                                <span className="text-[#796AEF] font-black">● Active</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 2. Calculation Slip */}
                        <div
                          onClick={() =>
                            setMicroMistakeFilter(
                              microMistakeFilter === "calculation" ? "all" : "calculation",
                            )
                          }
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[128px] ${
                            microMistakeFilter === "calculation"
                              ? "bg-amber-50/90 border-amber-500 ring-2 ring-amber-400/40 shadow-xs"
                              : "bg-white hover:bg-amber-50/30 border-slate-200/80 hover:border-amber-300"
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-base">🧮</span>
                                <span className="text-xs font-bold text-slate-900 tracking-tight">
                                  Calculation
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                {microDiagnosticsData.mistakeDistribution.calculation.percent}%
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                              Sign errors (+/-), algebraic transposition, or arithmetic oversights.
                            </p>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 rounded-full transition-all"
                                style={{
                                  width: `${microDiagnosticsData.mistakeDistribution.calculation.percent}%`,
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                              <span className="text-amber-600">Step-Checking</span>
                              {microMistakeFilter === "calculation" && (
                                <span className="text-[#796AEF] font-black">● Active</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 3. Formula Misrecall */}
                        <div
                          onClick={() =>
                            setMicroMistakeFilter(
                              microMistakeFilter === "formula" ? "all" : "formula",
                            )
                          }
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[128px] ${
                            microMistakeFilter === "formula"
                              ? "bg-indigo-50/90 border-[#796AEF] ring-2 ring-indigo-400/40 shadow-xs"
                              : "bg-white hover:bg-indigo-50/30 border-slate-200/80 hover:border-indigo-300"
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-base">⚡</span>
                                <span className="text-xs font-bold text-slate-900 tracking-tight">
                                  Formula Recall
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {microDiagnosticsData.mistakeDistribution.formula.percent}%
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                              Misremembering standard formulas, exponents, or unit conversions.
                            </p>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#796AEF] rounded-full transition-all"
                                style={{
                                  width: `${microDiagnosticsData.mistakeDistribution.formula.percent}%`,
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                              <span className="text-[#796AEF]">Formula Cards</span>
                              {microMistakeFilter === "formula" && (
                                <span className="text-[#796AEF] font-black">● Active</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 4. Speed / Panic Trap */}
                        <div
                          onClick={() =>
                            setMicroMistakeFilter(
                              microMistakeFilter === "speed" ? "all" : "speed",
                            )
                          }
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[128px] ${
                            microMistakeFilter === "speed"
                              ? "bg-sky-50/90 border-sky-500 ring-2 ring-sky-400/40 shadow-xs"
                              : "bg-white hover:bg-sky-50/30 border-slate-200/80 hover:border-sky-300"
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-base">⏱️</span>
                                <span className="text-xs font-bold text-slate-900 tracking-tight">
                                  Speed Trap
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                                {microDiagnosticsData.mistakeDistribution.speed.percent}%
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                              Rushing under time pressure or misreading problem statements.
                            </p>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-sky-500 rounded-full transition-all"
                                style={{
                                  width: `${microDiagnosticsData.mistakeDistribution.speed.percent}%`,
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                              <span className="text-sky-600">45s Pacing Sprints</span>
                              {microMistakeFilter === "speed" && (
                                <span className="text-[#796AEF] font-black">● Active</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: GRANULAR SUB-TOPIC MASTERY & DIRECT ACTION HUB */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 text-left">
                      {/* Filter Bar with Mobile Carousel/Grid Mode Toggle */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-[#796AEF] border border-indigo-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                              <Target className="w-3.5 h-3.5 text-[#796AEF]" />
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                                  Sub-Topic Competency
                                </h4>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/70">
                                  {microDiagnosticsData.subtopics.length}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium">
                                Diagnostic breakdown with targeted practice drills
                              </p>
                            </div>
                          </div>

                          {/* View Mode Toggle for Sub-Topics */}
                          <div className="flex items-center bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/80 shrink-0">
                            <button
                              type="button"
                              onClick={() => setMicroViewMode("carousel")}
                              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                                microViewMode === "carousel"
                                  ? "bg-white text-slate-900 border border-slate-200/80 shadow-2xs"
                                  : "text-slate-500 hover:text-slate-800"
                              }`}
                              title="Horizontal Swipe Deck"
                            >
                              Deck
                            </button>
                            <button
                              type="button"
                              onClick={() => setMicroViewMode("list")}
                              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                                microViewMode === "list"
                                  ? "bg-white text-slate-900 border border-slate-200/80 shadow-2xs"
                                  : "text-slate-500 hover:text-slate-800"
                              }`}
                              title="Grid List"
                            >
                              Grid
                            </button>
                          </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full sm:w-64">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search topic or chapter..."
                            value={microSearchQuery}
                            onChange={(e) => setMicroSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#796AEF] focus:border-[#796AEF] font-medium transition-all"
                          />
                          {microSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setMicroSearchQuery("")}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Subject & Mastery Filter Pills */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5">
                        {/* Subject Filter Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {[
                            "all",
                            "Mathematics",
                            "Physics",
                            "Chemistry",
                            "Biology",
                          ].map((subj) => (
                            <button
                              key={subj}
                              type="button"
                              onClick={() => setMicroSubjectFilter(subj)}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer shrink-0 border ${
                                microSubjectFilter === subj
                                  ? "bg-[#796AEF] text-white border-[#796AEF] shadow-2xs"
                                  : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
                              }`}
                            >
                              {subj === "all" ? "All Subjects" : subj}
                            </button>
                          ))}
                        </div>

                        {/* Mastery Status Filter Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {[
                            {
                              key: "all",
                              label: "All Status",
                              count: microDiagnosticsData.allSubtopics.length,
                            },
                            {
                              key: "critical",
                              label: "Critical (<60%)",
                              count: microDiagnosticsData.criticalGapsCount,
                              badge: "bg-rose-50 text-rose-700 border-rose-200",
                            },
                            {
                              key: "practicing",
                              label: "In Progress (60-84%)",
                              count: microDiagnosticsData.practicingCount,
                              badge: "bg-amber-50 text-amber-700 border-amber-200",
                            },
                            {
                              key: "mastered",
                              label: "Mastered (85%+)",
                              count: microDiagnosticsData.masteredCount,
                              badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
                            },
                          ].map((tab) => (
                            <button
                              key={tab.key}
                              type="button"
                              onClick={() =>
                                setMicroMasteryFilter(tab.key as any)
                              }
                              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer shrink-0 border flex items-center gap-1.5 ${
                                microMasteryFilter === tab.key
                                  ? "bg-[#796AEF] text-white border-[#796AEF] shadow-2xs"
                                  : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-white"
                              }`}
                            >
                              <span>{tab.label}</span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                                microMasteryFilter === tab.key
                                  ? "bg-white/20 text-white"
                                  : "bg-slate-200/80 text-slate-700"
                              }`}>
                                {tab.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sub-Topics List Cards (Horizontal Carousel or Grid) */}
                      {microDiagnosticsData.subtopics.length > 0 ? (
                        <>
                          {microViewMode === "carousel" && (
                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 pb-0.5 font-medium">
                              <span>
                                Horizontal swipe deck • {microDiagnosticsData.subtopics.length} topics
                              </span>
                              <span>Swipe or drag horizontally</span>
                            </div>
                          )}
                          <div
                            className={
                              microViewMode === "carousel"
                                ? "flex overflow-x-auto gap-3.5 pb-3 pt-0.5 snap-x snap-mandatory scrollbar-thin"
                                : "grid grid-cols-1 md:grid-cols-2 gap-3.5"
                            }
                          >
                            {microDiagnosticsData.subtopics.map((sub) => {
                              const isCritical =
                                sub.masteryStatus === "critical";
                              const isMastered =
                                sub.masteryStatus === "mastered";

                              return (
                                <div
                                  key={sub.id}
                                  className={`rounded-2xl border p-4 transition-all flex flex-col justify-between space-y-3.5 relative overflow-hidden bg-white shadow-2xs hover:shadow-xs ${
                                    microViewMode === "carousel"
                                      ? "w-[85vw] sm:w-[360px] shrink-0 snap-center"
                                      : ""
                                  } ${
                                    isCritical
                                      ? "border-rose-200/90 hover:border-rose-300"
                                      : isMastered
                                        ? "border-emerald-200/90 hover:border-emerald-300"
                                        : "border-slate-200/80 hover:border-slate-300"
                                  }`}
                                >
                                  {/* Header: Subject badge & Title */}
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/70 shrink-0">
                                          {sub.subject}
                                        </span>
                                        <span className="text-[11px] font-mono text-slate-400 font-medium truncate">
                                          {sub.chapter}
                                        </span>
                                      </div>

                                      {/* Mastery Status Badge */}
                                      <span
                                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                                          isCritical
                                            ? "bg-rose-50 text-rose-700 border-rose-200"
                                            : isMastered
                                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                              : "bg-amber-50 text-amber-700 border-amber-200"
                                        }`}
                                      >
                                        {sub.masteryScore}%{" "}
                                        {isCritical
                                          ? "Gap"
                                          : isMastered
                                            ? "Mastered"
                                            : "In Progress"}
                                      </span>
                                    </div>

                                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-snug">
                                      {sub.name}
                                    </h5>
                                  </div>

                                  {/* Metrics bar: Accuracy & Latency */}
                                  <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 font-medium">
                                        <span>Accuracy</span>
                                        <span className="text-slate-900 font-bold">
                                          {sub.accuracy}%
                                        </span>
                                      </div>
                                      <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full rounded-full transition-all ${
                                            isCritical
                                              ? "bg-rose-500"
                                              : isMastered
                                                ? "bg-emerald-500"
                                                : "bg-amber-500"
                                          }`}
                                          style={{ width: `${sub.accuracy}%` }}
                                        />
                                      </div>
                                    </div>

                                    <div className="space-y-1 border-l border-slate-200/80 pl-2.5">
                                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 font-medium">
                                        <span>Latency</span>
                                        <span className="text-slate-900 font-bold">
                                          {sub.avgLatencySec}s
                                        </span>
                                      </div>
                                      <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between font-medium">
                                        <span>Target: {sub.benchmarkLatencySec}s</span>
                                        {sub.avgLatencySec <= sub.benchmarkLatencySec ? (
                                          <span className="text-emerald-600 font-bold">Fast</span>
                                        ) : (
                                          <span className="text-amber-600 font-bold">Pacing Lag</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* KaTeX Key Formulas / Rules */}
                                  {sub.keyFormulas && sub.keyFormulas.length > 0 && (
                                    <div className="bg-slate-50/80 text-slate-800 p-2.5 rounded-xl border border-slate-200/70 text-[11px] font-mono overflow-x-auto">
                                      <div className="text-[9.5px] font-mono text-[#796AEF] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <span>Formula Reference</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {sub.keyFormulas
                                          .slice(0, 2)
                                          .map((formula, fIdx) => (
                                          <span
                                            key={fIdx}
                                            dangerouslySetInnerHTML={{
                                              __html: katex.renderToString(
                                                formula,
                                                { throwOnError: false },
                                              ),
                                            }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Socratic Prescription Tip */}
                                  <div className="text-[11px] text-slate-700 leading-relaxed bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/80 flex items-start gap-2 font-medium">
                                    <Sparkles className="w-3.5 h-3.5 text-[#796AEF] shrink-0 mt-0.5" />
                                    <p>
                                      <strong className="text-slate-900 font-bold">
                                        Coach Tip:
                                      </strong>{" "}
                                      {sub.prescriptionHint}
                                    </p>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setSelectedDrillSubtopic(sub)
                                      }
                                      className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                                    >
                                      <Search className="w-3.5 h-3.5 text-slate-500" />
                                      <span>Review ({sub.recentQuestions?.length || 0})</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onDiscussWithCherry) {
                                          onDiscussWithCherry({
                                            topic: sub.name,
                                            subject: sub.subject,
                                            conceptTested: sub.name,
                                            hint: sub.prescriptionHint,
                                            question: `Cherry Ma'am, please explain ${sub.name} step-by-step on the blackboard with a targeted problem to fix my calculation accuracy.`,
                                          });
                                        } else if (onEnterClassroom) {
                                          onEnterClassroom();
                                        }
                                      }}
                                      className="min-h-[44px] px-3 py-2 rounded-xl bg-[#796AEF] hover:bg-indigo-700 text-white text-[11px] font-bold tracking-wide font-mono transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                                    >
                                      <Zap className="w-3.5 h-3.5 text-white" />
                                      <span>Board Practice</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200/80 space-y-2">
                          <p className="text-xs text-slate-500 font-medium">
                            No sub-topics found matching your search or filters.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setMicroSubjectFilter("all");
                              setMicroMasteryFilter("all");
                              setMicroMistakeFilter("all");
                              setMicroSearchQuery("");
                            }}
                            className="text-[11px] font-mono font-bold text-[#796AEF] underline cursor-pointer"
                          >
                            Reset All Filters
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Question Drilldown Modal */}
                    {selectedDrillSubtopic && (
                      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in">
                        <div className="bg-white border border-slate-200/90 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-left">
                          {/* Modal Header */}
                          <div className="px-5 py-4 bg-white border-b border-slate-100 text-slate-900 flex items-center justify-between shrink-0">
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-50 text-[#796AEF] border border-indigo-100/90 px-2 py-0.5 rounded-md">
                                  {selectedDrillSubtopic.subject} • {selectedDrillSubtopic.chapter}
                                </span>
                                <span className="text-[11px] font-mono text-slate-500 font-medium">
                                  Mastery: <strong className="text-slate-900 font-bold">{selectedDrillSubtopic.masteryScore}%</strong>
                                </span>
                              </div>
                              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                                {selectedDrillSubtopic.name} • Diagnostics
                              </h3>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedDrillSubtopic(null)}
                              className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Modal Body */}
                          <div className="p-5 overflow-y-auto space-y-4 flex-1">
                            {/* Prescription Banner */}
                            <div className="bg-indigo-50/70 border border-indigo-100/90 rounded-2xl p-3.5 text-xs text-indigo-950 leading-relaxed flex items-start gap-2.5">
                              <Sparkles className="w-4 h-4 text-[#796AEF] shrink-0 mt-0.5" />
                              <div>
                                <strong className="font-bold">
                                  Socratic Strategy:
                                </strong>{" "}
                                {selectedDrillSubtopic.prescriptionHint}
                              </div>
                            </div>

                            {/* Question Logs */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                                Diagnostic Problem History ({selectedDrillSubtopic.recentQuestions?.length || 0})
                              </h4>

                              {selectedDrillSubtopic.recentQuestions?.map(
                                (q: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className={`p-3.5 rounded-2xl border space-y-2.5 ${
                                      q.isCorrect
                                        ? "bg-emerald-50/30 border-emerald-200/80"
                                        : "bg-rose-50/30 border-rose-200/80"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-[11px] font-mono font-bold text-slate-500">
                                        Problem #{idx + 1}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-mono text-slate-500">
                                          {q.latencySec}s
                                        </span>
                                        <span
                                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                                            q.isCorrect
                                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                              : "bg-rose-50 text-rose-700 border-rose-200"
                                          }`}
                                        >
                                          {q.isCorrect
                                            ? "Solved Correctly"
                                            : `${q.mistakeType || "Review"} Error`}
                                        </span>
                                      </div>
                                    </div>

                                    <p className="text-xs font-bold text-slate-900 leading-snug">
                                      {q.question}
                                    </p>

                                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 text-[11.5px] space-y-1.5 leading-relaxed">
                                      <div className="text-slate-600">
                                        <strong className="text-slate-800 font-bold">
                                          Your Submitted Step:
                                        </strong>{" "}
                                        {q.userAnswer}
                                      </div>
                                      <div className="text-emerald-900">
                                        <strong className="text-emerald-950 font-bold">
                                          Standard Derivation:
                                        </strong>{" "}
                                        {q.explanation}
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>

                          {/* Modal Footer */}
                          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                            <button
                              type="button"
                              onClick={() => setSelectedDrillSubtopic(null)}
                              className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                              Close Drilldown
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const sub = selectedDrillSubtopic;
                                setSelectedDrillSubtopic(null);
                                if (onDiscussWithCherry) {
                                  onDiscussWithCherry({
                                    topic: sub.name,
                                    subject: sub.subject,
                                    conceptTested: sub.name,
                                    hint: sub.prescriptionHint,
                                    question: `Cherry Ma'am, please explain ${sub.name} step-by-step on the blackboard with a targeted problem to fix my calculation accuracy.`,
                                  });
                                } else if (onEnterClassroom) {
                                  onEnterClassroom();
                                }
                              }}
                              className="px-4 py-2.5 rounded-xl bg-[#796AEF] hover:bg-indigo-700 text-white text-xs font-bold font-mono tracking-wide transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                            >
                              <Zap className="w-3.5 h-3.5 text-white" />
                              <span>Practice on Blackboard</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : performanceWorkspaceTab === "retention" ? (
                  /* PHASE 2: COGNITIVE RETENTION & EBBINGHAUS SPACED REPETITION VIEW */
                  <div className="space-y-4 sm:space-y-5 animate-fade-in text-left">
                    {/* Hero Header for Retention */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-slate-900 shadow-xs relative overflow-hidden space-y-4">
                      <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />

                      {/* Top Info Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 z-10 relative">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#796AEF] border border-indigo-100/90 text-[11px] font-bold shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#796AEF] animate-pulse" />
                              Spaced Repetition Engine
                            </span>
                            <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100/90 px-2 py-0.5 rounded-md border border-slate-200/70">
                              Algorithm: <strong className="text-slate-800">Ebbinghaus R = e^(-t/S)</strong>
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                            Memory Decay &amp; Spaced Repetition Radar
                          </h3>
                          <p className="text-xs text-slate-600 font-sans leading-relaxed max-w-2xl">
                            Scientifically schedules chalkboard flashcard reviews at Day 1, 3, 7, 14, and 30 intervals to reset memory decay back to 100%.
                          </p>
                        </div>
                      </div>

                      {/* 4 Summary Metrics - 2x2 Grid on Mobile, 4x1 on Desktop */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 z-10 relative pt-0.5">
                        <div className="bg-slate-50/90 border border-slate-200/70 rounded-xl p-2.5 sm:p-3 text-center transition-all hover:bg-white hover:shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            {isEnglish ? "Avg Retention" : "औसत याददाश्त • Memory"}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-slate-900 font-mono block my-0.5">
                            {retentionEngineData.avgRetention}%
                          </span>
                          <span className="text-[10.5px] text-slate-600 font-medium block">
                            {isEnglish ? "Across All Topics" : "समग्र विषयों की स्थिति"}
                          </span>
                        </div>

                        <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-2.5 sm:p-3 text-center transition-all hover:bg-rose-50 hover:shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                            {isEnglish ? "Due for Revision" : "आज रिवीज़न ज़रूरी • Due"}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-rose-700 font-mono block my-0.5">
                            {retentionEngineData.criticalCount}
                          </span>
                          <span className="text-[10.5px] text-rose-700 font-semibold block">
                            {isEnglish ? "<50% (High Decay Risk)" : "<50% (भूलने का जोखिम)"}
                          </span>
                        </div>

                        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 sm:p-3 text-center transition-all hover:bg-amber-50 hover:shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                            {isEnglish ? "Review Soon" : "जल्द दोहराएं • Soon"}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-amber-800 font-mono block my-0.5">
                            {retentionEngineData.warningCount}
                          </span>
                          <span className="text-[10.5px] text-amber-800 font-semibold block">
                            {isEnglish ? "50–72% (Moderate Retention)" : "50–72% (मध्यम स्तर)"}
                          </span>
                        </div>

                        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 sm:p-3 text-center transition-all hover:bg-emerald-50 hover:shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                            {isEnglish ? "Optimal Retention" : "पक्की याददाश्त • Optimal"}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-emerald-800 font-mono block my-0.5">
                            {retentionEngineData.stableCount}
                          </span>
                          <span className="text-[10.5px] text-emerald-800 font-semibold block">
                            {isEnglish ? "73%+ (Long-Term Retained)" : "73%+ (दीर्घकालिक सुरक्षित)"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 1: INTERACTIVE EBBINGHAUS RETENTION CURVE VISUALIZER */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5 text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-[#796AEF] border border-indigo-100/90 flex items-center justify-center shrink-0 text-xs shadow-2xs">
                              📈
                            </span>
                            <span>{isEnglish ? "The Science of Spaced Repetition • Ebbinghaus Forgetting Curve" : "The Science of Spaced Repetition • विस्मृति वक्र व वैज्ञानिक दोहराव"}</span>
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {isEnglish ? "Without spaced reviews, retention drops by up to 70% in 7 days. A timely 3-minute flashcard session resets recall back to 100%." : "बिना रिवीज़न 7 दिनों में 70% तक विस्मृति हो जाती है। समय पर 3-मिनट फ्लैशकार्ड रिवीज़न से याददाश्त 100% पर रीसेट हो जाती है।"}
                          </p>
                        </div>
                        <span className="text-[10.5px] font-mono font-bold text-[#796AEF] bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200/80 shrink-0 self-start sm:self-auto shadow-2xs">
                          🧠 Leitner Spacing Active
                        </span>
                      </div>

                      {/* SVG Interactive Forgetting Curve Comparison Graphic */}
                      <div className="bg-slate-50/90 border border-slate-200/70 rounded-xl p-3.5 sm:p-5 text-slate-900 relative overflow-hidden shadow-2xs">
                        <div className="flex flex-wrap items-center justify-between mb-3 text-xs font-mono gap-2">
                          <span className="text-rose-600 font-bold flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                            Single Lecture (Fast Decay)
                          </span>
                          <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                            Spaced Repetition (Reinforced Memory)
                          </span>
                        </div>

                        {/* Responsive SVG Chart */}
                        <div className="w-full h-44 sm:h-52 relative">
                          <svg
                            className="w-full h-full overflow-visible"
                            viewBox="0 0 500 160"
                            preserveAspectRatio="none"
                          >
                            {/* Grid Lines */}
                            <line
                              x1="40"
                              y1="20"
                              x2="480"
                              y2="20"
                              stroke="#E2E8F0"
                              strokeDasharray="3 3"
                              strokeWidth="0.8"
                            />
                            <line
                              x1="40"
                              y1="55"
                              x2="480"
                              y2="55"
                              stroke="#E2E8F0"
                              strokeDasharray="3 3"
                              strokeWidth="0.8"
                            />
                            <line
                              x1="40"
                              y1="90"
                              x2="480"
                              y2="90"
                              stroke="#E2E8F0"
                              strokeDasharray="3 3"
                              strokeWidth="0.8"
                            />
                            <line
                              x1="40"
                              y1="125"
                              x2="480"
                              y2="125"
                              stroke="#E2E8F0"
                              strokeDasharray="3 3"
                              strokeWidth="0.8"
                            />

                            {/* Y Axis Labels */}
                            <text
                              x="5"
                              y="24"
                              fill="#64748B"
                              fontSize="9.5"
                              fontFamily="monospace"
                            >
                              100%
                            </text>
                            <text
                              x="12"
                              y="59"
                              fill="#64748B"
                              fontSize="9.5"
                              fontFamily="monospace"
                            >
                              75%
                            </text>
                            <text
                              x="12"
                              y="94"
                              fill="#64748B"
                              fontSize="9.5"
                              fontFamily="monospace"
                            >
                              50%
                            </text>
                            <text
                              x="12"
                              y="129"
                              fill="#64748B"
                              fontSize="9.5"
                              fontFamily="monospace"
                            >
                              25%
                            </text>

                            {/* X Axis Labels */}
                            <text
                              x="40"
                              y="152"
                              fill="#64748B"
                              fontSize="9.5"
                              fontFamily="monospace"
                            >
                              Day 0
                            </text>
                            <text
                              x="110"
                              y="152"
                              fill="#64748B"
                              fontSize="9.5"
                              fontFamily="monospace"
                            >
                              Day 1
                            </text>
                            <text
                              x="190"
                              y="152"
                              fill="#64748B"
                              fontSize="9.5"
                              fontFamily="monospace"
                            >
                              Day 3
                            </text>
                            <text
                              x="270"
                              y="152"
                              fill="#64748B"
                              fontSize="9.5"
                              fontFamily="monospace"
                            >
                              Day 7
                            </text>
                            <text
                              x="360"
                              y="152"
                              fill="#64748B"
                              fontSize="9.5"
                              fontFamily="monospace"
                            >
                              Day 14
                            </text>
                            <text
                              x="450"
                              y="152"
                              fill="#64748B"
                              fontSize="9.5"
                              fontFamily="monospace"
                            >
                              Day 30
                            </text>

                            {/* Curve 1: Rapid Decay without review (Rose) */}
                            <path
                              d="M 40 20 Q 120 100 270 120 T 480 135"
                              fill="none"
                              stroke="#f43f5e"
                              strokeWidth="3"
                              strokeDasharray="4 2"
                            />

                            {/* Curve 2: Spaced Repetition (Reinforced Peaks - Emerald) */}
                            {/* Peak 1: Day 1 Review */}
                            <path
                              d="M 40 20 Q 80 50 110 65 L 110 20 Q 150 45 190 55 L 190 20 Q 230 35 270 42 L 270 20 Q 320 30 360 35 L 360 20 Q 420 25 480 28"
                              fill="none"
                              stroke="#10B981"
                              strokeWidth="3"
                            />

                            {/* Key Review Nodes with Pulsing Glow */}
                            <circle cx="110" cy="20" r="4" fill="#10B981" />
                            <circle cx="190" cy="20" r="4" fill="#10B981" />
                            <circle cx="270" cy="20" r="4" fill="#10B981" />
                            <circle cx="360" cy="20" r="4" fill="#10B981" />

                            {/* Annotations */}
                            <text
                              x="115"
                              y="14"
                              fill="#796AEF"
                              fontSize="9"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              1st Review
                            </text>
                            <text
                              x="195"
                              y="14"
                              fill="#796AEF"
                              fontSize="9"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              2nd
                            </text>
                            <text
                              x="275"
                              y="14"
                              fill="#796AEF"
                              fontSize="9"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              3rd
                            </text>
                            <text
                              x="365"
                              y="14"
                              fill="#796AEF"
                              fontSize="9"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              4th (Mastered)
                            </text>
                          </svg>
                        </div>

                        <div className="mt-3 text-[11px] text-slate-600 font-mono flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/70 pt-2.5">
                          <span className="flex items-center gap-1.5">
                            <span className="text-slate-400">💡</span> Current Retention:{" "}
                            <strong className="text-slate-900 font-bold">
                              {retentionEngineData.avgRetention}%
                            </strong>{" "}
                            Across All Subjects
                          </span>
                          <span className="text-[#796AEF] font-bold">
                            Recommended Review:{" "}
                            <strong className="underline decoration-[#796AEF]/40 underline-offset-2">
                              {retentionEngineData.criticalCount} Topics Due Today
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: TOPICS DECAY RADAR & REVISION SCHEDULER */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 text-left">
                      {/* Filter Bar with Mobile Carousel/Grid Mode Toggle */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-slate-200/80">
                        <div className="flex items-center justify-between w-full lg:w-auto">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-[#796AEF] border border-indigo-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                              <Hourglass className="w-3.5 h-3.5" />
                            </span>
                            <div>
                              <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                                Spaced Review Queue (
                                {retentionEngineData.items.length})
                              </h4>
                              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                                Reinforce key formulas &amp; definitions before memory fades
                              </span>
                            </div>
                          </div>

                          {/* View Mode Toggle */}
                          <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/80 shrink-0">
                            <button
                              type="button"
                              onClick={() => setRetentionViewMode("carousel")}
                              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                                retentionViewMode === "carousel"
                                  ? "bg-[#796AEF] text-white shadow-2xs font-bold"
                                  : "text-slate-500 hover:text-slate-800"
                              }`}
                              title="Horizontal Swipe Deck"
                            >
                              🎴 Deck
                            </button>
                            <button
                              type="button"
                              onClick={() => setRetentionViewMode("list")}
                              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                                retentionViewMode === "list"
                                  ? "bg-[#796AEF] text-white shadow-2xs font-bold"
                                  : "text-slate-500 hover:text-slate-800"
                              }`}
                              title="Grid List"
                            >
                              📋 Grid
                            </button>
                          </div>
                        </div>

                        {/* Subject Filter Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {[
                            "all",
                            "Mathematics",
                            "Physics",
                            "Chemistry",
                            "Biology",
                          ].map((subj) => (
                            <button
                              key={subj}
                              type="button"
                              onClick={() => setRetentionActiveSubject(subj)}
                              className={`px-3 py-1 rounded-xl text-[10.5px] font-mono font-bold transition-all cursor-pointer shrink-0 border ${
                                retentionActiveSubject === subj
                                  ? "bg-[#796AEF] text-white border-[#796AEF] shadow-2xs font-black"
                                  : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
                              }`}
                            >
                              {subj === "all" ? "🌐 All Subjects" : subj}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Urgency Filter Tabs */}
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          {
                            key: "all",
                            label: "All Topics",
                            count: retentionEngineData.allItems.length,
                          },
                          {
                            key: "critical",
                            label: "🔴 Due Today (<50%)",
                            count: retentionEngineData.criticalCount,
                          },
                          {
                            key: "warning",
                            label: "🟡 Review Soon (50-72%)",
                            count: retentionEngineData.warningCount,
                          },
                          {
                            key: "stable",
                            label: "🟢 Stable (73%+)",
                            count: retentionEngineData.stableCount,
                          },
                        ].map((tab) => (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() =>
                              setRetentionFilterUrgency(tab.key as any)
                            }
                            className={`px-3 py-1 rounded-xl text-[10.5px] font-mono font-bold transition-all cursor-pointer shrink-0 border ${
                              retentionFilterUrgency === tab.key
                                ? "bg-[#796AEF] text-white border-[#796AEF] shadow-2xs font-black"
                                : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-white"
                            }`}
                          >
                            <span>{tab.label}</span>
                            <span className="ml-1 text-[10px] opacity-90">
                              ({tab.count})
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Repetition Queue Cards (Swipe Deck vs Grid) */}
                      {retentionEngineData.items.length > 0 ? (
                        <>
                          {retentionViewMode === "carousel" && (
                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-semibold px-1 pb-0.5">
                              <span>
                                ← Swipe Repetition Cards ({retentionEngineData.items.length} topics) →
                              </span>
                              <span>Touch &amp; Drag</span>
                            </div>
                          )}
                          <div
                            className={
                              retentionViewMode === "carousel"
                                ? "flex overflow-x-auto gap-3.5 pb-3 pt-0.5 snap-x snap-mandatory scrollbar-thin"
                                : "grid grid-cols-1 md:grid-cols-2 gap-3.5"
                            }
                          >
                            {retentionEngineData.items.map((item) => {
                              const isCritical = item.urgency === "critical";
                              const isStable = item.urgency === "stable";

                              return (
                                <div
                                  key={item.id}
                                  className={`rounded-2xl border p-4 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden bg-white shadow-2xs hover:shadow-xs ${
                                    retentionViewMode === "carousel"
                                      ? "w-[85vw] sm:w-[360px] shrink-0 snap-center"
                                      : ""
                                  } ${
                                    isCritical
                                      ? "border-rose-200/90 hover:border-rose-300"
                                      : isStable
                                        ? "border-emerald-200/90 hover:border-emerald-300"
                                        : "border-amber-200/90 hover:border-amber-300"
                                  }`}
                                >
                                  {/* Header */}
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/70 shrink-0">
                                          {item.subject}
                                        </span>
                                        <span className="text-[10.5px] font-mono text-slate-500 font-bold truncate">
                                          • {item.chapter}
                                        </span>
                                      </div>

                                      {/* Urgency Badge */}
                                      <span
                                        className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md border shrink-0 ${
                                          isCritical
                                            ? "bg-rose-50 text-rose-700 border-rose-200"
                                            : isStable
                                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                              : "bg-amber-50 text-amber-700 border-amber-200"
                                        }`}
                                      >
                                        {item.urgencyLabel}
                                      </span>
                                    </div>

                                    <h5 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-snug">
                                      {item.topicName}
                                    </h5>
                                  </div>

                                  {/* Retention Meter & Spaced Intervals */}
                                  <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70 space-y-1.5">
                                    <div className="flex items-center justify-between text-[10.5px] font-mono">
                                      <span className="text-slate-500 font-bold">
                                        Estimated Retention:
                                      </span>
                                      <strong
                                        className={`font-black ${isCritical ? "text-rose-600" : isStable ? "text-emerald-700" : "text-amber-600"}`}
                                      >
                                        {item.currentRetention}%
                                      </strong>
                                    </div>

                                    <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all ${
                                          isCritical
                                            ? "bg-rose-500"
                                            : isStable
                                              ? "bg-emerald-500"
                                              : "bg-amber-500"
                                        }`}
                                        style={{
                                          width: `${item.currentRetention}%`,
                                        }}
                                      />
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200/60 font-medium">
                                      <span>
                                        Studied: <strong className="text-slate-700">{item.lastStudiedDaysAgo}d ago</strong>
                                      </span>
                                      <span>
                                        Repetition: <strong className="text-slate-700">{item.repetitionCount}/5</strong>
                                      </span>
                                      <span>
                                        Next: <strong className="text-slate-700">Day {item.nextReviewDays}</strong>
                                      </span>
                                    </div>
                                  </div>

                                  {/* KaTeX Formula preview if available */}
                                  {item.formulaKatex && (
                                    <div className="bg-amber-50/60 text-slate-800 p-2.5 rounded-xl border border-amber-200/60 text-[11px] font-mono overflow-x-auto shadow-2xs">
                                      <div className="text-[9px] font-mono text-amber-800 font-bold uppercase tracking-widest mb-0.5">
                                        ⚡ Core Formula Anchor
                                      </div>
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: renderKaTeXHtmlSafe(
                                            item.formulaKatex,
                                          ),
                                        }}
                                      />
                                    </div>
                                  )}

                                  {/* Key Points Checklist */}
                                  <div className="space-y-1 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60 text-[11px] text-slate-700">
                                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                                      📌 Core Memory Anchors
                                    </span>
                                    {item.keyPoints
                                      .slice(0, 2)
                                      .map((kp, kpIdx) => (
                                        <div
                                          key={kpIdx}
                                          className="flex items-start gap-1.5"
                                        >
                                          <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                                          <span className="leading-snug">{kp}</span>
                                        </div>
                                      ))}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/70">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveFlashcardFlipped(false);
                                        setSelectedRetentionFlashcard(item);
                                      }}
                                      className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50/80 text-slate-700 hover:text-[#796AEF] border border-slate-200/80 hover:border-indigo-200/80 text-[11px] font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                                    >
                                      <Brain className="w-3.5 h-3.5 text-indigo-500" />
                                      <span>{isEnglish ? "Flashcard" : "फ्लैशकार्ड"}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onDiscussWithCherry) {
                                          onDiscussWithCherry({
                                            topic: item.topicName,
                                            subject: item.subject,
                                            conceptTested: item.topicName,
                                            hint: item.flashcardAnswer,
                                            question: `Cherry Ma'am, please give me a quick 3-minute spaced-repetition memory booster on ${item.topicName} on the blackboard!`,
                                          });
                                        } else if (onEnterClassroom) {
                                          onEnterClassroom();
                                        }
                                      }}
                                      className="min-h-[44px] px-3 py-2 rounded-xl bg-[#796AEF] hover:bg-indigo-700 text-white text-[11px] font-bold tracking-wide font-mono transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                                    >
                                      <Sparkles className="w-3.5 h-3.5 text-white" />
                                      <span>{isEnglish ? "Start Revision 🚀" : "रिवीज़न शुरू 🚀"}</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <div className="p-8 text-center bg-slate-50/90 rounded-2xl border border-dashed border-slate-200/80 space-y-2">
                          <p className="text-xs text-slate-500 font-medium">
                            No review topics found for this filter.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setRetentionActiveSubject("all");
                              setRetentionFilterUrgency("all");
                            }}
                            className="text-[11px] font-mono font-bold text-[#796AEF] hover:underline cursor-pointer"
                          >
                            Reset Filters
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Interactive Chalkboard Flashcard Modal */}
                    {selectedRetentionFlashcard && (
                      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in">
                        <div className="bg-white border border-slate-200/80 rounded-2xl max-w-lg w-full flex flex-col shadow-2xl overflow-hidden text-left text-slate-900">
                          {/* Modal Header */}
                          <div className="px-5 py-4 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
                            <div className="space-y-0.5 min-w-0 pr-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-indigo-50 text-[#796AEF] border border-indigo-100/90 px-2 py-0.5 rounded-md shadow-2xs">
                                  {selectedRetentionFlashcard.subject} • Flashcard
                                </span>
                                <span className="text-[10.5px] font-mono text-slate-500">
                                  Retention:{" "}
                                  <strong className="text-slate-900 font-bold">
                                    {selectedRetentionFlashcard.currentRetention}%
                                  </strong>
                                </span>
                              </div>
                              <h3 className="text-sm font-black text-slate-900 truncate">
                                {selectedRetentionFlashcard.topicName}
                              </h3>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedRetentionFlashcard(null)
                              }
                              className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Flashcard Body */}
                          <div className="p-5 sm:p-6 flex flex-col items-center justify-center text-center space-y-3">
                            <div
                              onClick={() =>
                                setActiveFlashcardFlipped(
                                  !activeFlashcardFlipped,
                                )
                              }
                              className="w-full bg-slate-50/90 border border-slate-200/80 hover:border-[#796AEF]/60 rounded-2xl p-5 sm:p-6 transition-all cursor-pointer shadow-2xs space-y-3 relative group"
                            >
                              <div className="text-[10px] font-mono text-[#796AEF] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                                <RotateCw className="w-3 h-3 animate-spin-slow" />
                                <span>
                                  {activeFlashcardFlipped
                                    ? (isEnglish ? "Answer & Explanation (Tap)" : "उत्तर व व्याख्या • Answer (टैप करें)")
                                    : (isEnglish ? "Question Prompt (Tap to reveal solution)" : "प्रश्न / संकेत • Prompt (टैप करके समाधान देखें)")}
                                </span>
                              </div>

                              {!activeFlashcardFlipped ? (
                                <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed py-2">
                                  {selectedRetentionFlashcard.flashcardPrompt}
                                </p>
                              ) : (
                                <div className="space-y-3 animate-fade-in text-left py-1">
                                  <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                                    {selectedRetentionFlashcard.flashcardAnswer}
                                  </p>
                                  {selectedRetentionFlashcard.formulaKatex && (
                                    <div className="p-3 bg-white rounded-xl border border-indigo-100 text-center font-mono text-slate-900 shadow-2xs">
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: renderKaTeXHtmlSafe(
                                            selectedRetentionFlashcard.formulaKatex,
                                          ),
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="text-[10.5px] font-mono text-slate-500 pt-1 font-medium">
                                💡 Active recall strengthens neural retention 3x faster.
                              </div>
                            </div>
                          </div>

                          {/* Modal Footer */}
                          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedRetentionFlashcard(null)
                              }
                              className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                            >
                              {isEnglish ? "Close" : "बंद करें (Close)"}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const card = selectedRetentionFlashcard;
                                setSelectedRetentionFlashcard(null);
                                if (onDiscussWithCherry) {
                                  onDiscussWithCherry({
                                    topic: card.topicName,
                                    subject: card.subject,
                                    conceptTested: card.topicName,
                                    hint: card.flashcardAnswer,
                                    question: `Cherry Ma'am, please explain ${card.topicName} on the chalkboard with an intuitive example so I retain it long-term.`,
                                  });
                                } else if (onEnterClassroom) {
                                  onEnterClassroom();
                                }
                              }}
                              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#796AEF] hover:bg-indigo-700 text-white text-xs font-bold font-mono tracking-wide transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-white" />
                              <span>{isEnglish ? "Ask Ma'am on Blackboard 🚀" : "मैम से ब्लैकबोर्ड पर पूछें 🚀"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : performanceWorkspaceTab === "agility" ? (
                  /* PHASE 3: COGNITIVE AGILITY, SPEED-ACCURACY QUADRANT & PREDICTIVE EXAM READINESS VIEW */
                  <div className="space-y-4 sm:space-y-5 animate-fade-in text-left">
                    {/* Hero Header for Agility & Stamina */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-slate-900 shadow-xs relative overflow-hidden space-y-4">
                      <div className="absolute -top-10 -right-10 w-52 h-52 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />

                      {/* Top Info Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 z-10 relative">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#796AEF] border border-indigo-100/90 text-[11px] font-bold shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#796AEF] animate-pulse" />
                              Speed-Accuracy &amp; Stamina Engine
                            </span>
                            <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100/90 px-2 py-0.5 rounded-md border border-slate-200/70">
                              Cognitive Benchmark: <strong className="text-slate-800">&lt;45s Latency</strong>
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                            Socratic Agility, Fatigue Curve &amp; Exam Readiness
                          </h3>
                          <p className="text-xs text-slate-600 font-sans leading-relaxed max-w-2xl">
                            Surgically correlates response latency against conceptual precision to eliminate test anxiety, over-calculation, and cognitive fatigue.
                          </p>
                        </div>
                      </div>

                      {/* 4 Summary Metrics - 2x2 Grid on Mobile, 4x1 on Desktop */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 z-10 relative pt-0.5">
                        <div className="bg-slate-50/90 border border-slate-200/70 rounded-xl p-2.5 sm:p-3 text-center transition-all hover:bg-white hover:shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            {isEnglish ? "Mental Agility • Speed" : "मानसिक गति • Agility"}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-slate-900 font-mono block my-0.5">
                            {staminaAnalyticsData.agilityScore}/100
                          </span>
                          <span className="text-[10.5px] text-slate-600 font-medium block">
                            {isEnglish ? "Thought & Solution Speed" : "विचार व हल गति"}
                          </span>
                        </div>

                        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 sm:p-3 text-center transition-all hover:bg-emerald-50 hover:shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                            {isEnglish ? "Flow State • Flow (Q1)" : "फ़्लो स्टेट • Flow (Q1)"}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-emerald-800 font-mono block my-0.5">
                            {staminaAnalyticsData.flowCount}
                          </span>
                          <span className="text-[10.5px] text-emerald-800 font-semibold block">
                            {isEnglish ? "<45s & >75% Accuracy" : "<45s व >75% सटीकता"}
                          </span>
                        </div>

                        <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-2.5 sm:p-3 text-center transition-all hover:bg-sky-50 hover:shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block">
                            {isEnglish ? "Overthinking • Overthink (Q2)" : "अति-विचार • Overthink (Q2)"}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-sky-800 font-mono block my-0.5">
                            {staminaAnalyticsData.overthinkCount}
                          </span>
                          <span className="text-[10.5px] text-sky-800 font-semibold block">
                            {isEnglish ? "Slow but Correct" : "धीमा पर सही हल"}
                          </span>
                        </div>

                        <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-2.5 sm:p-3 text-center transition-all hover:bg-indigo-50 hover:shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#796AEF] block">
                            {isEnglish ? "Projected Score • Target" : "अनुमानित स्कोर • Projected"}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-[#796AEF] font-mono block my-0.5">
                            {staminaAnalyticsData.projectedRawScore}%
                          </span>
                          <span className="text-[10.5px] text-[#796AEF] font-semibold block">
                            {isEnglish
                              ? `±${staminaAnalyticsData.confidenceMargin}% Exam Margin`
                              : `±${staminaAnalyticsData.confidenceMargin}% परीक्षा दायरा`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 1: THE 4-QUADRANT SPEED VS ACCURACY COGNITIVE MATRIX */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5 text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-[#796AEF] border border-indigo-100/90 flex items-center justify-center shrink-0 text-xs shadow-2xs">
                              <Gauge className="w-3.5 h-3.5 text-[#796AEF]" />
                            </span>
                            <span>
                              {isEnglish
                                ? "Speed vs Accuracy Matrix • 4-Quadrant Diagnostics"
                                : "Speed vs Accuracy Matrix • गति व सटीकता 4-क्वाड्रेंट"}
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {isEnglish
                              ? "High accuracy paired with disciplined speed is essential for board and competitive exams. Identify where you hesitate or rush."
                              : "बोर्ड व प्रतियोगी परीक्षाओं में उच्च सटीकता के साथ उचित गति अनिवार्य है। पहचानें कि आप कहाँ संकोच करते हैं या जल्दबाज़ी।"}
                          </p>
                        </div>
                        <span className="text-[10.5px] font-mono font-bold text-[#796AEF] bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200/80 shrink-0 self-start sm:self-auto shadow-2xs">
                          {isEnglish ? "🎯 Target: 45s per Question" : "🎯 मानक: 45s प्रति प्रश्न"}
                        </span>
                      </div>

                      {/* Visual 4-Quadrant Layout - Horizontal Swipe Deck on Mobile */}
                      <div className="flex items-center justify-between md:hidden text-[11px] font-mono text-slate-500 font-semibold px-1 pb-1">
                        <span>{isEnglish ? "← Swipe 4 Quadrants →" : "← स्वाइप करें 4 क्वाड्रेंट →"}</span>
                        <span>{isEnglish ? "Tap to Filter" : "टैप करके फ़िल्टर करें"}</span>
                      </div>
                      <div className="flex md:grid md:grid-cols-2 overflow-x-auto md:overflow-visible gap-3.5 pt-1 pb-2 md:pb-0 snap-x snap-mandatory scrollbar-thin">
                        {/* Quadrant 1: Flow State */}
                        <div
                          onClick={() =>
                            setStaminaQuadrantFilter(
                              staminaQuadrantFilter === "flow" ? "all" : "flow",
                            )
                          }
                          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between w-[85vw] sm:w-[360px] md:w-auto shrink-0 md:shrink snap-center shadow-2xs min-h-[145px] ${
                            staminaQuadrantFilter === "flow"
                              ? "bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-400/40 shadow-sm"
                              : "bg-gradient-to-br from-emerald-50/30 via-white to-white hover:bg-emerald-50/60 border-emerald-200/80"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800 font-mono text-xs font-black">
                                  Q1
                                </span>
                                <div>
                                  <h5 className="text-xs font-black text-emerald-950 tracking-tight">
                                    {isEnglish ? "Flow State (Effortless & Confident)" : "Flow State (फ़्लो स्टेट • स्वतः स्फूर्त)"}
                                  </h5>
                                  <span className="text-[10.5px] font-mono text-emerald-800">
                                    {isEnglish ? "Fast (<45s) • High Accuracy (>75%)" : "तेज़ (<45s) • उच्च सटीकता (>75%)"}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10.5px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {staminaAnalyticsData.flowCount} Topics
                              </span>
                            </div>
                            <p className="text-[11.5px] text-zinc-600 leading-relaxed">
                              {isEnglish
                                ? "Concepts recalled effortlessly with zero hesitation. Solved naturally even under exam-room pressure."
                                : "कॉन्सेप्ट्स बिना किसी हिचकिचाहट के याद हैं। परीक्षा के दबाव में भी सहजता से हल होते हैं।"}
                            </p>
                          </div>
                          <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between text-[10.5px] font-mono font-bold text-emerald-800">
                            <span>
                              {isEnglish ? "✅ Strategy: Maintain with weekly spaced revision" : "✅ रणनीति: साप्ताहिक रिवीज़न से अभ्यास बनाए रखें"}
                            </span>
                            <span>
                              {staminaQuadrantFilter === "flow"
                                ? (isEnglish ? "Active Filter" : "सक्रिय फ़िल्टर")
                                : (isEnglish ? "Filter →" : "फ़िल्टर करें →")}
                            </span>
                          </div>
                        </div>

                        {/* Quadrant 2: Overthink / Deep Thinker */}
                        <div
                          onClick={() =>
                            setStaminaQuadrantFilter(
                              staminaQuadrantFilter === "overthink"
                                ? "all"
                                : "overthink",
                            )
                          }
                          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between w-[85vw] sm:w-[360px] md:w-auto shrink-0 md:shrink snap-center shadow-2xs min-h-[145px] ${
                            staminaQuadrantFilter === "overthink"
                              ? "bg-sky-50/90 border-sky-500 ring-2 ring-sky-400/40 shadow-sm"
                              : "bg-gradient-to-br from-sky-50/30 via-white to-white hover:bg-sky-50/60 border-sky-200/80"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="p-1 rounded-lg bg-sky-100 text-sky-800 font-mono text-xs font-black">
                                  Q2
                                </span>
                                <div>
                                  <h5 className="text-xs font-black text-sky-950 tracking-tight">
                                    {isEnglish ? "Over-Calculation (Hesitation & Overthinking)" : "Over-Calculation (अति-विचार व संकोच)"}
                                  </h5>
                                  <span className="text-[10.5px] font-mono text-sky-800">
                                    {isEnglish ? "Slow (>45s) • High Accuracy (>75%)" : "धीमा (>45s) • उच्च सटीकता (>75%)"}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10.5px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                                {staminaAnalyticsData.overthinkCount} Topics
                              </span>
                            </div>
                            <p className="text-[11.5px] text-zinc-600 leading-relaxed">
                              {isEnglish
                                ? "Concept is clear, but writing unnecessarily long derivation steps risks running out of time in the exam."
                                : "सिद्धांत आता है, लेकिन अनावश्यक लंबे स्टेप्स लिखने के कारण परीक्षा में समय समाप्त होने का जोखिम रहता है।"}
                            </p>
                          </div>
                          <div className="mt-3 pt-2.5 border-t border-sky-200/60 flex items-center justify-between text-[10.5px] font-mono font-bold text-sky-800">
                            <span>
                              {isEnglish ? "⚡ Solution: Practice shortcuts & direct formula recall" : "⚡ समाधान: शॉर्टकट ट्रिक्स व डायरेक्ट फॉर्मूला अभ्यास"}
                            </span>
                            <span>
                              {staminaQuadrantFilter === "overthink"
                                ? (isEnglish ? "Active Filter" : "सक्रिय फ़िल्टर")
                                : (isEnglish ? "Filter →" : "फ़िल्टर करें →")}
                            </span>
                          </div>
                        </div>

                        {/* Quadrant 3: Impulsive Rushing */}
                        <div
                          onClick={() =>
                            setStaminaQuadrantFilter(
                              staminaQuadrantFilter === "rushing"
                                ? "all"
                                : "rushing",
                            )
                          }
                          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between w-[85vw] sm:w-[360px] md:w-auto shrink-0 md:shrink snap-center shadow-2xs min-h-[145px] ${
                            staminaQuadrantFilter === "rushing"
                              ? "bg-amber-50/90 border-amber-500 ring-2 ring-amber-400/40 shadow-sm"
                              : "bg-gradient-to-br from-amber-50/30 via-white to-white hover:bg-amber-50/60 border-amber-200/80"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="p-1 rounded-lg bg-amber-100 text-amber-800 font-mono text-xs font-black">
                                  Q3
                                </span>
                                <div>
                                  <h5 className="text-xs font-black text-amber-950 tracking-tight">
                                    {isEnglish ? "Impulsive Rushing (Silly Mistakes under Speed)" : "Impulsive Rushing (जल्दबाज़ी में सिली मिस्टेक)"}
                                  </h5>
                                  <span className="text-[10.5px] font-mono text-amber-800">
                                    {isEnglish ? "Fast (<45s) • Low Accuracy (<75%)" : "तेज़ (<45s) • कम सटीकता (<75%)"}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10.5px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                {staminaAnalyticsData.rushingCount} Topics
                              </span>
                            </div>
                            <p className="text-[11.5px] text-zinc-600 leading-relaxed">
                              {isEnglish
                                ? "Picking wrong options in excitement without reading the full question or checking units and signs."
                                : "प्रश्न को पूरा पढ़े बिना या मात्रक/चिह्न की जांच किए बिना अति-उत्साह में गलत विकल्प चुन लेना।"}
                            </p>
                          </div>
                          <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-[10.5px] font-mono font-bold text-amber-800">
                            <span>
                              {isEnglish ? "🛑 Solution: 5-second pause & re-check rule" : "🛑 समाधान: 5-सेकंड ठहराव और प्रश्न री-चेक नियम"}
                            </span>
                            <span>
                              {staminaQuadrantFilter === "rushing"
                                ? (isEnglish ? "Active Filter" : "सक्रिय फ़िल्टर")
                                : (isEnglish ? "Filter →" : "फ़िल्टर करें →")}
                            </span>
                          </div>
                        </div>

                        {/* Quadrant 4: Cognitive Roadblock */}
                        <div
                          onClick={() =>
                            setStaminaQuadrantFilter(
                              staminaQuadrantFilter === "roadblock"
                                ? "all"
                                : "roadblock",
                            )
                          }
                          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between w-[85vw] sm:w-[360px] md:w-auto shrink-0 md:shrink snap-center shadow-2xs min-h-[145px] ${
                            staminaQuadrantFilter === "roadblock"
                              ? "bg-rose-50/90 border-rose-500 ring-2 ring-rose-400/40 shadow-sm"
                              : "bg-gradient-to-br from-rose-50/30 via-white to-white hover:bg-rose-50/60 border-rose-200/80"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="p-1 rounded-lg bg-rose-100 text-rose-800 font-mono text-xs font-black">
                                  Q4
                                </span>
                                <div>
                                  <h5 className="text-xs font-black text-rose-950 tracking-tight">
                                    {isEnglish ? "Cognitive Roadblock (Fundamental Gap)" : "Cognitive Roadblock (गंभीर रुकावट)"}
                                  </h5>
                                  <span className="text-[10.5px] font-mono text-rose-800">
                                    {isEnglish ? "Slow (>45s) • Low Accuracy (<75%)" : "धीमा (>45s) • कम सटीकता (<75%)"}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10.5px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                                {staminaAnalyticsData.roadblockCount} Topics
                              </span>
                            </div>
                            <p className="text-[11.5px] text-zinc-600 leading-relaxed">
                              {isEnglish
                                ? "Core theory is unclear, leading to high hesitation, confusion, and wrong derivations."
                                : "बुनियादी कॉन्सेप्ट स्पष्ट नहीं है जिससे प्रश्न शुरू करने में भी अत्यधिक समय व गलत उत्तर आते हैं।"}
                            </p>
                          </div>
                          <div className="mt-3 pt-2.5 border-t border-rose-200/60 flex items-center justify-between text-[10.5px] font-mono font-bold text-rose-800">
                            <span>
                              {isEnglish ? "💡 Solution: Master core theory with Cherry on blackboard" : "💡 समाधान: मैम के साथ ब्लैकबोर्ड पर मूल कॉन्सेप्ट समझें"}
                            </span>
                            <span>
                              {staminaQuadrantFilter === "roadblock"
                                ? (isEnglish ? "Active Filter" : "सक्रिय फ़िल्टर")
                                : (isEnglish ? "Filter →" : "फ़िल्टर करें →")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: SOCRATIC SESSION FATIGUE & EXAM PACING FORECAST */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 text-left">
                      {/* Sub-Card 1: Mental Fatigue Degradation Curve (2 Cols) */}
                      <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-[#796AEF] border border-indigo-100/90 flex items-center justify-center shrink-0 text-xs shadow-2xs">
                                <Activity className="w-3.5 h-3.5 text-[#796AEF]" />
                              </span>
                              <span>
                                {isEnglish
                                  ? "Session Stamina & Fatigue • Cognitive Curve"
                                  : "Session Stamina & Fatigue • अध्ययन सहनशक्ति व मानसिक थकान वक्र"}
                              </span>
                            </h4>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {isEnglish
                                ? "Progression of concentration & precision across a 45-minute study session"
                                : "45-मिनट अभ्यास सत्र में आपकी एकाग्रता व सटीकता में आने वाले बदलाव"}
                            </span>
                          </div>
                          <span className="text-[10.5px] font-mono font-bold text-[#796AEF] bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200/80 shrink-0 self-start sm:self-auto shadow-2xs">
                            {isEnglish ? "🧠 Peak Focus: 25 Minutes" : "🧠 सर्वश्रेष्ठ एकाग्रता: 25 मिनट"}
                          </span>
                        </div>

                        {/* Fatigue Timeline Cards - Horizontal Swipe Rail on Mobile */}
                        <div className="flex items-center justify-between sm:hidden text-[11px] font-mono text-slate-500 font-semibold pb-0.5">
                          <span>{isEnglish ? "← Swipe 45-Min Timeline →" : "← स्वाइप करें 45-मिनट टाइमलाइन →"}</span>
                          <span>{isEnglish ? "4 Phases" : "4 चरण"}</span>
                        </div>
                        <div className="flex sm:grid sm:grid-cols-2 overflow-x-auto sm:overflow-visible gap-3 pt-0.5 pb-2 sm:pb-0 snap-x snap-mandatory scrollbar-thin">
                          {staminaAnalyticsData.sessionFatigueCurve.map(
                            (phase, pIdx) => {
                              const isZoneOfGenius = pIdx === 1;
                              const isDip = pIdx === 3;

                              return (
                                <div
                                  key={pIdx}
                                  className={`p-3.5 rounded-xl border space-y-2 w-[76vw] sm:w-auto shrink-0 sm:shrink snap-center transition-all ${
                                    isZoneOfGenius
                                      ? "bg-emerald-50/70 border-emerald-300/90 shadow-2xs"
                                      : isDip
                                        ? "bg-rose-50/70 border-rose-300/90 shadow-2xs"
                                        : "bg-slate-50/90 border-slate-200/70"
                                  }`}
                                >
                                  <div className="flex items-center justify-between text-xs font-black">
                                    <span className="text-slate-900 font-bold">
                                      {phase.phase}
                                    </span>
                                    <span
                                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                                        isZoneOfGenius
                                          ? "bg-emerald-200/80 text-emerald-900 border border-emerald-300/70"
                                          : isDip
                                            ? "bg-rose-200/80 text-rose-900 border border-rose-300/70"
                                            : "bg-slate-200/80 text-slate-800 border border-slate-300/70"
                                      }`}
                                    >
                                      {phase.status}
                                    </span>
                                  </div>

                                  <div className="space-y-1 text-[11px] font-mono text-slate-600">
                                    <div className="flex items-center justify-between">
                                      <span>{isEnglish ? "Accuracy:" : "सटीकता (Accuracy):"}</span>
                                      <strong
                                        className={
                                          phase.accuracy >= 80
                                            ? "text-emerald-700 font-bold"
                                            : "text-rose-700 font-bold"
                                        }
                                      >
                                        {phase.accuracy}%
                                      </strong>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span>{isEnglish ? "Average Latency:" : "औसत गति (Latency):"}</span>
                                      <strong className="text-slate-800">
                                        {phase.latencySec}s {isEnglish ? "/ question" : "/ प्रश्न"}
                                      </strong>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span>{isEnglish ? "Cognitive Load:" : "मानसिक भार (Load):"}</span>
                                      <strong className="text-slate-800">
                                        {phase.cognitiveLoad}%
                                      </strong>
                                    </div>
                                  </div>

                                  <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all ${
                                        isZoneOfGenius
                                          ? "bg-emerald-500"
                                          : isDip
                                            ? "bg-rose-500"
                                            : "bg-indigo-500"
                                      }`}
                                      style={{ width: `${phase.accuracy}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>

                        <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 flex items-start gap-2.5 text-[11.5px] text-amber-900">
                          <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <p className="leading-relaxed">
                            <strong>{isEnglish ? "Cherry Ma'am's Advice:" : "परामर्श (Cherry Ma'am's Advice):"}</strong>{" "}
                            {isEnglish
                              ? "Take a quick 3-minute break after 25 minutes of continuous problem solving. This resets your working memory and prevents late-session silly mistakes."
                              : "लगातार 25 मिनट प्रश्न हल करने के बाद 3 मिनट का संक्षेप विश्राम लें। इससे वर्किंग मेमोरी रीसेट होती है और 40वें मिनट में होने वाली गलतियों से बचाव होता है।"}
                          </p>
                        </div>
                      </div>

                      {/* Sub-Card 2: Predictive Board Exam Target Projector (1 Col) */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 flex flex-col justify-between">
                        <div className="space-y-1 pb-3 border-b border-slate-200/80">
                          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-[#796AEF] border border-indigo-100/90 flex items-center justify-center shrink-0 text-xs shadow-2xs">
                              <Target className="w-3.5 h-3.5 text-[#796AEF]" />
                            </span>
                            <span>
                              {isEnglish
                                ? "Exam Target Projector • Score Forecast"
                                : "Exam Target Projector • परीक्षा स्कोर अनुमान"}
                            </span>
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {isEnglish
                              ? "Projection based on current speed and precision metrics"
                              : "वर्तमान गति व सटीकता के आधार पर प्रक्षेपण"}
                          </span>
                        </div>

                        {/* Projected Big Score Dial */}
                        <div className="bg-slate-50/90 p-4 sm:p-5 rounded-xl text-center text-slate-900 border border-slate-200/70 space-y-1.5 shadow-2xs">
                          <span className="text-[10px] uppercase tracking-widest text-[#796AEF] font-bold block">
                            {isEnglish
                              ? "Projected Exam Score • Projected Mastery"
                              : "अनुमानित परीक्षा स्कोर • Projected Mastery"}
                          </span>
                          <div className="text-3xl sm:text-4xl font-black text-[#796AEF] font-mono tracking-tight">
                            {staminaAnalyticsData.projectedRawScore}%
                          </div>
                          <span className="text-[11px] font-mono text-slate-600 block">
                            {isEnglish ? "Confidence Interval: " : "विश्वास दायरा: "}
                            <strong className="text-slate-900 font-bold">
                              {staminaAnalyticsData.projectedRawScore -
                                staminaAnalyticsData.confidenceMargin}
                              % –{" "}
                              {staminaAnalyticsData.projectedRawScore +
                                staminaAnalyticsData.confidenceMargin}
                              %
                            </strong>
                          </span>
                        </div>

                        {/* Time Allocation Breakdown */}
                        <div className="space-y-2 text-[11px] font-mono">
                          <span className="text-slate-600 font-bold uppercase tracking-wider text-[10px] block">
                            {isEnglish
                              ? "Optimal 3-Hour Board Paper Time Allocation:"
                              : "3-घंटे के बोर्ड पेपर का आदर्श समय विभाजन:"}
                          </span>
                          <div className="space-y-1 bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70">
                            <div className="flex items-center justify-between text-slate-700">
                              <span>{isEnglish ? "Section A (MCQ / Quick):" : "खण्ड अ (MCQ / त्वरित प्रश्न):"}</span>
                              <strong className="text-slate-900">{isEnglish ? "35 mins (1.5m / Q)" : "35 मिनट (1.5m / Q)"}</strong>
                            </div>
                            <div className="flex items-center justify-between text-slate-700">
                              <span>{isEnglish ? "Section B (Short Answer):" : "खण्ड ब (लघु उत्तरीय प्रश्न):"}</span>
                              <strong className="text-slate-900">{isEnglish ? "55 mins (3.5m / Q)" : "55 मिनट (3.5m / Q)"}</strong>
                            </div>
                            <div className="flex items-center justify-between text-slate-700">
                              <span>{isEnglish ? "Section C (Long Derivations):" : "खण्ड स (दीर्घ उत्तरीय प्रश्न):"}</span>
                              <strong className="text-slate-900">{isEnglish ? "60 mins (7.5m / Q)" : "60 मिनट (7.5m / Q)"}</strong>
                            </div>
                            <div className="flex items-center justify-between text-emerald-800 font-bold border-t border-slate-200/70 pt-1">
                              <span>{isEnglish ? "Review & Buffer (Safety Reserve):" : "पुनरीक्षण व जांच (Buffer Reserve):"}</span>
                              <strong>{isEnglish ? "30 mins (Buffer Safety)" : "30 मिनट (स्वर्णिम सुरक्षा)"}</strong>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (onDiscussWithCherry) {
                              onDiscussWithCherry({
                                topic:
                                  "Exam Time Management & Speed-Accuracy Optimization",
                                subject: subject || "Mathematics",
                                conceptTested: "Exam Pacing Strategy",
                                hint: "Learn 3-pass exam scanning: solve easy flow questions first, then overthink items, leaving roadblocks for last.",
                                question:
                                  "Cherry Ma'am, how should I manage my time and pacing during the final board exam to avoid silly mistakes and rushing?",
                              });
                            } else if (onEnterClassroom) {
                              onEnterClassroom();
                            }
                          }}
                          className="min-h-[44px] w-full py-2.5 px-3 rounded-xl bg-[#796AEF] hover:bg-indigo-700 text-white text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          <span>{isEnglish ? "Discuss Exam Strategy with Cherry 🚀" : "परीक्षा रणनीति मैम से समझें 🚀"}</span>
                        </button>
                      </div>
                    </div>

                    {/* SECTION 3: TOPICS AGILITY QUEUE & RAPID-FIRE SPEED DRILL SIMULATOR */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 text-left">
                      {/* Filter Bar with Mobile Carousel/Grid Mode Toggle */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-slate-200/80">
                        <div className="flex items-center justify-between w-full lg:w-auto">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-[#796AEF] border border-indigo-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                              <Zap className="w-3.5 h-3.5 text-[#796AEF]" />
                            </span>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                                {isEnglish
                                  ? `Agility Queue • Topic Speed Practice (${staminaAnalyticsData.topics.length})`
                                  : `Agility Queue • विषयवार गति व अभ्यास (${staminaAnalyticsData.topics.length})`}
                              </h4>
                              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                                {isEnglish
                                  ? "Learn shortcuts with a 45-second timer and turn hesitation into flow state"
                                  : "45-सेकंड टाइमर के साथ शॉर्टकट सीखें और संकोच को फ़्लो स्टेट में बदलें"}
                              </span>
                            </div>
                          </div>

                          {/* View Mode Toggle */}
                          <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/80 shrink-0">
                            <button
                              type="button"
                              onClick={() => setStaminaViewMode("carousel")}
                              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                                staminaViewMode === "carousel"
                                  ? "bg-[#796AEF] text-white shadow-2xs font-bold"
                                  : "text-slate-500 hover:text-slate-800"
                              }`}
                              title="Horizontal Swipe Deck"
                            >
                              🎴 Deck
                            </button>
                            <button
                              type="button"
                              onClick={() => setStaminaViewMode("list")}
                              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                                staminaViewMode === "list"
                                  ? "bg-[#796AEF] text-white shadow-2xs font-bold"
                                  : "text-slate-500 hover:text-slate-800"
                              }`}
                              title="Grid List"
                            >
                              📋 Grid
                            </button>
                          </div>
                        </div>

                        {/* Subject Filter Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {[
                            "all",
                            "Mathematics",
                            "Physics",
                            "Chemistry",
                            "Biology",
                          ].map((subj) => (
                            <button
                              key={subj}
                              type="button"
                              onClick={() => setStaminaActiveSubject(subj)}
                              className={`px-3 py-1.5 rounded-xl text-[10.5px] font-mono font-bold transition-all cursor-pointer shrink-0 border ${
                                staminaActiveSubject === subj
                                  ? "bg-[#796AEF] text-white border-[#796AEF] shadow-2xs font-bold"
                                  : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
                              }`}
                            >
                              {subj === "all" ? (isEnglish ? "🌐 All Subjects" : "🌐 सभी विषय") : subj}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quadrant Filter Tabs */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {[
                          {
                            key: "all",
                            label: isEnglish ? "All" : "सभी (All)",
                            count: staminaAnalyticsData.allTopics.length,
                          },
                          {
                            key: "flow",
                            label: "⚡ Flow (Q1)",
                            count: staminaAnalyticsData.flowCount,
                          },
                          {
                            key: "overthink",
                            label: "⏱️ Overthinking (Q2)",
                            count: staminaAnalyticsData.overthinkCount,
                          },
                          {
                            key: "rushing",
                            label: "⚠️ Rushing (Q3)",
                            count: staminaAnalyticsData.rushingCount,
                          },
                          {
                            key: "roadblock",
                            label: "🔴 Roadblocks (Q4)",
                            count: staminaAnalyticsData.roadblockCount,
                          },
                        ].map((tab) => (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() =>
                              setStaminaQuadrantFilter(tab.key as any)
                            }
                            className={`px-3 py-1.5 rounded-xl text-[10.5px] font-mono font-bold transition-all cursor-pointer shrink-0 border ${
                              staminaQuadrantFilter === tab.key
                                ? "bg-[#796AEF] text-white border-[#796AEF] shadow-2xs font-bold"
                                : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-white"
                            }`}
                          >
                            <span>{tab.label}</span>
                            <span className="ml-1 text-[10px] opacity-90">
                              ({tab.count})
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Topics Cards Grid (Swipe Deck vs Grid) */}
                      {staminaAnalyticsData.topics.length > 0 ? (
                        <>
                          {staminaViewMode === "carousel" && (
                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-semibold px-1 pb-0.5">
                              <span>
                                {isEnglish
                                  ? `← Swipe Practice Topics (${staminaAnalyticsData.topics.length} topics) →`
                                  : `← स्वाइप करें अभ्यास टॉपिक्स (${staminaAnalyticsData.topics.length} topics) →`}
                              </span>
                              <span>{isEnglish ? "Touch & Drag" : "टच व ड्रैग"}</span>
                            </div>
                          )}
                          <div
                            className={
                              staminaViewMode === "carousel"
                                ? "flex overflow-x-auto gap-3.5 pb-3 pt-0.5 snap-x snap-mandatory scrollbar-thin"
                                : "grid grid-cols-1 md:grid-cols-2 gap-3.5"
                            }
                          >
                            {staminaAnalyticsData.topics.map((item) => {
                              const isOverthink = item.quadrant === "overthink";
                              const isRushing = item.quadrant === "rushing";
                              const isRoadblock = item.quadrant === "roadblock";

                              return (
                                <div
                                  key={item.id}
                                  className={`rounded-2xl border p-4 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden bg-white shadow-2xs hover:shadow-xs ${
                                    staminaViewMode === "carousel"
                                      ? "w-[85vw] sm:w-[360px] shrink-0 snap-center"
                                      : ""
                                  } ${
                                    isRoadblock
                                      ? "border-rose-200/90 hover:border-rose-300"
                                      : isOverthink
                                        ? "border-sky-200/90 hover:border-sky-300"
                                        : isRushing
                                          ? "border-amber-200/90 hover:border-amber-300"
                                          : "border-emerald-200/90 hover:border-emerald-300"
                                  }`}
                                >
                                  {/* Header */}
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/70 shrink-0">
                                          {item.subject}
                                        </span>
                                        <span className="text-[10.5px] font-mono text-slate-500 font-bold truncate">
                                          • {item.chapter}
                                        </span>
                                      </div>

                                      {/* Quadrant Badge */}
                                      <span
                                        className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md border shrink-0 ${item.quadrantColor}`}
                                      >
                                        {item.quadrantBadge}
                                      </span>
                                    </div>

                                    <h5 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-snug">
                                      {item.topicName}
                                    </h5>
                                  </div>

                                  {/* Speed & Accuracy Benchmarks */}
                                  <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70 space-y-2">
                                    <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono">
                                      <div className="bg-white p-2 rounded-lg border border-slate-200/70 shadow-2xs">
                                        <span className="text-slate-500 block text-[10px] uppercase font-bold">
                                          {isEnglish ? "Your Speed:" : "आपकी गति:"}
                                        </span>
                                        <span className="text-xs font-black text-slate-900">
                                          {item.avgLatencySec}s
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-medium ml-1">
                                          ({isEnglish ? "Target" : "लक्ष्य"}: {item.benchmarkSec}s)
                                        </span>
                                      </div>
                                      <div className="bg-white p-2 rounded-lg border border-slate-200/70 shadow-2xs">
                                        <span className="text-slate-500 block text-[10px] uppercase font-bold">
                                          {isEnglish ? "Accuracy:" : "सटीकता:"}
                                        </span>
                                        <span
                                          className={`text-xs font-black ${item.accuracy >= 75 ? "text-emerald-700" : "text-rose-700"}`}
                                        >
                                          {item.accuracy}% Accuracy
                                        </span>
                                      </div>
                                    </div>

                                    <div className="text-[10.5px] font-mono text-slate-600 bg-white/80 p-2 rounded-lg border border-slate-200/60 leading-snug">
                                      <strong className="text-slate-900">
                                        {isEnglish ? "⚡ Speed Strategy:" : "⚡ गति रणनीति:"}
                                      </strong>{" "}
                                      {item.speedStrategy}
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/70">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedAgilityDrillTopic(item);
                                        setActiveSprintSeconds(45);
                                        setIsSprintRunning(false);
                                        setSprintStepIndex(0);
                                        setSprintScore(0);
                                      }}
                                      className="min-h-[44px] px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50/80 text-slate-700 hover:text-[#796AEF] border border-slate-200/80 hover:border-indigo-200/80 text-[11px] font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                                    >
                                      <Gauge className="w-3.5 h-3.5 text-indigo-500" />
                                      <span>{isEnglish ? "Start Drill" : "ड्रिल शुरू"}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onDiscussWithCherry) {
                                          onDiscussWithCherry({
                                            topic: item.topicName,
                                            subject: item.subject,
                                            conceptTested: item.topicName,
                                            hint: item.speedStrategy,
                                            question: `Cherry Ma'am, please show me the fastest intuitive shortcut and blackboard derivation for ${item.topicName} so I can solve it in under 30 seconds!`,
                                          });
                                        } else if (onEnterClassroom) {
                                          onEnterClassroom();
                                        }
                                      }}
                                      className="min-h-[44px] px-2.5 py-2 rounded-xl bg-[#796AEF] hover:bg-indigo-700 text-white text-[11px] font-bold tracking-wide font-mono transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                                    >
                                      <Zap className="w-3.5 h-3.5 text-white" />
                                      <span>{isEnglish ? "Learn Shortcut 🚀" : "शॉर्टकट सीखें 🚀"}</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <div className="p-8 text-center bg-slate-50/90 rounded-2xl border border-dashed border-slate-200/80 space-y-2">
                          <p className="text-xs text-slate-500 font-medium">
                            {isEnglish ? "No topics found for this quadrant." : "इस क्वाड्रेंट के लिए कोई टॉपिक नहीं मिला।"}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setStaminaActiveSubject("all");
                              setStaminaQuadrantFilter("all");
                            }}
                            className="text-[11px] font-mono font-bold text-[#796AEF] hover:underline cursor-pointer"
                          >
                            {isEnglish ? "Reset Filters" : "फ़िल्टर रीसेट करें"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Interactive Rapid-Fire Speed Drill Modal */}
                    {selectedAgilityDrillTopic && (
                      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in">
                        <div className="bg-white border border-slate-200/80 rounded-2xl max-w-lg w-full flex flex-col shadow-2xl overflow-hidden text-left text-slate-900">
                          {/* Modal Header */}
                          <div className="px-5 py-4 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
                            <div className="space-y-0.5 min-w-0 pr-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-50 text-[#796AEF] px-2 py-0.5 rounded-md border border-indigo-100/90 shadow-2xs">
                                  {selectedAgilityDrillTopic.subject} • {isEnglish ? "45s Speed Drill" : "45s स्पीड ड्रिल"}
                                </span>
                                <span className="text-[10.5px] font-mono text-emerald-800 font-bold">
                                  {isEnglish ? "Benchmark: " : "आदर्श समय: "}
                                  <strong>
                                    {selectedAgilityDrillTopic.benchmarkSec}s
                                  </strong>
                                </span>
                              </div>
                              <h3 className="text-sm font-bold text-slate-900 truncate">
                                {selectedAgilityDrillTopic.topicName}
                              </h3>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedAgilityDrillTopic(null)}
                              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Speed Drill Body */}
                          <div className="p-4 sm:p-6 space-y-4">
                            {/* Question Card */}
                            <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                              <div className="flex items-center justify-between text-xs font-mono text-[#796AEF]">
                                <span className="font-bold flex items-center gap-1.5">
                                  <Zap className="w-3.5 h-3.5 text-[#796AEF]" />{" "}
                                  {isEnglish ? "Rapid-Fire Question:" : "रैपिड-फ़ायर प्रश्न (Rapid Question):"}
                                </span>
                                <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  {isEnglish ? "Target: <30s" : "लक्ष्य: <30s"}
                                </span>
                              </div>

                              <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                                {selectedAgilityDrillTopic.rapidFireQuestion}
                              </p>

                              {/* Options Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                                {selectedAgilityDrillTopic.rapidFireOptions.map(
                                  (opt: string, optIdx: number) => {
                                    const isCorrect =
                                      optIdx ===
                                      selectedAgilityDrillTopic.correctOptionIndex;
                                    return (
                                      <button
                                        key={optIdx}
                                        type="button"
                                        onClick={() => {
                                          setSprintScore(isCorrect ? 100 : 0);
                                          setSprintStepIndex(1);
                                        }}
                                        className={`min-h-[44px] p-3 rounded-xl border text-xs font-mono font-bold text-left transition-all cursor-pointer ${
                                          sprintStepIndex > 0
                                            ? isCorrect
                                              ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-black shadow-2xs"
                                              : "bg-rose-50 border-rose-200 text-rose-700 opacity-60"
                                            : "bg-white hover:bg-slate-50 border-slate-200/80 text-slate-800 hover:border-[#796AEF]"
                                        }`}
                                      >
                                        <span className="text-[#796AEF] mr-2">
                                          {String.fromCharCode(65 + optIdx)}.
                                        </span>
                                        <span>{opt}</span>
                                      </button>
                                    );
                                  },
                                )}
                              </div>
                            </div>

                            {/* Solution & Speed Strategy Reveal if answered */}
                            {sprintStepIndex > 0 && (
                              <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 space-y-2 animate-fade-in text-[11.5px] font-mono shadow-2xs">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />{" "}
                                    {isEnglish ? "Correct Answer: Option " : "सही उत्तर: विकल्प "}
                                    {String.fromCharCode(
                                      65 +
                                        selectedAgilityDrillTopic.correctOptionIndex,
                                    )}
                                  </span>
                                  <span className="text-[#796AEF] font-bold">
                                    {isEnglish ? "Shortcut Verified ✓" : "शॉर्टकट सत्यापित ✓"}
                                  </span>
                                </div>
                                <p className="text-slate-700 text-xs font-sans leading-relaxed">
                                  {selectedAgilityDrillTopic.explanation}
                                </p>
                                <div className="text-[11px] text-slate-700 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/80 mt-1">
                                  💡 <strong>{isEnglish ? "Blackboard Shortcut (Trick):" : "ब्लैकबोर्ड शॉर्टकट (Shortcut Trick):"}</strong>{" "}
                                  {selectedAgilityDrillTopic.speedStrategy}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Modal Footer */}
                          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
                            <button
                              type="button"
                              onClick={() => setSelectedAgilityDrillTopic(null)}
                              className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                            >
                              {isEnglish ? "Close" : "बंद करें (Close)"}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const drill = selectedAgilityDrillTopic;
                                setSelectedAgilityDrillTopic(null);
                                if (onDiscussWithCherry) {
                                  onDiscussWithCherry({
                                    topic: drill.topicName,
                                    subject: drill.subject,
                                    conceptTested: drill.topicName,
                                    hint: drill.explanation,
                                    question: `Cherry Ma'am, let's do a fast 3-question speed sprint on ${drill.topicName} on the digital blackboard!`,
                                  });
                                } else if (onEnterClassroom) {
                                  onEnterClassroom();
                                }
                              }}
                              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#796AEF] hover:bg-indigo-700 text-white text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
                              <span>{isEnglish ? "Speed Sprint with Cherry 🚀" : "मैम के साथ स्पीड स्प्रिंट करें 🚀"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : /* PHASE 4: OFFICIAL CURRICULUM & BLINDSPOT RADAR */
                performanceWorkspaceTab === "curriculum" ? (
                  <CurriculumBlindspotTracker
                    studentName={studentName || "Student"}
                    studentGrade={typeof grade === "number" ? grade : (parseInt(String(grade).replace(/\D/g, ""), 10) || 10)}
                    pastSessions={pastSessions}
                    quizAttempts={quizAttempts}
                    snapshots={snapshots}
                    mediumOfLearning={mediumOfLearning}
                    isEnglish={isEnglish}
                    onDiscussWithCherry={onDiscussWithCherry}
                    onEnterClassroom={onEnterClassroom}
                  />
                ) : performanceWorkspaceTab === "prerequisites" ? (
                  /* PHASE 5: PREREQUISITE DEPENDENCY GAP FINDER & KNOWLEDGE GRAPH */
                  <PrerequisiteGapFinder
                    studentName={studentName || "Student"}
                    studentGrade={typeof grade === "number" ? grade : (parseInt(String(grade).replace(/\D/g, ""), 10) || 10)}
                    pastSessions={pastSessions}
                    quizAttempts={quizAttempts}
                    snapshots={snapshots}
                    mediumOfLearning={mediumOfLearning}
                    isEnglish={isEnglish}
                    onDiscussWithCherry={onDiscussWithCherry}
                    onEnterClassroom={onEnterClassroom}
                  />
                ) : (
                  /* PHASE 6: EXAM SPEED SPRINT & TIME-PACING SIMULATOR */
                  <ExamSpeedSprintSimulator
                    studentName={studentName || "Student"}
                    studentGrade={typeof grade === "number" ? grade : (parseInt(String(grade).replace(/\D/g, ""), 10) || 10)}
                    pastSessions={pastSessions}
                    quizAttempts={quizAttempts}
                    snapshots={snapshots}
                    mediumOfLearning={mediumOfLearning}
                    isEnglish={isEnglish}
                    onDiscussWithCherry={onDiscussWithCherry}
                    onEnterClassroom={onEnterClassroom}
                  />
                )}


                {/* Dashboard bottom educational advice summary */}
                <div className="bg-[#F6F7FB] border border-[#EFF1F5] p-4.5 rounded-2xl flex items-start gap-3.5 text-left text-slate-500 text-[11.5px] leading-relaxed">
                  <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-extrabold text-slate-900 block uppercase tracking-wider text-[10px]">
                      Why Cognitive Radar-Bento Hub?
                    </span>
                    <p>
                      According to educational psychometrics, learning progress
                      is multi-dimensional. Standard scores mask where a student
                      is stumbling (e.g. they might understand the core theory
                      but fail multi-step algebra calculation precision). By
                      breaking down your performance into{" "}
                      <strong className="text-slate-700">Concept Clarity</strong>
                      ,{" "}
                      <strong className="text-slate-700">
                        Theoretical core definitions
                      </strong>
                      , and{" "}
                      <strong className="text-slate-700">
                        Calculation precision
                      </strong>
                      , this board-book synchronizes with your active lectures
                      in real-time, giving you an edge of smart
                      spaced-repetition.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in text-left">
                {/* PHASE 1: UNIFIED HEADER, SEGMENTED SWITCHER & CONSOLIDATED TOOLBAR */}
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 rounded-2xl text-white shadow-xl border border-indigo-500/20 relative overflow-hidden flex flex-col gap-5">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Top Bar inside Hero */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/25 to-teal-500/15 border border-emerald-400/30 text-emerald-300 flex items-center justify-center text-2xl font-bold shrink-0 shadow-inner">
                        📖
                      </div>
                      <div className="text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-white truncate">
                            Classroom Books & Smart Handbooks
                          </h3>
                          <span className="text-[10.5px] font-mono font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full shadow-xs">
                            Live Sync
                          </span>
                        </div>
                        <p className="text-[11.5px] sm:text-xs text-slate-300 font-medium truncate mt-0.5">
                          Multi-page chalkboard lecture books, step-by-step
                          derivations & AI flashcard decks.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0 self-start sm:self-auto">
                      <span className="inline-flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider bg-black/40 text-indigo-200 px-3.5 py-1.5 rounded-xl border border-indigo-400/25 backdrop-blur-md shadow-inner">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>
                          {grade || "Class 10"} • {board || "CBSE"} •{" "}
                          {mediumOfLearning || "Hinglish"}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider bg-black/40 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-400/25 backdrop-blur-md shadow-inner">
                        <Layers className="w-3 h-3 text-emerald-400" />
                        <span>
                          {Object.keys(bookSubjectCounts).filter(
                            (k) => k !== "all" && bookSubjectCounts[k] > 0,
                          ).length || 1}{" "}
                          Subjects
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* UNIFIED 2-WAY VIEW SWITCHER (Clean, fully readable & non-truncated) */}
                  <div className="bg-black/40 p-2.5 rounded-2xl border border-indigo-500/25 relative z-10 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2.5 w-full">
                      {/* Button 1: Chapter Books */}
                      <button
                        type="button"
                        onClick={() => setBookHubActiveTab("books")}
                        className={`p-3 sm:p-3.5 rounded-xl transition-all flex flex-col justify-between text-left cursor-pointer border ${
                          bookHubActiveTab === "books"
                            ? "bg-white text-slate-900 border-white shadow-lg ring-2 ring-emerald-400/40"
                            : "bg-white/5 hover:bg-white/10 border-white/10 text-indigo-200"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              bookHubActiveTab === "books"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-white/10 text-emerald-400"
                            }`}
                          >
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-black ${
                              bookHubActiveTab === "books"
                                ? "bg-[#EEF2FF] text-[#796AEF] border border-[#796AEF]/30"
                                : "bg-white/15 text-white"
                            }`}
                          >
                            {allBooks.length} {allBooks.length === 1 ? "Book" : "Books"}
                          </span>
                        </div>

                        <div className="w-full">
                          <div
                            className={`text-xs sm:text-sm font-black tracking-tight leading-tight ${
                              bookHubActiveTab === "books"
                                ? "text-slate-900"
                                : "text-white"
                            }`}
                          >
                            Chapter Books
                          </div>
                          <div
                            className={`text-[11px] sm:text-[12px] leading-snug mt-1 ${
                              bookHubActiveTab === "books"
                                ? "text-slate-600 font-medium"
                                : "text-indigo-200/80"
                            }`}
                          >
                            Lecture Notes & AI Decks
                          </div>
                        </div>
                      </button>

                      {/* Button 2: Board Slates */}
                      <button
                        type="button"
                        onClick={() => setBookHubActiveTab("slates")}
                        className={`p-3 sm:p-3.5 rounded-xl transition-all flex flex-col justify-between text-left cursor-pointer border ${
                          bookHubActiveTab === "slates"
                            ? "bg-white text-slate-900 border-white shadow-lg ring-2 ring-indigo-400/40"
                            : "bg-white/5 hover:bg-white/10 border-white/10 text-indigo-200"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              bookHubActiveTab === "slates"
                                ? "bg-indigo-50 text-indigo-700"
                                : "bg-white/10 text-indigo-400"
                            }`}
                          >
                            <Camera className="w-4 h-4" />
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-black ${
                              bookHubActiveTab === "slates"
                                ? "bg-[#EEF2FF] text-[#796AEF] border border-[#796AEF]/30"
                                : "bg-white/15 text-white"
                            }`}
                          >
                            {allSnapshots.length} {allSnapshots.length === 1 ? "Slate" : "Slates"}
                          </span>
                        </div>

                        <div className="w-full">
                          <div
                            className={`text-xs sm:text-sm font-black tracking-tight leading-tight ${
                              bookHubActiveTab === "slates"
                                ? "text-slate-900"
                                : "text-white"
                            }`}
                          >
                            Board Slates
                          </div>
                          <div
                            className={`text-[11px] sm:text-[12px] leading-snug mt-1 ${
                              bookHubActiveTab === "slates"
                                ? "text-slate-600 font-medium"
                                : "text-indigo-200/80"
                            }`}
                          >
                            Chalkboard Photo Slides
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11.5px] font-mono text-indigo-200/90 px-1 pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          {bookHubActiveTab === "books"
                            ? "Active: Chapter Books — Complete interactive lecture handbooks"
                            : "Active: Board Slates — High-resolution chalkboard photos & formula captures"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UNIFIED FLOATING SEARCH & FILTER TOOLBAR */}
                <div className="bg-white border border-[#EFF1F5]/80 rounded-2xl p-3 shadow-xs space-y-3">
                  {/* Top Row: Search Input + View Controls */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
                      <input
                        ref={bookSearchInputRef}
                        type="text"
                        value={
                          bookHubActiveTab === "books"
                            ? archiveSearchQuery
                            : snapshotSearchQuery
                        }
                        onChange={(e) => {
                          if (bookHubActiveTab === "books") {
                            setArchiveSearchQuery(e.target.value);
                            setCurrentBookHorizontalIndex(0);
                          } else {
                            setSnapshotSearchQuery(e.target.value);
                            setCurrentSnapshotHorizontalIndex(0);
                          }
                        }}
                        placeholder={
                          bookHubActiveTab === "books"
                            ? "Search chapter books, topics, or formulas... (Press / to search)"
                            : "Search blackboard slides by topic, formula, or concept... (Press / to search)"
                        }
                        className="w-full pl-10 pr-20 py-2.5 bg-[#F6F7FB] hover:bg-zinc-100/80 focus:bg-white border border-[#EFF1F5] focus:border-[#796AEF] text-slate-800 placeholder:text-slate-400 rounded-xl text-xs font-mono transition-all focus:outline-none focus:ring-1 focus:ring-[#796AEF]"
                      />
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        {(
                          bookHubActiveTab === "books"
                            ? archiveSearchQuery
                            : snapshotSearchQuery
                        ) ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (bookHubActiveTab === "books") {
                                setArchiveSearchQuery("");
                                setCurrentBookHorizontalIndex(0);
                              } else {
                                setSnapshotSearchQuery("");
                                setCurrentSnapshotHorizontalIndex(0);
                              }
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 text-xs transition-colors cursor-pointer"
                            title="Clear search"
                          >
                            ✕
                          </button>
                        ) : (
                          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-zinc-200/60 border border-zinc-300 rounded-md">
                            /
                          </kbd>
                        )}
                      </div>
                    </div>

                    {/* Controls Dock: Sort + View Mode + Stepper + Export */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-between md:justify-end">
                      {bookHubActiveTab === "books" ? (
                        <>
                          {/* Sort Dropdown */}
                          <div className="flex items-center gap-1 bg-[#F6F7FB] px-2.5 py-1.5 rounded-xl border border-[#EFF1F5] text-xs font-mono">
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                            <select
                              value={bookSortOrder}
                              onChange={(e) =>
                                setBookSortOrder(e.target.value as any)
                              }
                              className="text-xs font-bold text-slate-700 bg-transparent border-none focus:outline-none cursor-pointer"
                            >
                              <option value="newest">Newest First</option>
                              <option value="oldest">Oldest First</option>
                              <option value="title">By Title</option>
                              <option value="topics">Most Topics</option>
                            </select>
                          </div>

                          {/* View Switcher: Grid vs Carousel */}
                          <div className="inline-flex p-1 bg-zinc-100 rounded-xl border border-[#EFF1F5]/80">
                            <button
                              type="button"
                              onClick={() => setBooksViewMode("grid")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                booksViewMode === "grid"
                                  ? "bg-white text-slate-900 shadow-xs font-black border border-[#EFF1F5]/60"
                                  : "text-zinc-600 hover:text-slate-900"
                              }`}
                              title="Grid View"
                            >
                              <Grid className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Grid</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setBooksViewMode("carousel")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                booksViewMode === "carousel"
                                  ? "bg-white text-slate-900 shadow-xs font-black border border-[#EFF1F5]/60"
                                  : "text-zinc-600 hover:text-slate-900"
                              }`}
                              title="Carousel View"
                            >
                              <Film className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Carousel</span>
                            </button>
                          </div>

                          {/* Stepper for Books Carousel */}
                          {booksViewMode === "carousel" &&
                            filteredBooks.length > 0 && (
                              <div className="flex items-center gap-1.5 bg-[#F6F7FB] px-2.5 py-1 rounded-xl border border-[#EFF1F5]">
                                <span className="text-[11px] font-mono font-black text-slate-900">
                                  {Math.min(
                                    currentBookHorizontalIndex + 1,
                                    filteredBooks.length,
                                  )}
                                  /{filteredBooks.length}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleBooksHorizontalScroll("prev")
                                  }
                                  disabled={currentBookHorizontalIndex === 0}
                                  className="p-1 rounded-lg hover:bg-zinc-200 text-slate-700 disabled:opacity-30 cursor-pointer"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleBooksHorizontalScroll("next")
                                  }
                                  disabled={
                                    currentBookHorizontalIndex >=
                                    filteredBooks.length - 1
                                  }
                                  className="p-1 rounded-lg hover:bg-zinc-200 text-slate-700 disabled:opacity-30 cursor-pointer"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                        </>
                      ) : (
                        <>
                          {/* Export Album Button for Slates */}
                          <button
                            type="button"
                            onClick={handleBatchExportSnapshotsMarkdown}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EEF2FF] hover:bg-indigo-100 border border-[#796AEF]/30 text-[#1E293B] text-xs font-mono font-bold transition-all cursor-pointer shadow-2xs"
                            title="Export all blackboard derivations into a consolidated Markdown revision album"
                          >
                            <Download className="w-3.5 h-3.5 text-[#796AEF]" />
                            <span>Export Album</span>
                          </button>

                          {/* View Switcher: Grid vs Carousel */}
                          <div className="inline-flex p-1 bg-zinc-100 rounded-xl border border-[#EFF1F5]/80">
                            <button
                              type="button"
                              onClick={() => setSnapshotsViewMode("grid")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                snapshotsViewMode === "grid"
                                  ? "bg-white text-slate-900 shadow-xs font-black border border-[#EFF1F5]/60"
                                  : "text-zinc-600 hover:text-slate-900"
                              }`}
                              title="Grid View"
                            >
                              <Grid className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Grid</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSnapshotsViewMode("carousel")}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                snapshotsViewMode === "carousel"
                                  ? "bg-white text-slate-900 shadow-xs font-black border border-[#EFF1F5]/60"
                                  : "text-zinc-600 hover:text-slate-900"
                              }`}
                              title="Carousel View"
                            >
                              <Film className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Carousel</span>
                            </button>
                          </div>

                          {/* Stepper for Slates Carousel */}
                          {snapshotsViewMode === "carousel" &&
                            filteredSnapshots.length > 1 && (
                              <div className="flex items-center gap-1.5 bg-[#F6F7FB] px-2.5 py-1 rounded-xl border border-[#EFF1F5]">
                                <span className="text-[11px] font-mono font-black text-slate-900">
                                  {currentSnapshotHorizontalIndex + 1}/
                                  {filteredSnapshots.length}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSnapshotHorizontalScroll("prev")
                                  }
                                  disabled={
                                    currentSnapshotHorizontalIndex === 0
                                  }
                                  className="p-1 rounded-lg hover:bg-zinc-200 text-slate-700 disabled:opacity-30 cursor-pointer"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSnapshotHorizontalScroll("next")
                                  }
                                  disabled={
                                    currentSnapshotHorizontalIndex >=
                                    filteredSnapshots.length - 1
                                  }
                                  className="p-1 rounded-lg hover:bg-zinc-200 text-slate-700 disabled:opacity-30 cursor-pointer"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bottom Row: Subject Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-[#EFF1F5] pt-2">
                    {bookHubActiveTab === "books" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedBookSubjectFilter("all")}
                          className={`px-3 py-1.5 rounded-xl font-mono text-[11.5px] font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                            selectedBookSubjectFilter === "all"
                              ? "bg-[#796AEF] text-white border-[#796AEF] shadow-xs font-black"
                              : "bg-[#F6F7FB] hover:bg-zinc-100 text-zinc-600 border-[#EFF1F5]"
                          }`}
                        >
                          <span>📚</span>
                          <span>All Books</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                              selectedBookSubjectFilter === "all"
                                ? "bg-white/20 text-white font-bold"
                                : "bg-zinc-200/60 text-zinc-600"
                            }`}
                          >
                            {allBooks.length}
                          </span>
                        </button>

                        {/* Starred Books Pill */}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedBookSubjectFilter(
                              selectedBookSubjectFilter === "starred"
                                ? "all"
                                : "starred",
                            )
                          }
                          className={`px-3 py-1.5 rounded-xl font-mono text-[11.5px] font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                            selectedBookSubjectFilter === "starred"
                              ? "bg-amber-500 text-white border-amber-500 shadow-xs font-black"
                              : "bg-[#F6F7FB] hover:bg-zinc-100 text-zinc-600 border-[#EFF1F5]"
                          }`}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${selectedBookSubjectFilter === "starred" ? "fill-white text-white" : "text-amber-500"}`}
                          />
                          <span>Starred</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                              selectedBookSubjectFilter === "starred"
                                ? "bg-white/20 text-white"
                                : "bg-zinc-200/60 text-zinc-600"
                            }`}
                          >
                            {
                              Object.values(starredBookIds).filter(Boolean)
                                .length
                            }
                          </span>
                        </button>

                        {[
                          {
                            key: "Mathematics",
                            label: "Math",
                            icon: "📐",
                            count: bookSubjectCounts.Mathematics || 0,
                          },
                          {
                            key: "Physics",
                            label: "Physics",
                            icon: "⚡",
                            count: bookSubjectCounts.Physics || 0,
                          },
                          {
                            key: "Chemistry",
                            label: "Chemistry",
                            icon: "🧪",
                            count: bookSubjectCounts.Chemistry || 0,
                          },
                          {
                            key: "Biology",
                            label: "Biology",
                            icon: "🌱",
                            count: bookSubjectCounts.Biology || 0,
                          },
                          {
                            key: "Science",
                            label: "Science",
                            icon: "🔬",
                            count: bookSubjectCounts.Science || 0,
                          },
                        ]
                          .filter(
                            (s) =>
                              s.count > 0 ||
                              s.key.toLowerCase() ===
                                (subject || "").toLowerCase(),
                          )
                          .map((subj) => {
                            const isSelected =
                              selectedBookSubjectFilter.toLowerCase() ===
                              subj.key.toLowerCase();
                            return (
                              <button
                                key={subj.key}
                                type="button"
                                onClick={() =>
                                  setSelectedBookSubjectFilter(subj.key)
                                }
                                className={`px-3 py-1.5 rounded-xl font-mono text-[11.5px] font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                                  isSelected
                                    ? "bg-[#796AEF] text-white border-[#796AEF] shadow-xs font-black"
                                    : "bg-[#F6F7FB] hover:bg-zinc-100 text-zinc-600 border-[#EFF1F5]"
                                }`}
                              >
                                <span>{subj.icon}</span>
                                <span>{subj.label}</span>
                                <span
                                  className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                                    isSelected
                                      ? "bg-white/20 text-white font-bold"
                                      : "bg-zinc-200/60 text-zinc-600"
                                  }`}
                                >
                                  {subj.count}
                                </span>
                              </button>
                            );
                          })}
                      </>
                    ) : (
                      <>
                        {[
                          {
                            key: "all",
                            label: "All Slates",
                            icon: "📸",
                            count: snapshotSubjectCounts.all || 0,
                          },
                          {
                            key: "Mathematics",
                            label: "Math",
                            icon: "📐",
                            count: snapshotSubjectCounts.Mathematics || 0,
                          },
                          {
                            key: "Physics",
                            label: "Physics",
                            icon: "⚡",
                            count: snapshotSubjectCounts.Physics || 0,
                          },
                          {
                            key: "Chemistry",
                            label: "Chemistry",
                            icon: "🧪",
                            count: snapshotSubjectCounts.Chemistry || 0,
                          },
                          {
                            key: "Biology",
                            label: "Biology",
                            icon: "🌱",
                            count: snapshotSubjectCounts.Biology || 0,
                          },
                          {
                            key: "Science",
                            label: "Science",
                            icon: "🔬",
                            count: snapshotSubjectCounts.Science || 0,
                          },
                          {
                            key: "General",
                            label: "General",
                            icon: "📖",
                            count: snapshotSubjectCounts.General || 0,
                          },
                        ]
                          .filter(
                            (tab) =>
                              tab.key === "all" ||
                              tab.count > 0 ||
                              tab.key.toLowerCase() ===
                                (subject || "").toLowerCase(),
                          )
                          .map((tab) => {
                            const isSelected =
                              selectedSnapshotSubjectFilter.toLowerCase() ===
                              tab.key.toLowerCase();
                            return (
                              <button
                                key={tab.key}
                                type="button"
                                onClick={() =>
                                  setSelectedSnapshotSubjectFilter(tab.key)
                                }
                                className={`px-3 py-1.5 rounded-xl font-mono text-[11.5px] font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                                  isSelected
                                    ? "bg-[#796AEF] text-white border-[#796AEF] shadow-xs font-black"
                                    : "bg-[#F6F7FB] hover:bg-zinc-100 text-zinc-600 border-[#EFF1F5]"
                                }`}
                              >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                                <span
                                  className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                                    isSelected
                                      ? "bg-white/20 text-white font-bold"
                                      : "bg-zinc-200/60 text-zinc-600"
                                  }`}
                                >
                                  {tab.count}
                                </span>
                              </button>
                            );
                          })}
                      </>
                    )}

                    {/* Reset Filters Quick Button */}
                    {((bookHubActiveTab === "books" &&
                      (selectedBookSubjectFilter !== "all" ||
                        archiveSearchQuery)) ||
                      (bookHubActiveTab === "slates" &&
                        (selectedSnapshotSubjectFilter !== "all" ||
                          snapshotSearchQuery))) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (bookHubActiveTab === "books") {
                            setSelectedBookSubjectFilter("all");
                            setArchiveSearchQuery("");
                          } else {
                            setSelectedSnapshotSubjectFilter("all");
                            setSnapshotSearchQuery("");
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-xl font-mono text-[11px] text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all shrink-0 cursor-pointer ml-auto"
                      >
                        ✕ Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                                                                {/* ACTIVE VIEWPORT: CHAPTER BOOKS VS BOARD SLATES */}
                {bookHubActiveTab === "books" ? (
                  <div className="space-y-4 animate-fade-in pb-12">
                    {allBooks && allBooks.length > 0 ? (
                      filteredBooks.length === 0 ? (
                        <div className="border border-dashed border-[#EFF1F5] rounded-2xl p-10 bg-[#F6F7FB]/60 text-center select-none space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#796AEF] border border-[#796AEF]/30 flex items-center justify-center text-xl mx-auto shadow-2xs">
                            📚
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-black text-slate-700">
                              No matching lecture books found
                            </p>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                              {archiveSearchQuery
                                ? `No chapter books matched "${archiveSearchQuery}". Try clearing search or selecting a different subject filter.`
                                : "Try selecting a different subject tab to explore available board books."}
                            </p>
                          </div>
                          {(archiveSearchQuery || selectedBookSubjectFilter !== "all") && (
                            <button
                              type="button"
                              onClick={() => {
                                setArchiveSearchQuery("");
                                setSelectedBookSubjectFilter("all");
                              }}
                              className="mt-2 px-4 py-2 bg-[#796AEF] hover:bg-[#6857e8] text-white rounded-xl text-xs font-bold font-mono transition-all cursor-pointer shadow-xs"
                            >
                              Reset All Filters & Show All Books
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredBooks.map((book: any, idx: number) => {
                            const isStarred = !!starredBookIds[book.sessionId];
                            const theme = getSubjectBookTheme(book.inferredSubject || book.subject || subject);
                            const chaptersCount = book.topics?.length || 1;
                            const bookTitle = book.activeDocumentName || book.title || "Lecture Handbook";
                            return (
                              <div
                                key={book.sessionId || idx}
                                className="bg-white border border-[#EFF1F5]/90 rounded-2xl p-4.5 hover:shadow-md transition-all flex flex-col justify-between group relative space-y-3"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-xl bg-[#EEF2FF] border border-[#796AEF]/20 flex items-center justify-center text-base shrink-0">
                                      {theme.icon || "📘"}
                                    </span>
                                    <div className="min-w-0">
                                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#796AEF] bg-[#EEF2FF] px-2 py-0.5 rounded-md border border-[#796AEF]/20 inline-block truncate max-w-[140px]">
                                        {theme.name || book.subject || subject}
                                      </span>
                                      <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                                        {chaptersCount} {chaptersCount === 1 ? "Chapter" : "Chapters"}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => toggleStarBook(book.sessionId, e)}
                                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                      isStarred
                                        ? "text-amber-500 bg-amber-50"
                                        : "text-slate-300 hover:text-slate-500 hover:bg-[#F6F7FB]"
                                    }`}
                                    title={isStarred ? "Unstar book" : "Star book"}
                                  >
                                    <Star
                                      className={`w-4 h-4 ${
                                        isStarred ? "fill-amber-400 text-amber-500" : ""
                                      }`}
                                    />
                                  </button>
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#796AEF] transition-colors">
                                    {bookTitle}
                                  </h4>
                                </div>
                                <div className="pt-2 border-t border-[#EFF1F5] flex items-center justify-between gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedBookForReader(book)}
                                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#796AEF] hover:bg-[#6857e8] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                                  >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span>Read Book</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleTriggerBookPodcast(book)}
                                    disabled={generatingPodcastBookId === (book.sessionId || book.id || `book_${book.index || 0}`)}
                                    className="py-1.5 px-2 rounded-xl border border-[#796AEF]/30 bg-[#EEF2FF] text-[#796AEF] hover:bg-[#796AEF] hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
                                    title="Listen to 2-Host Audio Podcast Recap"
                                  >
                                    {generatingPodcastBookId === (book.sessionId || book.id || `book_${book.index || 0}`) ? (
                                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Headphones className="w-3.5 h-3.5" />
                                    )}
                                    <span className="hidden sm:inline">Podcast</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleExportSessionToPDF(book)}
                                    className="p-1.5 rounded-xl border border-[#EFF1F5] text-slate-600 hover:text-[#796AEF] hover:border-[#796AEF]/30 hover:bg-[#EEF2FF] transition-all cursor-pointer"
                                    title="Export as PDF Book"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )
                    ) : (
                      <div className="border border-dashed border-[#EFF1F5] rounded-2xl p-10 bg-[#F6F7FB]/60 text-center select-none space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#796AEF] border border-[#796AEF]/30 flex items-center justify-center text-xl mx-auto shadow-2xs">
                          📖
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-800">
                            No Lecture Books Yet
                          </p>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            As you attend classes or review chalkboard topics with Cherry Ma'am, comprehensive study books are automatically compiled here.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in pb-12">
                    {snapshots && snapshots.length > 0 ? (
                      filteredSnapshots.length === 0 ? (
                        <div className="border border-dashed border-[#EFF1F5] rounded-2xl p-10 bg-[#F6F7FB]/60 text-center select-none space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#796AEF] border border-[#796AEF]/30 flex items-center justify-center text-xl mx-auto shadow-2xs">
                            📸
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-black text-slate-700">
                              No matching board slates found
                            </p>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                              {snapshotSearchQuery
                                ? `No snapshot matched "${snapshotSearchQuery}". Try clearing search.`
                                : "Try selecting a different subject tab."}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredSnapshots.map((snap: any, idx: number) => (
                            <div
                              key={snap.id || snap.snapshotId || idx}
                              className="bg-white border border-[#EFF1F5]/90 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group"
                            >
                              {snap.imgData ? (
                                <div
                                  onClick={() => setSelectedSnapshotForModal(snap)}
                                  className="w-full h-36 bg-slate-900 relative overflow-hidden cursor-pointer group-hover:opacity-95 transition-opacity"
                                >
                                  <img
                                    src={snap.imgData}
                                    alt={snap.topicTitle || "Chalkboard snapshot"}
                                    className="w-full h-full object-contain p-1.5"
                                  />
                                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                                    <Maximize2 className="w-4 h-4" />
                                    <span>View Full Slide</span>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => setSelectedSnapshotForModal(snap)}
                                  className="w-full h-36 bg-slate-900 flex items-center justify-center p-3 text-slate-400 text-xs font-mono cursor-pointer"
                                >
                                  <span>📸 Chalkboard Slate</span>
                                </div>
                              )}
                              <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between gap-1.5 mb-1">
                                    <span className="text-[10.5px] font-mono font-bold uppercase text-[#796AEF] bg-[#EEF2FF] px-2 py-0.5 rounded-md border border-[#796AEF]/20">
                                      {snap.subject || subject || "Science"}
                                    </span>
                                    <span className="text-[10.5px] font-mono text-slate-400">
                                      {snap.timestamp?.toDate
                                        ? snap.timestamp.toDate().toLocaleDateString()
                                        : "Recent"}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#796AEF] transition-colors">
                                    {snap.topicTitle || "Blackboard Formulation"}
                                  </h4>
                                </div>
                                <div className="pt-2 border-t border-[#EFF1F5] flex items-center justify-between gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedSnapshotForModal(snap)}
                                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-[#EEF2FF] text-slate-700 hover:text-[#796AEF] border border-[#EFF1F5]/80 hover:border-[#796AEF]/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Inspect</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSnapshot(snap.id)}
                                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-[#EFF1F5]/80 hover:border-rose-200 transition-all cursor-pointer"
                                    title="Delete Snapshot"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      <div className="border border-dashed border-[#EFF1F5] rounded-2xl p-10 bg-[#F6F7FB]/60 text-center select-none space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#796AEF] border border-[#796AEF]/30 flex items-center justify-center text-xl mx-auto shadow-2xs">
                          📸
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-800">
                            No Saved Chalkboard Slates Yet
                          </p>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Tap the Camera icon during any classroom lecture to snapshot key formulas, blackboard diagrams, and study slates directly to your portfolio.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Reader Modal */}
      {selectedBookForReader && (
        <InAppBookReaderModal
          isOpen={!!selectedBookForReader}
          book={selectedBookForReader}
          onClose={() => setSelectedBookForReader(null)}
          onDiscussWithCherry={onDiscussWithCherry}
        />
      )}

      {/* Kiara Voice Modal */}
      {isKiaraVoiceModalOpen && (
        <KiaraLiveVoiceModal
          isOpen={isKiaraVoiceModalOpen}
          onClose={() => {
            setIsKiaraVoiceModalOpen(false);
            setKiaraVoiceInitialTopic("");
          }}
          studentName={studentName}
          grade={grade}
          board={board}
          subject={subject}
          lowestMetric={lowestMetric}
          performanceData={{
            conceptClarity: dashboardStats.conceptClarity,
            theoreticalCore: dashboardStats.theoreticalCore,
            calculationPrecision: dashboardStats.calculationPrecision,
            formulaRecall: dashboardStats.formulaRecall,
            socraticStamina: dashboardStats.socraticStamina,
            strengths: dashboardStats.strengths,
            growths: dashboardStats.growths,
            totalQuizzes: quizAttempts?.length || 0,
            classesCompleted: pastSessions?.length || 0,
            snapshotsSaved: snapshots?.length || 0,
            lowestMetric: lowestMetric,
          }}
          initialDiscussionTopic={kiaraVoiceInitialTopic}
          autoStart={Boolean(kiaraVoiceInitialTopic)}
          onDiscussWithCherry={onDiscussWithCherry}
        />
      )}

      {/* Report Card Modal */}
      {isReportCardModalOpen && (
        <StudentReportCardModal
          isOpen={isReportCardModalOpen}
          onClose={() => setIsReportCardModalOpen(false)}
          studentName={studentName}
          grade={grade}
          subject={subject}
        />
      )}

      {/* Snapshot Inspect Modal */}
      {selectedSnapshotForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
            <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center text-sm">
                  📸
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {selectedSnapshotForModal.topicTitle || "Classroom Chalkboard Snapshot"}
                  </h4>
                  <span className="text-[11px] font-mono text-indigo-300">
                    {selectedSnapshotForModal.subject || subject || "Science"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSnapshotForModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-black/50 space-y-3">
              {selectedSnapshotForModal.imgData ? (
                <img
                  src={selectedSnapshotForModal.imgData}
                  alt={selectedSnapshotForModal.topicTitle || "Blackboard snapshot"}
                  className="max-h-[60vh] object-contain rounded-xl border border-slate-800 shadow-lg"
                />
              ) : null}
              {selectedSnapshotForModal.description && (
                <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
                  <MathRenderer text={selectedSnapshotForModal.description} />
                </div>
              )}
            </div>
            <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => handleDeleteSnapshot(selectedSnapshotForModal.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Slide</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedSnapshotForModal(null)}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1-Tap Gemini API Key BYOK Modal */}
      <GeminiApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => {
          setShowApiKeyModal(false);
          setHasCustomKey(isCustomApiKeyConfigured());
        }}
      />

      {/* Safe Log Out Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 text-left space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-base leading-snug">Log Out of Account?</h3>
                <p className="text-xs text-slate-500 truncate">{currentUser?.email || studentName || "Active Student"}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Kya aap Cherry AI se log out karna chahte hain? Aapka learning progress, quiz scores aur classroom notes safely saved rahenge.
            </p>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  if (onSignOut) {
                    onSignOut();
                  }
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Confirm Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
