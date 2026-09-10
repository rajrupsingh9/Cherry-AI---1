import { AudioPodcastData, PodcastEpisodeType, PodcastLanguage, PodcastSegment } from "../types";

export interface PodcastGenerationOptions {
  topic: string;
  subject?: string;
  grade?: string;
  language?: PodcastLanguage;
  notesOrDocumentText?: string;
  episodeType?: PodcastEpisodeType | "deep_dive";
  targetDurationMins?: number;
  hostPair?: "cherry_riya" | "aarav_riya" | "cherry_solo";
}

/**
 * Builds the prompt for generating a 2-speaker NotebookLM-style Deep Dive Podcast
 * featuring a Mentor (Teacher) and a Student (Peer).
 */
export function buildPodcastPrompt(options: PodcastGenerationOptions): string {
  const {
    topic,
    subject = "Science",
    grade = "Class 10-12",
    language = "Hinglish",
    notesOrDocumentText = "",
    episodeType = "rapid_viva",
    targetDurationMins = 3,
    hostPair = "cherry_riya",
  } = options;

  const isCherry = hostPair !== "aarav_riya";
  const mentorName = isCherry ? "Cherry Ma'am" : "Aarav Sir";
  const mentorAvatar = isCherry ? "👩‍🏫" : "👨‍🏫";
  const mentorGender = isCherry ? "female" : "male";
  const mentorTitle = isCherry ? "Master AI Educator" : "Master Mentor";
  const studentSalutation = isCherry ? "Ma'am" : "Sir";

  const normalizedLang = (language || "Hinglish").trim().toLowerCase();

  let languageGuidance = "";
  if (normalizedLang.includes("hindi")) {
    languageGuidance = `
LANGUAGE MANDATE: Natural, conversational Hindi in Devanagari script.
- Both characters must speak fluent, natural spoken Hindi (सहज बोलचाल की हिंदी).
- Key scientific and mathematical terms can be written in phonetics or simple Devanagari (e.g., 'ग्रेविटेशनल फोर्स', 'मोमेंटम', 'फ़ोटोसिंथेसिस').
- Do NOT make it sound like a dry textbook; make it sound like a friendly teacher-student audio interaction.
- Student addresses mentor as '${isCherry ? "मैम" : "सर"}'.
`;
  } else if (normalizedLang.includes("english")) {
    languageGuidance = `
LANGUAGE MANDATE: Engaging, clear conversational English.
- Natural, conversational Indian/Global English with warm cadence.
- Avoid robotic prose; use expressive dialogue, casual conversational transitions ("Wait, really?", "Exactly, and here is why...").
- Student addresses mentor as '${studentSalutation}'.
`;
  } else {
    // Default Hinglish (Hindi + English mix in Roman script)
    languageGuidance = `
LANGUAGE MANDATE: Natural, authentic Hinglish (Hindi + English blend written in Roman script).
- Use natural spoken Indian classroom phrasing:
  - Teacher (${mentorName}): "Dekho beta simple logic hai...", "Ye concept samajhna isliye important hai kyunki...", "Exams me bache yahi galti karte hain..."
  - Student (Riya): "${studentSalutation} ek confusion hai...", "Wait ${studentSalutation.toLowerCase()}, matlab agar...", "Acha! Toh iska real life example kya hoga?"
- Mix English conceptual keywords (Force, Kinetic Energy, Reactants, Integration, Equilibrium) seamlessly with conversational Hindi connecting sentences.
`;
  }

  const contextBlock = notesOrDocumentText?.trim()
    ? `\n========================================================\n` +
      `STUDENT'S REFERENCE NOTES / DOCUMENT EXCERPTS (CRITICAL SOURCE OF TRUTH):\n` +
      `"""\n${notesOrDocumentText.slice(0, 35000)}\n"""\n` +
      `MANDATORY DOCUMENT GROUNDING & COMPREHENSIVE COVERAGE DIRECTIVE:\n` +
      `- The podcast conversation MUST be directly and thoroughly grounded in the student's reference notes and document content above!\n` +
      `- Discuss the exact academic topic ("${topic}") and subject discipline ("${subject}") extracted from these notes.\n` +
      `- You MUST systematically walk through all major subheadings, definitions, governing laws, classifications, tables, and case studies present in the document.\n` +
      `- When the document explains contrasts (e.g. Push vs Pull factors, positive vs negative impacts, internal vs international movement), the hosts MUST dissect BOTH sides in full detail.\n` +
      `- Do NOT summarize superficially. Every core concept in the document must be examined through dialogue.\n` +
      `========================================================\n`
    : "";

  // Duration specifications requested by user:
  // Rapid Viva / Quiz: 2.5 - 4 min (default 3)
  // Exam-Morning 1-Page Audio: 3 - 4 min (default 3.5)
  // Quick Recap: 3 - 5 min (default 4)
  // Exam Traps: 2 - 4 min (default 3)
  let resolvedMins = 3;
  if (episodeType === "exam_booster") {
    resolvedMins = Math.max(3, Math.min(4, targetDurationMins || 3.5));
  } else if (episodeType === "quick_revision") {
    resolvedMins = Math.max(3, Math.min(5, targetDurationMins || 4));
  } else if (episodeType === "exam_trap") {
    resolvedMins = Math.max(2, Math.min(4, targetDurationMins || 3));
  } else {
    // rapid_viva (default)
    resolvedMins = Math.max(2, Math.min(4, targetDurationMins || 3));
  }
  const durationSec = Math.round(resolvedMins * 60);

  const turnsCount =
    episodeType === "quick_revision" ? "12 to 16" :
    episodeType === "exam_trap" ? "8 to 12" :
    episodeType === "exam_booster" ? "10 to 14" :
    "10 to 14";

  let modeTitle = "";
  let modeDirective = "";
  let modeStructure = "";

  if (episodeType === "rapid_viva") {
    modeTitle = `⚡ RAPID VIVA / ACTIVE RECALL QUIZ (${resolvedMins} Min Socratic Viva & Rapid-Fire Questions)`;
    modeDirective = `
EPISODE MODE: RAPID VIVA / ACTIVE RECALL QUIZ (2 to 4 Min Rapid-Fire Viva)
- TARGET DURATION: ~${resolvedMins} minutes (~10 to 14 dialogue turns).
- PACING: Fast-paced, interactive, intellectually stimulating, active learning.
- CONTENT ESSENTIALS:
  1. Mentor launches with 4-5 high-yield conceptual viva questions directly testing core understanding of "${topic}".
  2. Student (Riya) attempts the answer or tests an intuition.
  3. Mentor confirms, sharpens, or corrects the concept in a crisp, 20-second punchy explanation.
  4. Include 1 classic counter-intuitive viva trap external examiners love asking in viva/practical exams.
  5. Conclude with a rapid 15-second confidence summary of key viva points.
- TONE: Encouraging, fast-paced, sharp, exam-ready.
`;
    modeStructure = `
STRUCTURE OF THE EPISODE (10 to 14 rapid dialogue turns total):
1. Viva Launch Hook (2 turns): Mentor greets and initiates the rapid-fire viva session on '${topic}'; Student gets ready.
2. Question #1 - Core Definition / Law (2-3 turns): Mentor fires a fundamental question; Student answers; Mentor refines and clarifies the key condition.
3. Question #2 - Governing Equation / Variable Relation (2-3 turns): Mentor questions what happens when a variable changes; Student reasons it out; Mentor confirms.
4. Question #3 - The Examiner Viva Trap (2-3 turns): Mentor presents a deceptive practical question; reveals the surprising fact or boundary condition.
5. Rapid Wrap-Up & Scorecard (2 turns): Mentor's quick takeaway summary and encouraging sign-off.
`;
  } else if (episodeType === "exam_booster") {
    modeTitle = `🚀 EXAM-MORNING 1-PAGE AUDIO BOOSTER (${resolvedMins} Min High-Yield Exam Day Briefing - एग्ज़ाम डे बूस्टर)`;
    modeDirective = `
EPISODE MODE: EXAM-MORNING 1-PAGE AUDIO (3 to 4 Min High-Yield Exam Day Briefing - एग्ज़ाम डे बूस्टर)
- TARGET DURATION: ~${resolvedMins} minutes (~10 to 14 dialogue turns).
- PACING: Calm, ultra-high yield, confident, reassuring.
- CONTENT ESSENTIALS:
  1. 80/20 EXAM MORNING FOCUS: "If you walk into the exam hall in 15 minutes, here is what is guaranteed to matter on '${topic}'."
  2. The TOP 3 questions paper-setters consistently ask year after year.
  3. Non-negotiable formulas, exact SI units, and key variables stated clearly in natural spoken rhythm in one breath.
  4. The 2 fatal mistakes students commit when writing answers under time pressure (and how to avoid them).
  5. A 20-second final confidence and calm breathing boost.
- TONE: Reassuring, authoritative, laser-focused, empowering.
`;
    modeStructure = `
STRUCTURE OF THE EPISODE (10 to 14 dialogue turns total):
1. Exam Morning Briefing Launch (2 turns): Mentor sets a calm, laser-focused tone for exam day on '${topic}'; Student checks their readiness.
2. The Big 3 Guaranteed Exam Questions (4-5 turns): Mentor and Student review the top 3 high-probability questions and exact answer keywords paper-checkers look for.
3. Rapid Formula & Unit Checklist (2-3 turns): Clear spoken revision of must-remember formulas and SI units without visual strain.
4. Fatal Mistakes Shield & Final Confidence Boost (2-3 turns): The two traps to avoid on the answer sheet today, followed by an inspiring boost.
`;
  } else if (episodeType === "quick_revision") {
    modeTitle = `⚡ QUICK RECAP / SPRINT MODE (${resolvedMins} Min Comprehensive Formula Blitz & Checklist)`;
    modeDirective = `
EPISODE MODE: QUICK RECAP & FORMULA BLITZ (3 to 5 Min Comprehensive Sprint)
- TARGET DURATION: ~${resolvedMins} minutes (~12 to 16 dialogue turns).
- PACING: Fast, high information density, crisp and clear.
- CONTENT ESSENTIALS:
  1. Instant definition / law stated crisply in one punchy breath.
  2. Core governing formulas, exact symbols, and standard SI units.
  3. Essential conditions of validity (where the formula works and where it fails).
  4. Complete sub-topic distinctions (e.g. Immigration vs Emigration, Push vs Pull).
  5. Rapid 5-point checklist of must-remember facts and a rapid memory mnemonic.
- TONE: Upbeat, sprint-like, focused, motivating.
`;
    modeStructure = `
STRUCTURE OF THE EPISODE (12 to 16 rapid dialogue turns total):
1. Sprint Launch (2 turns: mentor hook + student reaction): Mentor launches the ${resolvedMins}-minute rapid revision blitz on '${topic}'; Student gets ready for core laws and equations.
2. Law & Principles Blitz (4-5 turns): Mentor and Student deliver core laws, definitions, governing equations, symbols, and SI units.
3. Comparative Distinctions & Tables (3-5 turns): Rapid tabular contrasts, positive vs negative impacts, or directional differences from the document.
4. Flash Mnemonics & Wrap-up (2-3 turns): Memory tricks, formula cards, and crisp sign-off.
`;
  } else {
    // exam_trap
    modeTitle = `🎯 EXAM TRAPS & SILLY MISTAKES SHIELD (${resolvedMins} Min Forensic PYQ Pitfall Busting)`;
    modeDirective = `
EPISODE MODE: EXAM TRAPS & SILLY MISTAKES (2 to 4 Min Examiner Pitfall Shield)
- TARGET DURATION: ~${resolvedMins} minutes (~8 to 12 dialogue turns).
- PACING: Forensic, alert, analytical, eye-opening.
- CONTENT ESSENTIALS:
  1. Identify the top 2 classic trap questions examiners deliberately set on "${topic}".
  2. Highlight the tempting intuitive wrong answer that 80% of students fall for in multiple-choice or short-answer questions.
  3. Dissect WHY it's a trap (e.g. neglected boundary conditions, sign convention error, confusing vector vs scalar).
  4. Provide the foolproof 2-step verification rule that guarantees zero silly mistakes or negative marking.
- TONE: Alert, forensic, suspenseful, protective, high-value coaching.
`;
    modeStructure = `
STRUCTURE OF THE EPISODE (8 to 12 forensic dialogue turns total):
1. Trap Alert Hook (2 turns): Mentor warns that examiners love setting tricky bait questions on '${topic}'; Student asks for the deadliest traps.
2. Examiner Trap #1 & The Bait (3-4 turns): Mentor presents a deceptive question; Student gives the common intuitive answer; Mentor reveals the trap.
3. Examiner Trap #2 & Technical Pitfall (2-3 turns): Mentor breaks down the subtle condition/sign trap.
4. Foolproof Defense Shield & Verification Rule (2-3 turns): Two-step verification checklist to lock in full marks.
`;
  }

  return `You are the Executive Audio Director & Socratic Pedagogy Producer for "Cherry AI Deep Dive Audio Overview" (inspired by NotebookLM's 2-host audio deep dives).

GOAL: Produce a captivating 2-speaker podcast script for: "${topic}" (${subject}, Target: ${grade}).
${modeTitle}
${modeDirective}
Estimated Duration Target: ~${Math.round(durationSec / 60)} minutes (approximately ${turnsCount} engaging, natural dialogue turns).
Important: Keep each dialogue turn natural, conversational, and punchy (1 to 3 spoken sentences, 20 to 45 words max per turn). Avoid long monologue blocks.

${languageGuidance}

CHARACTERS:
1. MENTOR (Teacher / Anchor):
   - Name: "${mentorName}"
   - Voice Profile: ${isCherry ? "Aoede (Warm, lively, encouraging, human-like female educator with high empathy and clarity)" : "Charon (Warm, grounded, relatable male educator)"}
   - Personality: Enthusiastic, patient, uses vivid real-world analogies (cricket balls, tea kettle, smartphone batteries, cars on highways), debunks misconceptions, anticipates student's exam traps.
2. STUDENT (Curious Peer / Co-host):
   - Name: "Riya"
   - Voice Profile: Kore (Curious, inquisitive female student)
   - Personality: Sharp, relatable, asks the exact questions that students hesitate to ask in class, points out intuitive contradictions, reacts naturally ("Wait, are you saying that...", "Oh wow, that makes so much sense!").

${modeStructure}

# AI AUDIO OVERVIEW ENGINE DIRECTIVES (CORE PEDAGOGICAL PROTOCOL)

1. PRIMARY OBJECTIVE & LISTENER OUTCOME:
   - You are NOT a document reader. You are an expert explainer who helps the listener understand the most important ideas in the document without requiring them to read the original document.
   - The final audio must answer: "What does this document actually want me to understand?"
   - Make the listener feel they are being actively guided through the ideas rather than having a textbook read aloud.

2. SOURCE FIDELITY & STRICT NO-HALLUCINATION RULE:
   - The uploaded document / notes is the primary source of truth.
   - Do NOT invent fake statistics, research citations, equations, or numbers not supported by the document.
   - If the document contains an error, contradiction, ambiguity, or missing detail, address it transparently: "The source does not specify this..." rather than guessing.
   - Distinguish between SOURCE FACTS (explicitly stated in the document) and REASONABLE INFERENCES (logically derived deductions).

3. 80/20 PRINCIPLE & INSIGHT EXTRACTION:
   - Prioritize the 20% of core concepts that generate 80% of deep understanding. Omit low-value trivia.
   - Extract causal chains and relationships: Cause -> Effect, Problem -> Solution, Concept -> Example.
   - Deliver insights rather than mechanical summaries. Prefer: "Because A leads to B, and B affects C, the crucial takeaway is..." over dry sequential recital: "The document states A, then it states B, then C".

4. CONVERSATIONAL DYNAMICS & BANNED CLICHES:
   - MENTOR (${mentorName}): Guide, explainer, connects concepts, provides relatable real-world physical analogies, keeps the discussion grounded and focused.
   - STUDENT / CO-HOST (Riya): Curious, sharp, and authentic. Riya must NOT ask fake or superficial filler questions merely to create dialogue. Every question should clarify confusing concepts, test an edge case, challenge an assumption, or request a concrete analogy.
   - BANNED CLICHES: Strictly avoid formulaic, robotic podcast openers and hollow filler:
     * NEVER use "Today we are going to delve into..."
     * NEVER use "Let's embark on a journey..."
     * NEVER use "This fascinating document..."
     * NEVER use "Without further ado..."
     * NEVER use repetitive artificial praise like "That's so interesting!" or "Fascinating!" after every single turn.
   - OPENING HOOK (first 20-30 seconds): Immediately hook the listener by establishing what the topic is, why it matters, and the core understanding they will walk away with.

5. SPEECH OPTIMIZATION & FORMULA SPOKEN REVISION ("WRITE FOR THE EAR, NOT THE EYE"):
   - Write for the ear, not the eye. Use short, punchy spoken sentences with punctuation that creates natural breathing pauses.
   - When formulas or mathematical relationships appear:
     * Explain what the formula represents and define key variables.
     * Convert mathematical symbols into natural spoken language (e.g., say "I equals Q divided by T" or spoken terms instead of raw shorthand "I = Q/t").
     * NEVER output raw unpronounceable LaTeX math tags (\frac, \sqrt, $$, \[) in spoken dialogue text.
   - When diagrams or tables appear: Explain visual information verbally in conversational terms. Never say "Look at Figure 3" or read raw tables line by line. Explain what the comparison or diagram shows.
   - After a complex section, briefly recap and consolidate before transitioning.

${contextBlock}

OUTPUT FORMAT:
Return a strictly valid JSON object conforming exactly to this structure (no markdown fences, no explanatory text outside the JSON):
{
  "id": "podcast-${Date.now()}",
  "topic": "${topic}",
  "title": "${episodeType === "rapid_viva" ? topic + ": " + resolvedMins + "-Min Rapid Viva & Quiz" : episodeType === "exam_booster" ? topic + ": " + resolvedMins + "-Min Exam-Morning Booster" : episodeType === "quick_revision" ? topic + ": " + resolvedMins + "-Min Quick Recap & Formula Blitz" : topic + ": " + resolvedMins + "-Min Top Exam Traps Shield"}",
  "hindiTitle": "${episodeType === "rapid_viva" ? topic + ": " + resolvedMins + " मिनट रैपिड वाइवा क्विज़" : episodeType === "exam_booster" ? topic + ": " + resolvedMins + " मिनट एग्ज़ाम डे बूस्टर" : episodeType === "quick_revision" ? topic + ": " + resolvedMins + " मिनट त्वरित रिवीज़न" : topic + ": " + resolvedMins + " मिनट परीक्षा ट्रैप्स"}",
  "subject": "${subject}",
  "grade": "${grade}",
  "language": "${language}",
  "episodeType": "${episodeType}",
  "durationEstimateSec": ${durationSec},
  "hosts": {
    "mentor": {
      "id": "mentor",
      "name": "${mentorName}",
      "title": "${mentorTitle}",
      "avatar": "${mentorAvatar}",
      "voiceGender": "${mentorGender}",
      "role": "Concept Explainer & Anchor"
    },
    "student": {
      "id": "student",
      "name": "Riya",
      "title": "Curious Student",
      "avatar": "👩‍🎓",
      "voiceGender": "female",
      "role": "Doubt Raiser & Peer"
    }
  },
  "overview": "2-3 sentences specifically summarizing this ${episodeType === "exam_trap" ? "exam traps breakdown" : episodeType === "quick_revision" ? "quick revision formula blitz" : "concept deep dive"}.",
  "keyTakeaways": [
    "High-yield takeaway 1",
    "High-yield takeaway 2",
    "Exam caution or tip"
  ],
  "segments": [
    {
      "id": "seg-1",
      "speaker": "mentor",
      "speakerName": "${mentorName}",
      "text": "Full dialogue spoken by the mentor in the selected language...",
      "emotion": "energetic",
      "intent": "intro"
    },
    {
      "id": "seg-2",
      "speaker": "student",
      "speakerName": "Riya",
      "text": "Full dialogue spoken by the student reacting or asking...",
      "emotion": "curious",
      "intent": "${episodeType === "exam_trap" ? "doubt" : "doubt"}"
    }
  ]
}`;
}

/**
 * Extracts structured educational concepts, headings, terms, and contrasts
 * from uploaded document text or notes to anchor the procedural podcast.
 */
function extractDocumentKeyInsights(rawText: string, fallbackTopic: string, fallbackSubject: string) {
  const cleanLines = (rawText || "")
    .split("\n")
    .map((l) => l.replace(/[\r\t]/g, "").trim())
    .filter((l) => l.length > 0 && !l.startsWith("```") && !l.startsWith("[DOC_TYPE:"));

  const headings: string[] = [];
  const bulletPoints: string[] = [];
  const terms: string[] = [];

  for (const line of cleanLines) {
    if (line.match(/^#{1,4}\s+(.+)$/)) {
      const h = line.replace(/^#{1,4}\s+/, "").replace(/[\*\_]/g, "").trim();
      if (h.length > 3 && h.length < 80 && !h.toLowerCase().includes("reference notes")) {
        headings.push(h);
      }
    } else if (line.match(/^[-*•]\s+(.+)$/) || line.match(/^\d+[\.)]\s+(.+)$/)) {
      const b = line.replace(/^[-*•\d\.)]+\s+/, "").replace(/[\*\_]/g, "").trim();
      if (b.length > 15 && b.length < 180) {
        bulletPoints.push(b);
      }
    } else if (line.includes(":") && line.length < 120) {
      const parts = line.split(":");
      const term = parts[0].replace(/[\*\_]/g, "").trim();
      if (term.length > 3 && term.length < 40 && !term.includes("http")) {
        terms.push(term);
      }
    }
  }

  return {
    headings: headings.slice(0, 8),
    bulletPoints: bulletPoints.slice(0, 15),
    terms: Array.from(new Set(terms)).slice(0, 10),
    hasRealDocument: cleanLines.length > 3 && (headings.length > 0 || bulletPoints.length > 0),
  };
}

/**
 * Procedural fallback generator when Gemini API is offline or quota-limited.
 * Produces a rich, authentic multi-turn dialogue tailored to the topic and language.
 */
export function buildProceduralPodcast(
  topic: string = "Fundamental Academic Concepts",
  subject: string = "General Science",
  grade: string = "Class 10-12",
  language: PodcastLanguage = "Hinglish",
  hostPair: "cherry_riya" | "aarav_riya" | "cherry_solo" = "cherry_riya",
  episodeType: PodcastEpisodeType | "deep_dive" = "rapid_viva",
  targetDurationMins?: number,
  notesOrDocumentText?: string
): AudioPodcastData {
  const normLang = (language || "Hinglish").trim().toLowerCase();

  const isHindi = normLang.includes("hindi");
  const isEnglish = normLang.includes("english");
  const isCherry = hostPair !== "aarav_riya";

  const mentorName = isHindi ? (isCherry ? "चेरी मैम" : "आरव सर") : (isCherry ? "Cherry Ma'am" : "Aarav Sir");
  const mentorAvatar = isCherry ? "👩‍🏫" : "👨‍🏫";
  const mentorGender = isCherry ? "female" : "male";
  const mentorTitle = isHindi ? (isCherry ? "मास्टर एआई शिक्षक" : "मास्टर मेंटर") : (isCherry ? "Master AI Educator" : "Master Mentor");
  const studentSalutation = isHindi ? (isCherry ? "मैम" : "सर") : (isCherry ? "Ma'am" : "Sir");

  const id = `podcast-proc-${Date.now()}`;

  let resolvedDurationMins = 3;
  if (episodeType === "exam_booster") {
    resolvedDurationMins = targetDurationMins && targetDurationMins >= 2.5 && targetDurationMins <= 5 ? targetDurationMins : 3.5;
  } else if (episodeType === "quick_revision") {
    resolvedDurationMins = targetDurationMins && targetDurationMins >= 2.5 && targetDurationMins <= 6 ? targetDurationMins : 4;
  } else if (episodeType === "exam_trap") {
    resolvedDurationMins = targetDurationMins && targetDurationMins >= 2 && targetDurationMins <= 5 ? targetDurationMins : 3;
  } else {
    // rapid_viva (default)
    resolvedDurationMins = targetDurationMins && targetDurationMins >= 2 && targetDurationMins <= 5 ? targetDurationMins : 3;
  }
  const procDurationSec = Math.round(resolvedDurationMins * 60);

  const insights = extractDocumentKeyInsights(notesOrDocumentText || "", topic, subject);

  const h1 = insights.headings[0] || `${topic} Fundamentals`;
  const h2 = insights.headings[1] || `Key Mechanisms & Classifications`;
  const h3 = insights.headings[2] || `Comparative Distinctions & Applications`;
  const h4 = insights.headings[3] || `Exam Traps & Critical Edge Cases`;

  const p1 = insights.bulletPoints[0] || `Understanding the fundamental principles and definitions governing ${topic}.`;
  const p2 = insights.bulletPoints[1] || `Analyzing the structural causes, driving mechanisms, and direct consequences.`;
  const p3 = insights.bulletPoints[2] || `Evaluating contrasting conditions, real-world examples, and data trends.`;
  const p4 = insights.bulletPoints[3] || `Avoiding common student traps, misinterpretations, and tricky exam questions.`;

  const t1 = insights.terms[0] || "Core Principle";
  const t2 = insights.terms[1] || "Governing Mechanism";
  const t3 = insights.terms[2] || "Critical Distinction";

  // =========================================================================
  // DOCUMENT-GROUNDED PROCEDURAL GENERATOR (When real document notes or custom topic provided)
  // =========================================================================
  if (insights.hasRealDocument || (notesOrDocumentText && notesOrDocumentText.trim().length > 20) || (topic !== "Newton's Third Law of Motion" && topic !== "Newton's Laws of Motion")) {
    const docSegments: PodcastSegment[] = [];

    if (isHindi) {
      if (episodeType === "rapid_viva") {
        docSegments.push(
          { id: "seg-1", speaker: "mentor", speakerName: mentorName, text: `नमस्ते रिया! तैयार हो जाओ, आज हम '${topic}' पर एक रैपिड-फ़ायर वाइवा क्विज़ करेंगे। 3 मिनट में तुम्हारा एक्टिव रिकॉल टेस्ट होगा!`, emotion: "energetic", intent: "intro" },
          { id: "seg-2", speaker: "student", speakerName: "रिया", text: `नमस्ते ${studentSalutation}! मैं पूरी तरह तैयार हूँ। पहला सवाल पूछिए!`, emotion: "curious", intent: "concept" },
          { id: "seg-3", speaker: "mentor", speakerName: mentorName, text: `सवाल नंबर 1: '${h1}' की सबसे बुनियादी शर्त क्या है? ${p1}`, emotion: "thoughtful", intent: "concept" },
          { id: "seg-4", speaker: "student", speakerName: "रिया", text: `जहाँ तक मुझे याद है, '${t1}' के अनुसार प्रक्रिया तभी संभव है जब मुख्य परिस्थितियाँ अनुकूल हों।`, emotion: "thoughtful", intent: "concept" },
          { id: "seg-5", speaker: "mentor", speakerName: mentorName, text: `शाबाश रिया! बिल्कुल सटीक। अब सवाल 2: जब हम '${h2}' देखते हैं, तो परिणाम पर क्या असर पड़ता है? ${p2}`, emotion: "insightful", intent: "concept" },
          { id: "seg-6", speaker: "student", speakerName: "रिया", text: `इसका मतलब दोनों पक्षों में संतुलन और दिशा का सीधा संबंध होता है।`, emotion: "curious", intent: "concept" },
          { id: "seg-7", speaker: "mentor", speakerName: mentorName, text: `अब वाइवा का गूगली सवाल—परीक्षक अक्सर '${h4}' में पूछते हैं: ${p4} यहाँ अधिकांश छात्र क्या गलती करते हैं?`, emotion: "thoughtful", intent: "exam_trap" },
          { id: "seg-8", speaker: "student", speakerName: "रिया", text: `वे सीमांत शर्तों को भूल जाते हैं! लेकिन अब मुझे स्पष्ट है। शानदार वाइवा सेशन रहा ${studentSalutation}!`, emotion: "energetic", intent: "summary" }
        );
      } else if (episodeType === "exam_booster") {
        docSegments.push(
          { id: "seg-1", speaker: "mentor", speakerName: mentorName, text: `विद्यार्थियों, यह आपका एग्ज़ाम-मॉर्निंग 1-पेज ऑडियो बूस्टर है। यदि 15 मिनट बाद आपकी परीक्षा है, तो '${topic}' से ये तीन बातें हर हाल में याद रखें!`, emotion: "energetic", intent: "intro" },
          { id: "seg-2", speaker: "student", speakerName: "रिया", text: `नमस्ते ${studentSalutation}! परीक्षा हॉल में जाने से पहले मुझे बस यह जानना है कि परीक्षक सबसे ज्यादा क्या पूछते हैं?`, emotion: "curious", intent: "doubt" },
          { id: "seg-3", speaker: "mentor", speakerName: mentorName, text: `नंबर 1: '${h1}' की मूल परिभाषा—${p1} उत्तर पुस्तिका में यह कीवर्ड ज़रूर लिखें!`, emotion: "insightful", intent: "concept" },
          { id: "seg-4", speaker: "student", speakerName: "रिया", text: `और नंबर 2, मुख्य सूत्र और अंतर में क्या याद रखना है?`, emotion: "curious", intent: "concept" },
          { id: "seg-5", speaker: "mentor", speakerName: mentorName, text: `नंबर 2: '${h2}' और '${h3}'—${p2} दोनों के प्रभाव बिल्कुल अलग हैं। और नंबर 3: आज की परीक्षा में होने वाली सबसे घातक गलती '${h4}' से बचें: ${p4}`, emotion: "thoughtful", intent: "exam_trap" },
          { id: "seg-6", speaker: "student", speakerName: "रिया", text: `गहरी सांस ली और आत्मविश्वास लौट आया! 3 मिनट में पूरा 1-पेज सारांश तैयार हो गया। धन्यवाद ${studentSalutation}!`, emotion: "energetic", intent: "summary" }
        );
      } else if (episodeType === "quick_revision") {
        docSegments.push(
          { id: "seg-1", speaker: "mentor", speakerName: mentorName, text: `नमस्ते रिया! परीक्षा पास है, तो आइए त्वरित गति से '${topic}' के मुख्य सिद्धांतों और सूत्रों को दोहराएं।`, emotion: "energetic", intent: "intro" },
          { id: "seg-2", speaker: "student", speakerName: "रिया", text: `तैयार हूँ ${studentSalutation}! सीधे मुख्य नियमों और परिभाषाओं से शुरुआत करते हैं।`, emotion: "curious", intent: "concept" },
          { id: "seg-3", speaker: "mentor", speakerName: mentorName, text: `पहला मुख्य बिंदु '${h1}': ${p1} इसे कभी न भूलें।`, emotion: "insightful", intent: "concept" },
          { id: "seg-4", speaker: "student", speakerName: "रिया", text: `और '${h2}' के प्रमुख भेद क्या हैं?`, emotion: "curious", intent: "concept" },
          { id: "seg-5", speaker: "mentor", speakerName: mentorName, text: `यहाँ याद रखें: ${p2} और तुलनात्मक दृष्टि से: ${p3}`, emotion: "thoughtful", intent: "concept" },
          { id: "seg-6", speaker: "student", speakerName: "रिया", text: `शानदार रिवीज़न! सभी प्रमुख बिंदु मात्र कुछ ही मिनटों में दोहरा लिए गए।`, emotion: "energetic", intent: "summary" }
        );
      } else {
        // exam_trap
        docSegments.push(
          { id: "seg-1", speaker: "mentor", speakerName: mentorName, text: `सावधान विद्यार्थियों! '${topic}' में परीक्षक अक्सर वे जाल बिछाते हैं जहाँ 80% छात्र आते हुए प्रश्न में भी गलती कर बैठते हैं।`, emotion: "energetic", intent: "intro" },
          { id: "seg-2", speaker: "student", speakerName: "रिया", text: `${studentSalutation}, इस अध्याय में सबसे घातक परीक्षा ट्रैप कौन सा है?`, emotion: "curious", intent: "doubt" },
          { id: "seg-3", speaker: "mentor", speakerName: mentorName, text: `सबसे बड़ा जाल '${h4}' में है: ${p4} छात्र जल्दबाजी में गलत विकल्प चुन लेते हैं।`, emotion: "thoughtful", intent: "exam_trap" },
          { id: "seg-4", speaker: "student", speakerName: "रिया", text: `इससे बचने का रक्षा कवच नियम क्या है?`, emotion: "curious", intent: "doubt" },
          { id: "seg-5", speaker: "mentor", speakerName: mentorName, text: `हमेशा दो चीजें जांचें: संदर्भ बिंदु और मुख्य शर्तों की पुष्टि। यह नियम याद रखें तो पूरे अंक पक्के हैं।`, emotion: "insightful", intent: "exam_trap" },
          { id: "seg-6", speaker: "student", speakerName: "रिया", text: `बहुत-बहुत धन्यवाद ${studentSalutation}! यह चेतावनी परीक्षा में हमारे कई अंक बचाएगी।`, emotion: "energetic", intent: "summary" }
        );
      }
    } else if (isEnglish) {
      if (episodeType === "rapid_viva") {
        docSegments.push(
          { id: "seg-1", speaker: "mentor", speakerName: mentorName, text: `Welcome Riya! Today we're running a Rapid Viva & Active Recall Quiz on '${topic}' (${subject}, ${grade}). Let's test your conceptual reflexes in 3 minutes!`, emotion: "energetic", intent: "intro" },
          { id: "seg-2", speaker: "student", speakerName: "Riya", text: `Ready ${studentSalutation}! Fire away with question number one!`, emotion: "curious", intent: "concept" },
          { id: "seg-3", speaker: "mentor", speakerName: mentorName, text: `Question 1: What is the fundamental condition for '${h1}' to hold true? ${p1}`, emotion: "insightful", intent: "concept" },
          { id: "seg-4", speaker: "student", speakerName: "Riya", text: `Based on '${t1}', the governing force must act along the line of action without internal dissipation.`, emotion: "thoughtful", intent: "concept" },
          { id: "seg-5", speaker: "mentor", speakerName: mentorName, text: `Spot on! Question 2: In '${h2}', how does the mechanism respond? ${p2}`, emotion: "thoughtful", intent: "analogy" },
          { id: "seg-6", speaker: "student", speakerName: "Riya", text: `It dictates the exact magnitude and ensures equilibrium across both ends!`, emotion: "insightful", intent: "concept" },
          { id: "seg-7", speaker: "mentor", speakerName: mentorName, text: `Final viva trap: Examiners love asking about '${h4}': ${p4} What's the catch?`, emotion: "thoughtful", intent: "exam_trap" },
          { id: "seg-8", speaker: "student", speakerName: "Riya", text: `People assume ideal conditions and neglect boundaries! That was a sharp viva recap. Thank you, ${mentorName}!`, emotion: "energetic", intent: "summary" }
        );
      } else if (episodeType === "exam_booster") {
        docSegments.push(
          { id: "seg-1", speaker: "mentor", speakerName: mentorName, text: `Good morning students! This is your Exam-Morning 1-Page Audio Booster on '${topic}'. If your exam starts soon, here are the non-negotiables!`, emotion: "energetic", intent: "intro" },
          { id: "seg-2", speaker: "student", speakerName: "Riya", text: `Morning ${studentSalutation}! Just give us the top 3 items paper-setters are guaranteed to ask today.`, emotion: "curious", intent: "doubt" },
          { id: "seg-3", speaker: "mentor", speakerName: mentorName, text: `Item 1: '${h1}' core definition: ${p1} Make sure this exact keyword appears in your first sentence.`, emotion: "insightful", intent: "concept" },
          { id: "seg-4", speaker: "student", speakerName: "Riya", text: `Noted! And what formula or distinction must we recite right now?`, emotion: "curious", intent: "concept" },
          { id: "seg-5", speaker: "mentor", speakerName: mentorName, text: `Item 2: Contrast in '${h2}': ${p2} And Item 3: Don't fall for '${h4}': ${p4} Check your sign conventions and units before handing in your sheet.`, emotion: "thoughtful", intent: "exam_trap" },
          { id: "seg-6", speaker: "student", speakerName: "Riya", text: `Deep breath taken, calm mind restored. That 3-minute 1-page booster gave me complete exam confidence. Let's do this!`, emotion: "energetic", intent: "summary" }
        );
      } else if (episodeType === "quick_revision") {
        docSegments.push(
          { id: "seg-1", speaker: "mentor", speakerName: mentorName, text: `Hey Riya! Let's power through a high-speed sprint revision of '${topic}' covering the vital principles and checklist. Ready?`, emotion: "energetic", intent: "intro" },
          { id: "seg-2", speaker: "student", speakerName: "Riya", text: `Ready ${studentSalutation}! Let's hit the core laws and governing definitions directly.`, emotion: "curious", intent: "concept" },
          { id: "seg-3", speaker: "mentor", speakerName: mentorName, text: `Core Rule #1 from '${h1}': ${p1}`, emotion: "insightful", intent: "concept" },
          { id: "seg-4", speaker: "student", speakerName: "Riya", text: `And what is the critical distinction we must keep in mind for '${h2}'?`, emotion: "curious", intent: "concept" },
          { id: "seg-5", speaker: "mentor", speakerName: mentorName, text: `Remember this contrast: ${p2} and ${p3}. Keep units and contextual assumptions verified!`, emotion: "thoughtful", intent: "concept" },
          { id: "seg-6", speaker: "student", speakerName: "Riya", text: `Crystal clear! Core definitions, mechanisms, and checklist completed in record time. Thank you, ${mentorName}!`, emotion: "energetic", intent: "summary" }
        );
      } else {
        // exam_trap
        docSegments.push(
          { id: "seg-1", speaker: "mentor", speakerName: mentorName, text: `Attention students! Today we are exposing the top examiner traps in '${topic}' where silly mistakes cost precious marks.`, emotion: "energetic", intent: "intro" },
          { id: "seg-2", speaker: "student", speakerName: "Riya", text: `Tell us ${studentSalutation}! What is the deadliest bait question set on this topic?`, emotion: "curious", intent: "doubt" },
          { id: "seg-3", speaker: "mentor", speakerName: mentorName, text: `The primary trap arises in '${h4}': ${p4} Examiners craft options based on intuitive misinterpretations.`, emotion: "thoughtful", intent: "exam_trap" },
          { id: "seg-4", speaker: "student", speakerName: "Riya", text: `How do we guard against falling for that deceptive option?`, emotion: "curious", intent: "doubt" },
          { id: "seg-5", speaker: "mentor", speakerName: mentorName, text: `Apply your 2-step verification rule: verify the reference frame and confirm boundary conditions before marking your answer.`, emotion: "insightful", intent: "exam_trap" },
          { id: "seg-6", speaker: "student", speakerName: "Riya", text: `That 2-step shield rule will save so many marks in our upcoming exams. Thank you, ${mentorName}!`, emotion: "energetic", intent: "summary" }
        );
      }
    } else {
      // Default: Hinglish
      if (episodeType === "rapid_viva") {
        docSegments.push(
          { id: "seg-1", speaker: "mentor", speakerName: mentorName, text: `Hey Riya! Chalo aaj '${topic}' par ek super energetic Rapid Viva & Quiz karte hain. Agle 3 minute me conceptual active recall test hoga!`, emotion: "energetic", intent: "intro" },
          { id: "seg-2", speaker: "student", speakerName: "Riya", text: `Ekdum ready ${studentSalutation.toLowerCase()}! First question shoot kijiye!`, emotion: "curious", intent: "concept" },
          { id: "seg-3", speaker: "mentor", speakerName: mentorName, text: `Viva Question 1: '${h1}' ka fundamental governing law kya bolta hai? ${p1}`, emotion: "insightful", intent: "concept" },
          { id: "seg-4", speaker: "student", speakerName: "Riya", text: `Seedha rule hai: '${t1}' ke hisaab se force tabhi balance hoti hai jab opposite direction me interaction ho!`, emotion: "thoughtful", intent: "concept" },
          { id: "seg-5", speaker: "mentor", speakerName: mentorName, text: `Perfect! Ab question 2: Jab hum '${h2}' par aate hain, toh key distinction kya hai? ${p2}`, emotion: "thoughtful", intent: "concept" },
          { id: "seg-6", speaker: "student", speakerName: "Riya", text: `Dono sides ke driving forces aur consequences bilkul alag hain, isliye inke units aur signs ko dhyaan rakhna padega!`, emotion: "insightful", intent: "concept" },
          { id: "seg-7", speaker: "mentor", speakerName: mentorName, text: `Ab viva examiner ka favourite trap—'${h4}': ${p4} Yahan bache kya mistake karte hain?`, emotion: "thoughtful", intent: "exam_trap" },
          { id: "seg-8", speaker: "student", speakerName: "Riya", text: `Bache superficial formula apply karke boundary condition miss kar dete hain! Rapid viva ne saare doubts clear kar diye, thanks ${mentorName}!`, emotion: "energetic", intent: "summary" }
        );
      } else if (episodeType === "exam_booster") {
        docSegments.push(
          { id: "seg-1", speaker: "mentor", speakerName: mentorName, text: `Students, ye hai aapka Exam-Morning 1-Page Audio Booster—एग्ज़ाम डे बूस्टर! Agar exam hall me enter hone me 15 minute bache hain, toh '${topic}' ka 80/20 summary suno!`, emotion: "energetic", intent: "intro" },
          { id: "seg-2", speaker: "student", speakerName: "Riya", text: `Good morning ${studentSalutation.toLowerCase()}! Bas top 3 points bata dijiye jo paper-setters pakka puchte hain!`, emotion: "curious", intent: "doubt" },
          { id: "seg-3", speaker: "mentor", speakerName: mentorName, text: `Point 1: '${h1}' ki core definition aur formula—${p1} Ye answer sheet me pehli line me aana chahiye!`, emotion: "insightful", intent: "concept" },
          { id: "seg-4", speaker: "student", speakerName: "Riya", text: `Got it! Aur comparison me kya dhyan rakhna hai?`, emotion: "curious", intent: "concept" },
          { id: "seg-5", speaker: "mentor", speakerName: mentorName, text: `Point 2: '${h2}' vs '${h3}'—${p2} Aur Point 3: Deadly trap '${h4}' se bacho: ${p4} Units aur sign cross-check kiye bina answer lock mat karna!`, emotion: "thoughtful", intent: "exam_trap" },
          { id: "seg-6", speaker: "student", speakerName: "Riya", text: `Pura chapter 3 minute me summarize ho gaya! Mind relaxed aur confident hai. All the best to everyone!`, emotion: "energetic", intent: "summary" }
        );
      } else if (episodeType === "quick_revision") {
        docSegments.push(
          { id: "seg-1", speaker: "mentor", speakerName: mentorName, text: `Hey Riya aur dosto! Exam sar par hai, toh agle kuch minute me '${topic}' ka pura high-speed recap complete karte hain! Ready?`, emotion: "energetic", intent: "intro" },
          { id: "seg-2", speaker: "student", speakerName: "Riya", text: `Ekdum ready ${studentSalutation.toLowerCase()}! Seedha core definitions aur key points se shuru karte hain!`, emotion: "curious", intent: "concept" },
          { id: "seg-3", speaker: "mentor", speakerName: mentorName, text: `Rule number one from '${h1}': ${p1} Isko directly recall karo.`, emotion: "insightful", intent: "concept" },
          { id: "seg-4", speaker: "student", speakerName: "Riya", text: `Aur '${h2}' ke comparative distinctions me kya yaad rakhna hai?`, emotion: "curious", intent: "concept" },
          { id: "seg-5", speaker: "mentor", speakerName: mentorName, text: `Ye bullet formula yaad rakho: ${p2} aur comparison me: ${p3}`, emotion: "thoughtful", intent: "concept" },
          { id: "seg-6", speaker: "student", speakerName: "Riya", text: `Super fast aur high-yield! '${topic}' ke saare vital points under few minutes pack ho gaye!`, emotion: "energetic", intent: "summary" }
        );
      } else {
        // exam_trap
        docSegments.push(
          { id: "seg-1", speaker: "mentor", speakerName: mentorName, text: `Alert students! Aaj hum '${topic}' ke un top tricky questions ko expose kar rahe hain jahan 80% students silly mistakes karte hain!`, emotion: "energetic", intent: "intro" },
          { id: "seg-2", speaker: "student", speakerName: "Riya", text: `${studentSalutation}, is topic me examiners ka favourite trap question kaunsa hota hai?`, emotion: "curious", intent: "doubt" },
          { id: "seg-3", speaker: "mentor", speakerName: mentorName, text: `Sabse deadly trap '${h4}' se aata hai: ${p4} Examiner jaan-boojhkar misleading option deta hai jo intuitively sahi lagta hai par technical conditions violate karta hai!`, emotion: "thoughtful", intent: "exam_trap" },
          { id: "seg-4", speaker: "student", speakerName: "Riya", text: `Is trap se bachne ka thumb rule kya hai ${studentSalutation.toLowerCase()}?`, emotion: "curious", intent: "doubt" },
          { id: "seg-5", speaker: "mentor", speakerName: mentorName, text: `Hamara 2-step verification shield: option lock karne se pehle governing assumptions aur units cross-check karo. Negative marking se bach jaoge!`, emotion: "insightful", intent: "exam_trap" },
          { id: "seg-6", speaker: "student", speakerName: "Riya", text: `Superb advice ${studentSalutation.toLowerCase()}! Ye shield rule exam me negative marks se bachayega. Thank you!`, emotion: "energetic", intent: "summary" }
        );
      }
    }

    const episodeTitle = episodeType === "rapid_viva"
      ? `${topic}: Rapid Viva & Active Recall Quiz (${resolvedDurationMins}m)`
      : episodeType === "exam_booster"
      ? `${topic}: Exam-Morning 1-Page Booster (${resolvedDurationMins}m)`
      : episodeType === "quick_revision"
      ? `${topic}: ${resolvedDurationMins}-Minute Quick Recap & Formula Blitz`
      : `${topic}: Top Exam Traps & Silly Mistakes Alert (${resolvedDurationMins}m)`;

    const hindiTitle = episodeType === "rapid_viva"
      ? `${topic}: रैपिड वाइवा व क्विज़ (${resolvedDurationMins} मिनट)`
      : episodeType === "exam_booster"
      ? `${topic}: एग्ज़ाम डे 1-पेज बूस्टर (${resolvedDurationMins} मिनट)`
      : episodeType === "quick_revision"
      ? `${topic}: त्वरित रिवीज़न (${resolvedDurationMins} मिनट)`
      : `${topic}: परीक्षा ट्रैप्स व सावधानियाँ (${resolvedDurationMins} मिनट)`;

    return {
      id,
      topic,
      title: episodeTitle,
      hindiTitle,
      subject,
      grade,
      language,
      episodeType,
      durationEstimateSec: procDurationSec,
      hosts: {
        mentor: {
          id: "mentor",
          name: mentorName,
          title: mentorTitle,
          avatar: mentorAvatar,
          voiceGender: mentorGender,
          role: episodeType === "exam_trap" ? "Exam Strategy Lead" : episodeType === "quick_revision" ? "Sprint Revision Mentor" : "Lead Concept Explainer",
        },
        student: {
          id: "student",
          name: isHindi ? "रिया" : "Riya",
          title: isHindi ? "जिज्ञासु छात्रा" : "Curious Student",
          avatar: "👩‍🎓",
          voiceGender: "female",
          role: episodeType === "exam_trap" ? "Alert Co-host" : episodeType === "quick_revision" ? "Fast-Paced Co-host" : "Co-host & Doubt Raiser",
        },
      },
      overview: `${mentorName} and Riya unpack '${topic}' (${subject}), exploring core mechanisms, chapter principles, comparative distinctions, and exam readiness.`,
      keyTakeaways: [
        `${topic}: Core definitions and foundational mechanisms (${h1}).`,
        `Key comparative distinctions and real-world applications (${h2} vs ${h3}).`,
        `Examiner traps and high-yield revision checklist (${h4}).`,
      ],
      segments: docSegments,
    };
  }

  // =========================================================================
  // 1. HINDI PROCEDURAL SCRIPTS (Mode-Specific)
  // =========================================================================
  if (isHindi) {
    if (episodeType === "quick_revision") {
      return {
        id,
        topic,
        title: `${topic}: ${resolvedDurationMins} मिनट त्वरित रिवीज़न और सूत्र`,
        hindiTitle: `${topic}: त्वरित रिवीज़न (${resolvedDurationMins} मिनट)`,
        subject,
        grade,
        language: "Hindi",
        episodeType: "quick_revision",
        durationEstimateSec: procDurationSec,
        hosts: {
          mentor: {
            id: "mentor",
            name: mentorName,
            title: mentorTitle,
            avatar: mentorAvatar,
            voiceGender: mentorGender,
            role: "रिवीज़न मेंटर",
          },
          student: {
            id: "student",
            name: "रिया",
            title: "जिज्ञासु छात्रा",
            avatar: "👩‍🎓",
            voiceGender: "female",
            role: "त्वरित सह-होस्ट",
          },
        },
        overview: `${mentorName} और रिया का यह 2-मिनट का त्वरित पॉडकास्ट '${topic}' के सभी मुख्य सूत्र, नियम और रिवीज़न चेकलिस्ट को तेज़ी से दोहराता है।`,
        keyTakeaways: [
          `${topic} की संक्षिप्त परिभाषा और मुख्य नियम।`,
          "परीक्षा में प्रयोग होने वाले आवश्यक सूत्र और मात्रक (SI Units)।",
          "परीक्षा पूर्व 3-बिंदु त्वरित चेकलिस्ट।",
        ],
        segments: [
          {
            id: "seg-1",
            speaker: "mentor",
            speakerName: mentorName,
            text: `नमस्ते रिया और प्यारे विद्यार्थियों! परीक्षा का समय निकट है, इसलिए आज हम केवल 2 मिनट में '${topic}' के सभी आवश्यक सूत्र और नियम दोहराएंगे। तैयार हो रिया?`,
            emotion: "energetic",
            intent: "intro",
          },
          {
            id: "seg-2",
            speaker: "student",
            speakerName: "रिया",
            text: `बिल्कुल तैयार ${studentSalutation}! सीधे मुख्य सूत्र और नियमों से शुरुआत करते हैं।`,
            emotion: "curious",
            intent: "concept",
          },
          {
            id: "seg-3",
            speaker: "mentor",
            speakerName: mentorName,
            text: `पहला नियम: '${topic}' में मूल समीकरण और संबंध याद रखें। गणना करते समय हमेशा मानक SI मात्रक और दिशा का विशेष ध्यान रखें।`,
            emotion: "insightful",
            intent: "concept",
          },
          {
            id: "seg-4",
            speaker: "student",
            speakerName: "रिया",
            text: `समझ गई ${studentSalutation}! और इसकी सीमाएँ क्या हैं? यह नियम किन परिस्थितियों में लागू होता है?`,
            emotion: "curious",
            intent: "concept",
          },
          {
            id: "seg-5",
            speaker: "mentor",
            speakerName: mentorName,
            text: `बहुत बढ़िया प्रश्न! यह नियम केवल तभी मान्य है जब बाह्य व्यवधान नगण्य हों। परीक्षा में प्रश्न पढ़ते समय हमेशा मान्यताओं की पुष्टि करें।`,
            emotion: "thoughtful",
            intent: "concept",
          },
          {
            id: "seg-6",
            speaker: "student",
            speakerName: "रिया",
            text: `शानदार त्वरित रिवीज़न ${studentSalutation}! नियम, सूत्र, मात्रक और शर्तें—सब कुछ 2 मिनट में स्पष्ट हो गया। धन्यवाद!`,
            emotion: "energetic",
            intent: "summary",
          },
        ],
      };
    }

    if (episodeType === "exam_trap") {
      return {
        id,
        topic,
        title: `${topic}: परीक्षा में होने वाली बड़ी गलतियाँ और ट्रैप्स (${resolvedDurationMins} मिनट)`,
        hindiTitle: `${topic}: परीक्षा ट्रैप्स व सावधानियाँ`,
        subject,
        grade,
        language: "Hindi",
        episodeType: "exam_trap",
        durationEstimateSec: procDurationSec,
        hosts: {
          mentor: {
            id: "mentor",
            name: mentorName,
            title: mentorTitle,
            avatar: mentorAvatar,
            voiceGender: mentorGender,
            role: "परीक्षा विशेषज्ञ",
          },
          student: {
            id: "student",
            name: "रिया",
            title: "जिज्ञासु छात्रा",
            avatar: "👩‍🎓",
            voiceGender: "female",
            role: "सजग सह-होस्ट",
          },
        },
        overview: `${mentorName} और रिया इस एपिसोड में '${topic}' के उन पेचीदा सवालों और परीक्षा ट्रैप्स को उजागर कर रहे हैं जहाँ 80% छात्र अंक गँवाते हैं।`,
        keyTakeaways: [
          `परीक्षक द्वारा '${topic}' में बनाए जाने वाले भ्रामक बहुविकल्पीय जाल।`,
          "चिह्न परिपाटी और दिशा संबंधी सबसे सामान्य भूल।",
          "ऋणात्मक अंकन से बचने का 2-चरणीय सत्यापन नियम।",
        ],
        segments: [
          {
            id: "seg-1",
            speaker: "mentor",
            speakerName: mentorName,
            text: `सावधान विद्यार्थियों! आज हम '${topic}' के उन गंभीर ट्रैप्स की बात करेंगे जहाँ 80% छात्र आते हुए प्रश्न में भी सिली मिस्टेक कर बैठते हैं!`,
            emotion: "energetic",
            intent: "intro",
          },
          {
            id: "seg-2",
            speaker: "student",
            speakerName: "रिया",
            text: `${studentSalutation}, इस अध्याय में सबसे घातक ट्रैप कौन सा है जहाँ छात्र अक्सर उलझते हैं?`,
            emotion: "curious",
            intent: "doubt",
          },
          {
            id: "seg-3",
            speaker: "mentor",
            speakerName: mentorName,
            text: `सबसे बड़ा ट्रैप: बहुविकल्पीय प्रश्नों में परीक्षक जानबूझकर वह विकल्प पहले रखता है जो जल्दबाजी में गलत गणना से आता है—जैसे दिशा या चिह्न की उपेक्षा करना!`,
            emotion: "thoughtful",
            intent: "exam_trap",
          },
          {
            id: "seg-4",
            speaker: "student",
            speakerName: "रिया",
            text: `अरे हाँ ${studentSalutation}! मैं भी अक्सर पहला मिलता-जुलता विकल्प देखकर टिक कर देती हूँ और बाद में पता चलता है कि माइनस साइन छूट गया था!`,
            emotion: "curious",
            intent: "doubt",
          },
          {
            id: "seg-5",
            speaker: "mentor",
            speakerName: mentorName,
            text: `बिल्कुल! हमारा रक्षा कवच नियम याद रखें: उत्तर मार्क करने से पहले दो बातें जांचें—(1) मात्रक रूपांतरण और (2) संदर्भ बिंदु (Reference Frame)।`,
            emotion: "insightful",
            intent: "exam_trap",
          },
          {
            id: "seg-6",
            speaker: "student",
            speakerName: "रिया",
            text: `यह नियम हमेशा याद रखूँगी ${studentSalutation}! अब '${topic}' में कोई सिली मिस्टेक नहीं होगी। बहुत-बहुत आभार!`,
            emotion: "energetic",
            intent: "summary",
          },
        ],
      };
    }

    // Default: deep_dive in Hindi
    return {
      id,
      topic,
      title: `${topic}: ऑडियो डीप डाइव और गहन अवधारणा`,
      hindiTitle: `${topic}: 2-होस्ट ऑडियो अवलोकन`,
      subject,
      grade,
      language: "Hindi",
      episodeType: "deep_dive",
      durationEstimateSec: procDurationSec,
      hosts: {
        mentor: {
          id: "mentor",
          name: mentorName,
          title: mentorTitle,
          avatar: mentorAvatar,
          voiceGender: mentorGender,
          role: "अवधारणा व्याख्याता",
        },
        student: {
          id: "student",
          name: "रिया",
          title: "जिज्ञासु छात्रा",
          avatar: "👩‍🎓",
          voiceGender: "female",
          role: "शंका समाधान एवं सह-होस्ट",
        },
      },
      overview: `इस 2-होस्ट ऑडियो पॉडकास्ट में ${mentorName} और रिया ${topic} की मूल अवधारणा, वास्तविक जीवन के उदाहरण और गहराई से समझ का विश्लेषण कर रहे हैं।`,
      keyTakeaways: [
        `${topic} की बुनियादी परिभाषा और इसका भौतिक महत्व।`,
        "आम तौर पर छात्र जहाँ उलझते हैं, उस भ्रांति का निवारण।",
        "परीक्षा के प्रश्नों में सही सूत्र और इकाई का प्रयोग।",
      ],
      segments: [
        {
          id: "seg-1",
          speaker: "mentor",
          speakerName: mentorName,
          text: `नमस्ते दोस्तों! चेरी एआई डीप डाइव पॉडकास्ट में आपका स्वागत है। आज हम जिस विषय पर चर्चा करने वाले हैं, वह है '${topic}'। यह सुनने में जितना सीधा लगता है, परीक्षाओं में अक्सर छात्र इसमें सबसे ज्यादा गलतियाँ करते हैं।`,
          emotion: "energetic",
          intent: "intro",
        },
        {
          id: "seg-2",
          speaker: "student",
          speakerName: "रिया",
          text: `प्रणाम ${studentSalutation}! बिल्कुल सही कहा आपने। जब भी हम ${topic} के प्रश्न हल करने बैठते हैं, तो लगता तो है कि सब समझ आ गया, पर न्यूमेरिकल्स में अक्सर दिशा या इकाई को लेकर भ्रम हो जाता है।`,
          emotion: "curious",
          intent: "doubt",
        },
        {
          id: "seg-3",
          speaker: "mentor",
          speakerName: mentorName,
          text: `रिया, इसका मुख्य कारण यह है कि अधिकांश विद्यार्थी केवल परिभाषा रट लेते हैं, पर उसके पीछे का 'भौतिक कारण' महसूस नहीं करते। जैसे जब हम किसी वस्तु पर बल लगाते हैं, तो वह बल अकेला कभी नहीं होता, वह सदैव युग्म में उपस्थित होता है।`,
          emotion: "insightful",
          intent: "concept",
        },
        {
          id: "seg-4",
          speaker: "student",
          speakerName: "रिया",
          text: `${studentSalutation}, तो क्या इसका मतलब यह हुआ कि यदि दोनों प्रभाव परिमाण में बराबर और विपरीत दिशा में हैं, तो वे एक-दूसरे को निरस्त क्यों नहीं करते?`,
          emotion: "curious",
          intent: "doubt",
        },
        {
          id: "seg-5",
          speaker: "mentor",
          speakerName: mentorName,
          text: `अद्भुत सवाल! यही तो इस अध्याय का सबसे बड़ा मर्म है: दोनों प्रभाव एक ही वस्तु पर नहीं, बल्कि दो अलग-अलग वस्तुओं या स्वतंत्र निर्देशांकों पर कार्य करते हैं। जब वस्तुएं ही अलग हैं, तो प्रभाव निरस्त कैसे होंगे?`,
          emotion: "thoughtful",
          intent: "analogy",
        },
        {
          id: "seg-6",
          speaker: "student",
          speakerName: "रिया",
          text: `ओह! अब समझ आया ${studentSalutation}! क्योंकि कार्य-बिंदु दो भिन्न पिंडों पर होता है, इसलिए दोनों का अपना स्वतंत्र प्रभाव होता है।`,
          emotion: "insightful",
          intent: "concept",
        },
        {
          id: "seg-7",
          speaker: "mentor",
          speakerName: mentorName,
          text: `बिल्कुल सही! और परीक्षा में जब भी प्रश्न आए, हमेशा पहले यह देखना कि किस पिंड पर कौन सा बल या प्रभाव कार्य कर रहा है।`,
          emotion: "friendly",
          intent: "concept",
        },
        {
          id: "seg-8",
          speaker: "student",
          speakerName: "रिया",
          text: `बहुत-बहुत धन्यवाद ${studentSalutation}! आज इस ऑडियो में ${topic} का पूरा भ्रम दूर हो गया।`,
          emotion: "energetic",
          intent: "summary",
        },
      ],
    };
  }

  // =========================================================================
  // 2. ENGLISH PROCEDURAL SCRIPTS (Mode-Specific)
  // =========================================================================
  if (isEnglish) {
    if (episodeType === "quick_revision") {
      return {
        id,
        topic,
        title: `${topic}: ${resolvedDurationMins}-Minute Quick Recap & Formula Blitz`,
        hindiTitle: `${topic}: Quick Recap (${resolvedDurationMins}m)`,
        subject,
        grade,
        language: "English",
        episodeType: "quick_revision",
        durationEstimateSec: procDurationSec,
        hosts: {
          mentor: {
            id: "mentor",
            name: mentorName,
            title: mentorTitle,
            avatar: mentorAvatar,
            voiceGender: mentorGender,
            role: "Sprint Revision Mentor",
          },
          student: {
            id: "student",
            name: "Riya",
            title: "Curious Student",
            avatar: "👩‍🎓",
            voiceGender: "female",
            role: "Fast-Paced Co-host",
          },
        },
        overview: `A high-tempo 2-minute audio sprint between ${mentorName} and Riya covering the core definitions, governing formulas, SI units, and conditions of ${topic}.`,
        keyTakeaways: [
          `Concise 1-sentence foundational rule of ${topic}.`,
          "Essential mathematical formulas, variables, and SI units.",
          "Rapid 3-point checklist for last-minute exam readiness.",
        ],
        segments: [
          {
            id: "seg-1",
            speaker: "mentor",
            speakerName: mentorName,
            text: `Hey Riya and everyone! Exam is around the corner, so in the next 2 minutes we are blasting through the core laws, formulas, and checklist for ${topic}. Ready?`,
            emotion: "energetic",
            intent: "intro",
          },
          {
            id: "seg-2",
            speaker: "student",
            speakerName: "Riya",
            text: `Ready ${studentSalutation.toLowerCase()}! Let's get right into the essential governing equations and definitions.`,
            emotion: "curious",
            intent: "concept",
          },
          {
            id: "seg-3",
            speaker: "mentor",
            speakerName: mentorName,
            text: `Core rule: in ${topic}, always write down your governing formula first, ensure all quantities are in SI units, and pay strict attention to vector signs.`,
            emotion: "insightful",
            intent: "concept",
          },
          {
            id: "seg-4",
            speaker: "student",
            speakerName: "Riya",
            text: `Got it! And what is the single most important condition of applicability we must verify?`,
            emotion: "curious",
            intent: "concept",
          },
          {
            id: "seg-5",
            speaker: "mentor",
            speakerName: mentorName,
            text: `Crucial point: this formulation only holds strictly under ideal assumptions where external dissipation is accounted for. Always confirm the boundary conditions!`,
            emotion: "thoughtful",
            intent: "concept",
          },
          {
            id: "seg-6",
            speaker: "student",
            speakerName: "Riya",
            text: `Crystal clear! Law, formula, SI units, and boundary conditions locked in under 2 minutes. Thank you, ${mentorName}!`,
            emotion: "energetic",
            intent: "summary",
          },
        ],
      };
    }

    if (episodeType === "exam_trap") {
      return {
        id,
        topic,
        title: `${topic}: Top Exam Traps & Silly Mistakes Shield (${resolvedDurationMins}m)`,
        hindiTitle: `${topic}: Exam Traps`,
        subject,
        grade,
        language: "English",
        episodeType: "exam_trap",
        durationEstimateSec: procDurationSec,
        hosts: {
          mentor: {
            id: "mentor",
            name: mentorName,
            title: mentorTitle,
            avatar: mentorAvatar,
            voiceGender: mentorGender,
            role: "Exam Strategy Lead",
          },
          student: {
            id: "student",
            name: "Riya",
            title: "Curious Student",
            avatar: "👩‍🎓",
            voiceGender: "female",
            role: "Alert Co-host",
          },
        },
        overview: `A forensic exam-trap breakdown by ${mentorName} and Riya exposing deceptive multiple-choice questions, bait options, and foolproof marks-saving rules for ${topic}.`,
        keyTakeaways: [
          `The #1 deceptive multiple-choice trap examiners set on ${topic}.`,
          "Why sign conventions and coordinate frame blunders cause negative marking.",
          "The 2-step verification shield to guarantee zero marks lost.",
        ],
        segments: [
          {
            id: "seg-1",
            speaker: "mentor",
            speakerName: mentorName,
            text: `Attention students! Today we are dissecting the sneakiest exam traps in ${topic} where 80% of candidates lose marks on questions they thought they solved correctly.`,
            emotion: "energetic",
            intent: "intro",
          },
          {
            id: "seg-2",
            speaker: "student",
            speakerName: "Riya",
            text: `Tell us ${studentSalutation.toLowerCase()}! What is the single biggest trap examiners lay in competitive and board exams?`,
            emotion: "curious",
            intent: "doubt",
          },
          {
            id: "seg-3",
            speaker: "mentor",
            speakerName: mentorName,
            text: `The primary trap: examiners deliberately craft multiple-choice options containing the exact intermediate value you get when you forget a sign convention or direction!`,
            emotion: "thoughtful",
            intent: "exam_trap",
          },
          {
            id: "seg-4",
            speaker: "student",
            speakerName: "Riya",
            text: `That is so sneaky! You see your calculated number in Option A, feel relieved, tick it, and immediately walk right into negative marking!`,
            emotion: "curious",
            intent: "doubt",
          },
          {
            id: "seg-5",
            speaker: "mentor",
            speakerName: mentorName,
            text: `Exactly. Here is your Trap Shield rule: before finalizing your answer, check two things: (1) Is the reference frame consistent, and (2) did you convert non-SI units?`,
            emotion: "insightful",
            intent: "exam_trap",
          },
          {
            id: "seg-6",
            speaker: "student",
            speakerName: "Riya",
            text: `That 2-step shield rule will save so many marks in our upcoming exams. Thank you, ${mentorName}!`,
            emotion: "energetic",
            intent: "summary",
          },
        ],
      };
    }

    // Default: deep_dive in English
    return {
      id,
      topic,
      title: `${topic}: Deep Dive & Misconceptions Debunked (${resolvedDurationMins}m)`,
      hindiTitle: `${topic}: Audio Overview`,
      subject,
      grade,
      language: "English",
      episodeType: "deep_dive",
      durationEstimateSec: procDurationSec,
      hosts: {
        mentor: {
          id: "mentor",
          name: mentorName,
          title: mentorTitle,
          avatar: mentorAvatar,
          voiceGender: mentorGender,
          role: "Lead Concept Explainer",
        },
        student: {
          id: "student",
          name: "Riya",
          title: "Curious Student",
          avatar: "👩‍🎓",
          voiceGender: "female",
          role: "Co-host & Doubt Raiser",
        },
      },
      overview: `An engaging 2-speaker audio deep dive between ${mentorName} and Riya unravelling the foundational intuition, physical analogies, and conceptual mental models of ${topic}.`,
      keyTakeaways: [
        `Core definition and intuitive physical framework of ${topic}.`,
        "Why standard intuitive assumptions often fail without first-principles reasoning.",
        "Surgical mental checklist for solving numericals with deep intuition.",
      ],
      segments: [
        {
          id: "seg-1",
          speaker: "mentor",
          speakerName: mentorName,
          text: `Hey everyone, welcome back to the Cherry AI Audio Deep Dive. Today we are breaking down a topic that sounds deceivingly straightforward on paper, but has deep conceptual beauty—${topic}!`,
          emotion: "energetic",
          intent: "intro",
        },
        {
          id: "seg-2",
          speaker: "student",
          speakerName: "Riya",
          text: `Glad we are tackling this, ${studentSalutation.toLowerCase()}! Because whenever I look at ${topic} in my textbook, the theorem seems clear, but the moment I encounter a twist in an application, my intuition starts second-guessing itself.`,
          emotion: "curious",
          intent: "doubt",
        },
        {
          id: "seg-3",
          speaker: "mentor",
          speakerName: mentorName,
          text: `That happens to almost every dedicated student, Riya. The root reason is that most textbooks jump straight to formulas without anchoring the physical mental model. Let's build that intuition first.`,
          emotion: "insightful",
          intent: "concept",
        },
        {
          id: "seg-4",
          speaker: "student",
          speakerName: "Riya",
          text: `Let's do it! So ${studentSalutation.toLowerCase()}, what is the single biggest contradiction or confusion that students stumble on here?`,
          emotion: "curious",
          intent: "doubt",
        },
        {
          id: "seg-5",
          speaker: "mentor",
          speakerName: mentorName,
          text: `The core misconception: students assume opposing effects cancel each other out in equilibrium. But remember: interactions that act on two different bodies or independent coordinate frames can NEVER cancel each other!`,
          emotion: "thoughtful",
          intent: "analogy",
        },
        {
          id: "seg-6",
          speaker: "student",
          speakerName: "Riya",
          text: `Aha! Because they act on two distinct entities! That immediately clarifies why response happens on the system level.`,
          emotion: "insightful",
          intent: "concept",
        },
        {
          id: "seg-7",
          speaker: "mentor",
          speakerName: mentorName,
          text: `Spot on. So when you sit for your exam, always isolate your Free Body Diagram or governing equation for ONE specific object at a time. Do not mix interactions.`,
          emotion: "friendly",
          intent: "concept",
        },
        {
          id: "seg-8",
          speaker: "student",
          speakerName: "Riya",
          text: `That is such a clean, memorable takeaway. Thank you so much, ${mentorName}!`,
          emotion: "energetic",
          intent: "summary",
        },
      ],
    };
  }

  // =========================================================================
  // 3. HINGLISH PROCEDURAL SCRIPTS (Mode-Specific - Default)
  // =========================================================================
  if (episodeType === "quick_revision") {
    return {
      id,
      topic,
      title: `${topic}: 2-Minute Quick Recap & Formula Blitz`,
      hindiTitle: `${topic}: त्वरित रिवीज़न`,
      subject,
      grade,
      language: "Hinglish",
      episodeType: "quick_revision",
      durationEstimateSec: procDurationSec,
      hosts: {
        mentor: {
          id: "mentor",
          name: mentorName,
          title: mentorTitle,
          avatar: mentorAvatar,
          voiceGender: mentorGender,
          role: "Sprint Revision Mentor",
        },
        student: {
          id: "student",
          name: "Riya",
          title: "Curious Student",
          avatar: "👩‍🎓",
          voiceGender: "female",
          role: "Quick Recap Co-host",
        },
      },
      overview: `${mentorName} aur Riya ka ye 2-minute high-tempo audio recap '${topic}' ke sabhi core formulas, SI units aur instant exam rules ko bullet speed me revise karata hai.`,
      keyTakeaways: [
        `${topic} ka 1-line crisp definition aur core law.`,
        "Must-know governing formulas aur SI unit checkpoints.",
        "Exam hall me use hone wali 2-minute memory checklist.",
      ],
      segments: [
        {
          id: "seg-1",
          speaker: "mentor",
          speakerName: mentorName,
          text: `Hey Riya aur dosto! Exam sar par hai, toh chalo agle 2 minute me '${topic}' ka pura rapid-fire formula aur key concepts recap complete karte hain! Ready?`,
          emotion: "energetic",
          intent: "intro",
        },
        {
          id: "seg-2",
          speaker: "student",
          speakerName: "Riya",
          text: `Ekdum ready ${studentSalutation.toLowerCase()}! Seedha core law aur formula blitz se shuru karte hain!`,
          emotion: "curious",
          intent: "concept",
        },
        {
          id: "seg-3",
          speaker: "mentor",
          speakerName: mentorName,
          text: `Rule number one: '${topic}' me hamesha core definition aur governing equation ko recall karo. Sabhi quantities ko SI units me convert karna aur sign convention dekhna mandatory hai!`,
          emotion: "insightful",
          intent: "concept",
        },
        {
          id: "seg-4",
          speaker: "student",
          speakerName: "Riya",
          text: `Got it ${studentSalutation.toLowerCase()}! Aur iski validity conditions kya hain? Ye formula har jagah directly apply hota hai ya koi constraint hai?`,
          emotion: "curious",
          intent: "concept",
        },
        {
          id: "seg-5",
          speaker: "mentor",
          speakerName: mentorName,
          text: `Super important question! Ye formula ideal assumptions ke sath valid hota hai. Agar question me boundary conditions ya dissipation mention hai, toh value accordingly adjust hogi.`,
          emotion: "thoughtful",
          intent: "concept",
        },
        {
          id: "seg-6",
          speaker: "student",
          speakerName: "Riya",
          text: `Awesome rapid recap ${studentSalutation.toLowerCase()}! Law, formula, units aur conditions—sab kuch under 2 minutes me pack ho gaya!`,
          emotion: "energetic",
          intent: "summary",
        },
      ],
    };
  }

  if (episodeType === "exam_trap") {
    return {
      id,
      topic,
      title: `${topic}: Top Exam Traps & Silly Mistakes Alert (${resolvedDurationMins}m)`,
      hindiTitle: `${topic}: परीक्षा ट्रैप्स व सावधानियाँ`,
      subject,
      grade,
      language: "Hinglish",
      episodeType: "exam_trap",
      durationEstimateSec: procDurationSec,
      hosts: {
        mentor: {
          id: "mentor",
          name: mentorName,
          title: mentorTitle,
          avatar: mentorAvatar,
          voiceGender: mentorGender,
          role: "Exam Strategy Anchor",
        },
        student: {
          id: "student",
          name: "Riya",
          title: "Curious Student",
          avatar: "👩‍🎓",
          voiceGender: "female",
          role: "Alert Co-host",
        },
      },
      overview: `${mentorName} aur Riya is forensic audio overview me '${topic}' ke un tricky questions aur examiner traps ko expose kar rahe hain jahan 80% students silly mistakes karte hain.`,
      keyTakeaways: [
        `Examiners ka banaya hua #1 deceptive trap question '${topic}' me.`,
        "Sign conventions aur coordinate axes ki silly mistakes se bachne ka tarika.",
        "Negative marking se bachne ka 2-step verification thumb rule.",
      ],
      segments: [
        {
          id: "seg-1",
          speaker: "mentor",
          speakerName: mentorName,
          text: `Attention Riya aur sabhi students! '${topic}' par examiners aise sneaky trap questions banate hain jahan 80% bache bina soche negative marks le aate hain!`,
          emotion: "energetic",
          intent: "intro",
        },
        {
          id: "seg-2",
          speaker: "student",
          speakerName: "Riya",
          text: `Wait ${studentSalutation.toLowerCase()}, really? Aise kaun se questions hain jahan sabse zyada silly mistakes hoti hain?`,
          emotion: "curious",
          intent: "doubt",
        },
        {
          id: "seg-3",
          speaker: "mentor",
          speakerName: mentorName,
          text: `Trap number one: Multiple choice questions me examiner wo option pehle rakhta hai jo aam calculation error se aata hai—jaise sign convention bhoolna ya reference frame galat lena!`,
          emotion: "thoughtful",
          intent: "exam_trap",
        },
        {
          id: "seg-4",
          speaker: "student",
          speakerName: "Riya",
          text: `Arey haan! Main bhi aksar pehla milta-julta option tick karke khush ho jati hu, aur baad me pata chalta hai ki minus sign missing tha!`,
          emotion: "curious",
          intent: "doubt",
        },
        {
          id: "seg-5",
          speaker: "mentor",
          speakerName: mentorName,
          text: `Aha! Yahi toh examiner ki bait hoti hai! Hamara 2-step Trap Shield yaad rakho: Answer lock karne se pehle (1) SI unit conversion check karo, aur (2) Direction aur boundary limits verify karo!`,
          emotion: "insightful",
          intent: "exam_trap",
        },
        {
          id: "seg-6",
          speaker: "student",
          speakerName: "Riya",
          text: `Ye 2-step shield rule yaad rakhungi ${studentSalutation.toLowerCase()}! Ab '${topic}' ke questions me zero negative marks! Thank you so much!`,
          emotion: "energetic",
          intent: "summary",
        },
      ],
    };
  }

  // Default: deep_dive in Hinglish
  return {
    id,
    topic,
    title: `${topic}: Deep Dive & Misconceptions Debunked (${resolvedDurationMins}m)`,
    hindiTitle: `${topic}: 2-होस्ट ऑडियो डीप डाइव`,
    subject,
    grade,
    language: "Hinglish",
    episodeType: "deep_dive",
    durationEstimateSec: procDurationSec,
    hosts: {
      mentor: {
        id: "mentor",
        name: mentorName,
        title: mentorTitle,
        avatar: mentorAvatar,
        voiceGender: mentorGender,
        role: "Concept Explainer & Anchor",
      },
      student: {
        id: "student",
        name: "Riya",
        title: "Curious Student",
        avatar: "👩‍🎓",
        voiceGender: "female",
        role: "Doubt Raiser & Peer",
      },
    },
    overview: `${mentorName} aur Riya ka ye 2-speaker audio deep dive ${topic} ke core mental model, real-life analogies aur conceptual intuition ko 3 minute me crystal clear karta hai.`,
    keyTakeaways: [
      `${topic} ka sabse aasaan mental model aur physical significance.`,
      "Action-reaction ya core variables alag-alag bodies par kaise act karte hain.",
      "Numericals me silly mistake se bachne ka 1-step verification thumb rule.",
    ],
    segments: [
      {
        id: "seg-1",
        speaker: "mentor",
        speakerName: mentorName,
        text: `Hey everyone! Welcome back to Cherry AI Audio Deep Dive. Aaj hum ek aisa topic discuss karne ja rahe hain jo dekhne me bohot straightforward lagta hai, lekin deep conceptual clarity maangta hai—${topic}!`,
        emotion: "energetic",
        intent: "intro",
      },
      {
        id: "seg-2",
        speaker: "student",
        speakerName: "Riya",
        text: `Sach me ${studentSalutation.toLowerCase()}! Jab bhi ${topic} padhte hain, lagta hai formula toh simple hai. Lekin jab application aati hai, tab dimag confuse hone lagta hai.`,
        emotion: "curious",
        intent: "doubt",
      },
      {
        id: "seg-3",
        speaker: "mentor",
        speakerName: mentorName,
        text: `Riya, iska simple reason ye hai ki hum formula toh memorize kar lete hain, par uske peeche ka 'Physical Model' visualize nahi karte. Chalo ek real life analogy se shuru karte hain.`,
        emotion: "insightful",
        intent: "concept",
      },
      {
        id: "seg-4",
        speaker: "student",
        speakerName: "Riya",
        text: `Haan ${studentSalutation.toLowerCase()}, please! Jaise ek classic confusion hota hai ki agar forces equal aur opposite hain, toh motion produce kaise hota hai? Dono forces ek dusre ko cancel kyu nahi karte?`,
        emotion: "curious",
        intent: "doubt",
      },
      {
        id: "seg-5",
        speaker: "mentor",
        speakerName: mentorName,
        text: `Superb question! Yahi is concept ka sabse bada turning point hai. Dhyan se suno: Dono forces ek hi body par nahi lagte! Ek force lagta hai Body A par, aur dusra force lagta hai Body B par. Jab bodies hi alag hain, toh forces cancel kaise honge?`,
        emotion: "thoughtful",
        intent: "analogy",
      },
      {
        id: "seg-6",
        speaker: "student",
        speakerName: "Riya",
        text: `Oh wow, of course! Jaise agar main floor par jump kar rahi hu, toh main floor ko push karti hu aur floor mujhe push karta hai! Motion mere body par floor ke force ki wajah se hua!`,
        emotion: "insightful",
        intent: "concept",
      },
      {
        id: "seg-7",
        speaker: "mentor",
        speakerName: mentorName,
        text: `Ekdum perfect observation! Isiliye jab bhi Free Body Diagram banao, hamesha sirf USI object par lagne wale forces draw karo, na ki jo force wo doosro par laga raha hai. Ye thumb rule yaad rakhoge toh kabhi marks nahi katenge.`,
        emotion: "friendly",
        intent: "concept",
      },
      {
        id: "seg-8",
        speaker: "student",
        speakerName: "Riya",
        text: `Awesome ${studentSalutation.toLowerCase()}! Sirf 3 minute ke is audio podcast me ${topic} ka pura concept crystal clear ho gaya. Thank you so much ${mentorName}!`,
        emotion: "energetic",
        intent: "summary",
      },
    ],
  };
}
