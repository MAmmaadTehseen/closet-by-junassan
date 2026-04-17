import { redirect } from "next/navigation";
import { Layers, FolderTree } from "lucide-react";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createAdminClient, hasAdminEnv } from "@/lib/supabase/admin";
import { FALLBACK_CATEGORIES, type CategoryDef } from "@/lib/categories";
import { createCategory, updateCategory, deleteCategory } from "@/lib/admin-actions";
import AdminForm from "@/components/admin/AdminForm";
import SubmitButton from "@/components/admin/SubmitButton";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default async function AdminCategoriesPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  let categories: CategoryDef[] = [];
  if (hasAdminEnv()) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("categories")
      .select("slug, label, parent_slug, cover_image, sort_order")
      .order("sort_order", { ascending: true })
      .order("label", { ascending: true });
    categories = (data ?? []) as CategoryDef[];
  }
  if (categories.length === 0) categories = FALLBACK_CATEGORIES;

  const editable = hasAdminEnv();
  const roots = categories.filter((c) => !c.parent_slug);
  const children = categories.filter((c) => c.parent_slug);

  return (
    <>
      <div className="mb-8">
        <p className="eyebrow">Admin · Catalog</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Categories</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {categories.length} {categories.length === 1 ? "category" : "categories"} · manage
          your shop taxonomy. Sub-categories can be nested under a parent.
        </p>
      </div>

      {/* Add new category */}
      {editable && (
        <section className="mb-8 rounded-2xl border border-border bg-paper p-6">
          <p className="eyebrow mb-4">Add Category</p>
          <AdminForm action={createCategory} showInline className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Name *
              </label>
              <input
                type="text"
                name="label"
                required
                placeholder="e.g. Women"
                className="rounded-lg border border-border bg-paper px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Slug * (url-safe)
              </label>
              <input
                type="text"
                name="slug"
                required
                placeholder="e.g. women"
                pattern="[a-z0-9\-]+"
                className="rounded-lg border border-border bg-paper px-3 py-2 text-sm font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Parent (optional)
              </label>
              <select
                name="parent_slug"
                defaultValue=""
                className="rounded-lg border border-border bg-paper px-3 py-2 text-sm"
              >
                <option value="">None (top-level)</option>
                {roots.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Cover Image URL
              </label>
              <input
                type="url"
                name="cover_image"
                placeholder="https://…"
                className="rounded-lg border border-border bg-paper px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Sort Order
              </label>
              <input
                type="number"
                name="sort_order"
                defaultValue={categories.length + 1}
                min="0"
                className="rounded-lg border border-border bg-paper px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-end">
              <SubmitButton
                pendingText="Creating…"
                className="w-full rounded-full bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-paper disabled:opacity-60"
              >
                Create Category
              </SubmitButton>
            </div>
          </AdminForm>
        </section>
      )}

      {/* Category list */}
      <div className="rounded-2xl border border-border bg-paper overflow-hidden">
        <div className="border-b border-border bg-cream/40 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground hidden sm:grid sm:grid-cols-[1fr_100px_200px_80px_80px]">
          <span>Category</span>
          <span>Slug</span>
          <span>Cover Image</span>
          <span>Order</span>
          <span />
        </div>

        {/* Root categories */}
        {roots.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            No categories yet. Add one above.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {roots.map((cat) => (
              <CategoryRow
                key={cat.slug}
                cat={cat}
                allRoots={roots}
                editable={editable}
                indent={false}
              />
            ))}
            {/* Sub-categories */}
            {children.map((cat) => (
              <CategoryRow
                key={cat.slug}
                cat={cat}
                allRoots={roots}
                editable={editable}
                indent
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function CategoryRow({
  cat,
  allRoots,
  editable,
  indent,
}: {
  cat: CategoryDef;
  allRoots: CategoryDef[];
  editable: boolean;
  indent: boolean;
}) {
  return (
    <li className="px-5 py-4">
      <AdminForm
        action={updateCategory}
        className="grid gap-3 sm:grid-cols-[1fr_100px_200px_80px_80px] items-center"
      >
        <input type="hidden" name="slug" value={cat.slug} />

        <div className="flex items-center gap-2 min-w-0">
          {indent ? (
            <FolderTree className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <Layers className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
          <input
            type="text"
            name="label"
            defaultValue={cat.label}
            required
            disabled={!editable}
            className="min-w-0 flex-1 rounded-lg border border-border bg-paper px-3 py-2 text-sm disabled:opacity-50"
          />
        </div>

        <span className="font-mono text-xs text-muted-foreground px-1">{cat.slug}</span>

        <input
          type="url"
          name="cover_image"
          defaultValue={cat.cover_image ?? ""}
          placeholder="https://…"
          disabled={!editable}
          className="rounded-lg border border-border bg-paper px-3 py-2 text-xs disabled:opacity-50"
        />

        <div className="flex flex-col gap-1">
          <select
            name="parent_slug"
            defaultValue={cat.parent_slug ?? ""}
            disabled={!editable}
            className="rounded-lg border border-border bg-paper px-2 py-2 text-xs disabled:opacity-50"
          >
            <option value="">None</option>
            {allRoots
              .filter((r) => r.slug !== cat.slug)
              .map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.label}
                </option>
              ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {editable && (
            <>
              <SubmitButton
                pendingText="…"
                className="rounded-full bg-ink px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-paper disabled:opacity-50"
              >
                Save
              </SubmitButton>
            </>
          )}
        </div>
      </AdminForm>

      {editable && (
        <AdminForm action={deleteCategory} className="mt-1 flex justify-end">
          <input type="hidden" name="slug" value={cat.slug} />
          <ConfirmButton
            message={`Delete category "${cat.label}"? Products in this category will keep their category slug.`}
            pendingText="Deleting…"
            className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-accent-red"
          >
            Delete
          </ConfirmButton>
        </AdminForm>
      )}
    </li>
  );
}
