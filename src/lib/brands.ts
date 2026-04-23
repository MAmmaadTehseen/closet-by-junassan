import type { Product } from "./types";

export interface BrandSummary {
  name: string;
  slug: string;
  count: number;
  minPrice: number;
  cover: string | null;
}

export function brandSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Group products by brand and return a sorted summary list. */
export function summariseBrands(products: Product[]): BrandSummary[] {
  const map = new Map<string, BrandSummary>();
  for (const p of products) {
    const key = p.brand;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      existing.minPrice = Math.min(existing.minPrice, p.price_pkr);
      if (!existing.cover) existing.cover = p.images[0] ?? null;
    } else {
      map.set(key, {
        name: p.brand,
        slug: brandSlug(p.brand),
        count: 1,
        minPrice: p.price_pkr,
        cover: p.images[0] ?? null,
      });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
