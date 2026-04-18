import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasAdminEnv } from "@/lib/supabase/admin";
import { getSettingAdmin, MARQUEE_KEY, DEFAULT_MARQUEE } from "@/lib/site-settings";
import { updateMarquee } from "@/lib/admin-actions";
import AdminForm from "@/components/admin/AdminForm";
import SubmitButton from "@/components/admin/SubmitButton";

export default async function AdminSettingsPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  const marquee = hasAdminEnv()
    ? await getSettingAdmin<string[]>(MARQUEE_KEY, DEFAULT_MARQUEE)
    : DEFAULT_MARQUEE;

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Admin · Site</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Settings</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Live-edit copy that appears on the storefront.
          </p>
        </div>
        <Settings className="h-5 w-5 text-muted-foreground" />
      </div>

      <section className="rounded-2xl border border-border bg-paper p-6">
        <p className="eyebrow mb-4">Hero marquee</p>
        <p className="mb-4 text-xs text-muted-foreground">
          One item per line. These loop across the hero bottom ribbon.
        </p>
        <AdminForm action={updateMarquee} className="space-y-4">
          <textarea
            name="items"
            defaultValue={marquee.join("\n")}
            rows={10}
            className="w-full rounded-lg border border-border bg-paper px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-ink"
          />
          <SubmitButton
            pendingText="Saving…"
            className="rounded-full bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-paper disabled:opacity-60"
          >
            Save marquee
          </SubmitButton>
        </AdminForm>
      </section>
    </>
  );
}
