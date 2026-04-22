import type { Product } from "@/lib/types";

const FALLBACK_BRANDS = [
  "Levi's",
  "Zara",
  "H&M",
  "Ralph Lauren",
  "Mango",
  "Uniqlo",
  "COS",
  "Adidas",
  "Nike",
  "Clarks",
  "Vans",
  "Charles & Keith",
];

export default function BrandsMarquee({ products }: { products?: Product[] }) {
  const unique = products
    ? Array.from(new Set(products.map((p) => p.brand))).slice(0, 24)
    : [];
  const brands = unique.length >= 6 ? unique : FALLBACK_BRANDS;
  const track = [...brands, ...brands];

  return (
    <section className="relative overflow-hidden border-y border-border bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-paper/50">
          Brands we&apos;ve stocked
        </p>
        <div className="marquee">
          <div className="marquee__track">
            {track.map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="font-display text-xl font-semibold uppercase tracking-wide text-paper sm:text-2xl"
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
