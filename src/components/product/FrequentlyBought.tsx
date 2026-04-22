"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Equal, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { toast } from "@/components/ui/Toaster";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

const BUNDLE_DISCOUNT = 0.1;

export default function FrequentlyBought({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const add = useCart((s) => s.add);

  const picks = useMemo(() => {
    const inStock = related.filter((p) => p.stock > 0 && p.id !== product.id);
    return inStock.slice(0, 2);
  }, [related, product.id]);

  const all = [product, ...picks];
  const [selected, setSelected] = useState<Record<string, boolean>>(
    () => Object.fromEntries(all.map((p) => [p.id, true])),
  );

  if (picks.length === 0) return null;

  const chosen = all.filter((p) => selected[p.id]);
  const subtotal = chosen.reduce((n, p) => n + p.price_pkr, 0);
  const discounted = chosen.length >= 2 ? Math.round(subtotal * (1 - BUNDLE_DISCOUNT)) : subtotal;
  const saved = subtotal - discounted;

  const addBundle = () => {
    chosen.forEach((p) => {
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
    });
    toast.success(
      `Added ${chosen.length} pieces${saved > 0 ? ` — saved ${formatPKR(saved)}` : ""}`,
    );
  };

  return (
    <section className="mt-14 border-t border-border pt-10">
      <div className="mb-5">
        <p className="eyebrow">Frequently bought together</p>
        <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
          Style the full look
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Bundle 2+ pieces and save 10% — applied automatically.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-center">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          {all.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <label className="group relative block w-32 shrink-0 cursor-pointer sm:w-40">
                <Link href={`/product/${p.slug}`} className="block">
                  <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-cream">
                    {p.images[0] && (
                      <Image src={p.images[0]} alt={p.name} fill sizes="160px" className="object-cover" />
                    )}
                  </div>
                </Link>
                <div className="mt-2 flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={!!selected[p.id]}
                    onChange={(e) =>
                      setSelected((s) => ({ ...s, [p.id]: e.target.checked }))
                    }
                    className="mt-0.5 h-4 w-4 accent-ink"
                  />
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-xs font-medium">{p.name}</p>
                    <p className="text-[11px] font-semibold">{formatPKR(p.price_pkr)}</p>
                  </div>
                </div>
              </label>
              {i < all.length - 1 && (
                <Plus className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-cream/40 p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Equal className="h-3.5 w-3.5" />
            <span>{chosen.length} pieces</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="font-display text-2xl font-semibold">{formatPKR(discounted)}</p>
            {saved > 0 && (
              <p className="text-sm text-muted-foreground line-through">{formatPKR(subtotal)}</p>
            )}
          </div>
          {saved > 0 && (
            <p className="mt-0.5 text-xs font-semibold text-accent-red">
              You save {formatPKR(saved)}
            </p>
          )}
          <button
            onClick={addBundle}
            disabled={chosen.length === 0}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90 disabled:opacity-40"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Add bundle
          </button>
        </div>
      </div>
    </section>
  );
}
