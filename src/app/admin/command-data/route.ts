import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  if (!hasAdminEnv()) return NextResponse.json({ products: [], orders: [] });

  try {
    const supabase = createAdminClient();
    const [productsRes, ordersRes] = await Promise.all([
      supabase
        .from("products")
        .select("id,name,brand,slug,stock,category")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("orders")
        .select("public_code,full_name,status,subtotal_pkr,created_at")
        .order("created_at", { ascending: false })
        .limit(80),
    ]);
    return NextResponse.json({
      products: productsRes.data ?? [],
      orders: ordersRes.data ?? [],
    });
  } catch {
    return NextResponse.json({ products: [], orders: [] });
  }
}
