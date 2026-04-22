"use client";

import { useEffect, useState } from "react";
import { MapPin, Truck, Check } from "lucide-react";
import { PK_CITIES } from "@/lib/cities-pk";
import { getDeliveryWindow } from "@/lib/delivery";

const KEY = "closet-delivery-city";

/** Rough tiering — metros ship faster than remote towns. */
const METROS = new Set([
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
]);

const REMOTE = new Set([
  "Gilgit",
  "Skardu",
  "Chitral",
  "Gwadar",
  "Muzaffarabad",
  "Mingora",
]);

function daysForCity(city: string): string {
  if (!city) return "3–5 working days";
  if (METROS.has(city)) return "2–4 working days";
  if (REMOTE.has(city)) return "5–7 working days";
  return "3–5 working days";
}

export default function ShippingEstimator() {
  const [city, setCity] = useState("");
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setCity(stored);
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (city) localStorage.setItem(KEY, city);
    } catch {}
  }, [city, mounted]);

  if (!mounted) return null;

  const days = daysForCity(city);
  const window = city ? getDeliveryWindow() : null;

  return (
    <div className="rounded-2xl border border-border bg-paper p-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        <p className="text-[11px] font-semibold uppercase tracking-wider">
          Deliver to…
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          list="pk-cities-estimator"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter your city"
          className="flex-1 rounded-lg border border-border bg-paper px-3 py-2 text-sm focus:border-ink focus:outline-none"
        />
        <datalist id="pk-cities-estimator">
          {PK_CITIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      {city && (
        <div className="mt-3 space-y-1.5 text-xs">
          <p className="flex items-center gap-1.5 text-ink">
            <Truck className="h-3.5 w-3.5" /> {days} to {city}
          </p>
          {window && (
            <p className="text-muted-foreground">Arrives approx · {window}</p>
          )}
          <p className="flex items-center gap-1.5 text-green-700 dark:text-green-500">
            <Check className="h-3.5 w-3.5" /> Cash on Delivery available
          </p>
        </div>
      )}
    </div>
  );
}
