import type { Metadata } from "next";
import ReferralCard from "./ReferralCard";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Referrals — Give Rs 300, Get Rs 300",
  description:
    "Share your code, your friend gets Rs 300 off their first order, you get Rs 300 credit when they checkout. Pakistan-wide.",
};

export default function ReferralsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow mb-2">Give 300. Get 300.</p>
        <h1 className="font-display text-3xl font-semibold sm:text-5xl">
          Your friends, our next customers.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Share your personal code. When a friend uses it on their first order, they get Rs 300
          off — and we credit Rs 300 to your next parcel. No limits, no expiry.
        </p>
      </div>

      <ReferralCard />

      <section className="mt-16 grid gap-8 sm:grid-cols-3">
        {[
          {
            n: "01",
            t: "Share your code",
            d: "WhatsApp it, paste it in a group, slap it on your story — however you share.",
          },
          {
            n: "02",
            t: "They shop with it",
            d: "Code applies Rs 300 off at checkout. Works on any order over Rs 1,500.",
          },
          {
            n: "03",
            t: "Your credit lands",
            d: "Rs 300 arrives in your Junassan Club balance within 24 hours of their delivery.",
          },
        ].map((s) => (
          <div key={s.n}>
            <p className="font-display text-5xl font-semibold text-ink/10">{s.n}</p>
            <h3 className="mt-2 font-display text-xl font-semibold">{s.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </section>

      <p className="mt-12 text-xs text-muted-foreground">
        Referral credits carry no cash value, are non-transferable, and can only be redeemed on{" "}
        {siteConfig.name}.
      </p>
    </div>
  );
}
