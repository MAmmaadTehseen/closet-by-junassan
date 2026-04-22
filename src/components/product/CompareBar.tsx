"use client";

import Link from "next/link";
import Image from "next/image";
import { X, GitCompare, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useCompare } from "@/lib/compare-store";
import type { Product } from "@/lib/types";

export default function CompareBar({ products }: { products: Product[] }) {
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted || dismissed || ids.length === 0) return null;

  const items = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  if (items.length === 0) return null;

  return (
    <div className="bar-rise fixed inset-x-2 bottom-2 z-[55] mx-auto max-w-3xl rounded-2xl border border-border bg-paper/95 p-3 shadow-2xl backdrop-blur sm:inset-x-4 sm:bottom-4 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper">
            <GitCompare className="h-4 w-4" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest">
            Compare ({items.length})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              clear();
              setDismissed(true);
            }}
            className="text-[11px] uppercase tracking-widest text-muted-foreground hover:text-ink"
          >
            Clear
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="rounded-full p-1.5 hover:bg-cream"
            aria-label="Hide compare bar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {items.map((p) => (
          <div
            key={p.id}
            className="group relative aspect-square overflow-hidden rounded-lg bg-cream"
          >
            {p.images[0] && (
              <Image
                src={p.images[0]}
                alt={p.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            )}
            <button
              onClick={() => remove(p.id)}
              aria-label="Remove from compare"
              className="absolute right-1 top-1 rounded-full bg-paper/95 p-0.5 opacity-0 transition group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {Array.from({ length: Math.max(0, 2 - items.length) }).map((_, i) => (
          <div
            key={`ph-${i}`}
            className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-border text-[10px] uppercase tracking-widest text-muted-foreground"
          >
            Add +
          </div>
        ))}
      </div>
      <Link
        href="/compare"
        onClick={() => setDismissed(true)}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper"
      >
        Compare now <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
