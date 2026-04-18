import "server-only";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";
import { normalizePhoneKey } from "@/lib/loyalty";

export const REFERRAL_DISCOUNT_PKR = 200;
export const REFERRER_CREDIT_POINTS = 200;

/** Deterministic base32-ish code from phone — e.g. "0300XXXXXXX" → "CBJ-3A7K". */
function deriveCode(phone: string): string {
  const key = normalizePhoneKey(phone);
  let h = 2166136261 >>> 0;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L for clarity
  let out = "";
  let n = h;
  for (let i = 0; i < 4; i++) {
    out += alphabet[n % alphabet.length];
    n = Math.floor(n / alphabet.length);
  }
  return `CBJ-${out}`;
}

/** Look up or create a referral code for this phone. */
export async function ensureReferralCode(phone: string): Promise<string | null> {
  if (!hasAdminEnv()) return null;
  const key = normalizePhoneKey(phone);
  if (!key) return null;
  try {
    const supabase = createAdminClient();
    const { data: existing } = await supabase
      .from("referrals")
      .select("code")
      .eq("referrer_phone", key)
      .maybeSingle();
    if (existing?.code) return existing.code as string;

    // Generate a deterministic code (with collision retry).
    let code = deriveCode(key);
    for (let attempt = 0; attempt < 4; attempt++) {
      const { error } = await supabase.from("referrals").insert({ code, referrer_phone: key });
      if (!error) return code;
      if (attempt < 3) code = deriveCode(key + "·" + attempt);
    }
    return null;
  } catch {
    return null;
  }
}

export async function referralByCode(code: string): Promise<{ code: string; phone: string } | null> {
  if (!hasAdminEnv() || !code) return null;
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("referrals")
      .select("code,referrer_phone")
      .ilike("code", code.trim())
      .maybeSingle();
    if (!data) return null;
    return { code: data.code as string, phone: data.referrer_phone as string };
  } catch {
    return null;
  }
}

export async function getCodeForPhone(phone: string): Promise<string | null> {
  if (!hasAdminEnv()) return null;
  const key = normalizePhoneKey(phone);
  if (!key) return null;
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("referrals")
      .select("code")
      .eq("referrer_phone", key)
      .maybeSingle();
    return (data?.code as string) ?? null;
  } catch {
    return null;
  }
}
