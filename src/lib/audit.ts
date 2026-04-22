import "server-only";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entity_id: string | null;
  summary: string | null;
  diff: Record<string, unknown> | null;
  created_at: string;
}

/** Append one audit entry. Fire-and-forget — never throws. */
export async function logAudit(entry: {
  action: string;
  entity: string;
  entity_id?: string;
  summary?: string;
  diff?: Record<string, unknown>;
}) {
  if (!hasAdminEnv()) return;
  try {
    const supabase = createAdminClient();
    await supabase
      .from("audit_log")
      .insert({
        actor: "admin",
        action: entry.action,
        entity: entry.entity,
        entity_id: entry.entity_id ?? null,
        summary: entry.summary ?? null,
        diff: entry.diff ?? null,
      })
      .then(() => {});
  } catch {
    // swallow
  }
}

export async function fetchAuditFeed(limit = 100): Promise<AuditEntry[]> {
  if (!hasAdminEnv()) return [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data ?? []) as AuditEntry[];
  } catch {
    return [];
  }
}
