"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Live-ticking countdown banner — loops weekly to the next Sunday
 * midnight PKT (closet's weekly drop cadence).
 */
function nextSundayDrop(): Date {
  const now = new Date();
  const d = new Date(now);
  const dow = now.getDay();
  const daysUntilSunday = (7 - dow) % 7 || 7;
  d.setDate(now.getDate() + daysUntilSunday);
  d.setHours(20, 0, 0, 0);
  return d;
}

function splitParts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds };
}

export default function SaleCountdown() {
  const [target] = useState<Date>(() => nextSundayDrop());
  const [parts, setParts] = useState(() => splitParts(target.getTime() - Date.now()));

  useEffect(() => {
    const id = setInterval(() => {
      setParts(splitParts(target.getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const blocks: [string, number][] = [
    ["Days", parts.days],
    ["Hours", parts.hours],
    ["Mins", parts.minutes],
    ["Secs", parts.seconds],
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-paper p-6 sm:p-10">
        <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid opacity-40" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Next drop lands</p>
            <h3 className="mt-2 font-display text-2xl font-semibold leading-tight sm:text-4xl">
              Sunday, 8 PM PKT — set your alarm.
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              New preloved edit goes live. Best pieces sell out within the first hour.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {blocks.map(([label, n]) => (
              <div
                key={label}
                className="flex min-w-[64px] flex-col items-center rounded-2xl border border-border bg-cream px-3 py-3 tabular-nums sm:min-w-[80px] sm:px-4 sm:py-4"
              >
                <span className="font-display text-2xl font-semibold leading-none sm:text-4xl">
                  {String(n).padStart(2, "0")}
                </span>
                <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/deals"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:opacity-90"
          >
            Shop deals now
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
