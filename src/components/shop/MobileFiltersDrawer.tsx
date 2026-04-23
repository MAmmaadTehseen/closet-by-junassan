"use client";

import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Drawer from "@/components/ui/Drawer";
import Filters from "./Filters";

export default function MobileFiltersDrawer({
  resultCount,
  brands = [],
}: {
  resultCount?: number;
  brands?: string[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const applyLabel = useMemo(
    () => (resultCount == null ? "Show Results" : `Show ${resultCount} Results`),
    [resultCount],
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-paper px-4 py-2 text-xs font-semibold uppercase tracking-widest lg:hidden"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
      </button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Filters & Sort"
        side="right"
        width="sm:w-[420px]"
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <Filters compact brands={brands} />
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-border bg-cream/40 p-4">
            <button
              onClick={() => {
                router.push(pathname);
                setOpen(false);
              }}
              className="rounded-full border border-ink py-3 text-xs font-semibold uppercase tracking-widest text-ink transition hover:bg-ink hover:text-paper"
            >
              Clear All
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full bg-ink py-3 text-xs font-semibold uppercase tracking-widest text-paper transition hover:opacity-90"
            >
              {applyLabel}
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
