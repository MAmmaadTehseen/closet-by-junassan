"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { formatPKR } from "@/lib/format";

export default function CartView() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const subtotal = items.reduce((sum, i) => sum + i.price_pkr * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg text-muted-foreground">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <ul className="flex flex-col divide-y divide-border border-y border-border">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 py-5">
            <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.image && (
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">Size {item.size}</p>
                </div>
                <p className="font-semibold">{formatPKR(item.price_pkr * item.quantity)}</p>
              </div>
              <div className="mt-auto flex items-center justify-between pt-4">
                <div className="flex items-center gap-2 rounded-full border border-border">
                  <button
                    onClick={() => setQty(item.id, item.quantity - 1)}
                    className="p-2"
                    aria-label="Decrease"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-6 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => setQty(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                    className="p-2 disabled:opacity-30"
                    aria-label="Increase"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => remove(item.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-xl border border-border bg-muted/40 p-6">
        <h2 className="font-display text-xl font-semibold">Order Summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPKR(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span>Flat across Pakistan</span>
          </div>
        </div>
        <div className="mt-5 flex justify-between border-t border-border pt-4 text-base font-semibold">
          <span>Total</span>
          <span>{formatPKR(subtotal)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-6 block rounded-full bg-foreground py-3 text-center text-sm font-semibold text-background transition hover:opacity-90"
        >
          Proceed to Checkout
        </Link>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Cash on Delivery available all over Pakistan
        </p>
      </aside>
    </div>
  );
}
