"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Share2, MessageCircle } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/ui/brand-icons";
import { toast } from "@/components/ui/Toaster";
import { siteConfig, waLink } from "@/lib/site-config";

function codeFor(name: string): string {
  const slug = (name || "friend").replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();
  return `CLOSET-${slug || "WELCOME"}`;
}

export default function ReferralWidget() {
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState<string>(siteConfig.url);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBaseUrl(window.location.origin);
  }, []);

  const code = codeFor(name);
  const link = `${baseUrl}/?ref=${encodeURIComponent(code)}`;
  const msg = `Hey — I'm loving Closet by Junassan. Use my link for 15% off your first order: ${link}`;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy");
    }
  };

  const nativeShare = () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      navigator
        .share({ title: "Closet by Junassan", text: msg, url: link })
        .catch(() => {});
    } else {
      copy(msg);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-paper p-6 sm:p-8">
      <p className="eyebrow mb-2">Your invite</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="w-full rounded-xl border border-border bg-paper px-4 py-3 text-sm focus-ring"
      />

      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-cream/40 p-1">
          <code className="flex-1 truncate px-3 font-mono text-xs">{link}</code>
          <button
            onClick={() => copy(link)}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-paper"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-border bg-cream/40 p-1">
          <code className="flex-1 truncate px-3 font-mono text-xs">{code}</code>
          <button
            onClick={() => copy(code)}
            className="rounded-full border border-border bg-paper px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-ink hover:border-ink"
          >
            Copy code
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <a
          href={waLink(msg)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-paper px-3 py-2.5 text-xs hover:border-ink"
        >
          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
        </a>
        <a
          href={siteConfig.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-paper px-3 py-2.5 text-xs hover:border-ink"
        >
          <InstagramIcon className="h-3.5 w-3.5" /> Instagram
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-paper px-3 py-2.5 text-xs hover:border-ink"
        >
          <FacebookIcon className="h-3.5 w-3.5" /> Facebook
        </a>
        <button
          onClick={nativeShare}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-paper px-3 py-2.5 text-xs hover:border-ink"
        >
          <Share2 className="h-3.5 w-3.5" /> More
        </button>
      </div>
      <p className="mt-4 text-[11px] text-muted-foreground">
        Referral code applied automatically — or your friend can enter it at checkout.
      </p>
    </div>
  );
}
