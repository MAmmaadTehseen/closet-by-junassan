"use client";

import { Plus, Check } from "lucide-react";
import { useRef, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useUi } from "@/lib/ui-store";
import { toast } from "@/components/ui/Toaster";
import { flyToCart } from "@/lib/fly-to-cart";
import type { Product } from "@/lib/types";

export default function QuickAddButton({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const openCart = useUi((s) => s.openCart);
  const flashCartItem = useUi((s) => s.flashCartItem);
  const [done, setDone] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const soldOut = product.stock === 0;

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    const card = btnRef.current?.closest(".group");
    const img = card?.querySelector("img") as HTMLElement | null;
    if (img) flyToCart(img);
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price_pkr: product.price_pkr,
      image: product.images[0] ?? "",
      size: product.size,
      quantity: 1,
      maxStock: product.stock,
    });
    flashCartItem(product.id);
    setDone(true);
    toast.success(`Added to bag — ${product.name}`);
    openCart();
    setTimeout(() => setDone(false), 1400);
  };

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      disabled={soldOut}
      aria-label={soldOut ? "Sold out" : `Add ${product.name} to bag`}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper shadow-md transition hover:scale-105 disabled:bg-cream disabled:text-muted-foreground ${className}`}
    >
      {done ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  );
}
