"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const FAQS = [
  {
    q: "How does Cash on Delivery work?",
    a: "Place your order, we call to confirm, and you pay the courier in cash when the box arrives at your door. Zero advance payment.",
  },
  {
    q: "Are all pieces authentic?",
    a: "Every piece is inspected by our team before it's listed. We photograph wear and flaws up close — no hidden surprises.",
  },
  {
    q: "How long does delivery take?",
    a: "3–5 working days across Pakistan. We call you before dispatch so you know exactly when to expect it.",
  },
  {
    q: "What's your return policy?",
    a: "Three-day easy returns if the piece doesn't match its listing or the fit is off. WhatsApp us and we handle the pickup.",
  },
  {
    q: "Can I sell you my old clothes?",
    a: "Yes! WhatsApp us photos of pieces you'd like to re-home. We offer store credit for anything we accept.",
  },
  {
    q: "When do new drops go live?",
    a: "Every Sunday at 8 PM PKT. Subscribe on WhatsApp to get the link the moment it's live.",
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mb-10 text-center">
          <p className="eyebrow">The small print</p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            Questions, answered.
          </h2>
        </div>
      </Reveal>
      <ul className="divide-y divide-border border-y border-border">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <li key={f.q}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-4 py-6 text-left focus-ring"
              >
                <span className="font-display text-lg font-semibold sm:text-xl">
                  {f.q}
                </span>
                <Plus
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}
                />
              </button>
              <div
                className={`grid overflow-hidden transition-[grid-template-rows] duration-400 ease-out ${isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}
                style={{ transitionDuration: "360ms" }}
              >
                <div className="min-h-0">
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
