import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import Reveal from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";

export default function ProductRail({
  eyebrow,
  title,
  products,
  href,
}: {
  eyebrow?: string;
  title: string;
  products: Product[];
  href?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              {title}
            </h2>
          </div>
          {href && (
            <Link
              href={href}
              className="group flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:text-ink"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </Reveal>
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible lg:grid-cols-4">
        {products.slice(0, 8).map((p, i) => (
          <div key={p.id} className="w-52 flex-shrink-0 snap-start sm:w-auto">
            <Reveal delay={i * 60}>
              <ProductCard product={p} />
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
