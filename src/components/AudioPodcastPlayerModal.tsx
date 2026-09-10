import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles,
  Headphones,
  Check,
  Share2,
  Copy,
  BookOpen,
  Radio,
  Sliders,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Clock,
  ListFilter,
  Layers,
  Flame,
  Download,
  Loader2,
  HardDrive,
  WifiOff,
  CheckCircle2,
  Trash2,
  FileAudio,
} from "lucide-react";
import { AudioPodcastData, PodcastSegment, PodcastAudioEngineMode } from "../types";
import { DualVoiceAudioEngine, VoicePair } from "../utils/dualVoiceAudioEngine";
import {
  isPodcastSavedOffline,
  getOfflinePodcast,
  deleteOfflinePodcast,
  downloadAndSavePodcastForOffline,
  downloadAudioBlobAsFile,
  PodcastDownloadProgress,
  OfflinePodcastRecord,
} from "../utils/offlineAudioStorage";

interface AudioPodcastPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  podcast: AudioPodcastData | null;
  onSpeakSegment?: (segment: PodcastSegment, rate: number) => void;
  onStopAudio?: () => void;
  isAudioPlaying?: boolean;
}

export default function AudioPodcastPlayerModal({
  isOpen,
  onClose,
  podcast,
  onSpeakSegment,
  onStopAudio,
  isAudioPlaying: externalAudioPlaying,
}: AudioPodcastPlayerModalProps) {
  // Navigation tabs within player: 'player' | 'transcript' | 'takeaways'
  const [activeTab, setActiveTab] = useState<"player" | "transcript" | "takeaways">("player");
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 0.9, 1.0, 1.25, 1.5, 2.0
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [voicePair, setVoicePair] = useState<VoicePair | null>(null);
  const [isPreviewingVoices, setIsPreviewingVoices] = useState<boolean>(false);
  const [audioMode, setAudioMode] = useState<PodcastAudioEngineMode>("ai_studio");
  const [isSegmentLoading, setIsSegmentLoading] = useState<boolean>(false);

  // Offline & Direct Audio Download state
  const [isSavedOffline, setIsSavedOffline] = useState<boolean>(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<PodcastDownloadProgress | null>(null);
  const [offlineRecord, setOfflineRecord] = useState<OfflinePodcastRecord | null>(null);
  const [downloadStatusNote, setDownloadStatusNote] = useState<string | null>(null);

  // Segment duration timer state
  const [segmentElapsed, setSegmentElapsed] = useState<number>(0);
  const transcriptScrollRef = useRef<HTMLDivElement | null>(null);
  const audioEngineRef = useRef<DualVoiceAudioEngine | null>(null);

  // Initialize DualVoiceAudioEngine on mount
  useEffect(() => {
    const engine = new DualVoiceAudioEngine({
      onSegmentStart: (idx, _seg) => {
        setCurrentSegmentIndex(idx);
        setSegmentElapsed(0);
        setIsSegmentLoading(false);
      },
      onProgress: (segElapsed, _totalElapsed, _progressPct) => {
        setSegmentElapsed(segElapsed);
      },
      onPlaybackComplete: () => {
        setIsPlaying(false);
        setIsSegmentLoading(false);
        if (onStopAudio) onStopAudio();
      },
      onVoicesReady: (pair) => {
        setVoicePair(pair);
      },
      onAudioModeChange: (mode) => {
        setAudioMode(mode);
      },
      onSegmentLoading: (_idx, isLoading) => {
        setIsSegmentLoading(isLoading);
      },
    });

    audioEngineRef.current = engine;
    const initialVoices = engine.resolveVoicePair(podcast?.language || "Hinglish");
    setVoicePair(initialVoices);

    return () => {
      engine.stop();
    };
  }, []);

  // Sync with external audio playing if provided
  useEffect(() => {
    if (externalAudioPlaying !== undefined) {
      setIsPlaying(externalAudioPlaying);
      if (!externalAudioPlaying && audioEngineRef.current) {
        audioEngineRef.current.pause();
      }
    }
  }, [externalAudioPlaying]);

  // Load new podcast when opened or changed
  useEffect(() => {
    if (isOpen && podcast) {
      setCurrentSegmentIndex(0);
      setSegmentElapsed(0);
      setIsPlaying(false);
      setActiveTab("player");
      setDownloadProgress(null);
      setDownloadStatusNote(null);

      // Check if podcast is already saved in offline storage
      isPodcastSavedOffline(podcast.id)
        .then((saved) => {
          setIsSavedOffline(saved);
          if (saved) {
            getOfflinePodcast(podcast.id).then((rec) => {
              if (rec) {
                setOfflineRecord(rec);
                if (rec.segmentAudios && audioEngineRef.current) {
                  audioEngineRef.current.loadOfflineAudios(rec.segmentAudios);
                }
              }
            });
          }
        })
        .catch(() => setIsSavedOffline(false));

      if (audioEngineRef.current) {
        audioEngineRef.current.loadPodcast(podcast);
        const resolved = audioEngineRef.current.resolveVoicePair(podcast.language);
        setVoicePair(resolved);
        // Pre-warm initial speaker turns in background pipeline for instant conversation flow
        audioEngineRef.current.prefetchAhead(-1, 2);
      }
    } else if (!isOpen && audioEngineRef.current) {
      audioEngineRef.current.stop();
      setIsPlaying(false);
    }
  }, [isOpen, podcast?.id]);

  const currentSegment: PodcastSegment | undefined =
    podcast?.segments && podcast.segments[currentSegmentIndex];
  const totalSegments = podcast?.segments?.length || 0;

  // Estimate duration per segment based on word count (~140 words per minute at 1.0x)
  const getSegmentDurationSec = (text: string, speed: number): number => {
    const wordCount = text.trim().split(/\s+/).length;
    const baseSec = Math.max(4, Math.round((wordCount / 140) * 60));
    return Math.max(3, Math.round(baseSec / speed));
  };

  const currentSegmentDuration = currentSegment
    ? getSegmentDurationSec(currentSegment.text, playbackSpeed)
    : 8;

  // Auto-scroll transcript to active item
  useEffect(() => {
    if (activeTab === "transcript" && transcriptScrollRef.current) {
      const activeEl = transcriptScrollRef.current.querySelector(
        `[data-segment-idx="${currentSegmentIndex}"]`
      );
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [currentSegmentIndex, activeTab]);

  if (!isOpen || !podcast) return null;

  // Handlers
  const handleTogglePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioEngineRef.current) {
        audioEngineRef.current.pause();
      }
      if (onStopAudio) onStopAudio();
    } else {
      // If audio is not yet generated / cached in offline storage, synthesize seamlessly first so there is ZERO time gap
      if (!isSavedOffline && (!audioEngineRef.current || !audioEngineRef.current.hasOfflineAudios())) {
        setIsDownloadingAudio(true);
        setDownloadStatusNote("🎙️ Preparing 24kHz Seamless Audio (Zero Gap)...");
        try {
          const { offlineRecord: rec } = await downloadAndSavePodcastForOffline(podcast, {
            triggerFileDownload: false,
            onProgress: (p) => {
              setDownloadProgress(p);
            },
          });
          setIsSavedOffline(true);
          setOfflineRecord(rec);
          if (rec.segmentAudios && audioEngineRef.current) {
            audioEngineRef.current.loadOfflineAudios(rec.segmentAudios);
          }
          setIsDownloadingAudio(false);
          setDownloadProgress(null);
          setDownloadStatusNote("✓ 24kHz Seamless Audio Ready!");
        } catch (err) {
          console.warn("[PlayerModal] Seamless preparation notice:", err);
          setIsDownloadingAudio(false);
          setDownloadProgress(null);
        }
      }

      setIsPlaying(true);
      if (audioEngineRef.current) {
        audioEngineRef.current.play();
      }
      if (onSpeakSegment && currentSegment && !isMuted) {
        onSpeakSegment(currentSegment, playbackSpeed);
      }
    }
  };

  const handleNextSegment = () => {
    if (currentSegmentIndex < totalSegments - 1) {
      const nextIdx = currentSegmentIndex + 1;
      setCurrentSegmentIndex(nextIdx);
      setSegmentElapsed(0);
      if (audioEngineRef.current) {
        audioEngineRef.current.seekToSegment(nextIdx);
      }
    }
  };

  const handlePrevSegment = () => {
    if (currentSegmentIndex > 0) {
      const prevIdx = currentSegmentIndex - 1;
      setCurrentSegmentIndex(prevIdx);
      setSegmentElapsed(0);
      if (audioEngineRef.current) {
        audioEngineRef.current.seekToSegment(prevIdx);
      }
    } else {
      setSegmentElapsed(0);
      if (audioEngineRef.current) {
        audioEngineRef.current.seekToSegment(0);
      }
    }
  };

  const handleRewind10 = () => {
    const targetIdx = Math.max(0, currentSegmentIndex - 1);
    setCurrentSegmentIndex(targetIdx);
    setSegmentElapsed(0);
    if (audioEngineRef.current) {
      audioEngineRef.current.seekToSegment(targetIdx);
    }
  };

  const handleForward10 = () => {
    const targetIdx = Math.min(totalSegments - 1, currentSegmentIndex + 1);
    setCurrentSegmentIndex(targetIdx);
    setSegmentElapsed(0);
    if (audioEngineRef.current) {
      audioEngineRef.current.seekToSegment(targetIdx);
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.9, 1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (audioEngineRef.current) {
      audioEngineRef.current.setRate(nextSpeed);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioEngineRef.current) {
      audioEngineRef.current.setMuted(nextMuted);
    }
  };

  const handleSelectSegment = async (idx: number) => {
    setCurrentSegmentIndex(idx);
    setSegmentElapsed(0);
    if (!isSavedOffline && (!audioEngineRef.current || !audioEngineRef.current.hasOfflineAudios())) {
      setIsDownloadingAudio(true);
      setDownloadStatusNote("🎙️ Preparing 24kHz Seamless Audio...");
      try {
        const { offlineRecord: rec } = await downloadAndSavePodcastForOffline(podcast, {
          triggerFileDownload: false,
          onProgress: (p) => setDownloadProgress(p),
        });
        setIsSavedOffline(true);
        setOfflineRecord(rec);
        if (rec.segmentAudios && audioEngineRef.current) {
          audioEngineRef.current.loadOfflineAudios(rec.segmentAudios);
        }
      } catch (err) {
        console.warn("[PlayerModal] Prep error:", err);
      } finally {
        setIsDownloadingAudio(false);
        setDownloadProgress(null);
      }
    }
    setIsPlaying(true);
    if (audioEngineRef.current) {
      audioEngineRef.current.seekToSegment(idx);
    }
  };

  // Preview dual voices test utterance
  const handlePreviewVoices = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setIsPlaying(false);
    if (audioEngineRef.current) {
      audioEngineRef.current.stop();
    }
    window.speechSynthesis.cancel();
    setIsPreviewingVoices(true);

    const isHindi = podcast.language === "Hindi" || podcast.language === "Hinglish";
    const isCherry = podcast.hosts.mentor.name.toLowerCase().includes("cherry") || podcast.hosts.mentor.voiceGender === "female";
    const mentorLine = isHindi
      ? `नमस्ते! मैं हूँ ${podcast.hosts.mentor.name}। आज हम ${podcast.topic} को बिल्कुल आसान तरीके से समझेंगे।`
      : `Hello! I am ${podcast.hosts.mentor.name}. Today we will master ${podcast.topic} together.`;

    const mentorUtt = new SpeechSynthesisUtterance(mentorLine);
    if (voicePair?.mentorVoice) {
      mentorUtt.voice = isCherry ? (voicePair.studentVoice || voicePair.mentorVoice) : voicePair.mentorVoice;
      mentorUtt.lang = mentorUtt.voice?.lang || (isHindi ? "hi-IN" : "en-IN");
    } else {
      mentorUtt.lang = isHindi ? "hi-IN" : "en-IN";
    }
    mentorUtt.pitch = isCherry ? 1.0 : (voicePair?.mentorPitch || 0.98);
    mentorUtt.rate = 1.0;

    mentorUtt.onend = () => {
      const studentLine = isHindi
        ? `और मैं हूँ ${podcast.hosts.student.name}! ${isCherry ? "मैम" : "सर"}, मुझे इस कॉन्सेप्ट के कुछ खास पॉइंट्स पर डाउट है!`
        : `And I am ${podcast.hosts.student.name}! ${isCherry ? "Ma'am" : "Sir"}, I have a few interesting questions about this!`;

      const studentUtt = new SpeechSynthesisUtterance(studentLine);
      if (voicePair?.studentVoice) {
        studentUtt.voice = voicePair.studentVoice;
        studentUtt.lang = voicePair.studentVoice.lang;
      } else {
        studentUtt.lang = isHindi ? "hi-IN" : "en-IN";
      }
      studentUtt.pitch = voicePair?.studentPitch || 1.05;
      studentUtt.rate = 1.03;

      studentUtt.onend = () => {
        setIsPreviewingVoices(false);
      };
      studentUtt.onerror = () => {
        setIsPreviewingVoices(false);
      };

      window.speechSynthesis.speak(studentUtt);
    };

    mentorUtt.onerror = () => {
      setIsPreviewingVoices(false);
    };

    window.speechSynthesis.speak(mentorUtt);
  };

  const handleCloseModal = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.stop();
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPreviewingVoices(false);
    if (onStopAudio) onStopAudio();
    onClose();
  };

  const handleCopyTranscript = () => {
    const fullText = podcast.segments
      .map((s) => `${s.speakerName}: "${s.text}"`)
      .join("\n\n");
    navigator.clipboard.writeText(fullText);
    setCopiedId("full");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTakeawaysAndTranscript = () => {
    if (!podcast) return;
    let md = `# 🎙️ Audio Podcast Summary: ${podcast.title}\n`;
    if (podcast.hindiTitle) md += `### ${podcast.hindiTitle}\n\n`;
    md += `**Subject:** ${podcast.subject} | **Grade:** ${podcast.grade} | **Language:** ${podcast.language}\n`;
    md += `**Hosts:** ${podcast.hosts.mentor.name} (${podcast.hosts.mentor.role}) & ${podcast.hosts.student.name} (${podcast.hosts.student.role})\n`;
    md += `**Generated:** ${new Date().toLocaleDateString()} via Cherry AI Classroom\n\n`;
    md += `---\n\n## 📖 Executive Overview\n\n${podcast.overview}\n\n`;
    md += `## 🎯 High-Yield Key Takeaways\n\n`;
    podcast.keyTakeaways.forEach((t, i) => {
      md += `${i + 1}. ${t}\n`;
    });
    md += `\n---\n\n## 📝 Full Audio Conversation Transcript\n\n`;
    podcast.segments.forEach((s) => {
      md += `**${s.speakerName}** (${s.intent || "discussion"}):\n> "${s.text}"\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(podcast.topic || "Audio_Summary").replace(/[^a-zA-Z0-9_-]/g, "_")}_Key_Takeaways.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * 📥 Direct Audio Download (.wav)
   * Stitches all segment audio buffers into a high-fidelity 24kHz Studio .wav file
   * and triggers direct file download to the student's mobile or computer storage.
   */
  const handleDownloadAudioWav = async () => {
    if (!podcast || isDownloadingAudio) return;
    setIsDownloadingAudio(true);
    setDownloadStatusNote("Preparing Real Human Voice .wav audio...");

    try {
      const existingAudios = audioEngineRef.current ? audioEngineRef.current.getAudioUrlCache() : undefined;
      const { fullBlob } = await downloadAndSavePodcastForOffline(podcast, {
        existingSegmentAudios: existingAudios,
        triggerFileDownload: true,
        onProgress: (p) => setDownloadProgress(p),
      });

      setIsSavedOffline(true);
      setDownloadStatusNote("✓ Audio downloaded to device & saved offline!");
      setTimeout(() => setDownloadStatusNote(null), 4000);
    } catch (err: any) {
      console.error("[AudioPodcastPlayerModal] Direct audio download error:", err);
      setDownloadStatusNote("Download error. Please try again.");
      setTimeout(() => setDownloadStatusNote(null), 4000);
    } finally {
      setIsDownloadingAudio(false);
      setDownloadProgress(null);
    }
  };

  /**
   * 💾 Save Podcast for In-App Offline Player
   * Persists all audio segments into IndexedDB for 100% offline playback.
   */
  const handleSaveOffline = async () => {
    if (!podcast || isDownloadingAudio) return;
    setIsDownloadingAudio(true);
    setDownloadStatusNote("Saving podcast audio to local device storage...");

    try {
      const existingAudios = audioEngineRef.current ? audioEngineRef.current.getAudioUrlCache() : undefined;
      const { offlineRecord: savedRecord } = await downloadAndSavePodcastForOffline(podcast, {
        existingSegmentAudios: existingAudios,
        triggerFileDownload: false,
        onProgress: (p) => setDownloadProgress(p),
      });

      setIsSavedOffline(true);
      setOfflineRecord(savedRecord);
      if (audioEngineRef.current && savedRecord.segmentAudios) {
        audioEngineRef.current.loadOfflineAudios(savedRecord.segmentAudios);
      }
      setDownloadStatusNote("✓ Saved for Offline Play! (बिना इंटरनेट सुन सकते हैं)");
      setTimeout(() => setDownloadStatusNote(null), 4000);
    } catch (err: any) {
      console.error("[AudioPodcastPlayerModal] Save offline error:", err);
      setDownloadStatusNote("Could not save offline. Please check storage.");
      setTimeout(() => setDownloadStatusNote(null), 4000);
    } finally {
      setIsDownloadingAudio(false);
      setDownloadProgress(null);
    }
  };

  /**
   * 🗑️ Remove from Offline Storage
   */
  const handleDeleteOffline = async () => {
    if (!podcast) return;
    try {
      await deleteOfflinePodcast(podcast.id);
      setIsSavedOffline(false);
      setOfflineRecord(null);
      setDownloadStatusNote("Removed from offline storage.");
      setTimeout(() => setDownloadStatusNote(null), 2500);
    } catch (err) {
      console.error("[AudioPodcastPlayerModal] Delete offline error:", err);
    }
  };

  // Intent badge styling
  const getIntentBadge = (intent?: string) => {
    switch (intent) {
      case "doubt":
        return { label: "Doubt & Intuition", bg: "bg-amber-100 text-amber-800 border-amber-200", icon: HelpCircle };
      case "exam_trap":
        return { label: "Exam Trap Alert", bg: "bg-rose-100 text-rose-800 border-rose-200", icon: AlertTriangle };
      case "concept":
        return { label: "Deep Concept", bg: "bg-indigo-100 text-[#796AEF] border-indigo-200", icon: Lightbulb };
      case "analogy":
        return { label: "Real Life Analogy", bg: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: Sparkles };
      case "summary":
        return { label: "Key Takeaway", bg: "bg-purple-100 text-purple-800 border-purple-200", icon: BookOpen };
      default:
        return { label: "Dialogue", bg: "bg-slate-100 text-slate-700 border-slate-200", icon: Radio };
    }
  };

  const isMentorSpeaking = currentSegment?.speaker === "mentor";
  const isStudentSpeaking = currentSegment?.speaker === "student";

  // Calculate overall podcast progress
  const progressPercent =
    totalSegments > 0
      ? Math.min(
          100,
          Math.round(
            ((currentSegmentIndex + segmentElapsed / currentSegmentDuration) /
              totalSegments) *
              100
          )
        )
      : 0;

  return (
    <div
      id="audio-podcast-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <motion.div
        id="audio-podcast-player-card"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="w-full max-w-md sm:max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col max-h-[92vh] overflow-hidden my-auto"
      >
        {/* TOP APP-STYLE HEADER BAR */}
        <div
          id="podcast-player-header"
          className="px-4 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#796AEF] to-indigo-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-[#796AEF] border border-indigo-100">
                  {podcast.episodeType === "rapid_viva"
                    ? "🎯 Rapid Viva / Quiz"
                    : podcast.episodeType === "exam_booster"
                    ? "🚀 Exam-Morning Booster"
                    : podcast.episodeType === "quick_revision"
                    ? "⚡ Quick Recap Blitz"
                    : podcast.episodeType === "exam_trap"
                    ? "🛡️ Exam Traps Shield"
                    : "🎙️ Socratic Audio"}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {podcast.language || "Hinglish"}
                </span>
                {isSavedOffline && (
                  <span
                    id="podcast-header-offline-badge"
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    <span>Offline Ready</span>
                  </span>
                )}
              </div>
              <h3 className="text-xs font-bold text-slate-800 truncate mt-0.5">
                {podcast.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="podcast-header-download-audio-btn"
              onClick={handleDownloadAudioWav}
              disabled={isDownloadingAudio}
              title="Download High-Fidelity Audio Podcast (.wav) with Real Human Voice"
              className="p-1.5 text-[#796AEF] hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              {isDownloadingAudio ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#796AEF]" />
              ) : (
                <FileAudio className="w-4 h-4" />
              )}
            </button>
            <button
              id="podcast-download-takeaways-btn"
              onClick={handleDownloadTakeawaysAndTranscript}
              title="Download Takeaways & Full Script (.md)"
              className="p-1.5 text-slate-500 hover:text-[#796AEF] hover:bg-indigo-50 rounded-xl transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              id="podcast-copy-transcript-btn"
              onClick={handleCopyTranscript}
              title="Copy Entire Episode Script"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
            >
              {copiedId === "full" ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              id="podcast-close-modal-btn"
              onClick={handleCloseModal}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SUB-NAV TABS */}
        <div
          id="podcast-nav-tabs"
          className="px-4 py-2 bg-white border-b border-slate-100 flex items-center justify-between gap-1 text-[11px] font-bold"
        >
          <button
            id="podcast-tab-player"
            onClick={() => setActiveTab("player")}
            className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === "player"
                ? "bg-indigo-50 text-[#796AEF] border border-indigo-100/70"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>2-Host Studio</span>
          </button>
          <button
            id="podcast-tab-transcript"
            onClick={() => setActiveTab("transcript")}
            className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === "transcript"
                ? "bg-indigo-50 text-[#796AEF] border border-indigo-100/70"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Transcript ({totalSegments})</span>
          </button>
          <button
            id="podcast-tab-takeaways"
            onClick={() => setActiveTab("takeaways")}
            className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === "takeaways"
                ? "bg-indigo-50 text-[#796AEF] border border-indigo-100/70"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Key Takeaways</span>
          </button>
        </div>

        {/* MAIN BODY BASED ON ACTIVE TAB */}
        <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4">
          {activeTab === "player" && (
            <div id="podcast-player-tab-content" className="flex flex-col gap-4">
              {/* 2-HOST VISUAL STUDIO STAGE */}
              <div
                id="podcast-hosts-stage"
                className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-4 text-white overflow-hidden shadow-inner border border-slate-800"
              >
                {/* Background aura orb */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#796AEF]/15 rounded-full blur-2xl pointer-events-none" />

                {/* Sub-header topic info */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3 z-10 relative">
                  <span className="font-semibold text-indigo-300">
                    {podcast.subject} • {podcast.grade}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-300">
                      Segment {currentSegmentIndex + 1}/{totalSegments}
                    </span>
                  </div>
                </div>

                {/* DUAL HOST AVATARS */}
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  {/* MENTOR HOST CARD */}
                  <div
                    id="host-card-mentor"
                    className={`rounded-xl p-2.5 transition-all duration-300 border flex flex-col items-center text-center ${
                      isMentorSpeaking
                        ? "bg-indigo-950/70 border-[#796AEF] shadow-[0_0_15px_rgba(121,106,239,0.35)] scale-[1.02]"
                        : "bg-slate-800/40 border-slate-700/50 opacity-65"
                    }`}
                  >
                    <div className="relative mb-1.5">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition ${
                          isMentorSpeaking
                            ? "bg-gradient-to-tr from-[#796AEF] to-violet-500 ring-4 ring-[#796AEF]/40"
                            : "bg-slate-800"
                        }`}
                      >
                        {podcast.hosts.mentor.avatar || "👨‍🏫"}
                      </div>
                      {isMentorSpeaking && isPlaying && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          Speaking
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-white truncate max-w-full">
                      {podcast.hosts.mentor.name}
                    </span>
                    <span className="text-[10px] text-indigo-200 font-medium">
                      {podcast.hosts.mentor.title}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5 truncate max-w-[120px] px-1.5 py-0.5 rounded bg-slate-900/60 border border-slate-700/50">
                      {podcast.hosts.mentor.name.toLowerCase().includes("cherry") || podcast.hosts.mentor.voiceGender === "female"
                        ? "🎙️ Aoede (24kHz HD)"
                        : "🎙️ Charon (24kHz HD)"}
                    </span>
                  </div>

                  {/* STUDENT HOST CARD */}
                  <div
                    id="host-card-student"
                    className={`rounded-xl p-2.5 transition-all duration-300 border flex flex-col items-center text-center ${
                      isStudentSpeaking
                        ? "bg-indigo-950/70 border-[#796AEF] shadow-[0_0_15px_rgba(121,106,239,0.35)] scale-[1.02]"
                        : "bg-slate-800/40 border-slate-700/50 opacity-65"
                    }`}
                  >
                    <div className="relative mb-1.5">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition ${
                          isStudentSpeaking
                            ? "bg-gradient-to-tr from-amber-500 to-rose-500 ring-4 ring-amber-500/40"
                            : "bg-slate-800"
                        }`}
                      >
                        {podcast.hosts.student.avatar || "👩‍🎓"}
                      </div>
                      {isStudentSpeaking && isPlaying && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          Speaking
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-white truncate max-w-full">
                      {podcast.hosts.student.name}
                    </span>
                    <span className="text-[10px] text-amber-200 font-medium">
                      {podcast.hosts.student.title}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5 truncate max-w-[120px] px-1.5 py-0.5 rounded bg-slate-900/60 border border-slate-700/50">
                      🎙️ Kore (16yr Female)
                    </span>
                  </div>
                </div>

                {/* 🎙️ SEAMLESS ZERO-GAP STUDIO AUDIO STATUS BAR */}
                <div className="mt-2.5 flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-indigo-500/30 text-[10px]">
                  <div className="flex items-center gap-1.5 text-slate-200 min-w-0">
                    <span className="w-2 h-2 rounded-full flex-shrink-0 bg-emerald-400 animate-pulse" />
                    <span className="truncate">
                      🎙️ <strong className="text-emerald-300">Seamless Studio Audio</strong> • 24kHz HD (Zero Gap)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold text-[10px] flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Natural Human Flow</span>
                    </span>
                  </div>
                </div>

                {/* ANIMATED SOUNDWAVE VISUALIZER */}
                <div
                  id="podcast-audio-soundwave"
                  className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-center gap-1 h-7"
                >
                  {Array.from({ length: 24 }).map((_, i) => {
                    const isCenter = Math.abs(i - 12) < 6;
                    const heightClass = isPlaying
                      ? isCenter
                        ? "animate-pulse h-5 bg-[#796AEF]"
                        : "h-3 bg-indigo-400/80"
                      : "h-1.5 bg-slate-700";

                    return (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-200 ${heightClass}`}
                        style={{
                          animationDelay: `${(i % 5) * 0.12}s`,
                          animationDuration: isPlaying ? "0.6s" : "0s",
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* CURRENT ACTIVE DIALOGUE BUBBLE */}
              {currentSegment && (
                <div
                  id="podcast-current-dialogue"
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 relative"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">
                        {currentSegment.speakerName}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          isMentorSpeaking
                            ? "bg-indigo-50 text-[#796AEF] border-indigo-100"
                            : "bg-amber-50 text-amber-800 border-amber-100"
                        }`}
                      >
                        {isMentorSpeaking ? "Mentor" : "Peer Student"}
                      </span>
                      {isSegmentLoading && (
                        <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          <span>Streaming Studio Audio...</span>
                        </span>
                      )}
                    </div>

                    {/* Intent badge */}
                    {(() => {
                      const badge = getIntentBadge(currentSegment.intent);
                      const Icon = badge.icon;
                      return (
                        <div
                          className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </div>
                      );
                    })()}
                  </div>

                  <p className="text-slate-800 text-sm font-medium leading-relaxed italic">
                    "{currentSegment.text}"
                  </p>
                </div>
              )}

              {/* PROGRESS SLIDER */}
              <div id="podcast-progress-container" className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>
                    Turn {currentSegmentIndex + 1} of {totalSegments}
                  </span>
                  <span>{progressPercent}% Complete</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative cursor-pointer">
                  <div
                    className="h-full bg-gradient-to-r from-[#796AEF] to-indigo-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* CONTROLS DECK */}
              <div
                id="podcast-controls-deck"
                className="flex items-center justify-between gap-2 pt-1"
              >
                {/* Speed toggle */}
                <button
                  id="podcast-speed-toggle-btn"
                  onClick={cycleSpeed}
                  title="Playback Speed"
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{playbackSpeed}x</span>
                </button>

                {/* Center playback buttons */}
                <div className="flex items-center gap-2">
                  <button
                    id="podcast-rewind-btn"
                    onClick={handleRewind10}
                    title="Rewind 10 Seconds"
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    id="podcast-prev-btn"
                    onClick={handlePrevSegment}
                    disabled={currentSegmentIndex === 0}
                    title="Previous Segment"
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 rounded-full transition"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  {/* Big Play/Pause Button */}
                  <button
                    id="podcast-play-pause-btn"
                    onClick={handleTogglePlay}
                    title={isPlaying ? "Pause Episode" : "Play Episode"}
                    className="w-13 h-13 rounded-full bg-[#796AEF] hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-200 transition transform active:scale-95"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    id="podcast-next-btn"
                    onClick={handleNextSegment}
                    disabled={currentSegmentIndex >= totalSegments - 1}
                    title="Next Segment"
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 rounded-full transition"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>

                  <button
                    id="podcast-forward-btn"
                    onClick={handleForward10}
                    title="Forward 10 Seconds"
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Mute toggle */}
                <button
                  id="podcast-mute-toggle-btn"
                  onClick={handleToggleMute}
                  title={isMuted ? "Unmute Audio" : "Mute Audio"}
                  className={`p-2 rounded-xl transition ${
                    isMuted
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* 📥 DIRECT AUDIO DOWNLOAD & OFFLINE PLAYER ACTION HUB */}
              {isDownloadingAudio ? (
                <div
                  id="podcast-audio-download-progress-card"
                  className="mt-3 p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#796AEF]" />
                      <span>{downloadProgress?.statusText || "Synthesizing Real Human Audio..."}</span>
                    </span>
                    <span className="text-[#796AEF] font-black">
                      {downloadProgress?.percent || 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-indigo-200/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#796AEF] to-indigo-500 transition-all duration-300"
                      style={{ width: `${downloadProgress?.percent || 10}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-indigo-800 font-medium text-center">
                    🎙️ Gemini Live Actor 24kHz HD Voice • Real human sound without robotic glitches
                  </p>
                </div>
              ) : (
                <div
                  id="podcast-offline-download-hub"
                  className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2"
                >
                  {downloadStatusNote && (
                    <div className="text-center text-xs font-bold text-indigo-800 bg-indigo-50 py-1.5 px-2.5 rounded-xl border border-indigo-100">
                      {downloadStatusNote}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {/* 1. Direct Download Button */}
                    <button
                      id="podcast-direct-download-wav-btn"
                      onClick={handleDownloadAudioWav}
                      className="w-full py-2.5 px-3 rounded-2xl bg-[#796AEF] hover:bg-indigo-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-0.5 shadow-sm transition active:scale-[0.98] cursor-pointer min-h-[48px]"
                    >
                      <div className="flex items-center gap-1.5 font-extrabold">
                        <Download className="w-3.5 h-3.5" />
                        <span>Download .wav</span>
                      </div>
                      <span className="text-[9px] text-indigo-200 font-normal">
                        Direct to Device Storage
                      </span>
                    </button>

                    {/* 2. In-App Offline Player Save / Status */}
                    {isSavedOffline ? (
                      <div
                        id="podcast-offline-saved-card"
                        className="w-full py-2 px-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center gap-0.5 min-h-[48px] text-center"
                      >
                        <div className="flex items-center gap-1 text-emerald-800 font-extrabold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Saved Offline ✓</span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] text-emerald-700">
                          <span>बिना इंटरनेट चलेगा</span>
                          <button
                            onClick={handleDeleteOffline}
                            title="Remove from offline storage"
                            className="text-rose-600 hover:text-rose-800 hover:underline font-semibold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        id="podcast-save-offline-btn"
                        onClick={handleSaveOffline}
                        className="w-full py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex flex-col items-center justify-center gap-0.5 transition active:scale-[0.98] cursor-pointer min-h-[48px] border border-slate-200/70"
                      >
                        <div className="flex items-center gap-1.5 font-extrabold">
                          <HardDrive className="w-3.5 h-3.5 text-[#796AEF]" />
                          <span>Save Offline</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-normal">
                          In-App Offline Player
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-medium">
                    <WifiOff className="w-3 h-3 text-slate-400" />
                    <span>100% Real Human Voice • No internet required once saved</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TRANSCRIPT TAB */}
          {activeTab === "transcript" && (
            <div
              id="podcast-transcript-tab-content"
              ref={transcriptScrollRef}
              className="flex flex-col gap-2.5 max-h-[55vh] overflow-y-auto pr-1"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Click any statement to play directly from that point</span>
                <button
                  onClick={handleCopyTranscript}
                  className="text-[#796AEF] font-bold hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All</span>
                </button>
              </div>

              {podcast.segments.map((seg, idx) => {
                const isActive = idx === currentSegmentIndex;
                const isMentor = seg.speaker === "mentor";
                const badge = getIntentBadge(seg.intent);
                const Icon = badge.icon;

                return (
                  <div
                    key={seg.id || idx}
                    data-segment-idx={idx}
                    onClick={() => handleSelectSegment(idx)}
                    className={`p-3 rounded-2xl border transition cursor-pointer text-left ${
                      isActive
                        ? "bg-indigo-50/90 border-[#796AEF] shadow-sm ring-1 ring-[#796AEF]/30"
                        : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">
                          {isMentor
                            ? podcast.hosts.mentor.avatar || "👨‍🏫"
                            : podcast.hosts.student.avatar || "👩‍🎓"}
                        </span>
                        <span className="font-extrabold text-xs text-slate-900">
                          {seg.speakerName}
                        </span>
                        {isActive && isPlaying && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        )}
                      </div>

                      <div
                        className={`flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}
                      >
                        <Icon className="w-2.5 h-2.5" />
                        <span>{badge.label}</span>
                      </div>
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
                        isActive ? "text-slate-900 font-semibold" : "text-slate-700"
                      }`}
                    >
                      {seg.text}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* KEY TAKEAWAYS TAB */}
          {activeTab === "takeaways" && (
            <div id="podcast-takeaways-tab-content" className="flex flex-col gap-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-slate-800">
                <div className="flex items-center gap-2 font-bold text-xs text-[#796AEF] mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Episode Executive Summary</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700 font-medium">
                  {podcast.overview}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  🎯 High-Yield Takeaways
                </span>
                {podcast.keyTakeaways.map((takeaway, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {takeaway}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Exam Caution:</strong> Revision audio is optimized for building intuitive mental models. Pair this with numerical practice and PYQ solving for complete mastery.
                </span>
              </div>

              {/* Download Key Takeaways & Transcript Button */}
              <button
                type="button"
                onClick={handleDownloadTakeawaysAndTranscript}
                className="w-full py-2.5 px-4 rounded-xl bg-[#796AEF] hover:bg-[#6858e0] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Takeaways & Full Audio Transcript (.md)</span>
              </button>
            </div>
          )}
        </div>

        {/* BOTTOM QUICK FOOTER */}
        <div
          id="podcast-modal-bottom-bar"
          className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500"
        >
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#796AEF]" />
            <span>Cherry AI NotebookLM Studio</span>
          </div>
          <span className="font-mono font-medium">
            ~{Math.round(podcast.durationEstimateSec / 60)} min episode
          </span>
        </div>
      </motion.div>
    </div>
  );
}
