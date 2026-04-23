"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useUi } from "@/lib/ui-store";
import { toast } from "@/components/ui/Toaster";
import type { Product } from "@/lib/types";

export default function AddBundleToCart({
  items,
  bundleSlug,
  discountPct,
}: {
  items: Product[];
  bundleSlug: string;
  discountPct: number;
}) {
  const add = useCart((s) => s.add);
  const openCart = useUi((s) => s.openCart);

  const onAdd = () => {
    if (items.length === 0) return;
    for (const p of items) {
      if (p.stock === 0) continue;
      const discounted = Math.round((p.price_pkr * (100 - discountPct)) / 100);
      add({
        id: `${p.id}__${bundleSlug}`,
        slug: p.slug,
        name: `${p.name} · ${bundleSlug.replace(/-/g, " ")}`,
        price_pkr: discounted,
        image: p.images[0] ?? "",
        size: p.size || "Free",
        quantity: 1,
        maxStock: p.stock,
      });
    }
    toast.success(`Bundle added · ${discountPct}% off applied`);
    openCart();
  };

  return (
    <button
      onClick={onAdd}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-paper transition hover:opacity-90"
    >
      <ShoppingBag className="h-4 w-4" />
      Add bundle to cart
    </button>
  );
}
