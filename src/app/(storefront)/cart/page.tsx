import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your items before checkout.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow mb-3">Your bag</p>
      <h1 className="mb-10 font-display text-4xl font-semibold sm:text-6xl">Your Cart</h1>
      <CartView />
    </div>
  );
}
