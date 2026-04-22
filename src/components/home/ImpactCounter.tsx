"use client";

import { useEffect, useRef, useState } from "react";
import { Droplets, Recycle, Wind, Leaf } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

interface Stat {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix: string;
  hint: string;
}

const STATS: Stat[] = [
  {
    id: "water",
    icon: <Droplets className="h-5 w-5" />,
    label: "Litres of water saved",
    value: 2_850_000,
    suffix: "L",
    hint: "Each pre-loved piece keeps ~2,700 L out of new production.",
  },
  {
    id: "co2",
    icon: <Wind className="h-5 w-5" />,
    label: "kg of CO₂ avoided",
    value: 14_200,
    suffix: "kg",
    hint: "Equivalent to 35,000 km driven.",
  },
  {
    id: "pieces",
    icon: <Recycle className="h-5 w-5" />,
    label: "Garments re-homed",
    value: 3_480,
    suffix: "+",
    hint: "Every piece inspected, photographed & delivered.",
  },
  {
    id: "kind",
    icon: <Leaf className="h-5 w-5" />,
    label: "Happy wardrobes",
    value: 2_145,
    suffix: "+",
    hint: "Real customers across 40+ Pakistani cities.",
  },
];

function useCountUp(target: number, duration = 1500, trigger = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, trigger]);
  return val;
}

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const n = useCountUp(stat.value, 1500, active);
  return (
    <div className="rounded-2xl border border-border bg-paper p-5 sm:p-6">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-cream text-ink">
        {stat.icon}
      </div>
      <p className="font-display text-3xl font-semibold tabular-nums sm:text-4xl">
        {n.toLocaleString("en-US")}
        <span className="text-xl text-muted-foreground">{stat.suffix}</span>
      </p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {stat.label}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{stat.hint}</p>
    </div>
  );
}

export default function ImpactCounter() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-y border-border bg-cream/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow mb-2">Our impact together</p>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Shopping pre-loved isn&apos;t just kinder to your wallet.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Every item you buy keeps textiles out of landfill and dodges the
              water, energy, and emissions of new manufacturing. Numbers updated
              each drop.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatCard key={stat.id} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
