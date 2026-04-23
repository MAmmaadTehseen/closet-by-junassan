import type { Metadata } from "next";
import Link from "next/link";
import { waLink, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Ambassadors",
  description:
    "Wear the closet. Get paid. We partner with creators across Pakistan who love thrift as much as we do.",
};

const PERKS = [
  {
    t: "15% commission",
    d: "On every order tracked to your code — paid weekly by Easypaisa or JazzCash.",
  },
  {
    t: "Free monthly parcel",
    d: "A styled capsule shipped to you before each drop goes public.",
  },
  {
    t: "Your own collection",
    d: "Top ambassadors co-curate a signature rail with our stylists twice a year.",
  },
  {
    t: "First-look access",
    d: "Private previews 48 hours before every drop — pick before the crowd.",
  },
];

const REQUIREMENTS = [
  "Active on Instagram, TikTok or YouTube with fashion-leaning content",
  "At least 3,000 engaged followers (not a hard rule — we care about vibe)",
  "Based in Pakistan and comfortable with COD-first audience",
  "Willing to post 2 styled looks per month",
];

export default function AmbassadorsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow mb-2">Apply · rolling intake</p>
        <h1 className="font-display text-3xl font-semibold sm:text-5xl">
          Wear the closet. Get paid.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We partner with a small, handpicked circle of creators across Pakistan —
          from Karachi street-style pages to Peshawar fashion vloggers.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PERKS.map((p) => (
          <div key={p.t} className="rounded-2xl border border-border bg-paper p-6">
            <h3 className="font-display text-xl font-semibold">{p.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="font-display text-2xl font-semibold">What we look for</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {REQUIREMENTS.map((r) => (
              <li key={r} className="flex gap-2">
                <span className="text-ink">✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-cream/60 p-8">
          <h2 className="font-display text-2xl font-semibold">Apply in 60 seconds</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            WhatsApp us your handle and a line about why thrift matters to you. We reply within
            48 hours — yes or no.
          </p>
          <a
            href={waLink(
              "Hi! I'd like to apply for the Closet by Junassan ambassador programme.\n\nHandle: \nAudience: \nWhy thrift: ",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-paper hover:opacity-90"
          >
            Apply via WhatsApp
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            Not ready? Start with{" "}
            <Link href="/referrals" className="underline">
              our referral program
            </Link>{" "}
            — same spirit, no application needed.
          </p>
        </div>
      </section>

      <section className="mt-16 border-t border-border pt-10">
        <p className="eyebrow mb-3">Currently repping</p>
        <div className="flex flex-wrap gap-3">
          {["@urban.rail", "@lahorelayers", "@preloved.noor", "@thrifty.pk", "@fadedblue", "@khi.fits"].map(
            (h) => (
              <span
                key={h}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-widest"
              >
                {h}
              </span>
            ),
          )}
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name} Ambassadors — handpicked, never bought.
        </p>
      </section>
    </div>
  );
}
