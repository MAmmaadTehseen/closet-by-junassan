"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const KEY = "closet-announce-dismissed-v1";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(KEY) !== "1") setVisible(true);
    } catch {}
  }, []);

  if (!visible) return null;
  return (
    <div className="relative flex items-center justify-center gap-3 bg-ink px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-paper">
      <span className="line-clamp-1">{siteConfig.announcement}</span>
      <button
        onClick={() => {
          try {
            localStorage.setItem(KEY, "1");
          } catch {}
          setVisible(false);
        }}
        aria-label="Dismiss"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-paper/70 hover:text-paper"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
