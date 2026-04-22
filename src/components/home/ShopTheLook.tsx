import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ShopTheLook({ products }: { products: Product[] }) {
  // Pick up to 4 visually distinct items as the "look".
  const look = products.filter((p) => p.images?.[0] && p.stock > 0).slice(0, 4);
  if (look.length < 3) return null;

  const total = look.reduce((sum, p) => sum + p.price_pkr, 0);
  const hero = look[0];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mb-8 flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow mb-2">06 · Shop the look</p>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Build the whole fit.
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Curated outfit by the team — wear it together or pick what speaks to you.
            </p>
          </div>
          <p className="hidden text-right text-xs uppercase tracking-[0.18em] text-muted-foreground sm:block">
            Look total
            <br />
            <span className="font-display text-2xl text-ink normal-case tracking-tight">
              {formatPKR(total)}
            </span>
          </p>
        </div>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <Link
            href={`/product/${hero.slug}`}
            className="group relative block aspect-4/5 overflow-hidden rounded-2xl bg-cream"
          >
            <Image
              src={hero.images[0]}
              alt={hero.name}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 rounded-2xl bg-paper/85 p-4 text-ink backdrop-blur">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  The hero piece
                </p>
                <p className="mt-1 font-display text-lg font-semibold leading-tight">
                  {hero.name}
                </p>
                <p className="text-sm">{formatPKR(hero.price_pkr)}</p>
              </div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper transition group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {look.slice(1).map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <Link
                href={`/product/${p.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-paper p-3 transition hover:-translate-y-0.5 hover:border-ink"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="96px"
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {p.brand}
                  </p>
                  <p className="line-clamp-1 font-display text-lg font-semibold">{p.name}</p>
                  <p className="mt-1 text-sm font-semibold">{formatPKR(p.price_pkr)}</p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-ink transition group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                  <Plus className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
