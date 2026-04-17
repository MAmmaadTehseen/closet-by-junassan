"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useUi } from "@/lib/ui-store";
import { toast } from "@/components/ui/Toaster";
import { formatPKR } from "@/lib/format";
import { flyToCart } from "@/lib/fly-to-cart";
import type { Product } from "@/lib/types";

export default function StickyBuyBar({
  product,
  selectedSize,
}: {
  product: Product;
  selectedSize?: string;
}) {
  const [visible, setVisible] = useState(false);
  const add = useCart((s) => s.add);
  const openCart = useUi((s) => s.openCart);
  const soldOut = product.stock === 0;

  useEffect(() => {
    const target = document.querySelector<HTMLElement>("[data-pdp-buy]");
    if (!target) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  if (!visible || soldOut) return null;

  const onAdd = () => {
    const img = document.querySelector<HTMLElement>("[data-gallery-hero] img");
    if (img) flyToCart(img);
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price_pkr: product.price_pkr,
      image: product.images[0] ?? "",
      size: selectedSize ?? product.size,
      quantity: 1,
      maxStock: product.stock,
    });
    toast.success(`Added to bag — ${product.name}`);
    openCart();
  };

  return (
    <div className="bar-rise fixed inset-x-0 bottom-0 z-40 border-t border-border bg-paper/95 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-cream">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-xs font-semibold text-ink">{product.name}</p>
          <p className="text-sm font-semibold">{formatPKR(product.price_pkr)}</p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-paper transition hover:opacity-90 focus-ring"
        >
          <ShoppingBag className="h-3.5 w-3.5" /> Add
        </button>
      </div>
    </div>
  );
}
