import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Truck } from "lucide-react";
import Gallery from "@/components/product/Gallery";
import AddToCartButton from "@/components/product/AddToCartButton";
import ProductGrid from "@/components/product/ProductGrid";
import { fetchProductBySlug, fetchRelated } from "@/lib/products";
import { formatPKR } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const related = await fetchRelated(product);
  const onlyOne = product.stock === 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <Gallery images={product.images} alt={product.name} />

        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {product.brand}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold">{formatPKR(product.price_pkr)}</p>

          <div className="mt-6 grid grid-cols-3 gap-4 border-y border-border py-5 text-sm">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Brand</p>
              <p className="mt-1 font-medium">{product.brand}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Size</p>
              <p className="mt-1 font-medium">{product.size}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Condition</p>
              <p className="mt-1 font-medium">{product.condition}</p>
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <p
            className={`mt-6 text-sm font-semibold ${
              onlyOne ? "text-red-600" : "text-foreground"
            }`}
          >
            {product.stock === 0
              ? "Sold out"
              : onlyOne
                ? "Only 1 piece available"
                : `Only ${product.stock} pieces available`}
          </p>

          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-4 text-sm">
            <Truck className="h-5 w-5 flex-shrink-0" />
            <p>{siteConfig.shipping.banner}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-semibold sm:text-3xl">
            You may also like
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
