import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";
import { fetchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your items before checkout.",
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

export default async function CartPage() {
  const products = await fetchProducts({ limit: 200 });
  const originals: Record<string, number> = {};
  for (const p of products) {
    if (p.original_price_pkr) originals[p.id] = p.original_price_pkr;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow mb-3">Your bag</p>
      <h1 className="mb-10 font-display text-4xl font-semibold sm:text-6xl">Your Cart</h1>
      <CartView originals={originals} />
    </div>
  );
}
