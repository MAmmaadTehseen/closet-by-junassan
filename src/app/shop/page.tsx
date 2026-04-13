import type { Metadata } from "next";
import Filters from "@/components/shop/Filters";
import SortSelect from "@/components/shop/SortSelect";
import ProductGrid from "@/components/product/ProductGrid";
import { fetchProducts } from "@/lib/products";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse all thrift finds — clothing, shoes, and bags at affordable prices.",
};

type SP = Promise<{
  category?: string;
  size?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}>;

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const products = await fetchProducts({
    category: (sp.category as Category) || undefined,
    size: sp.size,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    sort: (sp.sort as "newest" | "price-asc" | "price-desc") || "newest",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Shop All</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
        <SortSelect />
      </div>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <Filters />
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
