import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Layers, Pencil } from "lucide-react";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasAdminEnv } from "@/lib/supabase/admin";
import { fetchAllCollectionsAdmin } from "@/lib/collections";
import { createCollection, deleteCollection } from "@/lib/admin-actions";
import AdminForm from "@/components/admin/AdminForm";
import SubmitButton from "@/components/admin/SubmitButton";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default async function AdminCollectionsPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  const collections = hasAdminEnv() ? await fetchAllCollectionsAdmin() : [];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Admin · Content</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Collections</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Curated editorial edits. Each collection is a chapter — hero image, title, subtitle, and a manually-ordered set of products.
          </p>
        </div>
        <Layers className="h-5 w-5 text-muted-foreground" />
      </div>

      {!hasAdminEnv() && (
        <p className="mb-6 rounded-xl border border-border bg-paper p-6 text-sm text-muted-foreground">
          Configure Supabase to enable collections.
        </p>
      )}

      {/* Create form */}
      <section className="mb-10 rounded-2xl border border-border bg-paper p-6">
        <p className="eyebrow mb-4">New collection</p>
        <AdminForm action={createCollection} className="grid gap-3 sm:grid-cols-2">
          <Field label="Title *">
            <input name="title" required className={input} placeholder="Linen Summer" />
          </Field>
          <Field label="Slug * (lowercase, hyphens)">
            <input
              name="slug"
              required
              pattern="[a-z0-9-]+"
              className={input}
              placeholder="linen-summer"
            />
          </Field>
          <Field label="Subtitle (pull quote)">
            <input
              name="subtitle"
              className={input}
              placeholder="Breathable weaves for the in-between days."
            />
          </Field>
          <Field label="Sort order">
            <input name="sort_order" type="number" defaultValue={0} className={input} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Cover image URL">
              <input name="cover_image" className={input} placeholder="https://…" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Description (paragraphs separated by a blank line)">
              <textarea
                name="description_md"
                rows={4}
                className={`${input} resize-y`}
                placeholder="Share the story behind this edit…"
              />
            </Field>
          </div>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" className="h-4 w-4 rounded border-border accent-ink" />
            Feature on homepage
          </label>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked className="h-4 w-4 rounded border-border accent-ink" />
            Active (visible on storefront)
          </label>
          <div className="sm:col-span-2">
            <SubmitButton
              pendingText="Creating…"
              className="rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-widest text-paper disabled:opacity-60"
            >
              Create collection
            </SubmitButton>
          </div>
        </AdminForm>
      </section>

      {/* List */}
      {collections.length === 0 ? (
        <p className="rounded-xl border border-border bg-paper p-6 text-sm text-muted-foreground">
          No collections yet — create one above to start a new edit.
        </p>
      ) : (
        <div className="space-y-4">
          {collections.map((c) => (
            <div
              key={c.slug}
              className="flex items-center gap-4 rounded-2xl border border-border bg-paper p-4"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                {c.cover_image && (
                  <Image src={c.cover_image} alt="" fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-lg font-semibold">{c.title}</p>
                  {c.featured && (
                    <span className="rounded-full bg-ink px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-paper">
                      Featured
                    </span>
                  )}
                  {!c.active && (
                    <span className="rounded-full bg-cream px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  /{c.slug} · sort {c.sort_order}
                </p>
                {c.subtitle && (
                  <p className="mt-1 line-clamp-1 text-xs italic text-muted-foreground">
                    {c.subtitle}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/collections/${c.slug}`}
                  target="_blank"
                  className="rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-ink hover:text-ink"
                >
                  View
                </Link>
                <Link
                  href={`/admin/collections/${c.slug}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-paper"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </Link>
                <AdminForm action={deleteCollection}>
                  <input type="hidden" name="slug" value={c.slug} />
                  <ConfirmButton
                    message={`Delete collection "${c.title}"? This cannot be undone.`}
                    className="rounded-full border border-accent-red px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent-red hover:bg-accent-red hover:text-paper"
                  >
                    Delete
                  </ConfirmButton>
                </AdminForm>
              </div>
            </div>
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
