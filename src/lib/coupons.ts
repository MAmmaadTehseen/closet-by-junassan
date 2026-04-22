export interface Coupon {
  code: string;
  label: string;
  apply: (subtotal: number) => number;
  kind?: "discount" | "gift-card";
}

const COUPONS: Record<string, Coupon> = {
  FLAT200: {
    code: "FLAT200",
    label: "Rs 200 off",
    apply: (s) => Math.max(0, s - 200),
    kind: "discount",
  },
  NEW10: {
    code: "NEW10",
    label: "10% off (first order)",
    apply: (s) => Math.round(s * 0.9),
    kind: "discount",
  },
  BUNDLE10: {
    code: "BUNDLE10",
    label: "10% bundle discount",
    apply: (s) => Math.round(s * 0.9),
    kind: "discount",
  },
  FIRST10: {
    code: "FIRST10",
    label: "10% off — welcome back",
    apply: (s) => Math.round(s * 0.9),
    kind: "discount",
  },
};

/**
 * Gift cards use a fixed prefix + a 4-digit suffix encoding the value in hundreds of rupees.
 * Example: GIFT-0500 = Rs 500 gift card. Handy for manually-issued vouchers.
 */
const GIFT_RE = /^GIFT-?(\d{3,5})$/i;

function parseGiftCard(rawCode: string): Coupon | null {
  const m = GIFT_RE.exec(rawCode.trim());
  if (!m) return null;
  const amount = parseInt(m[1], 10) * 100;
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100_000) return null;
  const code = `GIFT-${m[1].padStart(4, "0")}`;
  return {
    code,
    label: `Gift card — Rs ${amount.toLocaleString("en-PK")}`,
    apply: (s) => Math.max(0, s - amount),
    kind: "gift-card",
  };
}

export function applyCoupon(
  code: string,
  subtotal: number,
): { ok: true; coupon: Coupon; newSubtotal: number } | { ok: false; error: string } {
  const raw = code.trim();
  if (!raw) return { ok: false, error: "Enter a coupon or gift card." };
  const upper = raw.toUpperCase();

  const gift = parseGiftCard(upper);
  if (gift) {
    return { ok: true, coupon: gift, newSubtotal: gift.apply(subtotal) };
  }

  const c = COUPONS[upper];
  if (!c) return { ok: false, error: "Invalid coupon code." };
  return { ok: true, coupon: c, newSubtotal: c.apply(subtotal) };
}
