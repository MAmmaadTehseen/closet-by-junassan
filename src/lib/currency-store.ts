"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CurrencyCode = "PKR" | "USD" | "EUR" | "GBP" | "AED";

export interface CurrencyDef {
  code: CurrencyCode;
  symbol: string;
  name: string;
  /** Rate: 1 PKR = rate × currency. Rough display-only rates. */
  rateFromPKR: number;
  /** Locale for formatting. */
  locale: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyDef> = {
  PKR: { code: "PKR", symbol: "Rs",  name: "Pakistani Rupee", rateFromPKR: 1,        locale: "en-PK" },
  USD: { code: "USD", symbol: "$",   name: "US Dollar",        rateFromPKR: 0.0036,  locale: "en-US" },
  EUR: { code: "EUR", symbol: "€",   name: "Euro",             rateFromPKR: 0.0033,  locale: "de-DE" },
  GBP: { code: "GBP", symbol: "£",   name: "Pound Sterling",   rateFromPKR: 0.0028,  locale: "en-GB" },
  AED: { code: "AED", symbol: "د.إ", name: "UAE Dirham",        rateFromPKR: 0.013,   locale: "ar-AE" },
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

export function formatInCurrency(amountPKR: number, code: CurrencyCode): string {
  const def = CURRENCIES[code];
  const value = amountPKR * def.rateFromPKR;
  if (code === "PKR") return `Rs ${Math.round(value).toLocaleString("en-PK")}`;
  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 100) / 100;
  return `${def.symbol}${rounded.toLocaleString(def.locale)}`;
}
