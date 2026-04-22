"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { CURRENCIES, useCurrency, type CurrencyCode } from "@/lib/currency-store";

export default function CurrencySwitch() {
  const code = useCurrency((s) => s.code);
  const set = useCurrency((s) => s.set);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const display = mounted ? code : "PKR";
  const def = CURRENCIES[display];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change currency"
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-cream focus-ring"
      >
        <Globe className="h-3.5 w-3.5" />
        <span aria-hidden>{def.flag}</span>
        <span>{def.code}</span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-paper shadow-2xl fade-in">
          {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => {
            const d = CURRENCIES[c];
            const active = c === display;
            return (
              <button
                key={c}
                onClick={() => {
                  set(c);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs transition ${
                  active ? "bg-cream" : "hover:bg-cream"
                }`}
              >
                <span aria-hidden className="text-base">{d.flag}</span>
                <span className="flex-1 font-medium">{d.code}</span>
                <span className="text-muted-foreground">{d.symbol}</span>
              </button>
            );
          })}
          <p className="border-t border-border bg-cream/40 px-3 py-2 text-[10px] text-muted-foreground">
            Display only — checkout in PKR.
          </p>
        </div>
      )}
    </div>
  );
}
