import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Gallery from "@/components/product/Gallery";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import ProductGrid from "@/components/product/ProductGrid";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import Breadcrumbs from "@/components/product/Breadcrumbs";
import Reviews from "@/components/product/Reviews";
import { fetchProductBySlug, fetchRelated, fetchProducts } from "@/lib/products";
import { fetchApprovedReviews } from "@/lib/reviews";
import { siteConfig } from "@/lib/site-config";
import { CATEGORIES } from "@/lib/types";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const [related, allProducts, reviews] = await Promise.all([
    fetchRelated(product),
    fetchProducts({ limit: 60 }),
    fetchApprovedReviews(product.id),
  ]);

  const category = CATEGORIES.find((c) => c.slug === product.category);

  const reviewAgg =
    reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (reviews.reduce((n, r) => n + r.rating, 0) / reviews.length).toFixed(1),
            reviewCount: reviews.length,
          },
          review: reviews.slice(0, 10).map((r) => ({
            "@type": "Review",
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
            author: { "@type": "Person", name: r.author_name },
            datePublished: r.created_at,
            reviewBody: r.body,
          })),
        }
      : {};

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: product.brand },
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.price_pkr,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${siteConfig.url}/product/${product.slug}`,
    },
    ...reviewAgg,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
      category
        ? { "@type": "ListItem", position: 2, name: category.label, item: `${siteConfig.url}/category/${category.slug}` }
        : { "@type": "ListItem", position: 2, name: "Shop", item: `${siteConfig.url}/shop` },
      { "@type": "ListItem", position: 3, name: product.name },
    ],
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            category ? { label: category.label, href: `/category/${category.slug}` } : { label: "Shop", href: "/shop" },
            { label: product.name },
          ]}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Gallery
              images={product.images}
              alt={product.name}
              transitionName={`product-${product.id}`}
            />
          </div>
          <ProductDetailClient product={product} allProducts={allProducts} />
        </div>
      </div>

      {reviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
          <Reviews reviews={reviews} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
          <div className="mb-8">
            <p className="eyebrow mb-2">You may also like</p>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">More from {category?.label ?? "Shop"}</h2>
          </div>
          <ProductGrid products={related} />
        </section>
      )}

      <RecentlyViewed allProducts={allProducts} excludeSlug={product.slug} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
