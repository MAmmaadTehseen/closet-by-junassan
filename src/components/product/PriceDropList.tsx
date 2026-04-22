"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BellRing, X, TrendingDown } from "lucide-react";
import { usePriceDrop } from "@/lib/price-drop-store";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function PriceDropList({ allProducts }: { allProducts: Product[] }) {
  const watches = usePriceDrop((s) => s.watches);
  const remove = usePriceDrop((s) => s.remove);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const rows = useMemo(() => {
    if (!mounted) return [];
    return watches
      .map((w) => ({ watch: w, product: allProducts.find((p) => p.id === w.id) }))
      .filter((r): r is { watch: typeof watches[number]; product: Product } => !!r.product);
  }, [watches, allProducts, mounted]);

  if (!mounted || rows.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <p className="eyebrow">Watching for a drop</p>
          <h2 className="mt-1 font-display text-2xl font-semibold">Price alerts</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          We&apos;ll WhatsApp you the moment it gets cheaper.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {rows.map(({ watch, product }) => {
          const dropped = product.price_pkr < watch.capturedPrice;
          const delta = watch.capturedPrice - product.price_pkr;
          return (
            <li
              key={watch.id}
              className="flex gap-4 rounded-2xl border border-border bg-paper p-4"
            >
              <Link
                href={`/product/${product.slug}`}
                className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-cream"
              >
                {product.images[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  href={`/product/${product.slug}`}
                  className="line-clamp-1 text-sm font-medium hover:underline"
                >
                  {product.name}
                </Link>
                <div className="mt-1 flex items-baseline gap-2 text-sm">
                  <span className="font-semibold">{formatPKR(product.price_pkr)}</span>
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPKR(watch.capturedPrice)}
                  </span>
                </div>
                {dropped ? (
                  <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                    <TrendingDown className="h-3 w-3" /> Dropped by{" "}
                    {formatPKR(delta)}
                  </p>
                ) : (
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <BellRing className="h-3 w-3" /> Watching
                  </p>
                )}
              </div>
              <button
                onClick={() => remove(watch.id)}
                aria-label="Stop watching"
                className="shrink-0 self-start rounded-full p-1.5 text-muted-foreground hover:bg-cream hover:text-accent-red"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
