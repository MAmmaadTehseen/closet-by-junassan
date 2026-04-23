"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X, Search, Heart } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useUi } from "@/lib/ui-store";
import { siteConfig } from "@/lib/site-config";
import { InstagramIcon, FacebookIcon } from "@/components/ui/brand-icons";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import type { CategoryDef } from "@/lib/categories";

export default function Header({ categories = [] }: { categories?: CategoryDef[] }) {
  const NAV_LINKS = [
    { href: "/shop", label: "Shop" },
    ...categories.map((c) => ({ href: `/category/${c.slug}`, label: c.label })),
    { href: "/deals", label: "Deals" },
  ];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const openCart = useUi((s) => s.openCart);
  const openSearch = useUi((s) => s.openSearch);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [open]);

  // Hide mobile menu on route change.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full">
      <AnnouncementBar />
      <div className="border-b border-border bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-2 lg:hidden focus-ring"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
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

          <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 transition ${
                    active ? "text-ink" : "text-ink/70 hover:text-ink"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-ink" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={openSearch}
              className="rounded-full p-2.5 text-ink hover:bg-cream focus-ring"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <ThemeToggle />
            <Link
              href="/wishlist"
              className="relative hidden rounded-full p-2.5 text-ink hover:bg-cream focus-ring sm:inline-flex"
              aria-label="Wishlist"
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
              aria-label="Cart"
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
          <div className="drawer-in absolute left-0 top-0 h-full w-[86%] max-w-sm bg-paper p-6 shadow-2xl">
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
                aria-label="Close menu"
                className="rounded-full p-2 hover:bg-cream focus-ring"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-base font-medium"
              >
                Home
              </Link>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-border py-4 text-base font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/wishlist"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 border-b border-border py-4 text-base font-medium"
              >
                <Heart className="h-4 w-4" /> Wishlist
              </Link>
              <Link
                href="/brands"
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-base font-medium"
              >
                Brands
              </Link>
              <Link
                href="/lookbook"
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-base font-medium"
              >
                Lookbook
              </Link>
              <Link
                href="/faq"
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-base font-medium"
              >
                FAQ
              </Link>
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-base font-medium"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-base font-medium"
              >
                Contact
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
