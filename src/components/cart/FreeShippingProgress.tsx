"use client";

import { Truck, Sparkles } from "lucide-react";
import { formatPKR } from "@/lib/format";

export const FREE_SHIPPING_THRESHOLD = 3500;

export default function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const unlocked = remaining === 0;

  return (
    <div className="rounded-2xl border border-border bg-paper p-4">
      <div className="flex items-center gap-2 text-xs">
        {unlocked ? (
          <>
            <Sparkles className="h-3.5 w-3.5 text-ink" />
            <span className="font-semibold text-ink">
              You&apos;ve unlocked free delivery!
            </span>
          </>
        ) : (
          <>
            <Truck className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              Spend{" "}
              <span className="font-semibold text-ink">{formatPKR(remaining)}</span>{" "}
              more for <span className="font-semibold text-ink">free delivery</span>
            </span>
          </>
        )}
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cream">
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
