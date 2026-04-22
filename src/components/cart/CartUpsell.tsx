"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { toast } from "@/components/ui/Toaster";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function CartUpsell({ products }: { products: Product[] }) {
  const items = useCart((s) => s.items);
  const add = useCart((s) => s.add);

  const suggestions = useMemo(() => {
    if (products.length === 0) return [];
    const cartIds = new Set(items.map((i) => i.id));
    const cats = new Set(
      items
        .map((i) => products.find((p) => p.id === i.id)?.category)
        .filter(Boolean) as string[],
    );
    return [...products]
      .filter((p) => !cartIds.has(p.id) && p.stock > 0)
      .sort((a, b) => {
        const aMatch = cats.has(a.category) ? 0 : 1;
        const bMatch = cats.has(b.category) ? 0 : 1;
        if (aMatch !== bMatch) return aMatch - bMatch;
        return a.price_pkr - b.price_pkr;
      })
      .slice(0, 6);
  }, [products, items]);

  if (suggestions.length === 0) return null;

  return (
    <div className="border-t border-border bg-paper px-5 py-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        You might also like
      </p>
      <ul className="flex gap-3 overflow-x-auto no-scrollbar">
        {suggestions.map((p) => (
          <li
            key={p.id}
            className="group relative w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-paper"
          >
            <div className="relative aspect-square w-full bg-cream">
              {p.images[0] && (
                <Image src={p.images[0]} alt={p.name} fill sizes="128px" className="object-cover" />
              )}
              <button
                onClick={() => {
                  add({
                    id: p.id,
                    slug: p.slug,
                    name: p.name,
                    price_pkr: p.price_pkr,
                    image: p.images[0] ?? "",
                    size: p.size,
                    quantity: 1,
                    maxStock: p.stock,
                  });
                  toast.success(`${p.name} added`);
                }}
                aria-label={`Add ${p.name} to bag`}
                className="absolute right-1.5 bottom-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-paper text-ink shadow-md transition hover:bg-ink hover:text-paper"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="px-2 py-2">
              <p className="line-clamp-1 text-[11px] font-medium text-ink">{p.name}</p>
              <p className="text-[11px] font-semibold">{formatPKR(p.price_pkr)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
