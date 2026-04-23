"use client";

import { useEffect, useState } from "react";
import { Scale, Check } from "lucide-react";
import { useCompare, COMPARE_LIMIT } from "@/lib/compare-store";
import { toast } from "@/components/ui/Toaster";

export default function CompareButton({
  productId,
  productName,
  compact = false,
}: {
  productId: string;
  productName: string;
  compact?: boolean;
}) {
  const toggle = useCompare((s) => s.toggle);
  const has = useCompare((s) => s.has(productId));
  const count = useCompare((s) => s.ids.length);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!has && count >= COMPARE_LIMIT) {
      toast.error(`You can compare up to ${COMPARE_LIMIT} items`);
      return;
    }
    const added = toggle(productId);
    toast.success(added ? `Added "${productName}" to compare` : "Removed from compare");
  };

  const active = mounted && has;

  if (compact) {
    return (
      <button
        onClick={onClick}
        aria-label={active ? "Remove from compare" : "Add to compare"}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-ink transition ${
          active ? "border-ink bg-ink text-paper" : "border-border bg-paper hover:border-ink"
        }`}
      >
        {active ? <Check className="h-3.5 w-3.5" /> : <Scale className="h-3.5 w-3.5" />}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest transition ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-border bg-paper text-ink hover:border-ink"
      }`}
    >
      {active ? <Check className="h-3.5 w-3.5" /> : <Scale className="h-3.5 w-3.5" />}
      {active ? "Comparing" : "Compare"}
    </button>
  );
}
