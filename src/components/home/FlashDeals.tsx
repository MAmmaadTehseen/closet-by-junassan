"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Flame, ArrowRight } from "lucide-react";

function msUntilMidnight(): number {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return end.getTime() - now.getTime();
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function format(ms: number): { h: string; m: string; s: string } {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { h: pad(h), m: pad(m), s: pad(s) };
}

export default function FlashDeals() {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMs(msUntilMidnight());
    const id = setInterval(() => setMs(msUntilMidnight()), 1000);
    return () => clearInterval(id);
  }, []);

  if (ms == null) {
    return (
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <div className="h-24 rounded-2xl bg-cream" />
      </section>
    );
  }

  const { h, m, s } = format(ms);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-ink text-paper">
        <div className="absolute inset-0 opacity-30 noise" aria-hidden />
        <div className="relative flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-accent-red/90">
              <Flame className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/60">
                Flash deals · today only
              </p>
              <p className="mt-0.5 font-display text-xl font-semibold sm:text-2xl">
                Up to 40% off hand-picked pieces
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-1 font-mono text-sm tabular-nums"
              aria-label="Time remaining"
            >
              <TimePill label="H" value={h} />
              <span className="text-paper/40">:</span>
              <TimePill label="M" value={m} />
              <span className="text-paper/40">:</span>
              <TimePill label="S" value={s} />
            </div>
            <Link
              href="/deals"
              className="group inline-flex items-center gap-1.5 rounded-full bg-paper px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-ink transition hover:opacity-90"
            >
              Shop deals
              <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimePill({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex min-w-12 flex-col items-center rounded-md bg-paper/10 px-2 py-1.5">
      <span className="text-base font-semibold">{value}</span>
      <span className="text-[9px] uppercase tracking-widest text-paper/50">{label}</span>
    </span>
  );
}
