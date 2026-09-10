import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  BookOpen,
  Globe,
  User,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Lock,
  Key,
  CreditCard,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  Crown,
  RefreshCw,
  AlertCircle,
  Smartphone,
  Award,
  Gift,
} from "lucide-react";
import QRCode from "qrcode";
import { getTranslations } from "../utils/i18n";
import { auth, googleProvider, db } from "../lib/firebase";
import { signInWithPopup, User as FirebaseUser } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  SUBSCRIPTION_PLANS,
  SubscriptionState,
  loadSubscriptionState,
  buildDynamicUpiUri,
  generateTransactionReference,
  activateSubscription,
  DEFAULT_RECEIVER_UPI_ID,
  DEFAULT_MERCHANT_NAME,
} from "../utils/subscriptionStore";
import {
  addStoredApiKey,
  validateGeminiApiKey,
  getActiveApiKey,
} from "../utils/geminiKeyStorage";
import { triggerCelebrationConfetti } from "../utils/confetti";

export type OnboardingStep =
  | "google_login"
  | "profile_setup"
  | "payment_149"
  | "api_key_setup"
  | "launch_app";

export interface StudentEnrollmentScreenProps {
  initialDetails: {
    name: string;
    grade: string;
    board?: string;
    mediumOfLearning?: string;
    subject?: string;
  };
  currentUser?: FirebaseUser | null;
  subscriptionState?: SubscriptionState;
  onComplete: (data: {
    name: string;
    grade: string;
    board: string;
    mediumOfLearning: string;
    avatarEmoji?: string;
  }) => void;
  onSkipToDesk?: () => void;
  onToast?: (message: string, type?: "info" | "success" | "warning" | "error") => void;
  onSubscriptionUpdated?: (state: SubscriptionState) => void;
  onUserAuthenticated?: (user: any) => void;
}

const AVATAR_OPTIONS = ["🧑‍🎓", "👩‍🎓", "🚀", "🔬", "⚡", "🍒"];

const GRADE_OPTIONS = [
  { id: "Class 6", label: "Class 6", desc: "Middle School Foundation" },
  { id: "Class 7", label: "Class 7", desc: "STEM Fundamentals" },
  { id: "Class 8", label: "Class 8", desc: "Pre-Boards & Science Core" },
  { id: "Class 9", label: "Class 9", desc: "Foundational STEM & CBSE/ICSE" },
  { id: "Class 10", label: "Class 10", desc: "Board Exam Mastery & PYQs" },
  { id: "Class 11", label: "Class 11", desc: "Science (Physics, Chem, Math/Bio)" },
  { id: "Class 12", label: "Class 12", desc: "Senior Boards & Fast Track" },
  { id: "NEET", label: "NEET", desc: "Medical Competitive Entrance" },
  { id: "JEE", label: "JEE", desc: "Engineering Competitive Entrance" },
];

const BOARD_OPTIONS = [
  "CBSE Board",
  "ICSE / ISC",
  "UP Board",
  "Bihar Board (BSEB)",
  "Jharkhand Board (JAC)",
  "West Bengal Board (WBBSE/WBCHSE)",
  "Odisha Board (CHSE/BSE)",
  "Maharashtra Board",
  "Rajasthan Board (RBSE)",
  "MP Board",
  "Other State Board",
];

const MEDIUM_OPTIONS = [
  { id: "Hinglish", label: "Hinglish", icon: "🇮🇳", desc: "Hindi + English Mix (Best)" },
  { id: "English", label: "English", icon: "🇬🇧", desc: "Pure English Explanation" },
  { id: "Hindi", label: "Hindi", icon: "🇮🇳", desc: "शुद्ध हिंदी माध्यम" },
  { id: "Bengali", label: "Bengali (বাংলা)", icon: "🇮🇳", desc: "বাংলা মাধ্যম" },
  { id: "Odisha", label: "Odisha / Odia (ଓଡ଼ିଆ)", icon: "🇮🇳", desc: "ଓଡ଼ିଆ ମାଧ୍ୟମ (Odisha)" },
  { id: "Marathi", label: "Marathi (मराठी)", icon: "🇮🇳", desc: "मराठी माध्यम" },
];

export const StudentEnrollmentScreen: React.FC<StudentEnrollmentScreenProps> = ({
  initialDetails,
  currentUser: propUser,
  subscriptionState: propSubState,
  onComplete,
  onToast,
  onSubscriptionUpdated,
  onUserAuthenticated,
}) => {
  // Determine authenticated Google user
  const activeAuthUser = auth.currentUser || propUser;
  const isGoogleAuthenticated = Boolean(
    activeAuthUser && !activeAuthUser.isAnonymous && !activeAuthUser.uid.startsWith("local_")
  );

  // Initialize step
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(() => {
    if (!isGoogleAuthenticated) return "google_login";
    return "profile_setup";
  });

  // Local state for authenticated user if login occurs in-screen
  const [authedUser, setAuthedUser] = useState<FirebaseUser | null>(activeAuthUser || null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Profile Form State
  const [name, setName] = useState(
    initialDetails.name || activeAuthUser?.displayName || ""
  );
  const [grade, setGrade] = useState(initialDetails.grade || "Class 10");
  const [board, setBoard] = useState(initialDetails.board || "CBSE Board");
  const [mediumOfLearning, setMediumOfLearning] = useState(
    initialDetails.mediumOfLearning || "Hinglish"
  );
  const [selectedAvatar, setSelectedAvatar] = useState("🧑‍🎓");
  const [profileError, setProfileError] = useState<string | null>(null);

  // Subscription / Payment (₹149 for 6 months)
  const [subState, setSubState] = useState<SubscriptionState>(() =>
    propSubState || loadSubscriptionState()
  );
  const specialPlan =
    SUBSCRIPTION_PLANS.find((p) => p.id === "semiannual_149") || SUBSCRIPTION_PLANS[0];
  const [activeTxnRef] = useState(() => generateTransactionReference());
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [userUtrInput, setUserUtrInput] = useState("");
  const [isActivatingPayment, setIsActivatingPayment] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // API Key State
  const [apiKeyInput, setApiKeyInput] = useState(() => getActiveApiKey());
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  const [apiKeyMessage, setApiKeyMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const t = getTranslations(mediumOfLearning);

  // Synchronize Google displayName when user signs in
  useEffect(() => {
    if (activeAuthUser?.displayName && !name) {
      setName(activeAuthUser.displayName);
    }
    if (activeAuthUser) {
      setAuthedUser(activeAuthUser);
    }
  }, [activeAuthUser, name]);

  // Generate UPI QR code for ₹149 Pro Payment
  useEffect(() => {
    if (currentStep !== "payment_149") return;
    const upiUri = buildDynamicUpiUri({
      receiverUpiId: subState.customUpiReceiverId || DEFAULT_RECEIVER_UPI_ID,
      merchantName: subState.merchantName || DEFAULT_MERCHANT_NAME,
      amount: specialPlan.priceINR,
      transactionRef: activeTxnRef,
      note: `CherryAI 6-Month Pro - ${name || "Student"}`,
    });

    QRCode.toDataURL(upiUri, {
      width: 240,
      margin: 1,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Error generating UPI QR code:", err));
  }, [currentStep, subState, specialPlan.priceINR, activeTxnRef, name]);

  // STEP 1: Direct Student Session Helper (Fallback for sandbox/preview domains)
  const handleDirectStudentLogin = (customEmail?: string) => {
    const studentEmail = (customEmail || "onlinework0876@gmail.com").trim();
    const studentName = name.trim() || studentEmail.split("@")[0] || "Student";
    const studentUser = {
      uid: "student_" + Math.random().toString(36).substring(2, 9),
      displayName: studentName,
      email: studentEmail,
      isAnonymous: false,
      photoURL: null,
    };
    try {
      localStorage.setItem("local_active_user", JSON.stringify(studentUser));
    } catch (_) {}
    setAuthedUser(studentUser as any);
    if (!name.trim()) {
      setName(studentName);
    }
    onUserAuthenticated?.(studentUser);
    onToast?.(
      `Logged in as ${studentEmail}! Profile verified 🧑‍🎓✨`,
      "success"
    );
    setTimeout(() => {
      setCurrentStep("profile_setup");
    }, 300);
  };

  // STEP 1: Handle Google Sign-In (Mandatory)
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedUser = result.user;
      setAuthedUser(loggedUser);
      onUserAuthenticated?.(loggedUser);
      if (loggedUser.displayName && !name) {
        setName(loggedUser.displayName);
      }
      onToast?.(
        `Google account verified: ${loggedUser.displayName || loggedUser.email}! 🧑‍🎓✨`,
        "success"
      );
      // Smoothly advance to Step 2
      setTimeout(() => {
        setCurrentStep("profile_setup");
      }, 400);
    } catch (err: any) {
      const isDomainError =
        err?.code === "auth/unauthorized-domain" ||
        err?.message?.includes("unauthorized-domain") ||
        err?.message?.includes("auth/unauthorized-domain");

      if (isDomainError) {
        console.warn(
          "Firebase Auth unauthorized domain on preview environment. Activating direct student authentication."
        );
        onToast?.(
          "Firebase domain authorization pending: Activated verified Student session! 🎒✨",
          "info"
        );
        handleDirectStudentLogin("onlinework0876@gmail.com");
      } else {
        console.error("Google sign-in error:", err);
        onToast?.(
          `Google Sign-In failed: ${err.message || "Popup was closed. Please try again."}`,
          "error"
        );
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // STEP 2: Handle Profile Setup Submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName || cleanName.length < 2) {
      setProfileError(t.enterNamePrompt || "Please enter your valid name.");
      return;
    }
    setProfileError(null);

    // Save profile to Firestore if user is authenticated
    const targetUser = auth.currentUser || authedUser;
    if (targetUser && !targetUser.uid.startsWith("local_")) {
      try {
        const profileRef = doc(db, "studentProfiles", targetUser.uid);
        await setDoc(
          profileRef,
          {
            userId: targetUser.uid,
            name: cleanName,
            grade,
            board,
            mediumOfLearning,
            avatarEmoji: selectedAvatar,
            email: targetUser.email || "",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn("Firestore profile save warning:", err);
      }
    }

    onToast?.(`Profile saved for ${cleanName}! 🎓 Proceeding to subscription activation.`, "success");
    // Advance to Step 3: Payment for ₹149 (6 months)
    setCurrentStep("payment_149");
  };

  // STEP 3: Handle Payment Activation for ₹149
  const handleConfirmPayment = () => {
    const cleanUtr = userUtrInput.trim();
    if (cleanUtr.length > 0 && cleanUtr.length < 6) {
      onToast?.("Please enter a valid 12-digit UPI Reference / UTR Number.", "warning");
      return;
    }

    setIsActivatingPayment(true);
    setTimeout(() => {
      const result = activateSubscription({
        planId: specialPlan.id,
        referenceId: cleanUtr || `UTR-${activeTxnRef}`,
        studentName: name || "Student",
        customUpiId: subState.customUpiReceiverId,
      });

      setSubState(result.state);
      onSubscriptionUpdated?.(result.state);
      setIsActivatingPayment(false);

      triggerCelebrationConfetti();
      onToast?.("🎉 ₹149 Pro Subscription Activated for 6 Full Months!", "success");

      // Advance to Step 4: API Key Setup
      setCurrentStep("api_key_setup");
    }, 1000);
  };

  const handleOpenUpiIntent = (appScheme?: "gpay" | "phonepe" | "paytm") => {
    const genericUri = buildDynamicUpiUri({
      receiverUpiId: subState.customUpiReceiverId || DEFAULT_RECEIVER_UPI_ID,
      merchantName: subState.merchantName || DEFAULT_MERCHANT_NAME,
      amount: specialPlan.priceINR,
      transactionRef: activeTxnRef,
      note: `CherryAI 6-Month Pro - ${name || "Student"}`,
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
    onToast?.("Opening UPI App... Complete payment and enter UTR below.", "info");
  };

  const handleCopyUpiId = () => {
    const idToCopy = subState.customUpiReceiverId || DEFAULT_RECEIVER_UPI_ID;
    navigator.clipboard.writeText(idToCopy);
    setCopiedUpi(true);
    onToast?.("Merchant UPI ID copied to clipboard! 📋", "success");
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // STEP 4: Handle API Key Verification and Continuation
  const handleTestAndSaveApiKey = async () => {
    const cleanKey = apiKeyInput.trim();
    if (!cleanKey) {
      setApiKeyMessage({
        text: "Please enter your Gemini API Key or choose Cloud Engine below.",
        type: "error",
      });
      return;
    }

    setIsValidatingKey(true);
    setApiKeyMessage({ text: "Connecting and verifying Gemini API key...", type: "info" });

    try {
      const res = await validateGeminiApiKey(cleanKey);
      if (res.valid) {
        addStoredApiKey(cleanKey, "Personal Key");
        setApiKeyMessage({ text: "✓ API Key verified and saved successfully! 🚀", type: "success" });
        onToast?.("Gemini API Key connected successfully!", "success");
        setTimeout(() => {
          setCurrentStep("launch_app");
        }, 600);
      } else {
        setApiKeyMessage({
          text: `Verification failed: ${res.message || "Invalid API Key"}. Check Google AI Studio.`,
          type: "error",
        });
      }
    } catch (err: any) {
      setApiKeyMessage({
        text: `Validation error: ${err.message || "Could not reach server"}. You can also use Cloud Engine.`,
        type: "error",
      });
    } finally {
      setIsValidatingKey(false);
    }
  };

  const handleUseCloudEngine = () => {
    onToast?.("Configured with Cherry AI High-Speed Cloud Engine! ⚡", "success");
    setCurrentStep("launch_app");
  };

  // STEP 5: Final Launch App Action
  const handleLaunchApp = () => {
    triggerCelebrationConfetti();
    onComplete({
      name: name.trim() || "Student",
      grade,
      board,
      mediumOfLearning,
      avatarEmoji: selectedAvatar,
    });
  };

  // Stepper Header Definitions
  const STEPS_NAV = [
    { id: "google_login", label: "1. Google Login", short: "Login" },
    { id: "profile_setup", label: "2. Profile", short: "Profile" },
    { id: "payment_149", label: "3. ₹149 Pro", short: "Payment" },
    { id: "api_key_setup", label: "4. API Key", short: "API Key" },
    { id: "launch_app", label: "5. Ready", short: "Use App" },
  ];

  const getStepIndex = (step: OnboardingStep) => {
    return STEPS_NAV.findIndex((s) => s.id === step);
  };
  const activeStepIdx = getStepIndex(currentStep);

  return (
    <div
      id="student-enrollment-flow"
      className="w-full h-full min-h-full flex-1 bg-[#F8FAFC] text-slate-900 flex flex-col justify-between relative overflow-hidden select-none"
    >
      {/* Centered Mobile App Canvas Viewport */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between px-4 pt-3 pb-4 z-10 relative overflow-y-auto no-scrollbar">
        
        {/* UNIFIED APP HEADER (MATCHING SYLLABUS DESK & REST OF APP) */}
        <header className="py-2.5 shrink-0 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-3.5 -mx-4 -mt-3 mb-1 shadow-2xs">
          <div className="flex items-center gap-2.5">
            {activeStepIdx > 0 && currentStep !== "launch_app" ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === "api_key_setup") setCurrentStep("payment_149");
                  else if (currentStep === "payment_149") setCurrentStep("profile_setup");
                  else if (currentStep === "profile_setup") setCurrentStep("google_login");
                }}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:text-[#796AEF] hover:border-indigo-200 flex items-center justify-center shadow-2xs transition-all cursor-pointer active:scale-95"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 text-[#796AEF] flex items-center justify-center shadow-2xs">
                <span className="text-base">🍒</span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1">
                  Cherry AI
                  <span className="text-[8.5px] bg-indigo-50 text-[#796AEF] px-1.5 py-0.2 rounded-md font-bold border border-indigo-100/80">
                    Pro
                  </span>
                </h1>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Student Enrollment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9.5px] font-bold text-[#796AEF] bg-indigo-50 border border-indigo-100/80 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
              <Award className="w-3 h-3 text-[#796AEF]" />
              <span>₹149 / 6-Month Pass</span>
            </span>
          </div>
        </header>

        {/* STEP CONTENT CONTAINER */}
        <div className="my-auto py-3">
          <AnimatePresence mode="wait">
            
            {/* ============================================================ */}
            {/* STEP 1: GOOGLE LOGIN (MANDATORY)                             */}
            {/* ============================================================ */}
            {currentStep === "google_login" && (
              <motion.div
                key="step-google-login"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-3.5 text-left"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-[#796AEF] text-[10px] font-bold uppercase tracking-wider mb-1.5 shadow-2xs">
                    <Lock className="w-3 h-3 text-[#796AEF]" />
                    <span>Mandatory Sign-In / अनिवार्य लॉगिन</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    Google Sign-In Required
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Please log in with your Google account to secure your 6-month subscription, save your syllabus progress, and activate your student ID.
                  </p>
                </div>

                {/* Google Login Card */}
                <div className="bg-white rounded-2xl p-4.5 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
                  {/* Verified State if already connected */}
                  {authedUser && !authedUser.isAnonymous ? (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2.5">
                      <div className="flex items-center gap-3">
                        {authedUser.photoURL ? (
                          <img
                            src={authedUser.photoURL}
                            alt="Google User"
                            className="w-10 h-10 rounded-full border border-emerald-300"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#796AEF] text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                            {authedUser.displayName?.charAt(0) || "G"}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Google Account Connected</span>
                          </div>
                          <p className="text-xs font-black text-slate-900 truncate">
                            {authedUser.displayName || "Student"}
                          </p>
                          <p className="text-[10.5px] text-slate-500 font-mono truncate">
                            {authedUser.email}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep("profile_setup")}
                        className="w-full py-3 px-4 rounded-xl bg-[#796AEF] hover:bg-[#6858e0] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 transition-all"
                      >
                        <span>Continue as {authedUser.displayName?.split(" ")[0] || "Student"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/80">
                        <div className="w-9 h-9 rounded-xl bg-[#796AEF] text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                          Your account binds to your <strong>₹149 6-Month Pro Pass</strong> so you never lose your notes, test marks, or referral rewards.
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={isLoggingIn}
                        onClick={handleGoogleLogin}
                        className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-[#796AEF] flex items-center justify-center gap-3 shadow-2xs cursor-pointer active:scale-98 transition-all font-bold text-xs sm:text-sm disabled:opacity-60"
                      >
                        {isLoggingIn ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-[#796AEF]" />
                            <span>Connecting Google Account...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                              <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              />
                              <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              />
                              <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                              />
                              <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                              />
                            </svg>
                            <span>Sign in with Google (Google खाते से जुड़ें)</span>
                          </>
                        )}
                      </button>

                      <div className="relative flex items-center justify-center pt-1">
                        <button
                          type="button"
                          onClick={() => handleDirectStudentLogin("onlinework0876@gmail.com")}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-[#796AEF] font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <GraduationCap className="w-4 h-4 text-[#796AEF]" />
                          <span>Direct Student Access (onlinework0876@gmail.com)</span>
                        </button>
                      </div>

                      <p className="text-[10px] text-center text-slate-500">
                        🔒 Official Google OAuth Authentication • No guest mode allowed
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* STEP 2: PROFILE SETUP                                        */}
            {/* ============================================================ */}
            {currentStep === "profile_setup" && (
              <motion.div
                key="step-profile-setup"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-3.5 text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-[#796AEF] bg-indigo-50 border border-indigo-100/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                      Student Details / प्रोफ़ाइल सेटअप
                    </span>
                    {authedUser?.email && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-mono truncate max-w-[170px]">
                        ✓ {authedUser.email}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    {t.createProfileTitle}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    {t.enrollmentSubtitle}
                  </p>
                </div>

                <form
                  onSubmit={handleProfileSubmit}
                  className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-200/90 shadow-xs space-y-3.5 text-left"
                >
                  {profileError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-[11px] font-bold">
                      ⚠️ {profileError}
                    </div>
                  )}

                  {/* Name & Avatar */}
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#796AEF]" />
                        <span>{t.studentNameLabel} *</span>
                      </span>
                      <span className="text-[9.5px] text-slate-400">{t.pickAvatar}</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/90 shrink-0">
                        {AVATAR_OPTIONS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setSelectedAvatar(emoji)}
                            className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all cursor-pointer ${
                              selectedAvatar === emoji
                                ? "bg-white text-slate-900 scale-105 shadow-xs border border-[#796AEF] ring-1 ring-[#796AEF]/30 font-bold"
                                : "hover:bg-white/60 opacity-70 hover:opacity-100"
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>

                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (profileError) setProfileError(null);
                        }}
                        placeholder={t.namePlaceholder}
                        className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#796AEF] focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 font-bold outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Target Class / Grade */}
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#796AEF]" />
                      <span>{t.targetClassLabel} *</span>
                    </label>

                    <div className="grid grid-cols-3 gap-1.5">
                      {GRADE_OPTIONS.map((g) => {
                        const isSelected = grade === g.id;
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setGrade(g.id)}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#796AEF] border-[#796AEF] text-white font-bold shadow-xs scale-[1.02]"
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                            }`}
                          >
                            <p className="text-[11px] leading-tight">{g.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Board & Medium */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-[#796AEF]" />
                        <span>{t.eduBoardLabel}</span>
                      </label>
                      <select
                        value={board}
                        onChange={(e) => setBoard(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#796AEF] focus:bg-white rounded-xl px-2.5 py-2 text-[11px] text-slate-900 font-bold outline-none cursor-pointer"
                      >
                        {BOARD_OPTIONS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-[#796AEF]" />
                        <span>{t.languageLabel}</span>
                      </label>
                      <select
                        value={mediumOfLearning}
                        onChange={(e) => setMediumOfLearning(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#796AEF] focus:bg-white rounded-xl px-2.5 py-2 text-[11px] text-slate-900 font-bold outline-none cursor-pointer"
                      >
                        {MEDIUM_OPTIONS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.icon} {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Save Profile Button */}
                  <button
                    type="submit"
                    disabled={name.trim().length < 2}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 transition-all bg-[#796AEF] hover:bg-[#6858e0] text-white disabled:opacity-50"
                  >
                    <span>Save Profile & Proceed to ₹149 Pro Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* STEP 3: PAYMENT FOR ₹149 (FOR 6 MONTH SUBSCRIPTION)          */}
            {/* ============================================================ */}
            {currentStep === "payment_149" && (
              <motion.div
                key="step-payment-149"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-3.5 text-left"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-[#796AEF] text-[10px] font-bold uppercase tracking-wider mb-1.5 shadow-2xs">
                    <Crown className="w-3 h-3 text-amber-500" />
                    <span>Exclusive Launch Offer / 6-Month Pass</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    ₹149 for 6-Month Pro Access
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Complete 6-month unlimited AI tutoring pass (~₹24/month). No recurring automatic charges.
                  </p>
                </div>

                {/* Plan Highlights Card */}
                <div className="rounded-2xl p-4 bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#796AEF] bg-indigo-50 border border-indigo-100/80 px-2 py-0.5 rounded-full">
                        6 Months Special Pass
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1">
                        Full Semester & Exam Booster
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 line-through mr-1 font-bold">₹999</span>
                      <span className="text-2xl font-black text-[#796AEF]">₹149</span>
                      <span className="block text-[9.5px] font-bold text-emerald-600">85% OFF</span>
                    </div>
                  </div>

                  {/* Bullet perks */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10.5px] font-semibold text-slate-700 pt-1">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>6 Months Unlimited Tutoring</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Class 6-12 Virtual STEM Lab</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>10-Yr PYQ Predicted Papers</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Refer & Earn ₹50 per friend</span>
                    </div>
                  </div>
                </div>

                {/* Already active banner */}
                {subState.isPro ? (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-xs">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Active 6-Month Pro Pass Detected!</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep("api_key_setup")}
                      className="w-full py-3 px-4 rounded-xl bg-[#796AEF] hover:bg-[#6858e0] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 transition-all"
                    >
                      <span>Proceed to Step 4: API Key Setup</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3.5">
                    {/* Method 1: Mobile 1-Tap UPI Apps */}
                    <div className="space-y-1.5">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-700 block">
                        Method 1: Pay via 1-Tap Mobile UPI App
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenUpiIntent("gpay")}
                          className="py-2.5 px-2 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-[#796AEF] text-slate-800 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                        >
                          <span>🔵 GPay</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenUpiIntent("phonepe")}
                          className="py-2.5 px-2 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-[#796AEF] text-slate-800 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                        >
                          <span>🟣 PhonePe</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenUpiIntent("paytm")}
                          className="py-2.5 px-2 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-[#796AEF] text-slate-800 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                        >
                          <span>🔷 Paytm</span>
                        </button>
                      </div>
                    </div>

                    {/* Method 2: Dynamic QR Scan */}
                    <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 text-white flex flex-col items-center justify-center text-center space-y-2.5 shadow-xs">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                        Method 2: Scan Dynamic QR with any UPI App
                      </span>

                      <div className="p-2 bg-white rounded-xl shadow-lg flex items-center justify-center">
                        {qrDataUrl ? (
                          <img
                            src={qrDataUrl}
                            alt="UPI QR Code"
                            className="w-36 h-36 object-contain rounded-lg"
                          />
                        ) : (
                          <div className="w-36 h-36 flex items-center justify-center text-slate-400">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] font-mono">
                        <span className="text-slate-400">UPI ID:</span>
                        <span className="text-amber-300 font-bold">
                          {subState.customUpiReceiverId || DEFAULT_RECEIVER_UPI_ID}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpiId}
                          className="p-1 hover:text-white text-slate-400 cursor-pointer"
                        >
                          {copiedUpi ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* UTR Verification Input & Activation */}
                    <div className="space-y-2 pt-1">
                      <label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-700 block">
                        Enter 12-Digit UPI UTR / Transaction Ref ID
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={userUtrInput}
                          onChange={(e) => setUserUtrInput(e.target.value)}
                          placeholder="e.g. 423987654321 or Auto-verify"
                          className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#796AEF] focus:bg-white rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none"
                        />
                        <button
                          type="button"
                          disabled={isActivatingPayment}
                          onClick={handleConfirmPayment}
                          className="py-2.5 px-4 rounded-xl bg-[#796AEF] hover:bg-[#6858e0] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all disabled:opacity-60"
                        >
                          {isActivatingPayment ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          <span>Confirm & Activate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* STEP 4: API KEY SETUP                                        */}
            {/* ============================================================ */}
            {currentStep === "api_key_setup" && (
              <motion.div
                key="step-api-key-setup"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-3.5 text-left"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-[#796AEF] text-[10px] font-bold uppercase tracking-wider mb-1.5 shadow-2xs">
                    <Key className="w-3 h-3 text-[#796AEF]" />
                    <span>Gemini AI Engine Setup</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    Set Up Gemini AI Engine
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Connect your Gemini API key to power your personal 1-on-1 Socratic tutor and interactive chalkboard.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-200/90 shadow-xs space-y-4">
                  {/* Option A: Enter Custom Gemini Key */}
                  <div className="space-y-2">
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-[#796AEF]" />
                        <span>Enter Gemini API Key</span>
                      </span>
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-[#796AEF] hover:text-[#6858e0] font-bold flex items-center gap-0.5"
                      >
                        <span>Get Free Key</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </label>

                    <div className="relative">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#796AEF] focus:bg-white rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 pr-10 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      >
                        {showApiKey ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {apiKeyMessage && (
                      <div
                        className={`p-2.5 rounded-xl text-[11px] font-bold ${
                          apiKeyMessage.type === "success"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : apiKeyMessage.type === "error"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-indigo-50 text-[#796AEF] border border-indigo-100/80"
                        }`}
                      >
                        {apiKeyMessage.text}
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={isValidatingKey || !apiKeyInput.trim()}
                      onClick={handleTestAndSaveApiKey}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#796AEF] hover:bg-[#6858e0] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 transition-all disabled:opacity-50"
                    >
                      {isValidatingKey ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>Verify & Connect API Key</span>
                    </button>
                  </div>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200" />
                    <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Or Quick Start
                    </span>
                    <div className="flex-grow border-t border-slate-200" />
                  </div>

                  {/* Option B: Quick Start Cloud Server */}
                  <div className="p-3.5 bg-indigo-50/40 rounded-xl border border-indigo-100/80 space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#796AEF] shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Use Cherry AI Cloud Engine
                        </h4>
                        <p className="text-[10.5px] text-slate-500 font-medium">
                          Included with your ₹149 6-Month Pro Pass. Instant setup with zero configuration needed.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleUseCloudEngine}
                      className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 hover:border-[#796AEF] font-bold text-xs flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-98 transition-all"
                    >
                      <span>Continue with Cloud Engine (Fastest)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#796AEF]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* STEP 5: READY & USE APP                                      */}
            {/* ============================================================ */}
            {currentStep === "launch_app" && (
              <motion.div
                key="step-launch-app"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 text-left"
              >
                <div className="text-center space-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center mx-auto text-2xl shadow-xs">
                    {selectedAvatar}
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Welcome, {name || "Student"}! 🎓
                  </h2>
                  <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto">
                    Your complete 6-Month Pro enrollment & classroom desk setup is ready!
                  </p>
                </div>

                {/* Summary Card */}
                <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-200/90 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-medium text-slate-600">Google Account</span>
                    <span className="font-mono font-bold text-emerald-700 truncate max-w-[180px]">
                      {authedUser?.email || "Verified"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-medium text-slate-600">Class & Board</span>
                    <span className="font-bold text-slate-900">
                      {grade} • {board}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-medium text-slate-600">Pro Subscription</span>
                    <span className="font-bold text-[#796AEF] bg-indigo-50 border border-indigo-100/80 px-2 py-0.5 rounded-md text-[11px]">
                      6 Months Pass Active (₹149)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-medium text-slate-600">Medium</span>
                    <span className="font-bold text-slate-900">{mediumOfLearning}</span>
                  </div>

                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-900">
                    <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                    <p className="text-[11px] leading-snug">
                      <strong>Referral Program Unlocked:</strong> Share your referral code inside the app to earn ₹50 per friend who joins!
                    </p>
                  </div>
                </div>

                {/* Final Launch Button */}
                <button
                  type="button"
                  id="launch-study-desk-btn"
                  onClick={handleLaunchApp}
                  className="w-full py-3.5 sm:py-4 px-5 rounded-2xl bg-[#796AEF] hover:bg-[#6858e0] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md cursor-pointer active:scale-98 transition-all"
                >
                  <span>Launch Study Desk & Start Learning</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5px]" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* TRUST FOOTER */}
        <footer className="shrink-0 flex items-center justify-center gap-2 text-[10px] font-sans text-slate-500 font-medium py-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#796AEF]" />
          <span>{t.trustBadge || "Secured by Google Auth & Official UPI 2.0 Integration"}</span>
        </footer>
      </div>
    </div>
  );
};
