import { SEED_PRODUCTS } from "./seed-data";
import { createClient, hasSupabaseEnv } from "./supabase/server";
import type { Product } from "./types";

export interface ProductQuery {
  category?: string;
  gender?: string;
  type?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  tag?: "new" | "trending" | "limited";
  q?: string;
  limit?: number;
}

const GENDER_CATEGORIES = new Set(["men", "women", "kids"]);

function matchesTypeGender(
  productCategory: string,
  type?: string,
  gender?: string,
): boolean {
  const cat = productCategory.toLowerCase();

  if (type === "shoes") {
    if (cat !== "shoes") return false;
  } else if (type === "accessories") {
    if (cat !== "accessories") return false;
  } else if (type === "clothing") {
    if (!GENDER_CATEGORIES.has(cat)) return false;
  } else if (type === "activewear") {
    // Activewear isn't a category today — treat as gendered clothing until a tag lands.
    if (!GENDER_CATEGORIES.has(cat)) return false;
  }

  if (gender && GENDER_CATEGORIES.has(gender)) {
    // Only enforce gender when the product itself is in a gendered bucket.
    if (GENDER_CATEGORIES.has(cat) && cat !== gender) return false;
  }

  return true;
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
  if (query.type || query.gender)
    result = result.filter((p) => matchesTypeGender(p.category, query.type, query.gender));
  if (query.brand) {
    const b = query.brand.toLowerCase().replace(/-/g, " ");
    result = result.filter((p) => p.brand.toLowerCase().replace(/-/g, " ") === b);
  }
  if (query.tag) result = result.filter((p) => p.tags.includes(query.tag!));
  if (query.minPrice !== undefined)
    result = result.filter((p) => p.price_pkr >= query.minPrice!);
  if (query.maxPrice !== undefined)
    result = result.filter((p) => p.price_pkr <= query.maxPrice!);
  if (query.size) result = result.filter((p) => p.size === query.size);
  if (query.q) {
    const q = query.q.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
  }

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

export async function fetchDistinctBrands(): Promise<string[]> {
  const all = await fetchProducts();
  const brands = new Set<string>();
  for (const p of all) if (p.brand) brands.add(p.brand);
  return [...brands].sort((a, b) => a.localeCompare(b));
}
