import Image from "next/image";
import { Star } from "lucide-react";
import type { Review } from "@/lib/reviews";

export default function Reviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  const avg = reviews.reduce((n, r) => n + r.rating, 0) / reviews.length;
  const rounded = Math.round(avg * 10) / 10;
  const photos = reviews.filter((r) => r.photo_url);

  return (
    <section className="mt-16 border-t border-border pt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Reviews</p>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            What buyers said
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-4 w-4 ${
                  n <= Math.round(avg) ? "fill-amber-400 text-amber-400" : "text-border"
                }`}
              />
            ))}
          </div>
          <span className="font-semibold">{rounded.toFixed(1)}</span>
          <span className="text-muted-foreground">· {reviews.length} review{reviews.length === 1 ? "" : "s"}</span>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="mt-6">
          <p className="eyebrow mb-3">Worn by Closet</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
            {photos.slice(0, 12).map((r) => (
              <div
                key={r.id}
                className="relative aspect-square overflow-hidden rounded-xl bg-cream"
              >
                <Image
                  src={r.photo_url!}
                  alt={`Photo by ${r.author_name}`}
                  fill
                  sizes="(max-width: 640px) 33vw, 150px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-2xl border border-border bg-paper p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-3.5 w-3.5 ${
                        n <= r.rating ? "fill-amber-400 text-amber-400" : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold">{r.author_name}</p>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {new Date(r.created_at).toLocaleDateString("en-PK", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink/85">{r.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
