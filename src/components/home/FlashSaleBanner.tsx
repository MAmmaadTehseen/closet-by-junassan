"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, ArrowRight, Timer } from "lucide-react";

function endOfSundayPK(): Date {
  const now = new Date();
  const end = new Date(now);
  const daysUntilSunday = (7 - now.getUTCDay()) % 7 || 7;
  end.setUTCDate(now.getUTCDate() + daysUntilSunday);
  end.setUTCHours(23, 59, 59, 999);
  return end;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function FlashSaleBanner() {
  const [target] = useState<Date>(() => endOfSundayPK());
  const [remaining, setRemaining] = useState(() => target.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, target.getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((remaining / (1000 * 60)) % 60);
  const secs = Math.floor((remaining / 1000) % 60);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1917] via-[#0a0a0a] to-[#3b1f1f] p-6 text-paper shadow-xl sm:p-10">
          <div className="pointer-events-none absolute inset-0 noise opacity-20" aria-hidden />
          <div className="relative grid gap-6 sm:grid-cols-[1.3fr_1fr] sm:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-accent-red/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ff6b6b]">
                <Flame className="h-3 w-3" /> Weekend Flash · Up to 40% off
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                The weekend drop ends in —
              </h2>
              <p className="mt-3 max-w-md text-sm text-paper/70">
                Pre-loved pieces priced to move. When they&apos;re gone, they&apos;re
                gone — no restocks.
              </p>
              <Link
                href="/deals"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-paper/90"
              >
                Shop the flash
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="flex flex-col items-center gap-3 rounded-2xl border border-paper/10 bg-paper/5 p-5 backdrop-blur">
              <Timer className="h-4 w-4 text-paper/70" />
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[
                  { v: days, l: "days" },
                  { v: hours, l: "hrs" },
                  { v: mins, l: "min" },
                  { v: secs, l: "sec" },
                ].map((u) => (
                  <div key={u.l} className="rounded-xl bg-ink px-3 py-3 text-center sm:px-4">
                    <p className="font-display text-2xl font-semibold tabular-nums sm:text-3xl">
                      {pad(u.v)}
                    </p>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-paper/60">
                      {u.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
