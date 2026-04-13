"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { CATEGORIES, SIZES } from "@/lib/types";

const PRICE_RANGES = [
  { label: "All", min: "", max: "" },
  { label: "Under 1000", min: "", max: "1000" },
  { label: "1000 – 2000", min: "1000", max: "2000" },
  { label: "2000 – 3500", min: "2000", max: "3500" },
  { label: "3500+", min: "3500", max: "" },
];

export default function Filters() {
  const router = useRouter();
  const params = useSearchParams();

  const current = {
    category: params.get("category") ?? "",
    size: params.get("size") ?? "",
    minPrice: params.get("minPrice") ?? "",
    maxPrice: params.get("maxPrice") ?? "",
  };

  const update = useCallback(
    (patch: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v) next.set(k, v);
        else next.delete(k);
      }
      router.push(`/shop?${next.toString()}`);
    },
    [params, router],
  );

  return (
    <aside className="flex flex-col gap-8 text-sm">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Category
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => update({ category: "" })}
            className={chip(current.category === "")}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => update({ category: c.slug })}
              className={chip(current.category === c.slug)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Size
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => update({ size: "" })}
            className={chip(current.size === "")}
          >
            All
          </button>
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => update({ size: s })}
              className={chip(current.size === s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Price (PKR)
        </h3>
        <div className="flex flex-wrap gap-2">
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
        </div>
      </div>
    </aside>
  );
}

function chip(active: boolean) {
  return `rounded-full border px-3 py-1.5 text-xs font-medium transition ${
    active
      ? "border-foreground bg-foreground text-background"
      : "border-border bg-background text-foreground hover:border-foreground"
  }`;
}
