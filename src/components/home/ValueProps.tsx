import { Leaf, HandCoins, Recycle, HeartHandshake } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Spotlight from "@/components/ui/Spotlight";

const PROPS = [
  {
    icon: Leaf,
    title: "Wear the planet lightly",
    copy: "Every preloved piece is one less garment headed for a landfill.",
  },
  {
    icon: HandCoins,
    title: "Honest, upfront pricing",
    copy: "No 'boutique thrift' markups. The price you see is the price Pakistan can afford.",
  },
  {
    icon: Recycle,
    title: "Closed-loop closet",
    copy: "Sell us back pieces you've outgrown — we re-list, you earn store credit.",
  },
  {
    icon: HeartHandshake,
    title: "Real humans on WhatsApp",
    copy: "Stuck on size or style? We answer within the hour, every single day.",
  },
];

export default function ValueProps() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mb-10 text-center">
          <p className="eyebrow">Why thrift with us</p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            A closet that earns its place in your life.
          </h2>
        </div>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROPS.map(({ icon: Icon, title, copy }, i) => (
          <Reveal key={title} delay={i * 90}>
            <Spotlight className="rounded-3xl h-full border border-border bg-paper">
              <div className="flex h-full flex-col p-6">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-cream text-ink">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-semibold leading-tight">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </div>
            </Spotlight>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
