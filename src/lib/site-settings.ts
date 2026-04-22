import { createClient } from "@supabase/supabase-js";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const sb = publicClient();
  if (!sb) return fallback;
  try {
    const { data } = await sb.from("site_settings").select("value").eq("key", key).maybeSingle();
    return (data?.value as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getSettingAdmin<T>(key: string, fallback: T): Promise<T> {
  if (!hasAdminEnv()) return fallback;
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
    return (data?.value as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  if (!hasAdminEnv()) return;
  const supabase = createAdminClient();
  await supabase
    .from("site_settings")
    .upsert({ key, value: value as never, updated_at: new Date().toISOString() })
    .then(() => {});
}

export const MARQUEE_KEY = "marquee_items";
export const DEFAULT_MARQUEE = [
  "Free Delivery",
  "Cash on Delivery",
  "Karachi → Gilgit",
  "New drops every week",
  "Limited pieces",
  "Hand-picked finds",
];
