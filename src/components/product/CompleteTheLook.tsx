"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { toast } from "@/components/ui/Toaster";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

const BUNDLE_DISCOUNT_PCT = 10;

export default function CompleteTheLook({
  anchor,
  suggestions,
}: {
  anchor: Product;
  suggestions: Product[];
}) {
  const add = useCart((s) => s.add);
  const picks = useMemo(() => suggestions.slice(0, 3), [suggestions]);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set([anchor.id, ...picks.map((p) => p.id)]),
  );

  if (picks.length === 0) return null;

  const all: Product[] = [anchor, ...picks];
  const chosen = all.filter((p) => selected.has(p.id));
  const subtotal = chosen.reduce((n, p) => n + p.price_pkr, 0);
  const discounted = Math.round(subtotal * (1 - BUNDLE_DISCOUNT_PCT / 100));
  const saved = subtotal - discounted;

  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const addBundle = () => {
    let count = 0;
    for (const p of chosen) {
      if (p.stock <= 0) continue;
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
      count += 1;
    }
    toast.success(
      count > 0
        ? `${count} ${count === 1 ? "piece" : "pieces"} added — show the code BUNDLE${BUNDLE_DISCOUNT_PCT} at checkout`
        : "Nothing in stock to add",
    );
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Style it</p>
          <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
            Complete the look
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Hand-picked to pair with this piece. Grab them together and save{" "}
            {BUNDLE_DISCOUNT_PCT}% on the bundle.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ul className="flex gap-3 overflow-x-auto no-scrollbar lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible">
          {all.map((p, i) => {
            const isOn = selected.has(p.id);
            return (
              <li
                key={p.id}
                className="relative w-36 shrink-0 snap-start lg:w-auto"
              >
                {i < all.length - 1 && (
                  <Plus
                    aria-hidden
                    className="pointer-events-none absolute -right-2 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 translate-x-1/2 text-muted-foreground lg:block"
                  />
                )}
                <button
                  type="button"
                  onClick={() => toggle(p.id)}
                  aria-pressed={isOn}
                  className={`relative block w-full overflow-hidden rounded-2xl border text-left transition ${
                    isOn ? "border-ink" : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="relative aspect-4/5 w-full bg-cream">
                    {p.images[0] && (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="(max-width: 1024px) 144px, 22vw"
                        className="object-cover"
                      />
                    )}
                    <span
                      className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border ${
                        isOn
                          ? "border-ink bg-ink text-paper"
                          : "border-border bg-paper text-muted-foreground"
                      }`}
                    >
                      {isOn && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </div>
                  <div className="p-2.5">
                    <p className="line-clamp-1 text-xs font-medium">{p.name}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {formatPKR(p.price_pkr)}
                    </p>
                  </div>
                </button>
                <div className="mt-1 text-center">
                  <Link
                    href={`/product/${p.slug}`}
                    className="text-[11px] text-muted-foreground underline decoration-border underline-offset-2 hover:text-ink"
                  >
                    View
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-2xl border border-border bg-cream/50 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Bundle ({chosen.length} {chosen.length === 1 ? "piece" : "pieces"})
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold">
              {formatPKR(discounted)}
            </span>
            {saved > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPKR(subtotal)}
              </span>
            )}
          </div>
          {saved > 0 && (
            <p className="mt-1 text-xs font-semibold text-accent-red">
              You save {formatPKR(saved)}
            </p>
          )}
          <button
            onClick={addBundle}
            disabled={chosen.length === 0}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90 disabled:opacity-50"
          >
            <ShoppingBag className="h-4 w-4" /> Add bundle
          </button>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Mention code{" "}
            <span className="font-semibold text-ink">
              BUNDLE{BUNDLE_DISCOUNT_PCT}
            </span>{" "}
            when we call to confirm.
          </p>
        </aside>
      </div>
    </section>
  );
}
