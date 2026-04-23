import type { Metadata } from "next";
import { fetchProducts } from "@/lib/products";
import CompareView from "./CompareView";

export const metadata: Metadata = {
  title: "Compare",
  description: "Compare up to 4 items side by side — price, condition, size and fabric at a glance.",
};

export default async function ComparePage() {
  const products = await fetchProducts({ limit: 300 });
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6">
      <div className="mb-8">
        <p className="eyebrow mb-2">Side by side</p>
        <h1 className="font-display text-3xl font-semibold sm:text-5xl">Compare</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Pick up to 4 pieces from the shop and see price, size, condition and fabric
          lined up — the easiest way to choose.
        </p>
      </div>
      <CompareView products={products} />
    </div>
  );
}
