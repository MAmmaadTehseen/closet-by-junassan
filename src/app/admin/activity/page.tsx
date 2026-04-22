import { redirect } from "next/navigation";
import { Activity } from "lucide-react";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasAdminEnv } from "@/lib/supabase/admin";
import { fetchAuditFeed } from "@/lib/audit";

export default async function AdminActivityPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  const entries = hasAdminEnv() ? await fetchAuditFeed(150) : [];

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Admin · Audit</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Activity</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            A running log of every admin change. Keep yourself accountable.
          </p>
        </div>
        <Activity className="h-5 w-5 text-muted-foreground" />
      </div>

      {entries.length === 0 ? (
        <p className="rounded-xl border border-border bg-paper p-6 text-sm text-muted-foreground">
          No activity recorded yet.
        </p>
      ) : (
        <ol className="relative space-y-4 pl-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border">
          {entries.map((e) => {
            const date = new Date(e.created_at);
            return (
              <li key={e.id} className="relative">
                <span className="absolute -left-6 top-2 h-3 w-3 rounded-full border-2 border-paper bg-ink" />
                <div className="rounded-2xl border border-border bg-paper p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-ink">{e.summary ?? e.action}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                        {e.entity}
                        {e.entity_id ? ` · ${e.entity_id.slice(0, 12)}` : ""} · {e.actor}
                      </p>
                    </div>
                    <p className="text-[11px] text-muted-foreground tabular-nums">
                      {date.toLocaleString("en-PK", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
}
