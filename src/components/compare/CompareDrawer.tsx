"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { X, ShoppingBag } from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import { useCart } from "@/lib/cart-store";
import { useCompare } from "@/lib/compare-store";
import { toast } from "@/components/ui/Toaster";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

const ATTRS: { key: keyof Product; label: string; format?: (v: unknown) => string }[] = [
  { key: "brand", label: "Brand" },
  { key: "category", label: "Category" },
  {
    key: "price_pkr",
    label: "Price",
    format: (v) => (typeof v === "number" ? formatPKR(v) : ""),
  },
  { key: "size", label: "Size" },
  { key: "condition", label: "Condition" },
  { key: "fabric", label: "Fabric" },
  {
    key: "stock",
    label: "Stock",
    format: (v) => (typeof v === "number" ? (v > 0 ? `${v} left` : "Sold out") : ""),
  },
];

export default function CompareDrawer({ products }: { products: Product[] }) {
  const open = useCompare((s) => s.open);
  const close = useCompare((s) => s.closeDrawer);
  const remove = useCompare((s) => s.remove);
  const ids = useCompare((s) => s.ids);
  const add = useCart((s) => s.add);

  const rows = useMemo(
    () =>
      ids
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => !!p),
    [ids, products],
  );

  return (
    <Drawer
      open={open}
      onClose={close}
      title={`Compare (${rows.length})`}
      width="sm:w-[720px]"
    >
      {rows.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Pick up to three pieces and compare them side-by-side.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto px-4 pb-10">
          <table className="w-full min-w-[540px] table-fixed border-separate border-spacing-x-3">
            <thead>
              <tr>
                <th className="w-28 align-bottom" />
                {rows.map((p) => (
                  <th key={p.id} className="align-bottom">
                    <div className="relative flex flex-col items-start">
                      <button
                        onClick={() => remove(p.id)}
                        aria-label="Remove from compare"
                        className="absolute right-1 top-1 z-10 rounded-full bg-paper/90 p-1 text-muted-foreground hover:text-accent-red"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={close}
                        className="block w-full overflow-hidden rounded-2xl bg-cream"
                      >
                        <div className="relative aspect-4/5 w-full">
                          {p.images[0] && (
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              fill
                              sizes="200px"
                              className="object-cover"
                            />
                          )}
                        </div>
                      </Link>
                      <div className="mt-2 w-full text-left">
                        <p className="line-clamp-2 text-xs font-medium">
                          {p.name}
                        </p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="align-top">
              {ATTRS.map((a) => (
                <tr key={a.key as string} className="text-xs">
                  <th className="border-b border-border py-2 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {a.label}
                  </th>
                  {rows.map((p) => {
                    const raw = p[a.key];
                    const value = a.format
                      ? a.format(raw)
                      : raw == null
                        ? "—"
                        : String(raw);
                    return (
                      <td
                        key={p.id}
                        className="border-b border-border py-2 text-ink"
                      >
                        <span className="capitalize">{value || "—"}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="pt-4" />
                {rows.map((p) => (
                  <td key={p.id} className="pt-4">
                    <button
                      onClick={() => {
                        if (p.stock <= 0) {
                          toast.error("Sold out");
                          return;
                        }
                        add({
                          id: p.id,
                          slug: p.slug,
                          name: p.name,
                          price_pkr: p.price_pkr,
                          image: p.images[0] ?? "",
                          size: p.size,
                          quantity: 1,
                          maxStock: Math.max(1, p.stock),
                        });
                        toast.success("Added to bag");
                      }}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-ink px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-paper disabled:opacity-50"
                      disabled={p.stock <= 0}
                    >
                      <ShoppingBag className="h-3 w-3" /> Add
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Drawer>
  );
}
