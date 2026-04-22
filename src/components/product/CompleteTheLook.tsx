"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { toast } from "@/components/ui/Toaster";
import { formatPKR, seededRandom } from "@/lib/format";
import type { Product } from "@/lib/types";

const COMPLEMENT: Record<string, string[]> = {
  men: ["shoes", "bags"],
  women: ["shoes", "bags"],
  kids: ["shoes"],
  shoes: ["men", "women"],
  bags: ["men", "women"],
};

export default function CompleteTheLook({
  product,
  allProducts,
}: {
  product: Product;
  allProducts: Product[];
}) {
  const add = useCart((s) => s.add);

  const picks = useMemo(() => {
    const wantedCategories = COMPLEMENT[product.category] ?? ["shoes", "bags"];
    const pool = allProducts.filter(
      (p) =>
        p.id !== product.id &&
        p.stock > 0 &&
        wantedCategories.includes(p.category),
    );
    pool.sort(
      (a, b) =>
        seededRandom(product.slug + a.id) - seededRandom(product.slug + b.id),
    );
    if (pool.length < 3) {
      const fallback = allProducts.filter(
        (p) => p.id !== product.id && p.stock > 0,
      );
      fallback.sort(
        (a, b) =>
          seededRandom(product.slug + a.id) - seededRandom(product.slug + b.id),
      );
      return fallback.slice(0, 3);
    }
    return pool.slice(0, 3);
  }, [product, allProducts]);

  const [selected, setSelected] = useState<Set<string>>(
    new Set([product.id, ...picks.map((p) => p.id)]),
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allProductsInLook = [product, ...picks];
  const totalSelected = allProductsInLook
    .filter((p) => selected.has(p.id))
    .reduce((sum, p) => sum + p.price_pkr, 0);
  const fullPrice = allProductsInLook.reduce((sum, p) => sum + p.price_pkr, 0);
  const bundleSavings =
    selected.size >= 3 ? Math.round(totalSelected * 0.05) : 0;

  const addAll = () => {
    let added = 0;
    for (const p of allProductsInLook) {
      if (!selected.has(p.id)) continue;
      if (p.stock < 1) continue;
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
      added++;
    }
    if (added > 0) toast.success(`Added ${added} items to your bag`);
  };

  if (picks.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow mb-1 flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> Style it with
          </p>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Complete the look
          </h2>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Bundle total
          </p>
          <p className="font-display text-xl font-semibold">
            {formatPKR(totalSelected)}
          </p>
          {bundleSavings > 0 && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-green-700">
              +5% bundle bonus hint
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
        {allProductsInLook.map((p, i) => (
          <div key={p.id} className="relative">
            {i > 0 && (
              <div
                className="pointer-events-none absolute top-1/4 -left-3 z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-paper text-muted-foreground sm:flex"
                aria-hidden
              >
                <Plus className="h-3 w-3" />
              </div>
            )}
            <label className="block cursor-pointer">
              <Link
                href={`/product/${p.slug}`}
                className="block"
                onClick={(e) => {
                  if (i === 0) e.preventDefault();
                }}
              >
                <div
                  className={`relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-cream transition ${
                    selected.has(p.id) ? "ring-2 ring-ink" : "opacity-60"
                  }`}
                >
                  {p.images[0] && (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  )}
                  {i === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-paper">
                      This item
                    </span>
                  )}
                </div>
              </Link>
              <div className="mt-2 flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={selected.has(p.id)}
                  onChange={() => toggle(p.id)}
                  className="mt-1 h-4 w-4 shrink-0 accent-ink"
                />
                <div className="min-w-0">
                  <p className="line-clamp-2 text-xs font-medium text-ink">
                    {p.name}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold">
                    {formatPKR(p.price_pkr)}
                  </p>
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={addAll}
        disabled={selected.size === 0}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90 disabled:opacity-50 sm:w-auto sm:px-10"
      >
        Add look to bag · {formatPKR(totalSelected)}
        {totalSelected !== fullPrice && (
          <span className="text-paper/60 line-through text-[10px]">
            {formatPKR(fullPrice)}
          </span>
        )}
      </button>
    </section>
  );
}
