import { ShieldCheck, Truck, Undo2, Headphones, Banknote, Sparkles } from "lucide-react";

const BLOCKS = [
  {
    icon: Banknote,
    title: "Cash on Delivery",
    desc: "Pay only when your order arrives at your door.",
  },
  {
    icon: Truck,
    title: "Flat delivery, PK-wide",
    desc: "Karachi to Gilgit — 3–5 working days after dispatch.",
  },
  {
    icon: Undo2,
    title: "3-day easy returns",
    desc: "If the piece doesn't match the listing, we take it back.",
  },
  {
    icon: ShieldCheck,
    title: "Every piece inspected",
    desc: "Graded on a 10-point scale and photographed as-is.",
  },
  {
    icon: Headphones,
    title: "We call before dispatch",
    desc: "A real human confirms your address and sizing questions.",
  },
  {
    icon: Sparkles,
    title: "New drops weekly",
    desc: "Fresh curations land every Friday evening.",
  },
];

export default function TrustStrip() {
  return (
    <section className="border-b border-border bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-2">Why shop with us</p>
          <h2 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
            Thrift that feels premium.
          </h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BLOCKS.map((b) => {
            const Icon = b.icon;
            return (
              <li
                key={b.title}
                className="group flex gap-4 rounded-2xl border border-border bg-paper p-5 transition hover:border-ink"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream text-ink transition group-hover:bg-ink group-hover:text-paper">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{b.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{b.desc}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
