import Image from "next/image";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasAdminEnv } from "@/lib/supabase/admin";
import { fetchAllBundlesAdmin } from "@/lib/bundles";
import { fetchProducts } from "@/lib/products";
import { createBundle, updateBundle, deleteBundle } from "@/lib/admin-actions";
import AdminForm from "@/components/admin/AdminForm";
import SubmitButton from "@/components/admin/SubmitButton";
import ConfirmButton from "@/components/admin/ConfirmButton";
import CollectionProductPicker from "@/components/admin/CollectionProductPicker";
import { formatPKR } from "@/lib/format";

export default async function AdminBundlesPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  const [bundles, products] = await Promise.all([
    hasAdminEnv() ? fetchAllBundlesAdmin() : Promise.resolve([]),
    fetchProducts({ limit: 500 }),
  ]);

  const pickerProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    image: p.images[0] ?? "",
    category: p.category,
  }));

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Admin · Merchandising</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            Bundles
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            &ldquo;Complete the Look&rdquo; — 2 or 3 products sold together at a combo price. Appears on every PDP of a bundled product.
          </p>
        </div>
        <Package className="h-5 w-5 text-muted-foreground" />
      </div>

      {!hasAdminEnv() && (
        <p className="mb-6 rounded-xl border border-border bg-paper p-6 text-sm text-muted-foreground">
          Configure Supabase to enable bundles.
        </p>
      )}

      {/* Create */}
      <section className="mb-10 rounded-2xl border border-border bg-paper p-6">
        <p className="eyebrow mb-4">New bundle</p>
        <AdminForm action={createBundle} className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title *">
              <input
                name="title"
                required
                className={input}
                placeholder="Summer essentials set"
              />
            </Field>
            <Field label="Combo price (PKR) *">
              <input
                name="combo_price_pkr"
                type="number"
                min="1"
                required
                className={input}
                placeholder="3500"
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked className="h-4 w-4 rounded border-border accent-ink" />
            Active
          </label>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Products in this bundle (pick at least 2)
            </p>
            <CollectionProductPicker allProducts={pickerProducts} initialIds={[]} />
          </div>
          <SubmitButton
            pendingText="Creating…"
            className="rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-widest text-paper disabled:opacity-60"
          >
            Create bundle
          </SubmitButton>
        </AdminForm>
      </section>

      {/* List */}
      {bundles.length === 0 ? (
        <p className="rounded-xl border border-border bg-paper p-6 text-sm text-muted-foreground">
          No bundles yet — create one above.
        </p>
      ) : (
        <div className="space-y-4">
          {bundles.map((b) => {
            const productMap = new Map(products.map((p) => [p.id, p]));
            const bundled = b.product_ids.map((id) => productMap.get(id)).filter(Boolean);
            const originalTotal = bundled.reduce((n, p) => n + (p?.price_pkr ?? 0), 0);
            const savings = Math.max(0, originalTotal - b.combo_price_pkr);
            return (
              <details key={b.id} className="rounded-2xl border border-border bg-paper">
                <summary className="flex cursor-pointer flex-wrap items-center gap-4 p-4">
                  <div className="flex -space-x-3">
                    {bundled.slice(0, 3).map((p) =>
                      p ? (
                        <div
                          key={p.id}
                          className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-paper bg-cream"
                        >
                          {p.images[0] && (
                            <Image
                              src={p.images[0]}
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          )}
                        </div>
                      ) : null,
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-base font-semibold">{b.title}</p>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                      {b.product_ids.length} items · {formatPKR(b.combo_price_pkr)} combo
                      {savings > 0 && ` · save ${formatPKR(savings)}`}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${
                      b.active ? "bg-emerald-100 text-emerald-900" : "bg-cream text-muted-foreground"
                    }`}
                  >
                    {b.active ? "Live" : "Hidden"}
                  </span>
                </summary>

                <div className="border-t border-border p-4 space-y-5">
                  <AdminForm action={updateBundle} className="space-y-5">
                    <input type="hidden" name="id" value={b.id} />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Title *">
                        <input
                          name="title"
                          defaultValue={b.title}
                          required
                          className={input}
                        />
                      </Field>
                      <Field label="Combo price (PKR) *">
                        <input
                          name="combo_price_pkr"
                          type="number"
                          min="1"
                          defaultValue={b.combo_price_pkr}
                          required
                          className={input}
                        />
                      </Field>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="active"
                        defaultChecked={b.active}
                        className="h-4 w-4 rounded border-border accent-ink"
                      />
                      Active
                    </label>
                    <CollectionProductPicker
                      allProducts={pickerProducts}
                      initialIds={b.product_ids}
                    />
                    <SubmitButton
                      pendingText="Saving…"
                      className="rounded-full bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-paper disabled:opacity-60"
                    >
                      Save bundle
                    </SubmitButton>
                  </AdminForm>

                  <AdminForm action={deleteBundle} className="border-t border-border pt-4">
                    <input type="hidden" name="id" value={b.id} />
                    <ConfirmButton
                      message={`Delete bundle "${b.title}"? This cannot be undone.`}
                      className="rounded-full border border-accent-red px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-accent-red hover:bg-accent-red hover:text-paper"
                    >
                      Delete
                    </ConfirmButton>
                  </AdminForm>
                </div>
              </details>
            );
          })}
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
