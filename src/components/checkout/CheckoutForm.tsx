"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { formatPKR } from "@/lib/format";
import { createOrder } from "@/lib/orders";

export default function CheckoutForm() {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const subtotal = items.reduce((sum, i) => sum + i.price_pkr * i.quantity, 0);

  if (items.length === 0) {
    return (
      <p className="py-24 text-center text-muted-foreground">
        Your cart is empty. <a className="underline" href="/shop">Browse products</a>.
      </p>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      full_name: String(form.get("full_name") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      city: String(form.get("city") ?? "").trim(),
      address: String(form.get("address") ?? "").trim(),
      notes: String(form.get("notes") ?? "").trim() || undefined,
      subtotal_pkr: subtotal,
      items,
    };
    if (!payload.full_name || !payload.phone || !payload.city || !payload.address) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        clear();
        await createOrder(payload);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Something went wrong";
        if (msg.includes("NEXT_REDIRECT")) {
          router.push("/checkout/success");
          return;
        }
        setError(msg);
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-semibold">Shipping Details</h2>
          <p className="mt-1 text-sm text-muted-foreground">Flat delivery across Pakistan</p>
        </div>

        <Field label="Full Name" name="full_name" required />
        <Field label="Phone Number" name="phone" type="tel" required placeholder="03xx xxxxxxx" />
        <Field label="City" name="city" required />
        <Field label="Full Address" name="address" required textarea />
        <Field label="Order Notes (optional)" name="notes" textarea />

        <div className="rounded-xl border border-border bg-muted/40 p-5">
          <h3 className="text-sm font-semibold">Payment Method</h3>
          <label className="mt-3 flex items-center gap-3 rounded-lg border border-foreground bg-background p-3">
            <input type="radio" name="payment" defaultChecked readOnly />
            <div>
              <p className="text-sm font-semibold">Cash on Delivery</p>
              <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
            </div>
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <aside className="h-fit rounded-xl border border-border bg-muted/40 p-6">
        <h2 className="font-display text-xl font-semibold">Your Order</h2>
        <ul className="mt-4 divide-y divide-border text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between py-2">
              <span className="line-clamp-1 pr-3">
                {i.name} <span className="text-muted-foreground">× {i.quantity}</span>
              </span>
              <span className="flex-shrink-0 font-medium">
                {formatPKR(i.price_pkr * i.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold">
          <span>Total</span>
          <span>{formatPKR(subtotal)}</span>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="mt-6 block w-full rounded-full bg-foreground py-3 text-center text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Placing order..." : "Place Order (COD)"}
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Cash on Delivery available all over Pakistan
        </p>
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  textarea,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={3}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
        />
      )}
    </label>
  );
}
