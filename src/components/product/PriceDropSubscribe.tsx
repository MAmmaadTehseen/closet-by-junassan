"use client";

import { useActionState, useState } from "react";
import { BellRing, Check } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { subscribePriceAlert, type AlertResult } from "@/lib/price-alert-actions";
import { formatPKR } from "@/lib/format";

export default function PriceDropSubscribe({
  productId,
  productName,
  currentPrice,
}: {
  productId: string;
  productName: string;
  currentPrice: number;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<AlertResult | null, FormData>(
    subscribePriceAlert,
    null,
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground transition hover:text-ink"
      >
        <BellRing className="h-3.5 w-3.5" /> Notify on price drop
      </button>

      <Modal open={open} onClose={() => setOpen(false)} maxWidth="max-w-md">
        <div className="p-8">
          <p className="eyebrow">Price watch</p>
          <h3 className="mt-2 font-display text-3xl font-semibold leading-tight">
            Tell me when it drops.
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="font-semibold text-ink">{productName}</span> — currently{" "}
            <span className="font-semibold text-ink">{formatPKR(currentPrice)}</span>. We&apos;ll
            WhatsApp you the moment we lower the price.
          </p>

          {state?.ok ? (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <Check className="h-4 w-4 shrink-0" />
              <span>{state.message}</span>
            </div>
          ) : (
            <form action={formAction} className="mt-6 space-y-4">
              <input type="hidden" name="product_id" value={productId} />
              <input type="hidden" name="cap_price_pkr" value={currentPrice} />
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Your WhatsApp number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  inputMode="numeric"
                  placeholder="03XXXXXXXXX"
                  className="mt-1 w-full rounded-lg border border-border bg-paper px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
                />
              </div>

              {state && !state.ok && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                  {state.error}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-ink py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper hover:opacity-90"
              >
                Notify me
              </button>
              <p className="text-center text-[10px] text-muted-foreground">
                We only message you if the price drops.
              </p>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}
