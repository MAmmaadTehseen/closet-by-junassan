import { siteConfig } from "./site-config";

/**
 * Deterministic referral code derived from a public order code.
 * Example: "CBJ-ABC12345" → "FRIEND-ABC12"
 */
export function referralCodeFromOrder(orderCode: string): string {
  const slug = orderCode.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(-5) || "TRIBE";
  return `FRIEND-${slug}`;
}

/** Discount value unlocked by the referral. */
export const REFERRAL_DISCOUNT_PKR = 300;

export function referralShareMessage(code: string): string {
  return `I just bought from ${siteConfig.name}! Use my code ${code} for Rs ${REFERRAL_DISCOUNT_PKR} off your first order: ${siteConfig.url}`;
}
