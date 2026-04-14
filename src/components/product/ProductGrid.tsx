import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border py-24 text-center">
        <p className="font-display text-2xl font-semibold">Nothing matches yet.</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Try clearing a filter or exploring a different category.
        </p>
        <Link
          href="/shop"
          className="mt-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper"
        >
          Browse all
        </Link>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
