"use client";

import { Sparkles, Gift, Crown } from "lucide-react";
import {
  RUPEES_PER_100_POINTS,
  TIERS,
  nextTier,
  tierFor,
  useRewards,
} from "@/lib/rewards-store";
import { formatPKR } from "@/lib/format";
import { toast } from "@/components/ui/Toaster";

export default function RewardsView() {
  const points = useRewards((s) => s.points);
  const lifetime = useRewards((s) => s.lifetime);
  const joined = useRewards((s) => s.joined);
  const history = useRewards((s) => s.history);
  const join = useRewards((s) => s.join);
  const redeem = useRewards((s) => s.redeem);

  const tier = tierFor(lifetime);
  const next = nextTier(lifetime);
  const toNext = next ? Math.max(0, next.min - lifetime) : 0;
  const progress = next ? Math.min(100, Math.round(((lifetime - tier.min) / (next.min - tier.min)) * 100)) : 100;

  const redeemLevels = [
    { pts: 100, value: 10 },
    { pts: 500, value: 50 },
    { pts: 1000, value: 110 },
    { pts: 2500, value: 300 },
  ];

  const onRedeem = (pts: number, value: number) => {
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    const rand = Array.from(bytes)
      .map((n) => n.toString(36).padStart(2, "0"))
      .join("")
      .slice(0, 5)
      .toUpperCase();
    const code = `JC${pts}-${rand}`;
    const ok = redeem(pts, `Coupon ${code} · Rs ${value} off`);
    if (!ok) {
      toast.error("Not enough points yet");
      return;
    }
    navigator.clipboard?.writeText(code).catch(() => {});
    toast.success(`Redeemed · code ${code} copied`);
  };

  if (!joined) {
    return (
      <div className="rounded-3xl border border-border bg-cream/40 p-10 text-center">
        <Sparkles className="mx-auto h-8 w-8" />
        <h2 className="mt-4 font-display text-2xl font-semibold">Join free in one tap</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Instantly earn 100 welcome points (= Rs 10 off) and unlock member drops. No email,
          no password — points live on this device.
        </p>
        <button
          onClick={() => {
            join();
            toast.success("Welcome to Junassan Club · 100 pts added");
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-paper hover:opacity-90"
        >
          <Gift className="h-4 w-4" /> Join the Club
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-border bg-paper p-6">
          <p className="eyebrow">Balance</p>
          <p className="mt-2 font-display text-4xl font-semibold">{points}</p>
          <p className="text-xs text-muted-foreground">
            = {formatPKR(Math.floor(points / 100) * RUPEES_PER_100_POINTS)} redeemable
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-paper p-6">
          <p className="eyebrow">Lifetime</p>
          <p className="mt-2 font-display text-4xl font-semibold">{lifetime}</p>
          <p className="text-xs text-muted-foreground">points earned all-time</p>
        </div>
        <div className="rounded-3xl border border-border bg-ink p-6 text-paper">
          <p className="eyebrow" style={{ color: "#bfb5a3" }}>Current tier</p>
          <p className="mt-2 flex items-center gap-2 font-display text-4xl font-semibold">
            <Crown className="h-6 w-6" /> {tier.name}
          </p>
          {next ? (
            <p className="text-xs opacity-80">{toNext} pts to {next.name}</p>
          ) : (
            <p className="text-xs opacity-80">Top tier unlocked</p>
          )}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Progress to next</p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-cream">
          <div className="h-full rounded-full bg-ink" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-4 text-[10px] uppercase tracking-widest text-muted-foreground">
          {TIERS.map((t) => (
            <div key={t.slug} className={t.slug === tier.slug ? "font-semibold text-ink" : ""}>
              {t.name}
              <div className="text-[9px] text-muted-foreground">{t.min} pts</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-display text-2xl font-semibold">Redeem your points</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {redeemLevels.map((r) => {
            const enough = points >= r.pts;
            return (
              <button
                key={r.pts}
                disabled={!enough}
                onClick={() => onRedeem(r.pts, r.value)}
                className={`rounded-2xl border p-5 text-left transition ${
                  enough
                    ? "border-ink bg-paper hover:bg-cream"
                    : "border-border bg-cream/40 opacity-60"
                }`}
              >
                <p className="font-display text-2xl font-semibold">Rs {r.value} off</p>
                <p className="mt-1 text-xs text-muted-foreground">{r.pts} points</p>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-widest text-ink">
                  {enough ? "Redeem" : "Locked"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-display text-2xl font-semibold">Tier perks</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t) => (
            <div
              key={t.slug}
              className={`rounded-2xl border p-5 ${
                t.slug === tier.slug ? "border-ink bg-cream/60" : "border-border"
              }`}
            >
              <p className="font-display text-xl font-semibold">{t.name}</p>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                {t.min}+ pts
              </p>
              <ul className="mt-3 space-y-1 text-xs">
                {t.perks.map((perk) => (
                  <li key={perk} className="flex gap-2">
                    <span>•</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div>
          <h2 className="mb-4 font-display text-2xl font-semibold">Activity</h2>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-paper">
            {history.slice(0, 12).map((h, i) => (
              <li key={i} className="flex items-center justify-between p-4 text-sm">
                <div>
                  <p className="font-medium">{h.note}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(h.at).toLocaleDateString("en-PK")}
                  </p>
                </div>
                <p className={`font-semibold ${h.points > 0 ? "text-ink" : "text-accent-red"}`}>
                  {h.points > 0 ? "+" : ""}
                  {h.points} pts
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
