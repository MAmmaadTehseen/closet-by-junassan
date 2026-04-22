"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { toast } from "@/components/ui/Toaster";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ShopTheLook({ products }: { products: Product[] }) {
  const add = useCart((s) => s.add);
  const [selected, setSelected] = useState<Set<string>>(new Set(products.map((p) => p.id)));

  if (products.length < 2) return null;

  const activeProducts = products.filter((p) => selected.has(p.id));
  const total = activeProducts.reduce((n, p) => n + p.price_pkr, 0);
  const originalTotal = activeProducts.reduce(
    (n, p) => n + (p.original_price_pkr ?? p.price_pkr),
    0,
  );
  const savings = Math.max(0, originalTotal - total);

  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const addAll = () => {
    activeProducts.forEach((p) => {
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
    });
    toast.success(`Added ${activeProducts.length} pieces to your bag`);
  };

  const heroIdx = 0;
  const hero = products[heroIdx];

  return (
    <section className="border-b border-border bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">07 · Curator&apos;s pick</p>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Shop the look.
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              An outfit our buyer built this week. Tap any piece to toggle it — add the whole look
              in one shot.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-cream">
            {hero.images[0] && (
              <Image
                src={hero.images[0]}
                alt={hero.name}
                fill
                sizes="(max-width: 1024px) 100vw, 540px"
                className="object-cover"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-paper/70">
                  {activeProducts.length}-piece edit
                </p>
                <p className="font-display text-2xl font-semibold text-paper">
                  {formatPKR(total)}{" "}
                  {savings > 0 && (
                    <span className="text-sm font-medium text-paper/70">
                      · save {formatPKR(savings)}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={addAll}
                className="inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-ink transition hover:opacity-90"
              >
                <ShoppingBag className="h-3.5 w-3.5" /> Add the set
              </button>
            </div>
          </div>

          <ul className="space-y-3">
            {products.map((p) => {
              const on = selected.has(p.id);
              return (
                <li key={p.id}>
                  <div
                    className={`group flex items-center gap-3 rounded-2xl border p-3 transition ${
                      on ? "border-ink" : "border-border opacity-60"
                    }`}
                  >
                    <Link
                      href={`/product/${p.slug}`}
                      className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-cream"
                    >
                      {p.images[0] && (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {p.brand}
                      </p>
                      <Link
                        href={`/product/${p.slug}`}
                        className="mt-0.5 line-clamp-1 text-sm font-medium hover:underline"
                      >
                        {p.name}
                      </Link>
                      <p className="mt-1 text-xs font-semibold">{formatPKR(p.price_pkr)}</p>
                    </div>
                    <button
                      onClick={() => toggle(p.id)}
                      aria-pressed={on}
                      aria-label={on ? "Remove from look" : "Add to look"}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
                        on
                          ? "border-ink bg-ink text-paper"
                          : "border-border bg-paper text-ink hover:border-ink"
                      }`}
                    >
                      <Plus
                        className={`h-4 w-4 transition ${on ? "rotate-45" : "rotate-0"}`}
                      />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
