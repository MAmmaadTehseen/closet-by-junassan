import { seededRandom } from "./format";
import type { Product } from "./types";

/**
 * Picks up to `count` products from categories other than the anchor product's,
 * deterministically (seeded by the anchor's slug).
 */
export function completeTheLook(
  anchor: Product,
  pool: Product[],
  count = 3,
): Product[] {
  const others = pool.filter(
    (p) => p.slug !== anchor.slug && p.category !== anchor.category && p.stock > 0,
  );
  if (others.length === 0) return [];

  const byCategory = new Map<string, Product[]>();
  for (const p of others) {
    const arr = byCategory.get(p.category) ?? [];
    arr.push(p);
    byCategory.set(p.category, arr);
  }

  const cats = [...byCategory.keys()].sort();
  const picks: Product[] = [];
  let i = 0;
  while (picks.length < count && cats.length > 0) {
    const cat = cats[i % cats.length];
    const items = byCategory.get(cat)!;
    const idx = Math.floor(seededRandom(`${anchor.slug}-${cat}-${i}`) * items.length);
    const candidate = items[idx];
    if (candidate && !picks.includes(candidate)) picks.push(candidate);
    i++;
    if (i > 30) break;
  }
  return picks;
}
