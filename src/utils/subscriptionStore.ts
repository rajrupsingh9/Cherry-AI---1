/**
 * subscriptionStore.ts - Direct Dynamic UPI & Subscription Management Store
 * Zero-Fee Direct UPI Payment & Plan Engine for Cherry AI Classroom
 */

export interface SubscriptionPlan {
  id: "semiannual_149" | "monthly" | "quarterly" | "annual" | string;
  name: string;
  tagline: string;
  durationMonths: number;
  durationLabel: string;
  priceINR: number;
  originalPriceINR: number;
  discountPercent: number;
  popular?: boolean;
  features: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "semiannual_149",
    name: "6 Months Special Pass",
    tagline: "Exclusive Student Launch Offer – ₹149 for 6 Full Months",
    durationMonths: 6,
    durationLabel: "6 Months",
    priceINR: 149,
    originalPriceINR: 999,
    discountPercent: 85,
    popular: true,
    features: [
      "Full 6 Months Unlimited 1-on-1 Cherry Ma'am Live Teaching",
      "Full Virtual Lab Simulation Sandbox (Class 6-12)",
      "10-Year PYQ Predicted Papers & Step-wise Marking",
      "Interactive 24/7 Kiara & Socratic Voice Whiteboard",
      "Chapter Smart Handbooks, Infographics & PDF Exports",
      "Instant Referral Earning Program (Earn ₹50 per friend)",
    ],
  },
  {
    id: "monthly",
    name: "Monthly Pro Pass",
    tagline: "Ideal for monthly syllabus coverage & test prep",
    durationMonths: 1,
    durationLabel: "1 Month",
    priceINR: 199,
    originalPriceINR: 499,
    discountPercent: 60,
    features: [
      "Unlimited 1-on-1 Cherry Ma'am Live Teaching",
      "Unlimited Kiara AI Socratic Counselor & Voice",
      "Full Virtual Lab Simulation Sandbox",
      "Chapter Smart Handbooks & PDF Exports",
      "Adaptive Exam Speed Sprint & Quiz Analysis",
    ],
  },
  {
    id: "quarterly",
    name: "Exam Booster Special",
    tagline: "Most popular for Term & Board Exam Readiness",
    durationMonths: 3,
    durationLabel: "3 Months",
    priceINR: 499,
    originalPriceINR: 1299,
    discountPercent: 62,
    popular: true,
    features: [
      "Everything in Monthly Pro Pass",
      "10-Year PYQ Predicted Papers & Step-wise Marking",
      "PYQ 80/20 High-Yield Topic Weightage Heatmaps",
      "Priority Low-Latency Live AI Stream Bandwidth",
      "Unlimited Homework Maker & Doubt Walkthroughs",
    ],
  },
  {
    id: "annual",
    name: "Annual All-Access Master",
    tagline: "Complete 365-day mastery for JEE, NEET & Boards",
    durationMonths: 12,
    durationLabel: "1 Full Year (12 Months)",
    priceINR: 1499,
    originalPriceINR: 4999,
    discountPercent: 70,
    features: [
      "Everything in Exam Booster Special",
      "Full 12-Month 24/7 Unlimited Socratic Tutoring",
      "Unlimited Battle Arena Room Matches & Tournaments",
      "Concept Infographic Poster Ultra-HD Generator",
      "Official Verified Student Certificate of Mastery",
      "Zero Platform Fee & Highest Priority Live AI Speed",
    ],
  },
];

export interface PaymentTransaction {
  transactionId: string;
  referenceId: string; // e.g. UTR / UPI Ref Number
  planId: "semiannual_149" | "monthly" | "quarterly" | "annual" | string;
  planName: string;
  amountINR: number;
  paidAt: string; // ISO date
  expiresAt: string; // ISO date
  status: "active" | "expired" | "pending_verification";
  studentName: string;
  upiReceiverId: string;
}

export interface SubscriptionState {
  isPro: boolean;
  activePlanId: "semiannual_149" | "monthly" | "quarterly" | "annual" | string | null;
  activePlanName: string | null;
  subscriptionStart: string | null; // ISO date
  subscriptionExpires: string | null; // ISO date
  transactions: PaymentTransaction[];
  customUpiReceiverId: string;
  merchantName: string;
}

export const DEFAULT_RECEIVER_UPI_ID = "cherryai.edu@okhdfcbank";
export const DEFAULT_MERCHANT_NAME = "Cherry AI Classroom";

const STORAGE_KEY = "cherry_subscription_state_v1";

export function loadSubscriptionState(): SubscriptionState {
  if (typeof window === "undefined") {
    return getInitialSubscriptionState();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialSubscriptionState();
    const parsed = JSON.parse(raw);

    // Verify if active subscription has expired
    if (parsed.subscriptionExpires) {
      const now = new Date().getTime();
      const exp = new Date(parsed.subscriptionExpires).getTime();
      if (now > exp) {
        parsed.isPro = false;
      } else {
        parsed.isPro = true;
      }
    }
    return { ...getInitialSubscriptionState(), ...parsed };
  } catch (e) {
    console.warn("Failed to load subscription state:", e);
    return getInitialSubscriptionState();
  }
}

export function getInitialSubscriptionState(): SubscriptionState {
  return {
    isPro: false,
    activePlanId: null,
    activePlanName: null,
    subscriptionStart: null,
    subscriptionExpires: null,
    transactions: [],
    customUpiReceiverId: DEFAULT_RECEIVER_UPI_ID,
    merchantName: DEFAULT_MERCHANT_NAME,
  };
}

export function saveSubscriptionState(state: SubscriptionState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to save subscription state:", e);
  }
}

/**
 * Generate Dynamic Direct UPI URI compatible with all Indian UPI Apps
 * (Google Pay, PhonePe, Paytm, BHIM, Cred, Amazon Pay)
 */
export function buildDynamicUpiUri(params: {
  receiverUpiId: string;
  merchantName: string;
  amount: number;
  transactionRef: string;
  note: string;
}): string {
  const { receiverUpiId, merchantName, amount, transactionRef, note } = params;
  const pa = encodeURIComponent(receiverUpiId.trim());
  const pn = encodeURIComponent(merchantName.trim());
  const am = amount.toFixed(2);
  const cu = "INR";
  const tr = encodeURIComponent(transactionRef);
  const tn = encodeURIComponent(note);

  return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}&tr=${tr}&tn=${tn}`;
}

/**
 * Generates unique payment reference for UPI tracking
 */
export function generateTransactionReference(): string {
  const prefix = "CHERRY";
  const randNum = Math.floor(100000 + Math.random() * 900000);
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${randNum}-${timestamp}`;
}

/**
 * Activate subscription with confirmed transaction
 */
export function activateSubscription(params: {
  planId: "semiannual_149" | "monthly" | "quarterly" | "annual" | string;
  referenceId: string;
  studentName: string;
  customUpiId?: string;
}): { success: boolean; state: SubscriptionState } {
  const { planId, referenceId, studentName, customUpiId } = params;
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId) || SUBSCRIPTION_PLANS[0];
  const currentState = loadSubscriptionState();

  const now = new Date();
  const expires = new Date();
  expires.setMonth(expires.getMonth() + plan.durationMonths);

  const txnId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newTxn: PaymentTransaction = {
    transactionId: txnId,
    referenceId: referenceId.trim() || `UPI-AUTOREF-${Date.now().toString().slice(-6)}`,
    planId: plan.id,
    planName: plan.name,
    amountINR: plan.priceINR,
    paidAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    status: "active",
    studentName: studentName || "Student",
    upiReceiverId: customUpiId || currentState.customUpiReceiverId || DEFAULT_RECEIVER_UPI_ID,
  };

  const updatedState: SubscriptionState = {
    ...currentState,
    isPro: true,
    activePlanId: plan.id,
    activePlanName: plan.name,
    subscriptionStart: now.toISOString(),
    subscriptionExpires: expires.toISOString(),
    transactions: [newTxn, ...currentState.transactions],
  };

  saveSubscriptionState(updatedState);
  return { success: true, state: updatedState };
}

/**
 * Updates merchant receiver UPI VPA address in settings
 */
export function updateMerchantUpiConfig(upiId: string, merchantName?: string): SubscriptionState {
  const current = loadSubscriptionState();
  const updated: SubscriptionState = {
    ...current,
    customUpiReceiverId: upiId.trim() || DEFAULT_RECEIVER_UPI_ID,
    merchantName: (merchantName || current.merchantName || DEFAULT_MERCHANT_NAME).trim(),
  };
  saveSubscriptionState(updated);
  return updated;
}
