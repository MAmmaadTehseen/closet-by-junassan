"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { useCurrency, CURRENCIES, type CurrencyCode } from "@/lib/currency-store";
import { toast } from "@/components/ui/Toaster";

export default function CurrencySwitcher({ compact = false }: { compact?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const code = useCurrency((s) => s.code);
  const setCode = useCurrency((s) => s.set);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const pick = (c: CurrencyCode) => {
    setCode(c);
    setOpen(false);
    if (c !== "PKR") {
      toast.info(`Prices shown in ${c}. All orders still charged in PKR at checkout.`);
    } else {
      toast.info("Back to PKR.");
    }
  };

  return (
    <div className="relative inline-flex">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-paper px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest hover:border-ink focus-ring ${
          compact ? "" : "sm:px-4 sm:py-2 sm:text-xs"
        }`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Globe className="h-3.5 w-3.5" />
        {mounted ? code : "PKR"}
      </button>
      {open && (
        <ul
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-paper shadow-xl fade-in"
        >
          {(Object.values(CURRENCIES)).map((c) => (
            <li key={c.code}>
              <button
                role="menuitemradio"
                aria-checked={code === c.code}
                onClick={() => pick(c.code)}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-cream ${
                  code === c.code ? "bg-cream" : ""
                }`}
              >
                <span>
                  <span className="font-semibold">{c.code}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{c.symbol}</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {c.name.split(" ")[0]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
