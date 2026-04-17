import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchOrderForReview } from "@/lib/reviews";
import ReviewForm from "@/components/product/ReviewForm";

type Params = Promise<{ code: string }>;

export const metadata = {
  title: "Leave a review",
};

export default async function ReviewPage({ params }: { params: Params }) {
  const { code } = await params;
  const order = await fetchOrderForReview(code);
  if (!order) return notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="mb-10">
        <p className="eyebrow">Order {order.public_code}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-5xl">
          Leave a review{order.full_name ? `, ${order.full_name.split(" ")[0]}` : ""}.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Honest reviews help us (and other shoppers) pick better. Reviews go through a quick approval before publishing.
        </p>
      </div>

      {order.items.length === 0 ? (
        <p className="rounded-2xl border border-border bg-paper p-6 text-sm text-muted-foreground">
          No reviewable items on this order yet.
        </p>
      ) : (
        <div className="space-y-6">
          {order.items.map((it) => (
            <div key={it.product_id} className="rounded-2xl border border-border bg-paper p-6">
              <p className="font-display text-lg font-semibold">{it.name}</p>
              <ReviewForm code={code} productId={it.product_id} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href={`/track?code=${code}`}
          className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-ink"
        >
          ← Back to order
        </Link>
      </div>
    </div>
  );
}
