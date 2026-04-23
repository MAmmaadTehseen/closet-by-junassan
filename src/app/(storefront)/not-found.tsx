import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center sm:px-6">
      <p className="font-display text-8xl font-semibold tracking-tighter text-ink/20 sm:text-9xl">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold sm:text-5xl">
        This page wandered off.
      </h1>
      <p className="mt-4 max-w-sm text-sm text-muted-foreground">
        The piece you&apos;re looking for may have sold out or moved. Let&apos;s get you back
        on track.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper"
        >
          Go Home
        </Link>
        <Link
          href="/collections/all"
          className="rounded-full border border-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:bg-ink hover:text-paper"
        >
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
