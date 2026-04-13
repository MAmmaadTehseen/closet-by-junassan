import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your items before checkout.",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-semibold sm:text-4xl">Your Cart</h1>
      <CartView />
    </div>
  );
}
