"use client";

import { GitCompareArrows, Check } from "lucide-react";
import { COMPARE_LIMIT, useCompare } from "@/lib/compare-store";
import { toast } from "@/components/ui/Toaster";
import type { Product } from "@/lib/types";

export default function CompareToggle({ product }: { product: Product }) {
  const ids = useCompare((s) => s.ids);
  const toggle = useCompare((s) => s.toggle);
  const openDrawer = useCompare((s) => s.openDrawer);
  const active = ids.includes(product.id);

  const onClick = () => {
    const res = toggle(product.id);
    if (res.full) {
      toast.error(`You can compare up to ${COMPARE_LIMIT} pieces at a time`);
      return;
    }
    if (res.added) toast.success("Added to compare");
  };

  return (
    <div className="inline-flex items-center">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition ${
          active
            ? "border-ink bg-ink text-paper"
            : "border-border text-ink hover:border-ink"
        }`}
      >
        {active ? (
          <Check className="h-3 w-3" />
        ) : (
          <GitCompareArrows className="h-3 w-3" />
        )}
        {active ? "In compare" : "Compare"}
      </button>
      {ids.length > 0 && (
        <button
          type="button"
          onClick={openDrawer}
          className="ml-2 text-[11px] uppercase tracking-widest text-muted-foreground underline underline-offset-2 hover:text-ink"
        >
          View {ids.length}
        </button>
      )}
    </div>
  );
}
