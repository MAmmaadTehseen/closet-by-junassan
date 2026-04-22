"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Trash2, GitCompareArrows } from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import { useCompare } from "@/lib/compare-store";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

const ROWS: { label: string; key: keyof Product; format?: (v: unknown, p: Product) => string }[] = [
  { label: "Price", key: "price_pkr", format: (_, p) => formatPKR(p.price_pkr) },
  { label: "Brand", key: "brand" },
  { label: "Category", key: "category" },
  { label: "Size", key: "size" },
  { label: "Condition", key: "condition" },
  { label: "Stock", key: "stock", format: (_, p) => (p.stock > 0 ? `${p.stock} left` : "Sold out") },
  { label: "Fabric", key: "fabric", format: (v) => String(v ?? "—") },
];

export default function CompareDrawer({ allProducts }: { allProducts: Product[] }) {
  const open = useCompare((s) => s.open);
  const close = useCompare((s) => s.closeDrawer);
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);

  const items = ids
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  return (
    <Drawer open={open} onClose={close} title="Compare" side="right">
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream">
            <GitCompareArrows className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="font-display text-lg font-semibold">Nothing to compare yet</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Tap the compare icon on any product to add it here. Compare up to 4 items side-by-side.
          </p>
          <Link
            href="/shop"
            onClick={close}
            className="mt-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-paper"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{items.length} item(s)</p>
              <button
                onClick={clear}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-accent-red"
              >
                <Trash2 className="h-3 w-3" /> Clear all
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[360px] border-separate border-spacing-x-3">
                <thead>
                  <tr>
                    <th className="w-24 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Attribute
                    </th>
                    {items.map((p) => (
                      <th key={p.id} className="min-w-36 text-left align-top">
                        <div className="relative">
                          <button
                            onClick={() => remove(p.id)}
                            aria-label="Remove"
                            className="absolute right-0 top-0 z-10 rounded-full bg-paper/80 p-1 text-muted-foreground hover:text-accent-red"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                          <Link href={`/product/${p.slug}`} onClick={close}>
                            <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl bg-cream">
                              {p.images[0] && (
                                <Image
                                  src={p.images[0]}
                                  alt={p.name}
                                  fill
                                  sizes="140px"
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <p className="mt-2 line-clamp-2 text-xs font-medium text-ink">
                              {p.name}
                            </p>
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.label}>
                      <td className="py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {row.label}
                      </td>
                      {items.map((p) => {
                        const value = row.format
                          ? row.format(p[row.key], p)
                          : String(p[row.key] ?? "—");
                        return (
                          <td
                            key={p.id}
                            className="border-t border-border py-2 text-sm text-ink"
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-border bg-cream/50 p-5">
            <p className="mb-3 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
              Tap a product to view full details
            </p>
            <button
              onClick={close}
              className="w-full rounded-full border border-ink py-3 text-xs font-semibold uppercase tracking-widest text-ink hover:bg-ink hover:text-paper"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
