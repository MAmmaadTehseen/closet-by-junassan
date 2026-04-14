"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthed, loginAdmin, logoutAdmin } from "./admin-auth";
import { createAdminClient, hasAdminEnv } from "./supabase/admin";

export async function loginAction(formData: FormData): Promise<void> {
  const pw = String(formData.get("password") ?? "");
  const ok = await loginAdmin(pw);
  if (!ok) throw new Error("ADMIN_LOGIN_FAILED");
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await logoutAdmin();
  redirect("/admin/login");
}

async function requireAdmin() {
  if (!(await isAdminAuthed())) throw new Error("Unauthorized");
}

export async function updateProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  if (!hasAdminEnv()) throw new Error("Supabase not configured");
  const id = String(formData.get("id") ?? "");
  const price = Number(formData.get("price_pkr") ?? 0);
  const original = formData.get("original_price_pkr");
  const stock = Number(formData.get("stock") ?? 0);
  if (!id || !Number.isFinite(price) || price < 0) throw new Error("Invalid input");
  if (!Number.isFinite(stock) || stock < 0) throw new Error("Invalid stock");

  const patch: Record<string, unknown> = {
    price_pkr: Math.round(price),
    stock: Math.floor(stock),
  };
  if (original != null && original !== "") {
    const n = Number(original);
    if (Number.isFinite(n) && n >= 0) patch.original_price_pkr = Math.round(n);
  } else {
    patch.original_price_pkr = null;
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("products").update(patch).eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function applyBulkDiscount(formData: FormData): Promise<void> {
  await requireAdmin();
  if (!hasAdminEnv()) throw new Error("Supabase not configured");
  const pct = Number(formData.get("percent") ?? 0);
  const category = String(formData.get("category") ?? "");
  if (!Number.isFinite(pct) || pct <= 0 || pct > 90) throw new Error("Invalid percent");

  const supabase = createAdminClient();
  const q = supabase.from("products").select("id,price_pkr,original_price_pkr");
  if (category) q.eq("category", category);
  const { data, error } = await q;
  if (error) throw error;

  for (const row of data ?? []) {
    const original = row.original_price_pkr ?? row.price_pkr;
    const newPrice = Math.max(1, Math.round(original * (1 - pct / 100)));
    await supabase
      .from("products")
      .update({ original_price_pkr: original, price_pkr: newPrice })
      .eq("id", row.id);
  }
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function clearBulkDiscount(formData: FormData): Promise<void> {
  await requireAdmin();
  if (!hasAdminEnv()) throw new Error("Supabase not configured");
  const category = String(formData.get("category") ?? "");
  const supabase = createAdminClient();
  const q = supabase.from("products").select("id,original_price_pkr");
  if (category) q.eq("category", category);
  const { data, error } = await q;
  if (error) throw error;
  for (const row of data ?? []) {
    if (row.original_price_pkr) {
      await supabase
        .from("products")
        .update({ price_pkr: row.original_price_pkr, original_price_pkr: null })
        .eq("id", row.id);
    }
  }
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function updateOrderStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  if (!hasAdminEnv()) throw new Error("Supabase not configured");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!id || !allowed.includes(status)) throw new Error("Invalid input");
  const supabase = createAdminClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/orders");
}
