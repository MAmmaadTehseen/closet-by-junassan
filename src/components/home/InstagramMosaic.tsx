import Image from "next/image";
import Link from "next/link";
import { InstagramIcon } from "@/components/ui/brand-icons";
import Reveal from "@/components/ui/Reveal";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function InstagramMosaic({ products }: { products: Product[] }) {
  const pics = products.slice(0, 6);
  if (pics.length < 4) return null;

  const spans = [
    "sm:col-span-2 sm:row-span-2",
    "",
    "",
    "sm:col-span-2",
    "",
    "",
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mb-10 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-2">01 · New This Week</p>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Fresh off the rail.
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground hover:text-ink"
          >
            <InstagramIcon className="h-3.5 w-3.5" /> See all new drops →
          </Link>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {pics.map((p, i) => (
          <Reveal key={p.id} delay={i * 60} className={spans[i] ?? ""}>
            <Link
              href={`/product/${p.slug}`}
              className="group relative block aspect-square h-full w-full overflow-hidden rounded-2xl bg-cream"
            >
              <Image
                src={p.images[0]}
                alt={p.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/70">
                  {p.brand}
                </p>
                <p className="line-clamp-1 text-sm font-semibold text-paper">{p.name}</p>
                <p className="text-sm font-semibold text-paper">{formatPKR(p.price_pkr)}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
