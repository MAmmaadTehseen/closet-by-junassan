import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v).replace(/"/g, '""');
  return /[,"\n]/.test(s) ? `"${s}"` : s;
}

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasAdminEnv()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const sp = req.nextUrl.searchParams;
  const status = sp.get("status") ?? "all";
  const q = (sp.get("q") ?? "").trim();
  const range = sp.get("range") ?? "all";

  const supabase = createAdminClient();
  let query = supabase
    .from("orders")
    .select("public_code,full_name,phone,city,address,notes,subtotal_pkr,status,created_at")
    .order("created_at", { ascending: false })
    .limit(2000);

  if (STATUSES.includes(status)) query = query.eq("status", status);

  if (range !== "all") {
    const since = new Date();
    if (range === "today") since.setHours(0, 0, 0, 0);
    else if (range === "7d") since.setDate(since.getDate() - 7);
    else if (range === "30d") since.setDate(since.getDate() - 30);
    query = query.gte("created_at", since.toISOString());
  }

  if (q) {
    query = query.or(
      `public_code.ilike.%${q}%,full_name.ilike.%${q}%,phone.ilike.%${q}%,city.ilike.%${q}%`,
    );
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const headers = [
    "order_code",
    "name",
    "phone",
    "city",
    "address",
    "notes",
    "subtotal_pkr",
    "status",
    "created_at",
  ];
  const lines = [headers.join(",")];
  for (const row of data ?? []) {
    lines.push(
      [
        row.public_code,
        row.full_name,
        row.phone,
        row.city,
        row.address,
        row.notes,
        row.subtotal_pkr,
        row.status,
        row.created_at,
      ]
        .map(csvEscape)
        .join(","),
    );
  }
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${stamp}.csv"`,
    },
  });
}
