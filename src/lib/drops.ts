import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@supabase/supabase-js";

export interface Drop {
  id: string;
  title: string;
  subtitle: string | null;
  cover_image: string;
  cta_label: string | null;
  cta_href: string | null;
  sort_order: number;
  active: boolean;
  published_at: string;
  goes_live_at: string | null;
  ends_at: string | null;
}

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}

export async function fetchActiveDrops(): Promise<Drop[]> {
  const sb = publicClient();
  if (!sb) return [];
  try {
    const { data } = await sb
      .from("drops")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false })
      .limit(12);
    return (data ?? []) as Drop[];
  } catch {
    return [];
  }
}

export async function fetchAllDropsAdmin(): Promise<Drop[]> {
  if (!hasAdminEnv()) return [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("drops")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false });
    return (data ?? []) as Drop[];
  } catch {
    return [];
  }
}
