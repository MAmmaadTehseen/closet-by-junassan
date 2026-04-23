"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import Modal from "@/components/ui/Modal";
import { SIZE_CHARTS, type SizeChart } from "@/lib/size-charts";
import { waLink } from "@/lib/site-config";
import type { Category } from "@/lib/types";

export default function SizeGuideModal({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Category>(category);
  const chart = SIZE_CHARTS.find((c) => c.category === active) ?? SIZE_CHARTS[0];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-ink"
      >
        <Ruler className="h-3.5 w-3.5" /> Size Guide
      </button>

      <Modal open={open} onClose={() => setOpen(false)} maxWidth="max-w-2xl">
        <div className="p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold">Size Guide</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            All measurements are approximate. When in doubt, check the product page.
          </p>

          <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
            {SIZE_CHARTS.map((c) => (
              <button
                key={c.category}
                onClick={() => setActive(c.category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                  active === c.category
                    ? "border-ink bg-ink text-paper"
                    : "border-border bg-paper text-ink hover:border-ink"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <ChartTable chart={chart} />

          {chart.tip && (
            <div className="mt-5 rounded-xl bg-cream/60 p-4 text-xs leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-ink">Tip: </strong>
              {chart.tip}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-5">
            <p className="text-[11px] text-muted-foreground">
              Not sure? We&apos;re happy to help with measurements.
            </p>
            <a
              href={waLink("Hi! Can you help me with sizing?")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-ink px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition hover:bg-ink hover:text-paper"
            >
              <WhatsAppIcon mono className="h-3 w-3" /> Ask us
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
}

function ChartTable({ chart }: { chart: SizeChart }) {
  return (
    <div className="no-scrollbar mt-5 -mx-2 overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[420px] text-xs">
        <thead>
          <tr className="bg-cream/60">
            {chart.headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chart.rows.map((row, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-paper" : "bg-cream/30"}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-2.5 ${j === 0 ? "font-semibold text-ink" : "text-muted-foreground"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
