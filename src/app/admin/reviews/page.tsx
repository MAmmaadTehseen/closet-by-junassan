import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasAdminEnv } from "@/lib/supabase/admin";
import { fetchAllReviewsAdmin } from "@/lib/reviews";
import { approveReview, deleteReview } from "@/lib/admin-actions";
import AdminForm from "@/components/admin/AdminForm";
import SubmitButton from "@/components/admin/SubmitButton";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default async function AdminReviewsPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  const reviews = hasAdminEnv() ? await fetchAllReviewsAdmin() : [];
  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  return (
    <>
      <div className="mb-6">
        <p className="eyebrow">Admin · Trust</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Reviews</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {pending.length} pending · {approved.length} approved
        </p>
      </div>

      {reviews.length === 0 && (
        <p className="rounded-xl border border-border bg-paper p-6 text-sm text-muted-foreground">
          No reviews yet — they appear here once customers submit via the order tracking page.
        </p>
      )}

      {pending.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 font-display text-lg font-semibold">Pending approval</h2>
          <div className="space-y-4">
            {pending.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </section>
      )}

      {approved.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Approved</h2>
          <div className="space-y-4">
            {approved.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function ReviewCard({
  review,
}: {
  review: {
    id: string;
    rating: number;
    body: string;
    author_name: string;
    approved: boolean;
    created_at: string;
    product_name?: string;
  };
}) {
  return (
    <div className="rounded-2xl border border-border bg-paper p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`h-3.5 w-3.5 ${
                    n <= review.rating ? "fill-amber-400 text-amber-400" : "text-border"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm font-semibold">{review.author_name}</p>
          </div>
          <p className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            {review.product_name ?? "Unknown product"} ·{" "}
            {new Date(review.created_at).toLocaleDateString("en-PK", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${
            review.approved ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"
          }`}
        >
          {review.approved ? "Approved" : "Pending"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink/85">{review.body}</p>
      <div className="mt-4 flex gap-2 border-t border-border pt-4">
        <AdminForm action={approveReview}>
          <input type="hidden" name="id" value={review.id} />
          <input type="hidden" name="approved" value={review.approved ? "false" : "true"} />
          <SubmitButton
            pendingText="Saving…"
            className="rounded-full bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-paper disabled:opacity-60"
          >
            {review.approved ? "Hide" : "Approve"}
          </SubmitButton>
        </AdminForm>
        <AdminForm action={deleteReview}>
          <input type="hidden" name="id" value={review.id} />
          <ConfirmButton
            message="Delete this review permanently?"
            className="rounded-full border border-accent-red px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-accent-red hover:bg-accent-red hover:text-paper"
          >
            Delete
          </ConfirmButton>
        </AdminForm>
      </div>
    </div>
  );
}
