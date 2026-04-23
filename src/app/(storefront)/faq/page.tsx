import type { Metadata } from "next";
import Link from "next/link";
import Accordion from "@/components/ui/Accordion";
import { siteConfig, waLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to the questions we get most — sizing, delivery, COD, returns, and how we source our pieces.",
};

const SECTIONS = [
  {
    title: "Ordering & Payment",
    items: [
      {
        id: "cod",
        title: "Do you really do cash on delivery?",
        content: (
          <p>
            Yes, fully. Pay the courier in cash when your parcel arrives. No advance, no bank
            transfer needed.
          </p>
        ),
      },
      {
        id: "confirm",
        title: "Will someone call before dispatch?",
        content: (
          <p>
            Always. We ring once to confirm your address, size choice, and the item&apos;s
            condition before it leaves our hands.
          </p>
        ),
      },
      {
        id: "change",
        title: "Can I change or cancel after ordering?",
        content: (
          <p>
            Before we dispatch, yes — WhatsApp us within 2 hours and we&apos;ll amend or
            cancel at no cost.
          </p>
        ),
      },
    ],
  },
  {
    title: "Delivery",
    items: [
      {
        id: "where",
        title: "Where do you deliver?",
        content: (
          <p>
            All over Pakistan — every city, town, and valley where our courier partners
            reach. Remote areas may need 1–2 extra days.
          </p>
        ),
      },
      {
        id: "time",
        title: "How long does delivery take?",
        content: (
          <p>
            {siteConfig.shipping.deliveryDays} for most cities. Karachi, Lahore and Islamabad
            often arrive in 2.
          </p>
        ),
      },
    ],
  },
  {
    title: "Sizing & Condition",
    items: [
      {
        id: "sizes",
        title: "Will it fit me?",
        content: (
          <p>
            Every listing includes flat-lay measurements. Compare to a piece you own —
            that&apos;s the most reliable way. Our <Link className="underline" href="/size-converter">size converter</Link> helps if the tag is in a foreign standard.
          </p>
        ),
      },
      {
        id: "condition",
        title: "What does “8/10 condition” mean?",
        content: (
          <p>
            A 10-point scale. 10/10 is brand-new with tags. 9/10 is worn once or twice.
            8/10 shows minor wash-wear but no damage. We photograph every flaw honestly.
          </p>
        ),
      },
    ],
  },
  {
    title: "Returns & Refunds",
    items: [
      {
        id: "return",
        title: "Can I return an item?",
        content: (
          <p>
            Yes — within 3 days of receiving it, if the piece doesn&apos;t match the listing.
            We arrange a courier pickup; you get a full refund or exchange.
          </p>
        ),
      },
      {
        id: "notfit",
        title: "What if it just doesn’t fit?",
        content: (
          <p>
            Because every piece is unique we can’t always offer a straight exchange, but
            we do offer store credit (valid 12 months) on a case-by-case basis.
          </p>
        ),
      },
    ],
  },
  {
    title: "About the Store",
    items: [
      {
        id: "sourcing",
        title: "Where do your pieces come from?",
        content: (
          <p>
            Hand-picked from curated European and Gulf thrift lots. Each item is washed,
            inspected and photographed by our team in Karachi.
          </p>
        ),
      },
      {
        id: "restock",
        title: "Will this piece come back in stock?",
        content: (
          <p>
            Usually not — most listings are one-of-one. Hit &ldquo;Notify me&rdquo; on the
            product page if a similar piece ever lands.
          </p>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6">
      <div className="mb-10">
        <p className="eyebrow mb-2">Help centre</p>
        <h1 className="font-display text-3xl font-semibold sm:text-5xl">
          Answers, no small print.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Can&apos;t find what you&apos;re looking for?{" "}
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="underline">
            WhatsApp the team
          </a>
          {" "}— we reply in minutes.
        </p>
      </div>

      <div className="space-y-12">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="mb-4 font-display text-2xl font-semibold">{section.title}</h2>
            <Accordion items={section.items} />
          </section>
        ))}
      </div>
    </div>
  );
}
