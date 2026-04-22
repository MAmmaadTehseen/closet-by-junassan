"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { waLink, siteConfig } from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/ui/brand-icons";

const DISMISS_KEY = "closet-wa-bubble-dismissed";

export default function WhatsAppBubble() {
  const pathname = usePathname();
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
    const t = window.setTimeout(() => setShowTip(true), 4500);
    return () => window.clearTimeout(t);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setShowTip(false);
  };

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2">
      {showTip && (
        <div className="toast-in pointer-events-auto relative max-w-[240px] rounded-2xl border border-border bg-paper px-4 py-3 pr-8 text-xs shadow-xl">
          <button
            onClick={dismiss}
            aria-label="Dismiss chat tip"
            className="absolute right-1.5 top-1.5 rounded-full p-1 text-muted-foreground hover:bg-cream hover:text-ink"
          >
            <X className="h-3 w-3" />
          </button>
          <p className="font-semibold text-ink">Need help choosing?</p>
          <p className="mt-0.5 text-muted-foreground">
            Message us — replies within minutes.
          </p>
        </div>
      )}
      <a
        href={waLink(`Hi ${siteConfig.shortName}! I had a quick question.`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="pointer-events-auto relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105 focus-ring"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" aria-hidden />
        <WhatsAppIcon className="relative h-6 w-6" />
      </a>
    </div>
  );
}
