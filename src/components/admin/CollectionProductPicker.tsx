"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, GripVertical, Plus, Search, X } from "lucide-react";

interface PickerProduct {
  id: string;
  name: string;
  brand: string;
  image: string;
  category: string;
}

export default function CollectionProductPicker({
  allProducts,
  initialIds,
}: {
  allProducts: PickerProduct[];
  initialIds: string[];
}) {
  const byId = useMemo(() => new Map(allProducts.map((p) => [p.id, p])), [allProducts]);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [query, setQuery] = useState("");

  const selected = selectedIds.map((id) => byId.get(id)).filter((p): p is PickerProduct => !!p);
  const selectedSet = new Set(selectedIds);

  const candidates = useMemo(() => {
    const term = query.trim().toLowerCase();
    return allProducts
      .filter((p) => !selectedSet.has(p.id))
      .filter((p) => {
        if (!term) return true;
        return (
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
        );
      })
      .slice(0, 60);
  }, [allProducts, query, selectedSet]);

  const add = (id: string) => setSelectedIds((ids) => [...ids, id]);
  const remove = (id: string) => setSelectedIds((ids) => ids.filter((x) => x !== id));
  const move = (id: string, dir: -1 | 1) => {
    setSelectedIds((ids) => {
      const i = ids.indexOf(id);
      if (i < 0) return ids;
      const j = i + dir;
      if (j < 0 || j >= ids.length) return ids;
      const next = [...ids];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* Hidden inputs so server action receives the ordered ids */}
      {selectedIds.map((id) => (
        <input key={id} type="hidden" name="product_ids" value={id} />
      ))}

      {/* Selected column */}
      <div className="rounded-xl border border-border bg-cream/30 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            In this collection
          </p>
          <span className="rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-semibold text-paper">
            {selected.length}
          </span>
        </div>

        {selected.length === 0 ? (
          <p className="py-12 text-center text-xs text-muted-foreground">
            No products yet. Pick some from the right →
          </p>
        ) : (
          <ul className="space-y-2">
            {selected.map((p, i) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-paper p-2"
              >
                <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="w-6 shrink-0 text-center text-[10px] font-semibold text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-cream">
                  {p.image && (
                    <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium">{p.name}</p>
                  <p className="line-clamp-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {p.brand} · {p.category}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(p.id, -1)}
                    disabled={i === 0}
                    aria-label="Move up"
                    className="rounded p-1 text-muted-foreground hover:bg-cream disabled:opacity-30"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(p.id, 1)}
                    disabled={i === selected.length - 1}
                    aria-label="Move down"
                    className="rounded p-1 text-muted-foreground hover:bg-cream disabled:opacity-30"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    aria-label="Remove"
                    className="rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-accent-red"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Candidates column */}
      <div className="rounded-xl border border-border bg-paper p-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          All products
        </p>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, brand, category…"
            className="w-full rounded-full border border-border bg-paper py-2 pl-9 pr-3 text-sm focus:border-ink focus:outline-none"
          />
        </div>
        <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
          {candidates.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-paper p-2"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-cream">
                {p.image && (
                  <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm">{p.name}</p>
                <p className="line-clamp-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {p.brand} · {p.category}
                </p>
              </div>
              <button
                type="button"
                onClick={() => add(p.id)}
                aria-label="Add"
                className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-paper hover:opacity-90"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </li>
          ))}
          {candidates.length === 0 && (
            <p className="py-8 text-center text-xs text-muted-foreground">
              {query ? "No matches." : "All products are in this collection."}
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
