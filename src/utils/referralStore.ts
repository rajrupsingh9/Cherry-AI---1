/**
 * referralStore.ts - Refer & Earn 5-Level Plan Engine
 * 1st Level (Direct Income) = Rs. 50
 * 2nd Level = Rs. 0
 * 3rd Level = Rs. 0
 * 4th Level = Rs. 0
 * 5th Level (Indirect Income) = Rs. 50
 */

export interface ReferralTierConfig {
  level: number;
  label: string;
  type: "direct" | "bridge" | "indirect";
  incomePerMember: number;
  description: string;
  badgeColor: string;
}

export const REFERRAL_5_LEVEL_CONFIG: ReferralTierConfig[] = [
  {
    level: 1,
    label: "1st Level (Direct)",
    type: "direct",
    incomePerMember: 50,
    description: "Aapke direct link / code se join hone wale har student par flat ₹50.",
    badgeColor: "from-emerald-500 to-teal-600",
  },
  {
    level: 2,
    label: "2nd Level",
    type: "bridge",
    incomePerMember: 0,
    description: "Bridge tier network progression (₹0 payout).",
    badgeColor: "from-slate-400 to-slate-500",
  },
  {
    level: 3,
    label: "3rd Level",
    type: "bridge",
    incomePerMember: 0,
    description: "Bridge tier network progression (₹0 payout).",
    badgeColor: "from-slate-400 to-slate-500",
  },
  {
    level: 4,
    label: "4th Level",
    type: "bridge",
    incomePerMember: 0,
    description: "Bridge tier network progression (₹0 payout).",
    badgeColor: "from-slate-400 to-slate-500",
  },
  {
    level: 5,
    label: "5th Level (Indirect)",
    type: "indirect",
    incomePerMember: 50,
    description: "Level 4 team ke naye invites se milne wali Indirect Income flat ₹50.",
    badgeColor: "from-indigo-600 to-purple-600",
  },
];

export interface ReferralActivity {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  amount: number;
  date: string;
  status: "credited" | "pending";
}

export interface WithdrawalRecord {
  id: string;
  amount: number;
  upiId: string;
  date: string;
  status: "successful" | "processing";
  referenceId: string;
}

export interface ReferralAccountState {
  referralCode: string;
  totalEarned: number;
  withdrawnAmount: number;
  walletBalance: number;
  tierCounts: Record<number, number>;
  activities: ReferralActivity[];
  withdrawals: WithdrawalRecord[];
}

const STORAGE_KEY = "cherry_refer_earn_v1";

export function generateReferralCode(studentName: string = "Student", uid: string = ""): string {
  const cleanName = studentName.trim().replace(/[^a-zA-Z]/g, "").slice(0, 5).toUpperCase() || "SCHOLAR";
  const suffix = uid ? uid.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase() : Math.floor(1000 + Math.random() * 9000).toString();
  return `CHERRY-${cleanName}-${suffix}`;
}

export function loadReferralState(studentName: string = "Student", uid: string = ""): ReferralAccountState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && parsed.referralCode) {
        return parsed;
      }
    }
  } catch (_) {}

  // Initial starter mock state with realistic student sample data
  const starterCode = generateReferralCode(studentName, uid);
  const initialState: ReferralAccountState = {
    referralCode: starterCode,
    totalEarned: 200,
    withdrawnAmount: 0,
    walletBalance: 200,
    tierCounts: {
      1: 3, // 3 direct invites = 3 * 50 = ₹150
      2: 4, // 4 in tier 2 = ₹0
      3: 2, // 2 in tier 3 = ₹0
      4: 3, // 3 in tier 4 = ₹0
      5: 1, // 1 in tier 5 = 1 * 50 = ₹50
    },
    activities: [
      {
        id: "ref_1",
        name: "Rahul Verma (Class 10)",
        level: 1,
        amount: 50,
        date: "Yesterday",
        status: "credited",
      },
      {
        id: "ref_2",
        name: "Sneha Patel (Class 12)",
        level: 1,
        amount: 50,
        date: "3 days ago",
        status: "credited",
      },
      {
        id: "ref_3",
        name: "Aman Gupta (Class 9)",
        level: 1,
        amount: 50,
        date: "5 days ago",
        status: "credited",
      },
      {
        id: "ref_4",
        name: "Pooja Sharma (Class 11)",
        level: 2,
        amount: 0,
        date: "1 week ago",
        status: "credited",
      },
      {
        id: "ref_5",
        name: "Karan Singh (Class 10)",
        level: 5,
        amount: 50,
        date: "2 weeks ago",
        status: "credited",
      },
    ],
    withdrawals: [],
  };

  saveReferralState(initialState);
  return initialState;
}

export function saveReferralState(state: ReferralAccountState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {}
}

export function requestWithdrawal(
  currentState: ReferralAccountState,
  amount: number,
  upiId: string
): { success: boolean; updatedState: ReferralAccountState; message: string } {
  if (amount < 50) {
    return { success: false, updatedState: currentState, message: "Minimum withdrawal amount is ₹50." };
  }
  if (amount > currentState.walletBalance) {
    return { success: false, updatedState: currentState, message: "Insufficient wallet balance." };
  }
  if (!upiId.includes("@") || upiId.length < 5) {
    return { success: false, updatedState: currentState, message: "Please enter a valid UPI ID (e.g. yourname@oksbi)." };
  }

  const newWithdrawal: WithdrawalRecord = {
    id: `wd_${Date.now()}`,
    amount,
    upiId,
    date: "Just now",
    status: "successful",
    referenceId: `UPI-TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
  };

  const updated: ReferralAccountState = {
    ...currentState,
    walletBalance: currentState.walletBalance - amount,
    withdrawnAmount: currentState.withdrawnAmount + amount,
    withdrawals: [newWithdrawal, ...currentState.withdrawals],
  };

  saveReferralState(updated);
  return { success: true, updatedState: updated, message: `₹${amount} withdrawal request submitted successfully to ${upiId}!` };
}
