import { AISimulationSpec } from "./labTypes";

export const CURATED_CUSTOM_SIMULATIONS: Record<string, AISimulationSpec> = {
  "double slit interference": {
    id: "sim-double-slit",
    topic: "Double Slit Interference",
    title: "Young's Double Slit Wave Interference",
    hindiTitle: "यंग का द्वि-स्लिट प्रकाश व्यतिकरण",
    subject: "physics",
    grade: "Class 12",
    category: "Wave Optics",
    conceptFormula: "\\beta = \\frac{\\lambda D}{d}, \\quad I = 4I_0 \\cos^2\\left(\\frac{\\pi d \\sin\\theta}{\\lambda}\\right)",
    secondaryFormulas: [
      { label: "Bright Fringe Position (Constructive)", formula: "y_n = n \\frac{\\lambda D}{d}" },
      { label: "Dark Fringe Position (Destructive)", formula: "y_n = \\left(n - \\frac{1}{2}\\right) \\frac{\\lambda D}{d}" },
      { label: "Angular Fringe Width", formula: "\\theta_0 = \\frac{\\lambda}{d}" }
    ],
    simulationType: "wave_interference",
    description: "Coherent monochromatic light waves passing through two close slits (S₁, S₂) overlap on the screen to form alternating bright and dark interference fringes.",
    parameters: [
      { key: "wavelength", label: "Wavelength (λ)", min: 400, max: 700, step: 20, defaultValue: 532, unit: "nm", description: "Wavelength of the monochromatic laser source (Violet to Red).", symbol: "λ" },
      { key: "slitDistance", label: "Slit Separation (d)", min: 0.1, max: 0.8, step: 0.05, defaultValue: 0.25, unit: "mm", description: "Distance between the two narrow slits S₁ and S₂.", symbol: "d" },
      { key: "screenDistance", label: "Screen Distance (D)", min: 0.5, max: 2.0, step: 0.1, defaultValue: 1.2, unit: "m", description: "Distance from the double-slit plane to the observation screen.", symbol: "D" },
      { key: "sourceIntensity", label: "Laser Intensity (I₀)", min: 20, max: 100, step: 10, defaultValue: 80, unit: "%", description: "Base intensity of the incoming coherent laser beam.", symbol: "I₀" },
    ],
    liveOutputs: [
      { key: "fringeWidth", label: "Fringe Width (β)", formulaStr: "(\\lambda \\times D) / d", unit: "mm", description: "Separation between two consecutive bright or dark fringes." },
      { key: "maxIntensity", label: "Central Maxima Intensity (I_max)", formulaStr: "4 \\times I_0", unit: "a.u.", description: "Peak intensity at central bright fringe y = 0." },
      { key: "angularWidth", label: "Angular Width (θ₀)", formulaStr: "(\\lambda / d) \\times 1000", unit: "mrad", description: "Angular spread of the central interference fringe." }
    ],
    cherryObservation: {
      hinglishGuide: "Arrey beta dhyan se dekho! Slit distance (d) ko jab hum kam karte hain, toh screen par fringe width (β) badh jaati hai kyunki β aur d inversely proportional hain (β ∝ 1/d). Wavelength (λ) badhane par (jaise Green se Red laser) fringes aur choudi (wider) ho jaati hain!",
      keyRuleLaw: "Huygens' Principle & Principle of Wave Superposition",
      examTrap: "Board Exam Trap: 90% students bhool jaate hain ki agar pure apparatus ko paani (water, n = 1.33) me duba diya jaye, toh wavelength λ' = λ/n kam ho jaati hai aur fringe width β bhi 1.33 times shrink ho jaati hai!",
      whatToObserve: [
        "Slit distance 'd' badhane se fringes paas-paas (narrow) aa jaati hain.",
        "Laser Wavelength 'λ' badhane se fringes phailti hain (Red has maximum fringe width).",
        "Screen Distance 'D' badhane se pattern expand hota hai."
      ],
      proTip: "Central fringe (y=0) par path difference Δx = 0 hota hai, isliye central maxima hamesha bright hota hai!"
    },
    visualTheme: {
      primaryColor: "#22c55e",
      accentColor: "#10b981",
      bgTheme: "dark"
    },
    customVisualConfig: {
      graphType: "intensity",
      showVectors: true
    }
  },

  "newton's cradle": {
    id: "sim-newtons-cradle",
    topic: "Newton's Cradle & Momentum Conservation",
    title: "Newton's Cradle: Momentum & Kinetic Energy Conservation",
    hindiTitle: "न्यूटन का पालना: संवेग एवं गतिज ऊर्जा संरक्षण",
    subject: "physics",
    grade: "Class 11",
    category: "Mechanics & Collisions",
    conceptFormula: "m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2, \\quad \\frac{1}{2}m_1 u_1^2 + \\frac{1}{2}m_2 u_2^2 = \\frac{1}{2}m_1 v_1^2 + \\frac{1}{2}m_2 v_2^2",
    secondaryFormulas: [
      { label: "Coefficient of Restitution", formula: "e = \\frac{v_2 - v_1}{u_1 - u_2} = 1.00 \\text{ (Perfect Elastic)}" },
      { label: "Total Kinetic Energy", formula: "K_{\\text{total}} = \\sum \\frac{1}{2} m v_i^2" }
    ],
    simulationType: "particle_collision",
    description: "Demonstration of elastic collisions in a chain of metallic spheres, transferring momentum and energy instantly from one end to the other.",
    parameters: [
      { key: "liftedBalls", label: "Balls Lifted (Count)", min: 1, max: 3, step: 1, defaultValue: 1, unit: "balls", description: "Number of metallic balls released from the left side.", symbol: "N" },
      { key: "releaseAngle", label: "Release Angle (θ)", min: 15, max: 60, step: 5, defaultValue: 35, unit: "deg", description: "Initial release angle displacement.", symbol: "θ" },
      { key: "ballMass", label: "Sphere Mass (m)", min: 50, max: 200, step: 10, defaultValue: 100, unit: "g", description: "Mass of each identical steel ball.", symbol: "m" },
      { key: "elasticity", label: "Restitution (e)", min: 0.5, max: 1.0, step: 0.05, defaultValue: 0.98, unit: "ratio", description: "Elasticity coefficient (1.0 = zero energy dissipation).", symbol: "e" },
    ],
    liveOutputs: [
      { key: "initialVelocity", label: "Impact Velocity (v)", formulaStr: "\\sqrt{2 \\times 9.8 \\times L \\times (1 - \\cos\\theta)}", unit: "m/s", description: "Speed of colliding ball at the bottom lowest point." },
      { key: "totalMomentum", label: "Total Momentum (P)", formulaStr: "N \\times m \\times v", unit: "kg·m/s", description: "Conserved linear momentum across the collision." },
      { key: "kineticEnergy", label: "Kinetic Energy (KE)", formulaStr: "0.5 \\times N \\times m \\times v^2", unit: "J", description: "Mechanical energy transferring through the center chain." }
    ],
    cherryObservation: {
      hinglishGuide: "Waah beta! Dekho jitni balls hum left se chhodte hain (N = 2), theek utni hi balls right side se swing karti hain! Aisa isliye hota hai kyunki Momentum aur Kinetic Energy dono ko ek sath satisfy hona padta hai. Agar 1 ball double speed se nikalti toh KE match nahi karti!",
      keyRuleLaw: "Law of Conservation of Linear Momentum & Elastic Collision",
      examTrap: "Exam Trap: Why doesn't 1 ball fly out with twice the speed when 2 balls hit? Because KE = 1/2 m (2v)² = 2mv² (Double the input KE), violating the First Law of Thermodynamics!",
      whatToObserve: [
        "Jitni balls input me impact karengi, utni hi balls output me fly karengi.",
        "Middle balls stationary rehti hain aur impulse transfer media ka kaam karti hain.",
        "Angle θ badhane se impact velocity aur kinetic energy badhti hai."
      ],
      proTip: "High carbon chrome steel spheres are used in real cradles to keep elasticity e > 0.98 for long sustained cycles!"
    },
    visualTheme: {
      primaryColor: "#38bdf8",
      accentColor: "#0284c7",
      bgTheme: "slate"
    }
  },

  "capacitor charging": {
    id: "sim-capacitor-rc",
    topic: "Capacitor Charging & RC Transient Response",
    title: "RC Circuit: Capacitor Charging & Time Constant (τ)",
    hindiTitle: "RC परिपथ: संधारित्र आवेशन एवं समय नियतांक",
    subject: "physics",
    grade: "Class 12",
    category: "Current Electricity & Magnetism",
    conceptFormula: "V_C(t) = V_0 \\left(1 - e^{-t / RC}\\right), \\quad I(t) = \\frac{V_0}{R} e^{-t / RC}, \\quad \\tau = R \\times C",
    secondaryFormulas: [
      { label: "Stored Electrostatic Energy", formula: "U = \\frac{1}{2} C V_C^2" },
      { label: "Voltage at 1 Time Constant (t = τ)", formula: "V_C(\\tau) = 0.632 \\times V_0 \\text{ (63.2% Charged)}" },
      { label: "Voltage at 5 Time Constants (t = 5τ)", formula: "V_C(5\\tau) \\approx 0.993 \\times V_0 \\text{ (Fully Charged)}" }
    ],
    simulationType: "circuits_charging",
    description: "Transient charging of a capacitor through a resistor when connected to a DC voltage source, demonstrating electric field growth and exponential saturation.",
    parameters: [
      { key: "supplyVoltage", label: "DC Voltage (V₀)", min: 5, max: 24, step: 1, defaultValue: 12, unit: "V", description: "Direct Current source voltage.", symbol: "V₀" },
      { key: "resistance", label: "Resistance (R)", min: 1, max: 20, step: 1, defaultValue: 5, unit: "kΩ", description: "Series resistance in kilo-ohms.", symbol: "R" },
      { key: "capacitance", label: "Capacitance (C)", min: 10, max: 200, step: 10, defaultValue: 100, unit: "μF", description: "Parallel plate capacitor value in microfarads.", symbol: "C" },
      { key: "switchMode", label: "Circuit Switch (1:Charge, 0:Discharge)", min: 0, max: 1, step: 1, defaultValue: 1, unit: "state", description: "Toggle between charging and discharging modes.", symbol: "SW" },
    ],
    liveOutputs: [
      { key: "timeConstant", label: "Time Constant (τ = RC)", formulaStr: "R \\times C", unit: "ms", description: "Time taken to reach 63.2% of full supply voltage." },
      { key: "instantVoltage", label: "Capacitor Voltage (V_c)", formulaStr: "V_0 \\times (1 - e^{-t/\\tau})", unit: "V", description: "Current instantaneous voltage across capacitor plates." },
      { key: "storedEnergy", label: "Stored Energy (U)", formulaStr: "0.5 \\times C \\times V_c^2", unit: "mJ", description: "Electric field energy stored in dielectric." }
    ],
    cherryObservation: {
      hinglishGuide: "Dekho beta! Jab switch ON hota hai (t = 0 par), capacitor bilkul empty hota hai aur short circuit ki tarah act karta hai (Maximum Current I = V/R). Jaise-jaise charge accumulate hota hai, plates ke beech electric field badhti hai aur current exponentially zero ho jaata hai!",
      keyRuleLaw: "Kirchhoff's Voltage Law & Exponential RC Transient Theory",
      examTrap: "Frequently Asked Question: t = 0 par capacitor acts as a SHORT CIRCUIT (zero resistance), and at steady state (t = ∞) it acts as an OPEN CIRCUIT (infinite resistance)!",
      whatToObserve: [
        "t = τ (Time Constant) par voltage exactly 63.2% of V₀ reach karta hai.",
        "R ya C badhane se time constant τ badhta hai aur charging slow ho jaati hai.",
        "Plates par opposite charges (+Q and -Q) accumulate hote hain aur beech me uniform electric field banti hai."
      ],
      proTip: "5τ ke baad capacitor 99.3% charge ho jata hai, jise practical electronics me fully charged maana jata hai!"
    },
    visualTheme: {
      primaryColor: "#f59e0b",
      accentColor: "#d97706",
      bgTheme: "dark"
    },
    customVisualConfig: {
      graphType: "exponential",
      showVectors: true
    }
  },

  "photosynthesis light phase": {
    id: "sim-photosynthesis-light",
    topic: "Photosynthesis Light Phase",
    title: "Thylakoid Membrane: Z-Scheme & ATP Photophosphorylation",
    hindiTitle: "प्रकाश संश्लेषण प्रकाश अभिक्रिया: Z-स्कीम एवं ATP संश्लेषण",
    subject: "biology",
    grade: "Class 11",
    category: "Plant Physiology",
    conceptFormula: "2\\text{H}_2\\text{O} + 2\\text{NADP}^+ + 3\\text{ADP} + 3\\text{P}_i \\xrightarrow{\\text{Light}} \\text{O}_2 + 2\\text{NADPH} + 2\\text{H}^+ + 3\\text{ATP}",
    secondaryFormulas: [
      { label: "Water Photolysis (PS II)", formula: "2\\text{H}_2\\text{O} \\to \\text{O}_2 + 4\\text{H}^+ + 4e^-" },
      { label: "Chemiosmotic Proton Motive Force", formula: "\\Delta p = \\Delta \\psi - \\frac{2.3RT}{F} \\Delta \\text{pH}" }
    ],
    simulationType: "cellular_flow",
    description: "Light photons excite chlorophyll electrons in Photosystem II (P680) and Photosystem I (P700), pumping protons into the thylakoid lumen to drive the ATP synthase rotor.",
    parameters: [
      { key: "lightIntensity", label: "Light Intensity (Photons)", min: 20, max: 100, step: 10, defaultValue: 75, unit: "μmol/m²s", description: "Sunlight flux incident on Chloroplast thylakoid.", symbol: "I" },
      { key: "co2Concentration", label: "CO₂ Availability", min: 200, max: 800, step: 50, defaultValue: 400, unit: "ppm", description: "Atmospheric CO₂ concentration for Calvin cycle sink.", symbol: "[CO₂]" },
      { key: "temperature", label: "Enzyme Temperature", min: 10, max: 45, step: 5, defaultValue: 25, unit: "°C", description: "Optimum temperature for ATP synthase and RuBisCO.", symbol: "T" },
      { key: "waterSupply", label: "Water Availability", min: 20, max: 100, step: 10, defaultValue: 90, unit: "%", description: "Water for photolysis at Oxygen Evolving Complex (OEC).", symbol: "H₂O" },
    ],
    liveOutputs: [
      { key: "atpProduction", label: "ATP Synthase Rate", formulaStr: "0.85 \\times I \\times (T / 25)", unit: "nmol/s", description: "Rate of ATP generation via proton turbine rotation." },
      { key: "oxygenEvolution", label: "O₂ Gas Evolution", formulaStr: "0.5 \\times I \\times (H_2O / 100)", unit: "mL/min", description: "Byproduct oxygen released from photolysis." },
      { key: "protonGradient", label: "Lumen Proton Gradient (ΔpH)", formulaStr: "2.4 \\times (I / 100)", unit: "pH units", description: "High H⁺ concentration built inside the thylakoid lumen." }
    ],
    cherryObservation: {
      hinglishGuide: "Observe karo beta! Thylakoid membrane me photons jab PS II (P680) par girte hain, toh water split hota hai (Photolysis) aur Oxygen gas release hoti hai. Protons (H⁺) lumen ke andar ikattha hokar high gradient banate hain, jo ATP Synthase ke rotor ko ghumakar energy banata hai!",
      keyRuleLaw: "Peter Mitchell's Chemiosmotic Hypothesis & Non-Cyclic Photophosphorylation",
      examTrap: "NEET/Board Trap: Oxygen gas (O₂) comes from WATER (H₂O) photolysis at PS II, NOT from CO₂! This was proven by Ruben & Kamen using oxygen-18 tracer isotope!",
      whatToObserve: [
        "Light intensity badhane se electron transfer chain (ETC) tez chalti hai.",
        "ATP Synthase rotor ghoomta hai jab protons stroma me wapas flow karte hain.",
        "Temperature 40°C se upar jane par enzymes denature hone lagte hain aur rate gir jati hai."
      ],
      proTip: "Both ATP and NADPH are called Assimilatory Power of light reaction, which are consumed in dark reaction (Calvin cycle)!"
    },
    visualTheme: {
      primaryColor: "#10b981",
      accentColor: "#059669",
      bgTheme: "lab"
    }
  },

  "doppler effect": {
    id: "sim-doppler-effect",
    topic: "Doppler Effect in Sound Waves",
    title: "Doppler Effect: Moving Sound Source & Wavefront Compression",
    hindiTitle: "डॉप्लर प्रभाव: गतिशील ध्वनि स्रोत एवं तरंगदैर्घ्य संकुचन",
    subject: "physics",
    grade: "Class 11",
    category: "Waves & Acoustics",
    conceptFormula: "f' = f_0 \\left( \\frac{v \\pm v_o}{v \\mp v_s} \\right)",
    secondaryFormulas: [
      { label: "Apparent Wavelength Ahead (Compression)", formula: "\\lambda' = \\frac{v - v_s}{f_0}" },
      { label: "Mach Number & Sonic Cone", formula: "M = \\frac{v_s}{v} \\quad (M > 1 \\implies \\text{Sonic Shockwave})" }
    ],
    simulationType: "wave_interference",
    description: "Apparent change in frequency of a sound wave for an observer moving relative to its source, showing compressed circular wavefronts ahead and elongated wavefronts behind.",
    parameters: [
      { key: "sourceSpeed", label: "Source Velocity (v_s)", min: 0, max: 300, step: 20, defaultValue: 120, unit: "m/s", description: "Speed of the siren/vehicle moving to the right.", symbol: "v_s" },
      { key: "soundSpeed", label: "Speed of Sound (v)", min: 300, max: 360, step: 10, defaultValue: 340, unit: "m/s", description: "Speed of sound in air at current temperature.", symbol: "v" },
      { key: "sourceFrequency", label: "Source Pitch (f₀)", min: 200, max: 1000, step: 50, defaultValue: 440, unit: "Hz", description: "Natural frequency of the siren (A4 note = 440Hz).", symbol: "f₀" },
      { key: "observerSpeed", label: "Observer Velocity (v_o)", min: -50, max: 50, step: 10, defaultValue: 0, unit: "m/s", description: "Velocity of the listener towards/away from source.", symbol: "v_o" },
    ],
    liveOutputs: [
      { key: "apparentFreqAhead", label: "Observed Pitch Ahead (f'_ahead)", formulaStr: "f_0 \\times (v / (v - v_s))", unit: "Hz", description: "Higher frequency heard by observer in front of moving source." },
      { key: "apparentFreqBehind", label: "Observed Pitch Behind (f'_behind)", formulaStr: "f_0 \\times (v / (v + v_s))", unit: "Hz", description: "Lower pitch heard by observer left behind." },
      { key: "machRatio", label: "Mach Ratio (v_s / v)", formulaStr: "v_s / v", unit: "Mach", description: "Ratio of source speed to sound speed." }
    ],
    cherryObservation: {
      hinglishGuide: "Notice kiya beta? Jab ambulance hamari taraf aati hai toh siren ki pitch high (teekhi) sunayi deti hai kyunki wave fronts aage ki taraf compress ho jaate hain (λ kam ho jata hai). Jaise hi wo hume cross karti hai, pitch instantly drop ho jaati hai!",
      keyRuleLaw: "Doppler's Principle for Mechanical & Electromagnetic Waves",
      examTrap: "Crucial Rule: Medium velocity (wind) alters effective sound speed, but Doppler shift occurs only if there is RELATIVE MOTION between source and listener!",
      whatToObserve: [
        "Source aage badhta hai toh circular waves aage dense aur peeche sparse ho jaati hain.",
        "Jab v_s = v (Mach 1), saari waves ek single barrier par stack ho jaati hain (Sound Barrier).",
        "Jab v_s > v (Supersonic), Mach Cone aur Sonic Boom banta hai!"
      ],
      proTip: "Doppler effect is used by police radar guns to catch speeding cars and by astronomers to measure expanding universe redshift!"
    },
    visualTheme: {
      primaryColor: "#ec4899",
      accentColor: "#db2777",
      bgTheme: "navy"
    }
  },

  "rutherford gold foil": {
    id: "sim-rutherford-scattering",
    topic: "Rutherford Alpha Particle Scattering",
    title: "Rutherford Gold Foil Experiment: Discovery of Atomic Nucleus",
    hindiTitle: "रदरफोर्ड स्वर्ण पत्र प्रयोग: परमाणु नाभिक की खोज",
    subject: "physics",
    grade: "Class 12",
    category: "Atomic Physics",
    conceptFormula: "N(\\theta) \\propto \\frac{1}{\\sin^4(\\theta / 2)}, \\quad r_0 = \\frac{1}{4\\pi\\varepsilon_0} \\frac{2 Z e^2}{K}",
    secondaryFormulas: [
      { label: "Impact Parameter (b)", formula: "b = \\frac{1}{4\\pi\\varepsilon_0} \\frac{Z e^2 \\cot(\\theta/2)}{K}" },
      { label: "Distance of Closest Approach", formula: "r_0 = \\frac{4 k Z e^2}{m v^2}" }
    ],
    simulationType: "particle_collision",
    description: "Alpha particles (He²⁺) fired at thin gold foil; most pass straight through, while a tiny fraction deflect at large angles, proving atom is mostly empty space with a dense positive nucleus.",
    parameters: [
      { key: "alphaEnergy", label: "Alpha Kinetic Energy (K)", min: 3, max: 10, step: 0.5, defaultValue: 5.5, unit: "MeV", description: "Kinetic energy of alpha particles from Bismuth-214 source.", symbol: "K" },
      { key: "atomicNumber", label: "Target Nucleus (Gold Z)", min: 29, max: 92, step: 10, defaultValue: 79, unit: "Z", description: "Atomic number of the foil target (Gold = 79, Silver = 47, Copper = 29).", symbol: "Z" },
      { key: "beamIntensity", label: "Alpha Beam Flux", min: 20, max: 100, step: 10, defaultValue: 60, unit: "%", description: "Particle count rate per second.", symbol: "Flux" },
      { key: "foilThickness", label: "Foil Layers", min: 1, max: 5, step: 1, defaultValue: 1, unit: "layers", description: "Atomic layer thickness of the metal foil.", symbol: "t" },
    ],
    liveOutputs: [
      { key: "closestApproach", label: "Distance of Closest Approach (r₀)", formulaStr: "(2 \\times 79 \\times 1.44) / K", unit: "fm", description: "Upper bound of nuclear radius in femtometers (10⁻¹⁵ m)." },
      { key: "largeAngleFraction", label: "Large Deflection Rate (>90°)", formulaStr: "1 / 8000", unit: "ratio", description: "Approximately 1 in 8000 particles rebounds back." }
    ],
    cherryObservation: {
      hinglishGuide: "Dekho beta! Almost 99.9% alpha particles seedhe nikal jaate hain bina kisi deviation ke, jisse pata chala ki atom ka maximum space EMPTY hai! Aur jo 1 in 8000 particle 180° par rebound hota hai, usse prove hua ki saara positive charge aur mass ek tiny center 'Nucleus' me concentrated hai!",
      keyRuleLaw: "Coulomb's Inverse-Square Law & Nuclear Scattering Theory",
      examTrap: "Exam Question: Why was GOLD used? Because gold is the most malleable metal, allowing Rutherford to make an ultra-thin foil just ~1000 atoms thick (100 nm)!",
      whatToObserve: [
        "Head-on collision (b = 0) par alpha particle 180° rebound hota hai.",
        "Impact parameter 'b' badhane se deflection angle 'θ' chota ho jata hai.",
        "Atomic number Z badhane se electrostatic repulsion badhta hai aur distance of closest approach r₀ badh jata hai."
      ],
      proTip: "Rutherford famously said: 'It was as if you fired a 15-inch artillery shell at a tissue paper and it came back and hit you!'"
    },
    visualTheme: {
      primaryColor: "#eab308",
      accentColor: "#ca8a04",
      bgTheme: "dark"
    }
  },

  "ideal gas law": {
    id: "sim-ideal-gas-piston",
    topic: "Ideal Gas Law & Piston Thermodynamics",
    title: "Kinetic Gas Theory: Piston Chamber & P-V State Equation",
    hindiTitle: "आदर्श गैस नियम: पिस्टन कक्ष एवं P-V अवस्था समीकरण",
    subject: "physics",
    grade: "Class 11",
    category: "Thermodynamics",
    conceptFormula: "P V = n R T, \\quad P = \\frac{1}{3} \\frac{N m}{V} v_{\\text{rms}}^2, \\quad v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}}",
    secondaryFormulas: [
      { label: "Boyle's Law (Isothermal)", formula: "P_1 V_1 = P_2 V_2 \\quad (T = \\text{const})" },
      { label: "Average Translational Kinetic Energy", formula: "\\bar{E}_k = \\frac{3}{2} k_B T" }
    ],
    simulationType: "thermodynamics_gas",
    description: "Gas particles colliding with container walls inside an interactive cylinder piston, demonstrating pressure, temperature, and volume relationships.",
    parameters: [
      { key: "temperature", label: "Temperature (T)", min: 100, max: 600, step: 25, defaultValue: 300, unit: "K", description: "Absolute thermodynamic temperature in Kelvin.", symbol: "T" },
      { key: "chamberVolume", label: "Chamber Volume (V)", min: 2, max: 10, step: 0.5, defaultValue: 5, unit: "L", description: "Volume controlled by the movable top piston.", symbol: "V" },
      { key: "moleCount", label: "Gas Amount (n)", min: 0.5, max: 3.0, step: 0.5, defaultValue: 1.0, unit: "mol", description: "Quantity of gas molecules enclosed.", symbol: "n" },
      { key: "gasType", label: "Gas Molecule (1:He, 2:N₂, 3:CO₂)", min: 1, max: 3, step: 1, defaultValue: 1, unit: "type", description: "Molar mass of chosen gas species.", symbol: "M" },
    ],
    liveOutputs: [
      { key: "calcPressure", label: "Enclosed Pressure (P)", formulaStr: "(n \\times 8.314 \\times T) / V", unit: "kPa", description: "Collisional force per unit area on chamber walls." },
      { key: "rmsVelocity", label: "RMS Molecular Speed (v_rms)", formulaStr: "\\sqrt{(3 \\times 8.314 \\times T) / (M / 1000)}", unit: "m/s", description: "Root mean square speed of gas particles." },
      { key: "totalThermalEnergy", label: "Internal Energy (U)", formulaStr: "1.5 \\times n \\times 8.314 \\times T", unit: "J", description: "Total thermal kinetic energy of the ideal gas." }
    ],
    cherryObservation: {
      hinglishGuide: "Beta dhyan se dekho! Piston ko niche push karne par (Volume V kam hone par), gas molecules container ki walls par zyada frequently collide karte hain, jisse Pressure (P) spike ho jaata hai (Boyle's Law: P ∝ 1/V)! Aur Temperature T badhane se particles ki speed v_rms ∝ √T tezi se badh jaati hai!",
      keyRuleLaw: "Boyle's Law, Charles's Law & Kinetic Molecular Theory",
      examTrap: "Temperature must ALWAYS be plugged into formulas in KELVIN (K = °C + 273.15). Using Celsius in PV = nRT is the #1 reason for negative exam marks!",
      whatToObserve: [
        "Temperature T badhane se particle dots fast ho jaate hain aur color warmer ho jata hai.",
        "Volume V kam karne se pressure gauge needle right deflect hoti hai.",
        "Lighter gas (Helium, M=4) same temperature par heavy gas (CO₂, M=44) se bohot fast move karti hai."
      ],
      proTip: "Real gases obey ideal gas law PV = nRT at HIGH temperature and LOW pressure where intermolecular attractions become negligible!"
    },
    visualTheme: {
      primaryColor: "#ef4444",
      accentColor: "#dc2626",
      bgTheme: "slate"
    }
  },

  "projectile motion": {
    id: "sim-projectile-motion",
    topic: "Projectile Motion & 2D Kinematics",
    title: "Projectile Kinematics: Parabolic Trajectory & Flight Dynamics",
    hindiTitle: "प्रक्षेप्य गति: परवलयाकार प्रक्षेप-पथ एवं परास",
    subject: "physics",
    grade: "Class 11",
    category: "Kinematics",
    conceptFormula: "R = \\frac{u^2 \\sin 2\\theta}{g}, \\quad H = \\frac{u^2 \\sin^2\\theta}{2g}, \\quad T = \\frac{2u \\sin\\theta}{g}",
    secondaryFormulas: [
      { label: "Equation of Parabolic Path", formula: "y = x \\tan\\theta - \\frac{g x^2}{2 u^2 \\cos^2\\theta}" },
      { label: "Maximum Range Angle", formula: "\\theta_{\\text{max}} = 45^\\circ \\implies R_{\\text{max}} = \\frac{u^2}{g}" }
    ],
    simulationType: "projectile_kinetics",
    description: "Launch a projectile at various speeds and launch angles under gravity, displaying real-time parabolic flight path, velocity vectors (v_x, v_y), apex height, and range.",
    parameters: [
      { key: "initialSpeed", label: "Launch Speed (u)", min: 10, max: 60, step: 2, defaultValue: 30, unit: "m/s", description: "Initial muzzle velocity of projectile.", symbol: "u" },
      { key: "launchAngle", label: "Launch Angle (θ)", min: 15, max: 80, step: 5, defaultValue: 45, unit: "deg", description: "Angle of elevation above horizontal ground.", symbol: "θ" },
      { key: "gravity", label: "Gravity (g)", min: 1.6, max: 24.8, step: 0.2, defaultValue: 9.8, unit: "m/s²", description: "Gravitational acceleration (Earth 9.8, Moon 1.6, Mars 3.7, Jupiter 24.8).", symbol: "g" },
      { key: "airDrag", label: "Air Resistance (Toggle)", min: 0, max: 1, step: 1, defaultValue: 0, unit: "state", description: "Enable aerodynamic quadratic air drag.", symbol: "C_d" },
    ],
    liveOutputs: [
      { key: "horizontalRange", label: "Horizontal Range (R)", formulaStr: "(u^2 \\times \\sin(2\\theta)) / g", unit: "m", description: "Total distance traveled along the x-axis." },
      { key: "maxHeight", label: "Maximum Height (H_max)", formulaStr: "(u^2 \\times \\sin^2\\theta) / (2 \\times g)", unit: "m", description: "Peak vertical elevation at the trajectory vertex." },
      { key: "timeOfFlight", label: "Time of Flight (T)", formulaStr: "(2 \\times u \\times \\sin\\theta) / g", unit: "s", description: "Total duration from launch to ground impact." }
    ],
    cherryObservation: {
      hinglishGuide: "Great observation beta! Angle θ = 45° par Range maximum (R_max) hoti hai kyunki sin(2 × 45°) = sin(90°) = 1! Aur complementary angles par (jaise 30° aur 60°) Range bilkul EXACT SAME hoti hai, bas 60° par ball zyada upar (Higher H) jaati hai!",
      keyRuleLaw: "Galileo's Two-Dimensional Kinematic Independence Principle",
      examTrap: "Crucial Fact: Highest point (apex) par vertical velocity v_y = 0 hoti hai, lekin horizontal velocity v_x = u cos(θ) aur acceleration a = g downward hamesha non-zero rehte hain!",
      whatToObserve: [
        "Horizontal velocity component v_x constant rehta hai (no air resistance case).",
        "30° and 60° launch angles yield identical landing distance (R).",
        "Moon par gravity g = 1.6 m/s² hone se range lagbhag 6 guna (6x) badh jaati hai!"
      ],
      proTip: "In sports like javelin or shotput, athletes launch at ~38°-42° instead of 45° because release height is above ground level!"
    },
    visualTheme: {
      primaryColor: "#8b5cf6",
      accentColor: "#7c3aed",
      bgTheme: "dark"
    }
  },

  "bar magnet field": {
    id: "sim-bar-magnet",
    topic: "Bar Magnet Magnetic Field Lines",
    title: "Bar Magnet: Field Lines & Compass Deflection",
    hindiTitle: "दंड चुंबक: चुंबकीय क्षेत्र रेखाएं और दिक्-सूचक",
    subject: "physics",
    grade: "Class 7",
    category: "Magnetism & Field Lines",
    conceptFormula: "\\vec{B} = \\frac{\\mu_0}{4\\pi} \\frac{2\\vec{M}}{r^3} \\quad (\\text{Magnetic Dipole Field})",
    secondaryFormulas: [
      { label: "Magnetic Moment", formula: "M = m \\times 2l" },
      { label: "Field on Equatorial Line", formula: "B_{\\text{eq}} = \\frac{\\mu_0}{4\\pi} \\frac{M}{r^3}" }
    ],
    simulationType: "magnetism_field",
    description: "Magnetic field lines around a bar magnet loop continuously from North to South outside the magnet, deflecting a magnetic compass needle along the local tangent.",
    parameters: [
      { key: "magnetStrength", label: "Magnet Strength (B₀)", min: 20, max: 100, step: 10, defaultValue: 70, unit: "%", description: "Magnetic dipole strength of the permanent bar magnet.", symbol: "B₀" },
      { key: "compassDistance", label: "Compass Distance (r)", min: 50, max: 180, step: 10, defaultValue: 100, unit: "px", description: "Distance of the magnetic compass from magnet center.", symbol: "r" },
      { key: "compassAngle", label: "Compass Orbit Angle (θ)", min: 0, max: 360, step: 15, defaultValue: 45, unit: "deg", description: "Position angle of the test compass around magnet.", symbol: "θ" },
      { key: "showFilings", label: "Iron Filings Density", min: 0, max: 100, step: 20, defaultValue: 60, unit: "%", description: "Scatter density of iron filings revealing flux pattern.", symbol: "N" },
    ],
    liveOutputs: [
      { key: "fieldIntensity", label: "Field Strength (B)", formulaStr: "(B_0 / r^3) \\times 10^4", unit: "mT", description: "Local magnetic flux density at compass location." },
      { key: "needleAngle", label: "Compass Deflection (φ)", formulaStr: "\\theta + 45^\\circ", unit: "°", description: "Deflection angle of the magnetic compass needle." },
      { key: "activePole", label: "Nearest Pole", formulaStr: "r < 0 ? 'North (N)' : 'South (S)'", unit: "pole", description: "Dominant magnetic pole influencing the compass." }
    ],
    cherryObservation: {
      hinglishGuide: "Dhyan se dekho beta! Bar magnet ke North pole (Red) se magnetic field lines nikal kar bahar se South pole (Blue) me enter karti hain! Compass ki needle hamesha local magnetic field line ki tangent direction me ghoom jati hai! Magnet ke paas field bohot strong hoti hai!",
      keyRuleLaw: "Properties of Magnetic Field Lines & Dipole Field Theory",
      examTrap: "Board Exam Trap: Do magnetic field lines kabhi bhi ek dusre ko intersect nahi kar sakti! Kyunki agar wo cross karengi toh cross point par compass needle do directions dikhayegi, jo physically namumkin hai!",
      whatToObserve: [
        "Poles ke paas field lines sabse dense (paas-paas) hoti hain, jahan magnetic force maximum hota hai.",
        "Compass ko magnet ke charo taraf ghumane par needle smoothly rotate hoti hai.",
        "Magnet ke andar field lines South se North travel karti hain (Closed Loops)."
      ],
      proTip: "Earth itself acts like a huge bar magnet with its magnetic South pole near geographical North!"
    },
    visualTheme: {
      primaryColor: "#ef4444",
      accentColor: "#3b82f6",
      bgTheme: "slate"
    }
  },

  "electromagnet coil": {
    id: "sim-electromagnet-coil",
    topic: "Electromagnet Coiled Nail & Paperclip Attractor",
    title: "Electromagnet: Coiled Nail & Paperclip Attractor",
    hindiTitle: "विद्युत चुंबक: लोहे की कील, कुंडली और पेपरक्लिप",
    subject: "physics",
    grade: "Class 7",
    category: "Magnetic Effects of Electric Current",
    conceptFormula: "B = \\mu_0 \\cdot \\mu_r \\cdot n \\cdot I, \\quad n = \\frac{N}{L}",
    secondaryFormulas: [
      { label: "Coil Current (Ohm's Law)", formula: "I = \\frac{V}{R}" },
      { label: "Paperclip Attraction Force", formula: "F \\propto B^2 \\propto (N \\cdot I)^2" }
    ],
    simulationType: "electromagnet",
    description: "Insulated copper wire wound around a soft iron nail connected to a DC cell. When current flows, the nail becomes a temporary magnet that lifts iron paperclips.",
    parameters: [
      { key: "coilTurns", label: "Coil Turns (N)", min: 10, max: 100, step: 10, defaultValue: 40, unit: "turns", description: "Number of insulated copper wire loops around nail.", symbol: "N" },
      { key: "batteryVoltage", label: "Battery Voltage (V)", min: 1.5, max: 12.0, step: 1.5, defaultValue: 6.0, unit: "V", description: "DC battery potential difference powering the coil.", symbol: "V" },
      { key: "switchState", label: "Switch State (1:ON, 0:OFF)", min: 0, max: 1, step: 1, defaultValue: 1, unit: "state", description: "Close or open the electric circuit key.", symbol: "SW" },
      { key: "coreType", label: "Core Material (1:Iron, 0:Plastic)", min: 0, max: 1, step: 1, defaultValue: 1, unit: "core", description: "Ferromagnetic soft iron nail vs non-magnetic plastic rod.", symbol: "Core" },
    ],
    liveOutputs: [
      { key: "coilCurrent", label: "Current (I)", formulaStr: "V / 2.5", unit: "A", description: "Electric current flowing through the copper wire coil." },
      { key: "magneticStrength", label: "Magnetic Strength (B)", formulaStr: "N \\times I \\times core", unit: "a.u.", description: "Induced magnetic field strength at the nail tip." },
      { key: "clipsLifted", label: "Paperclips Lifted", formulaStr: "Math.floor(B / 15)", unit: "clips", description: "Number of iron paperclips attracted and held by the nail tip." }
    ],
    cherryObservation: {
      hinglishGuide: "Wah beta! Jaise hi switch ON karte hain, current flow hota hai aur iron nail instantly magnet ban kar paperclips ko chipka leti hai! Coil ke turns (N) badhane se ya battery voltage (V) badhane se electromagnet ki taaqat badhti hai aur zyada paperclips chipak jaate hain! Switch OFF karte hi clips gir jaati hain!",
      keyRuleLaw: "Oersted's Principle & Solenoid Electromagnetism",
      examTrap: "Common Mistake: Soft iron core is used instead of steel because soft iron loses its magnetism instantly when current is turned off, whereas steel becomes a permanent magnet!",
      whatToObserve: [
        "Turns (N) double karne se magnetic field lagbhag double ho jaati hai.",
        "Switch OFF karne par electromagnet zero ho jata hai (Temporary Magnetism).",
        "Plastic rod use karne par attraction bohot kam ho jata hai kyunki relative permeability μ_r = 1 hoti hai."
      ],
      proTip: "Electric cranes in junkyards and scrap factories use giant electromagnets to lift heavy iron cars and release them simply by cutting off current!"
    },
    visualTheme: {
      primaryColor: "#f59e0b",
      accentColor: "#ef4444",
      bgTheme: "slate"
    }
  },

  "prism dispersion": {
    id: "sim-prism-dispersion",
    topic: "Prism Dispersion & Rainbow Spectrum",
    title: "Glass Prism: Dispersion & Rainbow Spectrum",
    hindiTitle: "कांच का प्रिज्म: प्रकाश का विक्षेपण और 7 रंग",
    subject: "physics",
    grade: "Class 7",
    category: "Light & Optics",
    conceptFormula: "\\delta = i + e - A, \\quad \\mu = \\frac{\\sin\\left(\\frac{A + \\delta_m}{2}\\right)}{\\sin(A/2)}",
    secondaryFormulas: [
      { label: "Cauchy's Dispersion Equation", formula: "\\mu(\\lambda) = A + \\frac{B}{\\lambda^2} \\implies \\mu_{\\text{violet}} > \\mu_{\\text{red}}" },
      { label: "Angular Dispersion", formula: "\\theta = \\delta_{\\text{violet}} - \\delta_{\\text{red}}" }
    ],
    simulationType: "optics_prism",
    description: "White light enters a triangular glass prism, refracting and dispersing into the seven spectral colors (VIBGYOR) due to wavelength-dependent refractive index.",
    parameters: [
      { key: "incidenceAngle", label: "Angle of Incidence (i)", min: 30, max: 70, step: 2, defaultValue: 48, unit: "°", description: "Angle at which incident ray strikes the first prism surface.", symbol: "i" },
      { key: "prismAngle", label: "Prism Angle (A)", min: 45, max: 65, step: 5, defaultValue: 60, unit: "°", description: "Angle between the two refracting faces of the prism.", symbol: "A" },
      { key: "glassIndex", label: "Glass Refractive Index (n)", min: 1.45, max: 1.70, step: 0.02, defaultValue: 1.52, unit: "ratio", description: "Optical density of the prism glass.", symbol: "n" },
      { key: "lightMode", label: "Light Source (1:White, 0:Laser)", min: 0, max: 1, step: 1, defaultValue: 1, unit: "mode", description: "Polychromatic white sunlight beam vs monochromatic green laser.", symbol: "Light" },
    ],
    liveOutputs: [
      { key: "deviationAngle", label: "Total Deviation (δ)", formulaStr: "i + e - A", unit: "°", description: "Angle between incident ray direction and emergent ray direction." },
      { key: "redDeviation", label: "Red Deviation (δ_R)", formulaStr: "(\\mu_R - 1) A", unit: "°", description: "Deviation angle of red spectral ray (least deviated)." },
      { key: "violetDeviation", label: "Violet Deviation (δ_V)", formulaStr: "(\\mu_V - 1) A", unit: "°", description: "Deviation angle of violet spectral ray (most deviated)." }
    ],
    cherryObservation: {
      hinglishGuide: "Amazing beta! White light jab glass prism me jaati hai toh 7 colors me phail jaati hai: VIBGYOR (Violet, Indigo, Blue, Green, Yellow, Orange, Red)! Glass ke andar Violet light ki speed sabse kam hoti hai isliye uska refractive index sabse zyada hota hai aur wo sabse zyada bend hoti hai!",
      keyRuleLaw: "Snell's Law of Refraction & Dispersion of Light",
      examTrap: "Board Exam Question: Which color has the maximum speed in glass? RED light has the longest wavelength and highest speed in glass, so it deviates the LEAST!",
      whatToObserve: [
        "Red light sabse upar rehti hai (least deviated) aur Violet light sabse neeche (most deviated).",
        "Prism angle A badhane se total deviation δ badhta hai.",
        "Laser light select karne par koi dispersion nahi hota kyunki laser monochromatic (single wavelength) hoti hai!"
      ],
      proTip: "Sir Isaac Newton proved that white light is made of 7 colors by placing an inverted second prism that recombined the 7 colors back into white light!"
    },
    visualTheme: {
      primaryColor: "#38bdf8",
      accentColor: "#a855f7",
      bgTheme: "slate"
    }
  },

  "friction surfaces": {
    id: "sim-friction-surfaces",
    topic: "Friction on Different Surfaces",
    title: "Friction Bench: Surface Roughness & Resistance",
    hindiTitle: "घर्षण बल: सतह की प्रकृति एवं गति प्रतिरोध",
    subject: "physics",
    grade: "Class 8",
    category: "Mechanics & Forces",
    conceptFormula: "f_k = \\mu_k \\cdot N, \\quad N = m \\cdot g, \\quad F_{\\text{net}} = F - f_k = m \\cdot a",
    secondaryFormulas: [
      { label: "Limiting Static Friction", formula: "f_s^{\\text{max}} = \\mu_s \\cdot N" },
      { label: "Rolling vs Sliding Friction", formula: "f_{\\text{rolling}} \\ll f_{\\text{sliding}}" }
    ],
    simulationType: "friction_mechanics",
    description: "Slide a test block over various horizontal surfaces (Smooth Glass, Polished Wood, Coarse Sandpaper, Lubricated Oil) to compare frictional resistance forces.",
    parameters: [
      { key: "surfaceType", label: "Surface (1:Glass, 2:Wood, 3:Sandpaper, 4:Oil)", min: 1, max: 4, step: 1, defaultValue: 2, unit: "surface", description: "Texture and material of the horizontal test bench.", symbol: "Surface" },
      { key: "blockMass", label: "Block Mass (m)", min: 100, max: 1000, step: 100, defaultValue: 400, unit: "g", description: "Mass of the wooden test block placed on the track.", symbol: "m" },
      { key: "pullForce", label: "Applied Pull Force (F)", min: 0, max: 12, step: 0.5, defaultValue: 3.5, unit: "N", description: "Tension force exerted by pulling spring dynamometer.", symbol: "F" },
      { key: "motionType", label: "Mode (1:Sliding, 0:Rolling)", min: 0, max: 1, step: 1, defaultValue: 1, unit: "mode", description: "Flat sliding contact vs rolling ball bearings.", symbol: "Mode" },
    ],
    liveOutputs: [
      { key: "frictionForce", label: "Friction Force (f)", formulaStr: "\\mu \\times (m / 1000) \\times 9.8", unit: "N", description: "Opposing frictional force resisting motion." },
      { key: "normalForce", label: "Normal Reaction (N)", formulaStr: "(m / 1000) \\times 9.8", unit: "N", description: "Perpendicular contact force exerted by surface." },
      { key: "acceleration", label: "Block Acceleration (a)", formulaStr: "Math.max(0, (F - f) / (m / 1000))", unit: "m/s²", description: "Forward acceleration of the block across the bench." }
    ],
    cherryObservation: {
      hinglishGuide: "Observe karo beta! Sandpaper par interlocking bohot zyada hoti hai isliye friction force (f) maximum hota hai! Jab hum surface par oil ya lubricant lagate hain, toh irregularities fill ho jaati hain aur friction drastically kam ho jaata hai! Rolling mode select karne par friction aur bhi kam ho jata hai!",
      keyRuleLaw: "Amontons' Laws of Friction & Interlocking Microscopic Irregularities",
      examTrap: "Common Mistake: Friction does NOT depend on the contact area! Chahe block ko flat rakho ya side par khada karo, friction force exactly same rehta hai kyunki Normal force aur friction coefficient μ same hain!",
      whatToObserve: [
        "Mass (m) badhane se normal force N badhta hai aur friction force bhi badhta hai.",
        "Applied force jab limiting friction se zyada hota hai, tabhi block accelerate karta hai.",
        "Rolling friction is much smaller than sliding friction, which is why wheels and ball bearings were invented!"
      ],
      proTip: "Shoe soles and vehicle tyres have deep treads specifically designed to INCREASE friction with the ground and prevent slipping!"
    },
    visualTheme: {
      primaryColor: "#10b981",
      accentColor: "#f59e0b",
      bgTheme: "slate"
    }
  },

  "archimedes buoyancy": {
    id: "sim-archimedes-buoyancy",
    topic: "Archimedes' Buoyancy & Floatation",
    title: "Archimedes' Principle: Buoyant Upthrust & Apparent Weight",
    hindiTitle: "आर्किमिडीज का सिद्धांत: उत्प्लावन बल और आभासी भार",
    subject: "physics",
    grade: "Class 7",
    category: "Fluid Mechanics & Density",
    conceptFormula: "F_b = \\rho_{\\text{fluid}} \\cdot V_{\\text{disp}} \\cdot g, \\quad W_{\\text{apparent}} = W_{\\text{air}} - F_b",
    secondaryFormulas: [
      { label: "Weight of Object in Air", formula: "W_{\\text{air}} = \\rho_{\\text{object}} \\cdot V \\cdot g" },
      { label: "Law of Floatation", formula: "\\rho_{\\text{object}} < \\rho_{\\text{fluid}} \\implies \\text{Floats}" }
    ],
    simulationType: "buoyancy_archimedes",
    description: "Lower a solid cylinder into a beaker of liquid. Measure buoyant upthrust force, displaced fluid volume in the overflow cylinder, and apparent weight loss on the spring balance.",
    parameters: [
      { key: "immersionDepth", label: "Immersion Depth (h)", min: 0, max: 100, step: 10, defaultValue: 60, unit: "%", description: "Percentage of cylinder submerged in the liquid beaker.", symbol: "h" },
      { key: "objectMaterial", label: "Object (1:Al, 2:Wood, 3:Iron)", min: 1, max: 3, step: 1, defaultValue: 1, unit: "mat", description: "Density of solid: Wood=0.6, Aluminum=2.7, Iron=7.8 g/cm³.", symbol: "Mat" },
      { key: "liquidType", label: "Liquid (1:Water, 2:Salt Brine, 3:Oil)", min: 1, max: 3, step: 1, defaultValue: 1, unit: "liquid", description: "Density of liquid: Oil=0.8, Water=1.0, Saline Brine=1.2 g/cm³.", symbol: "Liq" },
      { key: "objectVolume", label: "Object Volume (V)", min: 50, max: 200, step: 25, defaultValue: 100, unit: "cm³", description: "Total geometric volume of the submerged solid cylinder.", symbol: "V" },
    ],
    liveOutputs: [
      { key: "buoyantForce", label: "Buoyant Force (F_b)", formulaStr: "\\rho_{\\text{liq}} \\times V_{\\text{disp}} \\times 0.0098", unit: "N", description: "Upward buoyant force exerted by the liquid." },
      { key: "apparentWeight", label: "Scale Reading (W_app)", formulaStr: "Math.max(0, W_{\\text{air}} - F_b)", unit: "N", description: "Weight of object recorded on the spring scale." },
      { key: "displacedWater", label: "Displaced Volume (V_disp)", formulaStr: "V \\times (h / 100)", unit: "mL", description: "Volume of overflow liquid collected in measuring beaker." }
    ],
    cherryObservation: {
      hinglishGuide: "Arrey waah! Jab object ko paani me dubo-te hain, toh spring balance par uska weight kam ho jata hai! Aisa isliye hota hai kyunki paani uspar upar ki taraf ek Upthrust (Buoyant force F_b) lagata hai! Ye buoyant force exactly overflow beaker me gire paani ke weight ke barabar hota hai!",
      keyRuleLaw: "Archimedes' Principle & Law of Floatation",
      examTrap: "Ship vs Needle Paradox: Iron needle paani me doob jaati hai kyunki uski density paani se zyada hai, lekin lakho kilo ka Steel Ship paani par tairta hai kyunki ship ka hollow structure itna zyada paani displace karta hai ki buoyant force uske pure weight ko balance kar deta hai!",
      whatToObserve: [
        "Submerge depth badhane se displaced water volume badhta hai aur buoyant force badhta hai.",
        "Saline (salt) water me buoyant force fresh water se zyada hota hai kyunki salt water ki density zyada hoti hai.",
        "Wood paani me naturally float karta hai kyunki density < 1.0 g/cm³ hoti hai."
      ],
      proTip: "Archimedes discovered this principle while sitting in a bathtub, and ran through the streets shouting 'Eureka!' ('I found it!')."
    },
    visualTheme: {
      primaryColor: "#0284c7",
      accentColor: "#06b6d4",
      bgTheme: "slate"
    }
  },

  "rational number line": {
    id: "sim-number-line",
    topic: "Rational Numbers on Number Line",
    title: "Interactive Number Line: Integers & Rational Numbers",
    hindiTitle: "संख्या रेखा: पूर्णांक एवं परिमेय संख्या निरूपण",
    subject: "mathematics",
    grade: "Class 7",
    category: "Number Systems",
    conceptFormula: "a + (-b) = a - b, \\quad |x| = \\text{Distance from Origin (0)}",
    secondaryFormulas: [
      { label: "Rational Representation", formula: "q = \\frac{p}{q}, \\quad q \\ne 0" },
      { label: "Additive Inverse", formula: "a + (-a) = 0" }
    ],
    simulationType: "number_line",
    description: "Interactive visual number line demonstrating positive/negative integers, fractions, directional jump vectors for addition/subtraction, and absolute distance from zero.",
    parameters: [
      { key: "startValue", label: "Starting Position (A)", min: -8, max: 8, step: 1, defaultValue: 2, unit: "num", description: "Initial integer point on the number line.", symbol: "A" },
      { key: "jumpStep", label: "Jump Offset (B)", min: -8, max: 8, step: 1, defaultValue: -5, unit: "num", description: "Value added to or subtracted from starting position.", symbol: "B" },
      { key: "showFractions", label: "Show Fractions (1:Yes, 0:No)", min: 0, max: 1, step: 1, defaultValue: 1, unit: "flag", description: "Display half and quarter fractional subdivision ticks.", symbol: "Frac" },
      { key: "operationMode", label: "Operation (1:A+B, 2:A-B, 3:|A-B|)", min: 1, max: 3, step: 1, defaultValue: 1, unit: "op", description: "Mathematical operation between position vectors.", symbol: "Op" },
    ],
    liveOutputs: [
      { key: "finalPosition", label: "Resulting Position", formulaStr: "op === 2 ? A - B : op === 3 ? Math.abs(A - B) : A + B", unit: "point", description: "Landing coordinate on the number line." },
      { key: "distanceFromZero", label: "Absolute Value |Result|", formulaStr: "Math.abs(result)", unit: "units", description: "Direct distance from origin (0) without sign." },
      { key: "jumpDirection", label: "Movement Vector", formulaStr: "B >= 0 ? 'Right (+)' : 'Left (-)'", unit: "dir", description: "Direction of movement along the number line." }
    ],
    cherryObservation: {
      hinglishGuide: "Dekho beta! Zero (0) ke right side par positive numbers (+1, +2, +3...) hote hain aur left side par negative numbers (-1, -2, -3...) hote hain! Jab hum positive number add karte hain, toh RIGHT taraf chalte hain; aur jab negative number add karte hain, toh LEFT taraf chalte hain!",
      keyRuleLaw: "Properties of Integers and Number Line Geometry",
      examTrap: "Double Negative Rule: Subtracting a negative number is the same as adding a positive number: 2 - (-5) = 2 + 5 = 7 (Moving 5 steps to the RIGHT)!",
      whatToObserve: [
        "Positive step right movement deta hai, Negative step left movement deta hai.",
        "Origin (0) se kisi bhi point ki direct geometric distance uska absolute value |x| hoti hai.",
        "Fraction ticks show karte hain ki kisi bhi do integers ke beech anant (infinite) rational numbers hote hain!"
      ],
      proTip: "Ancient Indian mathematicians Brahmagupta and Aryabhata gave the world zero and foundational rules for negative numbers ('Debts' vs 'Fortunes')!"
    },
    visualTheme: {
      primaryColor: "#8b5cf6",
      accentColor: "#ec4899",
      bgTheme: "slate"
    }
  },

  "bohr atomic model": {
    id: "sim-bohr-atomic-model",
    topic: "Bohr's Atomic Model & Shells",
    title: "Bohr's Atomic Model & Electron Shells",
    hindiTitle: "बोहर का परमाणु मॉडल एवं इलेक्ट्रॉनिक विन्यास",
    subject: "chemistry",
    grade: "Class 9",
    category: "Atomic Structure",
    conceptFormula: "2n^2 \\quad (K=2, L=8, M=18), \\quad r_n = 0.529 \\frac{n^2}{Z} \\text{ Å}, \\quad E_n = -13.6 \\frac{Z^2}{n^2} \\text{ eV}",
    secondaryFormulas: [
      { label: "Bohr Quantization of Angular Momentum", formula: "m v r = n \\frac{h}{2\\pi}" },
      { label: "Photon Emission/Absorption Energy", formula: "\\Delta E = E_2 - E_1 = h\\nu = \\frac{hc}{\\lambda}" },
      { label: "Bohr Orbit Radius Formula", formula: "r_n = 0.529 \\frac{n^2}{Z} \\text{ Å}" }
    ],
    simulationType: "bohr_atomic_shells",
    description: "Explore atomic orbitals (K, L, M, N), electron configuration (2n² rule), and photon excitation/emission spectra across elements from Hydrogen (Z=1) to Calcium (Z=20).",
    parameters: [
      { key: "atomicNumber", label: "Atomic Number (Z)", min: 1, max: 20, step: 1, defaultValue: 6, unit: "Z", description: "Select element: 1=H, 2=He, 6=C, 8=O, 11=Na, 17=Cl, 20=Ca.", symbol: "Z" },
      { key: "excitationLevel", label: "Energy Excitation (n)", min: 1, max: 4, step: 1, defaultValue: 1, unit: "n", description: "Promote outer electron to higher energy quantum shell (n=1 to n=4).", symbol: "n" },
      { key: "orbitSpeed", label: "Orbit Speed Rate", min: 0.5, max: 2.5, step: 0.5, defaultValue: 1.0, unit: "x", description: "Animation speed multiplier for orbiting electrons.", symbol: "ω" }
    ],
    liveOutputs: [
      { key: "elementName", label: "Element & Symbol", formulaStr: "Element(Z)", unit: "", description: "Chemical name and IUPAC symbol of selected element." },
      { key: "electronConfig", label: "Shell Config (K,L,M,N)", formulaStr: "Shells", unit: "e⁻", description: "Electron distribution in K, L, M, N energy levels." },
      { key: "valenceElectrons", label: "Valence Electrons", formulaStr: "Outer e⁻", unit: "e⁻", description: "Number of electrons in the outermost valence shell." },
      { key: "groundEnergy", label: "Bohr Energy Level (Eₙ)", formulaStr: "-13.6 * Z² / n²", unit: "eV", description: "Quantum energy of the outermost active shell." }
    ],
    cherryObservation: {
      hinglishGuide: "Bohr's Postulate ke anusaar electrons fixed stationary circular orbits me ghoomte hain bina energy radiate kiye! Maximum capacity 2n² rule follow karti hai: K shell (n=1) = 2 electrons, L shell (n=2) = 8 electrons, M shell (n=3) = 8/18 electrons! Jab electron bahar n=3 se n=2 me drop hota hai, tab photon emit hota hai!",
      keyRuleLaw: "Bohr's Quantum Postulates & Bohr-Bury Scheme (2n² rule)",
      examTrap: "Common Mistake: Outer shell me kabhi bhi 8 se zyada electrons nahi ho sakte (Octet Rule), chahe uski total theoretical capacity 18 ya 32 ho (jaise Calcium Z=20 me 2, 8, 8, 2 hota hai, na ki 2, 8, 10)!",
      whatToObserve: [
        "Z badhane se new electrons successive K, L, M, N shells me fill hote hain.",
        "Excitation level badhane par electron higher orbit par jump karta hai absorbing energy.",
        "De-excitation par colored photon wave packet outward radiate hota hai."
      ],
      proTip: "Atomic radius rₙ ∝ n²/Z hota hai, isliye shell number badhane se orbit ka size tezi se expand hota hai!"
    },
    visualTheme: {
      primaryColor: "#06b6d4",
      accentColor: "#a855f7",
      bgTheme: "slate"
    }
  },

  "chemical reaction kinetics": {
    id: "sim-reaction-kinetics",
    topic: "Chemical Kinetics & Collision Theory",
    title: "Chemical Reaction Kinetics & Collision Theory",
    hindiTitle: "रासायनिक अभिक्रिया दर एवं संघट्ट सिद्धांत",
    subject: "chemistry",
    grade: "Class 12",
    category: "Chemical Kinetics",
    conceptFormula: "k = A e^{-\\frac{E_a}{RT}}, \\quad \\text{Rate} = k [A]^m [B]^n, \\quad t_{1/2} = \\frac{0.693}{k}",
    secondaryFormulas: [
      { label: "Arrhenius Rate Equation", formula: "k = A \\exp\\left(-\\frac{E_a}{RT}\\right)" },
      { label: "First Order Integrated Rate Law", formula: "\\ln[A]_t = \\ln[A]_0 - k t" },
      { label: "Activation Energy with Catalyst", formula: "E_a' < E_a \\implies k_{\\text{cat}} \\gg k_{\\text{uncat}}" }
    ],
    simulationType: "chemical_kinetics",
    description: "Witness molecular collision dynamics in real-time. Adjust temperature (T), reactant concentration, and catalyst to see effective collisions, activation energy barrier, and product formation.",
    parameters: [
      { key: "temperature", label: "Temperature (T)", min: 273, max: 423, step: 10, defaultValue: 300, unit: "K", description: "Absolute temperature of the reaction vessel (0°C to 150°C).", symbol: "T" },
      { key: "concentration", label: "Reactant Conc. [A]", min: 0.5, max: 3.0, step: 0.25, defaultValue: 1.5, unit: "M", description: "Initial molar concentration of reactant molecules.", symbol: "[A]" },
      { key: "catalyst", label: "Catalyst (1:Present, 0:None)", min: 0, max: 1, step: 1, defaultValue: 0, unit: "state", description: "Add positive catalyst to lower activation energy barrier Ea.", symbol: "Cat" },
      { key: "activationEnergy", label: "Base Activation Energy (Eₐ)", min: 30, max: 90, step: 5, defaultValue: 55, unit: "kJ/mol", description: "Minimum energy threshold required for productive chemical reaction.", symbol: "Eₐ" }
    ],
    liveOutputs: [
      { key: "rateConstant", label: "Rate Constant (k)", formulaStr: "A * exp(-Ea / RT)", unit: "s⁻¹", description: "Specific reaction velocity constant from Arrhenius law." },
      { key: "reactionVelocity", label: "Reaction Rate (R)", formulaStr: "k * [A]", unit: "M/s", description: "Speed of disappearance of reactants / appearance of products." },
      { key: "effectiveFraction", label: "Effective Collisions", formulaStr: "exp(-Ea / RT) * 100", unit: "%", description: "Percentage of total collisions possessing energy >= Ea." },
      { key: "halfLife", label: "Half-Life Period (t½)", formulaStr: "0.693 / k", unit: "s", description: "Time taken for reactant concentration to reduce to 50%." }
    ],
    cherryObservation: {
      hinglishGuide: "Arrhenius Equation k = A e^(-Ea/RT) kehti hai ki temperature badhane par molecules ki kinetic energy badhti hai aur effective collisions tezi se badhte hain! Catalyst add karne se reaction ka alternative path banta hai with LOWER Activation Energy (Ea), jisse reaction bina temperature badhaye 10-100 guna tez ho jaati hai!",
      keyRuleLaw: "Collision Theory of Chemical Reactions & Arrhenius Law",
      examTrap: "Exam Trap: Catalyst reaction ki Activation Energy (Ea) ko kam karta hai aur rate of forward and backward reactions dono ko equally badhata hai, lekin Equilibrium Constant (K_eq) aur Gibbs Free Energy (ΔG) ko bilkul change nahi karta!",
      whatToObserve: [
        "Temperature slider badhane se molecules tezi se bounce karte hain aur collision frequency badhti hai.",
        "Catalyst ON karne par reaction barrier chhota ho jata hai aur reaction rate spike hota hai.",
        "Concentration badhane se number of particles per unit volume badh jaate hain."
      ],
      proTip: "Rule of Thumb: For most chemical reactions, temperature me har 10°C (10 K) rise karne par reaction rate lagbhag DOUBLE ho jaata hai (Temperature Coefficient ≈ 2)!"
    },
    visualTheme: {
      primaryColor: "#f97316",
      accentColor: "#ef4444",
      bgTheme: "dark"
    }
  },

  "human heart circulation": {
    id: "sim-heart-circulation",
    topic: "Human Heart & Double Circulation",
    title: "Human Heart & Double Blood Circulation",
    hindiTitle: "मानव हृदय एवं दोहरा रक्त परिसंचरण",
    subject: "biology",
    grade: "Class 10",
    category: "Human Physiology & Circulation",
    conceptFormula: "\\text{Cardiac Output} = \\text{Stroke Volume} \\times \\text{Heart Rate} = 70\\text{ mL} \\times \\text{HR}, \\quad \\text{BP} = \\frac{120}{80} \\text{ mmHg}",
    secondaryFormulas: [
      { label: "Cardiac Output Formula", formula: "CO = SV \\times HR = 0.070 \\times HR \\text{ L/min}" },
      { label: "Mean Arterial Pressure (MAP)", formula: "MAP = \\text{Diastolic} + \\frac{1}{3}(\\text{Systolic} - \\text{Diastolic})" },
      { label: "Blood Flow Rate (Poiseuille)", formula: "Q = \\frac{\\Delta P \\pi r^4}{8 \\eta L}" }
    ],
    simulationType: "heart_circulation",
    description: "Interactive 4-chamber human heart with synchronized atrial/ventricular pumping, tricuspid/bicuspid valve leaflets, pulmonary and systemic double loops, and live ECG monitor.",
    parameters: [
      { key: "heartRate", label: "Heart Rate (BPM)", min: 50, max: 160, step: 2, defaultValue: 72, unit: "BPM", description: "Beats per minute regulated by the SA (Sinoatrial) Pacemaker node.", symbol: "HR" },
      { key: "exerciseLevel", label: "Activity (1:Rest, 2:Jog, 3:Sprint)", min: 1, max: 3, step: 1, defaultValue: 1, unit: "level", description: "Physical exertion state demanding higher cardiac output.", symbol: "Act" },
      { key: "vascularResistance", label: "Vascular Resistance", min: 80, max: 140, step: 5, defaultValue: 100, unit: "%", description: "Arterial systemic peripheral resistance affecting Blood Pressure.", symbol: "TPR" }
    ],
    liveOutputs: [
      { key: "cardiacOutput", label: "Cardiac Output (CO)", formulaStr: "(70 * HR) / 1000", unit: "L/min", description: "Total volume of oxygenated blood pumped per minute." },
      { key: "bloodPressure", label: "Blood Pressure (BP)", formulaStr: "120/80 scaled", unit: "mmHg", description: "Arterial pressure during Systole / Diastole." },
      { key: "cyclePhase", label: "Cardiac Cycle Phase", formulaStr: "Systole / Diastole", unit: "", description: "Current stage: Ventricular Pumping vs Chamber Filling." },
      { key: "oxygenSaturation", label: "Arterial O₂ Saturation", formulaStr: "98 - 99", unit: "%", description: "Oxygen saturation in systemic arterial blood." }
    ],
    cherryObservation: {
      hinglishGuide: "Human heart 4-chambered hota hai jisme pure oxygenated blood aur deoxygenated blood kabhi mix nahi hote! Isko DOUBLE CIRCULATION bolte hain: 1. Pulmonary Loop (Right Ventricle se Lungs tak aur back to Left Atrium) aur 2. Systemic Loop (Left Ventricle se poori body tissues tak aur back to Right Atrium)! SA Node hamare dil ka natural pacemaker hai!",
      keyRuleLaw: "Double Circulation & Cardiac Cycle Mechanics",
      examTrap: "Board Exam Trap: Pulmonary Artery deoxygenated blood carry karti hai (heart se lungs), jabki Pulmonary Vein oxygenated blood carry karti hai (lungs se heart)! Ye dono arteries aur veins ke standard rule ka exception hain!",
      whatToObserve: [
        "Heart Rate badhane par chambers ki rhythmic contraction tezi se animate hoti hai.",
        "Tricuspid aur Bicuspid (Mitral) valves ventricles ke contract hone par band hokar 'LUB' sound banate hain.",
        "Semilunar valves aorta aur pulmonary trunk ke base par band hone par 'DUB' sound banate hain."
      ],
      proTip: "Normal resting blood pressure 120/80 mmHg hota hai, jisme 120 mmHg Systolic pressure (ventricle contraction) aur 80 mmHg Diastolic pressure (chamber relaxation) hota hai!"
    },
    visualTheme: {
      primaryColor: "#ef4444",
      accentColor: "#3b82f6",
      bgTheme: "slate"
    }
  },

  "osmosis and plasmolysis": {
    id: "sim-osmosis-plasmolysis",
    topic: "Osmosis, Turgidity & Plasmolysis",
    title: "Osmosis, Turgor Pressure & Plasmolysis",
    hindiTitle: "परासरण, स्फीति दाब एवं जीवद्रव्यकुंचन (Plasmolysis)",
    subject: "biology",
    grade: "Class 9",
    category: "Cell Biology & Transport",
    conceptFormula: "\\Psi_w = \\Psi_s + \\Psi_p, \\quad \\text{Net Water Flow: High } \\Psi_w \\to \\text{Low } \\Psi_w",
    secondaryFormulas: [
      { label: "Water Potential Equation", formula: "\\Psi_w = \\Psi_s + \\Psi_p" },
      { label: "Solute Potential (Van 't Hoff)", formula: "\\Psi_s = -i C R T" },
      { label: "Turgor Pressure Condition", formula: "\\text{Turgid: } \\Psi_p > 0, \\quad \\text{Flaccid: } \\Psi_p = 0" }
    ],
    simulationType: "osmosis_cells",
    description: "Investigate selective permeability, endosmosis, exosmosis, and plasmolysis. Compare plant cells (with rigid cellulose wall) against animal red blood cells (RBCs) across varying salinity.",
    parameters: [
      { key: "soluteConcentration", label: "External Solute (NaCl %)", min: 0, max: 10, step: 0.5, defaultValue: 0.9, unit: "%", description: "Saline concentration of surrounding beaker solution (0%=Pure water, 0.9%=Isotonic, >2%=Hypertonic).", symbol: "C" },
      { key: "cellType", label: "Cell Model (1:Plant, 2:Animal RBC)", min: 1, max: 2, step: 1, defaultValue: 1, unit: "type", description: "1 = Onion Peel Plant Cell (with wall), 2 = Animal Red Blood Cell (no wall).", symbol: "Type" },
      { key: "elapsedTime", label: "Incubation Time (mins)", min: 1, max: 20, step: 1, defaultValue: 5, unit: "min", description: "Duration cell has been exposed to the surrounding osmotic solution.", symbol: "t" }
    ],
    liveOutputs: [
      { key: "solutionTonicity", label: "Solution Tonicity", formulaStr: "Hypotonic / Isotonic / Hypertonic", unit: "", description: "Relative osmotic pressure compared to intracellular cytoplasm (0.9%)." },
      { key: "cellState", label: "Cell State & Morphology", formulaStr: "Turgid / Flaccid / Plasmolyzed / Lysed", unit: "", description: "Physical shape, membrane integrity, and vacuole volume." },
      { key: "turgorPressure", label: "Turgor Pressure (Ψₚ)", formulaStr: "Pressure on wall", unit: "kPa", description: "Hydrostatic pressure exerted by protoplast against cellulose cell wall." },
      { key: "waterFluxDir", label: "Net Water Movement", formulaStr: "Inflow / Outflow / Equil", unit: "", description: "Direction of osmosis across the semipermeable plasma membrane." }
    ],
    cherryObservation: {
      hinglishGuide: "Osmosis semi-permeable membrane ke through water molecules ka movement hai high water potential (dilute) se low water potential (concentrated) ki taraf! Hypotonic solution (pure water) me plant cell pani soak karke TURGID ho jaata hai, aur rigid cell wall use phatne (burst) se bachati hai! Lekin Hypertonic solution (namak ka paani) me exosmosis ki wajah se cytoplasm shrink hokar cell wall se alag ho jata hai - isko PLASMOLYSIS kehte hain!",
      keyRuleLaw: "Laws of Osmosis & Water Potential (Ψ_w = Ψ_s + Ψ_p)",
      examTrap: "Crucial Difference: Animal cells (jaise RBC) me cell wall nahi hoti! Isliye hypotonic solution me RBC swell hokar BURST (Hemolysis/Lysis) ho jaata hai, jabki plant cell me turgor pressure cell wall ko counterbalance karta hai!",
      whatToObserve: [
        "Solute % ko 0% (Hypotonic) karne par water cell ke andar rush karta hai (Endosmosis).",
        "Solute % ko 5-10% (Hypertonic) karne par vacuole shrink hota hai aur plasma membrane contract hoti hai (Plasmolysis).",
        "0.9% NaCl standard isotonic physiological saline hota hai jahan cell normal rahta hai."
      ],
      proTip: "Achar (Pickles) aur Jam me high salt/sugar daalna ek biological preservative hai kyunki bacteria hypertonic environment me plasmolysis se mar jaate hain!"
    },
    visualTheme: {
      primaryColor: "#10b981",
      accentColor: "#06b6d4",
      bgTheme: "slate"
    }
  },

  "quadratic parabola functions": {
    id: "sim-quadratic-parabola",
    topic: "Quadratic Equations & Graphs",
    title: "Quadratic Functions & Parabola Geometry",
    hindiTitle: "द्विघात फलन एवं परवलय (Parabola) ज्यामिति",
    subject: "mathematics",
    grade: "Class 10",
    category: "Coordinate Geometry & Algebra",
    conceptFormula: "y = ax^2 + bx + c, \\quad D = b^2 - 4ac, \\quad x_v = -\\frac{b}{2a}, \\quad y_v = -\\frac{D}{4a}",
    secondaryFormulas: [
      { label: "Roots Formula (Quadratic)", formula: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
      { label: "Axis of Symmetry", formula: "x = -\\frac{b}{2a}" }
    ],
    simulationType: "quadratic_parabola",
    description: "Interactive Cartesian graphing tool for quadratic polynomials y = ax² + bx + c. Real-time vertex calculation, axis of symmetry, focus, directrix, and discriminant D roots classification.",
    parameters: [
      { key: "coeffA", label: "Leading Coeff (a)", min: -3, max: 3, step: 0.25, defaultValue: 1, unit: "coeff", description: "Curvature & direction: a > 0 opens UP (concave up), a < 0 opens DOWN.", symbol: "a" },
      { key: "coeffB", label: "Linear Coeff (b)", min: -6, max: 6, step: 0.5, defaultValue: -2, unit: "coeff", description: "Horizontal shift and slope at y-intercept.", symbol: "b" },
      { key: "coeffC", label: "Constant Term (c)", min: -6, max: 6, step: 0.5, defaultValue: -3, unit: "coeff", description: "y-intercept value where parabola crosses the y-axis (0, c).", symbol: "c" }
    ],
    liveOutputs: [
      { key: "discriminant", label: "Discriminant (D)", formulaStr: "b^2 - 4ac", unit: "", description: "D > 0: 2 Real Roots, D = 0: 1 Equal Root, D < 0: Complex/No Real Roots." },
      { key: "vertexCoords", label: "Vertex (h, k)", formulaStr: "(-b/2a, -D/4a)", unit: "pt", description: "Minimum (a>0) or Maximum (a<0) turning point coordinate." },
      { key: "axisSymmetry", label: "Axis of Symmetry", formulaStr: "x = -b / (2a)", unit: "line", description: "Vertical mirror axis dividing the parabola into symmetric halves." },
      { key: "rootsNature", label: "Nature of Roots", formulaStr: "D > 0 ? '2 Real Distinct' : D === 0 ? '1 Real Equal' : 'Imaginary'", unit: "", description: "Intersection points with the x-axis." }
    ],
    cherryObservation: {
      hinglishGuide: "Parabola ek U-shaped curve hota hai! Leading coefficient 'a' decide karta hai ki muh UPAR khulega (agar a > 0 ho) ya NEECHE khulega (agar a < 0 ho)! Discriminant D = b² - 4ac decide karta hai ki graph x-axis ko kitni baar kaatega: D > 0 par 2 baar, D = 0 par theek 1 baar (touch karega), aur D < 0 par bilkul nahi kaatega!",
      keyRuleLaw: "Quadratic Formula & Parabola Geometry",
      examTrap: "Common Mistake: Agar a = 0 ho jaye toh yeh quadratic nahi balke ek straight linear line y = bx + c ban jaati hai! Parabola ka turning point hamesha x = -b/(2a) par hota hai.",
      whatToObserve: [
        "'a' ko positive se negative badalkar dekho: parabola turant flip ho jaata hai.",
        "'c' ko badalna parabola ko vertical direction me upar/neeche shift karta hai.",
        "D < 0 hone par parabola poora ka poora x-axis ke upar ya neeche float karta hai bina x-axis ko chhue."
      ],
      proTip: "Telescope mirrors, car headlights aur satellite dishes sab parabolic shape ke hote hain kyunki parallel light rays focus par aakar milti hain!"
    },
    visualTheme: {
      primaryColor: "#6366f1",
      accentColor: "#ec4899",
      bgTheme: "slate"
    }
  },

  "pythagoras theorem geometry": {
    id: "sim-pythagoras-theorem",
    topic: "Pythagoras Theorem & Geometry",
    title: "Pythagoras Theorem & Visual Dissection",
    hindiTitle: "पाइथागोरस प्रमेय (बोधायन प्रमेय) एवं ज्यामितीय प्रमाण",
    subject: "mathematics",
    grade: "Class 7",
    category: "Geometry & Trigonometry",
    conceptFormula: "a^2 + b^2 = c^2, \\quad c = \\sqrt{a^2 + b^2}, \\quad \\text{Area}_A + \\text{Area}_B = \\text{Area}_C",
    secondaryFormulas: [
      { label: "Hypotenuse Length", formula: "c = \\sqrt{a^2 + b^2}" },
      { label: "Baudhayana Shulba Sutra", formula: "\\text{दीर्घचतुरश्रस्याक्ष्णया रज्जुः पार्श्वमानीं तिर्यङ्मानीं च...}" }
    ],
    simulationType: "pythagoras_geometry",
    description: "Dynamic geometric demonstration of Pythagoras theorem. Right triangle with sides a and b generates squares a² and b² whose combined area precisely equals hypotenuse square c² with visual unit grid tiles.",
    parameters: [
      { key: "sideA", label: "Base Side (a)", min: 3, max: 12, step: 1, defaultValue: 6, unit: "units", description: "Horizontal base leg length of the right triangle.", symbol: "a" },
      { key: "sideB", label: "Perpendicular Side (b)", min: 3, max: 12, step: 1, defaultValue: 8, unit: "units", description: "Vertical altitude leg length of the right triangle.", symbol: "b" },
      { key: "dissectProof", label: "Visual Mode (1:Tiles, 2:Proof Flow)", min: 1, max: 2, step: 1, defaultValue: 1, unit: "mode", description: "1 = Unit square tiles grid, 2 = Continuous area conservation flow.", symbol: "Mode" }
    ],
    liveOutputs: [
      { key: "hypotenuseC", label: "Hypotenuse (c)", formulaStr: "Math.sqrt(a*a + b*b).toFixed(2)", unit: "units", description: "Longest side opposite the 90° right angle." },
      { key: "areaA", label: "Square on Base (a²)", formulaStr: "a * a", unit: "sq units", description: "Area of square constructed on base leg." },
      { key: "areaB", label: "Square on Height (b²)", formulaStr: "b * b", unit: "sq units", description: "Area of square constructed on altitude leg." },
      { key: "sumAreas", label: "Combined Area (a² + b²)", formulaStr: "a*a + b*b", unit: "sq units", description: "Total area equal to square on hypotenuse c²." }
    ],
    cherryObservation: {
      hinglishGuide: "Right-angled triangle me 90 degree ke samne wali sabse lambi side ko HYPOTENUSE (कण) bolte hain! Base par bane square ka area (a²) aur Perpendicular par bane square ka area (b²) milkar Hypotenuse par bane square ke area (c²) ke barabar hota hai: a² + b² = c²!",
      keyRuleLaw: "Pythagorean Theorem & Indian Sulba Sutras",
      examTrap: "Yeh theorem SIRF aur SIRF Right-Angled Triangle (jahan ek angle theek 90° ho) par lagu hota hai! Kisi acute ya obtuse triangle me direct a² + b² = c² nahi lagta.",
      whatToObserve: [
        "Base 6 aur Height 8 hone par Hypotenuse exact 10 nikalta hai (Pythagorean Triplet 6, 8, 10).",
        "Square a² ke 36 blocks aur Square b² ke 64 blocks theek milkar c² ke 100 blocks banate hain!",
        "Sides ko change karke Pythagorean triplets (3-4-5, 5-12-13, 6-8-10) discover karein."
      ],
      proTip: "Ancient India me Maharshi Baudhayana ne Shulba Sutras me Pythagoras se sadiyon pehle yahi niyam vedic yajna vediyon ke nirmaan ke liye likha tha!"
    },
    visualTheme: {
      primaryColor: "#3b82f6",
      accentColor: "#10b981",
      bgTheme: "slate"
    }
  },

  "normal gaussian distribution": {
    id: "sim-normal-distribution",
    topic: "Normal Distribution & Statistics",
    title: "Normal (Gaussian) Distribution & 68-95-99.7 Rule",
    hindiTitle: "प्रसामान्य (गॉसियन) बंटन एवं 68-95-99.7 नियम",
    subject: "mathematics",
    grade: "Class 11",
    category: "Probability & Statistics",
    conceptFormula: "f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}, \\quad z = \\frac{x - \\mu}{\\sigma}",
    secondaryFormulas: [
      { label: "Empirical Rule (68-95-99.7)", formula: "P(\\mu - \\sigma \\le X \\le \\mu + \\sigma) \\approx 68.27\\%" },
      { label: "Total Probability Area", formula: "\\int_{-\\infty}^{\\infty} f(x) dx = 1" }
    ],
    simulationType: "normal_distribution",
    description: "Interactive continuous probability density function (PDF) Bell Curve. Control mean μ, standard deviation σ, and visualize the empirical 68-95-99.7% confidence intervals with live sample generation.",
    parameters: [
      { key: "mean", label: "Mean Center (μ)", min: -10, max: 10, step: 1, defaultValue: 0, unit: "μ", description: "Arithmetic average / center axis of symmetry of the bell curve.", symbol: "μ" },
      { key: "stdDev", label: "Std Deviation (σ)", min: 0.5, max: 4.0, step: 0.25, defaultValue: 1.5, unit: "σ", description: "Spread / dispersion measure: smaller σ makes peak tall and narrow, larger σ flattens curve.", symbol: "σ" },
      { key: "sampleSize", label: "Sample Points (N)", min: 100, max: 1000, step: 100, defaultValue: 400, unit: "pts", description: "Number of random stochastic data points drawn from N(μ, σ²).", symbol: "N" },
      { key: "shadeInterval", label: "Shade Interval (1:1σ, 2:2σ, 3:3σ)", min: 1, max: 3, step: 1, defaultValue: 1, unit: "rule", description: "1 = μ±1σ (68.3%), 2 = μ±2σ (95.4%), 3 = μ±3σ (99.7%).", symbol: "kσ" }
    ],
    liveOutputs: [
      { key: "peakHeight", label: "Peak Amplitude f(μ)", formulaStr: "1 / (sigma * Math.sqrt(2 * Math.PI))", unit: "", description: "Maximum height of Gaussian bell curve at x = μ." },
      { key: "coveredArea", label: "Confidence Interval %", formulaStr: "interval === 1 ? '68.27%' : interval === 2 ? '95.45%' : '99.73%'", unit: "%", description: "Empirical percentage of normal population within the shaded region." },
      { key: "leftBound", label: "Lower Bound (μ - kσ)", formulaStr: "mu - k * sigma", unit: "", description: "Left cutoff coordinate of shaded confidence interval." },
      { key: "rightBound", label: "Upper Bound (μ + kσ)", formulaStr: "mu + k * sigma", unit: "", description: "Right cutoff coordinate of shaded confidence interval." }
    ],
    cherryObservation: {
      hinglishGuide: "Duniya ke zyadaatar natural data - jaise students ke test marks, logon ki height, blood pressure - sabhi is BELL CURVE (Ghanti jaisa aakar) ko follow karte hain! Beech me MEAN (μ) hota hai jahan sabse zyada log hote hain. Standard deviation (σ) curve ki phailawat (spread) batata hai: μ ke aas paas ±1σ me 68% data hota hai, ±2σ me 95% data hota hai, aur ±3σ me lagbhag poora 99.7% data aa jaata hai!",
      keyRuleLaw: "Central Limit Theorem & Gaussian PDF",
      examTrap: "Total area under the normal curve hamesha strictly equal to 1 (ya 100%) hota hai, chahe μ ya σ kuch bhi ho!",
      whatToObserve: [
        "Jab Standard Deviation σ badhate hain, curve chipta (flat) ho jata hai lekin total area 1 hi rehta hai.",
        "Mean μ ko change karne par curve bina shape badle left ya right shift hota hai.",
        "Shade interval 1σ se 2σ aur 3σ toggle karke dekho kaise 68.3% -> 95.4% -> 99.7% area cover hota hai."
      ],
      proTip: "Carl Friedrich Gauss ne is curve ko develop kiya tha, isliye ise Gaussian Distribution bhi kehte hain!"
    },
    visualTheme: {
      primaryColor: "#0284c7",
      accentColor: "#8b5cf6",
      bgTheme: "slate"
    }
  },

  "faraday electromagnetic induction": {
    id: "sim-faraday-induction",
    topic: "Faraday's Law of Electromagnetic Induction",
    title: "Faraday's Law & Electromagnetic Induction",
    hindiTitle: "फैराडे का विद्युत चुम्बकीय प्रेरण नियम एवं लेन्ज़ का नियम",
    subject: "physics",
    grade: "Class 12",
    category: "Electromagnetism",
    conceptFormula: "\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}, \\quad \\Phi_B = B \\cdot A \\cos\\theta, \\quad I = \\frac{\\mathcal{E}}{R}",
    secondaryFormulas: [
      { label: "Magnetic Flux", formula: "\\Phi_B = \\vec{B} \\cdot \\vec{A} = B A \\cos\\theta" },
      { label: "Lenz's Law (Negative Sign)", formula: "\\text{Induced current opposes the change in magnetic flux producing it.}" }
    ],
    simulationType: "faraday_induction",
    description: "Move a cylindrical bar magnet through a multi-turn solenoid coil. Observe magnetic field lines, induced EMF voltage on a center-zero galvanometer, Lenz's law opposing force, and light bulb luminescence.",
    parameters: [
      { key: "magnetPos", label: "Magnet Position (X)", min: -100, max: 100, step: 5, defaultValue: -60, unit: "mm", description: "Position of bar magnet relative to solenoid coil center (0 = inside coil).", symbol: "x" },
      { key: "coilTurns", label: "Number of Coil Turns (N)", min: 1, max: 4, step: 1, defaultValue: 3, unit: "turns", description: "Number of solenoid loop turns (proportional to induced EMF).", symbol: "N" },
      { key: "magnetSpeed", label: "Oscillation Speed (v)", min: 0, max: 5, step: 0.5, defaultValue: 2, unit: "m/s", description: "Speed of magnet motion (faster motion induces higher dΦ/dt voltage).", symbol: "v" },
      { key: "magnetPolarity", label: "Polarity (1:N-S, -1:S-N)", min: -1, max: 1, step: 2, defaultValue: 1, unit: "dir", description: "Magnet orientation: +1 = North pole entering first, -1 = South pole entering first.", symbol: "Pole" }
    ],
    liveOutputs: [
      { key: "magneticFlux", label: "Magnetic Flux (Φ_B)", formulaStr: "flux.toFixed(3)", unit: "Wb", description: "Amount of magnetic field lines threading through the coil area." },
      { key: "inducedEMF", label: "Induced EMF (ℰ)", formulaStr: "(-turns * dFlux_dt).toFixed(2)", unit: "V", description: "Electromotive force induced across coil terminals (Lenz's law)." },
      { key: "galvanoDeflect", label: "Galvanometer Deflection", formulaStr: "deflection.toFixed(1)", unit: "deg", description: "Needle angle on center-zero microammeter (left/right)." },
      { key: "bulbBrightness", label: "Bulb Luminosity", formulaStr: "Math.min(100, (EMF * EMF * 8)).toFixed(0)", unit: "%", description: "Electrical power dissipated in the load bulb." }
    ],
    cherryObservation: {
      hinglishGuide: "Jab bhi kisi coil ke paas magnet ko MOVE karte hain, tab coil me se guzarne wali Magnetic Flux (Φ_B) badalti hai! Faraday ke niyam ke anusaar, flux badalne ki speed (dΦ/dt) jitni tez hogi, utna hi zyada INDUCED VOLTAGE (EMF) paida hoga! Lenz ke niyam ke anusar yeh induced current hamesha magnet ki motion ka VIRODH (oppose) karta hai!",
      keyRuleLaw: "Faraday-Neumann-Lenz Law of Electromagnetic Induction",
      examTrap: "Agar magnet coil ke andar stationary (ruka hua) hai chahe kitna bhi powerful ho, tab dΦ/dt = 0 hota hai aur koi bhi EMF ya current produce nahi hota!",
      whatToObserve: [
        "Magnet ko coil ke andar tezi se ghusane par galvanometer needle ek taraf deflect hoti hai, aur bahar nikalne par theek ulti taraf!",
        "Coil ke turns (N) 1 se 4 badhane par induced voltage N guna badh jaata hai.",
        "North pole ki jagah South pole aage karne par current ka direction turant reverse ho jaata hai."
      ],
      proTip: "Duniya ke saare hydro-electric power plants, wind turbines aur thermal generators isi Faraday ke siddhant par kaam karke bijli banate hain!"
    },
    visualTheme: {
      primaryColor: "#ef4444",
      accentColor: "#3b82f6",
      bgTheme: "slate"
    }
  },

  "photoelectric effect experiment": {
    id: "sim-photoelectric-effect",
    topic: "Einstein's Photoelectric Effect",
    title: "Einstein's Photoelectric Effect & Stopping Potential",
    hindiTitle: "आइंस्टीन का प्रकाश-विद्युत प्रभाव एवं निरोधी विभव (Stopping Potential)",
    subject: "physics",
    grade: "Class 12",
    category: "Modern Physics & Quantum Mechanics",
    conceptFormula: "K_{\\max} = h\\nu - \\Phi_0 = e V_0, \\quad E = \\frac{hc}{\\lambda}, \\quad \\nu_0 = \\frac{\\Phi_0}{h}",
    secondaryFormulas: [
      { label: "Einstein's Photoelectric Equation", formula: "h\\nu = \\Phi_0 + \\frac{1}{2}m v_{\\max}^2" },
      { label: "Stopping Potential", formula: "V_0 = \\frac{h}{e}\\nu - \\frac{\\Phi_0}{e}" }
    ],
    simulationType: "photoelectric_effect",
    description: "Shine monochromatic light onto a photosensitive emitter metal plate in an evacuated vacuum quartz tube. Vary photon wavelength λ, intensity, and retarding stopping voltage V to verify Einstein's Nobel prize-winning quantum theory.",
    parameters: [
      { key: "wavelength", label: "Light Wavelength (λ)", min: 200, max: 750, step: 10, defaultValue: 380, unit: "nm", description: "Wavelength of incident photon beam: UV (<400nm), Violet (400nm) to Red (700nm).", symbol: "λ" },
      { key: "intensity", label: "Light Intensity (Flux)", min: 10, max: 100, step: 10, defaultValue: 60, unit: "%", description: "Number of photons striking the metal per second (affects saturation current, NOT electron energy).", symbol: "I" },
      { key: "stoppingVoltage", label: "Applied Voltage (V)", min: -4.0, max: 4.0, step: 0.2, defaultValue: 0.0, unit: "V", description: "Retarding/accelerating potential between emitter and collector plate.", symbol: "V" },
      { key: "targetMetal", label: "Target Metal (1:Cs, 2:Na, 3:Zn, 4:Cu)", min: 1, max: 4, step: 1, defaultValue: 2, unit: "metal", description: "1: Cesium (Φ₀=2.14eV), 2: Sodium (Φ₀=2.75eV), 3: Zinc (Φ₀=4.31eV), 4: Copper (Φ₀=4.70eV).", symbol: "Metal" }
    ],
    liveOutputs: [
      { key: "photonEnergy", label: "Photon Energy (hν)", formulaStr: "(1240 / lambda).toFixed(2)", unit: "eV", description: "Energy carried by each quantum packet of light." },
      { key: "workFunction", label: "Work Function (Φ₀)", formulaStr: "phi0.toFixed(2)", unit: "eV", description: "Minimum energy required to liberate an electron from metal surface." },
      { key: "maxKE", label: "Max Kinetic Energy (K_max)", formulaStr: "Math.max(0, E - phi0).toFixed(2)", unit: "eV", description: "Maximum kinetic energy of ejected photoelectrons." },
      { key: "stoppingPot", label: "Stopping Potential (V₀)", formulaStr: "Math.max(0, (E - phi0) / 1.0).toFixed(2)", unit: "V", description: "Retarding voltage needed to stop fastest electrons (Photocurrent drops to zero)." }
    ],
    cherryObservation: {
      hinglishGuide: "Albert Einstein ko 1921 ka Nobel Prize isi Photoelectric Effect ke liye mila tha! Jab photon metal par girta hai, toh agar uski energy metal ke Work Function (Φ₀) se zyada ho tabhi electron bahar niklega! Light ki INTENSITY badhane se sirf electrons ki SANKHYA (current) badhti hai, unki speed nahi! Electrons ki SPEED badhane ke liye light ki FREQUENCY badhani (wavelength kam karni) padti hai!",
      keyRuleLaw: "Einstein's Quantum Photoelectric Equation",
      examTrap: "Common Mistake: Students sochte hain ki intensity badhane se electron zyada tez bhagenge. Bilkul galat! Intensity badhane se sirf photo-current badhta hai. Kinetic energy SIRF photon ki wavelength/frequency par depend karti hai!",
      whatToObserve: [
        "Sodium par Red light (650nm, E=1.9eV) daalne par ek bhi electron nahi nikalta kyunki E < Φ₀ (2.75eV).",
        "Jaise hi wavelength UV ya Violet (380nm, E=3.26eV) karte hain, electrons tezi se anode ki taraf bhagne lagte hain!",
        "Stopping voltage ko negative karne par dekho kis voltage par current zero ho jaata hai (V₀ = K_max/e)."
      ],
      proTip: "Aaj ke saare digital cameras ke CCD sensors, solar cells aur night vision devices isi quantum photoelectric effect par chalte hain!"
    },
    visualTheme: {
      primaryColor: "#a855f7",
      accentColor: "#06b6d4",
      bgTheme: "slate"
    }
  },

  "water electrolysis hofmann": {
    id: "sim-water-electrolysis",
    topic: "Electrolysis of Water & Faraday's Law",
    title: "Electrolysis of Water & Hofmann Voltameter",
    hindiTitle: "जल का विद्युत अपघटन (Hofmann Voltameter) एवं 2:1 गैस अनुपात",
    subject: "chemistry",
    grade: "Class 10",
    category: "Electrochemistry & Chemical Reactions",
    conceptFormula: "2\\text{H}_2\\text{O}(l) \\xrightarrow{\\text{Electricity}} 2\\text{H}_2(g) \\uparrow + \\text{O}_2(g) \\uparrow, \\quad V_{\\text{H}_2} : V_{\\text{O}_2} = 2 : 1",
    secondaryFormulas: [
      { label: "Cathode (Reduction)", formula: "4\\text{H}^+(aq) + 4e^- \\to 2\\text{H}_2(g)" },
      { label: "Anode (Oxidation)", formula: "2\\text{H}_2\\text{O}(l) \\to \\text{O}_2(g) + 4\\text{H}^+(aq) + 4e^-" },
      { label: "Faraday's Law of Electrolysis", formula: "m = Z I t = \\frac{M}{z F} I t" }
    ],
    simulationType: "water_electrolysis",
    description: "Decompose acidified water into hydrogen and oxygen gas using a Hofmann voltameter. Measure 2:1 gas volumetric ratio at cathode vs anode, observe effervescence bubbles, and conduct pop sound / glowing splint tests.",
    parameters: [
      { key: "cellVoltage", label: "DC Voltage (V)", min: 3, max: 18, step: 1.5, defaultValue: 12, unit: "V", description: "Direct current power supply potential driving electrolytic decomposition.", symbol: "V" },
      { key: "acidConcentration", label: "Acid Drops (H₂SO₄)", min: 1, max: 10, step: 1, defaultValue: 5, unit: "drops", description: "Dilute sulfuric acid catalyst to provide mobile H+ and SO4(2-) electrolyte ions.", symbol: "H+" },
      { key: "electrolysisTime", label: "Elapsed Time (t)", min: 10, max: 120, step: 10, defaultValue: 40, unit: "s", description: "Duration of continuous electric current flow.", symbol: "t" },
      { key: "testSplint", label: "Gas Spark Test (1:Off, 2:Cathode Pop, 3:Anode Rekindle)", min: 1, max: 3, step: 1, defaultValue: 1, unit: "test", description: "1: Off, 2: Hydrogen Pop Sound test at cathode, 3: Oxygen Glowing Splint rekindling at anode.", symbol: "Flame" }
    ],
    liveOutputs: [
      { key: "h2Volume", label: "Cathode Hydrogen Volume (H₂)", formulaStr: "(2 * volumeUnit).toFixed(1)", unit: "mL", description: "Hydrogen gas collected above negative cathode electrode." },
      { key: "o2Volume", label: "Anode Oxygen Volume (O₂)", formulaStr: "volumeUnit.toFixed(1)", unit: "mL", description: "Oxygen gas collected above positive anode electrode." },
      { key: "gasRatio", label: "Volume Ratio (H₂ : O₂)", formulaStr: "'2 : 1'", unit: "ratio", description: "Direct experimental proof of water chemical formula H₂O." },
      { key: "cellCurrent", label: "Electrolytic Current (I)", formulaStr: "current.toFixed(2)", unit: "A", description: "Faraday current passing through the acidified solution." }
    ],
    cherryObservation: {
      hinglishGuide: "Water (H₂O) me do hydrogen atoms aur ek oxygen atom hota hai! Isliye jab hum acidified water me se current pass karte hain, toh Cathode (Negative electrode) par HYDROGEN gas banti hai aur Anode (Positive electrode) par OXYGEN gas banti hai! Sabse khaas baat: Cathode par ikatthi hui Hydrogen ka volume Anode par ikatthi hui Oxygen ke volume ka THEEK DUGNA (2 : 1) hota hai!",
      keyRuleLaw: "Faraday's Electrolysis & Avogadro's Gas Law",
      examTrap: "Common Mistake: Pure distilled water electricity ka bad conductor hota hai! Isliye thoda dilute H₂SO₄ ya salt milana zaroori hota hai taaki mobile ions current carry kar sakein.",
      whatToObserve: [
        "Cathode tube me gas ka level Anode tube ke mukable do guna tezi se badhta hai (Ratio hamesha 2:1 rehta hai).",
        "Test Splint 2 select karke Cathode gas ke paas jalte hue matchstick lao - 'POP' sound ke sath burst hoga (Hydrogen test).",
        "Test Splint 3 select karke Anode gas ke paas bujhta hua glowing splint lao - wo turant bhadak kar jal uthega (Oxygen supports combustion)!"
      ],
      proTip: "Green Hydrogen economy me renewable solar/wind power se isi tarah clean water electrolysis karke zero-carbon fuel banaya ja raha hai!"
    },
    visualTheme: {
      primaryColor: "#0ea5e9",
      accentColor: "#10b981",
      bgTheme: "slate"
    }
  },

  "vector addition": {
    id: "sim-vector-addition",
    topic: "Vector Addition & Resolution",
    title: "Interactive Vector Addition Lab: Head-to-Tail Method",
    hindiTitle: "सदिश योग: शीर्ष-से-पूंछ एवं समान्तर चतुर्भुज विधि",
    subject: "physics",
    grade: "Class 11",
    category: "Vectors & Kinematics",
    conceptFormula: "\\vec{R} = \\vec{A} + \\vec{B}, \\quad R = \\sqrt{A^2 + B^2 + 2AB\\cos\\theta}",
    secondaryFormulas: [
      { label: "Angle of Resultant", formula: "\\tan\\alpha = \\frac{B\\sin\\theta}{A + B\\cos\\theta}" },
      { label: "Horizontal Component", formula: "R_x = A_x + B_x = A\\cos\\theta_A + B\\cos\\theta_B" },
      { label: "Vertical Component", formula: "R_y = A_y + B_y = A\\sin\\theta_A + B\\sin\\theta_B" }
    ],
    simulationType: "vector_addition",
    description: "Interactively add vectors using the Head-to-Tail Triangle and Parallelogram laws. Adjust vector lengths and direction angles to watch the resultant vector vectorially update in real time.",
    parameters: [
      { key: "vectorAMag", label: "Magnitude of Vector A (|A|)", min: 10, max: 100, step: 5, defaultValue: 50, unit: "units", description: "Length of primary vector A.", symbol: "|A|" },
      { key: "vectorAAngle", label: "Angle of Vector A (θ_A)", min: 0, max: 360, step: 5, defaultValue: 0, unit: "deg", description: "Counter-clockwise angle of Vector A from positive X-axis.", symbol: "θ_A" },
      { key: "vectorBMag", label: "Magnitude of Vector B (|B|)", min: 10, max: 100, step: 5, defaultValue: 45, unit: "units", description: "Length of secondary vector B.", symbol: "|B|" },
      { key: "vectorBAngle", label: "Angle of Vector B (θ_B)", min: 0, max: 360, step: 5, defaultValue: 60, unit: "deg", description: "Counter-clockwise angle of Vector B from positive X-axis.", symbol: "θ_B" }
    ],
    liveOutputs: [
      { key: "resultantMag", label: "Resultant Magnitude (|R|)", formulaStr: "Math.sqrt(Rx*Rx + Ry*Ry).toFixed(1)", unit: "units", description: "True geometric magnitude of resultant vector R = A + B." },
      { key: "resultantAngle", label: "Resultant Direction (θ_R)", formulaStr: "((Math.atan2(Ry, Rx) * 180 / Math.PI + 360) % 360).toFixed(1)", unit: "deg", description: "Direction angle of R measured from positive X-axis." },
      { key: "dotProduct", label: "Scalar Dot Product (A · B)", formulaStr: "(Ax*Bx + Ay*By).toFixed(1)", unit: "units²", description: "Dot product representing projections of vectors." }
    ],
    cherryObservation: {
      hinglishGuide: "Arrey beta dhyan se dekho! Vectors ko regular numbers ki tarah seedha (50 + 45 = 95) add nahi karte! Agar dono vectors same direction me hain (θ = 0°), toh resultant MAXIMUM (A + B = 95) hota hai. Par agar opposite direction me hain (θ = 180°), toh resultant MINIMUM (|A - B| = 5) ho jata hai! Head-to-tail method me Vector B ki tail ko Vector A ke head par rakho!",
      keyRuleLaw: "Triangle Law & Parallelogram Law of Vector Addition",
      examTrap: "NEET / JEE Trap: Jab do equal vectors ke beech ka angle θ = 120° hota hai, toh unka resultant exactly unhi ke magnitude ke barabar hota hai (|R| = |A| = |B|)! Isse exam me instant direct solve karo!",
      whatToObserve: [
        "Angle θ_B badlao: dekho kaise Resultant arrow dynamically rotate aur expand/shrink hota hai.",
        "Jab angle 90° hota hai, Pythagoras theorem lagti hai: R = √(A² + B²).",
        "Green/cyan colored Vector A aur rose-colored Vector B ka combined effect golden/emerald resultant arrow dikhata hai."
      ],
      proTip: "Physics me Displacement, Velocity, Force aur Momentum sabhi vectors hain aur isi mathematical law ko follow karte hain!"
    },
    visualTheme: {
      primaryColor: "#38bdf8",
      accentColor: "#f43f5e",
      bgTheme: "dark"
    }
  },

  "bernoulli fluid principle": {
    id: "sim-bernoulli-fluid",
    topic: "Bernoulli's Principle & Venturi Flow",
    title: "Bernoulli's Fluid Principle: Venturi Flow & Pressure Differential",
    hindiTitle: "बर्नोली का द्रव सिद्धान्त: वेंचुरी नली एवं दाब-वेग सम्बन्ध",
    subject: "physics",
    grade: "Class 11",
    category: "Fluid Mechanics",
    conceptFormula: "P_1 + \\frac{1}{2}\\rho v_1^2 + \\rho g h_1 = P_2 + \\frac{1}{2}\\rho v_2^2 + \\rho g h_2 = \\text{Constant}",
    secondaryFormulas: [
      { label: "Equation of Continuity", formula: "A_1 v_1 = A_2 v_2 \\implies v_2 = v_1 \\left(\\frac{A_1}{A_2}\\right)" },
      { label: "Venturi Pressure Drop", formula: "\\Delta P = P_1 - P_2 = \\frac{1}{2}\\rho (v_2^2 - v_1^2)" },
      { label: "Manometer Height Difference", formula: "h = \\frac{\\Delta P}{\\rho g}" }
    ],
    simulationType: "bernoulli_fluid",
    description: "Observe streamline fluid flow through a converging-diverging Venturi tube. Where the pipe narrows (throat), fluid velocity accelerates and pressure drops drastically, proven by vertical manometer tube liquid columns.",
    parameters: [
      { key: "inletVelocity", label: "Inlet Fluid Speed (v₁)", min: 1, max: 8, step: 0.5, defaultValue: 3, unit: "m/s", description: "Speed of fluid entering the wide section of the pipe.", symbol: "v₁" },
      { key: "throatConstriction", label: "Throat Diameter Ratio (d₂/d₁)", min: 30, max: 85, step: 5, defaultValue: 50, unit: "%", description: "Degree of pipe narrowing at the central constriction.", symbol: "d₂/d₁" },
      { key: "fluidDensity", label: "Fluid Density (ρ)", min: 800, max: 13600, step: 200, defaultValue: 1000, unit: "kg/m³", description: "Density of moving liquid (1000 for Water, 13600 for Mercury).", symbol: "ρ" },
      { key: "inletPressure", label: "Inlet Static Pressure (P₁)", min: 100, max: 250, step: 10, defaultValue: 160, unit: "kPa", description: "Pressure measured in the wide section of the tube.", symbol: "P₁" }
    ],
    liveOutputs: [
      { key: "throatVelocity", label: "Throat Velocity (v₂)", formulaStr: "(v1 / ratioSq).toFixed(2)", unit: "m/s", description: "Accelerated velocity through narrow throat by continuity." },
      { key: "throatPressure", label: "Throat Pressure (P₂)", formulaStr: "Math.max(5, p1 - deltaP).toFixed(1)", unit: "kPa", description: "Reduced static pressure in the fast-moving narrow constriction." },
      { key: "pressureDiff", label: "Differential Pressure (ΔP)", formulaStr: "(deltaP).toFixed(1)", unit: "kPa", description: "Bernoulli pressure drop between inlet and throat." },
      { key: "manometerDrop", label: "Manometer Liquid Diff (Δh)", formulaStr: "(deltaP * 1000 / (rho * 9.8)).toFixed(2)", unit: "m", description: "Height difference seen in vertical glass indicator columns." }
    ],
    cherryObservation: {
      hinglishGuide: "Common sense bolta hai ki patli jagah par pressure badhna chahiye, LEKIN Science me theek ulta hota hai! Bernoulli's Principle ke mutabik: Jahan fluid ki SPEED tez hoti hai, wahan uska PRESSURE KAM ho jata hai! Venturi tube ke patle gale (throat) me continuity (A₁v₁ = A₂v₂) ki wajah se fluid bohot fast daudta hai, isliye wahan vertical manometer me paani ka level niche gir jata hai!",
      keyRuleLaw: "Bernoulli's Theorem & Law of Conservation of Mechanical Energy for Fluids",
      examTrap: "Exam Pitfall: Dynamic pressure (½ρv²) badhta hai, isliye static pressure (P) ghirta hai taaki Total Pressure constant rahe! Aeroplane wings (aerofoil) ke upar hawa tez chalti hai, isliye upar low pressure create hota hai aur aeroplane ko UPWARD LIFT milti hai!",
      whatToObserve: [
        "Inlet Speed (v₁) badhao: Throat me particles kitni tezi se shoot karte hain aur throat manometer column kitna neeche drop hota hai.",
        "Throat constriction (d₂/d₁) ko chota karo (more narrow): Velocity shoot-up hoti hai aur pressure drop ΔP bohot bada ho jata hai.",
        "Paani ke streamlines throat ke paas dense (crowded) ho jaate hain jo high velocity ko signify karte hain."
      ],
      proTip: "Perfume atomizer sprayers, carburetors, aur cricket ball ka swing - sabhi Bernoulli's Principle par kaam karte hain!"
    },
    visualTheme: {
      primaryColor: "#38bdf8",
      accentColor: "#0284c7",
      bgTheme: "dark"
    }
  },

  "dna replication fork": {
    id: "sim-dna-replication",
    topic: "DNA Replication Fork & Molecular Synthesis",
    title: "DNA Replication Fork: Semi-Conservative Molecular Synthesis",
    hindiTitle: "डीएनए प्रतिकृति: द्विशाख एवं अर्ध-संरक्षी आणविक संश्लेषण",
    subject: "biology",
    grade: "Class 12",
    category: "Molecular Biology & Genetics",
    conceptFormula: "\\text{DNA (Parental)} \\xrightarrow{\\text{Helicase + Polymerase}} 2 \\times \\text{DNA (1 Old Strand + 1 New Strand)}",
    secondaryFormulas: [
      { label: "Semi-Conservative Rule", formula: "\\text{Meselson-Stahl Experiment: 50\\% Heavy } ^{15}\\text{N} + 50\\% \\text{Light } ^{14}\\text{N}" },
      { label: "Chargaff's Rule", formula: "\\text{A} = \\text{T} \\quad (2 \\text{ H-bonds}), \\quad \\text{G} \\equiv \\text{C} \\quad (3 \\text{ H-bonds})" },
      { label: "Directionality", formula: "\\text{Synthesis occurs strictly } 5' \\to 3'" }
    ],
    simulationType: "dna_replication",
    description: "Watch DNA Helicase unzip the parental double helix into a Y-shaped replication fork. DNA Polymerase III continuously synthesizes the leading strand while synthesizing the lagging strand discontinuously via Okazaki fragments.",
    parameters: [
      { key: "helicaseSpeed", label: "Helicase Unwinding Rate", min: 10, max: 100, step: 10, defaultValue: 50, unit: "bp/s", description: "Rate at which DNA Helicase breaks hydrogen bonds to unzip the double helix.", symbol: "Helicase" },
      { key: "polymeraseRate", label: "DNA Polymerase III Speed", min: 20, max: 100, step: 10, defaultValue: 60, unit: "nt/s", description: "Catalytic polymerization speed adding complementary dNTPs.", symbol: "Polymerase" },
      { key: "topoisomeraseRelief", label: "Topoisomerase Supercoil Relief", min: 20, max: 100, step: 10, defaultValue: 80, unit: "%", description: "Relieves torsional strain ahead of the advancing replication fork.", symbol: "Gyrase" }
    ],
    liveOutputs: [
      { key: "leadingBasePairs", label: "Leading Strand Replicated", formulaStr: "Math.floor(simTime * 35)", unit: "bp", description: "Continuously synthesized daughter strand moving into fork." },
      { key: "okazakiFragments", label: "Okazaki Fragments Formed", formulaStr: "Math.floor(simTime * 0.8)", unit: "fragments", description: "Discontinuous lagging strand segments joined by DNA Ligase." },
      { key: "forkProgress", label: "Fork Advance Position", formulaStr: "(simTime * 2.5).toFixed(1)", unit: "nm", description: "Physical displacement of the active replication bubble." }
    ],
    cherryObservation: {
      hinglishGuide: "DNA replication semi-conservative hoti hai - matlab har naye bane DNA molecule me EK strand purani parental hoti hai aur EK strand bilkul nayi hoti hai! DNA Polymerase enzyme ki ek strict condition hoti hai: ye nayi strand sirf aur sirf 5' se 3' direction me hi bana sakta hai! Isliye 3'->5' template par continuous 'Leading Strand' banti hai, jabki 5'->3' template par tukdon me 'Lagging Strand' (Okazaki fragments) banti hai!",
      keyRuleLaw: "Meselson & Stahl Semi-Conservative Replication & Chargaff's Equivalence Rule",
      examTrap: "NEET Trap Alert: DNA Polymerase replication akele start nahi kar sakta! Use shuruat karne ke liye RNA Primer (jo Primase enzyme banata hai) aur ek free 3'-OH group ki zaroorat hoti hai!",
      whatToObserve: [
        "Unwinding Fork: Helicase enzyme double helix ke H-bonds ko break karte hue aage badhta hai.",
        "Color-coded nitrogenous bases: Adenine (Green) binds Thymine (Red) with 2 bonds; Guanine (Blue) binds Cytosine (Yellow) with 3 bonds.",
        "Lagging strand par discontinuous Okazaki fragments bante hain jinhe baad me DNA Ligase 'molecular glue' se seal karta hai."
      ],
      proTip: "PCR (Polymerase Chain Reaction) me isi biology principle ko Taq Polymerase aur thermocycler se in-vitro use kiya jata hai!"
    },
    visualTheme: {
      primaryColor: "#10b981",
      accentColor: "#6366f1",
      bgTheme: "slate"
    }
  },

  "kepler's planetary laws": {
    id: "sim-kepler-orbit",
    topic: "Kepler's Laws & Planetary Orbits",
    title: "Kepler's Planetary Laws: Elliptical Orbits & Equal Areas",
    hindiTitle: "केप्लर के ग्रहीय नियम: दीर्घवृत्ताकार कक्षा एवं कक्षीय चाल",
    subject: "physics",
    grade: "Class 11",
    category: "Gravitation & Astrophysics",
    conceptFormula: "T^2 = \\frac{4\\pi^2}{G M} a^3, \\quad \\frac{dA}{dt} = \\frac{L}{2m} = \\text{Constant}",
    secondaryFormulas: [
      { label: "1st Law (Law of Orbits)", formula: "r(\\theta) = \\frac{a(1 - e^2)}{1 + e\\cos\\theta}" },
      { label: "2nd Law (Law of Areas)", formula: "\\Delta A = \\frac{1}{2} r^2 \\Delta\\theta" },
      { label: "Conservation of Angular Momentum", formula: "r_p v_p = r_a v_a" }
    ],
    simulationType: "kepler_orbit",
    description: "Simulate planetary motion around a massive central star according to Kepler's Three Laws. Verify elliptical path, swept area invariance, and T² ∝ a³ harmonic law.",
    parameters: [
      { key: "semiMajorAxis", label: "Semi-Major Axis (a)", min: 1, max: 5, step: 0.5, defaultValue: 2.5, unit: "AU", description: "Average distance of planet from central star.", symbol: "a" },
      { key: "eccentricity", label: "Orbital Eccentricity (e)", min: 0, max: 0.8, step: 0.05, defaultValue: 0.45, unit: "ratio", description: "0 = perfect circle, higher = stretched ellipse.", symbol: "e" },
      { key: "starMass", label: "Central Star Mass (M)", min: 0.5, max: 3.0, step: 0.25, defaultValue: 1.0, unit: "M☉", description: "Mass of the central gravitational attractor.", symbol: "M" }
    ],
    liveOutputs: [
      { key: "orbitalPeriod", label: "Orbital Period (T)", formulaStr: "Math.sqrt(Math.pow(a, 3) / starMass).toFixed(2)", unit: "Years", description: "Time taken for 1 complete revolution (Kepler's 3rd Law)." },
      { key: "perihelionSpeed", label: "Max Speed at Perihelion (v_max)", formulaStr: "(29.8 * Math.sqrt((1+e)/(1-e)) / Math.sqrt(a)).toFixed(1)", unit: "km/s", description: "Fastest speed when closest to the star." },
      { key: "aphelionSpeed", label: "Min Speed at Aphelion (v_min)", formulaStr: "(29.8 * Math.sqrt((1-e)/(1+e)) / Math.sqrt(a)).toFixed(1)", unit: "km/s", description: "Slowest speed when farthest from the star." }
    ],
    cherryObservation: {
      hinglishGuide: "Kepler ke 3 niyam gravitation ki jaan hain! 1st Law: Har planet circular nahi, balki Elliptical orbit me ghumta hai jiske ek focus par Sun hota hai! 2nd Law: Planet Sun ke jitna paas (Perihelion) aata hai, uski speed utni hi tez ho jati hai taaki equal time me equal area sweep kar sake! 3rd Law: Planet Sun se jitna door hoga, uska saal (T) utna hi lamba hoga (T² ∝ a³)!",
      keyRuleLaw: "Kepler's Three Laws of Planetary Motion & Newton's Law of Universal Gravitation",
      examTrap: "JEE Trap: Areal velocity (dA/dt) constant isliye rehti hai kyunki Gravitational force hamesha Sun ke center ki taraf act karta hai (Central Force), jisse planet par Torque τ = 0 hota hai aur Angular Momentum L conserve rehta hai!",
      whatToObserve: [
        "Eccentricity 'e' ko 0 karo: Orbit bilkul circular ho jayegi aur planet ki speed uniform ho jayegi.",
        "Eccentricity 'e' badhao: Dekho jab planet Sun ke paas se guzarta hai toh kitni tezi se accelerate karta hai!",
        "Shaded sweep sectors har equal interval me equal surface area demonstrate karte hain."
      ],
      proTip: "Halley's Comet bohot high eccentricity (e = 0.967) follow karta hai, isliye 76 saal me se sirf kuch mahine Sun ke paas dikhta hai!"
    },
    visualTheme: {
      primaryColor: "#f59e0b",
      accentColor: "#38bdf8",
      bgTheme: "dark"
    }
  },

  "optics refraction snell": {
    id: "sim-optics-refraction",
    topic: "Refraction & Snell's Law",
    title: "Snell's Law of Refraction & Total Internal Reflection (TIR)",
    hindiTitle: "स्नेल का अपवर्तन नियम एवं पूर्ण आन्तरिक परावर्तन",
    subject: "physics",
    grade: "Class 10",
    category: "Ray Optics",
    conceptFormula: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2, \\quad \\sin\\theta_c = \\frac{n_2}{n_1} \\quad (n_1 > n_2)",
    secondaryFormulas: [
      { label: "Refractive Index & Velocity", formula: "n = \\frac{c}{v} = \\frac{\\lambda_0}{\\lambda}" },
      { label: "Critical Angle for TIR", formula: "\\theta_c = \\arcsin\\left(\\frac{n_2}{n_1}\\right)" },
      { label: "Lateral Displacement", formula: "d = t \\frac{\\sin(\\theta_1 - \\theta_2)}{\\cos\\theta_2}" }
    ],
    simulationType: "optics_refraction",
    description: "Track light rays propagating across an optical interface. Observe bending towards or away from the normal, measure the critical angle, and trigger Total Internal Reflection (TIR).",
    parameters: [
      { key: "incidentAngle", label: "Angle of Incidence (θ₁)", min: 0, max: 85, step: 5, defaultValue: 45, unit: "deg", description: "Angle measured from the normal line.", symbol: "θ₁" },
      { key: "indexN1", label: "Medium 1 Refractive Index (n₁)", min: 1.0, max: 2.4, step: 0.05, defaultValue: 1.5, unit: "ratio", description: "Optical density of upper medium (1.00 Air, 1.33 Water, 1.50 Glass, 2.42 Diamond).", symbol: "n₁" },
      { key: "indexN2", label: "Medium 2 Refractive Index (n₂)", min: 1.0, max: 2.4, step: 0.05, defaultValue: 1.0, unit: "ratio", description: "Optical density of lower medium.", symbol: "n₂" }
    ],
    liveOutputs: [
      { key: "refractedAngle", label: "Angle of Refraction (θ₂)", formulaStr: "isTIR ? 'TIR (No Refraction)' : (rAngleDeg).toFixed(1)", unit: "deg", description: "Angle of refracted beam in medium 2." },
      { key: "criticalAngle", label: "Critical Angle (θ_c)", formulaStr: "critAngleDeg ? critAngleDeg.toFixed(1) : 'None (n1 <= n2)'", unit: "deg", description: "Incident angle where refraction angle reaches 90°." },
      { key: "opticalState", label: "Optical Phenomenon", formulaStr: "isTIR ? 'Total Internal Reflection' : 'Refraction + Partial Reflection'", unit: "status", description: "Behavior of the incident ray at the interface boundary." }
    ],
    cherryObservation: {
      hinglishGuide: "Jab light ray Denser medium (jaise Glass n=1.5) se Rarer medium (jaise Air n=1.0) me jaati hai, toh normal se DOOR hat-ti hai (bends away from normal)! Jaise-jaise angle of incidence θ₁ badhate hain, refracted ray interface ke aur paas aati hai. Ek khaas angle (Critical Angle θ_c) par refraction angle theek 90° ho jata hai! Agar angle θ₁ isse bada kar diya, toh light doosre medium me jaati hi nahi - balki 100% waapas reflect ho jaati hai! Isi ko TOTAL INTERNAL REFLECTION (TIR) kehte hain!",
      keyRuleLaw: "Snell's Law of Refraction & Fermat's Principle of Least Time",
      examTrap: "Board / NEET Exam Alert: TIR hone ke liye do zaroori conditions hoti hain: (1) Light hamesha DENSER se RARER medium me travel karni chahiye (n₁ > n₂), (2) Angle of incidence critical angle se bada hona chahiye (θ₁ > θ_c)!",
      whatToObserve: [
        "Medium 1 ko Glass (1.5) aur Medium 2 ko Air (1.0) rakho: θ_c lagbhag 41.8° aayega.",
        "Angle θ₁ ko 45° par set karo: Dekho kaise refraction gayab ho jata hai aur pure 100% ray reflect hoti hai (TIR)!",
        "Medium 1 aur 2 barabar (n₁ = n₂) karne par light bina bhatke seedhi nikal jaati hai."
      ],
      proTip: "Optical Fibres (Jo pure internet ko high-speed data transmit karte hain) aur Diamond ki chamak (brilliance) dono TIR par kaam karte hain!"
    },
    visualTheme: {
      primaryColor: "#38bdf8",
      accentColor: "#eab308",
      bgTheme: "slate"
    }
  },

  "simple pendulum shm": {
    id: "sim-pendulum-shm",
    topic: "Simple Pendulum & Harmonic Motion",
    title: "Simple Harmonic Motion: Simple Pendulum Lab",
    hindiTitle: "सरल लोलक: सरल आवर्त गति एवं ऊर्जा संरक्षण",
    subject: "physics",
    grade: "Class 11",
    category: "Oscillations & SHM",
    conceptFormula: "T = 2\\pi \\sqrt{\\frac{L}{g}}, \\quad \\theta(t) = \\theta_0 \\cos\\left(\\sqrt{\\frac{g}{L}} t\\right)",
    secondaryFormulas: [
      { label: "Restoring Force", formula: "F_{\\text{restoring}} = -m g \\sin\\theta \\approx -m g \\left(\\frac{x}{L}\\right)" },
      { label: "Total Energy Conservation", formula: "E = K + U = \\frac{1}{2} m v^2 + m g L(1 - \\cos\\theta) = \\text{Constant}" },
      { label: "Maximum Speed at Mean Position", formula: "v_{\\text{max}} = \\sqrt{2 g L (1 - \\cos\\theta_0)}" }
    ],
    simulationType: "pendulum_shm",
    description: "Investigate simple harmonic oscillations of a pendulum bob. Verify how time period depends strictly on string length L and gravity g, completely independent of bob mass m.",
    parameters: [
      { key: "pendulumLength", label: "Pendulum Length (L)", min: 0.5, max: 3.0, step: 0.25, defaultValue: 1.5, unit: "m", description: "Length of the suspension cord.", symbol: "L" },
      { key: "initialAngle", label: "Initial Amplitude (θ₀)", min: 5, max: 45, step: 5, defaultValue: 20, unit: "deg", description: "Release angle from vertical.", symbol: "θ₀" },
      { key: "gravityAcc", label: "Gravitational Acceleration (g)", min: 1.6, max: 24.8, step: 0.5, defaultValue: 9.8, unit: "m/s²", description: "Gravity field (9.8 Earth, 1.6 Moon, 24.8 Jupiter).", symbol: "g" },
      { key: "bobMass", label: "Bob Mass (m)", min: 0.1, max: 2.0, step: 0.1, defaultValue: 0.5, unit: "kg", description: "Mass of the suspended spherical bob.", symbol: "m" }
    ],
    liveOutputs: [
      { key: "timePeriod", label: "Time Period (T)", formulaStr: "(2 * Math.PI * Math.sqrt(L / g)).toFixed(2)", unit: "s", description: "Time taken for one full to-and-fro cycle." },
      { key: "frequency", label: "Oscillation Frequency (f)", formulaStr: "(1 / (2 * Math.PI * Math.sqrt(L / g))).toFixed(2)", unit: "Hz", description: "Number of oscillations completed per second." },
      { key: "maxSpeed", label: "Max Speed at Center (v_max)", formulaStr: "Math.sqrt(2 * g * L * (1 - Math.cos(theta0Rad))).toFixed(2)", unit: "m/s", description: "Peak kinetic velocity passing through lowest mean point." }
    ],
    cherryObservation: {
      hinglishGuide: "Arrey beta dhyan se dekho! Pendulum ka time period (T) sirf aur sirf do cheezon par depend karta hai: Length (L) aur Gravity (g)! Bob ka Mass chahe 10 gram ho ya 10 kilogram, time period par 1% bhi farq nahi padta! Mean position (center) par Kinetic Energy maximum aur Potential Energy zero hoti hai, jabki extreme points par Kinetic zero aur Potential maximum ho jati hai!",
      keyRuleLaw: "Simple Harmonic Motion & Conservation of Mechanical Energy",
      examTrap: "Viva / Board Trap: Agar pendulum clock ko garmiyon me dekhein, toh thermal expansion ki wajah se string length L badh jaati hai, jisse Time Period T badh jata hai aur clock SLOW chalne lagti hai (loses time)!",
      whatToObserve: [
        "Length 'L' 4 times karne par Time Period theek DUGNA (2x) ho jata hai (T ∝ √L).",
        "Gravity 'g' ko 1.6 (Moon) par set karo: Pendulum bohot slow motion me swing karega.",
        "Center par velocity vector green arrow maximum hota hai aur extremes par flip karta hai."
      ],
      proTip: "Seconds Pendulum ki length Earth par theek 0.994 meter (approx 1 meter) hoti hai jiska time period theek 2 seconds hota hai!"
    },
    visualTheme: {
      primaryColor: "#38bdf8",
      accentColor: "#10b981",
      bgTheme: "dark"
    }
  },

  "carnot heat engine": {
    id: "sim-carnot-engine",
    topic: "Carnot Heat Engine",
    title: "Carnot Heat Engine: Reversible Thermodynamic Cycle",
    hindiTitle: "कार्नो ऊष्मा इंजन: उत्क्रमणीय ऊष्मागतिक चक्र एवं दक्षता",
    subject: "physics",
    grade: "Class 11",
    category: "Thermodynamics",
    conceptFormula: "\\eta = 1 - \\frac{T_C}{T_H} = \\frac{W}{Q_H}",
    secondaryFormulas: [
      { label: "Maximum Carnot Efficiency", formula: "\\eta = 1 - \\frac{T_C}{T_H}" },
      { label: "Net Work Output per Cycle", formula: "W = Q_H - Q_C = Q_H \\left(1 - \\frac{T_C}{T_H}\\right)" },
      { label: "Clausius Entropy Equality", formula: "\\oint \\frac{dQ}{T} = 0" }
    ],
    simulationType: "thermodynamics_gas",
    description: "Operate a theoretical reversible heat engine between a hot source T_H and cold sink T_C. Trace isothermal and adiabatic paths on the indicator diagram, calculate maximum thermodynamic efficiency, and inspect mechanical work.",
    parameters: [
      { key: "tempT", label: "Source Temperature (T_H)", min: 300, max: 1000, step: 25, defaultValue: 600, unit: "K", description: "Hot reservoir thermal energy source.", symbol: "T_H" },
      { key: "pistonVolumeV", label: "Cold Sink (T_C)", min: 100, max: 450, step: 25, defaultValue: 300, unit: "K", description: "Low temperature exhaust reservoir.", symbol: "T_C" },
      { key: "molesN", label: "Working Gas (n)", min: 1, max: 5, step: 1, defaultValue: 2, unit: "mol", description: "Moles of ideal working fluid.", symbol: "n" }
    ],
    liveOutputs: [
      { key: "carnotEfficiency", label: "Carnot Efficiency (η)", formulaStr: "((1 - params.pistonVolumeV / params.tempT) * 100).toFixed(1)", unit: "%", description: "Maximum thermodynamic efficiency limit." },
      { key: "workOutput", label: "Net Work (W)", formulaStr: "(params.molesN * 8.314 * (params.tempT - params.pistonVolumeV) * 0.7).toFixed(1)", unit: "J", description: "Useful mechanical work extracted per cycle." }
    ],
    cherryObservation: {
      hinglishGuide: "Dhyan se dekho beta! Carnot Engine universe ka sabse ideal aur maximum efficient reversible engine hai. Efficiency (η = 1 - T_C / T_H) badhane ke liye ya toh Source (T_H) ko bohot garam karo, ya Sink (T_C) ko bohot thanda! 100% efficiency tabhi possible hai jab T_C = 0 K (Absolute Zero) ho, jo practical universe me impossible hai!",
      keyRuleLaw: "Second Law of Thermodynamics & Carnot's Theorem",
      examTrap: "NEET/JEE Alert: Carnot efficiency working substance (gas) ke nature par bilkul depend nahi karti! Chahe Monoatomic ho, Diatomic ho, ya real steam—efficiency sirf aur sirf T_H aur T_C ke absolute temperatures par depend karti hai!",
      whatToObserve: [
        "Source Temp (T_H) badhane se indicator diagram ka enclosed area aur efficiency badhti hai.",
        "Sink Temp (T_C) reduce karne se efficiency sharply increase hoti hai.",
        "Dono temperatures barabar (T_H = T_C) hone par efficiency 0% ho jaati hai kyunki heat flow band ho jata hai."
      ],
      proTip: "Modern thermal power plants and car engines operate on modified cycles like Rankine and Otto cycles, always striving to get closer to the theoretical Carnot limit!"
    },
    visualTheme: {
      primaryColor: "#f59e0b",
      accentColor: "#ef4444",
      bgTheme: "dark"
    }
  },

  "hall effect magnetism": {
    id: "sim-hall-effect",
    topic: "Hall Effect & Magnetism",
    title: "Hall Effect: Lorentz Force & Charge Carrier Deflection",
    hindiTitle: "हॉल प्रभाव: लॉरेंट्ज़ बल एवं आवेश वाहक विक्षेपण",
    subject: "physics",
    grade: "Class 12",
    category: "Electromagnetism",
    conceptFormula: "V_H = \\frac{I B}{n q d}, \\quad \\vec{F}_B = q(\\vec{v}_d \\times \\vec{B})",
    secondaryFormulas: [
      { label: "Hall Coefficient", formula: "R_H = \\frac{1}{n q}" },
      { label: "Lorentz Balancing Electric Field", formula: "E_H = v_d B" },
      { label: "Drift Velocity", formula: "v_d = \\frac{I}{n q A}" }
    ],
    simulationType: "magnetism_field",
    description: "Pass a current through a conducting or semiconductor slab perpendicular to an external magnetic field B. Observe charge carriers deflected by Lorentz force to opposite lateral edges, establishing transverse Hall voltage V_H.",
    parameters: [
      { key: "magnetStrength", label: "Magnetic Field (B)", min: 10, max: 100, step: 5, defaultValue: 60, unit: "mT", description: "Perpendicular magnetic flux density.", symbol: "B" },
      { key: "needleDeflection", label: "Probe Position / Current (I)", min: -90, max: 90, step: 10, defaultValue: 40, unit: "mA", description: "Longitudinal drift current.", symbol: "I" }
    ],
    liveOutputs: [
      { key: "hallVoltage", label: "Transverse Hall Voltage (V_H)", formulaStr: "(params.magnetStrength * 0.12 * Math.abs(params.needleDeflection) * 0.05).toFixed(2)", unit: "mV", description: "Potential difference across opposing faces." },
      { key: "carrierType", label: "Charge Carrier Type", formulaStr: "params.needleDeflection >= 0 ? 'Electrons (-e)' : 'Holes (+e)'", unit: "type", description: "Sign of Hall coefficient reveals majority carrier." }
    ],
    cherryObservation: {
      hinglishGuide: "Wah! Hall Effect physics ka ek bohot hi shaandar experiment hai! Jab magnetic field lagate hain, toh moving charge carriers par perpendicular Lorentz Force (F = q * v * B) lagta hai. Iski wajah se charges conductor ke ek kinare par jama hone lagte hain, jisse dono edges ke beech ek transverse potential difference develop ho jata hai—isi ko Hall Voltage kehte hain!",
      keyRuleLaw: "Lorentz Force Law & Hall Effect",
      examTrap: "Board / JEE Alert: Hall Effect se hum kisi bhi material ke charge carriers ka sign (Electron vs Hole) aur carrier density 'n' accurately determine kar sakte hain!",
      whatToObserve: [
        "Magnetic Field B badhane se Hall voltage V_H linearly proportional tarike se badhta hai.",
        "Current I reverse karne se Hall voltage ki polarity switch ho jaati hai.",
        "Semiconductors me carrier density 'n' metals ke mukable bohot kam hoti hai, isliye semiconductors me Hall voltage metals se hazaron guna zyada detect hota hai!"
      ],
      proTip: "Smartphones me digital compass aur cars me wheel speed ABS sensors me Hall sensors hi use hote hain!"
    },
    visualTheme: {
      primaryColor: "#38bdf8",
      accentColor: "#ec4899",
      bgTheme: "slate"
    }
  },

  "enzyme kinetics michaelis-menten": {
    id: "sim-enzyme-kinetics",
    topic: "Enzyme Kinetics Michaelis-Menten",
    title: "Enzyme Kinetics: Michaelis-Menten Mechanism & V_max",
    hindiTitle: "एंजाइम गतिकी: माइकेलिस-मेन्टेन क्रियाविधि एवं V_max",
    subject: "chemistry",
    grade: "Class 12",
    category: "Biochemistry & Chemical Kinetics",
    conceptFormula: "v = \\frac{V_{\\text{max}} [S]}{K_m + [S]}",
    secondaryFormulas: [
      { label: "Lineweaver-Burk Double Reciprocal", formula: "\\frac{1}{v} = \\frac{K_m}{V_{\\text{max}}} \\frac{1}{[S]} + \\frac{1}{V_{\\text{max}}}" },
      { label: "Catalytic Efficiency", formula: "\\text{Efficiency} = \\frac{k_{\\text{cat}}}{K_m}" },
      { label: "Turnover Number", formula: "k_{\\text{cat}} = \\frac{V_{\\text{max}}}{[E]_0}" }
    ],
    simulationType: "chemical_kinetics",
    description: "Investigate biological catalysis rates. Adjust substrate concentration [S], temperature, and enzyme levels to observe hyperbolic saturation and calculate Michaelis constant K_m.",
    parameters: [
      { key: "tempK", label: "Reaction Temperature (T)", min: 280, max: 350, step: 5, defaultValue: 310, unit: "K", description: "Incubation temperature (310 K = 37°C body temperature).", symbol: "T" },
      { key: "concA", label: "Substrate Concentration [S]", min: 0.1, max: 5.0, step: 0.2, defaultValue: 2.0, unit: "mM", description: "Substrate molecule concentration.", symbol: "[S]" },
      { key: "activationEnergy", label: "Inhibitor / Km Sensitivity", min: 15, max: 80, step: 5, defaultValue: 35, unit: "kJ/mol", description: "Affinity barrier parameter.", symbol: "Km" },
      { key: "hasCatalyst", label: "Enzyme Cofactor Activated", min: 0, max: 1, step: 1, defaultValue: 1, unit: "bool", description: "Enables active site catalytic boost.", symbol: "Co" }
    ],
    liveOutputs: [
      { key: "reactionRate", label: "Initial Velocity (v₀)", formulaStr: "(params.concA * 45 / (1.5 + params.concA)).toFixed(1)", unit: "μmol/min", description: "Rate of product formation." },
      { key: "saturationPct", label: "Active Site Saturation", formulaStr: "((params.concA / (1.5 + params.concA)) * 100).toFixed(0)", unit: "%", description: "Fraction of enzyme molecules bound to substrate." }
    ],
    cherryObservation: {
      hinglishGuide: "Wah beta! Enzymes hamare sharir ke super-fast biological catalysts hain! Low substrate [S] par rate directly proportional hoti hai (First Order). Lekin jaise hi substrate bohot zyada badhate hain, saare active sites saturate ho jaate hain aur rate ek flat plateau (V_max) par pahunch jaati hai (Zero Order)! Km wo substrate concentration hai jahan reaction rate theek V_max / 2 hoti hai!",
      keyRuleLaw: "Michaelis-Menten Equation & Enzyme Substrate Complex Kinetics",
      examTrap: "NEET Exam Alert: Competitive inhibitors Km ko badha dete hain lekin V_max wahi rehta hai! Non-competitive inhibitors V_max ko kam kar dete hain jabki Km unchanged rehta hai!",
      whatToObserve: [
        "Substrate [S] badhane se rate shuru me tezi se badhti hai fir V_max par saturate ho jaati hai.",
        "Temperature 40°C (313 K) se upar karne par rate girne lagti hai kyunki enzyme protein denature ho jata hai!",
        "Km chhota hone ka matlab enzyme ka substrate ke liye affinity bohot high hai."
      ],
      proTip: "Human body me Carbonic Anhydrase enzyme ek second me 10 lakh CO₂ molecules ko convert kar deta hai—one of the fastest enzymes known!"
    },
    visualTheme: {
      primaryColor: "#10b981",
      accentColor: "#38bdf8",
      bgTheme: "slate"
    }
  },

  "wheatstone bridge": {
    id: "sim-wheatstone-bridge",
    topic: "Wheatstone Bridge & Galvanometer",
    title: "Wheatstone Bridge: Null Deflection & Unknown Resistance",
    hindiTitle: "व्हीटस्टोन सेतु: शून्य विक्षेप एवं अज्ञात प्रतिरोध मापन",
    subject: "physics",
    grade: "Class 12",
    category: "Current Electricity",
    conceptFormula: "\\frac{P}{Q} = \\frac{R}{S}, \\quad I_g = 0",
    secondaryFormulas: [
      { label: "Unknown Resistance S", formula: "S = \\frac{Q}{P} \\cdot R" },
      { label: "Galvanometer Current", formula: "I_g = \\frac{V_{BD}}{R_g}" },
      { label: "Bridge Sensitivity", formula: "\\Sigma = \\frac{\\theta}{\\Delta R / R}" }
    ],
    simulationType: "circuits_charging",
    description: "Balance four resistor arms in a closed bridge network. Adjust variable resistance box R until the sensitive central galvanometer shows zero needle deflection (Null Point Ig = 0).",
    parameters: [
      { key: "batteryVoltage", label: "DC Supply EMF (E)", min: 2, max: 12, step: 1, defaultValue: 6, unit: "V", description: "Bridge source potential.", symbol: "E" },
      { key: "resistanceR", label: "Variable Arm Resistance (R)", min: 10, max: 200, step: 5, defaultValue: 50, unit: "Ω", description: "Standard resistance box arm.", symbol: "R" },
      { key: "capacitanceC", label: "Ratio Arm Ratio (P/Q)", min: 10, max: 100, step: 10, defaultValue: 50, unit: "Ω", description: "Fixed ratio arm pair.", symbol: "P" },
      { key: "switchState", label: "Galvanometer Key Closed", min: 0, max: 1, step: 1, defaultValue: 1, unit: "state", description: "Key K2 in detector branch.", symbol: "K" }
    ],
    liveOutputs: [
      { key: "galvanometerReading", label: "Galvanometer Current (Ig)", formulaStr: "((params.resistanceR - 50) * 0.15).toFixed(2)", unit: "mA", description: "Deflection reading. Null point when Ig = 0.00." },
      { key: "balanceStatus", label: "Bridge Balance State", formulaStr: "Math.abs(params.resistanceR - 50) < 3 ? 'BALANCED (Null Point)' : 'UNBALANCED'", unit: "status", description: "Condition when P/Q = R/S." }
    ],
    cherryObservation: {
      hinglishGuide: "Arrey beta dhyan se dekho! Wheatstone Bridge me jab charo arms ka ratio barabar ho jata hai (P/Q = R/S), tab nodes B aur D same potential par aa jaate hain (V_B = V_D). Isliye central galvanometer me se koi current nahi behta (Ig = 0)! Is null deflection method ka sabse bada advantage ye hai ki galvanometer ka internal resistance measurement ko 1% bhi affect nahi karta!",
      keyRuleLaw: "Wheatstone Bridge Principle & Kirchhoff's Loop Rule",
      examTrap: "Board Exam Golden Rule: Battery aur Galvanometer ki positions swap (interchange) karne par bhi bridge ki balance condition par koi asar nahi padta—P/Q = R/S valid hi rehta hai!",
      whatToObserve: [
        "Variable arm R ko 50 Ω par set karo: Dekho needle theek 0 mark par aakar rukti hai (Balanced)!",
        "R < 50 Ω par needle left deflect hoti hai, R > 50 Ω par right deflect hoti hai.",
        "EMF badhane se null point nahi badalta, sirf off-balance hone par needle ka deflection zyada tezi se hota hai (High Sensitivity)."
      ],
      proTip: "Meter Bridge aur Post Office Box dono Wheatstone Bridge ke practical forms hain jo exact resistance measure karne ke liye use hote hain!"
    },
    visualTheme: {
      primaryColor: "#38bdf8",
      accentColor: "#10b981",
      bgTheme: "dark"
    }
  }
};

/**
 * Super-smart, token-aware fuzzy matching for science simulation topics.
 * Handles typos, partial phrases, Hindi terms, and keywords.
 */
export function matchCuratedSimulation(rawQuery: string): AISimulationSpec | null {
  if (!rawQuery || !rawQuery.trim()) return null;
  const q = rawQuery.toLowerCase().trim();

  // 1. Direct key match
  if (CURATED_CUSTOM_SIMULATIONS[q]) {
    return CURATED_CUSTOM_SIMULATIONS[q];
  }

  // 2. High-precision keyword & synonym mappings
  const TOPIC_ALIASES: Array<{ keywords: string[]; key: string }> = [
    { keywords: ["bernoulli", "venturi", "fluid flow", "streamline", "dynamic lift"], key: "bernoulli fluid principle" },
    { keywords: ["vector", "head to tail", "parallelogram", "resultant vector", "dot product", "cross product"], key: "vector addition" },
    { keywords: ["dna", "replication", "helicase", "polymerase", "okazaki", "double helix", "lagging strand", "leading strand"], key: "dna replication fork" },
    { keywords: ["kepler", "planetary", "orbit", "ellipse", "planet", "gravitation", "areal velocity", "solar system"], key: "kepler's planetary laws" },
    { keywords: ["carnot", "heat engine", "stirling", "thermodynamic cycle", "engine efficiency", "sink", "source temp"], key: "carnot heat engine" },
    { keywords: ["archimedes", "buoyancy", "upthrust", "flotation", "displacement", "submerge"], key: "archimedes buoyancy" },
    { keywords: ["hall effect", "lorentz force", "magnetic deflection", "charge carrier", "hall voltage"], key: "hall effect magnetism" },
    { keywords: ["enzyme", "michaelis", "menten", "catalysis", "substrate", "vmax", "km"], key: "enzyme kinetics michaelis-menten" },
    { keywords: ["wheatstone", "meter bridge", "null deflection", "galvanometer bridge", "null point", "bridge circuit"], key: "wheatstone bridge" },
    { keywords: ["photoelectric", "work function", "stopping potential", "photon", "threshold frequency", "einstein photoelectric"], key: "photoelectric effect experiment" },
    { keywords: ["double slit", "young", "interference", "diffraction", "fringe width", "coherent"], key: "double slit interference" },
    { keywords: ["newton cradle", "cradle", "elastic collision", "momentum conservation", "conservation of momentum"], key: "newton's cradle" },
    { keywords: ["capacitor", "rc circuit", "charging", "time constant", "discharging", "tau"], key: "capacitor charging" },
    { keywords: ["photosynthesis", "chlorophyll", "light phase", "hill reaction", "thylakoid", "photolysis"], key: "photosynthesis light phase" },
    { keywords: ["doppler", "sound shift", "frequency shift", "moving source", "acoustic shift", "sonic boom"], key: "doppler effect" },
    { keywords: ["rutherford", "gold foil", "alpha particle", "scattering", "closest approach"], key: "rutherford gold foil" },
    { keywords: ["ideal gas", "gas law", "pv=nrt", "boyle", "charles", "piston cylinder"], key: "ideal gas law" },
    { keywords: ["projectile", "trajectory", "launch angle", "parabolic motion", "range"], key: "projectile motion" },
    { keywords: ["bar magnet", "magnetic field", "compass needle", "magnetic dipole", "field lines"], key: "bar magnet field" },
    { keywords: ["electromagnet", "solenoid", "coil", "magnetic field of current"], key: "electromagnet coil" },
    { keywords: ["prism", "dispersion", "spectrum", "cauchy", "rainbow", "deviation"], key: "prism dispersion" },
    { keywords: ["friction", "roughness", "angle of repose", "limiting friction", "coefficient of friction"], key: "friction surfaces" },
    { keywords: ["rational number", "number line", "density of numbers", "fraction line"], key: "rational number line" },
    { keywords: ["bohr", "atomic model", "hydrogen spectrum", "energy levels", "quantized", "balmer"], key: "bohr atomic model" },
    { keywords: ["chemical kinetics", "reaction kinetics", "reaction rate", "collision theory", "activation energy"], key: "chemical reaction kinetics" },
    { keywords: ["heart", "circulation", "cardiac cycle", "blood flow", "systole", "diastole", "ventricle"], key: "human heart circulation" },
    { keywords: ["osmosis", "plasmolysis", "turgor", "hypertonic", "hypotonic", "crenation"], key: "osmosis and plasmolysis" },
    { keywords: ["parabola", "quadratic", "roots", "vertex", "quadratic equation"], key: "quadratic parabola functions" },
    { keywords: ["pythagoras", "hypotenuse", "right triangle", "a^2+b^2", "geometry proof"], key: "pythagoras theorem geometry" },
    { keywords: ["gaussian", "normal distribution", "bell curve", "standard deviation", "z-score"], key: "normal gaussian distribution" },
    { keywords: ["faraday", "induction", "lenz", "magnetic flux", "transformer", "induced emf"], key: "faraday electromagnetic induction" },
    { keywords: ["electrolysis", "water split", "hofmann", "hydrogen oxygen", "water electrolysis"], key: "water electrolysis hofmann" },
    { keywords: ["refraction", "snell", "critical angle", "tir", "total internal reflection"], key: "optics refraction snell" },
    { keywords: ["pendulum", "shm", "harmonic motion", "oscillation", "simple pendulum"], key: "simple pendulum shm" },
  ];

  // Clean query
  const cleanQ = q.replace(/[^a-z0-9\s]/g, " ");
  const qWords = cleanQ.split(/\s+/).filter((w) => w.length >= 3);

  // Check alias triggers
  for (const alias of TOPIC_ALIASES) {
    for (const kw of alias.keywords) {
      if (cleanQ.includes(kw)) {
        const found = CURATED_CUSTOM_SIMULATIONS[alias.key];
        if (found) return found;
      }
    }
  }

  // Check preset title, topic, and key substring matching
  for (const [key, preset] of Object.entries(CURATED_CUSTOM_SIMULATIONS)) {
    const kClean = key.replace(/[^a-z0-9\s]/g, " ");
    const tClean = (preset.title || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ");
    const topClean = (preset.topic || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ");

    if (cleanQ.includes(kClean) || kClean.includes(cleanQ)) return preset;
    if (tClean.includes(cleanQ) || topClean.includes(cleanQ)) return preset;

    // Word token matching with min 4-character overlap
    for (const w of qWords) {
      if (w.length >= 4 && (kClean.includes(w) || tClean.includes(w) || topClean.includes(w))) {
        return preset;
      }
    }
  }

  return null;
}


