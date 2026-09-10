import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  FlaskConical,
  Atom,
  RotateCcw,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Sliders,
  BookOpen,
  HelpCircle,
  ClipboardList,
  Sparkles,
  Search,
  CheckCircle2,
  PlusCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Layers,
  ArrowRight,
  Info,
  Wand2,
  Loader2,
  Volume2,
  ZoomIn,
  ZoomOut,
  StepForward,
  Gauge,
  Hand
} from "lucide-react";
import { LabSubject, LabExperiment, ObservationRecord, AISimulationSpec } from "./virtual-lab/labTypes";
import { PRESET_EXPERIMENTS } from "./virtual-lab/catalogData";
import { CURATED_CUSTOM_SIMULATIONS, matchCuratedSimulation } from "./virtual-lab/customSimPresets";
import { renderCustomAISimulation } from "./virtual-lab/renderCustomSimulation";
import { drawOpticsLens, OpticsInteractiveState } from "./virtual-lab/renderOptics";
import { drawOhmsLawCircuit } from "./virtual-lab/renderOhmsLaw";
import { drawAcidBaseTitration } from "./virtual-lab/renderTitration";
import { drawCellMicroscope } from "./virtual-lab/renderMicroscope";
import { drawTrigUnitCircle } from "./virtual-lab/renderTrigCircle";
import { drawPendulumMotion } from "./virtual-lab/renderPendulum";
import { getTranslations } from "../utils/i18n";

// Map curated experiments in Ready Labs to their simulation specs
const CURATED_PRESET_MAP: Record<string, AISimulationSpec> = {
  "double-slit": CURATED_CUSTOM_SIMULATIONS["double slit interference"],
  "newtons-cradle": CURATED_CUSTOM_SIMULATIONS["newton's cradle"],
  "capacitor-rc": CURATED_CUSTOM_SIMULATIONS["capacitor charging"],
  "photosynthesis-light": CURATED_CUSTOM_SIMULATIONS["photosynthesis light phase"],
  "doppler-effect": CURATED_CUSTOM_SIMULATIONS["doppler effect"],
  "rutherford-scattering": CURATED_CUSTOM_SIMULATIONS["rutherford gold foil"],
  "ideal-gas-piston": CURATED_CUSTOM_SIMULATIONS["ideal gas law"],
  "projectile-motion": CURATED_CUSTOM_SIMULATIONS["projectile motion"],
  "bar-magnet-field": CURATED_CUSTOM_SIMULATIONS["bar magnet field"],
  "electromagnet-coil": CURATED_CUSTOM_SIMULATIONS["electromagnet coil"],
  "prism-dispersion": CURATED_CUSTOM_SIMULATIONS["prism dispersion"],
  "friction-surfaces": CURATED_CUSTOM_SIMULATIONS["friction surfaces"],
  "archimedes-buoyancy": CURATED_CUSTOM_SIMULATIONS["archimedes buoyancy"],
  "rational-number-line": CURATED_CUSTOM_SIMULATIONS["rational number line"],
  "bohr-atomic-model": CURATED_CUSTOM_SIMULATIONS["bohr atomic model"],
  "reaction-kinetics": CURATED_CUSTOM_SIMULATIONS["chemical reaction kinetics"],
  "human-heart-circulation": CURATED_CUSTOM_SIMULATIONS["human heart circulation"],
  "osmosis-plasmolysis": CURATED_CUSTOM_SIMULATIONS["osmosis and plasmolysis"],
  "quadratic-parabola": CURATED_CUSTOM_SIMULATIONS["quadratic parabola functions"],
  "pythagoras-theorem": CURATED_CUSTOM_SIMULATIONS["pythagoras theorem geometry"],
  "normal-distribution": CURATED_CUSTOM_SIMULATIONS["normal gaussian distribution"],
  "faraday-induction": CURATED_CUSTOM_SIMULATIONS["faraday electromagnetic induction"],
  "photoelectric-effect": CURATED_CUSTOM_SIMULATIONS["photoelectric effect experiment"],
  "water-electrolysis": CURATED_CUSTOM_SIMULATIONS["water electrolysis hofmann"],
};

interface VirtualLabStudioProps {
  studentGrade?: string;
  studentSubject?: string;
  onOpenClassroomWithTopic?: (topicTitle: string, experimentDetails?: any) => void;
  mediumOfLearning?: string;
}

export const VirtualLabStudio: React.FC<VirtualLabStudioProps> = ({
  studentGrade = "Class 10",
  studentSubject = "Science",
  onOpenClassroomWithTopic,
  mediumOfLearning = "Hinglish",
}) => {
  const t = useMemo(() => getTranslations(mediumOfLearning), [mediumOfLearning]);

  // Mode: "presets" (All Ready Labs) or "ai-generator" (Student-Generated Custom Labs)
  const [labMode, setLabMode] = useState<"presets" | "ai-generator">("presets");
  const [selectedSubject, setSelectedSubject] = useState<LabSubject>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Student-generated simulations list (stored in localStorage)
  // Initially empty so students can generate custom simulations on demand
  const [studentSimulations, setStudentSimulations] = useState<AISimulationSpec[]>(() => {
    try {
      // Clear legacy pre-populated curated entries so AI Sim tab starts clean & empty
      localStorage.removeItem("stem_lab_student_sims");
      const saved = localStorage.getItem("stem_lab_user_custom_sims");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [];
  });

  // Custom AI Simulation Generator States - strictly student-generated
  const [customTopicInput, setCustomTopicInput] = useState("");
  const [isGeneratingSim, setIsGeneratingSim] = useState(false);
  const [activeAISim, setActiveAISim] = useState<AISimulationSpec | null>(() => {
    try {
      const saved = localStorage.getItem("stem_lab_user_custom_sims");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      }
    } catch (_) {}
    return null;
  });

  // Preset Experiment States
  const [activeExperiment, setActiveExperiment] = useState<LabExperiment>(() => {
    if (!studentGrade) return PRESET_EXPERIMENTS[0];
    const sNum = studentGrade.match(/\d+/)?.[0];
    const match = PRESET_EXPERIMENTS.find((exp) =>
      exp.grades.some((g) => g === studentGrade || (sNum && g.match(/\d+/)?.[0] === sNum))
    );
    return match || PRESET_EXPERIMENTS[0];
  });
  const [params, setParams] = useState<Record<string, number>>(() => {
    if (!studentGrade) return PRESET_EXPERIMENTS[0].defaultParams;
    const sNum = studentGrade.match(/\d+/)?.[0];
    const match = PRESET_EXPERIMENTS.find((exp) =>
      exp.grades.some((g) => g === studentGrade || (sNum && g.match(/\d+/)?.[0] === sNum))
    );
    return match ? { ...match.defaultParams } : { ...PRESET_EXPERIMENTS[0].defaultParams };
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showFullscreenSliders, setShowFullscreenSliders] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanMode, setIsPanMode] = useState<boolean>(false);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [justLoggedToast, setJustLoggedToast] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"observations" | "manual" | "viva">("observations");
  const [observations, setObservations] = useState<ObservationRecord[]>([]);
  const [expandedVivaIdx, setExpandedVivaIdx] = useState<number | null>(null);

  // Optics interactive drag state
  const [opticsDrag, setOpticsDrag] = useState<OpticsInteractiveState>({
    isDraggingObject: false,
    objX: 0,
    objY: 0,
    hoveringObject: false,
  });

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pinchDistRef = useRef<number | null>(null);
  const initialZoomRef = useRef<number>(1.0);

  // Filter experiments by selected subject and search query (all 30 ready simulations available in Ready tab)
  const filteredExperiments = useMemo(() => {
    return PRESET_EXPERIMENTS.filter((exp) => {
      const matchSubject = selectedSubject === "all" || exp.subject === selectedSubject;
      const matchSearch =
        searchQuery.trim() === "" ||
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.hindiTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubject && matchSearch;
    });
  }, [selectedSubject, searchQuery]);

  // Keep activeExperiment synchronized with the student's filtered syllabus experiments
  useEffect(() => {
    if (filteredExperiments.length > 0 && !filteredExperiments.some((e) => e.id === activeExperiment.id)) {
      const nextExp = filteredExperiments[0];
      setActiveExperiment(nextExp);
      setParams({ ...nextExp.defaultParams });
      setSimTime(0);
      setExpandedVivaIdx(null);
      setActiveTab("observations");
    }
  }, [filteredExperiments, activeExperiment.id]);

  // Handle experiment switch
  const handleSelectExperiment = (exp: LabExperiment) => {
    setLabMode("presets");
    setActiveExperiment(exp);
    setParams({ ...exp.defaultParams });
    setSimTime(0);
    setExpandedVivaIdx(null);
    setActiveTab("observations");
  };

  // Switch student generated simulation
  const handleSelectStudentSim = (sim: AISimulationSpec) => {
    setLabMode("ai-generator");
    setActiveAISim(sim);
    const initParams: Record<string, number> = {};
    if (sim.parameters && Array.isArray(sim.parameters)) {
      sim.parameters.forEach((p) => {
        initParams[p.key] = p.defaultValue ?? p.min ?? 50;
      });
    }
    setParams(initParams);
    setSimTime(0);
    setExpandedVivaIdx(null);
    setActiveTab("observations");
  };

  // Delete student generated simulation
  const handleDeleteStudentSim = (simId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStudentSimulations((prev) => {
      const updated = prev.filter((s) => s.id !== simId);
      try {
        localStorage.setItem("stem_lab_user_custom_sims", JSON.stringify(updated));
      } catch (_) {}
      if (activeAISim?.id === simId) {
        if (updated.length > 0) {
          setActiveAISim(updated[0]);
          const initParams: Record<string, number> = {};
          updated[0].parameters.forEach((p) => {
            initParams[p.key] = p.defaultValue ?? p.min ?? 50;
          });
          setParams(initParams);
        } else {
          setActiveAISim(null);
        }
      }
      return updated;
    });
  };

  // Handle AI Custom Simulation Trigger - strictly generates new simulations by student
  const handleGenerateCustomSimulation = async (topicToGen?: string) => {
    const targetTopic = (topicToGen || customTopicInput).trim();
    if (!targetTopic) return;

    setIsGeneratingSim(true);
    setLabMode("ai-generator");

    // 1. Check if matching curated simulation exists for instantaneous response
    const matchedPreset: AISimulationSpec | null = matchCuratedSimulation(targetTopic);

    if (matchedPreset) {
      const spec: AISimulationSpec = { ...matchedPreset, id: `sim-${Date.now()}` };
      setActiveAISim(spec);
      setStudentSimulations((prev) => {
        const updated = [spec, ...prev.filter((s) => s.id !== spec.id && s.topic !== spec.topic)];
        try {
          localStorage.setItem("stem_lab_user_custom_sims", JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });

      const initParams: Record<string, number> = {};
      if (spec.parameters && Array.isArray(spec.parameters)) {
        spec.parameters.forEach((p) => {
          initParams[p.key] = p.defaultValue ?? p.min ?? 50;
        });
      }
      setParams(initParams);
      setSimTime(0);
      setCustomTopicInput("");
      setActiveTab("observations");
      setIsGeneratingSim(false);
      return;
    }

    // 2. Query server for novel/custom AI simulation
    try {
      const res = await fetch("/api/generate-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: targetTopic,
          grade: studentGrade,
          subject: studentSubject.toLowerCase()
        })
      });

      if (!res.ok) throw new Error("Failed to generate simulation");
      const json = await res.json();
      if (json.success && json.data) {
        const spec: AISimulationSpec = json.data;
        setActiveAISim(spec);
        setStudentSimulations((prev) => {
          const updated = [spec, ...prev.filter((s) => s.id !== spec.id)];
          try {
            localStorage.setItem("stem_lab_user_custom_sims", JSON.stringify(updated));
          } catch (_) {}
          return updated;
        });

        const initParams: Record<string, number> = {};
        if (spec.parameters && Array.isArray(spec.parameters)) {
          spec.parameters.forEach((p) => {
            initParams[p.key] = p.defaultValue ?? p.min ?? 50;
          });
        }
        setParams(initParams);
        setSimTime(0);
        setCustomTopicInput("");
        setActiveTab("observations");
      }
    } catch (err) {
      console.error("AI Sim generation error:", err);
      // Resilient fallback spec for the entered topic
      const fallbackSpec: AISimulationSpec = {
        id: `sim-fallback-${Date.now()}`,
        topic: targetTopic,
        title: `${targetTopic}: Interactive Dynamic Lab`,
        hindiTitle: `${targetTopic}: इंटरैक्टिव सिमुलेशन`,
        subject: (studentSubject.toLowerCase() as any) || "physics",
        grade: studentGrade || "Class 10-12",
        category: "STEM Dynamic Model",
        conceptFormula: "Y(t) = A \\cos(\\omega t + \\phi)",
        secondaryFormulas: [{ label: "Dynamic Output", formula: "E \\propto A^2" }],
        simulationType: "custom_interactive",
        description: `Real-time physical parameter mapping for ${targetTopic}. Adjust sliders to observe dynamic changes in waveform and field characteristics.`,
        parameters: [
          { key: "amplitude", label: `${targetTopic} Intensity`, min: 10, max: 100, step: 5, defaultValue: 50, unit: "%", description: "Magnitude of primary field.", symbol: "A" },
          { key: "frequency", label: "Rate / Frequency", min: 1, max: 20, step: 1, defaultValue: 8, unit: "Hz", description: "Rate of oscillation or flow.", symbol: "f" },
          { key: "dampingFactor", label: "System Damping", min: 0, max: 10, step: 1, defaultValue: 2, unit: "ratio", description: "Medium resistance coefficient.", symbol: "γ" }
        ],
        liveOutputs: [
          { key: "outputMetric", label: "System Response", formulaStr: "A * sin(ω t)", unit: "A.U.", description: "Real-time state vector." }
        ],
        cherryObservation: {
          hinglishGuide: `Dekho beta! ${targetTopic} me jaise hi parameters adjust karte hain, system instantly dynamically update hota hai!`,
          keyRuleLaw: "Dynamic Superposition & Conservation of Energy",
          examTrap: "Always cross-check SI units and boundary conditions in exam questions!",
          whatToObserve: ["Sliders badhane se waveform aur particle dynamics change hote hain."],
          proTip: "Observe how amplitude scales the response directly."
        },
        visualTheme: { primaryColor: "#38bdf8", accentColor: "#0284c7", bgTheme: "dark" }
      };
      setActiveAISim(fallbackSpec);
      setStudentSimulations((prev) => {
        const updated = [fallbackSpec, ...prev.filter((s) => s.id !== fallbackSpec.id)];
        try {
          localStorage.setItem("stem_lab_user_custom_sims", JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
      setParams({ amplitude: 50, frequency: 8, dampingFactor: 2 });
      setSimTime(0);
      setCustomTopicInput("");
      setActiveTab("observations");
    } finally {
      setIsGeneratingSim(false);
    }
  };

  // Update single parameter
  const handleParamChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  // Reset experiment to default
  const handleResetParams = () => {
    if (labMode === "ai-generator" && activeAISim) {
      const initParams: Record<string, number> = {};
      activeAISim.parameters.forEach((p) => {
        initParams[p.key] = p.defaultValue;
      });
      setParams(initParams);
    } else {
      setParams({ ...activeExperiment.defaultParams });
    }
    setSimTime(0);
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
    setIsPanMode(false);
  };

  // Step simulation forward by 1 frame (0.05s)
  const handleStepForward = () => {
    setIsPlaying(false);
    setSimTime((prev) => prev + 0.05);
  };

  // Zoom and Pan Handlers
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(3.0, parseFloat((prev + 0.2).toFixed(1))));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.5, parseFloat((prev - 0.2).toFixed(1))));
  };

  const handleResetZoom = () => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
    setIsPanMode(false);
  };

  // Fullscreen / Theater Mode Toggle
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Record Reading into Observation Table
  const handleRecordObservation = () => {
    if (labMode === "ai-generator" && !activeAISim) return;
    let calculatedOutputs: Record<string, number | string> = {};
    let remarks = "";

    if (labMode === "ai-generator" && activeAISim) {
      // Calculate outputs for AI Custom Sim
      activeAISim.liveOutputs.forEach((out) => {
        calculatedOutputs[out.label] = `${(params[out.key] || Object.values(params)[0] || 0)} ${out.unit}`;
      });
      remarks = `Dynamic AI Sim: ${activeAISim.topic}`;
    } else if (activeExperiment.id === "optics-lens") {
      const f = params.focalLength || 80;
      const u = params.objectDistance || 160;
      const ho = params.objectHeight || 50;
      const isConvex = (params.lensType ?? 1) === 1;

      if (isConvex) {
        if (u === f) {
          calculatedOutputs = { "v (Image Distance)": "Infinity (∞)", "m (Magnification)": "Highly Magnified", Nature: "Real at Infinity" };
        } else if (u < f) {
          const v = (f * u) / (f - u);
          const m = v / u;
          calculatedOutputs = { "v (Image Distance)": `-${v.toFixed(1)} cm`, "m (Magnification)": `+${m.toFixed(2)}`, Nature: "Virtual & Erect" };
        } else {
          const v = (f * u) / (u - f);
          const m = v / u;
          calculatedOutputs = { "v (Image Distance)": `+${v.toFixed(1)} cm`, "m (Magnification)": `-${m.toFixed(2)}`, Nature: "Real & Inverted" };
        }
      } else {
        const v = (f * u) / (u + f);
        const m = v / u;
        calculatedOutputs = { "v (Image Distance)": `-${v.toFixed(1)} cm`, "m (Magnification)": `+${m.toFixed(2)}`, Nature: "Virtual & Diminished" };
      }
      remarks = `u = ${u} cm, f = ${f} cm`;
    } else if (activeExperiment.id === "ohms-law") {
      const V = params.voltage || 12;
      const R = params.resistance || 6;
      const isClosed = (params.switchState ?? 1) === 1;
      const I = isClosed ? V / R : 0;
      const P = isClosed ? V * I : 0;
      calculatedOutputs = {
        "Current (I)": `${I.toFixed(2)} A`,
        "Power (P)": `${P.toFixed(1)} W`,
        "Calculated R": `${R.toFixed(1)} Ω`,
        "Key Status": isClosed ? "Closed (ON)" : "Open (OFF)",
      };
      remarks = `Slope ΔV/ΔI = ${R} Ω`;
    } else if (activeExperiment.id === "acid-base-ph") {
      const vAdded = params.titrantVolume || 0;
      const vAcid = 25.0;
      const nAcid = 0.1 * (vAcid / 1000);
      const nBase = 0.1 * (vAdded / 1000);
      const totalVolL = (vAcid + vAdded) / 1000;
      let ph = 7.0;
      if (nAcid > nBase) {
        ph = -Math.log10((nAcid - nBase) / totalVolL);
      } else if (nBase > nAcid) {
        ph = 14.0 - (-Math.log10((nBase - nAcid) / totalVolL));
      }
      calculatedOutputs = {
        "NaOH Dispensed": `${vAdded.toFixed(1)} mL`,
        "Measured pH": ph.toFixed(2),
        Solution: ph < 6.9 ? "Acidic" : ph > 7.1 ? "Basic" : "Neutral (Equivalence)",
      };
      remarks = vAdded === 25 ? "Endpoint Reached!" : vAdded < 25 ? "Pre-equivalence" : "Post-equivalence";
    } else if (activeExperiment.id === "pendulum-motion") {
      const L = params.length || 100;
      const g = params.gravity || 9.8;
      const omega = Math.sqrt(g / (L / 100));
      const T = (2 * Math.PI) / omega;
      const f = 1 / T;
      calculatedOutputs = {
        "String Length (L)": `${L} cm`,
        "Gravity (g)": `${g} m/s²`,
        "Time Period (T)": `${T.toFixed(3)} s`,
        "Frequency (f)": `${f.toFixed(2)} Hz`,
      };
      remarks = `Calculated g = ${((4 * Math.PI * Math.PI * (L / 100)) / (T * T)).toFixed(2)} m/s²`;
    } else if (activeExperiment.id === "trig-unit-circle") {
      const thetaDeg = (params.thetaDeg || 45) % 360;
      const rad = (thetaDeg * Math.PI) / 180;
      const sinVal = Math.sin(rad);
      const cosVal = Math.cos(rad);
      const tanVal = Math.abs(cosVal) > 1e-4 ? sinVal / cosVal : Infinity;
      calculatedOutputs = {
        "Angle (θ)": `${thetaDeg.toFixed(0)}°`,
        "sin(θ)": sinVal.toFixed(4),
        "cos(θ)": cosVal.toFixed(4),
        "tan(θ)": Math.abs(tanVal) < 99 ? tanVal.toFixed(4) : "±∞",
      };
      remarks = `sin²θ + cos²θ = ${(sinVal * sinVal + cosVal * cosVal).toFixed(2)}`;
    } else if (activeExperiment.id === "cell-microscope") {
      const mag = params.magnification || 100;
      const sampleType = params.sampleType || 1;
      const sampleNames = ["Onion Peel (Plant)", "Human Cheek (Animal)", "Leaf Stomata"];
      calculatedOutputs = {
        Specimen: sampleNames[sampleType - 1],
        "Eyepiece Mag": "10x",
        "Objective Mag": `${(mag / 10).toFixed(0)}x`,
        "Total Magnification": `${mag}x`,
      };
      remarks = sampleType === 1 ? "Cell wall & vacuole visible" : sampleType === 2 ? "Nucleus & cytoplasm visible" : "Guard cells & pore visible";
    } else if (CURATED_PRESET_MAP[activeExperiment.id]) {
      const spec = CURATED_PRESET_MAP[activeExperiment.id];
      spec.liveOutputs.forEach((out) => {
        calculatedOutputs[out.label] = `${params[out.key] ?? Object.values(params)[0] ?? 0} ${out.unit}`;
      });
      remarks = `Ready Lab: ${spec.title}`;
    }

    const currentExpTitle = labMode === "ai-generator" && activeAISim ? activeAISim.title : activeExperiment.title;
    const currentExpId = labMode === "ai-generator" && activeAISim ? activeAISim.id : activeExperiment.id;

    const newRecord: ObservationRecord = {
      id: `obs-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      experimentId: currentExpId,
      experimentTitle: currentExpTitle,
      inputs: { ...params },
      calculatedOutputs,
      remarks,
    };

    setObservations((prev) => [newRecord, ...prev]);
  };

  // Triggers Cherry Ma'am to explain this experiment on the Classroom Whiteboard
  const handleAskCherryOnWhiteboard = () => {
    if (!onOpenClassroomWithTopic) return;
    if (labMode === "ai-generator" && !activeAISim) return;

    const currentTitle = labMode === "ai-generator" && activeAISim ? activeAISim.title : activeExperiment.title;

    const experimentPayload: any = labMode === "ai-generator" && activeAISim ? {
      id: activeAISim.id,
      title: activeAISim.title,
      hindiTitle: activeAISim.hindiTitle,
      subject: activeAISim.subject,
      category: activeAISim.category,
      aim: activeAISim.description || `To investigate and observe ${activeAISim.title}`,
      conceptFormula: activeAISim.conceptFormula,
      explanation: activeAISim.cherryObservation?.hinglishGuide || activeAISim.description,
      apparatus: activeAISim.parameters.map((p) => `${p.label} (${p.min}-${p.max} ${p.unit})`),
      procedure: [
        { stepNumber: 1, title: "Initialize Parameters", instruction: `Set initial slider values: ${activeAISim.parameters.map(p => `${p.label} = ${params[p.key] ?? p.defaultValue} ${p.unit}`).join(", ")}.` },
        { stepNumber: 2, title: "Run Virtual Simulation", instruction: "Observe live digital outputs and dynamic behaviors on the canvas." },
        { stepNumber: 3, title: "Analyze Observations", instruction: activeAISim.cherryObservation?.keyRuleLaw || "Verify the governing mathematical equations." }
      ],
      precautions: activeAISim.cherryObservation?.examTrap ? [activeAISim.cherryObservation.examTrap] : ["Ensure proper calibration before recording observations."],
      currentParams: { ...params },
      paramConfigs: activeAISim.parameters.map(p => ({ key: p.key, label: p.label, unit: p.unit, min: p.min, max: p.max })),
      observations: observations,
      svgDiagram: activeAISim.svgDiagram,
      cherryObservation: activeAISim.cherryObservation,
    } : {
      id: activeExperiment.id,
      title: activeExperiment.title,
      hindiTitle: activeExperiment.hindiTitle,
      subject: activeExperiment.subject,
      category: activeExperiment.category,
      aim: activeExperiment.aim,
      conceptFormula: activeExperiment.conceptFormula,
      explanation: activeExperiment.explanation,
      apparatus: activeExperiment.apparatus,
      procedure: activeExperiment.procedure,
      precautions: activeExperiment.precautions,
      vivaQuestions: activeExperiment.vivaQuestions,
      currentParams: { ...params },
      paramConfigs: activeExperiment.paramConfigs,
      observations: observations,
    };

    onOpenClassroomWithTopic(currentTitle, experimentPayload);
  };

  // Helper to compute touch distance for pinch-to-zoom
  const getTouchDistance = (t1: React.Touch, t2: React.Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Direct canvas mouse interactions
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanMode || e.button === 1) {
      setIsPanning(true);
      touchStartPosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (labMode !== "presets" || activeExperiment.id !== "optics-lens") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const w = canvas.width / (window.devicePixelRatio || 1);
    const cy = (canvas.height / (window.devicePixelRatio || 1)) / 2;
    const cx = w / 2;
    const u = params.objectDistance || 160;
    const ho = params.objectHeight || 50;

    // Check hit test near object arrow
    if (Math.abs(clickX - (cx - u)) < 28 && clickY >= cy - ho - 20 && clickY <= cy + 20) {
      setOpticsDrag((prev) => ({ ...prev, isDraggingObject: true }));
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      const dx = e.clientX - touchStartPosRef.current.x;
      const dy = e.clientY - touchStartPosRef.current.y;
      touchStartPosRef.current = { x: e.clientX, y: e.clientY };
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      return;
    }

    if (labMode !== "presets" || activeExperiment.id !== "optics-lens") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    const w = canvas.width / (window.devicePixelRatio || 1);
    const cy = (canvas.height / (window.devicePixelRatio || 1)) / 2;
    const cx = w / 2;
    const u = params.objectDistance || 160;
    const ho = params.objectHeight || 50;
    const objX = cx - u;
    const objTopY = cy - ho;

    const isHover = Math.abs(curX - objX) < 28 && curY >= objTopY - 20 && curY <= cy + 20;
    setOpticsDrag((prev) => ({ ...prev, hoveringObject: isHover }));

    if (opticsDrag.isDraggingObject) {
      const newU = Math.max(40, Math.min(260, cx - curX));
      setParams((prev) => ({ ...prev, objectDistance: Math.round(newU) }));
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    if (opticsDrag.isDraggingObject) {
      setOpticsDrag((prev) => ({ ...prev, isDraggingObject: false }));
    }
  };

  // Canvas Mouse Wheel Zoom
  const handleCanvasWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoomLevel((prev) => Math.min(3.0, Math.max(0.5, parseFloat((prev + delta).toFixed(2)))));
  };

  // Mobile Touch Gestures (Pinch-to-zoom, Pan, and 1-finger physics manipulation)
  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2) {
      const dist = getTouchDistance(e.touches[0], e.touches[1]);
      pinchDistRef.current = dist;
      initialZoomRef.current = zoomLevel;
      return;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };

      if (isPanMode) {
        setIsPanning(true);
        return;
      }

      if (labMode === "presets" && activeExperiment.id === "optics-lens") {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const clickX = touch.clientX - rect.left;
        const clickY = touch.clientY - rect.top;

        const w = canvas.width / (window.devicePixelRatio || 1);
        const cy = (canvas.height / (window.devicePixelRatio || 1)) / 2;
        const cx = w / 2;
        const u = params.objectDistance || 160;
        const ho = params.objectHeight || 50;

        if (Math.abs(clickX - (cx - u)) < 36 && clickY >= cy - ho - 30 && clickY <= cy + 30) {
          setOpticsDrag((prev) => ({ ...prev, isDraggingObject: true }));
        }
      }
    }
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2 && pinchDistRef.current !== null) {
      const newDist = getTouchDistance(e.touches[0], e.touches[1]);
      const scale = newDist / pinchDistRef.current;
      const newZoom = Math.min(3.0, Math.max(0.5, initialZoomRef.current * scale));
      setZoomLevel(parseFloat(newZoom.toFixed(2)));
      return;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (isPanning || isPanMode) {
        const dx = touch.clientX - touchStartPosRef.current.x;
        const dy = touch.clientY - touchStartPosRef.current.y;
        touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
        setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        return;
      }

      if (labMode === "presets" && activeExperiment.id === "optics-lens" && opticsDrag.isDraggingObject) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const curX = touch.clientX - rect.left;
        const w = canvas.width / (window.devicePixelRatio || 1);
        const cx = w / 2;
        const newU = Math.max(40, Math.min(260, cx - curX));
        setParams((prev) => ({ ...prev, objectDistance: Math.round(newU) }));
      }
    }
  };

  const handleCanvasTouchEnd = () => {
    pinchDistRef.current = null;
    setIsPanning(false);
    if (opticsDrag.isDraggingObject) {
      setOpticsDrag((prev) => ({ ...prev, isDraggingObject: false }));
    }
  };

  // Main 60 FPS Canvas Rendering Engine
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Apply Zoom and Pan transform
    if (zoomLevel !== 1 || panOffset.x !== 0 || panOffset.y !== 0) {
      const cx = w / 2;
      const cy = h / 2;
      ctx.translate(cx + panOffset.x, cy + panOffset.y);
      ctx.scale(zoomLevel, zoomLevel);
      ctx.translate(-cx, -cy);
    }

    // If in AI Custom Simulation Mode
    if (labMode === "ai-generator" && activeAISim) {
      renderCustomAISimulation(ctx, w, h, activeAISim, params, simTime);
      ctx.restore();
      return;
    }

    // Otherwise clear background for Preset Labs
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, w, h);

    // Subtle laboratory grid overlay
    ctx.strokeStyle = "rgba(30, 41, 59, 0.4)";
    ctx.lineWidth = 1;
    const gridSize = 24;
    for (let gx = 0; gx < w; gx += gridSize) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, h);
      ctx.stroke();
    }
    for (let gy = 0; gy < h; gy += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(w, gy);
      ctx.stroke();
    }

    // Dispatch to modular preset experiment renderer
    switch (activeExperiment.id) {
      case "optics-lens":
        drawOpticsLens(ctx, w, h, params, opticsDrag);
        break;
      case "ohms-law":
        drawOhmsLawCircuit(ctx, w, h, params, simTime);
        break;
      case "acid-base-ph":
        drawAcidBaseTitration(ctx, w, h, params, simTime);
        break;
      case "cell-microscope":
        drawCellMicroscope(ctx, w, h, params, simTime);
        break;
      case "trig-unit-circle":
        drawTrigUnitCircle(ctx, w, h, params, simTime);
        break;
      case "pendulum-motion":
        drawPendulumMotion(ctx, w, h, params, simTime);
        break;
      default:
        if (CURATED_PRESET_MAP[activeExperiment.id]) {
          renderCustomAISimulation(ctx, w, h, CURATED_PRESET_MAP[activeExperiment.id], params, simTime);
        }
        break;
    }

    ctx.restore();
  }, [labMode, activeAISim, activeExperiment.id, params, opticsDrag, simTime, zoomLevel, panOffset]);

  // Animation Loop with Playback Speed
  useEffect(() => {
    let animId: number;
    const loop = (timestamp: number) => {
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        setSimTime((prev) => prev + dt * simSpeed);

        // For acid-base dripping auto-advance in preset mode
        if (labMode === "presets" && activeExperiment.id === "acid-base-ph" && (params.dripRate || 0) > 0) {
          const rate = params.dripRate || 1;
          setParams((prev) => {
            const cur = prev.titrantVolume || 0;
            if (cur >= 50) return prev;
            return { ...prev, titrantVolume: Math.min(50, cur + rate * dt * 2.5 * simSpeed) };
          });
        }
      }

      renderCanvas();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    animFrameIdRef.current = animId;

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, simSpeed, renderCanvas, labMode, activeExperiment.id, params.dripRate]);

  // Fresh STEM Inspiration Chips for AI Simulator
  const SAMPLE_TOPIC_CHIPS = [
    { label: "Bernoulli's Principle", icon: "✈️", topic: "Bernoulli's Fluid Principle" },
    { label: "Photoelectric Effect", icon: "💡", topic: "Photoelectric Effect" },
    { label: "DNA Replication", icon: "🧬", topic: "DNA Replication Fork" },
    { label: "Carnot Heat Engine", icon: "🔥", topic: "Carnot Heat Engine" },
    { label: "Archimedes Buoyancy", icon: "⚓", topic: "Archimedes Buoyancy" },
    { label: "Kepler's Planetary Law", icon: "🪐", topic: "Kepler's Planetary Laws" },
    { label: "Hall Effect & Magnetism", icon: "🧲", topic: "Hall Effect Magnetism" },
    { label: "Enzyme Kinetics", icon: "🧪", topic: "Enzyme Kinetics Michaelis-Menten" },
  ];

  // -------------------------------------------------------------
  // FULLSCREEN IMMERSIVE THEATER VIEW
  // -------------------------------------------------------------
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col w-screen h-screen overflow-hidden select-none">
        {/* Fullscreen Floating Top HUD */}
        <div className="px-3 py-2 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between gap-2 z-20 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setIsFullscreen(false)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold border border-slate-700 transition-all cursor-pointer shrink-0"
              title="Exit Fullscreen (Esc)"
            >
              <Minimize2 className="w-3.5 h-3.5 text-[#796AEF]" />
              <span className="hidden xs:inline">Exit Fullscreen</span>
            </button>
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-sm shrink-0">
                {labMode === "ai-generator" && activeAISim ? "✨" : activeExperiment.icon}
              </span>
              <span className="font-bold text-white text-xs sm:text-sm truncate">
                {labMode === "ai-generator" && activeAISim ? activeAISim.title : activeExperiment.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
                isPlaying
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-amber-500/20 border-amber-500/40 text-amber-400"
              }`}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span className="text-[10px] font-semibold">{isPlaying ? "Live" : "Paused"}</span>
            </button>

            <button
              onClick={handleResetParams}
              className="p-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Reset Parameters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowFullscreenSliders(!showFullscreenSliders)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                showFullscreenSliders
                  ? "bg-[#796AEF] text-white border-[#796AEF] shadow-xs"
                  : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
              }`}
              title="Toggle Sliders"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Sliders</span>
            </button>
          </div>
        </div>

        {/* Full-Height Canvas */}
        <div
          ref={canvasContainerRef}
          className={`relative w-full flex-1 min-h-0 bg-slate-950 overflow-hidden ${
            isPanMode || opticsDrag.isDraggingObject ? "touch-none" : "touch-pan-y"
          }`}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onWheel={handleCanvasWheel}
            onTouchStart={handleCanvasTouchStart}
            onTouchMove={handleCanvasTouchMove}
            onTouchEnd={handleCanvasTouchEnd}
            onTouchCancel={handleCanvasTouchEnd}
            className={`w-full h-full block ${
              isPanMode
                ? "cursor-grab active:cursor-grabbing touch-none"
                : opticsDrag.isDraggingObject
                ? "touch-none"
                : labMode === "presets" && activeExperiment.id === "optics-lens" && opticsDrag.hoveringObject
                ? "cursor-grab active:cursor-grabbing touch-pan-y"
                : "touch-pan-y"
            }`}
          />

          {justLoggedToast && (
            <div className="absolute top-3 right-3 z-30 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 animate-bounce">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Reading Logged!
            </div>
          )}

          {/* Floating Sliders Drawer in Fullscreen Mode */}
          {showFullscreenSliders && (
            <div className="absolute bottom-4 left-3 right-3 sm:left-6 sm:right-6 max-w-lg mx-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-2xl z-40 space-y-2 max-h-[50vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-xs">
                <span className="font-bold text-white flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-[#796AEF]" />
                  Simulation Parameters
                </span>
                <button
                  onClick={() => setShowFullscreenSliders(false)}
                  className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {labMode === "ai-generator" && activeAISim ? (
                  activeAISim.parameters.map((param) => {
                    const val = params[param.key] ?? param.defaultValue ?? param.min;
                    return (
                      <div key={param.key} className="bg-slate-800/90 px-2 py-1.5 rounded-lg border border-slate-700 space-y-1">
                        <div className="flex items-center justify-between text-xs leading-none">
                          <span className="font-bold text-slate-200 text-[10px] truncate max-w-[80px]" title={param.label}>{param.label}</span>
                          <span className="font-mono font-bold text-cyan-300 text-[10px]">{val} {param.unit}</span>
                        </div>
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={val}
                          onChange={(e) => handleParamChange(param.key, parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-[#796AEF]"
                        />
                      </div>
                    );
                  })
                ) : (
                  activeExperiment.paramConfigs.map((cfg) => {
                    const val = params[cfg.key] ?? cfg.min;
                    return (
                      <div key={cfg.key} className="bg-slate-800/90 px-2 py-1.5 rounded-lg border border-slate-700 space-y-1">
                        <div className="flex items-center justify-between text-xs leading-none">
                          <span className="font-bold text-slate-200 text-[10px] truncate max-w-[80px]" title={cfg.label}>{cfg.label}</span>
                          <span className="font-mono font-bold text-cyan-300 text-[10px]">{val} {cfg.unit}</span>
                        </div>
                        <input
                          type="range"
                          min={cfg.min}
                          max={cfg.max}
                          step={cfg.step}
                          value={val}
                          onChange={(e) => handleParamChange(cfg.key, parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-[#796AEF]"
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen Bottom Telemetry HUD */}
        <div className="px-3 py-1.5 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-between gap-2 z-20 shrink-0 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none min-w-0">
            <span className="text-[10px] font-bold text-[#796AEF] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-[#796AEF]" />
              Live:
            </span>
            {labMode === "ai-generator" && activeAISim ? (
              activeAISim.liveOutputs.map((out) => (
                <div key={out.key} className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] shrink-0 text-cyan-300">
                  <span className="text-slate-400 mr-1">{out.label}:</span>
                  <span className="font-bold">{params[out.key] ?? Object.values(params)[0]} {out.unit}</span>
                </div>
              ))
            ) : activeExperiment.id === "optics-lens" ? (
              (() => {
                const uVal = params.objectDistance || 160;
                const fVal = params.focalLength || 80;
                const isConvex = (params.lensType ?? 1) === 1;
                let vStr = "";
                let natureStr = "";
                if (isConvex) {
                  if (uVal === fVal) {
                    vStr = "∞ (At Infinity)";
                    natureStr = "Real & Inverted";
                  } else if (uVal < fVal) {
                    const vCalc = (fVal * uVal) / (fVal - uVal);
                    vStr = `-${vCalc.toFixed(1)} cm`;
                    natureStr = "Virtual & Erect";
                  } else {
                    const vCalc = (fVal * uVal) / (uVal - fVal);
                    vStr = `+${vCalc.toFixed(1)} cm`;
                    natureStr = "Real & Inverted";
                  }
                } else {
                  const vCalc = (fVal * uVal) / (uVal + fVal);
                  vStr = `-${vCalc.toFixed(1)} cm`;
                  natureStr = "Virtual & Erect";
                }
                return (
                  <>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] shrink-0 text-cyan-300">
                      <span className="text-slate-400 mr-1">u:</span>
                      <span className="font-bold">-{uVal} cm</span>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] shrink-0 text-emerald-300">
                      <span className="text-slate-400 mr-1">v:</span>
                      <span className="font-bold">{vStr}</span>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] shrink-0 text-amber-300">
                      <span className="text-slate-400 mr-1">f:</span>
                      <span className="font-bold">{isConvex ? `+${fVal}` : `-${fVal}`} cm</span>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] shrink-0 text-purple-300">
                      <span className="font-bold">{natureStr}</span>
                    </div>
                  </>
                );
              })()
            ) : (
              activeExperiment.paramConfigs.slice(0, 3).map((cfg) => (
                <div key={cfg.key} className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] shrink-0 text-cyan-300">
                  <span className="text-slate-400 mr-1">{cfg.label}:</span>
                  <span className="font-bold">{params[cfg.key] ?? cfg.min} {cfg.unit}</span>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 bg-slate-950/80 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-1 text-[9px] font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Reset Zoom (100%)"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <div className="w-[1px] h-3 bg-slate-700 mx-0.5" />
            <button
              onClick={() => setIsPanMode(!isPanMode)}
              className={`p-1 rounded transition-all cursor-pointer ${
                isPanMode ? "bg-[#796AEF] text-white shadow-xs" : "hover:bg-slate-800 text-slate-300 hover:text-white"
              }`}
              title={isPanMode ? "Disable Pan Mode" : "Enable Pan (Drag to Pan)"}
            >
              <Hand className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-white text-[#1E293B] font-sans min-h-[600px] rounded-2xl border border-[#EFF1F5] shadow-xs overflow-hidden">
      {/* 1. Top Header Banner & Studio Mode Switcher (Uniform 52px Native Header) */}
      <div className="w-full h-[52px] min-h-[52px] max-h-[52px] px-3.5 sm:px-5 flex items-center justify-between border-b border-slate-200/80 bg-white shrink-0 shadow-2xs z-20">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 text-[#796AEF] flex items-center justify-center shadow-xs shrink-0">
            <FlaskConical className="w-4 h-4 text-[#796AEF]" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <h2 className="text-xs sm:text-sm font-sans font-extrabold uppercase tracking-wide text-slate-900 truncate">
              {t.virtualLabTitle || "Virtual Lab"}
            </h2>
            <span className="text-[9.5px] font-mono font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full border border-emerald-200/80 shrink-0">
              60 FPS
            </span>
          </div>
        </div>

        {/* Studio Mode Switcher: Presets vs AI Generator */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-100/90 rounded-lg border border-slate-200/80 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setLabMode("presets")}
            className={`flex items-center justify-center gap-1 px-2 py-1 rounded-md font-bold text-[10.5px] sm:text-xs transition-all cursor-pointer ${
              labMode === "presets"
                ? "bg-[#796AEF] text-white shadow-xs"
                : "text-[#4A4E5A] hover:text-[#1E293B] hover:bg-white"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span className="truncate">Ready ({filteredExperiments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLabMode("ai-generator");
            }}
            className={`flex items-center justify-center gap-1 px-2 py-1 rounded-md font-bold text-[10.5px] sm:text-xs transition-all cursor-pointer ${
              labMode === "ai-generator"
                ? "bg-[#796AEF] text-white shadow-xs"
                : "text-[#4A4E5A] hover:text-[#1E293B] hover:bg-white"
            }`}
          >
            <Wand2 className="w-3 h-3" />
            <span className="truncate">AI Sim ({studentSimulations.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Mode-Specific Top Control Bar */}
      {labMode === "presets" ? (
        /* Subject Filter Bar & Preset Carousel */
        <div className="bg-[#F8FAFC] border-b border-[#EFF1F5] px-2.5 sm:px-6 py-1.5 sm:py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
          {/* Subject Filter Pills & Grade Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EEF2FF] border border-[#796AEF]/30 text-[#796AEF] text-[10px] sm:text-xs font-bold rounded-lg shrink-0">
              <GraduationCap className="w-3 h-3 text-[#796AEF]" />
              <span>{studentGrade}</span>
            </div>

            <div className="flex items-center gap-0.5 p-0.5 bg-white rounded-lg border border-[#EFF1F5] text-xs shadow-2xs">
              {[
                { id: "all", label: t.filterAll || "All", icon: Layers },
                { id: "physics", label: t.filterPhysics || "Physics", icon: Atom },
                { id: "chemistry", label: t.filterChemistry || "Chemistry", icon: FlaskConical },
                { id: "biology", label: t.filterBiology || "Biology", icon: Sparkles },
                { id: "mathematics", label: t.filterMath || "Math", icon: Sliders },
              ].map((sub) => {
                const Icon = sub.icon;
                const isSel = selectedSubject === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubject(sub.id as LabSubject)}
                    className={`flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md font-medium transition-all whitespace-nowrap text-[10.5px] sm:text-xs cursor-pointer ${
                      isSel
                        ? "bg-[#796AEF] text-white shadow-xs font-bold"
                        : "text-[#4A4E5A] hover:text-[#1E293B] hover:bg-[#F6F7FB]"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick preset cards carousel */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
            {filteredExperiments.length === 0 ? (
              <span className="text-[10px] sm:text-xs text-slate-500 italic px-2 py-0.5">
                No {selectedSubject !== "all" ? selectedSubject : ""} labs for {studentGrade}.
              </span>
            ) : (
              filteredExperiments.map((exp) => {
                const isActive = exp.id === activeExperiment.id;
                return (
                  <button
                    key={exp.id}
                    onClick={() => handleSelectExperiment(exp)}
                    className={`flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border text-[10.5px] sm:text-xs transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-[#EEF2FF] border-[#796AEF] text-[#796AEF] shadow-xs ring-1 ring-[#796AEF]/20 font-bold"
                        : "bg-white border-[#EFF1F5] text-[#4A4E5A] hover:text-[#796AEF] hover:border-[#796AEF]/30 shadow-2xs font-medium"
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{exp.icon}</span>
                    <span className="truncate">{exp.title.split(":")[0]}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* AI Custom Simulator Prompt Engine & Student Simulations Bar */
        <div className="bg-[#F8FAFC] border-b border-[#EFF1F5] px-3.5 sm:px-6 py-3 space-y-2.5">
          {/* Student's Generated Simulations List (if any exist) */}
          {studentSimulations.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              <span className="text-[11px] font-bold text-[#1E293B] whitespace-nowrap flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#796AEF]" />
                My Generated Labs ({studentSimulations.length}):
              </span>
              {studentSimulations.map((sim) => {
                const isActive = activeAISim?.id === sim.id;
                return (
                  <div
                    key={sim.id}
                    onClick={() => handleSelectStudentSim(sim)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer group ${
                      isActive
                        ? "bg-[#EEF2FF] border-[#796AEF] text-[#796AEF] shadow-xs ring-1 ring-[#796AEF]/20 font-bold"
                        : "bg-white border-[#EFF1F5] text-[#4A4E5A] hover:border-[#796AEF]/30 hover:text-[#796AEF] shadow-2xs"
                    }`}
                  >
                    <span>✨</span>
                    <span className="truncate max-w-[140px]">{sim.title}</span>
                    <button
                      onClick={(e) => handleDeleteStudentSim(sim.id, e)}
                      className="p-0.5 text-slate-400 hover:text-rose-600 rounded transition-colors ml-0.5"
                      title="Remove generated simulation"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* AI Generator Input Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerateCustomSimulation()}
                placeholder={t.labPlaceholder || 'Type any topic (e.g. "Bernoulli Principle", "DNA Replication", "Photoelectric Effect")...'}
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#EFF1F5] rounded-xl text-xs sm:text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#796AEF] focus:ring-2 focus:ring-[#796AEF]/20 transition-all shadow-xs"
              />
            </div>

            <button
              onClick={() => handleGenerateCustomSimulation()}
              disabled={isGeneratingSim || !customTopicInput.trim()}
              className="w-full sm:w-auto px-5 py-2 bg-[#796AEF] hover:bg-[#6858e0] disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all whitespace-nowrap cursor-pointer"
            >
              {isGeneratingSim ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.labGenerating || "Generating Simulation..."}
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  {t.labBtnGenerate || "✨ Generate AI Sim"}
                </>
              )}
            </button>
          </div>

          {/* Quick 1-Click Topic Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pt-1">
            <span className="text-[11px] font-bold text-[#1E293B] whitespace-nowrap flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#796AEF]" />
              {t.labInspiration || "Inspiration Topics:"}
            </span>
            {SAMPLE_TOPIC_CHIPS.map((chip) => (
              <button
                key={chip.topic}
                onClick={() => {
                  setCustomTopicInput(chip.topic);
                  handleGenerateCustomSimulation(chip.topic);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all whitespace-nowrap cursor-pointer ${
                  activeAISim?.topic.toLowerCase().includes(chip.topic.toLowerCase())
                    ? "bg-[#EEF2FF] border-[#796AEF] text-[#796AEF] shadow-xs font-bold"
                    : "bg-white border-[#EFF1F5] text-[#4A4E5A] hover:border-[#796AEF]/30 hover:text-[#796AEF] shadow-2xs"
                }`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Main Stage: Responsive Mobile-First Simulation Canvas & Workspace */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Canvas Viewport (Full width) */}
        <div className="w-full flex flex-col bg-slate-950 relative">
          {/* Top Canvas Bar */}
          <div className="px-2.5 sm:px-4 py-1 sm:py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-1.5 sm:gap-2 text-xs">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="text-sm sm:text-base shrink-0">
                {labMode === "ai-generator" ? (activeAISim ? "✨" : "🪄") : activeExperiment.icon}
              </span>
              <div className="truncate">
                <span className="font-bold text-white text-xs sm:text-sm">
                  {labMode === "ai-generator"
                    ? activeAISim
                      ? activeAISim.title
                      : "AI Custom Simulation Studio (कस्टम सिमुलेटर)"
                    : activeExperiment.title}
                </span>
                <span className="text-slate-400 ml-1 text-[10px] sm:text-[11px] hidden md:inline">
                  {labMode === "ai-generator"
                    ? activeAISim
                      ? `(${activeAISim.hindiTitle})`
                      : "(Generate on Demand)"
                    : `(${activeExperiment.hindiTitle})`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Play / Pause Toggle */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md sm:rounded-lg border flex items-center gap-1 transition-all ${
                  isPlaying
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30"
                    : "bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30"
                }`}
                title={isPlaying ? "Pause Simulation" : "Play Simulation"}
              >
                {isPlaying ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                <span className="text-[10px] sm:text-[11px] font-semibold">{isPlaying ? "Live" : "Paused"}</span>
              </button>

              {/* Step Forward 1 Frame */}
              <button
                onClick={handleStepForward}
                className="p-1 sm:p-1.5 rounded-md sm:rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                title="Step Forward 1 Frame (0.05s)"
              >
                <StepForward className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>

              {/* Playback Speed Selector */}
              <div className="hidden xs:flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[9px] sm:text-[10px]">
                {[0.5, 1.0, 2.0].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSimSpeed(spd)}
                    className={`px-1 sm:px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                      simSpeed === spd
                        ? "bg-[#796AEF] text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                    title={`Speed ${spd}x`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Reset Parameters */}
              <button
                onClick={handleResetParams}
                className="p-1 sm:p-1.5 rounded-md sm:rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
                title="Reset Parameters & View"
              >
                <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg border transition-all cursor-pointer ${
                  isFullscreen
                    ? "bg-[#796AEF] text-white border-[#796AEF] shadow-xs"
                    : "border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
                title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen Canvas Mode"}
              >
                {isFullscreen ? <Minimize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              </button>

              {/* Log Reading */}
              <button
                onClick={handleRecordObservation}
                className="relative px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-[#796AEF] hover:bg-[#6858e0] text-white font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                title="Log this reading in Observation Table"
              >
                <PlusCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="text-[10px] sm:text-[11px] whitespace-nowrap">Log</span>
                {observations.length > 0 && (
                  <span className="px-1 py-0.2 bg-white/20 text-white rounded-full text-[8.5px] font-black border border-white/30">
                    {observations.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Interactive HTML5 Canvas Container */}
          <div
            ref={canvasContainerRef}
            className={`relative w-full h-[200px] xs:h-[220px] sm:h-[250px] md:h-[280px] bg-slate-950 overflow-hidden ${
              isPanMode || opticsDrag.isDraggingObject ? "touch-none" : "touch-pan-y"
            }`}
          >
            {/* Toast feedback when reading logged */}
            {justLoggedToast && (
              <div className="absolute top-3 right-3 z-30 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 animate-bounce">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Reading Logged!
              </div>
            )}

            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onWheel={handleCanvasWheel}
              onTouchStart={handleCanvasTouchStart}
              onTouchMove={handleCanvasTouchMove}
              onTouchEnd={handleCanvasTouchEnd}
              onTouchCancel={handleCanvasTouchEnd}
              className={`w-full h-full block ${
                isPanMode
                  ? "cursor-grab active:cursor-grabbing touch-none"
                  : opticsDrag.isDraggingObject
                  ? "touch-none"
                  : labMode === "presets" && activeExperiment.id === "optics-lens" && opticsDrag.hoveringObject
                  ? "cursor-grab active:cursor-grabbing touch-pan-y"
                  : "touch-pan-y"
              }`}
            />

            {/* If in AI generator mode and no simulation is generated yet */}
            {labMode === "ai-generator" && !activeAISim && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-slate-950/90 backdrop-blur-xs text-white">
                <div className="w-12 h-12 rounded-2xl bg-[#796AEF]/20 border border-[#796AEF]/40 flex items-center justify-center text-[#796AEF] mb-3 shadow-lg">
                  <Wand2 className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-sm sm:text-base font-black text-white mb-1">
                  AI Science Simulator (जादुई)
                </h4>
                <p className="text-xs text-slate-300 max-w-sm mb-4">
                  Type any science topic above or click an inspiration chip to generate an interactive real-time simulation.
                </p>
                <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-md">
                  {SAMPLE_TOPIC_CHIPS.slice(0, 4).map((chip) => (
                    <button
                      key={chip.topic}
                      onClick={() => {
                        setCustomTopicInput(chip.topic);
                        handleGenerateCustomSimulation(chip.topic);
                      }}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-[#796AEF]/50 rounded-lg text-[11px] text-slate-200 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <span>{chip.icon}</span>
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Real-time Live Telemetry Pill Strip (Visible on mobile & desktop) */}
          <div className="px-2.5 sm:px-4 py-1 sm:py-1.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-1.5 sm:gap-2 text-xs text-slate-200">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-thin min-w-0">
              <span className="text-[9.5px] sm:text-[10px] font-bold text-[#796AEF] uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-[#796AEF]" />
                Live:
              </span>

            {labMode === "ai-generator" && activeAISim ? (
              activeAISim.liveOutputs.map((out) => (
                <div key={out.key} className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-cyan-300">
                  <span className="text-slate-400 mr-1">{out.label}:</span>
                  <span className="font-bold">{params[out.key] ?? Object.values(params)[0]} {out.unit}</span>
                </div>
              ))
            ) : activeExperiment.id === "optics-lens" ? (
              (() => {
                const uVal = params.objectDistance || 160;
                const fVal = params.focalLength || 80;
                const isConvex = (params.lensType ?? 1) === 1;
                let vCalc = 0;
                let isVirtual = false;
                if (isConvex) {
                  if (Math.abs(uVal - fVal) < 1) {
                    vCalc = Infinity;
                  } else if (uVal < fVal) {
                    vCalc = (fVal * uVal) / (fVal - uVal);
                    isVirtual = true;
                  } else {
                    vCalc = (fVal * uVal) / (uVal - fVal);
                    isVirtual = false;
                  }
                } else {
                  vCalc = (fVal * uVal) / (uVal + fVal);
                  isVirtual = true;
                }
                const mCalc = vCalc !== Infinity ? Math.abs(vCalc / uVal) : Infinity;
                const nature = vCalc === Infinity ? "Infinity" : isVirtual ? `Virtual, Erect (m = +${mCalc.toFixed(2)})` : `Real, Inverted (m = -${mCalc.toFixed(2)})`;

                return (
                  <>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-cyan-300">
                      <span className="text-slate-400 mr-1">u:</span>
                      <span className="font-bold">-{uVal} cm</span>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-amber-300">
                      <span className="text-slate-400 mr-1">v:</span>
                      <span className="font-bold">{isVirtual ? "-" : "+"}{vCalc === Infinity ? "∞" : `${vCalc.toFixed(1)} cm`}</span>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-emerald-300">
                      <span className="text-slate-400 mr-1">f:</span>
                      <span className="font-bold">{isConvex ? "+" : "-"}{fVal} cm</span>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-indigo-300">
                      <span className="text-slate-400 mr-1">Nature:</span>
                      <span className="font-bold">{nature}</span>
                    </div>
                  </>
                );
              })()
            ) : activeExperiment.id === "ohms-law" ? (
              (() => {
                const V = params.voltage || 12;
                const R = params.resistance || 6;
                const isClosed = (params.switchState ?? 1) === 1;
                const I = isClosed ? V / R : 0;
                const P = isClosed ? V * I : 0;
                return (
                  <>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-cyan-300">
                      <span className="text-slate-400 mr-1">V:</span>
                      <span className="font-bold">{V} V</span>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-amber-300">
                      <span className="text-slate-400 mr-1">R:</span>
                      <span className="font-bold">{R} Ω</span>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-emerald-300">
                      <span className="text-slate-400 mr-1">Current (I):</span>
                      <span className="font-bold">{I.toFixed(2)} A</span>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-yellow-300">
                      <span className="text-slate-400 mr-1">Power (P):</span>
                      <span className="font-bold">{P.toFixed(1)} W</span>
                    </div>
                  </>
                );
              })()
            ) : activeExperiment.id === "acid-base-ph" ? (
              (() => {
                const vAdded = params.titrantVolume || 0;
                // Calculate pH
                let ph = 1.0;
                if (vAdded < 25) {
                  const unreactedMoles = (0.1 * (25 - vAdded)) / 1000;
                  const totalVolL = (25 + vAdded) / 1000;
                  const hConc = unreactedMoles / totalVolL;
                  ph = Math.max(1.0, -Math.log10(hConc));
                } else if (vAdded === 25) {
                  ph = 7.0;
                } else {
                  const excessMoles = (0.1 * (vAdded - 25)) / 1000;
                  const totalVolL = (25 + vAdded) / 1000;
                  const ohConc = excessMoles / totalVolL;
                  ph = Math.min(13.0, 14 + Math.log10(ohConc));
                }
                const status = ph < 6.8 ? "Acidic" : ph > 7.2 ? "Alkaline" : "Neutral";
                return (
                  <>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-cyan-300">
                      <span className="text-slate-400 mr-1">NaOH Added:</span>
                      <span className="font-bold">{vAdded.toFixed(1)} mL</span>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-emerald-300">
                      <span className="text-slate-400 mr-1">pH:</span>
                      <span className="font-bold">{ph.toFixed(2)} ({status})</span>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-pink-300">
                      <span className="text-slate-400 mr-1">Indicator:</span>
                      <span className="font-bold">{ph >= 8.2 ? "Pink (Base)" : "Colorless"}</span>
                    </div>
                  </>
                );
              })()
            ) : activeExperiment.id === "pendulum-motion" ? (
              (() => {
                const L = params.length || 100;
                const g = params.gravity || 9.8;
                const T = 2 * Math.PI * Math.sqrt(L / 100 / g);
                const f = 1 / T;
                return (
                  <>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-cyan-300">
                      <span className="text-slate-400 mr-1">Length:</span>
                      <span className="font-bold">{L} cm</span>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-emerald-300">
                      <span className="text-slate-400 mr-1">Period (T):</span>
                      <span className="font-bold">{T.toFixed(2)} s</span>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-indigo-300">
                      <span className="text-slate-400 mr-1">Frequency (f):</span>
                      <span className="font-bold">{f.toFixed(2)} Hz</span>
                    </div>
                  </>
                );
              })()
            ) : activeExperiment.id === "trig-unit-circle" ? (
              (() => {
                const deg = (params.thetaDeg || 45) % 360;
                const rad = (deg * Math.PI) / 180;
                const s = Math.sin(rad);
                const c = Math.cos(rad);
                const t = Math.abs(c) > 1e-4 ? s / c : Infinity;
                return (
                  <>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-cyan-300">
                      <span className="text-slate-400 mr-1">Angle (θ):</span>
                      <span className="font-bold">{deg}°</span>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-emerald-300">
                      <span className="text-slate-400 mr-1">sin(θ):</span>
                      <span className="font-bold">{s.toFixed(3)}</span>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-amber-300">
                      <span className="text-slate-400 mr-1">cos(θ):</span>
                      <span className="font-bold">{c.toFixed(3)}</span>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-indigo-300">
                      <span className="text-slate-400 mr-1">tan(θ):</span>
                      <span className="font-bold">{t === Infinity ? "±∞" : t.toFixed(3)}</span>
                    </div>
                  </>
                );
              })()
            ) : CURATED_PRESET_MAP[activeExperiment.id] ? (
              CURATED_PRESET_MAP[activeExperiment.id].liveOutputs.map((out) => (
                <div key={out.key} className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-cyan-300">
                  <span className="text-slate-400 mr-1">{out.label}:</span>
                  <span className="font-bold">{params[out.key] ?? Object.values(params)[0]} {out.unit}</span>
                </div>
              ))
            ) : (
              <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] sm:text-[11px] shrink-0 text-cyan-300">
                <span className="text-slate-400 mr-1">Magnification:</span>
                <span className="font-bold">{params.magnification || 100}x</span>
              </div>
            )}
            </div>

            {/* Live Zoom/Pan Controls & Quick Sliders Anchor (Mobile & Desktop) */}
            <div className="flex items-center gap-1 shrink-0">
              <div className="flex items-center gap-0.5 bg-slate-950/80 border border-slate-700/80 rounded-lg p-0.5 text-slate-200">
                <button
                  onClick={handleZoomOut}
                  className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="px-1.5 py-0.5 rounded hover:bg-slate-800 text-[9.5px] font-mono text-cyan-300 font-bold transition-all cursor-pointer"
                  title="Reset Zoom & Pan (100%)"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
                <div className="w-[1px] h-3 bg-slate-700 mx-0.5" />
                <button
                  onClick={() => setIsPanMode(!isPanMode)}
                  className={`p-1 rounded transition-all cursor-pointer ${
                    isPanMode
                      ? "bg-[#796AEF] text-white shadow-xs"
                      : "hover:bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                  title={isPanMode ? "Disable Pan Mode" : "Enable Pan (Drag to Pan)"}
                >
                  <Hand className="w-3 h-3" />
                </button>
              </div>

              {/* Direct jump to sliders from Live Meters */}
              <button
                onClick={() => {
                  const el = document.getElementById("simulation-sliders-deck");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="shrink-0 px-1.5 py-1 bg-[#796AEF] hover:bg-[#6858e0] text-white rounded-lg text-[9.5px] font-bold flex items-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95"
                title="Jump to simulation sliders"
              >
                <Sliders className="w-2.5 h-2.5" />
                <span>Sliders ↓</span>
              </button>
            </div>
          </div>

          {/* Interactive Simulation Parameters & Control Deck (Directly under simulation canvas) */}
          <div id="simulation-sliders-deck" className="w-full p-2 sm:p-2.5 bg-white border-t border-slate-200 space-y-1.5 scroll-mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-[#EEF2FF] text-[#796AEF] flex items-center justify-center font-bold shrink-0">
                  <Sliders className="w-3 h-3 text-[#796AEF]" />
                </div>
                <div className="flex items-center gap-1">
                  <h4 className="text-[11px] font-bold text-[#1E293B] leading-tight">
                    {t.experimentControls || "Simulation Controls"}
                  </h4>
                  <span className="px-1.5 py-0.2 text-[8px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md leading-tight">
                    Live
                  </span>
                </div>
              </div>

              {/* Quick Reset Parameters Button */}
              <button
                onClick={handleResetParams}
                className="px-1.5 py-0.5 text-[9.5px] font-bold text-slate-600 hover:text-[#796AEF] bg-slate-100 hover:bg-[#EEF2FF] rounded-md border border-slate-200 hover:border-[#796AEF]/30 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                title="Reset simulation parameters to default"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Slider cards for all experiments (Presets or AI Generator) in 2-column compact grid */}
            <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
              {labMode === "ai-generator" && !activeAISim ? (
                <div className="col-span-full p-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center">
                  <p className="text-xs text-slate-500 font-medium">Generate or select an AI simulation to view live controls</p>
                </div>
              ) : labMode === "ai-generator" && activeAISim ? (
                activeAISim.parameters.map((param) => {
                  const val = params[param.key] ?? param.defaultValue ?? param.min;
                  return (
                    <div key={param.key} className="bg-[#F8FAFC] px-1.5 py-1 rounded-lg border border-[#EFF1F5] shadow-2xs space-y-0.5 hover:border-[#796AEF]/30 transition-all">
                      <div className="flex items-center justify-between text-xs leading-none">
                        <span className="font-bold text-[#1E293B] text-[10px] sm:text-xs truncate max-w-[80px]" title={param.label}>{param.label}</span>
                        <span className="font-mono font-bold text-[#796AEF] bg-[#EEF2FF] px-1.5 py-0.2 rounded border border-[#796AEF]/30 text-[9px] sm:text-[10px] shrink-0 ml-1">
                          {val} {param.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleParamChange(param.key, Math.max(param.min, +(val - param.step).toFixed(2)))}
                          className="w-5 h-5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 cursor-pointer shadow-2xs active:scale-95"
                          title="Decrease"
                        >
                          -
                        </button>
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={val}
                          onChange={(e) => handleParamChange(param.key, parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#796AEF]"
                        />
                        <button
                          onClick={() => handleParamChange(param.key, Math.min(param.max, +(val + param.step).toFixed(2)))}
                          className="w-5 h-5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 cursor-pointer shadow-2xs active:scale-95"
                          title="Increase"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                activeExperiment.paramConfigs.map((cfg) => {
                  const val = params[cfg.key] ?? cfg.min;
                  return (
                    <div key={cfg.key} className="bg-[#F8FAFC] px-1.5 py-1 rounded-lg border border-[#EFF1F5] shadow-2xs space-y-0.5 hover:border-[#796AEF]/30 transition-all">
                      <div className="flex items-center justify-between text-xs leading-none">
                        <span className="font-bold text-[#1E293B] text-[10px] sm:text-xs truncate max-w-[80px]" title={cfg.label}>{cfg.label}</span>
                        <span className="font-mono font-bold text-[#796AEF] bg-[#EEF2FF] px-1.5 py-0.2 rounded border border-[#796AEF]/30 text-[9px] sm:text-[10px] shrink-0 ml-1">
                          {val} {cfg.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleParamChange(cfg.key, Math.max(cfg.min, +(val - cfg.step).toFixed(2)))}
                          className="w-5 h-5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 cursor-pointer shadow-2xs active:scale-95"
                          title="Decrease"
                        >
                          -
                        </button>
                        <input
                          type="range"
                          min={cfg.min}
                          max={cfg.max}
                          step={cfg.step}
                          value={val}
                          onChange={(e) => handleParamChange(cfg.key, parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#796AEF]"
                        />
                        <button
                          onClick={() => handleParamChange(cfg.key, Math.min(cfg.max, +(val + cfg.step).toFixed(2)))}
                          className="w-5 h-5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 cursor-pointer shadow-2xs active:scale-95"
                          title="Increase"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Presets & Interactive Buttons per experiment */}
            {labMode === "presets" && activeExperiment.id === "optics-lens" && (
              <div className="grid grid-cols-2 gap-1 pt-0.5">
                <button
                  onClick={() => handleParamChange("lensType", 1)}
                  className={`py-1 px-1.5 text-[10px] sm:text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                    params.lensType === 1
                      ? "bg-[#796AEF] text-white border-[#796AEF] shadow-xs"
                      : "bg-white border-[#EFF1F5] text-[#4A4E5A] hover:bg-slate-50"
                  }`}
                >
                  🔍 Convex Lens (F &gt; 0)
                </button>
                <button
                  onClick={() => handleParamChange("lensType", 0)}
                  className={`py-1 px-1.5 text-[10px] sm:text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                    params.lensType === 0
                      ? "bg-[#796AEF] text-white border-[#796AEF] shadow-xs"
                      : "bg-white border-[#EFF1F5] text-[#4A4E5A] hover:bg-slate-50"
                  }`}
                >
                  🔎 Concave Lens (F &lt; 0)
                </button>
              </div>
            )}

            {labMode === "presets" && activeExperiment.id === "ohms-law" && (
              <div className="pt-0.5">
                <button
                  onClick={() => handleParamChange("switchState", params.switchState === 1 ? 0 : 1)}
                  className={`w-full py-1.5 px-2 text-[11px] font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                    params.switchState === 1
                      ? "bg-emerald-600 text-white border-emerald-500 shadow-xs"
                      : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                  }`}
                >
                  {params.switchState === 1 ? "⚡ Circuit Key CLOSED (Current Flowing)" : "⭕ Circuit Key OPEN (No Current)"}
                </button>
              </div>
            )}

            {labMode === "presets" && activeExperiment.id === "acid-base-ph" && (
              <div className="grid grid-cols-3 gap-1 pt-0.5">
                <button
                  onClick={() => handleParamChange("titrantVolume", 0)}
                  className="py-1 px-1 text-[10px] font-bold bg-white border border-[#EFF1F5] text-[#4A4E5A] hover:bg-slate-50 rounded-md shadow-2xs cursor-pointer truncate"
                >
                  0 mL Reset
                </button>
                <button
                  onClick={() => handleParamChange("titrantVolume", 25)}
                  className="py-1 px-1 text-[10px] font-bold bg-[#EEF2FF] border border-[#796AEF]/30 text-[#796AEF] hover:bg-[#EEF2FF]/80 rounded-md shadow-2xs cursor-pointer truncate"
                >
                  25 mL Endpt
                </button>
                <button
                  onClick={() => handleParamChange("dripRate", params.dripRate === 0 ? 1 : 0)}
                  className={`py-1 px-1 text-[10px] font-bold rounded-md border transition-all cursor-pointer truncate ${
                    (params.dripRate || 0) > 0
                      ? "bg-emerald-600 text-white border-emerald-500 shadow-xs"
                      : "bg-slate-100 text-[#4A4E5A] border-[#EFF1F5] hover:bg-slate-200"
                  }`}
                >
                  {(params.dripRate || 0) > 0 ? "💧 Stop Drip" : "💧 Auto Drip"}
                </button>
              </div>
            )}

            {labMode === "presets" && activeExperiment.id === "pendulum-motion" && (
              <div className="grid grid-cols-3 gap-1 pt-0.5">
                <button
                  onClick={() => handleParamChange("gravity", 9.8)}
                  className={`py-1 px-1 text-[10px] font-bold rounded-md border transition-all cursor-pointer truncate ${
                    params.gravity === 9.8
                      ? "bg-[#796AEF] text-white border-[#796AEF]"
                      : "bg-white border-[#EFF1F5] text-[#4A4E5A]"
                  }`}
                >
                  🌍 Earth (9.8)
                </button>
                <button
                  onClick={() => handleParamChange("gravity", 1.6)}
                  className={`py-1 px-1 text-[10px] font-bold rounded-md border transition-all cursor-pointer truncate ${
                    params.gravity === 1.6
                      ? "bg-[#796AEF] text-white border-[#796AEF]"
                      : "bg-white border-[#EFF1F5] text-[#4A4E5A]"
                  }`}
                >
                  🌕 Moon (1.6)
                </button>
                <button
                  onClick={() => handleParamChange("gravity", 24.8)}
                  className={`py-1 px-1 text-[10px] font-bold rounded-md border transition-all cursor-pointer truncate ${
                    params.gravity === 24.8
                      ? "bg-[#796AEF] text-white border-[#796AEF]"
                      : "bg-white border-[#EFF1F5] text-[#4A4E5A]"
                  }`}
                >
                  🪐 Jupiter (24.8)
                </button>
              </div>
            )}

            {labMode === "presets" && activeExperiment.id === "double-slit" && (
              <div className="grid grid-cols-3 gap-1 pt-0.5">
                <button
                  onClick={() => handleParamChange("wavelength", 405)}
                  className={`py-1 px-1 text-[10px] font-bold rounded-md border transition-all cursor-pointer truncate ${
                    params.wavelength === 405 ? "bg-violet-600 text-white border-violet-600" : "bg-white border-[#EFF1F5] text-[#4A4E5A]"
                  }`}
                >
                  🟣 405nm
                </button>
                <button
                  onClick={() => handleParamChange("wavelength", 532)}
                  className={`py-1 px-1 text-[10px] font-bold rounded-md border transition-all cursor-pointer truncate ${
                    params.wavelength === 532 ? "bg-emerald-600 text-white border-emerald-600" : "bg-white border-[#EFF1F5] text-[#4A4E5A]"
                  }`}
                >
                  🟢 532nm
                </button>
                <button
                  onClick={() => handleParamChange("wavelength", 650)}
                  className={`py-1 px-1 text-[10px] font-bold rounded-md border transition-all cursor-pointer truncate ${
                    params.wavelength === 650 ? "bg-rose-600 text-white border-rose-600" : "bg-white border-[#EFF1F5] text-[#4A4E5A]"
                  }`}
                >
                  🔴 650nm
                </button>
              </div>
            )}

            {/* Ask Cherry Ma'am to Explain on Whiteboard */}
            {onOpenClassroomWithTopic && (
              <button
                onClick={handleAskCherryOnWhiteboard}
                className="w-full py-2 px-3 bg-[#EEF2FF] hover:bg-[#e0e7ff] text-[#796AEF] border border-[#796AEF]/40 text-[11px] font-bold rounded-lg flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#796AEF] shrink-0" />
                <span>Ask Cherry Ma'am to Explain on Whiteboard</span>
                <ArrowRight className="w-3 h-3 text-[#796AEF] shrink-0" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Responsive Segmented Tab Bar (Unified for Mobile & Desktop) */}
      <div className="border-t border-[#EFF1F5] bg-white">
        <div className="flex border-b border-[#EFF1F5] px-2 sm:px-6 overflow-x-auto scrollbar-none">
          {[
            { id: "observations", label: `${t.labObservations || "Observation Log"} (${observations.length})`, icon: ClipboardList },
            { id: "manual", label: t.labManual || "Lab Manual & Procedure", icon: BookOpen },
            { id: "viva", label: "Viva-Voce & Quiz", icon: HelpCircle },
          ].map((tItem) => {
            const Icon = tItem.icon;
            const isSel = activeTab === tItem.id;
            return (
              <button
                key={tItem.id}
                onClick={() => setActiveTab(tItem.id as any)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isSel
                    ? "border-[#796AEF] text-[#796AEF] bg-[#EEF2FF]/60 font-bold"
                    : "border-transparent text-[#4A4E5A] hover:text-[#1E293B] hover:bg-[#F6F7FB] font-medium"
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{tItem.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <div className="p-3 sm:p-5 bg-[#F8FAFC] min-h-[220px] pb-6 sm:pb-8">
          {/* OBSERVATIONS TABLE TAB */}
          {activeTab === "observations" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-[#1E293B] flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-[#796AEF]" />
                    Observation Log (प्रेक्षण सारणी)
                  </h3>
                  <p className="text-xs text-[#4A4E5A]">
                    Recorded data points with verified calculations for your practical record book.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRecordObservation}
                    className="px-3 py-1.5 bg-[#796AEF] hover:bg-[#6858e0] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Log Current
                  </button>
                </div>
              </div>

              {observations.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-[#EFF1F5] shadow-2xs">
                  <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#1E293B]">No readings recorded yet.</p>
                  <p className="text-[11px] text-[#4A4E5A] mt-1">
                    Adjust simulation parameters and tap{" "}
                    <span className="text-[#796AEF] font-bold">"Log Current"</span> to record observation entries.
                  </p>
                </div>
              ) : (
                <>
                  {/* Mobile Observation Cards (< md) */}
                  <div className="md:hidden space-y-2.5">
                    {observations.map((obs, idx) => (
                      <div key={obs.id} className="bg-white p-3.5 rounded-xl border border-[#EFF1F5] shadow-2xs space-y-2">
                        <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#EFF1F5]">
                          <span className="font-bold text-[#1E293B]">
                            #{observations.length - idx} • {obs.experimentTitle.split(":")[0]}
                          </span>
                          <span className="font-mono text-[10px] text-[#4A4E5A]">{obs.timestamp}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="bg-[#EEF2FF]/60 p-2 rounded-lg border border-[#796AEF]/20">
                            <span className="text-[10px] font-bold text-[#796AEF] uppercase tracking-wider block mb-1">Measured Inputs</span>
                            <div className="font-mono text-[#1E293B] text-[11px]">
                              {Object.entries(obs.inputs).map(([k, v]) => `${k}: ${v}`).join(" | ")}
                            </div>
                          </div>

                          <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-100/70">
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">Calculated Outputs</span>
                            <div className="font-mono text-emerald-900 font-bold text-[11px]">
                              {Object.entries(obs.calculatedOutputs).map(([k, v]) => `${k}: ${v}`).join(" | ")}
                            </div>
                          </div>
                        </div>

                        {obs.remarks && (
                          <div className="text-[11px] text-[#4A4E5A] italic">
                            Remark: {obs.remarks}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Desktop Observation Table (>= md) */}
                  <div className="hidden md:block overflow-x-auto rounded-xl border border-[#EFF1F5] bg-white shadow-2xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#F8FAFC] border-b border-[#EFF1F5] text-[#1E293B] font-bold">
                          <th className="p-3">#</th>
                          <th className="p-3">Time</th>
                          <th className="p-3">Experiment</th>
                          <th className="p-3">Measured Inputs</th>
                          <th className="p-3">Calculated Outputs</th>
                          <th className="p-3">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EFF1F5] text-[#1E293B]">
                        {observations.map((obs, idx) => (
                          <tr key={obs.id} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="p-3 font-mono text-slate-400">{observations.length - idx}</td>
                            <td className="p-3 font-mono text-[#4A4E5A]">{obs.timestamp}</td>
                            <td className="p-3 font-bold text-[#1E293B]">{obs.experimentTitle.split(":")[0]}</td>
                            <td className="p-3 font-mono text-[#796AEF] font-bold">
                              {Object.entries(obs.inputs).map(([k, v]) => `${k}: ${v}`).join(" | ")}
                            </td>
                            <td className="p-3 font-mono text-emerald-700 font-bold">
                              {Object.entries(obs.calculatedOutputs).map(([k, v]) => `${k}: ${v}`).join(" | ")}
                            </td>
                            <td className="p-3 text-[#4A4E5A]">{obs.remarks || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 4. LAB MANUAL TAB */}
          {activeTab === "manual" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div>
                <h3 className="text-sm font-black text-[#1E293B] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#796AEF]" />
                  Standard Operating Procedure (SOP & प्रयोग विधि)
                </h3>
                <p className="text-xs text-[#4A4E5A] mt-0.5">
                  {labMode === "ai-generator" && activeAISim ? activeAISim.title : activeExperiment.title}
                </p>
              </div>

              {/* Aim & Apparatus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#EFF1F5] shadow-2xs">
                  <div className="text-xs font-bold text-[#1E293B] mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#796AEF]" />
                    Aim (उद्देश्य)
                  </div>
                  <p className="text-xs text-[#4A4E5A] leading-relaxed">
                    {labMode === "ai-generator" && activeAISim
                      ? `To dynamically simulate and verify the mathematical and empirical principles of ${activeAISim.topic}.`
                      : activeExperiment.aim}
                  </p>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#EFF1F5] shadow-2xs">
                  <div className="text-xs font-bold text-[#1E293B] mb-1.5 flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-[#796AEF]" />
                    Apparatus / Setup (आवश्यक उपकरण)
                  </div>
                  <ul className="text-xs text-[#4A4E5A] space-y-1 list-disc list-inside">
                    {labMode === "ai-generator" && activeAISim
                      ? ["Interactive HTML5 Canvas Setup", "Dynamic Parameter Controllers", "Live Real-Time Math Calculator", "Observation Logger"]
                      : activeExperiment.apparatus.map((app, i) => (
                          <li key={i}>{app}</li>
                        ))}
                  </ul>
                </div>
              </div>

              {/* Step-by-Step Procedure */}
              <div className="bg-white p-4 rounded-xl border border-[#EFF1F5] shadow-2xs">
                <h4 className="text-xs font-bold text-[#1E293B] mb-3">Step-by-Step Procedure (क्रमवार विधि):</h4>
                <div className="space-y-2.5">
                  {labMode === "ai-generator" && activeAISim ? (
                    [
                      { stepNumber: 1, title: "Initialize Physical Parameters", instruction: "Set base values using interactive parameter sliders." },
                      { stepNumber: 2, title: "Observe Instantaneous Dynamic Reaction", instruction: "Watch the 60 FPS live canvas adapt in real-time as parameters shift." },
                      { stepNumber: 3, title: "Log Experimental Data", instruction: "Tap 'Log Reading' to record quantitative data points into your observation table." },
                      { stepNumber: 4, title: "Listen to Cherry Ma'am's Guidance", instruction: "Play Cherry Ma'am's Hinglish audio explanation to master the underlying concept." },
                    ].map((step) => (
                      <div key={step.stepNumber} className="bg-[#F8FAFC] p-3 rounded-lg border border-[#EFF1F5] flex gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-[#EEF2FF] text-[#796AEF] border border-[#796AEF]/30 flex items-center justify-center font-black text-[11px] shrink-0">
                          {step.stepNumber}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#1E293B]">{step.title}</div>
                          <div className="text-xs text-[#4A4E5A] mt-0.5 leading-relaxed">{step.instruction}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    activeExperiment.procedure.map((step) => (
                      <div key={step.stepNumber} className="bg-[#F8FAFC] p-3 rounded-lg border border-[#EFF1F5] flex gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-[#EEF2FF] text-[#796AEF] border border-[#796AEF]/30 flex items-center justify-center font-black text-[11px] shrink-0">
                          {step.stepNumber}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#1E293B]">{step.title}</div>
                          <div className="text-xs text-[#4A4E5A] mt-0.5 leading-relaxed">{step.instruction}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Precautions */}
              <div className="bg-amber-50/90 p-3.5 sm:p-4 rounded-xl border border-amber-200">
                <div className="text-xs font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-700" />
                  Precautions & Safety (सावधानियां)
                </div>
                <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside font-medium">
                  {labMode === "ai-generator" && activeAISim
                    ? [
                        "Always convert measurements into standard SI units before solving board formulas.",
                        "Notice asymptotic and boundary limit behaviors when parameters approach zero or maximum.",
                        "Compare theoretical calculated outputs with graphical curves."
                      ]
                    : activeExperiment.precautions.map((prec, i) => (
                        <li key={i}>{prec}</li>
                      ))}
                </ul>
              </div>
            </div>
          )}

          {/* 5. VIVA QUESTIONS TAB */}
          {activeTab === "viva" && (
            <div className="space-y-3 max-w-4xl mx-auto">
              <div>
                <h3 className="text-sm font-black text-[#1E293B] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#796AEF]" />
                  Viva-Voce Practical Examination Questions & Answers
                </h3>
                <p className="text-xs text-[#4A4E5A] mt-0.5">Frequently asked questions by CBSE & State Board practical examiners.</p>
              </div>

              <div className="space-y-2.5">
                {activeExperiment.vivaQuestions.map((viva, idx) => {
                  const isExpanded = expandedVivaIdx === idx;
                  return (
                    <div key={idx} className="bg-white rounded-xl border border-[#EFF1F5] shadow-2xs overflow-hidden">
                      <button
                        onClick={() => setExpandedVivaIdx(isExpanded ? null : idx)}
                        className="w-full p-3 sm:p-3.5 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-all gap-2 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#796AEF] font-bold text-xs shrink-0">Q{idx + 1}.</span>
                          <span className="text-xs font-bold text-[#1E293B]">{viva.question}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-1 bg-[#F8FAFC] border-t border-[#EFF1F5] text-xs space-y-2">
                          <p className="text-[#1E293B] leading-relaxed font-medium">
                            <span className="text-emerald-700 font-bold">Answer: </span>
                            {viva.answer}
                          </p>
                          {viva.formula && (
                            <div className="font-mono text-[#796AEF] bg-white p-2 rounded-lg border border-[#796AEF]/30 inline-block text-[11px] font-bold">
                              {viva.formula}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Persistent Whiteboard CTA */}
          {onOpenClassroomWithTopic && (
            <div className="pt-4 border-t border-[#EFF1F5]">
              <button
                onClick={handleAskCherryOnWhiteboard}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#EEF2FF] via-indigo-50 to-[#EEF2FF] hover:from-indigo-100 hover:to-indigo-50 text-[#796AEF] border-2 border-[#796AEF]/35 text-xs sm:text-sm font-black rounded-xl flex items-center justify-center gap-2.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-[#796AEF] shrink-0" />
                <span>Ask Cherry Ma'am to Explain on Whiteboard</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#796AEF] shrink-0" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

