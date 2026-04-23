"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const POINTS_PER_100_PKR = 1;
export const POINTS_PER_REVIEW = 25;
export const POINTS_WELCOME = 100;
export const POINTS_REFERRAL = 250;

export const TIERS = [
  { key: "bronze",   label: "Bronze",   min: 0,     perk: "Early access via WhatsApp" },
  { key: "silver",   label: "Silver",   min: 250,   perk: "Rs 150 off next order" },
  { key: "gold",     label: "Gold",     min: 750,   perk: "Rs 500 off + free gift wrap" },
  { key: "platinum", label: "Platinum", min: 1500,  perk: "Priority dibs on new drops" },
] as const;

export type TierKey = typeof TIERS[number]["key"];

export interface LoyaltyEvent {
  id: string;
  when: number;
  kind: "earn" | "redeem" | "bonus";
  points: number;
  note: string;
}

interface LoyaltyState {
  joined: boolean;
  points: number;
  events: LoyaltyEvent[];
  join: () => void;
  add: (points: number, note: string, kind?: LoyaltyEvent["kind"]) => void;
  redeem: (points: number, note: string) => boolean;
  reset: () => void;
}

function eid() {
  return Math.random().toString(36).slice(2, 10);
}

export const useLoyalty = create<LoyaltyState>()(
  persist(
    (set, get) => ({
      joined: false,
      points: 0,
      events: [],
      join: () => {
        if (get().joined) return;
        set({
          joined: true,
          points: POINTS_WELCOME,
          events: [
            { id: eid(), when: Date.now(), kind: "bonus", points: POINTS_WELCOME, note: "Welcome bonus" },
          ],
        });
      },
      add: (points, note, kind = "earn") =>
        set((s) => ({
          points: s.points + points,
          events: [{ id: eid(), when: Date.now(), kind, points, note }, ...s.events].slice(0, 50),
        })),
      redeem: (points, note) => {
        if (get().points < points) return false;
        set((s) => ({
          points: s.points - points,
          events: [
            { id: eid(), when: Date.now(), kind: "redeem", points: -points, note },
            ...s.events,
          ].slice(0, 50),
        }));
        return true;
      },
      reset: () => set({ joined: false, points: 0, events: [] }),
    }),
    { name: "closet-loyalty" },
  ),
);

export function tierForPoints(points: number) {
  let cur = TIERS[0];
  for (const t of TIERS) if (points >= t.min) cur = t;
  return cur;
}

export function nextTier(points: number) {
  return TIERS.find((t) => points < t.min) ?? null;
}
