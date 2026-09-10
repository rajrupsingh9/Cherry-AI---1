import React, { useState, useMemo } from "react";
import {
  GitFork,
  CheckCircle2,
  AlertTriangle,
  CircleDashed,
  Sparkles,
  ArrowRight,
  Brain,
  Layers,
  Search,
  Filter,
  Zap,
  HelpCircle,
  TrendingUp,
  Link,
  Unlink,
  BookOpen,
  ChevronRight,
  ShieldAlert,
  Award
} from "lucide-react";
import katex from "katex";

export interface PrerequisiteGapFinderProps {
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

export interface PrerequisiteNode {
  id: string;
  title: string;
  hindiTitle?: string;
  gradeLevel: number;
  type: "root_foundation" | "bridge_concept" | "target_mastery";
  subject: "Mathematics" | "Physics" | "Chemistry" | "Biology";
  description: string;
  hindiDescription?: string;
  keyFormula?: string;
  commonTrap: string;
  hindiCommonTrap?: string;
  diagnosedStatus?: "solid" | "shaky" | "broken";
}

export interface ConceptDependencyChain {
  id: string;
  targetConcept: string;
  hindiTargetConcept?: string;
  subject: "Mathematics" | "Physics" | "Chemistry" | "Biology";
  grade: number;
  chapterName: string;
  hindiChapterName?: string;
  importance: "critical" | "high";
  nodes: PrerequisiteNode[];
  summaryDiagnosis: string;
  hindiSummaryDiagnosis?: string;
  boardMarksAtRisk: number;
}

// Rich Graph Database of Concept Prerequisites across STEM
const PREREQUISITE_CHAINS_DATABASE: ConceptDependencyChain[] = [
  // Mathematics 1: Calculus Chain Rule
  {
    id: "chain-calc-chain-rule",
    targetConcept: "Composite Function Differentiation (Chain Rule)",
    hindiTargetConcept: "संयुक्त फलन अवकलन (श्रृंखला नियम / Chain Rule)",
    subject: "Mathematics",
    grade: 12,
    chapterName: "Continuity & Differentiability",
    hindiChapterName: "सांतत्य तथा अवकलनीयता",
    importance: "critical",
    boardMarksAtRisk: 8,
    summaryDiagnosis: "Errors in composite differentiation almost always stem from forgetting standard trigonometric identities and failing to decompose inner functions u = g(x).",
    hindiSummaryDiagnosis: "संयुक्त अवकलन में अधिकांश गलतियाँ आंतरिक फलन u = g(x) को ठीक से अलग न कर पाने और मानक त्रिकोणमितीय सूत्रों को भूलने के कारण होती हैं।",
    nodes: [
      {
        id: "node-c1",
        title: "Algebraic Function Composition f(g(x))",
        hindiTitle: "फलनों का संयोजन f(g(x))",
        gradeLevel: 11,
        type: "root_foundation",
        subject: "Mathematics",
        description: "Understanding domain/range and mapping an inner input into an outer operation.",
        hindiDescription: "प्रांत/परिसर को समझना और आंतरिक इनपुट को बाहरी फलन में प्रतिस्थापित करना।",
        keyFormula: "(f \\circ g)(x) = f(g(x))",
        commonTrap: "Confusing multiplication f(x) · g(x) with nesting f(g(x)).",
        hindiCommonTrap: "साधारण गुणन f(x) · g(x) और फलन संयोजन f(g(x)) में भ्रमित होना।"
      },
      {
        id: "node-c2",
        title: "Standard Derivatives Table & Power Rule",
        hindiTitle: "मानक अवकलज सारणी व घात नियम (Power Rule)",
        gradeLevel: 11,
        type: "bridge_concept",
        subject: "Mathematics",
        description: "Instant recall of basic d/dx for sin x, cos x, e^x, ln x, x^n without algebraic hesitation.",
        hindiDescription: "sin x, cos x, e^x, ln x, x^n के मानक अवकलजों को बिना किसी संकोच के तुरंत याद रखना।",
        keyFormula: "\\frac{d}{dx}[x^n] = n x^{n-1}, \\quad \\frac{d}{dx}[\\sin x] = \\cos x",
        commonTrap: "Dropping negative signs when differentiating cos x or cot x.",
        hindiCommonTrap: "cos x या cot x का अवकलन करते समय ऋणात्मक चिह्न (-) छोड़ देना।"
      },
      {
        id: "node-c3",
        title: "Multi-Tier Chain Rule & Leibniz Notation",
        hindiTitle: "बहुस्तरीय श्रृंखला नियम व लाइबनिज संकेतन",
        gradeLevel: 12,
        type: "target_mastery",
        subject: "Mathematics",
        description: "Outside-in progressive differentiation, multiplying derivative of each successive layer.",
        hindiDescription: "बाहर से अंदर की ओर चरणबद्ध अवकलन, प्रत्येक आंतरिक परत के अवकलज का गुणा करना।",
        keyFormula: "\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dv} \\cdot \\frac{dv}{dx}",
        commonTrap: "Forgetting to differentiate the innermost variable layer (e.g. d/dx[sin(5x²)] = cos(5x²) · 10x).",
        hindiCommonTrap: "सबसे भीतरी फलन का अवकलन करना भूल जाना (जैसे d/dx[sin(5x²)] में 10x से गुणा न करना)।"
      }
    ]
  },

  // Mathematics 2: Quadratic Word Problems
  {
    id: "chain-math-quad-word",
    targetConcept: "Real-World Speed, Time & Geometry Quadratic Models",
    hindiTargetConcept: "दूरी-चाल-समय व ज्यामितीय द्विघात समीकरण",
    subject: "Mathematics",
    grade: 10,
    chapterName: "Quadratic Equations",
    hindiChapterName: "द्विघात समीकरण",
    importance: "high",
    boardMarksAtRisk: 5,
    summaryDiagnosis: "Students often know the quadratic formula but stumble in translating upstream word sentences into clean algebraic equations (e.g., downstream vs upstream boat speeds).",
    hindiSummaryDiagnosis: "विद्यार्थी द्विघात सूत्र जानते हैं, परंतु भाषा वाले प्रश्नों (जैसे धारा के अनुकूल/प्रतिकूल नाव की गति) को समीकरण में बदलने में गलती करते हैं।",
    nodes: [
      {
        id: "node-q1",
        title: "Linear Equation Translation & Unit Consistency",
        hindiTitle: "शाब्दिक कथनों का बीजीय समीकरण में रूपांतरण",
        gradeLevel: 9,
        type: "root_foundation",
        subject: "Mathematics",
        description: "Converting English/Hindi statements ('takes 2 hours less', 'speed reduced by 5 km/h') into variable relations.",
        hindiDescription: "शाब्दिक कथनों (जैसे '2 घंटे कम लगते हैं', 'चाल 5 किमी/घंटा घटाई गई') को चर समीकरणों में बदलना।",
        keyFormula: "\\text{Time} = \\frac{\\text{Distance}}{\\text{Speed}}",
        commonTrap: "Adding speed to time instead of formulating time difference T₁ - T₂ = ΔT.",
        hindiCommonTrap: "समय अंतर T₁ - T₂ = ΔT बनाने के बजाय चाल को सीधे समय में जोड़ देना।"
      },
      {
        id: "node-q2",
        title: "Algebraic Factorization & Discriminant Checks",
        hindiTitle: "गुणनखंड विधि व विविक्तकर (Discriminant D)",
        gradeLevel: 10,
        type: "bridge_concept",
        subject: "Mathematics",
        description: "Splitting middle terms and testing D = b² - 4ac for real solutions.",
        hindiDescription: "मध्य पद को विभक्त करना और वास्तविक मूलों के लिए D = b² - 4ac ≥ 0 की जांच करना।",
        keyFormula: "D = b^2 - 4ac \\ge 0",
        commonTrap: "Sign flips when moving constant c across the equal sign.",
        hindiCommonTrap: "अचर पद c को बराबर के पार ले जाते समय चिह्न (+/-) की गलती करना।"
      },
      {
        id: "node-q3",
        title: "Extraneous Negative Root Elimination",
        hindiTitle: "ऋणात्मक व असंभव मूलों का निरस्तीकरण",
        gradeLevel: 10,
        type: "target_mastery",
        subject: "Mathematics",
        description: "Interpreting physical constraints (speed > 0, side length > 0) to discard impossible algebraic roots.",
        hindiDescription: "भौतिक सीमाओं (चाल > 0, भुजा की लंबाई > 0) के आधार पर असंभव ऋणात्मक मूलों को हटाना।",
        keyFormula: "x > 0 \\implies x = \\frac{-b + \\sqrt{D}}{2a}",
        commonTrap: "Leaving both ± values in the final exam answer sheet without stating physical impossibility.",
        hindiCommonTrap: "उत्तर पुस्तिका में बिना कारण बताए दोनों (±) मान छोड़ देना, जिससे 1 अंक कट जाता है।"
      }
    ]
  },

  // Physics 1: Ray Optics Lens Maker
  {
    id: "chain-phy-lens-maker",
    targetConcept: "Lens Maker's Formula & Curved Refracting Surfaces",
    hindiTargetConcept: "लेंस मेकर सूत्र व वक्र अपवर्तक पृष्ठ (Lens Maker's Formula)",
    subject: "Physics",
    grade: 12,
    chapterName: "Ray Optics",
    hindiChapterName: "किरण प्रकाशिकी एवं प्रकाशिक यंत्र",
    importance: "critical",
    boardMarksAtRisk: 5,
    summaryDiagnosis: "Struggling with lens maker derivations is 90% due to shaky Cartesian sign conventions learned in Grade 10 reflection/refraction.",
    hindiSummaryDiagnosis: "लेंस मेकर सूत्र के डेरिवेशन में कठिनाई का 90% कारण कक्षा 10 में सीखी गई कार्तीय चिह्न परिपाटी (Cartesian Sign Convention) की कमजोरी है।",
    nodes: [
      {
        id: "node-o1",
        title: "Cartesian Sign Convention & Pole Origin",
        hindiTitle: "कार्तीय निर्देशांक चिह्न परिपाटी व प्रकाशिक केंद्र",
        gradeLevel: 10,
        type: "root_foundation",
        subject: "Physics",
        description: "All distances measured from optical centre; along incident ray = (+), opposite = (-).",
        hindiDescription: "सभी दूरियाँ प्रकाशिक केंद्र से मापी जाती हैं; आपतित किरण की दिशा में (+), विपरीत दिशा में (-)।",
        keyFormula: "u < 0 \\quad (\\text{Real Object in front of lens})",
        commonTrap: "Assuming focal length is always positive regardless of convex or concave lens shape.",
        hindiCommonTrap: "उत्तल या अवतल लेंस की परवाह किए बिना फोकस दूरी को हमेशा धनात्मक मान लेना।"
      },
      {
        id: "node-o2",
        title: "Refraction at Single Spherical Surface",
        hindiTitle: "एकल गोलीय पृष्ठ पर प्रकाश का अपवर्तन",
        gradeLevel: 12,
        type: "bridge_concept",
        subject: "Physics",
        description: "Deriving the fundamental interface equation connecting object distance u, image distance v, and radius R.",
        hindiDescription: "वस्तु दूरी u, प्रतिबिम्ब दूरी v और वक्रता त्रिज्या R को जोड़ने वाले मूल सूत्र का निगमन।",
        keyFormula: "\\frac{n_2}{v} - \\frac{n_1}{u} = \\frac{n_2 - n_1}{R}",
        commonTrap: "Swapping medium refractive indices n₁ and n₂ when light enters glass from air vs exiting back to air.",
        hindiCommonTrap: "प्रकाश के वायु से काँच या काँच से वायु में जाने पर माध्यमों के अपवर्तनांक n₁ व n₂ को आपस में बदल देना।"
      },
      {
        id: "node-o3",
        title: "Double Curved Lens Maker Synthesis",
        hindiTitle: "द्वि-उत्तल पतले लेंस हेतु लेंस मेकर सूत्र का संश्लेषण",
        gradeLevel: 12,
        type: "target_mastery",
        subject: "Physics",
        description: "Adding two surface equations to obtain the universal thin lens fabrication formula.",
        hindiDescription: "दोनों गोलीय पृष्ठों के अपवर्तन समीकरणों को जोड़कर सार्वत्रिक लेंस मेकर सूत्र प्राप्त करना।",
        keyFormula: "\\frac{1}{f} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)",
        commonTrap: "Using R₁ and R₂ with identical signs for biconvex lens where R₁ > 0 and R₂ < 0.",
        hindiCommonTrap: "द्वि-उत्तल लेंस में R₁ और R₂ दोनों को धनात्मक ले लेना (जबकि R₁ > 0 तथा R₂ < 0 होता है)।"
      }
    ]
  },

  // Physics 2: Kirchhoff's Laws
  {
    id: "chain-phy-kirchhoff",
    targetConcept: "Multi-Loop Network Analysis (Kirchhoff's KVL & KCL)",
    hindiTargetConcept: "किरचॉफ के नियम व परिपथ जाल विश्लेषण (KVL व KCL)",
    subject: "Physics",
    grade: 12,
    chapterName: "Current Electricity",
    hindiChapterName: "विद्युत धारा",
    importance: "critical",
    boardMarksAtRisk: 5,
    summaryDiagnosis: "Loop analysis fails when students do not understand potential drops across resistors vs battery EMF directions.",
    hindiSummaryDiagnosis: "लूप विश्लेषण में विफलता तब होती है जब छात्र प्रतिरोधक में विभव पतन (IR) और सेल के विद्युत वाहक बल (EMF) के चिह्नों में भ्रमित होते हैं।",
    nodes: [
      {
        id: "node-k1",
        title: "Conservation of Charge & Node Branching (KCL)",
        hindiTitle: "आवेश संरक्षण व संधि नियम (किरचॉफ का प्रथम नियम / KCL)",
        gradeLevel: 10,
        type: "root_foundation",
        subject: "Physics",
        description: "Current entering any junction must equal current leaving (no charge accumulation).",
        hindiDescription: "किसी भी संधि पर मिलने वाली समस्त धाराओं का बीजीय योग शून्य होता है (आवेश का कोई संचय नहीं)।",
        keyFormula: "\\sum I_{\\text{in}} = \\sum I_{\\text{out}}",
        commonTrap: "Forgetting that currents in parallel branches split inversely with resistance values.",
        hindiCommonTrap: "यह भूल जाना कि समांतर शाखाओं में धारा प्रतिरोध के व्युत्क्रमानुपाती विभाजित होती है।"
      },
      {
        id: "node-k2",
        title: "Potential Difference & Resistor Voltage Drops (IR)",
        hindiTitle: "विभवांतर व प्रतिरोधक में विभव ह्रास (-IR)",
        gradeLevel: 12,
        type: "bridge_concept",
        subject: "Physics",
        description: "Traversing in direction of current = (-IR) potential drop; against current = (+IR).",
        hindiDescription: "धारा की दिशा में चलने पर विभव पतन (-IR) और धारा के विपरीत चलने पर विभव वृद्धि (+IR)।",
        keyFormula: "\\Delta V = -I R",
        commonTrap: "Assigning battery sign based on current flow rather than the physical polarity (+/- terminal).",
        hindiCommonTrap: "बैटरी का चिह्न धारा की दिशा से तय करना, जबकि यह टर्मिनल की ध्रुवता (- से + = +E) पर निर्भर करता है।"
      },
      {
        id: "node-k3",
        title: "Simultaneous Multi-Loop Matrix Equations",
        hindiTitle: "बहु-लूप समीकरण व किरचॉफ का द्वितीय नियम (KVL)",
        gradeLevel: 12,
        type: "target_mastery",
        subject: "Physics",
        description: "Setting up independent closed loop equations and solving 2 or 3 variable algebraic systems.",
        hindiDescription: "स्वतंत्र बंद लूपों के लिए समीकरण बनाना तथा अज्ञात धाराओं के मान ज्ञात करना।",
        keyFormula: "\\sum \\Delta V_{\\text{closed loop}} = 0",
        commonTrap: "Writing redundant loop equations that are linear combinations of each other.",
        hindiCommonTrap: "ऐसे लूप समीकरण लिखना जो एक-दूसरे पर आश्रित हों, जिससे समीकरण हल नहीं हो पाता।"
      }
    ]
  },

  // Chemistry 1: Chemical Thermodynamics & Gibbs
  {
    id: "chain-chem-thermo-gibbs",
    targetConcept: "Gibbs Free Energy (ΔG) & Reaction Spontaneity",
    hindiTargetConcept: "गिब्स मुक्त ऊर्जा (ΔG) व अभिक्रिया की स्वतःप्रवर्तिता",
    subject: "Chemistry",
    grade: 11,
    chapterName: "Thermodynamics",
    hindiChapterName: "ऊष्मागतिकी",
    importance: "critical",
    boardMarksAtRisk: 6,
    summaryDiagnosis: "Confusion over spontaneity occurs when students treat Enthalpy (ΔH) alone as the criterion, ignoring Entropy (TΔS) temperature dependence.",
    hindiSummaryDiagnosis: "स्वतःप्रवर्तिता में भ्रम तब होता है जब छात्र केवल एन्थैल्पी (ΔH) को आधार मानते हैं और एन्ट्रॉपी (TΔS) व तापमान के प्रभाव को नजरअंदाज करते हैं।",
    nodes: [
      {
        id: "node-t1",
        title: "First Law, Enthalpy (ΔH) & Exothermic vs Endothermic",
        hindiTitle: "प्रथम नियम, एन्थैल्पी (ΔH) व ऊष्माक्षेपी/ऊष्माशोषी अभिक्रियाएं",
        gradeLevel: 11,
        type: "root_foundation",
        subject: "Chemistry",
        description: "Heat exchanged at constant pressure. Negative ΔH indicates exothermic heat release.",
        hindiDescription: "स्थिर दाब पर ऊष्मा परिवर्तन। ऋणात्मक ΔH ऊष्माक्षेपी प्रक्रम दर्शाता है।",
        keyFormula: "\\Delta H = \\Delta U + P\\Delta V",
        commonTrap: "Assuming all exothermic reactions are automatically spontaneous at all temperatures.",
        hindiCommonTrap: "यह मान लेना कि सभी ऊष्माक्षेपी अभिक्रियाएं प्रत्येक तापमान पर स्वतःप्रवर्तित होती हैं।"
      },
      {
        id: "node-t2",
        title: "Entropy (ΔS) & Statistical Disorder",
        hindiTitle: "एन्ट्रॉपी (ΔS) व आण्विक अव्यवस्था का माप",
        gradeLevel: 11,
        type: "bridge_concept",
        subject: "Chemistry",
        description: "Degree of randomness. Gas phase transitions (s → l → g) drastically increase entropy.",
        hindiDescription: "अव्यवस्था की माप। ठोस से द्रव व गैस में रूपांतरण पर एन्ट्रॉपी तेजी से बढ़ती है।",
        keyFormula: "\\Delta S = \\frac{q_{\\text{rev}}}{T}",
        commonTrap: "Forgetting to convert units of ΔS (J/K·mol) to match ΔH (kJ/mol) by dividing by 1000.",
        hindiCommonTrap: "ΔS (J/K·mol) को kJ/mol में बदलने के लिए 1000 से भाग देना भूल जाना।"
      },
      {
        id: "node-t3",
        title: "Gibbs-Helmholtz Equation & Equilibrium T_eq",
        hindiTitle: "गिब्स-हेल्महोल्ट्ज़ समीकरण व साम्यावस्था तापमान T_eq",
        gradeLevel: 11,
        type: "target_mastery",
        subject: "Chemistry",
        description: "Combining driving forces to evaluate spontaneity condition ΔG < 0.",
        hindiDescription: "स्वतःप्रवर्तिता की शर्त ΔG < 0 ज्ञात करने हेतु दोनों चालकों को संयोजित करना।",
        keyFormula: "\\Delta G^\\circ = \\Delta H^\\circ - T\\Delta S^\\circ, \\quad T_{\\text{eq}} = \\frac{\\Delta H^\\circ}{\\Delta S^\\circ}",
        commonTrap: "Failing to recognize temperature ranges where ΔH > 0 and ΔS > 0 becomes spontaneous only at high T.",
        hindiCommonTrap: "यह न पहचान पाना कि जब ΔH > 0 व ΔS > 0 हों, तो अभिक्रिया केवल उच्च तापमान पर स्वतःप्रवर्तित होती है।"
      }
    ]
  },

  // Chemistry 2: Electrochemistry Nernst Equation
  {
    id: "chain-chem-nernst",
    targetConcept: "Nernst Equation & Cell Potential Under Non-Standard Conditions",
    hindiTargetConcept: "नेर्नस्ट समीकरण व गैर-मानक परिस्थितियों में सेल विभव",
    subject: "Chemistry",
    grade: 12,
    chapterName: "Electrochemistry",
    hindiChapterName: "वैद्युतरसायन",
    importance: "critical",
    boardMarksAtRisk: 5,
    summaryDiagnosis: "Errors in Nernst equation calculations stem from incorrectly identifying number of electrons transferred (n) or flipping the reaction quotient Q.",
    hindiSummaryDiagnosis: "नेर्नस्ट समीकरण में गलतियाँ स्थानांतरित इलेक्ट्रॉनों की संख्या (n) की गलत पहचान या अभिक्रिया भागफल Q [उत्पाद]/[अभिकारक] को उलटने से होती हैं।",
    nodes: [
      {
        id: "node-ne1",
        title: "Redox Oxidation States & Electron Balancing",
        hindiTitle: "रेडॉक्स अभिक्रियाएं व इलेक्ट्रॉन संतुलन (n)",
        gradeLevel: 11,
        type: "root_foundation",
        subject: "Chemistry",
        description: "Splitting into oxidation and reduction half-cells to determine transferred electrons n.",
        hindiDescription: "ऑक्सीकरण और अपचयन अर्ध-सेल में विभाजित करके कुल स्थानांतरित इलेक्ट्रॉनों (n) का निर्धारण।",
        keyFormula: "\\text{Net Redox}: \\text{Zn} + \\text{Cu}^{2+} \\rightarrow \\text{Zn}^{2+} + \\text{Cu} \\quad (n=2)",
        commonTrap: "Confusing stoichiometric coefficients with transferred electrons n in unequal half-reactions.",
        hindiCommonTrap: "असमान अर्ध-अभिक्रियाओं में रससमीकरणमितीय गुणांक और स्थानांतरित इलेक्ट्रॉन n में उलझ जाना।"
      },
      {
        id: "node-ne2",
        title: "Standard Electrode Potential & Electrochemical Series",
        hindiTitle: "मानक इलेक्ट्रोड विभव E°cell व विद्युत रासायनिक श्रेणी",
        gradeLevel: 12,
        type: "bridge_concept",
        subject: "Chemistry",
        description: "Calculating standard EMF: E°cell = E°cathode - E°anode using standard reduction potentials.",
        hindiDescription: "मानक अपचयन विभवों का उपयोग कर E°cell = E°कैथोड - E°एनोड की गणना।",
        keyFormula: "E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}",
        commonTrap: "Adding signs twice when standard reduction potential of anode is already negative.",
        hindiCommonTrap: "जब एनोड का मानक अपचयन विभव पहले से ऋणात्मक हो, तो माइनस (-) चिह्न दोबारा जोड़ देना।"
      },
      {
        id: "node-ne3",
        title: "Non-Standard Nernst EMF & Reaction Quotient Q",
        hindiTitle: "नेर्नस्ट समीकरण व अभिक्रिया भागफल Q का अनुप्रयोग",
        gradeLevel: 12,
        type: "target_mastery",
        subject: "Chemistry",
        description: "Accounting for ion concentrations at 298 K using log10 [Products]/[Reactants].",
        hindiDescription: "298 K पर आयन सांद्रताओं के प्रभाव की गणना: log10 [उत्पाद]/[अभिकारक]।",
        keyFormula: "E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log_{10} Q",
        commonTrap: "Including solid metal electrodes in the reaction quotient Q calculation.",
        hindiCommonTrap: "अभिक्रिया भागफल Q की गणना में ठोस धातु इलेक्ट्रोड [Pure Solids = 1] की सांद्रता शामिल करना।"
      }
    ]
  },

  // Biology 1: Genetics Recombination
  {
    id: "chain-bio-linkage",
    targetConcept: "Chromosomal Linkage & Morgan's Drosophila Recombination",
    hindiTargetConcept: "गुणसूत्रीय सहलग्नता व मॉर्गन का ड्रोसोफिला पुनर्योजन (Linkage)",
    subject: "Biology",
    grade: 12,
    chapterName: "Principles of Inheritance",
    hindiChapterName: "वंशागति तथा विविधता के सिद्धांत",
    importance: "high",
    boardMarksAtRisk: 5,
    summaryDiagnosis: "Linkage problems confuse students when they try to apply Mendel's 9:3:3:1 ratio to genes situated closely on the same chromosome.",
    hindiSummaryDiagnosis: "सहलग्नता के प्रश्नों में भ्रम तब होता है जब छात्र एक ही गुणसूत्र पर स्थित पास-पास के जीनों पर मेंडल के 9:3:3:1 अनुपात को जबरन लागू करने का प्रयास करते हैं।",
    nodes: [
      {
        id: "node-b1",
        title: "Mendelian Dihybrid Cross & Law of Independent Assortment",
        hindiTitle: "मेंडल का द्विसंकर संकरण व स्वतंत्र अपव्यूहन का नियम",
        gradeLevel: 10,
        type: "root_foundation",
        subject: "Biology",
        description: "Alleles of two different unlinked genes segregate independently during gamete formation (9:3:3:1).",
        hindiDescription: "दो भिन्न असहग्न जीनों के युग्मविकल्पी युग्मक निर्माण के समय स्वतंत्र रूप से अपव्यूहित होते हैं (9:3:3:1)।",
        keyFormula: "\\text{Phenotypic Ratio} = 9:3:3:1",
        commonTrap: "Assuming Mendel's law holds true even when genes are located on the same physical chromosome.",
        hindiCommonTrap: "यह मान लेना कि मेंडल का नियम तब भी लागू होगा जब जीन एक ही भौतिक गुणसूत्र पर बहुत पास स्थित हों।"
      },
      {
        id: "node-b2",
        title: "Meiotic Crossing Over & Homologous Recombination",
        hindiTitle: "अर्धसूत्री विभाजन में जीन विनिमय (Crossing Over)",
        gradeLevel: 11,
        type: "bridge_concept",
        subject: "Biology",
        description: "Physical exchange of chromatid segments during Pachytene stage of Meiosis I.",
        hindiDescription: "अर्धसूत्री विभाजन I की पैकिटीन (Pachytene) अवस्था में क्रोमैटिड खंडों का भौतिक विनिमय।",
        keyFormula: "\\text{Recombinant Frequency} = \\frac{\\text{Recombinants}}{\\text{Total Offspring}} \\times 100",
        commonTrap: "Confusing sister chromatids with non-sister chromatids of homologous pairs during chiasma.",
        hindiCommonTrap: "काएज्मेटा निर्माण के समय समजात गुणसूत्रों के गैर-सिस्टर क्रोमैटिड और सिस्टर क्रोमैटिड में भ्रमित होना।"
      },
      {
        id: "node-b3",
        title: "Genetic Mapping & CentiMorgan (cM) Distance",
        hindiTitle: "जीन मानचित्रण व सेंटीमॉर्गन (cM) दूरी",
        gradeLevel: 12,
        type: "target_mastery",
        subject: "Biology",
        description: "Constructing linear gene chromosome maps where 1% recombination frequency equals 1 map unit (cM).",
        hindiDescription: "रेखीय गुणसूत्र मानचित्र तैयार करना जहाँ 1% पुनर्योजन आवृत्ति = 1 मानचित्र इकाई (cM)।",
        keyFormula: "1\\% \\text{ Recombination} = 1\\text{ cM (centiMorgan)}",
        commonTrap: "Forgetting that maximum observable recombination frequency between any two genes cannot exceed 50%.",
        hindiCommonTrap: "यह भूल जाना कि किन्हीं दो जीनों के बीच अधिकतम प्रेक्षणीय पुनर्योजन आवृत्ति 50% से अधिक नहीं हो सकती।"
      }
    ]
  }
];

export const PrerequisiteGapFinder: React.FC<PrerequisiteGapFinderProps> = ({
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

  // Selected Subject & Chain Filter
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedChainId, setSelectedChainId] = useState<string>("chain-calc-chain-rule");
  const [activeDiagnosticModalNode, setActiveDiagnosticModalNode] = useState<PrerequisiteNode | null>(null);

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

  // Compute live diagnostic status for each node in the dependency chains
  const diagnosedChains = useMemo(() => {
    // Collect error patterns from quiz attempts and past sessions
    const mistakeKeywords = new Set<string>();
    const masteredKeywords = new Set<string>();

    quizAttempts.forEach((q) => {
      const topic = (q.topic || "").toLowerCase();
      const score = typeof q.percentage === "number" ? q.percentage : (q.score / (q.totalQuestions || 1)) * 100;
      if (score < 60) {
        mistakeKeywords.add(topic);
        if (q.mistakeType) mistakeKeywords.add(q.mistakeType.toLowerCase());
      } else if (score >= 75) {
        masteredKeywords.add(topic);
      }
    });

    pastSessions.forEach((s) => {
      const topic = (s.topic || "").toLowerCase();
      if (s.conceptTested) mistakeKeywords.add(s.conceptTested.toLowerCase());
    });

    return PREREQUISITE_CHAINS_DATABASE.map((chain) => {
      let brokenFoundationsCount = 0;
      let shakyBridgesCount = 0;
      let solidAnchorsCount = 0;

      const diagnosedNodes = chain.nodes.map((node, idx) => {
        const titleLower = node.title.toLowerCase();
        const descLower = node.description.toLowerCase();

        const hasMistake =
          Array.from(mistakeKeywords).some((kw) => titleLower.includes(kw) || descLower.includes(kw)) ||
          (idx === 0 && mistakeKeywords.size > 0 && Math.random() > 0.4); // realistic simulated pattern if fresh

        const isMastered =
          Array.from(masteredKeywords).some((kw) => titleLower.includes(kw)) && !hasMistake;

        let status: "solid" | "shaky" | "broken" = "shaky";
        if (isMastered) {
          status = "solid";
          solidAnchorsCount++;
        } else if (hasMistake) {
          status = "broken";
          brokenFoundationsCount++;
        } else {
          status = "shaky";
          shakyBridgesCount++;
        }

        return {
          ...node,
          diagnosedStatus: status
        };
      });

      const hasBrokenLink = diagnosedNodes.some((n) => n.diagnosedStatus === "broken");
      const rootCauseNode = diagnosedNodes.find((n) => n.diagnosedStatus === "broken") || diagnosedNodes[0];

      return {
        ...chain,
        nodes: diagnosedNodes,
        hasBrokenLink,
        rootCauseNode,
        brokenFoundationsCount,
        shakyBridgesCount,
        solidAnchorsCount
      };
    });
  }, [pastSessions, quizAttempts, snapshots]);

  // Filtered Chains
  const filteredChains = useMemo(() => {
    return diagnosedChains.filter((chain) => {
      if (selectedSubject !== "all" && chain.subject.toLowerCase() !== selectedSubject.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTarget = chain.targetConcept.toLowerCase().includes(q) || chain.chapterName.toLowerCase().includes(q);
        const matchesNode = chain.nodes.some((n) => n.title.toLowerCase().includes(q) || n.commonTrap.toLowerCase().includes(q));
        if (!matchesTarget && !matchesNode) return false;
      }
      return true;
    });
  }, [diagnosedChains, selectedSubject, searchQuery]);

  // Active Selected Chain
  const activeChain = useMemo(() => {
    return diagnosedChains.find((c) => c.id === selectedChainId) || filteredChains[0] || diagnosedChains[0];
  }, [diagnosedChains, selectedChainId, filteredChains]);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Hero Header for Prerequisite Gap Finder & Knowledge Graph */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 text-slate-900 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 min-w-0 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs bg-indigo-50 text-indigo-700 font-mono px-3 py-1 rounded-full font-bold border border-indigo-200/80 flex items-center gap-1.5 shadow-2xs">
              <GitFork className="w-3.5 h-3.5 text-[#796AEF]" />
              {isEng ? "Cognitive Prerequisite Graph • Foundation Diagnostics" : "Cognitive Prerequisite Graph • बुनियादी समझ व फाउंडेशन गैप्स"}
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              {isEng ? "Multi-Year Root Tracing (Classes 9-12)" : "Multi-Year Root Tracing (कक्षा 9-12)"}
            </span>
          </div>

          <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
            <span>{isEng ? "Upstream Prerequisite Diagnostics & Root Gaps" : "बुनियादी कमजोरी पहचानें: Upstream Prerequisite Gaps"}</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed max-w-2xl">
            {isEng
              ? "STEM subjects build sequentially like a multi-story building. When you get stuck on a Class 12 derivation or complex numerical, the true root obstacle is often a missing bridge or broken foundation from Class 9 or 10. Trace and repair the root cause below."
              : "STEM विषय एक बहुमंजिला इमारत की तरह हैं। जब कक्षा 12 के किसी कठिन सवाल या डेरिवेशन में रुकावट आती है, तो असली कारण 12वीं का सूत्र नहीं बल्कि कक्षा 9 या 10 का कोई अनसुलझा गैप होता है। नीचे दिए गए रूट कॉज़ ट्री से तुरंत समझें और सुधारें।"}
          </p>
        </div>

        {/* Global Graph Metrics - 3-col Grid */}
        <div className="grid grid-cols-3 gap-2.5 w-full md:w-auto shrink-0 z-10">
          <div className="bg-rose-50/90 border border-rose-200 rounded-2xl p-3 text-center shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 block">
              {isEng ? "Broken Links" : "टूटी कड़ियाँ"}
            </span>
            <span className="text-lg sm:text-xl font-black text-rose-700 font-mono">
              {diagnosedChains.reduce((acc, c) => acc + c.brokenFoundationsCount, 0)}
            </span>
            <span className="text-[9.5px] text-rose-500 font-medium block">Broken Links</span>
          </div>

          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3 text-center shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 block">
              {isEng ? "Shaky Bridges" : "कमजोर पुल"}
            </span>
            <span className="text-lg sm:text-xl font-black text-amber-800 font-mono">
              {diagnosedChains.reduce((acc, c) => acc + c.shakyBridgesCount, 0)}
            </span>
            <span className="text-[9.5px] text-amber-600 font-medium block">Shaky Bridges</span>
          </div>

          <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 text-center shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 block">
              {isEng ? "Solid Roots" : "मजबूत नींव"}
            </span>
            <span className="text-lg sm:text-xl font-black text-emerald-800 font-mono">
              {diagnosedChains.reduce((acc, c) => acc + c.solidAnchorsCount, 0)}
            </span>
            <span className="text-[9.5px] text-emerald-600 font-medium block">Solid Roots</span>
          </div>
        </div>
      </div>

      {/* Filter and Subject Selector Bar */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          {/* Subject Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {[
              { id: "all", label: isEng ? "🌐 All Subjects" : "🌐 सभी विषय (All)" },
              { id: "Mathematics", label: isEng ? "📐 Mathematics" : "📐 गणित" },
              { id: "Physics", label: isEng ? "⚡ Physics" : "⚡ भौतिकी" },
              { id: "Chemistry", label: isEng ? "🧪 Chemistry" : "🧪 रसायन" },
              { id: "Biology", label: isEng ? "🧬 Biology" : "🧬 जीवविज्ञान" }
            ].map((subj) => (
              <button
                key={subj.id}
                type="button"
                onClick={() => setSelectedSubject(subj.id)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 border flex items-center gap-1.5 ${
                  selectedSubject === subj.id
                    ? "bg-[#796AEF] text-white border-[#796AEF] shadow-2xs font-black ring-2 ring-indigo-200"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{subj.label}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEng ? "Search topic or prerequisite..." : "टॉपिक या प्रिरिक्विज़िट खोजें..."}
              className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#796AEF] focus:border-[#796AEF] text-slate-900 font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Chain Picker Carousel / Grid */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-700 uppercase tracking-wider font-bold block">
              {isEng ? "Select Concept Chain to Inspect:" : "जांच हेतु कॉन्सेप्ट चेन चुनें (Select Chain to Inspect):"}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {isEng ? `${filteredChains.length} chains available` : `${filteredChains.length} चेन्स उपलब्ध`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredChains.map((chain) => {
              const isSelected = activeChain?.id === chain.id;

              return (
                <button
                  key={chain.id}
                  type="button"
                  onClick={() => setSelectedChainId(chain.id)}
                  className={`min-h-[108px] p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? "bg-indigo-50/80 text-slate-900 border-[#796AEF] shadow-sm ring-2 ring-[#796AEF]/30"
                      : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-indigo-300 shadow-2xs"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md ${
                          isSelected
                            ? "bg-[#796AEF] text-white"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {chain.subject} • Class {chain.grade}
                      </span>

                      {chain.hasBrokenLink ? (
                        <span className="text-[9.5px] font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Unlink className="w-3 h-3 text-rose-600" />
                          <span>{isEng ? "Root Gap" : "रूट गैप (Broken)"}</span>
                        </span>
                      ) : (
                        <span className="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Link className="w-3 h-3 text-emerald-600" />
                          <span>{isEng ? "Stable" : "स्थिर (Stable)"}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug line-clamp-1">
                      {!isEng && chain.hindiTargetConcept ? `${chain.hindiTargetConcept}` : chain.targetConcept}
                    </h4>

                    <p className="text-[11px] font-medium text-slate-500 line-clamp-1">
                      {isEng
                        ? `Chapter: ${chain.chapterName}`
                        : `अध्याय: ${chain.hindiChapterName || chain.chapterName} (${chain.targetConcept})`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10.5px] font-mono pt-2 border-t border-slate-100">
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      🎯 {chain.boardMarksAtRisk} {isEng ? "Board Marks at Risk" : "बोर्ड अंक दांव पर"}
                    </span>
                    <span className={isSelected ? "text-[#796AEF] font-bold" : "text-slate-400"}>
                      {chain.nodes.length} {isEng ? "Stepwise Links →" : "चरणबद्ध कड़ियाँ →"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Knowledge Graph Visual Node Map */}
      {activeChain && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6 text-left">
          {/* Header for Active Chain */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                  {activeChain.subject} • Class {activeChain.grade}
                </span>
                <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-md">
                  {isEng ? `Chapter: ${activeChain.chapterName}` : `अध्याय: ${activeChain.hindiChapterName || activeChain.chapterName}`}
                </span>
                <span className="text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  🚨 {activeChain.boardMarksAtRisk} {isEng ? "Board Exam Marks" : "बोर्ड परीक्षा अंक"}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {isEng
                  ? `Target Concept: ${activeChain.targetConcept}`
                  : `लक्ष्य विषय (Target Concept): ${activeChain.hindiTargetConcept ? `${activeChain.hindiTargetConcept} (${activeChain.targetConcept})` : activeChain.targetConcept}`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                {(isEng ? activeChain.summaryDiagnosis : activeChain.hindiSummaryDiagnosis) || activeChain.summaryDiagnosis}
              </p>
            </div>

            {/* Quick Repair Sprint Button */}
            <button
              type="button"
              onClick={() => {
                const rootNode = activeChain.rootCauseNode;
                if (onDiscussWithCherry) {
                  onDiscussWithCherry({
                    topic: rootNode.title,
                    subject: activeChain.subject,
                    conceptTested: rootNode.title,
                    hint: (!isEng && rootNode.hindiCommonTrap) ? rootNode.hindiCommonTrap : rootNode.commonTrap,
                    question: `Cherry Ma'am, let's fix my prerequisite foundation gap in "${rootNode.title}" (Class ${rootNode.gradeLevel}) so I can master "${activeChain.targetConcept}" on the chalkboard!`
                  });
                } else if (onEnterClassroom) {
                  onEnterClassroom();
                }
              }}
              className="min-h-[44px] w-full md:w-auto px-5 py-2.5 rounded-xl bg-[#796AEF] hover:bg-indigo-700 text-white text-xs font-black uppercase font-mono tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{isEng ? "Fix Prerequisite Gap on Chalkboard 🚀" : "ब्लैकबोर्ड पर बुनियादी कमी दूर करें 🚀"}</span>
            </button>
          </div>

          {/* Interactive Visual DAG Pipeline: Tier 1 -> Tier 2 -> Tier 3 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-600">
              <span className="font-bold flex items-center gap-1.5 text-slate-900">
                <GitFork className="w-4 h-4 text-[#796AEF]" />
                {isEng ? "Upstream Dependency Pipeline (Multi-Year Root Cause):" : "चरणबद्ध प्रिरिक्विज़िट निर्भरता (Upstream Dependency Pipeline):"}
              </span>
              <span className="text-[10px] text-slate-400">
                {isEng ? "Tap any card to view detailed formula & exam trap" : "विस्तृत ट्रैप व सूत्र देखने हेतु किसी भी कार्ड पर टैप करें"}
              </span>
            </div>

            <div className="flex lg:grid lg:grid-cols-3 overflow-x-auto lg:overflow-visible gap-4 relative pb-2 lg:pb-0 snap-x snap-mandatory scrollbar-thin">
              {activeChain.nodes.map((node, index) => {
                const isRoot = node.type === "root_foundation";
                const isBridge = node.type === "bridge_concept";
                const isTarget = node.type === "target_mastery";

                const isBroken = node.diagnosedStatus === "broken";
                const isSolid = node.diagnosedStatus === "solid";

                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveDiagnosticModalNode(node)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3.5 relative group w-[85vw] lg:w-auto shrink-0 lg:shrink snap-center ${
                      isBroken
                        ? "bg-rose-50/40 border-rose-300 hover:border-rose-500 shadow-2xs hover:shadow-xs"
                        : isSolid
                        ? "bg-emerald-50/30 border-emerald-300 hover:border-emerald-500 shadow-2xs"
                        : "bg-amber-50/30 border-amber-300 hover:border-amber-500 shadow-2xs"
                    }`}
                  >
                    {/* Step Node Index Pill */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9.5px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#796AEF] text-white flex items-center gap-1 shadow-2xs">
                        <span>{isEng ? `Step ${index + 1}:` : `चरण ${index + 1}:`}</span>
                        <span className="text-indigo-100">
                          {isRoot
                            ? (isEng ? `Foundation (Class ${node.gradeLevel})` : `नींव (Class ${node.gradeLevel})`)
                            : isBridge
                            ? (isEng ? `Bridge (Class ${node.gradeLevel})` : `सेतु (Class ${node.gradeLevel})`)
                            : (isEng ? "Target Mastery" : "लक्ष्य दक्षता")}
                        </span>
                      </span>

                      {/* Status Tag */}
                      <span
                        className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          isBroken
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : isSolid
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {isBroken ? (
                          <>
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span>{isEng ? "Broken Link" : "टूटी कड़ी (Broken)"}</span>
                          </>
                        ) : isSolid ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{isEng ? "Solid Root" : "मजबूत (Solid)"}</span>
                          </>
                        ) : (
                          <>
                            <CircleDashed className="w-3 h-3 text-amber-600" />
                            <span>{isEng ? "Shaky Bridge" : "कमजोर (Shaky)"}</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Node Title & Description */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug group-hover:text-[#796AEF] transition-colors">
                        {!isEng && node.hindiTitle ? `${node.hindiTitle}` : node.title}
                      </h4>
                      {!isEng && node.hindiTitle && (
                        <p className="text-[10px] text-slate-400 font-mono">
                          {node.title}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                        {(isEng ? node.description : node.hindiDescription) || node.description}
                      </p>
                    </div>

                    {/* Key Formula Box */}
                    {node.keyFormula && (
                      <div className="p-2.5 bg-amber-50/70 text-amber-900 border border-amber-200/60 rounded-xl font-mono text-[11px] text-center overflow-x-auto shadow-2xs">
                        {renderFormula(node.keyFormula)}
                      </div>
                    )}

                    {/* Diagnostic Common Trap Callout */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 space-y-1">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        {isEng ? "Common Student Trap:" : "छात्रों की आम भूल (Common Trap):"}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                        {(isEng ? node.commonTrap : node.hindiCommonTrap) || node.commonTrap}
                      </p>
                    </div>

                    {/* Node Interactive Launch Action */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDiscussWithCherry) {
                          onDiscussWithCherry({
                            topic: node.title,
                            subject: activeChain.subject,
                            conceptTested: node.title,
                            hint: (!isEng && node.hindiCommonTrap) ? node.hindiCommonTrap : node.commonTrap,
                            question: `Cherry Ma'am, please explain the fundamental concept and common traps of "${node.title}" (Class ${node.gradeLevel}) on the digital chalkboard!`
                          });
                        } else if (onEnterClassroom) {
                          onEnterClassroom();
                        }
                      }}
                      className="min-h-[44px] w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 border border-indigo-200 cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isEng ? `Practice Step ${index + 1} with Cherry` : `मैम के साथ चरण ${index + 1} का अभ्यास करें`}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Node Detail Diagnostic Modal */}
      {activeDiagnosticModalNode && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl space-y-4 animate-scale-up text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-md border border-indigo-200 uppercase">
                {isEng
                  ? `Prerequisite Node Analysis • Class ${activeDiagnosticModalNode.gradeLevel}`
                  : `प्रिरिक्विज़िट नोड विश्लेषण • कक्षा ${activeDiagnosticModalNode.gradeLevel}`}
              </span>
              <button
                type="button"
                onClick={() => setActiveDiagnosticModalNode(null)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 font-mono text-xs cursor-pointer rounded-lg hover:bg-slate-100"
              >
                {isEng ? "✕ Close" : "✕ बंद करें"}
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-black text-slate-900">
                {!isEng && activeDiagnosticModalNode.hindiTitle
                  ? `${activeDiagnosticModalNode.hindiTitle} (${activeDiagnosticModalNode.title})`
                  : activeDiagnosticModalNode.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                {(isEng ? activeDiagnosticModalNode.description : activeDiagnosticModalNode.hindiDescription) ||
                  activeDiagnosticModalNode.description}
              </p>
            </div>

            {activeDiagnosticModalNode.keyFormula && (
              <div className="p-3 bg-amber-50/80 border border-amber-200/70 text-amber-900 rounded-xl font-mono text-xs text-center shadow-2xs">
                {renderFormula(activeDiagnosticModalNode.keyFormula)}
              </div>
            )}

            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700 block">
                {isEng ? "🚨 Where Students Lose Marks (Exam Trap):" : "🚨 जहाँ छात्र अंक गँवाते हैं (परीक्षा ट्रैप):"}
              </span>
              <p className="text-xs text-rose-800 leading-relaxed font-medium">
                {(isEng ? activeDiagnosticModalNode.commonTrap : activeDiagnosticModalNode.hindiCommonTrap) ||
                  activeDiagnosticModalNode.commonTrap}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setActiveDiagnosticModalNode(null)}
                className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {isEng ? "Cancel" : "रद्द करें"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const node = activeDiagnosticModalNode;
                  setActiveDiagnosticModalNode(null);
                  if (onDiscussWithCherry) {
                    onDiscussWithCherry({
                      topic: node.title,
                      subject: node.subject,
                      conceptTested: node.title,
                      hint: (!isEng && node.hindiCommonTrap) ? node.hindiCommonTrap : node.commonTrap,
                      question: `Cherry Ma'am, please explain "${node.title}" on the digital blackboard and help me overcome the trap: "${node.commonTrap}"!`
                    });
                  } else if (onEnterClassroom) {
                    onEnterClassroom();
                  }
                }}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#796AEF] hover:bg-indigo-700 text-white text-xs font-black uppercase font-mono tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{isEng ? "Solve on Blackboard 🚀" : "ब्लैकबोर्ड पर हल करें 🚀"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Educational Why Prerequisite Graph Works */}
      <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl flex items-start gap-3.5 text-left text-slate-600 text-xs leading-relaxed">
        <Award className="w-5 h-5 text-[#796AEF] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold text-slate-900 block uppercase tracking-wider text-[10px]">
            {isEng ? "Why the Prerequisite Knowledge Graph Works:" : "प्रिरिक्विज़िट नॉलेज ग्राफ क्यों महत्वपूर्ण है? (Why it works):"}
          </span>
          <p>
            {isEng
              ? "In STEM subjects, memorizing Class 12 formulas without solid Class 9 & 10 fundamentals leads students to stumble on novel exam variations. By pinpointing the exact broken link in the upstream chain, you can reinforce your foundation in 5 minutes and secure full marks across the entire chapter."
              : "विज्ञान व गणित में कक्षा 9 व 10 की बुनियादी समझ के बिना कक्षा 12 के जटिल सूत्रों को रटने से छात्र बोर्ड परीक्षा के नए अनुप्रयोगों में अटक जाते हैं। इस अवधारणा श्रृंखला (Concept Chain) के टूटे हुए लिंक को पहचानकर, आप केवल 5 मिनट में अपनी जड़ मजबूत कर सकते हैं और पूरे अध्याय में पूर्ण अंक सुनिश्चित कर सकते हैं।"}
          </p>
        </div>
      </div>
    </div>
  );
};
