"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  signOut,
  type User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebase } from "./firebase";

export type MedicineStatus = "expired" | "nearExpiry" | "valid" | "unused";

export interface NotificationPrefs {
  before30: boolean;
  before7: boolean;
  onDay: boolean;
  daily: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  expiryDate: string;
  purchaseDate?: string;
  status: MedicineStatus;
  notes?: string;
  forWhom?: string;
  photoUrl?: string | null;
  expiryPhotoUrl?: string | null;
  notifications?: NotificationPrefs;
  createdAt?: string;
  delivered?: boolean;
}

export interface ActivityItem {
  id: string;
  type: "delivery" | "redeem" | "bonus";
  title: string;
  pharmacy?: string;
  points: number;
  at: string;
}

export interface RedeemedReward {
  id: string;
  rewardId: string;
  title: string;
  cost: number;
  at: string;
}

export type AppNotificationType = "expired" | "nearExpiry" | "reward" | "info";

export interface AppNotification {
  id: string;
  type: AppNotificationType;
  icon: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  medicineId?: string;
}

export type Mode = "demo" | "live";

export interface AppState {
  user: {
    id: string;
    name: string;
    phone: string;
    points: number;
    joinedAt: string;
    totalRecovered: number;
    co2Saved: number;
    waterProtected: number;
    rank: number;
  };
  medicines: Medicine[];
  history: ActivityItem[];
  rewards: RedeemedReward[];
  notifications: AppNotification[];
  role: "user" | "pharmacy" | "admin";
  mode: Mode;
}

const STORAGE_KEY = "loop-app-state";
const MODE_KEY = "loop-app-mode";

const DEFAULT_NOTIFS: NotificationPrefs = {
  before30: true,
  before7: true,
  onDay: true,
  daily: false,
};

const DEMO_INITIAL: AppState = {
  user: {
    id: "u_001",
    name: "عبدالرحمن التركستاني",
    phone: "+966 5X XXX XXXX",
    points: 240,
    joinedAt: "2026-04-01",
    totalRecovered: 8,
    co2Saved: 0.8,
    waterProtected: 3.6,
    rank: 142,
  },
  medicines: [
    {
      id: "m_001",
      name: "بنادول إكسترا ٥٠٠ ملغ",
      expiryDate: "2025-08-15",
      purchaseDate: "2024-02-10",
      status: "expired",
      notes: "متبقي ٨ حبات",
      photoUrl: null,
      forWhom: "عام",
      notifications: DEFAULT_NOTIFS,
    },
    {
      id: "m_002",
      name: "أوجمنتين ٦٢٥ ملغ",
      expiryDate: "2026-05-20",
      purchaseDate: "2025-11-15",
      status: "nearExpiry",
      notes: "كورس مضاد حيوي لم يكتمل",
      photoUrl: null,
      forWhom: "الوالدة",
      notifications: DEFAULT_NOTIFS,
    },
    {
      id: "m_003",
      name: "كونكور ٥ ملغ",
      expiryDate: "2026-05-15",
      purchaseDate: "2025-08-01",
      status: "nearExpiry",
      notes: "دواء ضغط الوالد",
      photoUrl: null,
      forWhom: "الوالد",
      notifications: DEFAULT_NOTIFS,
    },
    {
      id: "m_004",
      name: "فولتارين جل",
      expiryDate: "2026-05-25",
      purchaseDate: "2025-09-10",
      status: "nearExpiry",
      notes: "",
      photoUrl: null,
      forWhom: "عام",
      notifications: DEFAULT_NOTIFS,
    },
    {
      id: "m_005",
      name: "كلاريتين ١٠ ملغ",
      expiryDate: "2027-03-01",
      purchaseDate: "2026-01-15",
      status: "valid",
      notes: "علاج حساسية موسمية",
      photoUrl: null,
      forWhom: "عام",
      notifications: DEFAULT_NOTIFS,
    },
    {
      id: "m_006",
      name: "جلوكوفاج ٥٠٠ ملغ",
      expiryDate: "2027-08-10",
      purchaseDate: "2026-02-01",
      status: "valid",
      notes: "علاج السكر للوالد",
      photoUrl: null,
      forWhom: "الوالد",
      notifications: DEFAULT_NOTIFS,
    },
    {
      id: "m_007",
      name: "أسبرين ١٠٠ ملغ",
      expiryDate: "2027-12-20",
      purchaseDate: "2026-03-01",
      status: "valid",
      notes: "",
      photoUrl: null,
      forWhom: "الوالد",
      notifications: DEFAULT_NOTIFS,
    },
    {
      id: "m_008",
      name: "فيتامين د ٥٠٠٠٠",
      expiryDate: "2028-01-15",
      purchaseDate: "2026-04-01",
      status: "valid",
      notes: "حبة أسبوعيًا",
      photoUrl: null,
      forWhom: "الوالدة",
      notifications: DEFAULT_NOTIFS,
    },
  ],
  history: [
    {
      id: "h_001",
      type: "delivery",
      title: "تسليم ٣ علب",
      pharmacy: "صيدلية النهدي العليا",
      points: 30,
      at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "h_002",
      type: "redeem",
      title: "استبدال خصم ١٠٪",
      pharmacy: "صيدلية النهدي",
      points: -100,
      at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "h_003",
      type: "delivery",
      title: "تسليم علبة",
      pharmacy: "صيدلية الدواء الملقا",
      points: 10,
      at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  rewards: [],
  notifications: [
    {
      id: "n_001",
      type: "expired",
      icon: "🚨",
      title: "دواء منتهي الصلاحية",
      message: "بنادول إكسترا ٥٠٠ ملغ انتهى منذ ١٥ يومًا. سلّمه عبر Loop لتجنب الأخطار.",
      time: "اليوم، ٩:٠٠ ص",
      read: false,
      medicineId: "m_001",
    },
    {
      id: "n_002",
      type: "nearExpiry",
      icon: "⏰",
      title: "اقتراب انتهاء صلاحية",
      message: "أوجمنتين ٦٢٥ ملغ ينتهي بعد ١٢ يومًا. استخدمه أو سلّمه عبر Loop.",
      time: "أمس، ٢:٣٠ م",
      read: false,
      medicineId: "m_002",
    },
    {
      id: "n_003",
      type: "nearExpiry",
      icon: "⏰",
      title: "اقتراب انتهاء صلاحية",
      message: "كونكور ٥ ملغ (الوالد) ينتهي بعد ١٧ يومًا.",
      time: "قبل يومين",
      read: true,
      medicineId: "m_003",
    },
    {
      id: "n_004",
      type: "reward",
      icon: "🎉",
      title: "تم استلام أدويتك بنجاح",
      message: "تم تسليم ٣ علب في صيدلية النهدي. حصلت على ٣٠ نقطة Loop.",
      time: "قبل ٣ أيام",
      read: true,
    },
    {
      id: "n_005",
      type: "info",
      icon: "💡",
      title: "نصيحة صحية",
      message: "احفظ أدويتك في مكان جاف وبارد بعيدًا عن متناول الأطفال.",
      time: "قبل أسبوع",
      read: true,
    },
  ],
  role: "user",
  mode: "demo",
};

function buildLiveInitial(uid: string, name?: string): AppState {
  return {
    user: {
      id: uid,
      name: name || "مستخدم Loop",
      phone: "",
      points: 0,
      joinedAt: new Date().toISOString().slice(0, 10),
      totalRecovered: 0,
      co2Saved: 0,
      waterProtected: 0,
      rank: 0,
    },
    medicines: [],
    history: [],
    rewards: [],
    notifications: [],
    role: "user",
    mode: "live",
  };
}

export function computeStatus(expiryDate: string): "expired" | "nearExpiry" | "valid" {
  const exp = new Date(expiryDate).getTime();
  if (Number.isNaN(exp)) return "valid";
  const now = Date.now();
  const days = Math.floor((exp - now) / (1000 * 60 * 60 * 24));
  if (days < 0) return "expired";
  if (days <= 30) return "nearExpiry";
  return "valid";
}

export function daysFromNow(expiryDate: string): number {
  const exp = new Date(expiryDate).getTime();
  if (Number.isNaN(exp)) return 0;
  return Math.floor((exp - Date.now()) / (1000 * 60 * 60 * 24));
}

export function getMode(): Mode {
  if (typeof window === "undefined") return "demo";
  return (localStorage.getItem(MODE_KEY) as Mode) || "demo";
}

export function setMode(m: Mode) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MODE_KEY, m);
  window.dispatchEvent(new CustomEvent("loop:mode"));
}

function readDemo(): AppState {
  if (typeof window === "undefined") return DEMO_INITIAL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_INITIAL));
      return DEMO_INITIAL;
    }
    const parsed = JSON.parse(raw);
    return { ...DEMO_INITIAL, ...parsed, mode: "demo" };
  } catch {
    return DEMO_INITIAL;
  }
}

function writeDemo(state: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("loop:state"));
}

export function useLoopState() {
  const [state, setState] = useState<AppState>(DEMO_INITIAL);
  const [hydrated, setHydrated] = useState(false);
  const modeRef = useRef<Mode>("demo");
  const uidRef = useRef<string | null>(null);

  useEffect(() => {
    let firestoreUnsub: (() => void) | null = null;
    let authUnsub: (() => void) | null = null;

    function attachDemo() {
      modeRef.current = "demo";
      uidRef.current = null;
      if (firestoreUnsub) {
        firestoreUnsub();
        firestoreUnsub = null;
      }
      setState(readDemo());
      setHydrated(true);
    }

    function attachLive(user: User) {
      modeRef.current = "live";
      uidRef.current = user.uid;
      const { db } = getFirebase();
      if (!db) {
        attachDemo();
        return;
      }
      const ref = doc(db, "users", user.uid);
      firestoreUnsub = onSnapshot(
        ref,
        async (snap) => {
          if (!snap.exists()) {
            const initial = buildLiveInitial(user.uid, user.displayName ?? undefined);
            await setDoc(ref, { ...initial, _createdAt: serverTimestamp() });
            setState(initial);
          } else {
            const data = snap.data() as AppState;
            setState({ ...data, mode: "live" });
          }
          setHydrated(true);
        },
        (err) => {
          console.error("firestore snapshot error", err);
          attachDemo();
        }
      );
    }

    const refreshDemo = () => {
      if (modeRef.current === "demo") setState(readDemo());
    };
    window.addEventListener("loop:state", refreshDemo);
    window.addEventListener("storage", refreshDemo);

    function applyMode() {
      const mode = getMode();
      const { auth } = getFirebase();

      if (mode === "demo" || !auth) {
        if (authUnsub) {
          authUnsub();
          authUnsub = null;
        }
        attachDemo();
        return;
      }

      authUnsub = onAuthStateChanged(auth, (user) => {
        if (user) attachLive(user);
        else attachDemo();
      });
    }

    applyMode();
    window.addEventListener("loop:mode", applyMode);

    return () => {
      window.removeEventListener("loop:state", refreshDemo);
      window.removeEventListener("storage", refreshDemo);
      window.removeEventListener("loop:mode", applyMode);
      firestoreUnsub?.();
      authUnsub?.();
    };
  }, []);

  const update = useCallback((updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      if (modeRef.current === "live" && uidRef.current) {
        const { db } = getFirebase();
        if (db) {
          setDoc(doc(db, "users", uidRef.current), next).catch((e) =>
            console.error("firestore write error", e)
          );
          return next;
        }
      }
      writeDemo(next);
      return next;
    });
  }, []);

  return { state, update, hydrated };
}

export function resetStore() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_INITIAL));
  setMode("demo");
  const { auth } = getFirebase();
  if (auth) signOut(auth).catch(() => {});
  window.dispatchEvent(new CustomEvent("loop:state"));
}

export async function startGuestMode() {
  setMode("demo");
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_INITIAL));
  }
}

export async function signInAnonymousAndGoLive(name?: string) {
  const { auth } = getFirebase();
  if (!auth) throw new Error("Firebase not configured");
  setMode("live");
  const cred = await signInAnonymously(auth);
  if (name) {
    const { db } = getFirebase();
    if (db) {
      const ref = doc(db, "users", cred.user.uid);
      await setDoc(ref, buildLiveInitial(cred.user.uid, name), { merge: true });
    }
  }
  return cred.user;
}
