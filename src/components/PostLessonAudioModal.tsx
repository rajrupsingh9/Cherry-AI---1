import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Sparkles,
  Headphones,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Volume2,
  Clock,
  ArrowRight,
  Radio,
  FileText,
} from "lucide-react";
import { generateAudioPodcast, getSavedPodcasts } from "../services/podcastService";
import { PodcastLanguage } from "../types";

export interface PostLessonSessionData {
  topic: string;
  subject?: string;
  grade?: string;
  customBoardContent?: string;
  sessionId?: string;
}

export interface PostLessonAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: PostLessonSessionData | null;
  mediumOfLearning?: string;
  onGoToRevisionHub?: () => void;
  onToast?: (message: string, type: "success" | "info" | "warning" | "error") => void;
}

export const PostLessonAudioModal: React.FC<PostLessonAudioModalProps> = ({
  isOpen,
  onClose,
  sessionData,
  mediumOfLearning,
  onGoToRevisionHub,
  onToast,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const resolvedLang: PodcastLanguage = (() => {
    const medium = (mediumOfLearning || "").trim().toLowerCase();
    if (medium.includes("hindi") || medium === "हिंदी") return "Hindi";
    if (medium.includes("english")) return "English";
    return "Hinglish";
  })();

  if (!isOpen || !sessionData) return null;

  const topicTitle = sessionData.topic || "Classroom Session Recap";
  const subjectName = sessionData.subject || "Science";
  const gradeName = sessionData.grade || "Class 10-12";

  const handleGenerateAndPlay = async () => {
    setIsGenerating(true);
    if (onToast) {
      onToast("🎙️ Preparing 2-Host Dual-Voice Audio Summary with Aarav Sir & Riya...", "info");
    }

    try {
      // Check cache first
      const saved = getSavedPodcasts();
      const existing = saved.find(
        (p) =>
          p.topic.toLowerCase().trim() === topicTitle.toLowerCase().trim() &&
          p.language === resolvedLang
      );

      let podcastData;
      if (existing) {
        podcastData = existing;
      } else {
        podcastData = await generateAudioPodcast({
          topic: topicTitle,
          subject: subjectName,
          grade: gradeName,
          language: resolvedLang,
          notesOrDocumentText: sessionData.customBoardContent || "",
          episodeType: "quick_revision",
          targetDurationMins: 8,
        });
      }

      // Close post-lesson modal and open podcast player
      onClose();
      window.dispatchEvent(
        new CustomEvent("cherry_open_audio_podcast", { detail: podcastData })
      );

      if (onToast) {
        onToast("🎉 Quick Audio Summary ready! Enjoy listening.", "success");
      }
    } catch (err: any) {
      console.error("[PostLessonAudioModal] Failed to generate summary:", err);
      if (onToast) {
        onToast("Could not generate audio summary. Please try again from Revision Hub!", "error");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        id="post-lesson-audio-modal-backdrop"
        className="fixed inset-0 z-[120] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white border border-[#EFF1F5] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col my-auto relative text-left"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-[#796AEF] to-[#5a48e4] p-5 sm:p-6 text-white relative overflow-hidden">
            {/* Background decorative circles */}
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-black/10 blur-lg pointer-events-none" />

            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-inner">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/25 text-[10px] font-mono font-black uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                    <span>CLASS COMPLETED</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-sans font-black tracking-tight leading-tight">
                    Lesson Archived & Saved!
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/90 font-medium mt-3 leading-relaxed relative z-10">
              Your chalkboard notes and derivation steps have been securely compiled into your{" "}
              <strong className="text-white underline decoration-white/40">Past Lecture Books</strong>.
            </p>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Current Lesson Badge Card */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#EFF1F5] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#796AEF] bg-[#EEF2FF] px-2 py-0.5 rounded-md border border-[#796AEF]/20">
                    {subjectName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">
                    {gradeName}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#1E293B] truncate">
                  {topicTitle}
                </h4>
              </div>

              <div className="w-8 h-8 rounded-xl bg-white border border-[#EFF1F5] flex items-center justify-center text-[#796AEF] shrink-0 shadow-2xs">
                <FileText className="w-4 h-4" />
              </div>
            </div>

            {/* Feature Highlight: 2-Minute Dual-Voice Audio Summary */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] border border-[#796AEF]/30 space-y-3 relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#796AEF] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Headphones className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-[#1E293B] uppercase tracking-wide">
                      2-Minute Audio Recap
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-black bg-[#796AEF] text-white">
                      AI PODCAST
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    A conversational recap by <strong>Aarav Sir</strong> & <strong>Riya</strong> breaking down the key formulas, real-life intuitions, and exam traps from this exact chalkboard session.
                  </p>
                </div>
              </div>

              {/* Student Profile Language Badge */}
              <div className="pt-2 border-t border-[#796AEF]/20 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  Profile Language:
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-[#796AEF]/10 text-[#796AEF] border border-[#796AEF]/20">
                  {resolvedLang}
                </span>
              </div>

              {/* One-Click Generate & Play CTA */}
              <button
                type="button"
                onClick={handleGenerateAndPlay}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-[#796AEF] hover:bg-[#6858e0] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Generating Audio Summary (~5 sec)...</span>
                  </>
                ) : (
                  <>
                    <Radio className="w-4 h-4" />
                    <span>Generate & Listen Audio Recap 🎧</span>
                  </>
                )}
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex items-center gap-2 pt-1">
              {onGoToRevisionHub && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onGoToRevisionHub();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#EFF1F5] hover:border-slate-300 bg-white text-slate-700 hover:text-slate-900 text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#796AEF]" />
                  <span>Revision Hub</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 rounded-xl border border-[#EFF1F5] hover:bg-slate-100 text-slate-500 text-xs font-bold font-mono transition-all cursor-pointer"
              >
                Close & Continue
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
