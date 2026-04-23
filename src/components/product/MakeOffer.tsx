"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { HandCoins } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import Modal from "@/components/ui/Modal";
import MagneticButton from "@/components/ui/MagneticButton";
import { formatPKR } from "@/lib/format";
import { waLink } from "@/lib/site-config";
import type { Product } from "@/lib/types";

/**
 * "Make an offer" — opens an editorial modal with a price slider.
 * Culturally attuned to PK bargaining; outputs a prefilled WhatsApp message.
 */
export default function MakeOffer({ product }: { product: Product }) {
  const minOffer = Math.max(Math.round(product.price_pkr * 0.6), 100);
  const maxOffer = product.price_pkr;
  const defaultOffer = Math.round((minOffer + maxOffer) / 2 / 50) * 50;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number>(defaultOffer);

  const savings = Math.max(0, product.price_pkr - value);
  const discountPct = Math.round((savings / product.price_pkr) * 100);
  const progress = ((value - minOffer) / Math.max(1, maxOffer - minOffer)) * 100;

  const message = useMemo(
    () =>
      `Hi! I'd like to offer ${formatPKR(value)} for "${product.name}"${
        product.size ? ` (Size ${product.size})` : ""
      }. Can we do it? 🙏`,
    [value, product.name, product.size],
  );

  if (product.stock === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition hover:border-ink focus-ring"
      >
        <HandCoins className="h-3.5 w-3.5" /> Make an offer
      </button>

      <Modal open={open} onClose={() => setOpen(false)} maxWidth="max-w-xl">
        <div className="grid gap-0 sm:grid-cols-[200px_1fr]">
          {/* Product visual */}
          <div className="relative hidden aspect-4/5 overflow-hidden rounded-l-2xl bg-cream sm:block">
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="220px"
                className="object-cover"
              />
            )}
          </div>

          {/* Offer builder */}
          <div className="p-6 sm:p-8">
            <p className="eyebrow">Make an offer</p>
            <h3 className="mt-2 font-display text-2xl font-semibold leading-tight sm:text-3xl">
              Name your price.
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Share an offer and we&apos;ll reply on WhatsApp. Listed at{" "}
              <span className="font-semibold text-ink">{formatPKR(product.price_pkr)}</span>.
            </p>

            {/* Live amount */}
            <div className="mt-6 rounded-2xl border border-border bg-cream/40 p-5 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Your offer
              </p>
              <p className="mt-1 font-display text-5xl font-semibold tabular-nums">
                {formatPKR(value)}
              </p>
              {savings > 0 && (
                <p className="mt-2 inline-block rounded-full bg-accent-red/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-accent-red">
                  {discountPct}% below listed
                </p>
              )}
            </div>

            {/* Slider */}
            <div className="mt-5">
              <input
                type="range"
                min={minOffer}
                max={maxOffer}
                step={50}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="offer-slider w-full cursor-grab accent-ink active:cursor-grabbing"
                style={{ ["--progress" as string]: `${progress}%` }}
              />
              <div className="mt-1 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>{formatPKR(minOffer)}</span>
                <span>{formatPKR(maxOffer)}</span>
              </div>
            </div>

            {/* Quick chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[0.7, 0.8, 0.9].map((pct) => {
                const amt = Math.round((product.price_pkr * pct) / 50) * 50;
                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setValue(amt)}
                    className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition ${
                      value === amt
                        ? "border-ink bg-ink text-paper"
                        : "border-border text-muted-foreground hover:border-ink hover:text-ink"
                    }`}
                  >
                    {Math.round(pct * 100)}% · {formatPKR(amt)}
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-7">
              <MagneticButton className="block">
                <a
                  href={waLink(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper transition hover:opacity-90"
                >
                  <WhatsAppIcon mono className="h-4 w-4" /> Send offer on WhatsApp
                </a>
              </MagneticButton>
              <p className="mt-3 text-center text-[10px] text-muted-foreground">
                Opens WhatsApp with your offer pre-filled.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
