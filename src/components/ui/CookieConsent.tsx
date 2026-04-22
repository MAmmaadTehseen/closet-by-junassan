"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const KEY = "closet-cookie-consent-v1";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        const t = window.setTimeout(() => setVisible(true), 1200);
        return () => window.clearTimeout(t);
      }
    } catch {}
  }, []);

  const persist = (value: "accept" | "reject") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="toast-in fixed inset-x-3 bottom-20 z-40 max-w-xl rounded-2xl border border-border bg-paper/95 p-4 shadow-2xl backdrop-blur-md sm:inset-x-auto sm:left-4 sm:bottom-6"
    >
      <button
        onClick={() => persist("reject")}
        aria-label="Close"
        className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-cream hover:text-ink"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <p className="pr-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        A little heads up
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink">
        We use cookies to keep your cart, remember wishlisted pieces, and make the site snappy.
        Nothing shady.{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          Privacy policy
        </Link>
        .
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => persist("accept")}
          className="rounded-full bg-ink px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper transition hover:opacity-90"
        >
          Accept all
        </button>
        <button
          onClick={() => persist("reject")}
          className="rounded-full border border-border px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-ink"
        >
          Essential only
        </button>
      </div>
    </div>
  );
}
