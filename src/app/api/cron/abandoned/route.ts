import { NextRequest, NextResponse } from "next/server";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";
import { sendCartRecovery } from "@/lib/email";
import type { CartItem } from "@/lib/types";

/**
 * Hourly cron — finds cart drafts >2h old that haven't been notified or
 * recovered, emails the owner a recovery link, and marks them notified.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.get("x-cron-secret");
  const vercelCron = req.headers.get("user-agent")?.includes("vercel-cron");
  if (secret && header !== secret && !vercelCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasAdminEnv()) return NextResponse.json({ skipped: true });

  const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("cart_recoveries")
    .select("token,email,items_json,created_at")
    .is("notified_at", null)
    .is("recovered_at", null)
    .lte("created_at", cutoff)
    .limit(50);

  let sent = 0;
  for (const row of data ?? []) {
    try {
      await sendCartRecovery({
        email: row.email,
        token: row.token,
        items: row.items_json as CartItem[],
      });
      await supabase
        .from("cart_recoveries")
        .update({ notified_at: new Date().toISOString() })
        .eq("token", row.token);
      sent += 1;
    } catch {}
  }

  return NextResponse.json({ ok: true, sent, scanned: data?.length ?? 0 });
}
