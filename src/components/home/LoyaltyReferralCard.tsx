"use client";

import { useState } from "react";
import { Gift, Copy, Check, Share2 } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { siteConfig, waLink } from "@/lib/site-config";
import { toast } from "@/components/ui/Toaster";

export default function LoyaltyReferralCard() {
  const [copied, setCopied] = useState(false);
  const code = "CLOSET500";

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied — share it!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy");
    }
  };

  const shareMessage = `Hey! Use my code ${code} on ${siteConfig.url} to get Rs 500 off your first order. Cash on Delivery all over Pakistan.`;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-border bg-ink text-paper">
          <div className="relative grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
            <div className="pointer-events-none absolute inset-0 noise opacity-10" aria-hidden />
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/60">
                Refer a friend
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold leading-tight sm:text-4xl">
                Give Rs 500. Get Rs 500.
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-paper/70">
                Share your code with a friend. They get Rs 500 off their first order, and you
                get Rs 500 off your next one when they buy.
              </p>
            </div>

            <div className="relative flex flex-col gap-3 sm:items-end">
              <div className="flex items-center gap-2 rounded-2xl border border-paper/20 bg-paper/5 p-1.5 backdrop-blur">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/10 text-paper">
                  <Gift className="h-4 w-4" />
                </span>
                <span className="px-3 font-display text-xl font-semibold tracking-[0.2em]">
                  {code}
                </span>
                <button
                  onClick={onCopy}
                  aria-label="Copy code"
                  className="rounded-full bg-paper px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition hover:opacity-90"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <a
                href={waLink(shareMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-paper/80 transition hover:text-paper"
              >
                <Share2 className="h-3.5 w-3.5" /> Share on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
