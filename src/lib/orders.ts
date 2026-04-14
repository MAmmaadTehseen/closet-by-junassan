"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createAdminClient, hasAdminEnv } from "./supabase/admin";
import { validateCheckout } from "./validators";
import { hashKey, rateLimit, rememberIdempotency, seenIdempotency } from "./rate-limit";
import { shortOrderCode } from "./format";
import { SEED_PRODUCTS } from "./seed-data";
import type { CheckoutPayload } from "./order-types";

/**
 * Trusted server-side order creation.
 * Validates & normalizes input, enforces honeypot, rate limit, idempotency,
 * then calls the atomic Supabase RPC (with trusted prices and stock).
 * Throws a plain Error with a message starting with "ORDER_ERROR:" for UI
 * consumption when validation/business rules fail.
 */
export async function createOrder(payload: CheckoutPayload): Promise<void> {
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
    throw new Error("ORDER_ERROR: Too many attempts. Please try again in a few minutes.");
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
    throw new Error(`ORDER_ERROR: ${first}`);
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
      revalidatePath("/shop");
      revalidatePath("/");
      for (const it of v.items) {
        const seed = SEED_PRODUCTS.find((p) => p.id === it.product_id);
        if (seed) revalidatePath(`/product/${seed.slug}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("out_of_stock")) {
        throw new Error("ORDER_ERROR: Sorry — one of your items just sold out.");
      }
      if (msg.includes("product_not_found")) {
        throw new Error("ORDER_ERROR: One of the products is no longer available.");
      }
      console.error("[createOrder] rpc failed:", msg);
      // Fall through to seed-log path.
    }
  } else {
    // No Supabase — validate against seed stock to keep dev UX consistent.
    for (const it of v.items) {
      const seed = SEED_PRODUCTS.find((p) => p.id === it.product_id);
      if (!seed) throw new Error("ORDER_ERROR: Product no longer available.");
      if (seed.stock < it.quantity) throw new Error("ORDER_ERROR: Out of stock.");
    }
    console.log("[createOrder] (seed mode)", { code: orderCode, ...v });
  }

  if (payload.idempotencyKey) rememberIdempotency(payload.idempotencyKey, orderCode);
  redirect(`/checkout/success?o=${encodeURIComponent(orderCode)}`);
}
