import type { Metadata } from "next";
import { fetchProducts } from "@/lib/products";
import CompareView from "@/components/product/CompareView";

export const metadata: Metadata = {
  title: "Compare",
  description: "Compare pieces side by side before you buy.",
};

export const revalidate = 3600;

export default async function ComparePage() {
  const products = await fetchProducts({ limit: 200 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <p className="eyebrow mb-2">Side by side</p>
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Compare
        </h1>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">
          Pick up to four pieces and compare the details — price, fabric, measurements, and
          condition — to make the call without second-guessing.
        </p>
      </div>
      <CompareView products={products} />
    </div>
  );
}
