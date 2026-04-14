"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "@/components/ui/Toaster";
import { normalizePhone, PHONE_RE } from "@/lib/validators";

export default function Newsletter() {
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = normalizePhone(phone);
    if (!PHONE_RE.test(p)) {
      toast.error("Enter a valid PK mobile (03XXXXXXXXX)");
      return;
    }
    try {
      const existing = JSON.parse(localStorage.getItem("closet-subscribers") ?? "[]");
      if (!existing.includes(p)) existing.push(p);
      localStorage.setItem("closet-subscribers", JSON.stringify(existing));
    } catch {}
    setDone(true);
    toast.success("You're on the list — we'll WhatsApp you next drop.");
  };

  return (
    <section className="relative overflow-hidden border-y border-border bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0 noise opacity-10" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/60">
            WhatsApp drop alerts
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-5xl">
            Be first to the new drop.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/70">
            Drop your number and we&apos;ll WhatsApp you as soon as the next curation goes
            live. No spam. Unsubscribe anytime.
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label className="sr-only" htmlFor="newsletter-phone">Phone</label>
          <div className="flex items-center gap-2 rounded-full border border-paper/20 bg-paper/5 p-1.5 backdrop-blur">
            <input
              id="newsletter-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="03XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-paper/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={done}
              className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:opacity-90 disabled:opacity-60"
            >
              <Send className="h-3.5 w-3.5" /> {done ? "Subscribed" : "Notify Me"}
            </button>
          </div>
          <p className="text-[11px] text-paper/50">
            By subscribing you agree to receive WhatsApp messages about new drops.
          </p>
        </form>
      </div>
    </section>
  );
}
