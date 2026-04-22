"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { useCurrency, type DisplayCurrency } from "@/lib/currency-store";

const OPTIONS: DisplayCurrency[] = ["PKR", "USD", "GBP", "AED"];

export default function CurrencySelector({ className = "" }: { className?: string }) {
  const currency = useCurrency((s) => s.currency);
  const setCurrency = useCurrency((s) => s.setCurrency);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <label
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-paper/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-ink ${className}`}
    >
      <Globe className="h-3.5 w-3.5" />
      <span className="sr-only">Display currency</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as DisplayCurrency)}
        className="bg-transparent pr-1 text-ink focus:outline-none"
      >
        {OPTIONS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}
