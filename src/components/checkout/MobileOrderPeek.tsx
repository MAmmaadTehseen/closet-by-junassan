"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPKR } from "@/lib/format";

export default function MobileOrderPeek() {
  const items = useCart((s) => s.items);
  const [open, setOpen] = useState(false);
  const subtotal = items.reduce((n, i) => n + i.price_pkr * i.quantity, 0);
  const count = items.reduce((n, i) => n + i.quantity, 0);

  if (items.length === 0) return null;

  return (
    <div className="sticky top-16 z-20 -mx-4 mb-6 border-b border-border bg-paper/95 backdrop-blur lg:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <ShoppingBag className="h-4 w-4 text-ink" />
        <span className="flex-1 text-sm">
          <span className="font-semibold">{count}</span>{" "}
          {count === 1 ? "item" : "items"} in your order
        </span>
        <span className="text-sm font-semibold">{formatPKR(subtotal)}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <ul className="max-h-60 divide-y divide-border overflow-y-auto border-t border-border px-4">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-3 py-2.5">
              <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-cream">
                {i.image && (
                  <Image src={i.image} alt={i.name} fill sizes="40px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm">{i.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  Size {i.size} · Qty {i.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {formatPKR(i.price_pkr * i.quantity)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
