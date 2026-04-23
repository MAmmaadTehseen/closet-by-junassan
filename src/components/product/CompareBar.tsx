"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Scale, X } from "lucide-react";
import { useCompare, COMPARE_MAX } from "@/lib/compare-store";
import type { Product } from "@/lib/types";

export default function CompareBar({ products }: { products: Product[] }) {
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted || ids.length === 0) return null;

  const map = new Map(products.map((p) => [p.id, p]));
  const chosen = ids.map((id) => map.get(id)).filter((p): p is Product => !!p);
  if (chosen.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[60] flex justify-center px-3 sm:bottom-4">
      <div className="pointer-events-auto bar-rise w-full max-w-3xl rounded-2xl border border-border bg-paper/95 px-4 py-3 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Scale className="h-4 w-4 text-ink" />
            Compare · {chosen.length}/{COMPARE_MAX}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clear}
              className="text-[11px] uppercase tracking-wide text-muted-foreground hover:text-ink"
            >
              Clear
            </button>
            <Link
              href="/compare"
              className="rounded-full bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-paper hover:opacity-90"
            >
              Compare now →
            </Link>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {chosen.map((p) => (
            <div key={p.id} className="relative flex-shrink-0">
              <div className="relative h-16 w-14 overflow-hidden rounded-lg bg-cream sm:h-20 sm:w-16">
                {p.images[0] && (
                  <Image src={p.images[0]} alt={p.name} fill sizes="64px" className="object-cover" />
                )}
              </div>
              <button
                onClick={() => remove(p.id)}
                aria-label={`Remove ${p.name}`}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-paper shadow hover:bg-accent-red"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
