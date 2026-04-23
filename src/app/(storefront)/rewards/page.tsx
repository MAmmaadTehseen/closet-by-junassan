import type { Metadata } from "next";
import RewardsView from "./RewardsView";

export const metadata: Metadata = {
  title: "Rewards — Junassan Club",
  description:
    "Earn points on every order, unlock member-only drops, and climb from Cotton to Cashmere.",
};

export default function RewardsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow mb-2">Junassan Club</p>
        <h1 className="font-display text-3xl font-semibold sm:text-5xl">
          Every rupee counts. Literally.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Rack up points on every order, redeem them at checkout, and climb from Cotton to
          Cashmere for bigger perks.
        </p>
      </div>
      <RewardsView />
    </div>
  );
}
