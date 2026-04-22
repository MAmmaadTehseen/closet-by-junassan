"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { History } from "lucide-react";
import ProductCard from "./ProductCard";
import { useRecent } from "@/lib/recent-store";
import { useWishlist } from "@/lib/wishlist-store";
import { toast } from "@/components/ui/Toaster";
import type { Product } from "@/lib/types";

export default function RecentlyViewedPage({ products }: { products: Product[] }) {
  const slugs = useRecent((s) => s.slugs);
  const clear = useRecent((s) => s.clear);
  const wishlistIds = useWishlist((s) => s.ids);
  const wishlistToggle = useWishlist((s) => s.toggle);

  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const items = useMemo(
    () =>
      mounted
        ? (slugs
            .map((slug) => products.find((p) => p.slug === slug))
            .filter(Boolean) as Product[])
        : [],
    [slugs, products, mounted],
  );

  if (!mounted) return null;

  const moveAllToWishlist = () => {
    let moved = 0;
    for (const p of items) {
      if (!wishlistIds.includes(p.id)) {
        wishlistToggle(p.id);
        moved++;
      }
    }
    toast.success(`Moved ${moved} ${moved === 1 ? "piece" : "pieces"} to wishlist`);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-dashed border-border py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
          <History className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-display text-2xl font-semibold">No history yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Products you view will appear here so you can come back to them.
        </p>
        <Link
          href="/shop"
          className="mt-2 rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper"
        >
          Start browsing
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {items.length} viewed
        </p>
        <div className="flex gap-2">
          <button
            onClick={moveAllToWishlist}
            className="rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink hover:border-ink"
          >
            Move all to wishlist
          </button>
          <button
            onClick={clear}
            className="rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-accent-red"
          >
            Clear history
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
