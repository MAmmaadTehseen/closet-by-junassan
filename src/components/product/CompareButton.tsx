"use client";

import { GitCompare, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { COMPARE_LIMIT, useCompare } from "@/lib/compare-store";
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
  const toggle = useCompare((s) => s.toggle);
  const has = useCompare((s) => s.ids.includes(productId));
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const onClick = () => {
    const added = toggle(productId);
    if (added) toast.success(`${productName} added to compare`);
    else if (!has) toast.error(`Compare full — max ${COMPARE_LIMIT}`);
    else toast.success("Removed from compare");
  };

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
          mounted && has
            ? "border-ink bg-ink text-paper"
            : "border-border text-ink hover:border-ink"
        }`}
      >
        {mounted && has ? <Check className="h-3.5 w-3.5" /> : <GitCompare className="h-3.5 w-3.5" />}
        {mounted && has ? "Comparing" : "Compare"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={mounted && has ? "Remove from compare" : "Add to compare"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
        mounted && has
          ? "border-ink bg-ink text-paper"
          : "border-border bg-paper/85 text-ink backdrop-blur hover:border-ink"
      }`}
    >
      {mounted && has ? <Check className="h-3.5 w-3.5" /> : <GitCompare className="h-3.5 w-3.5" />}
    </button>
  );
}
