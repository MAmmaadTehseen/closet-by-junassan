import { createClient, hasSupabaseEnv } from "./supabase/server";

export interface CategoryDef {
  slug: string;
  label: string;
  parent_slug: string | null;
  cover_image: string | null;
  sort_order: number;
}

/** Hard-coded fallback used when Supabase is unavailable. */
export const FALLBACK_CATEGORIES: CategoryDef[] = [
  { slug: "men",   label: "Men",   parent_slug: null, cover_image: null, sort_order: 1 },
  { slug: "women", label: "Women", parent_slug: null, cover_image: null, sort_order: 2 },
  { slug: "kids",  label: "Kids",  parent_slug: null, cover_image: null, sort_order: 3 },
  { slug: "shoes", label: "Shoes", parent_slug: null, cover_image: null, sort_order: 4 },
  { slug: "bags",  label: "Bags",  parent_slug: null, cover_image: null, sort_order: 5 },
];

/**
 * Fetch all categories, ordered by sort_order then label.
 * Falls back to FALLBACK_CATEGORIES when Supabase is not configured or
 * the table is empty (e.g. migration not yet run).
 *
 * Server-side only.
 */
export async function fetchCategories(): Promise<CategoryDef[]> {
  if (!hasSupabaseEnv()) return FALLBACK_CATEGORIES;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("slug, label, parent_slug, cover_image, sort_order")
      .order("sort_order", { ascending: true })
      .order("label",      { ascending: true });
    if (error) throw error;
    if (data && data.length > 0) return data as CategoryDef[];
  } catch {
    // fall through to static fallback
  }
  return FALLBACK_CATEGORIES;
}

/** Returns only the root-level (no parent) categories. */
export function rootCategories(cats: CategoryDef[]): CategoryDef[] {
  return cats.filter((c) => !c.parent_slug);
}

/** Returns direct children of a given parent slug. */
export function childCategories(cats: CategoryDef[], parentSlug: string): CategoryDef[] {
  return cats.filter((c) => c.parent_slug === parentSlug);
}
