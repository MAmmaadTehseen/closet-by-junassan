import "server-only";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";

/** Points earned per rupee spent. */
export const POINTS_PER_RUPEE = 1 / 10;
/** Points redeemable as 1 rupee off. */
export const RUPEES_PER_POINT = 1;
/** Minimum balance required to redeem. */
export const MIN_REDEEM = 100;

export function pointsFor(spendPkr: number): number {
  return Math.floor(Math.max(0, spendPkr) * POINTS_PER_RUPEE);
}

export function normalizePhoneKey(phone: string | null | undefined): string {
  return (phone ?? "").replace(/[^\d]/g, "");
}

export function tierFor(lifetimeSpendPkr: number): "Bronze" | "Silver" | "Gold" {
  if (lifetimeSpendPkr >= 10000) return "Gold";
  if (lifetimeSpendPkr >= 3000) return "Silver";
  return "Bronze";
}

export async function getBalance(phone: string): Promise<number> {
  if (!hasAdminEnv()) return 0;
  const key = normalizePhoneKey(phone);
  if (!key) return 0;
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("loyalty_balance")
      .select("balance")
      .eq("phone", key)
      .maybeSingle();
    return (data?.balance as number | undefined) ?? 0;
  } catch {
    return 0;
  }
}

export async function getBalancesForPhones(phones: string[]): Promise<Map<string, number>> {
  const out = new Map<string, number>();
  if (!hasAdminEnv() || phones.length === 0) return out;
  const keys = Array.from(new Set(phones.map(normalizePhoneKey).filter(Boolean)));
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("loyalty_balance").select("phone,balance").in("phone", keys);
    for (const row of data ?? []) out.set(row.phone as string, (row.balance as number) ?? 0);
  } catch {}
  return out;
}
