/**
 * Shown at the very top of every page when NEXT_PUBLIC_APP_ENV=development.
 * Add that variable to .env.local for local / staging previews.
 * Remove it (or set it to "production") to hide the banner on prod.
 */
export default function DevBanner() {
  if (process.env.NEXT_PUBLIC_APP_ENV !== "development") return null;

  return (
    <div className="sticky top-0 z-[200] flex items-center justify-center gap-2 bg-amber-400 px-4 py-1.5 text-center text-[11px] font-semibold uppercase tracking-widest text-amber-950">
      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-700" />
      Development Preview — not for public sharing
    </div>
  );
}
