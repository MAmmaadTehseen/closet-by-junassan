"use client";

import { useEffect, useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-store";
import { toast } from "@/components/ui/Toaster";

export default function WishlistShare() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const ids = useWishlist((s) => s.ids);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted || ids.length === 0) return null;

  const url = `${window.location.origin}/wishlist/shared?ids=${encodeURIComponent(
    ids.join(","),
  )}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Share link copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy");
    }
  };

  const onShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out my Closet by Junassan wishlist",
          url,
        });
        return;
      } catch {}
    }
    onCopy();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={onShare}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-wider hover:border-ink"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share wishlist
      </button>
      <button
        onClick={onCopy}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-wider hover:border-ink"
        aria-label="Copy link"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
