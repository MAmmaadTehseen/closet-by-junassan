"use client";

import { Coins } from "lucide-react";
import { useCoins, MIN_REDEEM, COIN_REDEEM_RATE } from "@/lib/coins-store";

export default function CoinRedeem({
  subtotal,
  applied,
  onApply,
}: {
  subtotal: number;
  applied: number;
  onApply: (amountPKR: number) => void;
}) {
  const balance = useCoins((s) => s.balance);
  const maxFromBalance = Math.floor(balance * COIN_REDEEM_RATE);
  const maxRedeem = Math.min(maxFromBalance, Math.floor(subtotal * 0.3)); // cap at 30% of order

  const enough = balance >= MIN_REDEEM;

  return (
    <div className="rounded-2xl border border-border bg-paper/80 p-3.5">
      <div className="flex items-start gap-3">
        <Coins className="mt-0.5 h-4 w-4 text-amber-500" />
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink">
            Closet Coins
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            You have <span className="font-semibold text-ink">{balance.toLocaleString()}</span>{" "}
            coins. {!enough && `Need ${MIN_REDEEM - balance} more to redeem.`}
          </p>
          {enough && (
            <div className="mt-3 flex items-center gap-2">
              {applied > 0 ? (
                <button
                  onClick={() => onApply(0)}
                  className="rounded-full border border-border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-ink hover:border-ink"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={() => onApply(maxRedeem)}
                  disabled={maxRedeem <= 0}
                  className="rounded-full bg-ink px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-paper hover:opacity-90 disabled:opacity-40"
                >
                  Redeem Rs {maxRedeem.toLocaleString()}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
