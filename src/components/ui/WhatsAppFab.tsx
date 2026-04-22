"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { waLink, siteConfig } from "@/lib/site-config";

const DISMISS_KEY = "closet-wa-fab-collapsed";

export default function WhatsAppFab() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setMounted(true);
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") setCollapsed(true);
    } catch {}
  }, []);

  if (!mounted) return null;

  const dismiss = () => {
    setCollapsed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {!collapsed && (
        <div className="pointer-events-auto relative max-w-[260px] rounded-2xl border border-border bg-paper p-4 pr-8 text-sm shadow-2xl">
          <button
            onClick={dismiss}
            className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-cream"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <p className="font-semibold">Need help?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Chat with us on WhatsApp — we usually reply in minutes.
          </p>
        </div>
      )}
      <a
        href={waLink(`Hi ${siteConfig.name}! I have a question.`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105 focus-ring"
      >
        <MessageCircle className="h-6 w-6" strokeWidth={2} />
      </a>
    </div>
  );
}
