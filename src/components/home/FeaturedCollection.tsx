import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Collection } from "@/lib/collections";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";
import Reveal from "@/components/ui/Reveal";

export default function FeaturedCollection({
  collection,
  products,
}: {
  collection: Collection;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="relative border-y border-border bg-cream">
      <div className="pointer-events-none absolute inset-0 noise opacity-30" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1.3fr] lg:gap-14 lg:py-24">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">The Collections · Featured</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
              {collection.title}
            </h2>
            {collection.subtitle && (
              <p className="mt-5 max-w-md font-display text-lg italic leading-relaxed text-ink/80 sm:text-xl">
                {collection.subtitle}
              </p>
            )}
            {collection.cover_image && (
              <div className="mt-8 relative aspect-4/5 w-full overflow-hidden rounded-3xl border border-border bg-paper lg:max-w-md">
                <Image
                  src={collection.cover_image}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover transition-transform duration-1000 ease-out hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
              </div>
            )}
            <Link
              href={`/collections/${collection.slug}`}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper transition hover:opacity-90"
            >
              Enter the chapter
              <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4">
          {products.slice(0, 4).map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
