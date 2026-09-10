/**
 * experimentWhiteboardBuilder.ts
 * 
 * Generates comprehensive chalkboard markdown and authentic SVG diagrams
 * for Cherry Ma'am to explain any virtual lab experiment on the Classroom Whiteboard.
 */

export interface ExperimentContext {
  id?: string;
  title: string;
  hindiTitle?: string;
  subject?: string;
  category?: string;
  aim?: string;
  conceptFormula?: string;
  explanation?: string;
  apparatus?: string[];
  procedure?: { stepNumber: number; title: string; instruction: string; tip?: string }[];
  precautions?: string[];
  vivaQuestions?: { question: string; answer: string; formula?: string }[];
  currentParams?: Record<string, number>;
  paramConfigs?: { key: string; label: string; unit: string; min: number; max: number }[];
  observations?: Array<{ id: string; timestamp: string; values: Record<string, any>; notes?: string }>;
  svgDiagram?: string;
  cherryObservation?: {
    hinglishGuide?: string;
    keyRuleLaw?: string;
    examTrap?: string;
    whatToObserve?: string[];
    proTip?: string;
  };
}

/**
 * Returns an authentic chalk-style SVG diagram for an experiment
 */
export function getExperimentChalkboardSvg(expId: string, params: Record<string, number> = {}): string {
  switch (expId) {
    case "optics-lens": {
      const u = params.objectDistance ?? 160;
      const f = params.focalLength ?? 80;
      const h = params.objectHeight ?? 50;
      const isConvex = (params.lensType ?? 1) === 1;

      return `<svg viewBox="0 0 520 220" className="w-full max-w-lg mx-auto my-3 bg-[#0A1B16]/90 rounded-xl border border-emerald-500/30 shadow-inner">
  <defs>
    <filter id="opticsGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Optical Bench Axis -->
  <line x1="20" y1="110" x2="500" y2="110" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,4" />
  <text x="490" y="105" fill="#94A3B8" font-size="10" font-family="monospace">Principal Axis</text>

  <!-- Central Lens -->
  ${
    isConvex
      ? `<path d="M 260 25 Q 285 110 260 195 Q 235 110 260 25" fill="none" stroke="#38BDF8" stroke-width="3" filter="url(#opticsGlow)" />
         <line x1="260" y1="20" x2="260" y2="200" stroke="#38BDF8" stroke-width="1" stroke-dasharray="2,2" opacity="0.6" />`
      : `<path d="M 250 25 Q 268 110 250 195 L 270 195 Q 252 110 270 25 Z" fill="none" stroke="#38BDF8" stroke-width="2.5" filter="url(#opticsGlow)" />`
  }
  <text x="260" y="212" fill="#38BDF8" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">
    ${isConvex ? "Convex Lens (Converging)" : "Concave Lens (Diverging)"}
  </text>
  <circle cx="260" cy="110" r="3" fill="#38BDF8" />
  <text x="260" y="125" fill="#38BDF8" font-size="11" font-family="monospace" text-anchor="middle">O (0,0)</text>

  <!-- Focal Points -->
  <!-- Left F1, 2F1 -->
  <circle cx="180" cy="110" r="3" fill="#FCD34D" />
  <text x="180" y="125" fill="#FCD34D" font-size="10" font-family="monospace" text-anchor="middle">F₁</text>
  <circle cx="100" cy="110" r="2.5" fill="#CBD5E1" />
  <text x="100" y="125" fill="#94A3B8" font-size="9" font-family="monospace" text-anchor="middle">2F₁</text>

  <!-- Right F2, 2F2 -->
  <circle cx="340" cy="110" r="3" fill="#FCD34D" />
  <text x="340" y="125" fill="#FCD34D" font-size="10" font-family="monospace" text-anchor="middle">F₂</text>
  <circle cx="420" cy="110" r="2.5" fill="#CBD5E1" />
  <text x="420" y="125" fill="#94A3B8" font-size="9" font-family="monospace" text-anchor="middle">2F₂</text>

  <!-- Object Arrow (u = -160) -->
  <line x1="80" y1="110" x2="80" y2="55" stroke="#FCD34D" stroke-width="3" />
  <polygon points="76,60 84,60 80,50" fill="#FCD34D" />
  <text x="80" y="44" fill="#FCD34D" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">Object (u = -${u}cm)</text>

  <!-- Ray 1: Parallel to Axis then through Focus F2 -->
  <line x1="80" y1="55" x2="260" y2="55" stroke="#F43F5E" stroke-width="2" />
  <line x1="260" y1="55" x2="430" y2="165" stroke="#F43F5E" stroke-width="2" />
  <polygon points="170,52 178,55 170,58" fill="#F43F5E" />
  <polygon points="345,107 353,113 348,118" fill="#F43F5E" />

  <!-- Ray 2: Through Optical Center O without deviation -->
  <line x1="80" y1="55" x2="430" y2="165" stroke="#34D399" stroke-width="2" />
  <polygon points="170,83 178,88 174,93" fill="#34D399" />

  <!-- Image Arrow (v = +305cm) -->
  <line x1="430" y1="110" x2="430" y2="165" stroke="#34D399" stroke-width="3" stroke-dasharray="1,0" />
  <polygon points="426,160 434,160 430,170" fill="#34D399" />
  <text x="430" y="185" fill="#34D399" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">Image (Real, Inverted)</text>

  <!-- Formulas indicator on blackboard -->
  <text x="25" y="30" fill="#E2E8F0" font-size="11" font-family="monospace">1/f = 1/v - 1/u</text>
  <text x="25" y="46" fill="#A7F3D0" font-size="10" font-family="monospace">m = v / u = hi / ho</text>
</svg>`;
    }

    case "ohms-law": {
      const v = params.voltage ?? 6;
      const r = params.resistance ?? 10;
      const i = (v / r).toFixed(2);

      return `<svg viewBox="0 0 520 220" className="w-full max-w-lg mx-auto my-3 bg-[#0A1B16]/90 rounded-xl border border-amber-500/30 shadow-inner">
  <!-- Circuit Wires -->
  <rect x="60" y="40" width="400" height="140" fill="none" stroke="#94A3B8" stroke-width="2.5" rx="10" />

  <!-- DC Battery (Top branch) -->
  <rect x="180" y="32" width="70" height="16" fill="#0A1B16" />
  <line x1="200" y1="28" x2="200" y2="52" stroke="#38BDF8" stroke-width="3.5" />
  <line x1="210" y1="34" x2="210" y2="46" stroke="#94A3B8" stroke-width="2" />
  <line x1="220" y1="28" x2="220" y2="52" stroke="#38BDF8" stroke-width="3.5" />
  <line x1="230" y1="34" x2="230" y2="46" stroke="#94A3B8" stroke-width="2" />
  <text x="185" y="24" fill="#38BDF8" font-size="11" font-weight="bold" font-family="monospace">+  Battery (${v}V)  -</text>

  <!-- Switch / Key (Right top branch) -->
  <rect x="330" y="32" width="50" height="16" fill="#0A1B16" />
  <circle cx="340" cy="40" r="3" fill="#E2E8F0" />
  <circle cx="370" cy="40" r="3" fill="#E2E8F0" />
  <line x1="340" y1="40" x2="368" y2="40" stroke="#34D399" stroke-width="2.5" />
  <text x="355" y="24" fill="#34D399" font-size="10" font-family="monospace" text-anchor="middle">Key [K] Closed</text>

  <!-- Ammeter (Right vertical branch) -->
  <circle cx="460" cy="110" r="18" fill="#0A1B16" stroke="#FCD34D" stroke-width="2.5" />
  <text x="460" y="115" fill="#FCD34D" font-size="13" font-weight="bold" font-family="monospace" text-anchor="middle">A</text>
  <text x="490" y="114" fill="#FCD34D" font-size="11" font-family="monospace">I = ${i} A</text>

  <!-- Resistor (Bottom branch) -->
  <rect x="200" y="172" width="120" height="16" fill="#0A1B16" />
  <path d="M 200 180 L 210 170 L 220 190 L 230 170 L 240 190 L 250 170 L 260 190 L 270 170 L 280 190 L 290 170 L 300 190 L 310 180" fill="none" stroke="#F43F5E" stroke-width="2.5" />
  <text x="255" y="208" fill="#F43F5E" font-size="11" font-weight="bold" font-family="monospace" text-anchor="middle">Resistor R = ${r} Ω</text>

  <!-- Voltmeter connected in parallel across Resistor -->
  <line x1="190" y1="180" x2="190" y2="140" stroke="#34D399" stroke-width="1.5" stroke-dasharray="3,3" />
  <line x1="190" y1="140" x2="230" y2="140" stroke="#34D399" stroke-width="1.5" />
  <circle cx="255" cy="140" r="16" fill="#0A1B16" stroke="#34D399" stroke-width="2" />
  <text x="255" y="145" fill="#34D399" font-size="12" font-weight="bold" font-family="monospace" text-anchor="middle">V</text>
  <line x1="280" y1="140" x2="320" y2="140" stroke="#34D399" stroke-width="1.5" />
  <line x1="320" y1="140" x2="320" y2="180" stroke="#34D399" stroke-width="1.5" stroke-dasharray="3,3" />

  <!-- Rheostat / Variable Resistance (Left branch) -->
  <rect x="52" y="85" width="16" height="50" fill="#0A1B16" />
  <path d="M 60 85 L 54 95 L 66 105 L 54 115 L 66 125 L 60 135" fill="none" stroke="#94A3B8" stroke-width="2" />
  <line x1="45" y1="130" x2="75" y2="90" stroke="#FCD34D" stroke-width="1.5" />
  <polygon points="75,90 70,95 77,97" fill="#FCD34D" />
  <text x="25" y="114" fill="#94A3B8" font-size="9" font-family="monospace">Rh</text>

  <!-- Current Direction Arrows -->
  <polygon points="120,36 130,40 120,44" fill="#38BDF8" />
  <text x="125" y="30" fill="#38BDF8" font-size="10" font-family="monospace">Current I →</text>
  <polygon points="400,184 390,180 400,176" fill="#38BDF8" />
</svg>`;
    }

    case "acid-base-ph": {
      return `<svg viewBox="0 0 520 220" className="w-full max-w-lg mx-auto my-3 bg-[#0A1B16]/90 rounded-xl border border-emerald-500/30 shadow-inner">
  <!-- Burette & Stand -->
  <line x1="120" y1="10" x2="120" y2="210" stroke="#64748B" stroke-width="4" />
  <line x1="80" y1="210" x2="160" y2="210" stroke="#64748B" stroke-width="5" />
  <line x1="120" y1="60" x2="190" y2="60" stroke="#64748B" stroke-width="3" />
  <line x1="120" y1="130" x2="190" y2="130" stroke="#64748B" stroke-width="3" />

  <!-- Glass Burette Tube -->
  <rect x="185" y="15" width="16" height="110" fill="#38BDF8" fill-opacity="0.15" stroke="#38BDF8" stroke-width="1.5" rx="2" />
  <!-- Meniscus liquid level -->
  <rect x="186" y="45" width="14" height="80" fill="#38BDF8" fill-opacity="0.4" />
  <!-- Graduations -->
  <line x1="185" y1="35" x2="192" y2="35" stroke="#CBD5E1" stroke-width="1" />
  <line x1="185" y1="55" x2="192" y2="55" stroke="#CBD5E1" stroke-width="1" />
  <line x1="185" y1="75" x2="192" y2="75" stroke="#CBD5E1" stroke-width="1" />
  <line x1="185" y1="95" x2="192" y2="95" stroke="#CBD5E1" stroke-width="1" />
  <text x="210" y="40" fill="#38BDF8" font-size="10" font-family="sans-serif">Burette (0.1M NaOH Titrant)</text>

  <!-- Stopcock valve -->
  <circle cx="193" cy="128" r="4" fill="#FCD34D" />
  <line x1="188" y1="128" x2="198" y2="128" stroke="#FCD34D" stroke-width="2.5" />
  <!-- Falling drop -->
  <path d="M 193 140 C 191 143, 191 146, 193 148 C 195 146, 195 143, 193 140 Z" fill="#38BDF8" />

  <!-- Conical Flask (Erlenmeyer) -->
  <path d="M 188 152 L 198 152 L 218 198 L 168 198 Z" fill="#F43F5E" fill-opacity="0.25" stroke="#F43F5E" stroke-width="1.8" />
  <text x="225" y="180" fill="#F43F5E" font-size="10" font-family="sans-serif">Flask (0.1M HCl + Indicator)</text>

  <!-- pH Scale Color Spectrum -->
  <rect x="310" y="45" width="180" height="20" rx="4" fill="url(#phGradient)" stroke="#94A3B8" stroke-width="1" />
  <defs>
    <linearGradient id="phGradient" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#EF4444" />
      <stop offset="25%" stop-color="#F97316" />
      <stop offset="50%" stop-color="#22C55E" />
      <stop offset="75%" stop-color="#06B6D4" />
      <stop offset="100%" stop-color="#8B5CF6" />
    </linearGradient>
  </defs>
  <text x="310" y="35" fill="#EF4444" font-size="10" font-family="monospace">pH 1 (Acid)</text>
  <text x="390" y="35" fill="#22C55E" font-size="10" font-family="monospace">pH 7 (Neutral)</text>
  <text x="450" y="35" fill="#8B5CF6" font-size="10" font-family="monospace">pH 14 (Base)</text>

  <!-- Titration Neutralization Formula -->
  <text x="310" y="100" fill="#FCD34D" font-size="12" font-weight="bold" font-family="monospace">N₁V₁ = N₂V₂</text>
  <text x="310" y="125" fill="#E2E8F0" font-size="11" font-family="sans-serif">HCl + NaOH → NaCl + H₂O</text>
  <text x="310" y="150" fill="#34D399" font-size="11" font-family="sans-serif">Equivalence Point: pH = 7.00</text>
  <text x="310" y="172" fill="#F472B6" font-size="10" font-family="sans-serif">Phenolphthalein: Colorless → Pale Pink</text>
</svg>`;
    }

    case "pendulum-motion": {
      return `<svg viewBox="0 0 520 220" className="w-full max-w-lg mx-auto my-3 bg-[#0A1B16]/90 rounded-xl border border-emerald-500/30 shadow-inner">
  <!-- Ceiling Support -->
  <line x1="160" y1="20" x2="360" y2="20" stroke="#64748B" stroke-width="4" />
  <line x1="180" y1="20" x2="170" y2="10" stroke="#64748B" stroke-width="2" />
  <line x1="220" y1="20" x2="210" y2="10" stroke="#64748B" stroke-width="2" />
  <line x1="260" y1="20" x2="250" y2="10" stroke="#64748B" stroke-width="2" />
  <line x1="300" y1="20" x2="290" y2="10" stroke="#64748B" stroke-width="2" />
  <line x1="340" y1="20" x2="330" y2="10" stroke="#64748B" stroke-width="2" />

  <!-- Pivot Point O -->
  <circle cx="260" cy="20" r="4" fill="#FCD34D" />
  <text x="260" y="36" fill="#FCD34D" font-size="10" font-family="monospace" text-anchor="middle">Pivot O</text>

  <!-- Equilibrium Dashed Line -->
  <line x1="260" y1="20" x2="260" y2="185" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,4" />

  <!-- String of Length L at Angle theta -->
  <line x1="260" y1="20" x2="340" y2="160" stroke="#38BDF8" stroke-width="2" />
  <text x="310" y="85" fill="#38BDF8" font-size="11" font-family="monospace">Length L</text>

  <!-- Angle theta Arc -->
  <path d="M 260 65 A 45 45 0 0 1 278 61" fill="none" stroke="#FCD34D" stroke-width="2" />
  <text x="272" y="80" fill="#FCD34D" font-size="11" font-family="monospace">θ</text>

  <!-- Bob at displaced position -->
  <circle cx="340" cy="160" r="16" fill="#34D399" stroke="#E2E8F0" stroke-width="2" />
  <text x="340" y="164" fill="#0A1B16" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">m</text>

  <!-- Force Vectors -->
  <!-- Tension T -->
  <line x1="340" y1="160" x2="305" y2="95" stroke="#38BDF8" stroke-width="2" />
  <polygon points="305,95 307,103 313,99" fill="#38BDF8" />
  <text x="295" y="110" fill="#38BDF8" font-size="10" font-family="monospace">Tension T</text>

  <!-- Gravity mg -->
  <line x1="340" y1="160" x2="340" y2="210" stroke="#F43F5E" stroke-width="2" />
  <polygon points="340,210 336,202 344,202" fill="#F43F5E" />
  <text x="348" y="208" fill="#F43F5E" font-size="10" font-family="monospace">mg</text>

  <!-- Restoring Component mg sin(theta) -->
  <line x1="340" y1="160" x2="295" y2="182" stroke="#FCD34D" stroke-width="2" />
  <polygon points="295,182 303,178 301,186" fill="#FCD34D" />
  <text x="235" y="196" fill="#FCD34D" font-size="9" font-family="monospace">F = -mg sin(θ)</text>

  <!-- Time Period Formula -->
  <text x="30" y="50" fill="#A7F3D0" font-size="13" font-weight="bold" font-family="monospace">T = 2π √(L / g)</text>
  <text x="30" y="75" fill="#E2E8F0" font-size="10" font-family="sans-serif">• Independent of mass (m)</text>
  <text x="30" y="95" fill="#E2E8F0" font-size="10" font-family="sans-serif">• Independent of amplitude (for small θ)</text>
  <text x="30" y="115" fill="#E2E8F0" font-size="10" font-family="sans-serif">• g = 9.8 m/s²</text>
</svg>`;
    }

    case "trig-unit-circle": {
      return `<svg viewBox="0 0 520 220" className="w-full max-w-lg mx-auto my-3 bg-[#0A1B16]/90 rounded-xl border border-cyan-500/30 shadow-inner">
  <!-- Coordinate Axes -->
  <line x1="50" y1="110" x2="370" y2="110" stroke="#64748B" stroke-width="1.5" />
  <line x1="210" y1="20" x2="210" y2="200" stroke="#64748B" stroke-width="1.5" />
  <text x="375" y="114" fill="#94A3B8" font-size="11" font-family="monospace">X</text>
  <text x="210" y="14" fill="#94A3B8" font-size="11" font-family="monospace" text-anchor="middle">Y</text>
  <text x="200" y="125" fill="#94A3B8" font-size="10" font-family="monospace">O</text>

  <!-- Unit Circle (R = 75) -->
  <circle cx="210" cy="110" r="75" fill="none" stroke="#38BDF8" stroke-width="2" />
  <text x="288" y="125" fill="#38BDF8" font-size="9" font-family="monospace">(1, 0)</text>
  <text x="210" y="45" fill="#38BDF8" font-size="9" font-family="monospace" text-anchor="middle">(0, 1)</text>

  <!-- Radius Vector at angle theta = 45 deg -->
  <line x1="210" y1="110" x2="263" y2="57" stroke="#FCD34D" stroke-width="2.5" />
  <circle cx="263" cy="57" r="4" fill="#34D399" />
  <text x="270" y="52" fill="#34D399" font-size="11" font-weight="bold" font-family="monospace">P(cos θ, sin θ)</text>

  <!-- Angle arc -->
  <path d="M 240 110 A 30 30 0 0 0 231 89" fill="none" stroke="#FCD34D" stroke-width="2" />
  <text x="242" y="98" fill="#FCD34D" font-size="10" font-family="monospace">θ</text>

  <!-- cos(theta) projection (horizontal amber line) -->
  <line x1="210" y1="110" x2="263" y2="110" stroke="#FCD34D" stroke-width="3" />
  <text x="235" y="124" fill="#FCD34D" font-size="10" font-weight="bold" font-family="monospace" text-anchor="middle">cos θ</text>

  <!-- sin(theta) projection (vertical emerald line) -->
  <line x1="263" y1="110" x2="263" y2="57" stroke="#34D399" stroke-width="3" />
  <text x="275" y="85" fill="#34D399" font-size="10" font-weight="bold" font-family="monospace">sin θ</text>

  <!-- Fundamental Identities on Board -->
  <text x="400" y="50" fill="#A7F3D0" font-size="12" font-weight="bold" font-family="monospace">sin²θ + cos²θ = 1</text>
  <text x="400" y="78" fill="#FCD34D" font-size="11" font-family="monospace">tan θ = sin θ / cos θ</text>
  <text x="400" y="106" fill="#38BDF8" font-size="11" font-family="monospace">sec²θ - tan²θ = 1</text>
  <text x="400" y="134" fill="#F472B6" font-size="11" font-family="monospace">cosec²θ - cot²θ = 1</text>
</svg>`;
    }

    case "double-slit": {
      return `<svg viewBox="0 0 520 220" className="w-full max-w-lg mx-auto my-3 bg-[#0A1B16]/90 rounded-xl border border-cyan-500/30 shadow-inner">
  <!-- Monochromatic Laser Source -->
  <rect x="20" y="95" width="50" height="30" fill="#1E293B" stroke="#F43F5E" stroke-width="2" rx="4" />
  <text x="45" y="114" fill="#F43F5E" font-size="9" font-family="monospace" text-anchor="middle">Laser (λ)</text>
  <line x1="70" y1="110" x2="150" y2="110" stroke="#F43F5E" stroke-width="3" />

  <!-- Double Slit Barrier -->
  <rect x="150" y="20" width="8" height="70" fill="#64748B" />
  <rect x="150" y="100" width="8" height="20" fill="#64748B" />
  <rect x="150" y="130" width="8" height="70" fill="#64748B" />
  <text x="135" y="95" fill="#38BDF8" font-size="10" font-family="monospace">S₁</text>
  <text x="135" y="132" fill="#38BDF8" font-size="10" font-family="monospace">S₂</text>
  <line x1="170" y1="95" x2="170" y2="125" stroke="#FCD34D" stroke-width="1.5" />
  <text x="180" y="112" fill="#FCD34D" font-size="10" font-family="monospace">d</text>

  <!-- Waves overlapping -->
  <path d="M 158 95 Q 230 70 320 60" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3,3" />
  <path d="M 158 125 Q 230 110 320 60" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3,3" />

  <!-- Screen at Distance D -->
  <rect x="330" y="20" width="10" height="180" fill="#334155" stroke="#94A3B8" stroke-width="1.5" />
  <text x="335" y="212" fill="#94A3B8" font-size="10" font-family="monospace" text-anchor="middle">Screen</text>
  <text x="240" y="210" fill="#CBD5E1" font-size="10" font-family="monospace">Distance D</text>

  <!-- Interference Fringes on Screen -->
  <rect x="345" y="40" width="30" height="8" fill="#F43F5E" />
  <rect x="345" y="60" width="30" height="8" fill="#1E293B" />
  <rect x="345" y="80" width="45" height="10" fill="#F43F5E" />
  <rect x="345" y="105" width="60" height="14" fill="#F43F5E" />
  <text x="415" y="115" fill="#FCD34D" font-size="10" font-weight="bold" font-family="monospace">Central Max (y=0)</text>
  <rect x="345" y="130" width="45" height="10" fill="#F43F5E" />
  <rect x="345" y="150" width="30" height="8" fill="#1E293B" />
  <rect x="345" y="170" width="30" height="8" fill="#F43F5E" />

  <!-- Fringe Width Formula -->
  <text x="390" y="40" fill="#34D399" font-size="12" font-weight="bold" font-family="monospace">β = (λ · D) / d</text>
  <text x="390" y="62" fill="#E2E8F0" font-size="10" font-family="sans-serif">Δx = d sin θ = nλ</text>
</svg>`;
    }

    case "photoelectric-effect": {
      return `<svg viewBox="0 0 520 220" className="w-full max-w-lg mx-auto my-3 bg-[#0A1B16]/90 rounded-xl border border-amber-500/30 shadow-inner">
  <!-- Quartz Vacuum Tube -->
  <ellipse cx="220" cy="90" rx="140" ry="60" fill="#1E293B" fill-opacity="0.3" stroke="#38BDF8" stroke-width="2" />
  <text x="220" y="45" fill="#38BDF8" font-size="10" font-family="sans-serif" text-anchor="middle">Evacuated Quartz Envelope</text>

  <!-- Cathode (Photosensitive Emitter) -->
  <rect x="110" y="60" width="12" height="60" fill="#64748B" stroke="#CBD5E1" stroke-width="2" rx="2" />
  <text x="115" y="135" fill="#CBD5E1" font-size="10" font-family="monospace" text-anchor="middle">Cathode (-)</text>

  <!-- Anode (Collector) -->
  <rect x="310" y="60" width="12" height="60" fill="#64748B" stroke="#CBD5E1" stroke-width="2" rx="2" />
  <text x="315" y="135" fill="#CBD5E1" font-size="10" font-family="monospace" text-anchor="middle">Anode (+)</text>

  <!-- Incident Photons (h*nu) -->
  <path d="M 40 40 Q 60 48 80 40 Q 100 32 120 70" fill="none" stroke="#FCD34D" stroke-width="2" />
  <polygon points="120,70 114,64 122,62" fill="#FCD34D" />
  <text x="50" y="30" fill="#FCD34D" font-size="11" font-weight="bold" font-family="monospace">Photons (E = hν)</text>

  <!-- Emitted Photoelectrons -->
  <circle cx="150" cy="75" r="4" fill="#38BDF8" />
  <line x1="150" y1="75" x2="185" y2="75" stroke="#38BDF8" stroke-width="2" />
  <polygon points="185,75 180,72 180,78" fill="#38BDF8" />

  <circle cx="170" cy="95" r="4" fill="#38BDF8" />
  <line x1="170" y1="95" x2="215" y2="95" stroke="#38BDF8" stroke-width="2" />
  <polygon points="215,95 210,92 210,98" fill="#38BDF8" />

  <circle cx="160" cy="110" r="4" fill="#38BDF8" />
  <line x1="160" y1="110" x2="200" y2="110" stroke="#38BDF8" stroke-width="2" />
  <polygon points="200,110 195,107 195,113" fill="#38BDF8" />
  <text x="210" y="125" fill="#38BDF8" font-size="10" font-family="monospace">Photoelectrons e⁻</text>

  <!-- Circuit with Battery & Microammeter -->
  <line x1="116" y1="120" x2="116" y2="185" stroke="#94A3B8" stroke-width="2" />
  <line x1="116" y1="185" x2="220" y2="185" stroke="#94A3B8" stroke-width="2" />

  <circle cx="235" cy="185" r="14" fill="#0A1B16" stroke="#FCD34D" stroke-width="2" />
  <text x="235" y="190" fill="#FCD34D" font-size="11" font-family="monospace" text-anchor="middle">μA</text>

  <line x1="250" y1="185" x2="316" y2="185" stroke="#94A3B8" stroke-width="2" />
  <line x1="316" y1="185" x2="316" y2="120" stroke="#94A3B8" stroke-width="2" />

  <!-- Einstein's Photoelectric Equation -->
  <text x="360" y="45" fill="#34D399" font-size="12" font-weight="bold" font-family="monospace">K_max = hν - Φ</text>
  <text x="360" y="70" fill="#E2E8F0" font-size="10" font-family="sans-serif">e · V₀ = h(ν - ν₀)</text>
  <text x="360" y="95" fill="#A7F3D0" font-size="10" font-family="sans-serif">Φ = Work Function</text>
  <text x="360" y="115" fill="#FCD34D" font-size="10" font-family="sans-serif">V₀ = Stopping Potential</text>
</svg>`;
    }

    case "faraday-induction": {
      return `<svg viewBox="0 0 520 220" className="w-full max-w-lg mx-auto my-3 bg-[#0A1B16]/90 rounded-xl border border-emerald-500/30 shadow-inner">
  <!-- Bar Magnet (Moving towards coil) -->
  <rect x="50" y="80" width="55" height="40" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />
  <text x="77" y="105" fill="#FFFFFF" font-size="14" font-weight="bold" font-family="monospace" text-anchor="middle">N</text>
  <rect x="105" y="80" width="55" height="40" fill="#3B82F6" stroke="#93C5FD" stroke-width="2" />
  <text x="132" y="105" fill="#FFFFFF" font-size="14" font-weight="bold" font-family="monospace" text-anchor="middle">S</text>

  <!-- Velocity Vector -->
  <line x1="80" y1="60" x2="140" y2="60" stroke="#FCD34D" stroke-width="2.5" />
  <polygon points="140,60 132,56 132,64" fill="#FCD34D" />
  <text x="110" y="50" fill="#FCD34D" font-size="11" font-family="monospace" text-anchor="middle">Velocity v →</text>

  <!-- Solenoid Coil (Helical Loops) -->
  <rect x="230" y="65" width="130" height="70" fill="#1E293B" rx="8" stroke="#475569" stroke-width="1.5" />
  <path d="M 240 65 Q 260 100 240 135 M 265 65 Q 285 100 265 135 M 290 65 Q 310 100 290 135 M 315 65 Q 335 100 315 135 M 340 65 Q 360 100 340 135" fill="none" stroke="#F59E0B" stroke-width="4" />
  <text x="295" y="55" fill="#F59E0B" font-size="11" font-family="sans-serif" text-anchor="middle">Solenoid Coil (N Turns)</text>

  <!-- Connecting Wires & Galvanometer -->
  <line x1="240" y1="135" x2="240" y2="180" stroke="#94A3B8" stroke-width="2" />
  <line x1="240" y1="180" x2="280" y2="180" stroke="#94A3B8" stroke-width="2" />

  <circle cx="295" cy="180" r="16" fill="#0A1B16" stroke="#34D399" stroke-width="2" />
  <text x="295" y="174" fill="#34D399" font-size="9" font-family="monospace" text-anchor="middle">G</text>
  <!-- Deflected Needle -->
  <line x1="295" y1="180" x2="305" y2="168" stroke="#EF4444" stroke-width="2" />

  <line x1="310" y1="180" x2="340" y2="180" stroke="#94A3B8" stroke-width="2" />
  <line x1="340" y1="180" x2="340" y2="135" stroke="#94A3B8" stroke-width="2" />

  <!-- Faraday-Lenz Law Formula -->
  <text x="390" y="80" fill="#34D399" font-size="13" font-weight="bold" font-family="monospace">ε = -N (dΦ_B / dt)</text>
  <text x="390" y="105" fill="#FCD34D" font-size="11" font-family="sans-serif">Lenz's Law (Opposes cause)</text>
  <text x="390" y="130" fill="#E2E8F0" font-size="10" font-family="sans-serif">Φ_B = B · A · cos θ</text>
  <text x="390" y="150" fill="#38BDF8" font-size="10" font-family="sans-serif">Induced Current I = ε / R</text>
</svg>`;
    }

    case "water-electrolysis": {
      return `<svg viewBox="0 0 520 220" className="w-full max-w-lg mx-auto my-3 bg-[#0A1B16]/90 rounded-xl border border-blue-500/30 shadow-inner">
  <!-- Hofmann Voltameter Tubes -->
  <!-- Left Tube: Cathode (H2) -->
  <rect x="140" y="30" width="28" height="130" fill="#38BDF8" fill-opacity="0.2" stroke="#38BDF8" stroke-width="2" rx="4" />
  <!-- Gas Volume collected (2 volumes) -->
  <rect x="141" y="31" width="26" height="50" fill="#0A1B16" />
  <text x="154" y="60" fill="#FCD34D" font-size="11" font-weight="bold" font-family="monospace" text-anchor="middle">2H₂ (g)</text>
  <text x="154" y="74" fill="#38BDF8" font-size="9" font-family="sans-serif" text-anchor="middle">Vol: 2X</text>

  <!-- Right Tube: Anode (O2) -->
  <rect x="230" y="30" width="28" height="130" fill="#38BDF8" fill-opacity="0.2" stroke="#38BDF8" stroke-width="2" rx="4" />
  <!-- Gas Volume collected (1 volume) -->
  <rect x="231" y="31" width="26" height="25" fill="#0A1B16" />
  <text x="244" y="47" fill="#34D399" font-size="11" font-weight="bold" font-family="monospace" text-anchor="middle">O₂ (g)</text>
  <text x="244" y="74" fill="#38BDF8" font-size="9" font-family="sans-serif" text-anchor="middle">Vol: 1X</text>

  <!-- Cross Connecting Tube -->
  <rect x="168" y="125" width="62" height="20" fill="#38BDF8" fill-opacity="0.3" stroke="#38BDF8" stroke-width="1.5" />

  <!-- Central Reservoir Tube -->
  <rect x="187" y="50" width="24" height="80" fill="#38BDF8" fill-opacity="0.25" stroke="#38BDF8" stroke-width="1.5" />
  <polygon points="175,50 223,50 205,30 193,30" fill="#38BDF8" fill-opacity="0.3" stroke="#38BDF8" stroke-width="1.5" />
  <text x="199" y="24" fill="#94A3B8" font-size="9" font-family="sans-serif" text-anchor="middle">H₂O + H₂SO₄</text>

  <!-- Electrodes -->
  <rect x="150" y="145" width="8" height="25" fill="#64748B" />
  <text x="120" y="180" fill="#38BDF8" font-size="10" font-family="monospace">Cathode (-)</text>

  <rect x="240" y="145" width="8" height="25" fill="#64748B" />
  <text x="270" y="180" fill="#EF4444" font-size="10" font-family="monospace">Anode (+)</text>

  <!-- DC Battery -->
  <line x1="154" y1="170" x2="154" y2="200" stroke="#94A3B8" stroke-width="2" />
  <line x1="154" y1="200" x2="190" y2="200" stroke="#94A3B8" stroke-width="2" />
  <line x1="190" y1="192" x2="190" y2="208" stroke="#38BDF8" stroke-width="3" />
  <line x1="198" y1="195" x2="198" y2="205" stroke="#94A3B8" stroke-width="2" />
  <line x1="206" y1="192" x2="206" y2="208" stroke="#38BDF8" stroke-width="3" />
  <line x1="214" y1="195" x2="214" y2="205" stroke="#94A3B8" stroke-width="2" />
  <line x1="214" y1="200" x2="244" y2="200" stroke="#94A3B8" stroke-width="2" />
  <line x1="244" y1="200" x2="244" y2="170" stroke="#94A3B8" stroke-width="2" />

  <!-- Reaction Formulas -->
  <text x="320" y="60" fill="#FCD34D" font-size="12" font-weight="bold" font-family="monospace">2H₂O(l) → 2H₂(g) + O₂(g)</text>
  <text x="320" y="90" fill="#38BDF8" font-size="10" font-family="sans-serif">Cathode: 2H⁺ + 2e⁻ → H₂(g)</text>
  <text x="320" y="112" fill="#34D399" font-size="10" font-family="sans-serif">Anode: 4OH⁻ → O₂(g) + 2H₂O + 4e⁻</text>
  <text x="320" y="140" fill="#F472B6" font-size="11" font-weight="bold" font-family="monospace">H₂ : O₂ Volume Ratio = 2 : 1</text>
</svg>`;
    }

    default: {
      // General Laboratory Setup Schematic for any other simulation
      return `<svg viewBox="0 0 520 200" className="w-full max-w-lg mx-auto my-3 bg-[#0A1B16]/90 rounded-xl border border-emerald-500/30 shadow-inner">
  <!-- Laboratory Table -->
  <line x1="30" y1="150" x2="490" y2="150" stroke="#64748B" stroke-width="3" />
  <line x1="80" y1="150" x2="70" y2="190" stroke="#64748B" stroke-width="3" />
  <line x1="440" y1="150" x2="450" y2="190" stroke="#64748B" stroke-width="3" />

  <!-- Specimen / Sensor Apparatus Chamber -->
  <rect x="180" y="60" width="160" height="90" fill="#1E293B" stroke="#38BDF8" stroke-width="2" rx="8" />
  <circle cx="260" cy="105" r="30" fill="#0A1B16" stroke="#34D399" stroke-width="2" stroke-dasharray="3,3" />
  <circle cx="260" cy="105" r="10" fill="#FCD34D" />
  <text x="260" y="109" fill="#0A1B16" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">ACTIVE</text>
  <text x="260" y="45" fill="#38BDF8" font-size="11" font-family="sans-serif" text-anchor="middle">Experimental Setup</text>

  <!-- Input Signal / Probes -->
  <line x1="90" y1="105" x2="180" y2="105" stroke="#FCD34D" stroke-width="2" />
  <polygon points="180,105 172,100 172,110" fill="#FCD34D" />
  <text x="135" y="95" fill="#FCD34D" font-size="10" font-family="monospace" text-anchor="middle">Input Probes</text>

  <!-- Output Sensor / Detector -->
  <line x1="340" y1="105" x2="430" y2="105" stroke="#34D399" stroke-width="2" />
  <polygon points="430,105 422,100 422,110" fill="#34D399" />
  <text x="385" y="95" fill="#34D399" font-size="10" font-family="monospace" text-anchor="middle">Live Sensors</text>

  <!-- Readout Digital Display -->
  <rect x="360" y="120" width="100" height="30" fill="#0A1B16" stroke="#34D399" stroke-width="1.5" rx="4" />
  <text x="410" y="140" fill="#34D399" font-size="11" font-weight="bold" font-family="monospace" text-anchor="middle">Calibrated</text>
</svg>`;
    }
  }
}

/**
 * Builds the complete, structured markdown notes to be rendered on the Classroom Whiteboard
 */
export function buildExperimentChalkboardContent(
  experiment: ExperimentContext,
  currentParams: Record<string, number> = {},
  observations: any[] = []
): string {
  const title = experiment.title || "Virtual Lab Experiment";
  const hindiTitle = experiment.hindiTitle ? ` (${experiment.hindiTitle})` : "";
  const subject = experiment.subject ? experiment.subject.toUpperCase() : "STEM";
  const category = experiment.category || "Laboratory Science";
  const aim = experiment.aim || "To investigate the governing physical laws and verify theoretical predictions through virtual simulation.";
  const conceptFormula = experiment.conceptFormula || "";
  const explanation = experiment.explanation || "";
  const apparatus = experiment.apparatus || [];
  const procedure = experiment.procedure || [];
  const precautions = experiment.precautions || [];
  const vivaQuestions = experiment.vivaQuestions || [];

  // Generate SVG Schematic
  const svgDiagram = experiment.svgDiagram || getExperimentChalkboardSvg(experiment.id || "", currentParams);

  // Format Live Parameters Section
  let paramsMarkdown = "";
  if (Object.keys(currentParams).length > 0) {
    paramsMarkdown = `### 📊 Live Parameter Values Set in Lab (वर्तमान मान):\n` +
      Object.entries(currentParams)
        .map(([key, val]) => {
          const cfg = experiment.paramConfigs?.find((c) => c.key === key);
          const label = cfg?.label || key;
          const unit = cfg?.unit ? ` ${cfg.unit}` : "";
          return `- **${label}:** \`${val}${unit}\``;
        })
        .join("\n") +
      "\n\n";
  }

  // Format Procedure Section
  let procedureMarkdown = "";
  if (procedure.length > 0) {
    procedureMarkdown = `### 🧪 Step-by-Step Experimental Procedure (प्रयोग विधि):\n` +
      procedure
        .map((step) => {
          const num = step.stepNumber || 1;
          const stitle = step.title ? `**${step.title}**: ` : "";
          const tip = step.tip ? ` *(Tip: ${step.tip})*` : "";
          return `${num}. ${stitle}${step.instruction}${tip}`;
        })
        .join("\n") +
      "\n\n";
  }

  // Format Apparatus Section
  let apparatusMarkdown = "";
  if (apparatus.length > 0) {
    apparatusMarkdown = `### 🧰 Required Apparatus & Setup (आवश्यक उपकरण):\n` +
      apparatus.map((item) => `- ${item}`).join("\n") +
      "\n\n";
  }

  // Format Precautions Section
  let precautionsMarkdown = "";
  if (precautions.length > 0) {
    precautionsMarkdown = `### ⚠️ Important Precautions & Exam Traps (सावधानियां):\n` +
      precautions.map((p) => `- ⚠️ ${p}`).join("\n") +
      "\n\n";
  }

  // Format Viva Questions Section
  let vivaMarkdown = "";
  if (vivaQuestions.length > 0) {
    vivaMarkdown = `### ❓ Viva-Voce Conceptual Questions (मौखिक प्रश्नोत्तर):\n` +
      vivaQuestions
        .map((vq) => {
          const formulaStr = vq.formula ? ` *(Formula: \`$$${vq.formula}$$\`)*` : "";
          return `- **Q:** ${vq.question}\n  **A:** ${vq.answer}${formulaStr}`;
        })
        .join("\n\n") +
      "\n\n";
  }

  // Combine full markdown
  return `# 🔬 ${title}${hindiTitle}
**Subject:** ${subject} | **Category:** ${category} | **Mode:** Virtual Lab Whiteboard Explanation

### 🎯 Objective & Aim (प्रयोग का उद्देश्य):
${aim}

${svgDiagram}

${conceptFormula ? `### 💡 Core Governing Formulas & Principle (मूल सिद्धांत व सूत्र):\n$$${conceptFormula}$$\n\n` : ""}${explanation ? `**Conceptual Explanation:**\n${explanation}\n\n` : ""}${paramsMarkdown}${apparatusMarkdown}${procedureMarkdown}${precautionsMarkdown}${vivaMarkdown}---
*Notes synchronized live from STEM Virtual Lab Studio with Cherry Ma'am.*`;
}

/**
 * Builds the comprehensive spoken prompt to inject into Cherry Ma'am's live session
 */
export function buildCherryExperimentSpokenPrompt(
  experiment: ExperimentContext,
  currentParams: Record<string, number> = {},
  observations: any[] = [],
  studentName: string = "beta",
  studentGrade: string = "Class 10",
  studentBoard: string = "CBSE"
): string {
  const title = experiment.title || "Virtual Lab Experiment";
  const hindiTitle = experiment.hindiTitle || "";
  const aim = experiment.aim || "Investigating physical and chemical laws.";
  const conceptFormula = experiment.conceptFormula || "";
  const apparatus = (experiment.apparatus || []).join(", ");
  const currentParamsList = Object.entries(currentParams)
    .map(([k, v]) => `${k} = ${v}`)
    .join(", ");

  return `[SYSTEM TRIGGER: EXPERIMENT WHITEBOARD EXPLANATION WITH CHERRY MA'AM]:
Student "${studentName}" (Grade: ${studentGrade}, Board: ${studentBoard}) has clicked "Ask Cherry Ma'am to Explain on Whiteboard" from the Virtual Lab Studio for the experiment: "${title}"${hindiTitle ? ` (${hindiTitle})` : ""}.

COMPLETE EXPERIMENT CONTEXT FOR CHERRY MA'AM:
- Topic: ${title}
- Subject: ${experiment.subject || "Science"} | Category: ${experiment.category || "Lab"}
- Aim: ${aim}
- Core Formula: ${conceptFormula}
- Apparatus: ${apparatus}
- Live Slider Parameters set by student right now: ${currentParamsList || "Default baseline parameters"}
- Theory & Procedure: ${experiment.explanation || "Step-by-step experimental derivation"}
${experiment.cherryObservation?.examTrap ? `- Key Board Exam Trap: ${experiment.cherryObservation.examTrap}` : ""}

MANDATORY EXECUTION FOR CHERRY MA'AM:
1. Immediately call \`setTeachingState(phase='concept')\` and call \`updateWhiteboard\` to show the complete experiment chalkboard notes with the schematic diagram, LaTeX formulas, apparatus, procedure, and live parameter values.
2. In your signature energetic, sassy, warm Hinglish voice as Cherry Ma'am, greet the student enthusiastically:
   "Namaste ${studentName}! Wah, Virtual Lab me '${title}' experiment kar rahe the? Bahut hi badhiya topic choose kiya! Chalo blackboard par is pure experiment ko step-by-step crystal clear samajhte hain—iska aim, ray/circuit diagram, apparatus setup, aur mathematical formulas!"
3. Explain the experiment clearly in your warm Hinglish style:
   - Break down the Aim and why we perform this experiment.
   - Walk through the schematic diagram and apparatus drawn on the blackboard.
   - Explain the core governing formula (${conceptFormula}) and sign conventions/laws.
   - Connect the explanation directly to the live parameters the student set in the lab (${currentParamsList}).
   - Highlight the important precautions and board exam traps.
4. Conclude your explanation by asking a quick, engaging viva-voce conceptual check question to the student!`;
}
