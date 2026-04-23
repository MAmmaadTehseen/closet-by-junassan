import { ShieldCheck, Truck, RotateCcw, Phone, PackageCheck, Sparkles } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, label: "Every piece inspected" },
  { icon: Truck, label: "Flat delivery — all of PK" },
  { icon: Phone, label: "We call before dispatch" },
  { icon: PackageCheck, label: "Cash on Delivery" },
  { icon: RotateCcw, label: "3-day easy returns" },
  { icon: Sparkles, label: "New drops every Sunday" },
];

export default function TrustStrip() {
  return (
    <section aria-label="Trust signals" className="border-y border-border bg-ink text-paper">
      <div className="mx-auto max-w-7xl overflow-hidden">
        <div className="marquee">
          <div className="marquee__track py-4 text-[11px] font-semibold uppercase tracking-[0.22em]">
            {[...ITEMS, ...ITEMS].map(({ icon: Icon, label }, i) => (
              <span key={`${label}-${i}`} className="inline-flex items-center gap-2 px-4">
                <Icon className="h-3.5 w-3.5" />
                {label}
                <span className="mx-4 inline-block h-1 w-1 rounded-full bg-paper/50" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
