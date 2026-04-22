"use client";

import { useEffect, useState } from "react";
import { Coins, Plus, Minus, History } from "lucide-react";
import { useCoins } from "@/lib/coins-store";
import { toast } from "@/components/ui/Toaster";

function tierFor(balance: number) {
  if (balance >= 20000) return { name: "Silk", next: null, progress: 100 };
  if (balance >= 5000)
    return { name: "Linen", next: { name: "Silk", at: 20000 }, progress: ((balance - 5000) / (20000 - 5000)) * 100 };
  return { name: "Cotton", next: { name: "Linen", at: 5000 }, progress: (balance / 5000) * 100 };
}

export default function RewardsWallet() {
  const balance = useCoins((s) => s.balance);
  const history = useCoins((s) => s.history);
  const earn = useCoins((s) => s.earn);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  const tier = tierFor(balance);

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-ink via-charcoal to-ink p-6 text-paper sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/60">
            Your wallet
          </p>
          <p className="mt-2 inline-flex items-center gap-2 font-display text-4xl font-semibold sm:text-5xl">
            <Coins className="h-8 w-8 text-amber-300" />
            {balance.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-paper/70">
            Equivalent to{" "}
            <span className="font-semibold text-paper">Rs {balance.toLocaleString()}</span> off.
          </p>
        </div>
        <div className="rounded-xl border border-paper/15 bg-paper/5 p-4 text-xs">
          <p className="text-[11px] uppercase tracking-widest text-paper/60">Tier</p>
          <p className="mt-1 font-display text-2xl font-semibold">{tier.name}</p>
          {tier.next && (
            <p className="mt-1 text-[11px] text-paper/60">
              {tier.next.at - balance} coins to {tier.next.name}
            </p>
          )}
          <div className="mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-paper/15">
            <div
              className="h-full rounded-full bg-amber-300 transition-all duration-500"
              style={{ width: `${Math.min(100, tier.progress)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            earn(100, "Welcome bonus (demo)");
            toast.success("+100 coins for trying the demo");
          }}
          className="inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-ink hover:opacity-90"
        >
          <Plus className="h-3 w-3" /> Demo: claim 100 coins
        </button>
      </div>

      <div className="mt-6">
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-paper/60">
          <History className="h-3 w-3" /> Recent activity
        </p>
        {history.length === 0 ? (
          <p className="mt-3 text-xs text-paper/60">No activity yet — place an order to start earning.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {history.slice(0, 6).map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between rounded-xl border border-paper/10 bg-paper/5 px-3 py-2 text-xs"
              >
                <span className="flex items-center gap-2">
                  {e.amount >= 0 ? (
                    <Plus className="h-3 w-3 text-green-300" />
                  ) : (
                    <Minus className="h-3 w-3 text-red-300" />
                  )}
                  {e.reason}
                </span>
                <span className={e.amount >= 0 ? "text-green-300" : "text-red-300"}>
                  {e.amount > 0 ? "+" : ""}
                  {e.amount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
