"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthed, loginAdmin, logoutAdmin } from "./admin-auth";
import { createAdminClient, hasAdminEnv } from "./supabase/admin";
import { sendStatusUpdate } from "./email";
import { normalizePhoneKey, pointsFor } from "./loyalty";
import { setSetting, MARQUEE_KEY } from "./site-settings";
import { logAudit } from "./audit";

export type ActionResult = { ok: true; message: string } | { ok: false; error: string };
export type UploadResult = { url: string } | { error: string };

const STORAGE_BUCKET = "product-images";

/** Upload a single image to Supabase Storage. Called directly from client components. */
export async function uploadProductImage(formData: FormData): Promise<UploadResult> {
  if (!(await isAdminAuthed())) return { error: "Unauthorized." };
  if (!hasAdminEnv()) return { error: "Storage not configured." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "No file provided." };
  if (file.size > 5 * 1024 * 1024) return { error: "File exceeds 5 MB limit." };

  const ext      = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const fileName = `${crypto.randomUUID()}.${ext}`;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, { contentType: file.type, upsert: false });

    if (error) return { error: error.message };

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
    return { url: data.publicUrl };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed." };
  }
}

/** Delete an image from Supabase Storage by its full public URL. */
export async function deleteProductImage(url: string): Promise<void> {
  if (!(await isAdminAuthed()) || !hasAdminEnv()) return;
  try {
    const supabase = createAdminClient();
    const baseUrl  = supabase.storage.from(STORAGE_BUCKET).getPublicUrl("").data.publicUrl;
    if (!url.startsWith(baseUrl)) return; // not our bucket
    const path = url.replace(baseUrl, "");
    await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  } catch {
    // best-effort, don't throw
  }
}

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

// ─── Product full CRUD ────────────────────────────────────────────────────────

function collectImages(formData: FormData): string[] {
  return [0, 1, 2, 3, 4]
    .map((i) => String(formData.get(`image_${i}`) ?? "").trim())
    .filter(Boolean);
}

function collectTags(formData: FormData): string[] {
  return ["new", "trending", "limited"].filter(
    (t) => formData.get(`tag_${t}`) === "on",
  );
}

export async function createProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const name        = String(formData.get("name")        ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const brand       = String(formData.get("brand")       ?? "").trim();
  const category    = String(formData.get("category")    ?? "").trim();
  const size        = String(formData.get("size")        ?? "").trim();
  const condition   = String(formData.get("condition")   ?? "good").trim();
  const price_pkr   = Number(formData.get("price_pkr")   ?? 0);
  const stock       = Number(formData.get("stock")       ?? 0);
  const fabric      = String(formData.get("fabric")      ?? "").trim() || null;
  const measurements = String(formData.get("measurements") ?? "").trim() || null;
  const care        = String(formData.get("care")        ?? "").trim() || null;
  const images      = collectImages(formData);
  const tags        = collectTags(formData);

  if (!name)                                         return { ok: false, error: "Product name is required." };
  if (!brand)                                        return { ok: false, error: "Brand is required." };
  if (!category)                                     return { ok: false, error: "Category is required." };
  if (!Number.isFinite(price_pkr) || price_pkr <= 0) return { ok: false, error: "A valid price is required." };
  if (!Number.isFinite(stock) || stock < 0)          return { ok: false, error: "Stock must be 0 or more." };
  if (images.length === 0)                           return { ok: false, error: "At least one image URL is required." };

  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const suffix   = Math.random().toString(36).slice(2, 7);
  const slug     = `${baseSlug}-${suffix}`;

  const row: Record<string, unknown> = {
    slug, name, description, brand, category,
    price_pkr: Math.round(price_pkr),
    stock: Math.floor(stock),
    size, condition, images, tags, fabric, measurements, care,
  };

  const orig = formData.get("original_price_pkr");
  if (orig && String(orig).trim()) {
    const n = Number(orig);
    if (Number.isFinite(n) && n > 0) row.original_price_pkr = Math.round(n);
  }
  const origStock = formData.get("original_stock");
  if (origStock && String(origStock).trim()) {
    const n = Number(origStock);
    if (Number.isFinite(n) && n > 0) row.original_stock = Math.floor(n);
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("products").insert(row);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Create failed." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProductFull(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const id          = String(formData.get("id")          ?? "");
  const name        = String(formData.get("name")        ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const brand       = String(formData.get("brand")       ?? "").trim();
  const category    = String(formData.get("category")    ?? "").trim();
  const size        = String(formData.get("size")        ?? "").trim();
  const condition   = String(formData.get("condition")   ?? "good").trim();
  const price_pkr   = Number(formData.get("price_pkr")   ?? 0);
  const stock       = Number(formData.get("stock")       ?? 0);
  const fabric      = String(formData.get("fabric")      ?? "").trim() || null;
  const measurements = String(formData.get("measurements") ?? "").trim() || null;
  const care        = String(formData.get("care")        ?? "").trim() || null;
  const images      = collectImages(formData);
  const tags        = collectTags(formData);

  if (!id)                                           return { ok: false, error: "Missing product ID." };
  if (!name)                                         return { ok: false, error: "Product name is required." };
  if (!brand)                                        return { ok: false, error: "Brand is required." };
  if (!category)                                     return { ok: false, error: "Category is required." };
  if (!Number.isFinite(price_pkr) || price_pkr <= 0) return { ok: false, error: "A valid price is required." };
  if (!Number.isFinite(stock) || stock < 0)          return { ok: false, error: "Stock must be 0 or more." };
  if (images.length === 0)                           return { ok: false, error: "At least one image URL is required." };

  const patch: Record<string, unknown> = {
    name, description, brand, category,
    price_pkr: Math.round(price_pkr),
    stock: Math.floor(stock),
    size, condition, images, tags, fabric, measurements, care,
    original_price_pkr: null,
    original_stock: null,
  };

  const orig = formData.get("original_price_pkr");
  if (orig && String(orig).trim()) {
    const n = Number(orig);
    if (Number.isFinite(n) && n > 0) patch.original_price_pkr = Math.round(n);
  }
  const origStock = formData.get("original_stock");
  if (origStock && String(origStock).trim()) {
    const n = Number(origStock);
    if (Number.isFinite(n) && n > 0) patch.original_stock = Math.floor(n);
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
  redirect("/admin/products");
}

export async function deleteProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Missing product ID." };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Delete failed." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { ok: true, message: "Product deleted." };
}

// ─── Product inline price/stock edit ─────────────────────────────────────────

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

    // Fetch order shape for side effects.
    const { data: order } = await supabase
      .from("orders")
      .select("email,full_name,phone,public_code,subtotal_pkr")
      .eq("id", id)
      .single();

    // Email notification (best-effort, non-blocking).
    if (order?.email && order.public_code) {
      void sendStatusUpdate({
        email: order.email,
        firstName: order.full_name?.split(/\s+/)[0] ?? order.full_name ?? "there",
        code: order.public_code,
        phone: order.phone,
        status,
      });
    }

    // Loyalty credit on delivery — unique-indexed per (order_id, 'order_delivered').
    if (status === "delivered" && order?.phone) {
      const delta = pointsFor(order.subtotal_pkr ?? 0);
      if (delta > 0) {
        await supabase
          .from("loyalty_ledger")
          .insert({
            phone: normalizePhoneKey(order.phone),
            order_id: id,
            delta_points: delta,
            reason: "order_delivered",
          })
          .then(() => {});
      }
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Update failed." };
  }

  void logAudit({
    action: "order_status_changed",
    entity: "order",
    entity_id: id,
    summary: `Status → ${status}`,
  });
  revalidatePath("/admin/orders");
  revalidatePath("/admin/customers");
  return { ok: true, message: `Order status updated to "${status}".` };
}

// ─── Drops (homepage Stories) ────────────────────────────────────────────────

export async function createDrop(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim() || null;
  const cover_image = String(formData.get("cover_image") ?? "").trim();
  const cta_label = String(formData.get("cta_label") ?? "").trim() || null;
  const cta_href = String(formData.get("cta_href") ?? "").trim() || null;
  const sort_order = Number(formData.get("sort_order") ?? 0);
  const active = formData.get("active") === "on";
  const goes_live_at = parseDateTimeLocal(formData.get("goes_live_at"));
  const ends_at = parseDateTimeLocal(formData.get("ends_at"));

  if (!title) return { ok: false, error: "Title is required." };
  if (!cover_image) return { ok: false, error: "Cover image is required." };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("drops").insert({
      title,
      subtitle,
      cover_image,
      cta_label,
      cta_href,
      sort_order: Number.isFinite(sort_order) ? sort_order : 0,
      active,
      goes_live_at,
      ends_at,
    });
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Create failed." };
  }

  revalidatePath("/admin/drops");
  revalidatePath("/");
  return { ok: true, message: "Drop created." };
}

function parseDateTimeLocal(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export async function updateDrop(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim() || null;
  const cover_image = String(formData.get("cover_image") ?? "").trim();
  const cta_label = String(formData.get("cta_label") ?? "").trim() || null;
  const cta_href = String(formData.get("cta_href") ?? "").trim() || null;
  const sort_order = Number(formData.get("sort_order") ?? 0);
  const active = formData.get("active") === "on";
  const goes_live_at = parseDateTimeLocal(formData.get("goes_live_at"));
  const ends_at = parseDateTimeLocal(formData.get("ends_at"));

  if (!id || !title || !cover_image) {
    return { ok: false, error: "ID, title and cover image are required." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("drops")
      .update({
        title,
        subtitle,
        cover_image,
        cta_label,
        cta_href,
        sort_order: Number.isFinite(sort_order) ? sort_order : 0,
        active,
        goes_live_at,
        ends_at,
      })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Update failed." };
  }

  revalidatePath("/admin/drops");
  revalidatePath("/");
  return { ok: true, message: "Drop updated." };
}

export async function deleteDrop(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Missing drop ID." };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("drops").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Delete failed." };
  }

  revalidatePath("/admin/drops");
  revalidatePath("/");
  return { ok: true, message: "Drop deleted." };
}

// ─── Reviews (customer-submitted) ────────────────────────────────────────────

export async function approveReview(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;
  const id = String(formData.get("id") ?? "");
  const approved = formData.get("approved") === "true";
  if (!id) return { ok: false, error: "Missing review ID." };
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("reviews").update({ approved }).eq("id", id);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Update failed." };
  }
  revalidatePath("/admin/reviews");
  revalidatePath("/product");
  return { ok: true, message: approved ? "Review approved." : "Review hidden." };
}

export async function deleteReview(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Missing review ID." };
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Delete failed." };
  }
  revalidatePath("/admin/reviews");
  return { ok: true, message: "Review deleted." };
}

// ─── Collections (editorial sets) ────────────────────────────────────────────

function validCollectionSlug(s: string) {
  return /^[a-z0-9-]+$/.test(s) && s.length <= 60;
}

export async function createCollection(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim() || null;
  const cover_image = String(formData.get("cover_image") ?? "").trim() || null;
  const description_md = String(formData.get("description_md") ?? "").trim() || null;
  const sort_order = Number(formData.get("sort_order") ?? 0);
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") !== "off";

  if (!title) return { ok: false, error: "Title is required." };
  if (!validCollectionSlug(slug)) {
    return { ok: false, error: "Slug must use lowercase letters, numbers, and hyphens only." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("collections").insert({
      slug,
      title,
      subtitle,
      cover_image,
      description_md,
      sort_order: Number.isFinite(sort_order) ? sort_order : 0,
      featured,
      active,
    });
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Create failed." };
  }

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  revalidatePath("/");
  redirect(`/admin/collections/${slug}/edit`);
}

export async function updateCollection(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim() || null;
  const cover_image = String(formData.get("cover_image") ?? "").trim() || null;
  const description_md = String(formData.get("description_md") ?? "").trim() || null;
  const sort_order = Number(formData.get("sort_order") ?? 0);
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") !== "off";

  if (!slug || !title) return { ok: false, error: "Slug and title are required." };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("collections")
      .update({
        title,
        subtitle,
        cover_image,
        description_md,
        sort_order: Number.isFinite(sort_order) ? sort_order : 0,
        featured,
        active,
      })
      .eq("slug", slug);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Update failed." };
  }

  revalidatePath("/admin/collections");
  revalidatePath(`/collections/${slug}`);
  revalidatePath("/collections");
  revalidatePath("/");
  return { ok: true, message: "Collection saved." };
}

export async function setCollectionProducts(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const slug = String(formData.get("slug") ?? "");
  const ids = formData.getAll("product_ids").map(String).filter(Boolean);
  if (!slug) return { ok: false, error: "Missing collection slug." };

  try {
    const supabase = createAdminClient();
    // Clear then reinsert with positions.
    const { error: delErr } = await supabase
      .from("collection_products")
      .delete()
      .eq("collection_slug", slug);
    if (delErr) return { ok: false, error: delErr.message };

    if (ids.length > 0) {
      const rows = ids.map((id, i) => ({
        collection_slug: slug,
        product_id: id,
        position: i,
      }));
      const { error: insErr } = await supabase.from("collection_products").insert(rows);
      if (insErr) return { ok: false, error: insErr.message };
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed." };
  }

  revalidatePath("/admin/collections");
  revalidatePath(`/admin/collections/${slug}/edit`);
  revalidatePath(`/collections/${slug}`);
  revalidatePath("/collections");
  return { ok: true, message: `${ids.length} product${ids.length === 1 ? "" : "s"} saved.` };
}

export async function deleteCollection(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return { ok: false, error: "Missing slug." };
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("collections").delete().eq("slug", slug);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Delete failed." };
  }
  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  revalidatePath("/");
  return { ok: true, message: "Collection deleted." };
}

// ─── Bundles (Complete the Look) ─────────────────────────────────────────────

export async function createBundle(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const title = String(formData.get("title") ?? "").trim();
  const combo_price_pkr = Number(formData.get("combo_price_pkr") ?? 0);
  const active = formData.get("active") !== "off";
  const ids = formData.getAll("product_ids").map(String).filter(Boolean);

  if (!title) return { ok: false, error: "Title is required." };
  if (!Number.isFinite(combo_price_pkr) || combo_price_pkr <= 0) {
    return { ok: false, error: "Combo price must be greater than 0." };
  }
  if (ids.length < 2) return { ok: false, error: "Add at least 2 products to a bundle." };

  try {
    const supabase = createAdminClient();
    const { data: inserted, error } = await supabase
      .from("bundles")
      .insert({ title, combo_price_pkr, active })
      .select("id")
      .single();
    if (error || !inserted) return { ok: false, error: error?.message ?? "Insert failed." };

    const rows = ids.map((product_id, i) => ({
      bundle_id: inserted.id as string,
      product_id,
      position: i,
    }));
    const { error: linkErr } = await supabase.from("bundle_products").insert(rows);
    if (linkErr) return { ok: false, error: linkErr.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Create failed." };
  }

  revalidatePath("/admin/bundles");
  revalidatePath("/product");
  return { ok: true, message: "Bundle created." };
}

export async function updateBundle(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const combo_price_pkr = Number(formData.get("combo_price_pkr") ?? 0);
  const active = formData.get("active") !== "off";
  const ids = formData.getAll("product_ids").map(String).filter(Boolean);

  if (!id || !title) return { ok: false, error: "Missing bundle id or title." };
  if (!Number.isFinite(combo_price_pkr) || combo_price_pkr <= 0) {
    return { ok: false, error: "Combo price must be greater than 0." };
  }
  if (ids.length < 2) return { ok: false, error: "A bundle needs at least 2 products." };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("bundles")
      .update({ title, combo_price_pkr, active })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };

    await supabase.from("bundle_products").delete().eq("bundle_id", id);
    const rows = ids.map((product_id, i) => ({ bundle_id: id, product_id, position: i }));
    const { error: linkErr } = await supabase.from("bundle_products").insert(rows);
    if (linkErr) return { ok: false, error: linkErr.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Update failed." };
  }

  revalidatePath("/admin/bundles");
  revalidatePath("/product");
  return { ok: true, message: "Bundle saved." };
}

export async function deleteBundle(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Missing bundle id." };
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("bundles").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Delete failed." };
  }
  revalidatePath("/admin/bundles");
  revalidatePath("/product");
  return { ok: true, message: "Bundle deleted." };
}

// ─── Site settings ───────────────────────────────────────────────────────────

export async function updateMarquee(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const raw = String(formData.get("items") ?? "").trim();
  const items = raw
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);

  if (items.length === 0) return { ok: false, error: "Add at least one marquee item." };

  try {
    await setSetting(MARQUEE_KEY, items);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed." };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { ok: true, message: `Saved ${items.length} marquee items.` };
}

// ─── Styles (mood boards) ────────────────────────────────────────────────────

function validSlug(s: string) {
  return /^[a-z0-9-]+$/.test(s) && s.length <= 40;
}

export async function createStyle(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const label = String(formData.get("label") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const cover_image = String(formData.get("cover_image") ?? "").trim() || null;
  const sort_order = Number(formData.get("sort_order") ?? 0);
  const active = formData.get("active") !== "off";

  if (!label) return { ok: false, error: "Label is required." };
  if (!validSlug(slug)) {
    return { ok: false, error: "Slug must use lowercase letters, numbers, and hyphens only." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("styles").insert({
      slug,
      label,
      description,
      cover_image,
      sort_order: Number.isFinite(sort_order) ? sort_order : 0,
      active,
    });
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Create failed." };
  }

  revalidatePath("/admin/styles");
  revalidatePath(`/style/${slug}`);
  return { ok: true, message: "Style created." };
}

export async function updateStyle(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;
  const slug = String(formData.get("slug") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const cover_image = String(formData.get("cover_image") ?? "").trim() || null;
  const sort_order = Number(formData.get("sort_order") ?? 0);
  const active = formData.get("active") !== "off";
  if (!slug || !label) return { ok: false, error: "Slug and label required." };
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("styles")
      .update({
        label,
        description,
        cover_image,
        sort_order: Number.isFinite(sort_order) ? sort_order : 0,
        active,
      })
      .eq("slug", slug);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Update failed." };
  }
  revalidatePath("/admin/styles");
  revalidatePath(`/style/${slug}`);
  return { ok: true, message: "Style saved." };
}

export async function deleteStyle(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return { ok: false, error: "Missing slug." };
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("styles").delete().eq("slug", slug);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Delete failed." };
  }
  revalidatePath("/admin/styles");
  return { ok: true, message: "Style deleted." };
}
