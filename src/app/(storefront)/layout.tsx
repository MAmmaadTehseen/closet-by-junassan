import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientShell from "@/components/app-shell/ClientShell";
import { fetchProducts } from "@/lib/products";
import { fetchCategories } from "@/lib/categories";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, categories] = await Promise.all([
    fetchProducts({ limit: 60 }),
    fetchCategories(),
  ]);
  return (
    <>
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
      <div aria-hidden className="h-16 shrink-0 lg:hidden" />
      <ClientShell products={products} />
    </>
  );
}
