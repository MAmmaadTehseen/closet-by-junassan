import type { Metadata } from "next";
import { Gift, Clock, ShieldCheck, MessageCircle } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import GiftCardBuilder from "@/components/gift-cards/GiftCardBuilder";

export const metadata: Metadata = {
  title: "Gift Cards",
  description: "Give the gift of good taste. Digital gift cards from Rs 500 to Rs 50,000 — delivered on WhatsApp within 24 hours.",
};

const PERKS = [
  { icon: Clock,        title: "Instant delivery",  copy: "PDF voucher via WhatsApp within 24 hours." },
  { icon: ShieldCheck,  title: "12-month validity", copy: "Redeem any time. One-time use. No expiry stress." },
  { icon: MessageCircle,title: "COD friendly",      copy: "Pay cash on delivery when you order the card." },
  { icon: Gift,         title: "Any amount",        copy: "From Rs 500 up to Rs 50,000. Stack with any sale." },
];

export default function GiftCardsPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24">
        <Reveal>
          <p className="eyebrow mb-4">Gift Cards</p>
          <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
            Give the gift of <span className="italic text-ink/70">good taste.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Can&apos;t guess the size? Don&apos;t know the aesthetic? A Closet gift card lets them curate their own drop.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <GiftCardBuilder />
      </section>

      <section className="bg-cream/60 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="eyebrow mb-2 text-center">Why it&apos;s the easiest gift</p>
          <h2 className="text-center font-display text-3xl font-semibold sm:text-4xl">Simple. Generous. On-brand.</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="rounded-2xl border border-border bg-paper p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
