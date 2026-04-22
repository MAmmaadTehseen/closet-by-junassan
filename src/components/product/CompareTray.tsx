"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { X, Scale } from "lucide-react";
import { useCompare } from "@/lib/compare-store";
import type { Product } from "@/lib/types";

export default function CompareTray({ products }: { products: Product[] }) {
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted || ids.length === 0) return null;

  const items = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  if (items.length === 0) return null;

  return (
    <div className="bar-rise pointer-events-auto fixed inset-x-2 bottom-2 z-30 mx-auto max-w-3xl rounded-2xl border border-border bg-paper/95 p-3 shadow-2xl backdrop-blur-md sm:inset-x-4 sm:bottom-4">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">
          <Scale className="h-3.5 w-3.5" /> Compare ({items.length})
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={clear}
            className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent-red"
          >
            Clear
          </button>
          <Link
            href="/compare"
            className="rounded-full bg-ink px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90"
          >
            Compare now
          </Link>
        </div>
      </div>
      <ul className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
        {items.map((p) => (
          <li key={p.id} className="relative flex shrink-0 items-center gap-2 rounded-xl border border-border bg-paper p-1.5 pr-7">
            <div className="relative h-10 w-10 overflow-hidden rounded-md bg-cream">
              {p.images[0] && (
                <Image src={p.images[0]} alt={p.name} fill sizes="40px" className="object-cover" />
              )}
            </div>
            <span className="line-clamp-1 max-w-[120px] text-xs">{p.name}</span>
            <button
              onClick={() => remove(p.id)}
              aria-label="Remove"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-cream hover:text-accent-red"
            >
              <X className="h-3 w-3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
