"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Expand, ShoppingBag, ArrowRight } from "lucide-react";
import Modal from "@/components/ui/Modal";
import WishlistButton from "./WishlistButton";
import { useCart } from "@/lib/cart-store";
import { useUi } from "@/lib/ui-store";
import { toast } from "@/components/ui/Toaster";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function QuickViewButton({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const add = useCart((s) => s.add);
  const openCart = useUi((s) => s.openCart);
  const soldOut = product.stock === 0;

  const handleAddToCart = () => {
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price_pkr: product.price_pkr,
      image: product.images[0] ?? "",
      size: product.size,
      quantity: 1,
      maxStock: product.stock,
    });
    toast.success(`Added to bag — ${product.name}`);
    openCart();
    close();
  };

  const discount =
    product.original_price_pkr && product.original_price_pkr > product.price_pkr
      ? Math.round(((product.original_price_pkr - product.price_pkr) / product.original_price_pkr) * 100)
      : 0;

  const shortDesc =
    product.description && product.description.length > 120
      ? product.description.slice(0, 120).trimEnd() + "…"
      : product.description;

  return (
    <>
      {/* Trigger button — appears on card hover (bottom-left of image) */}
      <button
        onClick={(e) => { e.preventDefault(); setOpen(true); }}
        aria-label={`Quick view ${product.name}`}
        className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-paper/95 text-ink shadow-sm backdrop-blur transition hover:bg-ink hover:text-paper focus-ring sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100 sm:focus-within:opacity-100"
      >
        <Expand className="h-3.5 w-3.5" />
      </button>

      {/* Modal */}
      <Modal open={open} onClose={close} maxWidth="max-w-2xl">
        <div className="grid gap-0 sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-4/5 overflow-hidden rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none bg-cream">
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            )}
            {discount >= 30 && (
              <span className="absolute left-3 top-3 rounded-full bg-accent-red px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-paper">
                -{discount}%
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between p-6">
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {product.brand}
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold leading-tight">
                  {product.name}
                </h2>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <p className="text-lg font-semibold">{formatPKR(product.price_pkr)}</p>
                {product.original_price_pkr && product.original_price_pkr > product.price_pkr && (
                  <p className="text-sm text-muted-foreground line-through">
                    {formatPKR(product.original_price_pkr)}
                  </p>
                )}
              </div>

              {/* Size pill */}
              {product.size && (
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Size</p>
                  <span className="inline-block rounded-full border border-border bg-cream/60 px-3 py-1 text-xs font-semibold">
                    {product.size}
                  </span>
                </div>
              )}

              {/* Description */}
              {shortDesc && (
                <p className="text-xs leading-relaxed text-muted-foreground">{shortDesc}</p>
              )}

              {/* Stock indicator */}
              {product.stock > 0 && product.stock <= 3 && (
                <p className="text-[11px] font-semibold text-accent-red animate-soft-pulse">
                  Only {product.stock} left
                </p>
              )}
            </div>

            <div className="mt-5 space-y-3">
              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={soldOut}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90 disabled:opacity-50"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                {soldOut ? "Sold out" : "Add to Bag"}
              </button>

              {/* Actions row */}
              <div className="flex items-center justify-between">
                <WishlistButton productId={product.id} productName={product.name} />
                <Link
                  href={`/product/${product.slug}`}
                  onClick={close}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-ink"
                >
                  View full details <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
