import type { Metadata } from "next";
import Link from "next/link";
import { fetchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop by brand",
  description: "Every brand stocked at Closet by Junassan, A–Z.",
};

export const revalidate = 3600;

export default async function BrandsPage() {
  const products = await fetchProducts({ limit: 500 });

  const byBrand = new Map<string, number>();
  for (const p of products) {
    const key = p.brand?.trim() || "Unbranded";
    byBrand.set(key, (byBrand.get(key) ?? 0) + 1);
  }

  const brands = [...byBrand.entries()].sort(([a], [b]) =>
    a.toLowerCase().localeCompare(b.toLowerCase()),
  );

  const grouped = new Map<string, { brand: string; count: number }[]>();
  for (const [brand, count] of brands) {
    const letter = /^[a-z]/i.test(brand) ? brand[0].toUpperCase() : "#";
    const arr = grouped.get(letter) ?? [];
    arr.push({ brand, count });
    grouped.set(letter, arr);
  }
  const letters = [...grouped.keys()].sort((a, b) =>
    a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="eyebrow mb-3">A to Z</p>
      <h1 className="font-display text-4xl font-semibold sm:text-6xl">Brands</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Every label stocked right now at Closet by Junassan. Tap a brand to see
        everything we have from them.
      </p>

      <div className="mt-8 flex flex-wrap gap-1 border-y border-border py-3">
        {letters.map((l) => (
          <a
            key={l}
            href={`#letter-${l}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold hover:bg-cream"
          >
            {l}
          </a>
        ))}
      </div>

      <div className="mt-10 space-y-10">
        {letters.map((letter) => (
          <section key={letter} id={`letter-${letter}`} className="scroll-mt-28">
            <h2 className="font-display text-3xl font-semibold">{letter}</h2>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 md:grid-cols-3">
              {grouped.get(letter)!.map(({ brand, count }) => (
                <Link
                  key={brand}
                  href={`/shop?q=${encodeURIComponent(brand)}`}
                  className="flex items-baseline justify-between border-b border-dashed border-border py-2 text-sm hover:text-ink"
                >
                  <span className="truncate font-medium">{brand}</span>
                  <span className="ml-3 shrink-0 text-xs text-muted-foreground">
                    {count} {count === 1 ? "piece" : "pieces"}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
