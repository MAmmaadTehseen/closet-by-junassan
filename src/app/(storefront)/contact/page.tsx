import type { Metadata } from "next";
import { Mail, Phone, Music2 } from "lucide-react";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "@/components/ui/brand-icons";
import Accordion from "@/components/ui/Accordion";
import { siteConfig, waLink, telLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`,
};

const FAQ = [
  {
    id: "cod",
    title: "How does Cash on Delivery work?",
    content:
      "We only accept Cash on Delivery. You pay the courier in cash when your order arrives. No advance payment is required. Our team calls to confirm every order before dispatch.",
  },
  {
    id: "delivery",
    title: "How long does delivery take?",
    content: `Flat delivery all over Pakistan — ${siteConfig.shipping.deliveryDays} after we confirm your order.`,
  },
  {
    id: "returns",
    title: "What is your returns policy?",
    content:
      "If the item doesn't match the listing, you can return it within 3 days for a full refund. Contact us on WhatsApp as soon as possible with your order number.",
  },
  {
    id: "sizing",
    title: "How do I pick the right size?",
    content:
      "Every product page has measurements in inches. We recommend measuring a piece you already own and matching it. If you're unsure, message us on WhatsApp before ordering.",
  },
  {
    id: "authenticity",
    title: "Are the items authentic?",
    content:
      "Yes — every piece is inspected and graded by our team. We only list branded pieces that are genuine and in good condition.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24">
        <p className="eyebrow mb-4">Say hi</p>
        <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] sm:text-7xl">
          Questions? Custom requests? We&apos;re one message away.
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ContactCard
            href={waLink()}
            icon={<WhatsAppIcon className="h-6 w-6" />}
            title="WhatsApp"
            copy="Chat with us instantly"
            external
          />
          <ContactCard
            href={`mailto:${siteConfig.contact.email}`}
            icon={<Mail className="h-5 w-5" />}
            title="Email"
            copy={siteConfig.contact.email}
          />
          <ContactCard
            href={telLink()}
            icon={<Phone className="h-5 w-5" />}
            title="Call"
            copy="Talk to our team"
          />
          <ContactCard
            href={siteConfig.socials.instagram}
            icon={<InstagramIcon className="h-5 w-5" />}
            title="Instagram"
            copy="@closetbyjunassan"
            external
          />
        </div>

        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <ContactCard
            href={siteConfig.socials.facebook}
            icon={<FacebookIcon className="h-5 w-5" />}
            title="Facebook"
            copy="Follow our drops"
            external
          />
          <ContactCard
            href={siteConfig.socials.tiktok}
            icon={<Music2 className="h-5 w-5" />}
            title="TikTok"
            copy="@closetbyjunassan"
            external
          />
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <p className="eyebrow mb-3">FAQ</p>
        <h2 className="font-display text-3xl font-semibold sm:text-5xl">
          Everything you need to know.
        </h2>
        <div className="mt-10">
          <Accordion items={FAQ} defaultOpen="cod" />
        </div>
      </section>
    </>
  );
}

function ContactCard({
  href,
  icon,
  title,
  copy,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  copy: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-start gap-4 rounded-2xl border border-border bg-paper p-6 transition hover:-translate-y-0.5 hover:border-ink"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-cream transition group-hover:bg-ink group-hover:text-paper">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{copy}</p>
      </div>
    </a>
  );
}
