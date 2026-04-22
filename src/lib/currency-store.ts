"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CurrencyDef {
  code: string;
  symbol: string;
  label: string;
  flag: string;
  /** Rate: 1 PKR = X target */
  rate: number;
}

export const CURRENCIES: Record<string, CurrencyDef> = {
  PKR: { code: "PKR", symbol: "Rs", label: "Pakistani Rupee", flag: "🇵🇰", rate: 1 },
  USD: { code: "USD", symbol: "$", label: "US Dollar", flag: "🇺🇸", rate: 0.0036 },
  GBP: { code: "GBP", symbol: "£", label: "British Pound", flag: "🇬🇧", rate: 0.0028 },
  EUR: { code: "EUR", symbol: "€", label: "Euro", flag: "🇪🇺", rate: 0.0033 },
  AED: { code: "AED", symbol: "AED", label: "UAE Dirham", flag: "🇦🇪", rate: 0.013 },
  SAR: { code: "SAR", symbol: "SAR", label: "Saudi Riyal", flag: "🇸🇦", rate: 0.013 },
};

interface CurrencyState {
  code: string;
  setCode: (code: string) => void;
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set) => ({
      code: "PKR",
      setCode: (code) => set({ code }),
    }),
    { name: "closet-currency" },
  ),
);

export function formatMoney(amountPKR: number, code: string): string {
  const c = CURRENCIES[code] ?? CURRENCIES.PKR;
  const converted = amountPKR * c.rate;
  if (c.code === "PKR") {
    return `Rs ${Math.round(converted).toLocaleString("en-PK")}`;
  }
  return `${c.symbol} ${converted.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
