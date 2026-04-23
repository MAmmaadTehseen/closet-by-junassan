"use client";

import { Truck, Check } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { formatPKR } from "@/lib/format";

export default function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const threshold = siteConfig.shipping.freeShippingThreshold;
  const reached = subtotal >= threshold;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className="border-b border-border bg-paper px-5 py-3.5">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
        {reached ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-600" />
            <span className="text-ink">You&apos;ve unlocked free delivery</span>
          </>
        ) : (
          <>
            <Truck className="h-3.5 w-3.5 text-ink" />
            <span className="text-ink">
              Add <span className="text-accent-red">{formatPKR(remaining)}</span> more for free
              delivery
            </span>
          </>
        )}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${
            reached ? "bg-green-600" : "bg-ink"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
