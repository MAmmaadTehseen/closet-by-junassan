"use client";

import { CheckCircle2, Circle, Phone, Package, Truck, Home } from "lucide-react";

type Stage = "placed" | "confirmed" | "packed" | "dispatched" | "delivered";

const STAGES: { id: Stage; title: string; desc: string; Icon: typeof CheckCircle2 }[] = [
  {
    id: "placed",
    title: "Order placed",
    desc: "We received your order and locked stock for you.",
    Icon: CheckCircle2,
  },
  {
    id: "confirmed",
    title: "Confirmation call",
    desc: "Our team rings within 24 hrs to confirm address & sizing.",
    Icon: Phone,
  },
  {
    id: "packed",
    title: "Picked & packed",
    desc: "Inspected on a 10-point scale and hand-wrapped.",
    Icon: Package,
  },
  {
    id: "dispatched",
    title: "Out for delivery",
    desc: "Courier has it — you'll receive an SMS.",
    Icon: Truck,
  },
  {
    id: "delivered",
    title: "Delivered",
    desc: "Pay in cash at the door. Tag us @closetbyjunassan.",
    Icon: Home,
  },
];

export default function OrderTimeline({ active = "placed" as Stage }: { active?: Stage }) {
  const idx = STAGES.findIndex((s) => s.id === active);
  return (
    <ol className="relative">
      <div className="absolute left-5 top-2 bottom-2 w-px bg-border" aria-hidden />
      {STAGES.map((s, i) => {
        const done = i <= idx;
        const current = i === idx;
        const Icon = s.Icon;
        return (
          <li key={s.id} className="relative flex gap-4 pb-6 last:pb-0">
            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                done ? "bg-ink text-paper" : "bg-cream text-muted-foreground"
              }`}
            >
              {done ? (
                <Icon className="h-4 w-4" />
              ) : (
                <Circle className="h-3 w-3" />
              )}
              {current && (
                <span className="pointer-events-none absolute inset-0 animate-soft-pulse rounded-full ring-4 ring-ink/20" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold ${
                  done ? "text-ink" : "text-muted-foreground"
                }`}
              >
                {s.title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
