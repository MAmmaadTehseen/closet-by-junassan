import type { Metadata } from "next";
import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";
import { fetchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shared wishlist",
  description: "Someone shared their Closet by Junassan wishlist with you.",
  robots: { index: false, follow: false },
};

type SP = Promise<{ ids?: string }>;

export default async function SharedWishlistPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const { ids } = await searchParams;
  const all = await fetchProducts({ limit: 200 });

  const idList = (ids ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const items = idList
    .map((id) => all.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="eyebrow mb-3">Someone&apos;s picks</p>
      <h1 className="font-display text-4xl font-semibold sm:text-6xl">
        A shared wishlist
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        {items.length > 0
          ? `${items.length} ${items.length === 1 ? "piece" : "pieces"} — picked by a friend. Grab one before it's gone.`
          : "The link looks empty or the items have sold out."}
      </p>

      <div className="mt-10">
        {items.length > 0 ? (
          <ProductGrid products={items} />
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border py-24 text-center">
            <p className="font-display text-2xl font-semibold">Nothing here</p>
            <Link
              href="/shop"
              className="mt-2 rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper"
            >
              Browse the Drop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
