import type { Metadata } from "next";
import StyleQuizClient from "@/components/style-quiz/StyleQuizClient";

export const metadata: Metadata = {
  title: "Style Quiz",
  description: "Find your archetype in 5 questions. Shop pieces that actually feel like you.",
};

export default function StyleQuizPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="eyebrow mb-3">5 questions · 60 seconds</p>
      <h1 className="font-display text-5xl font-semibold leading-[1.02] sm:text-7xl">
        What&apos;s your <span className="italic text-ink/70">archetype?</span>
      </h1>
      <p className="mt-4 max-w-lg text-sm text-muted-foreground">
        Five quick questions. We&apos;ll tell you the one style you keep gravitating to — and line up pieces that fit.
      </p>
      <div className="mt-12">
        <StyleQuizClient />
      </div>
    </section>
  );
}
