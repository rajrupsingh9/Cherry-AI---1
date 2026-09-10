import React, { useState, useEffect } from "react";
import { 
  Brain, ShieldCheck, Bookmark, CheckCircle2, AlertTriangle, 
  Trash2, RefreshCw, X, Award, Clock, BookOpen, User, Lock, FileSpreadsheet, Sparkles, Gift, Key, Crown, QrCode, LogOut
} from "lucide-react";
import { getTranslations } from "../utils/i18n";
import { 
  loadStudentProfile, 
  saveStudentProfile, 
  resolveParkedConcept, 
  StudentProfile 
} from "../utils/studentProfileStore";
import { ReferAndEarnHub } from "./ReferAndEarnHub";
import { GeminiApiKeyModal } from "./GeminiApiKeyModal";
import { SubscriptionModal } from "./SubscriptionModal";
import { hasCustomGeminiApiKey } from "../utils/geminiKeyStorage";
import { loadSubscriptionState, SubscriptionState } from "../utils/subscriptionStore";

interface LearnerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast?: (msg: string, type?: "info" | "success" | "warning") => void;
  onSignOut?: () => void;
}

export const LearnerProfileModal: React.FC<LearnerProfileModalProps> = ({
  isOpen,
  onClose,
  onToast,
  onSignOut,
}) => {
  const [profile, setProfile] = useState<StudentProfile>(loadStudentProfile());
  const [subState, setSubState] = useState<SubscriptionState>(loadSubscriptionState());
  const [activeTab, setActiveTab] = useState<"weak_topics" | "subscription" | "refer_earn" | "history" | "privacy" | "settings">("weak_topics");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(hasCustomGeminiApiKey());

  const t = getTranslations(profile.preferredLanguage);

  useEffect(() => {
    if (isOpen) {
      setProfile(loadStudentProfile());
      setSubState(loadSubscriptionState());
      setHasCustomKey(hasCustomGeminiApiKey());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResolve = (id: string) => {
    resolveParkedConcept(id);
    const updated = loadStudentProfile();
    setProfile(updated);
    if (onToast) onToast("Concept marked as resolved and mastered! 🎉", "success");
  };

  const handleSaveSettings = (updates: Partial<StudentProfile>) => {
    const updated = { ...profile, ...updates };
    saveStudentProfile(updated);
    setProfile(updated);
    if (onToast) onToast("Learner profile preferences updated! 💾", "success");
  };

  const handleClearMemory = () => {
    if (window.confirm("Are you sure you want to clear your saved local profile memory? This cannot be undone.")) {
      localStorage.removeItem("cherry_ai_student_profile_v1");
      const reset = loadStudentProfile();
      setProfile(reset);
      if (onToast) onToast("Local profile memory cleared.", "info");
    }
  };

  const activeParked = profile.parkedConcepts.filter((c) => !c.resolved);
  const resolvedParked = profile.parkedConcepts.filter((c) => c.resolved);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-sans tracking-tight">
                  {t.profileHubTitle}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  DPDP 2023 Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {t.profileHubSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:p-4 bg-slate-50/50 border-b border-slate-100 text-center">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 block">{t.totalStudyTime}</span>
            <span className="text-base sm:text-lg font-black text-slate-900">{profile.totalStudyMinutes} mins</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 block">{t.sessionsCompleted}</span>
            <span className="text-base sm:text-lg font-black text-indigo-600">{profile.totalSessionsCompleted}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 block">{t.parkedConcepts}</span>
            <span className="text-base sm:text-lg font-black text-amber-600">{activeParked.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 block">{t.preferredDialect}</span>
            <span className="text-xs sm:text-sm font-bold text-purple-700 uppercase mt-0.5 block truncate">{profile.preferredLanguage}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/40 px-4 gap-2 overflow-x-auto">
          {[
            { id: "weak_topics", label: `📌 ${t.tabParkedConcepts}`, count: activeParked.length },
            { id: "subscription", label: subState.isPro ? `👑 ${t.tabProActive}` : `👑 ${t.tabUpiPro}`, count: null },
            { id: "refer_earn", label: `🎁 ${t.tabReferEarn}`, count: null },
            { id: "history", label: `📈 ${t.tabTopicHistory}`, count: profile.topicHistory.length },
            { id: "privacy", label: `🔒 ${t.tabPrivacy}`, count: null },
            { id: "settings", label: `⚙️ ${t.tabSettings}`, count: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50/60 font-black"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              {tab.id === "subscription" && subState.isPro && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-mono font-black">
                  PRO
                </span>
              )}
              {tab.count !== null && tab.count > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* TAB: SUBSCRIPTION & UPI PAYMENT */}
          {activeTab === "subscription" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm sm:text-base text-white">
                          {subState.isPro ? "Cherry AI Pro Member" : "Direct Zero-Fee UPI Subscription"}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9.5px] font-mono font-bold border border-emerald-400/30">
                          {subState.isPro ? "ACTIVE" : "0% FEE"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        {subState.isPro
                          ? `Active Plan: ${subState.activePlanName || "Pro Master"} (Valid till ${new Date(subState.subscriptionExpires || "").toLocaleDateString()})`
                          : "Pay directly via GPay, PhonePe, Paytm, or BHIM with instant plan activation."}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSubModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shrink-0 flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>{subState.isPro ? "Manage Plan" : "Upgrade to Pro"}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Monthly Pass</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-base font-black text-slate-900">₹199</span>
                    <span className="text-[10px] text-slate-400">/mo</span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">Unlimited 1-on-1 AI Classroom & Smart Handbooks</p>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 relative">
                  <span className="absolute top-2 right-2 px-1.5 py-0.2 rounded bg-indigo-600 text-white text-[8.5px] font-black uppercase">Popular</span>
                  <span className="text-[10px] font-mono text-indigo-700 uppercase block font-bold">Exam Booster</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-base font-black text-indigo-950">₹499</span>
                    <span className="text-[10px] text-indigo-600">/3 mos</span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">10-Yr PYQs + Weightage Heatmap + Voice Counselor</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Annual Master</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-base font-black text-slate-900">₹1,499</span>
                    <span className="text-[10px] text-slate-400">/year</span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">Full 365 Days Unlimited Access for JEE / NEET / CBSE</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-700" />
                  <span className="text-emerald-900 font-medium">
                    Supports all UPI Apps (Google Pay, PhonePe, Paytm, BHIM, Cred)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSubModal(true)}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                >
                  Pay via UPI →
                </button>
              </div>
            </div>
          )}
          {/* TAB: REFER & EARN 5-LEVEL PLAN */}
          {activeTab === "refer_earn" && (
            <ReferAndEarnHub
              studentName={profile.studentName || "Student"}
              userUid="local_learner"
              onToast={(msg, type) => {
                if (onToast) onToast(msg, type === "error" ? "warning" : type || "info");
              }}
              onClose={() => setActiveTab("weak_topics")}
            />
          )}

          {/* TAB 1: PARKED CONCEPTS & WEAK TOPICS */}
          {activeTab === "weak_topics" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900">What are Parked Concepts?</h4>
                  <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                    When you struggle with a specific derivation or question during Level 3 Walkthrough, Cherry Ma'am automatically tags it here so you can revisit it with a fresh mind without disrupting your class flow.
                  </p>
                </div>
              </div>

              {activeParked.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className="font-bold text-sm text-slate-800">No active parked concepts or weak topics!</p>
                  <p className="text-xs mt-1 text-slate-500">You are executing all topics with 100% conceptual mastery. Keep it up! 🚀</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Active Topics Needing Revisit ({activeParked.length})
                  </h3>
                  {activeParked.map((concept) => (
                    <div
                      key={concept.id}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 hover:border-indigo-300 transition-colors shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{concept.conceptName}</span>
                          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-mono font-semibold">
                            {concept.reason === "level3_failed" ? "Level-3 Walkthrough Revisit" : "Remedial Concept Fix"}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          Topic: <span className="text-indigo-600 font-semibold">{concept.topicName}</span> • Tagged: {new Date(concept.dateAdded).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleResolve(concept.id)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Mastered</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {resolvedParked.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <h3 className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    Previously Resolved Concepts ({resolvedParked.length})
                  </h3>
                  {resolvedParked.map((concept) => (
                    <div key={concept.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between opacity-70">
                      <span className="line-through text-slate-600">{concept.conceptName}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">Mastered ✓</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TOPIC HISTORY & CONFIDENCE */}
          {activeTab === "history" && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Studied Topics & Mastery Ratings
              </h3>
              {profile.topicHistory.length === 0 ? (
                <p className="text-center text-slate-400 p-6 bg-slate-50 rounded-xl border border-slate-200">No session history recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {profile.topicHistory.map((topic, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                      <div>
                        <h4 className="font-bold text-slate-900">{topic.topicName}</h4>
                        <p className="text-[10px] text-slate-500">
                          Last studied: {new Date(topic.lastStudied).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-500">Confidence</span>
                          <span className="block text-sm font-black text-indigo-600">{topic.confidenceScore}/10</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                          topic.status === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {topic.status === "completed" ? "Mastered 🎓" : "Revisit Needed 📌"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DPDP ACT 2023 PRIVACY & MINOR DATA SAFETY */}
          {activeTab === "privacy" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-3 text-slate-800">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span>India DPDP Act 2023 & K-12 Minor Data Protection Governance</span>
                </div>
                <ul className="space-y-2 text-slate-700 text-xs list-disc pl-5 leading-relaxed">
                  <li>
                    <strong>Minor Voice & Session Safety:</strong> All live microphone audio streams are processed in-memory during real-time synthesis and are never sold or repurposed for model training.
                  </li>
                  <li>
                    <strong>Local Data Sovereignty:</strong> Your weak topic lists, study progress, and blackboard notes are stored securely on your device via browser local storage.
                  </li>
                  <li>
                    <strong>Parental & Data Consent:</strong> Parental consent is verified for K-12 students under 18 years of age. You maintain the absolute right to wipe your data at any time.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Reset Local Learner Profile Memory</h4>
                  <p className="text-[11px] text-slate-500">
                    Completely clear stored topic histories, parked concepts, and local profile metrics.
                  </p>
                </div>
                <button
                  onClick={handleClearMemory}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Memory</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: LEARNER PROFILE SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    value={profile.studentName}
                    onChange={(e) => setProfile({ ...profile, studentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Exam</label>
                  <select
                    value={profile.targetExam}
                    onChange={(e) => setProfile({ ...profile, targetExam: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-600 font-medium cursor-pointer"
                  >
                    <option value="JEE">JEE Main & Advanced</option>
                    <option value="NEET">NEET UG</option>
                    <option value="CBSE Board">CBSE Board Exam</option>
                    <option value="State Board">State Board Exam</option>
                    <option value="Foundation">Class 8-10 Foundation</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Spoken Dialect</label>
                  <select
                    value={profile.preferredLanguage}
                    onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-600 font-medium cursor-pointer"
                  >
                    <option value="Hinglish">Hinglish (Hindi + English Mix)</option>
                    <option value="Tanglish">Tanglish (Tamil + English Mix)</option>
                    <option value="Benglish">Benglish (Bengali + English Mix)</option>
                    <option value="English">Indian English</option>
                    <option value="Hindi">Pure Hindi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade Level</label>
                  <input
                    type="text"
                    value={profile.gradeLevel}
                    onChange={(e) => setProfile({ ...profile, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700 shrink-0 mt-0.5">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Personal Gemini API Key (BYOK)</h4>
                      {hasCustomKey ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Active & Custom
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-medium">
                          Default Free Quota
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Use your own free Google AI Studio Gemini API Key for unlimited 1-on-1 teaching, quizzes, and simulation requests without quota limits.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{hasCustomKey ? "Change API Key" : "Configure API Key"}</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {onSignOut ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSignOut();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Log Out</span>
                  </button>
                ) : <div />}
                <button
                  onClick={() => handleSaveSettings(profile)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <GeminiApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => {
          setShowApiKeyModal(false);
          setHasCustomKey(hasCustomGeminiApiKey());
        }}
        onKeySaved={() => {
          setHasCustomKey(true);
          if (onToast) onToast("✨ Gemini API Key saved successfully! Active for all sessions.", "success");
        }}
      />

      <SubscriptionModal
        isOpen={showSubModal}
        onClose={() => {
          setShowSubModal(false);
          setSubState(loadSubscriptionState());
        }}
        studentName={profile.studentName || "Student"}
        onToast={onToast}
      />
    </div>
  );
};
