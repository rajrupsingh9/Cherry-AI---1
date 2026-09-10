import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Volume2, PenTool, Atom } from "lucide-react";

interface BrandSplashScreenProps {
  onComplete: () => void;
}

export const BrandSplashScreen: React.FC<BrandSplashScreenProps> = ({ onComplete }) => {
  // Auto-progress to next phase after 3.2s
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      id="brand-splash-screen"
      onClick={onComplete}
      className="w-full h-full min-h-full flex-1 bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-between p-5 sm:p-6 relative overflow-hidden select-none cursor-pointer"
    >
      {/* Dynamic Ambient Background Aura Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary Violet Aura Glow */}
        <motion.div
          animate={{
            scale: [1, 1.22, 1],
            opacity: [0.18, 0.32, 0.18],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#796AEF] blur-3xl"
        />

        {/* Soft Golden Amber Secondary Accent Glow */}
        <motion.div
          animate={{
            scale: [1.1, 0.95, 1.1],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-400 blur-3xl"
        />

        {/* Ambient Subtle Grid Dots */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#1E293B 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />

        {/* Floating Twinkle Particle Nodes */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.9, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 left-10 w-2 h-2 rounded-full bg-[#796AEF]/60 blur-[0.5px]"
        />
        <motion.div
          animate={{
            y: [12, -12, 12],
            opacity: [0.4, 0.95, 0.4],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-36 right-12 w-2.5 h-2.5 rounded-full bg-amber-400/70 blur-[0.5px]"
        />
        <motion.div
          animate={{
            y: [-8, 8, -8],
            opacity: [0.25, 0.8, 0.25],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-32 left-16 w-1.5 h-1.5 rounded-full bg-emerald-400/80"
        />
        <motion.div
          animate={{
            y: [10, -10, 10],
            opacity: [0.3, 0.85, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-40 right-14 w-2 h-2 rounded-full bg-[#796AEF]/50"
        />
      </div>

      {/* Top Floating App Header Bar */}
      <header className="w-full flex items-center justify-between z-10 pt-1">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-2xs text-[10.5px] font-sans font-bold text-slate-800"
        >
          {/* Live pulsing radar dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Socratic AI Classroom</span>
          <span className="text-[8.5px] font-black tracking-wider text-[#796AEF] bg-indigo-50 border border-indigo-100/80 px-1.5 py-0.2 rounded-md">
            LIVE
          </span>
        </motion.div>

        {/* Skip button */}
        <motion.button
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="text-[11px] font-sans font-bold text-slate-600 hover:text-slate-900 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-2xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer hover:border-indigo-200 group"
        >
          <span>Skip</span>
          <ArrowRight className="w-3 h-3 text-[#796AEF] group-hover:translate-x-0.5 transition-transform" />
        </motion.button>
      </header>

      {/* Main Center Stage: Animated Logo & Hero Identity */}
      <main className="my-auto flex flex-col items-center text-center z-10 space-y-6 sm:space-y-7 max-w-sm w-full">
        {/* Animated Brand Icon Stage with Sonar Waves */}
        <div className="relative flex items-center justify-center">
          {/* Expanding Sonar Waves */}
          <motion.div
            animate={{
              scale: [1, 1.45, 1.7],
              opacity: [0.4, 0.15, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-[36px] border border-[#796AEF]/30 pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1.5],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.8,
            }}
            className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-[36px] border border-amber-400/25 pointer-events-none"
          />

          {/* Core Floating Brand Icon Squircle */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              damping: 16,
              stiffness: 240,
              delay: 0.1,
            }}
            className="relative"
          >
            {/* Subtle Float Animation */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{
                duration: 3.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-[32px] bg-white p-3 border border-slate-200/90 shadow-xl shadow-[#796AEF]/10 flex items-center justify-center relative overflow-hidden group"
            >
              {/* Sleek diagonal light sheen highlight sweeping across */}
              <motion.div
                animate={{
                  x: ["-140%", "170%"],
                }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-[-25deg] pointer-events-none z-10"
              />

              {/* Inner Stage */}
              <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-slate-50 to-indigo-50/50 flex flex-col items-center justify-center border border-slate-100 relative">
                <motion.span
                  animate={{
                    scale: [1, 1.1, 0.98, 1],
                    rotate: [0, 4, -4, 0],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-5xl sm:text-6xl drop-shadow-sm select-none"
                >
                  🍒
                </motion.span>
              </div>
            </motion.div>

            {/* Top-Right Sparkle Pulse Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 350, damping: 18 }}
              className="absolute -top-2.5 -right-2.5 relative"
            >
              <span className="absolute inset-0 rounded-full bg-[#796AEF] animate-ping opacity-35" />
              <div className="w-8 h-8 rounded-full bg-[#796AEF] text-white flex items-center justify-center shadow-md font-black border-2 border-white relative z-10">
                <motion.div
                  animate={{ rotate: [0, 18, -18, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-4 h-4 fill-white" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Brand Name Typography */}
        <div className="space-y-2 w-full">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-2"
          >
            <h1 className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>CHERRY</span>
              <span className="text-[#796AEF] relative">
                AI
                {/* Micro glowing underline dot */}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-[#796AEF]/40" />
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[10.5px] sm:text-xs font-black tracking-[0.24em] text-slate-500 uppercase"
          >
            THE 1-ON-1 SOCRATIC CLASSROOM
          </motion.p>

          {/* Interactive Modern Feature Pill Badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-2 flex flex-wrap items-center justify-center gap-2"
          >
            {/* Pill 1: Multilingual Voice with Live Audio Equalizer Waves */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-2xs text-[11px] font-bold text-[#796AEF]">
              <Volume2 className="w-3.5 h-3.5 text-[#796AEF]" />
              <span>Multilingual Voice</span>
              {/* Dynamic Soundwave Bars */}
              <div className="flex items-center gap-0.5 h-3.5 px-0.5 ml-0.5">
                <motion.span
                  animate={{ height: ["4px", "14px", "5px", "12px", "4px"] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-[2.5px] bg-[#796AEF] rounded-full"
                />
                <motion.span
                  animate={{ height: ["12px", "5px", "14px", "7px", "12px"] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="w-[2.5px] bg-[#796AEF] rounded-full"
                />
                <motion.span
                  animate={{ height: ["6px", "13px", "4px", "14px", "6px"] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  className="w-[2.5px] bg-[#796AEF] rounded-full"
                />
              </div>
            </div>

            {/* Pill 2: Live Chalkboard */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-2xs text-[11px] font-bold text-slate-700">
              <PenTool className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Chalkboard</span>
            </div>

            {/* Pill 3: STEM Lab with Spinning Atom */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-2xs text-[11px] font-bold text-slate-700">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Atom className="w-3.5 h-3.5 text-amber-500" />
              </motion.div>
              <span>STEM Lab</span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Bottom Progress Bar & Tap to Continue */}
      <footer className="w-full flex flex-col items-center z-10 pb-3 space-y-2.5">
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-[11.5px] font-sans font-bold text-slate-600 tracking-wide flex items-center gap-1.5"
        >
          <span>Tap anywhere to continue</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#796AEF]" />
        </motion.div>

        {/* Premium Dynamic Progress Loader Track */}
        <div className="w-44 h-1.5 bg-slate-200/80 rounded-full overflow-hidden relative shadow-inner">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.2, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-[#796AEF] via-indigo-500 to-[#796AEF] rounded-full relative"
          >
            {/* Leading Glow Pip */}
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-xs" />
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

