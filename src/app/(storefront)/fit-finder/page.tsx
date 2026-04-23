import type { Metadata } from "next";
import FitFinderClient from "@/components/fit-finder/FitFinderClient";

export const metadata: Metadata = {
  title: "Fit Finder",
  description: "Not sure of your size? Take the 30-second fit quiz and we'll recommend one.",
};

export default function FitFinderPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="eyebrow mb-3">30-second fit quiz</p>
      <h1 className="font-display text-5xl font-semibold leading-[1.02] sm:text-6xl">
        Find your size. <span className="italic text-ink/70">No guesswork.</span>
      </h1>
      <p className="mt-4 max-w-lg text-sm text-muted-foreground">
        Four quick questions. We&apos;ll recommend a baseline size and link you straight to pieces that fit.
      </p>
      <div className="mt-12">
        <FitFinderClient />
      </div>
    </section>
  );
}
