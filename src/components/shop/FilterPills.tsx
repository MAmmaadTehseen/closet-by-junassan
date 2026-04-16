"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { CATEGORIES } from "@/lib/types";

const SIZE_LABELS: Record<string, string> = {
  XS: "XS", S: "S", M: "M", L: "L", XL: "XL", XXL: "XXL",
  "28": "28", "30": "30", "32": "32", "34": "34", "36": "36",
};

export default function FilterPills() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = params.get("category");
  const size = params.get("size");
  const maxPrice = params.get("maxPrice");
  const minPrice = params.get("minPrice");
  const q = params.get("q");

  const pills: { key: string; label: string }[] = [];
  if (category) {
    const cat = CATEGORIES.find((c) => c.slug === category);
    pills.push({ key: "category", label: cat?.label ?? category });
  }
  if (size) pills.push({ key: "size", label: `Size: ${SIZE_LABELS[size] ?? size}` });
  if (maxPrice) pills.push({ key: "maxPrice", label: `Under Rs ${Number(maxPrice).toLocaleString()}` });
  if (minPrice) pills.push({ key: "minPrice", label: `Over Rs ${Number(minPrice).toLocaleString()}` });
  if (q) pills.push({ key: "q", label: `"${q}"` });

  if (pills.length === 0) return null;

  const removePill = (key: string) => {
    const next = new URLSearchParams(params.toString());
    next.delete(key);
    router.push(`${pathname}?${next.toString()}`);
  };

  const clearAll = () => router.push(pathname);

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {pills.map((pill) => (
        <button
          key={pill.key}
          onClick={() => removePill(pill.key)}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-paper transition hover:opacity-80"
        >
          {pill.label}
          <X className="h-3 w-3" />
        </button>
      ))}
      {pills.length > 1 && (
        <button
          onClick={clearAll}
          className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-ink"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
