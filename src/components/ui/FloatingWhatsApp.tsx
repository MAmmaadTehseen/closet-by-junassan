"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { waLink, siteConfig } from "@/lib/site-config";

const DISMISSED_KEY = "closet-wa-dismissed";

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    try {
      const dismissedAt = Number(sessionStorage.getItem(DISMISSED_KEY) ?? 0);
      if (Date.now() - dismissedAt > 1000 * 60 * 30) {
        const t = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  const onDismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {}
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 right-3 z-[45] flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {expanded && (
        <div className="fade-in w-64 rounded-2xl border border-border bg-paper p-4 shadow-2xl">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Chat with us
              </p>
              <p className="mt-0.5 font-display text-sm font-semibold">
                Typically replies in minutes
              </p>
            </div>
            <button
              onClick={() => setExpanded(false)}
              aria-label="Collapse"
              className="rounded-full p-1 hover:bg-cream"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Questions about sizing, stock, or delivery? Message us on WhatsApp —{" "}
            {siteConfig.shipping.deliveryDays} delivery.
          </p>
          <a
            href={waLink("Hi! I have a question about a product.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Open WhatsApp
          </a>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="hidden rounded-full bg-paper p-2 shadow-lg ring-1 ring-border sm:block"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-label="Chat on WhatsApp"
          aria-expanded={expanded}
          className="group relative inline-flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl ring-4 ring-[#25D366]/20 transition hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="pointer-events-none absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-red text-[10px] font-bold text-white">
            1
          </span>
        </button>
      </div>
    </div>
  );
}
