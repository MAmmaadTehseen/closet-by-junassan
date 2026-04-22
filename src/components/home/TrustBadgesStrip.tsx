import { ShieldCheck, Truck, RefreshCcw, MessageCircle } from "lucide-react";

const BADGES = [
  {
    icon: ShieldCheck,
    title: "Hand-inspected",
    copy: "Every piece checked & graded.",
  },
  {
    icon: Truck,
    title: "COD across Pakistan",
    copy: "Karachi to Gilgit, no advance.",
  },
  {
    icon: RefreshCcw,
    title: "3-day easy returns",
    copy: "If it doesn't match, send it back.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp support",
    copy: "Real human, fast replies.",
  },
];

export default function TrustBadgesStrip() {
  return (
    <section
      aria-label="Why shop with us"
      className="border-b border-border bg-cream/40"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-5 px-4 py-5 sm:grid-cols-4 sm:gap-6 sm:px-6 sm:py-7">
        {BADGES.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.title} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper text-ink ring-1 ring-border">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold leading-tight text-ink">{b.title}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{b.copy}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
