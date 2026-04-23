import type { Metadata } from "next";
import GiftCardForm from "./GiftCardForm";

export const metadata: Metadata = {
  title: "Gift Cards",
  description:
    "The always-right present. Digital gift cards from Rs 1,000 to Rs 25,000, delivered by WhatsApp or email.",
};

const DENOMS = [1000, 2000, 5000, 10000, 25000];

export default function GiftCardsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6">
      <div className="mb-10 grid gap-8 lg:grid-cols-2 lg:items-end">
        <div>
          <p className="eyebrow mb-2">The always-right present</p>
          <h1 className="font-display text-3xl font-semibold sm:text-5xl">
            A closet of choice, wrapped.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Digital gift cards, redeemable on everything we stock. We deliver the card by
            WhatsApp or email within 10 minutes — no plastic, no post.
          </p>
        </div>
        <ul className="rounded-3xl border border-border bg-cream/60 p-6 text-sm">
          <li className="flex gap-2">
            <span>✓</span> Valid for 12 months from purchase
          </li>
          <li className="mt-2 flex gap-2">
            <span>✓</span> Stackable with any active sale
          </li>
          <li className="mt-2 flex gap-2">
            <span>✓</span> Partial balance stays on card
          </li>
          <li className="mt-2 flex gap-2">
            <span>✓</span> Works for COD too — balance deducts first
          </li>
        </ul>
      </div>

      <GiftCardForm denoms={DENOMS} />

      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold">How it works</h2>
        <ol className="mt-4 space-y-3 text-sm">
          <li><span className="font-semibold">1.</span> Pick an amount and write a note.</li>
          <li><span className="font-semibold">2.</span> We message you a one-time code and a printable card.</li>
          <li><span className="font-semibold">3.</span> Your recipient enters the code at checkout — balance auto-applies.</li>
        </ol>
      </section>
    </div>
  );
}
