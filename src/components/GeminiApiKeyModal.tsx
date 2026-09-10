import React, { useState, useEffect } from "react";
import {
  Key,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  X,
  Info,
  Plus,
  ArrowRightLeft,
  Check,
  Clock,
  Layers,
  Zap,
} from "lucide-react";
import {
  getAllStoredApiKeys,
  addStoredApiKey,
  removeStoredApiKey,
  setActiveApiKey,
  validateGeminiApiKey,
  maskApiKey,
  clearAllStoredApiKeys,
  StoredApiKey,
  resetKeyStatus,
} from "../utils/geminiKeyStorage";

interface GeminiApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast?: (msg: string, type?: "info" | "success" | "error") => void;
  onKeySaved?: () => void;
}

export const GeminiApiKeyModal: React.FC<GeminiApiKeyModalProps> = ({
  isOpen,
  onClose,
  onToast,
  onKeySaved,
}) => {
  const [keys, setKeys] = useState<StoredApiKey[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKeyInput, setNewKeyInput] = useState("");
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [showNewKey, setShowNewKey] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  const [isValidating, setIsValidating] = useState(false);
  const [testingKeyId, setTestingKeyId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [validationResult, setValidationResult] = useState<{
    valid?: boolean;
    message?: string;
    model?: string;
  } | null>(null);

  // Refresh keys list from storage
  const refreshKeys = () => {
    const list = getAllStoredApiKeys();
    setKeys(list);
    // If no keys exist, automatically expand the add form
    if (list.length === 0) {
      setShowAddForm(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshKeys();
      setNewKeyInput("");
      setNewKeyLabel("");
      setValidationResult(null);

      // 1-second ticker for live cooldown countdowns and pool synchronizations
      const timer = setInterval(() => {
        setNow(Date.now());
        const list = getAllStoredApiKeys();
        setKeys(list);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddKey = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanKey = newKeyInput.trim();
    if (!cleanKey) {
      setValidationResult({
        valid: false,
        message: "Kripya valid Gemini API Key enter karein.",
      });
      return;
    }

    // Check if key already exists in pool
    if (keys.some((k) => k.key.trim() === cleanKey)) {
      setValidationResult({
        valid: false,
        message: "Yeh API Key pehle se aapke pool me added hai!",
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      const res = await validateGeminiApiKey(cleanKey);
      setValidationResult(res);

      if (res.valid) {
        const assignedLabel =
          newKeyLabel.trim() ||
          (keys.length === 0 ? "Primary Key" : `Backup Key ${keys.length}`);

        addStoredApiKey(cleanKey, assignedLabel);
        refreshKeys();
        setNewKeyInput("");
        setNewKeyLabel("");
        setShowAddForm(false);

        if (onToast) {
          onToast(`API Key "${assignedLabel}" verified & added to pool! 🎉`, "success");
        }
        if (onKeySaved) onKeySaved();
      } else {
        if (onToast) onToast(res.message || "API Key verification failed.", "error");
      }
    } catch (err: any) {
      setValidationResult({
        valid: false,
        message: err?.message || "Verification failed. Please check network connection.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSwitchActive = (id: string, label: string) => {
    setActiveApiKey(id);
    refreshKeys();
    if (onToast) onToast(`Switched active key to "${label}"! ⚡`, "info");
  };

  const handleRemoveKey = (id: string, label: string) => {
    removeStoredApiKey(id);
    refreshKeys();
    if (onToast) onToast(`Removed "${label}" from key pool.`, "info");
  };

  const handleTestExistingKey = async (keyItem: StoredApiKey) => {
    setTestingKeyId(keyItem.id);
    try {
      const res = await validateGeminiApiKey(keyItem.key);
      if (res.valid) {
        resetKeyStatus(keyItem.id, keyItem.status === "active" ? "active" : "standby");
        refreshKeys();
        if (onToast) onToast(`"${keyItem.label}" is working perfectly! 🟢`, "success");
      } else {
        if (onToast) onToast(`"${keyItem.label}" validation failed: ${res.message}`, "error");
      }
    } finally {
      setTestingKeyId(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Kya aap saari custom API keys remove karke system default par aana chahte hain?")) {
      clearAllStoredApiKeys();
      refreshKeys();
      setShowAddForm(true);
      if (onToast) onToast("Saari custom keys clear kar di gayi hain.", "info");
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeKey = keys.find((k) => k.status === "active");

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex justify-center animate-fade-in select-none">
      <div className="relative w-full h-[100dvh] h-screen sm:max-w-lg bg-white text-slate-800 sm:border-x sm:border-slate-200/90 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Full-Screen Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Gemini API Key Pool
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] font-mono font-bold">
                  Multi-Key Failover
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                Auto-switch keys when rate limits hit for zero disruptions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 sm:p-5 space-y-4 overflow-y-auto text-xs pb-[max(5rem,calc(env(safe-area-inset-bottom)+3.5rem))]">
          
          {/* Failover Status Banner */}
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
            keys.length > 0
              ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
              : "bg-amber-50/80 border-amber-200 text-amber-950"
          }`}>
            {keys.length > 0 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs">
                  {keys.length > 0
                    ? `${keys.length} API Key${keys.length > 1 ? "s" : ""} in Active Pool`
                    : "No Custom Keys Configured"}
                </span>
                <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  keys.length > 1
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : keys.length === 1
                    ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}>
                  {keys.length > 1 ? "⚡ Predictive Handover Armed" : keys.length === 1 ? "Single Key Active" : "Default Mode"}
                </span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                {keys.length > 1
                  ? "Zero-Interruption Guarantee: Har key ka safe budget 10 requests/min hai. Quota limit hit hone se pehle system standby key par pre-emptively shift kar dega aur purani key 60s cooldown ke baad auto-recover ho jayegi."
                  : keys.length === 1
                  ? "Aapka primary key active hai. Safe continuous learning ke liye 1-2 backup keys add kar sakte hain."
                  : "Google AI Studio se 100% Free Gemini API keys generate karke yahan add karein."}
              </p>
            </div>
          </div>

          {/* Keys Pool List */}
          {keys.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Configured Keys ({keys.length})</span>
                </span>
                {keys.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-[10.5px] font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {keys.map((item, idx) => {
                  const isActive = item.status === "active";
                  const isExhausted = item.status === "exhausted";
                  const isTesting = testingKeyId === item.id;
                  const isRevealed = Boolean(revealedKeys[item.id]);
                  const remainingSec = item.cooldownUntil
                    ? Math.max(0, Math.ceil((item.cooldownUntil - now) / 1000))
                    : 0;

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border transition-all relative ${
                        isActive
                          ? "bg-indigo-50/50 border-indigo-300/80 shadow-xs"
                          : isExhausted
                          ? "bg-amber-50/40 border-amber-200/80"
                          : "bg-slate-50 border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-5 h-5 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-extrabold text-xs text-slate-900 truncate">
                            {item.label}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-1 shrink-0">
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9.5px] font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                              Active (In Use)
                            </span>
                          )}
                          {!isActive && !isExhausted && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 text-[9.5px] font-bold">
                              Standby Backup
                            </span>
                          )}
                          {isExhausted && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[9.5px] font-bold flex items-center gap-1 animate-pulse">
                              <Clock className="w-2.5 h-2.5 text-amber-700" />
                              <span>{remainingSec > 0 ? `Cooldown: ${remainingSec}s` : "Cooldown Ending..."}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Key Display & Controls */}
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600 font-bold bg-white/80 border border-slate-200/70 px-2.5 py-1 rounded-xl">
                          <span>{isRevealed ? item.key : maskApiKey(item.key)}</span>
                          <button
                            type="button"
                            onClick={() => toggleReveal(item.id)}
                            className="p-0.5 text-slate-400 hover:text-slate-600 ml-1 cursor-pointer"
                            title={isRevealed ? "Hide Key" : "Show Key"}
                          >
                            {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Switch to Active Button */}
                          {!isActive && (
                            <button
                              type="button"
                              onClick={() => handleSwitchActive(item.id, item.label)}
                              className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                              title="Make this the currently active key"
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              <span>Set Active</span>
                            </button>
                          )}

                          {/* Test Key Button */}
                          <button
                            type="button"
                            onClick={() => handleTestExistingKey(item)}
                            disabled={isTesting}
                            className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                            title="Test API Key connection"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin text-indigo-600" : ""}`} />
                          </button>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveKey(item.id, item.label)}
                            className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                            title="Remove Key"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Live Cooldown Auto-Recovery Progress */}
                      {isExhausted && remainingSec > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-amber-200/70 flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-amber-900 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>60s Cooldown Auto-Recovery</span>
                            </span>
                            <span className="font-mono font-bold text-amber-800">
                              Ready in {remainingSec}s
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(100, Math.max(5, ((60 - remainingSec) / 60) * 100))}%`,
                              }}
                            />
                          </div>
                          <span className="text-[9.5px] text-amber-700/80">
                            Timer khatam hote hi yeh key automatic Standby Pool me shamil ho jayegi.
                          </span>
                        </div>
                      )}

                      {/* Active Key Safe RPM Fuel Meter */}
                      {isActive && (
                        <div className="mt-2.5 pt-2 border-t border-indigo-200/70 flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-indigo-950 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-indigo-600" />
                              <span>Safe RPM Fuel Gauge</span>
                            </span>
                            <span className="font-mono font-bold text-indigo-700">
                              {item.requestCountInWindow || 0} / 10 safe calls
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-indigo-200/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                (item.requestCountInWindow || 0) >= 8
                                  ? "bg-amber-500"
                                  : "bg-indigo-600"
                              }`}
                              style={{
                                width: `${Math.min(100, (((item.requestCountInWindow || 0) / 10) * 100))}%`,
                              }}
                            />
                          </div>
                          <span className="text-[9.5px] text-slate-500">
                            {keys.length > 1
                              ? "⚡ 10 calls ke baad agla call standby key par bina rukaawat shift hoga."
                              : "💡 Continuous zero-interruption ke liye ek backup key add karein."}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Toggle Add Key Form Button */}
          {!showAddForm && keys.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setShowAddForm(true);
                setNewKeyLabel(`Backup Key ${keys.length}`);
              }}
              className="w-full py-2.5 px-3 rounded-2xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Backup Gemini API Key</span>
            </button>
          )}

          {/* Add Key Form */}
          {showAddForm && (
            <form onSubmit={handleAddKey} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{keys.length === 0 ? "Add Primary Gemini Key" : "Add Backup Gemini Key"}</span>
                </span>
                {keys.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Optional Label */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-600">
                  Key Nickname / Label (Optional)
                </label>
                <input
                  type="text"
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  placeholder={keys.length === 0 ? "Primary Key" : `Backup Key ${keys.length}`}
                  className="w-full bg-white border border-slate-200 focus:border-indigo-600 rounded-xl px-3 py-1.5 text-xs font-sans text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* API Key Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-600">
                    Google Gemini API Key
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10.5px] text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1 hover:underline"
                  >
                    <span>Free Key Paayein</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showNewKey ? "text" : "password"}
                    value={newKeyInput}
                    onChange={(e) => {
                      setNewKeyInput(e.target.value);
                      setValidationResult(null);
                    }}
                    placeholder="AIzaSy..."
                    className="w-full bg-white border border-slate-200 focus:border-indigo-600 rounded-xl px-3 py-2 pr-9 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewKey(!showNewKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showNewKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Validation Feedback */}
              {validationResult && (
                <div className={`p-2.5 rounded-xl text-xs flex items-start gap-2 border ${
                  validationResult.valid
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}>
                  {validationResult.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="text-[11px] leading-tight">
                    <span className="font-bold block">{validationResult.message}</span>
                    {validationResult.model && (
                      <span className="text-[9.5px] opacity-80 mt-0.5 block font-mono">
                        Connected: {validationResult.model}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isValidating || !newKeyInput.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer disabled:cursor-not-allowed"
              >
                {isValidating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying & Adding Key...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Verify & Add to Key Pool</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Guide Step-by-Step */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
              <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Free API Key Kaise Paayein? (Multiple Google Accounts)</span>
            </div>
            <ol className="space-y-1.5 text-[11px] text-slate-600 list-decimal pl-4 leading-relaxed font-medium">
              <li>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-0.5"
                >
                  aistudio.google.com/app/apikey <ExternalLink className="w-2.5 h-2.5" />
                </a>{" "}
                par apna Google Account login karein.
              </li>
              <li><strong>"Create API Key"</strong> par click karke copy karein.</li>
              <li>
                <strong>Tip:</strong> Aap 2 alag-alag Gmail accounts se 2 keys generate karke yahan Primary aur Backup me add kar sakte hain taaki quota kabhi na ruke!
              </li>
            </ol>
          </div>

          {/* Privacy Guarantee */}
          <div className="flex items-center gap-2 text-[10.5px] text-slate-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Saari API Keys keval aapke device/browser me encrypted rahti hain aur direct Google API proxy calls me use hoti hain.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
