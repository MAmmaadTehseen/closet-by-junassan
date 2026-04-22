"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Phone } from "lucide-react";
import { siteConfig, waLink, telLink } from "@/lib/site-config";

const STORAGE = "closet-whatsapp-fab-dismissed";

const QUICK_MESSAGES = [
  "Is this piece still available?",
  "Can I get more measurements?",
  "Do you have similar in size M?",
  "When does the next drop go live?",
];

export default function WhatsAppFab() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/checkout/success")) return;
    const dismissed = sessionStorage.getItem(STORAGE) === "1";
    if (!dismissed) {
      const t = setTimeout(() => setShowBubble(true), 8000);
      const h = setTimeout(() => setShowBubble(false), 18000);
      return () => {
        clearTimeout(t);
        clearTimeout(h);
      };
    }
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {open && (
        <div className="bar-rise w-[280px] overflow-hidden rounded-2xl border border-border bg-paper shadow-2xl">
          <div className="flex items-center gap-3 border-b border-border bg-cream/50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-paper">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight">{siteConfig.shortName} support</p>
              <p className="text-[11px] text-muted-foreground">Replies within minutes</p>
            </div>
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 hover:bg-paper"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-2 p-3">
            <p className="text-xs text-muted-foreground">Hey! Tap a question to start the chat:</p>
            {QUICK_MESSAGES.map((m) => (
              <a
                key={m}
                href={waLink(m)}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-border bg-paper p-2.5 text-xs hover:border-ink"
              >
                {m}
              </a>
            ))}
            <a
              href={telLink()}
              className="mt-2 flex items-center justify-center gap-2 rounded-full border border-border py-2 text-[11px] font-semibold uppercase tracking-widest hover:border-ink"
            >
              <Phone className="h-3 w-3" /> Call us instead
            </a>
          </div>
        </div>
      )}
      {showBubble && !open && (
        <div className="fade-in relative max-w-[220px] rounded-2xl rounded-br-sm border border-border bg-paper p-3 text-xs shadow-xl">
          <button
            onClick={() => {
              setShowBubble(false);
              sessionStorage.setItem(STORAGE, "1");
            }}
            aria-label="Dismiss"
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-paper text-muted-foreground hover:text-ink"
          >
            <X className="h-2.5 w-2.5" />
          </button>
          <p>Hey! Need help finding your size? We&apos;re online 👋</p>
        </div>
      )}
      <button
        onClick={() => {
          setOpen((v) => !v);
          setShowBubble(false);
        }}
        aria-label="Open chat"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-paper shadow-2xl transition hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
        {!open && (
          <span className="absolute right-0 top-0 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
          </span>
        )}
      </button>
    </div>
  );
}
