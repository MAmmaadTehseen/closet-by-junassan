import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function VideoHero() {
  return (
    <section className="relative h-[100dvh] min-h-[560px] w-full overflow-hidden bg-ink text-paper">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/videos/hero-poster.jpg"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/15 to-ink/60" />

      <div className="relative z-10 flex h-full items-end">
        <div className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28 lg:pb-32">
          <p className="eyebrow animate-fade-up text-paper/80">Closet by Junassan</p>
          <h1
            className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.015em] text-paper sm:text-6xl lg:text-7xl xl:text-8xl"
            style={{ animationDelay: "80ms" }}
          >
            Wear the Brand.
            <br />
            <span className="italic text-paper/90">Own the Moment.</span>
          </h1>
          <div
            className="mt-10 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <Link
              href="/collections/all"
              className="group inline-flex items-center gap-3 rounded-full bg-paper px-9 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-ink transition hover:bg-paper/90"
            >
              Shop Now
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
