import { NextResponse } from "next/server";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 60;

export async function GET() {
  if (!hasAdminEnv()) return NextResponse.json({ events: [] });

  try {
    const supabase = createAdminClient();
    const since = new Date();
    since.setDate(since.getDate() - 3);

    const { data } = await supabase
      .from("orders")
      .select("full_name,city,created_at,order_items(name)")
      .in("status", ["confirmed", "shipped", "delivered"])
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false })
      .limit(20);

    const events = (data ?? [])
      .map((row) => {
        const first = String(row.full_name ?? "").split(/\s+/)[0] ?? "";
        const item = (row.order_items as { name: string }[] | null)?.[0]?.name ?? "";
        if (!first || !item || !row.city) return null;
        return {
          firstName: first.charAt(0).toUpperCase() + first.slice(1).toLowerCase(),
          city: row.city,
          product: item,
          when: row.created_at,
        };
      })
      .filter(Boolean);

    return NextResponse.json(
      { events },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } },
    );
  } catch {
    return NextResponse.json({ events: [] });
  }
}
