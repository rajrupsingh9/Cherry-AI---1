import React, { useState, useMemo } from "react";
import {
  Timer,
  Zap,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BarChart2,
  Flame,
  ArrowRight,
  ShieldAlert,
  Award,
  Filter,
  Brain,
  Gauge,
  Calendar,
  Check,
  RotateCcw,
  Target,
  Compass,
  BookOpen,
  Layers
} from "lucide-react";

export interface ExamSpeedSprintSimulatorProps {
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

export interface SpeedQuestion {
  id: string;
  subject: "Mathematics" | "Physics" | "Chemistry" | "Biology";
  topic: string;
  hindiTopic?: string;
  questionText: string;
  hindiQuestionText?: string;
  formulaOrContext?: string;
  idealSeconds: number; // Target speed (e.g. 35s, 45s, 60s, 75s)
  options: { label: string; text: string; hindiText?: string }[];
  correctIndex: number;
  explanation: string;
  hindiExplanation?: string;
  speedTrap: string; // The cognitive trick that steals student time
  hindiSpeedTrap?: string;
  shortcutTip: string; // The 10-second mental shortcut
  hindiShortcutTip?: string;
}

export interface ExamPacingProfile {
  id: string;
  examName: string;
  hindiExamName?: string;
  subject: "Mathematics" | "Physics" | "Chemistry" | "Biology";
  totalExamQuestions: number;
  totalExamMinutes: number;
  targetSecondsPerQuestion: number;
  paceBand: "rapid_mcq" | "balanced_application" | "step_by_step_numerical";
  description: string;
  hindiDescription?: string;
  questions: SpeedQuestion[];
}

export interface SevenDayBoosterDay {
  dayNumber: number;
  title: string;
  hindiTitle: string;
  subject: "Mathematics" | "Physics" | "Chemistry" | "Biology";
  targetMarks: number;
  minutesBudget: number;
  keyTopics: string[];
  hindiKeyTopics: string[];
  highYieldTrick: string;
  hindiHighYieldTrick: string;
  diagnosticTrap: string;
  hindiDiagnosticTrap: string;
  drillQuestion: string;
  classroomPrompt: string;
}

// Curated 7-Day Board Exam Score Booster Curriculum (+23 Board Marks in 15 mins/day)
export const SEVEN_DAY_BOOSTER_PLAN: SevenDayBoosterDay[] = [
  {
    dayNumber: 1,
    title: "Ray Optics & Sign Convention Mastery",
    hindiTitle: "किरण प्रकाशिकी व लेंस परिपाटी में पूर्ण अंक",
    subject: "Physics",
    targetMarks: 3,
    minutesBudget: 15,
    keyTopics: [
      "Thin Lens Formula & Power Addition (P = P₁ + P₂)",
      "Cartesian Sign Convention for Virtual Images",
      "Critical Angle & Total Internal Reflection Shortcuts"
    ],
    hindiKeyTopics: [
      "पतला लेंस सूत्र व क्षमता संयोजन (P = P₁ + P₂)",
      "आभासी व वास्तविक प्रतिबिम्ब हेतु कार्तीय चिह्न परिपाटी",
      "क्रांतिक कोण व पूर्ण आंतरिक परावर्तन का 5-सेकंड नियम"
    ],
    highYieldTrick: "Critical angle is ALWAYS sin θ_c = μ_rarer / μ_denser. Since sin θ ≤ 1, simply put the smaller index on the numerator in 2 seconds.",
    hindiHighYieldTrick: "क्रांतिक कोण सूत्र में हमेशा छोटा अपवर्तनांक ऊपर आता है: sin θ_c = छोटा / बड़ा। 2 सेकंड में उत्तर निश्चित!",
    diagnosticTrap: "Mixing focal length signs: Convex lens f is always positive (+), Concave lens f is always negative (-).",
    hindiDiagnosticTrap: "उत्तल लेंस की फोकस दूरी हमेशा धनात्मक (+) और अवतल लेंस की ऋणात्मक (-) होती है। यहाँ 70% छात्र चिह्न भूलते हैं।",
    drillQuestion: "If a convex lens of focal length 20 cm is placed in contact with a concave lens of focal length 25 cm, what is the power of the combination?",
    classroomPrompt: "Cherry Ma'am, let's practice Day 1 Sprint: Lens combinations and Cartesian sign conventions on the digital blackboard!"
  },
  {
    dayNumber: 2,
    title: "Definite Integrals & King's Property Sprints",
    hindiTitle: "निश्चित समाकलन व किंग प्रॉपर्टी के स्पीड शॉर्टकट",
    subject: "Mathematics",
    targetMarks: 4,
    minutesBudget: 15,
    keyTopics: [
      "King's Property: ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx",
      "Symmetric Bounds: ∫₋ₐᵃ f(x)dx (Odd vs Even Functions)",
      "Direct Result: I = (Upper Bound - Lower Bound) / 2"
    ],
    hindiKeyTopics: [
      "किंग्स प्रॉपर्टी: ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx का अनुप्रयोग",
      "सममित सीमाएं: ∫₋ₐᵃ f(x)dx (विषम फलन = 0)",
      "सीधा परिणाम: I = (उच्च सीमा - निम्न सीमा) / 2"
    ],
    highYieldTrick: "Whenever numerator is f(x) and denominator is f(x) + f(a-x) over [0, a], answer is ALWAYS a/2. No lengthy integration needed!",
    hindiHighYieldTrick: "जब भी अंश f(x) और हर f(x) + f(a-x) सममित हों, तो उत्तर हमेशा (b - a)/2 = a/2 होता है। कलम चलाए बिना हल!",
    diagnosticTrap: "Attempting trigonometric identities or integration by parts on symmetric limits instead of applying King's property directly.",
    hindiDiagnosticTrap: "सममित सीमाओं में लंबे त्रिकोणमितीय सूत्रों को हल करने में 8-10 मिनट व्यर्थ गँवाना।",
    drillQuestion: "Evaluate ∫₀^(π/2) (sin⁴ x / (sin⁴ x + cos⁴ x)) dx in under 20 seconds.",
    classroomPrompt: "Cherry Ma'am, let's master King's Property for Definite Integrals on the chalkboard for Day 2 Sprint!"
  },
  {
    dayNumber: 3,
    title: "Chemical Kinetics & Half-Life Calculation Blitz",
    hindiTitle: "रासायनिक बलगतिकी व अर्ध-आयुकाल की तेज गणना",
    subject: "Chemistry",
    targetMarks: 3,
    minutesBudget: 15,
    keyTopics: [
      "First Order Integrated Rate Law: k = (2.303/t) log(R₀/R)",
      "t₉₉% = 2 × t₉₀% and t₉₀% = 3.32 × t₅₀%",
      "Arrhenius Equation Temperature Coefficient (Ea Shortcuts)"
    ],
    hindiKeyTopics: [
      "प्रथम कोटि समाकलित वेग नियम: k = (2.303/t) log(R₀/R)",
      "अर्ध-आयु संबंध: t₉₉% = 2 × t₉₀% और t₉₀% = 3.32 × t₅₀%",
      "सक्रियण ऊर्जा (Ea) व ताप गुणांक के तेज संख्यात्मक नियम"
    ],
    highYieldTrick: "For first order reactions, every 90% completion takes exactly (2.303/k). 99% completion takes exactly double of 90% (2 × 2.303/k).",
    hindiHighYieldTrick: "प्रथम कोटि में 99% पूर्ण होने का समय 90% का ठीक 2 गुना होता है (t₉₉% = 2 × t₉₀%)। लंबे लॉग टेबल की कोई आवश्यकता नहीं।",
    diagnosticTrap: "Confusing zero order (t₁/₂ ∝ [A]₀) with first order (t₁/₂ is independent of initial concentration [A]₀).",
    hindiDiagnosticTrap: "शून्य कोटि (t₁/₂ ∝ R₀) और प्रथम कोटि (t₁/₂ प्रारंभिक सांद्रता से स्वतंत्र) के सूत्रों में भ्रमित होना।",
    drillQuestion: "A first order reaction takes 40 minutes for 30% decomposition. Calculate its half-life t₁/₂ without extensive log tables.",
    classroomPrompt: "Cherry Ma'am, let's solve first-order kinetics rate law shortcuts together for Day 3 Board Booster!"
  },
  {
    dayNumber: 4,
    title: "Current Electricity & Kirchhoff Loop Network Sprints",
    hindiTitle: "विद्युत धारा व किरचॉफ लूप विश्लेषण में समय की बचत",
    subject: "Physics",
    targetMarks: 3,
    minutesBudget: 15,
    keyTopics: [
      "Kirchhoff's Voltage Law (KVL) Sign Conventions",
      "Stretched Wire Resistance Law: R' = R(1 + x%)² ≈ R(1 + 2x%)",
      "Internal Resistance & Terminal Potential Difference (V = E - Ir)"
    ],
    hindiKeyTopics: [
      "किरचॉफ का वोल्टता नियम (KVL) व विभव पतन (+/- परिपाटी)",
      "तार खींचने पर प्रतिरोध परिवर्तन: R ∝ L² (आयतन स्थिर)",
      "आंतरिक प्रतिरोध व टर्मिनल विभवांतर (V = E - Ir)"
    ],
    highYieldTrick: "When a wire is stretched by x% (small change), resistance increases by ~2x%. If stretched by 10%, R increases by (1.1)² = +21%.",
    hindiHighYieldTrick: "यदि तार को x% खींचा जाए तो प्रतिरोध लगभग 2x% बढ़ता है (10% खिंचाव = 1.1² = +21% प्रतिरोध)।",
    diagnosticTrap: "Forgetting that volume remains constant during stretching, so cross-sectional area decreases proportionately.",
    hindiDiagnosticTrap: "छात्र केवल लंबाई बढ़ाते हैं और भूल जाते हैं कि आयतन स्थिर रहने से अनुप्रस्थ काट का क्षेत्रफल घट जाता है।",
    drillQuestion: "Two cells of EMF 2V and 1V with internal resistances 1Ω and 2Ω are connected in parallel. What is their effective EMF?",
    classroomPrompt: "Cherry Ma'am, please explain the nodal analysis shortcut for Kirchhoff loops on the chalkboard for Day 4 Sprint!"
  },
  {
    dayNumber: 5,
    title: "Matrices, Determinants & Inverse Properties Blitz",
    hindiTitle: "आव्यूह, सारणिक व प्रतिलोम के 10-सेकंड शॉर्टकट",
    subject: "Mathematics",
    targetMarks: 3,
    minutesBudget: 15,
    keyTopics: [
      "|k A| = kⁿ |A| for n × n matrix",
      "|adj(A)| = |A|ⁿ⁻¹ and |A · adj(A)| = |A|ⁿ",
      "A⁻¹ = adj(A) / |A| Existence Condition (|A| ≠ 0)"
    ],
    hindiKeyTopics: [
      "अदिश गुणा सारणिक: |k A| = kⁿ |A| (जहाँ n कोटि है)",
      "सहखंडज सारणिक: |adj(A)| = |A|ⁿ⁻¹ और |adj(adj(A))| = |A|⁽ⁿ⁻¹⁾²",
      "व्युत्क्रम आव्यूह की शर्त व 2×2 आव्यूह का सीधा व्युत्क्रम"
    ],
    highYieldTrick: "For a 3×3 matrix, |2 adj(A)| = 2³ × |adj(A)| = 8 × |A|². If |A| = 3, result is 8 × 9 = 72 in 5 seconds without finding adj(A)!",
    hindiHighYieldTrick: "3×3 आव्यूह में |2 adj(A)| = 2³ × |A|² = 8 × |A|²। बिना सहखंडज निकाले 5 सेकंड में मौखिक हल!",
    diagnosticTrap: "Pulling a scalar k out of a matrix determinant as k instead of kⁿ (where n is the matrix order).",
    hindiDiagnosticTrap: "सारणिक से संख्या k बाहर निकालते समय kⁿ के बजाय केवल k लिखना सबसे आम 1-अंक की गलती है।",
    drillQuestion: "If A is a 3×3 matrix with |A| = -2, find the value of |-3 adj(A)|.",
    classroomPrompt: "Cherry Ma'am, let's practice Day 5 determinant property shortcuts on the digital blackboard!"
  },
  {
    dayNumber: 6,
    title: "Electrochemistry & Nernst Equation Rapid Pacing",
    hindiTitle: "वैद्युतरसायन व नेर्नस्ट समीकरण के सटीक संख्यात्मक",
    subject: "Chemistry",
    targetMarks: 3,
    minutesBudget: 15,
    keyTopics: [
      "Nernst Equation: E_cell = E°_cell - (0.0591/n) log Q",
      "Reaction Quotient Q = [Anode Ions]ᵃ / [Cathode Ions]ᶜ",
      "Gibbs Free Energy & Equilibrium: ΔG° = -n F E°_cell = -2.303 RT log K_c"
    ],
    hindiKeyTopics: [
      "नेर्नस्ट समीकरण: E_cell = E°_cell - (0.0591/n) log Q",
      "अभिक्रिया भागफल Q = [एनोड आयन सांद्रता] / [कैथोड आयन सांद्रता]",
      "गिब्स मुक्त ऊर्जा संबंध: ΔG° = -n F E°_cell"
    ],
    highYieldTrick: "At 298K, (0.0591/n) ≈ 0.06/n. For a 2-electron transfer with Q = 10⁻², the correction is - (0.06/2)(-2) = +0.06 V added to E°!",
    hindiHighYieldTrick: "298K पर (0.0591/n) को 0.06/n मानें। यदि Q = 10⁻² हो तो सीधा +0.06 V जोड़ें। समय व गणना की बचत!",
    diagnosticTrap: "Inverting Q by placing cathode products over anode ions, leading to the opposite sign in EMF calculation.",
    hindiDiagnosticTrap: "Q लिखते समय एनोड और कैथोड के आयनों को उलट देना, जिससे +0.03V के स्थान पर -0.03V घट जाता है।",
    drillQuestion: "Calculate the EMF of Daniell cell Zn|Zn²⁺(0.01M)||Cu²⁺(1.0M)|Cu given E°_cell = 1.10 V at 298 K in 45 seconds.",
    classroomPrompt: "Cherry Ma'am, let's solve Nernst equation concentration cells together for Day 6 Board Booster!"
  },
  {
    dayNumber: 7,
    title: "Full-Length Multi-Subject Grand Sprint & Exam Time Pacing",
    hindiTitle: "संपूर्ण मॉक स्पीड स्प्रिंट व बोर्ड परीक्षा टाइम-मैनेजमेंट",
    subject: "Mathematics",
    targetMarks: 4,
    minutesBudget: 20,
    keyTopics: [
      "Section-by-Section Time Allocation (MCQ: 1 min, 2-Mark: 3 min, 5-Mark: 8 min)",
      "First 15-Minute Reading Period Strategy & Easy-Pick Question Tagging",
      "Last 15-Minute Sanity Check: Calculation Units & Sign Verification"
    ],
    hindiKeyTopics: [
      "खंड-वार समय आबंटन (MCQ: 1 मिनट, 2-अंक: 3 मिनट, 5-अंक: 8 मिनट)",
      "प्रश्नपत्र पढ़ने के पहले 15 मिनट की सही रणनीति व प्राथमिक चयन",
      "अंतिम 15 मिनट: मात्रक (Units), ऋणात्मक चिह्न व गणना री-चेकिंग"
    ],
    highYieldTrick: "Spend the initial 15-min reading time marking questions into Tier 1 (100% known), Tier 2 (needs step thought), and Tier 3 (calculation heavy). Solve Tier 1 first to bank 40 marks in 45 minutes!",
    hindiHighYieldTrick: "शुरुआती 15 मिनट में प्रश्नों को 3 श्रेणियों में बाँटें। सबसे पहले आसान प्रश्न हल करके 45 मिनट में 40 अंक सुरक्षित करें। पैनिक पूरी तरह समाप्त!",
    diagnosticTrap: "Getting stuck on a single 1-mark tricky MCQ for 8 minutes and running out of time on a 5-mark straightforward theorem.",
    hindiDiagnosticTrap: "किसी 1 अंक के कठिन MCQ पर 8 मिनट अड़े रहना और अंत में 5 अंक के आसान डेरिवेशन के लिए समय न बचना।",
    drillQuestion: "Simulate a 5-question multi-topic speed blitz under 4 minutes with zero calculation traps.",
    classroomPrompt: "Cherry Ma'am, let's do the Day 7 Grand Sprint and finalize my 3-hour board exam time-allocation blueprint!"
  }
];

// Curated Bank of Speed Pacing Modules across CBSE/ICSE/JEE/NEET
export const EXAM_PACING_DATA: ExamPacingProfile[] = [
  {
    id: "pacing-jee-neet-phy",
    examName: "CBSE & NEET Physics Speed Drill",
    hindiExamName: "कक्षा 12 भौतिकी • स्पीड व टाइम-पेसिंग ड्रिल",
    subject: "Physics",
    totalExamQuestions: 45,
    totalExamMinutes: 45,
    targetSecondsPerQuestion: 60,
    paceBand: "rapid_mcq",
    description: "Rapid dimensional analysis, ratio scaling, and mental shortcut elimination for high-pressure Physics MCQs.",
    hindiDescription: "विमीय विश्लेषण, अनुपात विधि और 10-सेकंड मानसिक शॉर्टकट से भौतिकी के बहुविकल्पीय प्रश्नों को तेज हल करें।",
    questions: [
      {
        id: "q-phy-1",
        subject: "Physics",
        topic: "Current Electricity & Resistance",
        hindiTopic: "विद्युत धारा व तार खिंचाव प्रतिरोध",
        questionText: "A uniform cylindrical wire of resistance R is stretched uniformly so that its length increases by 10%. What is the new approximate resistance?",
        hindiQuestionText: "प्रतिरोध R के एक समान बेलनाकार तार को एकसमान रूप से खींचा जाता है जिससे उसकी लंबाई 10% बढ़ जाती है। नया अनुमानित प्रतिरोध क्या होगा?",
        idealSeconds: 40,
        options: [
          { label: "A", text: "1.10 R (+10%)", hindiText: "1.10 R (+10%)" },
          { label: "B", text: "1.21 R (+21%)", hindiText: "1.21 R (+21%)" },
          { label: "C", text: "0.90 R (-10%)", hindiText: "0.90 R (-10%)" },
          { label: "D", text: "1.44 R (+44%)", hindiText: "1.44 R (+44%)" }
        ],
        correctIndex: 1,
        speedTrap: "Students multiply only length L by 1.10 and forget that volume is constant, so area A shrinks by factor of 1.10.",
        hindiSpeedTrap: "छात्र केवल लंबाई L को 1.10 से गुणा करते हैं और भूल जाते हैं कि आयतन स्थिर होने से क्षेत्रफल A भी 1.10 गुना घट जाता है।",
        shortcutTip: "Use percentage shortcut: For small stretch x%, R increases by ~2x% (exact: R' = R(1+x/100)² = 1.1² = 1.21R). Takes 5 seconds!",
        hindiShortcutTip: "सीधा प्रतिशत नियम: R ∝ L² (आयतन स्थिर)। अतः नया प्रतिरोध = 1.10² × R = 1.21 R (+21%)। मात्र 5 सेकंड का काम!",
        explanation: "Volume V = A · L = constant. When L' = 1.10 L, A' = A / 1.10. Therefore R' = ρ L' / A' = ρ (1.10 L) / (A / 1.10) = 1.21 (ρL/A) = 1.21 R.",
        hindiExplanation: "आयतन V = A × L = स्थिर। जब L' = 1.10 L हो, तो A' = A / 1.10। अतः R' = ρ L' / A' = 1.21 R (+21% वृद्धि)।"
      },
      {
        id: "q-phy-2",
        subject: "Physics",
        topic: "Ray Optics & Total Internal Reflection",
        hindiTopic: "किरण प्रकाशिकी व क्रांतिक कोण",
        questionText: "A ray of light enters from glass (μ = 1.5) into water (μ = 4/3). The critical angle θ_c for this interface is:",
        hindiQuestionText: "प्रकाश की एक किरण काँच (μ = 1.5) से जल (μ = 4/3) में प्रवेश करती है। इस अंतरापृष्ठ के लिए क्रांतिक कोण θ_c क्या होगा?",
        idealSeconds: 45,
        options: [
          { label: "A", text: "sin⁻¹(8/9)", hindiText: "sin⁻¹(8/9)" },
          { label: "B", text: "sin⁻¹(9/8)", hindiText: "sin⁻¹(9/8)" },
          { label: "C", text: "sin⁻¹(1/2)", hindiText: "sin⁻¹(1/2)" },
          { label: "D", text: "sin⁻¹(2/3)", hindiText: "sin⁻¹(2/3)" }
        ],
        correctIndex: 0,
        speedTrap: "Dividing glass index by water index (1.5 / 1.33 = 9/8 > 1), which gives an undefined sine value.",
        hindiSpeedTrap: "काँच के अपवर्तनांक को जल के अपवर्तनांक से भाग देना (1.5 / 1.33 = 9/8 > 1), जिससे साइन का मान 1 से बड़ा होकर अमान्य हो जाता है।",
        shortcutTip: "Critical angle is ALWAYS sin θ_c = (μ_rarer / μ_denser). Since sine cannot exceed 1, smaller number goes on top: (4/3) / (3/2) = 8/9.",
        hindiShortcutTip: "गोल्डन नियम: साइन का मान कभी 1 से बड़ा नहीं हो सकता, इसलिए हमेशा छोटा मान ऊपर और बड़ा मान नीचे रखें: (4/3) ÷ (3/2) = 8/9।",
        explanation: "By Snell's Law at critical angle: μ₁ sin θ_c = μ₂ sin 90°. (3/2) sin θ_c = (4/3)(1) ⟹ sin θ_c = (4/3) × (2/3) = 8/9 ⟹ θ_c = sin⁻¹(8/9).",
        hindiExplanation: "स्नेल के नियम से: μ₁ sin θ_c = μ₂ sin 90° ⟹ (3/2) sin θ_c = 4/3 ⟹ sin θ_c = 8/9 ⟹ θ_c = sin⁻¹(8/9)।"
      },
      {
        id: "q-phy-3",
        subject: "Physics",
        topic: "Gravitation & Acceleration due to Gravity",
        hindiTopic: "गुरुत्वाकर्षण व त्रिज्या संकुचन में g का मान",
        questionText: "If the radius of the Earth shrinks by 1% while its mass remains constant, the acceleration due to gravity 'g' on its surface will:",
        hindiQuestionText: "यदि पृथ्वी का द्रव्यमान स्थिर रखते हुए उसकी त्रिज्या में 1% का संकुचन (कमी) हो जाए, तो सतह पर गुरुत्वीय त्वरण 'g' का मान:",
        idealSeconds: 35,
        options: [
          { label: "A", text: "Decrease by 1%", hindiText: "1% घटेगा" },
          { label: "B", text: "Increase by 2%", hindiText: "2% बढ़ेगा" },
          { label: "C", text: "Decrease by 2%", hindiText: "2% घटेगा" },
          { label: "D", text: "Increase by 1%", hindiText: "1% बढ़ेगा" }
        ],
        correctIndex: 1,
        speedTrap: "Writing out full Newton calculations with numerical values G, M, R instead of power differentiation.",
        hindiSpeedTrap: "संख्यात्मक मान G, M, R रखकर लंबा गुणा-भाग करना, जिससे 3-4 मिनट नष्ट हो जाते हैं।",
        shortcutTip: "Formula g = GM / R⁻². Log differentiation: Δg/g = -2(ΔR/R). If R shrinks by -1%, g increases by -2(-1%) = +2%. Done in 4 seconds.",
        hindiShortcutTip: "अवकलन शॉर्टकट: g = GM / R² ⟹ dg/g = -2 (dR/R)। यदि त्रिज्या -1% घटे, तो g में -2 × (-1%) = +2% की वृद्धि होगी। मात्र 4 सेकंड!",
        explanation: "g = GM/R². Differentiating for small fractional changes: dg/g = -2(dR/R). Given dR/R = -1%, dg/g = -2(-1%) = +2% increase.",
        hindiExplanation: "g = GM/R²। भिन्नात्मक परिवर्तन हेतु: dg/g = -2(dR/R)। dR/R = -1% रखने पर dg/g = +2% वृद्धि।"
      }
    ]
  },
  {
    id: "pacing-math-calculus-speed",
    examName: "Class 12 Board Maths Blitz Sprint",
    hindiExamName: "कक्षा 12 गणित • कैलकुलस व बीजगणित ब्लिट्ज़",
    subject: "Mathematics",
    totalExamQuestions: 38,
    totalExamMinutes: 180,
    targetSecondsPerQuestion: 75,
    paceBand: "balanced_application",
    description: "Calculus limits, matrix determinant properties, and quick vectors where eliminating steps saves 20+ exam minutes.",
    hindiDescription: "कैलकुलस, आव्यूह सारणिक और सदिश बीजगणित में व्यर्थ गणनाएँ हटाकर परीक्षा में 20+ मिनट बचाएं।",
    questions: [
      {
        id: "q-math-1",
        subject: "Mathematics",
        topic: "Matrices & Determinants",
        hindiTopic: "आव्यूह व सहखंडज सारणिक गुणधर्म",
        questionText: "If A is a 3 × 3 non-singular matrix and |A| = 4, then the determinant |2 adj(A)| is equal to:",
        hindiQuestionText: "यदि A एक 3 × 3 व्युत्क्रमणीय आव्यूह है और |A| = 4 है, तो सारणिक |2 adj(A)| का मान किसके बराबर होगा?",
        idealSeconds: 50,
        options: [
          { label: "A", text: "32", hindiText: "32" },
          { label: "B", text: "64", hindiText: "64" },
          { label: "C", text: "128", hindiText: "128" },
          { label: "D", text: "16", hindiText: "16" }
        ],
        correctIndex: 2,
        speedTrap: "Pulling 2 out as 2¹ instead of 2ⁿ = 2³ = 8, or misremembering |adj(A)| = |A|ⁿ⁻¹ = 4² = 16.",
        hindiSpeedTrap: "संख्या 2 को सारणिक से बाहर निकालते समय 2ⁿ = 2³ = 8 की जगह केवल 2 बाहर निकालना।",
        shortcutTip: "Two quick rules: |k M| = kⁿ |M| (here 2³ = 8) and |adj(A)| = |A|ⁿ⁻¹ (here 4² = 16). Result = 8 × 16 = 128. Mental math only.",
        hindiShortcutTip: "दो आसान नियम: |k M| = k³ |M| = 8 |M|, और |adj(A)| = |A|³⁻¹ = 4² = 16। कुल उत्तर = 8 × 16 = 128। केवल मौखिक गणना!",
        explanation: "For an n × n matrix, |k B| = kⁿ |B|. Here n=3, so |2 adj(A)| = 2³ |adj(A)|. Since |adj(A)| = |A|ⁿ⁻¹ = |A|² = 4² = 16, total = 8 × 16 = 128.",
        hindiExplanation: "n × n आव्यूह के लिए |k B| = kⁿ |B|। यहाँ n=3, अतः |2 adj(A)| = 2³ × |adj(A)| = 8 × |A|² = 8 × 16 = 128।"
      },
      {
        id: "q-math-2",
        subject: "Mathematics",
        topic: "Definite Integrals (King's Property)",
        hindiTopic: "निश्चित समाकलन (किंग्स प्रॉपर्टी)",
        questionText: "The value of the definite integral ∫₀^(π/2) (sin³ x / (sin³ x + cos³ x)) dx is:",
        hindiQuestionText: "निश्चित समाकलन ∫₀^(π/2) (sin³ x / (sin³ x + cos³ x)) dx का मान क्या होगा?",
        idealSeconds: 30,
        options: [
          { label: "A", text: "π / 2", hindiText: "π / 2" },
          { label: "B", text: "π / 4", hindiText: "π / 4" },
          { label: "C", text: "1", hindiText: "1" },
          { label: "D", text: "0", hindiText: "0" }
        ],
        correctIndex: 1,
        speedTrap: "Trying to perform trigonometric substitution or integration by parts on sin³ x.",
        hindiSpeedTrap: "sin³ x पर त्रिकोणमितीय प्रतिस्थापन या खंडशः समाकलन (By Parts) करने का प्रयास करना।",
        shortcutTip: "King's symmetry property: Whenever numerator f(x) and denominator f(x)+f(a-x) are symmetric over [a, b], integral is ALWAYS (b - a)/2 = (π/2 - 0)/2 = π/4.",
        hindiShortcutTip: "सममित नियम: जब भी हर में f(x) + f(a-x) हो और सीमाएं 0 से a हों, उत्तर हमेशा a/2 = (π/2) ÷ 2 = π/4 होता है। 5 सेकंड में पूरा!",
        explanation: "Using property ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx: 2I = ∫₀^(π/2) 1 dx = π/2 ⟹ I = π/4.",
        hindiExplanation: "गुणधर्म ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx से: 2I = ∫₀^(π/2) 1 dx = π/2 ⟹ I = π/4।"
      },
      {
        id: "q-math-3",
        subject: "Mathematics",
        topic: "Vector Dot Product & Magnitudes",
        hindiTopic: "सदिश अदिश गुणनफल व परिमाण",
        questionText: "If unit vectors a⃗ and b⃗ satisfy |a⃗ + b⃗| = √3, then the value of (2a⃗ - 5b⃗) · (3a⃗ + b⃗) is:",
        hindiQuestionText: "यदि इकाई सदिश a⃗ व b⃗ के लिए |a⃗ + b⃗| = √3 है, तो (2a⃗ - 5b⃗) · (3a⃗ + b⃗) का मान होगा:",
        idealSeconds: 60,
        options: [
          { label: "A", text: "-11/2", hindiText: "-11/2" },
          { label: "B", text: "-9/2", hindiText: "-9/2" },
          { label: "C", text: "5/2", hindiText: "5/2" },
          { label: "D", text: "-13/2", hindiText: "-13/2" }
        ],
        correctIndex: 0,
        speedTrap: "Trying to find individual angles θ for each vector in space instead of finding a⃗ · b⃗ directly from |a⃗ + b⃗|².",
        hindiSpeedTrap: "सदिशों के बीच का कोण अलग से निकालने की कोशिश करना, बजाय सीधे |a⃗ + b⃗|² का विस्तार करने के।",
        shortcutTip: "Square |a⃗+b⃗|: 1 + 1 + 2(a⃗·b⃗) = 3 ⟹ a⃗·b⃗ = 1/2. Expand target: 6|a⃗|² - 13(a⃗·b⃗) - 5|b⃗|² = 6(1) - 13(0.5) - 5(1) = 1 - 6.5 = -5.5 = -11/2.",
        hindiShortcutTip: "|a⃗ + b⃗|² = 1 + 1 + 2(a⃗·b⃗) = 3 ⟹ a⃗·b⃗ = 1/2। लक्ष्य का विस्तार: 6(1) - 13(1/2) - 5(1) = 1 - 6.5 = -11/2।",
        explanation: "|a⃗ + b⃗|² = |a⃗|² + |b⃗|² + 2(a⃗·b⃗) = 1 + 1 + 2(a⃗·b⃗) = 3 ⟹ a⃗·b⃗ = 1/2. Target: 6|a⃗|² - 13(a⃗·b⃗) - 5|b⃗|² = 6 - 6.5 - 5 = -5.5 = -11/2.",
        hindiExplanation: "|a⃗ + b⃗|² = 1 + 1 + 2(a⃗·b⃗) = 3 ⟹ a⃗·b⃗ = 1/2। विस्तार करने पर: 6(1) - 13(0.5) - 5 = -5.5 = -11/2।"
      }
    ]
  },
  {
    id: "pacing-chem-physical-inorganic",
    examName: "Chemistry Speed Calculation & Elimination",
    hindiExamName: "कक्षा 12 रसायन • गति व विकल्प निष्कासन ड्रिल",
    subject: "Chemistry",
    totalExamQuestions: 40,
    totalExamMinutes: 60,
    targetSecondsPerQuestion: 50,
    paceBand: "rapid_mcq",
    description: "Nernst potentials, rate laws, and valence oxidation states designed for lightning-fast elimination.",
    hindiDescription: "नेर्नस्ट विभव, वेग नियम और ऑक्सीकरण अवस्थाओं को बिना लंबे लॉग के तेजी से हल करें।",
    questions: [
      {
        id: "q-chem-1",
        subject: "Chemistry",
        topic: "Chemical Kinetics & Half Life",
        hindiTopic: "रासायनिक बलगतिकी व 90% पूर्ण होने का समय",
        questionText: "A first-order reaction has a rate constant k = 2.303 × 10⁻³ s⁻¹. The time required for 90% completion of the reaction is approximately:",
        hindiQuestionText: "प्रथम कोटि की अभिक्रिया हेतु वेग स्थिरांक k = 2.303 × 10⁻³ s⁻¹ है। अभिक्रिया के 90% पूर्ण होने में लगा समय होगा:",
        idealSeconds: 45,
        options: [
          { label: "A", text: "500 s", hindiText: "500 s" },
          { label: "B", text: "1000 s", hindiText: "1000 s" },
          { label: "C", text: "2303 s", hindiText: "2303 s" },
          { label: "D", text: "300 s", hindiText: "300 s" }
        ],
        correctIndex: 1,
        speedTrap: "Plugging all natural logs into paper calculations without noticing 2.303 cancellation.",
        hindiSpeedTrap: "संख्या 2.303 को 2.303 से काटने के बजाय विस्तृत लॉग तालिका खोजने में समय गँवाना।",
        shortcutTip: "For 90% completion, [R]/[R]₀ = 10/100 = 1/10. t₉₀% = (2.303 / k) log(10) = (2.303 / 2.303×10⁻³) × 1 = 1000 seconds. 6 seconds flat.",
        hindiShortcutTip: "90% पूर्ण होने पर सांद्रता 1/10 बचती है। log(10) = 1। अतः t = (2.303 / 2.303×10⁻³) × 1 = 10³ = 1000 सेकंड। सीधा उत्तर!",
        explanation: "t = (2.303 / k) log (100 / (100 - 90)) = (2.303 / 2.303 × 10⁻³) log(10) = 10³ × 1 = 1000 s.",
        hindiExplanation: "t = (2.303 / k) log(100 / 10) = (2.303 / 2.303 × 10⁻³) × 1 = 1000 सेकंड।"
      },
      {
        id: "q-chem-2",
        subject: "Chemistry",
        topic: "Electrochemistry & Cell EMF",
        hindiTopic: "वैद्युतरसायन व नेर्नस्ट सेल विभव",
        questionText: "For the cell reaction Zn + Cu²⁺(0.1 M) → Zn²⁺(0.01 M) + Cu with E°_cell = 1.10 V at 298 K, the actual cell EMF is:",
        hindiQuestionText: "सेल अभिक्रिया Zn + Cu²⁺(0.1 M) → Zn²⁺(0.01 M) + Cu (E°_cell = 1.10 V) हेतु 298 K पर सेल का वास्तविक EMF क्या होगा?",
        idealSeconds: 50,
        options: [
          { label: "A", text: "1.10 V", hindiText: "1.10 V" },
          { label: "B", text: "1.13 V", hindiText: "1.13 V" },
          { label: "C", text: "1.07 V", hindiText: "1.07 V" },
          { label: "D", text: "0.98 V", hindiText: "0.98 V" }
        ],
        correctIndex: 1,
        speedTrap: "Writing Q = [Cu²⁺]/[Zn²⁺] (inverted ratio) and subtracting 0.03 V instead of adding.",
        hindiSpeedTrap: "Q = [Cu²⁺]/[Zn²⁺] उल्टा लिख देना और 0.03 V जोड़ने के बजाय घटा देना।",
        shortcutTip: "Q = [Zn²⁺]/[Cu²⁺] = 0.01 / 0.1 = 10⁻¹. log Q = -1. Term is - (0.059/2)(-1) = +0.0295 V ≈ +0.03 V. So E = 1.10 + 0.03 = 1.13 V.",
        hindiShortcutTip: "Q = 0.01 / 0.1 = 10⁻¹। log(10⁻¹) = -1। अतः पद - (0.06/2)(-1) = +0.03 V। 1.10 + 0.03 = 1.13 V। मौखिक उत्तर!",
        explanation: "E = E° - (0.0591/n) log ([Zn²⁺]/[Cu²⁺]) = 1.10 - (0.0591/2) log(0.01/0.1) = 1.10 - 0.0295(-1) = 1.10 + 0.0295 ≈ 1.13 V.",
        hindiExplanation: "E = 1.10 - (0.0591/2) log(0.01/0.1) = 1.10 - 0.0295(-1) = 1.10 + 0.03 = 1.13 V।"
      }
    ]
  },
  {
    id: "pacing-bio-genetics-speed",
    examName: "Biology NEET & Board Rapid Blitz",
    hindiExamName: "कक्षा 12 जीवविज्ञान • आनुवंशिकी व स्पीड रिकॉल",
    subject: "Biology",
    totalExamQuestions: 45,
    totalExamMinutes: 35,
    targetSecondsPerQuestion: 40,
    paceBand: "rapid_mcq",
    description: "Genetics Punnett ratios, Chargaff base-pair calculations, and pedigree analysis solved in 20-30 seconds.",
    hindiDescription: "आनुवंशिकी अनुपात, चारगाफ नियम व पेडिग्री चार्ट के प्रश्नों को 25 सेकंड में सटीक हल करें।",
    questions: [
      {
        id: "q-bio-1",
        subject: "Biology",
        topic: "Molecular Basis of Inheritance & Chargaff Rule",
        hindiTopic: "चारगाफ का नियम व डीएनए क्षार युग्म गणना",
        questionText: "If a double-stranded DNA molecule has 20% Cytosine, what will be the percentage of Adenine in this DNA?",
        hindiQuestionText: "यदि एक द्विरज्जुक डीएनए (dsDNA) अणु में 20% साइटोसिन (C) है, तो इसमें एडेनिन (A) का प्रतिशत क्या होगा?",
        idealSeconds: 25,
        options: [
          { label: "A", text: "20%", hindiText: "20%" },
          { label: "B", text: "30%", hindiText: "30%" },
          { label: "C", text: "40%", hindiText: "40%" },
          { label: "D", text: "60%", hindiText: "60%" }
        ],
        correctIndex: 1,
        speedTrap: "Assuming C + A = 50% without understanding G = C pairs, or dividing 80% by 4.",
        hindiSpeedTrap: "C = A मान लेना या 80% को सीधे 4 से भाग देकर 20% पर गलत निशान लगाना।",
        shortcutTip: "Chargaff Rule: G = C = 20%. So G + C = 40%. Remaining is A + T = 60%. Since A = T, Adenine = 60% / 2 = 30%. Takes 5 seconds.",
        hindiShortcutTip: "चारगाफ नियम: C = G = 20%, अतः C + G = 40%। शेष 60% A और T में बराबर बंटेगा: A = 60% ÷ 2 = 30%। 5 सेकंड में हल!",
        explanation: "By Chargaff's rule, %G = %C = 20%. Therefore %(G + C) = 40%. The remaining %(A + T) = 100% - 40% = 60%. Since %A = %T, %A = 60% / 2 = 30%.",
        hindiExplanation: "चारगाफ के नियमानुसार G = C = 20%। अतः G + C = 40%। शेष A + T = 60%। चूंकि A = T, अतः A = 30%।"
      }
    ]
  }
];

export const ExamSpeedSprintSimulator: React.FC<ExamSpeedSprintSimulatorProps> = ({
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

  // Mode switcher: Live Sprint Arena vs 7-Day Score Booster
  const [activeViewMode, setActiveViewMode] = useState<"sprint_arena" | "seven_day_booster">("sprint_arena");

  // 7-Day Booster Active Day and Tracked Completed Days
  const [activeBoosterDayNumber, setActiveBoosterDayNumber] = useState<number>(1);
  const [completedBoosterDays, setCompletedBoosterDays] = useState<number[]>([1]);

  // Active selected module for Live Sprint
  const [selectedModuleId, setSelectedModuleId] = useState<string>("pacing-jee-neet-phy");
  
  // Interactive Simulator State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Score & Pacing Log
  const [sprintLogs, setSprintLogs] = useState<{
    questionId: string;
    secondsTaken: number;
    idealSeconds: number;
    isCorrect: boolean;
    paceStatus: "lightning" | "optimal" | "overtime";
  }[]>([]);

  // Active Profile
  const activeProfile = useMemo(() => {
    return EXAM_PACING_DATA.find((p) => p.id === selectedModuleId) || EXAM_PACING_DATA[0];
  }, [selectedModuleId]);

  // Current Active Question
  const activeQuestion = useMemo(() => {
    return activeProfile.questions[currentQuestionIndex] || activeProfile.questions[0];
  }, [activeProfile, currentQuestionIndex]);

  // Active 7-Day Booster Day Object
  const activeBoosterDay = useMemo(() => {
    return SEVEN_DAY_BOOSTER_PLAN.find((d) => d.dayNumber === activeBoosterDayNumber) || SEVEN_DAY_BOOSTER_PLAN[0];
  }, [activeBoosterDayNumber]);

  // Live Timer Effect
  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !isAnswerSubmitted) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isAnswerSubmitted]);

  // Reset question state on module switch
  const handleSelectModule = (id: string) => {
    setSelectedModuleId(id);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setElapsedSeconds(0);
    setIsTimerRunning(true);
  };

  // Submit Answer & Calculate Speed Rating
  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null) return;
    setIsAnswerSubmitted(true);
    setIsTimerRunning(false);

    const isCorrect = selectedOptionIndex === activeQuestion.correctIndex;
    const ratio = elapsedSeconds / activeQuestion.idealSeconds;
    let paceStatus: "lightning" | "optimal" | "overtime" = "optimal";
    if (ratio < 0.75) {
      paceStatus = "lightning";
    } else if (ratio > 1.25) {
      paceStatus = "overtime";
    }

    setSprintLogs((prev) => [
      ...prev,
      {
        questionId: activeQuestion.id,
        secondsTaken: elapsedSeconds,
        idealSeconds: activeQuestion.idealSeconds,
        isCorrect,
        paceStatus
      }
    ]);
  };

  // Next Question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeProfile.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerSubmitted(false);
      setElapsedSeconds(0);
      setIsTimerRunning(true);
    }
  };

  // Toggle Day Completion in 7-Day Booster
  const toggleBoosterDayComplete = (dayNum: number) => {
    setCompletedBoosterDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  // Aggregated Performance Statistics
  const sprintStats = useMemo(() => {
    if (sprintLogs.length === 0) {
      return {
        totalAnswered: 0,
        accuracy: 0,
        avgSeconds: 0,
        timeSavedSeconds: 0,
        lightningCount: 0,
        overtimeCount: 0
      };
    }

    const totalAnswered = sprintLogs.length;
    const correctCount = sprintLogs.filter((l) => l.isCorrect).length;
    const accuracy = Math.round((correctCount / totalAnswered) * 100);
    const totalTime = sprintLogs.reduce((acc, l) => acc + l.secondsTaken, 0);
    const avgSeconds = Math.round(totalTime / totalAnswered);
    const idealTotal = sprintLogs.reduce((acc, l) => acc + l.idealSeconds, 0);
    const timeSavedSeconds = idealTotal - totalTime;
    const lightningCount = sprintLogs.filter((l) => l.paceStatus === "lightning").length;
    const overtimeCount = sprintLogs.filter((l) => l.paceStatus === "overtime").length;

    return {
      totalAnswered,
      accuracy,
      avgSeconds,
      timeSavedSeconds,
      lightningCount,
      overtimeCount
    };
  }, [sprintLogs]);

  // Total Marks in 7-Day Plan
  const totalBoosterMarks = useMemo(() => {
    return SEVEN_DAY_BOOSTER_PLAN.reduce((acc, d) => acc + d.targetMarks, 0);
  }, []);

  const completedMarksEarned = useMemo(() => {
    return SEVEN_DAY_BOOSTER_PLAN.filter((d) => completedBoosterDays.includes(d.dayNumber)).reduce(
      (acc, d) => acc + d.targetMarks,
      0
    );
  }, [completedBoosterDays]);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Hero Header for Exam Speed Pacing & 7-Day Booster */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 text-slate-900 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 min-w-0 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs bg-indigo-50 text-indigo-700 font-mono px-3 py-1 rounded-full font-bold border border-indigo-200/80 flex items-center gap-1.5 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-[#796AEF]" />
              {isEng
                ? "Speed Sprint & 7-Day Board Booster • Time Pacing"
                : "Speed Sprint & 7-Day Board Booster • गति व टाइम-पेसिंग"}
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              Stopwatch Pacing Analytics
            </span>
          </div>

          <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
            <span>
              {isEng
                ? `Exam Time-Management: Bank 25+ mins & gain +${totalBoosterMarks} Board Marks`
                : `परीक्षा टाइम-मैनेजमेंट: 25+ मिनट की बचत व +${totalBoosterMarks} बोर्ड अंक वृद्धि`}
            </span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed max-w-2xl">
            {isEng
              ? "90% of students lose marks not from lack of concepts, but by spending 4 minutes on 45-second MCQs. Learn 10-second blackboard shortcuts and boost your board score with the 7-Day Sprint."
              : "90% छात्र अवधारणा न जानने से नहीं, बल्कि 45-सेकंड के MCQ पर 4 मिनट व्यर्थ करने के कारण अंक गँवाते हैं। 10-सेकंड के ब्लैकबोर्ड शॉर्टकट सीखें और 7-दिवसीय स्प्रिंट से अपना बोर्ड स्कोर बूस्ट करें।"}
          </p>
        </div>

        {/* Live Speed Bento Scoreboard - 3-col Grid */}
        <div className="grid grid-cols-3 gap-2.5 w-full md:w-auto shrink-0 z-10">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
              {isEng ? "Avg Time" : "औसत समय"}
            </span>
            <span className="text-lg sm:text-xl font-black text-[#796AEF] font-mono">
              {sprintStats.avgSeconds > 0 ? `${sprintStats.avgSeconds}s` : "--"}
            </span>
            <span className="text-[9.5px] text-slate-500 font-medium block">
              {isEng ? "Per Question" : "प्रति प्रश्न (Speed)"}
            </span>
          </div>

          <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 text-center shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 block">
              {isEng ? "Accuracy" : "सटीकता"}
            </span>
            <span className="text-lg sm:text-xl font-black text-emerald-800 font-mono">
              {sprintStats.totalAnswered > 0 ? `${sprintStats.accuracy}%` : "--"}
            </span>
            <span className="text-[9.5px] text-emerald-700 font-medium block">Accuracy Rate</span>
          </div>

          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3 text-center shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 block">
              {isEng ? "Time Banked" : "समय बचत"}
            </span>
            <span className="text-lg sm:text-xl font-black text-amber-800 font-mono">
              {sprintStats.timeSavedSeconds > 0
                ? `+${sprintStats.timeSavedSeconds}s`
                : sprintStats.timeSavedSeconds < 0
                ? `${sprintStats.timeSavedSeconds}s`
                : "0s"}
            </span>
            <span className="text-[9.5px] text-amber-700 font-medium block">Time Banked</span>
          </div>
        </div>
      </div>

      {/* Mode Switcher Segmented Bar: Live Sprint Arena vs 7-Day Booster */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveViewMode("sprint_arena")}
            className={`min-h-[44px] flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
              activeViewMode === "sprint_arena"
                ? "bg-[#796AEF] text-white border-[#796AEF] shadow-2xs ring-2 ring-indigo-200"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{isEng ? "⏱️ Live Time-Pacing Sprint Arena" : "⏱️ लाइव टाइम-पेसिंग स्प्रिंट (Live Arena)"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewMode("seven_day_booster")}
            className={`min-h-[44px] flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
              activeViewMode === "seven_day_booster"
                ? "bg-[#796AEF] text-white border-[#796AEF] shadow-2xs ring-2 ring-indigo-200"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{isEng ? `📅 7-Day Board Score Booster (+${totalBoosterMarks} Marks)` : `📅 7-दिवसीय बोर्ड स्कोर बूस्टर (+${totalBoosterMarks} अंक)`}</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-500 px-3 py-1 bg-slate-50 rounded-lg border border-slate-200/80 w-full sm:w-auto text-center sm:text-right">
          {activeViewMode === "sprint_arena" ? (
            <span>{isEng ? "Target: Accurate answer in 30-60 seconds" : "लक्ष्य: 30-60 सेकंड में सटीक उत्तर"}</span>
          ) : (
            <span className="text-emerald-700 font-bold">
              {isEng
                ? `Progress: ${completedBoosterDays.length}/7 Days Complete (+${completedMarksEarned} Marks Secured)`
                : `प्रगति: ${completedBoosterDays.length}/7 दिन पूर्ण (+${completedMarksEarned} अंक सुरक्षित)`}
            </span>
          )}
        </div>
      </div>

      {/* VIEW 1: LIVE SPEED SPRINT ARENA */}
      {activeViewMode === "sprint_arena" && (
        <div className="space-y-6">
          {/* Module Selector Strip */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-[#796AEF]" />
                {isEng ? "Select Speed Pacing Track:" : "स्पीड ड्रिल ट्रैक चुनें (Select Speed Pacing Track):"}
              </span>
              <span className="text-xs font-mono text-indigo-700 font-bold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                {isEng ? `Target Pace: ${activeProfile.targetSecondsPerQuestion}s / question` : `लक्ष्य गति: ${activeProfile.targetSecondsPerQuestion}s / प्रश्न`}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {EXAM_PACING_DATA.map((mod) => {
                const isSelected = selectedModuleId === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => handleSelectModule(mod.id)}
                    className={`min-h-[112px] p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? "bg-indigo-50/80 text-slate-900 border-[#796AEF] shadow-sm ring-2 ring-[#796AEF]/30"
                        : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-indigo-300 shadow-2xs"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md ${
                            isSelected
                              ? "bg-[#796AEF] text-white"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {mod.subject}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {mod.targetSecondsPerQuestion}s {isEng ? "target" : "लक्ष्य"}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-black line-clamp-1 text-slate-900">
                        {(!isEng && mod.hindiExamName) ? mod.hindiExamName : mod.examName}
                      </h4>
                      <p className="text-[11px] line-clamp-2 leading-relaxed text-slate-500">
                        {(isEng ? mod.description : mod.hindiDescription) || mod.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10.5px] font-mono pt-2 border-t border-slate-100">
                      <span className={isSelected ? "text-[#796AEF] font-bold" : "text-slate-500"}>
                        {mod.questions.length} {isEng ? "Rapid Questions" : "रैपिड प्रश्न"}
                      </span>
                      <span className={isSelected ? "text-[#796AEF] font-bold" : "text-slate-400 font-medium"}>
                        {isEng ? "Start →" : "प्रारंभ करें →"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Live Speed Sprint Arena Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6 text-left">
            {/* Arena Header: Progress & Active Stopwatch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-md">
                    {isEng
                      ? `Question ${currentQuestionIndex + 1} of ${activeProfile.questions.length}`
                      : `प्रश्न ${currentQuestionIndex + 1} / ${activeProfile.questions.length}`}
                  </span>
                  <span className="text-[10.5px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                    {isEng ? `Topic: ${activeQuestion.topic}` : `विषय: ${activeQuestion.hindiTopic || activeQuestion.topic}`}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  {(!isEng && activeProfile.hindiExamName) ? activeProfile.hindiExamName : activeProfile.examName} • {isEng ? "Time-Pacing Simulation" : "टाइम-पेसिंग सिमुलेशन"}
                </h3>
              </div>

              {/* Interactive Stopwatch Gauge */}
              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono font-black text-sm sm:text-base transition-all ${
                    elapsedSeconds > activeQuestion.idealSeconds
                      ? "bg-rose-50 border-rose-300 text-rose-700 animate-pulse"
                      : elapsedSeconds > activeQuestion.idealSeconds * 0.75
                      ? "bg-amber-50 border-amber-300 text-amber-700"
                      : "bg-indigo-50 border-indigo-200 text-indigo-900"
                  }`}
                >
                  <Clock
                    className={`w-4 h-4 ${
                      elapsedSeconds > activeQuestion.idealSeconds
                        ? "text-rose-600 animate-spin"
                        : "text-[#796AEF]"
                    }`}
                  />
                  <span>{elapsedSeconds}s</span>
                  <span className="text-[11px] opacity-70 font-normal">
                    / {activeQuestion.idealSeconds}s {isEng ? "target" : "लक्ष्य"}
                  </span>
                </div>

                {isAnswerSubmitted && currentQuestionIndex < activeProfile.questions.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-[#796AEF] hover:bg-indigo-700 text-white text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>{isEng ? "Next Question" : "अगला प्रश्न"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Question Statement Box */}
            <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-[#796AEF] font-bold">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#796AEF]" />
                  <span>{isEng ? "EXAM SIMULATION PROMPT" : "बोर्ड परीक्षा सिमुलेशन (EXAM SIMULATION PROMPT)"}</span>
                </span>
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {isEng ? `Target Pace: ${activeQuestion.idealSeconds}s` : `आदर्श समय: ${activeQuestion.idealSeconds} सेकंड`}
                </span>
              </div>

              <p className="text-xs sm:text-sm md:text-base font-bold leading-relaxed text-slate-900">
                {(!isEng && activeQuestion.hindiQuestionText) ? activeQuestion.hindiQuestionText : activeQuestion.questionText}
              </p>

              {!isEng && activeQuestion.hindiQuestionText && activeQuestion.questionText !== activeQuestion.hindiQuestionText && (
                <p className="text-[11.5px] font-medium text-slate-500 font-sans italic">
                  EN: {activeQuestion.questionText}
                </p>
              )}

              {activeQuestion.formulaOrContext && (
                <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl font-mono text-xs text-amber-900 shadow-2xs">
                  {activeQuestion.formulaOrContext}
                </div>
              )}
            </div>

            {/* MCQ Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeQuestion.options.map((opt, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const isCorrect = idx === activeQuestion.correctIndex;

                let buttonClass =
                  "p-3.5 sm:p-4 rounded-2xl border text-left font-medium text-xs sm:text-sm transition-all cursor-pointer flex items-start gap-3 min-h-[48px] ";

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    buttonClass += "bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-500 font-bold shadow-xs";
                  } else if (isSelected && !isCorrect) {
                    buttonClass += "bg-rose-50 border-rose-400 text-rose-950 font-bold";
                  } else {
                    buttonClass += "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                  }
                } else {
                  if (isSelected) {
                    buttonClass += "bg-indigo-50 border-[#796AEF] text-indigo-950 ring-2 ring-[#796AEF] shadow-xs font-bold";
                  } else {
                    buttonClass += "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-indigo-300";
                  }
                }

                return (
                  <button
                    key={opt.label}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => {
                      setSelectedOptionIndex(idx);
                      if (!isTimerRunning) setIsTimerRunning(true);
                    }}
                    className={buttonClass}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg font-mono text-xs font-black flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-[#796AEF] text-white"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="flex-1 leading-snug">
                      {(!isEng && opt.hindiText) ? opt.hindiText : opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Action Button: Lock In Speed Decision */}
            {!isAnswerSubmitted && (
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={selectedOptionIndex === null}
                  onClick={handleSubmitAnswer}
                  className={`min-h-[44px] w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black uppercase font-mono tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    selectedOptionIndex !== null
                      ? "bg-[#796AEF] hover:bg-indigo-700 text-white active:scale-95"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Zap className="w-4 h-4 text-white" />
                  <span>{isEng ? "Lock In Answer & Clock Time" : "उत्तर लॉक करें व समय दर्ज करें (Lock & Clock Time)"}</span>
                </button>
              </div>
            )}

            {/* Post-Submission Speed Diagnosis & Shortcut Deconstruction */}
            {isAnswerSubmitted && (
              <div className="p-4 sm:p-5 rounded-2xl border space-y-4 animate-scale-up bg-slate-50 border-slate-200">
                {/* Speed Pacing Feedback Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedOptionIndex === activeQuestion.correctIndex ? (
                      <span className="text-xs font-mono font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-lg flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        {isEng ? "Correct Option!" : "सटीक उत्तर (Correct)!"}
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-black uppercase text-rose-800 bg-rose-100 border border-rose-300 px-3 py-1 rounded-lg flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-700" />
                        {isEng ? "Incorrect Option" : "गलत विकल्प (Incorrect)"}
                      </span>
                    )}

                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                        elapsedSeconds <= activeQuestion.idealSeconds
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}
                    >
                      <Timer className="w-3.5 h-3.5" />
                      {isEng
                        ? `Time Taken: ${elapsedSeconds}s (Target: ${activeQuestion.idealSeconds}s)`
                        : `लिया गया समय: ${elapsedSeconds}s (लक्ष्य: ${activeQuestion.idealSeconds}s)`}
                    </span>
                  </div>

                  {/* Discuss With Cherry Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onDiscussWithCherry) {
                        onDiscussWithCherry({
                          topic: activeQuestion.topic,
                          subject: activeProfile.subject,
                          conceptTested: activeQuestion.topic,
                          hint: (!isEng && activeQuestion.hindiShortcutTip) ? activeQuestion.hindiShortcutTip : activeQuestion.shortcutTip,
                          question: `Cherry Ma'am, please demonstrate the 10-second mental shortcut on the chalkboard for this question: "${activeQuestion.questionText}"!`
                        });
                      } else if (onEnterClassroom) {
                        onEnterClassroom();
                      }
                    }}
                    className="min-h-[44px] w-full sm:w-auto px-4 py-2 rounded-xl bg-[#796AEF] hover:bg-indigo-700 text-white font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>{isEng ? "Learn 10-Second Shortcut on Chalkboard 🚀" : "मैम से 10-सेकंड शॉर्टकट ब्लैकबोर्ड पर सीखें 🚀"}</span>
                  </button>
                </div>

                {/* The 10-Second Mental Shortcut Box */}
                <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-300/80 rounded-2xl space-y-1.5 text-left">
                  <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-700" />
                    {isEng ? "⚡ 10-Second Chalkboard Shortcut (Exam-Winner Shortcut):" : "⚡ 10-सेकंड ब्लैकबोर्ड शॉर्टकट (Exam-Winner Shortcut):"}
                  </span>
                  <p className="text-xs sm:text-sm text-amber-950 font-bold leading-relaxed">
                    {(!isEng && activeQuestion.hindiShortcutTip) ? activeQuestion.hindiShortcutTip : activeQuestion.shortcutTip}
                  </p>
                  {!isEng && activeQuestion.hindiShortcutTip && (
                    <p className="text-[11px] text-amber-900 font-medium font-sans">
                      EN: {activeQuestion.shortcutTip}
                    </p>
                  )}
                </div>

                {/* The Time-Stealing Speed Trap Callout */}
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1.5 text-left">
                  <span className="text-xs font-mono font-black uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-700" />
                    {isEng ? "🚨 Time-Stealing Trap (Where 80% students waste minutes):" : "🚨 समय चुराने वाला ट्रैप (Where 80% students waste minutes):"}
                  </span>
                  <p className="text-xs sm:text-sm text-rose-900 font-medium leading-relaxed">
                    {(!isEng && activeQuestion.hindiSpeedTrap) ? activeQuestion.hindiSpeedTrap : activeQuestion.speedTrap}
                  </p>
                </div>

                {/* Complete Detailed Derivation */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 text-left">
                  <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                    {isEng ? "Standard Step-by-Step Derivation:" : "मानक चरणबद्ध हल (Step-by-Step Derivation):"}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                    {(!isEng && activeQuestion.hindiExplanation) ? activeQuestion.hindiExplanation : activeQuestion.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: 7-DAY BOARD SCORE BOOSTER PLAN */}
      {activeViewMode === "seven_day_booster" && (
        <div className="space-y-6">
          {/* Booster Overview Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-md">
                  {isEng ? "7-Day Micro-Drill Curriculum • 15 Mins Daily" : "7-Day Micro-Drill Curriculum • दैनिक 15 मिनट"}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {isEng
                    ? `7-Day Board Score Booster Plan (+${totalBoosterMarks} Marks Target)`
                    : `7-दिवसीय बोर्ड स्कोर बूस्टर प्लान (+${totalBoosterMarks} अंक लक्ष्य)`}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">
                    {isEng ? "Secured Marks" : "सुरक्षित अंक"}
                  </span>
                  <span className="text-base sm:text-lg font-black text-[#796AEF] font-mono">
                    +{completedMarksEarned} / +{totalBoosterMarks} Marks
                  </span>
                </div>
                <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-[#796AEF] h-full transition-all duration-500"
                    style={{
                      width: `${Math.round((completedMarksEarned / totalBoosterMarks) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 7-Day Day Selector Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {SEVEN_DAY_BOOSTER_PLAN.map((day) => {
                const isSelected = activeBoosterDayNumber === day.dayNumber;
                const isDone = completedBoosterDays.includes(day.dayNumber);

                return (
                  <button
                    key={day.dayNumber}
                    type="button"
                    onClick={() => setActiveBoosterDayNumber(day.dayNumber)}
                    className={`min-h-[72px] p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-indigo-50/80 border-[#796AEF] text-slate-900 shadow-sm ring-2 ring-[#796AEF]/30"
                        : isDone
                        ? "bg-emerald-50/70 border-emerald-300 text-slate-900"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-mono font-black">
                        Day {day.dayNumber}
                      </span>
                      {isDone && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-bold line-clamp-1">
                      {day.subject}
                    </div>
                    <div className="text-[9.5px] font-mono text-amber-700 font-bold">
                      +{day.targetMarks} Marks
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Day Detail Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6 text-left">
            {/* Active Day Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-md">
                    Day {activeBoosterDay.dayNumber} of 7 • {activeBoosterDay.subject}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md">
                    🎯 +{activeBoosterDay.targetMarks} {isEng ? "Board Marks Target" : "बोर्ड अंक वृद्धि"}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                    ⏱️ {isEng ? `Daily Time: ${activeBoosterDay.minutesBudget} mins` : `दैनिक समय: ${activeBoosterDay.minutesBudget} मिनट`}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {isEng ? activeBoosterDay.title : `${activeBoosterDay.hindiTitle} (${activeBoosterDay.title})`}
                </h3>
              </div>

              {/* Complete & Practice Buttons */}
              <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => toggleBoosterDayComplete(activeBoosterDay.dayNumber)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                    completedBoosterDays.includes(activeBoosterDay.dayNumber)
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {completedBoosterDays.includes(activeBoosterDay.dayNumber)
                      ? (isEng ? "Day Completed ✓" : "दिन पूर्ण चिह्नित ✓")
                      : (isEng ? "Mark as Done" : "पूर्ण चिह्नित करें")}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onDiscussWithCherry) {
                      onDiscussWithCherry({
                        topic: activeBoosterDay.title,
                        subject: activeBoosterDay.subject,
                        conceptTested: activeBoosterDay.title,
                        hint: (!isEng && activeBoosterDay.hindiHighYieldTrick) ? activeBoosterDay.hindiHighYieldTrick : activeBoosterDay.highYieldTrick,
                        question: activeBoosterDay.classroomPrompt
                      });
                    } else if (onEnterClassroom) {
                      onEnterClassroom();
                    }
                  }}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-[#796AEF] hover:bg-indigo-700 text-white text-xs font-black uppercase font-mono tracking-wider transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>{isEng ? `Sprint Day ${activeBoosterDay.dayNumber} with Cherry 🚀` : `मैम के साथ डे ${activeBoosterDay.dayNumber} स्प्रिंट करें 🚀`}</span>
                </button>
              </div>
            </div>

            {/* High-Yield Topics & Micro-Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Key Focus Sub-Topics */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#796AEF]" />
                  {isEng ? "Today's High-Yield Core Focus:" : "आज के मुख्य उच्च-भार वाले विषय (Core Focus):"}
                </span>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  {activeBoosterDay.keyTopics.map((topic, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-indigo-100 text-[#796AEF] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900">
                          {(!isEng && activeBoosterDay.hindiKeyTopics?.[idx]) ? activeBoosterDay.hindiKeyTopics[idx] : topic}
                        </span>
                        {!isEng && activeBoosterDay.hindiKeyTopics?.[idx] && (
                          <p className="text-[10.5px] text-slate-500 font-mono">
                            {topic}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: 15-Minute Daily Schedule */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  {isEng ? "15-Minute Time Budget Breakdown:" : "15 मिनट का सटीक टाइम-बजट (15-Min Breakdown):"}
                </span>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      {isEng ? "1. Rapid Formula & Law Recall" : "1. सूत्र व नियम त्वरित स्मरण (Recall)"}
                    </span>
                    <span className="font-mono text-amber-700 font-bold">
                      {isEng ? "5 mins" : "5 मिनट"}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      {isEng ? "2. 3 Rapid Board Questions Practice" : "2. 3 रैपिड बोर्ड प्रश्नों का अभ्यास"}
                    </span>
                    <span className="font-mono text-[#796AEF] font-bold">
                      {isEng ? "6 mins" : "6 मिनट"}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      {isEng ? "3. Chalkboard Doubt Clearing with Cherry" : "3. चेरी मैम के साथ संशय निवारण"}
                    </span>
                    <span className="font-mono text-emerald-700 font-bold">
                      {isEng ? "4 mins" : "4 मिनट"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 10-Second Golden Trick Callout */}
            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-300/80 rounded-2xl space-y-1.5 text-left">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-700" />
                {isEng
                  ? `⚡ Day ${activeBoosterDay.dayNumber} 10-Second Golden Trick (Exam-Winning Shortcut):`
                  : `⚡ डे ${activeBoosterDay.dayNumber} की 10-सेकंड गोल्डन ट्रिक (Exam-Winning Shortcut):`}
              </span>
              <p className="text-xs sm:text-sm text-amber-950 font-bold leading-relaxed">
                {(!isEng && activeBoosterDay.hindiHighYieldTrick) ? activeBoosterDay.hindiHighYieldTrick : activeBoosterDay.highYieldTrick}
              </p>
              {!isEng && activeBoosterDay.hindiHighYieldTrick && (
                <p className="text-[11px] text-amber-900 font-medium font-sans">
                  EN: {activeBoosterDay.highYieldTrick}
                </p>
              )}
            </div>

            {/* Common Diagnostic Trap */}
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1.5 text-left">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
                {isEng ? "🚨 Common Board Exam Trap (Where 80% lose marks):" : "🚨 सामान्य बोर्ड परीक्षा ट्रैप (Where 80% lose marks):"}
              </span>
              <p className="text-xs sm:text-sm text-rose-900 font-medium leading-relaxed">
                {(!isEng && activeBoosterDay.hindiDiagnosticTrap) ? activeBoosterDay.hindiDiagnosticTrap : activeBoosterDay.diagnosticTrap}
              </p>
              {!isEng && activeBoosterDay.hindiDiagnosticTrap && (
                <p className="text-[11px] text-rose-800 font-medium font-sans">
                  EN: {activeBoosterDay.diagnosticTrap}
                </p>
              )}
            </div>

            {/* Daily Practice Challenge Box */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2 text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#796AEF]" />
                {isEng ? `Day ${activeBoosterDay.dayNumber} Rapid Drill Challenge:` : `डे ${activeBoosterDay.dayNumber} का रैपिड ड्रिल चैलेंज:`}
              </span>
              <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
                {activeBoosterDay.drillQuestion}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Educational Pedagogical Rationale */}
      <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl flex items-start gap-3.5 text-left text-slate-600 text-xs leading-relaxed">
        <Award className="w-5 h-5 text-[#796AEF] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold text-slate-900 block uppercase tracking-wider text-[10px]">
            {isEng ? "Scientific Importance of Time Pacing & 7-Day Score Booster:" : "टाइम-पेसिंग व 7-दिवसीय स्कोर बूस्टर की वैज्ञानिक महत्ता:"}
          </span>
          <p>
            {isEng
              ? "In board exams, high scores stem not merely from studying more hours, but from disciplined time management and exam shortcuts. Spending just 15 minutes daily on high-yield focused drills ensures you stay panic-free in the exam hall and easily bank a 25+ minute buffer to thoroughly review your entire answer sheet."
              : "बोर्ड परीक्षा में अच्छे अंक केवल अधिक पढ़ाई से नहीं, बल्कि समय के सही प्रबंधन और शॉर्टकट ट्रिक्स से आते हैं। प्रतिदिन केवल 15 मिनट उच्च-भार वाले विषयों पर केंद्रित अभ्यास करने से आप परीक्षा हॉल में पैनिक-फ्री रहते हैं और पूरे प्रश्नपत्र की जाँच के लिए 25+ मिनट का बफ़र समय आसानी से बचा लेते हैं।"}
          </p>
        </div>
      </div>
    </div>
  );
};
