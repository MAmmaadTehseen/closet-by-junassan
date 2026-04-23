import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site-config";

export default function ShopByBrand() {
  return (
    <section className="border-t border-border bg-cream/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Shop by Brand</p>
              <h2 className="font-display text-3xl font-semibold leading-tight sm:text-5xl">
                The names you trust.
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-8">
          {siteConfig.brands.map((b, i) => (
            <Reveal key={b.slug} delay={i * 40}>
              <Link
                href={`/collections/all?brand=${b.slug}`}
                className="group flex h-28 w-40 flex-shrink-0 snap-start items-center justify-center rounded-2xl border border-border bg-paper px-4 text-center transition hover:border-ink hover:scale-[1.03] sm:h-32 sm:w-auto"
              >
                <span className="font-display text-xl font-medium tracking-tight text-ink sm:text-2xl">
                  {b.name}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
