export type LabSubject = "all" | "physics" | "chemistry" | "biology" | "mathematics";

export interface ParamConfig {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  description?: string;
}

export interface LabManualStep {
  stepNumber: number;
  title: string;
  instruction: string;
  tip?: string;
}

export interface VivaQuestion {
  question: string;
  answer: string;
  formula?: string;
}

export interface LabExperiment {
  id: string;
  title: string;
  hindiTitle: string;
  subject: "physics" | "chemistry" | "biology" | "mathematics";
  grades: string[];
  category: string;
  icon: string;
  description: string;
  conceptFormula: string;
  color: string;
  accentColor: string;
  defaultParams: Record<string, number>;
  paramConfigs: ParamConfig[];
  explanation: string;
  aim: string;
  apparatus: string[];
  procedure: LabManualStep[];
  precautions: string[];
  vivaQuestions: VivaQuestion[];
}

export interface CustomSimParameter {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  description: string;
  symbol?: string;
}

export interface CustomSimLiveOutput {
  key: string;
  label: string;
  formulaStr: string;
  unit: string;
  description?: string;
}

export interface CherrySimObservation {
  hinglishGuide: string;
  keyRuleLaw: string;
  examTrap: string;
  whatToObserve: string[];
  proTip?: string;
}

export type CustomSimulationType =
  | "wave_interference"
  | "particle_collision"
  | "circuits_charging"
  | "cellular_flow"
  | "projectile_kinetics"
  | "thermodynamics_gas"
  | "optics_refraction"
  | "orbital_gravity"
  | "magnetism_field"
  | "electromagnet"
  | "optics_prism"
  | "friction_mechanics"
  | "buoyancy_archimedes"
  | "number_line"
  | "bohr_atomic_shells"
  | "chemical_kinetics"
  | "heart_circulation"
  | "osmosis_cells"
  | "quadratic_parabola"
  | "pythagoras_geometry"
  | "normal_distribution"
  | "faraday_induction"
  | "photoelectric_effect"
  | "water_electrolysis"
  | "vector_addition"
  | "bernoulli_fluid"
  | "dna_replication"
  | "pendulum_shm"
  | "kepler_orbit"
  | "carnot_cycle"
  | "custom_interactive";

export interface AISimulationSpec {
  id: string;
  topic: string;
  title: string;
  hindiTitle: string;
  subject: "physics" | "chemistry" | "biology" | "mathematics";
  grade?: string;
  category: string;
  conceptFormula: string;
  secondaryFormulas?: { label: string; formula: string }[];
  simulationType: CustomSimulationType;
  description: string;
  parameters: CustomSimParameter[];
  liveOutputs: CustomSimLiveOutput[];
  cherryObservation: CherrySimObservation;
  visualTheme?: {
    primaryColor: string;
    accentColor: string;
    bgTheme?: "dark" | "navy" | "slate" | "lab";
  };
  customVisualConfig?: {
    particleCount?: number;
    showTrails?: boolean;
    showVectors?: boolean;
    graphType?: "intensity" | "exponential" | "trajectory" | "pv_curve" | "sine_wave" | "none";
    canvasLabels?: { text: string; x: number; y: number; color?: string }[];
  };
}

export interface ObservationRecord {
  id: string;
  timestamp: string;
  experimentId: string;
  experimentTitle: string;
  inputs: Record<string, number | string>;
  calculatedOutputs: Record<string, number | string>;
  remarks?: string;
}

