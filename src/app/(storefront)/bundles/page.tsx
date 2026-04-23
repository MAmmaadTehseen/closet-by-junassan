import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchProducts } from "@/lib/products";
import { buildAllBundles } from "@/lib/bundles";
import { formatPKR } from "@/lib/format";
import AddBundleToCart from "./AddBundleToCart";

export const metadata: Metadata = {
  title: "Bundles — Shop the Look",
  description:
    "Curated outfits, priced to move together. Pick a full look and save up to 15% vs buying each piece solo.",
};

export const revalidate = 1800;

export default async function BundlesPage() {
  const products = await fetchProducts({ limit: 300 });
  const bundles = buildAllBundles(products);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6">
      <div className="mb-12 max-w-2xl">
        <p className="eyebrow mb-2">Shop the Look</p>
        <h1 className="font-display text-3xl font-semibold sm:text-5xl">
          Complete outfits. Cut price.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Hand-stacked combos from our stylist — every piece chosen to work with the others.
          Buy the whole bundle and save automatically at checkout.
        </p>
      </div>

      <div className="space-y-16">
        {bundles.map(({ def, items, full, final, save }) => (
          <section key={def.slug} className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow mb-2">{def.eyebrow}</p>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">{def.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {def.description}
              </p>

              <dl className="mt-6 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Solo total</dt>
                  <dd className="line-through">{formatPKR(full)}</dd>
                </div>
                <div className="flex justify-between text-accent-red">
                  <dt>You save</dt>
                  <dd>-{def.discountPct}% · {formatPKR(save)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-border pt-2 text-base font-semibold">
                  <dt>Bundle price</dt>
                  <dd className="font-display text-2xl">{formatPKR(final)}</dd>
                </div>
              </dl>

              <div className="mt-6">
                <AddBundleToCart items={items} bundleSlug={def.slug} discountPct={def.discountPct} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {items.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="group block focus-ring">
                  <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-cream">
                    {p.images[0] && (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 45vw, 20vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    )}
                  </div>
                  <p className="mt-2 line-clamp-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {p.brand}
                  </p>
                  <p className="line-clamp-1 text-sm">{p.name}</p>
                  <p className="text-xs font-semibold">{formatPKR(p.price_pkr)}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
