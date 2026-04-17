"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { X } from "lucide-react";
import { SIZES } from "@/lib/types";
import type { CategoryDef } from "@/lib/categories";

const PRICE_RANGES = [
  { label: "All", min: "", max: "" },
  { label: "Under 1000", min: "", max: "1000" },
  { label: "1000 – 2000", min: "1000", max: "2000" },
  { label: "2000 – 3500", min: "2000", max: "3500" },
  { label: "3500+", min: "3500", max: "" },
];

export default function Filters({
  compact = false,
  categories = [],
}: {
  compact?: boolean;
  categories?: CategoryDef[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const current = useMemo(
    () => ({
      category: params.get("category") ?? "",
      size: params.get("size") ?? "",
      minPrice: params.get("minPrice") ?? "",
      maxPrice: params.get("maxPrice") ?? "",
    }),
    [params],
  );

  const hasAny =
    current.category || current.size || current.minPrice || current.maxPrice;

  const update = useCallback(
    (patch: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v) next.set(k, v);
        else next.delete(k);
      }
      router.push(`${pathname}?${next.toString()}`);
    },
    [params, router, pathname],
  );

  const clearAll = () => router.push(pathname);

  return (
    <aside className={`flex flex-col gap-8 text-sm ${compact ? "" : ""}`}>
      {hasAny && (
        <div className="flex flex-wrap gap-2">
          {current.category && (
            <ActiveChip
              label={`Category: ${current.category}`}
              onClear={() => update({ category: "" })}
            />
          )}
          {current.size && (
            <ActiveChip label={`Size: ${current.size}`} onClear={() => update({ size: "" })} />
          )}
          {(current.minPrice || current.maxPrice) && (
            <ActiveChip
              label={`Price: ${current.minPrice || "0"}–${current.maxPrice || "∞"}`}
              onClear={() => update({ minPrice: "", maxPrice: "" })}
            />
          )}
          <button
            onClick={clearAll}
            className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-ink"
          >
            Clear all
          </button>
        </div>
      )}

      <Section title="Category">
        <button onClick={() => update({ category: "" })} className={chip(current.category === "")}>
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => update({ category: c.slug })}
            className={chip(current.category === c.slug)}
          >
            {c.label}
          </button>
        ))}
      </Section>

      <Section title="Size">
        <button onClick={() => update({ size: "" })} className={chip(current.size === "")}>
          All
        </button>
        {SIZES.map((s) => (
          <button key={s} onClick={() => update({ size: s })} className={chip(current.size === s)}>
            {s}
          </button>
        ))}
      </Section>

      <Section title="Price (PKR)">
        {PRICE_RANGES.map((r) => {
          const active = current.minPrice === r.min && current.maxPrice === r.max;
          return (
            <button
              key={r.label}
              onClick={() => update({ minPrice: r.min, maxPrice: r.max })}
              className={chip(active)}
            >
              {r.label}
            </button>
          );
        })}
      </Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function ActiveChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-paper">
      {label}
      <button onClick={onClear} aria-label={`Remove ${label}`} className="rounded-full">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function chip(active: boolean) {
  return `rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
    active
      ? "border-ink bg-ink text-paper"
      : "border-border bg-paper text-ink hover:border-ink"
  }`;
}
