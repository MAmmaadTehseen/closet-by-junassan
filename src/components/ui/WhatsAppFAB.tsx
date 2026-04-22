"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { waLink } from "@/lib/site-config";

const KEY = "closet-wa-fab-collapsed";

export default function WhatsAppFAB() {
  const pathname = usePathname() ?? "/";
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY) !== "1") {
        const t = window.setTimeout(() => setExpanded(true), 4000);
        const auto = window.setTimeout(() => setExpanded(false), 12000);
        return () => {
          window.clearTimeout(t);
          window.clearTimeout(auto);
        };
      }
    } catch {}
  }, []);

  if (!mounted) return null;
  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) return null;

  const collapse = () => {
    setExpanded(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  };

  return (
    <div className="fixed bottom-20 left-4 z-40 flex flex-col items-start gap-2 lg:bottom-6 lg:left-auto lg:right-20">
      {expanded && (
        <div className="toast-in relative max-w-[14rem] rounded-2xl border border-border bg-paper px-4 py-3 pr-7 text-xs leading-relaxed shadow-xl">
          <button
            onClick={collapse}
            aria-label="Dismiss"
            className="absolute right-1.5 top-1.5 rounded-full p-1 text-muted-foreground hover:bg-cream hover:text-ink"
          >
            <X className="h-3 w-3" />
          </button>
          <p className="font-semibold text-ink">Need a styling tip?</p>
          <p className="mt-1 text-muted-foreground">
            Ping us on WhatsApp — we usually reply within minutes.
          </p>
        </div>
      )}
      <a
        href={waLink("Hi! I have a question about a product on the site.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105 active:scale-95"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="absolute h-12 w-12 animate-soft-pulse rounded-full bg-[#25D366]/40" aria-hidden />
      </a>
    </div>
  );
}
