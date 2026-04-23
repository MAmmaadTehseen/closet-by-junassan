import type { Metadata } from "next";
import DeliveryEstimator from "@/components/delivery/DeliveryEstimator";

export const metadata: Metadata = {
  title: "Delivery Estimator",
  description: "Find out exactly when your order lands at your door. COD all over Pakistan.",
};

export default function DeliveryPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="eyebrow mb-2">Shipping</p>
      <h1 className="font-display text-5xl font-semibold leading-[1.05] sm:text-7xl">
        When will it arrive?
      </h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        Pick your city — we&apos;ll show the expected delivery window, the courier&apos;s journey, and the fee.
      </p>
      <div className="mt-12">
        <DeliveryEstimator />
      </div>
    </section>
  );
}
