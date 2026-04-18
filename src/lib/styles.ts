import { createClient } from "@supabase/supabase-js";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";
import { fetchProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export interface Style {
  slug: string;
  label: string;
  description: string | null;
  cover_image: string | null;
  sort_order: number;
  active: boolean;
}

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}

export async function fetchStyles(): Promise<Style[]> {
  const sb = publicClient();
  if (!sb) return [];
  try {
    const { data } = await sb
      .from("styles")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    return (data ?? []) as Style[];
  } catch {
    return [];
  }
}

export async function fetchStyleWithProducts(
  slug: string,
): Promise<{ style: Style; products: Product[] } | null> {
  const sb = publicClient();
  if (!sb) return null;
  try {
    const { data: style } = await sb
      .from("styles")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();
    if (!style) return null;
    // Match against product.tags array (existing column).
    const all = await fetchProducts({ limit: 500 });
    const products = all.filter((p) => (p.tags as readonly string[]).includes(slug));
    return { style: style as Style, products };
  } catch {
    return null;
  }
}

export async function fetchAllStylesAdmin(): Promise<Style[]> {
  if (!hasAdminEnv()) return [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("styles")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data ?? []) as Style[];
  } catch {
    return [];
  }
}
