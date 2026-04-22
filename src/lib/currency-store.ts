"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DisplayCurrency = "PKR" | "USD" | "GBP" | "AED";

/** Static reference rates — purely for display. PKR remains the settlement currency. */
export const CURRENCY_RATES: Record<DisplayCurrency, number> = {
  PKR: 1,
  USD: 1 / 278,
  GBP: 1 / 352,
  AED: 1 / 76,
};

export const CURRENCY_SYMBOLS: Record<DisplayCurrency, string> = {
  PKR: "Rs",
  USD: "$",
  GBP: "£",
  AED: "AED",
};

interface CurrencyState {
  currency: DisplayCurrency;
  setCurrency: (c: DisplayCurrency) => void;
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "PKR",
      setCurrency: (c) => set({ currency: c }),
    }),
    { name: "closet-currency" },
  ),
);

export function convertFromPKR(amount: number, to: DisplayCurrency): number {
  return amount * CURRENCY_RATES[to];
}

export function formatDisplay(amount: number, to: DisplayCurrency): string {
  const v = convertFromPKR(amount, to);
  if (to === "PKR") return `Rs ${Math.round(v).toLocaleString("en-PK")}`;
  const digits = v < 10 ? 2 : 0;
  return `${CURRENCY_SYMBOLS[to]} ${v.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}
