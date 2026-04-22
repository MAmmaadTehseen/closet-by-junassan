import type { Metadata } from "next";
import Link from "next/link";
import { Coins, Gift, Star, Truck } from "lucide-react";
import RewardsWallet from "@/components/rewards/RewardsWallet";

export const metadata: Metadata = {
  title: "Closet Coins — Rewards",
  description:
    "Earn Closet Coins on every order, every review, every referral. Redeem at checkout for instant Rs off.",
};

const PERKS = [
  { icon: Coins, title: "Earn 1 coin per Re 1", body: "On every successfully delivered COD order." },
  { icon: Star, title: "+250 for every review", body: "Photo reviews give you bonus coins on top." },
  { icon: Gift, title: "+500 birthday bonus", body: "Tell us your birthday on WhatsApp to opt-in." },
  { icon: Truck, title: "Priority dispatch perk", body: "Tier 2+ members ship before everyone else." },
];

export default function RewardsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10">
        <p className="eyebrow mb-2">Closet Coins</p>
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
          Get rewarded for shopping the closet.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Every Re 1 you spend earns 1 Closet Coin. 100 coins = Rs 100 off your next order — apply
          right at checkout.
        </p>
      </div>

      <RewardsWallet />

      <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PERKS.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="rounded-2xl border border-border bg-cream/40 p-5">
              <Icon className="h-5 w-5 text-amber-500" />
              <p className="mt-3 font-display text-lg font-semibold">{p.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-14 rounded-2xl border border-border bg-paper p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold">Tier rewards</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Higher tiers unlock more perks automatically — based on your lifetime coins earned.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { tier: "Cotton", req: "0+", perks: "Earn coins · review bonuses" },
            { tier: "Linen", req: "5,000+", perks: "Priority dispatch · birthday gift" },
            { tier: "Silk", req: "20,000+", perks: "Free shipping · early drops" },
          ].map((t) => (
            <div key={t.tier} className="rounded-xl border border-border bg-cream/40 p-4 text-center">
              <p className="font-display text-xl font-semibold">{t.tier}</p>
              <p className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                {t.req} coins
              </p>
              <p className="mt-3 text-xs text-muted-foreground">{t.perks}</p>
            </div>
          ))}
        </div>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-paper hover:opacity-90"
        >
          Start earning — shop now
        </Link>
      </section>
    </div>
  );
}
