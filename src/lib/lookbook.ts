import type { Product } from "./types";

export interface Look {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  cover: string;
  productSlugs: string[];
  palette: string; // tailwind bg class
}

const LOOKS: Look[] = [
  {
    slug: "sunday-errands",
    title: "Sunday Errands",
    eyebrow: "Edit 01 · Off-duty",
    description:
      "Relaxed denim, a broken-in tee and a bag that carries everything. The uniform for slow mornings.",
    cover:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    productSlugs: [],
    palette: "bg-[#efe8dc]",
  },
  {
    slug: "karachi-nights",
    title: "Karachi Nights",
    eyebrow: "Edit 02 · Out on the strip",
    description:
      "Monochrome pieces, sharp silhouettes, and shoes made for the seaside wind. Dress up, stay cool.",
    cover:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    productSlugs: [],
    palette: "bg-[#1c1917]",
  },
  {
    slug: "campus-capsule",
    title: "Campus Capsule",
    eyebrow: "Edit 03 · Back to class",
    description:
      "A rotation of 5 pieces that work for 5 days. Think: one jacket, two shirts, two bottoms.",
    cover:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    productSlugs: [],
    palette: "bg-[#d8cfc0]",
  },
  {
    slug: "weekend-wedding",
    title: "Weekend Wedding",
    eyebrow: "Edit 04 · Mehndi season",
    description:
      "Pieces that photograph well, feel soft, and let you eat the biryani without regret.",
    cover:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    productSlugs: [],
    palette: "bg-[#e8ddc9]",
  },
];

/**
 * Builds the lookbook by assigning real products to each look from a shared
 * pool. Deterministic — same products will always map to the same look.
 */
export function buildLookbook(products: Product[]): Look[] {
  if (products.length === 0) return LOOKS;

  const pool = [...products];
  const perLook = 3;
  const out: Look[] = [];

  for (let i = 0; i < LOOKS.length; i++) {
    const base = LOOKS[i];
    const picked: string[] = [];
    for (let k = 0; k < perLook && pool.length > 0; k++) {
      const idx = (i * perLook + k) % pool.length;
      picked.push(pool[idx].slug);
    }
    out.push({ ...base, productSlugs: picked });
  }

  return out;
}

export function findLook(slug: string): Look | undefined {
  return LOOKS.find((l) => l.slug === slug);
}
