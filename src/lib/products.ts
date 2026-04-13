import { SEED_PRODUCTS } from "./seed-data";
import { createClient, hasSupabaseEnv } from "./supabase/server";
import type { Category, Product } from "./types";

export interface ProductQuery {
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  tag?: "new" | "trending" | "limited";
  limit?: number;
}

export async function fetchProducts(query: ProductQuery = {}): Promise<Product[]> {
  let products: Product[] = [];

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      products = (data ?? []) as Product[];
      if (products.length === 0) products = SEED_PRODUCTS;
    } catch {
      products = SEED_PRODUCTS;
    }
  } else {
    products = SEED_PRODUCTS;
  }

  let result = [...products];

  if (query.category) result = result.filter((p) => p.category === query.category);
  if (query.tag) result = result.filter((p) => p.tags.includes(query.tag!));
  if (query.minPrice !== undefined)
    result = result.filter((p) => p.price_pkr >= query.minPrice!);
  if (query.maxPrice !== undefined)
    result = result.filter((p) => p.price_pkr <= query.maxPrice!);
  if (query.size) result = result.filter((p) => p.size === query.size);

  switch (query.sort) {
    case "price-asc":
      result.sort((a, b) => a.price_pkr - b.price_pkr);
      break;
    case "price-desc":
      result.sort((a, b) => b.price_pkr - a.price_pkr);
      break;
    case "newest":
    default:
      result.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  if (query.limit) result = result.slice(0, query.limit);
  return result;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();
      if (data) return data as Product;
    } catch {
      /* fall through to seed */
    }
  }
  return SEED_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function fetchRelated(product: Product, limit = 4): Promise<Product[]> {
  const all = await fetchProducts({ category: product.category });
  return all.filter((p) => p.slug !== product.slug).slice(0, limit);
}

export async function fetchAllSlugs(): Promise<string[]> {
  const all = await fetchProducts();
  return all.map((p) => p.slug);
}
