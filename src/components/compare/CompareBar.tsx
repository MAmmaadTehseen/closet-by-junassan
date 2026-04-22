"use client";

import { useCompare, COMPARE_LIMIT } from "@/lib/compare-store";
import { GitCompareArrows, X } from "lucide-react";

export default function CompareBar() {
  const ids = useCompare((s) => s.ids);
  const clear = useCompare((s) => s.clear);
  const openDrawer = useCompare((s) => s.openDrawer);

  if (ids.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 sm:bottom-6">
      <div className="pointer-events-auto bar-rise flex items-center gap-3 rounded-full border border-border bg-paper px-4 py-2.5 shadow-xl">
        <GitCompareArrows className="h-4 w-4 text-ink" />
        <span className="text-xs font-medium text-ink">
          {ids.length}/{COMPARE_LIMIT} to compare
        </span>
        <button
          onClick={openDrawer}
          className="rounded-full bg-ink px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-paper"
        >
          Compare
        </button>
        <button
          onClick={clear}
          aria-label="Clear compare"
          className="rounded-full p-1.5 text-muted-foreground hover:bg-cream hover:text-ink"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
