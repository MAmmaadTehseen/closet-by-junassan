"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
import { useUi } from "@/lib/ui-store";
import { useKeyboard } from "@/lib/hooks/use-keyboard";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function SearchPalette({ products }: { products: Product[] }) {
  const open = useUi((s) => s.searchOpen);
  const openSearch = useUi((s) => s.openSearch);
  const closeSearch = useUi((s) => s.closeSearch);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboard((e) => {
    const target = e.target as HTMLElement | null;
    const inField = target && /^(INPUT|TEXTAREA)$/.test(target.tagName);
    if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (open) closeSearch();
      else openSearch();
    } else if (e.key === "/" && !open && !inField) {
      e.preventDefault();
      openSearch();
    }
  });

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return products.slice(0, 6);
    return products
      .filter((p) =>
        [p.name, p.brand, p.category, p.description].some((s) =>
          s.toLowerCase().includes(needle),
        ),
      )
      .slice(0, 8);
  }, [q, products]);

  // Top brands by stock count for the empty state.
  const topBrands = useMemo(() => {
    const tally: Record<string, number> = {};
    for (const p of products) tally[p.brand] = (tally[p.brand] ?? 0) + 1;
    return Object.entries(tally)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name]) => name);
  }, [products]);

  const TRENDING = ["denim", "linen", "silk", "white shirt", "sneakers", "tote bag"];

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setActive(0), [q]);

  if (!open) return null;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeSearch();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
    if (e.key === "Enter" && results[active]) {
      window.location.href = `/product/${results[active].slug}`;
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center px-4 pt-[8vh]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/60 fade-in" onClick={closeSearch} aria-hidden />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-paper shadow-2xl fade-in">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search products, brands, categories…"
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
            ESC
          </kbd>
          <button onClick={closeSearch} aria-label="Close" className="rounded-full p-1 hover:bg-cream sm:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        {!q && (
          <div className="border-b border-border px-5 py-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Trending searches
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TRENDING.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setQ(t)}
                  className="rounded-full border border-border bg-paper px-3 py-1 text-xs hover:border-ink"
                >
                  {t}
                </button>
              ))}
            </div>
            {topBrands.length > 0 && (
              <>
                <p className="mb-2 mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Top brands
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {topBrands.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setQ(b)}
                      className="rounded-full border border-border bg-paper px-3 py-1 text-xs hover:border-ink"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="max-h-[60vh] overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              No results. Try another keyword.
            </p>
          ) : (
            <ul className="py-2">
              {results.map((p, i) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.slug}`}
                    onClick={closeSearch}
                    onMouseEnter={() => setActive(i)}
                    className={`flex items-center gap-4 px-5 py-3 transition ${
                      active === i ? "bg-cream" : "hover:bg-cream/60"
                    }`}
                  >
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-cream">
                      {p.images[0] && (
                        <Image src={p.images[0]} alt="" fill sizes="56px" className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        {p.brand}
                      </p>
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{formatPKR(p.price_pkr)}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-cream/40 px-5 py-3 text-[11px] text-muted-foreground">
          <span>
            <kbd className="rounded border border-border bg-paper px-1.5 py-0.5">↑</kbd>{" "}
            <kbd className="rounded border border-border bg-paper px-1.5 py-0.5">↓</kbd> navigate
          </span>
          <span>
            <kbd className="rounded border border-border bg-paper px-1.5 py-0.5">↵</kbd> open
          </span>
          <span className="hidden sm:inline">
            <kbd className="rounded border border-border bg-paper px-1.5 py-0.5">⌘</kbd>
            <kbd className="ml-1 rounded border border-border bg-paper px-1.5 py-0.5">K</kbd> toggle
          </span>
        </div>
      </div>
    </div>
  );
}
