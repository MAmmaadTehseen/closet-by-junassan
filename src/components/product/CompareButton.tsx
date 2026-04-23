"use client";

import { Scale } from "lucide-react";
import { COMPARE_LIMIT, useCompare } from "@/lib/compare-store";
import { toast } from "@/components/ui/Toaster";

export default function CompareButton({
  productId,
  productName,
  className = "",
}: {
  productId: string;
  productName?: string;
  className?: string;
}) {
  const inCompare = useCompare((s) => s.ids.includes(productId));
  const toggle = useCompare((s) => s.toggle);
  const count = useCompare((s) => s.ids.length);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inCompare && count >= COMPARE_LIMIT) {
      toast.error(`You can compare up to ${COMPARE_LIMIT} items`);
      return;
    }
    toggle(productId);
    toast.success(
      inCompare
        ? `Removed ${productName ?? "item"} from compare`
        : `Added ${productName ?? "item"} to compare`,
    );
  };

  return (
    <button
      onClick={onClick}
      aria-pressed={inCompare}
      aria-label={inCompare ? "Remove from compare" : "Add to compare"}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition focus-ring ${
        inCompare
          ? "border-ink bg-ink text-paper"
          : "border-border bg-paper/90 text-ink backdrop-blur hover:border-ink"
      } ${className}`}
    >
      <Scale className="h-3.5 w-3.5" />
      {inCompare ? "Comparing" : "Compare"}
    </button>
  );
}
