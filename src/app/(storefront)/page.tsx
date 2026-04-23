import VideoHero from "@/components/home/VideoHero";
import ProductCarousel from "@/components/home/ProductCarousel";
import ShopByBrand from "@/components/home/ShopByBrand";
import HowCodWorks from "@/components/home/HowCodWorks";
import CodBanner from "@/components/home/CodBanner";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import { fetchProducts } from "@/lib/products";

export const revalidate = 3600;

export default async function HomePage() {
  const [newArrivals, edit] = await Promise.all([
    fetchProducts({ tag: "new", limit: 12 }),
    fetchProducts({ tag: "trending", limit: 12 }),
  ]);

  return (
    <>
      <VideoHero />
      <ProductCarousel
        eyebrow="New Arrivals"
        title="Fresh off the rail."
        products={newArrivals}
        href="/collections/all?sort=newest"
      />
      <ProductCarousel
        eyebrow="The Edit"
        title="Picks of the season."
        products={edit}
        href="/collections/all"
      />
      <ShopByBrand />
      <HowCodWorks />
      <CodBanner />
      <Testimonials />
      <Newsletter />
    </>
  );
}
