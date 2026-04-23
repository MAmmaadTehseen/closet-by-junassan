import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Package, Truck, MapPin } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/brand-icons";
import ClearCartOnSuccess from "@/components/checkout/ClearCartOnSuccess";
import CopyCode from "@/components/checkout/CopyCode";
import ReferralShare from "@/components/checkout/ReferralShare";
import { siteConfig, waLink } from "@/lib/site-config";
import { getDeliveryWindow } from "@/lib/delivery";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";
import { ensureReferralCode } from "@/lib/referrals";

export const metadata: Metadata = {
  title: "Order Placed",
  description: "Thank you for your order.",
  robots: { index: false, follow: false },
};

type SP = Promise<{ o?: string }>;

const NEXT_STEPS = [
  {
    icon: <Phone className="h-5 w-5" />,
    title: "We call to confirm",
    desc: "Our team calls within 24 hours to verify your order and address.",
  },
  {
    icon: <Package className="h-5 w-5" />,
    title: "We pack your order",
    desc: "Every piece is inspected and carefully packed before dispatch.",
  },
  {
    icon: <Truck className="h-5 w-5" />,
    title: "We deliver to you",
    desc: `Est. delivery ${getDeliveryWindow()}. Pay in cash when it arrives.`,
  },
];

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: SP }) {
  const { o } = await searchParams;
  const code = o && /^CBJ-[A-Z0-9]+$/.test(o) ? o : null;

  // Look up or create the referral code for this buyer.
  let referralCode: string | null = null;
  if (code && hasAdminEnv()) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("orders")
        .select("phone")
        .eq("public_code", code)
        .maybeSingle();
      if (data?.phone) referralCode = await ensureReferralCode(data.phone as string);
    } catch {}
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
      <ClearCartOnSuccess />

      {/* Animated checkmark */}
      <div className="flex justify-center">
        <svg viewBox="0 0 80 80" fill="none" className="h-20 w-20" aria-hidden="true">
          <circle cx="40" cy="40" r="38" stroke="#0a0a0a" strokeWidth="2" opacity="0.12" />
          <circle
            cx="40"
            cy="40"
            r="38"
            stroke="#0a0a0a"
            strokeWidth="2"
            strokeDasharray="239"
            className="animate-check-draw"
            style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
          />
          <polyline
            points="24,40 35,52 56,28"
            stroke="#0a0a0a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-check-draw"
          />
        </svg>
      </div>

      {/* Headline */}
      <div className="mt-6 text-center">
        <p className="eyebrow">Order confirmed</p>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
          Your order is on its way.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thank you for shopping with {siteConfig.shortName}. We&apos;ll take it from here.
        </p>
      </div>

      {/* Order code — copyable */}
      {code && (
        <div className="mt-6 flex flex-col items-center gap-1.5">
          <CopyCode code={code} />
          <p className="text-[11px] text-muted-foreground">Tap to copy your order code</p>
        </div>
      )}

      {/* What happens next */}
      <div className="mt-10">
        <p className="eyebrow mb-5 text-center">What happens next</p>
        <ol className="space-y-3">
          {NEXT_STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-4 rounded-2xl border border-border bg-paper p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                {step.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{step.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* CTAs */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {code && (
          <Link
            href={`/track?code=${code}`}
            className="inline-flex items-center gap-2 rounded-full border border-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-paper"
          >
            <MapPin className="h-3.5 w-3.5" /> Track order
          </Link>
        )}
        <a
          href={waLink(`Hi! I just placed order ${code ?? ""}. I have a question.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:border-ink"
        >
          <WhatsAppIcon mono className="h-3.5 w-3.5" /> WhatsApp us
        </a>
        <Link
          href="/collections/all"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90"
        >
          Continue shopping
        </Link>
      </div>

      {referralCode && (
        <ReferralShare code={referralCode} shareUrl={`${siteConfig.url}/?ref=${referralCode}`} />
      )}

      <a
        href={siteConfig.socials.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-ink"
      >
        <InstagramIcon className="h-3.5 w-3.5" /> Tag us @closetbyjunassan
      </a>
    </div>
  );
}
