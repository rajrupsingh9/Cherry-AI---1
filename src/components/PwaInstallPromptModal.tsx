import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Download, 
  X, 
  CheckCircle2, 
  Share, 
  PlusSquare,
  Sparkles
} from "lucide-react";

interface PwaInstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstalledSuccess?: () => void;
}

export function PwaInstallPromptModal({
  isOpen,
  onClose,
  onInstalledSuccess
}: PwaInstallPromptModalProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone display mode
    const isRunningStandalone = 
      window.matchMedia("(display-mode: standalone)").matches || 
      (window.navigator as any).standalone === true;
    setIsStandalone(isRunningStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for browser's beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for successful installation
    const handleAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      if (onInstalledSuccess) onInstalledSuccess();
      setTimeout(() => {
        onClose();
      }, 2000);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [onClose, onInstalledSuccess]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setInstalling(true);
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setInstalled(true);
          if (onInstalledSuccess) onInstalledSuccess();
          setTimeout(() => {
            onClose();
          }, 1800);
        }
      } catch (err) {
        console.warn("[PWA] Install prompt error:", err);
      } finally {
        setInstalling(false);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      // For iOS, guidance is shown inline in the card
    } else {
      // Fallback for browsers that don't emit beforeinstallprompt
      alert("To install, tap your browser's menu (⋮ or ⚙️) and select 'Install app' or 'Add to Home screen'.");
    }
  };

  if (!isOpen || isStandalone) return null;

  return (
    <AnimatePresence>
      <div 
        id="pwa-install-mini-container"
        className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-[100] max-w-sm sm:max-w-md w-auto pointer-events-auto"
      >
        <motion.div
          id="pwa-install-banner"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 24, stiffness: 320 }}
          className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 text-slate-800 shadow-xl shadow-slate-900/10 relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#796AEF]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Main Mini Flex Row */}
          <div className="flex items-center justify-between gap-3 relative z-10">
            {/* App Icon */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#796AEF]/30 flex items-center justify-center shadow-xs">
                <span className="text-xl">🍒</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#796AEF] text-white rounded-full flex items-center justify-center text-[7px] font-black shadow-xs">
                <Sparkles className="w-2 h-2" />
              </span>
            </div>

            {/* Title & Concise Subtitle */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black tracking-tight text-slate-900 font-mono truncate">
                  Install Cherry AI
                </h4>
                <span className="px-1.5 py-0.2 rounded text-[7.5px] font-black font-mono uppercase bg-[#EEF2FF] text-[#796AEF] border border-[#796AEF]/30 shrink-0">
                  App 📱
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate mt-0.5 font-sans">
                Full-screen chalkboard & fast voice learning
              </p>
            </div>

            {/* Action Buttons: Install & Close */}
            <div className="flex items-center gap-1.5 shrink-0">
              {installed ? (
                <div className="px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-[10.5px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Added!</span>
                </div>
              ) : isIOS ? (
                <button
                  id="pwa-install-ios-btn"
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 bg-[#796AEF] hover:bg-[#6857ea] text-white rounded-xl text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs shadow-[#796AEF]/20"
                >
                  <span>How-To</span>
                </button>
              ) : (
                <button
                  id="pwa-install-action-btn"
                  type="button"
                  onClick={handleInstallClick}
                  disabled={installing}
                  className="px-3.5 py-1.5 bg-[#796AEF] hover:bg-[#6857ea] text-white rounded-xl text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs shadow-[#796AEF]/20 disabled:opacity-60"
                >
                  {installing ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-3 h-3 text-white stroke-[2.5]" />
                  )}
                  <span>Install</span>
                </button>
              )}

              {/* Close Button */}
              <button
                id="pwa-install-close-btn"
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer border border-slate-200/80 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* iOS 1-Line Minimal Steps (shown only on iOS) */}
          {isIOS && !installed && (
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[9.5px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <span>Tap</span>
                <span className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold inline-flex items-center gap-0.5">
                  <Share className="w-2.5 h-2.5" /> Share
                </span>
                <span>→</span>
                <span className="bg-[#EEF2FF] px-1 py-0.5 rounded text-[#796AEF] font-bold inline-flex items-center gap-0.5 border border-[#796AEF]/20">
                  <PlusSquare className="w-2.5 h-2.5" /> Add to Home Screen
                </span>
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
