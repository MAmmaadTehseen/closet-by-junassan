import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasAdminEnv } from "@/lib/supabase/admin";
import { fetchCategories } from "@/lib/categories";
import { createProduct } from "@/lib/admin-actions";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  if (!hasAdminEnv()) redirect("/admin/products");

  const categories = await fetchCategories();

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
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Add Product</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Fill in the details below. The slug is auto-generated from the product name.
        </p>
      </div>

      <ProductForm action={createProduct} categories={categories} />
    </>
  );
}
