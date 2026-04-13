import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductRail from "@/components/home/ProductRail";
import CodBanner from "@/components/home/CodBanner";
import { fetchProducts } from "@/lib/products";

export default async function HomePage() {
  const [newArrivals, under2k, trending, limited] = await Promise.all([
    fetchProducts({ tag: "new", limit: 8 }),
    fetchProducts({ maxPrice: 2000, limit: 8 }),
    fetchProducts({ tag: "trending", limit: 8 }),
    fetchProducts({ tag: "limited", limit: 8 }),
  ]);

  return (
    <>
      <Hero />
      <ProductRail title="New Arrivals 🔥" products={newArrivals} href="/shop?sort=newest" />
      <CategoryGrid />
      <ProductRail title="Under 2000 PKR ⭐" products={under2k} href="/deals" />
      <ProductRail title="Trending Now" products={trending} href="/shop" />
      <ProductRail title="Limited Stock" products={limited} href="/shop" />
      <CodBanner />
    </>
  );
}
