"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { X } from "lucide-react";
import { useCompare } from "@/lib/compare-store";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function CompareView({ products }: { products: Product[] }) {
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);

  const selected = useMemo(
    () => ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[],
    [ids, products],
  );

  if (selected.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="font-display text-xl font-semibold">Nothing to compare yet.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Hit the <span className="font-semibold">Compare</span> button on any product to add it here.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-paper hover:opacity-90"
        >
          Browse shop
        </Link>
      </div>
    );
  }

  const rows: { label: string; value: (p: Product) => string }[] = [
    { label: "Brand", value: (p) => p.brand },
    { label: "Category", value: (p) => p.category },
    { label: "Price", value: (p) => formatPKR(p.price_pkr) },
    { label: "Original", value: (p) => (p.original_price_pkr ? formatPKR(p.original_price_pkr) : "—") },
    {
      label: "Discount",
      value: (p) => {
        if (!p.original_price_pkr || p.original_price_pkr <= p.price_pkr) return "—";
        return `${Math.round(((p.original_price_pkr - p.price_pkr) / p.original_price_pkr) * 100)}%`;
      },
    },
    { label: "Size", value: (p) => p.size || "—" },
    { label: "Condition", value: (p) => p.condition || "—" },
    { label: "Fabric", value: (p) => p.fabric || "—" },
    { label: "Stock", value: (p) => (p.stock === 0 ? "Sold out" : `${p.stock} left`) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={clear}
          className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-ink"
        >
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `140px repeat(${selected.length}, minmax(200px, 1fr))`,
          }}
        >
          <div />
          {selected.map((p) => (
            <div key={p.id} className="relative">
              <button
                onClick={() => remove(p.id)}
                aria-label="Remove"
                className="absolute right-2 top-2 z-10 rounded-full bg-paper/95 p-1.5 text-ink shadow hover:bg-cream"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <Link href={`/product/${p.slug}`} className="block focus-ring">
                <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-cream">
                  {p.images[0] && (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 45vw, 25vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {p.brand}
                </p>
                <p className="line-clamp-2 text-sm font-medium">{p.name}</p>
              </Link>
            </div>
          ))}

          {rows.map((row) => (
            <div key={row.label} className="contents">
              <div className="border-t border-border py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {row.label}
              </div>
              {selected.map((p) => (
                <div
                  key={`${p.id}-${row.label}`}
                  className="border-t border-border py-3 text-sm text-ink capitalize"
                >
                  {row.value(p)}
                </div>
              ))}
            </div>
          ))}

          <div />
          {selected.map((p) => (
            <div key={`${p.id}-cta`} className="pt-2">
              <Link
                href={`/product/${p.slug}`}
                className="inline-flex w-full items-center justify-center rounded-full bg-ink px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-paper hover:opacity-90"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
