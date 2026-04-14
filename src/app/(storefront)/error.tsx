"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center sm:px-6">
      <p className="eyebrow mb-4">Something broke</p>
      <h1 className="font-display text-3xl font-semibold leading-tight sm:text-5xl">
        We hit a snag.
      </h1>
      <p className="mt-4 max-w-sm text-sm text-muted-foreground">
        Please try again. If the problem sticks around, reach us on WhatsApp.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-full border border-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:bg-ink hover:text-paper"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
