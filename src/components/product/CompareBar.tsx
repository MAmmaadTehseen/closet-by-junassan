"use client";

import { useEffect, useState } from "react";
import { GitCompareArrows, X } from "lucide-react";
import { useCompare } from "@/lib/compare-store";

export default function CompareBar() {
  const ids = useCompare((s) => s.ids);
  const clear = useCompare((s) => s.clear);
  const openDrawer = useCompare((s) => s.openDrawer);
  const drawerOpen = useCompare((s) => s.open);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted || ids.length === 0 || drawerOpen) return null;

  return (
    <div className="bar-rise fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-paper/95 px-2 py-1.5 shadow-2xl backdrop-blur md:bottom-8">
      <button
        onClick={openDrawer}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-paper transition hover:opacity-90"
      >
        <GitCompareArrows className="h-3.5 w-3.5" />
        Compare {ids.length}
      </button>
      <button
        onClick={clear}
        aria-label="Clear compare"
        className="rounded-full p-2 text-muted-foreground hover:text-accent-red"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
