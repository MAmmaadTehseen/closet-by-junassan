export interface Coupon {
  code: string;
  label: string;
  apply: (subtotal: number) => number;
}

const COUPONS: Record<string, Coupon> = {
  FLAT200: {
    code: "FLAT200",
    label: "Rs 200 off",
    apply: (s) => Math.max(0, s - 200),
  },
  NEW10: {
    code: "NEW10",
    label: "10% off (first order)",
    apply: (s) => Math.round(s * 0.9),
  },
  SHIPFREE: {
    code: "SHIPFREE",
    label: "Free shipping bonus",
    apply: (s) => Math.max(0, s - 250),
  },
  SPIN500: {
    code: "SPIN500",
    label: "Rs 500 off (spin reward)",
    apply: (s) => Math.max(0, s - 500),
  },
  GIFT: {
    code: "GIFT",
    label: "Mystery gift in your bag",
    apply: (s) => s, // No discount, but flag a gift
  },
  REFER15: {
    code: "REFER15",
    label: "15% off — referral",
    apply: (s) => Math.round(s * 0.85),
  },
};

export function applyCoupon(
  code: string,
  subtotal: number,
): { ok: true; coupon: Coupon; newSubtotal: number } | { ok: false; error: string } {
  const c = COUPONS[code.trim().toUpperCase()];
  if (!c) return { ok: false, error: "Invalid coupon code." };
  const newSubtotal = c.apply(subtotal);
  return { ok: true, coupon: c, newSubtotal };
}
