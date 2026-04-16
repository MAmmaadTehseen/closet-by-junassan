import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { isAdminAuthed } from "@/lib/admin-auth";
import { fetchProducts } from "@/lib/products";
import { hasAdminEnv } from "@/lib/supabase/admin";
import { updateProduct, applyBulkDiscount, clearBulkDiscount } from "@/lib/admin-actions";
import { CATEGORIES } from "@/lib/types";
import { formatPKR } from "@/lib/format";
import AdminForm from "@/components/admin/AdminForm";
import SubmitButton from "@/components/admin/SubmitButton";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default async function AdminProductsPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  const products = await fetchProducts({ limit: 200 });
  const editable = hasAdminEnv();

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Admin · Catalog</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Products</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {products.length} pieces · inline edit price, stock, and discount.
          </p>
        </div>
      </div>

      {editable && (
        <section className="mb-8 rounded-2xl border border-border bg-paper p-6">
          <p className="eyebrow mb-3">Bulk discount</p>
          <p className="mb-4 text-xs text-muted-foreground">
            Apply a flat percentage off to all products or a single category. Original prices
            are remembered so you can clear the discount later.
          </p>
          <AdminForm action={applyBulkDiscount} showInline className="flex flex-wrap items-center gap-3">
            <select
              name="category"
              defaultValue=""
              className="rounded-full border border-border bg-paper px-4 py-2 text-xs font-semibold uppercase tracking-widest"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="percent"
              min="1"
              max="90"
              required
              placeholder="% off"
              className="w-24 rounded-full border border-border bg-paper px-4 py-2 text-xs font-semibold"
            />
            <ConfirmButton
              message="Apply this discount to all matching products?"
              pendingText="Applying…"
              className="rounded-full bg-ink px-5 py-2 text-xs font-semibold uppercase tracking-widest text-paper disabled:opacity-60"
            >
              Apply
            </ConfirmButton>
          </AdminForm>

          <AdminForm action={clearBulkDiscount} showInline className="mt-3 flex flex-wrap items-center gap-3">
            <select
              name="category"
              defaultValue=""
              className="rounded-full border border-border bg-paper px-4 py-2 text-xs font-semibold uppercase tracking-widest"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
            <ConfirmButton
              message="Clear all discounts from matching products? This will restore original prices."
              pendingText="Clearing…"
              className="rounded-full border border-ink px-5 py-2 text-xs font-semibold uppercase tracking-widest text-ink hover:bg-ink hover:text-paper disabled:opacity-60"
            >
              Clear discounts
            </ConfirmButton>
          </AdminForm>
        </section>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-paper">
        <div className="hidden grid-cols-[60px_1.4fr_110px_130px_110px_80px] gap-3 border-b border-border bg-cream/40 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:grid">
          <span />
          <span>Product</span>
          <span>Price</span>
          <span>Was (original)</span>
          <span>Stock</span>
          <span />
        </div>
        <ul className="divide-y divide-border">
          {products.map((p) => {
            const discount =
              p.original_price_pkr && p.original_price_pkr > p.price_pkr
                ? Math.round(((p.original_price_pkr - p.price_pkr) / p.original_price_pkr) * 100)
                : 0;
            return (
              <li key={p.id} className="px-5 py-4">
                <AdminForm
                  action={updateProduct}
                  className="grid items-center gap-3 lg:grid-cols-[60px_1.4fr_110px_130px_110px_80px]"
                >
                  <input type="hidden" name="id" value={p.id} />
                  <div className="relative h-16 w-14 overflow-hidden rounded-lg bg-cream">
                    {p.images[0] && (
                      <Image src={p.images[0]} alt={p.name} fill sizes="56px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {p.brand} · {p.category}
                    </p>
                    <p className="line-clamp-1 text-sm font-medium">{p.name}</p>
                    {discount > 0 && (
                      <p className="mt-0.5 text-[10px] font-semibold text-accent-red">
                        -{discount}% off
                      </p>
                    )}
                  </div>
                  <label className="block lg:hidden">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Price</span>
                  </label>
                  <input
                    type="number"
                    name="price_pkr"
                    defaultValue={p.price_pkr}
                    min="0"
                    disabled={!editable}
                    className="rounded-lg border border-border bg-paper px-3 py-2 text-sm disabled:opacity-50"
                  />
                  <label className="block lg:hidden">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Was</span>
                  </label>
                  <input
                    type="number"
                    name="original_price_pkr"
                    defaultValue={p.original_price_pkr ?? ""}
                    min="0"
                    placeholder="—"
                    disabled={!editable}
                    className="rounded-lg border border-border bg-paper px-3 py-2 text-sm disabled:opacity-50"
                  />
                  <label className="block lg:hidden">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Stock</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    defaultValue={p.stock}
                    min="0"
                    disabled={!editable}
                    className="rounded-lg border border-border bg-paper px-3 py-2 text-sm disabled:opacity-50"
                  />
                  <div className="flex items-center gap-2">
                    <SubmitButton
                      disabled={!editable}
                      pendingText="…"
                      className="rounded-full bg-ink px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-paper disabled:opacity-50"
                    >
                      Save
                    </SubmitButton>
                    <Link
                      href={`/product/${p.slug}`}
                      target="_blank"
                      aria-label="View"
                      className="text-muted-foreground hover:text-ink"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <p className="col-span-full text-right text-[10px] text-muted-foreground lg:hidden">
                    Current: {formatPKR(p.price_pkr)} · Stock {p.stock}
                  </p>
                </AdminForm>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
