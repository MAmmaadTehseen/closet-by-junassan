import type { Metadata } from "next";
import CompareView from "@/components/product/CompareView";
import { fetchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Compare",
  description: "Compare pieces side-by-side — price, size, condition, fabric, and more.",
};

export default async function ComparePage() {
  const products = await fetchProducts({ limit: 400 });
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="eyebrow mb-2">Side by side</p>
      <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
        Compare your picks.
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Up to 4 items at once — price, size, condition, fabric, and more. Your compare list stays with you across visits.
      </p>
      <div className="mt-10">
        <CompareView products={products} />
      </div>
    </section>
  );
}
