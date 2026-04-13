import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

export default function ProductRail({
  title,
  products,
  href,
}: {
  title: string;
  products: Product[];
  href?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible lg:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="w-52 flex-shrink-0 sm:w-auto">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
