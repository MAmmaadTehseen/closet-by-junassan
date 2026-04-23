"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CategoryDef } from "@/lib/categories";

/**
 * Quick visual category filter strip for the shop page.
 * Tapping a chip toggles the `category` query param (sticky URL state).
 */
export default function CategoryChips({ categories }: { categories: CategoryDef[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const active = sp.get("category");

  const setCategory = (slug: string | null) => {
    const params = new URLSearchParams(sp.toString());
    if (slug && slug !== active) params.set("category", slug);
    else params.delete("category");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto no-scrollbar pb-1">
      <button
        onClick={() => setCategory(null)}
        className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
          !active ? "bg-ink text-paper" : "border border-border bg-paper text-ink hover:border-ink"
        }`}
      >
        All
      </button>
      {categories.map((c) => {
        const isActive = active === c.slug;
        return (
          <button
            key={c.slug}
            onClick={() => setCategory(c.slug)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
              isActive
                ? "bg-ink text-paper"
                : "border border-border bg-paper text-ink hover:border-ink"
            }`}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
