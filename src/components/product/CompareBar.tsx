"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Scale, X } from "lucide-react";
import { useCompare } from "@/lib/compare-store";

export default function CompareBar() {
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted || ids.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-paper/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Scale className="h-4 w-4" />
          <span className="font-semibold">
            {ids.length} {ids.length === 1 ? "item" : "items"} to compare
          </span>
          <span className="hidden text-muted-foreground sm:inline">· pick up to 4</span>
        </div>
        <div className="flex items-center gap-2">
          {ids.map((id) => (
            <button
              key={id}
              onClick={() => remove(id)}
              title="Remove"
              className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink hover:border-ink"
            >
              <span className="max-w-16 truncate">{id.slice(0, 6)}</span>
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            onClick={clear}
            className="hidden text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-ink sm:inline-flex"
          >
            Clear
          </button>
          <Link
            href="/compare"
            className="inline-flex items-center gap-1 rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-wide text-paper hover:opacity-90"
          >
            Compare
          </Link>
        </div>
      </div>
    </div>
  );
}
