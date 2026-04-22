import { ShieldCheck, RefreshCcw, Banknote, Phone } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, title: "Authenticity checked", copy: "Inspected & graded by hand." },
  { icon: Banknote, title: "Cash on Delivery", copy: "Pay only when it arrives." },
  { icon: RefreshCcw, title: "3-day easy returns", copy: "If it doesn't match the listing." },
  { icon: Phone, title: "We call to confirm", copy: "Real person, before dispatch." },
];

export default function OrderConfidenceCard() {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-paper p-3 sm:p-4">
      {ITEMS.map((it) => {
        const Icon = it.icon;
        return (
          <div
            key={it.title}
            className="flex items-start gap-2.5 rounded-xl bg-cream/40 p-3"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-paper text-ink ring-1 ring-border">
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold leading-tight text-ink">{it.title}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{it.copy}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
