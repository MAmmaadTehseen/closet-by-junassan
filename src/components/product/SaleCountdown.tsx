"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

/**
 * Displays a countdown to the end of the current day for "limited" or
 * deeply-discounted pieces. Resets at local midnight so it always feels live.
 *
 * The label is intentionally honest — the offer ends "tonight", not arbitrary
 * fake urgency days away.
 */
export default function SaleCountdown({ percentOff }: { percentOff?: number }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const ms = Math.max(0, end.getTime() - now.getTime());
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);

  const label = percentOff
    ? `Save ${percentOff}% — ends tonight`
    : "Limited offer — ends tonight";

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-accent-red/30 bg-accent-red/5 px-4 py-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-accent-red">
        <Timer className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-1 font-mono text-sm font-semibold tabular-nums text-ink">
        <Slot value={h} unit="h" />
        <span className="text-muted-foreground">:</span>
        <Slot value={m} unit="m" />
        <span className="text-muted-foreground">:</span>
        <Slot value={s} unit="s" />
      </div>
    </div>
  );
}

function Slot({ value, unit }: { value: number; unit: string }) {
  return (
    <span className="rounded-md bg-paper px-1.5 py-0.5 text-[12px] shadow-sm">
      {value.toString().padStart(2, "0")}
      <span className="ml-0.5 text-[9px] font-normal text-muted-foreground">{unit}</span>
    </span>
  );
}
