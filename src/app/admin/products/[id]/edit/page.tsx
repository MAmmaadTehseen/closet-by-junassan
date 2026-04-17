import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createAdminClient, hasAdminEnv } from "@/lib/supabase/admin";
import { fetchCategories } from "@/lib/categories";
import { updateProductFull } from "@/lib/admin-actions";
import ProductForm from "@/components/admin/ProductForm";
import type { Product } from "@/lib/types";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  if (!hasAdminEnv()) redirect("/admin/products");

  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  if (!data) notFound();

  const [categories] = await Promise.all([fetchCategories()]);
  const product = data as Product;

  return (
    <>
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Products
        </Link>
        <p className="eyebrow">Admin · Catalog</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Edit Product</h1>
        <p className="mt-1 text-xs font-mono text-muted-foreground">{product.slug}</p>
      </div>

      <ProductForm action={updateProductFull} product={product} categories={categories} />
    </>
  );
}
