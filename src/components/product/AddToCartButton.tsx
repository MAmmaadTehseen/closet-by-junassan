"use client";

import { ShoppingBag, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { useUi } from "@/lib/ui-store";
import { toast } from "@/components/ui/Toaster";
import type { Product } from "@/lib/types";

export default function AddToCartButton({
  product,
  selectedSize,
}: {
  product: Product;
  selectedSize?: string;
}) {
  const add = useCart((s) => s.add);
  const openCart = useUi((s) => s.openCart);
  const router = useRouter();
  const soldOut = product.stock === 0;

  const doAdd = () => {
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
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        onClick={() => {
          doAdd();
          openCart();
        }}
        disabled={soldOut}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90 disabled:opacity-50 focus-ring"
      >
        <ShoppingBag className="h-4 w-4" />
        {soldOut ? "Sold out" : "Add to Bag"}
      </button>
      <button
        onClick={() => {
          doAdd();
          router.push("/checkout");
        }}
        disabled={soldOut}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-ink px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-paper disabled:opacity-50 focus-ring"
      >
        <Zap className="h-4 w-4" /> Buy Now
      </button>
    </div>
  );
}
