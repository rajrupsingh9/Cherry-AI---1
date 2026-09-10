/**
 * 🎙️ Cherry AI Offline Audio Storage & Direct Downloader
 * 
 * Provides:
 * 1. Persistent IndexedDB caching for full podcast audio tracks (works 100% offline).
 * 2. Lossless 24kHz WAV stitching of dialogue segments into a single cohesive .wav file.
 * 3. 1-Click native audio file download directly to mobile phone / PC storage.
 * 4. In-App Offline Player cache loader with per-segment audio mappings.
 */

import { AudioPodcastData, PodcastSegment } from "../types";
import { synthesizeSpeech } from "../services/podcastService";
import { sanitizeMathAndMarkdownForSpeech } from "./dualVoiceAudioEngine";

export interface OfflinePodcastRecord {
  id: string;
  topic: string;
  title: string;
  subject: string;
  grade: string;
  language: string;
  podcast: AudioPodcastData;
  audioBlob: Blob;
  fileSizeBytes: number;
  durationSec: number;
  downloadedAt: string;
  segmentAudios?: Record<number, string>;
}

export interface PodcastDownloadProgress {
  currentTurn: number;
  totalTurns: number;
  speakerName: string;
  percent: number;
  statusText: string;
  isComplete: boolean;
}

const DB_NAME = "CherryAIOfflineAudioDB_v1";
const STORE_NAME = "offline_podcasts";
const DB_VERSION = 1;

/**
 * Initializes and opens the IndexedDB database instance
 */
export function openOfflineAudioDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      return reject(new Error("IndexedDB is not supported in this environment"));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("downloadedAt", "downloadedAt", { unique: false });
        store.createIndex("topic", "topic", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves a podcast and its synthesized audio into IndexedDB for 100% offline playback
 */
export async function savePodcastOffline(
  podcast: AudioPodcastData,
  audioBlob: Blob,
  segmentAudios: Record<number, string> = {}
): Promise<void> {
  const db = await openOfflineAudioDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const record: OfflinePodcastRecord = {
      id: podcast.id,
      topic: podcast.topic,
      title: podcast.title,
      subject: podcast.subject,
      grade: podcast.grade,
      language: podcast.language,
      podcast,
      audioBlob,
      fileSizeBytes: audioBlob.size,
      durationSec: podcast.durationEstimateSec || 120,
      downloadedAt: new Date().toISOString(),
      segmentAudios,
    };

    const putRequest = store.put(record);
    putRequest.onsuccess = () => resolve();
    putRequest.onerror = () => reject(putRequest.error);
  });
}

/**
 * Retrieves a single offline podcast record by id
 */
export async function getOfflinePodcast(podcastId: string): Promise<OfflinePodcastRecord | null> {
  try {
    const db = await openOfflineAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(podcastId);

      getReq.onsuccess = () => resolve(getReq.result || null);
      getReq.onerror = () => reject(getReq.error);
    });
  } catch (e) {
    console.warn("[offlineAudioStorage] Error fetching offline podcast:", e);
    return null;
  }
}

/**
 * Retrieves all offline podcasts saved in local device storage
 */
export async function getAllOfflinePodcasts(): Promise<OfflinePodcastRecord[]> {
  try {
    const db = await openOfflineAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const getAllReq = store.getAll();

      getAllReq.onsuccess = () => {
        const records = (getAllReq.result || []) as OfflinePodcastRecord[];
        records.sort((a, b) => new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime());
        resolve(records);
      };
      getAllReq.onerror = () => reject(getAllReq.error);
    });
  } catch (e) {
    console.warn("[offlineAudioStorage] Error listing offline podcasts:", e);
    return [];
  }
}

/**
 * Checks if a given podcast is already saved offline
 */
export async function isPodcastSavedOffline(podcastId: string): Promise<boolean> {
  try {
    const record = await getOfflinePodcast(podcastId);
    return !!record;
  } catch {
    return false;
  }
}

/**
 * Deletes an offline podcast from device storage
 */
export async function deleteOfflinePodcast(podcastId: string): Promise<void> {
  const db = await openOfflineAudioDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const delReq = store.delete(podcastId);

    delReq.onsuccess = () => resolve();
    delReq.onerror = () => reject(delReq.error);
  });
}

/**
 * Converts a Base64 string to an ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Stitches multiple 24kHz 16-bit Mono WAV ArrayBuffers into a single continuous WAV Blob.
 * Injects a natural 300ms pause (silence samples) between speaker turns for authentic cadence.
 */
export function stitchWavBuffers(wavArrayBuffers: ArrayBuffer[], pauseMs = 300, sampleRate = 24000): Blob {
  const pcmChunks: Uint8Array[] = [];
  const pauseBytes = Math.round(sampleRate * (pauseMs / 1000) * 2); // 16-bit mono = 2 bytes per sample
  const pauseBuffer = new Uint8Array(pauseBytes);

  for (let i = 0; i < wavArrayBuffers.length; i++) {
    const buf = wavArrayBuffers[i];
    if (buf.byteLength > 44) {
      // Skip the 44-byte WAV header to extract pure PCM audio samples
      const pcm = new Uint8Array(buf, 44);
      pcmChunks.push(pcm);
      if (i < wavArrayBuffers.length - 1) {
        pcmChunks.push(pauseBuffer);
      }
    }
  }

  // Calculate total PCM length
  const totalPcmLength = pcmChunks.reduce((acc, c) => acc + c.length, 0);
  const combinedPcm = new Uint8Array(totalPcmLength);
  let offset = 0;
  for (const chunk of pcmChunks) {
    combinedPcm.set(chunk, offset);
    offset += chunk.length;
  }

  // Build standard 44-byte WAV header
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const channels = 1;
  const byteRate = sampleRate * channels * 2;
  const blockAlign = channels * 2;

  // "RIFF" chunk descriptor
  view.setUint32(0, 0x52494646, false); // 'RIFF'
  view.setUint32(4, 36 + totalPcmLength, true);
  view.setUint32(8, 0x57415645, false); // 'WAVE'

  // "fmt " sub-chunk
  view.setUint32(12, 0x666d7420, false); // 'fmt '
  view.setUint32(16, 16, true); // SubChunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, channels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate (24000)
  view.setUint32(28, byteRate, true); // ByteRate (48000)
  view.setUint16(32, blockAlign, true); // BlockAlign (2)
  view.setUint16(34, 16, true); // BitsPerSample (16)

  // "data" sub-chunk
  view.setUint32(36, 0x64617461, false); // 'data'
  view.setUint32(40, totalPcmLength, true);

  return new Blob([header, combinedPcm], { type: "audio/wav" });
}

/**
 * Triggers a direct native browser download of an audio Blob to device files
 */
export function downloadAudioBlobAsFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".wav") ? filename : `${filename}.wav`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Downloads all segments of a podcast, stitches them into a full episode .wav audio,
 * and saves them directly into IndexedDB for offline play.
 * If triggerDownload is true, triggers direct file download to the student's device.
 */
export async function downloadAndSavePodcastForOffline(
  podcast: AudioPodcastData,
  options?: {
    existingSegmentAudios?: Map<number, string> | Record<number, string>;
    triggerFileDownload?: boolean;
    onProgress?: (progress: PodcastDownloadProgress) => void;
  }
): Promise<{ fullBlob: Blob; offlineRecord: OfflinePodcastRecord }> {
  const segments = podcast.segments || [];
  const totalTurns = segments.length;
  const wavBuffers: ArrayBuffer[] = [];
  const segmentAudios: Record<number, string> = {};

  const isCherryMentor =
    podcast.hosts?.mentor?.name?.toLowerCase().includes("cherry") ||
    podcast.hosts?.mentor?.voiceGender === "female";

  // Check existing cached audios passed from DualVoiceAudioEngine
  const existingMap: Record<number, string> = {};
  if (options?.existingSegmentAudios) {
    if (options.existingSegmentAudios instanceof Map) {
      options.existingSegmentAudios.forEach((v, k) => {
        existingMap[k] = v;
      });
    } else {
      Object.assign(existingMap, options.existingSegmentAudios);
    }
  }

  for (let i = 0; i < totalTurns; i++) {
    const seg = segments[i];
    const isMentor = seg.speaker === "mentor";
    const speakerName = seg.speakerName || (isMentor ? podcast.hosts.mentor.name : podcast.hosts.student.name);

    if (options?.onProgress) {
      options.onProgress({
        currentTurn: i + 1,
        totalTurns,
        speakerName,
        percent: Math.round(((i + 0.2) / totalTurns) * 100),
        statusText: `Generating audio for Turn ${i + 1}/${totalTurns} (${speakerName})...`,
        isComplete: false,
      });
    }

    let base64Audio: string | null = null;
    let dataUrl: string | null = existingMap[i] || null;

    if (dataUrl && dataUrl.startsWith("data:")) {
      // Extract base64 from dataUrl
      const commaIdx = dataUrl.indexOf(",");
      if (commaIdx !== -1) {
        base64Audio = dataUrl.slice(commaIdx + 1);
      }
    }

    // If not cached yet, call speech synthesis
    if (!base64Audio) {
      const cleanSpokenText = sanitizeMathAndMarkdownForSpeech(seg.text, podcast.language);
      const speakerParam = isMentor ? (isCherryMentor ? "cherry" : "mentor") : "student";
      const voiceParam = isMentor ? (isCherryMentor ? "Aoede" : "Charon") : "Kore";

      try {
        const res = await synthesizeSpeech({
          text: cleanSpokenText,
          speaker: speakerParam,
          voiceName: voiceParam,
          language: podcast.language,
        });

        if (res.success && res.audioBase64) {
          base64Audio = res.audioBase64;
          dataUrl = `data:${res.mimeType || "audio/wav"};base64,${res.audioBase64}`;
        }
      } catch (err) {
        console.warn(`[offlineAudioStorage] Synthesis error on turn ${i + 1}:`, err);
      }
    }

    if (base64Audio) {
      try {
        const arrayBuf = base64ToArrayBuffer(base64Audio);
        wavBuffers.push(arrayBuf);
        if (dataUrl) {
          segmentAudios[i] = dataUrl;
        }
      } catch (e) {
        console.warn("[offlineAudioStorage] Error converting base64 to buffer:", e);
      }
    }

    if (options?.onProgress) {
      options.onProgress({
        currentTurn: i + 1,
        totalTurns,
        speakerName,
        percent: Math.round(((i + 1) / totalTurns) * 100),
        statusText: `Turn ${i + 1}/${totalTurns} ready ✓`,
        isComplete: i === totalTurns - 1,
      });
    }
  }

  // Stitch all WAV buffers together
  const fullBlob = stitchWavBuffers(wavBuffers, 300, 24000);

  // Save to IndexedDB
  await savePodcastOffline(podcast, fullBlob, segmentAudios);

  const offlineRecord: OfflinePodcastRecord = {
    id: podcast.id,
    topic: podcast.topic,
    title: podcast.title,
    subject: podcast.subject,
    grade: podcast.grade,
    language: podcast.language,
    podcast,
    audioBlob: fullBlob,
    fileSizeBytes: fullBlob.size,
    durationSec: podcast.durationEstimateSec || 120,
    downloadedAt: new Date().toISOString(),
    segmentAudios,
  };

  // Optionally trigger file download to device storage
  if (options?.triggerFileDownload) {
    const safeTopic = (podcast.topic || "Audio_Podcast").replace(/[^a-zA-Z0-9_\-\u0900-\u097F]/g, "_");
    const filename = `${safeTopic}_CherryAI_Podcast.wav`;
    downloadAudioBlobAsFile(fullBlob, filename);
  }

  return { fullBlob, offlineRecord };
}
