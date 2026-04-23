"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

/** Next Sunday at 23:59 — rolls forward every week so the timer never dies. */
function nextDeadline(): number {
  const now = new Date();
  const d = new Date(now);
  d.setHours(23, 59, 59, 999);
  const daysUntilSunday = (7 - d.getDay()) % 7;
  d.setDate(d.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
  return d.getTime();
}

export default function FlashSaleBanner() {
  const [now, setNow] = useState(() => Date.now());
  const [deadline, setDeadline] = useState(() => nextDeadline());

  useEffect(() => {
    const i = setInterval(() => {
      const n = Date.now();
      if (n > deadline) setDeadline(nextDeadline());
      setNow(n);
    }, 1000);
    return () => clearInterval(i);
  }, [deadline]);

  const diff = Math.max(0, deadline - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff / 3_600_000) % 24);
  const mins = Math.floor((diff / 60_000) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  const units = [
    { label: "Days", v: days },
    { label: "Hours", v: hours },
    { label: "Mins", v: mins },
    { label: "Secs", v: secs },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-10 text-paper sm:px-10">
        <div className="absolute inset-0 noise opacity-40" />
        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em]">
              <Zap className="h-3.5 w-3.5" /> Weekend flash sale
            </p>
            <h3 className="mt-2 max-w-md font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Up to 40% off limited pieces — gone by Sunday midnight.
            </h3>
          </div>
          <div className="flex items-end gap-3">
            {units.map((u) => (
              <div
                key={u.label}
                className="flex w-16 flex-col items-center rounded-2xl bg-paper/10 px-2 py-3 backdrop-blur"
              >
                <span className="font-display text-3xl font-semibold tabular-nums">
                  {String(u.v).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[9px] uppercase tracking-widest opacity-70">
                  {u.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative mt-6">
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition hover:opacity-90"
          >
            Shop the sale
          </Link>
        </div>
      </div>
    </section>
  );
}
