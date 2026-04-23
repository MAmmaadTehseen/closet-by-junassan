import Image from "next/image";
import Link from "next/link";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";
import WishlistButton from "./WishlistButton";
import QuickAddButton from "./QuickAddButton";
import QuickViewButton from "./QuickViewButton";
import CompareButton from "./CompareButton";

export default function ProductCard({
  product,
  priority,
}: {
  product: Product;
  priority?: boolean;
}) {
  const isLimited = product.tags.includes("limited") || product.stock <= 2;
  const onlyOne = product.stock === 1;
  const isNew = product.tags.includes("new");
  const hasSecondImage = product.images[1] && product.images[1] !== product.images[0];
  const discount =
    product.original_price_pkr && product.original_price_pkr > product.price_pkr
      ? Math.round(((product.original_price_pkr - product.price_pkr) / product.original_price_pkr) * 100)
      : 0;

  return (
    <div className="group relative">
      <Link href={`/product/${product.slug}`} className="block focus-ring">
        <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-cream">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              style={{ viewTransitionName: `product-${product.id}` }}
              className={`object-cover transition-[opacity,transform] duration-700 ease-out ${
                hasSecondImage ? "group-hover:opacity-0" : "group-hover:scale-[1.03]"
              }`}
            />
          )}
          {hasSecondImage && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
            />
          )}

          <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-1.5 sm:left-2.5 sm:top-2.5">
            {isNew && (
              <span className="rounded-full bg-paper/95 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink backdrop-blur sm:px-2.5 sm:py-1">
                New
              </span>
            )}
            {isLimited && !onlyOne && (
              <span className="rounded-full bg-ink px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-paper sm:px-2.5 sm:py-1">
                Limited
              </span>
            )}
            {discount >= 30 && (
              <span className="rounded-full bg-accent-red px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-paper sm:px-2.5 sm:py-1">
                -{discount}%
              </span>
            )}
          </div>

          {onlyOne && (
            <span className="pointer-events-none absolute bottom-2 left-2 animate-soft-pulse rounded-full bg-accent-red px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-paper sm:bottom-2.5 sm:left-2.5 sm:px-2.5 sm:py-1">
              Only 1 left
            </span>
          )}

          {/* Quick view — bottom-left, shows on hover (desktop) */}
          {!onlyOne && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 sm:bottom-2.5 sm:left-2.5">
              <QuickViewButton product={product} />
              <div className="hidden sm:inline-flex opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100">
                <CompareButton productId={product.id} productName={product.name} />
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-start justify-between gap-2 pr-11 pl-0.5">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {product.brand}
            </p>
            <h3 className="mt-1 line-clamp-1 text-sm font-medium text-ink">{product.name}</h3>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-sm font-semibold">{formatPKR(product.price_pkr)}</p>
              {product.original_price_pkr && product.original_price_pkr > product.price_pkr && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatPKR(product.original_price_pkr)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Quick actions: wishlist (on image, top-right) and quick-add (inline with price row, always visible). */}
      <div className="absolute right-2 top-2 sm:right-2.5 sm:top-2.5 sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
        <WishlistButton productId={product.id} productName={product.name} />
      </div>
      <div className="pointer-events-none absolute right-0 bottom-1">
        <div className="pointer-events-auto">
          <QuickAddButton product={product} />
        </div>
      </div>
    </div>
  );
}
