import { createClient } from "@supabase/supabase-js";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";
import { fetchProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export interface Collection {
  slug: string;
  title: string;
  subtitle: string | null;
  cover_image: string | null;
  description_md: string | null;
  featured: boolean;
  sort_order: number;
  active: boolean;
  published_at: string;
}

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}

export async function fetchCollections(opts: { featuredOnly?: boolean } = {}): Promise<Collection[]> {
  const sb = publicClient();
  if (!sb) return [];
  try {
    let q = sb
      .from("collections")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false });
    if (opts.featuredOnly) q = q.eq("featured", true);
    const { data } = await q;
    return (data ?? []) as Collection[];
  } catch {
    return [];
  }
}

export async function fetchCollectionBySlug(
  slug: string,
): Promise<{ collection: Collection; products: Product[] } | null> {
  const sb = publicClient();
  if (!sb) return null;
  try {
    const { data: collection } = await sb
      .from("collections")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();
    if (!collection) return null;

    const { data: pairs } = await sb
      .from("collection_products")
      .select("product_id,position")
      .eq("collection_slug", slug)
      .order("position", { ascending: true });

    const productIds = (pairs ?? []).map((p) => p.product_id);
    if (productIds.length === 0) {
      return { collection: collection as Collection, products: [] };
    }

    const allProducts = await fetchProducts({ limit: 500 });
    const byId = new Map(allProducts.map((p) => [p.id, p]));
    const ordered = productIds
      .map((id) => byId.get(id))
      .filter((p): p is Product => Boolean(p));

    return { collection: collection as Collection, products: ordered };
  } catch {
    return null;
  }
}

export async function fetchAllCollectionsAdmin(): Promise<Collection[]> {
  if (!hasAdminEnv()) return [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("collections")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false });
    return (data ?? []) as Collection[];
  } catch {
    return [];
  }
}

export async function fetchCollectionAdminDetail(
  slug: string,
): Promise<{ collection: Collection; productIds: string[] } | null> {
  if (!hasAdminEnv()) return null;
  try {
    const supabase = createAdminClient();
    const { data: collection } = await supabase
      .from("collections")
      .select("*")
      .eq("slug", slug)
      .single();
    if (!collection) return null;
    const { data: pairs } = await supabase
      .from("collection_products")
      .select("product_id,position")
      .eq("collection_slug", slug)
      .order("position", { ascending: true });
    return {
      collection: collection as Collection,
      productIds: (pairs ?? []).map((p) => p.product_id),
    };
  } catch {
    return null;
  }
}
