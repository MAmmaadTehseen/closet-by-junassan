"use client";

import { useEffect, useState } from "react";
import { Truck, Clock } from "lucide-react";

const CUTOFF_HOUR_PKT = 17; // 5pm PKT cutoff for next-day dispatch.

function pakistanNow(): Date {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(new Date()).filter((p) => p.type !== "literal").map((p) => [p.type, p.value]),
  ) as Record<string, string>;
  return new Date(
    `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`,
  );
}

function addBusinessDays(date: Date, days: number) {
  const d = new Date(date);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay(); // 0=Sun, 6=Sat — courier off Sundays in PK.
    if (dow !== 0) added += 1;
  }
  return d;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short" });
}

export default function DeliveryEstimator() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(pakistanNow());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) return null;

  const beforeCutoff = now.getHours() < CUTOFF_HOUR_PKT;
  const dispatchDay = beforeCutoff ? new Date(now) : addBusinessDays(now, 1);
  const earliest = addBusinessDays(dispatchDay, 3);
  const latest = addBusinessDays(dispatchDay, 5);

  let countdown = "";
  if (beforeCutoff) {
    const cutoff = new Date(now);
    cutoff.setHours(CUTOFF_HOUR_PKT, 0, 0, 0);
    const ms = cutoff.getTime() - now.getTime();
    const h = Math.floor(ms / 3_600_000);
    const m = Math.floor((ms % 3_600_000) / 60_000);
    countdown = `${h}h ${m}m`;
  }

  return (
    <div className="rounded-2xl border border-border bg-cream/50 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
          <Truck className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Delivery estimate
          </p>
          <p className="mt-1 text-sm text-ink">
            Get it between{" "}
            <span className="font-semibold">{fmtDate(earliest)}</span> –{" "}
            <span className="font-semibold">{fmtDate(latest)}</span>
          </p>
          {beforeCutoff ? (
            <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" /> Order in{" "}
              <span className="font-semibold text-ink">{countdown}</span> for today&apos;s dispatch.
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-muted-foreground">
              Order today — ships next working day.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
