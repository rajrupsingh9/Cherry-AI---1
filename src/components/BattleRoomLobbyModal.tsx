import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { 
  Users, Swords, Copy, Share2, X, Clock, Play, CheckCircle2, 
  Crown, Sparkles, BookOpen, AlertCircle, ShieldCheck, Flame,
  Check, Loader2, Timer, Zap, Radio, CheckSquare, Square
} from "lucide-react";
import { 
  BattleRoomData, 
  BattleParticipant, 
  subscribeToBattleRoom,
  subscribeToBattleParticipants, 
  toggleParticipantReady,
  startBattleRoomLive,
  buildBattleInviteMessage 
} from "../services/battleRoomService";
import { auth } from "../lib/firebase";

interface BattleRoomLobbyModalProps {
  isOpen: boolean;
  room: BattleRoomData | null;
  currentStudentName?: string;
  onClose: () => void;
  onStartQuiz: (room: BattleRoomData) => void;
  onToast: (text: string, type: "success" | "info" | "error") => void;
}

export const BattleRoomLobbyModal: React.FC<BattleRoomLobbyModalProps> = ({
  isOpen,
  room,
  currentStudentName = "You",
  onClose,
  onStartQuiz,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [participants, setParticipants] = useState<BattleParticipant[]>([]);
  const [liveRoomData, setLiveRoomData] = useState<BattleRoomData | null>(room);
  const [isStarting, setIsStarting] = useState(false);
  const [myReadyState, setMyReadyState] = useState<boolean>(true);
  
  // Countdown Timer State
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number | null>(null);
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);

  const currentUid = auth.currentUser?.uid || `guest_${Date.now()}`;
  const activeRoom = liveRoomData || room;
  const isHost = activeRoom ? (activeRoom.hostUid === currentUid || activeRoom.hostName.includes("You")) : false;

  // 1. Subscribe to real-time room metadata & automatic launch synchronization
  useEffect(() => {
    if (!isOpen || !room?.roomId) return;
    setLiveRoomData(room);

    const unsubscribeRoom = subscribeToBattleRoom(room.roomId, (updatedRoom) => {
      if (updatedRoom) {
        setLiveRoomData(updatedRoom);
        // If room status turned "live", auto-transition all joined players to live quiz!
        if (updatedRoom.status === "live") {
          onToast(`🚀 Host started the Battle! Transitioning to live quiz...`, "success");
          onStartQuiz(updatedRoom);
          onClose();
        }
      }
    });

    return () => {
      if (unsubscribeRoom) unsubscribeRoom();
    };
  }, [isOpen, room?.roomId]);

  // 2. Subscribe to real-time participants in this room
  useEffect(() => {
    if (!isOpen || !room?.roomId) return;

    // Initial default fallback participants
    setParticipants([
      {
        uid: room.hostUid || "host_1",
        name: room.hostName || "Host (You)",
        isHost: true,
        isReady: true,
        score: 0,
        avatar: "👑"
      }
    ]);

    const unsubscribeParticipants = subscribeToBattleParticipants(room.roomId, (liveList) => {
      if (liveList && liveList.length > 0) {
        setParticipants(liveList);
        const me = liveList.find(p => p.uid === currentUid);
        if (me) {
          setMyReadyState(me.isReady !== false);
        }
      }
    });

    return () => {
      if (unsubscribeParticipants) unsubscribeParticipants();
    };
  }, [isOpen, room?.roomId, currentUid]);

  // 3. Live Countdown Ticker Calculation
  useEffect(() => {
    if (!isOpen || !activeRoom) return;

    // If Instant match, timer is immediate
    if (activeRoom.isInstant) {
      setTimeLeftSeconds(0);
      setIsCountdownFinished(true);
      return;
    }

    const targetTime = activeRoom.scheduledTimestamp || (Date.now() + 300000);

    const updateTicker = () => {
      const diff = targetTime - Date.now();
      if (diff <= 0) {
        setTimeLeftSeconds(0);
        setIsCountdownFinished(true);
      } else {
        setTimeLeftSeconds(Math.ceil(diff / 1000));
        setIsCountdownFinished(false);
      }
    };

    updateTicker();
    const interval = setInterval(updateTicker, 1000);

    return () => clearInterval(interval);
  }, [isOpen, activeRoom?.scheduledTimestamp, activeRoom?.isInstant]);

  // 4. Auto-launch when scheduled countdown finishes for live synchronized start
  useEffect(() => {
    if (isCountdownFinished && activeRoom && !activeRoom.isInstant && isOpen) {
      if (isHost && activeRoom.status === "waiting") {
        // Host automatically triggers live transition when timer hits 00:00
        handleStartLive();
      }
    }
  }, [isCountdownFinished, isHost, activeRoom?.status, isOpen]);

  if (!isOpen || !activeRoom) return null;

  const handleCopyCode = () => {
    const inviteMessage = buildBattleInviteMessage(activeRoom);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteMessage);
      setCopied(true);
      onToast(`Room Code ${activeRoom.code} & Invite text copied! 📋`, "success");
      setTimeout(() => setCopied(false), 2000);
    } else {
      onToast(`Room Code: ${activeRoom.code}`, "info");
    }
  };

  const handleShareWhatsApp = () => {
    const shareText = buildBattleInviteMessage(activeRoom);
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  // Toggle player ready status
  const handleToggleReady = async () => {
    const nextState = !myReadyState;
    setMyReadyState(nextState);
    try {
      await toggleParticipantReady(activeRoom.roomId, currentUid, nextState);
      onToast(nextState ? "You are marked READY! 🟢" : "Status set to NOT READY 🟡", "info");
    } catch (e) {
      console.warn("Could not sync ready state:", e);
    }
  };

  // Trigger Live Quiz Start
  const handleStartLive = async () => {
    setIsStarting(true);
    try {
      await startBattleRoomLive(activeRoom.roomId);
      onToast(`⚔️ Launching Battle Quiz for everyone!`, "success");
      onStartQuiz(activeRoom);
      onClose();
    } catch (err: any) {
      console.error("Start battle failed:", err);
      // Fallback local launch
      onStartQuiz(activeRoom);
      onClose();
    } finally {
      setIsStarting(false);
    }
  };

  const displayParticipants = participants.length > 0 ? participants : [
    { uid: "p1", name: activeRoom.hostName || "Host (You)", isHost: true, isReady: true, score: 0, avatar: "👑" },
    { uid: "p2", name: "Ananya Sharma", isHost: false, isReady: true, score: 0, avatar: "👧" },
    { uid: "p3", name: "Rohan V.", isHost: false, isReady: true, score: 0, avatar: "👦" }
  ];

  const readyCount = displayParticipants.filter(p => p.isReady !== false).length;

  // Format seconds to mm:ss
  const formatCountdown = (totalSecs: number | null) => {
    if (totalSecs === null || totalSecs <= 0) return "00:00";
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const modalNode = (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-fadeIn text-left select-none">
      <div 
        className="bg-white border-2 border-[#796AEF]/30 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col animate-scaleUp max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#796AEF] via-[#6858E0] to-[#1E293B] text-white px-5 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-amber-400 text-[#1E293B] shrink-0 font-black shadow-xs">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-black bg-emerald-500/20 border border-emerald-400/40 text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <Radio className="w-2.5 h-2.5 text-emerald-400" />
                  PRE-QUIZ LOBBY LIVE
                </span>
                <span className="text-[10px] text-indigo-100 font-mono">
                  {activeRoom.scheduledTime}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight truncate max-w-[260px] sm:max-w-none">
                {activeRoom.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all cursor-pointer shrink-0"
            title="Close Lobby"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">

          {/* 1. COUNTDOWN TICKER & SCHEDULED STATUS BANNER */}
          <div className="bg-gradient-to-r from-[#796AEF] via-[#6858E0] to-[#1E293B] rounded-2xl p-3.5 text-white shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-200">
                <Timer className="w-3.5 h-3.5 text-amber-300" />
                <span>{activeRoom.isInstant ? "Instant Match Mode" : "Battle Scheduled Countdown"}</span>
              </div>
              <p className="text-[11px] text-indigo-100/90">
                {activeRoom.isInstant 
                  ? "Host can launch whenever players are ready." 
                  : `Starts automatically at ${activeRoom.scheduledTime}`}
              </p>
            </div>

            {/* Countdown Badge */}
            <div className="bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-xl text-center shrink-0">
              <span className="text-[9px] font-mono uppercase text-indigo-200 block font-bold">
                {activeRoom.isInstant ? "STATUS" : "STARTS IN"}
              </span>
              <span className="text-lg sm:text-xl font-mono font-black text-amber-300 tracking-wider">
                {activeRoom.isInstant ? "READY" : formatCountdown(timeLeftSeconds)}
              </span>
            </div>
          </div>
          
          {/* 2. Room Code Card with Copy & WhatsApp Share */}
          <div className="bg-[#796AEF]/10 border border-[#796AEF]/20 rounded-2xl p-3.5 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#1E293B]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Share 6-Digit Join Code with Friends</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="bg-white border-2 border-[#796AEF] text-[#1E293B] font-mono font-black text-xl sm:text-2xl px-5 py-1.5 rounded-2xl tracking-widest shadow-xs">
                {activeRoom.code}
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-2 bg-white hover:bg-[#796AEF]/15 border border-[#796AEF]/30 rounded-2xl text-[#1E293B] transition-all cursor-pointer shadow-2xs"
                title="Copy Code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>One-Tap WhatsApp Invite</span>
              </button>
            </div>
          </div>

          {/* 3. Syllabus & Format details */}
          <div className="bg-[#F6F7FB] border border-[#EFF1F5] rounded-2xl p-3 space-y-1 text-xs">
            <div className="flex items-center justify-between text-[#4A4E5A] font-bold uppercase text-[9.5px]">
              <span>Syllabus Covered:</span>
              <span>{activeRoom.subject} • {activeRoom.grade}</span>
            </div>
            <div className="font-bold text-[#1E293B] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#796AEF] shrink-0" />
              <span className="truncate">{activeRoom.chapterOrFileName}</span>
            </div>
            <div className="flex items-center gap-3 pt-0.5 text-[10px] font-mono text-[#4A4E5A]">
              <span>🎯 {activeRoom.numQuestions} Questions</span>
              <span>⏱️ {activeRoom.timePerQuestion}s / Q</span>
              <span>👑 Host: {activeRoom.hostName}</span>
            </div>
          </div>

          {/* 4. Live Participants & Ready Status Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-[#1E293B] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#796AEF]" />
                <span>Joined Friends ({displayParticipants.length})</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {readyCount} / {displayParticipants.length} Ready
                </span>
                <button
                  type="button"
                  onClick={handleToggleReady}
                  className={`text-[9.5px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                    myReadyState 
                      ? "bg-emerald-100 border-emerald-300 text-emerald-800" 
                      : "bg-amber-50 border-amber-300 text-amber-800"
                  }`}
                  title="Toggle your ready status"
                >
                  {myReadyState ? <CheckSquare className="w-3 h-3 text-emerald-700" /> : <Square className="w-3 h-3 text-amber-700" />}
                  <span>{myReadyState ? "I'm Ready" : "Set Ready"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {displayParticipants.map((p, idx) => (
                <div 
                  key={p.uid || idx}
                  className="bg-white border border-[#EFF1F5] rounded-2xl p-2.5 flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">{p.avatar || (p.isHost ? "👑" : "🎓")}</span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#1E293B] truncate">
                        {p.name}
                      </div>
                      {p.isHost && (
                        <span className="text-[8px] font-mono font-black text-amber-700 bg-amber-50 px-1 py-0.2 rounded">
                          HOST
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    {p.isReady !== false ? (
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100 flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Ready
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-[#4A4E5A] bg-[#F6F7FB] px-1.5 py-0.5 rounded-md">
                        Waiting...
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Action Controls (Host Start or Player Synchronization) */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isStarting}
              onClick={handleStartLive}
              className="w-full bg-[#796AEF] hover:bg-[#6858E0] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-[0.99] group disabled:opacity-50"
            >
              {isStarting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  Synchronizing Arena for All Players...
                </span>
              ) : (
                <>
                  <Play className="w-4 h-4 text-amber-300 fill-amber-300 group-hover:scale-110 transition-transform" />
                  <span>{isHost ? "Launch Battle Quiz for All Now" : "Enter Synchronized Battle Arena"}</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-[#4A4E5A] font-medium mt-1.5">
              ⚡ Synchronized Quiz Engine: Starting the battle transitions all joined friends to Question 1 simultaneously.
            </p>
          </div>

        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalNode, document.body) : modalNode;
};


