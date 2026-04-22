import type { Metadata } from "next";
import { Gift, Heart, Mail, MessageCircle, Sparkles } from "lucide-react";
import { waLink, siteConfig } from "@/lib/site-config";
import GiftCardConfigurator from "./GiftCardConfigurator";

export const metadata: Metadata = {
  title: "Gift Cards",
  description:
    "Give the gift of style. Digital gift cards for Closet by Junassan — pick an amount, add a note, and we'll deliver it to them.",
};

export default function GiftCardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> New · Digital Gift Cards
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            The closet <span className="italic">they&apos;ve</span> been eyeing —
            <br />
            you pick the budget.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Digital gift cards redeemable across the entire store. Delivered
            instantly by email or WhatsApp. Never expires.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Perk icon={<Gift className="h-4 w-4" />} title="Instant delivery" body="Emailed or WhatsApp'd" />
            <Perk icon={<Heart className="h-4 w-4" />} title="Never expires" body="Use any time, any drop" />
            <Perk icon={<Sparkles className="h-4 w-4" />} title="Any amount" body="Rs 1,000 – Rs 25,000" />
          </div>

          <div className="mt-10 rounded-3xl border border-border bg-cream/40 p-6">
            <p className="eyebrow mb-2">How it works</p>
            <ol className="space-y-2 text-sm text-ink">
              <li>1. Pick an amount and design.</li>
              <li>2. Add the recipient&apos;s name and a personal note.</li>
              <li>3. Confirm on WhatsApp — we&apos;ll send the card as a PDF.</li>
              <li>4. They apply the code at checkout and shop freely.</li>
            </ol>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={waLink("Hi! I'd like to buy a digital gift card.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper hover:opacity-90"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Order on WhatsApp
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}?subject=Gift%20Card%20Inquiry`}
              className="inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:bg-ink hover:text-paper"
            >
              <Mail className="h-3.5 w-3.5" /> Email Us
            </a>
          </div>
        </div>

        <GiftCardConfigurator />
      </div>
    </div>
  );
}

function Perk({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-paper p-4">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink">
        {icon}
      </div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-[11px] text-muted-foreground">{body}</p>
    </div>
  );
}
