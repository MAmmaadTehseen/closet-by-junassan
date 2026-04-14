import type { Metadata } from "next";
import ProductGrid from "@/components/product/ProductGrid";
import { fetchProducts } from "@/lib/products";
import { Sparkles } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Deals Under 2000 PKR",
  description: "Branded thrift finds at unbeatable prices — all under Rs 2000.",
};

export default async function DealsPage() {
  const products = await fetchProducts({ maxPrice: 2000 });
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-cream/60">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <p className="eyebrow mb-3 inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" /> Best for your rupee
          </p>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] sm:text-7xl">
            Under <span className="italic">2000</span> PKR.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground">
            Hand-picked branded thrift finds at prices that don&apos;t hurt. Cash on Delivery
            available all over Pakistan.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <p className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">
          {products.length} pieces under Rs 2000
        </p>
        <ProductGrid products={products} />
      </div>
    </>
  );
}
