"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import { useCart } from "@/lib/cart-store";
import { useUi } from "@/lib/ui-store";
import { formatPKR } from "@/lib/format";
import FreeShippingProgress from "./FreeShippingProgress";
import CartUpsell from "./CartUpsell";
import type { Product } from "@/lib/types";

export default function CartDrawer({ products = [] }: { products?: Product[] }) {
  const open = useUi((s) => s.cartOpen);
  const close = useUi((s) => s.closeCart);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = items.reduce((n, i) => n + i.price_pkr * i.quantity, 0);

  return (
    <Drawer open={open} onClose={close} title="Your Bag">
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream">
            <ShoppingBag className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="font-display text-lg font-semibold">Your bag is empty</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Limited pieces drop every week. Find something you love.
          </p>
          <Link
            href="/shop"
            onClick={close}
            className="mt-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-paper"
          >
            Shop New Arrivals
          </Link>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-4">
                <Link
                  href={`/product/${item.slug}`}
                  onClick={close}
                  className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-cream"
                >
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  )}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={close}
                    className="truncate text-sm font-medium hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">Size {item.size}</p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatPKR(item.price_pkr * item.quantity)}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 rounded-full border border-border">
                      <button
                        onClick={() => setQty(item.id, item.quantity - 1)}
                        className="p-2 disabled:opacity-30"
                        disabled={item.quantity <= 1}
                        aria-label="Decrease"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-5 text-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => setQty(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="p-2 disabled:opacity-30"
                        aria-label="Increase"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-xs text-muted-foreground hover:text-accent-red"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <CartUpsell products={products} />

          <div className="border-t border-border bg-cream/50 p-5">
            <div className="mb-3">
              <FreeShippingProgress subtotal={subtotal} />
            </div>
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-base font-semibold">{formatPKR(subtotal)}</span>
            </div>
            <p className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" /> Flat delivery across Pakistan
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/cart"
                onClick={close}
                className="rounded-full border border-ink py-3 text-center text-xs font-semibold uppercase tracking-widest text-ink transition hover:bg-ink hover:text-paper"
              >
                View Bag
              </Link>
              <Link
                href="/checkout"
                onClick={close}
                className="rounded-full bg-ink py-3 text-center text-xs font-semibold uppercase tracking-widest text-paper transition hover:opacity-90"
              >
                Checkout
              </Link>
            </div>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Cash on Delivery available
            </p>
          </div>
        </div>
      )}
    </Drawer>
  );
}
