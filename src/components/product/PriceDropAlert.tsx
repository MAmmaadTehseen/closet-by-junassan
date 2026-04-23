"use client";

import { useEffect, useState } from "react";
import { BellRing, Check } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

const KEY = "closet-price-alerts";

type Map = Record<string, { price: number; at: string }>;

function read(): Map {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function write(m: Map) {
  localStorage.setItem(KEY, JSON.stringify(m));
}

export default function PriceDropAlert({
  productId,
  price,
}: {
  productId: string;
  price: number;
}) {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const m = read();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubscribed(Boolean(m[productId]));
  }, [productId]);

  const onClick = () => {
    const m = read();
    if (subscribed) {
      delete m[productId];
      write(m);
      setSubscribed(false);
      toast.success("Price alert removed");
    } else {
      m[productId] = { price, at: new Date().toISOString() };
      write(m);
      setSubscribed(true);
      toast.success("We'll ping you if the price drops");
    }
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition ${
        subscribed ? "border-ink bg-ink text-paper" : "border-border text-ink hover:border-ink"
      }`}
    >
      {subscribed ? <Check className="h-3.5 w-3.5" /> : <BellRing className="h-3.5 w-3.5" />}
      {subscribed ? "Watching price" : "Alert me on drop"}
    </button>
  );
}
