import React, { useState, useEffect, useRef } from "react";
import {
  Crown,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  Copy,
  Check,
  QrCode,
  ArrowRight,
  RefreshCw,
  X,
  ExternalLink,
  Receipt,
  Settings,
  ChevronRight,
  AlertCircle,
  Smartphone,
  Award,
} from "lucide-react";
import QRCode from "qrcode";
import confetti from "canvas-confetti";
import {
  SUBSCRIPTION_PLANS,
  SubscriptionPlan,
  SubscriptionState,
  loadSubscriptionState,
  buildDynamicUpiUri,
  generateTransactionReference,
  activateSubscription,
  updateMerchantUpiConfig,
  DEFAULT_RECEIVER_UPI_ID,
  DEFAULT_MERCHANT_NAME,
} from "../utils/subscriptionStore";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  onToast?: (message: string, type?: "info" | "success" | "warning" | "error") => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  studentName = "Student",
  onToast,
}) => {
  const [subState, setSubState] = useState<SubscriptionState>(loadSubscriptionState());
  const [selectedPlanId, setSelectedPlanId] = useState<"monthly" | "quarterly" | "annual">("quarterly");
  const [step, setStep] = useState<"plans" | "checkout" | "success" | "history">("plans");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [activeTxnRef, setActiveTxnRef] = useState<string>("");
  const [userUtrInput, setUserUtrInput] = useState<string>("");
  const [isActivating, setIsActivating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showAdminUpiSettings, setShowAdminUpiSettings] = useState(false);
  const [customUpiInput, setCustomUpiInput] = useState(subState.customUpiReceiverId || DEFAULT_RECEIVER_UPI_ID);
  const [merchantNameInput, setMerchantNameInput] = useState(subState.merchantName || DEFAULT_MERCHANT_NAME);
  const [countdownSeconds, setCountdownSeconds] = useState(600); // 10 mins payment window

  const selectedPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];

  // Refresh local subscription state on modal open
  useEffect(() => {
    if (isOpen) {
      const state = loadSubscriptionState();
      setSubState(state);
      setCustomUpiInput(state.customUpiReceiverId || DEFAULT_RECEIVER_UPI_ID);
      setMerchantNameInput(state.merchantName || DEFAULT_MERCHANT_NAME);
      if (state.isPro) {
        setStep("plans");
      } else {
        setStep("plans");
      }
    }
  }, [isOpen]);

  // Generate dynamic QR Code when entering checkout step
  useEffect(() => {
    if (step === "checkout" && selectedPlan) {
      const ref = generateTransactionReference();
      setActiveTxnRef(ref);
      setCountdownSeconds(600);

      const upiUri = buildDynamicUpiUri({
        receiverUpiId: subState.customUpiReceiverId || DEFAULT_RECEIVER_UPI_ID,
        merchantName: subState.merchantName || DEFAULT_MERCHANT_NAME,
        amount: selectedPlan.priceINR,
        transactionRef: ref,
        note: `CherryAI Pro ${selectedPlan.durationLabel} - ${studentName}`,
      });

      QRCode.toDataURL(upiUri, {
        width: 320,
        margin: 2,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("Error generating QR code:", err));
    }
  }, [step, selectedPlanId, subState.customUpiReceiverId, subState.merchantName, studentName]);

  // Checkout countdown timer
  useEffect(() => {
    if (step !== "checkout") return;
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    if (onToast) onToast(`${fieldName} copied to clipboard! 📋`, "success");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleOpenUpiIntent = (appScheme?: string) => {
    if (!selectedPlan) return;
    const genericUri = buildDynamicUpiUri({
      receiverUpiId: subState.customUpiReceiverId || DEFAULT_RECEIVER_UPI_ID,
      merchantName: subState.merchantName || DEFAULT_MERCHANT_NAME,
      amount: selectedPlan.priceINR,
      transactionRef: activeTxnRef,
      note: `CherryAI Pro ${selectedPlan.durationLabel} - ${studentName}`,
    });

    let targetUrl = genericUri;
    if (appScheme === "gpay") {
      targetUrl = genericUri.replace("upi://pay", "tez://upi/pay");
    } else if (appScheme === "phonepe") {
      targetUrl = genericUri.replace("upi://pay", "phonepe://pay");
    } else if (appScheme === "paytm") {
      targetUrl = genericUri.replace("upi://pay", "paytmmp://pay");
    }

    window.location.href = targetUrl;
    if (onToast) onToast("Opening UPI Payment App... Complete payment and enter UTR below.", "info");
  };

  const handleVerifyAndActivate = () => {
    if (!userUtrInput.trim() && userUtrInput.length > 0 && userUtrInput.length < 6) {
      if (onToast) onToast("Please enter a valid 12-digit UPI Reference / UTR Number.", "warning");
      return;
    }

    setIsActivating(true);
    setTimeout(() => {
      const result = activateSubscription({
        planId: selectedPlan.id,
        referenceId: userUtrInput.trim() || `UTR-${activeTxnRef}`,
        studentName: studentName,
        customUpiId: subState.customUpiReceiverId,
      });

      setSubState(result.state);
      setIsActivating(false);
      setStep("success");

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }

      if (onToast) onToast(`🎉 Welcome to Cherry AI Pro! ${selectedPlan.name} is now active.`, "success");
    }, 1200);
  };

  const handleSaveAdminUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUpiInput.includes("@")) {
      if (onToast) onToast("Please enter a valid UPI ID (e.g. name@okhdfcbank or business@upi)", "error");
      return;
    }
    const updated = updateMerchantUpiConfig(customUpiInput, merchantNameInput);
    setSubState(updated);
    setShowAdminUpiSettings(false);
    if (onToast) onToast("Receiver UPI ID & Merchant details updated successfully! 🚀", "success");
  };

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const currentDynamicUpiUri = selectedPlan
    ? buildDynamicUpiUri({
        receiverUpiId: subState.customUpiReceiverId || DEFAULT_RECEIVER_UPI_ID,
        merchantName: subState.merchantName || DEFAULT_MERCHANT_NAME,
        amount: selectedPlan.priceINR,
        transactionRef: activeTxnRef || "REF-INIT",
        note: `CherryAI Pro ${selectedPlan.durationLabel} - ${studentName}`,
      })
    : "";

  return (
    <div
      id="subscription-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="subscription-modal-container"
        className="w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92dvh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 relative shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-xl shadow-inner">
                <Crown className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                    Cherry AI Pro Subscription
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-bold">
                    0% Gateway Fee
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">
                  Instant 1-on-1 AI Classroom & Master Virtual Labs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowAdminUpiSettings(!showAdminUpiSettings)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                title="Tutor / Receiver UPI Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Current Pro Status Badge */}
          {subState.isPro && (
            <div className="mt-3.5 p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-emerald-200">
                  Active Plan: {subState.activePlanName || "Pro Master"}
                </span>
              </div>
              {subState.subscriptionExpires && (
                <span className="text-[10px] font-mono text-emerald-300/80">
                  Valid till: {new Date(subState.subscriptionExpires).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Admin/Tutor Receiver UPI Configuration Drawer */}
        {showAdminUpiSettings && (
          <div className="p-4 bg-slate-900 text-white border-b border-slate-800 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Settings className="w-3.5 h-3.5" />
                <span>Custom Receiver UPI ID (Admin / Tutor Mode)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Instant Payouts</span>
            </div>
            <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
              Student payments will go directly to this UPI ID without any third-party gateway deductions or delays.
            </p>
            <form onSubmit={handleSaveAdminUpi} className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase">
                  Receiver UPI ID / VPA
                </label>
                <input
                  type="text"
                  value={customUpiInput}
                  onChange={(e) => setCustomUpiInput(e.target.value)}
                  placeholder="e.g. 9876543210@paytm or tutor@okhdfcbank"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase">
                  Merchant / Academy Name
                </label>
                <input
                  type="text"
                  value={merchantNameInput}
                  onChange={(e) => setMerchantNameInput(e.target.value)}
                  placeholder="e.g. Cherry AI Classroom"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-sans text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdminUpiSettings(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                >
                  Save UPI Config
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-slate-800 text-left">
          {/* STEP 1: PLANS SELECTION */}
          {step === "plans" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Choose Your Learning Plan
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Direct UPI Payment with instant zero-waiting unlock
                  </p>
                </div>
                {subState.transactions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep("history")}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Invoices</span>
                  </button>
                )}
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 gap-3">
                {SUBSCRIPTION_PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/40 shadow-md ring-2 ring-indigo-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9.5px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          Most Popular
                        </span>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                              {plan.name}
                            </h4>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Save {plan.discountPercent}%
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{plan.tagline}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="flex items-baseline gap-1 justify-end">
                            <span className="text-lg sm:text-xl font-black text-slate-900">
                              ₹{plan.priceINR}
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              ₹{plan.originalPriceINR}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-medium text-slate-500 block">
                            /{plan.durationLabel}
                          </span>
                        </div>
                      </div>

                      {/* Key features */}
                      <ul className="mt-3 pt-3 border-t border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                        {plan.features.slice(0, 3).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-[11.5px] leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Guarantee Box */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-slate-600 text-xs">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Zero Platform Commission</strong>: 100% of your fee powers the live educational server cluster & Socratic AI engine.
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setStep("checkout")}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <span>Proceed to UPI Payment (₹{selectedPlan.priceINR})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: CHECKOUT & DYNAMIC UPI QR */}
          {step === "checkout" && selectedPlan && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <button
                  type="button"
                  onClick={() => setStep("plans")}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  ← Back to Plans
                </button>
                <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Expires in: {formatTime(countdownSeconds)}</span>
                </div>
              </div>

              {/* Payment Summary Pill */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    {selectedPlan.name} ({selectedPlan.durationLabel})
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Ref: {activeTxnRef}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base sm:text-lg font-black text-indigo-600">
                    ₹{selectedPlan.priceINR}
                  </span>
                  <span className="block text-[9.5px] font-mono text-emerald-600 font-bold">
                    Zero Extra Fee
                  </span>
                </div>
              </div>

              {/* Mobile 1-Tap UPI Intent Apps */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Option 1: Pay via 1-Tap Mobile UPI App
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenUpiIntent("gpay")}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <span className="text-sm">🔵</span>
                    <span>Google Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenUpiIntent("phonepe")}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <span className="text-sm">🟣</span>
                    <span>PhonePe</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenUpiIntent("paytm")}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <span className="text-sm">🔷</span>
                    <span>Paytm</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenUpiIntent()}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Any UPI App</span>
                  </button>
                </div>
              </div>

              {/* Desktop / Any Device Dynamic QR Code */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Option 2: Scan Dynamic QR with any UPI App
                </span>

                <div className="p-2.5 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="UPI Payment QR Code"
                      className="w-44 h-44 sm:w-52 sm:h-52 object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 font-mono text-[11px]">
                    <span className="text-slate-400">UPI ID:</span>
                    <span className="text-amber-300 font-bold">
                      {subState.customUpiReceiverId || DEFAULT_RECEIVER_UPI_ID}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          subState.customUpiReceiverId || DEFAULT_RECEIVER_UPI_ID,
                          "UPI ID",
                        )
                      }
                      className="p-1 hover:text-white text-slate-400 cursor-pointer"
                    >
                      {copiedField === "UPI ID" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 font-mono text-[11px]">
                    <span className="text-slate-400">Amount:</span>
                    <span className="text-emerald-300 font-bold">₹{selectedPlan.priceINR}</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Enter UTR / Verify */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Step 2: Enter 12-Digit UPI Ref / UTR Number
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Found in UPI App</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userUtrInput}
                    onChange={(e) => setUserUtrInput(e.target.value)}
                    placeholder="e.g. 423589123456 or leave blank for instant verify"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyAndActivate}
                    disabled={isActivating}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    {isActivating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>Confirm & Activate</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  💡 Once payment is completed in your UPI app, click <strong>Confirm & Activate</strong> to immediately unlock your subscription.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS & ACTIVATION CONFIRMATION */}
          {step === "success" && (
            <div className="py-6 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-inner animate-bounce">
                🎉
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Subscription Successfully Activated!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Welcome to <strong>Cherry AI Pro</strong>! All unlimited Socratic AI classroom sessions, virtual labs, and smart handbooks are now fully unlocked.
                </p>
              </div>

              <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan:</span>
                  <span className="font-bold text-slate-800">{subState.activePlanName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-slate-800">{studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Validity:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {subState.subscriptionExpires
                      ? new Date(subState.subscriptionExpires).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Active"}
                  </span>
                </div>
              </div>

              <div className="flex w-full gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("history")}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  View Receipt
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-sm"
                >
                  Start Learning Now
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: INVOICE / TRANSACTION HISTORY */}
          {step === "history" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep("plans")}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  ← Back to Plans
                </button>
                <h4 className="text-xs font-bold text-slate-800">Subscription History & Invoices</h4>
              </div>

              {subState.transactions.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No previous transactions found.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {subState.transactions.map((txn, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900">{txn.planName}</span>
                            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold">
                              PAID
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                            Txn ID: {txn.transactionId}
                          </span>
                        </div>
                        <span className="text-sm font-black text-indigo-600">₹{txn.amountINR}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10.5px] text-slate-500 font-mono">
                        <span>Paid: {new Date(txn.paidAt).toLocaleDateString()}</span>
                        <span>Ref: {txn.referenceId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
