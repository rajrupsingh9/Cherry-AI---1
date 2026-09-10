import React, { useState, useMemo } from "react";
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  CircleDashed,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Target,
  Brain,
  Layers,
  ArrowUpRight,
  Search,
  Filter,
  Check,
  Zap,
  Award
} from "lucide-react";
import katex from "katex";

export interface CurriculumBlindspotTrackerProps {
  studentName?: string;
  studentGrade?: string | number;
  pastSessions?: any[];
  quizAttempts?: any[];
  snapshots?: any[];
  mediumOfLearning?: string;
  isEnglish?: boolean;
  onDiscussWithCherry?: (params: {
    topic: string;
    subject: string;
    conceptTested?: string;
    hint?: string;
    question?: string;
  }) => void;
  onEnterClassroom?: () => void;
}

interface SubtopicNode {
  id: string;
  title: string;
  hindiTitle?: string;
  weightagePercent: number; // contribution to chapter
  keyFormula?: string;
  difficulty: "easy" | "medium" | "hard";
  examType: string; // e.g. "3-Mark Numerical", "5-Mark Derivation", "1-Mark MCQ"
  coreTakeaway: string;
  hindiCoreTakeaway?: string;
}

interface ChapterCurriculum {
  id: string;
  chapterNumber: number;
  title: string;
  hindiTitle?: string;
  subject: "Mathematics" | "Physics" | "Chemistry" | "Biology";
  grade: number; // 9, 10, 11, 12
  boardWeightageMarks: number; // e.g. 10 marks in 80-mark board paper
  tier: "critical" | "high" | "moderate";
  subtopics: SubtopicNode[];
}

// Comprehensive Official Curriculum Database (CBSE, ICSE, State Boards & Competitions)
const CURRICULUM_DATABASE: ChapterCurriculum[] = [
  // Class 10 / 12 Mathematics
  {
    id: "math-quad",
    chapterNumber: 4,
    title: "Quadratic Equations & Roots",
    hindiTitle: "द्विघात समीकरण एवं मूल",
    subject: "Mathematics",
    grade: 10,
    boardWeightageMarks: 6,
    tier: "high",
    subtopics: [
      {
        id: "math-quad-1",
        title: "Standard Form & Nature of Roots (Discriminant D)",
        hindiTitle: "मानक रूप व मूलों की प्रकृति (विविक्तकर D)",
        weightagePercent: 40,
        keyFormula: "D = b^2 - 4ac",
        difficulty: "easy",
        examType: "1-Mark MCQ & 2-Mark Short Answer",
        coreTakeaway: "D > 0: Real & distinct roots; D = 0: Equal roots; D < 0: Imaginary conjugate roots.",
        hindiCoreTakeaway: "D > 0: वास्तविक व भिन्न मूल; D = 0: समान मूल; D < 0: काल्पनिक मूल।"
      },
      {
        id: "math-quad-2",
        title: "Solving by Factorization & Quadratic Formula",
        hindiTitle: "गुणनखंडन एवं श्रीधराचार्य सूत्र द्वारा हल",
        weightagePercent: 35,
        keyFormula: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
        difficulty: "medium",
        examType: "3-Mark Problem Solving",
        coreTakeaway: "Apply Sridharacharya quadratic formula accurately with double sign checks.",
        hindiCoreTakeaway: "द्विघाती सूत्र लगाते समय चिह्नों (+/-) की दोबारा जांच अवश्य करें।"
      },
      {
        id: "math-quad-3",
        title: "Real-Life Word Problems (Speed, Time, Area)",
        hindiTitle: "व्यावहारिक शाब्दिक प्रश्न (चाल, समय, क्षेत्रफल)",
        weightagePercent: 25,
        difficulty: "hard",
        examType: "5-Mark Long Application Case Study",
        coreTakeaway: "Translating word statements into quadratic algebra and rejecting negative extraneous roots.",
        hindiCoreTakeaway: "कथन को समीकरण में बदलें तथा अमान्य ऋणात्मक मान को हटाएं।"
      }
    ]
  },
  {
    id: "math-trig",
    chapterNumber: 8,
    title: "Introduction to Trigonometry & Identities",
    hindiTitle: "त्रिकोणमिति का परिचय एवं सर्वसमिकाएँ",
    subject: "Mathematics",
    grade: 10,
    boardWeightageMarks: 10,
    tier: "critical",
    subtopics: [
      {
        id: "math-trig-1",
        title: "Trigonometric Ratios & Specific Angles (0°, 30°, 45°, 60°, 90°)",
        hindiTitle: "त्रिकोणमितीय अनुपात एवं विशिष्ट कोण सारणी",
        weightagePercent: 30,
        keyFormula: "\\sin 30^\\circ = \\frac{1}{2}, \\; \\tan 45^\\circ = 1",
        difficulty: "easy",
        examType: "2-Mark Direct Evaluation",
        coreTakeaway: "Memorize the standard ratio table and exact reciprocal transformations.",
        hindiCoreTakeaway: "विशिष्ट कोणों के सटीक मान व व्युत्क्रम संबंधों (sin/csc, cos/sec) को याद रखें।"
      },
      {
        id: "math-trig-2",
        title: "Fundamental Pythagorean Identities & Proofs",
        hindiTitle: "मूलभूत पाइथागोरस सर्वसमिकाएँ एवं सिद्ध करना",
        weightagePercent: 45,
        keyFormula: "\\sin^2 \\theta + \\cos^2 \\theta = 1, \\; 1 + \\tan^2 \\theta = \\sec^2 \\theta",
        difficulty: "hard",
        examType: "5-Mark Step-by-Step Proof",
        coreTakeaway: "Conversions to sin/cos and algebraic rationalization are the core proof techniques.",
        hindiCoreTakeaway: "सभी पदों को sin व cos में बदलना और परिमेयकरण करना सबसे असरदार सिद्ध विधि है।"
      },
      {
        id: "math-trig-3",
        title: "Heights and Distances (Angles of Elevation & Depression)",
        hindiTitle: "ऊंचाई एवं दूरी (उन्नयन व अवनमन कोण)",
        weightagePercent: 25,
        keyFormula: "\\tan \\theta = \\frac{\\text{Opposite (Height)}}{\\text{Adjacent (Distance)}}",
        difficulty: "medium",
        examType: "4-Mark Case-Based Diagram Problem",
        coreTakeaway: "Draw clean geometry triangles and apply tan θ for two-level angle problems.",
        hindiCoreTakeaway: "स्पष्ट समकोण त्रिभुज बनाएं और ऊंचाई-दूरी के लिए tan θ का सटीक उपयोग करें।"
      }
    ]
  },
  // Class 10 Science: Physics, Chemistry & Biology
  {
    id: "phy-light-10",
    chapterNumber: 10,
    title: "Light - Reflection & Refraction",
    hindiTitle: "प्रकाश - परावर्तन तथा अपवर्तन",
    subject: "Physics",
    grade: 10,
    boardWeightageMarks: 8,
    tier: "critical",
    subtopics: [
      {
        id: "phy-light-1",
        title: "Spherical Mirrors & Mirror Formula",
        hindiTitle: "गोलीय दर्पण एवं दर्पण सूत्र",
        weightagePercent: 35,
        keyFormula: "\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}, \\quad m = -\\frac{v}{u}",
        difficulty: "medium",
        examType: "3-Mark Ray Diagram & Numerical",
        coreTakeaway: "New Cartesian sign convention: u is always negative; concave mirror focal length is negative.",
        hindiCoreTakeaway: "कार्तीय चिह्न परिपाटी: वस्तु दूरी u सदैव ऋणात्मक तथा अवतल दर्पण का f ऋणात्मक होता है।"
      },
      {
        id: "phy-light-2",
        title: "Refraction through Glass Slab & Snell's Law",
        hindiTitle: "कांच के स्लैब से अपवर्तन व स्नैल का नियम",
        weightagePercent: 30,
        keyFormula: "n = \\frac{\\sin i}{\\sin r} = \\frac{c}{v}",
        difficulty: "easy",
        examType: "2-Mark Concept & Lateral Displacement",
        coreTakeaway: "Light bends toward the normal when entering a denser medium; lateral shift depends on slab thickness.",
        hindiCoreTakeaway: "सघन माध्यम में प्रकाश अभिलंब की ओर झुकता है; पार्श्व विस्थापन स्लैब की मोटाई पर निर्भर करता है।"
      },
      {
        id: "phy-light-3",
        title: "Lens Formula & Power of a Lens",
        hindiTitle: "लेंस सूत्र एवं लेंस की क्षमता",
        weightagePercent: 35,
        keyFormula: "\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}, \\quad P = \\frac{1}{f(\\text{m})}",
        difficulty: "hard",
        examType: "5-Mark Derivation & Dioptre Numerical",
        coreTakeaway: "Power is measured in Dioptres (D) with focal length strictly in metres; convex lens power is positive.",
        hindiCoreTakeaway: "क्षमता P = 1/f(मीटर) डायोप्टर में होती है; उत्तल लेंस की क्षमता धनात्मक होती है।"
      }
    ]
  },
  {
    id: "chem-rxn-10",
    chapterNumber: 1,
    title: "Chemical Reactions & Equations",
    hindiTitle: "रासायनिक अभिक्रियाएँ एवं समीकरण",
    subject: "Chemistry",
    grade: 10,
    boardWeightageMarks: 6,
    tier: "high",
    subtopics: [
      {
        id: "chem-rxn-1",
        title: "Balancing Chemical Equations (Hit & Trial)",
        hindiTitle: "रासायनिक समीकरणों को संतुलित करना",
        weightagePercent: 40,
        keyFormula: "3\\text{Fe} + 4\\text{H}_2\\text{O} \\to \\text{Fe}_3\\text{O}_4 + 4\\text{H}_2",
        difficulty: "easy",
        examType: "2-Mark Direct Balancing",
        coreTakeaway: "Law of conservation of mass: number of atoms of each element must remain constant on both sides.",
        hindiCoreTakeaway: "द्रव्यमान संरक्षण नियम: दोनों ओर प्रत्येक तत्व के परमाणुओं की संख्या समान होनी चाहिए।"
      },
      {
        id: "chem-rxn-2",
        title: "Types of Reactions: Combination, Decomposition, Displacement",
        hindiTitle: "अभिक्रियाओं के प्रकार (संयोजन, वियोजन, विस्थापन)",
        weightagePercent: 35,
        difficulty: "medium",
        examType: "3-Mark Identification & Color Change",
        coreTakeaway: "Observe characteristic color shifts (e.g., Fe in CuSO4 turns pale green; heating FeSO4 gives brown Fe2O3).",
        hindiCoreTakeaway: "रंग परिवर्तन याद रखें (CuSO4 में लोहे की कील डालने पर रंग नीला से हल्का हरा हो जाता है)।"
      },
      {
        id: "chem-rxn-3",
        title: "Redox Reactions, Corrosion & Rancidity",
        hindiTitle: "उपचयन-अपचयन (रेडॉक्स), संक्षारण एवं विकृतगंधिता",
        weightagePercent: 25,
        difficulty: "medium",
        examType: "3-Mark Identifying Oxidizing/Reducing Agent",
        coreTakeaway: "Oxidation is gain of oxygen/loss of electrons; reduction is loss of oxygen/gain of electrons.",
        hindiCoreTakeaway: "ऑक्सीजन का जुड़ना उपचयन है, और ऑक्सीजन का हटना या हाइड्रोजन का जुड़ना अपचयन है।"
      }
    ]
  },
  {
    id: "bio-life-10",
    chapterNumber: 6,
    title: "Life Processes & Physiological Systems",
    hindiTitle: "जैव प्रक्रम एवं शारीरिक तंत्र",
    subject: "Biology",
    grade: 10,
    boardWeightageMarks: 9,
    tier: "critical",
    subtopics: [
      {
        id: "bio-life-1",
        title: "Autotrophic Nutrition & Stomatal Regulation",
        hindiTitle: "स्वपोषी पोषण एवं रंध्रों की कार्यप्रणाली",
        weightagePercent: 30,
        keyFormula: "6\\text{CO}_2 + 12\\text{H}_2\\text{O} \\xrightarrow{\\text{Light}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 + 6\\text{H}_2\\text{O}",
        difficulty: "easy",
        examType: "3-Mark Diagram & Chlorophyll Experiment",
        coreTakeaway: "Guard cells swell when water flows in, opening the stomatal pore; transpiration generates suction pull.",
        hindiCoreTakeaway: "द्वार कोशिकाओं में जल भरने से रंध्र खुलते हैं; वाष्पोत्सर्जन से जल ऊपर खिंचता है।"
      },
      {
        id: "bio-life-2",
        title: "Human Circulatory System & Double Circulation",
        hindiTitle: "मानव परिसंचरण तंत्र एवं दोहरा परिसंचरण",
        weightagePercent: 40,
        difficulty: "medium",
        examType: "5-Mark Heart Diagram & Pathway Description",
        coreTakeaway: "Blood passes twice through the heart per complete cycle (pulmonary and systemic circulation).",
        hindiCoreTakeaway: "एक पूरे चक्र में रक्त हृदय से दो बार गुजरता है (फुफ्फुसीय व दैहिक परिसंचरण)।"
      },
      {
        id: "bio-life-3",
        title: "Excretion & Nephron Structure",
        hindiTitle: "उत्सर्जन तंत्र एवं वृक्काणु (नेफ्रॉन) की संरचना",
        weightagePercent: 30,
        difficulty: "hard",
        examType: "4-Mark Nephron Working & Ultrafiltration",
        coreTakeaway: "Glomerular filtration separates nitrogenous waste; selective reabsorption recovers glucose, amino acids, and water.",
        hindiCoreTakeaway: "बोमन सम्पुट में निस्यंदन होता है; आवश्यक ग्लूकोज, लवण व जल का पुनरावशोषण होता है।"
      }
    ]
  },
  {
    id: "math-calc",
    chapterNumber: 5,
    title: "Continuity, Differentiability & Derivatives",
    hindiTitle: "सांतत्य, अवकलनीयता एवं अवकलज",
    subject: "Mathematics",
    grade: 12,
    boardWeightageMarks: 12,
    tier: "critical",
    subtopics: [
      {
        id: "math-calc-1",
        title: "Continuity Tests & Left/Right Hand Limits",
        hindiTitle: "सांतत्य परीक्षण एवं वाम/दक्षिण सीमा",
        weightagePercent: 30,
        keyFormula: "\\lim_{x \\to a^-} f(x) = \\lim_{x \\to a^+} f(x) = f(a)",
        difficulty: "medium",
        examType: "3-Mark Limit Evaluation",
        coreTakeaway: "A function must be defined and both directional limits must coincide.",
        hindiCoreTakeaway: "फ़लन का परिभाषित होना और दोनों दिशाओं की सीमाओं (LHL = RHL = f(a)) का समान होना अनिवार्य है।"
      },
      {
        id: "math-calc-2",
        title: "Chain Rule, Product & Quotient Derivatives",
        hindiTitle: "श्रृंखला नियम, गुणन एवं भागफल अवकलन",
        weightagePercent: 40,
        keyFormula: "\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)",
        difficulty: "medium",
        examType: "4-Mark Differentiation",
        coreTakeaway: "Systematic outside-in differentiation without dropping intermediate differential terms.",
        hindiCoreTakeaway: "बाहर से अंदर की ओर चरणबद्ध अवकलन करें, किसी मध्यवर्ती पद को न छोड़ें।"
      },
      {
        id: "math-calc-3",
        title: "Logarithmic & Parametric Differentiation",
        hindiTitle: "लघुगणकीय एवं प्राचलिक अवकलन",
        weightagePercent: 30,
        keyFormula: "\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}",
        difficulty: "hard",
        examType: "5-Mark Derivation",
        coreTakeaway: "Taking natural log on both sides simplifies complex exponents and variable powers.",
        hindiCoreTakeaway: "दोनों पक्षों का लॉग (ln) लेने से घातांक सरल गुणन में बदल जाते हैं।"
      }
    ]
  },

  // Physics
  {
    id: "phy-optics",
    chapterNumber: 9,
    title: "Ray Optics & Optical Instruments",
    hindiTitle: "किरण प्रकाशिकी एवं प्रकाशिक यंत्र",
    subject: "Physics",
    grade: 12,
    boardWeightageMarks: 9,
    tier: "critical",
    subtopics: [
      {
        id: "phy-optics-1",
        title: "Snell's Law & Total Internal Reflection (TIR)",
        hindiTitle: "स्नैल का नियम एवं पूर्ण आंतरिक परावर्तन",
        weightagePercent: 35,
        keyFormula: "\\sin \\theta_c = \\frac{n_{\\text{rarer}}}{n_{\\text{denser}}}",
        difficulty: "easy",
        examType: "2-Mark Theory & Prism Application",
        coreTakeaway: "TIR occurs when light travels from denser to rarer medium with angle > critical angle.",
        hindiCoreTakeaway: "पूर्ण आंतरिक परावर्तन तब होता है जब प्रकाश सघन से विरल माध्यम में क्रांतिक कोण से अधिक कोण पर जाता है।"
      },
      {
        id: "phy-optics-2",
        title: "Lens Maker's Formula & Thin Lens Combinations",
        hindiTitle: "लेंस मेकर सूत्र एवं पतले लेंस संयोजन",
        weightagePercent: 40,
        keyFormula: "\\frac{1}{f} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)",
        difficulty: "hard",
        examType: "5-Mark Derivation with Sign Convention",
        coreTakeaway: "Cartesian sign convention (+/-) on curvature radii determines focal length sign.",
        hindiCoreTakeaway: "वक्रता त्रिज्याओं (R1, R2) पर कार्तीय चिह्न परिपाटी से फोकस दूरी का सही चिह्न तय होता है।"
      },
      {
        id: "phy-optics-3",
        title: "Compound Microscope & Astronomical Telescope Magnification",
        hindiTitle: "संयुक्त सूक्ष्मदर्शी एवं खगोलीय दूरदर्शी आवर्धन",
        weightagePercent: 25,
        keyFormula: "m = -\\frac{L}{f_o} \\cdot \\frac{D}{f_e}",
        difficulty: "medium",
        examType: "3-Mark Ray Diagram & Numerical",
        coreTakeaway: "Ray diagrams with labeled focal points and virtual/real image orientation.",
        hindiCoreTakeaway: "किरण आरेख में फ़ोकस बिंदुओं और वास्तविक/आभासी प्रतिबिंब की दिशा का स्पष्ट अंकन करें।"
      }
    ]
  },
  {
    id: "phy-elec",
    chapterNumber: 3,
    title: "Current Electricity & Circuit Networks",
    hindiTitle: "विद्युत धारा एवं परिपथ नेटवर्क",
    subject: "Physics",
    grade: 12,
    boardWeightageMarks: 8,
    tier: "high",
    subtopics: [
      {
        id: "phy-elec-1",
        title: "Drift Velocity, Current Density & Ohm's Microscopic Law",
        hindiTitle: "अपवाह वेग, धारा घनत्व एवं सूक्ष्म ओम नियम",
        weightagePercent: 30,
        keyFormula: "I = n e A v_d, \\quad v_d = \\frac{e E \\tau}{m}",
        difficulty: "medium",
        examType: "3-Mark Derivation",
        coreTakeaway: "Direct proportionality between relaxation time τ and temperature conductivity.",
        hindiCoreTakeaway: "विश्रांति काल τ तापमान बढ़ने पर घटता है, जिससे चालकों का प्रतिरोध बढ़ता है।"
      },
      {
        id: "phy-elec-2",
        title: "Kirchhoff's Laws (KCL & KVL) & Mesh Analysis",
        hindiTitle: "किरचॉफ के नियम (KCL एवं KVL) व लूप विश्लेषण",
        weightagePercent: 45,
        keyFormula: "\\sum I = 0 \\quad (\\text{Charge}), \\quad \\sum \\Delta V = 0 \\quad (\\text{Energy})",
        difficulty: "hard",
        examType: "5-Mark Complex Loop Numerical",
        coreTakeaway: "Loop direction conventions determine battery EMF and resistor IR potential drops.",
        hindiCoreTakeaway: "KCL आवेश संरक्षण पर आधारित है तथा KVL ऊर्जा संरक्षण पर; लूप दिशा चिह्नों का ध्यान रखें।"
      },
      {
        id: "phy-elec-3",
        title: "Balanced Wheatstone Bridge & Potentiometer Sensitivity",
        hindiTitle: "संतुलित व्हीटस्टोन सेतु एवं विभवमापी सुग्राहिता",
        weightagePercent: 25,
        keyFormula: "\\frac{P}{Q} = \\frac{R}{S} \\implies I_{\\text{galv}} = 0",
        difficulty: "easy",
        examType: "3-Mark Null-Point Calculation",
        coreTakeaway: "Null-point bridge nullifies internal meter resistance for exact potential measurement.",
        hindiCoreTakeaway: "शून्य-विक्षेप स्थिति में गैल्वेनोमीटर में कोई धारा नहीं बहती, जिससे सटीक मापन होता है।"
      }
    ]
  },

  // Chemistry
  {
    id: "chem-bond",
    chapterNumber: 4,
    title: "Chemical Bonding & Molecular Orbital Theory",
    hindiTitle: "रासायनिक आबंधन एवं आण्विक कक्षक सिद्धांत",
    subject: "Chemistry",
    grade: 11,
    boardWeightageMarks: 7,
    tier: "high",
    subtopics: [
      {
        id: "chem-bond-1",
        title: "VSEPR Theory & Hybridization (sp, sp², sp³, dsp³)",
        hindiTitle: "VSEPR सिद्धांत एवं संकरण (sp, sp², sp³, dsp³)",
        weightagePercent: 40,
        difficulty: "medium",
        examType: "3-Mark Molecular Geometry",
        coreTakeaway: "Lone pair - lone pair repulsions compress ideal bond angles (e.g. NH3 107°, H2O 104.5°).",
        hindiCoreTakeaway: "एकाकी युग्म-एकाकी युग्म प्रतिकर्षण आदर्श बंध कोण को संकुचित करता है (NH3 107°, H2O 104.5°)।"
      },
      {
        id: "chem-bond-2",
        title: "Molecular Orbital Theory (MOT) & Magnetic Properties",
        hindiTitle: "आण्विक कक्षक सिद्धांत (MOT) एवं चुंबकीय प्रकृति",
        weightagePercent: 40,
        keyFormula: "\\text{Bond Order} = \\frac{N_b - N_a}{2}",
        difficulty: "hard",
        examType: "4-Mark Energy Diagram & Paramagnetism",
        coreTakeaway: "Unpaired electrons in degenerate antibonding π* orbitals explain O2 paramagnetism.",
        hindiCoreTakeaway: "अयुग्मित इलेक्ट्रॉनों की उपस्थिति के कारण O2 अणु अनुचुंबकीय (paramagnetic) होता है।"
      },
      {
        id: "chem-bond-3",
        title: "Intermolecular Forces & Hydrogen Bonding Effects",
        hindiTitle: "अंतराआण्विक बल एवं हाइड्रोजन आबंधन के प्रभाव",
        weightagePercent: 20,
        difficulty: "easy",
        examType: "2-Mark Boiling Point Reasoning",
        coreTakeaway: "Intramolecular vs intermolecular H-bonding directly controls volatility and solubility.",
        hindiCoreTakeaway: "अंतरा-आण्विक हाइड्रोजन बंध क्वथनांक व विलेयता को उल्लेखनीय रूप से बढ़ा देता है।"
      }
    ]
  },
  {
    id: "chem-thermo",
    chapterNumber: 6,
    title: "Chemical Thermodynamics & Gibbs Free Energy",
    hindiTitle: "रासायनिक ऊष्मागतिकी एवं गिब्स मुक्त ऊर्जा",
    subject: "Chemistry",
    grade: 11,
    boardWeightageMarks: 8,
    tier: "critical",
    subtopics: [
      {
        id: "chem-thermo-1",
        title: "First Law of Thermodynamics & Enthalpy of Reaction",
        hindiTitle: "ऊष्मागतिकी का प्रथम नियम एवं अभिक्रिया एन्थैल्पी",
        weightagePercent: 30,
        keyFormula: "\\Delta U = q + w, \\quad \\Delta H = \\Delta U + \\Delta n_g R T",
        difficulty: "medium",
        examType: "3-Mark State Function Numerical",
        coreTakeaway: "Work w = -P_ext ΔV in reversible/irreversible gas expansions.",
        hindiCoreTakeaway: "गैस के प्रसार में कार्य w = -P_ext ΔV होता है; एन्थैल्पी एक अवस्था फलन है।"
      },
      {
        id: "chem-thermo-2",
        title: "Hess's Law of Constant Heat Summation",
        hindiTitle: "हेस का स्थिर ऊष्मा संकलन का नियम",
        weightagePercent: 30,
        keyFormula: "\\Delta H_r^\\circ = \\sum \\Delta H_f^\\circ(\\text{Products}) - \\sum \\Delta H_f^\\circ(\\text{Reactants})",
        difficulty: "easy",
        examType: "3-Mark Thermochemical Addition",
        coreTakeaway: "Total enthalpy change is path-independent; flip signs when reversing equations.",
        hindiCoreTakeaway: "अभिक्रिया की कुल एन्थैल्पी पथ पर निर्भर नहीं करती; समीकरण उलटने पर चिह्न पलट दें।"
      },
      {
        id: "chem-thermo-3",
        title: "Second Law, Entropy (ΔS) & Gibbs Spontaneity Criterion",
        hindiTitle: "द्वितीय नियम, एन्ट्रॉपी (ΔS) व स्वतःप्रवर्तिता कसौटी",
        weightagePercent: 40,
        keyFormula: "\\Delta G^\\circ = \\Delta H^\\circ - T\\Delta S^\\circ < 0",
        difficulty: "hard",
        examType: "4-Mark Feasibility Prediction",
        coreTakeaway: "Negative ΔG dictates strictly spontaneous reactions; at equilibrium ΔG = 0.",
        hindiCoreTakeaway: "स्वतःप्रवर्तित अभिक्रिया के लिए ΔG ऋणात्मक होना अनिवार्य है; साम्यावस्था पर ΔG = 0 होता है।"
      }
    ]
  },

  // Biology
  {
    id: "bio-gen",
    chapterNumber: 5,
    title: "Principles of Inheritance & Genetics",
    hindiTitle: "वंशागति तथा विविधता के सिद्धांत",
    subject: "Biology",
    grade: 12,
    boardWeightageMarks: 10,
    tier: "critical",
    subtopics: [
      {
        id: "bio-gen-1",
        title: "Mendelian Monohybrid & Dihybrid Crosses (3:1, 9:3:3:1)",
        hindiTitle: "मेंडेल के एकसंकर एवं द्विसंकर संकरण (3:1, 9:3:3:1)",
        weightagePercent: 35,
        difficulty: "easy",
        examType: "3-Mark Punnett Square Cross",
        coreTakeaway: "Law of Segregation and Independent Assortment govern unlinked allele distribution.",
        hindiCoreTakeaway: "पृथक्करण का नियम एवं स्वतंत्र अपव्यूहन का नियम एलील्स के वितरण को नियंत्रित करते हैं।"
      },
      {
        id: "bio-gen-2",
        title: "Chromosomal Linkage & Morgan's Drosophila Experiments",
        hindiTitle: "सहलग्नता एवं मॉर्गन के ड्रोसोफिला प्रयोग",
        weightagePercent: 40,
        keyFormula: "\\text{Recombination Freq (cM)} = \\frac{\\text{Recombinants}}{\\text{Total}} \\times 100",
        difficulty: "hard",
        examType: "5-Mark Genetic Mapping Problem",
        coreTakeaway: "Tight linkage reduces recombination frequency, violating independent assortment.",
        hindiCoreTakeaway: "सघन सहलग्नता पुनर्संयोजन आवृत्ति को कम करती है, जो स्वतंत्र अपव्यूहन का अपवाद है।"
      },
      {
        id: "bio-gen-3",
        title: "Sex Determination, Pedigree Analysis & Mendelian Disorders",
        hindiTitle: "लिंग निर्धारण, वंशावली विश्लेषण एवं मेंडेलीय विकार",
        weightagePercent: 25,
        difficulty: "medium",
        examType: "4-Mark Pedigree Chart Interpretation",
        coreTakeaway: "Tracing Autosomal vs X-linked recessive patterns (Hemophilia, Sickle Cell Anemia).",
        hindiCoreTakeaway: "अलिंगसूत्री बनाम X-सहलग्न अप्रभावी विकारों (हीमोफीलिया, सिकल सेल एनीमिया) का वंशावली चार्ट।"
      }
    ]
  }
];

export const CurriculumBlindspotTracker: React.FC<CurriculumBlindspotTrackerProps> = ({
  studentName = "Student",
  studentGrade = 12,
  pastSessions = [],
  quizAttempts = [],
  snapshots = [],
  mediumOfLearning,
  isEnglish,
  onDiscussWithCherry,
  onEnterClassroom
}) => {
  const isEng = isEnglish ?? (mediumOfLearning === "English");

  // Filters & State
  const [selectedBoard, setSelectedBoard] = useState<"CBSE" | "ICSE" | "State Board" | "NEET" | "JEE">("CBSE");
  const [selectedGrade, setSelectedGrade] = useState<number>(typeof studentGrade === "number" ? studentGrade : 12);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"all" | "blindspot" | "review" | "mastered">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedChapterIds, setExpandedChapterIds] = useState<Record<string, boolean>>({
    "math-trig": true,
    "phy-optics": true
  });

  // Toggle chapter collapse
  const toggleChapter = (chapterId: string) => {
    setExpandedChapterIds((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  // Helper to render math formulas safely
  const renderFormula = (formula?: string) => {
    if (!formula) return null;
    try {
      return (
        <span
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(formula, { displayMode: false, throwOnError: false })
          }}
        />
      );
    } catch {
      return <span>{formula}</span>;
    }
  };

  // Compute Topic Mastery & Blindspot Status from Student Real History
  const computedCurriculum = useMemo(() => {
    // Collect all topics touched in past sessions or quiz attempts
    const studiedTopicNames = new Set<string>();
    const highScoredTopicNames = new Set<string>();

    pastSessions.forEach((s) => {
      if (s.topic) studiedTopicNames.add(s.topic.toLowerCase());
      if (s.subject) studiedTopicNames.add(s.subject.toLowerCase());
    });

    quizAttempts.forEach((q) => {
      const topic = (q.topic || "").toLowerCase();
      studiedTopicNames.add(topic);
      const score = typeof q.percentage === "number" ? q.percentage : (q.score / (q.totalQuestions || 1)) * 100;
      if (score >= 70) {
        highScoredTopicNames.add(topic);
      }
    });

    snapshots.forEach((snap) => {
      if (snap.topic) studiedTopicNames.add(snap.topic.toLowerCase());
    });

    let totalCurriculumMarks = 0;
    let lockedCurriculumMarks = 0;
    let totalSubtopicsCount = 0;
    let masteredCount = 0;
    let inProgressCount = 0;
    let blindspotCount = 0;

    const chapters = CURRICULUM_DATABASE.filter((ch) => {
      if (selectedGrade !== 0 && ch.grade !== selectedGrade) {
        // Also allow showing relevant chapters if selected
        if (selectedGrade === 10 && ch.grade !== 10) return false;
        if (selectedGrade === 12 && ch.grade < 11) return false;
      }
      if (selectedSubject !== "all" && ch.subject.toLowerCase() !== selectedSubject.toLowerCase()) {
        return false;
      }
      return true;
    }).map((chapter) => {
      totalCurriculumMarks += chapter.boardWeightageMarks;

      const subtopicsWithStatus = chapter.subtopics.map((sub) => {
        totalSubtopicsCount++;
        const titleLower = sub.title.toLowerCase();
        const chapterLower = chapter.title.toLowerCase();

        // Check if student has touched this topic
        const hasStudied =
          studiedTopicNames.has(titleLower) ||
          studiedTopicNames.has(chapterLower) ||
          Array.from(studiedTopicNames).some((t) => titleLower.includes(t) || t.includes(titleLower));

        const isMastered =
          hasStudied &&
          (highScoredTopicNames.has(titleLower) ||
            highScoredTopicNames.has(chapterLower) ||
            Array.from(highScoredTopicNames).some((t) => titleLower.includes(t)));

        let status: "blindspot" | "review" | "mastered" = "blindspot";
        if (isMastered) {
          status = "mastered";
          masteredCount++;
        } else if (hasStudied) {
          status = "review";
          inProgressCount++;
        } else {
          status = "blindspot";
          blindspotCount++;
        }

        return {
          ...sub,
          status
        };
      });

      // Chapter Completion Percentage
      const masteredSubtopics = subtopicsWithStatus.filter((s) => s.status === "mastered").length;
      const reviewSubtopics = subtopicsWithStatus.filter((s) => s.status === "review").length;
      const chapterScoreFraction =
        (masteredSubtopics * 1.0 + reviewSubtopics * 0.5) / (subtopicsWithStatus.length || 1);
      const chapterCompletionPercent = Math.round(chapterScoreFraction * 100);

      const chapterLockedMarks = Number((chapter.boardWeightageMarks * chapterScoreFraction).toFixed(1));
      lockedCurriculumMarks += chapterLockedMarks;

      return {
        ...chapter,
        subtopics: subtopicsWithStatus,
        chapterCompletionPercent,
        chapterLockedMarks,
        isFullyCovered: chapterCompletionPercent >= 80,
        hasBlindspots: subtopicsWithStatus.some((s) => s.status === "blindspot")
      };
    });

    // Filter by search query & status filter
    const filteredChapters = chapters.filter((ch) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesChapter =
          ch.title.toLowerCase().includes(q) ||
          (ch.hindiTitle && ch.hindiTitle.toLowerCase().includes(q)) ||
          ch.subject.toLowerCase().includes(q);
        const matchesSub = ch.subtopics.some(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            (s.hindiTitle && s.hindiTitle.toLowerCase().includes(q)) ||
            s.examType.toLowerCase().includes(q)
        );
        if (!matchesChapter && !matchesSub) return false;
      }

      if (selectedStatusFilter === "blindspot") {
        return ch.subtopics.some((s) => s.status === "blindspot");
      }
      if (selectedStatusFilter === "review") {
        return ch.subtopics.some((s) => s.status === "review");
      }
      if (selectedStatusFilter === "mastered") {
        return ch.subtopics.some((s) => s.status === "mastered");
      }

      return true;
    });

    const overallSyllabusPercent =
      totalCurriculumMarks > 0 ? Math.round((lockedCurriculumMarks / totalCurriculumMarks) * 100) : 0;

    return {
      chapters: filteredChapters,
      allChapters: chapters,
      totalCurriculumMarks,
      lockedCurriculumMarks: Number(lockedCurriculumMarks.toFixed(1)),
      overallSyllabusPercent,
      totalSubtopicsCount,
      masteredCount,
      inProgressCount,
      blindspotCount
    };
  }, [selectedBoard, selectedGrade, selectedSubject, selectedStatusFilter, searchQuery, pastSessions, quizAttempts, snapshots]);

  // Find next highest-yield blindspot recommendation
  const topYieldBlindspot = useMemo(() => {
    for (const ch of computedCurriculum.allChapters) {
      const blindspot = ch.subtopics.find((s) => s.status === "blindspot");
      if (blindspot) {
        return {
          chapter: ch,
          subtopic: blindspot
        };
      }
    }
    return null;
  }, [computedCurriculum.allChapters]);

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in text-left w-full max-w-full overflow-hidden">
      {/* Hero Header Card with Clean Mobile Metrics */}
      <div className="bg-white border border-[#EFF1F5] rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-slate-900 shadow-xs relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-indigo-50 text-[#796AEF] font-bold px-3 py-1 rounded-full border border-indigo-200/80 flex items-center gap-1.5 shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-[#796AEF]" />
              {isEng ? "Syllabus Radar" : "Syllabus Radar • पाठ्यक्रम रडार"}
            </span>
            <span className="text-[11px] font-mono text-slate-500 bg-[#F6F7FB] px-2.5 py-1 rounded-md border border-[#EFF1F5]">
              {selectedBoard} • {selectedGrade === 0 ? "All Classes" : `Class ${selectedGrade}`} Blueprint
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Syllabus Coverage, Marks Lock & Blindspots
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5 leading-relaxed">
            {isEng
              ? "Track untouched theorems, formulas, and chapters to maximize your board exam score."
              : "बोर्ड परीक्षा में 100% स्कोर के लिए अनछुए प्रमेय, सूत्र और चैप्टर्स ट्रैक करें।"}
          </p>
        </div>

        {/* 4 Metric Bento Cards - Grid 2x2 on Mobile, 4x1 on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
          {/* Syllabus Done */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                Syllabus Done
              </span>
              <Target className="w-3.5 h-3.5 text-[#796AEF]" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#796AEF] font-mono leading-none">
              {computedCurriculum.overallSyllabusPercent}%
            </div>
            <span className="text-[10px] text-slate-500 font-medium block">
              {isEng ? "Overall Coverage" : "पाठ्यक्रम पूर्ण"}
            </span>
          </div>

          {/* Board Marks */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-700">
                Board Marks
              </span>
              <Award className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-800 font-mono leading-none">
              {computedCurriculum.lockedCurriculumMarks} <span className="text-xs font-normal text-emerald-600">/ {computedCurriculum.totalCurriculumMarks}</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block">
              {isEng ? "Marks Locked" : "सुरक्षित अंक (Locked)"}
            </span>
          </div>

          {/* Blindspots */}
          <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-3 text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-rose-700">
                Blindspots
              </span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-700 font-mono leading-none">
              {computedCurriculum.blindspotCount}
            </div>
            <span className="text-[10px] text-rose-600 font-medium block">
              {isEng ? "Untouched Topics" : "छूटे विषय (Un-Touched)"}
            </span>
          </div>

          {/* Mastered */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-800">
                Mastered
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-800 font-mono leading-none">
              {computedCurriculum.masteredCount}
            </div>
            <span className="text-[10px] text-amber-700 font-medium block">
              {isEng ? "Exam Ready" : "पक्का तैयार (Exam Ready)"}
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Sprint: Highest Yield Blindspot Alert */}
      {topYieldBlindspot && (
        <div className="bg-white border-2 border-rose-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-slate-900 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10.5px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-1 rounded-md border border-rose-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                {isEng ? "Priority 1 Exam Blindspot" : "Priority 1 Exam Blindspot • उच्च प्राथमिकता ब्लाइंडस्पॉट"}
              </span>
              <span className="text-[10.5px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                {isEng
                  ? `+${topYieldBlindspot.chapter.boardWeightageMarks} Potential Board Marks`
                  : `+${topYieldBlindspot.chapter.boardWeightageMarks} संभावित बोर्ड अंक`}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
              {topYieldBlindspot.chapter.title}{!isEng && topYieldBlindspot.chapter.hindiTitle ? ` (${topYieldBlindspot.chapter.hindiTitle})` : ""}
              <span className="text-[#796AEF] ml-1.5">
                • {topYieldBlindspot.subtopic.title}
              </span>
            </h4>
            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 font-medium">
              {(isEng ? topYieldBlindspot.subtopic.coreTakeaway : topYieldBlindspot.subtopic.hindiCoreTakeaway) || topYieldBlindspot.subtopic.coreTakeaway}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onDiscussWithCherry) {
                onDiscussWithCherry({
                  topic: topYieldBlindspot.subtopic.title,
                  subject: topYieldBlindspot.chapter.subject,
                  conceptTested: topYieldBlindspot.subtopic.title,
                  hint: topYieldBlindspot.subtopic.coreTakeaway,
                  question: `Cherry Ma'am, let's cover this crucial board exam blindspot: "${topYieldBlindspot.subtopic.title}" from ${topYieldBlindspot.chapter.title} step-by-step on the blackboard!`
                });
              } else if (onEnterClassroom) {
                onEnterClassroom();
              }
            }}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#796AEF] hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{isEng ? "Eliminate Blindspot with Cherry 🚀" : "मैम से अभी सीखें • Eliminate Blindspot 🚀"}</span>
          </button>
        </div>
      )}

      {/* Filter & Control Bar */}
      <div className="bg-white border border-[#EFF1F5] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-xs space-y-3.5 text-left">
        {/* Search Box */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEng ? "Search topics, theorems, or formulas..." : "विषय, प्रमेय या फ़ॉर्मूला खोजें (Search topics, formulas)..."}
            className="w-full min-h-[42px] pl-10 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#796AEF]/30 focus:border-[#796AEF] text-slate-900 font-medium placeholder:text-slate-400"
          />
        </div>

        {/* Board and Grade selectors */}
        <div className="space-y-2">
          {/* Board Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10.5px] font-bold text-slate-400 shrink-0 uppercase tracking-wider mr-1">
              Board:
            </span>
            {(["CBSE", "ICSE", "State Board", "NEET", "JEE"] as const).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setSelectedBoard(b)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                  selectedBoard === b
                    ? "bg-[#796AEF] text-white border-[#796AEF] shadow-2xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {b === "State Board" ? "State Board" : b}
              </button>
            ))}
          </div>

          {/* Grade Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10.5px] font-bold text-slate-400 shrink-0 uppercase tracking-wider mr-1">
              Class:
            </span>
            {[
              { label: isEng ? "Class 10" : "Class 10 (कक्षा 10)", grade: 10 },
              { label: isEng ? "Class 11" : "Class 11 (कक्षा 11)", grade: 11 },
              { label: isEng ? "Class 12" : "Class 12 (कक्षा 12)", grade: 12 },
              { label: isEng ? "All Classes" : "All (सभी)", grade: 0 }
            ].map((g) => (
              <button
                key={g.grade}
                type="button"
                onClick={() => setSelectedGrade(g.grade)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                  selectedGrade === g.grade
                    ? "bg-[#796AEF] text-white border-[#796AEF] shadow-2xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100">
          {[
            { id: "all", label: "🌐 All Subjects" },
            { id: "Mathematics", label: isEng ? "📐 Mathematics" : "📐 गणित (Maths)" },
            { id: "Physics", label: isEng ? "⚡ Physics" : "⚡ भौतिकी (Physics)" },
            { id: "Chemistry", label: isEng ? "🧪 Chemistry" : "🧪 रसायन (Chemistry)" },
            { id: "Biology", label: isEng ? "🧬 Biology" : "🧬 जीव विज्ञान (Bio)" }
          ].map((subj) => (
            <button
              key={subj.id}
              type="button"
              onClick={() => setSelectedSubject(subj.id)}
              className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border flex items-center justify-center ${
                selectedSubject === subj.id
                  ? "bg-[#796AEF] text-white border-[#796AEF] shadow-2xs"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {subj.label}
            </button>
          ))}
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { key: "all", label: isEng ? "All" : "All • सभी", count: computedCurriculum.totalSubtopicsCount },
            { key: "blindspot", label: isEng ? "Blindspots" : "Blindspots • छूटे हुए", count: computedCurriculum.blindspotCount },
            { key: "review", label: isEng ? "In-Progress" : "In-Progress • प्रगति पर", count: computedCurriculum.inProgressCount },
            { key: "mastered", label: isEng ? "Mastered" : "Mastered • सिद्ध", count: computedCurriculum.masteredCount }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedStatusFilter(tab.key as any)}
              className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap border ${
                selectedStatusFilter === tab.key
                  ? "bg-[#1E293B] text-white border-[#1E293B] shadow-2xs"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1.5 opacity-80 font-mono">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chapters & Subtopics Interactive Tree */}
      <div className="space-y-4">
        {computedCurriculum.chapters.length > 0 ? (
          computedCurriculum.chapters.map((ch) => {
            const isExpanded = expandedChapterIds[ch.id] ?? false;

            return (
              <div
                key={ch.id}
                className={`bg-white border rounded-2xl sm:rounded-3xl transition-all overflow-hidden ${
                  ch.hasBlindspots
                    ? "border-slate-200 shadow-2xs hover:border-indigo-300"
                    : "border-emerald-200/80 shadow-2xs bg-gradient-to-br from-white to-emerald-50/15"
                }`}
              >
                {/* Chapter Main Bar (Accordion Header) */}
                <div
                  onClick={() => toggleChapter(ch.id)}
                  className="p-3.5 sm:p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3.5 cursor-pointer hover:bg-slate-50/70 transition-colors select-none"
                >
                  <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0">
                    <button
                      type="button"
                      aria-label="Toggle Chapter"
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors mt-0.5 sm:mt-0 min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-[#796AEF]" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                          {ch.subject} • Class {ch.grade}
                        </span>

                        <span className="text-[9.5px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {isEng ? `🎯 ${ch.boardWeightageMarks} Marks in Board` : `🎯 ${ch.boardWeightageMarks} Marks in Board • ${ch.boardWeightageMarks} अंक`}
                        </span>

                        {ch.tier === "critical" && (
                          <span className="text-[9px] font-mono font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 uppercase">
                            {isEng ? "High-Yield Chapter" : "High-Yield Chapter • मुख्य अध्याय"}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                        Chapter {ch.chapterNumber}: {ch.title}
                        {!isEng && ch.hindiTitle && (
                          <span className="ml-1.5 text-slate-500 font-semibold text-xs sm:text-sm">
                            • {ch.hindiTitle}
                          </span>
                        )}
                      </h4>
                    </div>
                  </div>

                  {/* Chapter Completion Bar & Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 md:justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto">
                    <div className="space-y-1 text-left sm:text-right min-w-[130px]">
                      <div className="flex items-center justify-between text-[10.5px] font-mono">
                        <span className="text-slate-500 font-bold">{isEng ? "Coverage:" : "Coverage • पूर्णता:"}</span>
                        <strong
                          className={`font-black ml-1 ${
                            ch.chapterCompletionPercent >= 80
                              ? "text-emerald-700"
                              : ch.chapterCompletionPercent > 0
                              ? "text-amber-700"
                              : "text-rose-600"
                          }`}
                        >
                          {ch.chapterCompletionPercent}% ({ch.chapterLockedMarks}/{ch.boardWeightageMarks} M)
                        </strong>
                      </div>

                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            ch.chapterCompletionPercent >= 80
                              ? "bg-emerald-500"
                              : ch.chapterCompletionPercent > 0
                              ? "bg-amber-500"
                              : "bg-rose-400"
                          }`}
                          style={{ width: `${Math.max(6, ch.chapterCompletionPercent)}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDiscussWithCherry) {
                          onDiscussWithCherry({
                            topic: ch.title,
                            subject: ch.subject,
                            conceptTested: ch.title,
                            question: `Cherry Ma'am, please guide me through an official board blueprint revision of Chapter ${ch.chapterNumber}: ${ch.title} on the blackboard!`
                          });
                        } else if (onEnterClassroom) {
                          onEnterClassroom();
                        }
                      }}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#796AEF] hover:bg-indigo-700 text-white text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                    >
                      <Brain className="w-4 h-4 text-white" />
                      <span>{isEng ? "Learn with Cherry 🚀" : "Learn with Cherry • मैम से सीखें 🚀"}</span>
                    </button>
                  </div>
                </div>

                {/* Subtopics Accordion Content */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-5 pt-3 space-y-3 bg-slate-50/50 border-t border-slate-100">
                    <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                      <BookOpen className="w-3.5 h-3.5 text-[#796AEF]" />
                      {isEng ? "Subtopic Blueprint & Board Exam Question Types:" : "Subtopic Blueprint & Board Exam Question Types • उप-विषय ब्लूप्रिंट व प्रश्न प्रकार:"}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {ch.subtopics.map((sub) => {
                        const isBlindspot = sub.status === "blindspot";
                        const isMastered = sub.status === "mastered";

                        return (
                          <div
                            key={sub.id}
                            className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3.5 transition-all text-left ${
                              isMastered
                                ? "bg-white border-emerald-300/80 shadow-2xs"
                                : isBlindspot
                                ? "bg-white border-dashed border-rose-300 shadow-2xs hover:border-rose-400"
                                : "bg-white border-amber-200/80 shadow-2xs"
                            }`}
                          >
                            {/* Subtopic Header */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-1.5">
                                <span
                                  className={`text-[9.5px] font-mono font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 ${
                                    isMastered
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : isBlindspot
                                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                                      : "bg-amber-50 text-amber-700 border border-amber-200"
                                  }`}
                                >
                                  {isMastered ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>{isEng ? "Mastered ✓" : "Mastered • सिद्ध ✓"}</span>
                                    </>
                                  ) : isBlindspot ? (
                                    <>
                                      <CircleDashed className="w-3.5 h-3.5 text-rose-500" />
                                      <span>{isEng ? "Blindspot!" : "Blindspot • छूटा हुआ!"}</span>
                                    </>
                                  ) : (
                                    <>
                                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                      <span>{isEng ? "Review Due" : "Review Due • दोहराएं"}</span>
                                    </>
                                  )}
                                </span>

                                <span className="text-[9.5px] font-mono text-slate-500 font-bold">
                                  {sub.weightagePercent}% of Ch
                                </span>
                              </div>

                              <h5 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                                {sub.title}
                              </h5>
                              {!isEng && sub.hindiTitle && (
                                <p className="text-[11px] font-medium text-slate-500 leading-tight">
                                  {sub.hindiTitle}
                                </p>
                              )}

                              <span className="text-[9.5px] font-mono text-[#796AEF] bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60 block w-fit font-bold">
                                📋 {sub.examType}
                              </span>
                            </div>

                            {/* Core Takeaway & Formula */}
                            <div className="space-y-1.5 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                              {sub.keyFormula && (
                                <div className="p-2 bg-amber-50/80 text-amber-900 border border-amber-200/60 rounded-lg font-mono text-[10.5px] text-center overflow-x-auto shadow-2xs">
                                  {renderFormula(sub.keyFormula)}
                                </div>
                              )}
                              <p className="font-semibold text-slate-800 leading-normal">
                                {sub.coreTakeaway}
                              </p>
                              {!isEng && sub.hindiCoreTakeaway && (
                                <p className="font-normal text-slate-600 leading-normal text-[10.5px]">
                                  {sub.hindiCoreTakeaway}
                                </p>
                              )}
                            </div>

                            {/* Launch Action */}
                            <button
                              type="button"
                              onClick={() => {
                                if (onDiscussWithCherry) {
                                  onDiscussWithCherry({
                                    topic: sub.title,
                                    subject: ch.subject,
                                    conceptTested: sub.title,
                                    hint: sub.coreTakeaway,
                                    question: `Cherry Ma'am, please explain the concept and board exam questions for "${sub.title}" from ${ch.title} on the chalkboard!`
                                  });
                                } else if (onEnterClassroom) {
                                  onEnterClassroom();
                                }
                              }}
                              className={`w-full min-h-[44px] py-2 px-3 rounded-xl font-mono text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-2xs ${
                                isBlindspot
                                  ? "bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200"
                                  : "bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200"
                              }`}
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>
                                {isBlindspot
                                  ? (isEng ? "Solve Blindspot 🚀" : "Solve Blindspot • हल करें 🚀")
                                  : isMastered
                                  ? (isEng ? "Practice Advanced 🎯" : "Practice Advanced • अभ्यास करें 🎯")
                                  : (isEng ? "Revise Subtopic ✨" : "Revise Subtopic • दोहराएं ✨")}
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
            <Compass className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700">
              {isEng ? "No chapters found for this filter" : "No chapters found for this filter • कोई अध्याय नहीं मिला"}
            </h4>
            <p className="text-[10.5px] text-slate-400 font-mono">
              Try clearing your search query or adjusting Grade and Subject filters.
            </p>
          </div>
        )}
      </div>

      {/* Why Curriculum & Blindspot Mapping Matters */}
      <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl flex items-start gap-3.5 text-left text-slate-600 text-[11.5px] leading-relaxed shadow-2xs">
        <Award className="w-5 h-5 text-[#796AEF] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold text-slate-900 block uppercase tracking-wider text-[10px]">
            {isEng
              ? "Why Blueprint-Synchronized Blindspot Elimination Wins Exams:"
              : "Why Blueprint-Synchronized Blindspot Elimination Wins Exams • बोर्ड ब्लूप्रिंट से सिंक की गई तैयारी क्यों जीतती है:"}
          </span>
          {!isEng && (
            <p>
              छात्र अक्सर वही चैप्टर्स दोहराते हैं जिनमें वे पहले से सहज महसूस करते हैं, जबकि बोर्ड व प्रतियोगी परीक्षाओं में छूटे हुए विषयों (Blindspots) के कारण सबसे अधिक अंक कटते हैं। चेरी क्लासरूम हर उप-विषय को आधिकारिक बोर्ड ब्लूप्रिंट से जोड़ता है ताकि परीक्षा हॉल में कोई भी अप्रत्याशित प्रश्न आपके सामने न आए।
            </p>
          )}
          <p className="text-slate-500 text-[11px]">
            Unlike open-ended revision where students repeatedly practice comfortable topics, board exams penalize skipped chapters. By mapping every single subtopic against the official marks blueprint, Cherry Classroom ensures zero surprise questions in the exam hall.
          </p>
        </div>
      </div>
    </div>
  );
};
