import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchProducts } from "@/lib/products";
import { buildLookbook } from "@/lib/lookbook";
import { formatPKR } from "@/lib/format";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Shoppable editorials and styled looks from the Closet team.",
};

export const revalidate = 3600;

export default async function LookbookPage() {
  const products = await fetchProducts({ limit: 80 });
  const looks = buildLookbook(products);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="eyebrow mb-3">Styled by the team</p>
      <h1 className="font-display text-4xl font-semibold sm:text-6xl">Lookbook</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Four ways to wear what we stocked this month. Every piece is real,
        shoppable, and — if it&apos;s still here — in stock.
      </p>

      <div className="mt-12 space-y-20">
        {looks.map((look, i) => {
          const lookProducts = look.productSlugs
            .map((s) => products.find((p) => p.slug === s))
            .filter((p): p is NonNullable<typeof p> => Boolean(p));
          const reversed = i % 2 === 1;
          return (
            <article
              key={look.slug}
              className={`grid items-center gap-10 lg:grid-cols-2 ${
                reversed ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className={`relative aspect-4/5 overflow-hidden rounded-3xl ${look.palette}`}>
                <Image
                  src={look.cover}
                  alt={look.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="eyebrow">{look.eyebrow}</p>
                <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                  {look.title}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {look.description}
                </p>

                <ul className="mt-7 divide-y divide-border border-y border-border">
                  {lookProducts.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/product/${p.slug}`}
                        className="group flex items-center gap-4 py-3"
                      >
                        <div className="relative h-16 w-14 flex-none overflow-hidden rounded-lg bg-cream">
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {p.brand}
                          </p>
                          <p className="line-clamp-1 text-sm font-medium group-hover:underline">
                            {p.name}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">{formatPKR(p.price_pkr)}</p>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-ink" />
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/shop"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-paper hover:opacity-90"
                >
                  Shop the look <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
