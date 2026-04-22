"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, ShoppingBag, X } from "lucide-react";
import { useSaved } from "@/lib/saved-store";
import { useCart } from "@/lib/cart-store";
import { toast } from "@/components/ui/Toaster";
import { formatPKR } from "@/lib/format";

export default function SavedForLater() {
  const items = useSaved((s) => s.items);
  const remove = useSaved((s) => s.remove);
  const add = useCart((s) => s.add);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted || items.length === 0) return null;

  return (
    <div className="mt-12">
      <p className="eyebrow mb-4 inline-flex items-center gap-2">
        <Bookmark className="h-3.5 w-3.5" /> Saved for later — {items.length}
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id} className="group relative flex gap-3 rounded-2xl border border-border bg-paper p-3">
            <Link
              href={`/product/${item.slug}`}
              className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-cream"
            >
              {item.image && (
                <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
              )}
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <Link
                href={`/product/${item.slug}`}
                className="line-clamp-2 text-sm font-medium hover:underline"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-xs text-muted-foreground">Size {item.size}</p>
              <p className="mt-1 text-sm font-semibold">{formatPKR(item.price_pkr)}</p>
              <div className="mt-auto pt-2">
                <button
                  onClick={() => {
                    add({ ...item, quantity: 1 });
                    remove(item.id);
                    toast.success("Moved to bag");
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-ink hover:text-accent-red"
                >
                  <ShoppingBag className="h-3 w-3" /> Move to bag
                </button>
              </div>
            </div>
            <button
              onClick={() => remove(item.id)}
              aria-label="Remove"
              className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-cream hover:text-accent-red"
            >
              <X className="h-3 w-3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
