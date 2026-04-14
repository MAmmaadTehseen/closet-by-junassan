"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useWishlist } from "@/lib/wishlist-store";
import { toast } from "@/components/ui/Toaster";

export default function WishlistButton({
  productId,
  productName,
  className = "",
}: {
  productId: string;
  productName?: string;
  className?: string;
}) {
  const toggle = useWishlist((s) => s.toggle);
  const ids = useWishlist((s) => s.ids);
  const [mounted, setMounted] = useState(false);
  const [popping, setPopping] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const active = mounted && ids.includes(productId);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(productId);
    setPopping(true);
    setTimeout(() => setPopping(false), 400);
    if (!active) toast.success(`Saved${productName ? ` — ${productName}` : ""}`);
  };

  return (
    <button
      onClick={onClick}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-paper/95 shadow-sm backdrop-blur transition hover:scale-105 ${className}`}
    >
      <Heart
        className={`h-4 w-4 transition ${
          active ? "fill-accent-red text-accent-red" : "text-ink"
        } ${popping ? "heart-pop" : ""}`}
      />
    </button>
  );
}
