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
