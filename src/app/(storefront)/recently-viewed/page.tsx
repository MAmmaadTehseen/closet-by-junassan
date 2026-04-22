import type { Metadata } from "next";
import RecentlyViewedPage from "@/components/product/RecentlyViewedPage";
import { fetchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Recently viewed",
  description: "Everything you've looked at on this device.",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const products = await fetchProducts({ limit: 200 });
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="eyebrow mb-3">On this device</p>
      <h1 className="font-display text-4xl font-semibold sm:text-6xl">
        Recently viewed
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Everything you&apos;ve looked at. Pick up where you left off.
      </p>
      <div className="mt-10">
        <RecentlyViewedPage products={products} />
      </div>
    </div>
  );
}
