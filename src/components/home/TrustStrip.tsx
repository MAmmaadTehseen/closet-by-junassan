import { Wallet, Undo2, Truck, ShieldCheck } from "lucide-react";

const ITEMS = [
  {
    icon: Wallet,
    title: "Cash on Delivery",
    copy: "No advance payment. Pay the courier when it arrives.",
  },
  {
    icon: Undo2,
    title: "3-Day Easy Returns",
    copy: "Doesn't match the listing? Send it back, full refund.",
  },
  {
    icon: Truck,
    title: "Flat Delivery in PK",
    copy: "Karachi → Gilgit. Same price, everywhere.",
  },
  {
    icon: ShieldCheck,
    title: "Inspected & Graded",
    copy: "Every piece hand-checked before it ships.",
  },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-border bg-paper">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, copy }) => (
          <div
            key={title}
            className="flex items-start gap-3 bg-paper px-5 py-6 sm:px-6"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-cream">
              <Icon className="h-4 w-4 text-ink" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">
                {title}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {copy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
