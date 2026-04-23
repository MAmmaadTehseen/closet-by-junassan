import Reveal from "@/components/ui/Reveal";

const BRANDS = [
  "Levi's",
  "Nike",
  "Zara",
  "H&M",
  "Mango",
  "Uniqlo",
  "Adidas",
  "Gap",
  "Tommy Hilfiger",
  "Calvin Klein",
  "Ralph Lauren",
  "Puma",
];

export default function BrandWall() {
  return (
    <section className="relative border-y border-border bg-cream/50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">The labels we hunt</p>
              <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
                Brands you love, priced like you want them.
              </h2>
            </div>
            <span className="hidden text-[11px] uppercase tracking-[0.22em] text-muted-foreground sm:inline">
              Authentic · Inspected · Curated
            </span>
          </div>
        </Reveal>

        <div
          className="marquee"
          aria-label="Brands we curate"
        >
          <div className="marquee__track">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="font-display text-2xl font-semibold tracking-tight text-ink/80 sm:text-3xl"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
