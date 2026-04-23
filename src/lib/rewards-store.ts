"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/** 1 PKR spent = 1 point. 100 points = Rs 10 off. */
export const POINTS_PER_RUPEE = 1;
export const RUPEES_PER_100_POINTS = 10;

export const TIERS = [
  { slug: "cotton", name: "Cotton", min: 0, perks: ["Welcome bonus — 100 pts", "Early drop previews"] },
  { slug: "linen", name: "Linen", min: 2500, perks: ["Free exchange (1x)", "Member-only flash sales"] },
  { slug: "silk", name: "Silk", min: 10000, perks: ["2x points on new drops", "Priority dispatch"] },
  { slug: "cashmere", name: "Cashmere", min: 25000, perks: ["Free delivery always", "Personal stylist DM"] },
] as const;

export type TierSlug = (typeof TIERS)[number]["slug"];

interface HistoryEntry {
  at: string;
  type: "earn" | "redeem" | "bonus";
  points: number;
  note: string;
}

interface RewardsState {
  points: number;
  lifetime: number;
  joined: boolean;
  history: HistoryEntry[];
  join: () => void;
  earn: (pts: number, note: string) => void;
  redeem: (pts: number, note: string) => boolean;
  reset: () => void;
}

export const useRewards = create<RewardsState>()(
  persist(
    (set, get) => ({
      points: 0,
      lifetime: 0,
      joined: false,
      history: [],
      join: () =>
        set((s) => {
          if (s.joined) return s;
          const entry: HistoryEntry = {
            at: new Date().toISOString(),
            type: "bonus",
            points: 100,
            note: "Welcome bonus",
          };
          return {
            joined: true,
            points: s.points + 100,
            lifetime: s.lifetime + 100,
            history: [entry, ...s.history],
          };
        }),
      earn: (pts, note) =>
        set((s) => {
          const entry: HistoryEntry = {
            at: new Date().toISOString(),
            type: "earn",
            points: pts,
            note,
          };
          return {
            points: s.points + pts,
            lifetime: s.lifetime + pts,
            history: [entry, ...s.history].slice(0, 50),
          };
        }),
      redeem: (pts, note) => {
        const s = get();
        if (s.points < pts) return false;
        const entry: HistoryEntry = {
          at: new Date().toISOString(),
          type: "redeem",
          points: -pts,
          note,
        };
        set({
          points: s.points - pts,
          history: [entry, ...s.history].slice(0, 50),
        });
        return true;
      },
      reset: () => set({ points: 0, lifetime: 0, joined: false, history: [] }),
    }),
    { name: "closet-rewards" },
  ),
);

export function tierFor(lifetime: number): (typeof TIERS)[number] {
  let current: (typeof TIERS)[number] = TIERS[0];
  for (const t of TIERS) if (lifetime >= t.min) current = t;
  return current;
}

export function nextTier(lifetime: number) {
  return TIERS.find((t) => t.min > lifetime);
}
