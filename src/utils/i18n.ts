// Core i18n Translation Engine for Cherry AI Classroom
// Supported Languages: English, Hinglish (Latin/English UI script), Hindi (हिन्दी), Bengali (বাংলা), Odisha (ଓଡ଼ିଆ), Marathi (मराठी)

export type SupportedLanguage = "English" | "Hinglish" | "Hindi" | "Bengali" | "Odisha" | "Marathi";

export interface TranslationDictionary {
  // Navigation & Bottom Bar
  navClassroom: string;
  navSyllabus: string;
  navLab: string;
  navBattle: string;
  navAccount: string;
  navSpeed: string;
  navPyq: string;

  // Header & Controls
  liveSession: string;
  connecting: string;
  startClass: string;
  endClass: string;
  reconnect: string;
  micMuted: string;
  micLive: string;
  whiteboardNotes: string;
  downloadNotes: string;
  themeSelect: string;
  clearBoard: string;
  quickDoubt: string;
  voiceSyncActive: string;
  voiceSyncInactive: string;

  // Teaching Phases
  phaseIntro: string;
  phaseConcept: string;
  phaseExample: string;
  phaseDoubt: string;
  phaseTransition: string;

  // Quick Doubt Widget
  askDoubtTitle: string;
  askDoubtSubtitle: string;
  doubtPlaceholder: string;
  doubtSentTitle: string;
  doubtSentSubtitle: string;
  quickSuggestions: string;
  pressEnterToSend: string;
  nonInterruptingVoice: string;
  closeBtn: string;
  sendBtn: string;

  // Common Actions
  skip: string;
  next: string;
  getStarted: string;
  submit: string;
  cancel: string;
  save: string;
  done: string;
  back: string;
  loading: string;

  // Walkthrough Slides
  walkthrough1Title: string;
  walkthrough1Subtitle: string;
  walkthrough2Title: string;
  walkthrough2Subtitle: string;
  walkthrough3Title: string;
  walkthrough3Subtitle: string;

  // Student Enrollment & Onboarding
  enrollmentStepHeader: string;
  freeBadge: string;
  createProfileTitle: string;
  enrollmentSubtitle: string;
  studentNameLabel: string;
  pickAvatar: string;
  namePlaceholder: string;
  targetClassLabel: string;
  eduBoardLabel: string;
  languageLabel: string;
  enterStudyDesk: string;
  enterNamePrompt: string;
  savingProfile: string;
  trustBadge: string;

  // Learner Profile & Hub
  totalStudyTime: string;
  sessionsCompleted: string;
  parkedConcepts: string;
  preferredDialect: string;
  learnerProfileTitle: string;
  learnerProfileSubtitle: string;
  profileHubTitle: string;
  profileHubSubtitle: string;
  tabParkedConcepts: string;
  tabProActive: string;
  tabUpiPro: string;
  tabReferEarn: string;
  tabTopicHistory: string;
  tabPrivacy: string;
  tabSettings: string;
  profileTab: string;
  kiaraTab: string;
  performanceTab: string;
  booksTab: string;

  // Phase 3: Syllabus Desk, STEM Lab & Quiz / Battle Arena
  studyDeskTitle: string;
  welcomeBannerGreeting: string;
  welcomeBannerDesc: string;
  chooseSubjectHeader: string;
  changeBtn: string;
  learningModeHeader: string;
  modeGuide: string;
  modeExplainer: string;
  modeMistake: string;
  modeDoubt: string;
  modeHWMaker: string;
  modeCheatSheet: string;
  modePYQ: string;
  directStudyBtn: string;
  uploadNotesTitle: string;
  uploadNotesDesc: string;
  openBlackboardVoice: string;
  openBlackboardVoiceDesc: string;
  typeTopicTitle: string;
  typeTopicDesc: string;
  startClassBtn: string;
  deskSelectSubject: string;
  deskPasteYouTube: string;
  deskImportYT: string;
  deskYTConnected: string;
  deskTopicModalTitle: string;
  deskTopicModalSubtitle: string;
  deskDirectStudyVoice: string;
  deskVoiceFastest: string;
  deskVoiceDesc: string;
  deskDirectStudyType: string;
  deskTypeDesc: string;
  deskTopicInputTitle: string;
  deskTopicInputSubtitle: string;
  deskBack: string;
  deskStartLecture: string;

  // STEM Lab Studio
  virtualLabTitle: string;
  virtualLabSubtitle: string;
  tabReadyLabs: string;
  tabCustomLabs: string;
  filterAll: string;
  filterPhysics: string;
  filterChemistry: string;
  filterBiology: string;
  filterMath: string;
  experimentControls: string;
  interactiveSimulation: string;
  resetParams: string;
  playSim: string;
  pauseSim: string;
  cherryObservations: string;
  labManual: string;
  openInClassroom: string;

  // Quiz & Battle Arena
  quizArenaTitle: string;
  quizArenaSubtitle: string;
  startQuizBtn: string;
  questionsLabel: string;
  difficultyLabel: string;
  levelBoard: string;
  levelCompetition: string;
  questionTimer: string;
  submitAnswer: string;
  nextQuestion: string;
  viewResults: string;
  quizScore: string;
  battleArenaTitle: string;
  createBattleRoom: string;
  joinBattleRoom: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  English: {
    navClassroom: "Classroom",
    navSyllabus: "Syllabus",
    navLab: "STEM Lab",
    navBattle: "Battle Arena",
    navAccount: "My Hub",
    navSpeed: "Speed Sprint",
    navPyq: "PYQ Radar",

    liveSession: "Live AI Class",
    connecting: "Connecting...",
    startClass: "Start Class",
    endClass: "End Class",
    reconnect: "Reconnect",
    micMuted: "Mic Muted",
    micLive: "Mic On",
    whiteboardNotes: "Blackboard Notes",
    downloadNotes: "Save PDF",
    themeSelect: "Theme",
    clearBoard: "Clear Board",
    quickDoubt: "Ask Doubt",
    voiceSyncActive: "Live Voice Active",
    voiceSyncInactive: "Live Voice Standby",

    phaseIntro: "1. Intro Story",
    phaseConcept: "2. Deep Concept",
    phaseExample: "3. Solved Example",
    phaseDoubt: "4. Clear Doubt",
    phaseTransition: "5. Next Topic",

    askDoubtTitle: "Instant Doubt",
    askDoubtSubtitle: "Ask Cherry Ma'am live without pause",
    doubtPlaceholder: "Type your question or doubt here...",
    doubtSentTitle: "Doubt Sent to Cherry Ma'am!",
    doubtSentSubtitle: "She will address it seamlessly in her flow.",
    quickSuggestions: "Quick Suggestions:",
    pressEnterToSend: "Press Enter to send",
    nonInterruptingVoice: "⚡ Non-interrupting voice",
    closeBtn: "Close",
    sendBtn: "Send",

    skip: "SKIP",
    next: "NEXT",
    getStarted: "GET STARTED",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    done: "Done",
    back: "Back",
    loading: "Loading...",

    walkthrough1Title: "Live 1-on-1 AI Teacher",
    walkthrough1Subtitle: "Ask doubts naturally with real-time voice and live blackboard steps.",
    walkthrough2Title: "Interactive Virtual Lab",
    walkthrough2Subtitle: "Visualize Physics, Chemistry & Math in 60 FPS with real-time interactive sliders.",
    walkthrough3Title: "Smart PYQs & Blindspot Radar",
    walkthrough3Subtitle: "Spot hidden concept gaps and practice 10-year board exam patterns effortlessly.",

    enrollmentStepHeader: "Step 3 • Student Enrollment",
    freeBadge: "100% Free",
    createProfileTitle: "Create Your Student Profile",
    enrollmentSubtitle: "Cherry Ma'am will personalize your lessons & doubt explanations!",
    studentNameLabel: "Student Name",
    pickAvatar: "Pick Avatar",
    namePlaceholder: "E.g., Nehal Sharma",
    targetClassLabel: "Target Class / Grade",
    eduBoardLabel: "Edu Board",
    languageLabel: "Language / Medium",
    enterStudyDesk: "Enter Study Desk • Start 🎒",
    enterNamePrompt: "Please enter your name to unlock Study Desk",
    savingProfile: "Saving Profile...",
    trustBadge: "100% Free • Powered by Socratic AI Classroom",

    totalStudyTime: "Total Study Time",
    sessionsCompleted: "Sessions Completed",
    parkedConcepts: "Parked Concepts",
    preferredDialect: "Preferred Language",
    learnerProfileTitle: "Learner Memory & Progress Hub",
    learnerProfileSubtitle: "Cross-session learning analytics, weak topic tracking & data privacy control",
    profileHubTitle: "Learner Memory & Progress Hub",
    profileHubSubtitle: "Cross-session learning analytics, weak topic tracking & data privacy control",
    tabParkedConcepts: "Parked Concepts & Weak Topics",
    tabProActive: "Pro Active",
    tabUpiPro: "UPI Pro Plans",
    tabReferEarn: "Refer & Earn (5-Level)",
    tabTopicHistory: "Topic Mastery History",
    tabPrivacy: "DPDP Privacy & Minor Data",
    tabSettings: "Learner Profile Settings",
    profileTab: "Profile",
    kiaraTab: "Kiara AI Counselor",
    performanceTab: "Performance Analytics",
    booksTab: "Study Handbooks",

    // Phase 3: Syllabus Desk, STEM Lab & Quiz / Battle Arena
    studyDeskTitle: "Study Desk",
    welcomeBannerGreeting: "Namaste",
    welcomeBannerDesc: "Welcome to your interactive study room! Choose a subject, upload homework notes or start a direct class below.",
    chooseSubjectHeader: "Personalized Subjects",
    changeBtn: "Change ✏️",
    learningModeHeader: "Learning Mode",
    modeGuide: "Guide",
    modeExplainer: "Explainer",
    modeMistake: "Mistake",
    modeDoubt: "Doubt",
    modeHWMaker: "HW Maker",
    modeCheatSheet: "Visual Cheat Sheet",
    modePYQ: "PYQ Intelligence",
    directStudyBtn: "Direct Study: Live Blackboard 🖊️🎨",
    uploadNotesTitle: "Upload Course Syllabus notes or PDF chapter",
    uploadNotesDesc: "Drag PDF, PNG, JPG files here or tap to select. Max size 25MB.",
    openBlackboardVoice: "Open Blackboard (Voice Direct)",
    openBlackboardVoiceDesc: "Go straight to the live chalkboard without typing. Cherry Ma'am will ask you by voice and illustrate concepts step by step!",
    typeTopicTitle: "Type Topic Name (Custom Notes)",
    typeTopicDesc: "Type any topic you want to learn today (e.g. Newton's Laws, Trigonometry). Cherry Ma'am will generate structured slides and notes.",
    startClassBtn: "Start Class",
    deskSelectSubject: "Choose Subject",
    deskPasteYouTube: "Paste YouTube lecture link...",
    deskImportYT: "Convert to Slides",
    deskYTConnected: "Video Linked",
    deskTopicModalTitle: "Choose Study Mode",
    deskTopicModalSubtitle: "Pick your preferred learning method to start interactive chalkboard learning.",
    deskDirectStudyVoice: "Live Voice 1-on-1 (Instant Blackboard)",
    deskVoiceFastest: "⚡ Fastest • Instant",
    deskVoiceDesc: "Talk directly with Cherry Ma'am in real-time. Just speak your doubt, and she will draw and solve every step on the chalkboard.",
    deskDirectStudyType: "Type Topic or Chapter Name",
    deskTypeDesc: "Enter any concept, formula, or chapter you want to master. Cherry Ma'am will prepare structured chalkboard slides and teach you.",
    deskTopicInputTitle: "Type Any Topic or Concept",
    deskTopicInputSubtitle: "Enter the topic name (e.g., Newton's Laws, Quadratic Equations, Photosynthesis) to start learning.",
    deskBack: "Back",
    deskStartLecture: "Start Blackboard Class",

    // STEM Lab Studio
    virtualLabTitle: "STEM Virtual Lab Studio",
    virtualLabSubtitle: "Interactive Physics, Chemistry, Biology & Math simulations with real-time parameter tweaking.",
    tabReadyLabs: "Ready Experiments",
    tabCustomLabs: "AI Lab Generator",
    filterAll: "All",
    filterPhysics: "Physics",
    filterChemistry: "Chemistry",
    filterBiology: "Biology",
    filterMath: "Math",
    experimentControls: "Parameters & Sliders",
    interactiveSimulation: "Interactive Simulation",
    resetParams: "Reset",
    playSim: "Play",
    pauseSim: "Pause",
    cherryObservations: "Teacher's Observations",
    labManual: "Lab Manual & Theory",
    openInClassroom: "Explain in Live Classroom 🎙️",

    // Quiz & Battle Arena
    quizArenaTitle: "Interactive Quiz Arena",
    quizArenaSubtitle: "Test your mastery with AI-generated board & competition style questions.",
    startQuizBtn: "Start Quiz",
    questionsLabel: "Questions",
    difficultyLabel: "Difficulty",
    levelBoard: "Board Level",
    levelCompetition: "JEE / NEET Level",
    questionTimer: "Time Left",
    submitAnswer: "Submit Answer",
    nextQuestion: "Next Question",
    viewResults: "View Score & Analysis",
    quizScore: "Your Score",
    battleArenaTitle: "1v1 Battle Arena",
    createBattleRoom: "Create Battle Room",
    joinBattleRoom: "Join Battle Room",
  },

  // Hinglish uses clean English UI script as per user instruction
  Hinglish: {
    navClassroom: "Classroom",
    navSyllabus: "Syllabus",
    navLab: "STEM Lab",
    navBattle: "Battle Arena",
    navAccount: "My Hub",
    navSpeed: "Speed Sprint",
    navPyq: "PYQ Radar",

    liveSession: "Live AI Class",
    connecting: "Connecting...",
    startClass: "Start Class",
    endClass: "End Class",
    reconnect: "Reconnect",
    micMuted: "Mic Muted",
    micLive: "Mic On",
    whiteboardNotes: "Blackboard Notes",
    downloadNotes: "Save PDF",
    themeSelect: "Theme",
    clearBoard: "Clear Board",
    quickDoubt: "Ask Doubt",
    voiceSyncActive: "Live Voice Active",
    voiceSyncInactive: "Live Voice Standby",

    phaseIntro: "1. Intro Story",
    phaseConcept: "2. Deep Concept",
    phaseExample: "3. Solved Example",
    phaseDoubt: "4. Clear Doubt",
    phaseTransition: "5. Next Topic",

    askDoubtTitle: "Instant Doubt",
    askDoubtSubtitle: "Ask Cherry Ma'am live without pause",
    doubtPlaceholder: "Type your question or doubt here...",
    doubtSentTitle: "Doubt Sent to Cherry Ma'am!",
    doubtSentSubtitle: "She will address it seamlessly in her flow.",
    quickSuggestions: "Quick Suggestions:",
    pressEnterToSend: "Press Enter to send",
    nonInterruptingVoice: "⚡ Non-interrupting voice",
    closeBtn: "Close",
    sendBtn: "Send",

    skip: "SKIP",
    next: "NEXT",
    getStarted: "GET STARTED",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    done: "Done",
    back: "Back",
    loading: "Loading...",

    walkthrough1Title: "Live 1-on-1 AI Teacher",
    walkthrough1Subtitle: "Ask doubts naturally in Hinglish with real-time voice and live blackboard steps.",
    walkthrough2Title: "Interactive Virtual Lab",
    walkthrough2Subtitle: "Visualize Physics, Chemistry & Math in 60 FPS with real-time interactive sliders.",
    walkthrough3Title: "Smart PYQs & Blindspot Radar",
    walkthrough3Subtitle: "Spot hidden concept gaps and practice 10-year board exam patterns effortlessly.",

    enrollmentStepHeader: "Step 3 • Student Enrollment",
    freeBadge: "100% Free",
    createProfileTitle: "Create Your Student Profile",
    enrollmentSubtitle: "Cherry Ma'am will personalize your lessons & doubt explanations!",
    studentNameLabel: "Student Name",
    pickAvatar: "Pick Avatar",
    namePlaceholder: "E.g., Nehal Sharma",
    targetClassLabel: "Target Class / Grade",
    eduBoardLabel: "Edu Board",
    languageLabel: "Language / Medium",
    enterStudyDesk: "Enter Study Desk • Start 🎒",
    enterNamePrompt: "Please enter your name to unlock Study Desk",
    savingProfile: "Saving Profile...",
    trustBadge: "100% Free • Powered by Socratic AI Classroom",

    totalStudyTime: "Total Study Time",
    sessionsCompleted: "Sessions Completed",
    parkedConcepts: "Parked Concepts",
    preferredDialect: "Preferred Language",
    learnerProfileTitle: "Learner Memory & Progress Hub",
    learnerProfileSubtitle: "Cross-session learning analytics, weak topic tracking & data privacy control",
    profileHubTitle: "Learner Memory & Progress Hub",
    profileHubSubtitle: "Cross-session learning analytics, weak topic tracking & data privacy control",
    tabParkedConcepts: "Parked Concepts & Weak Topics",
    tabProActive: "Pro Active",
    tabUpiPro: "UPI Pro Plans",
    tabReferEarn: "Refer & Earn (5-Level)",
    tabTopicHistory: "Topic Mastery History",
    tabPrivacy: "DPDP Privacy & Minor Data",
    tabSettings: "Learner Profile Settings",
    profileTab: "Profile",
    kiaraTab: "Kiara AI Counselor",
    performanceTab: "Performance Analytics",
    booksTab: "Study Handbooks",

    // Phase 3: Syllabus Desk, STEM Lab & Quiz / Battle Arena
    studyDeskTitle: "Study Desk",
    welcomeBannerGreeting: "Namaste",
    welcomeBannerDesc: "Welcome to your interactive study room! Choose a subject, upload homework notes or start a direct class below.",
    chooseSubjectHeader: "Personalized Subjects",
    changeBtn: "Change ✏️",
    learningModeHeader: "Learning Mode",
    modeGuide: "Guide",
    modeExplainer: "Explainer",
    modeMistake: "Mistake",
    modeDoubt: "Doubt",
    modeHWMaker: "HW Maker",
    modeCheatSheet: "Visual Cheat Sheet",
    modePYQ: "PYQ Intelligence",
    directStudyBtn: "Direct Study: Live Blackboard 🖊️🎨",
    uploadNotesTitle: "Upload Course Syllabus notes or PDF chapter",
    uploadNotesDesc: "Drag PDF, PNG, JPG files here or tap to select. Max size 25MB.",
    openBlackboardVoice: "Open Blackboard (Voice Direct)",
    openBlackboardVoiceDesc: "Go straight to the live chalkboard without typing. Cherry Ma'am will ask you by voice and illustrate concepts step by step!",
    typeTopicTitle: "Type Topic Name (Custom Notes)",
    typeTopicDesc: "Type any topic you want to learn today (e.g. Newton's Laws, Trigonometry). Cherry Ma'am will generate structured slides and notes.",
    startClassBtn: "Start Class",
    deskSelectSubject: "Choose Subject",
    deskPasteYouTube: "YouTube lecture link paste karein...",
    deskImportYT: "Convert to Slides",
    deskYTConnected: "Video Linked",
    deskTopicModalTitle: "Choose Study Mode",
    deskTopicModalSubtitle: "Apna preferred learning style select karein aur interactive chalkboard class shuru karein.",
    deskDirectStudyVoice: "Live Voice 1-on-1 (Instant Blackboard)",
    deskVoiceFastest: "⚡ Fastest • Instant",
    deskVoiceDesc: "Cherry Ma'am ke sath real-time voice me baat karein. Apna topic ya doubt bol kar poochhein, wo blackboard par step-by-step sikhayengi.",
    deskDirectStudyType: "Type Topic or Chapter Name",
    deskTypeDesc: "Koi bhi topic, chapter ya formula likhein. Cherry Ma'am structured notes aur board steps banakar padhayengi.",
    deskTopicInputTitle: "Type Any Topic or Concept",
    deskTopicInputSubtitle: "Apna topic name likhein (jaise Newton's Laws, Trigonometry, Fractions) aur class shuru karein.",
    deskBack: "Back",
    deskStartLecture: "Start Blackboard Class",

    // STEM Lab Studio
    virtualLabTitle: "STEM Virtual Lab Studio",
    virtualLabSubtitle: "Interactive Physics, Chemistry, Biology & Math simulations with real-time parameter tweaking.",
    tabReadyLabs: "Ready Experiments",
    tabCustomLabs: "AI Lab Generator",
    filterAll: "All",
    filterPhysics: "Physics",
    filterChemistry: "Chemistry",
    filterBiology: "Biology",
    filterMath: "Math",
    experimentControls: "Parameters & Sliders",
    interactiveSimulation: "Interactive Simulation",
    resetParams: "Reset",
    playSim: "Play",
    pauseSim: "Pause",
    cherryObservations: "Teacher's Observations",
    labManual: "Lab Manual & Theory",
    openInClassroom: "Explain in Live Classroom 🎙️",

    // Quiz & Battle Arena
    quizArenaTitle: "Interactive Quiz Arena",
    quizArenaSubtitle: "Test your mastery with AI-generated board & competition style questions.",
    startQuizBtn: "Start Quiz",
    questionsLabel: "Questions",
    difficultyLabel: "Difficulty",
    levelBoard: "Board Level",
    levelCompetition: "JEE / NEET Level",
    questionTimer: "Time Left",
    submitAnswer: "Submit Answer",
    nextQuestion: "Next Question",
    viewResults: "View Score & Analysis",
    quizScore: "Your Score",
    battleArenaTitle: "1v1 Battle Arena",
    createBattleRoom: "Create Battle Room",
    joinBattleRoom: "Join Battle Room",
  },

  Hindi: {
    navClassroom: "कक्षा (Class)",
    navSyllabus: "पाठ्यक्रम",
    navLab: "वर्चुअल लैब",
    navBattle: "क्विज़ अखाड़ा",
    navAccount: "मेरी प्रोफाइल",
    navSpeed: "स्पीड स्प्रिंट",
    navPyq: "PYQ रडार",

    liveSession: "लाइव AI क्लास",
    connecting: "जुड़ रहे हैं...",
    startClass: "क्लास शुरू करें",
    endClass: "क्लास समाप्त करें",
    reconnect: "पुनः कनेक्ट करें",
    micMuted: "माइक म्यूट",
    micLive: "माइक चालू",
    whiteboardNotes: "ब्लैकबोर्ड नोट्स",
    downloadNotes: "PDF सेव करें",
    themeSelect: "थीम",
    clearBoard: "बोर्ड साफ करें",
    quickDoubt: "शंका पूछें",
    voiceSyncActive: "लाइव वॉयस सक्रिय",
    voiceSyncInactive: "लाइव वॉयस स्टैंडबाय",

    phaseIntro: "1. परिचय कथा",
    phaseConcept: "2. मुख्य सिद्धांत",
    phaseExample: "3. हल उदाहरण",
    phaseDoubt: "4. शंका निवारण",
    phaseTransition: "5. अगला विषय",

    askDoubtTitle: "तुरंत शंका पूछें",
    askDoubtSubtitle: "चेरी मैम से बिना रुके सवाल पूछें",
    doubtPlaceholder: "अपना प्रश्न या शंका यहाँ लिखें...",
    doubtSentTitle: "शंका चेरी मैम को भेज दी गई!",
    doubtSentSubtitle: "वे अपने प्रवाह में इसका तुरंत उत्तर देंगी।",
    quickSuggestions: "त्वरित सुझाव:",
    pressEnterToSend: "भेजने के लिए Enter दबाएं",
    nonInterruptingVoice: "⚡ शांत वॉयस सिंक",
    closeBtn: "बंद करें",
    sendBtn: "भेजें",

    skip: "छोड़ें (SKIP)",
    next: "आगे (NEXT)",
    getStarted: "शुरू करें",
    submit: "सबमिट करें",
    cancel: "रद्द करें",
    save: "सेव करें",
    done: "पूर्ण",
    back: "पीछे",
    loading: "लोड हो रहा है...",

    walkthrough1Title: "लाइव 1-ऑन-1 AI शिक्षक",
    walkthrough1Subtitle: "रियल-टाइम आवाज़ और लाइव ब्लैकबोर्ड के साथ सहजता से अपनी शंकाएं पूछें।",
    walkthrough2Title: "इंटरैक्टिव वर्चुअल लैब",
    walkthrough2Subtitle: "60 FPS में फिजिक्स, केमिस्ट्री और गणित को रियल-टाइम स्लाइडर्स के साथ समझें।",
    walkthrough3Title: "स्मार्ट PYQ और रडार",
    walkthrough3Subtitle: "छिपे हुए कॉन्सेप्ट गैप्स को पहचानें और 10 साल के बोर्ड पैटर्न का अभ्यास करें।",

    enrollmentStepHeader: "चरण 3 • विद्यार्थी पंजीकरण",
    freeBadge: "100% निःशुल्क",
    createProfileTitle: "अपनी छात्र प्रोफाइल बनाएं",
    enrollmentSubtitle: "चेरी मैम आपके अनुसार पाठ और शंका निवारण को अनुकूलित करेंगी!",
    studentNameLabel: "विद्यार्थी का नाम",
    pickAvatar: "अवतार चुनें",
    namePlaceholder: "उदा., नेहा शर्मा",
    targetClassLabel: "कक्षा / ग्रेड चुनें",
    eduBoardLabel: "शिक्षा बोर्ड",
    languageLabel: "पढ़ाने की भाषा",
    enterStudyDesk: "स्टडी डेस्क में प्रवेश करें 🎒",
    enterNamePrompt: "स्टडी डेस्क खोलने के लिए कृपया अपना नाम दर्ज करें",
    savingProfile: "प्रोफाइल सहेजी जा रही है...",
    trustBadge: "100% निःशुल्क • सॉक्रेटिक AI क्लासरूम",

    totalStudyTime: "कुल अध्ययन समय",
    sessionsCompleted: "सत्र पूर्ण किए",
    parkedConcepts: "अधूरी शंकाएं",
    preferredDialect: "पसंदीदा भाषा",
    learnerProfileTitle: "शिक्षार्थी मेमोरी और प्रगति हब",
    learnerProfileSubtitle: "सत्र-वार लर्निंग एनालिटिक्स, कमजोर विषय ट्रैकिंग एवं डेटा प्राइवेसी",
    profileHubTitle: "शिक्षार्थी मेमोरी और प्रगति हब",
    profileHubSubtitle: "सत्र-वार लर्निंग एनालिटिक्स, कमजोर विषय ट्रैकिंग एवं डेटा प्राइवेसी",
    tabParkedConcepts: "पेंडिंग शंकाएं व कमजोर विषय",
    tabProActive: "प्रो सक्रिय",
    tabUpiPro: "UPI प्रो प्लान",
    tabReferEarn: "रेफर करें और कमाएं (5-लेवल)",
    tabTopicHistory: "विषय महारत इतिहास",
    tabPrivacy: "DPDP प्राइवेसी व डेटा सुरक्षा",
    tabSettings: "शिक्षार्थी प्रोफाइल सेटिंग्स",
    profileTab: "प्रोफाइल",
    kiaraTab: "किआरा AI काउंसलर",
    performanceTab: "परफॉर्मेंस एनालिटिक्स",
    booksTab: "स्टडी हैंडबुक्स",

    // Phase 3: Syllabus Desk, STEM Lab & Quiz / Battle Arena
    studyDeskTitle: "स्टडी डेस्क",
    welcomeBannerGreeting: "नमस्ते",
    welcomeBannerDesc: "आपके इंटरैक्टिव स्टडी रूम में आपका स्वागत है! नीचे कोई विषय चुनें, नोट्स अपलोड करें या सीधी क्लास शुरू करें।",
    chooseSubjectHeader: "अनुकूलित विषय",
    changeBtn: "बदलें ✏️",
    learningModeHeader: "सीखने का मोड",
    modeGuide: "गाइड (Guide)",
    modeExplainer: "व्याख्या (Explainer)",
    modeMistake: "गलती खोजें (Mistake)",
    modeDoubt: "शंका (Doubt)",
    modeHWMaker: "गृहकार्य (HW Maker)",
    modeCheatSheet: "विज़ुअल चीट शीट",
    modePYQ: "PYQ इंटेलिजेंस",
    directStudyBtn: "सीधा अध्ययन: लाइव ब्लैकबोर्ड 🖊️🎨",
    uploadNotesTitle: "सिलेबस नोट्स या PDF चैप्टर अपलोड करें",
    uploadNotesDesc: "PDF, PNG, JPG फाइल यहाँ खींचें या चुनने के लिए टैप करें।",
    openBlackboardVoice: "ओपन ब्लैकबोर्ड (सीधी वॉयस क्लास)",
    openBlackboardVoiceDesc: "बिना कुछ टाइप किए सीधे ब्लैकबोर्ड पर जाएं। चेरी मैम आपसे पूछेंगी और हर स्टेप बोर्ड पर समझाएंगी!",
    typeTopicTitle: "विषय का नाम लिखें (कस्टम नोट्स)",
    typeTopicDesc: "कोई भी पसंदीदा टॉपिक लिखें (उदा. न्यूटन के नियम, त्रिकोणमिति)। चेरी मैम नोट्स तैयार करेंगी।",
    startClassBtn: "क्लास शुरू करें",
    deskSelectSubject: "विषय चुनें",
    deskPasteYouTube: "YouTube लेक्चर लिंक पेस्ट करें...",
    deskImportYT: "स्लाइड्स में बदलें",
    deskYTConnected: "वीडियो कनेक्टेड",
    deskTopicModalTitle: "अध्ययन का तरीका चुनें",
    deskTopicModalSubtitle: "अपनी पसंद का तरीका चुनें और इंटरैक्टिव ब्लैकबोर्ड क्लास तुरंत शुरू करें।",
    deskDirectStudyVoice: "लाइव वॉयस 1-ऑन-1 (सीधा ब्लैकबोर्ड)",
    deskVoiceFastest: "⚡ सबसे तेज़ • तुरंत",
    deskVoiceDesc: "चेरी मैम से सीधे बोलकर बात करें। अपना टॉपिक या डाउट बताएं, वे ब्लैकबोर्ड पर हर स्टेप ड्रा करके सिखाएंगी।",
    deskDirectStudyType: "टॉपिक या चैप्टर का नाम लिखें",
    deskTypeDesc: "जो भी टॉपिक या फॉर्मूला पढ़ना चाहते हैं लिखें। चेरी मैम व्यवस्थित ब्लैकबोर्ड नोट्स तैयार करेंगी।",
    deskTopicInputTitle: "टॉपिक या कॉन्सेप्ट लिखें",
    deskTopicInputSubtitle: "टॉपिक का नाम लिखें (उदा. न्यूटन के नियम, त्रिकोणमिति, प्रकाश संश्लेषण) और क्लास शुरू करें।",
    deskBack: "वापस जाएं",
    deskStartLecture: "ब्लैकबोर्ड क्लास शुरू करें",

    // STEM Lab Studio
    virtualLabTitle: "STEM वर्चुअल लैब स्टूडियो",
    virtualLabSubtitle: "फिजिक्स, केमिस्ट्री, बायोलॉजी और गणित के इंटरैक्टिव सिमुलेशन रियल-टाइम स्लाइडर्स के साथ।",
    tabReadyLabs: "तैयार प्रयोग",
    tabCustomLabs: "AI लैब जनरेटर",
    filterAll: "सभी",
    filterPhysics: "भौतिकी",
    filterChemistry: "रसायन",
    filterBiology: "जीव विज्ञान",
    filterMath: "गणित",
    experimentControls: "पैरामीटर्स और स्लाइडर्स",
    interactiveSimulation: "इंटरैक्टिव सिमुलेशन",
    resetParams: "रीसेट करें",
    playSim: "प्ले करें",
    pauseSim: "रोकें",
    cherryObservations: "शिक्षक के मुख्य निष्कर्ष",
    labManual: "लैब नियमावली और सिद्धांत",
    openInClassroom: "लाइव क्लासरूम में समझें 🎙️",

    // Quiz & Battle Arena
    quizArenaTitle: "इंटरैक्टिव क्विज़ अखाड़ा",
    quizArenaSubtitle: "AI द्वारा तैयार किए गए बोर्ड व प्रतियोगी प्रश्नों के साथ अपने ज्ञान को परखें।",
    startQuizBtn: "क्विज़ शुरू करें",
    questionsLabel: "प्रश्न",
    difficultyLabel: "कठिनाई स्तर",
    levelBoard: "बोर्ड स्तर",
    levelCompetition: "JEE / NEET स्तर",
    questionTimer: "शेष समय",
    submitAnswer: "उत्तर सबमिट करें",
    nextQuestion: "अगला प्रश्न",
    viewResults: "स्कोर व विश्लेषण देखें",
    quizScore: "आपका स्कोर",
    battleArenaTitle: "1v1 बैटल अखाड़ा",
    createBattleRoom: "बैटल रूम बनाएं",
    joinBattleRoom: "बैटल रूम से जुड़ें",
  },

  Bengali: {
    navClassroom: "শ্রেণিকক্ষ",
    navSyllabus: "পাঠ্যক্রম",
    navLab: "ল্যাব স্টুডিও",
    navBattle: "কুইজ আখড়া",
    navAccount: "আমার হাব",
    navSpeed: "স্পিড স্প্রিন্ট",
    navPyq: "PYQ রাডার",

    liveSession: "লাইভ AI ক্লাস",
    connecting: "সংযুক্ত হচ্ছে...",
    startClass: "ক্লাস শুরু করুন",
    endClass: "ক্লাস শেষ করুন",
    reconnect: "পুনঃসংযোগ",
    micMuted: "মাইক বন্ধ",
    micLive: "মাইক চালু",
    whiteboardNotes: "ব্ল্যাকবোর্ড নোট",
    downloadNotes: "PDF সংরক্ষণ",
    themeSelect: "থিম",
    clearBoard: "বোর্ড পরিষ্কার",
    quickDoubt: "প্রশ্ন করুন",
    voiceSyncActive: "লাইভ ভয়েস সক্রিয়",
    voiceSyncInactive: "লাইভ ভয়েস স্ট্যান্ডবাই",

    phaseIntro: "১. সূচনা গল্প",
    phaseConcept: "২. মূল ধারণা",
    phaseExample: "৩. সমাধান উদাহরণ",
    phaseDoubt: "৪. সংশয় দূরীকরণ",
    phaseTransition: "৫. পরবর্তী পাঠ",

    askDoubtTitle: "দ্রুত সংশয় জিজ্ঞাসা",
    askDoubtSubtitle: "চেরি ম্যামকে সরাসরি প্রশ্ন করুন",
    doubtPlaceholder: "আপনার প্রশ্ন বা সংশয় এখানে লিখুন...",
    doubtSentTitle: "প্রশ্ন চেরি ম্যামের কাছে পাঠানো হয়েছে!",
    doubtSentSubtitle: "তিনি ক্লাসের প্রবাহে এর উত্তর দেবেন।",
    quickSuggestions: "দ্রুত পরামর্শ:",
    pressEnterToSend: "পাঠাতে Enter টিপুন",
    nonInterruptingVoice: "⚡ দ্রুত ভয়েস সিঙ্ক",
    closeBtn: "বন্ধ করুন",
    sendBtn: "পাঠান",

    skip: "এড়িয়ে যান",
    next: "পরবর্তী",
    getStarted: "শুরু করুন",
    submit: "জমা দিন",
    cancel: "বাতিল",
    save: "সংরক্ষণ",
    done: "সম্পন্ন",
    back: "ফিরে যান",
    loading: "লোড হচ্ছে...",

    walkthrough1Title: "লাইভ ১-অন-১ AI শিক্ষক",
    walkthrough1Subtitle: "রিয়েল-টাইম ভয়েস ও লাইভ ব্ল্যাকবোর্ডের সাহায্যে সহজে আপনার প্রশ্ন জিজ্ঞাসা করুন।",
    walkthrough2Title: "ইন্টারেক্টিভ ভার্চুয়াল ল্যাব",
    walkthrough2Subtitle: "৬০ FPS-এ রিয়েল-টাইম স্লাইডার দিয়ে পদার্থবিদ্যা, রসায়ন ও গণিত কল্পনা করুন।",
    walkthrough3Title: "স্মার্ট PYQ ও রাডার",
    walkthrough3Subtitle: "লুকানো কনসেপ্ট ঘাটতি চিহ্নিত করুন এবং বিগত ১০ বছরের বোর্ড পরীক্ষার অনুশীলন করুন।",

    enrollmentStepHeader: "পদক্ষেপ ৩ • শিক্ষার্থী নিবন্ধন",
    freeBadge: "১০০% সম্পূর্ণ ফ্রি",
    createProfileTitle: "আপনার শিক্ষার্থী প্রোফাইল তৈরি করুন",
    enrollmentSubtitle: "চেরি ম্যাম আপনার সুবিধা মতো পাঠ ও ব্যাখ্যা সাজিয়ে দেবেন!",
    studentNameLabel: "শিক্ষার্থীর নাম",
    pickAvatar: "অবতার নির্বাচন",
    namePlaceholder: "উদাঃ নেহাল শর্মা",
    targetClassLabel: "টার্গেট ক্লাস / শ্রেণি",
    eduBoardLabel: "শিক্ষা বোর্ড",
    languageLabel: "পড়ার মাধ্যম (ভাষা)",
    enterStudyDesk: "স্টাডি ডেস্কে প্রবেশ করুন 🎒",
    enterNamePrompt: "স্টাডি ডেস্ক আনলক করতে আপনার নাম লিখুন",
    savingProfile: "প্রোফাইল সংরক্ষিত হচ্ছে...",
    trustBadge: "১০০% ফ্রি • সক্রেটিক AI ক্লাসরুম",

    totalStudyTime: "মোট অধ্যয়নের সময়",
    sessionsCompleted: "সম্পূর্ণ সেশন",
    parkedConcepts: "বাকি থাকা ধারণা",
    preferredDialect: "পছন্দের ভাষা",
    learnerProfileTitle: "লার্নার মেমোরি ও অগ্রগতি হাব",
    learnerProfileSubtitle: "ক্রস-সেশন বিশ্লেষণ, দুর্বল বিষয়ের ট্র্যাকিং ও ডেটা গোপনীয়তা নিয়ন্ত্রণ",
    profileHubTitle: "লার্নার মেমোরি ও অগ্রগতি হাব",
    profileHubSubtitle: "ক্রস-সেশন বিশ্লেষণ, দুর্বল বিষয়ের ট্র্যাকিং ও ডেটা গোপনীয়তা নিয়ন্ত্রণ",
    tabParkedConcepts: "বাকি ধারণা ও দুর্বল বিষয়",
    tabProActive: "প্রো সক্রিয়",
    tabUpiPro: "UPI প্রো প্ল্যান",
    tabReferEarn: "রেফার ও উপার্জন (৫-লেভেল)",
    tabTopicHistory: "বিষয় দক্ষতার ইতিহাস",
    tabPrivacy: "DPDP গোপনীয়তা ও ডেটা সুরক্ষা",
    tabSettings: "শিক্ষার্থী প্রোফাইল সেটিংস",
    profileTab: "প্রোফাইল",
    kiaraTab: "কিয়ারা AI কাউন্সেলর",
    performanceTab: "পারফরম্যান্স অ্যানালিটিক্স",
    booksTab: "স্টাডি হ্যান্ডবুক",

    // Phase 3: Syllabus Desk, STEM Lab & Quiz / Battle Arena
    studyDeskTitle: "স্টাডি ডেস্ক",
    welcomeBannerGreeting: "নমস্কার",
    welcomeBannerDesc: "আপনার ইন্টারঅ্যাক্টিভ স্টাডি রুমে স্বাগতম! বিষয় নির্বাচন করুন, নোট আপলোড করুন বা সরাসরি ক্লাস শুরু করুন।",
    chooseSubjectHeader: "ব্যক্তিগতকৃত বিষয়সমূহ",
    changeBtn: "পরিবর্তন করুন ✏️",
    learningModeHeader: "শেখার মোড",
    modeGuide: "গাইড (Guide)",
    modeExplainer: "ব্যাখ্যাকারী (Explainer)",
    modeMistake: "ভুল খুঁজুন (Mistake)",
    modeDoubt: "সংশয় (Doubt)",
    modeHWMaker: "হোমওয়ার্ক মেকার",
    modeCheatSheet: "ভিজ্যুয়াল চিট শিট",
    modePYQ: "PYQ ইন্টেলিজেন্স",
    directStudyBtn: "সরাসরি অধ্যয়ন: লাইভ ব্ল্যাকবোর্ড 🖊️🎨",
    uploadNotesTitle: "সিলেবাস নোট বা PDF অধ্যায় আপলোড করুন",
    uploadNotesDesc: "PDF, PNG, JPG ফাইল ড্র্যাগ করুন বা নির্বাচন করতে ট্যাপ করুন।",
    openBlackboardVoice: "ওপেন ব্ল্যাকবোর্ড (ভয়েস ডিরেক্ট)",
    openBlackboardVoiceDesc: "কোন কিছু টাইপ না করে সরাসরি লাইভ ব্ল্যাকবোর্ডে যান। চেরি ম্যাম ভয়েসে প্রশ্ন করবেন ও বোর্ডে বোঝাবেন!",
    typeTopicTitle: "বিষয়ের নাম লিখুন (কাস্টম নোট)",
    typeTopicDesc: "যে বিষয় পড়তে চান তা লিখুন (উদাঃ নিউটনের সূত্র, ত্রিকোণমিতি)। চেরি ম্যাম সুন্দর স্লাইড তৈরি করবেন।",
    startClassBtn: "ক্লাস শুরু করুন",
    deskSelectSubject: "বিষয় নির্বাচন করুন",
    deskPasteYouTube: "YouTube লেকচার লিঙ্ক পেস্ট করুন...",
    deskImportYT: "স্লাইডে রূপান্তর করুন",
    deskYTConnected: "ভিডিও যুক্ত হয়েছে",
    deskTopicModalTitle: "শেখার পদ্ধতি বাছুন",
    deskTopicModalSubtitle: "আপনার পছন্দের পদ্ধতি বেছে নিয়ে সরাসরি ব্ল্যাকবোর্ড ক্লাস শুরু করুন।",
    deskDirectStudyVoice: "লাইভ ভয়েস ১-অন-১ (সরাসরি ব্ল্যাকবোর্ড)",
    deskVoiceFastest: "⚡ দ্রুততম • তাত্ক্ষণিক",
    deskVoiceDesc: "চেরি ম্যামের সাথে সরাসরি মুখে কথা বলুন। আপনার প্রশ্ন বা বিষয় বলুন, তিনি ব্ল্যাকবোর্ডে প্রতিটি ধাপ এঁকে বোঝাবেন।",
    deskDirectStudyType: "বিষয়ের বা অধ্যায়ের নাম লিখুন",
    deskTypeDesc: "যে অধ্যায় বা সূত্র শিখতে চান তা লিখুন। চেরি ম্যাম সুন্দর ব্ল্যাকবোর্ড নোটস প্রস্তুত করে পড়াবেন।",
    deskTopicInputTitle: "বিষয় বা ধারণা লিখুন",
    deskTopicInputSubtitle: "বিষয়ের নাম লিখুন (যেমন নিউটনের গতিসূত্র, ত্রিকোণমিতি) এবং ক্লাস শুরু করুন।",
    deskBack: "ফিরে যান",
    deskStartLecture: "ব্ল্যাকবোর্ড ক্লাস শুরু করুন",

    // STEM Lab Studio
    virtualLabTitle: "STEM ভার্চুয়াল ল্যাব স্টুডিও",
    virtualLabSubtitle: "পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ও গণিতের রিয়েল-টাইম ইন্টারেক্টিভ সিমুলেশন।",
    tabReadyLabs: "প্রস্তুত পরীক্ষণ",
    tabCustomLabs: "AI ল্যাব জেনারেটর",
    filterAll: "সমস্ত",
    filterPhysics: "পদার্থবিজ্ঞান",
    filterChemistry: "রসায়ন",
    filterBiology: "জীববিজ্ঞান",
    filterMath: "গণিত",
    experimentControls: "প্যারামিটার ও স্লাইডার",
    interactiveSimulation: "ইন্টারেক্টিভ সিমুলেশন",
    resetParams: "রিসেট করুন",
    playSim: "চালান",
    pauseSim: "থামান",
    cherryObservations: "শিক্ষকের পর্যবেক্ষণ",
    labManual: "ল্যাব ম্যানুয়াল ও থিওরি",
    openInClassroom: "লাইভ ক্লাসে বুঝুন 🎙️",

    // Quiz & Battle Arena
    quizArenaTitle: "ইন্টারেক্টিভ কুইজ আখড়া",
    quizArenaSubtitle: "AI প্রস্তুত বোর্ড ও প্রতিযোগিতামূলক প্রশ্নের সাথে আপনার দক্ষতা পরীক্ষা করুন।",
    startQuizBtn: "কুইজ শুরু করুন",
    questionsLabel: "প্রশ্নাবলী",
    difficultyLabel: "কঠিনতার স্তর",
    levelBoard: "বোর্ড স্তর",
    levelCompetition: "JEE / NEET স্তর",
    questionTimer: "বাকি সময়",
    submitAnswer: "উত্তর জমা দিন",
    nextQuestion: "পরবর্তী প্রশ্ন",
    viewResults: "স্কোর ও বিশ্লেষণ দেখুন",
    quizScore: "আপনার স্কোর",
    battleArenaTitle: "১v১ ব্যাটল আখড়া",
    createBattleRoom: "ব্যাটল রুম তৈরি করুন",
    joinBattleRoom: "ব্যাটল রুমে যোগ দিন",
  },

  Odisha: {
    navClassroom: "ଶ୍ରେଣୀଗୃହ",
    navSyllabus: "ପାଠ୍ୟକ୍ରମ",
    navLab: "ଲ୍ୟାବ୍ ଷ୍ଟୁଡିଓ",
    navBattle: "କୁଇଜ୍ ଅଖଡ଼ା",
    navAccount: "ମୋ ପ୍ରୋଫାଇଲ୍",
    navSpeed: "ସ୍ପିଡ୍ ସ୍ପ୍ରିଣ୍ଟ",
    navPyq: "PYQ ରାଡାର୍",

    liveSession: "ଲାଇଭ୍ AI କ୍ଲାସ୍",
    connecting: "ସଂଯୋଗ ହେଉଛି...",
    startClass: "କ୍ଲାସ୍ ଆରମ୍ଭ କରନ୍ତୁ",
    endClass: "କ୍ଲାସ୍ ଶେଷ କରନ୍ତୁ",
    reconnect: "ପୁନଃସଂଯୋଗ",
    micMuted: "ମାଇକ୍ ବନ୍ଦ",
    micLive: "ମାଇକ୍ ଚାଲୁ",
    whiteboardNotes: "ବ୍ଲାକବୋର୍ଡ ନୋଟ୍",
    downloadNotes: "PDF ସେଭ୍ କରନ୍ତୁ",
    themeSelect: "ଥିମ୍",
    clearBoard: "ବୋର୍ଡ ସଫା କରନ୍ତୁ",
    quickDoubt: "ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ",
    voiceSyncActive: "ଲାଇଭ୍ ଭଏସ୍ ସକ୍ରିୟ",
    voiceSyncInactive: "ଲାଇଭ୍ ଭଏସ୍ ଷ୍ଟାଣ୍ଡବାଏ",

    phaseIntro: "୧. ପରିଚୟ କାହାଣୀ",
    phaseConcept: "୨. ମୂଳ ଧାରଣା",
    phaseExample: "୩. ସମାଧାନ ଉଦାହରଣ",
    phaseDoubt: "୪. ସନ୍ଦେହ ନିବାରଣ",
    phaseTransition: "୫. ପରବର୍ତ୍ତୀ ବିଷୟ",

    askDoubtTitle: "ତୁରନ୍ତ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ",
    askDoubtSubtitle: "ଚେରୀ ମ୍ୟାଡାମଙ୍କୁ ସିଧାସଳଖ ପଚାରନ୍ତୁ",
    doubtPlaceholder: "ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଏଠାରେ ଲେଖନ୍ତୁ...",
    doubtSentTitle: "ପ୍ରଶ୍ନ ଚେରୀ ମ୍ୟାଡାମଙ୍କ ପାଖକୁ ପଠାଗଲା!",
    doubtSentSubtitle: "ସେ କ୍ଲାସ୍ ମଧ୍ୟରେ ଏହାର ଉତ୍ତର ଦେବେ।",
    quickSuggestions: "ତ୍ୱରିତ ପରାମର୍ଶ:",
    pressEnterToSend: "ପଠାଇବାକୁ Enter ଦବାନ୍ତୁ",
    nonInterruptingVoice: "⚡ ନିରବଚ୍ଛିନ୍ନ ଭଏସ୍",
    closeBtn: "ବନ୍ଦ କରନ୍ତୁ",
    sendBtn: "ପଠାନ୍ତୁ",

    skip: "ବାଦ୍ ଦିଅନ୍ତୁ",
    next: "ପରବର୍ତ୍ତୀ",
    getStarted: "ଆରମ୍ଭ କରନ୍ତୁ",
    submit: "ଦାଖଲ କରନ୍ତୁ",
    cancel: "ବାତିଲ୍",
    save: "ସେଭ୍ କରନ୍ତୁ",
    done: "ସମ୍ପୂର୍ଣ୍ଣ",
    back: "ଫେରନ୍ତୁ",
    loading: "ଲୋଡ୍ ହେଉଛି...",

    walkthrough1Title: "ଲାଇଭ୍ ୧-ଅନ୍-୧ AI ଶିକ୍ଷକ",
    walkthrough1Subtitle: "ରିଅଲ-ଟାଇମ୍ ଭଏସ୍ ଓ ବ୍ଲାକବୋର୍ଡ ସହିତ ସହଜରେ ନିଜ ସନ୍ଦେହ ପଚାରନ୍ତୁ।",
    walkthrough2Title: "ଇଣ୍ଟରାକ୍ଟିଭ୍ ଭର୍ଚୁଆଲ୍ ଲ୍ୟାବ୍",
    walkthrough2Subtitle: "୬୦ FPS ରେ ଫିଜିକ୍ସ, କେମିଷ୍ଟ୍ରି ଓ ଗଣିତକୁ ସ୍ଲାଇଡର୍ ମାଧ୍ୟମରେ ବୁଝନ୍ତୁ।",
    walkthrough3Title: "ସ୍ମାର୍ଟ PYQ ଓ ରାଡାର୍",
    walkthrough3Subtitle: "ଅବୁଝା ବିଷୟଗୁଡ଼ିକୁ ଚିହ୍ନଟ କରନ୍ତୁ ଏବଂ ୧୦ ବର୍ଷର ବୋର୍ଡ ପରୀକ୍ଷା ଅଭ୍ୟାସ କରନ୍ତୁ।",

    enrollmentStepHeader: "ପଦକ୍ଷେପ ୩ • ଛାତ୍ର ପଞ୍ଜୀକରଣ",
    freeBadge: "୧୦୦% ମାଗଣା",
    createProfileTitle: "ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ତିଆରି କରନ୍ତୁ",
    enrollmentSubtitle: "ଚେରୀ ମ୍ୟାଡାମ୍ ଆପଣଙ୍କ ପାଇଁ ଶିକ୍ଷାଦାନ ଶୈଳୀକୁ ସଜାଡି ଦେବେ!",
    studentNameLabel: "ଛାତ୍ରଙ୍କ ନାମ",
    pickAvatar: "ଅବତାର ବାଛନ୍ତୁ",
    namePlaceholder: "ଯଥା: ନେହାଲ୍ ଶର୍ମା",
    targetClassLabel: "ଶ୍ରେଣୀ / ଗ୍ରେଡ୍ ବାଛନ୍ତୁ",
    eduBoardLabel: "ଶିକ୍ଷା ବୋର୍ଡ",
    languageLabel: "ପଢ଼ିବା ମାଧ୍ୟମ (ଭାଷା)",
    enterStudyDesk: "ଷ୍ଟଡି ଡେସ୍କ୍ ପ୍ରବେଶ କରନ୍ତୁ 🎒",
    enterNamePrompt: "ଷ୍ଟଡି ଡେସ୍କ୍ ଖୋଲିବା ପାଇଁ ଆପଣଙ୍କ ନାମ ଲେଖନ୍ତୁ",
    savingProfile: "ପ୍ରୋଫାଇଲ୍ ସେଭ୍ ହେଉଛି...",
    trustBadge: "୧୦୦% ମାଗଣା • ସକ୍ରେଟିକ୍ AI କ୍ଲାସରୁମ୍",

    totalStudyTime: "ମୋଟ ଅଧ୍ୟୟନ ସମୟ",
    sessionsCompleted: "ସମ୍ପୂର୍ଣ୍ଣ ସେସନ୍",
    parkedConcepts: "ବାକି ଥିବା ପ୍ରଶ୍ନ",
    preferredDialect: "ପସନ୍ଦିତ ଭାଷା",
    learnerProfileTitle: "ଶିକ୍ଷାର୍ଥୀ ମେମୋରୀ ଓ ପ୍ରଗତି ହବ୍",
    learnerProfileSubtitle: "ସେସନ୍ ବିଶ୍ଳେଷଣ, ଦୁର୍ବଳ ବିଷୟ ଟ୍ରାକିଂ ଏବଂ ଡାଟା ଗୋପନୀୟତା",
    profileHubTitle: "ଶିକ୍ଷାର୍ଥୀ ମେମୋରୀ ଓ ପ୍ରଗତି ହବ୍",
    profileHubSubtitle: "ସେସନ୍ ବିଶ୍ଳେଷଣ, ଦୁର୍ବଳ ବିଷୟ ଟ୍ରାକିଂ ଏବଂ ଡାଟା ଗୋପନୀୟତା",
    tabParkedConcepts: "ବାକି ଥିବା ପ୍ରଶ୍ନ ଓ ଦୁର୍ବଳ ବିଷୟ",
    tabProActive: "ପ୍ରୋ ସକ୍ରିୟ",
    tabUpiPro: "UPI ପ୍ରୋ ଯୋଜନା",
    tabReferEarn: "ରେଫର୍ ଏବଂ ରୋଜଗାର (୫-ସ୍ତର)",
    tabTopicHistory: "ବିଷୟ ଦକ୍ଷତା ଇତିହାସ",
    tabPrivacy: "DPDP ଗୋପନୀୟତା ଓ ଡାଟା ସୁରକ୍ଷା",
    tabSettings: "ଶିକ୍ଷାର୍ଥୀ ପ୍ରୋଫାଇଲ୍ ସେଟିଂସ୍",
    profileTab: "ପ୍ରୋଫାଇଲ୍",
    kiaraTab: "କିଆରା AI କାଉନସିଲର୍",
    performanceTab: "ପ୍ରଦର୍ଶନ ବିଶ୍ଳେଷଣ",
    booksTab: "ପାଠ୍ୟ ପୁସ୍ତିକା",

    // Phase 3: Syllabus Desk, STEM Lab & Quiz / Battle Arena
    studyDeskTitle: "ଷ୍ଟଡି ଡେସ୍କ",
    welcomeBannerGreeting: "ନମସ୍କାର",
    welcomeBannerDesc: "ଆପଣଙ୍କ ଇଣ୍ଟରାକ୍ଟିଭ୍ ଷ୍ଟଡି ରୁମକୁ ସ୍ୱାଗତ! ବିଷୟ ବାଛନ୍ତୁ, ନୋଟ୍ ଅପଲୋଡ୍ କରନ୍ତୁ କିମ୍ବା ସିଧାସଳଖ କ୍ଲାସ୍ ଆରମ୍ଭ କରନ୍ତୁ।",
    chooseSubjectHeader: "ବ୍ୟକ୍ତିଗତ ବିଷୟ",
    changeBtn: "ବଦଳାନ୍ତୁ ✏️",
    learningModeHeader: "ଶିକ୍ଷାଦାନ ମୋଡ୍",
    modeGuide: "ଗାଇଡ୍ (Guide)",
    modeExplainer: "ବ୍ୟାଖ୍ୟାକାରୀ (Explainer)",
    modeMistake: "ଭୁଲ୍ ଖୋଜନ୍ତୁ (Mistake)",
    modeDoubt: "ସନ୍ଦେହ (Doubt)",
    modeHWMaker: "ହୋମୱାର୍କ ମେକର୍",
    modeCheatSheet: "ଭିଜୁଆଲ୍ ଚିଟ୍ ସିଟ୍",
    modePYQ: "PYQ ଇଣ୍ଟେଲିଜେନ୍ସ",
    directStudyBtn: "ସିଧାସଳଖ ଅଧ୍ୟୟନ: ଲାଇଭ୍ ବ୍ଲାକବୋର୍ଡ 🖊️🎨",
    uploadNotesTitle: "ସିଲାବସ୍ ନୋଟ୍ କିମ୍ବା PDF ଅଧ୍ୟାୟ ଅପଲୋଡ୍ କରନ୍ତୁ",
    uploadNotesDesc: "PDF, PNG, JPG ଫାଇଲ୍ ଟାଣି ଆଣନ୍ତୁ କିମ୍ବା ଚୟନ କରିବାକୁ ଟ୍ୟାପ୍ କରନ୍ତୁ।",
    openBlackboardVoice: "ଓପନ୍ ବ୍ଲାକବୋର୍ଡ (ଭଏସ୍ ଡାଇରେକ୍ଟ)",
    openBlackboardVoiceDesc: "କିଛି ଟାଇପ୍ ନକରି ସିଧାସଳଖ ଲାଇଭ୍ ବୋର୍ଡକୁ ଯାଆନ୍ତୁ। ଚେରୀ ମ୍ୟାଡାମ୍ ପଚାରି ବୋର୍ଡରେ ଚିତ୍ର ସହ ବୁଝାଇବେ!",
    typeTopicTitle: "ବିଷୟର ନାମ ଲେଖନ୍ତୁ (ନୋଟ୍ସ)",
    typeTopicDesc: "ଯେଉଁ ବିଷୟ ପଢ଼ିବାକୁ ଚାହୁଁଛନ୍ତି ଲେଖନ୍ତୁ (ଯଥା: ନ୍ୟୁଟନଙ୍କ ନିୟମ, ତ୍ରିକୋଣମିତି)। ଚେରୀ ମ୍ୟାଡାମ୍ ସ୍ଲାଇଡ୍ ତିଆରି କରିବେ।",
    startClassBtn: "କ୍ଲାସ୍ ଆରମ୍ଭ କରନ୍ତୁ",
    deskSelectSubject: "ବିଷୟ ଚୟନ କରନ୍ତୁ",
    deskPasteYouTube: "YouTube ଲେକଚର ଲିଙ୍କ ପେଷ୍ଟ କରନ୍ତୁ...",
    deskImportYT: "ସ୍ଲାଇଡ୍‌ରେ ପରିଣତ କରନ୍ତୁ",
    deskYTConnected: "ଭିଡିଓ ସଂଯୁକ୍ତ",
    deskTopicModalTitle: "ପଢ଼ିବା ପଦ୍ଧତି ଚୟନ କରନ୍ତୁ",
    deskTopicModalSubtitle: "ନିଜ ପସନ୍ଦର ପଦ୍ଧତି ବାଛି ସିଧାସଳଖ ଲାଇଭ୍ ବ୍ଲାକବୋର୍ଡ କ୍ଲାସ ଆରମ୍ଭ କରନ୍ତୁ।",
    deskDirectStudyVoice: "ଲାଇଭ୍ ଭଏସ୍ ୧-ଅନ୍-୧ (ସିଧା ବ୍ଲାକବୋର୍ଡ)",
    deskVoiceFastest: "⚡ ଦ୍ରୁତତମ • ତୁରନ୍ତ",
    deskVoiceDesc: "ଚେରୀ ମ୍ୟାଡାମଙ୍କ ସହ ସିଧାସଳଖ କଥା ହୁଅନ୍ତୁ। ଆପଣଙ୍କ ସନ୍ଦେହ କୁହନ୍ତୁ, ସେ ବୋର୍ଡରେ ଚିତ୍ର ସହ ବୁଝାଇବେ।",
    deskDirectStudyType: "ବିଷୟ ବା ଅଧ୍ୟାୟ ନାମ ଲେଖନ୍ତୁ",
    deskTypeDesc: "ଯେଉଁ ଧାରଣା ବା ସୂତ୍ର ଶିଖିବାକୁ ଚାହାଁନ୍ତି ଲେଖନ୍ତୁ। ଚେରୀ ମ୍ୟାଡାମ ସ୍ଲାଇଡ୍ ଏବଂ ନୋଟ୍ସ ପ୍ରସ୍ତୁତ କରିବେ।",
    deskTopicInputTitle: "ବିଷୟ ବା କନସେପ୍ଟ ଲେଖନ୍ତୁ",
    deskTopicInputSubtitle: "ବିଷୟ ନାମ ଲେଖନ୍ତୁ (ଯଥା: ନ୍ୟୁଟନଙ୍କ ନିୟମ, ତ୍ରିକୋଣମିତି) ଏବଂ କ୍ଲାସ୍ ଆରମ୍ଭ କରନ୍ତୁ।",
    deskBack: "ପଛକୁ ଫେରନ୍ତୁ",
    deskStartLecture: "ବ୍ଲାକବୋର୍ଡ କ୍ଲାସ୍ ଆରମ୍ଭ କରନ୍ତୁ",

    // STEM Lab Studio
    virtualLabTitle: "STEM ଭର୍ଚୁଆଲ୍ ଲ୍ୟାବ୍ ଷ୍ଟୁଡିଓ",
    virtualLabSubtitle: "ପଦାର୍ଥ ବିଜ୍ଞାନ, ରସାୟନ, ଜୀବବିଜ୍ଞାନ ଓ ଗଣିତର ରିଅଲ-ଟାଇମ୍ ସିମୁଲେସନ୍।",
    tabReadyLabs: "ପ୍ରସ୍ତୁତ ପରୀକ୍ଷଣ",
    tabCustomLabs: "AI ଲ୍ୟାବ୍ ଜେନେରେଟର୍",
    filterAll: "ସମସ୍ତ",
    filterPhysics: "ପଦାର୍ଥ ବିଜ୍ଞାନ",
    filterChemistry: "ରସାୟନ ବିଜ୍ଞାନ",
    filterBiology: "ଜୀବ ବିଜ୍ଞାନ",
    filterMath: "ଗଣିତ",
    experimentControls: "ପାରାମିଟର୍ ଓ ସ୍ଲାଇଡର୍",
    interactiveSimulation: "ଇଣ୍ଟରାକ୍ଟିଭ୍ ସିମୁଲେସନ୍",
    resetParams: "ରିସେଟ୍ କରନ୍ତୁ",
    playSim: "ଚଲାନ୍ତୁ",
    pauseSim: "ଅଟକାନ୍ତୁ",
    cherryObservations: "ଶିକ୍ଷକଙ୍କ ପର୍ଯ୍ୟବେକ୍ଷଣ",
    labManual: "ଲ୍ୟାବ୍ ମାନୁଆଲ୍ ଓ ଥିଓରୀ",
    openInClassroom: "ଲାଇଭ୍ କ୍ଲାସରୁମରେ ବୁଝନ୍ତୁ 🎙️",

    // Quiz & Battle Arena
    quizArenaTitle: "ଇଣ୍ଟରାକ୍ଟିଭ୍ କୁଇଜ୍ ଅଖଡ଼ା",
    quizArenaSubtitle: "AI ପ୍ରସ୍ତୁତ ବୋର୍ଡ ଓ ପ୍ରତିଯୋଗିତାମୂଳକ ପ୍ରଶ୍ନ ସହ ନିଜ ଦକ୍ଷତା ପରୀକ୍ଷା କରନ୍ତୁ।",
    startQuizBtn: "କୁଇଜ୍ ଆରମ୍ଭ କରନ୍ତୁ",
    questionsLabel: "ପ୍ରଶ୍ନସଂଖ୍ୟା",
    difficultyLabel: "କଠିନତା ସ୍ତର",
    levelBoard: "ବୋର୍ଡ ସ୍ତର",
    levelCompetition: "JEE / NEET ସ୍ତର",
    questionTimer: "ବାକି ସମୟ",
    submitAnswer: "ଉତ୍ତର ଦାଖଲ କରନ୍ତୁ",
    nextQuestion: "ପରବର୍ତ୍ତୀ ପ୍ରଶ୍ନ",
    viewResults: "ସ୍କୋର ଓ ବିଶ୍ଳେଷଣ ଦେଖନ୍ତୁ",
    quizScore: "ଆପଣଙ୍କ ସ୍କୋର",
    battleArenaTitle: "୧v୧ ବ୍ୟାଟଲ୍ ଅଖଡ଼ା",
    createBattleRoom: "ବ୍ୟାଟଲ୍ ରୁମ୍ ତିଆରି କରନ୍ତୁ",
    joinBattleRoom: "ବ୍ୟାଟଲ୍ ରୁମରେ ଯୋଗ ଦିଅନ୍ତୁ",
  },

  Marathi: {
    navClassroom: "वर्गखोली (Class)",
    navSyllabus: "अभ्यासक्रम",
    navLab: "लॅब स्टुडिओ",
    navBattle: "क्विझ आखाडा",
    navAccount: "माझे खाते",
    navSpeed: "स्पीड स्प्रिंट",
    navPyq: "PYQ रडार",

    liveSession: "थेट AI वर्ग",
    connecting: "जोडत आहे...",
    startClass: "वर्ग सुरू करा",
    endClass: "वर्ग समाप्त करा",
    reconnect: "पुन्हा जोडा",
    micMuted: "माइक म्यूट",
    micLive: "माइक चालू",
    whiteboardNotes: "फळ्यावरील नोंदी",
    downloadNotes: "PDF जतन करा",
    themeSelect: "थीम",
    clearBoard: "फळा पुसा",
    quickDoubt: "शंका विचारा",
    voiceSyncActive: "थेट आवाज सक्रिय",
    voiceSyncInactive: "थेट आवाज स्टँडबाय",

    phaseIntro: "१. परिचय कथा",
    phaseConcept: "२. मुख्य संकल्पना",
    phaseExample: "३. सोडवलेले उदाहरण",
    phaseDoubt: "४. शंका निवारण",
    phaseTransition: "५. पुढील विषय",

    askDoubtTitle: "त्वरित शंका विचारा",
    askDoubtSubtitle: "चेरी मॅडमना थेट प्रश्न विचारा",
    doubtPlaceholder: "तुमचा प्रश्न किंवा शंका येथे लिहा...",
    doubtSentTitle: "शंका चेरी मॅडमना पाठवली!",
    doubtSentSubtitle: "त्या शिकवताना याचे त्वरित उत्तर देतील.",
    quickSuggestions: "त्वरित पर्याय:",
    pressEnterToSend: "पाठवण्यासाठी Enter दाबा",
    nonInterruptingVoice: "⚡ अखंडित आवाज",
    closeBtn: "बंद करा",
    sendBtn: "पाठवा",

    skip: "वगळा (SKIP)",
    next: "पुढे (NEXT)",
    getStarted: "सुरू करा",
    submit: "सबमिट करा",
    cancel: "रद्द करा",
    save: "जतन करा",
    done: "पूर्ण",
    back: "मागे",
    loading: "लोड होत आहे...",

    walkthrough1Title: "थेट १-ऑन-१ AI शिक्षक",
    walkthrough1Subtitle: "रिअल-टाइम आवाज आणि थेट फळ्यावर आपल्या सर्व शंका सहज विचारा.",
    walkthrough2Title: "परस्परसंवादी व्हर्च्युअल लॅब",
    walkthrough2Subtitle: "६० FPS मध्ये भौतिकशास्त्र, रसायनशास्त्र आणि गणित रिअल-टाइम स्लाइडर्ससह अनुभवा.",
    walkthrough3Title: "स्मार्ट PYQ व रडार",
    walkthrough3Subtitle: "संकल्पनांमधील उणिवा ओळखा आणि १० वर्षांच्या बोर्ड परीक्षांचे प्रश्न सोडवा.",

    enrollmentStepHeader: "टप्पा ३ • विद्यार्थी नोंदणी",
    freeBadge: "१००% मोफत",
    createProfileTitle: "आपले विद्यार्थी प्रोफाइल तयार करा",
    enrollmentSubtitle: "चेरी मॅडम तुमच्या गरजेनुसार धडे व शंका निवारण वैयक्तिकृत करतील!",
    studentNameLabel: "विद्यार्थ्याचे नाव",
    pickAvatar: "अवतार निवडा",
    namePlaceholder: "उदा., स्नेहल जोशी",
    targetClassLabel: "इयत्ता / वर्ग निवडा",
    eduBoardLabel: "शिक्षण मंडळ (Board)",
    languageLabel: "शिकण्याचे माध्यम (भाषा)",
    enterStudyDesk: "अभ्यास कक्षात प्रवेश करा 🎒",
    enterNamePrompt: "अभ्यास कक्ष उघडण्यासाठी कृपया आपले नाव टाका",
    savingProfile: "प्रोफाइल जतन होत आहे...",
    trustBadge: "१००% मोफत • सॉक्रेटिक AI क्लासरूम",

    totalStudyTime: "एकूण अभ्यास वेळ",
    sessionsCompleted: "पूर्ण झालेले सत्र",
    parkedConcepts: "उर्वरित शंका",
    preferredDialect: "पसंतीची भाषा",
    learnerProfileTitle: "विद्यार्थी मेमरी आणि प्रगती केंद्र",
    learnerProfileSubtitle: "सत्रनिहाय विश्लेषण, कमकुवत विषय ट्रॅकिंग आणि डेटा गोपनीयता",
    profileHubTitle: "विद्यार्थी मेमरी आणि प्रगती केंद्र",
    profileHubSubtitle: "सत्रनिहाय विश्लेषण, कमकुवत विषय ट्रॅकिंग आणि डेटा गोपनीयता",
    tabParkedConcepts: "उर्वरित शंका व कमकुवत विषय",
    tabProActive: "प्रो सक्रिय",
    tabUpiPro: "UPI प्रो प्लॅन",
    tabReferEarn: "रेफर करा आणि कमवा (५-पातळी)",
    tabTopicHistory: "विषय प्रभुत्व इतिहास",
    tabPrivacy: "DPDP गोपनीयता आणि डेटा सुरक्षा",
    tabSettings: "विद्यार्थी प्रोफाइल सेटिंग्ज",
    profileTab: "प्रोफाइल",
    kiaraTab: "किआरा AI समुपदेशक",
    performanceTab: "कामगिरी विश्लेषण",
    booksTab: "अभ्यास पुस्तिका",

    // Phase 3: Syllabus Desk, STEM Lab & Quiz / Battle Arena
    studyDeskTitle: "अभ्यास कक्ष (Study Desk)",
    welcomeBannerGreeting: "नमस्ते",
    welcomeBannerDesc: "आपल्या परस्परसंवादी अभ्यास खोलीत आपले स्वागत आहे! विषय निवडा, गृहपाठ नोट्स अपलोड करा किंवा थेट वर्ग सुरू करा.",
    chooseSubjectHeader: "वैयक्तिकृत विषय",
    changeBtn: "बदला ✏️",
    learningModeHeader: "शिकण्याची पद्धत (Mode)",
    modeGuide: "मार्गदर्शक (Guide)",
    modeExplainer: "संकल्पना स्पष्टीकरण (Explainer)",
    modeMistake: "चूक शोधा (Mistake)",
    modeDoubt: "शंका निवारण (Doubt)",
    modeHWMaker: "गृहपाठ सहाय्यक (HW Maker)",
    modeCheatSheet: "व्हिज्युअल चीट शीट",
    modePYQ: "PYQ बुद्धिमत्ता",
    directStudyBtn: "थेट अभ्यास: थेट फळा 🖊️🎨",
    uploadNotesTitle: "अभ्यासक्रम नोट्स किंवा PDF धडा अपलोड करा",
    uploadNotesDesc: "PDF, PNG, JPG फाईल येथे ड्रॅग करा किंवा निवडण्यासाठी टॅप करा.",
    openBlackboardVoice: "थेट फळा (आवाज संवाद)",
    openBlackboardVoiceDesc: "काहीही टाईप न करता थेट फळ्यावर जा. चेरी मॅडम आवाजात प्रश्न विचारतील आणि प्रत्येक पायरी फळ्यावर समजावतील!",
    typeTopicTitle: "विषयाचे नाव टाईप करा (कस्टम नोट्स)",
    typeTopicDesc: "आपला आवडता धडा किंवा घटक टाईप करा (उदा. न्यूटनचे नियम, त्रिकोणमिती). चेरी मॅडम व्यवस्थित नोट्स तयार करतील.",
    startClassBtn: "वर्ग सुरू करा",
    deskSelectSubject: "विषय निवडा",
    deskPasteYouTube: "YouTube व्याख्यानाची लिंक पेस्ट करा...",
    deskImportYT: "स्लाइड्समध्ये रूपांतरित करा",
    deskYTConnected: "व्हिडिओ जोडला",
    deskTopicModalTitle: "अभ्यासाची पद्धत निवडा",
    deskTopicModalSubtitle: "आपली आवडती पद्धत निवडा आणि थेट परस्परसंवादी ब्लॅकबोर्ड क्लास सुरू करा.",
    deskDirectStudyVoice: "थेट आवाज १-ऑन-१ (थेट फळा)",
    deskVoiceFastest: "⚡ जलद • त्वरित",
    deskVoiceDesc: "चेरी मॅडमशी थेट बोलून संवाद साधा. आपली शंका सांगा, त्या फळ्यावर प्रत्येक पायरी समजावून सांगतील.",
    deskDirectStudyType: "विषयाचे किंवा धड्याचे नाव टाईप करा",
    deskTypeDesc: "आपल्याला शिकायचा असलेला कोणताही घटक टाईप करा. चेरी मॅडम फळ्यावर व्यवस्थित नोट्स तयार करतील.",
    deskTopicInputTitle: "घटक किंवा संकल्पना टाईप करा",
    deskTopicInputSubtitle: "घटकाचे नाव टाईप करा (उदा. न्यूटनचे नियम, त्रिकोणमिती) आणि क्लास सुरू करा.",
    deskBack: "मागे जा",
    deskStartLecture: "ब्लॅकबोर्ड वर्ग सुरू करा",

    // STEM Lab Studio
    virtualLabTitle: "STEM व्हर्च्युअल लॅब स्टुडिओ",
    virtualLabSubtitle: "भौतिकशास्त्र, रसायनशास्त्र, जीवशास्त्र आणि गणिताचे परस्परसंवादी सिम्युलेशन रिअल-टाइम स्लाइडर्ससह.",
    tabReadyLabs: "तयार प्रयोग",
    tabCustomLabs: "AI लॅब जनरेटर",
    filterAll: "सर्व",
    filterPhysics: "भौतिकशास्त्र",
    filterChemistry: "रसायनशास्त्र",
    filterBiology: "जीवशास्त्र",
    filterMath: "गणित",
    experimentControls: "पॅरामीटर्स आणि स्लाइडर्स",
    interactiveSimulation: "परस्परसंवादी सिम्युलेशन",
    resetParams: "रीसेट करा",
    playSim: "सुरू करा",
    pauseSim: "थांबवा",
    cherryObservations: "शिक्षकांचे निरीक्षण",
    labManual: "लॅब मार्गदर्शिका व सिद्धांत",
    openInClassroom: "थेट वर्गात समजून घ्या 🎙️",

    // Quiz & Battle Arena
    quizArenaTitle: "परस्परसंवादी क्विझ आखाडा",
    quizArenaSubtitle: "AI द्वारे तयार केलेल्या बोर्ड आणि स्पर्धा परीक्षांच्या प्रश्नांसह स्वतःची तयारी तपासा.",
    startQuizBtn: "क्विझ सुरू करा",
    questionsLabel: "प्रश्न",
    difficultyLabel: "काठिण्य पातळी",
    levelBoard: "बोर्ड पातळी",
    levelCompetition: "JEE / NEET पातळी",
    questionTimer: "उर्वरित वेळ",
    submitAnswer: "उत्तर सबमिट करा",
    nextQuestion: "पुढील प्रश्न",
    viewResults: "गुण आणि विश्लेषण पहा",
    quizScore: "तुमचे गुण",
    battleArenaTitle: "१v१ बॅटल आखाडा",
    createBattleRoom: "बॅटल रूम तयार करा",
    joinBattleRoom: "बॅटल रूममध्ये सामील व्हा",
  }
};

/**
 * Helper to get normalized translations dictionary for any selected language
 */
export function getTranslations(langRaw?: string): TranslationDictionary {
  if (!langRaw) return TRANSLATIONS.English;
  const normalized = langRaw.trim().toLowerCase();

  if (normalized.includes("hindi") || normalized === "hi") {
    return TRANSLATIONS.Hindi;
  }
  if (normalized.includes("bengali") || normalized.includes("bangla") || normalized === "bn") {
    return TRANSLATIONS.Bengali;
  }
  if (normalized.includes("odisha") || normalized.includes("odia") || normalized.includes("oriya") || normalized === "or") {
    return TRANSLATIONS.Odisha;
  }
  if (normalized.includes("marathi") || normalized === "mr") {
    return TRANSLATIONS.Marathi;
  }
  // Hinglish or English or Default
  return TRANSLATIONS.English;
}
