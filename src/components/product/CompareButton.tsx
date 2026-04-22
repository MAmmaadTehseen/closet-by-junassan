"use client";

import { GitCompareArrows } from "lucide-react";
import { useCompare, MAX_COMPARE_ITEMS } from "@/lib/compare-store";
import { toast } from "@/components/ui/Toaster";

export default function CompareButton({
  productId,
  productName,
  variant = "icon",
}: {
  productId: string;
  productName: string;
  variant?: "icon" | "pill";
}) {
  const active = useCompare((s) => s.ids.includes(productId));
  const toggle = useCompare((s) => s.toggle);
  const count = useCompare((s) => s.ids.length);
  const openDrawer = useCompare((s) => s.openDrawer);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!active && count >= MAX_COMPARE_ITEMS) {
      toast.error(`You can compare up to ${MAX_COMPARE_ITEMS} items.`);
      return;
    }
    const added = toggle(productId);
    if (added) {
      toast.success(`Added "${productName}" to compare`);
      if (count + 1 >= 2) setTimeout(() => openDrawer(), 250);
    } else {
      toast.success("Removed from compare");
    }
  };

  if (variant === "pill") {
    return (
      <button
        onClick={onClick}
        aria-pressed={active}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-widest transition ${
          active
            ? "border-ink bg-ink text-paper"
            : "border-border bg-paper text-ink hover:border-ink"
        }`}
      >
        <GitCompareArrows className="h-3.5 w-3.5" />
        {active ? "Comparing" : "Compare"}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "Remove from compare" : "Add to compare"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-border bg-paper/80 text-ink hover:border-ink"
      }`}
    >
      <GitCompareArrows className="h-4 w-4" />
    </button>
  );
}
