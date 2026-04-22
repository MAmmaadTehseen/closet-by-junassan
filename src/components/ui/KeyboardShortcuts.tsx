"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Keyboard } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useUi } from "@/lib/ui-store";

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["?"], label: "Show this help" },
  { keys: ["/", "s"], label: "Open search" },
  { keys: ["g", "h"], label: "Go to home" },
  { keys: ["g", "s"], label: "Go to shop" },
  { keys: ["g", "c"], label: "Open cart drawer" },
  { keys: ["g", "w"], label: "Go to wishlist" },
  { keys: ["g", "k"], label: "Go to compare" },
  { keys: ["g", "t"], label: "Track an order" },
  { keys: ["Esc"], label: "Close any open drawer" },
];

function isTyping(el: Element | null): boolean {
  if (!el) return false;
  const tag = (el as HTMLElement).tagName?.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  return (el as HTMLElement).isContentEditable === true;
}

export default function KeyboardShortcuts() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const openSearch = useUi((s) => s.openSearch);
  const openCart = useUi((s) => s.openCart);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (isTyping(document.activeElement)) return;
      // "?" — help overlay
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // "/" or "s" — search
      if (e.key === "/" || e.key.toLowerCase() === "s") {
        e.preventDefault();
        openSearch();
        return;
      }
      // two-key combos: g + X
      if (e.key.toLowerCase() === "g") {
        const listener = (next: KeyboardEvent) => {
          window.removeEventListener("keydown", listener);
          const k = next.key.toLowerCase();
          if (k === "h") router.push("/");
          else if (k === "s") router.push("/shop");
          else if (k === "w") router.push("/wishlist");
          else if (k === "k") router.push("/compare");
          else if (k === "t") router.push("/track");
          else if (k === "c") openCart();
        };
        window.addEventListener("keydown", listener, { once: true });
        setTimeout(() => window.removeEventListener("keydown", listener), 900);
      }
    },
    [openSearch, openCart, router],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  return (
    <Modal open={open} onClose={() => setOpen(false)} maxWidth="max-w-md">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper">
            <Keyboard className="h-5 w-5" />
          </div>
          <div>
            <p className="eyebrow">Power user</p>
            <h2 className="font-display text-xl font-semibold">Keyboard shortcuts</h2>
          </div>
        </div>
        <ul className="mt-5 divide-y divide-border">
          {SHORTCUTS.map((s) => (
            <li key={s.label} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="flex items-center gap-1">
                {s.keys.map((k, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <kbd className="rounded-md border border-border bg-cream px-2 py-0.5 text-[11px] font-semibold">
                      {k}
                    </kbd>
                    {i < s.keys.length - 1 && (
                      <span className="text-xs text-muted-foreground">then</span>
                    )}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[11px] text-muted-foreground">
          Press <kbd className="rounded border border-border bg-cream px-1 text-[10px]">?</kbd>{" "}
          anywhere on the site to open this panel.
        </p>
      </div>
    </Modal>
  );
}
