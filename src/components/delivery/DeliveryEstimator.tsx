"use client";

import { useMemo, useState } from "react";
import { Truck, Calendar, MapPin } from "lucide-react";
import { PK_CITIES } from "@/lib/cities-pk";
import { estimateDelivery, ZONES } from "@/lib/delivery-zones";
import { formatPKR } from "@/lib/format";

const FORMAT: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };

export default function DeliveryEstimator() {
  const [city, setCity] = useState<string>("Karachi");
  const [query, setQuery] = useState("");

  const est = useMemo(() => estimateDelivery(city), [city]);

  const cities = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return PK_CITIES.slice(0, 20);
    return PK_CITIES.filter((c) => c.toLowerCase().includes(q)).slice(0, 20);
  }, [query]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-3xl border border-border bg-paper p-6 sm:p-8">
        <p className="eyebrow mb-3">Where to?</p>
        <label className="flex items-center gap-2 rounded-full border border-border bg-cream/50 px-4 py-3">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search your city"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                city === c
                  ? "border-ink bg-ink text-paper"
                  : "border-border bg-paper hover:border-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-ink p-6 text-paper sm:p-8">
        <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/60">
          <Truck className="h-4 w-4" /> Delivery estimate · {city}
        </div>
        <p className="mt-6 font-display text-5xl font-semibold">
          {est.earliest.toLocaleDateString("en-PK", FORMAT)}
          <span className="mx-3 text-paper/40">–</span>
          {est.latest.toLocaleDateString("en-PK", FORMAT)}
        </p>
        <p className="mt-2 text-sm text-paper/70">
          {est.zone.label} · {est.zone.minDays}–{est.zone.maxDays} working days
        </p>
        <div className="mt-6 rounded-2xl bg-paper/5 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-paper/60">Flat shipping fee</span>
            <span className="font-semibold">{formatPKR(est.zone.fee)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-paper/60">Free shipping above</span>
            <span className="font-semibold">{formatPKR(5000)}</span>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/60">
            <Calendar className="mr-1 inline h-3.5 w-3.5" /> Journey
          </p>
          <ol className="mt-3 space-y-2.5">
            {est.zone.steps.map((s, i) => (
              <li key={s} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-paper/30 text-[11px] font-semibold">
                  {i + 1}
                </span>
                <span className="text-paper/85">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="lg:col-span-2">
        <p className="eyebrow mb-4">All zones</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Object.values(ZONES).map((z) => (
            <div key={z.key} className="rounded-2xl border border-border bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{z.label}</p>
              <p className="mt-2 font-display text-xl font-semibold">{z.minDays}–{z.maxDays} days</p>
              <p className="mt-1 text-xs text-muted-foreground">Fee {formatPKR(z.fee)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
