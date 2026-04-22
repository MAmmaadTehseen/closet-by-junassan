import type { Metadata } from "next";
import GiftCardForm from "@/components/gift-card/GiftCardForm";

export const metadata: Metadata = {
  title: "Gift Cards",
  description:
    "Send a Closet by Junassan gift card via WhatsApp — let them pick whatever piece they love.",
};

export default function GiftCardsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow mb-2">The thoughtful gift</p>
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
            Closet Gift Cards.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Pick an amount, write a note, and we&apos;ll send a digital card straight to their
            WhatsApp — redeemable on anything in store.
          </p>
          <ul className="mt-6 space-y-2 text-xs text-muted-foreground">
            <li>• Delivered within an hour, any day of the week.</li>
            <li>• Never expires — they redeem when they&apos;re ready.</li>
            <li>• No fees, no fine print — full value goes to them.</li>
          </ul>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-ink via-charcoal to-ink p-8 text-paper shadow-2xl">
          <div className="absolute inset-0 noise opacity-10" aria-hidden />
          <p className="relative text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/60">
            Closet · Gift Card
          </p>
          <p className="relative mt-2 font-display text-3xl font-semibold sm:text-5xl">
            Closet by Junassan
          </p>
          <div className="relative mt-8 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-paper/60">Value</p>
              <p className="font-display text-2xl font-semibold sm:text-4xl">Rs 5,000</p>
            </div>
            <p className="font-mono text-[11px] tracking-wider text-paper/60">CBJ-•••• 0420</p>
          </div>
        </div>
      </div>

      <GiftCardForm />
    </div>
  );
}
