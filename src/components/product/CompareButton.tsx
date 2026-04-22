"use client";

import { useEffect, useState } from "react";
import { GitCompare, Check } from "lucide-react";
import { useCompare } from "@/lib/compare-store";
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
  const toggle = useCompare((s) => s.toggle);
  const ids = useCompare((s) => s.ids);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const active = mounted && ids.includes(productId);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = toggle(productId);
    if (res.full) {
      toast.error("Compare full — remove one to add another");
      return;
    }
    toast.success(
      res.added
        ? `Added to compare${productName ? ` — ${productName}` : ""}`
        : "Removed from compare",
    );
  };

  return (
    <button
      onClick={onClick}
      aria-label={active ? "Remove from compare" : "Add to compare"}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-paper/95 shadow-sm backdrop-blur transition hover:scale-105 ${className}`}
    >
      {active ? (
        <Check className="h-4 w-4 text-ink" />
      ) : (
        <GitCompare className="h-4 w-4 text-ink" />
      )}
    </button>
  );
}
