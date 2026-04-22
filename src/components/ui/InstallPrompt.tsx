"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "closet-install-dismissed";
const VISITS_KEY = "closet-visits";
const COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;

export default function InstallPrompt() {
  const pathname = usePathname();
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/checkout")) return;

    // Visit counter.
    const visits = Number(localStorage.getItem(VISITS_KEY) ?? 0) + 1;
    localStorage.setItem(VISITS_KEY, String(visits));

    const dismissed = Number(localStorage.getItem(DISMISSED_KEY) ?? 0);
    if (Date.now() - dismissed < COOLDOWN_MS) return;

    // iOS: no beforeinstallprompt — show a tasteful note after 3 visits.
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) && !/MSStream/.test(ua);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error legacy iOS standalone
      window.navigator.standalone === true;
    if (standalone) return;

    if (ios) {
      setIsIOS(true);
      if (visits >= 3) {
        const t = setTimeout(() => setVisible(true), 4000);
        return () => clearTimeout(t);
      }
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
      if (visits >= 3) {
        setTimeout(() => setVisible(true), 4000);
      }
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, [pathname]);

  const close = () => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  };

  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    const choice = await evt.userChoice;
    if (choice.outcome === "accepted") close();
    else close();
  };

  if (!visible) return null;

  return (
    <div className="toast-in fixed bottom-4 right-4 z-40 max-w-xs rounded-2xl border border-border bg-paper/95 p-4 shadow-xl backdrop-blur-md">
      <button
        onClick={close}
        aria-label="Dismiss"
        className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-cream hover:text-ink"
      >
        <X className="h-3 w-3" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
          <Download className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">Add Closet to your home screen</p>
          {isIOS ? (
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Tap <span className="font-semibold text-ink">Share</span> in Safari, then{" "}
              <span className="font-semibold text-ink">Add to Home Screen</span>.
            </p>
          ) : (
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              One tap — native feel, faster loads, offline cart.
            </p>
          )}
          {!isIOS && evt && (
            <button
              onClick={install}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-paper hover:opacity-90"
            >
              Install
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
