"use client";

import { useEffect, useState, useCallback } from "react";

export type MedicineStatus = "expired" | "nearExpiry" | "unused";

export interface Medicine {
  id: string;
  name: string;
  expiryDate: string;
  status: MedicineStatus;
  notes?: string;
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
  role: "user" | "pharmacy" | "admin";
}

const STORAGE_KEY = "loop-app-state";

const INITIAL: AppState = {
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
      status: "expired",
      notes: "متبقي ٨ حبات",
    },
    {
      id: "m_002",
      name: "أوجمنتين ٦٢٥ ملغ",
      expiryDate: "2026-06-20",
      status: "nearExpiry",
      notes: "كورس مضاد حيوي لم يكتمل",
    },
    {
      id: "m_003",
      name: "فولتارين جل",
      expiryDate: "2024-12-10",
      status: "expired",
      notes: "",
    },
    {
      id: "m_004",
      name: "كلاريتين ١٠ ملغ",
      expiryDate: "2027-03-01",
      status: "unused",
      notes: "تم تغيير الدواء بوصفة جديدة",
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
  role: "user",
};

function readState(): AppState {
  if (typeof window === "undefined") return INITIAL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL));
      return INITIAL;
    }
    const parsed = JSON.parse(raw);
    return { ...INITIAL, ...parsed };
  } catch {
    return INITIAL;
  }
}

function writeState(state: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("loop:state"));
}

export function useLoopState() {
  const [state, setState] = useState<AppState>(INITIAL);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readState());
    setHydrated(true);
    const refresh = () => setState(readState());
    window.addEventListener("loop:state", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("loop:state", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const update = useCallback((updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      writeState(next);
      return next;
    });
  }, []);

  return { state, update, hydrated };
}

export function resetStore() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL));
  window.dispatchEvent(new CustomEvent("loop:state"));
}
