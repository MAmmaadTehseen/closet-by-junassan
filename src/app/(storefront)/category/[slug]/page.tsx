import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductGrid from "@/components/product/ProductGrid";
import SortSelect from "@/components/shop/SortSelect";
import Breadcrumbs from "@/components/product/Breadcrumbs";
import { fetchProducts } from "@/lib/products";
import { CATEGORIES, type Category } from "@/lib/types";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 3600;

const CATEGORY_IMAGES: Record<string, string> = {
  men: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1600&q=80",
  women: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1600&q=80",
  kids: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=1600&q=80",
  shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
  bags: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1600&q=80",
};

const CATEGORY_COPY: Record<string, string> = {
  men: "Jackets, tees, polos and more — curated men's thrift.",
  women: "Dresses, blouses, denim and layering essentials.",
  kids: "Soft, durable pieces for little adventurers.",
  shoes: "Sneakers, loafers and sandals — inspected and ready.",
  bags: "Totes, crossbodies and clutches for every occasion.",
};

type Params = Promise<{ slug: string }>;
type SP = Promise<{ sort?: string }>;

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  return {
    title: cat ? cat.label : "Category",
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
    <>
      <section className="relative h-[46vh] min-h-[360px] overflow-hidden border-b border-border bg-cream">
        <Image
          src={CATEGORY_IMAGES[slug]}
          alt={cat.label}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: cat.label },
            ]}
          />
          <p className="eyebrow mt-4 text-paper/70">Category</p>
          <h1 className="mt-2 font-display text-5xl font-semibold leading-[1.05] text-paper sm:text-7xl">
            {cat.label}
          </h1>
          <p className="mt-3 max-w-md text-sm text-paper/80">{CATEGORY_COPY[slug]}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
          <SortSelect />
        </div>
        <ProductGrid products={products} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
              { "@type": "ListItem", position: 2, name: "Shop", item: `${siteConfig.url}/shop` },
              { "@type": "ListItem", position: 3, name: cat.label, item: `${siteConfig.url}/category/${slug}` },
            ],
          }),
        }}
      />
    </>
  );
}
