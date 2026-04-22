"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { X, ShoppingBag, Scale } from "lucide-react";
import { useCompare } from "@/lib/compare-store";
import { useCart } from "@/lib/cart-store";
import { toast } from "@/components/ui/Toaster";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

const ROWS: Array<{ key: keyof Product | "discount"; label: string }> = [
  { key: "brand", label: "Brand" },
  { key: "category", label: "Category" },
  { key: "size", label: "Size" },
  { key: "condition", label: "Condition" },
  { key: "fabric", label: "Fabric" },
  { key: "stock", label: "Stock left" },
  { key: "discount", label: "Discount" },
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
      <div className="flex flex-col items-center gap-5 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
          <Scale className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl font-semibold">Nothing to compare yet</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Tap the scale icon on any product to start a comparison. You can compare up to 4 pieces.
        </p>
        <Link
          href="/shop"
          className="mt-2 rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  const renderCell = (p: Product, key: keyof Product | "discount") => {
    if (key === "discount") {
      if (!p.original_price_pkr || p.original_price_pkr <= p.price_pkr) return "—";
      return `${Math.round(((p.original_price_pkr - p.price_pkr) / p.original_price_pkr) * 100)}%`;
    }
    const v = p[key];
    if (v === undefined || v === null || v === "") return "—";
    if (Array.isArray(v)) return v.join(", ");
    return String(v);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} pieces selected</p>
        <button
          onClick={() => {
            clear();
            toast.success("Comparison cleared");
          }}
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-accent-red"
        >
          Clear all
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-32 p-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                &nbsp;
              </th>
              {items.map((p) => (
                <th key={p.id} className="border-l border-border p-3 align-top">
                  <div className="relative">
                    <button
                      onClick={() => remove(p.id)}
                      aria-label="Remove"
                      className="absolute right-0 top-0 rounded-full p-1 text-muted-foreground hover:bg-cream hover:text-accent-red"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <Link href={`/product/${p.slug}`} className="block">
                      <div className="relative mx-auto aspect-4/5 w-full max-w-[180px] overflow-hidden rounded-xl bg-cream">
                        {p.images[0] && (
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            sizes="180px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <p className="mt-3 line-clamp-2 text-left text-sm font-medium hover:underline">
                        {p.name}
                      </p>
                    </Link>
                    <p className="mt-1 text-left font-display text-lg font-semibold">
                      {formatPKR(p.price_pkr)}
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.key as string} className="border-t border-border">
                <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {r.label}
                </th>
                {items.map((p) => (
                  <td key={p.id} className="border-l border-border p-3 align-top capitalize">
                    {renderCell(p, r.key)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-border">
              <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Action
              </th>
              {items.map((p) => (
                <td key={p.id} className="border-l border-border p-3">
                  <button
                    disabled={p.stock === 0}
                    onClick={() => {
                      add({
                        id: `${p.id}::${p.size}`,
                        slug: p.slug,
                        name: p.name,
                        image: p.images[0] ?? "",
                        price_pkr: p.price_pkr,
                        size: p.size,
                        quantity: 1,
                        maxStock: p.stock,
                      });
                      toast.success("Added to bag");
                    }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-paper transition disabled:opacity-40 hover:opacity-90"
                  >
                    <ShoppingBag className="h-3 w-3" /> {p.stock === 0 ? "Sold out" : "Add to bag"}
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
