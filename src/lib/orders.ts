"use server";

import { redirect } from "next/navigation";
import { createClient, hasSupabaseEnv } from "./supabase/server";
import type { CartItem } from "./types";

export interface CheckoutPayload {
  full_name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  subtotal_pkr: number;
  items: CartItem[];
}

export async function createOrder(payload: CheckoutPayload): Promise<void> {
  if (!payload.full_name || !payload.phone || !payload.city || !payload.address) {
    throw new Error("Missing required fields");
  }

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          full_name: payload.full_name,
          phone: payload.phone,
          city: payload.city,
          address: payload.address,
          notes: payload.notes ?? null,
          subtotal_pkr: payload.subtotal_pkr,
          status: "pending",
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      const items = payload.items.map((it) => ({
        order_id: order.id,
        product_id: it.id,
        name: it.name,
        price_pkr: it.price_pkr,
        quantity: it.quantity,
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(items);
      if (itemsErr) throw itemsErr;
    } catch (err) {
      console.error("[createOrder] Supabase error — falling back to console log", err);
      console.log("[createOrder] order:", payload);
    }
  } else {
    console.log("[createOrder] (no Supabase env) order:", payload);
  }

  redirect("/checkout/success");
}
