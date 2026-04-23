import type { Metadata } from "next";
import RewardsClient from "@/components/loyalty/RewardsClient";

export const metadata: Metadata = {
  title: "Closet Club — Rewards",
  description: "Earn points on every order. Redeem for discounts, freebies, and priority drops.",
};

export default function RewardsPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
      <p className="eyebrow mb-2">Closet Club</p>
      <h1 className="font-display text-5xl font-semibold leading-[1.05] sm:text-7xl">
        Loyalty that <span className="italic">actually</span> rewards.
      </h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        Earn points on every order. Unlock perks. Get first dibs on every drop. It&apos;s free to join — and Cash on Delivery friendly.
      </p>
      <div className="mt-12">
        <RewardsClient />
      </div>
    </section>
  );
}
