"use client";

import { useMemo, useState } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import type { Product } from "@/lib/types";

const TITLE = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function AccessoriesView({
  products,
  subCategories,
}: {
  products: Product[];
  subCategories: string[];
}) {
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.category.toLowerCase() === active);
  }, [products, active]);

  return (
    <>
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <Tile label="All" active={active === "all"} onClick={() => setActive("all")} />
        {subCategories.map((sc) => (
          <Tile
            key={sc}
            label={TITLE(sc)}
            active={active === sc}
            onClick={() => setActive(sc)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <p className="font-display text-xl">Nothing here yet.</p>
          <p className="mt-2 text-sm">Check back soon — new pieces drop weekly.</p>
        </div>
      ) : (
        <ProductGrid products={filtered} />
      )}
    </>
  );
}

function Tile({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-24 items-center justify-center rounded-2xl border text-center transition focus-ring sm:h-28 ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-border bg-paper text-ink hover:border-ink"
      }`}
    >
      <span className="font-display text-xl font-medium tracking-tight sm:text-2xl">
        {label}
      </span>
    </button>
  );
}
