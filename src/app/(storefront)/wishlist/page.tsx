import type { Metadata } from "next";
import WishlistView from "@/components/product/WishlistView";
import { fetchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved pieces.",
  robots: { index: false, follow: false },
};

export default async function WishlistPage() {
  const products = await fetchProducts({ limit: 60 });
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="eyebrow mb-3">Your closet</p>
      <h1 className="font-display text-4xl font-semibold sm:text-6xl">Wishlist</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Pieces you&apos;ve saved. Limited stock — move fast.
      </p>
      <div className="mt-10">
        <WishlistView allProducts={products} />
      </div>
    </div>
  );
}
