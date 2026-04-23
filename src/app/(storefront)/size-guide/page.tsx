import type { Metadata } from "next";
import Link from "next/link";
import { Ruler, ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { SIZE_CHARTS } from "@/lib/size-charts";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Unified size guide across men, women, kids, shoes, and bags — for Pakistani body types.",
};

export default function SizeGuidePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24">
        <Reveal>
          <p className="eyebrow mb-4 inline-flex items-center gap-2">
            <Ruler className="h-3 w-3" /> Size guide
          </p>
          <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
            Fit. Locked in.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            All sizes in inches. Every product page also carries actual measured dimensions — we measure every piece before it lists.
          </p>
          <Link
            href="/fit-finder"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-ink hover:text-paper"
          >
            Take the 30-second fit quiz
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl space-y-12 px-4 pb-24 sm:px-6">
        {SIZE_CHARTS.map((chart) => (
          <article key={chart.category} className="rounded-3xl border border-border bg-paper p-6 sm:p-10">
            <p className="eyebrow mb-2 capitalize">{chart.category}</p>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">{chart.label} fit guide</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    {chart.headers.map((h) => (
                      <th key={h} className="border-b border-border pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chart.rows.map((row, i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-cream/40" : ""}>
                      {row.map((cell, j) => (
                        <td key={j} className="border-b border-border/40 py-3 pr-4 text-sm">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {chart.tip && (
              <p className="mt-5 rounded-2xl bg-cream/60 p-4 text-sm leading-relaxed text-ink/80">
                <span className="font-semibold">Tip — </span>
                {chart.tip}
              </p>
            )}
          </article>
        ))}
      </section>
    </>
  );
}
