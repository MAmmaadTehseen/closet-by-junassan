"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useUi } from "@/lib/ui-store";

const SHORTCUTS: { keys: string[]; desc: string }[] = [
  { keys: ["/"], desc: "Open search" },
  { keys: ["G", "H"], desc: "Go home" },
  { keys: ["G", "S"], desc: "Go to shop" },
  { keys: ["G", "D"], desc: "Go to deals" },
  { keys: ["G", "W"], desc: "Open wishlist" },
  { keys: ["G", "C"], desc: "Open compare" },
  { keys: ["G", "B"], desc: "Open bundles" },
  { keys: ["G", "R"], desc: "Rewards" },
  { keys: ["C"], desc: "Open cart" },
  { keys: ["T"], desc: "Toggle theme" },
  { keys: ["?"], desc: "Show this dialog" },
  { keys: ["Esc"], desc: "Close dialogs" },
];

export default function KeyboardShortcuts() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const openCart = useUi((s) => s.openCart);
  const openSearch = useUi((s) => s.openSearch);

  useEffect(() => {
    let gPressed = 0;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const isTyping =
        tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;
      if (isTyping) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "?") {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        openSearch();
        return;
      }
      if (e.key.toLowerCase() === "c" && gPressed === 0) {
        openCart();
        return;
      }
      if (e.key.toLowerCase() === "t" && gPressed === 0) {
        const r = document.documentElement;
        const cur = r.getAttribute("data-theme") === "dark" ? "light" : "dark";
        r.setAttribute("data-theme", cur);
        try {
          localStorage.setItem("closet-theme", cur);
        } catch {
          /* noop */
        }
        return;
      }
      if (e.key.toLowerCase() === "g") {
        gPressed = Date.now();
        return;
      }
      if (gPressed && Date.now() - gPressed < 1200) {
        const map: Record<string, string> = {
          h: "/",
          s: "/shop",
          d: "/deals",
          w: "/wishlist",
          c: "/compare",
          b: "/bundles",
          r: "/rewards",
          f: "/faq",
          j: "/journal",
        };
        const target = map[e.key.toLowerCase()];
        if (target) {
          e.preventDefault();
          router.push(target);
        }
        gPressed = 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, openCart, openSearch]);

  return (
    <Modal open={open} onClose={() => setOpen(false)} maxWidth="max-w-lg">
      <div className="p-8">
        <p className="eyebrow mb-1">Power user mode</p>
        <h2 className="font-display text-2xl font-semibold">Keyboard shortcuts</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Press <Kbd>?</Kbd> anytime to see this again.
        </p>

        <ul className="mt-6 divide-y divide-border border-y border-border">
          {SHORTCUTS.map((s) => (
            <li key={s.desc} className="flex items-center justify-between py-2.5">
              <span className="text-sm">{s.desc}</span>
              <span className="flex items-center gap-1">
                {s.keys.map((k, i) => (
                  <span key={k + i} className="flex items-center gap-1">
                    <Kbd>{k}</Kbd>
                    {i < s.keys.length - 1 && (
                      <span className="text-xs text-muted-foreground">then</span>
                    )}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-7 justify-center rounded-md border border-border bg-cream px-2 py-1 font-mono text-[11px] font-semibold text-ink">
      {children}
    </kbd>
  );
}
