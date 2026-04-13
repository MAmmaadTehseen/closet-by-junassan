"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/lib/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const onAdd = () => {
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
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        onClick={onAdd}
        disabled={product.stock === 0}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-50"
      >
        {added ? (
          <>
            <Check className="h-4 w-4" /> Added
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" /> Add to Cart
          </>
        )}
      </button>
      <button
        onClick={() => {
          onAdd();
          router.push("/checkout");
        }}
        disabled={product.stock === 0}
        className="inline-flex flex-1 items-center justify-center rounded-full border border-foreground px-6 py-3.5 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-background disabled:opacity-50"
      >
        Buy Now
      </button>
    </div>
  );
}
