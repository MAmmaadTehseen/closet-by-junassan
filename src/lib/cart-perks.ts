import type { CartItem } from "./types";

export interface PerkTier {
  threshold: number;
  label: string;
  reward: string;
}

/** Spend-tier rewards, ordered ascending. The highest unlocked tier wins. */
export const PERK_TIERS: PerkTier[] = [
  { threshold: 2500, label: "Free gift packaging", reward: "Gift wrap unlocked" },
  { threshold: 5000, label: "Free priority dispatch", reward: "Priority dispatch unlocked" },
  { threshold: 8000, label: "Free returns for 7 days", reward: "7-day returns unlocked" },
];

export interface CartPerks {
  subtotal: number;
  savings: number;
  savingsPct: number;
  nextTier: PerkTier | null;
  unlocked: PerkTier[];
  toNextPct: number;
  toNext: number;
}

export function calcCartPerks(items: CartItem[], allOriginals: Record<string, number>): CartPerks {
  let subtotal = 0;
  let originalTotal = 0;
  for (const it of items) {
    subtotal += it.price_pkr * it.quantity;
    const orig = allOriginals[it.id];
    originalTotal += (orig && orig > it.price_pkr ? orig : it.price_pkr) * it.quantity;
  }
  const savings = Math.max(0, originalTotal - subtotal);
  const savingsPct = originalTotal > 0 ? Math.round((savings / originalTotal) * 100) : 0;

  const unlocked = PERK_TIERS.filter((t) => subtotal >= t.threshold);
  const nextTier = PERK_TIERS.find((t) => subtotal < t.threshold) ?? null;
  const toNext = nextTier ? nextTier.threshold - subtotal : 0;
  const toNextPct = nextTier ? Math.min(100, Math.round((subtotal / nextTier.threshold) * 100)) : 100;

  return { subtotal, savings, savingsPct, nextTier, unlocked, toNextPct, toNext };
}
