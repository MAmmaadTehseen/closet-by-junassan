"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Bookmark, Tag, X, ShoppingBag, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useSaved } from "@/lib/saved-store";
import { toast } from "@/components/ui/Toaster";
import { applyCoupon, type Coupon } from "@/lib/coupons";
import { formatPKR } from "@/lib/format";

export default function CartView() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const addToCart = useCart((s) => s.add);
  const savedItems = useSaved((s) => s.items);
  const saveForLater = useSaved((s) => s.save);
  const removeSaved = useSaved((s) => s.remove);
  const [mounted, setMounted] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponInput, setCouponInput] = useState("");

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const subtotal = items.reduce((sum, i) => sum + i.price_pkr * i.quantity, 0);
  const total = coupon ? coupon.apply(subtotal) : subtotal;
  const discount = subtotal - total;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl font-semibold">Your closet is empty</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Browse our latest drops and limited pieces — every item is hand-picked and ships COD.
        </p>
        <Link
          href="/shop"
          className="mt-2 rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper"
        >
          Shop the Drop
        </Link>
      </div>
    );
  }

  const tryCoupon = () => {
    const res = applyCoupon(couponInput, subtotal);
    if (res.ok) {
      setCoupon(res.coupon);
      toast.success(`Coupon applied — ${res.coupon.label}`);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div>
      <ul className="flex flex-col divide-y divide-border border-y border-border">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 py-6">
            <Link
              href={`/product/${item.slug}`}
              className="relative h-32 w-28 shrink-0 overflow-hidden rounded-xl bg-cream"
            >
              {item.image && (
                <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
              )}
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex justify-between gap-4">
                <div className="min-w-0">
                  <Link
                    href={`/product/${item.slug}`}
                    className="line-clamp-2 font-medium hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    Size {item.size}
                  </p>
                </div>
                <p className="shrink-0 font-semibold">
                  {formatPKR(item.price_pkr * item.quantity)}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between pt-4">
                <div className="flex items-center gap-1 rounded-full border border-border">
                  <button
                    onClick={() => setQty(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-2 disabled:opacity-30"
                    aria-label="Decrease"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-6 text-center text-sm font-semibold">
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
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <button
                    onClick={() => {
                      saveForLater(item);
                      remove(item.id);
                      toast.success("Saved for later");
                    }}
                    className="inline-flex items-center gap-1.5 hover:text-ink"
                  >
                    <Bookmark className="h-3.5 w-3.5" /> Save for later
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="inline-flex items-center gap-1.5 hover:text-accent-red"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {savedItems.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <p className="eyebrow">Saved for later</p>
              <h3 className="mt-1 font-display text-xl font-semibold">
                {savedItems.length} {savedItems.length === 1 ? "piece" : "pieces"} parked
              </h3>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {savedItems.map((s) => (
              <li
                key={s.id}
                className="flex gap-3 rounded-2xl border border-border bg-paper p-3"
              >
                <Link
                  href={`/product/${s.slug}`}
                  className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-cream"
                >
                  {s.image && (
                    <Image
                      src={s.image}
                      alt={s.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  )}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    href={`/product/${s.slug}`}
                    className="line-clamp-1 text-sm font-medium hover:underline"
                  >
                    {s.name}
                  </Link>
                  <p className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">
                    Size {s.size}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{formatPKR(s.price_pkr)}</p>
                  <div className="mt-auto flex items-center justify-between pt-2 text-xs">
                    <button
                      onClick={() => {
                        addToCart({ ...s, quantity: 1 });
                        removeSaved(s.id);
                        toast.success("Back in your bag");
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-ink hover:underline"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" /> Move to bag
                    </button>
                    <button
                      onClick={() => removeSaved(s.id)}
                      className="text-muted-foreground hover:text-accent-red"
                      aria-label="Remove saved"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      </div>

      <aside className="h-fit space-y-5 rounded-2xl border border-border bg-cream/40 p-6 lg:sticky lg:top-28">
        <h2 className="font-display text-xl font-semibold">Order Summary</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatPKR(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span className="font-medium">Flat across Pakistan</span>
          </div>
          {coupon && (
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Tag className="h-3 w-3" /> {coupon.code}
                <button
                  onClick={() => setCoupon(null)}
                  className="rounded-full p-0.5 hover:text-accent-red"
                  aria-label="Remove coupon"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
              <span className="font-medium text-accent-red">− {formatPKR(discount)}</span>
            </div>
          )}
        </div>

        {!coupon && (
          <div>
            <div className="flex items-center gap-2 rounded-full border border-border bg-paper p-1">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon or gift card"
                className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={tryCoupon}
                className="rounded-full bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-paper"
              >
                Apply
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Gift cards look like{" "}
              <span className="font-mono text-ink">GIFT-0500</span>
            </p>
          </div>
        )}

        <div className="flex justify-between border-t border-border pt-4 text-base font-semibold">
          <span>Total</span>
          <span>{formatPKR(total)}</span>
        </div>

        <Link
          href="/checkout"
          className="block rounded-full bg-ink py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90"
        >
          Proceed to Checkout
        </Link>
        <p className="text-center text-[11px] text-muted-foreground">
          Cash on Delivery available all over Pakistan
        </p>
      </aside>
    </div>
  );
}
