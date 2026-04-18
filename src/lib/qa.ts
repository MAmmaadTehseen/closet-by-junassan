import { createClient } from "@supabase/supabase-js";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";

export interface Question {
  id: string;
  product_id: string;
  asker_name: string | null;
  phone: string | null;
  body: string;
  answer: string | null;
  answered_at: string | null;
  approved: boolean;
  created_at: string;
}

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}

export async function fetchAnsweredQuestions(productId: string): Promise<Question[]> {
  const sb = publicClient();
  if (!sb) return [];
  try {
    const { data } = await sb
      .from("product_questions")
      .select("*")
      .eq("product_id", productId)
      .eq("approved", true)
      .not("answer", "is", null)
      .order("created_at", { ascending: false })
      .limit(10);
    return (data ?? []) as Question[];
  } catch {
    return [];
  }
}

export async function fetchPendingQuestionsAdmin(): Promise<(Question & { product_name?: string })[]> {
  if (!hasAdminEnv()) return [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("product_questions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (!data) return [];
    const ids = Array.from(new Set(data.map((q) => q.product_id)));
    const { data: prods } = await supabase.from("products").select("id,name").in("id", ids);
    const map = new Map((prods ?? []).map((p) => [p.id, p.name]));
    return data.map((q) => ({ ...(q as Question), product_name: map.get(q.product_id) }));
  } catch {
    return [];
  }
}
