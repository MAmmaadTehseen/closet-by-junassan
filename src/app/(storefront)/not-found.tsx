import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";
import { fetchProducts } from "@/lib/products";

export default async function NotFound() {
  const trending = await fetchProducts({ tag: "trending", limit: 4 }).catch(() => []);
  const fallback = trending.length > 0 ? trending : await fetchProducts({ limit: 4 }).catch(() => []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="text-center">
        <p className="font-display text-7xl font-semibold tracking-tighter text-ink/15 sm:text-9xl">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold sm:text-5xl">
          This page wandered off.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm text-muted-foreground">
          The piece you&apos;re looking for may have sold out or moved. Try one of these instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper"
          >
            Go Home
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:bg-ink hover:text-paper"
          >
            Browse Shop
          </Link>
          <Link
            href="/lookbook"
            className="rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:border-ink"
          >
            Lookbook
          </Link>
        </div>
      </div>

      {fallback.length > 0 && (
        <div className="mt-20">
          <p className="eyebrow mb-2 text-center">While you&apos;re here</p>
          <h2 className="text-center font-display text-2xl font-semibold sm:text-3xl">
            Trending right now
          </h2>
          <div className="mt-8">
            <ProductGrid products={fallback} />
          </div>
        </div>
      )}
    </div>
  );
}
