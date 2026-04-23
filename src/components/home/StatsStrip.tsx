import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";

const STATS = [
  { value: 2000, suffix: "+", label: "Happy buyers" },
  { value: 15, suffix: "K+", label: "Preloved pieces curated" },
  { value: 98, suffix: "%", label: "5-star reviews" },
  { value: 72, suffix: "h", label: "Avg. delivery time" },
];

export default function StatsStrip() {
  return (
    <section className="border-y border-border bg-paper">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-4 py-12 sm:grid-cols-4 sm:px-6 sm:py-14">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 90}>
            <div className="flex flex-col items-start border-l border-border pl-5 sm:pl-7">
              <p className="font-display text-4xl font-semibold leading-none tracking-tight sm:text-6xl">
                <CountUp end={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
