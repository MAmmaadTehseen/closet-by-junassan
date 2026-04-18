"use server";

import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";
import type { CartItem } from "@/lib/types";

export type DraftResult = { ok: true; token: string } | { ok: false; error: string };

/**
 * Save a cart draft keyed by email. Called from the checkout form the moment
 * the user enters email but before they complete the order. If they leave,
 * the abandoned-cart cron picks it up after 2h and emails a recovery link.
 */
export async function saveCartDraft(
  email: string,
  items: CartItem[],
): Promise<DraftResult> {
  if (!hasAdminEnv()) return { ok: false, error: "Not configured" };
  const trimmedEmail = (email ?? "").trim().toLowerCase();
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return { ok: false, error: "Invalid email" };
  }
  if (!items || items.length === 0) return { ok: false, error: "Cart empty" };

  const token = crypto.randomUUID().replace(/-/g, "");
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("cart_recoveries").insert({
      token,
      email: trimmedEmail,
      items_json: items,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, token };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed" };
  }
}
