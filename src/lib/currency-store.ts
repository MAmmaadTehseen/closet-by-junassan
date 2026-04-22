"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CurrencyCode = "PKR" | "USD" | "GBP" | "AED";

export interface CurrencyDef {
  code: CurrencyCode;
  symbol: string;
  /** Fixed display rate vs PKR. Editorial rate, not for actual checkout. */
  rate: number;
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyDef> = {
  PKR: { code: "PKR", symbol: "Rs", rate: 1, flag: "🇵🇰" },
  USD: { code: "USD", symbol: "$", rate: 1 / 280, flag: "🇺🇸" },
  GBP: { code: "GBP", symbol: "£", rate: 1 / 360, flag: "🇬🇧" },
  AED: { code: "AED", symbol: "د.إ", rate: 1 / 76, flag: "🇦🇪" },
};

interface CurrencyState {
  code: CurrencyCode;
  set: (c: CurrencyCode) => void;
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set) => ({
      code: "PKR",
      set: (c) => set({ code: c }),
    }),
    { name: "closet-currency" },
  ),
);

export function convertFromPKR(amount: number, code: CurrencyCode): number {
  const def = CURRENCIES[code];
  return amount * def.rate;
}

export function formatMoney(amountPKR: number, code: CurrencyCode): string {
  const def = CURRENCIES[code];
  const value = convertFromPKR(amountPKR, code);
  if (code === "PKR") return `${def.symbol} ${Math.round(value).toLocaleString("en-PK")}`;
  return `${def.symbol}${value.toFixed(2)}`;
}
