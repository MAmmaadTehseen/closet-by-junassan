import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchProducts } from "@/lib/products";
import { summariseBrands } from "@/lib/brands";
import { formatPKR } from "@/lib/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Shop by brand — every label we have in stock right now, sorted by what's most loved.",
};

export default async function BrandsPage() {
  const products = await fetchProducts({ limit: 500 });
  const brands = summariseBrands(products);

  // First letter index so visitors can jump quickly when the list grows.
  const grouped: Record<string, typeof brands> = {};
  for (const b of brands) {
    const letter = (b.name[0] || "#").toUpperCase();
    grouped[letter] ??= [];
    grouped[letter].push(b);
  }
  const letters = Object.keys(grouped).sort();

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6">
      <div className="mb-10">
        <p className="eyebrow mb-2">Index</p>
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
          Shop by Brand
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Every label currently in our closet — from streetwear to designer drops, all
          authenticated and ready for COD.
        </p>
      </div>

      {/* Letter jump nav */}
      {letters.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2 border-y border-border py-4">
          {letters.map((l) => (
            <a
              key={l}
              href={`#${l}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-xs font-semibold hover:border-ink"
            >
              {l}
            </a>
          ))}
        </div>
      )}

      <div className="space-y-12">
        {letters.map((l) => (
          <section key={l} id={l}>
            <h2 className="mb-5 font-display text-2xl font-semibold">{l}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {grouped[l].map((b) => (
                <Link
                  key={b.slug}
                  href={`/brands/${b.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-border bg-paper transition hover:border-ink"
                >
                  <div className="relative aspect-square overflow-hidden bg-cream">
                    {b.cover && (
                      <Image
                        src={b.cover}
                        alt={b.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-display text-base font-semibold">{b.name}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                      {b.count} {b.count === 1 ? "piece" : "pieces"} • from {formatPKR(b.minPrice)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
