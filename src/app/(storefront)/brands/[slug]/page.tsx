import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";
import { fetchProducts } from "@/lib/products";
import { brandSlug, summariseBrands } from "@/lib/brands";

export const revalidate = 3600;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const products = await fetchProducts({ limit: 500 });
  return summariseBrands(products).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const products = await fetchProducts({ limit: 500 });
  const match = products.find((p) => brandSlug(p.brand) === slug);
  if (!match) return { title: "Brand not found" };
  return {
    title: `${match.brand} — Thrift & Pre-loved`,
    description: `Shop authenticated ${match.brand} pieces — hand-picked, condition-graded, COD across Pakistan.`,
  };
}

export default async function BrandPage({ params }: { params: Params }) {
  const { slug } = await params;
  const products = await fetchProducts({ limit: 500 });
  const filtered = products.filter((p) => brandSlug(p.brand) === slug);
  if (filtered.length === 0) notFound();
  const brand = filtered[0].brand;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6">
      <Link
        href="/brands"
        className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-ink"
      >
        ← All brands
      </Link>
      <div className="my-8">
        <p className="eyebrow mb-2">Brand</p>
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">{brand}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"} available right now.
        </p>
      </div>
      <ProductGrid products={filtered} />
    </div>
  );
}
