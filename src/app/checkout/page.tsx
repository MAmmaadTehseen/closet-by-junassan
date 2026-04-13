import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order. Cash on Delivery available across Pakistan.",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-semibold sm:text-4xl">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
