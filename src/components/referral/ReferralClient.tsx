"use client";

import { useEffect, useState } from "react";
import { Copy, Share2, Check } from "lucide-react";
import { toast } from "@/components/ui/Toaster";
import { waLink } from "@/lib/site-config";

function makeCode() {
  const base = "CBJ-";
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return base + r;
}

export default function ReferralClient() {
  const [code, setCode] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let c = "";
    try {
      c = localStorage.getItem("closet-referral-code") ?? "";
    } catch {}
    if (!c) {
      c = makeCode();
      try { localStorage.setItem("closet-referral-code", c); } catch {}
    }
    setCode(c);
  }, []);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?ref=${code}`
      : `https://closetbyjunassan.com/?ref=${code}`;

  const message =
    `Closet by Junassan drops hand-picked branded pieces for Pakistan. Use my code ${code} for Rs 500 off your first order: ${shareUrl}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied.");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy. Long-press to select.");
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Closet by Junassan", text: message, url: shareUrl });
      } catch { /* user cancelled */ }
    } else {
      copy();
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-ink p-8 text-paper sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/60">Your referral code</p>
        <p className="mt-4 font-display text-6xl font-semibold tracking-tight sm:text-7xl">
          {code || "…"}
        </p>
        <p className="mt-4 max-w-md text-sm text-paper/70">
          Share your code. Friends get <span className="font-semibold text-paper">Rs 500 off</span> their first order. You earn <span className="font-semibold text-paper">250 points</span> (Rs 250 credit) when they order.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-xs font-semibold uppercase tracking-widest text-ink hover:opacity-90"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy link"}
          </button>
          <button
            onClick={share}
            className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-paper hover:bg-paper/10"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
          <a
            href={waLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-paper hover:bg-paper/10"
          >
            Share via WhatsApp
          </a>
        </div>
      </div>

      <ol className="grid gap-3 sm:grid-cols-3">
        {[
          { n: 1, title: "Share your code", copy: "Send it to friends who&apos;d love hand-picked branded pieces." },
          { n: 2, title: "They get Rs 500 off", copy: "Applied automatically on their first order above Rs 2000." },
          { n: 3, title: "You get rewarded", copy: "250 points land in your Closet Club once their order ships." },
        ].map((s) => (
          <li key={s.n} className="rounded-2xl border border-border bg-paper p-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Step {s.n}</p>
            <p className="mt-3 font-display text-xl font-semibold">{s.title}</p>
            <p className="mt-1 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: s.copy }} />
          </li>
        ))}
      </ol>
    </div>
  );
}
