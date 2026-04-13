import type { Metadata } from "next";
import ProductGrid from "@/components/product/ProductGrid";
import { fetchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Deals Under 2000 PKR",
  description: "Steals under Rs 2000. Branded thrift finds at unbeatable prices.",
};

export default async function DealsPage() {
  const products = await fetchProducts({ maxPrice: 2000 });
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Under 2000 PKR ⭐
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Branded thrift finds at unbeatable prices.
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
