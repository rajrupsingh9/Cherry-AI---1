import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  GraduationCap,
  FlaskConical,
  Brain,
  Zap,
  ChevronRight,
  User,
  Download,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Flame,
  Volume2,
  Atom,
  CheckCircle2,
  Play
} from "lucide-react";

interface MobileAppSplashScreenProps {
  user: any;
  studentDetails: {
    name: string;
    grade: string;
    subject: string;
    board: string;
    mediumOfLearning: string;
  };
  onStartLearning: (selectedGrade?: string, selectedSubject?: string) => void;
  onOpenLogin: () => void;
  onOpenProfile: () => void;
  onOpenClassroom: () => void;
  onOpenLab: () => void;
  onOpenQuiz: () => void;
  onInstallPwa: () => void;
  onSignOut: () => void;
}

const HIGHLIGHT_CAROUSEL = [
  {
    id: "chalkboard",
    tag: "LIVE SOCRATIC TEACHER",
    icon: GraduationCap,
    title: "Real-time Voice & Chalkboard",
    subtitle: "Cherry Ma'am speaks Hinglish, sketches formulas in LaTeX, and clarifies every single doubt dynamically.",
    visual: "🎙️ blackboard + live latex",
    accent: "#796AEF",
    feature: "2-Way Live Voice Audio",
  },
  {
    id: "lab",
    tag: "INTERACTIVE STEM LAB",
    icon: FlaskConical,
    title: "Virtual Science Lab",
    subtitle: "Experiment with Ray Optics, Electric Circuits, pH scales, and Wave Optics with live interactive sliders.",
    visual: "🧪 optics • circuits • ph scale",
    accent: "#796AEF",
    feature: "60 FPS Canvas Lab",
  },
  {
    id: "quiz",
    tag: "SMART QUIZ & BLINDSPOTS",
    icon: Brain,
    title: "Live Quizzes & Blindspot Tracker",
    subtitle: "Instant CBSE / ICSE / State board level questions with Socratic hints and retention curve tracking.",
    visual: "⚡ live score + analytics",
    accent: "#796AEF",
    feature: "Instant Diagnostic",
  },
];

const GRADE_PRESETS = [
  { id: "Class 6", label: "Class 6", sub: "Middle" },
  { id: "Class 7", label: "Class 7", sub: "Middle" },
  { id: "Class 8", label: "Class 8", sub: "Foundation" },
  { id: "Class 9", label: "Class 9", sub: "CBSE/ICSE" },
  { id: "Class 10", label: "Class 10", sub: "Boards" },
  { id: "Class 11", label: "Class 11", sub: "Science" },
  { id: "Class 12", label: "Class 12", sub: "Boards" },
  { id: "NEET", label: "NEET", sub: "Medical" },
  { id: "JEE", label: "JEE", sub: "Engineering" },
];

export const MobileAppSplashScreen: React.FC<MobileAppSplashScreenProps> = ({
  user,
  studentDetails,
  onStartLearning,
  onOpenLogin,
  onOpenProfile,
  onOpenClassroom,
  onOpenLab,
  onOpenQuiz,
  onInstallPwa,
  onSignOut,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedGrade, setSelectedGrade] = useState(studentDetails.grade || "Class 10");
  const [selectedSubject, setSelectedSubject] = useState(studentDetails.subject || "Mathematics");
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance carousel every 4.5 seconds unless user is interacting
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HIGHLIGHT_CAROUSEL.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const currentHighlight = HIGHLIGHT_CAROUSEL[activeSlide];

  return (
    <div
      id="mobile-splash-screen"
      className="w-full min-h-full flex-1 bg-[#F6F7FB] text-[#1E293B] flex flex-col justify-between relative overflow-hidden select-none"
    >
      {/* Main Container - strictly constrained for Native Mobile Ergonomics */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between px-4 pt-3.5 pb-5 z-10 relative">
        
        {/* TOP NATIVE APP BAR */}
        <header className="flex items-center justify-between py-1.5 shrink-0">
          {/* Brand & Live Pill */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#EFF1F5] flex items-center justify-center shadow-xs">
              <span className="text-base">🍒</span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight text-[#1E293B] font-sans">CHERRY AI</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-[#EFF1F5] text-[#796AEF] text-[8.5px] font-sans font-bold uppercase tracking-wider shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#796AEF]" />
                  Live Socratic
                </span>
              </div>
              <p className="text-[9.5px] text-[#4A4E5A] font-sans">1-on-1 AI Teacher</p>
            </div>
          </div>

          {/* Top Right Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              id="splash-pwa-install-btn"
              type="button"
              onClick={onInstallPwa}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-[#EFF1F5] text-[#796AEF] text-[10px] font-sans font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
              title="Install Web App (PWA)"
            >
              <Download className="w-3 h-3 text-[#796AEF]" />
              <span>App</span>
            </button>

            {user ? (
              <button
                id="splash-profile-btn"
                type="button"
                onClick={onOpenProfile}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-[#EFF1F5] text-[#1E293B] text-[10px] font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <User className="w-3 h-3 text-[#796AEF]" />
                <span className="max-w-[70px] truncate">{studentDetails.name || "Student"}</span>
              </button>
            ) : (
              <button
                id="splash-login-btn"
                type="button"
                onClick={onOpenLogin}
                className="px-3 py-1.5 rounded-xl bg-[#796AEF] hover:bg-[#6857ea] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <User className="w-3 h-3" />
                <span>Login</span>
              </button>
            )}
          </div>
        </header>

        {/* HERO INTERACTIVE SHOWCASE (Centered Mobile Stage) */}
        <main
          className="my-auto py-2 flex flex-col items-center text-center space-y-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated Teacher Avatar / Badge Halo */}
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.04, 1],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-white p-1 border border-[#EFF1F5] shadow-sm flex items-center justify-center relative"
            >
              <div className="w-full h-full rounded-[20px] bg-[#F6F7FB] flex flex-col items-center justify-center relative overflow-hidden">
                <span className="text-3xl sm:text-4xl">👩‍🏫</span>
                <span className="text-[8.5px] font-sans font-bold text-[#796AEF] uppercase tracking-wider mt-0.5">Cherry Ma'am</span>
              </div>
            </motion.div>

            {/* Floating live voice badge */}
            <div className="absolute -bottom-2 -right-2 bg-white text-[#796AEF] px-2.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 shadow-xs border border-[#EFF1F5]">
              <Volume2 className="w-2.5 h-2.5 text-[#796AEF]" />
              <span>Hinglish 🎙️</span>
            </div>
          </div>

          {/* Sassy Headline & Socratic Mission */}
          <div className="space-y-1.5 max-w-xs sm:max-w-sm">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1E293B] leading-tight">
              Padhai Jo Sach Me <span className="text-[#796AEF]">Samajh Aaye</span>
            </h1>
            <p className="text-xs text-[#4A4E5A] font-medium leading-relaxed px-1">
              Your 1-on-1 AI Teacher who writes live on a digital chalkboard & solves doubts in real-time voice.
            </p>
          </div>

          {/* DYNAMIC SWIPEABLE / ANIMATED 3-CARD CAROUSEL */}
          <div className="w-full bg-white border border-[#EFF1F5] rounded-2xl p-3.5 shadow-sm text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHighlight.id}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F6F7FB] text-[#796AEF] text-[9px] font-sans font-bold uppercase tracking-wider border border-[#EFF1F5]">
                    <currentHighlight.icon className="w-3 h-3 text-[#796AEF]" />
                    {currentHighlight.tag}
                  </span>
                  <span className="text-[9px] font-sans text-[#4A4E5A] font-semibold">
                    0{activeSlide + 1} / 0{HIGHLIGHT_CAROUSEL.length}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#1E293B] tracking-tight flex items-center gap-1.5">
                    {currentHighlight.title}
                  </h3>
                  <p className="text-xs text-[#4A4E5A] leading-relaxed mt-1 line-clamp-2">
                    {currentHighlight.subtitle}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Dot Indicators */}
            <div className="flex items-center justify-center gap-1.5 mt-3 pt-2.5 border-t border-[#EFF1F5]">
              {HIGHLIGHT_CAROUSEL.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeSlide === idx
                      ? "w-6 bg-[#796AEF]"
                      : "w-1.5 bg-[#EFF1F5] hover:bg-[#796AEF]/30"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 1-TAP CLASS SELECTOR CHIPS */}
          <div className="w-full space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[9.5px] font-sans font-bold uppercase tracking-wider text-[#4A4E5A]">
                Choose Target Grade
              </span>
              <span className="text-[9.5px] font-sans text-[#796AEF] font-bold">
                {selectedGrade}
              </span>
            </div>
            
            <div className="grid grid-cols-5 gap-1.5">
              {GRADE_PRESETS.map((preset) => {
                const isSelected = selectedGrade === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedGrade(preset.id)}
                    className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#796AEF] text-white font-bold border-[#796AEF] shadow-xs scale-102"
                        : "bg-white text-[#4A4E5A] border-[#EFF1F5] hover:bg-slate-50 font-semibold"
                    }`}
                  >
                    <span className="text-[10px] font-bold leading-none">{preset.label.replace("Class ", "Cls ")}</span>
                    <span className={`text-[7.5px] font-sans mt-0.5 leading-none ${isSelected ? "text-white/80" : "text-[#4A4E5A]/70"}`}>
                      {preset.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </main>

        {/* BOTTOM ERGONOMIC THUMB-ACTION DECK */}
        <footer className="space-y-2 pt-2 shrink-0">
          {/* PRIMARY BIG CTA BUTTON */}
          <button
            id="splash-primary-start-btn"
            type="button"
            onClick={() => onStartLearning(selectedGrade, selectedSubject)}
            className="w-full bg-[#796AEF] hover:bg-[#6857ea] active:scale-[0.98] text-white py-3.5 px-5 rounded-2xl font-bold text-sm tracking-wide shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Start Learning Now • शुरू करें</span>
            <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
          </button>

          {/* Quick Sub-actions: Live Classroom / Virtual Lab / Battle Quiz */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              id="splash-quick-desk-btn"
              type="button"
              onClick={() => onStartLearning(selectedGrade, selectedSubject)}
              className="py-2 px-1 rounded-xl bg-white hover:bg-slate-50 border border-[#EFF1F5] text-[#1E293B] text-[10px] font-sans font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <BookOpen className="w-3 h-3 text-[#796AEF]" />
              <span className="truncate">Study Desk</span>
            </button>

            <button
              id="splash-quick-classroom-btn"
              type="button"
              onClick={onOpenClassroom}
              className="py-2 px-1 rounded-xl bg-white hover:bg-slate-50 border border-[#EFF1F5] text-[#1E293B] text-[10px] font-sans font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <GraduationCap className="w-3 h-3 text-[#796AEF]" />
              <span className="truncate">Live Class</span>
            </button>

            <button
              id="splash-quick-lab-btn"
              type="button"
              onClick={onOpenLab}
              className="py-2 px-1 rounded-xl bg-white hover:bg-slate-50 border border-[#EFF1F5] text-[#1E293B] text-[10px] font-sans font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <FlaskConical className="w-3 h-3 text-[#796AEF]" />
              <span className="truncate">STEM Lab</span>
            </button>
          </div>

          {/* Trust Footnote */}
          <div className="flex items-center justify-center gap-2 text-[9.5px] font-sans text-[#4A4E5A] pt-1">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#796AEF]" />
              Free & Open Socratic Learning
            </span>
            <span>•</span>
            <span>CBSE / NCERT / State Boards</span>
          </div>
        </footer>

      </div>
    </div>
  );
};
