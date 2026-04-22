"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, GitCompare, ArrowRight } from "lucide-react";
import { COMPARE_LIMIT, useCompare } from "@/lib/compare-store";
import type { Product } from "@/lib/types";

export default function CompareBar({ products }: { products: Product[] }) {
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const pathname = usePathname() ?? "/";
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (ids.length === 0) return null;
  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout") || pathname.startsWith("/compare")) {
    return null;
  }

  const items = ids
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  if (items.length === 0) return null;

  return (
    <div className="bar-rise fixed inset-x-0 bottom-16 z-30 mx-auto max-w-3xl px-3 lg:bottom-6">
      <div className="rounded-2xl border border-border bg-paper/95 p-3 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper">
              <GitCompare className="h-3.5 w-3.5" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
              Compare ({items.length}/{COMPARE_LIMIT})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clear}
              className="text-[11px] font-medium text-muted-foreground hover:text-ink"
            >
              Clear
            </button>
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper transition hover:opacity-90"
            >
              Compare
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
        <ul className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {items.map((p) => (
            <li key={p.id} className="relative shrink-0">
              <Link
                href={`/product/${p.slug}`}
                className="relative block h-16 w-14 overflow-hidden rounded-lg bg-cream"
              >
                {p.images[0] && (
                  <Image src={p.images[0]} alt={p.name} fill sizes="56px" className="object-cover" />
                )}
              </Link>
              <button
                onClick={() => remove(p.id)}
                aria-label={`Remove ${p.name} from compare`}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-paper shadow"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </li>
          ))}
          {Array.from({ length: Math.max(0, COMPARE_LIMIT - items.length) }).map((_, i) => (
            <li
              key={`slot-${i}`}
              className="flex h-16 w-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground"
            >
              <span className="text-[10px] uppercase tracking-wide">+</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
