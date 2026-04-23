import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { getT } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order. Cash on Delivery available across Pakistan.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const t = await getT();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow mb-3">{t("checkout.eyebrow")}</p>
      <h1 className="mb-10 font-display text-4xl font-semibold sm:text-6xl">{t("checkout.title")}</h1>
      <CheckoutForm />
    </div>
  );
}
