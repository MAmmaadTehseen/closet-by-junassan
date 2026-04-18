"use server";

import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";
import { normalizePhoneKey } from "@/lib/loyalty";

export type AlertResult = { ok: true; message: string } | { ok: false; error: string };

const PHONE_RE = /^03\d{9}$/;

export async function subscribePriceAlert(
  _prev: AlertResult | null,
  formData: FormData,
): Promise<AlertResult> {
  if (!hasAdminEnv()) return { ok: false, error: "Alerts are not configured." };

  const product_id = String(formData.get("product_id") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const cap_price_pkr = Number(formData.get("cap_price_pkr") ?? 0);

  const phone = phoneRaw ? normalizePhoneKey(phoneRaw) : "";
  if (!product_id) return { ok: false, error: "Missing product." };
  if (!phone || !PHONE_RE.test(phone)) {
    return { ok: false, error: "Enter a valid PK mobile (03XXXXXXXXX)." };
  }
  if (!Number.isFinite(cap_price_pkr) || cap_price_pkr <= 0) {
    return { ok: false, error: "Invalid price." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("price_alerts").insert({
      product_id,
      phone,
      cap_price_pkr,
    });
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Subscribe failed." };
  }

  return { ok: true, message: "Got it — we'll WhatsApp you the moment the price drops." };
}
