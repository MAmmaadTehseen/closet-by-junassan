"use client";

import { useMemo } from "react";
import { useRecent } from "@/lib/recent-store";
import ProductCard from "./ProductCard";
import Reveal from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";

export default function RecentlyViewed({
  allProducts,
  excludeSlug,
}: {
  allProducts: Product[];
  excludeSlug?: string;
}) {
  const slugs = useRecent((s) => s.slugs);
  const items = useMemo(
    () =>
      slugs
        .filter((s) => s !== excludeSlug)
        .map((s) => allProducts.find((p) => p.slug === s))
        .filter(Boolean) as Product[],
    [slugs, allProducts, excludeSlug],
  );
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <Reveal>
        <div className="mb-8">
          <p className="eyebrow mb-2">For you</p>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Recently viewed</h2>
        </div>
      </Reveal>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
        {items.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
