import React, { useState } from "react";
import { Send, Sparkles, HelpCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getTranslations } from "../utils/i18n";

interface QuickDoubtWidgetProps {
  state: string;
  onInjectPrompt: (text: string) => void;
  onToast: (message: string, type: "success" | "info" | "warning" | "error") => void;
  setDialogueHistory?: React.Dispatch<React.SetStateAction<Array<{ id?: string; sender: "user" | "cherry" | "system"; text: string }>>>;
  isVisible?: boolean;
  onClose?: () => void;
  mediumOfLearning?: string;
}

export const QuickDoubtWidget: React.FC<QuickDoubtWidgetProps> = ({
  state,
  onInjectPrompt,
  onToast,
  setDialogueHistory,
  isVisible,
  onClose,
  mediumOfLearning,
}) => {
  const [doubtText, setDoubtText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const t = getTranslations(mediumOfLearning);

  // Quick contextual doubts
  const quickQuestions = [
    "Ma'am please explain again in simple words!",
    "Can you show a real-life example of this?",
    "Is this topic important for board exams?",
    "Ma'am I didn't understand this step!",
  ];

  const handleSendDoubt = (textToSend?: string) => {
    const text = textToSend || doubtText;
    if (!text.trim()) return;

    const formattedPrompt = `[STUDENT QUICK DOUBT DURING LIVE CLASS]: "${text.trim()}". Cherry Ma'am, please answer this briefly in your witty interactive style!`;
    
    // Add to dialogue history UI directly
    setDialogueHistory?.((prev) => [
      ...prev,
      {
        id: "msg_" + Date.now(),
        sender: "user",
        text: `💡 Quick Doubt: ${text.trim()}`,
      },
    ]);

    // Send prompt to Gemini Live session if connected
    if (state === "speaking" || state === "listening" || state === "idle") {
      onInjectPrompt(formattedPrompt);
      onToast("Quick doubt sent to Cherry Ma'am! 💡", "success");
    } else {
      onToast("Doubt logged! Connect live class to ask Cherry Ma'am 🎙️", "info");
    }

    setDoubtText("");
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      if (onClose) {
        onClose();
      } else {
        setIsOpen(false);
      }
    }, 1200);
  };

  const activeVisible = isVisible !== undefined ? isVisible : isOpen;
  const handleClose = onClose || (() => setIsOpen(false));

  return (
    <>
      {/* Floating launcher if standalone */}
      {isVisible === undefined && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 left-4 md:bottom-8 md:left-8 z-40 bg-[#796AEF] hover:bg-[#6858e0] text-white px-3.5 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer border border-white/20 select-none"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{t.quickDoubt}</span>
        </button>
      )}

      <AnimatePresence>
        {activeVisible && (
          <div className="fixed bottom-20 left-4 md:bottom-8 md:left-8 z-50 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: "spring", damping: 22, stiffness: 320 }}
              className="w-[310px] sm:w-[360px] bg-white rounded-2xl shadow-xl border border-[#EFF1F5] overflow-hidden text-left flex flex-col"
            >
              {/* Header */}
              <div className="bg-[#796AEF] text-white p-3.5 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-xl text-white">
                    <HelpCircle className="w-4 h-4 font-black" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-white leading-none">{t.askDoubtTitle}</h4>
                    <p className="text-[9px] text-white/80 font-bold tracking-wide mt-0.5">{t.askDoubtSubtitle}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-white/20 text-white/80 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title={t.closeBtn}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-3.5 space-y-3 bg-[#F6F7FB]">
                {isSubmitted ? (
                  <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <p className="text-xs font-extrabold text-[#1E293B]">{t.doubtSentTitle}</p>
                    <p className="text-[10px] text-[#4A4E5A] font-medium">{t.doubtSentSubtitle}</p>
                  </div>
                ) : (
                  <>
                    {/* Quick Chips */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#4A4E5A] block">
                        {t.quickSuggestions}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {quickQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendDoubt(q)}
                            className="text-[10px] bg-white hover:bg-[#796AEF] hover:text-white text-[#1E293B] px-2.5 py-1 rounded-lg border border-[#EFF1F5] transition-all active:scale-95 text-left shadow-2xs font-medium cursor-pointer"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Input Form */}
                    <div className="space-y-2 pt-1 border-t border-[#EFF1F5]">
                      <div className="relative">
                        <textarea
                          value={doubtText}
                          onChange={(e) => setDoubtText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendDoubt();
                            }
                          }}
                          placeholder={t.doubtPlaceholder}
                          rows={2}
                          className="w-full text-xs bg-white text-[#1E293B] placeholder-slate-400 p-2.5 pr-9 rounded-xl border border-[#EFF1F5] focus:outline-none focus:border-[#796AEF] focus:ring-1 focus:ring-[#796AEF] resize-none font-sans"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSendDoubt()}
                          disabled={!doubtText.trim()}
                          className={`absolute right-2 bottom-3.5 p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                            doubtText.trim()
                              ? "bg-[#796AEF] text-white hover:bg-[#6858e0] shadow-2xs active:scale-95"
                              : "bg-slate-100 text-slate-300 cursor-not-allowed"
                          }`}
                          title={t.sendBtn}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-[#4A4E5A]">
                        <span>{t.pressEnterToSend}</span>
                        <span>{t.nonInterruptingVoice}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
