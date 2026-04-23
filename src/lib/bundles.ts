import type { Product } from "./types";

export interface Bundle {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  /** 0.0 – 1.0 — 0.15 means 15% off total */
  discountPct: number;
  /** Filter to choose items from the catalogue. */
  pick: (p: Product) => boolean;
  /** Max pieces to include in the bundle preview. */
  limit: number;
  cover?: string;
}

export const BUNDLES: Bundle[] = [
  {
    slug: "weekend-out",
    title: "The Weekend Out",
    tagline: "Brunch → rooftop → late walk.",
    description: "Three pieces that cover the weekend without thinking twice. Tops, a bottom, and an accessory that tie it together.",
    discountPct: 0.15,
    limit: 3,
    pick: (p) => p.category === "women" || p.category === "bags",
    cover: "https://images.unsplash.com/photo-1520975922323-0e1b7c4c4f2a?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "office-reset",
    title: "Office Reset",
    tagline: "Monday you, upgraded.",
    description: "A polished top, a neutral bottom, and the right shoe. Curated for Pakistan’s office aesthetic.",
    discountPct: 0.12,
    limit: 3,
    pick: (p) => p.category === "men" || p.category === "shoes",
    cover: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "starter-closet",
    title: "Starter Closet",
    tagline: "5 pieces. Infinite outfits.",
    description: "Five versatile hand-picked staples. Grab it, rotate it, wear it forever.",
    discountPct: 0.2,
    limit: 5,
    pick: () => true,
    cover: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "gift-set",
    title: "The Gift Set",
    tagline: "Wrapped and ready.",
    description: "Perfect for birthdays or a spoil-yourself moment. Comes with a hand-written note.",
    discountPct: 0.1,
    limit: 2,
    pick: (p) => p.tags.includes("new") || p.tags.includes("trending"),
    cover: "https://images.unsplash.com/photo-1513708928676-cb1a6baa4c4a?auto=format&fit=crop&w=1400&q=80",
  },
];

export interface ResolvedBundle extends Bundle {
  items: Product[];
  subtotal: number;
  bundlePrice: number;
  savings: number;
}

export function resolveBundle(bundle: Bundle, products: Product[]): ResolvedBundle {
  const items = products.filter(bundle.pick).slice(0, bundle.limit);
  const subtotal = items.reduce((n, p) => n + p.price_pkr, 0);
  const bundlePrice = Math.round(subtotal * (1 - bundle.discountPct));
  return { ...bundle, items, subtotal, bundlePrice, savings: subtotal - bundlePrice };
}
