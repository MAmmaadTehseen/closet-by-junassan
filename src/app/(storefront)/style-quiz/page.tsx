import type { Metadata } from "next";
import StyleQuiz from "@/components/style-quiz/StyleQuiz";
import { fetchProducts } from "@/lib/products";
import { fetchCategories } from "@/lib/categories";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Find Your Fit — Style Quiz",
  description:
    "Answer 5 quick questions and we'll curate a tailored edit of pieces that suit your fit, vibe and budget.",
};

export default async function StyleQuizPage() {
  const [products, categories] = await Promise.all([
    fetchProducts({ limit: 200 }),
    fetchCategories(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10 text-center">
        <p className="eyebrow mb-2">90 seconds · totally free</p>
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
          Find your fit.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Five quick questions and we&apos;ll match you with the perfect drop. No sign-up.
        </p>
      </div>
      <StyleQuiz products={products} categories={categories} />
    </div>
  );
}
