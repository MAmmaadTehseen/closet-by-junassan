import type { Metadata } from "next";
import { fetchProducts } from "@/lib/products";
import CompareView from "@/components/product/CompareView";

export const metadata: Metadata = {
  title: "Compare",
  description: "Compare up to 4 pieces side-by-side — price, size, fabric and condition.",
};

export default async function ComparePage() {
  const products = await fetchProducts({ limit: 200 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10">
        <p className="eyebrow mb-2">Side-by-side</p>
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
          Compare Pieces
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Stack up to 4 products next to each other — perfect for picking between two near-identical fits.
        </p>
      </div>
      <CompareView products={products} />
    </div>
  );
}
