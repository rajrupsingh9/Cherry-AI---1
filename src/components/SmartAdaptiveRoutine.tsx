import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, Clock, CheckCircle2, Play, Pause, RotateCcw,
  Sparkles, Sliders, Volume2, VolumeX, Flame, BookOpen,
  ArrowRight, Check, Plus, Trash2, Bell, Coffee, Brain,
  ChevronDown, ChevronUp, Zap, HelpCircle, Target
} from "lucide-react";

export interface RoutineSlot {
  id: string;
  time: string;
  title: string;
  detail: string;
  tag: string;
  category: "focus" | "school" | "break" | "revision" | "sleep" | "mindset";
  color: string;
  completed: boolean;
  durationMins: number;
}

export type RoutineProfile = "school_day" | "exam_sprint" | "weekend_deep" | "night_owl";

interface SmartAdaptiveRoutineProps {
  studentName?: string;
  grade?: string;
  subject?: string;
  board?: string;
  onNavigateToClassroom?: () => void;
  onStartVoiceCall?: (initialTopic?: string) => void;
  onAskKiaraCustomRoutine?: (query: string) => void;
}

const DEFAULT_SLOTS: Record<RoutineProfile, RoutineSlot[]> = {
  school_day: [
    {
      id: "sd-1",
      time: "06:30 AM - 07:00 AM",
      title: "🌅 Morning Mindset & Calm Breathing",
      detail: "1-min box breathing to normalize cortisol + review 3 core formula cards.",
      tag: "Mindset",
      category: "mindset",
      color: "border-emerald-300 bg-emerald-50 text-emerald-900",
      completed: false,
      durationMins: 30,
    },
    {
      id: "sd-2",
      time: "07:00 AM - 08:15 AM",
      title: "⚡ Slot 1: Peak Brain Power (Toughest Topic)",
      detail: "Toughest concepts & derivations when cognitive stamina is at 100%.",
      tag: "High Focus",
      category: "focus",
      color: "border-indigo-300 bg-indigo-50 text-indigo-900",
      completed: false,
      durationMins: 75,
    },
    {
      id: "sd-3",
      time: "08:30 AM - 02:30 PM",
      title: "🏫 School & Structured Offline Classes",
      detail: "Active listening. Jot down any confusing question in your scratchpad.",
      tag: "School",
      category: "school",
      color: "border-blue-300 bg-blue-50 text-blue-900",
      completed: false,
      durationMins: 360,
    },
    {
      id: "sd-4",
      time: "03:30 PM - 04:30 PM",
      title: "🎓 Slot 2: Cherry Ma'am Live Interactive Class",
      detail: "Live blackboard session with Cherry Ma'am, step-by-step Socratic intuition.",
      tag: "Classroom",
      category: "focus",
      color: "border-emerald-300 bg-emerald-50 text-emerald-900",
      completed: false,
      durationMins: 60,
    },
    {
      id: "sd-5",
      time: "05:00 PM - 05:45 PM",
      title: "🏃 Refreshment & Active Recovery Break",
      detail: "Hydrate, outdoor walk, or light exercise. Essential for memory consolidation.",
      tag: "Recharge",
      category: "break",
      color: "border-amber-300 bg-amber-50 text-amber-900",
      completed: false,
      durationMins: 45,
    },
    {
      id: "sd-6",
      time: "06:15 PM - 07:45 PM",
      title: "🧮 Slot 3: Calculation & Numerical Practice",
      detail: "Step-by-step PYQ numerical solving. Check signs and algebra carefully!",
      tag: "Practice",
      category: "focus",
      color: "border-purple-300 bg-purple-50 text-purple-900",
      completed: false,
      durationMins: 90,
    },
    {
      id: "sd-7",
      time: "08:30 PM - 09:15 PM",
      title: "💡 Slot 4: 25-Min Spaced Recall & Mnemonics",
      detail: "Rapid review of mistakes, tricky definitions, and mnemonic acronyms.",
      tag: "Recall",
      category: "revision",
      color: "border-sky-300 bg-sky-50 text-sky-900",
      completed: false,
      durationMins: 45,
    },
    {
      id: "sd-8",
      time: "10:15 PM - 06:30 AM",
      title: "😴 Deep Memory Consolidation Sleep",
      detail: "8 hours uninterrupted sleep converts short-term memory to long-term mastery.",
      tag: "Sleep",
      category: "sleep",
      color: "border-slate-300 bg-slate-100 text-slate-700",
      completed: false,
      durationMins: 495,
    },
  ],
  exam_sprint: [
    {
      id: "es-1",
      time: "06:00 AM - 06:30 AM",
      title: "🌅 Quick Warmup & Formula Recall",
      detail: "Glance at formula sheet + 2 mins calm visualization.",
      tag: "Warmup",
      category: "mindset",
      color: "border-emerald-300 bg-emerald-50 text-emerald-900",
      completed: false,
      durationMins: 30,
    },
    {
      id: "es-2",
      time: "06:45 AM - 09:45 AM",
      title: "📝 Mock Exam Simulation Sprint (3 Hours)",
      detail: "Simulate exact board exam conditions without any distractions.",
      tag: "Timed Exam",
      category: "focus",
      color: "border-rose-300 bg-rose-50 text-rose-900",
      completed: false,
      durationMins: 180,
    },
    {
      id: "es-3",
      time: "10:30 AM - 12:30 PM",
      title: "🔍 Error Analysis & Trap Identification",
      detail: "Find why mistakes happened: calculation rush or conceptual gap.",
      tag: "Analysis",
      category: "focus",
      color: "border-amber-300 bg-amber-50 text-amber-900",
      completed: false,
      durationMins: 120,
    },
    {
      id: "es-4",
      time: "02:30 PM - 04:30 PM",
      title: "🎓 Weak-Spot Patching with Cherry & Tara Ma'am",
      detail: "Clear remaining doubts on blackboard before final revisions.",
      tag: "Remediation",
      category: "focus",
      color: "border-indigo-300 bg-indigo-50 text-indigo-900",
      completed: false,
      durationMins: 120,
    },
    {
      id: "es-5",
      time: "06:00 PM - 08:00 PM",
      title: "⚡ High-Yield PYQ Speed Drill",
      detail: "Solve 15 past-year questions against the timer.",
      tag: "Speed Drill",
      category: "revision",
      color: "border-purple-300 bg-purple-50 text-purple-900",
      completed: false,
      durationMins: 120,
    },
    {
      id: "es-6",
      time: "09:30 PM - 06:00 AM",
      title: "😴 Restorative Sleep (No Late Night Cramming)",
      detail: "Cramming degrades recall by 40%. Sleep keeps mind sharp for exam day.",
      tag: "Sleep",
      category: "sleep",
      color: "border-slate-300 bg-slate-100 text-slate-700",
      completed: false,
      durationMins: 510,
    },
  ],
  weekend_deep: [
    {
      id: "wd-1",
      time: "07:30 AM - 08:15 AM",
      title: "☕ Relaxed Morning & Day Planning",
      detail: "Set 3 prioritized micro-goals with Kiara for the day.",
      tag: "Planning",
      category: "mindset",
      color: "border-emerald-300 bg-emerald-50 text-emerald-900",
      completed: false,
      durationMins: 45,
    },
    {
      id: "wd-2",
      time: "08:30 AM - 11:30 AM",
      title: "⚡ Deep Work Block A: Heavy Theory & Derivations",
      detail: "Comprehensive study block with 2 × 25-min Pomodoro cycles.",
      tag: "Deep Work",
      category: "focus",
      color: "border-indigo-300 bg-indigo-50 text-indigo-900",
      completed: false,
      durationMins: 180,
    },
    {
      id: "wd-3",
      time: "01:30 PM - 03:30 PM",
      title: "🧮 Deep Work Block B: Numerical Marathon",
      detail: "Solve full chapter exercise without checking answer keys early.",
      tag: "Numericals",
      category: "focus",
      color: "border-purple-300 bg-purple-50 text-purple-900",
      completed: false,
      durationMins: 120,
    },
    {
      id: "wd-4",
      time: "04:30 PM - 06:30 PM",
      title: "🏃 Social & Outdoor Activity",
      detail: "Recharge dopamine receptors with physical recreation.",
      tag: "Break",
      category: "break",
      color: "border-amber-300 bg-amber-50 text-amber-900",
      completed: false,
      durationMins: 120,
    },
    {
      id: "wd-5",
      time: "07:30 PM - 09:00 PM",
      title: "💡 Weekly Chapter Recap & Cheatsheet Creation",
      detail: "Synthesize notes into a single high-impact 1-page summary.",
      tag: "Synthesis",
      category: "revision",
      color: "border-sky-300 bg-sky-50 text-sky-900",
      completed: false,
      durationMins: 90,
    },
    {
      id: "wd-6",
      time: "10:30 PM - 07:30 AM",
      title: "😴 Full Recovery Sleep",
      detail: "Consolidate week's learning into permanent mental nodes.",
      tag: "Sleep",
      category: "sleep",
      color: "border-slate-300 bg-slate-100 text-slate-700",
      completed: false,
      durationMins: 540,
    },
  ],
  night_owl: [
    {
      id: "no-1",
      time: "09:00 AM - 09:30 AM",
      title: "☕ Late Morning Awakening & Hydration",
      detail: "Sunlight exposure & quick cognitive stretch.",
      tag: "Morning",
      category: "mindset",
      color: "border-emerald-300 bg-emerald-50 text-emerald-900",
      completed: false,
      durationMins: 30,
    },
    {
      id: "no-2",
      time: "10:00 AM - 01:00 PM",
      title: "🏫 School / Daily Chores Block",
      detail: "Complete essential daytime duties & classes.",
      tag: "Daytime",
      category: "school",
      color: "border-blue-300 bg-blue-50 text-blue-900",
      completed: false,
      durationMins: 180,
    },
    {
      id: "no-3",
      time: "03:00 PM - 05:00 PM",
      title: "🎓 Afternoon Classroom Session",
      detail: "Attend Cherry Ma'am's interactive lecture & resolve conceptual doubts.",
      tag: "Class",
      category: "focus",
      color: "border-indigo-300 bg-indigo-50 text-indigo-900",
      completed: false,
      durationMins: 120,
    },
    {
      id: "no-4",
      time: "08:00 PM - 10:30 PM",
      title: "🌙 Night Sprint 1: High-Focus Numericals",
      detail: "Silent night hours: peak concentration without notification pings.",
      tag: "Night Sprint",
      category: "focus",
      color: "border-purple-300 bg-purple-50 text-purple-900",
      completed: false,
      durationMins: 150,
    },
    {
      id: "no-5",
      time: "11:00 PM - 01:00 AM",
      title: "💡 Night Sprint 2: Formulas & Mnemonics",
      detail: "2 × 25-min Pomodoro rounds of deep recall before sleep.",
      tag: "Late Focus",
      category: "revision",
      color: "border-sky-300 bg-sky-50 text-sky-900",
      completed: false,
      durationMins: 120,
    },
    {
      id: "no-6",
      time: "01:30 AM - 09:00 AM",
      title: "😴 Restful Sleep",
      detail: "7.5 hours consistent night-owl sleep schedule.",
      tag: "Sleep",
      category: "sleep",
      color: "border-slate-300 bg-slate-100 text-slate-700",
      completed: false,
      durationMins: 450,
    },
  ],
};

const STORAGE_KEY = "cherry_kiara_interactive_routine_v1";

export const SmartAdaptiveRoutine: React.FC<SmartAdaptiveRoutineProps> = ({
  studentName = "Student",
  grade = "10",
  subject = "Mathematics",
  board = "CBSE",
  onNavigateToClassroom,
  onStartVoiceCall,
  onAskKiaraCustomRoutine,
}) => {
  const [profile, setProfile] = useState<RoutineProfile>("school_day");
  const [slots, setSlots] = useState<RoutineSlot[]>(DEFAULT_SLOTS.school_day);
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false);

  // Custom user inputs for dynamic routine recalculation
  const [schoolHours, setSchoolHours] = useState<string>("08:00 AM - 02:30 PM");
  const [targetFocusSubject, setTargetFocusSubject] = useState<string>(subject);
  const [dailyFocusGoalHrs, setDailyFocusGoalHrs] = useState<number>(3);

  // Pomodoro Focus Engine State
  const [isPomodoroActive, setIsPomodoroActive] = useState<boolean>(false);
  const [pomodoroMode, setPomodoroMode] = useState<"work" | "short_break" | "long_break">("work");
  const [timeLeftSec, setTimeLeftSec] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [activeTaskTitle, setActiveTaskTitle] = useState<string>("Slot Focus Sprint");
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  const [ambientSound, setAmbientSound] = useState<"none" | "alpha_wave" | "lofi_crackle" | "gentle_tick">("alpha_wave");
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);

  // Web Audio Context for offline synthetic ambient background sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const tickTimerRef = useRef<any>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (Array.isArray(parsed.slots)) setSlots(parsed.slots);
        if (typeof parsed.completedPomodoros === "number") setCompletedPomodoros(parsed.completedPomodoros);
      }
    } catch (e) {
      console.warn("Could not load saved routine:", e);
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        profile,
        slots,
        completedPomodoros,
      }));
    } catch (e) {
      console.warn("Could not save routine:", e);
    }
  }, [profile, slots, completedPomodoros]);

  // Pomodoro Timer Loop
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeftSec > 0) {
      interval = setInterval(() => {
        setTimeLeftSec((prev) => prev - 1);
      }, 1000);
    } else if (timeLeftSec === 0 && isTimerRunning) {
      // Completed current mode!
      playCompletionChime();
      if (pomodoroMode === "work") {
        const newCount = completedPomodoros + 1;
        setCompletedPomodoros(newCount);
        if (newCount % 4 === 0) {
          setPomodoroMode("long_break");
          setTimeLeftSec(15 * 60);
        } else {
          setPomodoroMode("short_break");
          setTimeLeftSec(5 * 60);
        }
      } else {
        setPomodoroMode("work");
        setTimeLeftSec(25 * 60);
      }
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeftSec, pomodoroMode, completedPomodoros]);

  // Web Audio Ambient Synthesis
  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      const gain = ctx.createGain();
      gain.gain.value = 0.08;
      gain.connect(ctx.destination);
      gainRef.current = gain;
    } catch (err) {
      console.warn("Web Audio not supported:", err);
    }
  };

  const stopAudio = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
    if (tickTimerRef.current) {
      clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }
  };

  const playCompletionChime = () => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3); // A5
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    } catch (e) {}
  };

  const updateAmbientAudio = () => {
    stopAudio();
    if (!isTimerRunning || isSoundMuted || ambientSound === "none") return;

    initAudio();
    const ctx = audioCtxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;

    if (ambientSound === "alpha_wave") {
      // 432Hz calming alpha drone
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(432, ctx.currentTime);
      osc.connect(gain);
      osc.start();
      oscRef.current = osc;
    } else if (ambientSound === "gentle_tick") {
      // Periodic subtle rhythmic click every 1s
      tickTimerRef.current = setInterval(() => {
        try {
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const tickGain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(1200, now);
          tickGain.gain.setValueAtTime(0.04, now);
          tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
          osc.connect(tickGain);
          tickGain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
        } catch (e) {}
      }, 1000);
    }
  };

  useEffect(() => {
    updateAmbientAudio();
    return () => stopAudio();
  }, [isTimerRunning, isSoundMuted, ambientSound]);

  // Handle slot completion toggle
  const handleToggleSlot = (id: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  // Launch Pomodoro directly on a specific slot
  const handleStartSlotPomodoro = (slot: RoutineSlot) => {
    setActiveTaskTitle(slot.title);
    setPomodoroMode("work");
    setTimeLeftSec(25 * 60);
    setIsTimerRunning(true);
    setIsPomodoroActive(true);
  };

  // Switch profile preset
  const handleSelectProfile = (newProfile: RoutineProfile) => {
    setProfile(newProfile);
    setSlots(DEFAULT_SLOTS[newProfile]);
  };

  // Dynamic Adaptive Recalculation based on user inputs
  const handleRecalculateAdaptive = () => {
    const base = DEFAULT_SLOTS[profile];
    const updated = base.map((slot) => {
      if (slot.category === "school") {
        return {
          ...slot,
          time: schoolHours,
          title: `🏫 School & Coaching Hours (${schoolHours})`,
        };
      }
      if (slot.category === "focus" && slot.title.includes("Slot 1")) {
        return {
          ...slot,
          title: `⚡ Slot 1: Peak ${targetFocusSubject} Derivations`,
          detail: `Toughest ${targetFocusSubject} concepts tackled early. Goal: ${dailyFocusGoalHrs} hrs daily.`,
        };
      }
      return slot;
    });
    setSlots(updated);
    setShowCustomizer(false);
  };

  // Calculate stats
  const completedSlots = slots.filter((s) => s.completed).length;
  const totalSlots = slots.length;
  const progressPercent = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;
  const totalFocusMins = slots
    .filter((s) => s.completed && (s.category === "focus" || s.category === "revision"))
    .reduce((acc, s) => acc + s.durationMins, 0);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 font-sans text-left">
      
      {/* ================= TOP CARD: SMART ADAPTIVE ROUTINE BANNER ================= */}
      <div className="bg-white border border-emerald-300/80 rounded-3xl p-4 sm:p-5 shadow-xs text-left relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#796AEF]" />
                Dynamic Adaptive Routine & Pomodoro Hub
              </h4>
              <span className="text-[10.5px] font-mono font-bold text-indigo-900 bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Class {grade} • {board}
              </span>
            </div>
            <p className="text-[13px] text-slate-600 mt-1 font-medium leading-relaxed">
              Scientifically paced around your cognitive rhythms. Tap any slot to launch its dedicated **25-Min Pomodoro Sprint** with ambient sound!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Direct Pomodoro Opener */}
            <button
              type="button"
              onClick={() => setIsPomodoroActive((prev) => !prev)}
              className={`text-xs font-bold px-3.5 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95 border ${
                isPomodoroActive
                  ? "bg-[#796AEF] text-white border-indigo-700 shadow-indigo-200"
                  : "bg-indigo-50 hover:bg-indigo-100 text-[#796AEF] border-indigo-200"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isPomodoroActive ? "Close Focus Timer" : "Open Pomodoro ⏱️"}</span>
            </button>

            {/* Customizer Drawer Toggle */}
            <button
              type="button"
              onClick={() => setShowCustomizer((prev) => !prev)}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>
          </div>
        </div>

        {/* ================= DAILY COMPLETION PROGRESS BAR ================= */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
          <div className="sm:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between text-[12px] font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Today's Completion: {completedSlots} of {totalSlots} Slots ({progressPercent}%)</span>
              </span>
              <span className="text-indigo-600 font-mono">
                {totalFocusMins > 0 ? `${Math.floor(totalFocusMins / 60)}h ${totalFocusMins % 60}m Logged` : "0m Logged"}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#796AEF] to-emerald-500 rounded-full"
              />
            </div>
          </div>

          {/* Pomodoro Streak Counter */}
          <div className="flex items-center justify-between sm:justify-end gap-2 bg-amber-50/80 border border-amber-200 px-3 py-1.5 rounded-2xl text-[11.5px] sm:text-[12px] font-bold text-amber-900">
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Pomodoro Cycles:</span>
            </span>
            <span className="font-mono bg-white px-2 py-0.5 rounded-lg border border-amber-200 text-amber-800 font-black">
              {completedPomodoros} / 4
            </span>
          </div>
        </div>
      </div>

      {/* ================= DYNAMIC SCHEDULE CUSTOMIZER DRAWER ================= */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-indigo-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <h5 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#796AEF]" />
                Customize Daily Schedule Parameters
              </h5>
              <button
                type="button"
                onClick={() => setShowCustomizer(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Close ✕
              </button>
            </div>

            {/* Profile Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Select Schedule Preset:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: "school_day" as RoutineProfile, label: "🏫 School Day", desc: "Balanced evening study" },
                  { key: "exam_sprint" as RoutineProfile, label: "⚡ Exam Sprint", desc: "3h mocks & PYQ drills" },
                  { key: "weekend_deep" as RoutineProfile, label: "☕ Weekend Deep", desc: "Extended self-paced work" },
                  { key: "night_owl" as RoutineProfile, label: "🌙 Night Owl", desc: "Late evening focus" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSelectProfile(item.key)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs ${
                      profile === item.key
                        ? "bg-indigo-50 border-[#796AEF] text-indigo-950 font-bold ring-2 ring-indigo-200"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10.5px] sm:text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fine-Tuning Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <label className="text-[11.5px] font-bold text-slate-600">
                  School / Tuition Hours:
                </label>
                <input
                  type="text"
                  value={schoolHours}
                  onChange={(e) => setSchoolHours(e.target.value)}
                  placeholder="e.g. 08:00 AM - 02:30 PM"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden focus:border-[#796AEF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11.5px] font-bold text-slate-600">
                  Target Priority Subject:
                </label>
                <input
                  type="text"
                  value={targetFocusSubject}
                  onChange={(e) => setTargetFocusSubject(e.target.value)}
                  placeholder="e.g. Mathematics"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden focus:border-[#796AEF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11.5px] font-bold text-slate-600">
                  Daily Self-Study Goal:
                </label>
                <select
                  value={dailyFocusGoalHrs}
                  onChange={(e) => setDailyFocusGoalHrs(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden focus:border-[#796AEF]"
                >
                  <option value={2}>2 Hours (Light Revision)</option>
                  <option value={3}>3 Hours (Recommended)</option>
                  <option value={4}>4 Hours (High Yield)</option>
                  <option value={5}>5+ Hours (Exam Sprint)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setSlots(DEFAULT_SLOTS[profile]);
                  setShowCustomizer(false);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Reset to Default
              </button>

              <button
                type="button"
                onClick={handleRecalculateAdaptive}
                className="bg-[#796AEF] hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply & Recalculate Routine</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= BUILT-IN POMODORO FOCUS ENGINE ================= */}
      <AnimatePresence>
        {isPomodoroActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            className="bg-gradient-to-br from-indigo-900 via-[#1E1B4B] to-slate-900 border border-indigo-700/80 rounded-3xl p-5 sm:p-6 text-white shadow-xl space-y-4 relative overflow-hidden"
          >
            {/* Header & Modes */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-sm">
                  ⏱️
                </span>
                <div>
                  <h5 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                    <span>Kiara's Socratic Pomodoro Focus Engine</span>
                    {isTimerRunning && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    )}
                  </h5>
                  <p className="text-[11px] text-indigo-200 font-mono truncate max-w-[280px] sm:max-w-md">
                    Task: <span className="text-amber-300 font-bold">{activeTaskTitle}</span>
                  </p>
                </div>
              </div>

              {/* Mode Tabs */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-2xl border border-white/15">
                {[
                  { mode: "work" as const, label: "Work (25m)", time: 25 * 60 },
                  { mode: "short_break" as const, label: "Short Break (5m)", time: 5 * 60 },
                  { mode: "long_break" as const, label: "Long Break (15m)", time: 15 * 60 },
                ].map((tab) => (
                  <button
                    key={tab.mode}
                    type="button"
                    onClick={() => {
                      setPomodoroMode(tab.mode);
                      setTimeLeftSec(tab.time);
                      setIsTimerRunning(false);
                    }}
                    className={`text-[10.5px] sm:text-[11.5px] font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                      pomodoroMode === tab.mode
                        ? "bg-[#796AEF] text-white shadow-xs font-black"
                        : "text-indigo-200 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Center Big Countdown Display */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 border-y border-white/10">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-sm">
                  {formatTime(timeLeftSec)}
                </span>
                <span className="text-xs font-mono font-bold text-indigo-300 uppercase">
                  {pomodoroMode === "work" ? "Focus Sprint" : "Relax Break"}
                </span>
              </div>

              {/* Play / Pause / Reset Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning((prev) => !prev)}
                  className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 ${
                    isTimerRunning
                      ? "bg-amber-500 hover:bg-amber-600 text-slate-950 font-black"
                      : "bg-[#796AEF] hover:bg-indigo-600 text-white"
                  }`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Focus</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimeLeftSec(pomodoroMode === "work" ? 25 * 60 : pomodoroMode === "short_break" ? 5 * 60 : 15 * 60);
                  }}
                  className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Controls: Ambient Sound & Direct Classroom Launch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              {/* Synthetic Audio Selector */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11.5px] text-indigo-300 font-bold flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Ambient Audio:</span>
                </span>

                <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-xl border border-white/10">
                  {[
                    { id: "alpha_wave" as const, label: "🧘 432Hz Alpha" },
                    { id: "gentle_tick" as const, label: "⏱️ Gentle Tick" },
                    { id: "none" as const, label: "Mute" },
                  ].map((snd) => (
                    <button
                      key={snd.id}
                      type="button"
                      onClick={() => {
                        setAmbientSound(snd.id);
                        if (snd.id === "none") setIsSoundMuted(true);
                        else setIsSoundMuted(false);
                      }}
                      className={`text-[10.5px] sm:text-[11px] font-bold px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                        ambientSound === snd.id && !isSoundMuted
                          ? "bg-indigo-600 text-white font-black"
                          : "text-indigo-200 hover:text-white"
                      }`}
                    >
                      {snd.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Problem Launch to Cherry Ma'am or Kiara */}
              <div className="flex items-center gap-2">
                {onNavigateToClassroom && (
                  <button
                    type="button"
                    onClick={onNavigateToClassroom}
                    className="text-[11px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Open Blackboard Classroom 👩‍🏫</span>
                  </button>
                )}

                {onStartVoiceCall && (
                  <button
                    type="button"
                    onClick={() => onStartVoiceCall(`Kiara, main abhi "${activeTaskTitle}" ka Pomodoro sprint kar raha hoon. Mujhe is par quick motivation aur guidance chahiye.`)}
                    className="text-[11px] font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white px-2.5 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                  >
                    <span>🎙️ Kiara Voice</span>
                  </button>
                )}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= INTERACTIVE SCHEDULE TIMELINE BLOCKS ================= */}
      <div className="space-y-2.5">
        {slots.map((slot) => {
          return (
            <div
              key={slot.id}
              className={`bg-white border rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-xs ${
                slot.completed
                  ? "border-emerald-200/90 bg-emerald-50/20 opacity-80"
                  : "border-slate-200/90 hover:border-indigo-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox for Slot Completion */}
                <button
                  type="button"
                  onClick={() => handleToggleSlot(slot.id)}
                  className={`w-6 h-6 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5 shadow-2xs ${
                    slot.completed
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "bg-white border-slate-300 hover:border-emerald-500 text-transparent"
                  }`}
                  title={slot.completed ? "Mark incomplete" : "Mark completed"}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10.5px] sm:text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-xl border ${slot.color}`}>
                      {slot.time}
                    </span>
                    <span className={`text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${slot.color}`}>
                      {slot.tag}
                    </span>
                    {slot.completed && (
                      <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        ✓ Done
                      </span>
                    )}
                  </div>

                  <h5 className={`text-xs sm:text-sm font-black ${slot.completed ? "line-through text-slate-500" : "text-slate-900"}`}>
                    {slot.title}
                  </h5>

                  <p className="text-[12.5px] sm:text-[13px] text-slate-600 leading-relaxed font-medium">
                    {slot.detail}
                  </p>
                </div>
              </div>

              {/* Right Slot Action Controls */}
              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                {/* 1-Click Launch Pomodoro Focus for this slot */}
                {slot.category !== "sleep" && (
                  <button
                    type="button"
                    onClick={() => handleStartSlotPomodoro(slot)}
                    className="bg-indigo-50 hover:bg-[#796AEF] text-[#796AEF] hover:text-white border border-indigo-200 text-[11px] sm:text-[11.5px] font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1 shadow-2xs"
                    title="Start 25-Min Pomodoro on this slot"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Focus ⏱️</span>
                  </button>
                )}

                {/* Direct Cherry Ma'am Classroom launch for interactive slot */}
                {slot.title.includes("Cherry Ma'am") && onNavigateToClassroom && (
                  <button
                    type="button"
                    onClick={onNavigateToClassroom}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-[11.5px] font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1 shadow-2xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Join Class</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= BOTTOM ASK KIARA TO CUSTOMIZE BUTTON ================= */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (onAskKiaraCustomRoutine) {
              onAskKiaraCustomRoutine(`Kiara, mujhe mera daily study routine customize karna hai. Mere school timing ${schoolHours} hain aur daily focus goal ${dailyFocusGoalHrs} ghante hai.`);
            }
          }}
          className="w-full sm:w-auto bg-[#796AEF] hover:bg-indigo-700 text-white text-xs font-bold uppercase px-6 py-3 rounded-2xl transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask Kiara AI to Customize My 24H Timetable 📅</span>
        </button>
      </div>

    </div>
  );
};
