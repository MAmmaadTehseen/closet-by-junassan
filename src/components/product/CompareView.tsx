"use client";

import Image from "next/image";
import Link from "next/link";
import { Scale, X, ShoppingBag, Star } from "lucide-react";
import { useCompare } from "@/lib/compare-store";
import { formatPKR, formatCondition } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function CompareView({ products }: { products: Product[] }) {
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const map = new Map(products.map((p) => [p.id, p]));
  const chosen = ids.map((id) => map.get(id)).filter((p): p is Product => !!p);

  if (chosen.length === 0) {
    return (
      <div className="mx-auto grid max-w-md place-items-center px-4 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream">
          <Scale className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-semibold">Nothing to compare yet</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Tap the compare icon on any product card or detail page to line them up side by side.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-paper hover:opacity-90"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  const ROWS: { label: string; render: (p: Product) => React.ReactNode }[] = [
    { label: "Price", render: (p) => <span className="text-base font-semibold">{formatPKR(p.price_pkr)}</span> },
    {
      label: "Original price",
      render: (p) =>
        p.original_price_pkr ? (
          <span className="text-muted-foreground line-through">{formatPKR(p.original_price_pkr)}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      label: "Discount",
      render: (p) => {
        if (!p.original_price_pkr || p.original_price_pkr <= p.price_pkr) return <span className="text-muted-foreground">—</span>;
        const d = Math.round(((p.original_price_pkr - p.price_pkr) / p.original_price_pkr) * 100);
        return <span className="rounded-full bg-accent-red px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-paper">-{d}%</span>;
      },
    },
    { label: "Brand", render: (p) => <span>{p.brand}</span> },
    { label: "Category", render: (p) => <span className="capitalize">{p.category}</span> },
    { label: "Size", render: (p) => <span>{p.size}</span> },
    { label: "Condition", render: (p) => <span>{formatCondition(p.condition)}</span> },
    { label: "Fabric", render: (p) => <span>{p.fabric ?? "—"}</span> },
    {
      label: "Stock",
      render: (p) =>
        p.stock === 0 ? (
          <span className="text-accent-red">Sold out</span>
        ) : p.stock <= 2 ? (
          <span className="text-accent-red">Only {p.stock} left</span>
        ) : (
          <span>{p.stock} available</span>
        ),
    },
    {
      label: "Tags",
      render: (p) =>
        p.tags.length === 0 ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide capitalize">
                {t}
              </span>
            ))}
          </div>
        ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Comparing {chosen.length} {chosen.length === 1 ? "item" : "items"}
        </p>
        <button
          onClick={clear}
          className="text-xs uppercase tracking-wide text-muted-foreground hover:text-accent-red"
        >
          Clear all
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-x-3">
          <thead>
            <tr>
              <th className="w-32 text-left" />
              {chosen.map((p) => (
                <th key={p.id} className="min-w-[180px] max-w-[220px] align-top text-left">
                  <div className="relative">
                    <Link href={`/product/${p.slug}`} className="block">
                      <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-cream">
                        {p.images[0] && (
                          <Image src={p.images[0]} alt={p.name} fill sizes="220px" className="object-cover" />
                        )}
                      </div>
                      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {p.brand}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-sm font-medium">{p.name}</p>
                    </Link>
                    <button
                      onClick={() => remove(p.id)}
                      aria-label={`Remove ${p.name}`}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-paper/95 text-ink shadow hover:bg-accent-red hover:text-paper"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="align-top">
                <td className="border-t border-border py-3 pr-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {row.label}
                </td>
                {chosen.map((p) => (
                  <td key={p.id} className="border-t border-border py-3 pr-3 text-sm">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="border-t border-border py-4 pr-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <Star className="inline h-3.5 w-3.5 text-ink" /> Action
              </td>
              {chosen.map((p) => (
                <td key={p.id} className="border-t border-border py-4 pr-3">
                  <Link
                    href={`/product/${p.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-paper hover:opacity-90"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" /> View
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
