import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { BUNDLES, resolveBundle } from "@/lib/bundles";
import { fetchProducts } from "@/lib/products";
import { formatPKR } from "@/lib/format";
import { waLink } from "@/lib/site-config";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Curated Bundles",
  description: "Hand-picked bundles at bundle prices. Weekend out, office reset, starter closet — and more.",
};

export default async function BundlesPage() {
  const all = await fetchProducts({ limit: 200 });
  const bundles = BUNDLES.map((b) => resolveBundle(b, all)).filter((b) => b.items.length > 0);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24">
        <Reveal>
          <p className="eyebrow mb-4 inline-flex items-center gap-2">
            <Layers className="h-3 w-3" /> Bundle up
          </p>
          <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
            Built outfits. Built-in savings.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Curator-made bundles with piece-by-piece styling. Save up to 20% when you take the whole set.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl space-y-16 px-4 pb-24 sm:px-6">
        {bundles.map((b, idx) => (
          <Reveal key={b.slug} delay={idx * 80}>
            <article className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-stretch">
              <div className="relative min-h-[320px] overflow-hidden rounded-3xl bg-cream">
                {b.cover && (
                  <Image src={b.cover} alt={b.title} fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent p-6 text-paper">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/70">
                    {b.items.length} pieces · Save {Math.round(b.discountPct * 100)}%
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">{b.title}</h2>
                  <p className="mt-1 text-sm text-paper/80">{b.tagline}</p>
                </div>
              </div>
              <div className="flex flex-col rounded-3xl border border-border bg-paper p-6 sm:p-8">
                <p className="text-sm leading-relaxed text-muted-foreground">{b.description}</p>

                <ul className="mt-5 divide-y divide-border border-y border-border">
                  {b.items.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 py-3">
                      <Link
                        href={`/product/${p.slug}`}
                        className="relative h-14 w-12 flex-shrink-0 overflow-hidden rounded-md bg-cream"
                      >
                        {p.images[0] && <Image src={p.images[0]} alt={p.name} fill sizes="48px" className="object-cover" />}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{p.brand}</p>
                        <Link href={`/product/${p.slug}`} className="line-clamp-1 text-sm font-medium hover:underline">
                          {p.name}
                        </Link>
                      </div>
                      <p className="text-sm font-semibold">{formatPKR(p.price_pkr)}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-2xl bg-cream/70 p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Bundle price</p>
                      <p className="mt-1 font-display text-3xl font-semibold">{formatPKR(b.bundlePrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground line-through">{formatPKR(b.subtotal)}</p>
                      <p className="text-xs font-semibold uppercase tracking-wide text-accent-red">
                        Save {formatPKR(b.savings)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <a
                    href={waLink(`Hi! I'd like to grab the "${b.title}" bundle — ${formatPKR(b.bundlePrice)}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper hover:opacity-90"
                  >
                    Order bundle on WhatsApp
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink hover:border-ink"
                  >
                    Browse pieces
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        ))}

        {bundles.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">No bundles available right now — come back soon.</p>
        )}
      </section>
    </>
  );
}
