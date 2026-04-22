import Image from "next/image";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasAdminEnv } from "@/lib/supabase/admin";
import { fetchAllDropsAdmin } from "@/lib/drops";
import { createDrop, updateDrop, deleteDrop } from "@/lib/admin-actions";
import AdminForm from "@/components/admin/AdminForm";
import SubmitButton from "@/components/admin/SubmitButton";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default async function AdminDropsPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  const drops = hasAdminEnv() ? await fetchAllDropsAdmin() : [];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Admin · Content</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Drops</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Instagram-style stories that pin to the homepage under the hero. Great for weekly drop announcements, lookbooks, or campaigns.
          </p>
        </div>
        <Sparkles className="h-5 w-5 text-muted-foreground" />
      </div>

      {!hasAdminEnv() && (
        <p className="mb-6 rounded-xl border border-border bg-paper p-6 text-sm text-muted-foreground">
          Configure Supabase to enable drops.
        </p>
      )}

      {/* Create form */}
      <section className="mb-10 rounded-2xl border border-border bg-paper p-6">
        <p className="eyebrow mb-4">New drop</p>
        <AdminForm action={createDrop} className="grid gap-3 sm:grid-cols-2">
          <Field label="Title *">
            <input name="title" required className={input} placeholder="Spring Picks" />
          </Field>
          <Field label="Subtitle">
            <input name="subtitle" className={input} placeholder="Fresh linens for April" />
          </Field>
          <Field label="Cover image URL *">
            <input name="cover_image" required className={input} placeholder="https://…" />
          </Field>
          <Field label="Sort order">
            <input name="sort_order" type="number" defaultValue={0} className={input} />
          </Field>
          <Field label="CTA label">
            <input name="cta_label" className={input} placeholder="Shop the Drop" />
          </Field>
          <Field label="CTA link">
            <input name="cta_href" className={input} placeholder="/shop" />
          </Field>
          <Field label="Goes live (optional)">
            <input name="goes_live_at" type="datetime-local" className={input} />
          </Field>
          <Field label="Ends (optional)">
            <input name="ends_at" type="datetime-local" className={input} />
          </Field>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked className="h-4 w-4 rounded border-border accent-ink" />
            Active (visible on homepage)
          </label>
          <div className="sm:col-span-2">
            <SubmitButton
              pendingText="Creating…"
              className="rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-widest text-paper disabled:opacity-60"
            >
              Create drop
            </SubmitButton>
          </div>
        </AdminForm>
      </section>

      {/* List */}
      {drops.length === 0 ? (
        <p className="rounded-xl border border-border bg-paper p-6 text-sm text-muted-foreground">
          No drops yet — create one above to light up your homepage.
        </p>
      ) : (
        <div className="space-y-4">
          {drops.map((d) => (
            <details key={d.id} className="rounded-2xl border border-border bg-paper">
              <summary className="flex cursor-pointer items-center gap-4 p-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-cream">
                  {d.cover_image && (
                    <Image src={d.cover_image} alt="" fill sizes="56px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-display text-base font-semibold">{d.title}</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    {d.active ? "Active" : "Hidden"} · sort {d.sort_order}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${
                    d.active ? "bg-emerald-100 text-emerald-900" : "bg-cream text-muted-foreground"
                  }`}
                >
                  {d.active ? "Live" : "Draft"}
                </span>
              </summary>

              <div className="border-t border-border p-4">
                <AdminForm action={updateDrop} className="grid gap-3 sm:grid-cols-2">
                  <input type="hidden" name="id" value={d.id} />
                  <Field label="Title *">
                    <input name="title" defaultValue={d.title} required className={input} />
                  </Field>
                  <Field label="Subtitle">
                    <input name="subtitle" defaultValue={d.subtitle ?? ""} className={input} />
                  </Field>
                  <Field label="Cover image URL *">
                    <input name="cover_image" defaultValue={d.cover_image} required className={input} />
                  </Field>
                  <Field label="Sort order">
                    <input name="sort_order" type="number" defaultValue={d.sort_order} className={input} />
                  </Field>
                  <Field label="CTA label">
                    <input name="cta_label" defaultValue={d.cta_label ?? ""} className={input} />
                  </Field>
                  <Field label="CTA link">
                    <input name="cta_href" defaultValue={d.cta_href ?? ""} className={input} />
                  </Field>
                  <Field label="Goes live (optional)">
                    <input
                      name="goes_live_at"
                      type="datetime-local"
                      defaultValue={toLocalValue(d.goes_live_at)}
                      className={input}
                    />
                  </Field>
                  <Field label="Ends (optional)">
                    <input
                      name="ends_at"
                      type="datetime-local"
                      defaultValue={toLocalValue(d.ends_at)}
                      className={input}
                    />
                  </Field>
                  <label className="mt-2 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="active"
                      defaultChecked={d.active}
                      className="h-4 w-4 rounded border-border accent-ink"
                    />
                    Active
                  </label>
                  <div className="sm:col-span-2 flex gap-2">
                    <SubmitButton
                      pendingText="Saving…"
                      className="rounded-full bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-paper disabled:opacity-60"
                    >
                      Save
                    </SubmitButton>
                  </div>
                </AdminForm>

                <AdminForm action={deleteDrop} className="mt-4 border-t border-border pt-4">
                  <input type="hidden" name="id" value={d.id} />
                  <ConfirmButton
                    message={`Delete drop "${d.title}"? This cannot be undone.`}
                    className="rounded-full border border-accent-red px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-accent-red hover:bg-accent-red hover:text-paper"
                  >
                    Delete
                  </ConfirmButton>
                </AdminForm>
              </div>
            </details>
          ))}
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

const input =
  "rounded-lg border border-border bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink";

function toLocalValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
