"use client";

import { useEffect, useState } from "react";
import { Sparkles, Gift, ArrowRight, Ticket } from "lucide-react";
import {
  useLoyalty,
  tierForPoints,
  nextTier,
  TIERS,
  POINTS_WELCOME,
  POINTS_PER_100_PKR,
  POINTS_PER_REVIEW,
  POINTS_REFERRAL,
} from "@/lib/loyalty-store";
import { toast } from "@/components/ui/Toaster";

const REWARDS = [
  { id: "r150", cost: 150,  label: "Rs 150 off",           detail: "Applied to your next order on WhatsApp." },
  { id: "r300", cost: 300,  label: "Free delivery coupon", detail: "Covers standard PK shipping." },
  { id: "r500", cost: 500,  label: "Rs 500 off",           detail: "Min spend Rs 2500." },
  { id: "r900", cost: 900,  label: "Mystery piece",        detail: "Curator-picked tote or accessory." },
] as const;

export default function RewardsClient() {
  const [mounted, setMounted] = useState(false);
  const joined = useLoyalty((s) => s.joined);
  const points = useLoyalty((s) => s.points);
  const events = useLoyalty((s) => s.events);
  const join = useLoyalty((s) => s.join);
  const redeem = useLoyalty((s) => s.redeem);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-[600px] shimmer rounded-3xl" />;

  const tier = tierForPoints(points);
  const next = nextTier(points);
  const progress = next ? Math.min(100, ((points - tier.min) / (next.min - tier.min)) * 100) : 100;

  const onJoin = () => {
    join();
    toast.success(`Welcome to Closet Club — ${POINTS_WELCOME} points added.`);
  };

  const onRedeem = (cost: number, label: string) => {
    if (redeem(cost, `Redeemed ${label}`)) {
      toast.success(`${label} unlocked — we'll apply it on WhatsApp.`);
    } else {
      toast.error("Not enough points yet.");
    }
  };

  if (!joined) {
    return (
      <div className="rounded-3xl border border-border bg-cream/60 p-8 text-center sm:p-14">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">Join the Closet Club</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Earn points on every purchase, drop early-access, and unlock member-only perks. Free to join.
        </p>
        <button
          onClick={onJoin}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-paper hover:opacity-90"
        >
          Join for free · {POINTS_WELCOME} bonus points
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-ink p-8 text-paper">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/60">Your balance</p>
            <p className="mt-2 font-display text-6xl font-semibold">{points}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-paper/60">points</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/60">Tier</p>
            <p className="mt-2 font-display text-3xl font-semibold">{tier.label}</p>
            <p className="mt-1 max-w-[190px] text-xs text-paper/60">{tier.perk}</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper/10">
            <div className="h-full rounded-full bg-paper transition-[width] duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-widest text-paper/60">
            {next ? `${next.min - points} pts to ${next.label}` : `You're at the top tier. 🎉`}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-display text-2xl font-semibold">Redeem</h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {REWARDS.map((r) => {
            const canAfford = points >= r.cost;
            return (
              <div key={r.id} className={`rounded-2xl border border-border bg-paper p-5 ${!canAfford ? "opacity-70" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cream">
                    <Ticket className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.detail}</p>
                  </div>
                  <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-paper">
                    {r.cost} pts
                  </span>
                </div>
                <button
                  onClick={() => onRedeem(r.cost, r.label)}
                  disabled={!canAfford}
                  className="mt-4 w-full rounded-full border border-ink bg-ink py-2.5 text-[11px] font-semibold uppercase tracking-widest text-paper transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {canAfford ? "Redeem" : `Need ${r.cost - points} more`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-display text-2xl font-semibold">How to earn</h3>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          <EarnCard icon={<Gift className="h-4 w-4" />} title="Every order" detail={`${POINTS_PER_100_PKR} pt per Rs 100 spent`} />
          <EarnCard icon={<Sparkles className="h-4 w-4" />} title="Write a review" detail={`+${POINTS_PER_REVIEW} pts per verified review`} />
          <EarnCard icon={<ArrowRight className="h-4 w-4" />} title="Refer a friend" detail={`+${POINTS_REFERRAL} pts when they order`} />
        </ul>
      </div>

      <div>
        <h3 className="font-display text-2xl font-semibold">Tiers</h3>
        <ul className="mt-5 grid gap-3 sm:grid-cols-4">
          {TIERS.map((t) => (
            <li key={t.key} className={`rounded-2xl border border-border p-5 ${tier.key === t.key ? "bg-ink text-paper" : "bg-paper"}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">{t.min}+ pts</p>
              <p className="mt-2 font-display text-xl font-semibold">{t.label}</p>
              <p className={`mt-1 text-xs ${tier.key === t.key ? "text-paper/70" : "text-muted-foreground"}`}>{t.perk}</p>
            </li>
          ))}
        </ul>
      </div>

      {events.length > 0 && (
        <div>
          <h3 className="font-display text-2xl font-semibold">Activity</h3>
          <ul className="mt-5 divide-y divide-border border-y border-border">
            {events.slice(0, 12).map((e) => (
              <li key={e.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{e.note}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(e.when).toLocaleDateString()} · {e.kind}
                  </p>
                </div>
                <p className={`font-semibold ${e.points < 0 ? "text-accent-red" : "text-ink"}`}>
                  {e.points > 0 ? "+" : ""}{e.points} pts
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EarnCard({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return (
    <li className="rounded-2xl border border-border bg-paper p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cream">{icon}</div>
      <p className="mt-4 text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </li>
  );
}
