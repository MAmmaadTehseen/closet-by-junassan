import { Truck, ShieldCheck, Package, Phone } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site-config";

const FEATURES = [
  { icon: Truck, title: "Flat delivery", copy: "Across Pakistan" },
  { icon: Phone, title: "We call first", copy: "Before dispatch" },
  { icon: Package, title: "3–5 days", copy: "To your doorstep" },
  { icon: ShieldCheck, title: "Easy returns", copy: "3-day window" },
];

export default function CodBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-[28px] border border-border bg-ink px-6 py-14 text-center text-paper sm:px-10 sm:py-16">
          <div className="pointer-events-none absolute inset-0 noise opacity-20" aria-hidden />
          <div className="relative">
            <p className="eyebrow text-paper/60">Cash on Delivery</p>
            <h3 className="mt-3 font-display text-3xl font-semibold sm:text-5xl">
              {siteConfig.shipping.banner}
            </h3>
            <p className="mx-auto mt-4 max-w-md text-sm text-paper/70">
              Pay when your order arrives. No advance payment, no hidden fees.
            </p>
            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-5 sm:grid-cols-4">
              {FEATURES.map(({ icon: Icon, title, copy }) => (
                <div key={title} className="flex flex-col items-center gap-2 text-left sm:text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-[11px] uppercase tracking-widest text-paper/50">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
