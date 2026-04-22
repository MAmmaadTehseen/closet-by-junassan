"use client";

import { useEffect, useState } from "react";
import { Coins, Plus, Minus } from "lucide-react";
import { useCoins, COIN_VALUE_PKR } from "@/lib/coins-store";
import { formatPKR } from "@/lib/format";

export default function CoinsWidget({
  compact = false,
}: {
  compact?: boolean;
}) {
  const coins = useCoins((s) => s.coins);
  const history = useCoins((s) => s.history);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const worth = coins * COIN_VALUE_PKR;

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        <Coins className="h-3 w-3" />
        {coins} coins
      </span>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-paper p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-amber-900 shadow-inner">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <p className="eyebrow">Closet Coins</p>
            <p className="font-display text-2xl font-semibold">{coins}</p>
            <p className="text-xs text-muted-foreground">
              worth <span className="font-semibold text-ink">{formatPKR(worth)}</span> at
              checkout
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-ink"
        >
          {open ? "Hide" : "History"}
        </button>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Earn 1 coin per Rs 100 spent. Redeem at checkout in multiples of 10.
      </p>

      {open && history.length > 0 && (
        <ul className="mt-4 space-y-1.5 border-t border-border pt-3 text-xs">
          {history.slice(0, 8).map((evt) => (
            <li key={evt.id} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-ink">
                {evt.delta > 0 ? (
                  <Plus className="h-3 w-3 text-green-600" />
                ) : (
                  <Minus className="h-3 w-3 text-accent-red" />
                )}
                {evt.reason}
              </span>
              <span
                className={`font-semibold ${
                  evt.delta > 0 ? "text-green-600" : "text-accent-red"
                }`}
              >
                {evt.delta > 0 ? "+" : ""}
                {evt.delta}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
