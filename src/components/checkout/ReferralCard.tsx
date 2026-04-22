"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle, Gift } from "lucide-react";
import { referralCodeFromOrder, referralShareMessage, REFERRAL_DISCOUNT_PKR } from "@/lib/referral";
import { waLink } from "@/lib/site-config";
import { toast } from "@/components/ui/Toaster";

export default function ReferralCard({ orderCode }: { orderCode: string }) {
  const code = referralCodeFromOrder(orderCode);
  const message = referralShareMessage(code);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const onShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text: message });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Share message copied");
    } catch {}
  };

  return (
    <div className="rounded-2xl border border-border bg-cream/50 p-6">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper">
          <Gift className="h-4 w-4" />
        </span>
        <div>
          <p className="font-display text-lg font-semibold">Share the love</p>
          <p className="text-xs text-muted-foreground">
            Friends save Rs {REFERRAL_DISCOUNT_PKR}. You earn karma.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-ink bg-paper px-4 py-3 font-mono text-sm font-semibold tracking-wide">
        <span>{code}</span>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-ink"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onShare}
          className="flex-1 rounded-full bg-ink py-3 text-[11px] font-semibold uppercase tracking-wider text-paper hover:opacity-90"
        >
          Share code
        </button>
        <a
          href={waLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink py-3 text-[11px] font-semibold uppercase tracking-wider text-ink hover:bg-ink hover:text-paper"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
