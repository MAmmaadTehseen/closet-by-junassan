import type { Metadata } from "next";
import CompareView from "@/components/product/CompareView";
import { fetchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Compare",
  description: "Compare your shortlisted pieces side-by-side.",
  robots: { index: false, follow: false },
};

export default async function ComparePage() {
  const products = await fetchProducts({ limit: 200 });
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="eyebrow mb-3">Side-by-side</p>
      <h1 className="font-display text-4xl font-semibold sm:text-6xl">Compare pieces</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Stack up to four pieces and find the one that fits your closet best.
      </p>
      <div className="mt-10">
        <CompareView allProducts={products} />
      </div>
    </div>
  );
}
