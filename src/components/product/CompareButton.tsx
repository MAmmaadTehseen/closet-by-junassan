"use client";

import { Scale } from "lucide-react";
import { useCompare } from "@/lib/compare-store";
import { toast } from "@/components/ui/Toaster";

export default function CompareButton({
  productId,
  productName,
  className = "",
}: {
  productId: string;
  productName: string;
  className?: string;
}) {
  const inList = useCompare((s) => s.ids.includes(productId));
  const toggle = useCompare((s) => s.toggle);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = toggle(productId);
    if (res.full) {
      toast.error(`Compare full — remove one to add “${productName}”.`);
      return;
    }
    toast.success(
      res.added ? `Added “${productName}” to compare.` : `Removed “${productName}” from compare.`,
    );
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={inList}
      aria-label={inList ? "Remove from compare" : "Add to compare"}
      className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-paper/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-ink shadow-sm backdrop-blur transition hover:bg-ink hover:text-paper focus-ring ${
        inList ? "bg-ink text-paper" : ""
      } ${className}`}
    >
      <Scale className="h-3.5 w-3.5" />
      {inList ? "In compare" : "Compare"}
    </button>
  );
}
