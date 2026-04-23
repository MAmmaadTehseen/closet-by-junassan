import type { Metadata } from "next";
import Link from "next/link";
import Accordion from "@/components/ui/Accordion";
import { siteConfig, waLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description:
    "Answers about Cash on Delivery, sizing, returns, authenticity and shipping at Closet by Junassan.",
};

interface QA {
  q: string;
  a: string;
}

const FAQS: QA[] = [
  {
    q: "Do you offer Cash on Delivery?",
    a: `Yes — every order ships Cash on Delivery across Pakistan. You only pay when the package arrives at your door. There is no advance payment of any kind.`,
  },
  {
    q: "How long does delivery take?",
    a: `${siteConfig.shipping.deliveryDays}. We call before dispatch to confirm your address. Most major cities receive packages within 3 working days.`,
  },
  {
    q: "Do you offer free shipping?",
    a: `Orders above Rs ${siteConfig.shipping.freeShippingThreshold.toLocaleString("en-PK")} ship completely free. Smaller orders carry a flat Rs ${siteConfig.shipping.flatFee} fee.`,
  },
  {
    q: "Are the items authentic?",
    a: `Every piece is hand-picked, inspected and condition-graded by our team on a 10-point scale. We photograph every item as-is — what you see is what you get.`,
  },
  {
    q: "What is your return policy?",
    a: `If the piece doesn't match the listing, you have 3 days from delivery to return it. Just message us on WhatsApp and we'll arrange a pickup. Sale items are final sale.`,
  },
  {
    q: "How do I know my size?",
    a: `Each product page shows exact measurements (chest, length, etc.). We also have a size guide modal on every PDP. If you're between sizes, message us — we can usually compare to a brand you already own.`,
  },
  {
    q: "Can I reserve an item?",
    a: `Most pieces are one-of-one, so we cannot reserve them. Add to bag and check out quickly to lock in your size.`,
  },
  {
    q: "Do you restock items?",
    a: `Almost never — most items are vintage or one-off thrift finds. If a piece sells out, tap "Notify me" on the product page so we can ping you if we ever come across it again.`,
  },
  {
    q: "Do you ship internationally?",
    a: `Currently we ship Pakistan-only. International friends can DM us on Instagram and we may be able to arrange a custom courier.`,
  },
  {
    q: "How do Closet Coins work?",
    a: `You earn 1 ${siteConfig.loyalty.name.split(" ")[1]} for every Rs ${siteConfig.loyalty.rupeesPerCoin} you spend. Each coin is worth Rs ${siteConfig.loyalty.coinValueInRupees} towards a future order.`,
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-20 sm:px-6">
      <div className="mb-10">
        <p className="eyebrow mb-2">Help</p>
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
          Frequently Asked
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Quick answers to the questions we get most often. Can&apos;t find yours?{" "}
          <a href={waLink()} className="underline" target="_blank" rel="noopener noreferrer">
            WhatsApp us
          </a>
          .
        </p>
      </div>

      <Accordion
        items={FAQS.map((f, i) => ({
          id: `q${i}`,
          title: f.q,
          content: <p className="leading-relaxed">{f.a}</p>,
        }))}
      />

      <div className="mt-12 rounded-2xl border border-border bg-cream/60 p-6 text-center">
        <p className="font-display text-xl font-semibold">Still need help?</p>
        <p className="mt-2 text-sm text-muted-foreground">
          We reply on WhatsApp within minutes during shop hours.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-paper"
          >
            WhatsApp Us
          </a>
          <Link
            href="/contact"
            className="rounded-full border border-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ink hover:bg-ink hover:text-paper"
          >
            Contact Page
          </Link>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
