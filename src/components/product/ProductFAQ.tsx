"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "How do I know it's authentic?",
    a: "Every piece is hand-inspected by our team. We authenticate labels, stitching, hardware, and fabric against reference pieces. If something ever turns out not to match, we refund you on the spot.",
  },
  {
    q: "Can I return if it doesn't fit?",
    a: "Yes. Try it on as soon as your order arrives — if it doesn't fit or feel right, message us within 3 days and we'll arrange a pickup and refund. No questions asked.",
  },
  {
    q: "Is the condition exactly what's shown?",
    a: "What you see is what you get. Every listing shows the condition rating (e.g. 9/10) and real photos of that specific piece — not a stock image. Any flaw is called out in the photos.",
  },
  {
    q: "How long will delivery take?",
    a: "Most orders arrive in 3–5 working days across Pakistan. We call to confirm the address before dispatch so nothing slips through.",
  },
  {
    q: "Can I pay online instead of COD?",
    a: "For now we're COD-only — it keeps things simple and lets you inspect before paying. Card and bank transfer options are coming soon.",
  },
  {
    q: "Do you restock sold items?",
    a: "Usually no — each piece is one-of-a-kind. Tap 'Notify me' on a sold-out item and we'll message you if a similar piece drops.",
  },
];

export default function ProductFAQ() {
  const [open, setOpen] = useState<string | null>(FAQS[0].q);

  return (
    <section className="mt-12 border-t border-border pt-10">
      <div className="mb-5 flex items-center gap-2">
        <HelpCircle className="h-4 w-4" />
        <h2 className="font-display text-xl font-semibold sm:text-2xl">
          Questions, answered
        </h2>
      </div>
      <dl className="space-y-0.5">
        {FAQS.map((f) => {
          const isOpen = open === f.q;
          return (
            <div key={f.q} className="border-b border-border">
              <dt>
                <button
                  onClick={() => setOpen(isOpen ? null : f.q)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-ink transition hover:text-ink/70"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </dt>
              {isOpen && (
                <dd className="fade-in pb-5 pr-6 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </dd>
              )}
            </div>
          );
        })}
      </dl>
    </section>
  );
}
