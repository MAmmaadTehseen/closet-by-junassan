"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { X } from "lucide-react";
import { SIZES } from "@/lib/types";

const PRICE_RANGES = [
  { label: "All", min: "", max: "" },
  { label: "Under 1000", min: "", max: "1000" },
  { label: "1000 – 2000", min: "1000", max: "2000" },
  { label: "2000 – 3500", min: "2000", max: "3500" },
  { label: "3500+", min: "3500", max: "" },
];

const GENDERS = [
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Kids", value: "kids" },
];

const TYPES = [
  { label: "Clothing", value: "clothing" },
  { label: "Shoes", value: "shoes" },
  { label: "Accessories", value: "accessories" },
];

export default function Filters({
  compact = false,
  brands = [],
}: {
  compact?: boolean;
  brands?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const current = useMemo(
    () => ({
      gender: params.get("gender") ?? "",
      type: params.get("type") ?? "",
      brand: params.get("brand") ?? "",
      size: params.get("size") ?? "",
      minPrice: params.get("minPrice") ?? "",
      maxPrice: params.get("maxPrice") ?? "",
    }),
    [params],
  );

  const hasAny =
    current.gender ||
    current.type ||
    current.brand ||
    current.size ||
    current.minPrice ||
    current.maxPrice;

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
          {current.gender && (
            <ActiveChip
              label={`Gender: ${current.gender}`}
              onClear={() => update({ gender: "" })}
            />
          )}
          {current.type && (
            <ActiveChip label={`Type: ${current.type}`} onClear={() => update({ type: "" })} />
          )}
          {current.brand && (
            <ActiveChip label={`Brand: ${current.brand}`} onClear={() => update({ brand: "" })} />
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

      <Section title="Gender">
        <button onClick={() => update({ gender: "" })} className={chip(current.gender === "")}>
          All
        </button>
        {GENDERS.map((g) => (
          <button
            key={g.value}
            onClick={() => update({ gender: g.value })}
            className={chip(current.gender === g.value)}
          >
            {g.label}
          </button>
        ))}
      </Section>

      <Section title="Type">
        <button onClick={() => update({ type: "" })} className={chip(current.type === "")}>
          All
        </button>
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => update({ type: t.value })}
            className={chip(current.type === t.value)}
          >
            {t.label}
          </button>
        ))}
      </Section>

      {brands.length > 0 && (
        <Section title="Brand">
          <button onClick={() => update({ brand: "" })} className={chip(current.brand === "")}>
            All
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => update({ brand: b })}
              className={chip(current.brand === b)}
            >
              {b}
            </button>
          ))}
        </Section>
      )}

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
