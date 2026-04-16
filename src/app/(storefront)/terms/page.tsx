import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for shopping at Closet by Junassan.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">Terms of Service</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: April 2026</p>

      <div className="mt-12 space-y-10 text-sm leading-relaxed text-ink/90">

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">1. About these terms</h2>
          <p>
            By placing an order or using the Closet by Junassan website, you agree to these
            terms. Please read them carefully. If you have questions, contact us at{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="underline hover:text-ink">
              {siteConfig.contact.email}
            </a>{" "}
            before purchasing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">2. Products</h2>
          <p>
            All products sold by Closet by Junassan are <strong>pre-owned (thrift)</strong> items.
            Each piece is hand-picked, inspected, and graded for condition before listing.
          </p>
          <p>
            Product descriptions, images, and condition grades are provided in good faith.
            Minor wear consistent with pre-owned status (small fading, soft creases) does not
            constitute a defect unless explicitly misrepresented.
          </p>
          <p>
            We do not sell counterfeit goods. Authenticity of branded items is verified by our
            team; however, we are not an authorised dealer for any brand.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">3. Ordering and confirmation</h2>
          <p>
            Placing an order online is an offer to purchase — it is not a confirmed order
            until our team contacts you by phone to verify details.
          </p>
          <p>
            We reserve the right to cancel any order before dispatch (e.g., if the item is
            found to be damaged during final inspection, or if we cannot reach you to confirm).
            In such cases you will be notified via WhatsApp or phone.
          </p>
          <p>
            Orders are processed Monday – Saturday. Orders placed on Sunday or public holidays
            will be processed the next working day.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">4. Payment</h2>
          <p>
            We operate on a <strong>Cash on Delivery (COD)</strong> basis only. No advance
            payment is required. Payment is collected by the courier at the time of delivery.
          </p>
          <p>
            Please have the exact amount ready. Our couriers may not carry change for very
            large denominations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">5. Delivery</h2>
          <p>
            We deliver across Pakistan via third-party courier services. Standard delivery
            takes <strong>{siteConfig.shipping.deliveryDays}</strong> from order confirmation.
            Delivery to remote areas may take longer.
          </p>
          <p>
            Delivery charges (if any) are communicated at the time of order confirmation.
            We are not responsible for delays caused by the courier, weather, or events
            outside our control.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">6. Returns and exchanges</h2>
          <p>
            You may return an item within <strong>3 days of delivery</strong> if:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>The item significantly differs from its description or photographs</li>
            <li>The item was delivered in a damaged condition not disclosed at listing</li>
          </ul>
          <p>
            Returns are <strong>not accepted</strong> for change of mind, incorrect size
            selection, or minor wear consistent with pre-owned condition.
          </p>
          <p>
            To initiate a return, contact us via WhatsApp within 3 days of receiving your order.
            The item must be in the same condition as received, with original packaging if any.
            Return shipping costs are the customer&apos;s responsibility unless the item was
            misrepresented.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">7. Pricing</h2>
          <p>
            All prices are listed in Pakistani Rupees (PKR). We reserve the right to change
            prices at any time without notice. The price at the time of your order confirmation
            call is the final price.
          </p>
          <p>
            Discount codes are applied at the time of checkout and cannot be applied retroactively.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">8. Intellectual property</h2>
          <p>
            All content on this website — including product photography, copy, and brand
            assets — belongs to Closet by Junassan. You may not reproduce, redistribute, or
            use our content without written permission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">9. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by Pakistani law, Closet by Junassan shall not
            be liable for indirect, incidental, or consequential damages arising from your use
            of the site or products purchased. Our total liability for any claim is limited to
            the price you paid for the relevant item.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-ink">10. Governing law</h2>
          <p>
            These terms are governed by the laws of Pakistan. Any disputes shall be subject
            to the exclusive jurisdiction of the courts of Pakistan.
          </p>
        </section>

      </div>

      <div className="mt-14 flex gap-4 text-xs text-muted-foreground">
        <Link href="/privacy" className="underline hover:text-ink">Privacy Policy</Link>
        <Link href="/contact" className="underline hover:text-ink">Contact us</Link>
      </div>
    </div>
  );
}
