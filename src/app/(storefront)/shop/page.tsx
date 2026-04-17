import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Filters from "@/components/shop/Filters";
import SortSelect from "@/components/shop/SortSelect";
import MobileFiltersDrawer from "@/components/shop/MobileFiltersDrawer";
import FilterPills from "@/components/shop/FilterPills";
import ProductGrid from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { fetchProducts } from "@/lib/products";
import { fetchCategories } from "@/lib/categories";

export const revalidate = 3600;

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
  q?: string;
}>;

async function ShopResults({ sp }: { sp: Awaited<SP> }) {
  const products = await fetchProducts({
    category: sp.category || undefined,
    size: sp.size,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    sort: (sp.sort as "newest" | "price-asc" | "price-desc") || "newest",
    q: sp.q,
  });

  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-display text-2xl font-semibold">No results found</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Try adjusting your filters or searching for something different.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90"
        >
          Clear all filters
        </Link>
      </div>
    );
  }

  return <ProductGrid products={products} />;
}

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;

  const [allForCount, categories] = await Promise.all([
    fetchProducts({
      category: sp.category || undefined,
      size: sp.size,
      minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
      maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
      sort: "newest",
      q: sp.q,
    }),
    fetchCategories(),
  ]);
  const count = allForCount.length;
  const isFiltered = !!(sp.category || sp.size || sp.minPrice || sp.maxPrice || sp.q);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10">
        <p className="eyebrow mb-2">Everything in one place</p>
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
          Shop All
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {isFiltered
            ? `${count} ${count === 1 ? "result" : "results"} matching your filters`
            : `${count} ${count === 1 ? "piece" : "pieces"} currently available`}
          .
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-border bg-paper p-3 sm:rounded-full sm:px-5">
        <MobileFiltersDrawer resultCount={count} categories={categories} />
        <p className="hidden text-xs uppercase tracking-widest text-muted-foreground lg:inline">
          {count} {count === 1 ? "result" : "results"}
        </p>
        <SortSelect />
      </div>

      {/* Active filter pills (client component, reads URL params) */}
      <Suspense fallback={null}>
        <FilterPills />
      </Suspense>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block">
          <Filters categories={categories} />
        </div>
        <Suspense fallback={<ProductGridSkeleton count={12} />}>
          <ShopResults sp={sp} />
        </Suspense>
      </div>
    </div>
  );
}
