"use client";

import { Truck, PartyPopper } from "lucide-react";
import { formatPKR } from "@/lib/format";

export const FREE_SHIPPING_THRESHOLD = 5000;

export default function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const unlocked = remaining === 0;

  return (
    <div className="mb-4 rounded-2xl border border-border bg-paper p-3">
      <div className="flex items-center gap-2 text-xs font-medium">
        {unlocked ? (
          <>
            <PartyPopper className="h-4 w-4 text-green-600" />
            <span className="text-ink">You&apos;ve unlocked free delivery.</span>
          </>
        ) : (
          <>
            <Truck className="h-4 w-4 text-ink" />
            <span className="text-ink">
              Add <span className="font-semibold">{formatPKR(remaining)}</span> for free delivery.
            </span>
          </>
        )}
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${
            unlocked ? "bg-green-600" : "bg-ink"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
