"use client";

import { useActionState, useState } from "react";
import { MessagesSquare, Plus } from "lucide-react";
import { submitQuestion, type QaResult } from "@/lib/qa-actions";
import type { Question } from "@/lib/qa";

export default function QA({
  productId,
  questions,
}: {
  productId: string;
  questions: Question[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<QaResult | null, FormData>(submitQuestion, null);

  return (
    <section className="mt-16 border-t border-border pt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Questions · Answered</p>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            Ask the merchant
          </h2>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 rounded-full border border-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-ink hover:bg-ink hover:text-paper"
        >
          <Plus className="h-3.5 w-3.5" /> Ask a question
        </button>
      </div>

      {open && !state?.ok && (
        <form action={formAction} className="mt-6 rounded-2xl border border-border bg-paper p-5">
          <input type="hidden" name="product_id" value={productId} />
          <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Your question
          </label>
          <textarea
            name="body"
            required
            rows={3}
            placeholder="Does this run small? How does the fabric feel?"
            className="mt-1 w-full resize-none rounded-lg border border-border bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
          />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              name="asker_name"
              placeholder="Your name (optional)"
              className="rounded-lg border border-border bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
            />
            <input
              name="phone"
              type="tel"
              placeholder="WhatsApp number (optional)"
              className="rounded-lg border border-border bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
            />
          </div>
          {state && !state.ok && (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            className="mt-4 rounded-full bg-ink px-6 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-paper hover:opacity-90"
          >
            Submit question
          </button>
        </form>
      )}

      {open && state?.ok && (
        <p className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
          {state.message}
        </p>
      )}

      {questions.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-border bg-paper p-6 text-center text-sm text-muted-foreground">
          No questions yet. Be the first to ask — we answer within a day.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {questions.map((q) => (
            <li key={q.id} className="rounded-2xl border border-border bg-paper p-5">
              <div className="flex items-start gap-3">
                <MessagesSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{q.body}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {q.asker_name ?? "Anonymous"}
                  </p>
                </div>
              </div>
              {q.answer && (
                <div className="mt-4 rounded-xl bg-cream/60 p-4 text-sm text-ink">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Closet team
                  </p>
                  {q.answer}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
