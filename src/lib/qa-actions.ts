"use server";

import { revalidatePath } from "next/cache";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthed } from "@/lib/admin-auth";

export type QaResult = { ok: true; message: string } | { ok: false; error: string };

export async function submitQuestion(
  _prev: QaResult | null,
  formData: FormData,
): Promise<QaResult> {
  if (!hasAdminEnv()) return { ok: false, error: "Q&A not configured." };
  const product_id = String(formData.get("product_id") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const asker_name = String(formData.get("asker_name") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;

  if (!product_id) return { ok: false, error: "Missing product." };
  if (body.length < 5) return { ok: false, error: "Question must be at least 5 characters." };
  if (body.length > 500) return { ok: false, error: "Question too long." };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("product_questions")
      .insert({ product_id, body, asker_name, phone });
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Submit failed." };
  }

  return { ok: true, message: "Thanks — we'll answer within a day." };
}

export async function answerQuestion(
  _prev: QaResult | null,
  formData: FormData,
): Promise<QaResult> {
  if (!(await isAdminAuthed())) return { ok: false, error: "Unauthorized." };
  if (!hasAdminEnv()) return { ok: false, error: "Q&A not configured." };

  const id = String(formData.get("id") ?? "");
  const answer = String(formData.get("answer") ?? "").trim();
  if (!id) return { ok: false, error: "Missing question id." };
  if (!answer) return { ok: false, error: "Answer cannot be empty." };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("product_questions")
      .update({
        answer,
        answered_at: new Date().toISOString(),
        approved: true,
      })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Update failed." };
  }

  revalidatePath("/admin/qa");
  revalidatePath("/product");
  return { ok: true, message: "Published." };
}

export async function deleteQuestion(
  _prev: QaResult | null,
  formData: FormData,
): Promise<QaResult> {
  if (!(await isAdminAuthed())) return { ok: false, error: "Unauthorized." };
  if (!hasAdminEnv()) return { ok: false, error: "Q&A not configured." };
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Missing id." };
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("product_questions").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Delete failed." };
  }
  revalidatePath("/admin/qa");
  return { ok: true, message: "Deleted." };
}
