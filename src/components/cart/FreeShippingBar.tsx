"use client";

import { Truck, Sparkles } from "lucide-react";
import { formatPKR } from "@/lib/format";

export const FREE_SHIPPING_THRESHOLD_PKR = 5000;

export default function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const target = FREE_SHIPPING_THRESHOLD_PKR;
  const remaining = Math.max(0, target - subtotal);
  const pct = Math.min(100, Math.round((subtotal / target) * 100));
  const unlocked = remaining === 0;

  return (
    <div className="rounded-2xl border border-border bg-paper/80 p-3.5">
      <div className="mb-2 flex items-center gap-2 text-xs">
        {unlocked ? (
          <>
            <Sparkles className="h-3.5 w-3.5 text-green-600" />
            <span className="font-semibold text-green-700">
              Nice — you&apos;ve unlocked priority dispatch!
            </span>
          </>
        ) : (
          <>
            <Truck className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              Add{" "}
              <span className="font-semibold text-ink">{formatPKR(remaining)}</span>{" "}
              more for{" "}
              <span className="font-semibold text-ink">priority dispatch</span>
            </span>
          </>
        )}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            unlocked ? "bg-green-600" : "bg-ink"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
