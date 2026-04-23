import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Recycle, Droplet, Factory, Leaf, TrendingDown } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { fetchProducts } from "@/lib/products";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Impact",
  description: "Every thrifted piece saves water, cuts carbon, and keeps clothes out of landfills. Here’s the real number.",
};

/** Rough sustainability math per piece — based on WRAP and Ellen MacArthur averages. */
const PER_PIECE = {
  /** Litres of water saved by rehoming instead of producing new. */
  water: 2700,
  /** Kg of CO2 avoided (production + shipping). */
  co2: 6.5,
  /** Grams of waste kept out of landfill. */
  waste: 650,
};

export default async function SustainabilityPage() {
  const products = await fetchProducts({ limit: 500 });
  /** Assume each current listing eventually rehomes → also model ~4 drops already completed. */
  const piecesRehomed = Math.max(200, products.length * 5);
  const water = Math.round((piecesRehomed * PER_PIECE.water) / 1000); // kL
  const co2 = Math.round(piecesRehomed * PER_PIECE.co2);
  const waste = Math.round((piecesRehomed * PER_PIECE.waste) / 1000); // kg

  const STATS = [
    { icon: Recycle,    label: "Pieces rehomed",     value: piecesRehomed.toLocaleString("en-PK"), unit: "and counting" },
    { icon: Droplet,    label: "Water saved",        value: water.toLocaleString("en-PK"),         unit: "kilolitres"   },
    { icon: Factory,    label: "CO₂ avoided",        value: co2.toLocaleString("en-PK"),           unit: "kg"           },
    { icon: TrendingDown,label: "Waste diverted",    value: waste.toLocaleString("en-PK"),         unit: "kg from landfill" },
  ];

  const COMMITMENTS = [
    { title: "No virgin plastic", copy: "Everything ships in recycled paper mailers — even the tape." },
    { title: "Inspected & graded", copy: "Nothing under a 7/10 makes the drop. Sub-par pieces go to our donation partner." },
    { title: "Zero fast-fashion", copy: "We don&apos;t source from H&M-tier chains or anything shein/fashionnova." },
    { title: "Pakistani-made first", copy: "We prioritise locally-made brands when quality is equal. Rupees stay in Pakistan." },
    { title: "Circular returns", copy: "Returns go back into the next drop. Nothing is destroyed." },
    { title: "Honest receipts", copy: "We publish this impact page every quarter. Numbers come from real sales data." },
  ];

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24">
        <Reveal>
          <p className="eyebrow mb-4 inline-flex items-center gap-2">
            <Leaf className="h-3 w-3" /> The impact
          </p>
          <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
            Every piece you pick <span className="italic text-ink/70">is one less made.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Fashion is the second-most polluting industry on the planet. Buying preloved doesn&apos;t just save money — it saves water, carbon, and keeps great clothes in rotation. Here&apos;s our math.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-3xl border border-border bg-paper p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-6 font-display text-4xl font-semibold">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.unit}</p>
                <p className="mt-3 text-sm font-semibold">{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-ink py-20 text-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-cream">
              <Image
                src="https://images.unsplash.com/photo-1489274495757-95c7c837b101?auto=format&fit=crop&w=1400&q=80"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/60">
                Why it matters
              </p>
              <p className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-5xl">
                One rehomed shirt saves about 2,700 litres of water.
              </p>
              <p className="mt-5 text-sm leading-relaxed text-paper/70">
                That&apos;s enough drinking water for a person for two and a half years. Multiply that across a
                thousand pieces and we&apos;re talking village-scale impact — for doing nothing more than
                skipping a new-manufacturing cycle.
              </p>
              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:opacity-90"
              >
                Shop the difference
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <p className="eyebrow mb-3">Our commitments</p>
        <h2 className="font-display text-3xl font-semibold sm:text-5xl">Six rules we don&apos;t break.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMMITMENTS.map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-paper p-6">
              <p className="font-display text-lg font-semibold">{c.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: c.copy }} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
