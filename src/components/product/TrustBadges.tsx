import { ShieldCheck, Truck, RotateCcw, Phone, Lock, BadgeCheck } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, title: "Hand-inspected", body: "Every piece graded on a 10-point scale." },
  { icon: Truck, title: "Cash on Delivery", body: "Pay only when your order arrives." },
  { icon: RotateCcw, title: "3-day easy returns", body: "Doesn't fit? We'll arrange a swap." },
  { icon: Phone, title: "We call before dispatch", body: "To confirm your address & size." },
  { icon: Lock, title: "Secure orders", body: "No card info ever stored on-site." },
  { icon: BadgeCheck, title: "Authentic finds", body: "Real branded pieces, never replicas." },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-cream/40 p-4 sm:grid-cols-3 lg:grid-cols-6">
      {BADGES.map((b) => {
        const Icon = b.icon;
        return (
          <div
            key={b.title}
            className="flex items-start gap-2.5 rounded-xl bg-paper/70 p-3"
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest leading-tight text-ink">
                {b.title}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{b.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
