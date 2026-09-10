import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  MicOff,
  Volume2,
  PhoneOff,
  PhoneCall,
  Sparkles,
  X,
  AlertCircle,
  HelpCircle,
  Calculator,
  Compass,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Flame,
} from "lucide-react";
import { useTaraGuideLiveSession } from "../hooks/useTaraGuideLiveSession";
import { MathRenderer } from "./MathRenderer";

interface TaraGuideVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  grade?: string;
  board?: string;
  subject?: string;
  problemText?: string;
  replyContext?: string;
  autoStart?: boolean;
}

export const TaraGuideVoiceModal: React.FC<TaraGuideVoiceModalProps> = ({
  isOpen,
  onClose,
  studentName = "",
  grade = "Class 10",
  board = "CBSE",
  subject = "Mathematics",
  problemText = "",
  replyContext = "",
  autoStart = true,
}) => {
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "info" | "success" | "error";
  } | null>(null);

  const [isContextExpanded, setIsContextExpanded] = useState<boolean>(false);

  const handleToast = (text: string, type: "info" | "success" | "error") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Clean the reply context for speech prompt
  const cleanSnippet = (replyContext || "")
    .replace(/```[\s\S]*?```/g, " [Diagram / Formula] ")
    .replace(/[*#_`~]/g, "")
    .trim();

  const initialDiscussionTopic = cleanSnippet
    ? `Student "${studentName || "Student"}" wants live voice help discussing this solution step:\n"${cleanSnippet.substring(0, 400)}"\n${problemText ? `Original Problem: ${problemText.substring(0, 250)}` : ""}`
    : `Student "${studentName || "Student"}" wants live voice guidance on their numerical problem in ${subject}.`;

  const {
    state,
    userVolume,
    taraVolume,
    userTranscript,
    taraTranscript,
    isMuted,
    toggleMute,
    connect,
    disconnect,
    stopPlayback,
    sendTopicPrompt,
  } = useTaraGuideLiveSession({
    onToast: handleToast,
    studentName,
    grade,
    board,
    subject,
    replyContext: cleanSnippet,
    initialTopicPrompt: initialDiscussionTopic,
  });

  // Auto-connect when modal opens
  useEffect(() => {
    if (isOpen && autoStart && state === "disconnected") {
      const timer = setTimeout(() => {
        connect(initialDiscussionTopic);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoStart]);

  if (!isOpen) return null;

  const isActive = state !== "disconnected" && state !== "connecting" && state !== "error";
  const userVolScale = Math.min(2.1, 1 + userVolume * 14);
  const taraVolScale = Math.min(2.1, 1 + taraVolume * 14);

  const handleClose = () => {
    disconnect();
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        id="tara-voice-modal-backdrop"
        className="fixed inset-0 z-[9999999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans"
      >
        {/* Main Centered Mobile-First Frame */}
        <div 
          id="tara-voice-modal-card"
          className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl text-slate-900 flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Top Header - Unified Brand Indigo Theme */}
          <div 
            id="tara-voice-modal-header"
            className="bg-gradient-to-r from-indigo-600 via-[#796AEF] to-indigo-700 px-4 py-3.5 flex items-center justify-between gap-3 shrink-0 shadow-sm z-20 relative text-white border-b border-indigo-500/30"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shadow-xs border border-white/40">
                  👩‍🏫
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-indigo-700 rounded-full flex items-center justify-center shadow-xs">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </span>
              </div>

              <div className="text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide truncate">
                    Tara Ma'am (तारा मैम)
                  </h3>
                  <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider shrink-0 shadow-xs">
                    LIVE VOICE
                  </span>
                </div>
                <p className="text-xs text-indigo-100 truncate flex items-center gap-1.5 font-sans font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span>Socratic Guide • {studentName || "Student"} • {subject}</span>
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                id="btn-close-tara-modal"
                onClick={handleClose}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90 border border-white/25 shadow-xs"
                title="Close Live Voice Discussion"
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
                  <AlertCircle className="w-4 h-4 text-[#796AEF] shrink-0" />
                  <span className="flex-1 text-left">{toastMessage.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pinned Discussion Context Accordion */}
            {(replyContext || cleanSnippet) && (
              <div 
                id="tara-context-preview"
                className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs text-left text-xs transition-all"
              >
                <div 
                  className="flex items-center justify-between cursor-pointer select-none pb-0.5"
                  onClick={() => setIsContextExpanded(!isContextExpanded)}
                >
                  <div className="flex items-center gap-2 text-slate-700 font-semibold truncate">
                    <Compass className="w-3.5 h-3.5 text-[#796AEF] shrink-0" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                      Discussing AI Solution Step:
                    </span>
                  </div>
                  <button 
                    type="button"
                    className="text-slate-400 hover:text-slate-700 p-0.5 rounded-md transition-colors cursor-pointer"
                    aria-label={isContextExpanded ? "Collapse" : "Expand"}
                  >
                    {isContextExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                <div 
                  className={`mt-1.5 text-slate-800 leading-relaxed font-sans text-xs ${
                    isContextExpanded 
                      ? "max-h-60 overflow-y-auto pr-1" 
                      : "max-h-16 overflow-hidden relative"
                  }`}
                >
                  <MathRenderer text={replyContext || cleanSnippet} isLightBg={true} />
                  {!isContextExpanded && (
                    <div 
                      onClick={() => setIsContextExpanded(true)}
                      className="absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-white via-white/85 to-transparent flex items-end justify-center cursor-pointer pb-0.5"
                    >
                      <span className="text-[10px] font-bold text-[#796AEF] bg-white/95 px-2 py-0.2 rounded-full border border-indigo-100 shadow-2xs">
                        Tap to expand ▾
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Session Status Pill */}
            <div 
              id="tara-session-status-bar"
              className="bg-white border border-slate-200 rounded-2xl px-4 py-2 flex items-center justify-between text-left shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-3 h-3 rounded-full ${
                    state === "speaking"
                      ? "bg-[#796AEF] animate-bounce shadow-[0_0_8px_rgba(121,106,239,0.7)]"
                      : state === "listening"
                      ? "bg-emerald-500 animate-ping shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                      : isActive
                      ? "bg-emerald-500"
                      : "bg-slate-400"
                  }`}
                />
                <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wide">
                  {state === "disconnected" && "Offline • Click Start Call to discuss with Tara Ma'am"}
                  {state === "connecting" && "Connecting live audio stream with Tara Ma'am..."}
                  {state === "idle" && "Ready • Speak your doubt directly into mic"}
                  {state === "listening" && "Listening to your voice..."}
                  {state === "speaking" && "Tara Ma'am is guiding you..."}
                  {state === "error" && "Connection error • Please retry"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#796AEF] font-bold uppercase tracking-wider hidden sm:inline bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                1-on-1 Voice
              </span>
            </div>

            {/* Center Live Voice Stage */}
            <div 
              id="tara-voice-stage"
              className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-center min-h-[200px] relative select-none overflow-hidden shadow-xs"
            >
              {/* Soft ambient background glow */}
              <div className="absolute -top-10 -left-10 w-44 h-44 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />

              {state === "disconnected" && (
                <div className="text-center space-y-3 max-w-sm my-auto animate-fade-in relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-[#796AEF] flex items-center justify-center mx-auto shadow-xs">
                    <Volume2 className="w-8 h-8 stroke-[1.75]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-slate-900 tracking-wide">
                      Live Voice Discussion with Tara Ma'am
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                      Discuss this numerical step-by-step with Tara Ma'am in natural Hinglish or English. Ask questions, clarify formulas, and clear doubts!
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
                    Connecting with Tara Ma'am...
                  </h5>
                </div>
              )}

              {isActive && (
                <div className="w-full flex flex-col items-center justify-between space-y-4 my-auto relative z-10">
                  {/* Equalizer Orbits */}
                  <div className="flex items-center justify-center space-x-8 sm:space-x-12 w-full py-2">
                    {/* User Mic Orbit */}
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 transition-all duration-75 relative shadow-md ${
                          isMuted
                            ? "border-slate-300 bg-slate-100"
                            : "border-indigo-400 bg-indigo-50 shadow-indigo-100"
                        } flex items-center justify-center`}
                        style={{ transform: isMuted ? "none" : `scale(${userVolScale})` }}
                      >
                        {isMuted ? (
                          <MicOff className="w-6 h-6 text-slate-400" />
                        ) : (
                          <Mic className="w-6 h-6 text-[#796AEF]" />
                        )}
                        {!isMuted && state === "listening" && (
                          <span className="absolute inset-0 rounded-full border border-indigo-500 animate-ping opacity-75" />
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 font-sans">
                        {isMuted ? "Mic Muted" : (studentName ? studentName.split(" ")[0] : "You")}
                      </span>
                    </div>

                    {/* Central Audio Waveform Indicator */}
                    <div className="flex items-center gap-1 h-8 px-2">
                      {[1, 2, 3, 4, 5].map((bar) => {
                        const isSpeakingNow = state === "speaking";
                        const isListeningNow = state === "listening";
                        const height = isSpeakingNow
                          ? Math.max(15, (taraVolume * 100 * (bar % 3 + 1)) % 32)
                          : isListeningNow
                          ? Math.max(12, (userVolume * 100 * (bar % 2 + 1)) % 28)
                          : 6;
                        return (
                          <motion.div
                            key={bar}
                            animate={{ height: `${height}px` }}
                            transition={{ duration: 0.08 }}
                            className={`w-1.5 rounded-full ${
                              isSpeakingNow
                                ? "bg-[#796AEF]"
                                : isListeningNow
                                ? "bg-emerald-500"
                                : "bg-slate-300"
                            }`}
                          />
                        );
                      })}
                    </div>

                    {/* Tara Ma'am Orbit */}
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-[#796AEF] bg-indigo-50 flex items-center justify-center transition-all duration-75 relative shadow-md shadow-indigo-100"
                        style={{ transform: `scale(${taraVolScale})` }}
                      >
                        <span className="text-2xl">👩‍🏫</span>
                        {state === "speaking" && (
                          <span className="absolute inset-0 rounded-full border-2 border-[#796AEF] animate-ping opacity-60" />
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-[#796AEF] font-sans">
                        Tara Ma'am
                      </span>
                    </div>
                  </div>

                  {/* Live Transcription Display */}
                  <div 
                    id="tara-transcription-box"
                    className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 text-left text-xs max-h-32 overflow-y-auto space-y-2 shadow-2xs"
                  >
                    {/* User speech */}
                    {userTranscript.text && (
                      <div className="flex items-start gap-2 text-slate-700">
                        <span className="font-bold text-[10px] text-slate-500 uppercase shrink-0 pt-0.5 font-mono">
                          You:
                        </span>
                        <div className="leading-relaxed font-sans italic flex-1 text-slate-800">
                          <MathRenderer text={userTranscript.text} isLightBg={true} />
                        </div>
                      </div>
                    )}

                    {/* Tara speech */}
                    {taraTranscript.text && (
                      <div className="flex items-start gap-2 text-[#796AEF]">
                        <span className="font-bold text-[10px] text-indigo-600 uppercase shrink-0 pt-0.5 font-mono">
                          Tara:
                        </span>
                        <div className="leading-relaxed font-sans font-medium flex-1 text-slate-900">
                          <MathRenderer text={taraTranscript.text} isLightBg={true} />
                        </div>
                      </div>
                    )}

                    {!userTranscript.text && !taraTranscript.text && (
                      <div className="text-center text-slate-500 italic py-1 font-sans">
                        Tara Ma'am is listening. Ask: "Is numerical me step 2 samjhaiye..." 🎙️
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Socratic Question Starters */}
            {isActive && (
              <div className="space-y-1.5 text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#796AEF]" />
                  <span>Tap to Discuss:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Yeh step dobara samjhaiye",
                    "Formula aur units explain karein",
                    "Meri calculation check kijiye",
                    "Agla step kya hona chahiye?",
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendTopicPrompt(chip)}
                      className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-[#796AEF] text-xs font-medium transition-colors cursor-pointer shadow-2xs active:scale-95"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions & Controls */}
            <div 
              id="tara-voice-controls"
              className="pt-2 border-t border-slate-200 flex items-center justify-center gap-3 shrink-0"
            >
              {state === "disconnected" ? (
                <button
                  type="button"
                  id="btn-start-tara-call"
                  onClick={() => connect(initialDiscussionTopic)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-[#796AEF] text-white font-bold text-sm flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-indigo-600 transition-all cursor-pointer shadow-md active:scale-95 min-h-[44px]"
                >
                  <PhoneCall className="w-4.5 h-4.5" />
                  <span>Tara Ma'am se Live Discuss karein</span>
                </button>
              ) : (
                <>
                  {/* Mute Button */}
                  <button
                    type="button"
                    id="btn-toggle-mic-mute"
                    onClick={toggleMute}
                    className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer active:scale-95 min-h-[44px] ${
                      isMuted
                        ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                    title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
                  >
                    {isMuted ? <MicOff className="w-4 h-4 text-rose-600" /> : <Mic className="w-4 h-4 text-[#796AEF]" />}
                    <span>{isMuted ? "Unmute" : "Mute"}</span>
                  </button>

                  {/* Interrupt Button */}
                  {state === "speaking" && (
                    <button
                      type="button"
                      id="btn-interrupt-tara"
                      onClick={stopPlayback}
                      className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 min-h-[44px]"
                      title="Interrupt Tara Ma'am to speak immediately"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Interrupt</span>
                    </button>
                  )}

                  {/* End Call Button */}
                  <button
                    type="button"
                    id="btn-end-tara-call"
                    onClick={handleClose}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 min-h-[44px]"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>End Discussion</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
