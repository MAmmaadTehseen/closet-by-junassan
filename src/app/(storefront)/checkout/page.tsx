import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order. Cash on Delivery available across Pakistan.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow mb-3">Almost there</p>
      <h1 className="mb-10 font-display text-4xl font-semibold sm:text-6xl">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
