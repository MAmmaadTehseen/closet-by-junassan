"use client";

import { useState } from "react";
import { Check, Copy, Gift, Share2 } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

export default function ReferralShare({ code, shareUrl }: { code: string; shareUrl: string }) {
  const [copied, setCopied] = useState(false);

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
    const text = `Use my code ${code} at Closet by Junassan for Rs 200 off your first order. ${shareUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Closet by Junassan", text, url: shareUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      await onCopy();
    }
  };

  return (
    <section className="mt-12 overflow-hidden rounded-3xl border border-border bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0 noise opacity-15" aria-hidden />
      <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper text-ink">
            <Gift className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/70">
              Your referral code
            </p>
            <p className="mt-1 font-display text-3xl font-semibold tracking-tight">{code}</p>
            <p className="mt-2 max-w-xs text-xs text-paper/75">
              Share with a friend — they get <span className="font-semibold text-paper">Rs 200 off</span>, you earn{" "}
              <span className="font-semibold text-paper">200 coins</span> when they order.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            aria-label="Copy code"
            className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-paper/10"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={onShare}
            className="inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-ink hover:opacity-90"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
        </div>
      </div>
    </section>
  );
}
