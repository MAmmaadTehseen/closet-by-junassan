"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site-config";

const HIDDEN_PATHS = ["/checkout", "/admin"];

export default function WhatsAppFab() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hide = HIDDEN_PATHS.some((p) => pathname?.startsWith(p));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(!hide);
  }, [pathname]);

  if (!show) return null;

  return (
    <a
      href={waLink("Hi! I have a question about an item on your store.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-5 left-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105 hover:shadow-2xl sm:left-6 sm:h-14 sm:w-14"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
      <MessageCircle className="relative h-5 w-5 sm:h-6 sm:w-6" />
      <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-paper opacity-0 transition group-hover:opacity-100 sm:inline-block">
        Chat with us
      </span>
    </a>
  );
}
