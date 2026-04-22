"use client";

import { Truck, Sparkles } from "lucide-react";
import { formatPKR } from "@/lib/format";

const FREE_SHIPPING_THRESHOLD = 3500;

export default function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const unlocked = remaining === 0;

  return (
    <div className="rounded-xl border border-border bg-paper px-4 py-3">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
        {unlocked ? (
          <>
            <Sparkles className="h-3.5 w-3.5 text-ink" />
            <span>You unlocked free delivery!</span>
          </>
        ) : (
          <>
            <Truck className="h-3.5 w-3.5 text-muted-foreground" />
            <span>
              Add{" "}
              <span className="text-ink">{formatPKR(remaining)}</span> more for FREE delivery
            </span>
          </>
        )}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${
            unlocked ? "bg-green-600" : "bg-ink"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
