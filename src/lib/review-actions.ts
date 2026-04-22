"use server";

import { revalidatePath } from "next/cache";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";

const UGC_BUCKET = "review-photos";

export type ReviewSubmitResult = { ok: true; message: string } | { ok: false; error: string };
export type UploadResult = { url: string } | { error: string };

/** Upload a customer's review photo. Called directly from a client component. */
export async function uploadReviewPhoto(formData: FormData): Promise<UploadResult> {
  if (!hasAdminEnv()) return { error: "Uploads not configured." };
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "No file provided." };
  if (file.size > 5 * 1024 * 1024) return { error: "File exceeds 5 MB limit." };
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const fileName = `${crypto.randomUUID()}.${ext}`;

  try {
    const supabase = createAdminClient();
    // Ensure bucket exists (best-effort; ignored if already there).
    const { error: upErr } = await supabase.storage
      .from(UGC_BUCKET)
      .upload(fileName, file, { contentType: file.type, upsert: false });
    if (upErr) return { error: upErr.message };
    const { data } = supabase.storage.from(UGC_BUCKET).getPublicUrl(fileName);
    return { url: data.publicUrl };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed." };
  }
}

export async function submitReview(
  _prev: ReviewSubmitResult | null,
  formData: FormData,
): Promise<ReviewSubmitResult> {
  if (!hasAdminEnv()) return { ok: false, error: "Reviews are not configured." };

  const code = String(formData.get("code") ?? "").trim();
  const product_id = String(formData.get("product_id") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 0);
  const body = String(formData.get("body") ?? "").trim();
  const author_name = String(formData.get("author_name") ?? "").trim();
  const photo_url = String(formData.get("photo_url") ?? "").trim() || null;

  if (!code || !product_id) return { ok: false, error: "Missing order or product." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "Please choose a rating between 1 and 5." };
  }
  if (body.length < 10) return { ok: false, error: "Review must be at least 10 characters." };
  if (body.length > 1000) return { ok: false, error: "Review must be under 1000 characters." };
  if (!author_name) return { ok: false, error: "Please add your name." };

  try {
    const supabase = createAdminClient();
    const { data: order } = await supabase
      .from("orders")
      .select("id")
      .eq("public_code", code)
      .single();
    if (!order) return { ok: false, error: "Order not found." };

    const { data: item } = await supabase
      .from("order_items")
      .select("id")
      .eq("order_id", order.id)
      .eq("product_id", product_id)
      .maybeSingle();
    if (!item) return { ok: false, error: "That product wasn't in this order." };

    const { error } = await supabase.from("reviews").upsert(
      {
        order_id: order.id,
        product_id,
        rating,
        body,
        author_name,
        photo_url,
        approved: false,
      },
      { onConflict: "order_id,product_id" },
    );
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to submit review." };
  }

  revalidatePath(`/review/${code}`);
  return { ok: true, message: "Thanks — your review is pending approval." };
}
