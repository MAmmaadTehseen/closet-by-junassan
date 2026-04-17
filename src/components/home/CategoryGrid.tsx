import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import type { CategoryDef } from "@/lib/categories";

/** Fallback cover images for the original 5 categories. */
const COVER_FALLBACK: Record<string, string> = {
  men:   "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=80",
  women: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80",
  kids:  "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=1000&q=80",
  shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
  bags:  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
};

export default function CategoryGrid({
  categories = [],
  counts = {},
}: {
  categories?: CategoryDef[];
  counts?: Record<string, number>;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">02 · The Edit</p>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground hover:text-ink sm:inline"
          >
            All categories →
          </Link>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-6 sm:gap-4">
        {categories.map((c, i) => {
          const layout =
            i === 0
              ? "sm:col-span-3 sm:row-span-2 aspect-[4/5]"
              : i === 1
                ? "sm:col-span-3 aspect-[16/10]"
                : "sm:col-span-2 aspect-[4/5]";
          const image = c.cover_image ?? COVER_FALLBACK[c.slug];
          return (
            <Reveal key={c.slug} delay={i * 70} className={layout}>
              <Link
                href={`/category/${c.slug}`}
                className="group relative block h-full w-full overflow-hidden rounded-2xl bg-cream"
              >
                {image ? (
                  <Image
                    src={image}
                    alt={c.label}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-900 ease-out group-hover:scale-[1.06]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-cream to-ink/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/70">
                      {counts[c.slug] != null ? `${counts[c.slug]} pieces` : "Shop"}
                    </p>
                    <p className="font-display text-2xl font-semibold text-paper sm:text-3xl">
                      {c.label}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink transition group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
