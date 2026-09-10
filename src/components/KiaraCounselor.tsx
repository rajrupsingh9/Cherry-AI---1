import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Send, Bot, User, Brain, Heart, Target, Lightbulb, 
  Calendar, Award, BookOpen, Smile, Zap, MessageSquare, Volume2, 
  VolumeX, RefreshCw, CheckCircle, ArrowRight, ArrowLeft, ShieldCheck, HelpCircle,
  Clock, Flame, Copy, Check, Compass, Radio, Activity, Star, CheckCheck,
  Maximize2, Minimize2, X
} from "lucide-react";
import { MathRenderer } from "./MathRenderer";
import { fetchWithKeyFailover } from "../utils/geminiKeyStorage";
import { GuidedBoxBreathingModal } from "./GuidedBoxBreathingModal";
import { SmartAdaptiveRoutine } from "./SmartAdaptiveRoutine";
import { MnemonicStudio } from "./MnemonicStudio";

interface PerformanceAnalytics {
  conceptClarity: number;
  theoreticalCore: number;
  calculationPrecision: number;
  formulaRecall: number;
  socraticStamina: number;
  strengths: { concept: string; category: string }[];
  growths: { concept: string; category: string; explanation?: string }[];
}

export interface SentimentInfo {
  mood: "anxious" | "frustrated" | "fatigued" | "motivated" | "calm";
  stressLevel: "low" | "moderate" | "high";
  frustrationLevel: "low" | "moderate" | "high";
  moodLabel: string;
  requiresBreathing: boolean;
  actionTip: string;
}

interface KiaraCounselorProps {
  studentName: string;
  grade: string;
  subject: string;
  board?: string;
  mediumOfLearning?: string;
  analytics?: PerformanceAnalytics;
  onNavigateToClassroom?: () => void;
  onStartVoiceCall?: (initialTopic?: string) => void;
  onClose?: () => void;
  defaultFullScreen?: boolean;
}

interface ChatMessage {
  id: string;
  sender: "user" | "kiara";
  text: string;
  timestamp: string;
  category?: "strategy" | "mindset" | "mnemonic" | "routine";
  sentiment?: SentimentInfo;
}

export const KiaraCounselor: React.FC<KiaraCounselorProps> = ({
  studentName,
  grade,
  subject,
  board = "CBSE",
  mediumOfLearning = "Hinglish",
  analytics,
  onNavigateToClassroom,
  onStartVoiceCall,
  onClose,
  defaultFullScreen = false,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeQuickTab, setActiveQuickTab] = useState<"chat" | "routine" | "mnemonics" | "mindset">("chat");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(defaultFullScreen);
  const [showBreathingModal, setShowBreathingModal] = useState<boolean>(false);
  const [breathingTriggerReason, setBreathingTriggerReason] = useState<string>("Mindset & Stress Reset");
  const [promptCategory, setPromptCategory] = useState<"topics" | "moods">("topics");
  const [currentMood, setCurrentMood] = useState<SentimentInfo>({
    mood: "calm",
    moodLabel: "Calm & In Flow 😌",
    stressLevel: "low",
    frustrationLevel: "low",
    requiresBreathing: false,
    actionTip: "Paced revision & error analysis keep your confidence high!",
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Default fallback analytics if missing
  const stats = analytics || {
    conceptClarity: 78,
    theoreticalCore: 82,
    calculationPrecision: 65,
    formulaRecall: 70,
    socraticStamina: 85,
    strengths: [{ concept: "Core Definitions", category: "Theoretical Core" }],
    growths: [{ concept: "Calculation Step Precision", category: "Calculations", explanation: "Avoid rushing algebraic sign transpositions." }]
  };

  // Find lowest metric to formulate Kiara's initial proactive greeting
  const metrics = [
    { name: "Concept Clarity", score: stats.conceptClarity, key: "conceptClarity", icon: "🧠" },
    { name: "Theoretical Core", score: stats.theoreticalCore, key: "theoreticalCore", icon: "📚" },
    { name: "Calculation Precision", score: stats.calculationPrecision, key: "calculationPrecision", icon: "🧮" },
    { name: "Formula Recall", score: stats.formulaRecall, key: "formulaRecall", icon: "⚡" },
    { name: "Socratic Stamina", score: stats.socraticStamina, key: "socraticStamina", icon: "🔥" },
  ].sort((a, b) => a.score - b.score);

  const lowestMetric = metrics[0];
  const highestMetric = [...metrics].sort((a, b) => b.score - a.score)[0];

  // Initialize Kiara's welcome message on mount
  useEffect(() => {
    const firstName = studentName ? studentName.split(" ")[0] : "Friend";
    const initialGreeting: ChatMessage = {
      id: "init-1",
      sender: "kiara",
      text: `Namaste ${firstName}! 🌸 I'm **Kiara**, your personal AI Mindset & Academic Success Counselor!\n\n` +
        `I've reviewed your **Performance Analytics Hub** for **${subject} (${grade} • ${board})**:\n` +
        `• 🌟 **Highest Strength**: ${stats.strengths[0]?.concept || highestMetric.name} (${highestMetric.score}%)\n` +
        `• 🎯 **Priority Growth Focus**: ${lowestMetric.name} is at **${lowestMetric.score}%**.\n\n` +
        `I am here to guide you with:\n` +
        `1. 🧘 **Exam Anxiety & Stress Shield**: Stay relaxed, confident, and burnout-free.\n` +
        `2. 📅 **Personalized 24H Study Timetable**: Custom routine for your school schedule.\n` +
        `3. 💡 **Memory Hacks & Mnemonics**: Tricks to remember tough formulas & definitions permanently.\n` +
        `4. 🎯 **Scoring Strategy**: Proven steps to achieve 95%+ in ${subject}.\n\n` +
        `Aaj padhai me kaisa feel kar rahe ho? Feel free to ask anything or choose a topic below! ✨`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([initialGreeting]);
  }, [studentName, grade, subject, board]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || inputText).trim();
    if (!queryText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsLoading(true);

    try {
      // Build conversation history format
      const history = messages.slice(-8).map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text,
      }));

      const response = await fetchWithKeyFailover("/api/counselor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: queryText,
          studentName,
          grade,
          subject,
          board,
          mediumOfLearning,
          performanceData: stats,
          chatHistory: history,
        }),
      });

      if (!response.ok) {
        throw new Error("Counselor service responded with error");
      }

      const resData = await response.json();
      if (resData.success && resData.reply) {
        if (resData.sentiment) {
          setCurrentMood(resData.sentiment);
          if (resData.sentiment.requiresBreathing) {
            setBreathingTriggerReason(resData.sentiment.moodLabel || "Stress Relief Reset");
          }
        }

        const kiaraMsg: ChatMessage = {
          id: `kiara-${Date.now()}`,
          sender: "kiara",
          text: resData.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          sentiment: resData.sentiment,
        };
        setMessages((prev) => [...prev, kiaraMsg]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Kiara Counselor chat error:", err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "kiara",
        text: `Network check kijiye! 😅 Don't worry, ek baar phir try karein. Kiara is always here to guide you! 🌸`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeechPlayback = (text: string, msgId: string) => {
    if (speakingMessageId === msgId) {
      window.speechSynthesis?.cancel();
      setSpeakingMessageId(null);
      return;
    }

    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    
    // Clean markdown symbols for smooth audio text-to-speech reading
    const cleanAudioText = text
      .replace(/[*#_`~]/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .replace(/https?:\/\/\S+/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanAudioText);
    utterance.rate = 1.0;
    utterance.pitch = 1.1; // Friendly warm pitch

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("zira") || v.lang.includes("en-IN") || v.lang.includes("hi-IN")
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleStartLiveDiscussion = (messageText: string) => {
    if (speakingMessageId) {
      window.speechSynthesis?.cancel();
      setSpeakingMessageId(null);
    }

    const cleanSnippet = messageText
      .replace(/[*#_`~]/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const shortContext = cleanSnippet.length > 250 
      ? cleanSnippet.substring(0, 250).trim() + "..." 
      : cleanSnippet;

    const topicPrompt = `Kiara, aapne chat me mujhe ye advice di: "${shortContext}". Mujhe is baare me aapse live voice me discuss karna hai, please mujhe detail me samjhaiye aur guide kijiye!`;

    if (onStartVoiceCall) {
      onStartVoiceCall(topicPrompt);
    } else {
      handleSpeechPlayback(messageText, "fallback-live");
    }
  };

  const copyToClipboard = (text: string, msgId: string) => {
    const clean = text.replace(/[*#_`~]/g, "");
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(clean).catch(() => {
          fallbackCopyText(clean);
        });
      } else {
        fallbackCopyText(clean);
      }
    } catch (_) {
      fallbackCopyText(clean);
    }
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    } catch (_) {}
  };

  const quickPrompts = [
    {
      emoji: "🧘",
      label: "Exam Anxiety & Phobia",
      prompt: `Mujhe exams ki wajah se stress aur fear ho raha hai. Is fear ko overcome karne ke simple psychological tips do.`,
    },
    {
      emoji: "📅",
      label: "My Daily Study Routine",
      prompt: `Mera grade ${grade} (${board}) hai. Mujhe ek balanced 24-hour study routine aur timetable bana kar do.`,
    },
    {
      emoji: "⏱️",
      label: "25-Min Pomodoro Sprint",
      prompt: `Kiara, mujhe ek active 25-minute Pomodoro focus study sprint plan karke do jisme distraction bilkul zero ho aur deep focus bana rahe.`,
    },
    {
      emoji: "💡",
      label: "Formula & Concept Mnemonics",
      prompt: `Mujhe ${subject} ke tough formulas aur definitions yaad rakhne ki funny aur easy mnemonic tricks batao.`,
    },
    {
      emoji: "📊",
      label: `Improve My ${lowestMetric.name}`,
      prompt: `Mera ${lowestMetric.name} abhi ${lowestMetric.score}% par hai. Ise 90%+ tak elevate karne ka exact step-by-step plan batao.`,
    },
    {
      emoji: "🎯",
      label: "Paper Attempt Strategy",
      prompt: `Exam hall me question paper kis order me attempt karna chahiye taaki time manage ho aur silly errors zero ho?`,
    },
  ];

  const counselorContent = (
    <div 
      ref={chatContainerRef}
      className="fixed inset-0 z-[999999] w-screen w-full h-[100dvh] h-screen max-w-none max-h-none rounded-none shadow-none border-0 overflow-hidden flex flex-col bg-slate-50 text-slate-800 font-sans"
    >
      
      {/* Top Header - App Signature Brand Color (#796AEF Primary Indigo) */}
      <div className="bg-[#796AEF] text-white px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 shrink-0 shadow-xs z-30 relative pt-[max(10px,env(safe-area-inset-top))] border-b border-[#6858e0]">
        
        {/* Left Contact Info & Back Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 -ml-1 hover:bg-white/15 active:bg-white/25 rounded-full text-white transition-colors cursor-pointer shrink-0 flex items-center justify-center"
              title="Back to Study Desk / Profile"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}

          <div className="relative shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center text-lg sm:text-xl shadow-inner border border-white/40">
              👩‍🎓
            </div>
            {/* Green Online Active Badge */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-300 border-2 border-[#796AEF] rounded-full flex items-center justify-center">
              <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
            </span>
          </div>

          <div className="text-left min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate flex items-center gap-1">
                <span>Kiara AI Counselor</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
              </h3>
              <span className="text-[8.5px] font-mono font-extrabold px-1.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 uppercase tracking-wider shrink-0 hidden xs:inline">
                Mentor
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-indigo-100 truncate flex items-center gap-1 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse shrink-0" />
              <span>online • Class {grade} ({board})</span>
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* 🧠 Live Emotion & Stress Sensor Pill */}
          <button
            type="button"
            onClick={() => {
              setBreathingTriggerReason(currentMood.moodLabel || "Stress Relief Reset");
              setShowBreathingModal(true);
            }}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-white text-[10px] sm:text-[11px] font-bold border transition-all cursor-pointer active:scale-95 ${
              currentMood.stressLevel === "high" || currentMood.requiresBreathing
                ? "bg-rose-500/80 border-rose-300 text-white animate-pulse"
                : currentMood.stressLevel === "moderate"
                ? "bg-amber-500/80 border-amber-300 text-white"
                : "bg-white/15 border-white/25 text-white hover:bg-white/25"
            }`}
            title="Emotion Sensor • Tap for 1-Min Calmer"
          >
            <span className="text-xs">🧠</span>
            <span className="truncate max-w-[60px] xs:max-w-[85px] sm:max-w-none">{currentMood.moodLabel}</span>
          </button>

          {onStartVoiceCall && (
            <button
              type="button"
              onClick={onStartVoiceCall}
              className="bg-white hover:bg-indigo-50 text-[#796AEF] font-bold text-[10.5px] sm:text-[11.5px] uppercase tracking-wider px-2 sm:px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 border border-white shrink-0"
              title="Start Live Voice Call with Kiara AI"
            >
              <Radio className="w-3.5 h-3.5 text-[#796AEF] stroke-[2.5] animate-pulse" />
              <span className="hidden sm:inline">Voice Call 🎙️</span>
            </button>
          )}

          {/* Close / Exit Button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-white/15 active:bg-white/25 rounded-full text-white transition-all cursor-pointer flex items-center justify-center border border-white/20 shadow-2xs"
              title="Close / Exit Kiara"
            >
              <X className="w-4.5 h-4.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Subheader Navigation Tab Bar (Clean Canvas White Theme with #796AEF & Soft Violet Accents) */}
      <div className="bg-white border-b border-slate-200/90 px-3 sm:px-6 py-1.5 flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 z-20 text-left shadow-2xs">
        <div className="max-w-4xl w-full mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: "chat", label: "Counseling & Chat", icon: MessageSquare },
            { id: "routine", label: "Smart Routine & Pomodoro", icon: Calendar },
            { id: "mnemonics", label: "Mnemonic Studio ✨", icon: Lightbulb },
            { id: "mindset", label: "Exam Anxiety Shield", icon: Heart },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeQuickTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveQuickTab(tab.id as any)}
                className={`py-1.5 px-3 text-[10.5px] sm:text-[11px] font-sans font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 ${
                  isActive
                    ? "bg-[#EEF2FF] text-[#796AEF] shadow-2xs border border-indigo-200"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80"
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB 1: COUNSELING & MINDSET CHAT ================= */}
      {activeQuickTab === "chat" && (
        <div className="flex-1 flex flex-col min-h-0 relative z-10 w-full bg-slate-50">
          
          {/* Chat Messages Feed Canvas */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 text-left relative bg-slate-50"
            style={{
              backgroundImage: 'radial-gradient(#cbd5e1 0.75px, transparent 0.75px)',
              backgroundSize: '24px 24px',
            }}
          >
            <div className="max-w-3xl mx-auto w-full space-y-3.5">
              {/* Confidentiality & Security Badge */}
              <div className="flex justify-center my-1.5">
                <span className="bg-white/90 backdrop-blur-xs border border-slate-200 text-slate-500 text-[11px] font-sans font-medium px-3.5 py-1 rounded-full shadow-2xs text-center max-w-md">
                  🔒 Private & Confidential Session with **Kiara AI Counselor**
                </span>
              </div>

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* MESSAGE BUBBLE */}
                  <div className={`relative p-3.5 sm:p-4 text-[13.5px] sm:text-sm font-sans leading-relaxed transition-all ${
                    msg.sender === "user"
                      ? "bg-[#EEF2FF] text-slate-900 border border-indigo-200/90 rounded-2xl rounded-tr-xs max-w-[86%] sm:max-w-[76%] shadow-2xs"
                      : "bg-white text-slate-900 border border-slate-200/90 rounded-2xl rounded-tl-xs w-full max-w-[96%] sm:max-w-[90%] shadow-xs"
                  }`}>
                    
                    {/* Message Header (Sender Label + Action Bar) */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2 text-[11px] font-mono">
                      <span className={`font-bold uppercase tracking-wider flex items-center gap-1 ${
                        msg.sender === "user" ? "text-indigo-900" : "text-[#796AEF]"
                      }`}>
                        {msg.sender === "user" ? (studentName || "You") : "Kiara AI Counselor 👩‍🎓"}
                        {msg.sender === "kiara" && <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
                      </span>

                      {/* AI Action Toolbar (Copy & Audio) */}
                      {msg.sender === "kiara" && (
                        <div className="flex items-center gap-1.5 ml-2">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(msg.text, msg.id)}
                            className="hover:text-[#796AEF] text-slate-500 transition-colors p-1 cursor-pointer flex items-center gap-1 font-bold text-[10px] bg-slate-50 hover:bg-indigo-50 px-2 py-0.5 rounded-lg border border-slate-200/80"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600 font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartLiveDiscussion(msg.text)}
                            className="text-[#796AEF] bg-indigo-50 hover:bg-indigo-100 p-1 px-2 rounded-lg border border-indigo-200/90 cursor-pointer flex items-center gap-1 font-bold text-[10px] shadow-2xs active:scale-95 transition-all group"
                            title="Kiara se is reply par Live Voice Discussion karein 🎙️"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-[#796AEF] group-hover:scale-110 transition-transform" />
                            <span>Discuss</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Formatted Text Body */}
                    <div className="space-y-2 font-sans leading-relaxed text-[13.5px] sm:text-sm">
                      {msg.text.split("\n\n").map((paragraph, pIdx) => (
                        <div key={pIdx} className="leading-relaxed">
                          {paragraph.includes("$") || paragraph.includes("\\") ? (
                            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-2.5 my-1 text-slate-900">
                              <MathRenderer text={paragraph} isLightBg={true} />
                            </div>
                          ) : (
                            paragraph.split("**").map((chunk, cIdx) => 
                              cIdx % 2 === 1 ? (
                                <strong key={cIdx} className={msg.sender === "user" ? "text-indigo-950 font-extrabold" : "text-slate-900 font-bold"}>{chunk}</strong>
                              ) : (
                                chunk
                              )
                            )
                          )}
                        </div>
                      ))}
                    </div>

                    {/* 🧠 Stress-Adaptive Counseling Shield Card */}
                    {msg.sender === "kiara" && msg.sentiment && (msg.sentiment.mood === "anxious" || msg.sentiment.mood === "frustrated" || msg.sentiment.requiresBreathing) && (
                      <div className="mt-3 p-3 bg-gradient-to-br from-rose-50/90 to-amber-50/70 border border-rose-200/90 rounded-2xl text-left space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[11px] font-mono font-bold text-rose-700 uppercase flex items-center gap-1.5">
                            <span>🧠 Emotion Sensing:</span>
                            <span className="font-sans font-extrabold">{msg.sentiment.moodLabel}</span>
                          </span>
                          <span className="text-[10px] font-mono font-bold bg-white text-rose-800 px-2 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                            Stress: {msg.sentiment.stressLevel.toUpperCase()}
                          </span>
                        </div>

                        {msg.sentiment.actionTip && (
                          <p className="text-xs text-slate-700 font-medium italic bg-white/80 p-2 rounded-xl border border-rose-100">
                            💡 "{msg.sentiment.actionTip}"
                          </p>
                        )}

                        <div className="pt-1 flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              setBreathingTriggerReason(msg.sentiment?.moodLabel || "Stress Relief Reset");
                              setShowBreathingModal(true);
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                          >
                            <span>🧘</span>
                            <span>Take 1-Min Calming Breath</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartLiveDiscussion(msg.text)}
                            className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-[11px] px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-[#796AEF]" />
                            <span>Voice Call Kiara 🎙️</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Timestamp & Read Status */}
                    <div className="flex items-center justify-end gap-1 mt-1.5 text-[10.5px] text-slate-400 font-sans">
                      <span>{msg.timestamp}</span>
                      {msg.sender === "user" && (
                        <CheckCheck className="w-3.5 h-3.5 text-[#796AEF] font-bold" />
                      )}
                    </div>

                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex items-center justify-start my-2">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3 px-4 flex items-center space-x-2 text-xs text-slate-800 shadow-xs">
                    <RefreshCw className="w-4 h-4 text-[#796AEF] animate-spin" />
                    <span className="font-medium text-[#796AEF] animate-pulse">
                      Kiara is crafting personalized academic advice...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ⚡ Unified Smart Context & Prompt Ribbon (Single Clean Row) */}
          <div className="px-2 py-1.5 sm:px-3 bg-white border-t border-slate-200/90 shrink-0 text-left shadow-2xs">
            <div className="max-w-3xl mx-auto w-full flex items-center gap-2 min-w-0">
              
              {/* Category Switcher Tabs */}
              <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-xl shrink-0 border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setPromptCategory("topics")}
                  className={`text-[11px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    promptCategory === "topics"
                      ? "bg-white text-[#796AEF] shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  ⚡ Topics
                </button>
                <button
                  type="button"
                  onClick={() => setPromptCategory("moods")}
                  className={`text-[11px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    promptCategory === "moods"
                      ? "bg-white text-[#796AEF] shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  🧠 Moods
                </button>
              </div>

              {/* Horizontal Scrolling Pills based on selected Category */}
              <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar min-w-0">
                {promptCategory === "topics" ? (
                  quickPrompts.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(item.prompt)}
                      className="shrink-0 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-900 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                    >
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                    </button>
                  ))
                ) : (
                  [
                    { emoji: "😰", label: "Exam Anxiety", prompt: "Kiara, mujhe bohot exam anxiety aur darr lag raha hai ki exam me sab bhool jaunga. Please mujhe calm karo aur guide karo." },
                    { emoji: "😤", label: "Stuck & Frustrated", prompt: "Kiara, mujhse tough questions solve nahi ho rahe hain aur bohot frustration ho rahi hai. Main kya karoon?" },
                    { emoji: "🥱", label: "Mental Fatigue", prompt: "Kiara, mera dimag bohot thak gaya hai aur padhai me bilkul focus nahi ho pa raha. Mujhe recharge routine batao." },
                    { emoji: "🚀", label: "High Motivation", prompt: "Kiara, I am energetic today! Mujhe 95%+ score karne ka fast-track revision strategy batao." },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(item.prompt)}
                      className="shrink-0 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-900 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                    >
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                    </button>
                  ))
                )}
              </div>

              {/* Pinned 1-Min Calmer Button */}
              <button
                type="button"
                onClick={() => {
                  setBreathingTriggerReason(currentMood.moodLabel || "1-Min Stress Relief Reset");
                  setShowBreathingModal(true);
                }}
                className="shrink-0 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                title="Open 1-Minute Calming Box Breathing"
              >
                <span>🧘</span>
                <span className="hidden xs:inline">1-Min</span>
              </button>

            </div>
          </div>

          {/* Clean Floating Input Bar */}
          <div className="px-3 py-2 sm:py-2.5 bg-white border-t border-slate-200/80 shrink-0 text-left relative z-20 w-full box-border pb-[max(8px,env(safe-area-inset-bottom))]">
            <div className="max-w-3xl mx-auto w-full">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 w-full min-w-0"
              >
                {/* Floating Input Box Pill */}
                <div className="flex-1 min-w-0 bg-slate-50 hover:bg-slate-100/60 focus-within:bg-white rounded-2xl border border-slate-200/90 focus-within:border-[#796AEF] focus-within:ring-2 focus-within:ring-indigo-100 flex items-center px-3 py-1.5 shadow-2xs transition-all overflow-hidden">
                  
                  <button
                    type="button"
                    onClick={() => handleSendMessage("Kiara, give me pro tips for study timetables, stress management, and formula tricks!")}
                    className="text-slate-400 hover:text-[#796AEF] p-1 rounded-full transition-colors cursor-pointer shrink-0"
                    title="Get Pro Tips from Kiara"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                  </button>

                  <input 
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Ask Kiara about ${subject} study strategies, timetables, formulas, stress...`}
                    className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-[13.5px] sm:text-sm font-medium focus:outline-none px-2 py-1"
                  />
                </div>

                {/* Primary Brand Send Button */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#796AEF] hover:bg-[#6855ea] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
                  title="Send message to Kiara"
                >
                  <Send className="w-4 h-4 text-white ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: SMART ADAPTIVE ROUTINE & POMODORO ================= */}
      {activeQuickTab === "routine" && (
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc] relative z-10 text-left">
          <div className="max-w-4xl mx-auto">
            <SmartAdaptiveRoutine
              studentName={studentName}
              grade={grade}
              subject={subject}
              board={board}
              onNavigateToClassroom={onNavigateToClassroom}
              onStartVoiceCall={onStartVoiceCall}
              onAskKiaraCustomRoutine={(query) => {
                setActiveQuickTab("chat");
                handleSendMessage(query);
              }}
            />
          </div>
        </div>
      )}

      {/* ================= TAB 3: INTERACTIVE AI MNEMONIC STUDIO & FLASHCARDS ================= */}
      {activeQuickTab === "mnemonics" && (
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc] relative z-10 text-left">
          <div className="max-w-4xl mx-auto">
            <MnemonicStudio
              studentName={studentName}
              grade={grade}
              board={board}
              subject={subject}
              onAskKiaraInChat={(query) => {
                setActiveQuickTab("chat");
                handleSendMessage(query);
              }}
              onStartVoiceCall={onStartVoiceCall}
            />
          </div>
        </div>
      )}

      {/* ================= TAB 4: EXAM ANXIETY SHIELD ================= */}
      {activeQuickTab === "mindset" && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 relative z-10 text-left">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-white border border-rose-200 rounded-2xl p-4 sm:p-5 text-left space-y-2 shadow-2xs">
              <h4 className="text-sm font-black text-rose-700 font-sans flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
                Kiara's Exam Anxiety & Phobia Shield 🧘
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Academic pressure is completely normal. Here are 4 scientifically backed psychological techniques to calm your mind during exams.
              </p>
            </div>

            {/* Psychological Mindset Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  title: "4-7-8 Breathing Reset",
                  tag: "Instant Anxiety Reduction",
                  emoji: "🫁",
                  steps: "Inhale through nose for 4s → Hold breath for 7s → Exhale slowly through mouth for 8s. Repeat 3 times before starting an exam."
                },
                {
                  title: "The 2-Minute Rule for Blanking Out",
                  tag: "Cognitive Reboot",
                  emoji: "🧠",
                  steps: "If you blank out on a question, drink a sip of water, close your eyes, and move to the easiest question first to rebuild momentum."
                },
                {
                  title: "Silly Errors Eraser",
                  tag: "Precision Habit",
                  emoji: "✏️",
                  steps: "Underline the target value in the question paper (e.g., 'Find area in cm²') before writing any formula to prevent sign/unit mistakes."
                },
                {
                  title: "Night-Before Exam Mindset",
                  tag: "Sleep Protection",
                  emoji: "🌙",
                  steps: "Stop reading new topics after 09:00 PM. Review 1 page of key formulas, hydrate, and go to bed early. Memory consolidates in sleep!"
                }
              ].map((card, cIdx) => (
                <div key={cIdx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-left shadow-2xs hover:border-rose-300 hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-[11px] font-mono text-rose-700 uppercase font-bold flex items-center gap-1">
                      <span>{card.emoji}</span> {card.title}
                    </span>
                    <span className="text-[10.5px] font-mono text-[#796AEF] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      {card.tag}
                    </span>
                  </div>
                  <p className="text-[12.5px] sm:text-xs text-slate-700 leading-relaxed font-medium">{card.steps}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setBreathingTriggerReason("Mindset & Exam Phobia Shield");
                  setShowBreathingModal(true);
                }}
                className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase px-6 py-3 rounded-2xl transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <span>🧘</span>
                <span>Open 1-Min Box Breathing Visualizer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveQuickTab("chat");
                  handleSendMessage(`Kiara, mujhe abhi exam phobia se deal karne ke liye personal counseling chahiye.`);
                }}
                className="w-full sm:w-auto bg-[#008069] hover:bg-[#006e5a] text-white text-xs font-bold uppercase px-6 py-3 rounded-2xl transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <span>💬</span>
                <span>Talk To Kiara About Exam Stress</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guided 1-Minute Box Breathing Modal */}
      <GuidedBoxBreathingModal
        isOpen={showBreathingModal}
        onClose={() => setShowBreathingModal(false)}
        studentName={studentName}
        triggerReason={breathingTriggerReason}
        onStartVoiceCall={(prompt) => {
          if (onStartVoiceCall) {
            onStartVoiceCall(prompt);
          } else {
            setActiveQuickTab("chat");
            handleSendMessage(prompt);
          }
        }}
      />

    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(counselorContent, document.body);
  }

  return counselorContent;
};
