import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import ClearCartOnSuccess from "@/components/checkout/ClearCartOnSuccess";
import { siteConfig, waLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Order Placed",
  description: "Thank you for your order.",
  robots: { index: false, follow: false },
};

type SP = Promise<{ o?: string }>;

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: SP }) {
  const { o } = await searchParams;
  const code = o && /^CBJ-[A-Z0-9]+$/.test(o) ? o : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <ClearCartOnSuccess />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-ink bg-paper">
        <CheckCircle2 className="h-8 w-8 text-ink" />
      </div>
      <p className="mt-8 eyebrow">Order confirmed</p>
      <h1 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-5xl">
        Your order is on its way.
      </h1>
      {code && (
        <p className="mt-6 inline-block rounded-full border border-border bg-cream/60 px-5 py-2 text-sm font-semibold tracking-widest">
          {code}
        </p>
      )}
      <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
        Our team will call you within 24 hours to confirm your order and address. Expect
        delivery in {siteConfig.shipping.deliveryDays}. Pay in cash when your order arrives.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={waLink(`Hi! I just placed order ${code ?? ""}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-paper"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Message us on WhatsApp
        </a>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90"
        >
          Continue Shopping
        </Link>
      </div>

      <a
        href={siteConfig.socials.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-ink"
      >
        <InstagramIcon className="h-3.5 w-3.5" /> Share your new find — tag @closetbyjunassan
      </a>
    </div>
  );
}
