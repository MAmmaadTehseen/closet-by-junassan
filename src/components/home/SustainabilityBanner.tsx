import { Leaf } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import KineticText from "@/components/ui/KineticText";

export default function SustainabilityBanner() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-[#0f1b12] text-paper">
      <div aria-hidden className="aurora" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/70">
            <Leaf className="h-3.5 w-3.5" /> Closet Impact · Live Tally
          </div>
        </Reveal>
        <Reveal>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.01em] sm:text-6xl">
            Together we&apos;ve saved{" "}
            <span className="text-gradient-flow inline-block">
              <CountUp end={18420} />
            </span>{" "}
            garments from the bin.
          </h2>
        </Reveal>
        <Reveal>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-paper/70 sm:text-base">
            Every preloved piece you buy skips a fresh factory cycle — that&apos;s water, dye,
            fabric, and freight all sidestepped. Your closet votes every time you check out.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { n: 54200000, suffix: "L", label: "Water saved" },
            { n: 92, suffix: "t", label: "CO₂ avoided" },
            { n: 2100, suffix: "+", label: "Repeat customers" },
          ].map((s) => (
            <Reveal key={s.label}>
              <div className="rounded-3xl border border-paper/10 p-6">
                <p className="font-display text-3xl font-semibold sm:text-5xl">
                  <CountUp end={s.n} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-paper/60">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 border-y border-paper/10 py-6 text-paper/60">
          <KineticText
            text="Re-loved · Re-worn · Re-homed ·"
            className="font-display text-4xl italic sm:text-6xl"
          />
        </div>
      </div>
    </section>
  );
}
