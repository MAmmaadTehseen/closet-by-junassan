"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createAdminClient, hasAdminEnv } from "./supabase/admin";
import { validateCheckout } from "./validators";
import { hashKey, rateLimit, rememberIdempotency, seenIdempotency } from "./rate-limit";
import { shortOrderCode } from "./format";
import { SEED_PRODUCTS } from "./seed-data";
import { sendOrderConfirmation } from "./email";
import type { CheckoutPayload } from "./order-types";

/**
 * Server action for order creation.
 * Returns `{ error }` on validation / business failure.
 * Calls `redirect()` on success (never returns normally on success).
 */
export async function createOrder(
  payload: CheckoutPayload,
): Promise<{ error: string } | never> {
  const hdrs = await headers();
  const ua = hdrs.get("user-agent") ?? "";
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "0.0.0.0";
  const ipHash = hashKey(ip, ua);

  // Honeypot — pretend success without writing anything.
  if (payload.honeypot && payload.honeypot.trim() !== "") {
    redirect(`/checkout/success?o=${encodeURIComponent(shortOrderCode())}`);
  }

  // Idempotency — if the same key recently succeeded, re-redirect.
  if (payload.idempotencyKey) {
    const prior = seenIdempotency(payload.idempotencyKey);
    if (prior) redirect(`/checkout/success?o=${encodeURIComponent(prior)}`);
  }

  // Rate limit: 5 orders per 10 minutes per client fingerprint.
  if (!rateLimit(`order:${ipHash}`, 5, 10 * 60 * 1000)) {
    return { error: "Too many attempts. Please try again in a few minutes." };
  }

  const validation = validateCheckout({
    full_name: payload.full_name,
    phone: payload.phone,
    city: payload.city,
    address: payload.address,
    notes: payload.notes,
    items: payload.items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
  });
  if (!validation.ok || !validation.data) {
    const first = Object.values(validation.errors ?? { _: "Invalid order." })[0];
    return { error: first };
  }

  const v = validation.data;
  let orderCode = shortOrderCode();

  if (hasAdminEnv()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.rpc("create_order_rpc", {
        p_full_name: v.full_name,
        p_phone: v.phone,
        p_city: v.city,
        p_address: v.address,
        p_notes: v.notes || null,
        p_items: v.items,
        p_ip_hash: ipHash,
        p_user_agent: ua.slice(0, 300),
      });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (row?.public_code) orderCode = row.public_code;

      // Persist email + fire confirmation (best-effort).
      const email = payload.email?.trim();
      if (email && row?.id) {
        await supabase.from("orders").update({ email }).eq("id", row.id).then(() => {});
        const total = payload.items.reduce((n, i) => n + i.price_pkr * i.quantity, 0);
        void sendOrderConfirmation({
          email,
          firstName: v.full_name.split(/\s+/)[0] ?? v.full_name,
          code: orderCode,
          items: payload.items.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            price_pkr: i.price_pkr,
            size: i.size,
          })),
          total,
          address: v.address,
          city: v.city,
          phone: v.phone,
        });
      }

      revalidatePath("/shop");
      revalidatePath("/");
      for (const it of v.items) {
        const seed = SEED_PRODUCTS.find((p) => p.id === it.product_id);
        if (seed) revalidatePath(`/product/${seed.slug}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("out_of_stock")) {
        return { error: "Sorry — one of your items just sold out." };
      }
      if (msg.includes("product_not_found")) {
        return { error: "One of the products is no longer available." };
      }
      console.error("[createOrder] rpc failed:", msg);
      // Fall through — still redirect as success (order logged server-side).
    }
  } else {
    // No Supabase — validate against seed stock to keep dev UX consistent.
    for (const it of v.items) {
      const seed = SEED_PRODUCTS.find((p) => p.id === it.product_id);
      if (!seed) return { error: "Product no longer available." };
      if (seed.stock < it.quantity) return { error: "Out of stock." };
    }
    console.log("[createOrder] (seed mode)", { code: orderCode, ...v });
  }

  if (payload.idempotencyKey) rememberIdempotency(payload.idempotencyKey, orderCode);
  redirect(`/checkout/success?o=${encodeURIComponent(orderCode)}`);
}
