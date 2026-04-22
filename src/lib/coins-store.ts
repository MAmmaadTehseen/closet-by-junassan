"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const COIN_PER_PKR = 0.01; // 1 coin per Rs 100
export const COIN_VALUE_PKR = 1; // 1 coin = Rs 1 at redemption

export interface CoinEvent {
  id: string;
  ts: number;
  delta: number;
  reason: string;
}

interface CoinsState {
  coins: number;
  history: CoinEvent[];
  earn: (amount: number, reason: string) => void;
  spend: (amount: number, reason: string) => boolean;
  reset: () => void;
}

export const useCoins = create<CoinsState>()(
  persist(
    (set, get) => ({
      coins: 50, // welcome bonus
      history: [
        {
          id: "welcome",
          ts: Date.now(),
          delta: 50,
          reason: "Welcome bonus",
        },
      ],
      earn: (amount, reason) => {
        if (amount <= 0) return;
        const evt: CoinEvent = {
          id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          ts: Date.now(),
          delta: amount,
          reason,
        };
        set({
          coins: get().coins + amount,
          history: [evt, ...get().history].slice(0, 20),
        });
      },
      spend: (amount, reason) => {
        if (amount <= 0 || amount > get().coins) return false;
        const evt: CoinEvent = {
          id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          ts: Date.now(),
          delta: -amount,
          reason,
        };
        set({
          coins: get().coins - amount,
          history: [evt, ...get().history].slice(0, 20),
        });
        return true;
      },
      reset: () => set({ coins: 0, history: [] }),
    }),
    { name: "closet-coins" },
  ),
);
