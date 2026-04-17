"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { ActionResult } from "@/lib/admin-actions";
import type { Product } from "@/lib/types";
import type { CategoryDef } from "@/lib/categories";

type ProductAction = (
  _prev: ActionResult | null,
  formData: FormData,
) => Promise<ActionResult>;

const CONDITIONS = ["like new", "good", "fair", "worn"] as const;

export default function ProductForm({
  action,
  product,
  categories,
}: {
  action: ProductAction;
  product?: Product;
  categories: CategoryDef[];
}) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-8">
      {product && <input type="hidden" name="id" value={product.id} />}

      {state && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </div>
      )}

      {/* Core info */}
      <fieldset className="rounded-2xl border border-border bg-paper p-6 space-y-4">
        <legend className="px-1 eyebrow">Core Info</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product Name *">
            <input
              type="text"
              name="name"
              required
              defaultValue={product?.name}
              placeholder="e.g. Levi's 501 Jeans"
              className={input}
            />
          </Field>
          <Field label="Brand *">
            <input
              type="text"
              name="brand"
              required
              defaultValue={product?.brand}
              placeholder="e.g. Levi's"
              className={input}
            />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            name="description"
            rows={3}
            defaultValue={product?.description}
            placeholder="Describe the item…"
            className={`${input} resize-none`}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Category *">
            <select name="category" required defaultValue={product?.category ?? ""} className={input}>
              <option value="" disabled>Select…</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Size">
            <input
              type="text"
              name="size"
              defaultValue={product?.size}
              placeholder="e.g. M, L, Free"
              className={input}
            />
          </Field>
          <Field label="Condition *">
            <select name="condition" required defaultValue={product?.condition ?? "good"} className={input}>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      {/* Pricing & stock */}
      <fieldset className="rounded-2xl border border-border bg-paper p-6 space-y-4">
        <legend className="px-1 eyebrow">Pricing & Stock</legend>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Price (PKR) *">
            <input
              type="number"
              name="price_pkr"
              required
              min="1"
              defaultValue={product?.price_pkr}
              className={input}
            />
          </Field>
          <Field label="Original Price (PKR)">
            <input
              type="number"
              name="original_price_pkr"
              min="1"
              defaultValue={product?.original_price_pkr ?? ""}
              placeholder="—"
              className={input}
            />
          </Field>
          <Field label="Stock *">
            <input
              type="number"
              name="stock"
              required
              min="0"
              defaultValue={product?.stock ?? 1}
              className={input}
            />
          </Field>
          <Field label="Original Stock">
            <input
              type="number"
              name="original_stock"
              min="0"
              defaultValue={product?.original_stock ?? ""}
              placeholder="—"
              className={input}
            />
          </Field>
        </div>
      </fieldset>

      {/* Images */}
      <fieldset className="rounded-2xl border border-border bg-paper p-6 space-y-4">
        <legend className="px-1 eyebrow">Images</legend>
        <p className="text-xs text-muted-foreground">Paste direct image URLs. First image is the cover.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <Field key={i} label={i === 0 ? "Image 1 (cover) *" : `Image ${i + 1}`}>
              <input
                type="url"
                name={`image_${i}`}
                defaultValue={product?.images[i] ?? ""}
                placeholder="https://…"
                className={input}
              />
            </Field>
          ))}
        </div>
      </fieldset>

      {/* Tags */}
      <fieldset className="rounded-2xl border border-border bg-paper p-6">
        <legend className="px-1 eyebrow mb-3">Tags</legend>
        <div className="flex flex-wrap gap-4">
          {(["new", "trending", "limited"] as const).map((tag) => (
            <label key={tag} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                name={`tag_${tag}`}
                defaultChecked={product?.tags.includes(tag)}
                className="h-4 w-4 rounded border-border accent-ink"
              />
              <span className="capitalize">{tag === "new" ? "New Arrival" : tag}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Details */}
      <fieldset className="rounded-2xl border border-border bg-paper p-6 space-y-4">
        <legend className="px-1 eyebrow">Details (optional)</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Fabric">
            <input
              type="text"
              name="fabric"
              defaultValue={product?.fabric ?? ""}
              placeholder="e.g. 100% Cotton"
              className={input}
            />
          </Field>
          <Field label="Measurements">
            <input
              type="text"
              name="measurements"
              defaultValue={product?.measurements ?? ""}
              placeholder="e.g. Chest 38in"
              className={input}
            />
          </Field>
          <Field label="Care">
            <input
              type="text"
              name="care"
              defaultValue={product?.care ?? ""}
              placeholder="e.g. Machine wash cold"
              className={input}
            />
          </Field>
        </div>
      </fieldset>

      <FormActions product={product} />
    </form>
  );
}

function FormActions({ product }: { product?: Product }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex items-center gap-3">
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-widest text-paper transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : product ? "Update Product" : "Create Product"}
      </button>
      <a
        href="/admin/products"
        className="rounded-full border border-border px-5 py-3 text-xs font-semibold uppercase tracking-widest text-ink hover:border-ink"
      >
        Cancel
      </a>
    </div>
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
