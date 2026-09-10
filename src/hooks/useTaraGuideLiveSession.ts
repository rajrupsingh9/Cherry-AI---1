// useTaraGuideLiveSession.ts
// Live voice session hook for Tara Ma'am (AI Socratic Numerical & Problem Guide)

import { useState, useRef, useEffect, useCallback } from "react";
import { AudioStreamer } from "../utils/AudioStreamer";
import { LiveTranscription } from "../types";
import { getStoredGeminiApiKey, markKeyExhausted } from "../utils/geminiKeyStorage";

export type TaraLiveState = "disconnected" | "connecting" | "idle" | "listening" | "speaking" | "error";

interface UseTaraGuideLiveSessionProps {
  onToast: (message: string, type: "info" | "success" | "error") => void;
  studentName?: string;
  grade?: string;
  board?: string;
  subject?: string;
  replyContext?: string;
  initialTopicPrompt?: string;
}

export function useTaraGuideLiveSession({
  onToast,
  studentName = "",
  grade = "Class 10",
  board = "CBSE",
  subject = "Mathematics",
  replyContext = "",
  initialTopicPrompt,
}: UseTaraGuideLiveSessionProps) {
  const [sessionState, setSessionState] = useState<TaraLiveState>("disconnected");
  const [userVolume, setUserVolume] = useState<number>(0);
  const [taraVolume, setTaraVolume] = useState<number>(0);
  const [userTranscript, setUserTranscript] = useState<LiveTranscription>({ text: "", finished: true });
  const [taraTranscript, setTaraTranscript] = useState<LiveTranscription>({ text: "", finished: true });
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);
  const streamerRef = useRef<AudioStreamer | null>(null);
  const taraTurnIdRef = useRef<string | null>(null);
  const connectTaraRef = useRef<() => void>(() => {});
  const pendingTopicPromptRef = useRef<string | null>(initialTopicPrompt || null);
  const isMutedRef = useRef<boolean>(false);
  isMutedRef.current = isMuted;

  useEffect(() => {
    if (initialTopicPrompt) {
      pendingTopicPromptRef.current = initialTopicPrompt;
    }
  }, [initialTopicPrompt]);

  // Lazy initialize streamer instance
  const getStreamer = (): AudioStreamer => {
    if (!streamerRef.current) {
      streamerRef.current = new AudioStreamer();
    }
    return streamerRef.current;
  };

  // Instantly halts audio output schedule
  const stopTaraPlayback = useCallback(() => {
    if (streamerRef.current) {
      streamerRef.current.stopPlayback();
    }
    setTaraVolume(0);
  }, []);

  // Safe session teardown
  const disconnectTara = useCallback(() => {
    setSessionState("disconnected");

    if (streamerRef.current) {
      streamerRef.current.destroy();
      streamerRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (e) {}
      wsRef.current = null;
    }

    setUserVolume(0);
    setTaraVolume(0);
    setUserTranscript({ text: "", finished: true });
    setTaraTranscript({ text: "", finished: true });
    taraTurnIdRef.current = null;
  }, []);

  // Receive server message
  const handleServerMessage = useCallback(
    async (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);

        // Play audio chunks
        if (msg.type === "audio" && msg.data) {
          setSessionState("speaking");
          const streamer = getStreamer();
          await streamer.playAudioChunk(msg.data, () => {
            if (streamer.getPlaybackVolume() === 0) {
              setSessionState((prev) => (prev === "speaking" ? "idle" : prev));
              setTaraVolume(0);
            }
          });
        }

        // Interruption
        else if (msg.type === "interrupted") {
          console.log("[Tara Live Hook] Tara Ma'am interrupted by student voice.");
          stopTaraPlayback();
          setSessionState("listening");
          setTaraTranscript((prev) => ({ ...prev, finished: true }));
          taraTurnIdRef.current = null;
        }

        // Input transcription
        else if (msg.type === "inputTranscription") {
          setUserTranscript({
            text: msg.text,
            finished: msg.finished,
          });
        }

        // Output transcription
        else if (msg.type === "outputTranscription") {
          if (!taraTurnIdRef.current) {
            taraTurnIdRef.current = "tara-" + Math.random().toString(36).substring(2, 11);
            setTaraTranscript({
              text: msg.text,
              finished: msg.finished,
              id: taraTurnIdRef.current,
            });
          } else {
            setTaraTranscript((prev) => {
              const currentId = taraTurnIdRef.current || prev.id;
              const originalText = prev.id === currentId ? prev.text : "";
              return {
                text: originalText + msg.text,
                finished: msg.finished,
                id: currentId!,
              };
            });
          }

          if (msg.finished) {
            taraTurnIdRef.current = null;
          }

          if (!msg.finished) {
            setSessionState("speaking");
          }
        }

        // Ready handshake
        else if (msg.type === "ready") {
          console.log("[Tara Live Hook] Handshake completed with Tara Ma'am.");
          setSessionState("idle");
          onToast(`Tara Ma'am is live! Namaste ${studentName || "Student"} 🧭`, "success");

          // Auto-prompt Tara with the reply context if pending
          if (pendingTopicPromptRef.current) {
            const topicToSend = pendingTopicPromptRef.current;
            pendingTopicPromptRef.current = null;
            setTimeout(() => {
              if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                console.log("[Tara Live Hook] Sending initial discussion context to Tara Ma'am:", topicToSend);
                wsRef.current.send(
                  JSON.stringify({
                    type: "text",
                    text: topicToSend,
                  })
                );
              }
            }, 500);
          }
        }

        // Disconnection or error
        else if (msg.type === "disconnected" || msg.type === "error") {
          console.warn("[Tara Live Hook] Connection closed/error:", msg.error);

          const errText = String(msg.error || "").toLowerCase();
          const isQuota =
            msg.code === 429 ||
            msg.isQuota ||
            errText.includes("429") ||
            errText.includes("resource_exhausted") ||
            errText.includes("quota") ||
            errText.includes("rate limit") ||
            errText.includes("too many requests");

          if (isQuota && msg.type === "error") {
            const currentKey = getStoredGeminiApiKey();
            const rotation = markKeyExhausted(currentKey);
            if (rotation.success && rotation.nextKey) {
              onToast(
                `⚡ Rate limit reached. Switching to ${rotation.nextKeyLabel}... 🧭`,
                "info"
              );
              disconnectTara();
              setTimeout(() => {
                connectTaraRef.current();
              }, 700);
              return;
            }
          }

          disconnectTara();
          if (msg.type === "error") {
            onToast(msg.error || "A connection issue occurred with Tara Ma'am.", "error");
          }
        }
      } catch (err) {
        console.error("[Tara Live Hook] Error processing server packet:", err);
      }
    },
    [onToast, stopTaraPlayback, disconnectTara, studentName]
  );

  // Send quick text prompt to Tara over WebSocket
  const sendTopicPrompt = (topicText: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "text",
          text: topicText,
        })
      );
      onToast(`Asked Tara Ma'am: "${topicText.length > 35 ? topicText.substring(0, 35) + "..." : topicText}"`, "info");
    } else {
      pendingTopicPromptRef.current = topicText;
      if (sessionState === "disconnected") {
        connectTara(topicText);
      }
    }
  };

  // Connect to Tara Ma'am
  const connectTara = async (optionalTopic?: string) => {
    if (optionalTopic) {
      pendingTopicPromptRef.current = optionalTopic;
    }
    connectTaraRef.current = () => connectTara();
    if (sessionState !== "disconnected") {
      if (optionalTopic) {
        sendTopicPrompt(optionalTopic);
      }
      return;
    }

    setSessionState("connecting");
    onToast("Connecting live voice with Tara Ma'am (तारा मैम)...", "info");

    try {
      const streamer = getStreamer();

      // Setup WebSocket URL with student and discussion parameters
      const isHttps = window.location.protocol === "https:";
      const wsProtocol = isHttps ? "wss:" : "ws:";
      const targetHost = window.location.host;
      const userApiKey = getStoredGeminiApiKey();
      
      const cleanReplySnippet = replyContext ? replyContext.substring(0, 1500) : "";

      const wsUrl = `${wsProtocol}//${targetHost}/api/guide-live?studentName=${encodeURIComponent(
        studentName
      )}&grade=${encodeURIComponent(grade)}&board=${encodeURIComponent(board)}&subject=${encodeURIComponent(
        subject
      )}${cleanReplySnippet ? `&replyContext=${encodeURIComponent(cleanReplySnippet)}` : ""}${
        userApiKey ? `&apiKey=${encodeURIComponent(userApiKey)}` : ""
      }`;

      console.log("[Tara Live Hook] Opening WebSocket stream for Tara Ma'am:", wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = handleServerMessage;
      ws.onclose = () => {
        console.log("[Tara Live Hook] WebSocket closed.");
        disconnectTara();
      };
      ws.onerror = (e) => {
        console.error("[Tara Live Hook] WebSocket error:", e);
        setSessionState("error");
        onToast("Tara Ma'am connection interrupted. Please try again! 🎙️", "error");
        disconnectTara();
      };

      // Handle raw mic recording streams
      await streamer.startRecording(
        (base64PCM) => {
          if (isMutedRef.current) return;
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "audio",
                data: base64PCM,
              })
            );
          }
        },
        (micVolume) => {
          if (isMutedRef.current) {
            setUserVolume(0);
            return;
          }
          setUserVolume(micVolume);
          if (micVolume > 0.02) {
            setSessionState((prev) => (prev === "idle" ? "listening" : prev));
          }
        }
      );

      // Web Socket keepalive Ping loop
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 15000);

      ws.addEventListener("close", () => clearInterval(pingInterval));
    } catch (err: any) {
      console.error("[Tara Live Hook] Mic authorization or connection failed:", err);
      setSessionState("error");
      onToast(err.message || "Failed starting microphone. Please grant permission.", "error");
      disconnectTara();
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        setUserVolume(0);
        onToast("Microphone muted 🔇", "info");
      } else {
        onToast("Microphone live 🎙️", "info");
      }
      return next;
    });
  };

  // Speaker nodes real-time feedback volume loop
  useEffect(() => {
    let animId: number;
    const monitorVolume = () => {
      if (streamerRef.current && sessionState === "speaking") {
        const vol = streamerRef.current.getPlaybackVolume();
        setTaraVolume(vol);
      } else {
        setTaraVolume(0);
      }
      animId = requestAnimationFrame(monitorVolume);
    };
    monitorVolume();
    return () => cancelAnimationFrame(animId);
  }, [sessionState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectTara();
    };
  }, [disconnectTara]);

  return {
    state: sessionState,
    userVolume,
    taraVolume,
    userTranscript,
    taraTranscript,
    isMuted,
    toggleMute,
    connect: connectTara,
    disconnect: disconnectTara,
    stopPlayback: stopTaraPlayback,
    sendTopicPrompt,
  };
}
