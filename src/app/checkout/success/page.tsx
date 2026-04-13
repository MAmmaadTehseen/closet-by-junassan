import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Placed",
  description: "Thank you for your order.",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
      <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">
        Your order has been placed successfully
      </h1>
      <p className="mt-4 text-muted-foreground">
        Our team will contact you shortly to confirm your order.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
