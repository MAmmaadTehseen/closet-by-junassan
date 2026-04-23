import type { Metadata } from "next";
import ReferralClient from "@/components/referral/ReferralClient";

export const metadata: Metadata = {
  title: "Refer a Friend",
  description: "Share the good taste. Rs 500 for them, 250 points for you.",
};

export default function ReferPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="eyebrow mb-3">Refer & Earn</p>
      <h1 className="font-display text-5xl font-semibold leading-[1.02] sm:text-7xl">
        Good taste, <span className="italic text-ink/70">passed on.</span>
      </h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        Invite friends to Closet by Junassan. They get a welcome discount — you earn loyalty points that stack with everything else.
      </p>
      <div className="mt-12">
        <ReferralClient />
      </div>
    </section>
  );
}
