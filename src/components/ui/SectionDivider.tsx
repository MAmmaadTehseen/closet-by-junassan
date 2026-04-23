/**
 * Artistic SVG section dividers (Copenhagen-style minimalism).
 * `variant="wave"` — soft flowing wave between sections
 * `variant="notch"` — sharp geometric notch
 * `variant="dots"` — repeating dots
 */
export default function SectionDivider({
  variant = "wave",
  className = "",
  flip = false,
}: {
  variant?: "wave" | "notch" | "dots";
  className?: string;
  flip?: boolean;
}) {
  const transform = flip ? "rotate(180deg)" : undefined;

  if (variant === "dots") {
    return (
      <div
        aria-hidden
        className={`flex items-center justify-center gap-2 py-8 ${className}`}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <span
            key={i}
            className="h-1 w-1 rounded-full bg-ink/40 animate-soft-pulse"
            style={{ animationDelay: `${i * 140}ms` }}
          />
        ))}
      </div>
    );
  }

  if (variant === "notch") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 1200 60"
        className={`block w-full h-10 text-border ${className}`}
        preserveAspectRatio="none"
        style={{ transform }}
      >
        <path
          d="M0 60 L0 20 L560 20 L600 0 L640 20 L1200 20 L1200 60 Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 80"
      className={`block w-full h-12 text-border ${className}`}
      preserveAspectRatio="none"
      style={{ transform }}
    >
      <path
        d="M0 80 C 300 0 900 120 1200 40 L 1200 80 Z"
        fill="currentColor"
      />
    </svg>
  );
}
