import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientShell from "@/components/app-shell/ClientShell";
import { fetchProducts } from "@/lib/products";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = await fetchProducts({ limit: 60 });
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ClientShell products={products} />
    </>
  );
}
