"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUi } from "@/lib/ui-store";
import Modal from "@/components/ui/Modal";

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["?"], label: "Show this help" },
  { keys: ["/"], label: "Focus search" },
  { keys: ["g", "h"], label: "Go home" },
  { keys: ["g", "s"], label: "Go to shop" },
  { keys: ["g", "d"], label: "Go to deals" },
  { keys: ["g", "w"], label: "Go to wishlist" },
  { keys: ["g", "c"], label: "Go to cart" },
  { keys: ["c"], label: "Open cart drawer" },
  { keys: ["Esc"], label: "Close overlay" },
];

const isTypingTarget = (el: EventTarget | null): boolean => {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable
  );
};

export default function KeyboardShortcuts() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const openSearch = useUi((s) => s.openSearch);
  const openCart = useUi((s) => s.openCart);

  useEffect(() => {
    let lastG = 0;

    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        openSearch();
        return;
      }

      if (e.key === "c") {
        e.preventDefault();
        openCart();
        return;
      }

      if (e.key === "g") {
        lastG = Date.now();
        return;
      }

      if (Date.now() - lastG < 1200) {
        if (e.key === "h") router.push("/");
        else if (e.key === "s") router.push("/shop");
        else if (e.key === "d") router.push("/deals");
        else if (e.key === "w") router.push("/wishlist");
        else if (e.key === "c") router.push("/cart");
        else return;
        lastG = 0;
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, openSearch, openCart]);

  return (
    <Modal open={open} onClose={() => setOpen(false)} maxWidth="max-w-md">
      <div className="p-7">
        <p className="eyebrow">Keyboard</p>
        <h2 className="mt-1 font-display text-2xl font-semibold">Shortcuts</h2>
        <ul className="mt-5 divide-y divide-border">
          {SHORTCUTS.map((s) => (
            <li key={s.label} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-ink">{s.label}</span>
              <span className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="inline-flex min-w-6 items-center justify-center rounded-md border border-border bg-cream px-1.5 py-0.5 text-[11px] font-semibold text-ink"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[11px] uppercase tracking-widest text-muted-foreground">
          Press <kbd className="mx-1 rounded-md border border-border bg-cream px-1.5 py-0.5 text-[10px]">?</kbd>{" "}
          anytime to reopen
        </p>
      </div>
    </Modal>
  );
}
