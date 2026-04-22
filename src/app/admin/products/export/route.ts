import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return csvEscape(v.join("|"));
  const s = String(v).replace(/"/g, '""');
  return /[,"\n]/.test(s) ? `"${s}"` : s;
}

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasAdminEnv()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,slug,name,brand,category,size,condition,price_pkr,original_price_pkr,stock,original_stock,fabric,measurements,care,tags,images,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const headers = [
    "id",
    "slug",
    "name",
    "brand",
    "category",
    "size",
    "condition",
    "price_pkr",
    "original_price_pkr",
    "stock",
    "original_stock",
    "fabric",
    "measurements",
    "care",
    "tags",
    "images",
    "created_at",
  ];
  const lines = [headers.join(",")];
  for (const row of data ?? []) {
    lines.push(headers.map((h) => csvEscape((row as Record<string, unknown>)[h])).join(","));
  }

  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="products-${stamp}.csv"`,
    },
  });
}
