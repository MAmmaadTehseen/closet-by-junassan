import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import type { Product } from "@/lib/types";

/**
 * Editorial-magazine lookbook. Paris Vogue / WSJ Magazine layout with a
 * tall left portrait, two stacked right tiles, and a pulled-quote caption.
 */
export default function Lookbook({
  products,
  title = "The Lookbook",
  subtitle = "This week's editorial. A mood, caught in four frames.",
}: {
  products: Product[];
  title?: string;
  subtitle?: string;
}) {
  if (products.length < 3) return null;
  const [a, b, c, d] = products;

  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
        <Reveal>
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Vol. 01 · {new Date().toLocaleString("en", { month: "long" })}</p>
              <h2 className="mt-2 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.015em] sm:text-5xl">
                {title}
              </h2>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <Link
              href="/shop?sort=newest"
              className="underline-sweep inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink"
            >
              Shop the edit <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr]">
          <Reveal>
            <TiltCard>
              <Link
                href={`/product/${a.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-3xl border border-border bg-cream shine-sweep"
              >
                {a.images?.[0] && (
                  <Image
                    src={a.images[0]}
                    alt={a.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                  />
                )}
                <div className="absolute inset-x-6 bottom-6">
                  <span className="glass inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink">
                    Cover · {a.category}
                  </span>
                  <p className="mt-3 font-display text-xl text-paper drop-shadow sm:text-2xl">
                    &ldquo;{a.name}&rdquo;
                  </p>
                </div>
              </Link>
            </TiltCard>
          </Reveal>
          <div className="grid gap-4">
            {[b, c].map((p, i) => (
              <Reveal key={p.id} delay={120 + i * 120}>
                <TiltCard>
                  <Link
                    href={`/product/${p.slug}`}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-cream shine-sweep"
                  >
                    {p.images?.[0] && (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                      />
                    )}
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="flex h-full flex-col justify-between rounded-3xl border border-border bg-cream p-7">
              <p className="font-display text-lg italic leading-snug">
                &ldquo;A closet isn&apos;t assembled — it&apos;s edited, one true piece at a time.&rdquo;
              </p>
              <div className="mt-6">
                {d && (
                  <Link
                    href={`/product/${d.slug}`}
                    className="group block aspect-square overflow-hidden rounded-2xl border border-border bg-paper shine-sweep"
                  >
                    {d.images?.[0] && (
                      <Image
                        src={d.images[0]}
                        alt={d.name}
                        width={600}
                        height={600}
                        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                      />
                    )}
                  </Link>
                )}
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Styled by the Editor
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
