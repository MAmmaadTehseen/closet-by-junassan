"use client";

import { Bell } from "lucide-react";
import { waLink } from "@/lib/site-config";

export default function RestockNotify({ productName }: { productName: string }) {
  const href = waLink(
    `Hi! Please notify me when "${productName}" is back in stock. 🙏`,
  );

  return (
    <div className="space-y-3">
      <div className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Sold Out
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-paper focus-ring"
      >
        <Bell className="h-4 w-4" /> Notify me when back in stock
      </a>
    </div>
  );
}
