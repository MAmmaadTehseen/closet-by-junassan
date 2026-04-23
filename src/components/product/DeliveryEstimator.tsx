"use client";

import { useMemo, useState } from "react";
import { Truck, Check } from "lucide-react";
import { PK_CITIES } from "@/lib/cities-pk";
import { getDeliveryWindow } from "@/lib/delivery";

/** Major metros ship in 2–3 days, everywhere else 3–5. */
const FAST_CITIES = new Set(["Karachi", "Lahore", "Islamabad", "Rawalpindi"]);

export default function DeliveryEstimator() {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);

  const suggestions = useMemo(() => {
    const q = value.toLowerCase().trim();
    if (!q) return [];
    return PK_CITIES.filter((c) => c.toLowerCase().startsWith(q)).slice(0, 5);
  }, [value]);

  const isFast = FAST_CITIES.has(value);
  const isKnown = (PK_CITIES as readonly string[]).includes(value);
  const windowText = useMemo(() => {
    if (!isKnown) return "";
    if (isFast) {
      const from = new Date();
      const earliest = new Date(from);
      earliest.setDate(earliest.getDate() + 2);
      const latest = new Date(from);
      latest.setDate(latest.getDate() + 3);
      const fmt = new Intl.DateTimeFormat("en-PK", { weekday: "long", month: "long", day: "numeric" });
      return `${fmt.format(earliest)} – ${fmt.format(latest)}`;
    }
    return getDeliveryWindow();
  }, [isFast, isKnown]);

  return (
    <div className="rounded-2xl border border-border bg-cream/40 p-4">
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <Truck className="h-3.5 w-3.5" /> Delivery estimator
      </p>

      <div className="relative mt-3">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(false);
          }}
          placeholder="Your city (e.g. Karachi)"
          className="w-full rounded-full border border-border bg-paper px-4 py-2.5 text-sm outline-none focus:border-ink"
        />
        {suggestions.length > 0 && value !== suggestions[0] && (
          <ul className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-2xl border border-border bg-paper shadow-lg">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  onClick={() => {
                    setValue(s);
                    setChecked(true);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-cream"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!checked && (
        <button
          onClick={() => setChecked(true)}
          disabled={!isKnown}
          className="mt-3 inline-flex items-center gap-1 rounded-full border border-ink px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-ink disabled:opacity-40"
        >
          Check
        </button>
      )}

      {checked && isKnown && (
        <div className="mt-3 flex items-start gap-2 text-sm">
          <Check className="mt-0.5 h-4 w-4 text-ink" />
          <div>
            <p className="font-medium">
              Ships to {value} in{" "}
              <span className="underline">{isFast ? "2–3 working days" : "3–5 working days"}</span>
            </p>
            <p className="text-xs text-muted-foreground">Estimated window: {windowText}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Cash on delivery · no advance payment
            </p>
          </div>
        </div>
      )}

      {checked && !isKnown && value && (
        <p className="mt-3 text-xs text-accent-red">
          We don&apos;t recognise that city — double-check spelling, or message us on WhatsApp.
        </p>
      )}
    </div>
  );
}
