import type { Metadata } from "next";
import CompareView from "@/components/product/CompareView";
import { fetchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Compare products",
  description: "Compare up to 4 products side-by-side before you check out.",
};

export default async function ComparePage() {
  const products = await fetchProducts({ limit: 200 });
  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-24 sm:px-6">
      <div className="mb-10">
        <p className="eyebrow mb-2">Side by side</p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Compare products</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Pick up to 4 pieces from the shop and check price, size, stock and
          condition in one view. Your compare list is kept on this device.
        </p>
      </div>
      <CompareView products={products} />
    </div>
  );
}
