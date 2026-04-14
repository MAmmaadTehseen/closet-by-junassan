import { ShoppingBag, Phone, Banknote } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const STEPS = [
  {
    icon: ShoppingBag,
    title: "Add to bag",
    copy: "Pick your pieces and go to checkout. No advance payment, no sign-up required.",
  },
  {
    icon: Phone,
    title: "We call to confirm",
    copy: "Our team will call within 24 hours to confirm your order and delivery address.",
  },
  {
    icon: Banknote,
    title: "Pay on delivery",
    copy: "Your order arrives in 3–5 working days. Pay the courier in cash. That's it.",
  },
];

export default function HowCodWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mb-12 text-center">
          <p className="eyebrow mb-2">How it works</p>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Three steps to your doorstep.
          </h2>
        </div>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-3">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.title} delay={i * 120}>
              <div className="relative flex h-full flex-col rounded-2xl border border-border bg-paper p-8 transition hover:-translate-y-0.5">
                <span className="absolute right-5 top-5 font-display text-4xl font-semibold text-ink/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
