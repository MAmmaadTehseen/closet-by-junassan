"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useUi } from "@/lib/ui-store";
import { toast } from "@/components/ui/Toaster";
import MagneticButton from "@/components/ui/MagneticButton";
import { formatPKR } from "@/lib/format";
import type { BundleWithProducts } from "@/lib/bundles";

/**
 * "Complete the Look" — editorial bundle row on PDP.
 * Shows connected product cards with a combo price reveal.
 */
export default function BundleStrip({ bundle }: { bundle: BundleWithProducts }) {
  const add = useCart((s) => s.add);
  const openCart = useUi((s) => s.openCart);

  if (bundle.products.length < 2) return null;

  const addAll = () => {
    // Distribute discount proportionally across items so the cart total equals combo_price_pkr.
    const ratio =
      bundle.original_total > 0 ? bundle.combo_price_pkr / bundle.original_total : 1;
    for (const p of bundle.products) {
      const discounted = Math.max(1, Math.round(p.price_pkr * ratio));
      add({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price_pkr: discounted,
        image: p.images[0] ?? "",
        size: p.size,
        quantity: 1,
        maxStock: p.stock,
      });
    }
    toast.success(`Bundle added — saved ${formatPKR(bundle.savings)}`);
    openCart();
  };

  return (
    <section className="relative mt-16 overflow-hidden rounded-3xl border border-border bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0 noise opacity-20" aria-hidden />
      <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-12">
        {/* Copy */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/85">
            <Sparkles className="h-3 w-3" /> Complete the Look
          </div>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.02em] sm:text-5xl">
            {bundle.title}
          </h2>
          <div className="mt-6 flex items-baseline gap-3">
            <p className="font-display text-4xl font-semibold sm:text-5xl">
              {formatPKR(bundle.combo_price_pkr)}
            </p>
            <p className="text-base text-paper/55 line-through">
              {formatPKR(bundle.original_total)}
            </p>
          </div>
          {bundle.savings > 0 && (
            <p className="mt-2 inline-block rounded-full bg-paper/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-paper">
              Save {formatPKR(bundle.savings)} · {bundle.savings_pct}% off
            </p>
          )}
          <div className="mt-8">
            <MagneticButton>
              <button
                onClick={addAll}
                className="inline-flex items-center gap-2 rounded-full bg-paper px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Add all to bag
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* Product row with connectors */}
        <div className="relative">
          <ul className="flex flex-wrap items-start justify-center gap-4 sm:gap-3 lg:flex-nowrap">
            {bundle.products.map((p, i) => (
              <li
                key={p.id}
                className="group relative flex w-36 shrink-0 flex-col items-center sm:w-40 lg:w-44"
              >
                <Link
                  href={`/product/${p.slug}`}
                  className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-paper/10"
                >
                  {p.images[0] && (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="180px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-paper px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
                <div className="mt-3 w-full text-center">
                  <p className="line-clamp-2 text-xs font-medium leading-snug text-paper">
                    {p.name}
                  </p>
                  <p className="mt-1 text-[11px] text-paper/60">{formatPKR(p.price_pkr)}</p>
                </div>

                {i < bundle.products.length - 1 && (
                  <span
                    className="pointer-events-none absolute -right-4 top-[34%] hidden h-px w-8 bg-paper/30 lg:block"
                    aria-hidden
                  />
                )}
                {i < bundle.products.length - 1 && (
                  <span
                    className="pointer-events-none absolute -right-5 top-[31%] hidden h-4 w-4 items-center justify-center rounded-full border border-paper/30 bg-ink text-[10px] text-paper/60 lg:flex"
                    aria-hidden
                  >
                    +
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
