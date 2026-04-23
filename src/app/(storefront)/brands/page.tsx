import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { fetchProducts } from "@/lib/products";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Brands A–Z",
  description: "Every brand we’ve curated. Zara to Levis, Uniqlo to Ralph Lauren — shop by label.",
};

export default async function BrandsPage() {
  const products = await fetchProducts({ limit: 500 });
  const byBrand = new Map<string, number>();
  for (const p of products) {
    byBrand.set(p.brand, (byBrand.get(p.brand) ?? 0) + 1);
  }

  const letters: Record<string, { brand: string; count: number }[]> = {};
  for (const [brand, count] of byBrand.entries()) {
    const letter = (brand[0] ?? "#").toUpperCase();
    const key = /^[A-Z]$/.test(letter) ? letter : "#";
    (letters[key] ??= []).push({ brand, count });
  }
  const keys = Object.keys(letters).sort();
  for (const k of keys) letters[k].sort((a, b) => a.brand.localeCompare(b.brand));

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24">
        <Reveal>
          <p className="eyebrow mb-4">Shop by label</p>
          <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
            Brands A–Z.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Every brand on the site — curated and in stock right now. Tap a label to shop the lot.
          </p>
        </Reveal>

        <nav className="mt-10 flex flex-wrap gap-1.5">
          {keys.map((k) => (
            <a
              key={k}
              href={`#letter-${k}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-xs font-semibold hover:border-ink hover:bg-ink hover:text-paper"
            >
              {k}
            </a>
          ))}
        </nav>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        {keys.map((k) => (
          <div key={k} id={`letter-${k}`} className="border-t border-border py-8">
            <p className="font-display text-6xl font-semibold text-ink/20">{k}</p>
            <ul className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {letters[k].map(({ brand, count }) => (
                <li key={brand}>
                  <Link
                    href={`/shop?q=${encodeURIComponent(brand)}`}
                    className="group flex items-center justify-between border-b border-border/60 py-3 text-sm"
                  >
                    <span className="font-medium text-ink group-hover:underline">{brand}</span>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      {count} {count === 1 ? "piece" : "pieces"}
                      <ArrowRight className="h-3 w-3 translate-x-0 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
