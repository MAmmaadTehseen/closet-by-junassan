import Link from "next/link";
import { siteConfig, waLink } from "@/lib/site-config";
import { InstagramIcon, FacebookIcon } from "@/components/ui/brand-icons";
import { MessageCircle } from "lucide-react";
import type { CategoryDef } from "@/lib/categories";

export default function Footer({ categories = [] }: { categories?: CategoryDef[] }) {
  return (
    <footer className="mt-20 border-t border-border bg-cream/50">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <h3 className="font-display text-2xl font-semibold">{siteConfig.name}</h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Curated thrift fashion from the brands you love — hand-picked, inspected,
              and priced for Pakistan.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-wide text-paper transition hover:opacity-90"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Us
              </a>
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border p-2 hover:bg-paper"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border p-2 hover:bg-paper"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow">Shop</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link className="text-ink/80 hover:text-ink" href={`/category/${c.slug}`}>
                    {c.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="text-ink/80 hover:text-ink" href="/deals">
                  Under 2000 PKR
                </Link>
              </li>
              <li>
                <Link className="text-ink/80 hover:text-ink" href="/shop">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Help</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link className="text-ink/80 hover:text-ink" href="/about">About</Link></li>
              <li><Link className="text-ink/80 hover:text-ink" href="/contact">Contact</Link></li>
              <li><Link className="text-ink/80 hover:text-ink" href="/contact#faq">FAQ</Link></li>
              <li><Link className="text-ink/80 hover:text-ink" href="/contact">Returns & Sizing</Link></li>
              <li><Link className="text-ink/80 hover:text-ink" href="/track">Track Order</Link></li>
              <li><Link className="text-ink/80 hover:text-ink" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="text-ink/80 hover:text-ink" href="/terms">Terms</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Connect</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a className="text-ink/80 hover:text-ink" href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a className="text-ink/80 hover:text-ink" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></li>
              <li><a className="text-ink/80 hover:text-ink" href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a className="text-ink/80 hover:text-ink" href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 border-t border-border pt-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {siteConfig.shipping.banner}
          </p>
          <p className="font-display text-5xl font-semibold tracking-tight text-ink/10 sm:text-7xl lg:text-8xl">
            Closet by Junassan
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
