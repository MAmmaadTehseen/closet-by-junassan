"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const STORAGE_KEY = "closet-install-dismissed";
const COOLDOWN_DAYS = 14;

interface BeforeInstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [evt, setEvt] = useState<BeforeInstallEvent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = Number(localStorage.getItem(STORAGE_KEY) ?? 0);
    if (dismissed && Date.now() - dismissed < COOLDOWN_DAYS * 24 * 60 * 60 * 1000) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setEvt(e as BeforeInstallEvent);
      setTimeout(() => setOpen(true), 6000);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const dismiss = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  };

  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    await evt.userChoice;
    setOpen(false);
    setEvt(null);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  };

  if (!open || !evt) return null;

  return (
    <div className="bar-rise fixed inset-x-3 bottom-3 z-30 mx-auto max-w-sm rounded-2xl border border-border bg-paper p-4 shadow-2xl sm:left-auto sm:right-6 sm:bottom-6">
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-cream hover:text-ink"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cream">
          <Download className="h-5 w-5" />
        </div>
        <div className="flex-1 pr-6">
          <p className="font-display text-base font-semibold">Get the {siteConfig.shortName} app</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Save it to your home screen — drops, deals and one-tap COD checkout.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={install}
              className="rounded-full bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-paper"
            >
              Install
            </button>
            <button
              onClick={dismiss}
              className="rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-ink"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
