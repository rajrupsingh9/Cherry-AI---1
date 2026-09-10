import { AudioPodcastData, PodcastEpisodeType, PodcastLanguage } from "../types";
import { getActiveApiKey } from "../utils/geminiKeyStorage";
import { buildProceduralPodcast } from "../utils/podcastEngine";

export interface GeneratePodcastParams {
  topic: string;
  subject?: string;
  grade?: string;
  language?: PodcastLanguage;
  notesOrDocumentText?: string;
  episodeType?: PodcastEpisodeType | "deep_dive";
  targetDurationMins?: number;
  hostPair?: "cherry_riya" | "aarav_riya" | "cherry_solo";
}

const STORAGE_CACHE_KEY = "cherry_ai_saved_audio_podcasts_v1";

/**
 * Retrieves cached podcast episodes from localStorage
 */
export function getSavedPodcasts(): AudioPodcastData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_CACHE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn("[podcastService] Failed to read saved podcasts cache:", e);
    return [];
  }
}

/**
 * Saves a podcast episode to local cache
 */
export function savePodcastToCache(podcast: AudioPodcastData): void {
  if (typeof window === "undefined" || !podcast || !podcast.id) return;
  try {
    const existing = getSavedPodcasts();
    const filtered = existing.filter((p) => p.id !== podcast.id);
    // Keep most recent 15 episodes
    const updated = [podcast, ...filtered].slice(0, 15);
    localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("[podcastService] Failed to save podcast to cache:", e);
  }
}

/**
 * Calls backend `/api/generate-podcast` with student details and multilingual preference
 */
export async function generateAudioPodcast(
  params: GeneratePodcastParams
): Promise<AudioPodcastData> {
  const activeKey = getActiveApiKey();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (activeKey) {
    headers["x-gemini-api-key"] = activeKey;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 65000); // 65s max timeout

    const defaultTargetMins =
      params.episodeType === "exam_booster" ? 3.5 :
      params.episodeType === "quick_revision" ? 4 :
      params.episodeType === "exam_trap" ? 3 :
      3;
    const resolvedTargetMins = params.targetDurationMins || defaultTargetMins;

    const response = await fetch("/api/generate-podcast", {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        topic: params.topic,
        subject: params.subject || "General Science",
        grade: params.grade || "Class 10-12",
        language: params.language || "Hinglish",
        notesOrDocumentText: params.notesOrDocumentText || "",
        episodeType: params.episodeType || "rapid_viva",
        targetDurationMins: resolvedTargetMins,
        hostPair: params.hostPair || "cherry_riya",
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.warn(`[podcastService] Server error ${response.status}:`, errorBody);
      // Fallback to procedural podcast if server fails with 5xx/4xx
      const fallback = buildProceduralPodcast(
        params.topic,
        params.subject || "General Science",
        params.grade || "Class 10-12",
        params.language || "Hinglish",
        params.hostPair || "cherry_riya",
        params.episodeType || "rapid_viva",
        resolvedTargetMins
      );
      savePodcastToCache(fallback);
      return fallback;
    }

    const result = await response.json();
    if (!result.success || !result.data) {
      console.warn("[podcastService] Invalid server response, falling back:", result.error);
      const fallback = buildProceduralPodcast(
        params.topic,
        params.subject || "General Science",
        params.grade || "Class 10-12",
        params.language || "Hinglish",
        params.hostPair || "cherry_riya",
        params.episodeType || "rapid_viva",
        resolvedTargetMins
      );
      savePodcastToCache(fallback);
      return fallback;
    }

    const podcastData: AudioPodcastData = {
      ...result.data,
      episodeType: result.data.episodeType || params.episodeType || "rapid_viva",
      generatedAt: new Date().toISOString(),
    };

    // Cache locally
    savePodcastToCache(podcastData);
    return podcastData;
  } catch (networkErr: any) {
    console.warn("[podcastService] Network error/timeout during podcast generation, using procedural fallback:", networkErr?.message || networkErr);
    
    const defaultTargetMins =
      params.episodeType === "exam_booster" ? 3.5 :
      params.episodeType === "quick_revision" ? 4 :
      params.episodeType === "exam_trap" ? 3 :
      3;
    const resolvedTargetMins = params.targetDurationMins || defaultTargetMins;

    // Always provide the student with a complete, engaging audio overview
    const fallbackPodcast = buildProceduralPodcast(
      params.topic,
      params.subject || "General Science",
      params.grade || "Class 10-12",
      params.language || "Hinglish",
      params.hostPair || "cherry_riya",
      params.episodeType || "rapid_viva",
      resolvedTargetMins
    );

    savePodcastToCache(fallbackPodcast);
    return fallbackPodcast;
  }
}

export interface SynthesizeSpeechParams {
  text: string;
  speaker: "mentor" | "student" | string;
  voiceName?: string;
  language?: string;
}

export interface SynthesizeSpeechResult {
  success: boolean;
  audioBase64?: string;
  mimeType?: string;
  durationSec?: number;
  voiceName?: string;
  speaker?: string;
  fallback?: boolean;
  rateLimited?: boolean;
  retryAfterSec?: number;
  error?: string;
}

/**
 * Calls backend `/api/synthesize-speech` with Gemini 3.1 Flash TTS
 * Aarav Sir: 'Charon' / 'Fenrir' (Male Educator)
 * Riya: 'Aoede' / 'Kore' (Female Student, Studio Quality)
 */
export async function synthesizeSpeech(
  params: SynthesizeSpeechParams
): Promise<SynthesizeSpeechResult> {
  try {
    const activeKey = getActiveApiKey();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (activeKey) {
      headers["x-gemini-api-key"] = activeKey;
    }

    const response = await fetch("/api/synthesize-speech", {
      method: "POST",
      headers,
      body: JSON.stringify({
        text: params.text,
        speaker: params.speaker,
        voiceName: params.voiceName,
        language: params.language || "Hinglish",
      }),
    });

    if (!response.ok) {
      return { success: false, fallback: true, error: `HTTP ${response.status}` };
    }

    const result = await response.json();
    return result;
  } catch (err: any) {
    console.warn("[podcastService] synthesizeSpeech request error:", err);
    return { success: false, fallback: true, error: err?.message };
  }
}
