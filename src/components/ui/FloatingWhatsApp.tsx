"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { waLink, siteConfig } from "@/lib/site-config";

const DISMISS_KEY = "closet-wa-bubble-dismissed";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [showBubble, setShowBubble] = useState(false);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
    const t = window.setTimeout(() => setShowBubble(true), 6000);
    return () => window.clearTimeout(t);
  }, [mounted]);

  if (!mounted) return null;
  if (pathname?.startsWith("/admin")) return null;
  if (pathname?.startsWith("/checkout")) return null;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setShowBubble(false);
  };

  const href = waLink(
    `Hi ${siteConfig.shortName}! I have a question about an item I saw on your site.`,
  );

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2 sm:right-6">
      {showBubble && (
        <div className="toast-in relative max-w-[240px] rounded-2xl border border-border bg-paper/95 p-3 pr-8 text-xs shadow-xl backdrop-blur-md">
          <p className="font-semibold text-ink">Need help picking a piece?</p>
          <p className="mt-0.5 text-muted-foreground">
            We reply on WhatsApp within minutes.
          </p>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="absolute right-1.5 top-1.5 rounded-full p-1 text-muted-foreground hover:bg-cream hover:text-ink"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-4 ring-[#25D366]/25 transition hover:scale-105 focus-ring"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="pointer-events-none absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366]/50 opacity-0 group-hover:opacity-100" />
      </a>
    </div>
  );
}
