import { REFERRAL_DISCOUNT_PKR } from "./referral";

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

/** FRIEND-XXXXX referral codes unlock a flat Rs 300 discount. */
function resolveCoupon(code: string): Coupon | null {
  const c = code.trim().toUpperCase();
  if (COUPONS[c]) return COUPONS[c];
  if (/^FRIEND-[A-Z0-9]{3,}$/.test(c)) {
    return {
      code: c,
      label: `Rs ${REFERRAL_DISCOUNT_PKR} off (referral)`,
      apply: (s) => Math.max(0, s - REFERRAL_DISCOUNT_PKR),
    };
  }
  return null;
}

export function applyCoupon(
  code: string,
  subtotal: number,
): { ok: true; coupon: Coupon; newSubtotal: number } | { ok: false; error: string } {
  const c = resolveCoupon(code);
  if (!c) return { ok: false, error: "Invalid coupon code." };
  const newSubtotal = c.apply(subtotal);
  return { ok: true, coupon: c, newSubtotal };
}
