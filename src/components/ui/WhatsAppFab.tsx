"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { waLink } from "@/lib/site-config";

export default function WhatsAppFab() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1400);
    return () => clearTimeout(t);
  }, []);

  if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/checkout")) {
    return null;
  }
  if (!visible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-6">
      {expanded && (
        <div className="fade-in mb-3 w-64 rounded-2xl border border-border bg-paper p-4 shadow-xl">
          <button
            onClick={() => setExpanded(false)}
            aria-label="Close"
            className="float-right -mt-1 -mr-1 rounded-full p-1 text-muted-foreground hover:bg-cream"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <p className="eyebrow mb-1">Chat with us</p>
          <p className="text-sm font-semibold">Need help choosing?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            We typically reply within minutes. Ask us about sizing, condition, or combined delivery.
          </p>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:opacity-90"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Open WhatsApp
          </a>
        </div>
      )}
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-label="Chat on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105"
      >
        <span
          className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30"
          aria-hidden
        />
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
