"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Share2, MessageCircle } from "lucide-react";
import { toast } from "@/components/ui/Toaster";
import { siteConfig, waLink } from "@/lib/site-config";

const KEY = "closet-ref-code";

function generateCode(): string {
  const adj = ["CLEAN", "SHARP", "SOFT", "QUIET", "WARM", "LINEN", "COTTON", "IRON", "FRESH", "CRISP"];
  const noun = ["FIT", "FOLD", "SEAM", "SHIRT", "COAT", "DENIM", "RAIL", "LOOM"];
  const a = adj[Math.floor(Math.random() * adj.length)];
  const n = noun[Math.floor(Math.random() * noun.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${a}-${n}-${num}`;
}

export default function ReferralCard() {
  const [code, setCode] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let existing: string | null = null;
    try {
      existing = localStorage.getItem(KEY);
    } catch {
      /* noop */
    }
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCode(existing);
      return;
    }
    const next = generateCode();
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* noop */
    }
    setCode(next);
  }, []);

  const link = typeof window !== "undefined" ? `${window.location.origin}/?ref=${code}` : "";
  const shareMsg = `Thought you'd like this — Closet by Junassan has Rs 300 off your first thrift parcel with my code ${code}. ${link}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy");
    }
  };

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: siteConfig.name, text: shareMsg, url: link });
      } else {
        await navigator.clipboard.writeText(shareMsg);
        toast.success("Message copied");
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-ink p-8 text-paper sm:p-10">
      <div className="absolute inset-0 noise opacity-30" />
      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-75">
          Your personal code
        </p>
        <p className="mt-2 break-all font-display text-4xl font-semibold sm:text-6xl">
          {code || "…"}
        </p>
        <p className="mt-3 max-w-md text-sm opacity-85">
          One code, unlimited friends. Valid on any order over Rs 1,500.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={onCopy}
            className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition hover:opacity-90"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            Copy code
          </button>
          <button
            onClick={onShare}
            className="inline-flex items-center gap-2 rounded-full border border-paper/50 px-5 py-3 text-xs font-semibold uppercase tracking-widest transition hover:border-paper"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share link
          </button>
          <a
            href={waLink(shareMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-paper/50 px-5 py-3 text-xs font-semibold uppercase tracking-widest transition hover:border-paper"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
