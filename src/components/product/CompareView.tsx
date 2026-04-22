"use client";

import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCompare } from "@/lib/compare-store";
import { useCart } from "@/lib/cart-store";
import { toast } from "@/components/ui/Toaster";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

const ROWS: { key: keyof Product | "price" | "discount"; label: string }[] = [
  { key: "brand", label: "Brand" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "discount", label: "Discount" },
  { key: "size", label: "Size" },
  { key: "condition", label: "Condition" },
  { key: "stock", label: "Stock" },
  { key: "fabric", label: "Fabric" },
  { key: "measurements", label: "Measurements" },
  { key: "care", label: "Care" },
];

export default function CompareView({ products }: { products: Product[] }) {
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const add = useCart((s) => s.add);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const items = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border p-14 text-center">
        <p className="font-display text-2xl font-semibold">Nothing to compare yet</p>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
          Tap the compare icon on any product to add it here — up to four at a time.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper"
        >
          Browse shop
        </Link>
      </div>
    );
  }

  const renderCell = (p: Product, key: (typeof ROWS)[number]["key"]): string => {
    if (key === "price") return formatPKR(p.price_pkr);
    if (key === "discount") {
      if (p.original_price_pkr && p.original_price_pkr > p.price_pkr) {
        const pct = Math.round(
          ((p.original_price_pkr - p.price_pkr) / p.original_price_pkr) * 100,
        );
        return `-${pct}% · was ${formatPKR(p.original_price_pkr)}`;
      }
      return "—";
    }
    if (key === "stock") {
      if (p.stock === 0) return "Sold out";
      if (p.stock === 1) return "Only 1 left";
      return `${p.stock} available`;
    }
    const v = p[key];
    if (typeof v === "string" && v.length) return v;
    return "—";
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {items.length} of 4 pieces
        </p>
        <button
          onClick={clear}
          className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-ink"
        >
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-32 p-3 text-left" />
              {items.map((p) => (
                <th key={p.id} className="p-3 text-left align-top">
                  <div className="relative">
                    <button
                      onClick={() => remove(p.id)}
                      aria-label="Remove"
                      className="absolute right-0 top-0 z-10 rounded-full bg-paper/95 p-1.5 shadow-sm hover:bg-cream"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <Link
                      href={`/product/${p.slug}`}
                      className="block overflow-hidden rounded-xl bg-cream"
                    >
                      <div className="relative aspect-4/5 w-full">
                        {p.images[0] && (
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            sizes="220px"
                            className="object-cover"
                          />
                        )}
                      </div>
                    </Link>
                    <div className="mt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {p.brand}
                      </p>
                      <Link
                        href={`/product/${p.slug}`}
                        className="mt-0.5 block font-medium hover:underline"
                      >
                        {p.name}
                      </Link>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, idx) => (
              <tr
                key={row.key}
                className={idx % 2 === 0 ? "bg-cream/40" : "bg-paper"}
              >
                <th className="border-t border-border p-3 text-left align-top text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {row.label}
                </th>
                {items.map((p) => (
                  <td
                    key={p.id}
                    className="border-t border-border p-3 align-top capitalize"
                  >
                    {renderCell(p, row.key)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th className="border-t border-border p-3" />
              {items.map((p) => {
                const soldOut = p.stock === 0;
                return (
                  <td key={p.id} className="border-t border-border p-3 align-top">
                    <button
                      disabled={soldOut}
                      onClick={() => {
                        add({
                          id: p.id,
                          slug: p.slug,
                          name: p.name,
                          price_pkr: p.price_pkr,
                          image: p.images[0],
                          size: p.size,
                          quantity: 1,
                          maxStock: p.stock,
                        });
                        toast.success(`Added — ${p.name}`);
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-paper transition hover:opacity-90 disabled:opacity-50"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      {soldOut ? "Sold out" : "Add to bag"}
                    </button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
