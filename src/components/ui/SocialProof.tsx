"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ShoppingBag, X } from "lucide-react";

type Event = { firstName: string; city: string; product: string; when: string };

const STORAGE_KEY = "closet-social-dismissed";
const MAX_PER_SESSION = 3;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.max(1, Math.round(diff / 60000));
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export default function SocialProof() {
  const pathname = usePathname();
  const [events, setEvents] = useState<Event[]>([]);
  const [visible, setVisible] = useState<Event | null>(null);
  const shownRef = useRef(0);
  const idxRef = useRef(0);

  useEffect(() => {
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/checkout")) return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;

    let cancelled = false;
    fetch("/api/social-proof")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setEvents(data.events ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    if (events.length === 0) return;
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/checkout")) return;

    let showTimer: number;
    let hideTimer: number;

    const scheduleNext = (delay: number) => {
      showTimer = window.setTimeout(() => {
        if (shownRef.current >= MAX_PER_SESSION) return;
        const ev = events[idxRef.current % events.length];
        idxRef.current += 1;
        shownRef.current += 1;
        setVisible(ev);
        hideTimer = window.setTimeout(() => setVisible(null), 5500);
        if (shownRef.current < MAX_PER_SESSION) {
          scheduleNext(60000 + Math.random() * 60000);
        }
      }, delay);
    };
    scheduleNext(12000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [events, pathname]);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(null);
    shownRef.current = MAX_PER_SESSION;
  };

  if (!visible) return null;

  return (
    <div className="toast-in pointer-events-auto fixed bottom-4 left-4 z-40 flex max-w-xs items-start gap-3 rounded-2xl border border-border bg-paper/95 p-3 pr-8 shadow-xl backdrop-blur-md">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
        <ShoppingBag className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="line-clamp-2 text-xs text-ink">
          <span className="font-semibold">{visible.firstName}</span> in {visible.city} just ordered{" "}
          <span className="font-semibold">{visible.product}</span>
        </p>
        <p className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
          {timeAgo(visible.when)}
        </p>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-cream hover:text-ink"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
