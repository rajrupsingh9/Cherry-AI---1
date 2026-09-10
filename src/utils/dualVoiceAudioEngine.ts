/**
 * 🎙️ Dual-Voice Multilingual Audio Synthesis Engine for Cherry AI 2-Host Podcasts
 * 
 * Provides:
 * 1. Automatic voice discovery with gender & accent matching (Male Mentor vs Female Student).
 * 2. Multilingual locale prioritization (hi-IN, en-IN, hi, en, bn-IN, mr-IN, te-IN, ta-IN).
 * 3. Math & Markdown to natural spoken text converter (LaTeX equations -> clear spoken words).
 * 4. Continuous seamless multi-speaker playback queue with zero awkward gaps.
 * 5. Dynamic rate, pitch, pause, resume, segment skipping, and active speaker event sync.
 */

import { AudioPodcastData, PodcastLanguage, PodcastSegment, PodcastSpeaker, PodcastAudioEngineMode } from "../types";
import { synthesizeSpeech } from "../services/podcastService";

export interface VoicePair {
  mentorVoice: SpeechSynthesisVoice | null;
  studentVoice: SpeechSynthesisVoice | null;
  mentorPitch: number;
  mentorRateMultiplier: number;
  studentPitch: number;
  studentRateMultiplier: number;
  isMaleVoiceDistinct: boolean;
  isFemaleVoiceDistinct: boolean;
}

export type PlaybackStatus = "idle" | "loading" | "playing" | "paused" | "stopped";

export interface DualVoiceEngineCallbacks {
  onSegmentStart?: (index: number, segment: PodcastSegment) => void;
  onSegmentEnd?: (index: number, segment: PodcastSegment) => void;
  onProgress?: (segmentElapsedSec: number, totalElapsedSec: number, progressPercent: number) => void;
  onPlaybackComplete?: () => void;
  onError?: (errorMessage: string) => void;
  onVoicesReady?: (pair: VoicePair) => void;
  onAudioModeChange?: (mode: PodcastAudioEngineMode) => void;
  onSegmentLoading?: (index: number, isLoading: boolean) => void;
}

// LaTeX and mathematical expression to clear spoken phonetics
export function sanitizeMathAndMarkdownForSpeech(rawText: string, language: PodcastLanguage = "Hinglish"): string {
  if (!rawText) return "";

  let text = rawText;

  // 1. Strip markdown code blocks & raw links
  text = text.replace(/```[\s\S]*?```/g, " ");
  text = text.replace(/https?:\/\/\S+/g, " ");

  // 2. Common LaTeX math transformations to natural speech
  // Fractions: \frac{a}{b} -> "a divided by b" or "a upon b"
  text = text.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (_match, num, den) => {
    return `${num} divided by ${den}`;
  });

  // Square roots: \sqrt{x} -> "square root of x"
  text = text.replace(/\\sqrt\{([^{}]+)\}/g, (_match, inside) => {
    return `square root of ${inside}`;
  });

  // Powers: x^{2} or x^2 -> "x squared" or "x to the power of 2"
  text = text.replace(/([a-zA-Z0-9]+)\^\{?2\}?/g, "$1 squared");
  text = text.replace(/([a-zA-Z0-9]+)\^\{?3\}?/g, "$1 cubed");
  text = text.replace(/([a-zA-Z0-9]+)\^\{?([a-zA-Z0-9]+)\}?/g, "$1 to the power of $2");

  // Math symbols
  text = text.replace(/\\approx/g, " approximately ");
  text = text.replace(/\\leq|<=/g, " less than or equal to ");
  text = text.replace(/\\geq|>=/g, " greater than or equal to ");
  text = text.replace(/\\neq|!=/g, " is not equal to ");
  text = text.replace(/\\times|\\cdot|\*/g, " into ");
  text = text.replace(/\\pm/g, " plus or minus ");
  text = text.replace(/\\Delta/g, " delta ");
  text = text.replace(/\\lambda/g, " lambda ");
  text = text.replace(/\\theta/g, " theta ");
  text = text.replace(/\\alpha/g, " alpha ");
  text = text.replace(/\\beta/g, " beta ");
  text = text.replace(/\\pi/g, " pi ");
  text = text.replace(/\\int/g, " integral of ");
  text = text.replace(/\\sum/g, " summation of ");
  text = text.replace(/\\infty/g, " infinity ");
  text = text.replace(/\\rightarrow|->/g, " leads to ");

  // Chemical formulas common in school curricula
  text = text.replace(/\bH2O\b/g, "H two O");
  text = text.replace(/\bCO2\b/g, "C O two");
  text = text.replace(/\bNH3\b/g, "Ammonia N H three");
  text = text.replace(/\bNaCl\b/g, "Sodium Chloride");
  text = text.replace(/\bH2SO4\b/g, "Sulfuric Acid");
  text = text.replace(/\bHCl\b/g, "H C L");

  // Strip remaining LaTeX wrappers: $...$ or $$...$$ or \[...\]
  text = text.replace(/\$\$[\s\S]*?\$\$/g, (m) => m.replace(/\$\$/g, " "));
  text = text.replace(/\$([^$]+)\$/g, "$1");
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, "$1");
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, "$1");

  // Remove markdown bold, italic, strikethrough, headers
  text = text.replace(/[*#_`~>|]/g, " ");

  // Normalize quotes and dialogue markers
  text = text.replace(/[""«»]/g, "");

  // Clean excessive spaces and periods
  text = text.replace(/\s+/g, " ").trim();

  // If Hinglish or Hindi, ensure natural breathing pauses at commas and colons
  if (language === "Hindi" || language === "Hinglish") {
    text = text.replace(/([।!?])/g, "$1 ");
  }

  return text;
}

export class DualVoiceAudioEngine {
  private voices: SpeechSynthesisVoice[] = [];
  private voicePair: VoicePair | null = null;
  private currentPodcast: AudioPodcastData | null = null;
  private currentSegmentIndex: number = 0;
  private playbackSpeed: number = 1.0;
  private isMuted: boolean = false;
  private status: PlaybackStatus = "idle";
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private callbacks: DualVoiceEngineCallbacks = {};
  private timerInterval: any = null;
  private currentSegmentElapsed: number = 0;
  private currentSegmentEstimatedDuration: number = 6;
  private isAdvancingInternally: boolean = false;

  // 🎙️ Studio Quality Human AI Speech state
  private audioMode: PodcastAudioEngineMode = "ai_studio";
  private audioUrlCache: Map<number, string> = new Map();
  private currentAudio: HTMLAudioElement | null = null;
  private loadingSegmentIndices: Set<number> = new Set();
  private prefetchQueue: Set<number> = new Set();
  private inFlightPrefetch: Map<number, Promise<string | null>> = new Map();
  private clientCooldownUntil: number = 0;

  constructor(callbacks: DualVoiceEngineCallbacks = {}) {
    this.callbacks = callbacks;
    this.initVoices();
  }

  public setCallbacks(callbacks: DualVoiceEngineCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  public getAudioMode(): PodcastAudioEngineMode {
    return this.audioMode;
  }

  public setAudioMode(mode: PodcastAudioEngineMode): void {
    if (this.audioMode === mode) return;
    this.audioMode = mode;
    if (this.callbacks.onAudioModeChange) {
      this.callbacks.onAudioModeChange(mode);
    }
    if (this.status === "playing") {
      this.speakCurrentSegment();
    }
  }

  public isSegmentLoading(index: number): boolean {
    return this.loadingSegmentIndices.has(index);
  }

  public getCachedAudioUrl(index: number): string | undefined {
    return this.audioUrlCache.get(index);
  }

  public getAudioUrlCache(): Map<number, string> {
    return new Map(this.audioUrlCache);
  }

  /**
   * Loads pre-downloaded offline audio URLs (from IndexedDB) into the engine's cache
   * enabling 100% network-free playback with zero latency.
   */
  public loadOfflineAudios(segmentAudios: Record<number, string>): void {
    if (!segmentAudios) return;
    Object.entries(segmentAudios).forEach(([idxStr, dataUrl]) => {
      const idx = parseInt(idxStr, 10);
      if (!isNaN(idx) && dataUrl) {
        this.audioUrlCache.set(idx, dataUrl);
      }
    });
  }

  public hasOfflineAudios(): boolean {
    return this.audioUrlCache.size > 0;
  }

  /**
   * Initializes and caches voices, handling Chrome/Edge async `onvoiceschanged`
   */
  private initVoices(): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const load = () => {
      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        this.voices = available;
        if (this.currentPodcast) {
          this.resolveVoicePair(this.currentPodcast.language);
        }
        if (this.voicePair && this.callbacks.onVoicesReady) {
          this.callbacks.onVoicesReady(this.voicePair);
        }
      }
    };

    load();

    if ("onvoiceschanged" in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        load();
      };
    }
  }

  /**
   * Finds the best matching voice pair for the target language:
   * - Mentor: Deeper, warmer, masculine pitch & voice profile
   * - Student: Brighter, expressive, feminine pitch & voice profile
   */
  public resolveVoicePair(language: PodcastLanguage = "Hinglish"): VoicePair {
    if (this.voices.length === 0 && typeof window !== "undefined" && "speechSynthesis" in window) {
      this.voices = window.speechSynthesis.getVoices();
    }

    const voices = this.voices;

    // Categorize voices by language affinity
    let targetLangs: string[] = ["en-IN", "hi-IN", "hi", "en-GB", "en-US", "en"];
    if (language === "Hindi") {
      targetLangs = ["hi-IN", "hi", "en-IN", "en-GB", "en"];
    } else if (language === "Bengali") {
      targetLangs = ["bn-IN", "bn-BD", "bn", "hi-IN", "en-IN", "en"];
    } else if (language === "English") {
      targetLangs = ["en-IN", "en-GB", "en-US", "en-AU", "en"];
    }

    const langMatches = voices.filter((v) =>
      targetLangs.some((tl) => v.lang.toLowerCase().includes(tl.toLowerCase()))
    );

    const pool = langMatches.length > 0 ? langMatches : voices;

    // Helper to score voice quality: heavily prioritize Natural, Neural, and Google HD voices over robotic legacy synthesizers
    const scoreVoiceQuality = (v: SpeechSynthesisVoice): number => {
      const name = v.name.toLowerCase();
      let score = 0;
      if (name.includes("natural")) score += 70; // Microsoft Natural (Edge/Windows)
      if (name.includes("neural")) score += 65;  // Neural TTS
      if (name.includes("online")) score += 55;  // Online cloud-synthesized voices
      if (name.includes("google")) score += 50;  // Google HD voices (Chrome/Android)
      if (name.includes("siri") || name.includes("premium")) score += 40;
      // Strongly reject robotic legacy synthesizers (eSpeak, SAPI, compact, desktop)
      if (name.includes("espeak") || name.includes("desktop") || name.includes("sapi") || name.includes("compact")) score -= 100;
      return score;
    };

    // Sort pools by voice naturalness/quality first
    pool.sort((a, b) => scoreVoiceQuality(b) - scoreVoiceQuality(a));
    voices.sort((a, b) => scoreVoiceQuality(b) - scoreVoiceQuality(a));

    // Filter keywords for male/mentor vs female/student
    const femaleKeywords = [
      "female", "woman", "girl", "swara", "kalpana", "zira", "susan", "victoria", 
      "samantha", "kavya", "veena", "ananya", "shruti", "aditi", "lekha", "priya", "neerja"
    ];
    const maleKeywords = [
      "male", "man", "boy", "rishi", "hemant", "david", "george", "mark", 
      "guy", "daniel", "tarun", "madhav", "aravind", "ravi", "amit", "prabhat"
    ];

    let detectedMaleVoice: SpeechSynthesisVoice | null = null;
    let detectedFemaleVoice: SpeechSynthesisVoice | null = null;

    // First pass: Match in preferred language pool
    for (const v of pool) {
      const name = v.name.toLowerCase();
      if (!detectedFemaleVoice && femaleKeywords.some((k) => name.includes(k))) {
        detectedFemaleVoice = v;
      }
      if (!detectedMaleVoice && maleKeywords.some((k) => name.includes(k))) {
        detectedMaleVoice = v;
      }
      if (detectedMaleVoice && detectedFemaleVoice) break;
    }

    // Second pass across all voices if either missing
    if (!detectedMaleVoice || !detectedFemaleVoice) {
      for (const v of voices) {
        const name = v.name.toLowerCase();
        if (!detectedFemaleVoice && femaleKeywords.some((k) => name.includes(k))) {
          detectedFemaleVoice = v;
        }
        if (!detectedMaleVoice && maleKeywords.some((k) => name.includes(k))) {
          detectedMaleVoice = v;
        }
        if (detectedMaleVoice && detectedFemaleVoice) break;
      }
    }

    // Fallbacks if only generic voices exist
    if (!detectedMaleVoice && pool.length > 0) {
      detectedMaleVoice = pool[0];
    }
    if (!detectedFemaleVoice && pool.length > 1) {
      detectedFemaleVoice = pool[1];
    } else if (!detectedFemaleVoice && pool.length > 0) {
      detectedFemaleVoice = pool[0];
    }

    // If both ended up being the exact same voice object, use subtle pitch modulation (avoiding distortion)
    const isMaleVoiceDistinct = detectedMaleVoice !== null;
    const isFemaleVoiceDistinct = detectedFemaleVoice !== null && detectedFemaleVoice !== detectedMaleVoice;

    // Fine-tuned acoustics for natural human vocal pitch:
    // Natural human variations are subtle: 0.98 for mentor, 1.03 for student (never extreme 0.88 or 1.28 which sound robotic)
    const pair: VoicePair = {
      mentorVoice: detectedMaleVoice,
      studentVoice: detectedFemaleVoice,
      mentorPitch: isFemaleVoiceDistinct ? 0.98 : 0.95,
      mentorRateMultiplier: 0.98,
      studentPitch: isFemaleVoiceDistinct ? 1.02 : 1.05,
      studentRateMultiplier: 1.03,
      isMaleVoiceDistinct,
      isFemaleVoiceDistinct,
    };

    this.voicePair = pair;
    return pair;
  }

  /**
   * Sets up podcast data and prepares the engine
   */
  public loadPodcast(podcast: AudioPodcastData): void {
    this.stop();
    const isDifferentPodcast = this.currentPodcast?.id !== podcast.id;
    this.currentPodcast = podcast;
    this.currentSegmentIndex = 0;
    this.currentSegmentElapsed = 0;
    if (isDifferentPodcast) {
      this.audioUrlCache.clear();
      this.inFlightPrefetch.clear();
      this.prefetchQueue.clear();
    }
    this.resolveVoicePair(podcast.language);

    if (this.audioMode === "ai_studio" && podcast.segments?.length && isDifferentPodcast) {
      // Proactively warm up initial segments in background pipeline so playback starts with 0 delay
      this.prefetchAhead(-1, 2);
    }
  }

  /**
   * Proactively buffers upcoming segments in a continuous sliding pipeline.
   * Ensures that neither Teacher nor Student ever experiences a delay or gap when their turn arrives.
   */
  public async prefetchAhead(fromIndex: number, count: number = 2): Promise<void> {
    if (!this.currentPodcast?.segments || this.audioMode !== "ai_studio") return;
    const total = this.currentPodcast.segments.length;

    for (let offset = 1; offset <= count; offset++) {
      const targetIndex = fromIndex + offset;
      if (targetIndex < 0 || targetIndex >= total) continue;

      // If already cached, continue to next
      if (this.audioUrlCache.has(targetIndex)) continue;

      // If already in flight, await it before triggering next so we maintain sequential flow
      if (this.inFlightPrefetch.has(targetIndex)) {
        await this.inFlightPrefetch.get(targetIndex);
        continue;
      }

      // Prefetch target segment and await so that next segment is queued right after
      await this.prefetchSegment(targetIndex);
    }
  }

  /**
   * Prefetches audio for a specific segment index in the background
   */
  public prefetchSegment(index: number): Promise<string | null> {
    if (!this.currentPodcast?.segments || index < 0 || index >= this.currentPodcast.segments.length) {
      return Promise.resolve(null);
    }
    if (this.audioMode !== "ai_studio") return Promise.resolve(null);
    if (this.audioUrlCache.has(index)) {
      return Promise.resolve(this.audioUrlCache.get(index)!);
    }
    if (this.inFlightPrefetch.has(index)) {
      return this.inFlightPrefetch.get(index)!;
    }

    this.prefetchQueue.add(index);
    const segment = this.currentPodcast.segments[index];
    const spokenText = sanitizeMathAndMarkdownForSpeech(segment.text, this.currentPodcast.language);
    
    const isMentor = segment.speaker === "mentor";
    const isCherryMentor = isMentor && (
      this.currentPodcast.hosts?.mentor?.name?.toLowerCase().includes("cherry") || 
      this.currentPodcast.hosts?.mentor?.voiceGender === "female"
    );
    const isCherryHostPair = this.currentPodcast.hosts?.mentor?.name?.toLowerCase().includes("cherry") || 
      this.currentPodcast.hosts?.mentor?.voiceGender === "female";

    let selectedVoice: string | undefined = undefined;
    let speakerParam: string = segment.speaker;
    if (isMentor) {
      speakerParam = isCherryMentor ? "cherry" : "mentor";
      selectedVoice = isCherryMentor ? "Aoede" : "Charon";
    } else {
      speakerParam = "student";
      // 🌟 Kore: Pure female, 16-year-old student voice (bright, sweet, youthful & curious)
      selectedVoice = "Kore";
    }

    const taskPromise = (async () => {
      try {
        const res = await synthesizeSpeech({
          text: spokenText,
          speaker: speakerParam,
          voiceName: selectedVoice,
          language: this.currentPodcast!.language,
        });

        if (res.success && res.audioBase64) {
          const dataUrl = `data:${res.mimeType || "audio/wav"};base64,${res.audioBase64}`;
          this.audioUrlCache.set(index, dataUrl);
          return dataUrl;
        }
        return null;
      } catch (e) {
        console.warn("[DualVoiceAudioEngine] Background prefetch notice for segment", index, e);
        return null;
      } finally {
        this.prefetchQueue.delete(index);
        this.inFlightPrefetch.delete(index);
      }
    })();

    this.inFlightPrefetch.set(index, taskPromise);
    return taskPromise;
  }

  /**
   * Starts or resumes playback
   */
  public play(): void {
    if (!this.currentPodcast || !this.currentPodcast.segments || this.currentPodcast.segments.length === 0) {
      if (this.callbacks.onError) this.callbacks.onError("No podcast segments loaded");
      return;
    }

    if (this.status === "paused") {
      if (this.currentAudio) {
        this.currentAudio.play().catch(() => {});
      } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.resume();
      }
      this.status = "playing";
      this.startProgressTimer();
      return;
    }

    this.status = "playing";
    this.speakCurrentSegment();
  }

  /**
   * Pauses current playback
   */
  public pause(): void {
    this.status = "paused";
    this.stopProgressTimer();
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
  }

  /**
   * Stops playback completely and resets position to start
   */
  public stop(): void {
    this.status = "stopped";
    this.stopProgressTimer();
    this.currentSegmentElapsed = 0;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  /**
   * Jumps directly to a specific segment index
   */
  public seekToSegment(index: number): void {
    if (!this.currentPodcast || !this.currentPodcast.segments) return;
    const targetIdx = Math.max(0, Math.min(index, this.currentPodcast.segments.length - 1));
    this.currentSegmentIndex = targetIdx;
    this.currentSegmentElapsed = 0;

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (this.status === "playing") {
      this.speakCurrentSegment();
    } else {
      this.stop();
    }
  }

  /**
   * Adjusts playback rate (e.g. 0.9x, 1.0x, 1.25x, 1.5x, 2.0x)
   */
  public setRate(rate: number): void {
    this.playbackSpeed = Math.max(0.5, Math.min(2.5, rate));
    if (this.currentAudio) {
      this.currentAudio.playbackRate = this.playbackSpeed;
    } else if (this.status === "playing") {
      this.speakCurrentSegment();
    }
  }

  /**
   * Mutes / Unmutes audio
   */
  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.currentAudio) {
      this.currentAudio.muted = muted;
    } else if (muted && this.status === "playing") {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } else if (!muted && this.status === "playing") {
      this.speakCurrentSegment();
    }
  }

  /**
   * Speaks the current segment using Studio AI Audio (or fallback to browser voice)
   */
  private async speakCurrentSegment(): Promise<void> {
    if (!this.currentPodcast || !this.currentPodcast.segments) return;
    const segment = this.currentPodcast.segments[this.currentSegmentIndex];
    if (!segment) {
      this.onFinishedAllSegments();
      return;
    }

    // Clean up any existing playback
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.onended = null;
      this.currentAudio.onerror = null;
      this.currentAudio.ontimeupdate = null;
      this.currentAudio = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;

    if (!this.voicePair) {
      this.resolveVoicePair(this.currentPodcast.language);
    }

    const isMentor = segment.speaker === "mentor";
    const voice = isMentor ? this.voicePair?.mentorVoice : this.voicePair?.studentVoice;
    const basePitch = isMentor ? (this.voicePair?.mentorPitch || 0.98) : (this.voicePair?.studentPitch || 1.03);
    const rateMultiplier = isMentor ? (this.voicePair?.mentorRateMultiplier || 0.98) : (this.voicePair?.studentRateMultiplier || 1.03);

    // Clean spoken text with math, markdown, and phonetic rules
    const spokenText = sanitizeMathAndMarkdownForSpeech(segment.text, this.currentPodcast.language);

    // Initial estimation for progress bar until audio loads
    const wordCount = spokenText.split(/\s+/).length;
    const effectiveRate = this.playbackSpeed * rateMultiplier;
    this.currentSegmentEstimatedDuration = Math.max(3, Math.round((wordCount / (140 * effectiveRate)) * 60));
    this.currentSegmentElapsed = 0;

    // Trigger segment start callback
    if (this.callbacks.onSegmentStart) {
      this.callbacks.onSegmentStart(this.currentSegmentIndex, segment);
    }

    // Mode 1: 🎙️ Ultra-Realistic Human AI Studio Audio (NotebookLM-Style Live Actor)
    if (this.audioMode === "ai_studio") {
      const activeIndex = this.currentSegmentIndex;

      // 1. If audio is already pre-cached in memory:
      if (this.audioUrlCache.has(activeIndex)) {
        const cachedUrl = this.audioUrlCache.get(activeIndex)!;
        this.startProgressTimer();
        this.playAudioElement(cachedUrl, activeIndex);
        if (Date.now() >= this.clientCooldownUntil) {
          this.prefetchAhead(activeIndex, 2);
        }
        return;
      }

      // 2. Await in-flight prefetch or trigger immediate fetch
      this.loadingSegmentIndices.add(activeIndex);
      if (this.callbacks.onSegmentLoading) {
        this.callbacks.onSegmentLoading(activeIndex, true);
      }

      try {
        const dataUrl = await this.prefetchSegment(activeIndex);

        this.loadingSegmentIndices.delete(activeIndex);
        if (this.callbacks.onSegmentLoading) {
          this.callbacks.onSegmentLoading(activeIndex, false);
        }

        if (dataUrl) {
          // If still playing and student is still on this segment
          if (this.status === "playing" && this.currentSegmentIndex === activeIndex) {
            this.startProgressTimer();
            this.playAudioElement(dataUrl, activeIndex);
            this.prefetchAhead(activeIndex, 2);
            return;
          }
        }
      } catch (fetchErr) {
        this.loadingSegmentIndices.delete(activeIndex);
        if (this.callbacks.onSegmentLoading) {
          this.callbacks.onSegmentLoading(activeIndex, false);
        }
        console.warn("[DualVoiceAudioEngine] Live Actor synthesis error:", fetchErr);
      }

      // Fallback to browser neural voice only if API network call is completely unavailable
      if (this.status === "playing" && this.currentSegmentIndex === activeIndex) {
        this.startProgressTimer();
        this.speakWithSpeechSynthesis(spokenText, voice, basePitch, effectiveRate);
      }
      return;
    }

    // Mode 2: Natural Browser SpeechSynthesis
    this.startProgressTimer();
    this.speakWithSpeechSynthesis(spokenText, voice, basePitch, effectiveRate);
  }

  private playAudioElement(audioSrc: string, segmentIndex: number): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    const segment = this.currentPodcast?.segments[segmentIndex];
    const isMentor = segment?.speaker === "mentor";

    const audio = new Audio(audioSrc);
    // Natural human vocal cadence: mentor speaks at calm teacher tempo (0.97x), student speaks at enthusiastic tempo (1.03x)
    audio.playbackRate = this.playbackSpeed * (isMentor ? 0.97 : 1.03);
    audio.muted = this.isMuted;

    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        this.currentSegmentEstimatedDuration = audio.duration;
      }
    };

    audio.ontimeupdate = () => {
      this.currentSegmentElapsed = audio.currentTime;
    };

    audio.onended = () => {
      if (this.status === "playing" && this.currentSegmentIndex === segmentIndex) {
        this.handleSegmentEnd();
      }
    };

    audio.onerror = (e) => {
      console.warn("[DualVoiceAudioEngine] Audio element error, falling back to speech synthesis:", e);
      if (this.status === "playing" && this.currentSegmentIndex === segmentIndex) {
        const seg = this.currentPodcast?.segments[segmentIndex];
        if (seg) {
          const isSegMentor = seg.speaker === "mentor";
          const voice = isSegMentor ? this.voicePair?.mentorVoice : this.voicePair?.studentVoice;
          const basePitch = isSegMentor ? (this.voicePair?.mentorPitch || 0.98) : (this.voicePair?.studentPitch || 1.03);
          const rateMultiplier = isSegMentor ? (this.voicePair?.mentorRateMultiplier || 0.98) : (this.voicePair?.studentRateMultiplier || 1.03);
          const spokenText = sanitizeMathAndMarkdownForSpeech(seg.text, this.currentPodcast?.language);
          this.speakWithSpeechSynthesis(spokenText, voice, basePitch, this.playbackSpeed * rateMultiplier);
        }
      }
    };

    this.currentAudio = audio;
    if (!this.isMuted) {
      audio.play().catch((err) => {
        console.warn("[DualVoiceAudioEngine] audio.play() blocked or interrupted:", err?.message);
      });
    }
  }

  private speakWithSpeechSynthesis(
    spokenText: string,
    voice: SpeechSynthesisVoice | null,
    pitch: number,
    rate: number
  ): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (this.isMuted) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else if (this.currentPodcast?.language === "Hindi") {
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-IN";
    }

    utterance.pitch = pitch;
    utterance.rate = Math.max(0.7, Math.min(2.0, rate));
    utterance.volume = 1.0;

    utterance.onend = () => {
      if (this.status !== "playing") return;
      this.handleSegmentEnd();
    };

    utterance.onerror = (e) => {
      if (e.error === "interrupted" || e.error === "canceled") return;
      console.warn("[DualVoiceAudioEngine] Speech utterance error:", e.error);
      if (this.status === "playing") {
        this.handleSegmentEnd();
      }
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Advances to next segment seamlessly
   */
  private handleSegmentEnd(): void {
    if (this.isAdvancingInternally) return;
    this.isAdvancingInternally = true;

    const segment = this.currentPodcast?.segments[this.currentSegmentIndex];
    if (segment && this.callbacks.onSegmentEnd) {
      this.callbacks.onSegmentEnd(this.currentSegmentIndex, segment);
    }

    if (!this.currentPodcast || !this.currentPodcast.segments) {
      this.isAdvancingInternally = false;
      return;
    }

    if (this.currentSegmentIndex < this.currentPodcast.segments.length - 1) {
      this.currentSegmentIndex++;
      this.currentSegmentElapsed = 0;
      this.isAdvancingInternally = false;

      // Smooth natural conversational pause (180ms) between speaker turns
      setTimeout(() => {
        if (this.status === "playing") {
          this.speakCurrentSegment();
        }
      }, 180);
    } else {
      this.isAdvancingInternally = false;
      this.onFinishedAllSegments();
    }
  }

  private onFinishedAllSegments(): void {
    this.stop();
    if (this.callbacks.onPlaybackComplete) {
      this.callbacks.onPlaybackComplete();
    }
  }

  private startProgressTimer(): void {
    this.stopProgressTimer();
    this.timerInterval = setInterval(() => {
      if (this.status !== "playing") return;

      this.currentSegmentElapsed += 0.25;

      // In muted mode, advance based on time
      if (this.isMuted && this.currentSegmentElapsed >= this.currentSegmentEstimatedDuration) {
        this.handleSegmentEnd();
        return;
      }

      if (this.callbacks.onProgress && this.currentPodcast?.segments) {
        const totalSegments = this.currentPodcast.segments.length;
        const segmentFraction = Math.min(1, this.currentSegmentElapsed / this.currentSegmentEstimatedDuration);
        const overallProgress = Math.min(100, Math.round(((this.currentSegmentIndex + segmentFraction) / totalSegments) * 100));

        this.callbacks.onProgress(this.currentSegmentElapsed, this.currentSegmentElapsed, overallProgress);
      }
    }, 250);
  }

  private stopProgressTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // Getters for UI integration
  public getStatus(): PlaybackStatus {
    return this.status;
  }

  public getCurrentIndex(): number {
    return this.currentSegmentIndex;
  }

  public getVoicePair(): VoicePair | null {
    return this.voicePair;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}
