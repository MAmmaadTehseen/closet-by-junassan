import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isAdminAuthed } from "@/lib/admin-auth";
import { fetchCollectionAdminDetail } from "@/lib/collections";
import { fetchProducts } from "@/lib/products";
import { updateCollection, setCollectionProducts } from "@/lib/admin-actions";
import AdminForm from "@/components/admin/AdminForm";
import SubmitButton from "@/components/admin/SubmitButton";
import CollectionProductPicker from "@/components/admin/CollectionProductPicker";

type Params = Promise<{ slug: string }>;

export default async function AdminCollectionEdit({ params }: { params: Params }) {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  const { slug } = await params;
  const [detail, allProducts] = await Promise.all([
    fetchCollectionAdminDetail(slug),
    fetchProducts({ limit: 500 }),
  ]);
  if (!detail) notFound();

  const { collection, productIds } = detail;

  return (
    <>
      <div className="mb-6">
        <Link
          href="/admin/collections"
          className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All collections
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Editing</p>
            <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              {collection.title}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">/{collection.slug}</p>
          </div>
          <Link
            href={`/collections/${collection.slug}`}
            target="_blank"
            className="rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-ink hover:text-ink"
          >
            Preview
          </Link>
        </div>
      </div>

      {/* Details */}
      <section className="mb-10 rounded-2xl border border-border bg-paper p-6">
        <p className="eyebrow mb-4">Details</p>
        <AdminForm action={updateCollection} className="grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="slug" value={collection.slug} />
          <Field label="Title *">
            <input name="title" defaultValue={collection.title} required className={input} />
          </Field>
          <Field label="Sort order">
            <input
              name="sort_order"
              type="number"
              defaultValue={collection.sort_order}
              className={input}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Subtitle">
              <input name="subtitle" defaultValue={collection.subtitle ?? ""} className={input} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Cover image URL">
              <input
                name="cover_image"
                defaultValue={collection.cover_image ?? ""}
                className={input}
              />
              {collection.cover_image && (
                <div className="relative mt-3 aspect-video w-full max-w-md overflow-hidden rounded-xl bg-cream">
                  <Image
                    src={collection.cover_image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover"
                  />
                </div>
              )}
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Description (paragraphs separated by a blank line)">
              <textarea
                name="description_md"
                rows={5}
                defaultValue={collection.description_md ?? ""}
                className={`${input} resize-y`}
              />
            </Field>
          </div>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={collection.featured}
              className="h-4 w-4 rounded border-border accent-ink"
            />
            Feature on homepage
          </label>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="active"
              defaultChecked={collection.active}
              className="h-4 w-4 rounded border-border accent-ink"
            />
            Active
          </label>
          <div className="sm:col-span-2">
            <SubmitButton
              pendingText="Saving…"
              className="rounded-full bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-paper disabled:opacity-60"
            >
              Save details
            </SubmitButton>
          </div>
        </AdminForm>
      </section>

      {/* Product picker */}
      <section className="rounded-2xl border border-border bg-paper p-6">
        <p className="eyebrow mb-4">Products in this collection</p>
        <AdminForm action={setCollectionProducts}>
          <input type="hidden" name="slug" value={collection.slug} />
          <CollectionProductPicker
            allProducts={allProducts.map((p) => ({
              id: p.id,
              name: p.name,
              brand: p.brand,
              image: p.images[0] ?? "",
              category: p.category,
            }))}
            initialIds={productIds}
          />
          <div className="mt-6 border-t border-border pt-5">
            <SubmitButton
              pendingText="Saving…"
              className="rounded-full bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-paper disabled:opacity-60"
            >
              Save selection & order
            </SubmitButton>
          </div>
        </AdminForm>
      </section>
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
