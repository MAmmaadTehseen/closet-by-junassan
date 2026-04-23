import Image from "next/image";
import Link from "next/link";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

/**
 * Picks one item per *other* category to suggest a head-to-toe outfit.
 * Renders nothing if we don't have at least two complementary categories in stock.
 */
export default function CompleteTheLook({
  product,
  allProducts,
}: {
  product: Product;
  allProducts: Product[];
}) {
  const wanted = ["shoes", "bags", "men", "women"].filter((c) => c !== product.category);
  const picks: Product[] = [];
  const used = new Set<string>([product.id]);
  for (const cat of wanted) {
    const next = allProducts.find(
      (p) => p.category === cat && p.stock > 0 && !used.has(p.id),
    );
    if (next) {
      picks.push(next);
      used.add(next.id);
    }
    if (picks.length >= 3) break;
  }
  if (picks.length < 2) return null;

  const total = product.price_pkr + picks.reduce((n, p) => n + p.price_pkr, 0);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
      <div className="rounded-3xl border border-border bg-cream/40 p-6 sm:p-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Style note</p>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Complete the look</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Hand-picked pairings to round out the outfit.
            </p>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Look total
            </p>
            <p className="font-display text-xl font-semibold">{formatPKR(total)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Anchor item — the current product */}
          <div className="relative">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-cream">
              {product.images[0] && (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              )}
              <span className="absolute left-2 top-2 rounded-full bg-ink px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-paper">
                This piece
              </span>
            </div>
            <p className="mt-2 line-clamp-1 text-xs font-medium">{product.name}</p>
            <p className="text-xs text-muted-foreground">{formatPKR(product.price_pkr)}</p>
          </div>

          {picks.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="group block">
              <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-cream">
                {p.images[0] && (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <p className="mt-2 line-clamp-1 text-xs font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">{formatPKR(p.price_pkr)}</p>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 sm:hidden">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Look total
          </p>
          <p className="font-display text-xl font-semibold">{formatPKR(total)}</p>
        </div>
      </div>
    </section>
  );
}
