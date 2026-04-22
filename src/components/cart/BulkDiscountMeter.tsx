"use client";

import { Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { calcBulkDiscount, BULK_TIERS } from "@/lib/bulk-discount";
import Price from "@/components/ui/Price";

export default function BulkDiscountMeter({ compact = false }: { compact?: boolean }) {
  const qty = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const subtotal = useCart((s) => s.subtotal());

  if (qty === 0) return null;

  const { tier, nextTier, discount } = calcBulkDiscount(qty, subtotal);
  const lastTier = BULK_TIERS[BULK_TIERS.length - 1];
  const progress = Math.min(100, Math.round((qty / lastTier.minQty) * 100));

  return (
    <div
      className={`rounded-xl border border-border bg-cream/40 p-3 ${
        compact ? "text-xs" : "text-sm"
      }`}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-ink" />
        <p className="font-semibold">
          {tier
            ? `${tier.percent}% bulk discount applied — you save `
            : "Buy more, save more"}
          {tier && <Price amount={discount} className="font-semibold" />}
        </p>
      </div>

      {!tier && nextTier && (
        <p className="mt-1 text-xs text-muted-foreground">
          Add {nextTier.minQty - qty} more to unlock {nextTier.percent}% off.
        </p>
      )}
      {tier && nextTier && (
        <p className="mt-1 text-xs text-muted-foreground">
          Add {nextTier.minQty - qty} more to bump up to {nextTier.percent}% off.
        </p>
      )}

      <div className="relative mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-ink transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {BULK_TIERS.map((t) => (
          <span key={t.minQty} className={qty >= t.minQty ? "text-ink" : ""}>
            {t.minQty}+ · {t.percent}%
          </span>
        ))}
      </div>
    </div>
  );
}
