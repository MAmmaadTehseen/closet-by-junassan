"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { X, ShoppingBag } from "lucide-react";
import { useCompare } from "@/lib/compare-store";
import { useCart } from "@/lib/cart-store";
import { formatPKR } from "@/lib/format";
import { toast } from "@/components/ui/Toaster";
import type { Product } from "@/lib/types";

type Row = {
  key: keyof Product | "price" | "discount";
  label: string;
  render: (p: Product) => string | number | React.ReactNode;
};

const ROWS: Row[] = [
  { key: "brand", label: "Brand", render: (p) => p.brand },
  {
    key: "price",
    label: "Price",
    render: (p) => (
      <span className="flex flex-col">
        <span className="font-semibold">{formatPKR(p.price_pkr)}</span>
        {p.original_price_pkr && p.original_price_pkr > p.price_pkr && (
          <span className="text-xs text-muted-foreground line-through">
            {formatPKR(p.original_price_pkr)}
          </span>
        )}
      </span>
    ),
  },
  { key: "size", label: "Size", render: (p) => p.size },
  { key: "condition", label: "Condition", render: (p) => p.condition },
  { key: "stock", label: "Stock", render: (p) => (p.stock > 0 ? `${p.stock} left` : "Sold out") },
  { key: "fabric", label: "Fabric", render: (p) => p.fabric ?? "—" },
  { key: "measurements", label: "Measurements", render: (p) => p.measurements ?? "—" },
];

export default function CompareView({ products }: { products: Product[] }) {
  const [mounted, setMounted] = useState(false);
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const add = useCart((s) => s.add);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-64" />;

  const selected = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  if (selected.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-cream/40 px-6 py-14 text-center">
        <p className="font-display text-xl">Nothing to compare yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Open any product and tap "Compare" to add it here.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-paper"
        >
          Browse shop
        </Link>
      </div>
    );
  }

  const onAddAll = () => {
    for (const p of selected) {
      if (p.stock === 0) continue;
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
    }
    toast.success("Added to cart");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Comparing <span className="font-semibold text-ink">{selected.length}</span> items
        </p>
        <div className="flex gap-2">
          <button
            onClick={onAddAll}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-paper hover:opacity-90"
          >
            <ShoppingBag className="h-3 w-3" />
            Add all to cart
          </button>
          <button
            onClick={clear}
            className="rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:bg-cream"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky left-0 w-28 bg-paper p-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                &nbsp;
              </th>
              {selected.map((p) => (
                <th key={p.id} className="min-w-52 p-2 text-left align-top">
                  <div className="relative overflow-hidden rounded-2xl bg-cream">
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      width={400}
                      height={500}
                      className="aspect-4/5 w-full object-cover"
                    />
                    <button
                      onClick={() => remove(p.id)}
                      className="absolute right-2 top-2 rounded-full bg-paper/90 p-1 text-ink hover:bg-paper"
                      aria-label="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <Link
                    href={`/product/${p.slug}`}
                    className="mt-3 block line-clamp-1 text-sm font-medium hover:underline"
                  >
                    {p.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key} className="even:bg-cream/30">
                <td className="sticky left-0 bg-paper px-2 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {row.label}
                </td>
                {selected.map((p) => (
                  <td key={p.id} className="px-2 py-3 text-sm">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
