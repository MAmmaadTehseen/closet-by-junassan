import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Flame, Sparkles, Tag } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPKR } from "@/lib/format";
import Reveal from "@/components/ui/Reveal";

/**
 * Bento-grid editorial section. 5 tiles, hand-picked roles:
 *   [hero (tall+wide)] [promo]
 *   [hero cont.]       [product A]
 *   [product B]        [product C]
 */
export default function BentoPicks({
  hero,
  secondary,
  tertiary,
}: {
  hero: Product;
  secondary: Product;
  tertiary: Product[];
}) {
  if (!hero || !secondary || tertiary.length < 2) return null;
  const [a, b] = tertiary;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Today&apos;s picks · Bento</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              A handful of things <span className="italic text-ink/75">worth your attention.</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-ink"
          >
            Browse all
            <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-6 lg:grid-rows-2 lg:[grid-template-rows:repeat(2,minmax(240px,1fr))]">
        {/* Hero tile — dominant, full-bleed */}
        <Reveal delay={60} className="lg:col-span-4 lg:row-span-2">
          <BentoTile
            href={`/product/${hero.slug}`}
            image={hero.images[0]}
            eyebrow="Editor's pick"
            title={hero.name}
            meta={`${hero.brand} · ${formatPKR(hero.price_pkr)}`}
            icon={<Sparkles className="h-3.5 w-3.5" />}
            heightClass="aspect-16/10 lg:aspect-auto lg:h-full"
            titleClass="text-3xl sm:text-4xl lg:text-5xl"
            dark
          />
        </Reveal>

        {/* Promo tile */}
        <Reveal delay={120} className="lg:col-span-2">
          <Link
            href="/deals"
            className="group relative block h-full overflow-hidden rounded-3xl border border-border bg-cream p-6 focus-ring"
          >
            <div className="pointer-events-none absolute inset-0 noise opacity-30" aria-hidden />
            <div className="relative flex h-full flex-col justify-between gap-6 min-h-56">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-paper">
                  <Tag className="h-3 w-3" /> Under 2000
                </div>
                <p className="mt-5 font-display text-2xl font-semibold leading-[1.05] sm:text-3xl">
                  Best for your <span className="italic">rupee.</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-ink">
                Shop the edit
                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </Reveal>

        {/* Secondary product */}
        <Reveal delay={180} className="lg:col-span-2">
          <BentoTile
            href={`/product/${secondary.slug}`}
            image={secondary.images[0]}
            eyebrow="Trending"
            title={secondary.name}
            meta={formatPKR(secondary.price_pkr)}
            icon={<Flame className="h-3.5 w-3.5" />}
            heightClass="aspect-4/5 lg:aspect-auto lg:h-full"
            titleClass="text-xl sm:text-2xl"
          />
        </Reveal>

        {/* Tertiary tiles */}
        <Reveal delay={240} className="lg:col-span-1">
          <BentoTile
            href={`/product/${a.slug}`}
            image={a.images[0]}
            title={a.name}
            meta={formatPKR(a.price_pkr)}
            heightClass="aspect-square lg:aspect-auto lg:h-full"
            titleClass="text-base"
          />
        </Reveal>
        <Reveal delay={300} className="lg:col-span-1">
          <BentoTile
            href={`/product/${b.slug}`}
            image={b.images[0]}
            title={b.name}
            meta={formatPKR(b.price_pkr)}
            heightClass="aspect-square lg:aspect-auto lg:h-full"
            titleClass="text-base"
          />
        </Reveal>
      </div>
    </section>
  );
}

function BentoTile({
  href,
  image,
  eyebrow,
  title,
  meta,
  icon,
  heightClass = "",
  titleClass = "",
  dark = false,
}: {
  href: string;
  image?: string;
  eyebrow?: string;
  title: string;
  meta?: string;
  icon?: React.ReactNode;
  heightClass?: string;
  titleClass?: string;
  dark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-3xl border border-border bg-cream ${heightClass} focus-ring`}
    >
      {image && (
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.05]"
        />
      )}
      <div
        className={`absolute inset-0 ${
          dark
            ? "bg-linear-to-t from-black/70 via-black/15 to-transparent"
            : "bg-linear-to-t from-black/55 via-black/5 to-transparent"
        }`}
      />
      <div className="absolute inset-x-0 bottom-0 p-5 text-paper sm:p-6">
        {eyebrow && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-paper/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] backdrop-blur">
            {icon}
            {eyebrow}
          </div>
        )}
        <p
          className={`mt-3 font-display font-semibold leading-[1.05] tracking-[-0.015em] line-clamp-2 ${titleClass}`}
        >
          {title}
        </p>
        {meta && (
          <p className="mt-1.5 text-[11px] uppercase tracking-widest text-paper/85">{meta}</p>
        )}
      </div>
    </Link>
  );
}
