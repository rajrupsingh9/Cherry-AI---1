import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Lightbulb, Sparkles, Volume2, VolumeX, Bookmark, BookmarkCheck,
  RotateCcw, CheckCircle2, XCircle, Search, Filter, Share2,
  ChevronRight, ArrowRight, Brain, Zap, MessageSquare, Play
} from "lucide-react";

export interface MnemonicItem {
  id: string;
  title: string;
  topic: string;
  subject: "Physics" | "Chemistry" | "Mathematics" | "Biology" | "General";
  style: "bollywood" | "acronym" | "visual_story";
  trickPhrase: string;
  explanation: string;
  formulaOrRule: string;
  visualCue: string;
  funScore: number;
  audioScript: string;
  mastered?: boolean;
}

interface MnemonicStudioProps {
  studentName?: string;
  grade?: string;
  board?: string;
  subject?: string;
  onAskKiaraInChat?: (query: string) => void;
  onStartVoiceCall?: (initialTopic?: string) => void;
}

const SEED_MNEMONICS: MnemonicItem[] = [
  {
    id: "seed-chem-1",
    title: "Reactivity Series of Metals",
    topic: "Metal Activity Order (K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Hg > Ag > Au)",
    subject: "Chemistry",
    style: "bollywood",
    trickPhrase: "⚡ \"Please Stop Calling Me A Careless Zebra, Instead Try Learning How Copper Saves Gold!\"",
    explanation: "P (Potassium) > S (Sodium) > C (Calcium) > M (Magnesium) > A (Aluminium) > C (Carbon) > Z (Zinc) > I (Iron) > T (Tin) > L (Lead) > H (Hydrogen) > C (Copper) > S (Silver) > G (Gold)",
    formulaOrRule: "Highly reactive metals displace lower reactive metals from salt solutions.",
    visualCue: "Imagine a fashionable Zebra driving a golden sports car while refusing to answer calls!",
    funScore: 98,
    audioScript: "Kiara here! Never forget the reactivity series again: Please Stop Calling Me A Careless Zebra, Instead Try Learning How Copper Saves Gold! Potassium is at the very top!",
  },
  {
    id: "seed-math-1",
    title: "Trigonometric Ratios (sin, cos, tan)",
    topic: "Sine = P/H, Cosine = B/H, Tangent = P/B",
    subject: "Mathematics",
    style: "bollywood",
    trickPhrase: "📐 \"Pandit Badri Prasad, Har Har Bole — Sona Chandi Tole!\"",
    explanation: "P/H = S (Sin = Perpendicular / Hypotenuse) | B/H = C (Cos = Base / Hypotenuse) | P/B = T (Tan = Perpendicular / Base)",
    formulaOrRule: "\\sin\\theta = \\frac{P}{H}, \\quad \\cos\\theta = \\frac{B}{H}, \\quad \\tan\\theta = \\frac{P}{B}",
    visualCue: "Picture an ancient wise Pandit ji weighing gold and silver with mathematical precision!",
    funScore: 99,
    audioScript: "Pandit Badri Prasad, Har Har Bole, Sona Chandi Tole! First row gives Sin, Cos, Tan; flip it upside down for Cosec, Sec, Cot!",
  },
  {
    id: "seed-phys-1",
    title: "Ohm's Law & Electric Power",
    topic: "V = I × R and Power P = V × I",
    subject: "Physics",
    style: "acronym",
    trickPhrase: "⚡ \"VIP in a Virtual Reality (V = I × R) & Power is Very Important (P = V × I)\"",
    explanation: "Voltage (V) = Current (I) × Resistance (R). If you need Current, I = V / R. Power (P) = Voltage (V) × Current (I).",
    formulaOrRule: "V = IR, \\quad P = VI = I^2R = \\frac{V^2}{R}",
    visualCue: "A VIP celebrity wearing futuristic VR glasses holding an electric battery that powers up their suit!",
    funScore: 94,
    audioScript: "Remember: V equals I times R! Cover the one you need in the triangle with your thumb and the formula appears!",
  },
  {
    id: "seed-chem-2",
    title: "Modern Periodic Table Group 1 (Alkali Metals)",
    topic: "H, Li, Na, K, Rb, Cs, Fr",
    subject: "Chemistry",
    style: "bollywood",
    trickPhrase: "🧪 \"Ha-Li-Na Ki Rab Se Fariyad!\"",
    explanation: "H (Hydrogen), Li (Lithium), Na (Sodium), K (Potassium), Rb (Rubidium), Cs (Caesium), Fr (Francium).",
    formulaOrRule: "Valence electron = 1. Highly electropositive, form M+ cations readily.",
    visualCue: "A student named Halina folding her hands and praying to the sky before the Chemistry board exam!",
    funScore: 97,
    audioScript: "Ha-Li-Na Ki Rab Se Fariyad! All Group 1 elements covered in 5 words flat!",
  },
  {
    id: "seed-math-2",
    title: "All Trigonometry Signs by Quadrant (ASTC)",
    topic: "Quadrant I (+all), Q-II (+sin), Q-III (+tan), Q-IV (+cos)",
    subject: "Mathematics",
    style: "acronym",
    trickPhrase: "☕ \"Add Sugar To Coffee!\" (Q1: All, Q2: Sin, Q3: Tan, Q4: Cos)",
    explanation: "Quadrant 1: All positive. Quadrant 2: Sin & Cosec positive. Quadrant 3: Tan & Cot positive. Quadrant 4: Cos & Sec positive.",
    formulaOrRule: "ASTC rule from 0° to 360° counter-clockwise.",
    visualCue: "A steaming mug of hot filter coffee with sugar cubes floating in mathematical quadrant circles!",
    funScore: 96,
    audioScript: "Add Sugar To Coffee! Q1 All, Q2 Sin, Q3 Tan, Q4 Cos! Easy quadrant tracking!",
  },
  {
    id: "seed-bio-1",
    title: "Mitosis Cell Division Stages",
    topic: "Prophase ➔ Metaphase ➔ Anaphase ➔ Telophase",
    subject: "Biology",
    style: "acronym",
    trickPhrase: "🌮 \"Pass Me A Taco! (PMAT)\"",
    explanation: "P (Prophase: Chromosomes condense) ➔ M (Metaphase: Middle line-up) ➔ A (Anaphase: Pulled Apart) ➔ T (Telophase: Two new cells formed)",
    formulaOrRule: "Stages of equational cell division resulting in 2 diploid daughter cells.",
    visualCue: "A hungry scientist passing a giant taco under an electron microscope during cell division!",
    funScore: 95,
    audioScript: "PMAT: Pass Me A Taco! Prophase condenses, Metaphase meets in the middle, Anaphase pulls apart, Telophase turns into two!",
  },
  {
    id: "seed-phys-2",
    title: "Electromagnetic Spectrum Frequencies",
    topic: "Radio, Microwave, Infrared, Visible, UV, X-Ray, Gamma",
    subject: "Physics",
    style: "visual_story",
    trickPhrase: "📻 \"Rich Men In Vegas Use eXpensive Gadgets!\"",
    explanation: "Radio (R) ➔ Microwave (M) ➔ Infrared (I) ➔ Visible (V) ➔ Ultraviolet (U) ➔ X-rays (X) ➔ Gamma rays (G). Wavelength decreases, frequency increases!",
    formulaOrRule: "c = \\nu \\lambda \\quad (\\text{Speed of light is constant in vacuum})",
    visualCue: "Rich billionaires walking into Las Vegas with glowing purple laser gadgets!",
    funScore: 95,
    audioScript: "Rich Men In Vegas Use eXpensive Gadgets! From lowest frequency Radio waves all the way to high-energy Gamma rays!",
  },
  {
    id: "seed-chem-3",
    title: "Periodic Table Group 2 (Alkaline Earth Metals)",
    topic: "Be, Mg, Ca, Sr, Ba, Ra",
    subject: "Chemistry",
    style: "bollywood",
    trickPhrase: "🚗 \"Beta Mange Car Santro, Baap Razi!\"",
    explanation: "Be (Beryllium), Mg (Magnesium), Ca (Calcium), Sr (Strontium), Ba (Barium), Ra (Radium).",
    formulaOrRule: "Valence electrons = 2. Form M2+ cations, basic oxides.",
    visualCue: "A son joyfully pointing at a Santro car in the dealership while his smiling dad signs the papers!",
    funScore: 98,
    audioScript: "Beta Mange Car Santro, Baap Razi! You have just mastered all Group 2 Alkaline Earth metals!",
  }
];

const VAULT_STORAGE_KEY = "cherry_kiara_mnemonic_vault_v1";

export const MnemonicStudio: React.FC<MnemonicStudioProps> = ({
  studentName = "Student",
  grade = "10",
  board = "CBSE",
  subject = "Science",
  onAskKiaraInChat,
  onStartVoiceCall,
}) => {
  const [mnemonics, setMnemonics] = useState<MnemonicItem[]>(SEED_MNEMONICS);
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [savedVaultIds, setSavedVaultIds] = useState<string[]>([]);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Generator form states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [customTopic, setCustomTopic] = useState<string>("");
  const [generatorStyle, setGeneratorStyle] = useState<"all" | "bollywood" | "acronym" | "visual_story">("bollywood");
  const [generatorSubject, setGeneratorSubject] = useState<"Physics" | "Chemistry" | "Mathematics" | "Biology">("Physics");
  const [showGeneratorDrawer, setShowGeneratorDrawer] = useState<boolean>(false);

  // Load saved vault from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEY);
      if (saved) {
        setSavedVaultIds(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load mnemonic vault:", e);
    }
  }, []);

  // Save vault to localStorage
  const toggleSaveVault = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedVaultIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(next));
      } catch (err) {}
      return next;
    });
  };

  // Toggle mastered status for active recall test
  const handleToggleMastered = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMnemonics((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, mastered: !item.mastered } : item
      )
    );
  };

  // Audio speech playback
  const handleListenTrick = (mnemonic: MnemonicItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (speakingId === mnemonic.id) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingId(null);
      return;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = mnemonic.audioScript || mnemonic.trickPhrase;
    const utterance = new SpeechSynthesisUtterance(textToSpeak.replace(/[*#_~]/g, ""));
    utterance.rate = 1.0;
    utterance.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("zira") ||
        v.lang.includes("en-IN") ||
        v.lang.includes("hi-IN")
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(mnemonic.id);
    window.speechSynthesis.speak(utterance);
  };

  // Call API to generate custom mnemonic
  const handleGenerateCustomMnemonic = async (topicToGen?: string) => {
    const topic = topicToGen || customTopic;
    if (!topic || !topic.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-mnemonic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          subject: generatorSubject,
          grade,
          board,
          style: generatorStyle,
          studentName,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.mnemonics) && data.mnemonics.length > 0) {
        const formatted: MnemonicItem[] = data.mnemonics.map((m: any, idx: number) => ({
          id: m.id || `custom-${Date.now()}-${idx}`,
          title: m.title || `${topic} Memory Trick`,
          topic: m.topic || topic,
          subject: m.subject || generatorSubject,
          style: m.style || generatorStyle,
          trickPhrase: m.trickPhrase || `Memory Anchor for ${topic}`,
          explanation: m.explanation || "Break down the core keywords into simple steps.",
          formulaOrRule: m.formulaOrRule || `Key Formula for ${topic}`,
          visualCue: m.visualCue || "Imagine this concept clearly in your mind!",
          funScore: m.funScore || 95,
          audioScript: m.audioScript || m.trickPhrase,
          mastered: false,
        }));

        setMnemonics((prev) => [...formatted, ...prev]);
        setCustomTopic("");
        setShowGeneratorDrawer(false);
        // Auto flip the newly generated card to reveal the trick
        if (formatted[0]) {
          setFlippedCardId(formatted[0].id);
        }
      }
    } catch (err) {
      console.warn("Failed to generate custom mnemonic:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Filtered mnemonics
  const filteredMnemonics = mnemonics.filter((item) => {
    const matchesSubject =
      selectedSubject === "All" ||
      (selectedSubject === "Vault" ? savedVaultIds.includes(item.id) : item.subject === selectedSubject);

    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.trickPhrase.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSubject && matchesSearch;
  });

  const masteredCount = mnemonics.filter((m) => m.mastered).length;
  const masteryPercentage = mnemonics.length > 0 ? Math.round((masteredCount / mnemonics.length) * 100) : 0;

  return (
    <div className="space-y-4 font-sans text-left">
      
      {/* ================= HERO HUB CARD ================= */}
      <div className="bg-white border border-indigo-200/90 rounded-3xl p-4 sm:p-5 shadow-xs text-left relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
                Interactive AI Mnemonic Studio & Memory Vault
              </h4>
              <span className="text-[10.5px] font-mono font-bold text-indigo-900 bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                3D Flip Cards & Voice
              </span>
            </div>
            <p className="text-[13px] text-slate-600 mt-1 font-medium leading-relaxed">
              Tap any card to **Flip & Reveal** Bollywood dialogues, catchy rhymes, and Mind Palace visual tricks that make exam formulas unforgettable!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Generate New Custom Mnemonic Drawer Opener */}
            <button
              type="button"
              onClick={() => setShowGeneratorDrawer((prev) => !prev)}
              className="bg-[#796AEF] hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{showGeneratorDrawer ? "Close Generator" : "Invent New Mnemonic ✨"}</span>
            </button>
          </div>
        </div>

        {/* Active Recall Mastery Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between text-[12px] font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-indigo-600" />
                <span>Active Recall Mastery: {masteredCount} of {mnemonics.length} Cards Mastered</span>
              </span>
              <span className="text-emerald-700 font-mono font-black">{masteryPercentage}% Memorized</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${masteryPercentage}%` }}
                className="h-full bg-gradient-to-r from-[#796AEF] via-indigo-500 to-emerald-500 rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11.5px] sm:text-[12px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl shrink-0 self-start sm:self-center">
            <span>⭐ Memory Vault:</span>
            <span className="font-mono font-black bg-white px-1.5 py-0.5 rounded-lg border border-amber-200">
              {savedVaultIds.length} Saved
            </span>
          </div>
        </div>
      </div>

      {/* ================= AI INSTANT GENERATOR DRAWER ================= */}
      <AnimatePresence>
        {showGeneratorDrawer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-indigo-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <h5 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#796AEF]" />
                Invent Custom Mnemonic for Any Formula or Topic
              </h5>
              <button
                type="button"
                onClick={() => setShowGeneratorDrawer(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Formula, Chapter, or Concept Name:
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleGenerateCustomMnemonic();
                  }}
                  placeholder="e.g., Trigonometry standard angles, Snell's law, Mitosis phases..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-hidden focus:border-[#796AEF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Subject Category:
                </label>
                <select
                  value={generatorSubject}
                  onChange={(e) => setGeneratorSubject(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-hidden focus:border-[#796AEF]"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>
            </div>

            {/* Quick Inspiration Chips */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Quick Inspiration Ideas:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  "Snell's Law of Refraction",
                  "Trigonometric values 0° to 90°",
                  "Convex vs Concave Sign Convention",
                  "Kinetic Energy vs Momentum",
                  "Digestive Enzymes in Humans",
                ].map((chip, cIdx) => (
                  <button
                    key={cIdx}
                    type="button"
                    onClick={() => {
                      setCustomTopic(chip);
                      handleGenerateCustomMnemonic(chip);
                    }}
                    className="bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200 text-[#796AEF] text-[11px] font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer active:scale-95"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selector & Action Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[11.5px] font-bold text-slate-600">Style:</span>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                  {[
                    { id: "bollywood" as const, label: "🎭 Bollywood Rhyme" },
                    { id: "acronym" as const, label: "🔤 Acronym" },
                    { id: "visual_story" as const, label: "🧠 Mind Palace" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setGeneratorStyle(s.id)}
                      className={`text-[10.5px] sm:text-[11px] font-bold px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                        generatorStyle === s.id
                          ? "bg-[#796AEF] text-white font-black"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled={isGenerating || !customTopic.trim()}
                onClick={() => handleGenerateCustomMnemonic()}
                className="bg-[#796AEF] hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
              >
                {isGenerating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Inventing Memory Trick...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Generate Mnemonic Card ✨</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= FILTER CHIPS & SEARCH BAR ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: "All", label: "🌟 All Tricks" },
            { id: "Physics", label: "⚡ Physics" },
            { id: "Chemistry", label: "🧪 Chemistry" },
            { id: "Mathematics", label: "📐 Mathematics" },
            { id: "Biology", label: "🧬 Biology" },
            { id: "Vault", label: `⭐ Vault (${savedVaultIds.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedSubject(tab.id)}
              className={`shrink-0 text-[11.5px] sm:text-[12px] font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                selectedSubject === tab.id
                  ? "bg-[#796AEF] text-white border-indigo-700 shadow-xs font-black"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative shrink-0 sm:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trick or formula..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#796AEF]"
          />
        </div>
      </div>

      {/* ================= 3D INTERACTIVE FLIP FLASHCARDS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredMnemonics.map((item) => {
          const isFlipped = flippedCardId === item.id;
          const isSaved = savedVaultIds.includes(item.id);
          const isSpeaking = speakingId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setFlippedCardId(isFlipped ? null : item.id)}
              className={`group bg-white rounded-3xl border transition-all cursor-pointer p-4 sm:p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[220px] ${
                item.mastered
                  ? "border-emerald-300/80 bg-emerald-50/15"
                  : isFlipped
                  ? "border-indigo-400 ring-2 ring-indigo-100 shadow-md"
                  : "border-slate-200/90 hover:border-indigo-300 hover:shadow-md"
              }`}
            >
              {/* Header Badges & Actions */}
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[10.5px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                    item.subject === "Physics"
                      ? "bg-amber-50 text-amber-900 border-amber-200"
                      : item.subject === "Chemistry"
                      ? "bg-purple-50 text-purple-900 border-purple-200"
                      : item.subject === "Mathematics"
                      ? "bg-blue-50 text-blue-900 border-blue-200"
                      : "bg-emerald-50 text-emerald-900 border-emerald-200"
                  }`}>
                    {item.subject}
                  </span>

                  <span className="text-[10.5px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    {item.style === "bollywood" ? "🎭 Bollywood" : item.style === "acronym" ? "🔤 Acronym" : "🧠 Mind Palace"}
                  </span>

                  {item.mastered && (
                    <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Mastered
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Listen Voice Button */}
                  <button
                    type="button"
                    onClick={(e) => handleListenTrick(item, e)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                      isSpeaking
                        ? "bg-emerald-600 text-white animate-pulse"
                        : "bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-[#796AEF]"
                    }`}
                    title="Listen to Kiara explain this trick"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Bookmark Vault Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleSaveVault(item.id, e)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                      isSaved
                        ? "bg-amber-100 text-amber-600"
                        : "bg-slate-100 hover:bg-amber-50 text-slate-400 hover:text-amber-500"
                    }`}
                    title={isSaved ? "Remove from Vault" : "Save to Vault"}
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>

              {/* Card Body: Front vs Back */}
              <div className="py-3 flex-1">
                <AnimatePresence mode="wait">
                  {!isFlipped ? (
                    // FRONT SIDE OF CARD: Question / Concept
                    <motion.div
                      key="front"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="space-y-2"
                    >
                      <h5 className="text-sm font-black text-slate-900 leading-snug">
                        {item.title}
                      </h5>
                      <p className="text-[12.5px] sm:text-[13px] text-slate-600 font-medium line-clamp-2">
                        {item.topic}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-[11.5px] sm:text-[12px] font-bold text-indigo-600">
                        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Tap to Flip & Reveal Mnemonic</span>
                          <RotateCcw className="w-3 h-3 text-[#796AEF]" />
                        </span>
                        <span className="text-[10.5px] sm:text-[11px] text-amber-600 font-mono font-black bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                          {item.funScore}% Sticky
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    // BACK SIDE OF CARD: The Unforgettable Mnemonic Trick
                    <motion.div
                      key="back"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="space-y-2.5"
                    >
                      <div className="p-2.5 bg-gradient-to-br from-indigo-50/90 to-purple-50/80 border border-indigo-200/90 rounded-2xl">
                        <div className="text-[11px] font-mono font-bold text-[#796AEF] uppercase tracking-wider mb-1">
                          ✨ Memory Catchphrase:
                        </div>
                        <p className="text-[13px] font-black text-indigo-950 leading-relaxed">
                          {item.trickPhrase}
                        </p>
                      </div>

                      <div className="text-[12px] sm:text-[12.5px] text-slate-700 leading-relaxed font-medium space-y-1">
                        <div>
                          <strong className="text-slate-900 font-bold">Mapping: </strong>
                          <span>{item.explanation}</span>
                        </div>
                        {item.formulaOrRule && (
                          <div className="text-indigo-900 font-mono text-[11.5px] sm:text-[12px] bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                            <strong>Formula: </strong>{item.formulaOrRule}
                          </div>
                        )}
                        {item.visualCue && (
                          <div className="text-slate-500 italic text-[11.5px]">
                            👁️ "{item.visualCue}"
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Card Controls: Spaced Repetition Testing */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                {/* Mastered / Need Practice Toggle */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => handleToggleMastered(item.id, e)}
                    className={`text-[10.5px] sm:text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 border ${
                      item.mastered
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                        : "bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{item.mastered ? "Mastered ✓" : "Mark Mastered"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAskKiaraInChat) {
                        onAskKiaraInChat(`Kiara, mujhe "${item.title}" ke formula (${item.formulaOrRule}) ko numericals me kaise apply karte hain step-by-step explain karo!`);
                      }
                    }}
                    className="text-[10.5px] sm:text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 text-[#796AEF] border border-indigo-200 px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                    title="Ask Kiara to explain in chat"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Ask Kiara</span>
                  </button>
                </div>

                {onStartVoiceCall && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartVoiceCall(`Kiara, mujhe "${item.title}" ka mnemonic practice karwao aur check karo ki mujhe yaad hua ya nahi.`);
                    }}
                    className="text-[10.5px] sm:text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-xl transition-all cursor-pointer"
                  >
                    <span>🎙️ Voice</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredMnemonics.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-2">
          <Lightbulb className="w-8 h-8 text-slate-300 mx-auto" />
          <h5 className="text-sm font-black text-slate-800">No Mnemonics Found</h5>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {selectedSubject === "Vault"
              ? "You haven't saved any mnemonics to your vault yet. Tap the bookmark icon on any card to save it!"
              : `No mnemonics matched "${searchQuery}". Tap "Invent New Mnemonic ✨" to create one instantly!`}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSubject("All");
              setSearchQuery("");
            }}
            className="text-xs font-bold text-[#796AEF] hover:underline pt-1 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* ================= BOTTOM CTA ================= */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (onAskKiaraInChat) {
              onAskKiaraInChat(`Kiara, mujhe mere current syllabus (${subject}, Class ${grade}) ke top 5 most confusing formulas ke mnemonics batao.`);
            }
          }}
          className="w-full sm:w-auto bg-[#796AEF] hover:bg-indigo-700 text-white text-xs font-bold uppercase px-6 py-3 rounded-2xl transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Ask Kiara For Syllabus-Wise Top Formula Mnemonics 💡</span>
        </button>
      </div>

    </div>
  );
};
