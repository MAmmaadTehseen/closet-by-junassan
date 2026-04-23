"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { waLink, siteConfig } from "@/lib/site-config";

/**
 * Sticky WhatsApp chat orb with pulse ring, animated tooltip, and a
 * lightweight quick-reply sheet. Appears after the user scrolls ~40%.
 */
export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const p = total > 0 ? h.scrollTop / total : 0;
      setVisible(p > 0.08);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const quick = [
    "Is this still in stock?",
    "Can you share sizing?",
    "What's the COD process?",
    "Do you have more in this size?",
  ];

  return (
    <div className="fixed bottom-[86px] right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div className="animate-fade-in-blur glass w-[280px] rounded-2xl p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Chat with us
              </p>
              <p className="font-display text-base font-semibold text-ink">
                {siteConfig.shortName} on WhatsApp
              </p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-ink/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="space-y-2">
            {quick.map((q) => (
              <li key={q}>
                <a
                  href={waLink(q)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-border bg-paper px-3 py-2 text-sm transition hover:-translate-y-0.5 hover:border-ink"
                >
                  {q}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        aria-label="Chat on WhatsApp"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-10px_rgba(37,211,102,0.6)] transition hover:scale-105 focus-ring"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full animate-glow-pulse"
          style={{ boxShadow: "0 0 0 0 rgba(37,211,102,0.45)" }}
        />
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
