import { NextRequest, NextResponse } from "next/server";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

/**
 * Flip `active` flags on drops + bundles based on `goes_live_at` / `ends_at`.
 * Invoked by Vercel Cron every 15 minutes (see vercel.json).
 * Also callable manually with header `x-cron-secret: $CRON_SECRET`.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.get("x-cron-secret");
  const vercelCron = req.headers.get("user-agent")?.includes("vercel-cron");
  if (secret && header !== secret && !vercelCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasAdminEnv()) {
    return NextResponse.json({ skipped: true, reason: "no supabase env" });
  }

  const now = new Date().toISOString();
  const supabase = createAdminClient();
  const results: Record<string, number> = {};

  for (const table of ["drops", "bundles"] as const) {
    // Activate: goes_live_at <= now AND (ends_at IS NULL OR ends_at > now) AND active = false
    const { data: toActivate } = await supabase
      .from(table)
      .select("id")
      .eq("active", false)
      .lte("goes_live_at", now)
      .or(`ends_at.is.null,ends_at.gt.${now}`);
    if (toActivate && toActivate.length > 0) {
      await supabase
        .from(table)
        .update({ active: true })
        .in("id", toActivate.map((r) => r.id));
    }
    results[`${table}_activated`] = toActivate?.length ?? 0;

    // Deactivate expired.
    const { data: toExpire } = await supabase
      .from(table)
      .select("id")
      .eq("active", true)
      .not("ends_at", "is", null)
      .lte("ends_at", now);
    if (toExpire && toExpire.length > 0) {
      await supabase
        .from(table)
        .update({ active: false })
        .in("id", toExpire.map((r) => r.id));
    }
    results[`${table}_expired`] = toExpire?.length ?? 0;
  }

  const total = Object.values(results).reduce((n, v) => n + v, 0);
  if (total > 0) {
    revalidatePath("/");
    revalidatePath("/product");
  }

  return NextResponse.json({ ok: true, at: now, ...results });
}
