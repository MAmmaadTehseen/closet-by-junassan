"use client";

import { useEffect, useState } from "react";
import { Scale } from "lucide-react";
import { useCompare, COMPARE_MAX } from "@/lib/compare-store";
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
  const has = useCompare((s) => s.has(productId));
  const toggle = useCompare((s) => s.toggle);
  const isFull = useCompare((s) => s.ids.length >= COMPARE_MAX);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!has && isFull) {
      toast.error(`You can compare up to ${COMPARE_MAX} pieces`);
      return;
    }
    const added = toggle(productId);
    toast.success(added ? `Added "${productName}" to compare` : "Removed from compare");
  };

  const active = mounted && has;

  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "Remove from compare" : "Add to compare"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition focus-ring ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-border bg-paper/95 text-ink hover:border-ink"
      } ${className}`}
    >
      <Scale className="h-4 w-4" />
    </button>
  );
}
