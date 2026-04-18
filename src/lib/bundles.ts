import { createClient } from "@supabase/supabase-js";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";
import { fetchProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export interface BundleSummary {
  id: string;
  title: string;
  combo_price_pkr: number;
  active: boolean;
  product_ids: string[];
}

export interface BundleWithProducts {
  id: string;
  title: string;
  combo_price_pkr: number;
  original_total: number;
  savings: number;
  savings_pct: number;
  products: Product[];
}

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}

export async function fetchBundlesForProduct(productId: string): Promise<BundleWithProducts[]> {
  const sb = publicClient();
  if (!sb) return [];
  try {
    // Find bundles containing this product.
    const { data: mine } = await sb
      .from("bundle_products")
      .select("bundle_id")
      .eq("product_id", productId);
    const bundleIds = Array.from(new Set((mine ?? []).map((r) => r.bundle_id)));
    if (bundleIds.length === 0) return [];

    const { data: bundles } = await sb
      .from("bundles")
      .select("*")
      .in("id", bundleIds)
      .eq("active", true);
    if (!bundles || bundles.length === 0) return [];

    const { data: links } = await sb
      .from("bundle_products")
      .select("bundle_id,product_id,position")
      .in("bundle_id", bundles.map((b) => b.id))
      .order("position", { ascending: true });

    const allProducts = await fetchProducts({ limit: 500 });
    const byId = new Map(allProducts.map((p) => [p.id, p]));

    return bundles
      .map((b) => {
        const ordered = (links ?? [])
          .filter((l) => l.bundle_id === b.id)
          .map((l) => byId.get(l.product_id))
          .filter((p): p is Product => Boolean(p));
        const original_total = ordered.reduce((n, p) => n + p.price_pkr, 0);
        const savings = Math.max(0, original_total - b.combo_price_pkr);
        const savings_pct = original_total > 0 ? Math.round((savings / original_total) * 100) : 0;
        return {
          id: b.id as string,
          title: b.title as string,
          combo_price_pkr: b.combo_price_pkr as number,
          original_total,
          savings,
          savings_pct,
          products: ordered,
        };
      })
      .filter((b) => b.products.length >= 2);
  } catch {
    return [];
  }
}

export async function fetchAllBundlesAdmin(): Promise<BundleSummary[]> {
  if (!hasAdminEnv()) return [];
  try {
    const supabase = createAdminClient();
    const { data: bundles } = await supabase
      .from("bundles")
      .select("*")
      .order("created_at", { ascending: false });
    if (!bundles || bundles.length === 0) return [];
    const { data: links } = await supabase
      .from("bundle_products")
      .select("bundle_id,product_id,position")
      .order("position", { ascending: true });
    return bundles.map((b) => ({
      id: b.id as string,
      title: b.title as string,
      combo_price_pkr: b.combo_price_pkr as number,
      active: b.active as boolean,
      product_ids: (links ?? [])
        .filter((l) => l.bundle_id === b.id)
        .map((l) => l.product_id as string),
    }));
  } catch {
    return [];
  }
}
