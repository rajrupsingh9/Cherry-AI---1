import { LabExperiment } from "./labTypes";

export const PRESET_EXPERIMENTS: LabExperiment[] = [
  {
    id: "optics-lens",
    title: "Optics & Lens Lab: Ray Tracing",
    hindiTitle: "प्रकाशिकी एवं लेंस प्रयोग: किरण आरेख",
    subject: "physics",
    grades: ["Class 7", "Class 8", "Class 9", "Class 10", "Class 12"],
    category: "Geometrical Optics",
    icon: "🔭",
    description: "Vary focal length and object distance to observe real-time ray tracing, principal focus, and image magnification.",
    conceptFormula: "\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}, \\quad m = \\frac{v}{u} = \\frac{h_i}{h_o}",
    color: "from-cyan-500/20 to-blue-600/10",
    accentColor: "#0284c7",
    defaultParams: {
      focalLength: 80,
      objectDistance: 160,
      objectHeight: 50,
      lensType: 1, // 1 = Convex (Converging), 0 = Concave (Diverging)
    },
    paramConfigs: [
      { key: "objectDistance", label: "Object Distance (u)", min: 40, max: 260, step: 5, unit: "cm", description: "Distance of the object arrow from the optical center (O)." },
      { key: "focalLength", label: "Focal Length (f)", min: 40, max: 120, step: 5, unit: "cm", description: "Distance between optical center O and principal focus F." },
      { key: "objectHeight", label: "Object Height (hₒ)", min: 20, max: 70, step: 5, unit: "cm", description: "Height of the luminous object." },
      { key: "lensType", label: "Lens Mode (1:Convex, 0:Concave)", min: 0, max: 1, step: 1, unit: "type", description: "Toggle between Converging Convex Lens and Diverging Concave Lens." },
    ],
    explanation: "When object is beyond 2F, the real, inverted, diminished image forms between F and 2F. When placed within focal length (u < f), a virtual, erect, and magnified image forms on the same side.",
    aim: "To determine the image distance (v), nature, and magnification (m) for various object positions using a convex/concave lens.",
    apparatus: ["Optical Bench", "Convex Lens (f = 10-20 cm)", "Concave Lens", "Illuminated Object Arrow / Needle", "Screen / Sensor", "Meter Scale"],
    procedure: [
      { stepNumber: 1, title: "Position Lens at Center", instruction: "Place the lens at the central optical axis mark (O) of the bench." },
      { stepNumber: 2, title: "Adjust Object Distance (u)", instruction: "Slide the object arrow beyond 2F, at 2F, between F and 2F, and within F." },
      { stepNumber: 3, title: "Trace Principal Rays", instruction: "Observe Ray 1 (parallel to axis), Ray 2 (through optical center O), and Ray 3 (through focal point)." },
      { stepNumber: 4, title: "Log Image Distance (v)", instruction: "Record image distance and calculate linear magnification using m = v / u." }
    ],
    precautions: [
      "Ensure the principal axis is straight and parallel to the optical bench.",
      "The upright object and lens center must lie on the same horizontal plane.",
      "Apply sign conventions strictly (u is negative according to Cartesian sign rules)."
    ],
    vivaQuestions: [
      { question: "What is the optical center of a lens?", answer: "The central point on the principal axis through which a ray of light passes without experiencing any deviation.", formula: "\\text{Deviation } \\delta = 0" },
      { question: "When does a convex lens form a virtual and magnified image?", answer: "When the object is placed between the optical center (O) and the principal focus (F₁), acting as a magnifying glass." },
      { question: "What is the power of a lens with focal length 20 cm?", answer: "Power P = 100 / f (in cm) = 100 / 20 = +5.0 Dioptres (D).", formula: "P = \\frac{1}{f(\\text{m})} = +5.0\\text{ D}" }
    ]
  },
  {
    id: "ohms-law",
    title: "Ohm's Law & Circuit Bench",
    hindiTitle: "ओम का नियम और विद्युत परिपथ",
    subject: "physics",
    grades: ["Class 8", "Class 9", "Class 10", "Class 11", "Class 12"],
    category: "Current Electricity",
    icon: "⚡",
    description: "Vary voltage and resistance to observe live current flow, electron drift velocity, bulb filament glow, and V-I linear characteristic slope.",
    conceptFormula: "V = I \\times R \\implies I = \\frac{V}{R}, \\quad P = V \\times I = I^2 R",
    color: "from-amber-500/20 to-yellow-600/10",
    accentColor: "#d97706",
    defaultParams: {
      voltage: 12,
      resistance: 6,
      switchState: 1, // 1 = Closed/ON, 0 = Open/OFF
    },
    paramConfigs: [
      { key: "voltage", label: "Potential Difference (V)", min: 1, max: 30, step: 1, unit: "V", description: "DC Power Supply or Battery Voltage." },
      { key: "resistance", label: "Load Resistance (R)", min: 1, max: 25, step: 0.5, unit: "Ω", description: "Rheostat or Fixed Resistor in circuit." },
      { key: "switchState", label: "Circuit Switch (1:ON, 0:OFF)", min: 0, max: 1, step: 1, unit: "state", description: "Toggle plug key to close/open electric loop." },
    ],
    explanation: "At constant temperature, the electric current (I) flowing through a metallic conductor is directly proportional to the potential difference (V) applied across its ends.",
    aim: "To verify Ohm's Law (V = IR) and determine the resistance of a given wire from the slope of the V-I characteristic curve.",
    apparatus: ["DC Battery / Eliminator (0-30V)", "Rheostat / Resistor", "DC Voltmeter", "DC Ammeter", "Key Switch", "Connecting Wires", "Load Lamp"],
    procedure: [
      { stepNumber: 1, title: "Connect Circuit in Series", instruction: "Connect battery, ammeter, resistor, and key switch in series. Connect voltmeter in parallel across resistor." },
      { stepNumber: 2, title: "Close Circuit Key", instruction: "Insert plug key to allow current to flow through the circuit." },
      { stepNumber: 3, title: "Vary Potential (V)", instruction: "Increase voltage slider in steps of 2V and note corresponding Ammeter reading (I)." },
      { stepNumber: 4, title: "Plot V-I Graph", instruction: "Plot potential difference (V) on Y-axis against current (I) on X-axis. The straight line slope represents R = ΔV / ΔI." }
    ],
    precautions: [
      "Ammeter must always be connected in series with low internal resistance.",
      "Voltmeter must always be connected in parallel across the load with high internal resistance.",
      "Do not pass current for a prolonged time to prevent Joule heating effect from altering resistance."
    ],
    vivaQuestions: [
      { question: "State Ohm's Law precisely.", answer: "The current flowing through a conductor is directly proportional to the potential difference across its terminals, provided physical conditions (like temperature) remain constant.", formula: "V \\propto I \\implies V = IR" },
      { question: "What does the slope of a V vs I graph represent?", answer: "The slope (ΔV / ΔI) gives the electric resistance (R) of the conductor in Ohms (Ω)." },
      { question: "What is an Ohmic vs Non-Ohmic conductor?", answer: "Ohmic conductors (e.g. Copper, Nichrome) obey Ohm's Law with a linear V-I curve; Non-Ohmic conductors (e.g. Diodes, Filament Lamps) have non-linear curves due to temperature/semiconductor effects." }
    ]
  },
  {
    id: "acid-base-ph",
    title: "pH Scale & Acid-Base Titration",
    hindiTitle: "अम्ल-क्षार उदासीनीकरण और pH स्केल",
    subject: "chemistry",
    grades: ["Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"],
    category: "Chemical Reactions",
    icon: "🧪",
    description: "Dispense titrant drops from a calibrated burette into an acid analyte. Observe live universal indicator color shift and pH titration curve.",
    conceptFormula: "\\text{pH} = -\\log_{10}[\\text{H}^+], \\quad N_1 V_1 = N_2 V_2 \\quad (\\text{Equivalence at } \\text{pH}=7)",
    color: "from-emerald-500/20 to-teal-600/10",
    accentColor: "#059669",
    defaultParams: {
      titrantVolume: 0, // mL of 0.1M NaOH added (0 to 50 mL)
      indicatorType: 1, // 1: Phenolphthalein, 2: Methyl Orange, 3: Universal Indicator
      dripRate: 0, // 0: Stopped, 1: Slow Drip, 2: Fast
    },
    paramConfigs: [
      { key: "titrantVolume", label: "0.1M NaOH Added (Burette Volume)", min: 0, max: 50, step: 0.5, unit: "mL", description: "Volume of basic titrant dispensed into 25 mL of 0.1M HCl." },
      { key: "indicatorType", label: "Indicator (1:Phenol, 2:Methyl, 3:Universal)", min: 1, max: 3, step: 1, unit: "type", description: "Select pH chemical indicator for visual endpoint color transition." },
      { key: "dripRate", label: "Burette Valve Flow Rate", min: 0, max: 3, step: 1, unit: "drops/s", description: "Control live continuous dripping of NaOH from burette tip." },
    ],
    explanation: "At the equivalence point (25 mL of 0.1M NaOH added to 25 mL 0.1M HCl), exact neutralization occurs. A single drop swings pH from 3 to 11, causing instant indicator color transition.",
    aim: "To determine the strength and endpoint of a strong acid (HCl) by titrating against standard sodium hydroxide (NaOH) solution using indicators.",
    apparatus: ["Burette (50 mL with stopcock)", "Conical Flask (250 mL)", "Pipette (25 mL)", "Standard 0.1M NaOH Solution", "0.1M HCl Solution", "Phenolphthalein / Universal Indicator", "White Tile"],
    procedure: [
      { stepNumber: 1, title: "Fill Burette", instruction: "Rinse and fill the burette with standard 0.1 M NaOH up to the 0.0 mL mark." },
      { stepNumber: 2, title: "Pipette Out Acid", instruction: "Pipette exactly 25.0 mL of 0.1 M HCl into the conical flask placed on a white tile." },
      { stepNumber: 3, title: "Add Indicator Drops", instruction: "Add 2-3 drops of Phenolphthalein (colorless in acid) or Universal Indicator." },
      { stepNumber: 4, title: "Titrate to Endpoint", instruction: "Open burette stopcock dropwise while swirling. Stop when permanent light pink color persists for 30 seconds." }
    ],
    precautions: [
      "Remove air bubble from burette nozzle before noting initial reading.",
      "Always read the lower meniscus for colorless transparent solutions.",
      "Swirl the conical flask continuously while dispensing titrant drop by drop."
    ],
    vivaQuestions: [
      { question: "What is the pH of pure water at 25°C?", answer: "pH = 7.0 (Neutral), where [H⁺] = [OH⁻] = 1.0 × 10⁻⁷ M.", formula: "K_w = [\\text{H}^+][\\text{OH}^-] = 10^{-14}" },
      { question: "Why is phenolphthalein suitable for strong acid vs strong base titration?", answer: "Its color change interval (pH 8.2 to 10.0, colorless to pink) coincides cleanly with the steep vertical equivalence pH jump." },
      { question: "What is the difference between endpoint and equivalence point?", answer: "Equivalence point is the theoretical point where moles of acid equal moles of base; Endpoint is the experimental point signaled by indicator color change." }
    ]
  },
  {
    id: "cell-microscope",
    title: "Virtual Cell Microscope: Plant vs Animal",
    hindiTitle: "कोशिका संरचना एवं सूक्ष्मदर्शी",
    subject: "biology",
    grades: ["Class 6", "Class 7", "Class 8", "Class 9", "Class 11"],
    category: "Cell Biology & Cytology",
    icon: "🔬",
    description: "Zoom through onion peel and human cheek epithelial cells up to 1000x magnification. Adjust fine focus, staining dye, and explore organelles.",
    conceptFormula: "\\text{Total Magnification} = \\text{Eyepiece (10x)} \\times \\text{Objective (4x / 10x / 40x / 100x)}",
    color: "from-teal-500/20 to-emerald-600/10",
    accentColor: "#0d9488",
    defaultParams: {
      magnification: 100, // 40x, 100x, 400x, 1000x
      sampleType: 1, // 1: Onion Peel (Plant), 2: Human Cheek (Animal), 3: Leaf Stomata
      focusDial: 50, // 0 to 100 (50 is crystal clear optimum focus)
      stainDye: 1, // 1: Methylene Blue, 2: Safranin Red, 3: Iodine Solution
    },
    paramConfigs: [
      { key: "magnification", label: "Total Magnification (40x - 1000x)", min: 40, max: 1000, step: 20, unit: "x", description: "Objective turret zoom power." },
      { key: "sampleType", label: "Slide Sample (1:Onion, 2:Cheek, 3:Stomata)", min: 1, max: 3, step: 1, unit: "sample", description: "Choose between plant cell, animal cell, or epidermal guard cells." },
      { key: "focusDial", label: "Fine Focus Knob (Target: 50)", min: 0, max: 100, step: 1, unit: "%", description: "Adjust objective distance for crystal clear focal sharpness." },
      { key: "stainDye", label: "Staining Dye (1:Blue, 2:Safranin, 3:Iodine)", min: 1, max: 3, step: 1, unit: "dye", description: "Chemical stain used to highlight nuclei and cell walls." },
    ],
    explanation: "Plant cells possess a rigid cellulose cell wall, large central vacuole, and plastids/chloroplasts. Animal cells lack cell walls, possessing flexible membranes and central nuclei.",
    aim: "To prepare temporary stained mounts of onion epidermal peel and human cheek cells to study their distinct microscopic structures.",
    apparatus: ["Compound Light Microscope", "Glass Slides & Coverslips", "Onion Bulb", "Sterile Toothpick", "Methylene Blue / Safranin Stain", "Glycerine", "Forceps & Needle"],
    procedure: [
      { stepNumber: 1, title: "Peel Onion Epidermis", instruction: "Peel a thin transparent membrane from the inner surface of an onion scale leaf." },
      { stepNumber: 2, title: "Stain the Mount", instruction: "Place peel in water on a slide, add 1 drop of Safranin/Methylene blue for 2 minutes." },
      { stepNumber: 3, title: "Apply Coverslip", instruction: "Add a drop of glycerine and gently lower coverslip with needle at 45° to avoid air bubbles." },
      { stepNumber: 4, title: "Focus under Microscope", instruction: "Observe under low power (10x), then switch to high power (40x/100x) and sharpen with fine focus knob." }
    ],
    precautions: [
      "Avoid folding of the onion peel or cell overlapping on the slide.",
      "Glycerine prevents dehydration and drying out of the biological specimen.",
      "Wipe off excess stain with blotting paper before placing on the microscope stage."
    ],
    vivaQuestions: [
      { question: "Why do plant cells have cell walls while animal cells do not?", answer: "Cell walls made of cellulose provide structural rigidity, mechanical support, and protection against osmotic bursting in plants that lack skeletons." },
      { question: "What is the function of the nucleus in a eukaryotic cell?", answer: "The nucleus houses the genetic material (DNA/chromosomes) and acts as the control center for cellular metabolism and reproduction." },
      { question: "Why is glycerine used when mounting slides?", answer: "Glycerine prevents the specimen from drying out (desiccation) and matches optical refractive indices for clear imaging." }
    ]
  },
  {
    id: "trig-unit-circle",
    title: "Trigonometric Unit Circle & Wave Generator",
    hindiTitle: "त्रिकोणमितीय इकाई वृत्त और वेव",
    subject: "mathematics",
    grades: ["Class 10", "Class 11", "Class 12"],
    category: "Trigonometry & Functions",
    icon: "📐",
    description: "Rotate angle point θ around the unit circle to see live Sine, Cosine, and Tangent geometric lengths alongside continuous wave generation.",
    conceptFormula: "\\sin^2\\theta + \\cos^2\\theta = 1, \\quad P(x, y) = (\\cos\\theta, \\sin\\theta), \\quad \\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}",
    color: "from-rose-500/20 to-pink-600/10",
    accentColor: "#e11d48",
    defaultParams: {
      thetaDeg: 45,
      frequency: 1,
      showTangent: 1,
    },
    paramConfigs: [
      { key: "thetaDeg", label: "Angle (θ in Degrees)", min: 0, max: 360, step: 1, unit: "°", description: "Angle measured counter-clockwise from positive X-axis." },
      { key: "frequency", label: "Wave Multiplier (k)", min: 1, max: 4, step: 1, unit: "x", description: "Frequency harmonic factor for sine wave." },
      { key: "showTangent", label: "Show Tangent Line (1:Yes, 0:No)", min: 0, max: 1, step: 1, unit: "flag", description: "Display geometric tangent extension line." },
    ],
    explanation: "On a unit circle of radius r = 1, the x-coordinate of point P is cos(θ) and the y-coordinate is sin(θ). As θ rotates, the height traces a continuous sinusoidal wave.",
    aim: "To demonstrate the geometric foundation of trigonometric functions (sin, cos, tan) on a unit circle and plot their periodic continuous waves.",
    apparatus: ["Coordinate Plane Display", "Unit Circle (r = 1)", "Rotating Radius Vector (OP)", "Angle Protractor", "Real-time Wave Buffer"],
    procedure: [
      { stepNumber: 1, title: "Rotate Angle Vector", instruction: "Drag the angle point P or slide θ from 0° to 360° across all four quadrants." },
      { stepNumber: 2, title: "Observe Coordinate Projections", instruction: "Observe blue horizontal segment (cos θ) and green vertical segment (sin θ)." },
      { stepNumber: 3, title: "Check ASTC Quadrant Signs", instruction: "Verify Q1 (All +), Q2 (Sin +), Q3 (Tan +), Q4 (Cos +)." },
      { stepNumber: 4, title: "Track Continuous Wave", instruction: "See how the height of P transfers seamlessly onto the dynamic time-domain sine wave." }
    ],
    precautions: [
      "Angles in standard position are measured counter-clockwise from positive x-axis.",
      "Notice that tan(90°) and tan(270°) diverge to ±infinity (vertical asymptotes)."
    ],
    vivaQuestions: [
      { question: "What are the coordinates of point P on a unit circle?", answer: "P(x, y) = (cos θ, sin θ) where x = cos θ and y = sin θ.", formula: "x^2 + y^2 = 1 \\implies \\cos^2\\theta + \\sin^2\\theta = 1" },
      { question: "State the ASTC rule for trigonometry signs in quadrants.", answer: "Quadrant I: All positive; Quadrant II: Sin & Csc positive; Quadrant III: Tan & Cot positive; Quadrant IV: Cos & Sec positive ('All Silver Tea Cups')." },
      { question: "What is the period of sin(x) and cos(x)?", answer: "The fundamental period is 2π radians or 360°, after which values repeat identically." }
    ]
  },
  {
    id: "pendulum-motion",
    title: "Simple Harmonic Pendulum & Energy Exchange",
    hindiTitle: "सरल लोलक और ऊर्जा संरक्षण",
    subject: "physics",
    grades: ["Class 6", "Class 7", "Class 8", "Class 9", "Class 11"],
    category: "Mechanics & Oscillations",
    icon: "⏱️",
    description: "Adjust length and gravity to see real-time time-period oscillation curves, Kinetic vs Potential Energy bars, and phase space.",
    conceptFormula: "T = 2\\pi \\sqrt{\\frac{L}{g}}, \\quad E_{\\text{total}} = \\text{KE} + \\text{PE} = \\text{constant}",
    color: "from-indigo-500/20 to-violet-600/10",
    accentColor: "#4f46e5",
    defaultParams: {
      length: 100, // cm
      gravity: 9.8, // m/s² (Earth)
      angle: 20, // initial amplitude degrees
    },
    paramConfigs: [
      { key: "length", label: "String Length (L)", min: 40, max: 200, step: 5, unit: "cm", description: "Effective length from suspension point to center of mass of bob." },
      { key: "gravity", label: "Gravitational Acceleration (g)", min: 1.6, max: 25, step: 0.2, unit: "m/s²", description: "Planetary gravity: Moon=1.62, Mars=3.7, Earth=9.8, Jupiter=24.8." },
      { key: "angle", label: "Initial Amplitude (θ₀)", min: 5, max: 45, step: 1, unit: "°", description: "Initial release angle from equilibrium vertical." },
    ],
    explanation: "The period of a simple pendulum depends only on string length L and acceleration due to gravity g. Total mechanical energy is conserved, transforming between KE and PE.",
    aim: "To measure the time period of oscillation for different lengths (L) and calculate acceleration due to gravity (g = 4π²L / T²).",
    apparatus: ["Rigid Stand with Clamp", "Metallic Bob with Hook", "Inextensible Thread", "Vernier Calipers / Meter Scale", "Stopwatch"],
    procedure: [
      { stepNumber: 1, title: "Set Pendulum Length", instruction: "Tie thread to stand so distance from point of suspension to bob center is L = 100 cm." },
      { stepNumber: 2, title: "Displace by Small Angle", instruction: "Displace bob sideways by small angle (< 20°) and release gently without push." },
      { stepNumber: 3, title: "Time 20 Oscillations", instruction: "Start stopwatch as bob passes mean position. Record time taken for 20 complete oscillations." },
      { stepNumber: 4, title: "Calculate Period T", instruction: "Divide time by 20 to get period T. Repeat for L = 80, 100, 120, 140 cm." }
    ],
    precautions: [
      "Keep amplitude angle small (< 20°) so that sin(θ) ≈ θ holds true.",
      "Oscillations must be strictly planar and non-elliptical.",
      "Use inextensible thread with negligible mass."
    ],
    vivaQuestions: [
      { question: "Why does the time period not depend on the mass of the bob?", answer: "Because both gravitational force and inertial mass are proportional to mass, cancelling out in the equation of motion d²θ/dt² + (g/L)θ = 0." },
      { question: "What is a Seconds Pendulum?", answer: "A pendulum whose time period of complete oscillation is exactly 2.0 seconds (taking 1 second for each half-swing). Its length on Earth is ~99.4 cm." },
      { question: "Where is the kinetic energy maximum during a swing?", answer: "At the lowest mean position (equilibrium), where velocity is maximum and height/potential energy is zero." }
    ]
  },
  {
    id: "double-slit",
    title: "Young's Double Slit Wave Interference",
    hindiTitle: "यंग का द्वि-स्लिट प्रकाश व्यतिकरण",
    subject: "physics",
    grades: ["Class 12"],
    category: "Wave Optics",
    icon: "🌊",
    description: "Coherent monochromatic light waves passing through two close slits overlap on the screen to form alternating bright and dark interference fringes.",
    conceptFormula: "\\beta = \\frac{\\lambda D}{d}, \\quad I = 4I_0 \\cos^2\\left(\\frac{\\pi d \\sin\\theta}{\\lambda}\\right)",
    color: "from-emerald-500/20 to-green-600/10",
    accentColor: "#10b981",
    defaultParams: {
      wavelength: 532,
      slitDistance: 0.25,
      screenDistance: 1.2,
      sourceIntensity: 80,
    },
    paramConfigs: [
      { key: "wavelength", label: "Wavelength (λ)", min: 400, max: 700, step: 20, unit: "nm", description: "Wavelength of the monochromatic laser source (Violet to Red)." },
      { key: "slitDistance", label: "Slit Separation (d)", min: 0.1, max: 0.8, step: 0.05, unit: "mm", description: "Distance between the two narrow slits S₁ and S₂." },
      { key: "screenDistance", label: "Screen Distance (D)", min: 0.5, max: 2.0, step: 0.1, unit: "m", description: "Distance from the double-slit plane to observation screen." },
      { key: "sourceIntensity", label: "Laser Intensity (I₀)", min: 20, max: 100, step: 10, unit: "%", description: "Base intensity of the incoming coherent laser beam." },
    ],
    explanation: "Constructive interference occurs when optical path difference Δx = nλ (Bright fringe). Destructive interference occurs when Δx = (n - 1/2)λ (Dark fringe). Fringe width β = λD/d.",
    aim: "To demonstrate wave interference using a double slit aperture and verify fringe width variation with wavelength (λ), slit separation (d), and screen distance (D).",
    apparatus: ["Monochromatic Laser Diode (532 nm / 650 nm)", "Double Slit Slide (d = 0.25 mm)", "Optical Rail & Bench", "Observation Screen / Light Sensor", "Micrometer Travel Scale"],
    procedure: [
      { stepNumber: 1, title: "Mount Laser & Slit", instruction: "Align the laser beam perpendicular to the double-slit slide on the optical bench." },
      { stepNumber: 2, title: "Position Observation Screen", instruction: "Place the white screen at distance D = 1.0 m to 1.5 m from the slit plane." },
      { stepNumber: 3, title: "Measure Fringe Spacing", instruction: "Use traveling microscope scale to measure distance across 5 bright fringes to calculate mean fringe width β." },
      { stepNumber: 4, title: "Vary Slit Separation", instruction: "Switch slit separation d and observe that narrower slits produce wider, more resolved fringes." }
    ],
    precautions: [
      "Never look directly into the laser aperture.",
      "The slit slide must be perpendicular to the incident laser beam.",
      "Avoid ambient light to observe high-contrast dark minima."
    ],
    vivaQuestions: [
      { question: "What are coherent light sources?", answer: "Two sources having zero or constant phase difference with identical frequency and wavelength.", formula: "\\Delta \\phi = \\text{constant}" },
      { question: "What happens if the entire apparatus is immersed in water?", answer: "The wavelength in water decreases (λ' = λ / n), so the fringe width shrinks by a factor of 1.33.", formula: "\\beta' = \\frac{\\beta}{\\mu}" },
      { question: "Why is central fringe always bright in YDSE?", answer: "Because at the central axis (y = 0), path difference between both slits is identically zero (Δx = 0), producing constructive interference." }
    ]
  },
  {
    id: "newtons-cradle",
    title: "Newton's Cradle: Momentum & Energy Conservation",
    hindiTitle: "न्यूटन का पालना: संवेग एवं गतिज ऊर्जा संरक्षण",
    subject: "physics",
    grades: ["Class 9", "Class 11"],
    category: "Mechanics & Collisions",
    icon: "🎱",
    description: "Demonstration of elastic collisions in a chain of metallic spheres, transferring momentum and energy instantly from one end to the other.",
    conceptFormula: "m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2, \\quad \\frac{1}{2}m_1 u_1^2 + \\frac{1}{2}m_2 u_2^2 = \\frac{1}{2}m_1 v_1^2 + \\frac{1}{2}m_2 v_2^2",
    color: "from-sky-500/20 to-cyan-600/10",
    accentColor: "#0284c7",
    defaultParams: {
      liftedBalls: 1,
      releaseAngle: 35,
      ballMass: 100,
      elasticity: 0.98,
    },
    paramConfigs: [
      { key: "liftedBalls", label: "Balls Lifted (Count)", min: 1, max: 3, step: 1, unit: "balls", description: "Number of metallic balls released from the left side." },
      { key: "releaseAngle", label: "Release Angle (θ)", min: 15, max: 60, step: 5, unit: "deg", description: "Initial release angle displacement." },
      { key: "ballMass", label: "Sphere Mass (m)", min: 50, max: 200, step: 10, unit: "g", description: "Mass of each identical steel ball." },
      { key: "elasticity", label: "Restitution (e)", min: 0.5, max: 1.0, step: 0.05, unit: "ratio", description: "Elasticity coefficient (1.0 = zero energy dissipation)." },
    ],
    explanation: "When N balls are lifted and released, exactly N balls fly out from the opposite end with equal velocity to simultaneously conserve linear momentum (P) and kinetic energy (KE).",
    aim: "To demonstrate the simultaneous conservation of momentum and kinetic energy during 1D elastic collisions in a multi-body cradle system.",
    apparatus: ["Newton's Cradle Frame (5 hardened steel spheres)", "Bifilar Nylon Suspensions", "Protractor Arc Scale", "High-speed Photo-gate Timer"],
    procedure: [
      { stepNumber: 1, title: "Align Suspended Spheres", instruction: "Ensure all 5 steel spheres touch in a straight horizontal line at equilibrium." },
      { stepNumber: 2, title: "Release 1 Ball", instruction: "Displace 1 ball by angle 35° and release. Observe that exactly 1 ball ejects on right side." },
      { stepNumber: 3, title: "Release 2 Balls", instruction: "Displace 2 balls together and release. Notice exactly 2 balls eject from right side." },
      { stepNumber: 4, title: "Measure Impact Speed", instruction: "Calculate velocity at impact v = √(2gL(1 - cos θ)) and verify energy conservation." }
    ],
    precautions: [
      "Ensure spheres are suspended bifilarly so motion remains in a single vertical plane.",
      "Release balls smoothly without imparting any initial lateral spin."
    ],
    vivaQuestions: [
      { question: "Why don't 2 balls colliding eject 1 ball at double speed?", answer: "Because if 1 ball ejected at 2v, KE would be 1/2 m(2v)² = 2mv² (twice the initial energy), violating the Law of Conservation of Energy." },
      { question: "What is coefficient of restitution (e) for a perfectly elastic collision?", answer: "e = 1.0, meaning relative velocity of separation equals relative velocity of approach.", formula: "e = \\frac{v_2 - v_1}{u_1 - u_2} = 1.0" },
      { question: "Why are high-carbon steel balls used in Newton's Cradle?", answer: "Hardened steel minimizes internal viscoelastic damping and plastic deformation during high impact contact." }
    ]
  },
  {
    id: "capacitor-rc",
    title: "RC Circuit: Capacitor Charging & Time Constant (τ)",
    hindiTitle: "RC परिपथ: संधारित्र आवेशन एवं समय नियतांक",
    subject: "physics",
    grades: ["Class 12"],
    category: "Current Electricity",
    icon: "⚡",
    description: "Transient charging of a capacitor through a resistor connected to DC supply, demonstrating exponential potential growth and time constant τ = RC.",
    conceptFormula: "V_C(t) = V_0 \\left(1 - e^{-t / RC}\\right), \\quad I(t) = \\frac{V_0}{R} e^{-t / RC}, \\quad \\tau = R \\times C",
    color: "from-amber-500/20 to-orange-600/10",
    accentColor: "#d97706",
    defaultParams: {
      supplyVoltage: 12,
      resistance: 5,
      capacitance: 100,
      switchMode: 1,
    },
    paramConfigs: [
      { key: "supplyVoltage", label: "DC Voltage (V₀)", min: 5, max: 24, step: 1, unit: "V", description: "Direct Current power supply voltage." },
      { key: "resistance", label: "Resistance (R)", min: 1, max: 20, step: 1, unit: "kΩ", description: "Series charging resistance in kilo-ohms." },
      { key: "capacitance", label: "Capacitance (C)", min: 10, max: 200, step: 10, unit: "μF", description: "Capacitor value in microfarads." },
      { key: "switchMode", label: "Circuit Switch (1:Charge, 0:Discharge)", min: 0, max: 1, step: 1, unit: "mode", description: "Toggle charging from DC source or discharging through load." },
    ],
    explanation: "At t = 0, capacitor is uncharged and behaves as short circuit (I_max = V₀/R). As charge builds, voltage rises exponentially to V₀ and current decays to zero at steady state.",
    aim: "To study the charging and discharging characteristics of an RC circuit and determine the experimental time constant τ = RC.",
    apparatus: ["DC Regulated Power Supply (0-20V)", "Electrolytic Capacitors (100 μF, 470 μF)", "Carbon Resistors (10 kΩ, 47 kΩ)", "Digital Storage Oscilloscope / Voltmeter", "Single Pole Double Throw (SPDT) Switch"],
    procedure: [
      { stepNumber: 1, title: "Assemble RC Loop", instruction: "Connect DC power supply, series resistor R, capacitor C, and SPDT switch in charging configuration." },
      { stepNumber: 2, title: "Start Timer at Switch ON", instruction: "Flip switch to Charge mode and log voltage Vc across capacitor every 2 seconds." },
      { stepNumber: 3, title: "Measure Time Constant τ", instruction: "Find time taken for Vc to reach 63.2% of supply voltage V₀ (Vc = 0.632 V₀)." },
      { stepNumber: 4, title: "Plot Vc vs Time Curve", instruction: "Plot charging and discharging graphs and compute τ = R × C from slope." }
    ],
    precautions: [
      "Observe polarity strictly for electrolytic capacitors (+ to positive rail).",
      "Ensure capacitor is completely discharged before starting a new trial."
    ],
    vivaQuestions: [
      { question: "What is the physical meaning of time constant (τ) of an RC circuit?", answer: "The time required for capacitor voltage to charge up to 63.2% of supply voltage or discharge down to 36.8% of its initial value.", formula: "\\tau = R \\times C" },
      { question: "How does an uncharged capacitor behave at instantaneous switch ON (t = 0)?", answer: "It acts as a SHORT CIRCUIT with zero internal resistance, drawing maximum surge current I₀ = V₀ / R." },
      { question: "What is the steady state current in a DC capacitor branch?", answer: "Zero current (I = 0). At steady state, capacitor behaves as an OPEN CIRCUIT." }
    ]
  },
  {
    id: "photosynthesis-light",
    title: "Thylakoid Membrane: Z-Scheme & ATP Synthesis",
    hindiTitle: "प्रकाश संश्लेषण प्रकाश अभिक्रिया: Z-स्कीम एवं ATP संश्लेषण",
    subject: "biology",
    grades: ["Class 11"],
    category: "Plant Physiology",
    icon: "🌿",
    description: "Light photons excite chlorophyll electrons in PS II (P680) and PS I (P700), pumping protons into thylakoid lumen to drive ATP synthase rotor.",
    conceptFormula: "2\\text{H}_2\\text{O} + 2\\text{NADP}^+ + 3\\text{ADP} + 3\\text{P}_i \\xrightarrow{\\text{Light}} \\text{O}_2 + 2\\text{NADPH} + 2\\text{H}^+ + 3\\text{ATP}",
    color: "from-green-500/20 to-teal-600/10",
    accentColor: "#059669",
    defaultParams: {
      lightIntensity: 75,
      co2Concentration: 400,
      temperature: 25,
      waterSupply: 90,
    },
    paramConfigs: [
      { key: "lightIntensity", label: "Light Intensity (Photons)", min: 20, max: 100, step: 10, unit: "μmol/m²s", description: "Sunlight photon flux incident on Chloroplast thylakoid." },
      { key: "co2Concentration", label: "CO₂ Availability", min: 200, max: 800, step: 50, unit: "ppm", description: "Atmospheric CO₂ concentration for Calvin cycle sink." },
      { key: "temperature", label: "Enzyme Temperature", min: 10, max: 45, step: 5, unit: "°C", description: "Optimum temperature for ATP synthase and RuBisCO enzymes." },
      { key: "waterSupply", label: "Water Availability", min: 20, max: 100, step: 10, unit: "%", description: "Water for photolysis at Oxygen Evolving Complex (OEC)." },
    ],
    explanation: "Non-cyclic photophosphorylation transfers electrons from water via PS II and PS I to NADP⁺. The accumulated proton gradient (ΔpH) drives ATP synthase rotary motor to generate ATP.",
    aim: "To study the biochemical mechanism of light reaction, water photolysis, and chemiosmotic ATP generation in chloroplast thylakoid membranes.",
    apparatus: ["Chloroplast Isolation Fraction", "Spectrophotometer", "DCPIP Redox Dye (Hill Reagent)", "High Intensity LED Light Source", "Thermostatic Water Bath"],
    procedure: [
      { stepNumber: 1, title: "Illuminate Chloroplast Suspension", instruction: "Expose thylakoid membrane extract to varying light intensities (20 to 100 μmol/m²s)." },
      { stepNumber: 2, title: "Monitor DCPIP Decolorization", instruction: "Measure rate of blue DCPIP reduction to colorless DCPIPH₂ representing electron transfer rate." },
      { stepNumber: 3, title: "Track Oxygen Evolution", instruction: "Use Clark-type oxygen electrode to measure rate of O₂ gas evolution from water photolysis." },
      { stepNumber: 4, title: "Analyze Proton Pump Rate", instruction: "Observe lumen acidification (ΔpH = 2.4) driving ATP synthase catalytic headpiece rotation." }
    ],
    precautions: [
      "Keep isolated chloroplasts on ice in isotonic buffer before illumination.",
      "Maintain temperature below 35°C to prevent denaturation of photosynthetic complexes."
    ],
    vivaQuestions: [
      { question: "Where does the oxygen released during photosynthesis come from?", answer: "Oxygen comes exclusively from the photolysis of WATER (H₂O) at the Oxygen Evolving Complex of PS II, not from CO₂." },
      { question: "What is the Chemiosmotic Hypothesis of ATP synthesis?", answer: "Proposed by Peter Mitchell: Proton accumulation inside thylakoid lumen creates an electrochemical proton gradient (ΔpH), which releases energy as protons pass through CF₀-CF₁ ATP synthase.", formula: "\\text{ADP} + \\text{P}_i \\xrightarrow{\\Delta \\mu_{\\text{H}^+}} \\text{ATP}" },
      { question: "What are the primary absorption peaks of PS II and PS I?", answer: "Photosystem II absorbs peak light at 680 nm (P680); Photosystem I absorbs peak light at 700 nm (P700)." }
    ]
  },
  {
    id: "doppler-effect",
    title: "Doppler Effect: Moving Sound Source & Wavefronts",
    hindiTitle: "डॉप्लर प्रभाव: गतिशील ध्वनि स्रोत एवं तरंगदैर्घ्य संकुचन",
    subject: "physics",
    grades: ["Class 11"],
    category: "Waves & Acoustics",
    icon: "📢",
    description: "Apparent change in frequency of sound wave for an observer moving relative to its source, showing compressed circular wavefronts ahead and elongated wavefronts behind.",
    conceptFormula: "f' = f_0 \\left( \\frac{v \\pm v_o}{v \\mp v_s} \\right)",
    color: "from-pink-500/20 to-rose-600/10",
    accentColor: "#db2777",
    defaultParams: {
      sourceSpeed: 120,
      soundSpeed: 340,
      sourceFrequency: 440,
      observerSpeed: 0,
    },
    paramConfigs: [
      { key: "sourceSpeed", label: "Source Velocity (v_s)", min: 0, max: 300, step: 20, unit: "m/s", description: "Speed of the siren or vehicle moving to the right." },
      { key: "soundSpeed", label: "Speed of Sound (v)", min: 300, max: 360, step: 10, unit: "m/s", description: "Speed of sound in air at current temperature." },
      { key: "sourceFrequency", label: "Source Pitch (f₀)", min: 200, max: 1000, step: 50, unit: "Hz", description: "Natural frequency emitted by the siren." },
      { key: "observerSpeed", label: "Observer Velocity (v_o)", min: -50, max: 50, step: 10, unit: "m/s", description: "Velocity of listener towards or away from source." },
    ],
    explanation: "When a sound source moves toward an observer, successive wavefronts are emitted closer together, shortening the apparent wavelength (λ' < λ) and increasing perceived pitch (f' > f₀).",
    aim: "To demonstrate the Doppler frequency shift for moving sound sources and observe sonic barrier and Mach cone formation.",
    apparatus: ["Acoustic Doppler Siren Apparatus", "Linear Air Track / Moving Carriage", "Dual Digital Frequency Counters", "High-sensitivity Microphones"],
    procedure: [
      { stepNumber: 1, title: "Emit Baseline Frequency", instruction: "Set stationary source frequency to f₀ = 440 Hz and note receiver frequency f' = 440 Hz." },
      { stepNumber: 2, title: "Accelerate Source Towards Receiver", instruction: "Drive source towards right at velocity vs = 120 m/s and record elevated pitch f'_ahead." },
      { stepNumber: 3, title: "Record Receding Frequency", instruction: "Measure reduced pitch f'_behind as source moves away from the left observer." },
      { stepNumber: 4, title: "Simulate Sonic Barrier (Mach 1)", instruction: "Increase vs = v (340 m/s) to observe all wavefronts overlapping into a high-pressure shockwave barrier." }
    ],
    precautions: [
      "Ensure track alignment is strictly linear along the listener axis to avoid cosine angular correction.",
      "Correct for ambient temperature which affects air sound velocity (v = 331 + 0.6T)."
    ],
    vivaQuestions: [
      { question: "What is the Doppler formula when source moves towards stationary observer?", answer: "Apparent frequency f' = f₀ × (v / (v - v_s)), which is strictly greater than source frequency f₀.", formula: "f' = f_0 \\left(\\frac{v}{v - v_s}\\right)" },
      { question: "What is a Mach Cone or Sonic Boom?", answer: "When source speed exceeds sound speed (v_s > v), circular wavefronts form a tangent conical shockwave envelope called Mach Cone." },
      { question: "Does Doppler effect occur if source and observer move in same direction with same velocity?", answer: "No. Since relative velocity between source and observer is zero (v_rel = 0), apparent frequency equals true frequency." }
    ]
  },
  {
    id: "rutherford-scattering",
    title: "Rutherford Gold Foil Experiment: Discovery of Nucleus",
    hindiTitle: "रदरफोर्ड स्वर्ण पत्र प्रयोग: परमाणु नाभिक की खोज",
    subject: "physics",
    grades: ["Class 12"],
    category: "Atomic Physics",
    icon: "✨",
    description: "Alpha particles (He²⁺) fired at thin gold foil; most pass straight through while a tiny fraction deflect at large angles, proving atom is mostly empty space with a dense positive nucleus.",
    conceptFormula: "N(\\theta) \\propto \\frac{1}{\\sin^4(\\theta / 2)}, \\quad r_0 = \\frac{1}{4\\pi\\varepsilon_0} \\frac{2 Z e^2}{K}",
    color: "from-yellow-500/20 to-amber-600/10",
    accentColor: "#ca8a04",
    defaultParams: {
      alphaEnergy: 5.5,
      atomicNumber: 79,
      beamIntensity: 60,
      foilThickness: 1,
    },
    paramConfigs: [
      { key: "alphaEnergy", label: "Alpha Kinetic Energy (K)", min: 3, max: 10, step: 0.5, unit: "MeV", description: "Kinetic energy of alpha particles from Bismuth-214 source." },
      { key: "atomicNumber", label: "Target Nucleus (Gold Z)", min: 29, max: 92, step: 10, unit: "Z", description: "Atomic number of the foil target (Gold = 79, Silver = 47, Copper = 29)." },
      { key: "beamIntensity", label: "Alpha Beam Flux", min: 20, max: 100, step: 10, unit: "%", description: "Particle count rate per second." },
      { key: "foilThickness", label: "Foil Layers", min: 1, max: 5, step: 1, unit: "layers", description: "Atomic layer thickness of the metal foil." },
    ],
    explanation: "Because the positive nuclear charge is concentrated in a tiny volume (10⁻¹⁵ m) compared to atomic size (10⁻¹⁰ m), 99.9% particles pass undeviated, while head-on impacts (b = 0) rebound at 180°.",
    aim: "To demonstrate alpha particle scattering by atomic nuclei and estimate the upper bound of nuclear radius via distance of closest approach r₀.",
    apparatus: ["Alpha Radioactive Source (²¹⁴Bi / ²⁴¹Am)", "Collimating Lead Slits", "Ultra-thin Gold Foil (100 nm)", "Rotatable Zinc Sulfide (ZnS) Scintillation Screen", "Microscope Detector in Evacuated Chamber"],
    procedure: [
      { stepNumber: 1, title: "Evacuate Chamber", instruction: "Evacuate scattering chamber to prevent alpha particle collisions with air molecules." },
      { stepNumber: 2, title: "Collimated Alpha Beam", instruction: "Direct a fine beam of 5.5 MeV alpha particles onto the thin gold foil target." },
      { stepNumber: 3, title: "Count Scintillations at Angles", instruction: "Rotate ZnS detector from θ = 0° to 180° and count flash rate N(θ)." },
      { stepNumber: 4, title: "Verify Sin⁴(θ/2) Law", instruction: "Plot N(θ) vs 1/sin⁴(θ/2) to confirm Coulomb inverse-square electrostatic repulsion." }
    ],
    precautions: [
      "Use extremely thin gold foil (~1000 atomic layers) to ensure single scattering events.",
      "Maintain high vacuum (< 10⁻⁴ torr) inside the chamber."
    ],
    vivaQuestions: [
      { question: "Why did Rutherford choose gold foil?", answer: "Gold is the most malleable metal, allowing fabrication of ultra-thin foil (~100 nm or ~1000 atoms thick) ensuring single alpha collisions." },
      { question: "What is distance of closest approach (r₀)?", answer: "The minimum distance between an alpha particle and target nucleus in a head-on collision where all kinetic energy transforms into electrostatic potential energy.", formula: "r_0 = \\frac{1}{4\\pi\\varepsilon_0} \\frac{2 Z e^2}{K}" },
      { question: "What was the critical flaw in Rutherford's planetary atomic model?", answer: "According to classical electromagnetic theory, accelerating electrons must radiate energy continuously, causing them to spiral into the nucleus within 10⁻⁸ seconds (Atom instability)." }
    ]
  },
  {
    id: "ideal-gas-piston",
    title: "Kinetic Gas Theory: Piston Chamber & P-V Equation",
    hindiTitle: "आदर्श गैस नियम: पिस्टन कक्ष एवं P-V अवस्था समीकरण",
    subject: "physics",
    grades: ["Class 11"],
    category: "Thermodynamics",
    icon: "💨",
    description: "Gas particles colliding with container walls inside an interactive cylinder piston, demonstrating pressure, temperature, and volume relationships.",
    conceptFormula: "P V = n R T, \\quad P = \\frac{1}{3} \\frac{N m}{V} v_{\\text{rms}}^2, \\quad v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}}",
    color: "from-red-500/20 to-orange-600/10",
    accentColor: "#dc2626",
    defaultParams: {
      temperature: 300,
      chamberVolume: 5,
      moleCount: 1.0,
      gasType: 1,
    },
    paramConfigs: [
      { key: "temperature", label: "Temperature (T)", min: 100, max: 600, step: 25, unit: "K", description: "Absolute thermodynamic temperature in Kelvin." },
      { key: "chamberVolume", label: "Chamber Volume (V)", min: 2, max: 10, step: 0.5, unit: "L", description: "Volume controlled by movable top piston." },
      { key: "moleCount", label: "Gas Amount (n)", min: 0.5, max: 3.0, step: 0.5, unit: "mol", description: "Quantity of gas molecules enclosed." },
      { key: "gasType", label: "Gas Molecule (1:He, 2:N₂, 3:CO₂)", min: 1, max: 3, step: 1, unit: "type", description: "Molar mass of chosen gas species (4, 28, 44 g/mol)." },
    ],
    explanation: "Gas pressure originates from elastic particle collisions against container walls. Decreasing volume increases collision frequency (Boyle's Law), while raising temperature increases average molecular kinetic energy.",
    aim: "To verify the Ideal Gas Law (PV = nRT) and Boyle's isothermal relationship (P ∝ 1/V) in an enclosed cylinder with a movable piston.",
    apparatus: ["Cylinder Piston Chamber with Calibrated Volume Scale", "Bourdon Pressure Gauge", "Digital Thermostat Heater & Thermometer", "Enclosed Pure Helium / Nitrogen Gas"],
    procedure: [
      { stepNumber: 1, title: "Set Initial State", instruction: "Enclose 1.0 mol of gas at T = 300 K and V = 5.0 L. Record baseline pressure P = 498.8 kPa." },
      { stepNumber: 2, title: "Compress Piston (Isothermal)", instruction: "Push piston down to V = 2.5 L keeping T constant. Observe pressure double to ~997 kPa (Boyle's Law)." },
      { stepNumber: 3, title: "Heat the Chamber (Isochoric)", instruction: "Fix piston at V = 5.0 L and raise temperature to T = 600 K. Observe pressure double with temperature." },
      { stepNumber: 4, title: "Compare Gas Species Speeds", instruction: "Switch between Helium (M=4) and CO₂ (M=44) to observe root-mean-square velocity variation (v_rms ∝ 1/√M)." }
    ],
    precautions: [
      "Always convert temperatures to absolute Kelvin scale (K = °C + 273.15).",
      "Compress piston slowly to allow heat dissipation for true isothermal conditions."
    ],
    vivaQuestions: [
      { question: "State Boyle's Law.", answer: "At constant temperature, the pressure of a given mass of an ideal gas is inversely proportional to its volume.", formula: "P \\propto \\frac{1}{V} \\implies P V = \\text{constant}" },
      { question: "What is Root Mean Square velocity (v_rms)?", answer: "The square root of the mean of squares of velocities of all gas molecules, directly proportional to square root of absolute temperature.", formula: "v_{\\text{rms}} = \\sqrt{\\frac{3 R T}{M}}" },
      { question: "Under what conditions do real gases behave like ideal gases?", answer: "At HIGH temperatures and LOW pressures, where intermolecular attractive forces and molecular volume become negligible." }
    ]
  },
  {
    id: "projectile-motion",
    title: "Projectile Kinematics: Parabolic Trajectory & Flight",
    hindiTitle: "प्रक्षेप्य गति: परवलयाकार प्रक्षेप-पथ एवं परास",
    subject: "physics",
    grades: ["Class 11"],
    category: "Kinematics",
    icon: "🎯",
    description: "Launch a projectile at various speeds and angles under gravity, displaying real-time parabolic flight path, velocity vectors, apex height, and horizontal range.",
    conceptFormula: "R = \\frac{u^2 \\sin 2\\theta}{g}, \\quad H = \\frac{u^2 \\sin^2\\theta}{2g}, \\quad T = \\frac{2u \\sin\\theta}{g}",
    color: "from-purple-500/20 to-indigo-600/10",
    accentColor: "#7c3aed",
    defaultParams: {
      initialSpeed: 30,
      launchAngle: 45,
      gravity: 9.8,
      airDrag: 0,
    },
    paramConfigs: [
      { key: "initialSpeed", label: "Launch Speed (u)", min: 10, max: 60, step: 2, unit: "m/s", description: "Initial muzzle velocity of projectile." },
      { key: "launchAngle", label: "Launch Angle (θ)", min: 15, max: 80, step: 5, unit: "deg", description: "Angle of elevation above horizontal ground." },
      { key: "gravity", label: "Gravity (g)", min: 1.6, max: 24.8, step: 0.2, unit: "m/s²", description: "Planetary gravity: Moon 1.6, Mars 3.7, Earth 9.8, Jupiter 24.8." },
      { key: "airDrag", label: "Air Resistance (Toggle)", min: 0, max: 1, step: 1, unit: "state", description: "Toggle aerodynamic air resistance drag." },
    ],
    explanation: "Two-dimensional projectile motion decomposes into uniform horizontal motion (v_x = u cos θ) and uniformly accelerated vertical motion (v_y = u sin θ - gt), producing a parabolic trajectory.",
    aim: "To demonstrate 2D projectile kinematics, verify the parabolic trajectory equation, and show maximum range occurs at launch angle θ = 45°.",
    apparatus: ["Spring-loaded Projectile Launcher", "Angle Protractor Base", "Steel Ball Projectile", "Impact Sand Trap / Electronic Target Sensor Pad", "Photo-gate Muzzle Velocity Sensor"],
    procedure: [
      { stepNumber: 1, title: "Set Launch Angle to 45°", instruction: "Set launcher elevation angle θ = 45° and initial speed u = 30 m/s." },
      { stepNumber: 2, title: "Fire Projectile & Record Landing", instruction: "Launch projectile and measure landing horizontal range R on the ground sensor pad." },
      { stepNumber: 3, title: "Test Complementary Angles", instruction: "Launch at 30° and 60°. Observe that complementary angles (θ and 90°-θ) yield identical horizontal ranges." },
      { stepNumber: 4, title: "Analyze Gravity Effect", instruction: "Switch planetary gravity to Moon (1.6 m/s²) and note that Range increases ~6x." }
    ],
    precautions: [
      "Ensure launcher base is level with ground surface before firing.",
      "Clear the flight path of obstacles and wear safety goggles."
    ],
    vivaQuestions: [
      { question: "Why is the trajectory of a projectile parabolic?", answer: "Eliminating time t between x = (u cos θ)t and y = (u sin θ)t - 1/2 gt² yields y = x tan θ - (g x²) / (2 u² cos² θ), which is a quadratic equation in x.", formula: "y = x\\tan\\theta - \\frac{g x^2}{2 u^2 \\cos^2\\theta}" },
      { question: "What is the velocity and acceleration at the highest point (apex)?", answer: "At the peak, vertical velocity v_y = 0, horizontal velocity v_x = u cos θ, and acceleration is strictly g downward.", formula: "v_{\\text{apex}} = u \\cos\\theta, \\quad a = -g\\hat{j}" },
      { question: "Why do complementary launch angles (e.g. 30° and 60°) produce the same range?", answer: "Because sin(2(90°-θ)) = sin(180°-2θ) = sin(2θ), keeping the range formula value identical.", formula: "R(\\theta) = R(90^\\circ - \\theta)" }
    ]
  },
  {
    id: "bar-magnet-field",
    title: "Bar Magnet: Field Lines & Compass Deflection",
    hindiTitle: "दंड चुंबक: चुंबकीय क्षेत्र रेखाएं और दिक्-सूचक",
    subject: "physics",
    grades: ["Class 6", "Class 7", "Class 8", "Class 10"],
    category: "Magnetism & Field Lines",
    icon: "🧲",
    description: "Map continuous magnetic field lines emerging from North and entering South pole. Orbit a magnetic compass to observe needle deflection along flux tangents.",
    conceptFormula: "\\vec{B} = \\frac{\\mu_0}{4\\pi} \\frac{2\\vec{M}}{r^3}, \\quad \\text{North (N)} \\to \\text{South (S)}",
    color: "from-red-500/20 to-blue-600/10",
    accentColor: "#ef4444",
    defaultParams: {
      magnetStrength: 70,
      compassDistance: 100,
      compassAngle: 45,
      showFilings: 60,
    },
    paramConfigs: [
      { key: "magnetStrength", label: "Magnet Strength (B₀)", min: 20, max: 100, step: 10, unit: "%", description: "Magnetic dipole strength of the permanent bar magnet." },
      { key: "compassDistance", label: "Compass Distance (r)", min: 50, max: 180, step: 10, unit: "px", description: "Distance of the magnetic compass from magnet center." },
      { key: "compassAngle", label: "Compass Orbit Angle (θ)", min: 0, max: 360, step: 15, unit: "deg", description: "Position angle of the test compass around magnet." },
      { key: "showFilings", label: "Iron Filings Density", min: 0, max: 100, step: 20, unit: "%", description: "Scatter density of iron filings revealing flux pattern." },
    ],
    explanation: "Magnetic field lines form continuous closed loops originating from the North pole and terminating at the South pole outside the magnet. The tangent at any point indicates field direction.",
    aim: "To trace magnetic field lines around a bar magnet using iron filings and a magnetic compass.",
    apparatus: ["Bar Magnet", "Magnetic Compass", "Iron Filings Sprinkler", "Drawing Board", "White Sheet", "Brass Pins"],
    procedure: [
      { stepNumber: 1, title: "Fix Bar Magnet", instruction: "Place and trace the outline of the bar magnet on white paper fixed on drawing board." },
      { stepNumber: 2, title: "Position Compass at North Pole", instruction: "Place compass near North pole and mark dots at the two needle tips." },
      { stepNumber: 3, title: "Move Compass Stepwise", instruction: "Shift compass so that South tip sits on the second dot, mark new North dot, and repeat until South pole is reached." },
      { stepNumber: 4, title: "Join Dots into Curves", instruction: "Connect marked dots into smooth continuous curves with directional arrows from North to South." }
    ],
    precautions: [
      "Keep extraneous ferromagnetic articles away from the plotting compass.",
      "Gently tap the cardboard when using iron filings to allow natural orientation along lines of force."
    ],
    vivaQuestions: [
      { question: "Why do two magnetic field lines never intersect?", answer: "If they intersected, a compass placed at the intersection point would point in two different directions simultaneously, which is physically impossible." },
      { question: "Where is the magnetic field of a bar magnet strongest?", answer: "Near the magnetic poles (North and South), where the field lines are most crowded and dense." },
      { question: "What direction do field lines travel inside the bar magnet?", answer: "Inside the magnet, field lines travel from South pole to North pole, forming continuous closed loops." }
    ]
  },
  {
    id: "electromagnet-coil",
    title: "Electromagnet: Coiled Nail & Paperclip Attractor",
    hindiTitle: "विद्युत चुंबक: लोहे की कील, कुंडली और पेपरक्लिप",
    subject: "physics",
    grades: ["Class 7", "Class 8", "Class 10"],
    category: "Magnetic Effects of Electric Current",
    icon: "🔩",
    description: "Wind insulated copper wire around a soft iron nail connected to a DC battery. Toggle switch to observe temporary magnetism lifting iron paperclips.",
    conceptFormula: "B = \\mu_0 \\cdot \\mu_r \\cdot n \\cdot I, \\quad I = \\frac{V}{R}",
    color: "from-amber-500/20 to-red-600/10",
    accentColor: "#f59e0b",
    defaultParams: {
      coilTurns: 40,
      batteryVoltage: 6.0,
      switchState: 1,
      coreType: 1,
    },
    paramConfigs: [
      { key: "coilTurns", label: "Coil Turns (N)", min: 10, max: 100, step: 10, unit: "turns", description: "Number of insulated copper wire loops around nail." },
      { key: "batteryVoltage", label: "Battery Voltage (V)", min: 1.5, max: 12.0, step: 1.5, unit: "V", description: "DC battery potential difference powering the coil." },
      { key: "switchState", label: "Switch State (1:ON, 0:OFF)", min: 0, max: 1, step: 1, unit: "state", description: "Close or open the electric circuit key." },
      { key: "coreType", label: "Core Material (1:Iron, 0:Plastic)", min: 0, max: 1, step: 1, unit: "core", description: "Ferromagnetic soft iron nail vs non-magnetic plastic rod." },
    ],
    explanation: "Electric current flowing through the coiled wire induces a magnetic field. The soft iron core concentrates magnetic flux, becoming a powerful temporary magnet that attracts paperclips.",
    aim: "To construct an electromagnet and investigate how coil turns and electric current affect its magnetic attraction strength.",
    apparatus: ["Large Soft Iron Nail (~8-10 cm)", "Insulated Copper Wire (1-2 m)", "DC Dry Cells / Battery Holder", "Plug Key Switch", "Steel Paperclips", "Ammeter"],
    procedure: [
      { stepNumber: 1, title: "Wind Insulated Wire", instruction: "Wind copper wire tightly around the iron nail in uniform loops leaving 15 cm free wire at both ends." },
      { stepNumber: 2, title: "Connect Circuit", instruction: "Connect free ends to battery and switch. Scrape insulation from wire tips for clean electrical contact." },
      { stepNumber: 3, title: "Close Switch", instruction: "Press the switch ON and bring nail tip near steel paperclips to record how many are lifted." },
      { stepNumber: 4, title: "Vary Turns & Voltage", instruction: "Increase coil turns N and battery voltage V, then observe that magnetic strength increases proportionally." }
    ],
    precautions: [
      "Do not keep switch ON continuously for prolonged periods as the wire heats up and depletes the cell.",
      "Use insulated wire so current flows through loops without short-circuiting across turns."
    ],
    vivaQuestions: [
      { question: "Why is soft iron preferred over steel as the core of an electromagnet?", answer: "Soft iron has high permeability and low retentivity; it magnetizes strongly when current flows and loses magnetism instantly when current is switched off." },
      { question: "Name two ways to increase the strength of an electromagnet.", answer: "1. Increasing the number of turns (N) of the coil, and 2. Increasing the current (I) flowing through it." },
      { question: "Give two everyday applications of electromagnets.", answer: "Electric bells, scrap-metal sorting magnetic cranes, Maglev trains, and MRI scanners." }
    ]
  },
  {
    id: "prism-dispersion",
    title: "Glass Prism: Dispersion & Rainbow Spectrum",
    hindiTitle: "कांच का प्रिज्म: प्रकाश का विक्षेपण और 7 रंग",
    subject: "physics",
    grades: ["Class 7", "Class 8", "Class 10", "Class 12"],
    category: "Light & Optics",
    icon: "🌈",
    description: "Shine white light through an equilateral glass prism to refract and split it into the 7 vibrant colors of the visible spectrum (VIBGYOR).",
    conceptFormula: "\\delta = i + e - A, \\quad \\mu_{\\text{violet}} > \\mu_{\\text{red}} \\implies \\delta_{\\text{violet}} > \\delta_{\\text{red}}",
    color: "from-sky-500/20 to-purple-600/10",
    accentColor: "#38bdf8",
    defaultParams: {
      incidenceAngle: 48,
      prismAngle: 60,
      glassIndex: 1.52,
      lightMode: 1,
    },
    paramConfigs: [
      { key: "incidenceAngle", label: "Angle of Incidence (i)", min: 30, max: 70, step: 2, unit: "°", description: "Angle at which incident ray strikes the first prism surface." },
      { key: "prismAngle", label: "Prism Angle (A)", min: 45, max: 65, step: 5, unit: "°", description: "Angle between the two refracting faces of the prism." },
      { key: "glassIndex", label: "Glass Refractive Index (n)", min: 1.45, max: 1.70, step: 0.02, unit: "ratio", description: "Optical density of the prism glass." },
      { key: "lightMode", label: "Light Source (1:White, 0:Laser)", min: 0, max: 1, step: 1, unit: "mode", description: "Polychromatic white sunlight beam vs monochromatic green laser." },
    ],
    explanation: "White light is a mixture of seven wavelengths. Glass has a higher refractive index for violet than red light, causing violet to bend most and red least, producing dispersion.",
    aim: "To observe the dispersion of white light into seven spectral colors using an equilateral glass prism.",
    apparatus: ["Equilateral Glass Prism (A = 60°)", "Ray Box / Slit Lamp with White Light", "White Viewing Screen", "Drawing Board", "Protractor & Ruler"],
    procedure: [
      { stepNumber: 1, title: "Place Prism on Base", instruction: "Place triangular prism with one refracting face facing the narrow white light beam." },
      { stepNumber: 2, title: "Adjust Angle of Incidence", instruction: "Rotate the incident ray to strike at ~45°-50° to obtain sharp emergent spectrum." },
      { stepNumber: 3, title: "Catch Spectrum on Screen", instruction: "Position white card screen on opposite side to observe colored band: Violet, Indigo, Blue, Green, Yellow, Orange, Red." },
      { stepNumber: 4, title: "Test Monochromatic Laser", instruction: "Switch light mode to Green Laser and observe single refracted ray without dispersion." }
    ],
    precautions: [
      "Carry out the experiment in a semi-darkened room for high-contrast spectrum viewing.",
      "Handle prism by triangular frosted base to avoid smudging optical refracting faces."
    ],
    vivaQuestions: [
      { question: "What is dispersion of light?", answer: "The phenomenon of splitting of white light into its component seven colors when passing through a refracting medium like a prism." },
      { question: "Which color of light bends the most and which bends the least?", answer: "Violet bends the most (highest refractive index / lowest speed), and Red bends the least (longest wavelength / highest speed in glass)." },
      { question: "Who first proved that white sunlight consists of seven colors?", answer: "Sir Isaac Newton in 1666, using a glass prism and a recombination inverted second prism." }
    ]
  },
  {
    id: "friction-surfaces",
    title: "Friction Bench: Surface Roughness & Resistance",
    hindiTitle: "घर्षण बल: सतह की प्रकृति एवं गति प्रतिरोध",
    subject: "physics",
    grades: ["Class 8", "Class 9", "Class 11"],
    category: "Mechanics & Forces",
    icon: "🛹",
    description: "Pull a weighted block across glass, polished wood, sandpaper, and oiled tracks to quantify static/kinetic friction and normal force.",
    conceptFormula: "f_k = \\mu_k \\cdot N, \\quad N = m \\cdot g, \\quad F_{\\text{net}} = F - f_k",
    color: "from-emerald-500/20 to-amber-600/10",
    accentColor: "#10b981",
    defaultParams: {
      surfaceType: 2,
      blockMass: 400,
      pullForce: 3.5,
      motionType: 1,
    },
    paramConfigs: [
      { key: "surfaceType", label: "Surface (1:Glass, 2:Wood, 3:Sandpaper, 4:Oil)", min: 1, max: 4, step: 1, unit: "surface", description: "Texture and material of the horizontal test bench." },
      { key: "blockMass", label: "Block Mass (m)", min: 100, max: 1000, step: 100, unit: "g", description: "Mass of the wooden test block placed on the track." },
      { key: "pullForce", label: "Applied Pull Force (F)", min: 0, max: 12, step: 0.5, unit: "N", description: "Tension force exerted by pulling spring dynamometer." },
      { key: "motionType", label: "Mode (1:Sliding, 0:Rolling)", min: 0, max: 1, step: 1, unit: "mode", description: "Flat sliding contact vs rolling ball bearings." },
    ],
    explanation: "Friction arises from microscopic interlocking irregularities between contact surfaces. Frictional force is directly proportional to normal force and independent of apparent contact area.",
    aim: "To measure the frictional resistance for different contact surfaces and verify that rolling friction is significantly less than sliding friction.",
    apparatus: ["Horizontal Friction Track", "Wooden Block with Hook", "Spring Balance (0-10 N)", "Surfaces: Glass, Wood, Sandpaper", "Lubricating Oil", "Cylindrical Rollers"],
    procedure: [
      { stepNumber: 1, title: "Weigh the Block", instruction: "Record mass m of block and place horizontally on the wooden track." },
      { stepNumber: 2, title: "Pull with Spring Balance", instruction: "Pull horizontally and note maximum reading just before block starts moving (Limiting Static Friction)." },
      { stepNumber: 3, title: "Measure Kinetic Friction", instruction: "Keep block sliding at uniform speed and note the steady balance reading." },
      { stepNumber: 4, title: "Compare with Sandpaper & Rollers", instruction: "Test on sandpaper track (high friction) and on cylindrical rollers (very low rolling friction)." }
    ],
    precautions: [
      "The pull force must be applied strictly horizontal to the test track.",
      "Ensure surfaces are dry and clean before testing each material condition."
    ],
    vivaQuestions: [
      { question: "Why is rolling friction smaller than sliding friction?", answer: "Because during rolling, the area of contact at any instant is minute and surfaces do not have time to deeply interlock microscopically." },
      { question: "How does friction depend on surface area of contact?", answer: "Friction is independent of apparent surface area; it depends only on the normal force (N) and the nature of the contact surfaces (μ)." },
      { question: "Why are lubricants applied to moving parts of machines?", answer: "Lubricants form a thin liquid film that fills microscopic surface irregularities, replacing solid-solid friction with much lower fluid friction." }
    ]
  },
  {
    id: "archimedes-buoyancy",
    title: "Archimedes' Principle: Buoyant Upthrust & Apparent Weight",
    hindiTitle: "आर्किमिडीज का सिद्धांत: उत्प्लावन बल और आभासी भार",
    subject: "physics",
    grades: ["Class 7", "Class 8", "Class 9", "Class 11"],
    category: "Fluid Mechanics & Density",
    icon: "⚖️",
    description: "Lower a solid cylinder into a beaker of liquid. Measure buoyant upthrust force, displaced fluid volume in the overflow cylinder, and apparent weight loss.",
    conceptFormula: "F_b = \\rho_{\\text{fluid}} \\cdot V_{\\text{disp}} \\cdot g, \\quad W_{\\text{apparent}} = W_{\\text{air}} - F_b",
    color: "from-sky-500/20 to-cyan-600/10",
    accentColor: "#0284c7",
    defaultParams: {
      immersionDepth: 60,
      objectMaterial: 1,
      liquidType: 1,
      objectVolume: 100,
    },
    paramConfigs: [
      { key: "immersionDepth", label: "Immersion Depth (h)", min: 0, max: 100, step: 10, unit: "%", description: "Percentage of cylinder submerged in the liquid beaker." },
      { key: "objectMaterial", label: "Object (1:Al, 2:Wood, 3:Iron)", min: 1, max: 3, step: 1, unit: "mat", description: "Density of solid: Wood=0.6, Aluminum=2.7, Iron=7.8 g/cm³." },
      { key: "liquidType", label: "Liquid (1:Water, 2:Salt Brine, 3:Oil)", min: 1, max: 3, step: 1, unit: "liquid", description: "Density of liquid: Oil=0.8, Water=1.0, Saline Brine=1.2 g/cm³." },
      { key: "objectVolume", label: "Object Volume (V)", min: 50, max: 200, step: 25, unit: "cm³", description: "Total geometric volume of the submerged solid cylinder." },
    ],
    explanation: "When an object is wholly or partially immersed in a fluid, it experiences an upward buoyant force equal to the weight of fluid displaced by it.",
    aim: "To verify Archimedes' Principle by comparing apparent loss of weight of a solid in liquid with weight of displaced liquid.",
    apparatus: ["Overflow Can (Eureka Can)", "Measuring Cylinder (100 mL)", "Spring Balance (0-250 g / 0-5 N)", "Solid Metal Cylinder", "Thread", "Water & Salt Solution"],
    procedure: [
      { stepNumber: 1, title: "Weigh in Air", instruction: "Suspend the metal cylinder from the spring balance and record its weight in air (W₁)." },
      { stepNumber: 2, title: "Fill Eureka Can", instruction: "Fill eureka can with water until water overflows from spout; wait until dripping stops." },
      { stepNumber: 3, title: "Immerse Solid", instruction: "Gently lower cylinder into water while collecting displaced water in clean measuring cylinder." },
      { stepNumber: 4, title: "Compare Weight Loss & Overflow", instruction: "Note apparent weight (W₂). Verify that Loss in Weight (W₁ - W₂) equals the weight of overflow water." }
    ],
    precautions: [
      "Do not let the suspended solid touch the bottom or sides of the eureka can.",
      "Ensure no water drops cling to the outside spout before starting immersion."
    ],
    vivaQuestions: [
      { question: "State Archimedes' Principle.", answer: "When a body is immersed fully or partially in a fluid, it experiences an upward buoyant force equal to the weight of the fluid displaced by the body." },
      { question: "Why does an iron nail sink in water while a massive steel ship floats?", answer: "An iron nail displaces less weight of water than its own weight; a hollow steel ship has a large submerged volume that displaces water weighing equal to the entire ship." },
      { question: "Why is buoyant force greater in salty sea water than in fresh river water?", answer: "Salt water has higher density (ρ ≈ 1.03 g/cm³) than fresh water (1.00 g/cm³), and buoyant force F_b = ρ V g increases with fluid density." }
    ]
  },
  {
    id: "rational-number-line",
    title: "Interactive Number Line: Integers & Rational Numbers",
    hindiTitle: "संख्या रेखा: पूर्णांक एवं परिमेय संख्या निरूपण",
    subject: "mathematics",
    grades: ["Class 6", "Class 7", "Class 8"],
    category: "Number Systems",
    icon: "📏",
    description: "Interactive visual number line demonstrating positive/negative integers, fractions, directional jump vectors for addition/subtraction, and absolute distance from zero.",
    conceptFormula: "a + (-b) = a - b, \\quad |x| = \\text{Distance from Origin (0)}",
    color: "from-purple-500/20 to-pink-600/10",
    accentColor: "#8b5cf6",
    defaultParams: {
      startValue: 2,
      jumpStep: -5,
      showFractions: 1,
      operationMode: 1,
    },
    paramConfigs: [
      { key: "startValue", label: "Starting Position (A)", min: -8, max: 8, step: 1, unit: "num", description: "Initial integer point on the number line." },
      { key: "jumpStep", label: "Jump Offset (B)", min: -8, max: 8, step: 1, unit: "num", description: "Value added to or subtracted from starting position." },
      { key: "showFractions", label: "Show Fractions (1:Yes, 0:No)", min: 0, max: 1, step: 1, unit: "flag", description: "Display half and quarter fractional subdivision ticks." },
      { key: "operationMode", label: "Operation (1:A+B, 2:A-B, 3:|A-B|)", min: 1, max: 3, step: 1, unit: "op", description: "Mathematical operation between position vectors." },
    ],
    explanation: "Numbers to the right of 0 are positive; numbers to the left are negative. Adding a positive integer moves to the right, while adding a negative integer moves to the left.",
    aim: "To demonstrate integer and rational number arithmetic using directional vector jumps on a real number line.",
    apparatus: ["Graduated Number Line", "Origin Anchor (0)", "Color-coded Vector Arrows", "Fractional Grid Overlay"],
    procedure: [
      { stepNumber: 1, title: "Locate Starting Point A", instruction: "Place initial marker at integer position A on the line." },
      { stepNumber: 2, title: "Execute Jump B", instruction: "If B > 0, draw an arc jumping B units to the RIGHT. If B < 0, draw arc jumping |B| units to the LEFT." },
      { stepNumber: 3, title: "Read Landing Coordinate", instruction: "The final landing point represents the algebraic sum A + B." },
      { stepNumber: 4, title: "Toggle Half-Ticks", instruction: "Enable fraction mode to visualize rational numbers between consecutive integers." }
    ],
    precautions: [
      "Always measure direction relative to zero or starting point (Right = +, Left = -).",
      "Subtracting a negative number is equivalent to adding its positive counterpart: a - (-b) = a + b."
    ],
    vivaQuestions: [
      { question: "What is the additive inverse of a rational number a/b?", answer: "The additive inverse is -a/b, such that (a/b) + (-a/b) = 0." },
      { question: "What does the absolute value |x| represent geometrically?", answer: "The non-negative distance of the point x from the origin (0) along the number line." },
      { question: "How many rational numbers exist between any two integers?", answer: "Infinitely many rational numbers (Density Property of Rational Numbers)." }
    ]
  },
  {
    id: "bohr-atomic-model",
    title: "Bohr's Atomic Model & Electron Shells",
    hindiTitle: "बोहर का परमाणु मॉडल एवं इलेक्ट्रॉनिक विन्यास",
    subject: "chemistry",
    grades: ["Class 8", "Class 9", "Class 10", "Class 11"],
    category: "Atomic Structure",
    icon: "⚛️",
    description: "Explore atomic orbitals (K, L, M, N), electron configuration (2n² rule), and photon excitation/emission spectra across elements from Hydrogen (Z=1) to Calcium (Z=20).",
    conceptFormula: "2n^2 \\quad (K=2, L=8, M=18), \\quad r_n = 0.529 \\frac{n^2}{Z} \\text{ Å}, \\quad E_n = -13.6 \\frac{Z^2}{n^2} \\text{ eV}",
    color: "from-cyan-500/20 to-blue-600/10",
    accentColor: "#06b6d4",
    defaultParams: {
      atomicNumber: 6,
      excitationLevel: 1,
      orbitSpeed: 1.0,
    },
    paramConfigs: [
      { key: "atomicNumber", label: "Atomic Number (Z)", min: 1, max: 20, step: 1, unit: "Z", description: "Element selection: 1=H, 2=He, 6=C, 8=O, 11=Na, 17=Cl, 20=Ca." },
      { key: "excitationLevel", label: "Energy Excitation (n)", min: 1, max: 4, step: 1, unit: "n", description: "Promote outer electron to higher energy quantum shell (n=1 to n=4)." },
      { key: "orbitSpeed", label: "Orbit Speed Rate", min: 0.5, max: 2.5, step: 0.5, unit: "x", description: "Animation speed multiplier for orbiting electrons." },
    ],
    explanation: "Electrons revolve around the dense central nucleus in discrete stationary non-radiating circular orbits. Shell filling obeys the Bohr-Bury 2n² rule, with an octet rule limiting outer valence shells to 8 electrons.",
    aim: "To demonstrate the Bohr model of atom, atomic orbitals K, L, M, N, electronic configuration of the first 20 elements, and quantum transitions.",
    apparatus: ["Bohr Orbit Simulator", "Nucleus Charge Indicator (+Ze)", "Multi-shell Electron Emitter", "Emission Spectrometer Model"],
    procedure: [
      { stepNumber: 1, title: "Select Element by Z", instruction: "Adjust Atomic Number Z from 1 (Hydrogen) to 20 (Calcium) and observe shell filling." },
      { stepNumber: 2, title: "Count Shell Distribution", instruction: "Verify electron distribution: K shell (up to 2), L shell (up to 8), M shell (up to 8/18)." },
      { stepNumber: 3, title: "Promote Valence Electron", instruction: "Increase excitation level n and observe quantum jump to higher orbital with photon absorption." },
      { stepNumber: 4, title: "Observe Emission Wave", instruction: "Observe photon emission when electron de-excites back to ground state." }
    ],
    precautions: [
      "Maximum capacity of any shell is 2n², but outermost valence shell cannot exceed 8 electrons (Octet Rule).",
      "Electrons in stationary orbits do not radiate electromagnetic energy until a quantum transition occurs."
    ],
    vivaQuestions: [
      { question: "State the Bohr-Bury rule for maximum electrons in a shell.", answer: "The maximum number of electrons in orbit n is given by 2n² (K=2, L=8, M=18, N=32).", formula: "N_{\\max} = 2n^2" },
      { question: "What is the condition for quantization of angular momentum in Bohr atom?", answer: "Angular momentum must be an integral multiple of h / (2π).", formula: "m v r = \\frac{n h}{2\\pi}" },
      { question: "Why does Calcium (Z=20) have configuration 2, 8, 8, 2 instead of 2, 8, 10?", answer: "Because the outermost shell cannot hold more than 8 electrons, so the 4s orbital fills before 3d completes (Aufbau & Octet rule)." }
    ]
  },
  {
    id: "reaction-kinetics",
    title: "Chemical Kinetics & Collision Theory",
    hindiTitle: "रासायनिक अभिक्रिया दर एवं संघट्ट सिद्धांत",
    subject: "chemistry",
    grades: ["Class 10", "Class 11", "Class 12"],
    category: "Chemical Kinetics",
    icon: "💥",
    description: "Witness molecular collision dynamics in real-time. Adjust temperature, reactant concentration, and catalyst to see effective collisions, activation energy barrier, and product formation.",
    conceptFormula: "k = A e^{-\\frac{E_a}{RT}}, \\quad \\text{Rate} = k [A]^m [B]^n, \\quad t_{1/2} = \\frac{0.693}{k}",
    color: "from-amber-500/20 to-orange-600/10",
    accentColor: "#f97316",
    defaultParams: {
      temperature: 300,
      concentration: 1.5,
      catalyst: 0,
      activationEnergy: 55,
    },
    paramConfigs: [
      { key: "temperature", label: "Temperature (T)", min: 273, max: 423, step: 10, unit: "K", description: "Absolute temperature of reaction vessel." },
      { key: "concentration", label: "Reactant Conc. [A]", min: 0.5, max: 3.0, step: 0.25, unit: "M", description: "Initial concentration of reacting molecules." },
      { key: "catalyst", label: "Catalyst (1:Present, 0:None)", min: 0, max: 1, step: 1, unit: "state", description: "Add positive catalyst to lower activation energy barrier Ea." },
      { key: "activationEnergy", label: "Activation Energy (Eₐ)", min: 30, max: 90, step: 5, unit: "kJ/mol", description: "Energy threshold required for fruitful collisions." },
    ],
    explanation: "According to Collision Theory, for a reaction to occur, reactant molecules must collide with sufficient kinetic energy (≥ Activation Energy Ea) and proper steric orientation.",
    aim: "To study the effect of concentration, temperature, and catalyst on the rate of a chemical reaction using collision theory.",
    apparatus: ["Reaction Chamber Visualizer", "Thermostatic Heat Bath", "Concentration Dispenser", "Catalyst Addition Well", "Potential Energy Diagram"],
    procedure: [
      { stepNumber: 1, title: "Set Baseline Temperature", instruction: "Maintain chamber at T = 300 K (room temperature) and note collision frequency." },
      { stepNumber: 2, title: "Increase Temperature", instruction: "Raise temperature to 350-400 K and note how particle velocity and effective collision fraction increase." },
      { stepNumber: 3, title: "Introduce Catalyst", instruction: "Switch catalyst ON to lower activation energy Ea and observe immediate surge in product formation." },
      { stepNumber: 4, title: "Vary Concentration", instruction: "Increase reactant molarity to see higher collision density per unit volume." }
    ],
    precautions: [
      "Ensure temperature is converted to Kelvin (K = °C + 273.15) for all Arrhenius calculations.",
      "Catalyst lowers Ea for both forward and reverse paths equally without changing ΔH or equilibrium position."
    ],
    vivaQuestions: [
      { question: "What is Activation Energy (Ea)?", answer: "The minimum excess energy above ground state that reactant molecules must acquire to form the activated transition complex.", formula: "E_a = E_{\\text{threshold}} - E_{\\text{reactants}}" },
      { question: "What is the temperature coefficient of a reaction?", answer: "The ratio of rate constants at two temperatures differing by 10°C, typically equal to ~2 to 3.", formula: "\\text{Temp. Coeff.} = \\frac{k_{T+10}}{k_T} \\approx 2" },
      { question: "Does a catalyst affect the enthalpy change (ΔH) of a reaction?", answer: "No, a catalyst only provides an alternate pathway with lower activation energy; it does not change initial and final enthalpy states." }
    ]
  },
  {
    id: "human-heart-circulation",
    title: "Human Heart & Double Blood Circulation",
    hindiTitle: "मानव हृदय एवं दोहरा रक्त परिसंचरण",
    subject: "biology",
    grades: ["Class 7", "Class 8", "Class 9", "Class 10", "Class 11"],
    category: "Human Physiology & Circulation",
    icon: "🫀",
    description: "Interactive 4-chamber human heart with synchronized atrial/ventricular pumping, tricuspid/bicuspid valve leaflets, pulmonary and systemic double loops, and live ECG monitor.",
    conceptFormula: "\\text{Cardiac Output} = \\text{Stroke Volume} \\times \\text{Heart Rate} = 70\\text{ mL} \\times \\text{HR}, \\quad \\text{BP} = \\frac{120}{80} \\text{ mmHg}",
    color: "from-rose-500/20 to-red-600/10",
    accentColor: "#ef4444",
    defaultParams: {
      heartRate: 72,
      exerciseLevel: 1,
      vascularResistance: 100,
    },
    paramConfigs: [
      { key: "heartRate", label: "Heart Rate (BPM)", min: 50, max: 160, step: 2, unit: "BPM", description: "Beats per minute regulated by SA node." },
      { key: "exerciseLevel", label: "Activity (1:Rest, 2:Jog, 3:Sprint)", min: 1, max: 3, step: 1, unit: "level", description: "Physical exercise exertion level." },
      { key: "vascularResistance", label: "Vascular Resistance", min: 80, max: 140, step: 5, unit: "%", description: "Peripheral resistance affecting systolic/diastolic blood pressure." },
    ],
    explanation: "The human heart possesses four chambers: right atrium/ventricle for deoxygenated blood to the lungs (pulmonary circuit), and left atrium/ventricle for oxygenated blood to body organs (systemic circuit).",
    aim: "To demonstrate the structure of the human heart, double circulation pathways, cardiac cycle phases (systole & diastole), and heart rate regulation.",
    apparatus: ["Anatomical 4-Chamber Heart Model", "Pulmonary & Systemic Loop Manifold", "ECG Cardiac Monitor", "Sphygmomanometer Pressure Gauge"],
    procedure: [
      { stepNumber: 1, title: "Trace Deoxygenated Path", instruction: "Observe Vena Cava -> Right Atrium -> Tricuspid Valve -> Right Ventricle -> Pulmonary Artery to Lungs." },
      { stepNumber: 2, title: "Trace Oxygenated Path", instruction: "Observe Pulmonary Vein -> Left Atrium -> Bicuspid Valve -> Left Ventricle -> Aorta to Body Tissues." },
      { stepNumber: 3, title: "Adjust Heart Rate (BPM)", instruction: "Increase heart rate and observe synchronized rhythm of atrial/ventricular contraction and valve snap." },
      { stepNumber: 4, title: "Inspect ECG Waveform", instruction: "Correlate P-wave (atrial depolarization), QRS complex (ventricular depolarization), and T-wave." }
    ],
    precautions: [
      "Remember that Pulmonary Artery carries deoxygenated blood and Pulmonary Vein carries oxygenated blood.",
      "Left ventricular myocardial wall is significantly thicker than the right due to high systemic pressure demands."
    ],
    vivaQuestions: [
      { question: "Why is human circulation described as 'Double Circulation'?", answer: "Because blood passes through the heart twice during each complete circuit of the body: once via Pulmonary loop and once via Systemic loop." },
      { question: "Which node is the natural pacemaker of the heart?", answer: "The Sinoatrial (SA) node located in the upper right wall of the right atrium, which spontaneously generates electrical action potentials." },
      { question: "What causes the 'LUB-DUB' heart sounds?", answer: "LUB is caused by closure of Atrioventricular (Tricuspid & Bicuspid) valves during ventricular systole; DUB is caused by closure of Semilunar valves at onset of diastole." }
    ]
  },
  {
    id: "osmosis-plasmolysis",
    title: "Osmosis, Turgor Pressure & Plasmolysis",
    hindiTitle: "परासरण, स्फीति दाब एवं जीवद्रव्यकुंचन (Plasmolysis)",
    subject: "biology",
    grades: ["Class 8", "Class 9", "Class 10", "Class 11"],
    category: "Cell Biology & Transport",
    icon: "🔬",
    description: "Investigate selective permeability, endosmosis, exosmosis, and plasmolysis. Compare plant cells (with rigid cellulose wall) against animal red blood cells (RBCs) across varying salinity.",
    conceptFormula: "\\Psi_w = \\Psi_s + \\Psi_p, \\quad \\text{Net Water Flow: High } \\Psi_w \\to \\text{Low } \\Psi_w",
    color: "from-emerald-500/20 to-teal-600/10",
    accentColor: "#10b981",
    defaultParams: {
      soluteConcentration: 0.9,
      cellType: 1,
      elapsedTime: 5,
    },
    paramConfigs: [
      { key: "soluteConcentration", label: "External Solute (NaCl %)", min: 0, max: 10, step: 0.5, unit: "%", description: "Salinity of beaker solution (0%=Hypotonic, 0.9%=Isotonic, >2%=Hypertonic)." },
      { key: "cellType", label: "Cell Model (1:Plant, 2:Animal RBC)", min: 1, max: 2, step: 1, unit: "type", description: "1 = Onion Peel Plant Cell (rigid wall), 2 = Animal RBC (no cell wall)." },
      { key: "elapsedTime", label: "Incubation Time (mins)", min: 1, max: 20, step: 1, unit: "min", description: "Exposure duration to osmotic environment." },
    ],
    explanation: "Osmosis is the spontaneous net movement of water molecules through a semi-permeable membrane from a region of higher water potential (dilute) to lower water potential (concentrated).",
    aim: "To demonstrate osmosis, turgidity, flaccidity, and plasmolysis in plant and animal cells under hypotonic, isotonic, and hypertonic solutions.",
    apparatus: ["Compound Optical Microscope", "Onion Peel / Rheo Leaf Epidermal Mount", "Red Blood Cell Suspension", "Sodium Chloride (NaCl) Solutions (0%, 0.9%, 5%, 10%)"],
    procedure: [
      { stepNumber: 1, title: "Mount Cell in Hypotonic Medium", instruction: "Set NaCl to 0% (pure water). Observe endosmosis: plant cell swells to turgidity; RBC swells and hemolyses (bursts)." },
      { stepNumber: 2, title: "Mount Cell in Isotonic Medium", instruction: "Set NaCl to 0.9% physiological saline. Observe dynamic equilibrium with no net volume change." },
      { stepNumber: 3, title: "Mount Cell in Hypertonic Medium", instruction: "Set NaCl to 5-10%. Observe exosmosis: plant cell undergoes plasmolysis as protoplast shrinks away from cell wall; RBC crenates." },
      { stepNumber: 4, title: "Test Deplasmolysis", instruction: "Return salt concentration back to 0% to witness deplasmolysis as water re-enters the plant vacuole." }
    ],
    precautions: [
      "Ensure slides are kept moist during microscope observation to prevent uncalibrated evaporation.",
      "Notice that plant cell does not burst in pure water because rigid cellulose wall exerts opposing Wall Pressure (Turgor Pressure)."
    ],
    vivaQuestions: [
      { question: "What is Plasmolysis?", answer: "The shrinkage of the protoplast away from the cellulose cell wall of a plant cell when placed in a hypertonic solution due to exosmosis of water from the central vacuole." },
      { question: "Why do red blood cells burst in pure water while plant cells do not?", answer: "RBCs lack a rigid cell wall, so excessive endosmotic water intake ruptures the fragile plasma membrane (lysis); plant cells have a rigid cellulose wall that withstands high turgor pressure." },
      { question: "What is the relation between Water Potential (Ψw), Solute Potential (Ψs), and Pressure Potential (Ψp)?", answer: "Water potential is the sum of solute potential (always negative) and pressure potential.", formula: "\\Psi_w = \\Psi_s + \\Psi_p" }
    ]
  },
  {
    id: "quadratic-parabola",
    title: "Quadratic Functions & Parabola Geometry",
    hindiTitle: "द्विघात फलन एवं परवलय (Parabola) ज्यामिति",
    subject: "mathematics",
    grades: ["Class 9", "Class 10", "Class 11"],
    category: "Algebra & Coordinate Geometry",
    icon: "📈",
    description: "Explore the parabola y = ax² + bx + c in Cartesian coordinates. Investigate vertex coordinates, axis of symmetry, focus, directrix, and how discriminant D = b² - 4ac governs real/equal/complex roots.",
    conceptFormula: "y = ax^2 + bx + c, \\quad D = b^2 - 4ac, \\quad (h, k) = \\left(-\\frac{b}{2a}, -\\frac{D}{4a}\\right)",
    color: "from-indigo-500/20 to-pink-600/10",
    accentColor: "#6366f1",
    defaultParams: {
      coeffA: 1,
      coeffB: -2,
      coeffC: -3,
    },
    paramConfigs: [
      { key: "coeffA", label: "Leading Coeff (a)", min: -3, max: 3, step: 0.25, unit: "coeff", description: "Curvature & vertical orientation (a>0 opens UP, a<0 opens DOWN)." },
      { key: "coeffB", label: "Linear Coeff (b)", min: -6, max: 6, step: 0.5, unit: "coeff", description: "Shifts vertex horizontally and alters tangent slope at y-intercept." },
      { key: "coeffC", label: "Constant Term (c)", min: -6, max: 6, step: 0.5, unit: "coeff", description: "y-intercept coordinate where curve intersects vertical axis (0, c)." },
    ],
    explanation: "A quadratic function produces a symmetric U-shaped curve called a parabola. The vertex represents the absolute extreme point (minimum when a > 0, maximum when a < 0). The discriminant D determines real roots.",
    aim: "To demonstrate the geometric and algebraic properties of quadratic functions y = ax² + bx + c, vertex coordinates, and discriminant root classifications on the Cartesian plane.",
    apparatus: ["Cartesian Coordinate Grid", "Dynamic Parabola Plotter", "Vertex & Axis Indicator", "Discriminant Root Analyzer"],
    procedure: [
      { stepNumber: 1, title: "Vary Coefficient 'a'", instruction: "Toggle 'a' between positive and negative values. Observe inversion of concavity (open upward vs downward)." },
      { stepNumber: 2, title: "Locate Vertex (h, k)", instruction: "Read the minimum/maximum turning point coordinates computed as (-b/2a, -D/4a)." },
      { stepNumber: 3, title: "Analyze Discriminant D", instruction: "Check D = b² - 4ac: note 2 distinct x-intercepts when D > 0, 1 tangent root when D = 0, and zero real roots when D < 0." },
      { stepNumber: 4, title: "Shift Constant 'c'", instruction: "Adjust 'c' to translate the entire parabolic curve strictly along the vertical y-axis without altering curvature." }
    ],
    precautions: [
      "If a = 0, the equation reduces to a straight line y = bx + c and ceases to be quadratic.",
      "The axis of symmetry is always the vertical line x = -b / (2a) passing directly through the vertex."
    ],
    vivaQuestions: [
      { question: "What is the physical meaning of the vertex of a parabola?", answer: "The vertex is the extreme turning point of the curve, representing the global minimum value if a > 0 or the global maximum value if a < 0.", formula: "x_v = -\\frac{b}{2a}, \\quad y_v = c - \\frac{b^2}{4a}" },
      { question: "How does the discriminant D determine the nature of roots geometrically?", answer: "D > 0 means the parabola intersects the x-axis at two distinct points; D = 0 means it touches the x-axis tangentially at one point; D < 0 means it never intersects the x-axis." },
      { question: "Why do projectile trajectories follow parabolic arcs?", answer: "Because under uniform gravitational acceleration g, vertical displacement is quadratic with time: y(t) = v_{0y}t - 0.5gt², while horizontal velocity is constant: x(t) = v_{0x}t." }
    ]
  },
  {
    id: "pythagoras-theorem",
    title: "Pythagoras Theorem & Geometric Proof",
    hindiTitle: "पाइथागोरस प्रमेय (बोधायन प्रमेय) एवं ज्यामितीय प्रमाण",
    subject: "mathematics",
    grades: ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"],
    category: "Geometry & Trigonometry",
    icon: "📐",
    description: "Visually prove that the area of the square constructed on the hypotenuse equals the sum of areas of squares on base and perpendicular legs (a² + b² = c²) with unit grid tiles.",
    conceptFormula: "a^2 + b^2 = c^2, \\quad c = \\sqrt{a^2 + b^2}, \\quad \\text{Area}(A) + \\text{Area}(B) = \\text{Area}(C)",
    color: "from-blue-500/20 to-emerald-600/10",
    accentColor: "#3b82f6",
    defaultParams: {
      sideA: 6,
      sideB: 8,
      dissectProof: 1,
    },
    paramConfigs: [
      { key: "sideA", label: "Base Leg (a)", min: 3, max: 12, step: 1, unit: "units", description: "Horizontal base leg length of the right triangle." },
      { key: "sideB", label: "Perpendicular Leg (b)", min: 3, max: 12, step: 1, unit: "units", description: "Vertical altitude leg length of the right triangle." },
      { key: "dissectProof", label: "Proof Mode (1:Tiles, 2:Flow)", min: 1, max: 2, step: 1, unit: "mode", description: "1 = Discrete square grid unit tiles, 2 = Continuous area conservation flow." },
    ],
    explanation: "In any right-angled Euclidean triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides. This geometric identity underpins all Cartesian distance metrics and trigonometry.",
    aim: "To demonstrate and visually verify Pythagoras theorem (a² + b² = c²) using geometric square constructions and unit tile counting.",
    apparatus: ["Right-Angled Triangle Canvas", "Square Construction Overlay (a², b², c²)", "Unit Grid Tile Counter", "Dynamic Pythagorean Triplet Engine"],
    procedure: [
      { stepNumber: 1, title: "Construct Right Triangle", instruction: "Set base leg 'a' and perpendicular leg 'b' at 90° right angle." },
      { stepNumber: 2, title: "Inspect Base Square a²", instruction: "Count unit squares on base leg: Area = a × a." },
      { stepNumber: 3, title: "Inspect Altitude Square b²", instruction: "Count unit squares on vertical leg: Area = b × b." },
      { stepNumber: 4, title: "Verify Hypotenuse Square c²", instruction: "Confirm that Area(c²) = a² + b² by comparing total unit tile counts and computing c = √(a² + b²)." }
    ],
    precautions: [
      "The Pythagorean theorem is strictly valid ONLY for right-angled triangles (angle = 90°) in flat Euclidean space.",
      "Ensure hypotenuse is always identified as the longest side directly opposite the 90° right angle."
    ],
    vivaQuestions: [
      { question: "State Pythagoras Theorem in words.", answer: "In a right-angled triangle, the area of the square whose side is the hypotenuse is equal to the sum of the areas of the squares on the other two legs.", formula: "a^2 + b^2 = c^2" },
      { question: "What is a Pythagorean Triplet?", answer: "A set of three positive integers (a, b, c) that satisfy the condition a² + b² = c² (e.g., 3-4-5, 5-12-13, 6-8-10, 8-15-17)." },
      { question: "What is the historical Indian origin of this theorem?", answer: "Baudhayana formulated this rule centuries before Pythagoras in the Baudhayana Sulba Sutras (circa 800 BCE) for constructing geometric Vedic altars." }
    ]
  },
  {
    id: "normal-distribution",
    title: "Normal (Gaussian) Distribution & 68-95-99.7 Rule",
    hindiTitle: "प्रसामान्य (गॉसियन) बंटन एवं 68-95-99.7 नियम",
    subject: "mathematics",
    grades: ["Class 10", "Class 11", "Class 12"],
    category: "Probability & Statistics",
    icon: "📊",
    description: "Interactive continuous probability density function (PDF) Bell Curve. Control mean μ, standard deviation σ, and visualize the empirical 68-95-99.7% confidence intervals with live sample generation.",
    conceptFormula: "f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}, \\quad z = \\frac{x - \\mu}{\\sigma}, \\quad \\int_{-\\infty}^\\infty f(x) dx = 1",
    color: "from-cyan-500/20 to-indigo-600/10",
    accentColor: "#0284c7",
    defaultParams: {
      mean: 0,
      stdDev: 1.5,
      sampleSize: 400,
      shadeInterval: 1,
    },
    paramConfigs: [
      { key: "mean", label: "Mean Center (μ)", min: -10, max: 10, step: 1, unit: "μ", description: "Arithmetic average / center axis of symmetry of the bell curve." },
      { key: "stdDev", label: "Std Deviation (σ)", min: 0.5, max: 4.0, step: 0.25, unit: "σ", description: "Spread measure: smaller σ creates tall narrow peak; larger σ flattens curve." },
      { key: "sampleSize", label: "Sample Points (N)", min: 100, max: 1000, step: 100, unit: "pts", description: "Number of random stochastic data points drawn from N(μ, σ²)." },
      { key: "shadeInterval", label: "Shade Interval (1:1σ, 2:2σ, 3:3σ)", min: 1, max: 3, step: 1, unit: "rule", description: "1 = μ±1σ (68.3%), 2 = μ±2σ (95.4%), 3 = μ±3σ (99.7%)." },
    ],
    explanation: "The normal distribution is a continuous symmetric probability distribution shaped like a bell curve. It is the foundation of inferential statistics and the Central Limit Theorem.",
    aim: "To demonstrate the Gaussian normal distribution curve, effect of mean μ and standard deviation σ, and the empirical 68-95-99.7% rule.",
    apparatus: ["Gaussian Probability Density Function Generator", "Cartesian Curve Canvas", "Standard Deviation Interval Shader", "Stochastic Data Scatter Overlay"],
    procedure: [
      { stepNumber: 1, title: "Adjust Mean (μ)", instruction: "Shift μ left and right. Observe horizontal translation of the bell curve without altering its shape." },
      { stepNumber: 2, title: "Adjust Standard Deviation (σ)", instruction: "Increase σ and notice how the curve widens and flattens while preserving a total integral area of 1.0." },
      { stepNumber: 3, title: "Verify 1σ Confidence Interval", instruction: "Set interval to 1σ and observe that 68.27% of all data points fall within [μ - σ, μ + σ]." },
      { stepNumber: 4, title: "Verify 2σ and 3σ Intervals", instruction: "Expand to 2σ (95.45%) and 3σ (99.73%) to confirm the empirical three-sigma statistical rule." }
    ],
    precautions: [
      "Total area under the normal curve is mathematically strictly equal to 1 (100% total probability).",
      "Standard deviation σ must always be strictly positive (σ > 0); standard normal distribution has μ = 0 and σ = 1."
    ],
    vivaQuestions: [
      { question: "State the Empirical 68-95-99.7 Rule for a normal distribution.", answer: "Approximately 68.27% of data lies within 1 standard deviation of the mean (μ ± σ), 95.45% lies within 2 standard deviations (μ ± 2σ), and 99.73% lies within 3 standard deviations (μ ± 3σ)." },
      { question: "What is a Z-score and how is it calculated?", answer: "A Z-score measures how many standard deviations an observation x is from the population mean μ: Z = (x - μ) / σ.", formula: "Z = \\frac{x - \\mu}{\\sigma}" },
      { question: "What is the Central Limit Theorem?", answer: "The Central Limit Theorem states that the distribution of sample means approximates a normal distribution as sample size increases, regardless of the underlying population distribution." }
    ]
  },
  {
    id: "faraday-induction",
    title: "Faraday's Law & Electromagnetic Induction",
    hindiTitle: "फैराडे का विद्युत चुम्बकीय प्रेरण नियम एवं लेन्ज़ का नियम",
    subject: "physics",
    grades: ["Class 10", "Class 11", "Class 12"],
    category: "Electromagnetism",
    icon: "🧲",
    description: "Move a bar magnet through a multi-turn solenoid coil to generate electricity. Visualize magnetic flux lines, induced EMF on a center-zero galvanometer, Lenz's law, and incandescent bulb glow.",
    conceptFormula: "\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}, \\quad \\Phi_B = B A \\cos\\theta, \\quad I = \\frac{\\mathcal{E}}{R}",
    color: "from-red-500/20 to-blue-600/10",
    accentColor: "#ef4444",
    defaultParams: {
      magnetPos: -60,
      coilTurns: 3,
      magnetSpeed: 2,
      magnetPolarity: 1,
    },
    paramConfigs: [
      { key: "magnetPos", label: "Magnet Position (X)", min: -100, max: 100, step: 5, unit: "mm", description: "Position of bar magnet along central axis relative to coil center." },
      { key: "coilTurns", label: "Coil Turns (N)", min: 1, max: 4, step: 1, unit: "turns", description: "Number of helical copper loops in the pickup solenoid." },
      { key: "magnetSpeed", label: "Oscillation Speed (v)", min: 0, max: 5, step: 0.5, unit: "m/s", description: "Speed of magnet translation driving the rate of flux change dΦ/dt." },
      { key: "magnetPolarity", label: "Magnet Polarity (1:N-S, -1:S-N)", min: -1, max: 1, step: 2, unit: "dir", description: "+1 = North pole enters first, -1 = South pole enters first." },
    ],
    explanation: "Whenever magnetic flux threading a closed conducting loop changes, an electromotive force (EMF) is induced. By Lenz's law, the induced current creates an opposing magnetic field resisting the magnet's motion.",
    aim: "To demonstrate Faraday's law of electromagnetic induction, induced EMF dependence on coil turns and magnet speed, and Lenz's law directionality.",
    apparatus: ["Cylindrical Bar Magnet", "Multi-turn Copper Solenoid", "Center-Zero Sensitive Galvanometer", "Miniature Incandescent Load Bulb"],
    procedure: [
      { stepNumber: 1, title: "Approach North Pole", instruction: "Move North pole into coil: observe galvanometer needle deflect to the right and bulb illuminate." },
      { stepNumber: 2, title: "Hold Magnet Stationary", instruction: "Stop magnet inside coil: observe dΦ/dt = 0, needle drops back to exactly zero center." },
      { stepNumber: 3, title: "Withdraw Magnet", instruction: "Pull magnet back out: needle deflects in the opposite direction (Lenz's Law opposing flux decrease)." },
      { stepNumber: 4, title: "Vary Number of Turns (N)", instruction: "Increase turns from 1 to 4: verify induced EMF is directly proportional to loop count N." }
    ],
    precautions: [
      "No EMF is induced if the magnet is stationary relative to the coil, regardless of field strength.",
      "Lenz's law is a direct consequence of the Law of Conservation of Energy."
    ],
    vivaQuestions: [
      { question: "State Faraday's First and Second Laws of Electromagnetic Induction.", answer: "First Law: Whenever magnetic flux linked with a circuit changes, an EMF is induced. Second Law: The magnitude of induced EMF is directly proportional to the time rate of change of magnetic flux.", formula: "\\mathcal{E} = -N \\frac{d\\Phi}{dt}" },
      { question: "What does the negative sign in Faraday's formula signify?", answer: "The negative sign represents Lenz's Law: the polarity of the induced EMF is such that it produces a current whose magnetic field opposes the change in flux producing it." },
      { question: "What factors increase the induced EMF in a generator coil?", answer: "Increasing the number of turns N, using a stronger magnetic field B, increasing the coil cross-sectional area A, and rotating the coil at higher angular speed ω." }
    ]
  },
  {
    id: "photoelectric-effect",
    title: "Einstein's Photoelectric Effect & Stopping Potential",
    hindiTitle: "आइंस्टीन का प्रकाश-विद्युत प्रभाव एवं निरोधी विभव (Stopping Potential)",
    subject: "physics",
    grades: ["Class 11", "Class 12"],
    category: "Modern Physics & Quantum Mechanics",
    icon: "⚡",
    description: "Shine monochromatic light onto a metal plate in a vacuum quartz phototube. Adjust wavelength λ, intensity, and retarding potential V to measure threshold frequency and stopping potential V₀.",
    conceptFormula: "K_{\\max} = h\\nu - \\Phi_0 = e V_0, \\quad E = \\frac{hc}{\\lambda}, \\quad \\nu_0 = \\frac{\\Phi_0}{h}",
    color: "from-purple-500/20 to-cyan-600/10",
    accentColor: "#a855f7",
    defaultParams: {
      wavelength: 380,
      intensity: 60,
      stoppingVoltage: 0.0,
      targetMetal: 2,
    },
    paramConfigs: [
      { key: "wavelength", label: "Wavelength (λ)", min: 200, max: 750, step: 10, unit: "nm", description: "Wavelength of incident photon beam (UV to visible spectrum)." },
      { key: "intensity", label: "Intensity (Flux)", min: 10, max: 100, step: 10, unit: "%", description: "Photon emission rate per second (governs photocurrent saturation level)." },
      { key: "stoppingVoltage", label: "Applied Voltage (V)", min: -4.0, max: 4.0, step: 0.2, unit: "V", description: "Retarding/accelerating potential difference between emitter and collector." },
      { key: "targetMetal", label: "Target Metal (1:Cs, 2:Na, 3:Zn, 4:Cu)", min: 1, max: 4, step: 1, unit: "metal", description: "Target cathode material work function Φ₀: Cs(2.14eV), Na(2.75eV), Zn(4.31eV), Cu(4.70eV)." },
    ],
    explanation: "Photoelectric emission occurs instantaneously when photons with energy greater than the metal's work function (hν > Φ₀) strike its surface. Increasing intensity increases electron count, while photon frequency alone dictates maximum kinetic energy.",
    aim: "To demonstrate Einstein's photoelectric effect, determine threshold frequency ν₀ and work function Φ₀, and measure stopping potential V₀.",
    apparatus: ["Evacuated Quartz Phototube", "Monochromatic Tunable Light Source", "Emitter Cathode & Collector Anode", "Variable DC Retarding Power Supply & Microammeter"],
    procedure: [
      { stepNumber: 1, title: "Select Target Metal", instruction: "Choose Sodium (Na, Φ₀ = 2.75 eV) or Cesium (Cs, Φ₀ = 2.14 eV)." },
      { stepNumber: 2, title: "Test Threshold Wavelength", instruction: "Shine Red light (650 nm, E = 1.91 eV): note zero photocurrent because photon energy E < Φ₀." },
      { stepNumber: 3, title: "Excite Photoelectrons with UV/Violet", instruction: "Decrease wavelength below 450 nm: observe instantaneous ejection of photoelectrons crossing to anode." },
      { stepNumber: 4, title: "Measure Stopping Potential V₀", instruction: "Apply negative retarding voltage until photocurrent drops precisely to zero: V₀ = (hν - Φ₀)/e." }
    ],
    precautions: [
      "Light intensity changes only the photocurrent (number of electrons), NEVER the stopping potential or kinetic energy.",
      "Emission is instantaneous (< 10⁻⁹ s), proving the particulate/quantum nature of light over classical wave theory."
    ],
    vivaQuestions: [
      { question: "What is Work Function (Φ₀)?", answer: "The minimum energy required by an electron to escape the surface of a metal without any kinetic energy.", formula: "\\Phi_0 = h\\nu_0 = \\frac{hc}{\\lambda_0}" },
      { question: "Why could classical wave theory not explain the photoelectric effect?", answer: "Wave theory predicted that high enough intensity would eventually emit electrons and that there should be a measurable time lag, which contradicts quantum observations." },
      { question: "What is Stopping Potential (V₀)?", answer: "The minimum negative retarding potential applied to the collector anode at which the fastest photoelectrons are turned back and the photocurrent becomes zero.", formula: "e V_0 = K_{\\max} = h\\nu - \\Phi_0" }
    ]
  },
  {
    id: "water-electrolysis",
    title: "Electrolysis of Water & Hofmann Voltameter",
    hindiTitle: "जल का विद्युत अपघटन (Hofmann Voltameter) एवं 2:1 गैस अनुपात",
    subject: "chemistry",
    grades: ["Class 9", "Class 10", "Class 11"],
    category: "Electrochemistry & Chemical Reactions",
    icon: "🧪",
    description: "Decompose acidified water into hydrogen and oxygen using a Hofmann voltameter. Measure the strict 2:1 volume ratio, observe cathode/anode effervescence, and conduct hydrogen pop sound and oxygen glowing splint tests.",
    conceptFormula: "2\\text{H}_2\\text{O}(l) \\xrightarrow{\\text{DC Electricity}} 2\\text{H}_2(g) \\uparrow + \\text{O}_2(g) \\uparrow, \\quad V_{\\text{H}_2} : V_{\\text{O}_2} = 2 : 1",
    color: "from-sky-500/20 to-emerald-600/10",
    accentColor: "#0ea5e9",
    defaultParams: {
      cellVoltage: 12,
      acidConcentration: 5,
      electrolysisTime: 40,
      testSplint: 1,
    },
    paramConfigs: [
      { key: "cellVoltage", label: "DC Voltage (V)", min: 3, max: 18, step: 1.5, unit: "V", description: "Direct current potential difference applied across platinum electrodes." },
      { key: "acidConcentration", label: "Acid Catalyst (drops)", min: 1, max: 10, step: 1, unit: "drops", description: "Dilute sulfuric acid drops added to provide electrolyte ions for electrical conduction." },
      { key: "electrolysisTime", label: "Elapsed Time (s)", min: 10, max: 120, step: 10, unit: "s", description: "Duration of electrolysis driving cumulative gas production." },
      { key: "testSplint", label: "Gas Spark Test (1:Off, 2:Cathode Pop, 3:Anode Rekindle)", min: 1, max: 3, step: 1, unit: "test", description: "1: Normal operation, 2: Hydrogen Pop sound test at cathode, 3: Oxygen rekindle test at anode." },
    ],
    explanation: "Water decomposes into dihydrogen gas at the negative cathode and dioxygen gas at the positive anode. Avogadro's law confirms the 2:1 volume ratio matches the stoichiometry of H₂O.",
    aim: "To demonstrate electrolytic decomposition of water, verify the 2:1 stoichiometric volume ratio of H₂ to O₂, and confirm gas identities through diagnostic flame tests.",
    apparatus: ["Hofmann Voltameter with Platinum Electrodes", "Regulated DC Power Supply (12V)", "Dilute Sulfuric Acid Electrolyte", "Ignition Matchstick & Glowing Wood Splint"],
    procedure: [
      { stepNumber: 1, title: "Fill Hofmann Voltameter", instruction: "Fill inverted graduated glass tubes with acidified water (dilute H₂SO₄)." },
      { stepNumber: 2, title: "Apply DC Electric Current", instruction: "Switch on 12V DC power: observe continuous bubble effervescence at both platinum electrodes." },
      { stepNumber: 3, title: "Measure Gas Volume Ratio", instruction: "Read graduated columns: notice Hydrogen accumulates at cathode at exactly twice the volume rate of Oxygen at anode (2:1 ratio)." },
      { stepNumber: 4, title: "Perform Identification Tests", instruction: "Test cathode gas with flame for squeaky 'POP' sound (H₂); test anode gas with glowing splint to observe reignition (O₂ supports combustion)." }
    ],
    precautions: [
      "Pure water is an insulator; acid or ionic salt must be added to provide charge carriers (H⁺, SO₄²⁻).",
      "Hydrogen is flammable; perform flame pop tests strictly in small micro-quantities."
    ],
    vivaQuestions: [
      { question: "Why is the volume of gas collected at one electrode double that at the other?", answer: "Because water molecules contain two atoms of hydrogen for every one atom of oxygen: 2H₂O → 2H₂ + O₂. By Avogadro's law, equal volumes of gases contain equal numbers of molecules at constant temperature and pressure." },
      { question: "Why is dilute sulfuric acid added to water during electrolysis?", answer: "Pure distilled water has very low electrical conductivity due to minimal self-ionization. Acid provides abundant H⁺ and SO₄²⁻ ions to conduct current." },
      { question: "Write the half-cell reactions at cathode and anode.", answer: "Cathode (Reduction): 4H⁺ + 4e⁻ → 2H₂ (g). Anode (Oxidation): 2H₂O → O₂ (g) + 4H⁺ + 4e⁻." }
    ]
  }
];

