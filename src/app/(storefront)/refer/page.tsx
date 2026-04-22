import type { Metadata } from "next";
import ReferralWidget from "@/components/refer/ReferralWidget";

export const metadata: Metadata = {
  title: "Refer a Friend",
  description:
    "Share Closet by Junassan — your friend gets 15% off, you earn 500 Closet Coins on their first order.",
};

export default function ReferPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10 text-center">
        <p className="eyebrow mb-2">Spread the closet love</p>
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
          Give 15%. Get 500 coins.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Send your friend a Rs-saving link. When they place their first COD order, we drop
          500 Closet Coins straight into your wallet.
        </p>
      </div>

      <ReferralWidget />

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {[
          {
            n: "01",
            title: "Share your link",
            body: "Copy your unique referral link and send it on WhatsApp, Instagram, or wherever.",
          },
          {
            n: "02",
            title: "They get 15% off",
            body: "First-time buyers get 15% off their first COD order automatically.",
          },
          {
            n: "03",
            title: "You earn 500 coins",
            body: "Once their order is delivered, 500 Closet Coins land in your wallet — Rs 500 off.",
          },
        ].map((s) => (
          <div key={s.n} className="rounded-2xl border border-border bg-cream/40 p-5">
            <p className="font-display text-3xl font-semibold text-ink/30">{s.n}</p>
            <p className="mt-2 font-display text-lg font-semibold">{s.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
