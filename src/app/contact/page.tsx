import type { Metadata } from "next";
import { MessageCircle, Mail } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/ui/brand-icons";
import { siteConfig, waLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Contact Us</h1>
      <p className="mt-3 text-muted-foreground">
        Questions, custom requests, or order updates — reach out anytime.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-border p-5 transition hover:border-foreground"
        >
          <MessageCircle className="h-5 w-5" />
          <div>
            <p className="text-sm font-semibold">WhatsApp</p>
            <p className="text-xs text-muted-foreground">Chat with us instantly</p>
          </div>
        </a>
        <a
          href={`mailto:${siteConfig.contact.email}`}
          className="flex items-center gap-3 rounded-xl border border-border p-5 transition hover:border-foreground"
        >
          <Mail className="h-5 w-5" />
          <div>
            <p className="text-sm font-semibold">Email</p>
            <p className="text-xs text-muted-foreground">{siteConfig.contact.email}</p>
          </div>
        </a>
        <a
          href={siteConfig.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-border p-5 transition hover:border-foreground"
        >
          <InstagramIcon className="h-5 w-5" />
          <div>
            <p className="text-sm font-semibold">Instagram</p>
            <p className="text-xs text-muted-foreground">@closetbyjunassan</p>
          </div>
        </a>
        <a
          href={siteConfig.socials.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-border p-5 transition hover:border-foreground"
        >
          <FacebookIcon className="h-5 w-5" />
          <div>
            <p className="text-sm font-semibold">Facebook</p>
            <p className="text-xs text-muted-foreground">Follow our drops</p>
          </div>
        </a>
      </div>

      <form className="mt-12 space-y-5 rounded-xl border border-border bg-muted/40 p-6">
        <h2 className="font-display text-2xl font-semibold">Send a message</h2>
        <input
          name="name"
          placeholder="Your name"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Your email"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
          required
        />
        <textarea
          name="message"
          rows={4}
          placeholder="How can we help?"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
          required
        />
        <button
          type="submit"
          className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
