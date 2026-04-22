import Accordion from "@/components/ui/Accordion";
import Reveal from "@/components/ui/Reveal";
import { siteConfig, waLink } from "@/lib/site-config";

export const FAQ_ITEMS = [
  {
    id: "authenticity",
    title: "Are the pieces authentic?",
    short:
      "Every piece is hand-picked and inspected. We only list pieces we can personally vouch for and grade condition on a 10-point scale.",
  },
  {
    id: "payment",
    title: "How do I pay?",
    short:
      "Cash on Delivery — pay in cash when the courier hands you the package. No advance payment, no online cards required.",
  },
  {
    id: "shipping",
    title: "How long does delivery take?",
    short: `Flat delivery across Pakistan. Most orders arrive in ${siteConfig.shipping.deliveryDays}. We dispatch daily before 5 PM.`,
  },
  {
    id: "sizing",
    title: "What if it doesn't fit?",
    short:
      "Every listing has detailed measurements. Still not right? We offer 3-day easy returns — message us on WhatsApp within 72 hours.",
  },
  {
    id: "drops",
    title: "When do you restock?",
    short:
      "New curations drop every week. Subscribe to our WhatsApp list above and you'll be the first to see them.",
  },
  {
    id: "care",
    title: "How are pieces cleaned?",
    short:
      "Every item is professionally dry-cleaned or hand-washed and steamed before it ships. Some pieces carry gentle marks of love — we always flag this in the listing.",
  },
];

export default function Faq() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({
      "@type": "Question",
      name: f.title,
      acceptedAnswer: { "@type": "Answer", text: f.short },
    })),
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mb-10 text-center">
          <p className="eyebrow mb-2">Good to know</p>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Questions we hear every day.
          </h2>
        </div>
      </Reveal>

      <Accordion
        defaultOpen="authenticity"
        items={FAQ_ITEMS.map((f) => ({
          id: f.id,
          title: f.title,
          content: <p>{f.short}</p>,
        }))}
      />

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Still stuck?{" "}
        <a
          className="font-semibold text-ink underline underline-offset-4"
          href={waLink("Hi! I have a question.")}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ping us on WhatsApp
        </a>{" "}
        — we usually reply in minutes.
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </section>
  );
}
