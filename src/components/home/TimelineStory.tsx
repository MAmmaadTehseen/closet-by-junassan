import Reveal from "@/components/ui/Reveal";

const STEPS = [
  {
    step: "01",
    title: "Hunt",
    copy: "We scour imports, closets, and consignments across Pakistan for the right labels.",
  },
  {
    step: "02",
    title: "Inspect",
    copy: "Every piece is washed, steamed, and graded. We photograph flaws up close — no surprises.",
  },
  {
    step: "03",
    title: "Price honestly",
    copy: "We skip the middleman markup. You pay thrift-store prices, not 'vintage boutique' ones.",
  },
  {
    step: "04",
    title: "Deliver",
    copy: "COD to any city in Pakistan. We call before dispatch, and you pay only when it arrives.",
  },
];

export default function TimelineStory() {
  return (
    <section className="relative border-y border-border bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal>
          <div className="mb-12 flex flex-col gap-2 text-center sm:mb-16">
            <p className="eyebrow mx-auto">How a piece reaches you</p>
            <h2 className="mx-auto font-display text-3xl font-semibold leading-tight sm:text-5xl">
              From trunk to your doorstep — in 4 steps.
            </h2>
          </div>
        </Reveal>
        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-border lg:block"
          />
          {STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 120}>
              <div className="relative flex flex-col">
                <div className="relative mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-ink bg-paper text-xs font-semibold tracking-wider text-ink animate-float-y">
                  {s.step}
                </div>
                <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
