"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { submitReview, type ReviewSubmitResult } from "@/lib/review-actions";

export default function ReviewForm({
  code,
  productId,
}: {
  code: string;
  productId: string;
}) {
  const [state, formAction] = useActionState<ReviewSubmitResult | null, FormData>(submitReview, null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  if (state?.ok) {
    return (
      <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <input type="hidden" name="code" value={code} />
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Your rating
        </p>
        <div className="mt-2 flex gap-1" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = (hovered || rating) >= n;
            return (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHovered(n)}
                onClick={() => setRating(n)}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
                className="rounded focus-ring"
              >
                <Star
                  className={`h-7 w-7 transition ${
                    filled ? "fill-amber-400 text-amber-400" : "text-border"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Your name
        </label>
        <input
          name="author_name"
          required
          className="mt-1 w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
          placeholder="e.g. Aisha K."
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Your review
        </label>
        <textarea
          name="body"
          required
          rows={4}
          className="mt-1 w-full resize-none rounded-lg border border-border bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
          placeholder="Fit, fabric, colour, anything you'd tell a friend…"
        />
      </div>

      {state && !state.ok && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        className="rounded-full bg-ink px-6 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-paper hover:opacity-90"
      >
        Submit review
      </button>
    </form>
  );
}
