"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthed, loginAdmin, logoutAdmin } from "./admin-auth";
import { createAdminClient, hasAdminEnv } from "./supabase/admin";

export type ActionResult = { ok: true; message: string } | { ok: false; error: string };

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const pw = String(formData.get("password") ?? "");
  const ok = await loginAdmin(pw);
  if (!ok) return { ok: false, error: "Incorrect password. Please try again." };
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await logoutAdmin();
  redirect("/admin/login");
}

async function requireAdmin(): Promise<ActionResult | null> {
  if (!(await isAdminAuthed())) return { ok: false, error: "Unauthorized. Please log in again." };
  if (!hasAdminEnv()) return { ok: false, error: "Supabase is not configured. Set SUPABASE_SERVICE_ROLE_KEY." };
  return null;
}

export async function updateProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const id = String(formData.get("id") ?? "");
  const price = Number(formData.get("price_pkr") ?? 0);
  const original = formData.get("original_price_pkr");
  const stock = Number(formData.get("stock") ?? 0);

  if (!id) return { ok: false, error: "Missing product ID." };
  if (!Number.isFinite(price) || price < 0) return { ok: false, error: "Invalid price." };
  if (!Number.isFinite(stock) || stock < 0) return { ok: false, error: "Invalid stock." };

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

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("products").update(patch).eq("id", id);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Update failed." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { ok: true, message: "Product updated." };
}

export async function applyBulkDiscount(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const pct = Number(formData.get("percent") ?? 0);
  const category = String(formData.get("category") ?? "");
  if (!Number.isFinite(pct) || pct <= 0 || pct > 90) {
    return { ok: false, error: "Enter a discount between 1% and 90%." };
  }

  try {
    const supabase = createAdminClient();
    const q = supabase.from("products").select("id,price_pkr,original_price_pkr");
    if (category) q.eq("category", category);
    const { data, error } = await q;
    if (error) return { ok: false, error: error.message };

    let count = 0;
    for (const row of data ?? []) {
      const orig = row.original_price_pkr ?? row.price_pkr;
      const newPrice = Math.max(1, Math.round(orig * (1 - pct / 100)));
      await supabase
        .from("products")
        .update({ original_price_pkr: orig, price_pkr: newPrice })
        .eq("id", row.id);
      count++;
    }
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { ok: true, message: `${pct}% discount applied to ${count} products.` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Discount failed." };
  }
}

export async function clearBulkDiscount(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const category = String(formData.get("category") ?? "");
  try {
    const supabase = createAdminClient();
    const q = supabase.from("products").select("id,original_price_pkr");
    if (category) q.eq("category", category);
    const { data, error } = await q;
    if (error) return { ok: false, error: error.message };

    let count = 0;
    for (const row of data ?? []) {
      if (row.original_price_pkr) {
        await supabase
          .from("products")
          .update({ price_pkr: row.original_price_pkr, original_price_pkr: null })
          .eq("id", row.id);
        count++;
      }
    }
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { ok: true, message: `Discounts cleared from ${count} products.` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Clear failed." };
  }
}

// ─── Category CRUD ────────────────────────────────────────────────────────────

export async function createCategory(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const label = String(formData.get("label") ?? "").trim();
  const slug  = String(formData.get("slug")  ?? "").trim().toLowerCase();
  const parent_slug  = String(formData.get("parent_slug")  ?? "").trim() || null;
  const cover_image  = String(formData.get("cover_image")  ?? "").trim() || null;
  const sort_order   = Number(formData.get("sort_order")   ?? 0);

  if (!label) return { ok: false, error: "Category name is required." };
  if (!slug || !/^[a-z0-9-]+$/.test(slug))
    return { ok: false, error: "Slug must use lowercase letters, numbers, and hyphens only." };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("categories").insert({
      slug,
      label,
      parent_slug,
      cover_image,
      sort_order: Number.isFinite(sort_order) ? sort_order : 0,
    });
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Create failed." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");
  return { ok: true, message: `Category "${label}" created.` };
}

export async function updateCategory(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const slug        = String(formData.get("slug")        ?? "");
  const label       = String(formData.get("label")       ?? "").trim();
  const parent_slug = String(formData.get("parent_slug") ?? "").trim() || null;
  const cover_image = String(formData.get("cover_image") ?? "").trim() || null;
  const sort_order  = Number(formData.get("sort_order")  ?? 0);

  if (!slug || !label) return { ok: false, error: "Slug and label are required." };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("categories")
      .update({
        label,
        parent_slug,
        cover_image,
        sort_order: Number.isFinite(sort_order) ? sort_order : 0,
      })
      .eq("slug", slug);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Update failed." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");
  return { ok: true, message: `Category "${label}" updated.` };
}

export async function deleteCategory(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const slug = String(formData.get("slug") ?? "");
  if (!slug) return { ok: false, error: "Missing category slug." };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("categories").delete().eq("slug", slug);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Delete failed." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");
  return { ok: true, message: "Category deleted." };
}

// ─── Order Status ─────────────────────────────────────────────────────────────

export async function updateOrderStatus(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!id || !allowed.includes(status)) {
    return { ok: false, error: "Invalid order or status." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Update failed." };
  }

  revalidatePath("/admin/orders");
  return { ok: true, message: `Order status updated to "${status}".` };
}
