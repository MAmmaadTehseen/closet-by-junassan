"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Phone, Undo2, Banknote, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPKR } from "@/lib/format";
import { createOrder } from "@/lib/orders";
import { PK_CITIES } from "@/lib/cities-pk";
import { PHONE_RE, normalizePhone } from "@/lib/validators";
import { siteConfig } from "@/lib/site-config";
import { getDeliveryWindow } from "@/lib/delivery";
import { toast } from "@/components/ui/Toaster";
import MobileOrderPeek from "./MobileOrderPeek";

const STORAGE_KEY = "closet-checkout-draft";

interface Draft {
  full_name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
}

const EMPTY: Draft = { full_name: "", phone: "", email: "", city: "", address: "", notes: "" };

export default function CheckoutForm() {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState<1 | 2>(1);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const idempotencyKey = useRef<string>("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    idempotencyKey.current =
      typeof crypto !== "undefined" ? crypto.randomUUID() : `${Date.now()}`;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setDraft({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {}
  }, [draft, mounted]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price_pkr * i.quantity, 0),
    [items],
  );

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">
          Your bag is empty.{" "}
          <Link className="underline" href="/shop">
            Browse products
          </Link>
          .
        </p>
      </div>
    );
  }

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (draft.full_name.trim().length < 2) e.full_name = "Please enter your full name.";
    const phone = normalizePhone(draft.phone);
    if (!PHONE_RE.test(phone)) e.phone = "Enter a valid PK mobile (03XXXXXXXXX).";
    if (draft.city.trim().length < 2) e.city = "Please enter your city.";
    if (draft.address.trim().length < 5) e.address = "Please enter a full address.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onReview = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateStep1()) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPlace = (ev: React.FormEvent) => {
    ev.preventDefault();
    const honeypot = (ev.currentTarget as HTMLFormElement).elements.namedItem(
      "website",
    ) as HTMLInputElement | null;

    startTransition(async () => {
      const result = await createOrder({
        full_name: draft.full_name,
        phone: normalizePhone(draft.phone),
        city: draft.city,
        address: draft.address,
        notes: draft.notes || undefined,
        email: draft.email?.trim() || undefined,
        items,
        honeypot: honeypot?.value ?? "",
        idempotencyKey: idempotencyKey.current,
      });
      // If we reach here, the server returned an error (success redirects instead).
      if (result?.error) {
        toast.error(result.error);
        setErrors({ _form: result.error });
      }
    });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div>
        <MobileOrderPeek />
        <Stepper step={step} />

        {step === 1 && (
          <form onSubmit={onReview} className="mt-8 space-y-5">
            <Field
              label="Full Name"
              name="full_name"
              value={draft.full_name}
              onChange={(v) => setDraft((d) => ({ ...d, full_name: v }))}
              error={errors.full_name}
              autoComplete="name"
              required
            />
            <Field
              label="Phone Number"
              name="phone"
              type="tel"
              inputMode="numeric"
              value={draft.phone}
              onChange={(v) => setDraft((d) => ({ ...d, phone: v }))}
              error={errors.phone}
              placeholder="03XXXXXXXXX"
              autoComplete="tel"
              required
              hint="We&apos;ll call to confirm your order before dispatch."
            />
            <Field
              label="Email (optional)"
              name="email"
              type="email"
              value={draft.email}
              onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
              placeholder="you@example.com"
              autoComplete="email"
              hint="For order confirmation and tracking updates."
            />
            <Field
              label="City"
              name="city"
              value={draft.city}
              onChange={(v) => setDraft((d) => ({ ...d, city: v }))}
              error={errors.city}
              list="pk-cities"
              autoComplete="address-level2"
              required
            />
            <datalist id="pk-cities">
              {PK_CITIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <Field
              label="Full Address"
              name="address"
              value={draft.address}
              onChange={(v) => setDraft((d) => ({ ...d, address: v }))}
              error={errors.address}
              autoComplete="street-address"
              textarea
              required
            />
            <Field
              label="Order Notes (optional)"
              name="notes"
              value={draft.notes}
              onChange={(v) => setDraft((d) => ({ ...d, notes: v }))}
              textarea
            />

            <div className="rounded-2xl border border-ink bg-paper p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper">
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90 sm:w-auto sm:px-10"
            >
              Review Order <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={onPlace} className="mt-8 space-y-6">
            {/* Honeypot — hidden from real users, caught by bots */}
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <h2 className="font-display text-2xl font-semibold">Review your order</h2>

            <dl className="grid gap-3 rounded-2xl border border-border bg-paper p-5 text-sm">
              <Review label="Name" value={draft.full_name} />
              <Review label="Phone" value={normalizePhone(draft.phone)} />
              <Review label="City" value={draft.city} />
              <Review label="Address" value={draft.address} />
              {draft.notes && <Review label="Notes" value={draft.notes} />}
              <Review label="Payment" value="Cash on Delivery" />
              <Review label="Est. Delivery" value={getDeliveryWindow()} />
            </dl>

            <div className="grid gap-3 sm:grid-cols-3">
              {siteConfig.trust.slice(0, 3).map((t, i) => (
                <div
                  key={t}
                  className="flex items-center gap-3 rounded-xl border border-border bg-paper p-4 text-xs"
                >
                  {i === 0 && <ShieldCheck className="h-4 w-4" />}
                  {i === 1 && <Phone className="h-4 w-4" />}
                  {i === 2 && <Undo2 className="h-4 w-4" />}
                  <span className="font-medium">{t}</span>
                </div>
              ))}
            </div>

            {errors._form && (
              <p className="rounded-lg bg-accent-red/10 px-4 py-3 text-sm text-accent-red">
                {errors._form}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-paper"
              >
                <ArrowLeft className="h-4 w-4" /> Edit Details
              </button>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-4 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90 disabled:opacity-60"
              >
                {pending ? "Placing order…" : `Place Order — ${formatPKR(subtotal)}`}
              </button>
            </div>
          </form>
        )}
      </div>

      <aside className="h-fit space-y-4 rounded-2xl border border-border bg-cream/40 p-6 lg:sticky lg:top-28">
        <h2 className="font-display text-xl font-semibold">Your Order</h2>
        <ul className="divide-y divide-border">
          {items.map((i) => (
            <li key={i.id} className="flex gap-3 py-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
                {i.image && <Image src={i.image} alt={i.name} fill sizes="56px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-medium">{i.name}</p>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  Size {i.size} · Qty {i.quantity}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold">
                {formatPKR(i.price_pkr * i.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-border pt-4 text-base font-semibold">
          <span>Total</span>
          <span>{formatPKR(subtotal)}</span>
        </div>
        <p className="text-center text-[11px] uppercase tracking-widest text-muted-foreground">
          Flat delivery · {siteConfig.shipping.deliveryDays}
        </p>
      </aside>
    </div>
  );
}

function Stepper({ step }: { step: 1 | 2 }) {
  return (
    <ol className="flex items-center gap-4 text-xs font-semibold uppercase tracking-widest">
      <li className={step >= 1 ? "text-ink" : "text-muted-foreground"}>
        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-current">
          1
        </span>
        Details
      </li>
      <li className="h-px w-12 bg-border" />
      <li className={step >= 2 ? "text-ink" : "text-muted-foreground"}>
        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-current">
          2
        </span>
        Review
      </li>
    </ol>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  textarea,
  placeholder,
  error,
  hint,
  list,
  autoComplete,
  inputMode,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  placeholder?: string;
  error?: string;
  hint?: string;
  list?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "tel" | "email";
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
        <span>
          {label} {required && <span className="text-accent-red">*</span>}
        </span>
        {hint && <span className="text-[10px] font-normal normal-case tracking-normal text-muted-foreground">{hint}</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={3}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border bg-paper px-4 py-3 text-sm transition focus:outline-none ${
            error ? "border-accent-red" : "border-border focus:border-ink"
          }`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          list={list}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={`w-full rounded-xl border bg-paper px-4 py-3 text-sm transition focus:outline-none ${
            error ? "border-accent-red" : "border-border focus:border-ink"
          }`}
        />
      )}
      {error && <p className="mt-1.5 text-xs text-accent-red">{error}</p>}
    </label>
  );
}

function Review({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <dt className="w-24 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="flex-1 text-ink">{value}</dd>
    </div>
  );
}
