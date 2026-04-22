import Link from "next/link";
import { Gift, Truck, Shield } from "lucide-react";
import { PERK_TIERS } from "@/lib/cart-perks";
import { formatPKR } from "@/lib/format";

const ICONS = [Gift, Truck, Shield];

export default function BundleBanner() {
  return (
    <section className="relative border-y border-border bg-cream/60">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-2">Spend &amp; Save</p>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Stack more, unlock more.
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Build your cart and automatically unlock extras at each spend tier. No codes, no
              gimmicks — just rewards for loyal shoppers.
            </p>
          </div>
          <Link
            href="/shop"
            className="rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper"
          >
            Start stacking
          </Link>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3">
          {PERK_TIERS.map((tier, i) => {
            const Icon = ICONS[i] ?? Gift;
            return (
              <li
                key={tier.threshold}
                className="group relative flex items-start gap-4 rounded-2xl border border-border bg-paper p-5 transition hover:border-ink"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Spend {formatPKR(tier.threshold)}+
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">{tier.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {tier.reward}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
