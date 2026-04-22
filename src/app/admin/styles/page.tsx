import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Palette } from "lucide-react";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasAdminEnv } from "@/lib/supabase/admin";
import { fetchAllStylesAdmin } from "@/lib/styles";
import { createStyle, updateStyle, deleteStyle } from "@/lib/admin-actions";
import AdminForm from "@/components/admin/AdminForm";
import SubmitButton from "@/components/admin/SubmitButton";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default async function AdminStylesPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  const styles = hasAdminEnv() ? await fetchAllStylesAdmin() : [];

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Admin · Content</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Styles</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Mood-board landing pages that group products by a tag on your{" "}
            <span className="font-semibold text-ink">products.tags</span> column. Use lowercase
            slugs like <code className="rounded bg-cream px-1">y2k</code>,{" "}
            <code className="rounded bg-cream px-1">officecore</code>.
          </p>
        </div>
        <Palette className="h-5 w-5 text-muted-foreground" />
      </div>

      <section className="mb-10 rounded-2xl border border-border bg-paper p-6">
        <p className="eyebrow mb-4">New style</p>
        <AdminForm action={createStyle} className="grid gap-3 sm:grid-cols-2">
          <Field label="Label *">
            <input name="label" required className={input} placeholder="Y2K" />
          </Field>
          <Field label="Slug * (lowercase)">
            <input
              name="slug"
              required
              pattern="[a-z0-9-]+"
              className={input}
              placeholder="y2k"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Cover image URL">
              <input name="cover_image" className={input} placeholder="https://…" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Description">
              <textarea
                name="description"
                rows={3}
                className={`${input} resize-y`}
                placeholder="Low-rise, glossy, unapologetic…"
              />
            </Field>
          </div>
          <Field label="Sort order">
            <input name="sort_order" type="number" defaultValue={0} className={input} />
          </Field>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked className="h-4 w-4 rounded border-border accent-ink" />
            Active
          </label>
          <div className="sm:col-span-2">
            <SubmitButton
              pendingText="Creating…"
              className="rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-widest text-paper disabled:opacity-60"
            >
              Create style
            </SubmitButton>
          </div>
        </AdminForm>
      </section>

      {styles.length === 0 ? (
        <p className="rounded-xl border border-border bg-paper p-6 text-sm text-muted-foreground">
          No styles yet.
        </p>
      ) : (
        <div className="space-y-4">
          {styles.map((s) => (
            <details key={s.slug} className="rounded-2xl border border-border bg-paper">
              <summary className="flex cursor-pointer items-center gap-4 p-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                  {s.cover_image && (
                    <Image src={s.cover_image} alt="" fill sizes="56px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-display text-base font-semibold">{s.label}</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    /style/{s.slug} · sort {s.sort_order}
                  </p>
                </div>
                <Link
                  href={`/style/${s.slug}`}
                  target="_blank"
                  className="rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-ink hover:text-ink"
                >
                  View
                </Link>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${
                    s.active ? "bg-emerald-100 text-emerald-900" : "bg-cream text-muted-foreground"
                  }`}
                >
                  {s.active ? "Live" : "Draft"}
                </span>
              </summary>
              <div className="border-t border-border p-4">
                <AdminForm action={updateStyle} className="grid gap-3 sm:grid-cols-2">
                  <input type="hidden" name="slug" value={s.slug} />
                  <Field label="Label *">
                    <input name="label" defaultValue={s.label} required className={input} />
                  </Field>
                  <Field label="Sort order">
                    <input
                      name="sort_order"
                      type="number"
                      defaultValue={s.sort_order}
                      className={input}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Cover image URL">
                      <input
                        name="cover_image"
                        defaultValue={s.cover_image ?? ""}
                        className={input}
                      />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Description">
                      <textarea
                        name="description"
                        rows={3}
                        defaultValue={s.description ?? ""}
                        className={`${input} resize-y`}
                      />
                    </Field>
                  </div>
                  <label className="mt-2 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="active"
                      defaultChecked={s.active}
                      className="h-4 w-4 rounded border-border accent-ink"
                    />
                    Active
                  </label>
                  <div className="sm:col-span-2">
                    <SubmitButton
                      pendingText="Saving…"
                      className="rounded-full bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-paper disabled:opacity-60"
                    >
                      Save
                    </SubmitButton>
                  </div>
                </AdminForm>

                <AdminForm action={deleteStyle} className="mt-4 border-t border-border pt-4">
                  <input type="hidden" name="slug" value={s.slug} />
                  <ConfirmButton
                    message={`Delete "${s.label}"? Products are not affected.`}
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
