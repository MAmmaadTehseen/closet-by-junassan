"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useUi } from "@/lib/ui-store";

export default function MobileTabBar() {
  const pathname = usePathname() ?? "/";
  const [mounted, setMounted] = useState(false);
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const openSearch = useUi((s) => s.openSearch);
  const openCart = useUi((s) => s.openCart);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const tabClass = (active: boolean) =>
    `flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
      active ? "text-ink" : "text-ink/55 hover:text-ink"
    }`;

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <Link href="/" className={tabClass(isActive("/"))}>
        <Home className="h-5 w-5" aria-hidden />
        <span>Home</span>
      </Link>
      <Link href="/shop" className={tabClass(isActive("/shop"))}>
        <Search className="h-5 w-5" aria-hidden />
        <span>Shop</span>
      </Link>
      <button
        type="button"
        onClick={openSearch}
        className={tabClass(false)}
        aria-label="Search"
      >
        <span className="flex h-10 w-10 -translate-y-3 items-center justify-center rounded-full bg-ink text-paper shadow-md">
          <Search className="h-4 w-4" />
        </span>
        <span className="-mt-2">Find</span>
      </button>
      <Link href="/wishlist" className={`${tabClass(isActive("/wishlist"))} relative`}>
        <span className="relative">
          <Heart className="h-5 w-5" aria-hidden />
          {mounted && wishCount > 0 && (
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-red px-1 text-[9px] font-semibold text-paper">
              {wishCount}
            </span>
          )}
        </span>
        <span>Wish</span>
      </Link>
      <button type="button" onClick={openCart} className={`${tabClass(false)} relative`}>
        <span className="relative">
          <ShoppingBag className="h-5 w-5" aria-hidden />
          {mounted && cartCount > 0 && (
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-semibold text-paper">
              {cartCount}
            </span>
          )}
        </span>
        <span>Bag</span>
      </button>
      <Link href="/track" className={tabClass(isActive("/track"))}>
        <User className="h-5 w-5" aria-hidden />
        <span>Order</span>
      </Link>
    </nav>
  );
}
