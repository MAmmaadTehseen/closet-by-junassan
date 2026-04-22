export interface BulkTier {
  minQty: number;
  percent: number;
  label: string;
}

export const BULK_TIERS: BulkTier[] = [
  { minQty: 2, percent: 5, label: "Buy 2 → 5% off" },
  { minQty: 3, percent: 10, label: "Buy 3 → 10% off" },
  { minQty: 4, percent: 15, label: "Buy 4+ → 15% off" },
];

export interface BulkResult {
  tier: BulkTier | null;
  nextTier: BulkTier | null;
  discount: number;
  subtotalAfter: number;
}

export function calcBulkDiscount(totalQty: number, subtotal: number): BulkResult {
  let tier: BulkTier | null = null;
  for (const t of BULK_TIERS) {
    if (totalQty >= t.minQty) tier = t;
  }

  const nextTier = BULK_TIERS.find((t) => t.minQty > totalQty) ?? null;
  const discount = tier ? Math.round((subtotal * tier.percent) / 100) : 0;
  return {
    tier,
    nextTier,
    discount,
    subtotalAfter: Math.max(0, subtotal - discount),
  };
}
