"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Scale, X, ArrowRight } from "lucide-react";
import { useCompare } from "@/lib/compare-store";
import type { Product } from "@/lib/types";

export default function CompareBar({ products }: { products: Product[] }) {
  const [mounted, setMounted] = useState(false);
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted || ids.length === 0) return null;

  const selected = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-paper/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider">
          <Scale className="h-3.5 w-3.5" />
          <span>Compare · {ids.length}/4</span>
        </div>

        <div className="flex flex-1 items-center gap-2 overflow-x-auto">
          {selected.map((p) => (
            <div
              key={p.id}
              className="relative flex-none rounded-lg border border-border bg-cream"
            >
              <Image
                src={p.images[0]}
                alt={p.name}
                width={48}
                height={60}
                className="h-12 w-10 rounded-lg object-cover"
              />
              <button
                onClick={() => remove(p.id)}
                aria-label="Remove"
                className="absolute -right-1.5 -top-1.5 rounded-full bg-ink p-0.5 text-paper"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={clear}
          className="hidden text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-ink sm:inline"
        >
          Clear
        </button>
        <Link
          href="/compare"
          className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-paper"
        >
          Compare
          <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
