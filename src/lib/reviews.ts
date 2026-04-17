import { createClient } from "@supabase/supabase-js";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";

export interface Review {
  id: string;
  product_id: string;
  order_id: string;
  rating: number;
  body: string;
  author_name: string;
  approved: boolean;
  created_at: string;
}

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}

export async function fetchApprovedReviews(productId: string): Promise<Review[]> {
  const sb = publicClient();
  if (!sb) return [];
  try {
    const { data } = await sb
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(20);
    return (data ?? []) as Review[];
  } catch {
    return [];
  }
}

export async function fetchAllReviewsAdmin(): Promise<(Review & { product_name?: string })[]> {
  if (!hasAdminEnv()) return [];
  try {
    const supabase = createAdminClient();
    const { data: reviews } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (!reviews) return [];
    const ids = Array.from(new Set(reviews.map((r) => r.product_id)));
    const { data: products } = await supabase
      .from("products")
      .select("id,name")
      .in("id", ids);
    const nameMap = new Map((products ?? []).map((p) => [p.id, p.name]));
    return reviews.map((r) => ({ ...(r as Review), product_name: nameMap.get(r.product_id) }));
  } catch {
    return [];
  }
}

export interface ReviewOrderItem {
  product_id: string;
  name: string;
}

export async function fetchOrderForReview(code: string): Promise<{
  id: string;
  public_code: string;
  full_name: string;
  items: ReviewOrderItem[];
} | null> {
  if (!hasAdminEnv()) return null;
  try {
    const supabase = createAdminClient();
    const { data: order } = await supabase
      .from("orders")
      .select("id,public_code,full_name")
      .eq("public_code", code)
      .single();
    if (!order) return null;
    const { data: items } = await supabase
      .from("order_items")
      .select("product_id,name")
      .eq("order_id", order.id);
    return {
      id: order.id,
      public_code: order.public_code,
      full_name: order.full_name,
      items: (items ?? []).filter((i) => i.product_id) as ReviewOrderItem[],
    };
  } catch {
    return null;
  }
}
