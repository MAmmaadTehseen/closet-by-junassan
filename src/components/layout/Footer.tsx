import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { CATEGORIES } from "@/lib/types";
import { InstagramIcon, FacebookIcon } from "@/components/ui/brand-icons";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display text-xl font-semibold">{siteConfig.name}</h3>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Curated thrift fashion. Affordable branded finds for every closet.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link className="hover:text-foreground" href={`/category/${c.slug}`}>
                    {c.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="hover:text-foreground" href="/deals">
                  Under 2000 PKR
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-foreground">
                  All products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide">Follow</h4>
            <div className="mt-4 flex gap-3">
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-border p-2 hover:bg-background"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-full border border-border p-2 hover:bg-background"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              {siteConfig.shipping.banner}
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
