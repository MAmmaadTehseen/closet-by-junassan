"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useCurrency, CURRENCIES } from "@/lib/currency-store";

export default function CurrencySwitcher() {
  const code = useCurrency((s) => s.code);
  const setCode = useCurrency((s) => s.setCode);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const active = CURRENCIES[code] ?? CURRENCIES.PKR;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-paper px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink hover:border-ink"
      >
        <Globe className="h-3 w-3" />
        {mounted ? (
          <>
            <span aria-hidden>{active.flag}</span>
            <span>{active.code}</span>
          </>
        ) : (
          <span>PKR</span>
        )}
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <ul
          role="listbox"
          className="fade-in absolute right-0 top-[calc(100%+6px)] z-50 w-52 overflow-hidden rounded-xl border border-border bg-paper py-1 shadow-xl"
        >
          {Object.values(CURRENCIES).map((c) => (
            <li key={c.code}>
              <button
                role="option"
                aria-selected={c.code === code}
                onClick={() => {
                  setCode(c.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition ${
                  c.code === code ? "bg-cream font-semibold" : "hover:bg-cream"
                }`}
              >
                <span className="text-base" aria-hidden>
                  {c.flag}
                </span>
                <span className="flex-1">{c.label}</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {c.code}
                </span>
              </button>
            </li>
          ))}
          <li className="border-t border-border">
            <p className="px-3 py-2 text-[10px] text-muted-foreground">
              Approx rates, for reference only. Orders are charged in PKR.
            </p>
          </li>
        </ul>
      )}
    </div>
  );
}
