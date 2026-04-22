import Hero from "@/components/home/Hero";
import InstagramMosaic from "@/components/home/InstagramMosaic";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductRail from "@/components/home/ProductRail";
import CodBanner from "@/components/home/CodBanner";
import EditorNote from "@/components/home/EditorNote";
import HowCodWorks from "@/components/home/HowCodWorks";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import StoriesBar from "@/components/home/StoriesBar";
import TrustStrip from "@/components/home/TrustStrip";
import { fetchProducts } from "@/lib/products";
import { fetchCategories } from "@/lib/categories";
import { fetchActiveDrops } from "@/lib/drops";
import { fetchCollections, fetchCollectionBySlug } from "@/lib/collections";

export const revalidate = 3600;

export default async function HomePage() {
  const [newArrivals, under2k, trending, limited, all, categories, drops, featuredCollections] =
    await Promise.all([
      fetchProducts({ tag: "new", limit: 8 }),
      fetchProducts({ maxPrice: 2000, limit: 8 }),
      fetchProducts({ tag: "trending", limit: 8 }),
      fetchProducts({ tag: "limited", limit: 8 }),
      fetchProducts({ limit: 200 }),
      fetchCategories(),
      fetchActiveDrops(),
      fetchCollections({ featuredOnly: true }),
    ]);

  const categoryCounts: Record<string, number> = {};
  for (const p of all) {
    categoryCounts[p.category] = (categoryCounts[p.category] ?? 0) + 1;
  }

  const hero = featuredCollections[0];
  const heroDetail = hero ? await fetchCollectionBySlug(hero.slug) : null;

  return (
    <>
      <Hero />
      <TrustStrip />
      <StoriesBar drops={drops} />
      <InstagramMosaic products={newArrivals} />
      <CategoryGrid categories={categories} counts={categoryCounts} />
      <ProductRail
        eyebrow="03 · Best for your rupee"
        title="Under 2000 PKR ⭐"
        products={under2k}
        href="/deals"
      />
      {heroDetail && heroDetail.products.length > 0 && (
        <FeaturedCollection
          collection={heroDetail.collection}
          products={heroDetail.products}
        />
      )}
      {trending.length >= 4 && (
        <BentoPicks
          hero={trending[0]}
          secondary={trending[1]}
          tertiary={[trending[2], trending[3]]}
        />
      )}
      <EditorNote />
      <ProductRail
        eyebrow="04 · Trending Now"
        title="Everyone's reaching for these."
        products={trending}
        href="/shop"
      />
      <ProductRail
        eyebrow="05 · Act fast"
        title="Limited Stock"
        products={limited}
        href="/shop"
      />
      <HowCodWorks />
      <CodBanner />
      <Testimonials />
      <Newsletter />
    </>
  );
}
