"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Currency = "PKR" | "USD";

/** Indicative conversion rate — preview only. Checkout still charges PKR. */
export const USD_RATE = 0.0036;

interface CurrencyState {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggle: () => void;
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: "PKR",
      setCurrency: (c) => set({ currency: c }),
      toggle: () =>
        set({ currency: get().currency === "PKR" ? "USD" : "PKR" }),
    }),
    { name: "closet-currency" },
  ),
);

export function convertFromPKR(amountPkr: number, currency: Currency): number {
  if (currency === "USD") return amountPkr * USD_RATE;
  return amountPkr;
}

export function formatAmount(amountPkr: number, currency: Currency): string {
  if (currency === "USD") {
    const usd = amountPkr * USD_RATE;
    return `$${usd.toFixed(2)}`;
  }
  return `Rs ${amountPkr.toLocaleString("en-PK")}`;
}
