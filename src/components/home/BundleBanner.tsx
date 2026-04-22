import Link from "next/link";
import { Package, Percent, ArrowRight, Gift } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const DEALS = [
  {
    icon: <Package className="h-4 w-4" />,
    title: "Buy 2, save 10%",
    body: "Mix any two pieces from the whole store. Discount applied at WhatsApp checkout.",
    code: "BUNDLE2",
  },
  {
    icon: <Percent className="h-4 w-4" />,
    title: "Buy 3, save 15%",
    body: "Build the perfect capsule — three pieces, one order, one delivery.",
    code: "BUNDLE3",
  },
  {
    icon: <Gift className="h-4 w-4" />,
    title: "Refer a friend",
    body: "They get Rs 500 off, you get Rs 500 store credit on their first order.",
    code: "FRIEND500",
  },
];

export default function BundleBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Bundle + save</p>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              The more you pair, the more you save.
            </h2>
          </div>
          <Link
            href="/shop"
            className="group hidden items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:text-ink sm:inline-flex"
          >
            Shop all <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-3">
        {DEALS.map((d, i) => (
          <Reveal key={d.code} delay={i * 80}>
            <div className="group flex h-full flex-col rounded-3xl border border-border bg-paper p-6 transition hover:border-ink">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-ink">
                {d.icon}
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{d.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{d.body}</p>
              <div className="mt-5 inline-flex items-center gap-2">
                <code className="rounded-full border border-dashed border-ink bg-cream px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-ink">
                  {d.code}
                </code>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Auto-applied
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
