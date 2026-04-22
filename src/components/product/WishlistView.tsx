"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import ProductCard from "./ProductCard";
import WishlistShare from "./WishlistShare";
import { useWishlist } from "@/lib/wishlist-store";
import type { Product } from "@/lib/types";

export default function WishlistView({ allProducts }: { allProducts: Product[] }) {
  const ids = useWishlist((s) => s.ids);
  const clear = useWishlist((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const items = useMemo(
    () => (mounted ? (ids.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean) as Product[]) : []),
    [ids, allProducts, mounted],
  );

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-dashed border-border py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
          <Heart className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-display text-2xl font-semibold">Your wishlist is empty</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Tap the heart on any product to save it here. Limited pieces sell fast.
        </p>
        <Link
          href="/shop"
          className="mt-2 rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper"
        >
          Browse the Drop
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {items.length} saved
        </p>
        <div className="flex items-center gap-3">
          <WishlistShare />
          <button
            onClick={clear}
            className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-accent-red"
          >
            Clear all
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
