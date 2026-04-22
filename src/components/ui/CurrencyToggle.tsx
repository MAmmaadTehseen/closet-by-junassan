"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "@/lib/currency-store";

export default function CurrencyToggle() {
  const currency = useCurrency((s) => s.currency);
  const toggle = useCurrency((s) => s.toggle);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={toggle}
      aria-label="Toggle currency"
      title="Preview prices in USD — checkout still charges PKR"
      className="rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:border-ink hover:text-ink"
      suppressHydrationWarning
    >
      {mounted ? currency : "PKR"}
    </button>
  );
}
