import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/product/ProductGrid";
import SortSelect from "@/components/shop/SortSelect";
import { fetchProducts } from "@/lib/products";
import { CATEGORIES, type Category } from "@/lib/types";

type Params = Promise<{ slug: string }>;
type SP = Promise<{ sort?: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  return {
    title: cat ? `${cat.label}` : "Category",
    description: cat ? `Shop ${cat.label.toLowerCase()} thrift finds.` : undefined,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SP;
}) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();

  const sp = await searchParams;
  const products = await fetchProducts({
    category: slug as Category,
    sort: (sp.sort as "newest" | "price-asc" | "price-desc") || "newest",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            {cat.label}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
        <SortSelect />
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
