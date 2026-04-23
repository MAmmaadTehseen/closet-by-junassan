"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X, Search, Heart, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useUi } from "@/lib/ui-store";
import { siteConfig } from "@/lib/site-config";
import { InstagramIcon, FacebookIcon } from "@/components/ui/brand-icons";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import LangToggle from "@/components/layout/LangToggle";
import MegaMenu, { MEGA_MENU } from "@/components/layout/MegaMenu";
import { useT } from "@/hooks/use-t";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const openCart = useUi((s) => s.openCart);
  const openSearch = useUi((s) => s.openSearch);
  const t = useT();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [open]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full">
      <AnnouncementBar />
      <div className="relative border-b border-border bg-paper">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-2 lg:hidden focus-ring"
              onClick={() => setOpen(true)}
              aria-label={t("nav.menu_open")}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              href="/"
              className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
            >
              {siteConfig.name}
            </Link>
          </div>

          <MegaMenu />

          <div className="flex items-center gap-1">
            <button
              onClick={openSearch}
              className="rounded-full p-2.5 text-ink hover:bg-cream focus-ring"
              aria-label={t("nav.search")}
            >
              <Search className="h-5 w-5" />
            </button>
            <LangToggle />
            <Link
              href="/wishlist"
              className="relative hidden rounded-full p-2.5 text-ink hover:bg-cream focus-ring sm:inline-flex"
              aria-label={t("nav.wishlist")}
            >
              <Heart className="h-5 w-5" />
              {mounted && wishCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-red px-1 text-[10px] font-semibold text-paper">
                  {wishCount}
                </span>
              )}
            </Link>
            <button
              id="cart-target"
              onClick={openCart}
              className="relative rounded-full p-2.5 text-ink hover:bg-cream focus-ring"
              aria-label={t("nav.cart")}
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-paper">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/50 fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="drawer-in absolute left-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-paper p-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="font-display text-lg font-semibold"
              >
                {siteConfig.name}
              </Link>
              <button
                onClick={() => setOpen(false)}
                aria-label={t("nav.menu_close")}
                className="rounded-full p-2 hover:bg-cream focus-ring"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col">
              {MEGA_MENU.map((item) => {
                const label = item.labelKey ? t(item.labelKey) : item.label;
                if (!item.panel) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="border-b border-border py-4 text-base font-medium uppercase tracking-[0.12em]"
                    >
                      {label}
                    </Link>
                  );
                }
                const expanded = mobileExpanded === item.label;
                return (
                  <div key={item.label} className="border-b border-border">
                    <button
                      className="flex w-full items-center justify-between py-4 text-left text-base font-medium uppercase tracking-[0.12em] focus-ring"
                      onClick={() =>
                        setMobileExpanded(expanded ? null : item.label)
                      }
                      aria-expanded={expanded}
                    >
                      <span>{label}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expanded && (
                      <div className="pb-4 pl-2">
                        {item.panel.map((s) => (
                          <Link
                            key={s.href}
                            href={s.href}
                            onClick={() => setOpen(false)}
                            className="block py-2 text-sm text-ink/80 hover:text-ink"
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <Link
                href="/wishlist"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 border-b border-border py-4 text-base font-medium"
              >
                <Heart className="h-4 w-4" /> {t("nav.wishlist")}
              </Link>
              <Link
                href="/my"
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-base font-medium"
              >
                {t("nav.my_orders")}
              </Link>
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-base font-medium"
              >
                {t("nav.about")}
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-base font-medium"
              >
                {t("nav.contact")}
              </Link>
            </nav>
            <div className="mt-8 flex gap-3">
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border p-2"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border p-2"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-8 text-[11px] uppercase tracking-widest text-muted-foreground">
              {siteConfig.shipping.banner}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
