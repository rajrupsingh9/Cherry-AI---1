import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Heart, Sparkles, Volume2, CheckCircle2, RotateCcw } from "lucide-react";

interface GuidedBoxBreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartVoiceCall?: () => void;
  studentName?: string;
  triggerReason?: string; // e.g. "Exam Anxiety Detected" or "Study Frustration"
}

type BreathPhase = "inhale" | "holdIn" | "exhale" | "holdOut";

const PHASE_CONFIG: Record<BreathPhase, { label: string; subLabel: string; duration: number; color: string; scale: number }> = {
  inhale: {
    label: "Breathe In (सांस अंदर लें)",
    subLabel: "Slowly through your nose...",
    duration: 4,
    color: "#796AEF",
    scale: 1.4,
  },
  holdIn: {
    label: "Hold (रोकें)",
    subLabel: "Keep your lungs comfortably full...",
    duration: 4,
    color: "#059669",
    scale: 1.4,
  },
  exhale: {
    label: "Breathe Out (धीरे-धीरे छोड़ें)",
    subLabel: "Release all stress through your mouth...",
    duration: 4,
    color: "#0284C7",
    scale: 0.9,
  },
  holdOut: {
    label: "Rest & Relax (शांत रहें)",
    subLabel: "Feel the calm in your chest...",
    duration: 4,
    color: "#6366F1",
    scale: 0.9,
  },
};

const AFFIRMATIONS = [
  "You are bigger than any exam or question paper.",
  "Deep breaths signal your brain that you are completely safe.",
  "One step at a time. Clarity returns with calm.",
  "Mistakes are just data points for learning, not failure.",
  "You have prepared hard, trust your intellect.",
];

export const GuidedBoxBreathingModal: React.FC<GuidedBoxBreathingModalProps> = ({
  isOpen,
  onClose,
  onStartVoiceCall,
  studentName = "",
  triggerReason = "Stress Relief Reset",
}) => {
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [cycleCount, setCycleCount] = useState<number>(1);
  const [affirmationIdx, setAffirmationIdx] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Timer loop for box breathing (4s - 4s - 4s - 4s)
  useEffect(() => {
    if (!isOpen || isCompleted) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Transition to next phase
        setPhase((currentPhase) => {
          if (currentPhase === "inhale") return "holdIn";
          if (currentPhase === "holdIn") return "exhale";
          if (currentPhase === "exhale") return "holdOut";
          
          // Phase was holdOut -> cycle completed!
          setCycleCount((c) => {
            if (c >= 4) {
              setIsCompleted(true);
              return 4;
            }
            return c + 1;
          });
          setAffirmationIdx((a) => (a + 1) % AFFIRMATIONS.length);
          return "inhale";
        });

        return 4;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isCompleted]);

  // Reset when re-opened
  useEffect(() => {
    if (isOpen) {
      setPhase("inhale");
      setSecondsLeft(4);
      setCycleCount(1);
      setIsCompleted(false);
      setAffirmationIdx(Math.floor(Math.random() * AFFIRMATIONS.length));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentConfig = PHASE_CONFIG[phase];
  const firstName = studentName ? studentName.split(" ")[0] : "Friend";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000000] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans">
        
        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl text-slate-900 flex flex-col"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-600 via-[#796AEF] to-violet-600 px-4 py-3 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">
                🧘
              </span>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black tracking-wide">
                  Kiara's 1-Min Mindset Calmer
                </h4>
                <p className="text-[10px] text-indigo-100 font-medium">
                  {triggerReason} • 4-4-4-4 Box Breathing
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Main Visualizer Area */}
          <div className="p-6 sm:p-7 flex flex-col items-center justify-center text-center space-y-5 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50">
            
            {!isCompleted ? (
              <>
                {/* Cycles Indicator */}
                <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-[10.5px] font-mono font-bold text-slate-600 shadow-2xs">
                  <span>Cycle {cycleCount} of 4</span>
                  <span className="text-slate-400">•</span>
                  <span>1 Minute Total</span>
                </div>

                {/* Animated Breathing Orb */}
                <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center my-2 select-none">
                  {/* Outer Pulsing Rings */}
                  <motion.div
                    animate={{
                      scale: currentConfig.scale * 1.15,
                      opacity: phase === "inhale" || phase === "holdIn" ? 0.35 : 0.15,
                    }}
                    transition={{ duration: currentConfig.duration, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-indigo-400 blur-xl pointer-events-none"
                  />

                  {/* Main Expandable Orb */}
                  <motion.div
                    animate={{
                      scale: currentConfig.scale,
                    }}
                    transition={{ duration: currentConfig.duration, ease: "easeInOut" }}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full shadow-lg flex flex-col items-center justify-center text-white relative transition-colors"
                    style={{
                      backgroundColor: currentConfig.color,
                      boxShadow: `0 0 25px ${currentConfig.color}66`,
                    }}
                  >
                    <span className="text-3xl font-black font-mono tracking-tight drop-shadow-xs">
                      {secondsLeft}
                    </span>
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider opacity-90">
                      sec
                    </span>
                  </motion.div>
                </div>

                {/* Phase Instruction Text */}
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {currentConfig.label}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {currentConfig.subLabel}
                  </p>
                </div>

                {/* Mindset Affirmation Card */}
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 text-xs text-indigo-950 font-sans leading-relaxed italic shadow-2xs">
                  "{AFFIRMATIONS[affirmationIdx]}"
                </div>
              </>
            ) : (
              /* Completion Screen */
              <div className="py-4 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.25]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Mindset Re-centered, {firstName}! 🌸
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    Your heart rate and cortisol levels have stabilized. You are now ready to tackle your study problems with high focus!
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCompleted(false);
                      setCycleCount(1);
                      setSecondsLeft(4);
                      setPhase("inhale");
                    }}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Repeat 1-Min</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-[#796AEF] hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Ready to Study 🚀
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Live Discussion Prompt */}
            {onStartVoiceCall && (
              <div className="pt-1 border-t border-slate-100 w-full">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartVoiceCall("Kiara, maine abhi breathing exercise ki hai. Mujhe exam anxiety aur numericals solve karne par live guidance chahiye.");
                  }}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-2xs"
                >
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                  <span>Talk to Kiara Live Voice for Comfort 🎙️</span>
                </button>
              </div>
            )}

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
