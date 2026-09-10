import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  Volume2,
  PhoneOff,
  PhoneCall,
  Sparkles,
  X,
  AlertCircle,
  Brain,
  Calendar,
  Zap,
  Smile,
  ShieldCheck,
} from "lucide-react";
import { useKiaraLiveSession } from "../hooks/useKiaraLiveSession";
import { GuidedBoxBreathingModal } from "./GuidedBoxBreathingModal";

interface KiaraLiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  grade?: string;
  board?: string;
  subject?: string;
  lowestMetric?: { name: string; score: number; icon: string };
  performanceData?: {
    conceptClarity?: number;
    theoreticalCore?: number;
    calculationPrecision?: number;
    formulaRecall?: number;
    socraticStamina?: number;
    strengths?: Array<{ concept: string; category: string }>;
    growths?: Array<{ concept: string; category: string; explanation?: string }>;
    totalQuizzes?: number;
    classesCompleted?: number;
    snapshotsSaved?: number;
    lowestMetric?: { name: string; score: number; icon: string };
  };
  initialDiscussionTopic?: string;
  autoStart?: boolean;
  onDiscussWithCherry?: (topic: string) => void;
}

export const KiaraLiveVoiceModal: React.FC<KiaraLiveVoiceModalProps> = ({
  isOpen,
  onClose,
  studentName = "",
  grade = "Class 10",
  board = "CBSE",
  subject = "Mathematics",
  lowestMetric = { name: "Accuracy", score: 45, icon: "🎯" },
  performanceData,
  initialDiscussionTopic,
  autoStart,
}) => {
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "info" | "success" | "error";
  } | null>(null);

  const handleToast = (text: string, type: "info" | "success" | "error") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  const [showBreathingModal, setShowBreathingModal] = useState<boolean>(false);
  const [detectedSentiment, setDetectedSentiment] = useState<{
    mood: "calm" | "anxious" | "frustrated" | "fatigued" | "motivated";
    label: string;
    emoji: string;
    stressLevel: "low" | "moderate" | "high";
    stressScore: number;
    color: string;
  }>({
    mood: "calm",
    label: "Calm & In Flow",
    emoji: "😌",
    stressLevel: "low",
    stressScore: 18,
    color: "#059669",
  });

  const {
    state,
    userVolume,
    kiaraVolume,
    userTranscript,
    kiaraTranscript,
    connect,
    disconnect,
    sendTopicPrompt,
  } = useKiaraLiveSession({
    onToast: handleToast,
    studentName,
    grade,
    board,
    subject,
    performanceData,
    initialTopicPrompt: initialDiscussionTopic,
  });

  // Real-Time Sentiment & Frustration Detection on Spoken User Transcript
  useEffect(() => {
    if (!userTranscript.text) return;
    const lower = userTranscript.text.toLowerCase();

    const isAnxious = /darr|anxiety|panic|tension|stress|scared|fear|phobia|blank|fail|dar lag|bura lag/i.test(lower);
    const isFrustrated = /frustrat|gussa|irritat|nahi ho raha|nahi ban raha|dimag kharab|galat ho raha|stuck|fasi hu|chidh/i.test(lower);
    const isFatigued = /thak gaya|thak gayi|sleepy|neend|tired|burnout|exhaust|bore/i.test(lower);
    const isMotivated = /topper|score|target|motivation|phod|crack|confident|ready|aasan hai/i.test(lower);

    if (isAnxious) {
      setDetectedSentiment({
        mood: "anxious",
        label: "Exam Anxiety Detected",
        emoji: "😰",
        stressLevel: "high",
        stressScore: 88,
        color: "#E11D48",
      });
    } else if (isFrustrated) {
      setDetectedSentiment({
        mood: "frustrated",
        label: "Study Frustration Detected",
        emoji: "😤",
        stressLevel: "high",
        stressScore: 92,
        color: "#DC2626",
      });
    } else if (isFatigued) {
      setDetectedSentiment({
        mood: "fatigued",
        label: "Mental Fatigue Detected",
        emoji: "🥱",
        stressLevel: "moderate",
        stressScore: 65,
        color: "#D97706",
      });
    } else if (isMotivated) {
      setDetectedSentiment({
        mood: "motivated",
        label: "High Motivation & Drive",
        emoji: "🚀",
        stressLevel: "low",
        stressScore: 12,
        color: "#059669",
      });
    }
  }, [userTranscript.text]);

  // Auto-connect when opened for a live reply discussion
  useEffect(() => {
    if (isOpen && autoStart && state === "disconnected") {
      const timer = setTimeout(() => {
        connect(initialDiscussionTopic);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoStart]);

  if (!isOpen) return null;

  const isActive = state !== "disconnected" && state !== "connecting" && state !== "error";
  const userVolScale = Math.min(2.2, 1 + userVolume * 15);
  const kiaraVolScale = Math.min(2.2, 1 + kiaraVolume * 15);

  const handleClose = () => {
    disconnect();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in font-sans">
        
        {/* Main Modal Card */}
        <div className="relative w-full max-w-xl bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl text-slate-900 flex flex-col max-h-[92vh]">
          
          {/* Top Header - Unified Brand Indigo Gradient */}
          <div className="bg-gradient-to-r from-indigo-600 via-[#796AEF] to-indigo-700 px-4 py-3.5 flex items-center justify-between gap-3 shrink-0 shadow-sm z-20 relative text-white border-b border-indigo-500/30">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shadow-xs border border-white/40">
                  👩‍🎓
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-indigo-700 rounded-full flex items-center justify-center shadow-xs">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </span>
              </div>

              <div className="text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide truncate">
                    Kiara AI Counselor 👩‍🎓
                  </h3>
                  <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider shrink-0 shadow-xs">
                    LIVE VOICE
                  </span>
                </div>
                <p className="text-xs text-indigo-100 truncate flex items-center gap-1.5 font-sans font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span>Online • {studentName || "Student"} • {grade} ({board})</span>
                </p>
              </div>
            </div>

            {/* Priority Focus Badge & Close Button */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-xl px-2.5 py-1 text-left shadow-xs">
                <span className="text-[10px] font-bold text-amber-200 font-mono flex items-center gap-1">
                  <span>{lowestMetric.icon}</span>
                  <span>{lowestMetric.name}:</span>
                  <span className="text-white font-extrabold">{lowestMetric.score}%</span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-8.5 h-8.5 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90 border border-white/25 shadow-xs"
                title="Close Kiara Live Counselor"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 overflow-y-auto relative bg-slate-50/70">
            
            {/* Toast Banner */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl flex items-center space-x-2 text-xs text-indigo-900 shadow-xs font-medium"
                >
                  <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="flex-1 text-left">{toastMessage.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Session Status Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 flex items-center justify-between text-left shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${
                  state === "speaking" ? "bg-[#796AEF] animate-bounce shadow-[0_0_8px_rgba(121,106,239,0.7)]" :
                  state === "listening" ? "bg-emerald-500 animate-ping shadow-[0_0_8px_rgba(16,185,129,0.7)]" :
                  isActive ? "bg-emerald-500" : "bg-slate-400"
                }`} />
                <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wide">
                  {state === "disconnected" && "Offline • Click Start Call to speak with Kiara"}
                  {state === "connecting" && "Establishing Live Audio Stream..."}
                  {state === "idle" && "Ready • Speak directly into your Mic"}
                  {state === "listening" && "Listening to your voice..."}
                  {state === "speaking" && "Kiara is speaking..."}
                  {state === "error" && "Connection error"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#796AEF] font-bold uppercase tracking-wider hidden sm:inline bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                Gemini Audio Live
              </span>
            </div>

            {/* 🧠 Live Emotion & Frustration Sensor */}
            <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 flex items-center justify-between text-left shadow-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm shrink-0">{detectedSentiment.emoji}</span>
                <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider shrink-0">
                    Emotion Sensor:
                  </span>
                  <span className="text-xs font-bold truncate" style={{ color: detectedSentiment.color }}>
                    {detectedSentiment.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden xs:flex items-center gap-1 text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  <span>Stress:</span>
                  <span className={`font-black ${
                    detectedSentiment.stressLevel === "high" ? "text-rose-600 font-extrabold" :
                    detectedSentiment.stressLevel === "moderate" ? "text-amber-600" :
                    "text-emerald-600"
                  }`}>
                    {detectedSentiment.stressScore}%
                  </span>
                </div>

                {/* 1-Min Calming Breath Trigger */}
                <button
                  type="button"
                  onClick={() => setShowBreathingModal(true)}
                  className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs active:scale-95 border ${
                    detectedSentiment.stressLevel === "high"
                      ? "bg-rose-50 border-rose-200 text-rose-700 animate-pulse font-extrabold"
                      : "bg-indigo-50 border-indigo-200 text-[#796AEF] hover:bg-indigo-100"
                  }`}
                  title="Open Guided 1-Minute Box Breathing"
                >
                  <span>🧘</span>
                  <span>1-Min Calmer</span>
                </button>
              </div>
            </div>

            {/* Center Call Visualizer Screen */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 flex flex-col items-center justify-center min-h-[210px] relative select-none overflow-hidden shadow-xs">
              
              {/* Background Subtle Aura */}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-violet-100/60 rounded-full blur-3xl pointer-events-none" />

              {state === "disconnected" && (
                <div className="text-center space-y-3 max-w-sm my-auto animate-fade-in relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-[#796AEF] flex items-center justify-center mx-auto shadow-xs">
                    <Mic className="w-8 h-8 stroke-[1.75]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-slate-900 tracking-wide">
                      Live Voice Mindset Counseling
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                      Talk directly with Kiara AI in natural Hinglish or English about exam stress, study timetables, mnemonics, or subject guidance!
                    </p>
                  </div>
                </div>
              )}

              {state === "connecting" && (
                <div className="text-center space-y-3.5 my-auto relative z-10">
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-[#796AEF] border-t-transparent animate-spin" />
                    <Sparkles className="w-7 h-7 text-[#796AEF]" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-widest animate-pulse">
                    Connecting with Kiara AI...
                  </h5>
                </div>
              )}

              {isActive && (
                <div className="w-full flex flex-col items-center justify-between space-y-4 my-auto relative z-10">
                  
                  {/* Equalizer Orbits */}
                  <div className="flex items-center justify-center space-x-6 sm:space-x-10 w-full py-2">
                    
                    {/* User Mic Orbit */}
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-indigo-400 bg-indigo-50 flex items-center justify-center transition-all duration-75 relative shadow-md shadow-indigo-100"
                        style={{ transform: `scale(${userVolScale})` }}
                      >
                        <Mic className={`w-7 h-7 ${state === "listening" ? "text-indigo-600" : "text-slate-500"}`} />
                        {state === "listening" && (
                          <div className="absolute inset-0 rounded-full border-2 border-indigo-500 animate-ping opacity-75" />
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-indigo-700 uppercase font-black tracking-wider">
                        Your Mic
                      </span>
                    </div>

                    {/* Beam Connection */}
                    <div className="h-[2px] bg-gradient-to-r from-indigo-200 via-[#796AEF] to-indigo-200 w-12 sm:w-16 relative">
                      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#796AEF] ${
                        state === "speaking" || state === "listening" ? "animate-ping" : ""
                      }`} />
                    </div>

                    {/* Kiara Voice Orb */}
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-indigo-300 bg-gradient-to-tr from-indigo-600 to-[#796AEF] flex items-center justify-center transition-all duration-75 relative shadow-md shadow-indigo-300 text-white"
                        style={{ transform: `scale(${kiaraVolScale})` }}
                      >
                        <Volume2 className="w-7 h-7 text-white" />
                        {state === "speaking" && (
                          <div className="absolute inset-0 rounded-full border-2 border-[#796AEF] animate-ping opacity-75" />
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-indigo-700 uppercase font-black tracking-wider">
                        Kiara Voice
                      </span>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Live Caption / Transcript Box */}
            {(userTranscript.text || kiaraTranscript.text) && (
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-left space-y-1.5 max-h-28 overflow-y-auto shadow-xs">
                {userTranscript.text && (
                  <p className="text-xs text-slate-700 font-sans leading-snug">
                    <strong className="text-indigo-600 font-mono">You:</strong> {userTranscript.text}
                  </p>
                )}
                {kiaraTranscript.text && (
                  <p className="text-xs text-slate-800 font-sans leading-snug">
                    <strong className="text-[#796AEF] font-mono">Kiara:</strong> {kiaraTranscript.text}
                  </p>
                )}
              </div>
            )}

            {/* Active Topic / Reply Discussion Banner */}
            {initialDiscussionTopic && (
              <div className="bg-indigo-50/85 border border-indigo-200 rounded-2xl p-3 text-left shadow-xs space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping shrink-0" />
                    <span className="text-[10px] font-mono font-black text-indigo-700 uppercase tracking-wider">
                      Live Chat Discussion Topic 🎙️
                    </span>
                  </div>
                  <span className="text-[9px] bg-white text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md font-sans font-bold shadow-2xs">
                    Reply Synced
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-sans font-medium line-clamp-2 italic">
                  "{initialDiscussionTopic.replace(/^Kiara, aapne chat me mujhe ye advice di: "/, '').replace(/\. Mujhe is baare me aapse live voice me discuss karna hai.*$/, '')}"
                </p>
              </div>
            )}

            {/* Performance Hub Synced Indicator */}
            {performanceData && (
              <div className="bg-white border border-slate-200 rounded-2xl p-3 text-left flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2.5 text-slate-700 text-[11px] font-medium w-full min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                  <span className="font-mono font-bold text-slate-800 shrink-0">Performance Synced:</span>
                  <span className="truncate text-slate-600 font-sans font-semibold">
                    Clarity: <strong className="text-slate-900 font-mono">{performanceData.conceptClarity ?? 75}%</strong> • Calculations: <strong className="text-slate-900 font-mono">{performanceData.calculationPrecision ?? 60}%</strong> • Formula: <strong className="text-slate-900 font-mono">{performanceData.formulaRecall ?? 65}%</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Quick One-Tap Topic Guidance Pills */}
            <div className="space-y-2 text-left">
              <span className="text-[10px] font-mono font-black uppercase text-slate-600 tracking-wider flex items-center justify-between">
                <span>Quick Performance Guidance (Tap during call):</span>
                <span className="text-[9px] text-[#796AEF] font-sans font-extrabold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                  Full Data Access 📊
                </span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  disabled={!isActive}
                  onClick={() =>
                    sendTopicPrompt(
                      `Kiara, mere Performance Hub me mera concept clarity ${performanceData?.conceptClarity ?? 75}%, calculation precision ${performanceData?.calculationPrecision ?? 60}%, aur formula recall ${performanceData?.formulaRecall ?? 65}% hai. Mujhe complete performance analysis aur guidance do!`
                    )
                  }
                  className="bg-amber-50 hover:bg-amber-100 border border-amber-200 disabled:opacity-40 text-amber-900 font-bold text-[11px] py-2.5 px-3 rounded-xl shadow-2xs cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5 truncate"
                >
                  <Zap className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span className="truncate">Performance Analysis</span>
                </button>

                <button
                  type="button"
                  disabled={!isActive}
                  onClick={() =>
                    sendTopicPrompt(
                      `Kiara, mera lowest metric ${lowestMetric.name} (${lowestMetric.score}%) hai. Ise improve karne ka custom step-by-step plan batao!`
                    )
                  }
                  className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 disabled:opacity-40 text-emerald-900 font-bold text-[11px] py-2.5 px-3 rounded-xl shadow-2xs cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5 truncate"
                >
                  <Brain className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span className="truncate">Fix Weak Metric</span>
                </button>

                <button
                  type="button"
                  disabled={!isActive}
                  onClick={() =>
                    sendTopicPrompt(
                      `Kiara, mere Class ${grade} ${subject} ke liye exact 24-hour custom study timetable aur routine batao.`
                    )
                  }
                  className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 disabled:opacity-40 text-indigo-900 font-bold text-[11px] py-2.5 px-3 rounded-xl shadow-2xs cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5 truncate"
                >
                  <Calendar className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                  <span className="truncate">Study Routine</span>
                </button>

                <button
                  type="button"
                  disabled={!isActive}
                  onClick={() =>
                    sendTopicPrompt(
                      "Kiara, mujhe exam stress aur phobia se deal karne ke liye instant relaxation tips aur guidance do!"
                    )
                  }
                  className="bg-purple-50 hover:bg-purple-100 border border-purple-200 disabled:opacity-40 text-purple-900 font-bold text-[11px] py-2.5 px-3 rounded-xl shadow-2xs cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5 truncate"
                >
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-purple-600" />
                  <span className="truncate">Exam Stress</span>
                </button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-2 border-t border-slate-200 flex flex-col items-center justify-center space-y-2">
              {isActive ? (
                <button
                  type="button"
                  onClick={disconnect}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold py-3.5 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-rose-200 active:scale-[0.98] cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4 stroke-[2.5]" />
                  <span>END VOICE CALL WITH KIARA</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={state === "connecting"}
                  onClick={() => connect(initialDiscussionTopic)}
                  className="w-full bg-[#796AEF] hover:bg-[#6857e6] text-white font-mono text-xs sm:text-sm font-bold py-3.5 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  <PhoneCall className="w-4 h-4 stroke-[2.5]" />
                  <span>{initialDiscussionTopic ? "START LIVE DISCUSSION WITH KIARA 🎙️" : "START LIVE CALL WITH KIARA 🌸"}</span>
                </button>
              )}

              <p className="text-[9.5px] font-mono text-slate-500 text-center font-medium">
                🔒 Confidential & encrypted voice counseling • Powered by Gemini Live API
              </p>
            </div>

          </div>

        </div>

        {/* Guided Box Breathing Modal */}
        <GuidedBoxBreathingModal
          isOpen={showBreathingModal}
          onClose={() => setShowBreathingModal(false)}
          studentName={studentName}
          triggerReason={detectedSentiment.label}
          onStartVoiceCall={(prompt) => {
            if (!isActive) {
              connect(prompt);
            } else {
              sendTopicPrompt(prompt);
            }
          }}
        />

      </div>
    </AnimatePresence>
  );
};
