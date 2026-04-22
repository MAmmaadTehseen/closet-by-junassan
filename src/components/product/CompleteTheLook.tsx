import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatPKR } from "@/lib/format";
import { completeTheLook } from "@/lib/complete-the-look";
import type { Product } from "@/lib/types";

export default function CompleteTheLook({
  anchor,
  pool,
}: {
  anchor: Product;
  pool: Product[];
}) {
  const items = completeTheLook(anchor, pool, 3);
  if (items.length === 0) return null;

  const totalBefore = anchor.price_pkr + items.reduce((n, i) => n + i.price_pkr, 0);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Styled together</p>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Complete the look
          </h2>
        </div>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Bundle total · <span className="font-semibold text-ink">{formatPKR(totalBefore)}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        <Link
          href={`/product/${anchor.slug}`}
          className="group relative block rounded-2xl border-2 border-ink"
        >
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-cream">
            <Image
              src={anchor.images[0]}
              alt={anchor.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="absolute left-2 top-2 rounded-full bg-ink px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-paper">
            This piece
          </div>
          <div className="px-1 pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {anchor.brand}
            </p>
            <p className="mt-0.5 line-clamp-1 text-sm font-medium">{anchor.name}</p>
            <p className="mt-1 text-sm font-semibold">{formatPKR(anchor.price_pkr)}</p>
          </div>
        </Link>

        {items.map((p, i) => (
          <div key={p.id} className="relative">
            <div className="pointer-events-none absolute -left-3 top-1/3 hidden h-8 w-8 items-center justify-center rounded-full border border-border bg-paper sm:flex">
              <Plus className="h-3.5 w-3.5" />
            </div>
            <Link
              href={`/product/${p.slug}`}
              className="group block"
              aria-label={`Add ${p.name} to the look`}
            >
              <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-cream">
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="px-1 pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {p.brand} · {p.category}
                </p>
                <p className="mt-0.5 line-clamp-1 text-sm font-medium">{p.name}</p>
                <p className="mt-1 text-sm font-semibold">{formatPKR(p.price_pkr)}</p>
              </div>
            </Link>
            {i === items.length - 1 && null}
          </div>
        ))}
      </div>
    </section>
  );
}
