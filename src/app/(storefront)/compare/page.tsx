import type { Metadata } from "next";
import { fetchProducts } from "@/lib/products";
import CompareView from "@/components/product/CompareView";

export const metadata: Metadata = {
  title: "Compare Products",
  description: "Compare up to four pieces side by side — price, size, condition and details.",
};

export default async function ComparePage() {
  const products = await fetchProducts({ limit: 200 });
  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6">
      <p className="eyebrow mb-2">Side by side</p>
      <h1 className="font-display text-3xl font-semibold sm:text-5xl">Compare pieces</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Add up to four products from the shop using the compare button on any card. Mix and match to
        find what fits your closet best.
      </p>
      <div className="mt-10">
        <CompareView products={products} />
      </div>
    </div>
  );
}
