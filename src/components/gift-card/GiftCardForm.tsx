"use client";

import { useState } from "react";
import { Gift, MessageCircle } from "lucide-react";
import { formatPKR } from "@/lib/format";
import { waLink } from "@/lib/site-config";

const PRESETS = [1000, 2000, 3000, 5000, 7500, 10000];

export default function GiftCardForm() {
  const [amount, setAmount] = useState(3000);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [note, setNote] = useState("");

  const message = `Hi! I'd like to send a Closet Gift Card.\n\n• Amount: ${formatPKR(amount)}\n• To: ${to || "—"}\n• From: ${from || "—"}\n• Note: ${note || "—"}\n\nPlease share payment & next steps.`;

  return (
    <div className="grid gap-8 rounded-2xl border border-border bg-cream/40 p-6 sm:p-8 lg:grid-cols-2">
      <div>
        <p className="eyebrow mb-2">1 · Choose amount</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                amount === v
                  ? "border-ink bg-ink text-paper"
                  : "border-border bg-paper text-ink hover:border-ink"
              }`}
            >
              {formatPKR(v)}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-full border border-border bg-paper p-1">
          <span className="px-3 text-xs text-muted-foreground">Custom</span>
          <input
            type="number"
            min={500}
            step={500}
            value={amount}
            onChange={(e) => setAmount(Math.max(500, Number(e.target.value) || 0))}
            className="flex-1 bg-transparent px-2 py-2 text-sm focus:outline-none"
          />
          <span className="px-3 text-xs text-muted-foreground">PKR</span>
        </div>
      </div>
      <div className="space-y-3">
        <p className="eyebrow">2 · Make it personal</p>
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="Recipient's name"
          className="w-full rounded-xl border border-border bg-paper px-4 py-3 text-sm focus-ring"
        />
        <input
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-xl border border-border bg-paper px-4 py-3 text-sm focus-ring"
        />
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="A short note (optional)"
          className="w-full resize-none rounded-xl border border-border bg-paper px-4 py-3 text-sm focus-ring"
        />
        <a
          href={waLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-paper hover:opacity-90"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Order via WhatsApp
        </a>
        <p className="flex items-start gap-2 text-[11px] text-muted-foreground">
          <Gift className="mt-0.5 h-3 w-3 shrink-0" /> We&apos;ll confirm payment, then deliver
          a personalised digital gift card to the recipient on WhatsApp.
        </p>
      </div>
    </div>
  );
}
