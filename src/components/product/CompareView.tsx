"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useCompare } from "@/lib/compare-store";
import { useCart } from "@/lib/cart-store";
import { toast } from "@/components/ui/Toaster";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

const ROWS: { label: string; get: (p: Product) => string | number }[] = [
  { label: "Brand",        get: (p) => p.brand },
  { label: "Category",     get: (p) => p.category },
  { label: "Size",         get: (p) => p.size },
  { label: "Condition",    get: (p) => p.condition },
  { label: "Stock",        get: (p) => (p.stock > 0 ? `${p.stock} left` : "Sold out") },
  { label: "Fabric",       get: (p) => p.fabric ?? "—" },
  { label: "Measurements", get: (p) => p.measurements ?? "—" },
  { label: "Care",         get: (p) => p.care ?? "—" },
];

export default function CompareView({ products }: { products: Product[] }) {
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const addToCart = useCart((s) => s.add);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const byId = new Map(products.map((p) => [p.id, p]));
  const items = ids.map((id) => byId.get(id)).filter(Boolean) as Product[];

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-cream/40 px-6 py-20 text-center">
        <p className="font-display text-2xl">Nothing here to compare yet.</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Tap the compare icon on any product card to add it here.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-paper"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  const cheapest = Math.min(...items.map((p) => p.price_pkr));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Comparing <span className="font-semibold text-ink">{items.length}</span>{" "}
          {items.length === 1 ? "piece" : "pieces"}
        </p>
        <button
          onClick={clear}
          className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-ink"
        >
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-x-3">
          <thead>
            <tr>
              <th className="w-32 sm:w-40" />
              {items.map((p) => (
                <th key={p.id} className="text-left align-top">
                  <div className="relative">
                    <button
                      onClick={() => remove(p.id)}
                      aria-label="Remove"
                      className="absolute right-1 top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-paper/95 text-ink shadow"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <Link
                      href={`/product/${p.slug}`}
                      className="block aspect-4/5 overflow-hidden rounded-xl bg-cream"
                    >
                      {p.images[0] && (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          width={400}
                          height={500}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </Link>
                  </div>
                  <div className="mt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {p.brand}
                    </p>
                    <Link href={`/product/${p.slug}`} className="line-clamp-2 text-sm font-medium hover:underline">
                      {p.name}
                    </Link>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-base font-semibold">{formatPKR(p.price_pkr)}</span>
                      {p.price_pkr === cheapest && items.length > 1 && (
                        <span className="rounded-full bg-green-600/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-green-700">
                          Best price
                        </span>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <td className="border-t border-border py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground align-top">
                  {row.label}
                </td>
                {items.map((p) => (
                  <td key={p.id} className="border-t border-border py-3 align-top text-sm capitalize text-ink">
                    {row.get(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td />
              {items.map((p) => (
                <td key={p.id} className="pt-5 align-top">
                  <button
                    onClick={() => {
                      if (p.stock <= 0) {
                        toast.error("Out of stock");
                        return;
                      }
                      addToCart({
                        id: p.id,
                        slug: p.slug,
                        name: p.name,
                        price_pkr: p.price_pkr,
                        image: p.images[0] ?? "",
                        size: p.size,
                        quantity: 1,
                        maxStock: p.stock,
                      });
                      toast.success(`Added "${p.name}" to bag`);
                    }}
                    disabled={p.stock <= 0}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-paper disabled:opacity-40"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" /> Add
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
