import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Sparkles, AlertTriangle, Lightbulb, Play, Pause, RotateCcw } from "lucide-react";
import { CherrySimObservation } from "./labTypes";

interface CherrySimObservationCardProps {
  observation: CherrySimObservation;
  activeTopic: string;
  activeParams: Record<string, number>;
}

export const CherrySimObservationCard: React.FC<CherrySimObservationCardProps> = ({
  observation,
  activeTopic,
  activeParams,
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handleToggleVoice = () => {
    if (!synthRef.current) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    synthRef.current.cancel(); // Stop any pending speech

    const cleanText = observation.hinglishGuide
      .replace(/\\[a-zA-Z]+/g, "") // remove LaTeX command slashes
      .replace(/[\$\{\}\^\_]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // Friendly conversational pace
    utterance.pitch = 1.1; // Warm teacher pitch

    // Try to find Hindi/Indian English voice if available
    const voices = synthRef.current.getVoices();
    const hindiVoice = voices.find((v) => v.lang.includes("hi") || v.lang.includes("IN") || v.name.includes("India"));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const handleStopVoice = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EFF1F5] p-4 sm:p-5 shadow-xs relative overflow-hidden">
      {/* Decorative Accent Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#EEF2FF]/60 rounded-full blur-2xl pointer-events-none" />

      {/* Header with Cherry Ma'am Avatar */}
      <div className="flex items-center justify-between gap-3 mb-3 border-b border-[#EFF1F5] pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-[#796AEF] flex items-center justify-center text-lg shadow-xs border border-[#796AEF]/30 text-white">
              👩‍🏫
            </div>
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#796AEF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#796AEF]"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-[#1E293B] tracking-tight">Cherry Ma'am's Observation Card</h4>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#EEF2FF] text-[#796AEF] border border-[#796AEF]/30 rounded-full">
                Live AI Guide
              </span>
            </div>
            <p className="text-[11px] text-[#4A4E5A] font-medium">Scientific Intuition & Exam Tips in Hinglish</p>
          </div>
        </div>

        {/* Voice Play/Pause Trigger */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleToggleVoice}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isSpeaking
                ? "bg-[#796AEF] hover:bg-[#6858e0] text-white shadow-[#796AEF]/30 animate-pulse"
                : "bg-[#EEF2FF] hover:bg-[#e0e7ff] text-[#796AEF] border border-[#796AEF]/30"
            }`}
            title={isSpeaking ? "Pause Voice Guide" : "Listen to Cherry Ma'am speak"}
          >
            {isSpeaking ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeaking ? "Speaking..." : "🎙️ Listen"}</span>
          </button>

          {isSpeaking && (
            <button
              onClick={handleStopVoice}
              className="p-1.5 bg-slate-100 text-[#4A4E5A] hover:bg-slate-200 rounded-lg border border-[#EFF1F5] text-xs cursor-pointer"
              title="Stop audio"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Primary Law Badge */}
      <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EEF2FF] border border-[#796AEF]/30 text-[11px] text-[#1E293B] font-semibold">
        <Sparkles className="w-3.5 h-3.5 text-[#796AEF] shrink-0" />
        <span>Governing Principle: <span className="text-[#796AEF] font-black">{observation.keyRuleLaw}</span></span>
      </div>

      {/* Live Hinglish Teacher Narrative */}
      <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#EFF1F5] text-xs text-[#1E293B] leading-relaxed font-sans relative mb-3">
        <p className="font-medium text-[#1E293B]">{observation.hinglishGuide}</p>
      </div>

      {/* Key Things to Observe */}
      {observation.whatToObserve && observation.whatToObserve.length > 0 && (
        <div className="mb-3 space-y-1.5">
          <div className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-600" />
            What to Observe as you move sliders:
          </div>
          <ul className="space-y-1 text-xs text-[#4A4E5A]">
            {observation.whatToObserve.map((obs, i) => (
              <li key={i} className="flex items-start gap-2 bg-[#F8FAFC] p-2 rounded-lg border border-[#EFF1F5]">
                <span className="text-[#796AEF] font-bold">•</span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Exam Pitfall / Trap Callout */}
      {observation.examTrap && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-900 mr-1">⚠️ Board / Competitive Exam Trap:</span>
            <span>{observation.examTrap}</span>
          </div>
        </div>
      )}

      {/* Pro-Tip */}
      {observation.proTip && (
        <div className="mt-2.5 text-[11px] text-[#796AEF] italic flex items-center gap-1.5">
          <span className="font-bold text-[#1E293B]">💡 Cherry's Pro-Tip:</span>
          <span>{observation.proTip}</span>
        </div>
      )}
    </div>
  );
};
