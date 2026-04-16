import Hero from "@/components/home/Hero";
import InstagramMosaic from "@/components/home/InstagramMosaic";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductRail from "@/components/home/ProductRail";
import CodBanner from "@/components/home/CodBanner";
import EditorNote from "@/components/home/EditorNote";
import HowCodWorks from "@/components/home/HowCodWorks";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import { fetchProducts } from "@/lib/products";

export const revalidate = 3600;

export default async function HomePage() {
  const [newArrivals, under2k, trending, limited, all] = await Promise.all([
    fetchProducts({ tag: "new", limit: 8 }),
    fetchProducts({ maxPrice: 2000, limit: 8 }),
    fetchProducts({ tag: "trending", limit: 8 }),
    fetchProducts({ tag: "limited", limit: 8 }),
    fetchProducts({ limit: 200 }),
  ]);

  const categoryCounts: Record<string, number> = {};
  for (const p of all) {
    categoryCounts[p.category] = (categoryCounts[p.category] ?? 0) + 1;
  }

  return (
    <>
      <Hero />
      <InstagramMosaic products={newArrivals} />
      <CategoryGrid counts={categoryCounts} />
      <ProductRail
        eyebrow="03 · Best for your rupee"
        title="Under 2000 PKR ⭐"
        products={under2k}
        href="/deals"
      />
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
