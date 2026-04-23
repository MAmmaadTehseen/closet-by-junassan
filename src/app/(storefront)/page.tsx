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
import FeaturedCollection from "@/components/home/FeaturedCollection";
import BentoPicks from "@/components/home/BentoPicks";
import StatsStrip from "@/components/home/StatsStrip";
import BrandWall from "@/components/home/BrandWall";
import ShopByMood from "@/components/home/ShopByMood";
import TrustStrip from "@/components/home/TrustStrip";
import Lookbook from "@/components/home/Lookbook";
import TimelineStory from "@/components/home/TimelineStory";
import ValueProps from "@/components/home/ValueProps";
import SustainabilityBanner from "@/components/home/SustainabilityBanner";
import SaleCountdown from "@/components/home/SaleCountdown";
import PressStrip from "@/components/home/PressStrip";
import FAQAccordion from "@/components/home/FAQAccordion";
import SectionDivider from "@/components/ui/SectionDivider";
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

  const lookbookProducts = (trending.length >= 4 ? trending : newArrivals).slice(0, 4);

  return (
    <>
      <Hero />
      <TrustStrip />
      <StoriesBar drops={drops} />
      <InstagramMosaic products={newArrivals} />
      <StatsStrip />
      <CategoryGrid categories={categories} counts={categoryCounts} />
      <SaleCountdown />
      <ProductRail
        eyebrow="03 · Best for your rupee"
        title="Under 2000 PKR ⭐"
        products={under2k}
        href="/deals"
      />
      <ShopByMood />
      <SectionDivider variant="wave" />
      {heroDetail && heroDetail.products.length > 0 && (
        <FeaturedCollection
          collection={heroDetail.collection}
          products={heroDetail.products}
        />
      )}
      {lookbookProducts.length >= 3 && <Lookbook products={lookbookProducts} />}
      {trending.length >= 4 && (
        <BentoPicks
          hero={trending[0]}
          secondary={trending[1]}
          tertiary={[trending[2], trending[3]]}
        />
      )}
      <BrandWall />
      <EditorNote />
      <ProductRail
        eyebrow="04 · Trending Now"
        title="Everyone's reaching for these."
        products={trending}
        href="/shop"
      />
      <TimelineStory />
      <ProductRail
        eyebrow="05 · Act fast"
        title="Limited Stock"
        products={limited}
        href="/shop"
      />
      <ValueProps />
      <HowCodWorks />
      <SustainabilityBanner />
      <CodBanner />
      <Testimonials />
      <PressStrip />
      <FAQAccordion />
      <Newsletter />
    </>
  );
}
