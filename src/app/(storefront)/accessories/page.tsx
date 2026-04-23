import type { Metadata } from "next";
import { Suspense } from "react";
import AccessoriesView from "@/components/shop/AccessoriesView";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { fetchProducts } from "@/lib/products";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Accessories",
  description: "Caps, belts, bracelets and more — finishing touches for every look.",
};

const SUB_CATEGORIES = ["caps", "belts", "bracelets"] as const;
const ACCESSORY_SLUGS = new Set<string>(["accessories", ...SUB_CATEGORIES]);

export default async function AccessoriesPage() {
  const all = await fetchProducts({});
  const products = all.filter((p) => ACCESSORY_SLUGS.has(p.category.toLowerCase()));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="mb-12">
        <p className="eyebrow mb-2">Finishing Touches</p>
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
          Accessories
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          The small details that complete the look — caps, belts, bracelets and more,
          curated alongside the brands you love.
        </p>
      </div>

      <Suspense fallback={<ProductGridSkeleton count={9} />}>
        <AccessoriesView products={products} subCategories={[...SUB_CATEGORIES]} />
      </Suspense>
    </div>
  );
}
