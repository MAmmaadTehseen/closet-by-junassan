"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SubLink = { label: string; href: string };
type MenuItem = { label: string; href: string; panel?: SubLink[] };

const MENU: MenuItem[] = [
  {
    label: "Men",
    href: "/collections/all?gender=men",
    panel: [
      { label: "Clothing", href: "/collections/all?gender=men&type=clothing" },
      { label: "Shoes", href: "/collections/all?gender=men&type=shoes" },
      { label: "Sale", href: "/collections/all?gender=men&onSale=1" },
      { label: "Activewear", href: "/collections/all?gender=men&type=activewear" },
      { label: "Accessories", href: "/accessories?gender=men" },
    ],
  },
  {
    label: "Women",
    href: "/collections/all?gender=women",
    panel: [
      { label: "Clothing", href: "/collections/all?gender=women&type=clothing" },
      { label: "Shoes", href: "/collections/all?gender=women&type=shoes" },
      { label: "Sale", href: "/collections/all?gender=women&onSale=1" },
      { label: "Activewear", href: "/collections/all?gender=women&type=activewear" },
      { label: "Accessories", href: "/accessories?gender=women" },
    ],
  },
  {
    label: "Shoes",
    href: "/collections/all?type=shoes",
    panel: [
      { label: "Mens", href: "/collections/all?type=shoes&gender=men" },
      { label: "Womens", href: "/collections/all?type=shoes&gender=women" },
      { label: "Kids", href: "/collections/all?type=shoes&gender=kids" },
    ],
  },
  { label: "Collections", href: "/collections/all" },
  { label: "Deals", href: "/deals" },
];

export default function MegaMenu() {
  const [open, setOpen] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const activePanel = MENU.find((m) => m.label === open)?.panel ?? null;

  return (
    <>
      <nav
        className="relative hidden items-center gap-9 text-[13px] font-medium uppercase tracking-[0.18em] lg:flex"
        onMouseLeave={scheduleClose}
      >
        {MENU.map((item) => {
          const hasPanel = !!item.panel;
          const isOpen = open === item.label;
          return (
            <div
              key={item.label}
              onMouseEnter={() => {
                cancelClose();
                setOpen(hasPanel ? item.label : null);
              }}
            >
              <Link
                href={item.href}
                className={`relative inline-block py-1 transition ${
                  isOpen ? "text-ink" : "text-ink/75 hover:text-ink"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-ink transition-all duration-300 ${
                    isOpen ? "right-0" : "right-full"
                  }`}
                />
              </Link>
            </div>
          );
        })}
      </nav>

      {activePanel && (
        <div
          className="absolute inset-x-0 top-full hidden lg:block"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="border-t border-border bg-paper">
            <div className="mx-auto flex max-w-7xl flex-wrap gap-x-10 gap-y-4 px-6 py-10">
              {activePanel.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={() => setOpen(null)}
                  className="group relative text-sm tracking-[0.02em] text-ink/80 transition hover:text-ink"
                >
                  <span className="relative inline-block">
                    {s.label}
                    <span className="absolute -bottom-0.5 left-0 right-full h-px bg-ink transition-all duration-300 group-hover:right-0" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { MENU as MEGA_MENU };
export type { MenuItem };
