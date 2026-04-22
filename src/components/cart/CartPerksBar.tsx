"use client";

import { Gift, Sparkles, Truck, Shield } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { calcCartPerks, PERK_TIERS } from "@/lib/cart-perks";
import { formatPKR } from "@/lib/format";

const TIER_ICONS = [Gift, Truck, Shield];

export default function CartPerksBar({
  originals,
  compact = false,
}: {
  originals: Record<string, number>;
  compact?: boolean;
}) {
  const items = useCart((s) => s.items);
  if (items.length === 0) return null;

  const perks = calcCartPerks(items, originals);
  const pct = perks.toNextPct;

  return (
    <div className="rounded-2xl border border-border bg-paper p-4">
      {perks.savings > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-full bg-accent-red/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent-red">
          <Sparkles className="h-3.5 w-3.5" />
          You&apos;re saving {formatPKR(perks.savings)} ({perks.savingsPct}%)
        </div>
      )}

      {perks.nextTier ? (
        <div>
          <p className="text-xs text-muted-foreground">
            Spend{" "}
            <span className="font-semibold text-ink">{formatPKR(perks.toNext)}</span>{" "}
            more for <span className="font-semibold text-ink">{perks.nextTier.label}</span>
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cream">
            <div
              className="h-full rounded-full bg-ink transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-xs font-semibold text-ink">
          🎉 All perks unlocked — enjoy free wrap, priority dispatch, and easy returns.
        </p>
      )}

      {!compact && (
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {PERK_TIERS.map((tier, i) => {
            const unlocked = perks.unlocked.some((u) => u.threshold === tier.threshold);
            const Icon = TIER_ICONS[i] ?? Gift;
            return (
              <li
                key={tier.threshold}
                className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition ${
                  unlocked
                    ? "border-ink bg-ink/5"
                    : "border-dashed border-border text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[9px] font-semibold uppercase tracking-widest">
                  {formatPKR(tier.threshold)}
                </span>
                <span className="text-[9px] leading-tight">{tier.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
