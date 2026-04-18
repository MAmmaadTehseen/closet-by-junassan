"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { Camera, Loader2, Star, X } from "lucide-react";
import { submitReview, uploadReviewPhoto, type ReviewSubmitResult } from "@/lib/review-actions";

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
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const onPhoto = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadReviewPhoto(fd);
    setUploading(false);
    if ("url" in result) setPhotoUrl(result.url);
  };

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
      <input type="hidden" name="photo_url" value={photoUrl} />

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

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Add a photo (optional)
        </p>
        {photoUrl ? (
          <div className="mt-2 flex items-center gap-3">
            <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-border">
              <Image src={photoUrl} alt="" fill sizes="80px" className="object-cover" />
            </div>
            <button
              type="button"
              onClick={() => setPhotoUrl("")}
              className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-accent-red"
            >
              <X className="h-3 w-3" /> Remove
            </button>
          </div>
        ) : (
          <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full border border-dashed border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-ink hover:text-ink">
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Camera className="h-3.5 w-3.5" />
            )}
            {uploading ? "Uploading…" : "Upload photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => onPhoto(e.target.files?.[0])}
            />
          </label>
        )}
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
