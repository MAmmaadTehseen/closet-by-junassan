import Image from "next/image";
import Link from "next/link";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const isLimited = product.tags.includes("limited") || product.stock <= 2;
  const onlyOne = product.stock === 1;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-muted">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1">
          {product.tags.includes("new") && (
            <span className="rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground backdrop-blur">
              New
            </span>
          )}
          {isLimited && (
            <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-background">
              Limited Stock
            </span>
          )}
        </div>
        {onlyOne && (
          <span className="absolute bottom-2 left-2 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Only 1 left
          </span>
        )}
      </div>
      <div className="mt-3 px-0.5">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </p>
        <h3 className="mt-0.5 line-clamp-1 text-sm font-medium text-foreground">
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-semibold">{formatPKR(product.price_pkr)}</p>
      </div>
    </Link>
  );
}
