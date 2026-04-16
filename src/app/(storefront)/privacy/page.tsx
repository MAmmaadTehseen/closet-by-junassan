import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Closet by Junassan collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: April 2026</p>

      <div className="prose-sm mt-12 space-y-10 text-sm leading-relaxed text-ink/90">

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">1. Who we are</h2>
          <p>
            Closet by Junassan is a curated thrift fashion store based in Pakistan. We sell
            pre-owned branded clothing, shoes, and accessories exclusively through cash-on-delivery.
            This policy explains what personal data we collect when you place an order or browse
            our site, and how we use it.
          </p>
          <p>
            Questions? Reach us at{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="underline hover:text-ink">
              {siteConfig.contact.email}
            </a>{" "}
            or on{" "}
            <a
              href={`https://wa.me/${siteConfig.contact.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-ink"
            >
              WhatsApp
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">2. What we collect</h2>
          <p>When you place an order we collect:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Full name</li>
            <li>Mobile phone number</li>
            <li>City and delivery address</li>
            <li>Order notes (optional, if you provide them)</li>
            <li>IP address and user-agent (for fraud prevention only)</li>
          </ul>
          <p>
            We do <strong>not</strong> collect payment card details — all orders are paid in
            cash on delivery.
          </p>
          <p>
            If you subscribe to drop alerts via WhatsApp, we store only your phone number
            for that purpose.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">3. How we use your data</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>To process and fulfil your order (call to confirm, pack, dispatch, deliver)</li>
            <li>To contact you about your order status via phone or WhatsApp</li>
            <li>To detect and prevent fraudulent orders</li>
            <li>To send product drop alerts if you opted in</li>
          </ul>
          <p>We do not use your data for advertising, profiling, or automated decision-making.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">4. Where data is stored</h2>
          <p>
            Order data is stored in Supabase, a cloud database service. Data is hosted in
            secure, encrypted infrastructure. We do not sell, rent, or share your personal
            information with any third party for marketing purposes.
          </p>
          <p>
            Our delivery partners receive only your name, city, and address — the minimum
            needed to complete delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">5. How long we keep it</h2>
          <p>
            Order records are kept for up to 2 years for business accounting purposes. Drop
            alert subscriptions are kept until you request removal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">6. Your rights</h2>
          <p>You can request at any time:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>A copy of the personal data we hold about you</li>
            <li>Correction of inaccurate information</li>
            <li>Deletion of your data (subject to legal retention requirements)</li>
            <li>Unsubscription from drop alerts</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="underline hover:text-ink">
              {siteConfig.contact.email}
            </a>
            . We will respond within 7 days.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">7. Cookies</h2>
          <p>
            We use only functional cookies and browser storage (localStorage) to persist
            your shopping cart and wishlist between sessions. No third-party tracking or
            advertising cookies are set.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">8. Changes to this policy</h2>
          <p>
            We may update this policy occasionally. The &ldquo;last updated&rdquo; date at the top of
            the page will reflect any changes. Continued use of the site after changes
            constitutes acceptance.
          </p>
        </section>

      </div>

      <div className="mt-14 flex gap-4 text-xs text-muted-foreground">
        <Link href="/terms" className="underline hover:text-ink">Terms of Service</Link>
        <Link href="/contact" className="underline hover:text-ink">Contact us</Link>
      </div>
    </div>
  );
}
