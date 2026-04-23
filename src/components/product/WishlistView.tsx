"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Heart, Share2, Check } from "lucide-react";
import ProductCard from "./ProductCard";
import { useWishlist } from "@/lib/wishlist-store";
import { toast } from "@/components/ui/Toaster";
import type { Product } from "@/lib/types";

export default function WishlistView({ allProducts }: { allProducts: Product[] }) {
  const ids = useWishlist((s) => s.ids);
  const clear = useWishlist((s) => s.clear);
  const toggle = useWishlist((s) => s.toggle);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Import ?ids=a,b,c from a shared link once on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const raw = sp.get("ids");
    if (!raw) return;
    const incoming = raw.split(",").map((s) => s.trim()).filter(Boolean);
    let added = 0;
    for (const id of incoming) {
      if (!allProducts.find((p) => p.id === id)) continue;
      if (!useWishlist.getState().ids.includes(id)) {
        toggle(id);
        added++;
      }
    }
    if (added) toast.success(`${added} piece${added === 1 ? "" : "s"} added from shared wishlist`);
    const url = new URL(window.location.href);
    url.searchParams.delete("ids");
    window.history.replaceState({}, "", url.toString());
  }, [allProducts, toggle]);

  const items = useMemo(
    () => (mounted ? (ids.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean) as Product[]) : []),
    [ids, allProducts, mounted],
  );

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined" || items.length === 0) return "";
    const u = new URL(window.location.href);
    u.searchParams.set("ids", items.map((i) => i.id).join(","));
    return u.toString();
  }, [items]);

  const onShare = async () => {
    if (!shareUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Junassan wishlist", url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Share link copied");
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      /* user cancelled */
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-dashed border-border py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
          <Heart className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-display text-2xl font-semibold">Your wishlist is empty</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Tap the heart on any product to save it here. Limited pieces sell fast.
        </p>
        <Link
          href="/shop"
          className="mt-2 rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper"
        >
          Browse the Drop
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {items.length} saved
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={onShare}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-widest hover:border-ink"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
            Share list
          </button>
          <button
            onClick={clear}
            className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-accent-red"
          >
            Clear all
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
