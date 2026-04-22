import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Lost in the closet",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80dvh] flex-col overflow-hidden bg-paper">
      <div className="pointer-events-none absolute inset-0 noise opacity-40" aria-hidden />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-20 sm:px-6 lg:py-28">
        <p className="eyebrow">404 · Page not found</p>

        <h1 className="mt-6 font-display text-[22vw] leading-[0.8] tracking-[-0.04em] sm:text-[12rem] lg:text-[18rem]">
          <span className="block">Lost</span>
          <span className="ml-[10%] block italic text-ink/55">in the</span>
          <span className="ml-[4%] block">closet.</span>
        </h1>

        <p className="mt-10 max-w-md text-base leading-relaxed text-muted-foreground">
          That page stepped out. Maybe the piece sold, or maybe the URL took a wrong turn — either
          way, let&apos;s get you back to something you can wear.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper transition hover:opacity-90"
          >
            <Compass className="h-3.5 w-3.5" /> Browse the shop
            <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 rounded-full border border-ink px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition hover:bg-ink hover:text-paper"
          >
            The collections
          </Link>
          <Link
            href="/"
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground hover:text-ink"
          >
            or take me home
          </Link>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { href: "/track", title: "Track an order", hint: "With your CBJ-XXXX code" },
            { href: "/wishlist", title: "Your wishlist", hint: "Pick up where you left off" },
            { href: siteConfig.socials.instagram, title: "Instagram", hint: "@closetbyjunassan", external: true },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group rounded-2xl border border-border bg-paper p-5 transition hover:-translate-y-0.5 hover:border-ink"
            >
              <p className="font-display text-lg font-semibold">{item.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
              <ArrowUpRight className="mt-4 h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
