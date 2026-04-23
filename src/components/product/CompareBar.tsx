"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Scale } from "lucide-react";
import { useCompare } from "@/lib/compare-store";
import type { Product } from "@/lib/types";

export default function CompareBar({ products }: { products: Product[] }) {
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted || ids.length === 0) return null;

  const byId = new Map(products.map((p) => [p.id, p]));
  const items = ids.map((id) => byId.get(id)).filter(Boolean) as Product[];
  if (items.length === 0) return null;

  return (
    <div className="bar-rise pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6 sm:pb-5">
      <div className="pointer-events-auto mx-auto flex max-w-4xl items-center gap-3 rounded-2xl border border-border bg-paper/95 p-3 shadow-2xl backdrop-blur-md sm:gap-4 sm:p-4">
        <div className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cream sm:flex">
          <Scale className="h-4 w-4" />
        </div>
        <ul className="flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
          {items.map((p) => (
            <li key={p.id} className="relative flex-shrink-0">
              <Link
                href={`/product/${p.slug}`}
                className="relative block h-12 w-10 overflow-hidden rounded-md bg-cream sm:h-14 sm:w-12"
              >
                {p.images[0] && (
                  <Image src={p.images[0]} alt={p.name} fill sizes="48px" className="object-cover" />
                )}
              </Link>
              <button
                onClick={() => remove(p.id)}
                aria-label={`Remove ${p.name}`}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-paper shadow"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            onClick={clear}
            className="hidden rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-ink sm:inline-flex"
          >
            Clear
          </button>
          <Link
            href="/compare"
            className="rounded-full bg-ink px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-paper transition hover:opacity-90"
          >
            Compare {items.length}
          </Link>
        </div>
      </div>
    </div>
  );
}
