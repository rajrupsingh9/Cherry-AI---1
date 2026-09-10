import React, { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  TrendingUp,
  Wallet,
  Users,
  Sparkles,
  Info,
  ShieldCheck,
  Clock,
  Layers,
  ArrowRight,
  ChevronLeft,
  Gift,
  Zap,
  CheckCircle2,
  HelpCircle,
  QrCode
} from "lucide-react";
import {
  REFERRAL_5_LEVEL_CONFIG,
  ReferralAccountState,
  loadReferralState,
  requestWithdrawal,
} from "../utils/referralStore";

interface ReferAndEarnHubProps {
  studentName?: string;
  userUid?: string;
  onToast?: (message: string, type?: "success" | "info" | "error") => void;
  onClose?: () => void;
}

export const ReferAndEarnHub: React.FC<ReferAndEarnHubProps> = ({
  studentName = "Student",
  userUid = "",
  onToast,
  onClose,
}) => {
  const [refState, setRefState] = useState<ReferralAccountState>(() =>
    loadReferralState(studentName, userUid)
  );
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("50");
  const [withdrawUpi, setWithdrawUpi] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"plan" | "calculator" | "history" | "rules">("plan");

  // Calculator state
  const [calcDirectInvites, setCalcDirectInvites] = useState<number>(5);
  const [calcDuplicationRate, setCalcDuplicationRate] = useState<number>(3);

  const referralLink = `${window.location.origin}?ref=${refState.referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(refState.referralCode);
    setCopiedCode(true);
    if (onToast) onToast("Referral Code copied to clipboard! 📋", "success");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    if (onToast) onToast("Referral Link copied to clipboard! 🔗", "success");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const message = `🚀 *Namaste! Join Cherry AI 1-on-1 Classroom & Virtual Lab!*\n\nUse my invite code *${refState.referralCode}* to get instant access and ₹50 Welcome Reward!\n\n👉 Join here: ${referralLink}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    if (onToast) onToast("Opening WhatsApp share! 📲", "info");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Cherry AI - 1-on-1 AI Classroom & Lab",
          text: `Join Cherry AI with my referral code ${refState.referralCode} and earn ₹50 Welcome Reward!`,
          url: referralLink,
        });
        if (onToast) onToast("Shared successfully! 🎉", "success");
      } catch (_) {}
    } else {
      handleCopyLink();
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      if (onToast) onToast("Please enter a valid withdrawal amount.", "error");
      return;
    }
    const res = requestWithdrawal(refState, amt, withdrawUpi);
    if (res.success) {
      setRefState(res.updatedState);
      setShowWithdrawModal(false);
      if (onToast) onToast(res.message, "success");
    } else {
      if (onToast) onToast(res.message, "error");
    }
  };

  // Level stats calculation
  const level1Count = refState.tierCounts[1] || 0;
  const level1Earned = level1Count * 50;
  const level5Count = refState.tierCounts[5] || 0;
  const level5Earned = level5Count * 50;
  const totalTeamMembers = Object.values(refState.tierCounts).reduce(
    (a: number, b: number) => a + Number(b || 0),
    0
  );

  // Calculator estimated income
  const calcLevel1Earned = calcDirectInvites * 50;
  const calcLevel5Members = Math.round(
    calcDirectInvites * Math.pow(calcDuplicationRate, 4)
  );
  const calcLevel5Earned = calcLevel5Members * 50;
  const calcTotalPotential = calcLevel1Earned + calcLevel5Earned;

  return (
    <div className="w-full flex-1 flex flex-col space-y-3.5 sm:space-y-4 text-left max-w-2xl mx-auto px-1 sm:px-2 pb-8 overflow-x-hidden">
      {/* Mobile-First Header Navigation */}
      <div className="flex items-center justify-between gap-2 pb-1">
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
            <span>Profile</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white text-sm shadow-xs">
              🎁
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                Refer & Earn
              </h2>
              <span className="text-[10px] text-slate-500 font-mono font-medium">
                5-Level Income System
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 ml-auto">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10.5px] font-mono font-black flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Direct ₹50 + 5th ₹50
          </span>
        </div>
      </div>

      {/* Hero Wallet & Earnings Card - Mobile First High Impact Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950 text-white p-4 sm:p-5 shadow-md border border-indigo-700/50">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3.5">
          {/* Main Wallet Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-200 font-semibold flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" /> Available Balance
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ₹{refState.walletBalance}
                </span>
                <span className="text-[11px] text-indigo-300 font-mono">INR</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowWithdrawModal(true)}
              className="px-3.5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0 border border-emerald-400/30"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Withdraw UPI</span>
            </button>
          </div>

          {/* 3 Micro-Metrics Grid for Mobile */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-indigo-800/80">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 sm:p-2.5 text-center border border-white/10">
              <span className="text-[9px] font-mono uppercase text-emerald-300 block font-bold truncate">
                1st Lvl (Direct)
              </span>
              <span className="text-sm sm:text-base font-black text-white block mt-0.5">
                ₹{level1Earned}
              </span>
              <span className="text-[8.5px] text-indigo-200 block truncate">
                {level1Count} Friends
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 sm:p-2.5 text-center border border-white/10">
              <span className="text-[9px] font-mono uppercase text-purple-300 block font-bold truncate">
                5th Lvl (Indirect)
              </span>
              <span className="text-sm sm:text-base font-black text-white block mt-0.5">
                ₹{level5Earned}
              </span>
              <span className="text-[8.5px] text-indigo-200 block truncate">
                {level5Count} Scholars
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 sm:p-2.5 text-center border border-white/10">
              <span className="text-[9px] font-mono uppercase text-amber-300 block font-bold truncate">
                Total Network
              </span>
              <span className="text-sm sm:text-base font-black text-white block mt-0.5">
                {totalTeamMembers}
              </span>
              <span className="text-[8.5px] text-indigo-200 block truncate">
                5 Tiers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Tap Share Strip for Mobile */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-3">
        {/* WhatsApp Hero Button */}
        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <span className="text-base">📲</span>
          <span>Share on WhatsApp & Invite Friends</span>
        </button>

        {/* Code & Link Side by Side on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Referral Code Box */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl">
            <div className="min-w-0 pr-2">
              <span className="text-[8.5px] font-mono font-bold uppercase text-slate-400 block">
                Your Referral Code
              </span>
              <span className="text-xs font-mono font-black text-indigo-700 tracking-wider block truncate">
                {refState.referralCode}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 ${
                copiedCode
                  ? "bg-emerald-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:text-indigo-600"
              }`}
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Link Copy Box */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl">
            <div className="min-w-0 pr-2">
              <span className="text-[8.5px] font-mono font-bold uppercase text-slate-400 block">
                Direct Invite Link
              </span>
              <span className="text-[11px] font-mono text-slate-600 truncate block">
                {referralLink}
              </span>
            </div>
            <button
              type="button"
              onClick={handleNativeShare}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 ${
                copiedLink
                  ? "bg-emerald-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:text-indigo-600"
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3 Step Quick Explainer Ribbon */}
        <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
          <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
            <span className="text-xs block">1️⃣</span>
            <span className="text-[9px] font-bold text-slate-700 block leading-tight mt-0.5">
              Share Link
            </span>
            <span className="text-[8px] text-slate-400 block">with Friends</span>
          </div>
          <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
            <span className="text-xs block">2️⃣</span>
            <span className="text-[9px] font-bold text-slate-700 block leading-tight mt-0.5">
              Friend Joins
            </span>
            <span className="text-[8px] text-slate-400 block">Level 1 Direct</span>
          </div>
          <div className="bg-emerald-50/80 p-2 rounded-xl border border-emerald-100">
            <span className="text-xs block">3️⃣</span>
            <span className="text-[9px] font-black text-emerald-700 block leading-tight mt-0.5">
              Get ₹50 + ₹50
            </span>
            <span className="text-[8px] text-emerald-600 block">L1 & L5 Payout</span>
          </div>
        </div>
      </div>

      {/* Segmented Sub-Tabs Bar - Horizontal Scrollable & Mobile Ergonomic */}
      <div className="w-full overflow-x-auto flex items-center gap-1.5 p-1.5 bg-slate-100/90 border border-slate-200 rounded-2xl touch-pan-x overscroll-x-contain">
        {[
          { id: "plan", label: "5-Level Plan", icon: Layers },
          { id: "calculator", label: "Income Simulator", icon: TrendingUp },
          { id: "history", label: "History & Logs", icon: Clock },
          { id: "rules", label: "Rules & FAQ", icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer select-none active:scale-95 ${
                isActive
                  ? "bg-white text-indigo-700 shadow-xs font-black border border-slate-200/90"
                  : "text-slate-600 hover:text-slate-900 bg-transparent hover:bg-white/60 border border-transparent"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 5-LEVEL PLAN STRUCTURE */}
      {activeTab === "plan" && (
        <div className="space-y-2.5">
          <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl text-slate-800 text-xs flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-indigo-950 block text-[11.5px]">
                5-Level Income Compensation Architecture
              </span>
              <span className="text-slate-600 text-[10.5px] leading-relaxed">
                Direct referrals par <strong className="text-emerald-700">₹50</strong> aur 5th tier indirect network referrals par <strong className="text-purple-700">₹50</strong> har student par milte hain.
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {REFERRAL_5_LEVEL_CONFIG.map((tier) => {
              const count = refState.tierCounts[tier.level] || 0;
              const earned = count * tier.incomePerMember;
              const isEarningLevel = tier.incomePerMember > 0;

              return (
                <div
                  key={tier.level}
                  className={`p-3 rounded-2xl border transition-all shadow-2xs space-y-2 ${
                    isEarningLevel
                      ? tier.level === 1
                        ? "bg-emerald-50/70 border-emerald-200"
                        : "bg-purple-50/70 border-purple-200"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl text-white flex items-center justify-center font-mono font-black text-xs shadow-xs shrink-0 bg-gradient-to-tr ${tier.badgeColor}`}
                      >
                        L{tier.level}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-black text-slate-900 text-xs truncate">
                          {tier.label}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate">
                          {tier.description}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-black shrink-0 ${
                        isEarningLevel
                          ? tier.level === 1
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-purple-100 text-purple-800 border border-purple-300"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      ₹{tier.incomePerMember} / student
                    </span>
                  </div>

                  {/* Stats Bar */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 text-[10px]">
                    <span className="text-slate-500 font-medium">
                      Active: <strong className="text-slate-800">{count} Students</strong>
                    </span>
                    <span className="font-black">
                      Earned:{" "}
                      <span
                        className={
                          earned > 0
                            ? tier.level === 1
                              ? "text-emerald-700 font-mono font-black text-xs"
                              : "text-purple-700 font-mono font-black text-xs"
                            : "text-slate-400 font-mono font-bold"
                        }
                      >
                        ₹{earned}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: POTENTIAL INCOME SIMULATOR */}
      {activeTab === "calculator" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3.5">
          <div className="space-y-0.5">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              5-Level Compounding Income Simulator
            </h3>
            <p className="text-[11px] text-slate-500">
              Check potential earnings from 1st and 5th Level network growth.
            </p>
          </div>

          <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            {/* Slider 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>1st Level Direct Invites:</span>
                <span className="text-emerald-700 font-black font-mono">
                  {calcDirectInvites} Friends (₹{calcLevel1Earned})
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={calcDirectInvites}
                onChange={(e) => setCalcDirectInvites(parseInt(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex gap-1.5 pt-0.5">
                {[3, 5, 10, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCalcDirectInvites(num)}
                    className={`px-2 py-0.5 rounded text-[9.5px] font-bold font-mono transition-all cursor-pointer ${
                      calcDirectInvites === num
                        ? "bg-emerald-600 text-white"
                        : "bg-white border border-slate-200 text-slate-600"
                    }`}
                  >
                    {num} Invites
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 2 */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Team Duplication (per student):</span>
                <span className="text-purple-700 font-black font-mono">
                  {calcDuplicationRate} Invites/friend
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="5"
                value={calcDuplicationRate}
                onChange={(e) => setCalcDuplicationRate(parseInt(e.target.value))}
                className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                5th Level Network reaches ~<strong>{calcLevel5Members.toLocaleString()}</strong> students
              </span>
            </div>
          </div>

          {/* Calculator Output Grid */}
          <div className="p-3 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-2xl space-y-2.5">
            <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-indigo-200 block">
              Estimated Total Potential Income:
            </span>

            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 border border-white/10">
                <span className="text-[8px] font-mono text-emerald-300 uppercase font-bold block truncate">
                  1st Level
                </span>
                <span className="text-xs sm:text-sm font-black text-white mt-0.5 block truncate">
                  ₹{calcLevel1Earned.toLocaleString()}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 border border-white/10">
                <span className="text-[8px] font-mono text-purple-300 uppercase font-bold block truncate">
                  5th Level
                </span>
                <span className="text-xs sm:text-sm font-black text-white mt-0.5 block truncate">
                  ₹{calcLevel5Earned.toLocaleString()}
                </span>
              </div>

              <div className="bg-emerald-500 text-white rounded-xl p-2 shadow-xs border border-emerald-400/40">
                <span className="text-[8px] font-mono text-emerald-100 uppercase font-bold block truncate">
                  Total ₹
                </span>
                <span className="text-xs sm:text-sm font-black text-white mt-0.5 block truncate">
                  ₹{calcTotalPotential.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVITY & WITHDRAWAL LOGS */}
      {activeTab === "history" && (
        <div className="space-y-3">
          {/* Referral Activities */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-2.5">
            <h4 className="text-xs font-black uppercase font-mono tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Referral Activity
            </h4>

            {refState.activities.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No referral activity recorded yet.</p>
            ) : (
              <div className="space-y-1.5">
                {refState.activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 ${
                          act.level === 1
                            ? "bg-emerald-600"
                            : act.level === 5
                            ? "bg-purple-600"
                            : "bg-slate-400"
                        }`}
                      >
                        L{act.level}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate text-[11px]">{act.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono block">
                          Level {act.level} • {act.date}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`font-black text-xs block ${
                          act.amount > 0 ? "text-emerald-600 font-mono" : "text-slate-400 font-mono"
                        }`}
                      >
                        {act.amount > 0 ? `+₹${act.amount}` : "₹0"}
                      </span>
                      <span className="text-[8.5px] text-emerald-700 font-mono uppercase font-bold">
                        {act.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Withdrawal Logs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-2.5">
            <h4 className="text-xs font-black uppercase font-mono tracking-wider text-slate-900 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-indigo-600" />
              UPI Withdrawal History
            </h4>

            {refState.withdrawals.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No withdrawals requested yet.</p>
            ) : (
              <div className="space-y-1.5">
                {refState.withdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-slate-900 block text-[11px] truncate">
                        {w.upiId}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono block">
                        {w.referenceId} • {w.date}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black text-rose-600 text-xs font-mono block">
                        -₹{w.amount}
                      </span>
                      <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold font-mono">
                        {w.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: RULES & FAQ */}
      {activeTab === "rules" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-2.5 text-xs text-slate-700 leading-relaxed">
          <h4 className="font-black text-xs uppercase font-mono tracking-wider text-slate-900 pb-1 border-b border-slate-100">
            Rules & FAQ
          </h4>

          <div className="space-y-2 text-[11px]">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <strong className="text-slate-900 block font-bold mb-0.5">
                1. 1st Level (Direct Income) ₹50:
              </strong>
              <p className="text-slate-600">
                Aapke invite code se join hone wale har student par turant flat ₹50 wallet me credit hote hain.
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <strong className="text-slate-900 block font-bold mb-0.5">
                2. 2nd, 3rd, 4th Levels (Bridge):
              </strong>
              <p className="text-slate-600">
                Ye intermediary bridge tiers hain jo network ko 5th tier tak expand karte hain.
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <strong className="text-slate-900 block font-bold mb-0.5">
                3. 5th Level (Indirect Income) ₹50:
              </strong>
              <p className="text-slate-600">
                Jab 4th Level ke students aage kisi ko invite karte hain, toh 5th Level par aapko seedhe ₹50 indirect income milti hai.
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <strong className="text-slate-900 block font-bold mb-0.5">
                4. Instant UPI Withdrawal:
              </strong>
              <p className="text-slate-600">
                Minimum ₹50 balance hone par kisi bhi UPI ID (Google Pay, PhonePe, Paytm, BHIM) par withdraw kar sakte hain.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAWAL MODAL - Mobile First Bottom Sheet / Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-slate-200 space-y-3.5 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">UPI Withdrawal Request</h4>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold">
                    Available: ₹{refState.walletBalance}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1.5 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-600 block">
                  Withdrawal Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  max={refState.walletBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  placeholder="Min ₹50"
                />

                {/* Quick Amount Chips */}
                <div className="flex gap-1.5 pt-1">
                  {[50, 100, 200, refState.walletBalance].map((val, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setWithdrawAmount(String(val))}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-mono font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      {val === refState.walletBalance ? `All (₹${val})` : `₹${val}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-600 block">
                  UPI ID (Google Pay / PhonePe / Paytm / BHIM)
                </label>
                <input
                  type="text"
                  required
                  value={withdrawUpi}
                  onChange={(e) => setWithdrawUpi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  placeholder="e.g. yourname@oksbi or 9876543210@paytm"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[10.5px] text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant verification & payout direct to your UPI handle.</span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={refState.walletBalance < 50}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-95"
                >
                  Transfer ₹{withdrawAmount || "0"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
