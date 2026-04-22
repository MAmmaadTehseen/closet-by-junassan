"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CoinEntry {
  id: string;
  amount: number;
  reason: string;
  at: string;
}

interface CoinsState {
  balance: number;
  history: CoinEntry[];
  earn: (amount: number, reason: string) => void;
  redeem: (amount: number, reason: string) => boolean;
  reset: () => void;
}

const STORAGE = "closet-coins";

export const useCoins = create<CoinsState>()(
  persist(
    (set, get) => ({
      balance: 0,
      history: [],
      earn: (amount, reason) =>
        set((s) => ({
          balance: s.balance + amount,
          history: [
            { id: Math.random().toString(36).slice(2), amount, reason, at: new Date().toISOString() },
            ...s.history,
          ].slice(0, 30),
        })),
      redeem: (amount, reason) => {
        if (get().balance < amount) return false;
        set((s) => ({
          balance: s.balance - amount,
          history: [
            {
              id: Math.random().toString(36).slice(2),
              amount: -amount,
              reason,
              at: new Date().toISOString(),
            },
            ...s.history,
          ].slice(0, 30),
        }));
        return true;
      },
      reset: () => set({ balance: 0, history: [] }),
    }),
    { name: STORAGE },
  ),
);

/** 1 PKR spent earns 1 coin. 100 coins = Rs 100 off. */
export const COINS_PER_PKR = 1;
export const COIN_REDEEM_RATE = 1; // Rs per coin
export const MIN_REDEEM = 100;
