import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";

export default function BrandsCarousel({ products }: { products: Product[] }) {
  const counts = new Map<string, number>();
  for (const p of products) {
    if (!p.brand) continue;
    counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
  }
  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([brand, count]) => ({ brand, count }));

  if (top.length < 4) return null;

  // Duplicate for seamless marquee.
  const track = [...top, ...top];

  return (
    <section className="border-y border-border bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <Reveal>
          <div className="mb-6 flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow mb-2">Featured brands</p>
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                Names you already love.
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-ink sm:inline"
            >
              Shop all →
            </Link>
          </div>
        </Reveal>

        <div className="marquee">
          <div className="marquee__track">
            {track.map((b, i) => (
              <Link
                key={`${b.brand}-${i}`}
                href={`/shop?q=${encodeURIComponent(b.brand)}`}
                className="font-display text-2xl font-semibold tracking-tight text-ink/55 transition hover:text-ink sm:text-3xl md:text-4xl"
              >
                {b.brand}
                <span className="ml-2 align-top text-[10px] font-medium tracking-wide text-muted-foreground">
                  {b.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
