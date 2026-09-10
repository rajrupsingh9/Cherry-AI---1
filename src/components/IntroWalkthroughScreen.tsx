import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Volume2,
  CheckCircle2,
  Trophy,
  Zap,
  Sliders,
  Flame,
  Award
} from "lucide-react";
import { getTranslations } from "../utils/i18n";

export interface IntroSlideData {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
}

export const INTRO_SLIDES: IntroSlideData[] = [
  {
    id: "live-teacher",
    stepNumber: 1,
    title: "Live 1-on-1 AI Teacher",
    subtitle: "Ask doubts naturally with multilingual voice and live blackboard steps."
  },
  {
    id: "stem-lab",
    stepNumber: 2,
    title: "Interactive Virtual Lab",
    subtitle: "Visualize Physics, Chemistry & Math in 60 FPS with real-time interactive sliders."
  },
  {
    id: "pyq-radar",
    stepNumber: 3,
    title: "Smart PYQs & Blindspot Radar",
    subtitle: "Spot hidden concept gaps and practice 10-year board exam patterns effortlessly."
  }
];

// --- INFOGRAPH 1: TEACHER & LIVE VOICE CHALKBOARD (Ultra-Premium Socratic Stage) ---
const TeacherInfograph: React.FC = () => {
  return (
    <div className="w-full max-w-[340px] h-[235px] sm:h-[260px] relative mx-auto flex items-center justify-center select-none">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.32, 0.18] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-8 -left-8 w-44 h-44 rounded-full bg-[#796AEF]/30 blur-2xl"
        />
        <motion.div
          animate={{ scale: [1.15, 0.95, 1.15], opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-cyan-400/25 blur-2xl"
        />
      </div>

      {/* Main Glassmorphic Stage Card */}
      <motion.div
        initial={{ y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full rounded-3xl bg-white/95 border border-slate-200/90 shadow-xl shadow-indigo-500/8 p-3 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm"
      >
        {/* Subtle Background Pattern Dots */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#1E293B 1px, transparent 1px)",
            backgroundSize: "16px 16px"
          }}
        />

        {/* TOP STATUS BAR: Live Session Indicator & Multilingual Voice Wave Badge */}
        <div className="flex items-center justify-between z-10">
          {/* Left: Live Socratic AI Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-white shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9.5px] font-bold tracking-wider uppercase">Live AI Teacher</span>
          </div>

          {/* Right: Multilingual Voice Badge with Animated 4-Bar Equalizer */}
          <motion.div
            animate={{ y: [-1, 1, -1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100/90 text-[#796AEF] shadow-xs"
          >
            <Volume2 className="w-3 h-3 text-[#796AEF] stroke-[2.5px]" />
            <span className="text-[10px] font-extrabold tracking-tight">Multilingual 🎙️</span>
            {/* Live Animated Soundwave Bars */}
            <div className="flex items-center gap-[2px] ml-0.5 h-3">
              <motion.div
                animate={{ height: ["4px", "12px", "4px"] }}
                transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut" }}
                className="w-[2px] bg-[#796AEF] rounded-full"
              />
              <motion.div
                animate={{ height: ["8px", "14px", "6px"] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                className="w-[2px] bg-[#796AEF] rounded-full"
              />
              <motion.div
                animate={{ height: ["12px", "5px", "13px"] }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="w-[2px] bg-[#796AEF] rounded-full"
              />
              <motion.div
                animate={{ height: ["5px", "11px", "4px"] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                className="w-[2px] bg-[#796AEF] rounded-full"
              />
            </div>
          </motion.div>
        </div>

        {/* CENTER STAGE: Balanced Split View (Chalkboard + AI Teacher Character) */}
        <div className="flex items-center gap-2.5 my-auto z-10">
          
          {/* LEFT: Deep Emerald Socratic Blackboard */}
          <div className="flex-1 h-[142px] sm:h-[155px] rounded-2xl bg-[#0A1B16] border border-emerald-950/80 shadow-md p-2.5 flex flex-col justify-between relative overflow-hidden select-none">
            {/* Window Dots & Subject Label */}
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-1">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <span className="text-[8px] font-mono font-bold tracking-wider text-emerald-400/90 uppercase">
                Physics • Step-by-Step
              </span>
            </div>

            {/* Blackboard Chalk Math Equations */}
            <div className="space-y-1 my-auto">
              <div className="text-[8.5px] font-mono font-medium text-amber-300 flex items-center gap-1">
                <span>✦</span>
                <span>Energy & Momentum:</span>
              </div>

              {/* Glowing Chalk Formula 1 */}
              <motion.div 
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[11px] sm:text-xs font-mono font-black text-white tracking-wide flex items-center gap-1"
              >
                <span className="text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]">
                  E = h·ν = mc²
                </span>
              </motion.div>

              {/* Formula 2 in Mint Chalk */}
              <div className="text-[9.5px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                <span>λ = h / p</span>
                <span className="text-[7.5px] text-emerald-400/70 font-sans">(de Broglie)</span>
              </div>

              {/* Animated Wave SVG with Sliding Photon Energy Packet */}
              <div className="w-full h-4 relative mt-0.5">
                <svg className="w-full h-full" viewBox="0 0 120 16" fill="none">
                  {/* Sine Wave Curve */}
                  <path
                    d="M 2 8 Q 17 0, 32 8 T 62 8 T 92 8 T 118 8"
                    stroke="#10B981"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.8"
                  />
                  {/* Sliding Photon Particle */}
                  <motion.circle
                    r="2.5"
                    fill="#FDE047"
                    filter="drop-shadow(0 0 3px #FACC15)"
                    animate={{
                      cx: [6, 114, 6],
                      cy: [8, 8, 8],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </svg>
              </div>
            </div>

            {/* Bottom Chalkboard Clarity Badge */}
            <div className="flex items-center justify-between pt-1 border-t border-emerald-900/40">
              <span className="text-[8px] font-mono font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 stroke-[2.5px]" />
                <span>Concept Clarity 100%</span>
              </span>
              <span className="text-[7.5px] font-mono text-slate-400">02:45s</span>
            </div>
          </div>

          {/* RIGHT: AI Teacher Character Avatar with Headset & Speech Bubble */}
          <div className="w-[105px] sm:w-[115px] h-[142px] sm:h-[155px] flex flex-col items-center justify-end relative">
            
            {/* Floating Speech Bubble Above Teacher */}
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 z-20"
            >
              <div className="bg-gradient-to-r from-violet-600 to-[#796AEF] text-white text-[8.5px] font-black px-2 py-1 rounded-xl shadow-md flex items-center gap-1 whitespace-nowrap">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                <span>Doubt clear! 💡</span>
              </div>
              {/* Little speech tail */}
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#796AEF] ml-3" />
            </motion.div>

            {/* Teacher Avatar Vector Graphic */}
            <motion.div
              animate={{ y: [-1.5, 1.5, -1.5] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="w-full flex items-center justify-center relative"
            >
              <svg className="w-[95px] h-[115px] select-none" viewBox="0 0 100 120" fill="none">
                {/* Torso / Blazer in Brand Indigo */}
                <path d="M22 120 C22 86 78 86 78 120 Z" fill="#796AEF" />
                
                {/* White Shirt Collar & Golden Brooch */}
                <path d="M42 90 L50 104 L58 90 Z" fill="#FFFFFF" />
                <circle cx="50" cy="103" r="2.5" fill="#FBBF24" />

                {/* Neck & Head */}
                <rect x="45" y="74" width="10" height="12" rx="3" fill="#FCD34D" />
                <circle cx="50" cy="58" r="19" fill="#FDE68A" />

                {/* Neat Hair with Brand Cyan Highlights */}
                <path d="M31 55 C31 34 69 34 69 55 C69 66 65 76 65 76 C58 74 60 61 50 61 C40 61 42 74 35 76 C35 76 31 66 31 55 Z" fill="#1E293B" />
                <circle cx="50" cy="38" r="4.5" fill="#06B6D4" />

                {/* Eyes & Friendly Smile */}
                <ellipse cx="44" cy="60" rx="1.8" ry="2.2" fill="#1E293B" />
                <ellipse cx="56" cy="60" rx="1.8" ry="2.2" fill="#1E293B" />
                <path d="M47 67 Q50 71 53 67" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                {/* Cute Cheeks Blush */}
                <circle cx="41" cy="63" r="2.5" fill="#FDA4AF" opacity="0.65" />
                <circle cx="59" cy="63" r="2.5" fill="#FDA4AF" opacity="0.65" />

                {/* Modern Wireless Headset & Boom Mic */}
                <path d="M31 56 C28 42 72 42 69 56" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <rect x="28" y="52" width="4" height="10" rx="2" fill="#06B6D4" />
                <rect x="68" y="52" width="4" height="10" rx="2" fill="#06B6D4" />
                {/* Boom Mic */}
                <path d="M32 60 L38 68 L44 68" stroke="#06B6D4" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                <circle cx="45" cy="68" r="1.8" fill="#38BDF8" />

                {/* Left Arm pointing with Stylus Wand toward Blackboard */}
                <path d="M26 102 C15 95 18 78 6 70" stroke="#796AEF" strokeWidth="6" strokeLinecap="round" fill="none" />
                <circle cx="5" cy="69" r="4" fill="#FDE68A" />
                
                {/* Golden Stylus Wand with Sparkling Star */}
                <line x1="4" y1="67" x2="-8" y2="48" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                <motion.circle
                  cx="-8" cy="48" r="3" fill="#FBBF24"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>
          </div>

        </div>

        {/* BOTTOM FEATURE PILLS BAR */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 z-10">
          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-600">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Instant Voice Q&A</span>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-600">
            <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
              Hindi
            </span>
            <span className="text-slate-300">•</span>
            <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
              English
            </span>
            <span className="text-slate-300">•</span>
            <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
              Hinglish
            </span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

// --- INFOGRAPH 2: INTERACTIVE 60 FPS VIRTUAL LAB (Ultra-Premium Stage) ---
const LabInfograph: React.FC = () => {
  return (
    <div className="w-full max-w-[340px] h-[235px] sm:h-[260px] relative mx-auto flex items-center justify-center select-none">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.18, 0.32, 0.18] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-cyan-400/25 blur-2xl"
        />
        <motion.div
          animate={{ scale: [1.15, 0.95, 1.15], opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-8 -left-8 w-44 h-44 rounded-full bg-[#796AEF]/25 blur-2xl"
        />
      </div>

      {/* Main Glassmorphic Stage Card */}
      <motion.div
        initial={{ y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full rounded-3xl bg-white/95 border border-slate-200/90 shadow-xl shadow-indigo-500/8 p-3 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm"
      >
        {/* Subtle Background Pattern Dots */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#1E293B 1px, transparent 1px)",
            backgroundSize: "16px 16px"
          }}
        />

        {/* TOP STATUS BAR */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-white shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[9.5px] font-bold tracking-wider uppercase">Virtual STEM Lab</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-xs">
            <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
            <span className="text-[10px] font-extrabold tracking-tight">60 FPS Physics</span>
          </div>
        </div>

        {/* CENTER STAGE: Split View (Ray Optics Interactive Phone Screen + Chemistry Flask) */}
        <div className="flex items-center gap-2.5 my-auto z-10">
          
          {/* LEFT: Interactive Smartphone Lab Simulation Canvas */}
          <div className="flex-1 h-[142px] sm:h-[155px] rounded-2xl bg-slate-950 border border-slate-800 shadow-md p-2 flex flex-col justify-between relative overflow-hidden select-none">
            {/* Simulation Canvas Viewport */}
            <div className="w-full h-[62px] sm:h-[68px] rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden flex items-center justify-center">
              {/* Axis Line */}
              <div className="absolute w-full h-[1px] bg-slate-700/60" />
              
              {/* Convex Lens Graphic */}
              <div className="w-2.5 h-12 rounded-full bg-cyan-400/40 border border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)] z-10" />

              {/* Laser Beam with Moving Photon Particles */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 68" fill="none">
                {/* Ray from left to lens */}
                <line x1="10" y1="20" x2="80" y2="20" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
                <motion.line
                  x1="10" y1="20" x2="80" y2="20"
                  stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round"
                  strokeDasharray="4,4"
                  animate={{ strokeDashoffset: [0, -16] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Refracted Ray converging to Focal Point */}
                <line x1="80" y1="20" x2="135" y2="48" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
                <motion.line
                  x1="80" y1="20" x2="135" y2="48"
                  stroke="#7DD3FC" strokeWidth="2" strokeLinecap="round"
                  strokeDasharray="4,4"
                  animate={{ strokeDashoffset: [0, -16] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />

                {/* Central Ray */}
                <line x1="10" y1="34" x2="150" y2="34" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="2,2" />

                {/* Focal Point Indicator */}
                <circle cx="135" cy="48" r="3" fill="#F43F5E" />
                <text x="135" y="62" fill="#F43F5E" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">F</text>
              </svg>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-1">
              {/* Slider 1: Focal Length */}
              <div className="flex items-center justify-between bg-slate-900/90 rounded-lg px-2 py-1 border border-slate-800">
                <span className="text-[7.5px] font-mono font-bold text-sky-400">f = 15 cm</span>
                <div className="w-16 h-1.5 bg-slate-800 rounded-full relative overflow-hidden">
                  <motion.div
                    className="absolute top-0 bottom-0 bg-sky-500 rounded-full"
                    animate={{ width: ["30%", "75%", "30%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>

              {/* Slider 2: Resistance */}
              <div className="flex items-center justify-between bg-slate-900/90 rounded-lg px-2 py-1 border border-slate-800">
                <span className="text-[7.5px] font-mono font-bold text-emerald-400">R = 10 Ω</span>
                <div className="w-16 h-1.5 bg-slate-800 rounded-full relative overflow-hidden">
                  <motion.div
                    className="absolute top-0 bottom-0 bg-emerald-500 rounded-full"
                    animate={{ width: ["60%", "25%", "60%"] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  />
                </div>
              </div>
            </div>

            {/* Simulate 60 FPS CTA Bar */}
            <div className="w-full py-1 rounded-md bg-cyan-500/20 border border-cyan-500/30 text-center">
              <span className="text-[8px] font-mono font-bold text-cyan-300">Simulate 60 FPS ⚡</span>
            </div>
          </div>

          {/* RIGHT: Chemistry Reaction & Live Lab Tools */}
          <div className="w-[105px] sm:w-[115px] h-[142px] sm:h-[155px] flex flex-col items-center justify-between relative py-1">
            
            {/* Chemistry Reaction Chip */}
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-full"
            >
              <div className="bg-indigo-50 border border-indigo-100/90 text-indigo-700 text-[8px] font-mono font-black p-1.5 rounded-xl shadow-xs text-center">
                <span>2H₂ + O₂ → 2H₂O</span>
              </div>
            </motion.div>

            {/* Chemistry Flask Graphic with Animated Rising Bubbles */}
            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative my-auto"
            >
              <svg className="w-16 h-20 select-none" viewBox="0 0 60 70" fill="none">
                {/* Flask Body */}
                <path d="M25 10 L25 24 L10 54 C7 58 10 63 15 63 L45 63 C50 63 53 58 50 54 L35 24 L35 10 Z" fill="#FFFFFF" stroke="#796AEF" strokeWidth="2.5" />
                <rect x="22" y="8" width="16" height="4" rx="2" fill="#796AEF" />
                
                {/* Liquid Inside */}
                <path d="M12 50 C18 48 22 52 28 50 C34 48 40 52 48 50 L48 56 C48 60 45 60 42 60 L18 60 C15 60 12 60 12 56 Z" fill="#A855F7" fillOpacity="0.8" />
                
                {/* Rising Chemical Bubbles */}
                <motion.circle
                  cx="22" r="2.5" fill="#C084FC"
                  animate={{ cy: [52, 28, 52], opacity: [0.2, 0.95, 0.2] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="34" r="3" fill="#C084FC"
                  animate={{ cy: [48, 22, 48], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                />
              </svg>
            </motion.div>

            {/* Smooth 60 FPS Badge */}
            <div className="flex items-center gap-1 text-[8.5px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <Sliders className="w-2.5 h-2.5 text-emerald-600" />
              <span>Real-Time</span>
            </div>

          </div>

        </div>

        {/* BOTTOM FEATURE PILLS BAR */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 z-10">
          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-600">
            <Sliders className="w-3 h-3 text-cyan-500 stroke-[2.5px]" />
            <span>Interactive Sliders</span>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-600">
            <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
              Physics
            </span>
            <span className="text-slate-300">•</span>
            <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
              Chemistry
            </span>
            <span className="text-slate-300">•</span>
            <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
              Biology
            </span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

// --- INFOGRAPH 3: PYQs, RADAR & ROADMAP TO TOP SCORES (Ultra-Premium Stage) ---
const RadarInfograph: React.FC = () => {
  return (
    <div className="w-full max-w-[340px] h-[235px] sm:h-[260px] relative mx-auto flex items-center justify-center select-none">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.32, 0.18] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-8 -left-8 w-44 h-44 rounded-full bg-emerald-400/25 blur-2xl"
        />
        <motion.div
          animate={{ scale: [1.15, 0.95, 1.15], opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-amber-400/25 blur-2xl"
        />
      </div>

      {/* Main Glassmorphic Stage Card */}
      <motion.div
        initial={{ y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full rounded-3xl bg-white/95 border border-slate-200/90 shadow-xl shadow-indigo-500/8 p-3 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm"
      >
        {/* Subtle Background Pattern Dots */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#1E293B 1px, transparent 1px)",
            backgroundSize: "16px 16px"
          }}
        />

        {/* TOP STATUS BAR */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-white shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[9.5px] font-bold tracking-wider uppercase">Blindspot Radar</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-600 shadow-xs">
            <Trophy className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-extrabold tracking-tight">10-Yr CBSE PYQs</span>
          </div>
        </div>

        {/* CENTER STAGE: Split View (Radar Trajectory Roadmap + Celebrating Achiever) */}
        <div className="flex items-center gap-2.5 my-auto z-10">
          
          {/* LEFT: Radar Scanner Trajectory Map */}
          <div className="flex-1 h-[142px] sm:h-[155px] rounded-2xl bg-slate-950 border border-slate-800 shadow-md p-2 flex flex-col justify-between relative overflow-hidden select-none">
            {/* Top Radar Coordinates */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <span className="text-[8px] font-mono font-bold text-amber-400 uppercase">
                Radar Scan • Board Prep
              </span>
              <span className="text-[8px] font-mono font-bold text-emerald-400">
                98% Mastery
              </span>
            </div>

            {/* Curving Trajectory SVG with Active Ping Radar Waves */}
            <div className="w-full h-[78px] sm:h-[85px] relative my-auto">
              <svg className="w-full h-full" viewBox="0 0 160 80" fill="none">
                {/* Dotted Trajectory Path */}
                <motion.path
                  d="M 15 65 C 50 65, 45 40, 85 40 C 115 40, 110 18, 140 18"
                  stroke="#796AEF"
                  strokeWidth="2.5"
                  strokeDasharray="5,5"
                  strokeLinecap="round"
                  fill="none"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Waypoint 1: Start Point */}
                <circle cx="15" cy="65" r="5" fill="#1E293B" stroke="#796AEF" strokeWidth="2" />
                <circle cx="15" cy="65" r="2" fill="#FFFFFF" />

                {/* Waypoint 2: Mid Milestone (Formula Gaps) */}
                <circle cx="85" cy="40" r="5" fill="#1E293B" stroke="#06B6D4" strokeWidth="2" />
                <motion.circle
                  cx="85" cy="40" r="8" fill="none" stroke="#06B6D4" strokeWidth="1"
                  animate={{ r: [5, 12], opacity: [0.8, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                />
                <circle cx="85" cy="40" r="2.5" fill="#06B6D4" />

                {/* Waypoint 3: Target Peak with Live Expanding Radar Rings */}
                <motion.circle
                  cx="140" cy="18" r="6" fill="none" stroke="#F43F5E" strokeWidth="1.5"
                  animate={{ r: [6, 16], opacity: [0.8, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.circle
                  cx="140" cy="18" r="6" fill="none" stroke="#F43F5E" strokeWidth="1"
                  animate={{ r: [6, 22], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                />
                <circle cx="140" cy="18" r="5" fill="#F43F5E" />
                <circle cx="140" cy="18" r="2" fill="#FFFFFF" />
              </svg>
            </div>

            {/* Bottom Target Goal Pill */}
            <div className="w-full py-1 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-center">
              <span className="text-[8px] font-mono font-bold text-emerald-300">Target: 95%+ Board Exam 🎯</span>
            </div>
          </div>

          {/* RIGHT: Celebratory Achiever & 10-Yr PYQ Bank Card */}
          <div className="w-[105px] sm:w-[115px] h-[142px] sm:h-[155px] flex flex-col items-center justify-between relative py-1">
            
            {/* 10-Yr PYQ Bank Gold Card */}
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-full"
            >
              <div className="bg-amber-50 border border-amber-200/90 p-1.5 rounded-xl shadow-xs text-center">
                <div className="flex items-center justify-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-500" />
                  <span className="text-[8.5px] font-bold text-slate-800">10-Yr PYQs</span>
                </div>
                <span className="text-[7.5px] font-bold text-emerald-600 block mt-0.5">✓ 100% Solved</span>
              </div>
            </motion.div>

            {/* Celebratory Student Avatar */}
            <motion.div
              animate={{ y: [-1.5, 1.5, -1.5] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-full flex items-center justify-center relative my-auto"
            >
              <svg className="w-[85px] h-[95px] select-none" viewBox="0 0 90 100" fill="none">
                {/* Torso in Cyan */}
                <path d="M22 100 C22 72 68 72 68 100 Z" fill="#06B6D4" />
                
                {/* Head & Neck */}
                <rect x="40" y="58" width="10" height="10" rx="3" fill="#FCD34D" />
                <circle cx="45" cy="46" r="16" fill="#FDE68A" />
                
                {/* Student Blue Cap */}
                <ellipse cx="45" cy="38" rx="17" ry="5" fill="#3B82F6" />
                <path d="M31 38 C31 26 59 26 59 38 Z" fill="#2563EB" />

                {/* Happy Face */}
                <ellipse cx="40" cy="48" rx="1.6" ry="1.6" fill="#1E293B" />
                <ellipse cx="50" cy="48" rx="1.6" ry="1.6" fill="#1E293B" />
                <path d="M42 53 Q45 56 48 53" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                {/* Right Arm raised holding smartphone */}
                <path d="M64 80 C78 70 75 58 84 54" stroke="#06B6D4" strokeWidth="5" strokeLinecap="round" fill="none" />
                <circle cx="85" cy="53" r="3.5" fill="#FDE68A" />
                
                {/* Glowing Smartphone */}
                <rect x="83" y="42" width="10" height="16" rx="2.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="0.8" />
                <motion.rect
                  x="85" y="44" width="6" height="10" rx="1" fill="#38BDF8"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </svg>
            </motion.div>

            {/* Score Pill */}
            <div className="flex items-center gap-1 text-[8.5px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              <Award className="w-2.5 h-2.5 text-amber-500" />
              <span>95+ Percentile</span>
            </div>

          </div>

        </div>

        {/* BOTTOM FEATURE PILLS BAR */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 z-10">
          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-600">
            <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />
            <span>AI Weakness Spotting</span>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-600">
            <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
              Board PYQs
            </span>
            <span className="text-slate-300">•</span>
            <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
              Chapter Maps
            </span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

interface IntroWalkthroughScreenProps {
  onComplete: () => void;
  onSkip: () => void;
  mediumOfLearning?: string;
}

export const IntroWalkthroughScreen: React.FC<IntroWalkthroughScreenProps> = ({
  onComplete,
  onSkip,
  mediumOfLearning,
}) => {
  const t = getTranslations(mediumOfLearning);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const localizedSlides: IntroSlideData[] = [
    {
      id: "live-teacher",
      stepNumber: 1,
      title: t.walkthrough1Title,
      subtitle: t.walkthrough1Subtitle,
    },
    {
      id: "stem-lab",
      stepNumber: 2,
      title: t.walkthrough2Title,
      subtitle: t.walkthrough2Subtitle,
    },
    {
      id: "pyq-radar",
      stepNumber: 3,
      title: t.walkthrough3Title,
      subtitle: t.walkthrough3Subtitle,
    },
  ];

  const slide = localizedSlides[currentSlideIndex] || INTRO_SLIDES[currentSlideIndex];
  const isLastSlide = currentSlideIndex === localizedSlides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  return (
    <div
      id="intro-walkthrough-screen"
      className="w-full h-full min-h-full flex-1 bg-[#F8FAFC] text-[#1E293B] flex flex-col justify-between relative overflow-hidden select-none"
    >
      {/* Dynamic Ambient Background Aura Rings matching active slide theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          key={`ambient-glow-${currentSlideIndex}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: [0.15, 0.28, 0.15],
            scale: [1, 1.18, 1],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-3xl ${
            currentSlideIndex === 0
              ? "bg-[#796AEF]"
              : currentSlideIndex === 1
              ? "bg-cyan-500"
              : "bg-emerald-500"
          }`}
        />
        {/* Subtle Ambient Dot Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#1E293B 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />
      </div>

      {/* Centered Mobile App Container */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between px-5 pt-4 pb-6 z-10 relative">
        
        {/* MAIN SLIDE INFOGRAPH + MINIMAL TEXT CONTENT */}
        <div className="flex-1 flex flex-col justify-center my-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="space-y-4"
            >
              {/* TOP ~55% AREA: RICH INFOGRAPH ARTWORK */}
              <div className="w-full flex items-center justify-center">
                {currentSlideIndex === 0 && <TeacherInfograph />}
                {currentSlideIndex === 1 && <LabInfograph />}
                {currentSlideIndex === 2 && <RadarInfograph />}
              </div>

              {/* MIDDLE AREA: CLEAN, BOLD TITLE + CONCISE 1-2 LINE SUBTITLE */}
              <div className="text-center px-2 space-y-2 pt-1">
                <h2 className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight leading-tight">
                  {slide.title}
                </h2>
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#4A4E5A] max-w-[310px] mx-auto">
                  {slide.subtitle}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* BOTTOM NAVIGATION BAR (Matching brand design system precisely) */}
        <footer className="pt-4 shrink-0">
          {!isLastSlide ? (
            /* SLIDE 1 & 2: SKIP (left) --- PAGINATION PILLS (center) --- NEXT (right) */
            <div className="flex items-center justify-between">
              {/* Skip Button */}
              <button
                type="button"
                onClick={onSkip}
                className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-[#1E293B] py-2 px-3 transition-colors cursor-pointer"
                id="intro-skip-btn"
              >
                {t.skip}
              </button>

              {/* Centered Pagination Pill Indicator */}
              <div className="flex items-center gap-1.5">
                {localizedSlides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentSlideIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className="p-1 -m-1 focus:outline-none cursor-pointer"
                  >
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentSlideIndex
                          ? "w-8 bg-[#796AEF] shadow-xs shadow-[#796AEF]/30"
                          : "w-2 bg-slate-300/80 hover:bg-slate-400/80"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                className="py-2.5 px-6 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-[#796AEF] hover:bg-[#6857e6] text-white shadow-md shadow-[#796AEF]/25 active:scale-95 transition-all cursor-pointer"
                id="intro-next-action-btn"
              >
                {t.next}
              </button>
            </div>
          ) : (
            /* SLIDE 3: FULL-WIDTH PRIMARY "GET STARTED" BUTTON */
            <div className="w-full space-y-3">
              {/* Optional Centered Dots for Last Slide */}
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {localizedSlides.map((s, idx) => (
                  <div
                    key={s.id}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentSlideIndex
                        ? "w-8 bg-[#796AEF] shadow-xs shadow-[#796AEF]/30"
                        : "w-2 bg-slate-300/80"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm uppercase tracking-wider bg-[#796AEF] hover:bg-[#6857e6] text-white shadow-lg shadow-[#796AEF]/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                id="intro-get-started-btn"
              >
                <span>{t.getStarted}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5px]" />
              </button>
            </div>
          )}
        </footer>

      </div>
    </div>
  );
};
