"use client";

import { useEffect, useState } from "react";
import { Scale, Check } from "lucide-react";
import { useCompare, MAX_COMPARE } from "@/lib/compare-store";
import { toast } from "@/components/ui/Toaster";

export default function CompareButton({
  productId,
  className = "",
}: {
  productId: string;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const ids = useCompare((s) => s.ids);
  const toggle = useCompare((s) => s.toggle);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const active = mounted && ids.includes(productId);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!active && ids.length >= MAX_COMPARE) {
      toast.info(`Compare is full — max ${MAX_COMPARE} items`);
      return;
    }
    toggle(productId);
    toast.success(active ? "Removed from compare" : "Added to compare");
  };

  return (
    <button
      onClick={onClick}
      aria-label={active ? "Remove from compare" : "Add to compare"}
      className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-paper/90 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur transition hover:bg-paper ${className}`}
    >
      {active ? <Check className="h-3 w-3" /> : <Scale className="h-3 w-3" />}
      {active ? "In compare" : "Compare"}
    </button>
  );
}
