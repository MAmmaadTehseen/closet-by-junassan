import type { Product } from "./types";

export interface BundleDef {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  /** Percent discount applied when whole bundle is bought together. */
  discountPct: number;
  /** Filter function to pick bundle candidates from the full product list. */
  picker: (products: Product[]) => Product[];
}

function pick(products: Product[], filter: (p: Product) => boolean, n: number): Product[] {
  const pool = products.filter(filter);
  return pool.slice(0, n);
}

export const BUNDLES: BundleDef[] = [
  {
    slug: "weekend-casual",
    title: "The Weekend Casual",
    eyebrow: "Edit 01",
    description:
      "One tee, one bottom, one throw-on layer — everything you need for a Saturday and Sunday.",
    discountPct: 10,
    picker: (p) =>
      [
        ...pick(p, (x) => x.category === "men" && x.price_pkr < 2500, 1),
        ...pick(p, (x) => x.category === "men" && x.price_pkr >= 2500, 1),
        ...pick(p, (x) => x.category === "shoes", 1),
      ].filter(Boolean),
  },
  {
    slug: "office-starter",
    title: "The Office Starter",
    eyebrow: "Edit 02",
    description:
      "Neat, ironed, ready-to-go — a button-down, trouser pairing, and a smart bag.",
    discountPct: 12,
    picker: (p) =>
      [
        ...pick(p, (x) => x.category === "women" || x.category === "men", 2),
        ...pick(p, (x) => x.category === "bags", 1),
      ].filter(Boolean),
  },
  {
    slug: "little-explorer",
    title: "The Little Explorer",
    eyebrow: "Edit 03",
    description:
      "Tough, washable, adorable — a tee, a bottom, and a pair of sneakers for the tiny traveller.",
    discountPct: 15,
    picker: (p) =>
      [
        ...pick(p, (x) => x.category === "kids", 2),
        ...pick(p, (x) => x.category === "shoes" && x.price_pkr < 3000, 1),
      ].filter(Boolean),
  },
  {
    slug: "date-night",
    title: "The Date Night",
    eyebrow: "Edit 04",
    description:
      "One statement piece, one quiet piece, one pair of shoes that does the talking.",
    discountPct: 10,
    picker: (p) =>
      [
        ...pick(p, (x) => x.category === "women" && x.tags.includes("trending"), 1),
        ...pick(p, (x) => x.category === "women", 1),
        ...pick(p, (x) => x.category === "shoes", 1),
      ].filter(Boolean),
  },
];

export function buildBundle(def: BundleDef, products: Product[]) {
  const items = def.picker(products);
  const full = items.reduce((n, p) => n + p.price_pkr, 0);
  const final = Math.round((full * (100 - def.discountPct)) / 100);
  return { def, items, full, final, save: full - final };
}

export function buildAllBundles(products: Product[]) {
  return BUNDLES.map((b) => buildBundle(b, products)).filter((b) => b.items.length >= 2);
}
