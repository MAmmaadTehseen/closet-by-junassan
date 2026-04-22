"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, GitCompare, ShoppingBag } from "lucide-react";
import { useCompare } from "@/lib/compare-store";
import { useCart } from "@/lib/cart-store";
import { toast } from "@/components/ui/Toaster";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

const ROWS: { key: keyof Product | "discount"; label: string }[] = [
  { key: "brand", label: "Brand" },
  { key: "category", label: "Category" },
  { key: "price_pkr", label: "Price" },
  { key: "discount", label: "Discount" },
  { key: "size", label: "Size" },
  { key: "condition", label: "Condition" },
  { key: "fabric", label: "Fabric" },
  { key: "stock", label: "Stock left" },
  { key: "measurements", label: "Measurements" },
  { key: "care", label: "Care" },
];

export default function CompareView({ allProducts }: { allProducts: Product[] }) {
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const addToCart = useCart((s) => s.add);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const items = useMemo(
    () => ids.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean) as Product[],
    [ids, allProducts],
  );

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream">
          <GitCompare className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="font-display text-lg font-semibold">Nothing to compare yet</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Tap the compare icon on any product card to start stacking them up.
        </p>
        <Link
          href="/shop"
          className="mt-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-paper"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  // Highlight cheapest, most stock, etc. for quick decisions.
  const cheapestId = items.reduce((min, p) => (p.price_pkr < min.price_pkr ? p : min), items[0]).id;
  const mostStockId = items.reduce((max, p) => (p.stock > max.stock ? p : max), items[0]).id;

  const renderCell = (p: Product, key: (typeof ROWS)[number]["key"]) => {
    if (key === "discount") {
      const discount =
        p.original_price_pkr && p.original_price_pkr > p.price_pkr
          ? Math.round(((p.original_price_pkr - p.price_pkr) / p.original_price_pkr) * 100)
          : 0;
      return discount ? `−${discount}%` : "—";
    }
    if (key === "price_pkr") return formatPKR(p.price_pkr);
    const v = p[key];
    if (v === undefined || v === null || v === "") return "—";
    return typeof v === "number" ? String(v) : String(v);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {items.length} piece{items.length === 1 ? "" : "s"}
        </p>
        <button
          onClick={clear}
          className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground hover:text-ink"
        >
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-cream/40">
              <th className="w-32 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Detail
              </th>
              {items.map((p) => (
                <th key={p.id} className="border-l border-border px-4 py-3 align-top">
                  <div className="relative">
                    <button
                      onClick={() => remove(p.id)}
                      aria-label={`Remove ${p.name}`}
                      className="absolute right-0 top-0 rounded-full p-1 text-muted-foreground hover:bg-paper hover:text-ink"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <Link href={`/product/${p.slug}`} className="block">
                      <div className="relative mx-auto h-32 w-24 overflow-hidden rounded-xl bg-paper">
                        {p.images[0] && (
                          <Image src={p.images[0]} alt={p.name} fill sizes="96px" className="object-cover" />
                        )}
                      </div>
                      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {p.brand}
                      </p>
                      <p className="line-clamp-2 font-display text-base font-semibold text-ink">
                        {p.name}
                      </p>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.key} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {r.label}
                </td>
                {items.map((p) => {
                  const isWin =
                    (r.key === "price_pkr" && p.id === cheapestId) ||
                    (r.key === "stock" && p.id === mostStockId);
                  return (
                    <td
                      key={p.id}
                      className={`border-l border-border px-4 py-3 align-top text-ink ${
                        isWin ? "bg-cream/60 font-semibold" : ""
                      }`}
                    >
                      <span className="capitalize">{renderCell(p, r.key)}</span>
                      {isWin && (
                        <span className="ml-2 rounded-full bg-ink px-1.5 py-0.5 align-middle text-[9px] font-semibold uppercase tracking-wide text-paper">
                          Best
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Action
              </td>
              {items.map((p) => (
                <td key={p.id} className="border-l border-border px-4 py-4 align-top">
                  <button
                    onClick={() => {
                      if (p.stock <= 0) {
                        toast.error("Sold out");
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
                      toast.success(`${p.name} added to bag`);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper transition hover:opacity-90 disabled:opacity-50"
                    disabled={p.stock <= 0}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {p.stock <= 0 ? "Sold out" : "Add to bag"}
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
