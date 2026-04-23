"use client";

import { useState } from "react";
import { Gift, MessageCircle } from "lucide-react";
import { formatPKR } from "@/lib/format";
import { waLink } from "@/lib/site-config";

export default function GiftCardForm({ denoms }: { denoms: number[] }) {
  const [amount, setAmount] = useState(denoms[2]);
  const [customAmount, setCustomAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const final = customAmount ? Math.max(500, Number(customAmount) || 0) : amount;

  const waMsg =
    `Hi! I'd like to buy a Closet by Junassan gift card.\n\n` +
    `Amount: ${formatPKR(final)}\n` +
    (recipient ? `For: ${recipient}\n` : "") +
    (message ? `Note: ${message}\n` : "") +
    `\nPlease send me the payment details.`;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <p className="eyebrow mb-3">Pick an amount</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {denoms.map((d) => (
            <button
              key={d}
              onClick={() => {
                setAmount(d);
                setCustomAmount("");
              }}
              className={`rounded-2xl border px-3 py-4 text-sm font-semibold transition ${
                !customAmount && amount === d
                  ? "border-ink bg-ink text-paper"
                  : "border-border bg-paper hover:border-ink"
              }`}
            >
              {formatPKR(d)}
            </button>
          ))}
        </div>

        <label className="mt-6 block">
          <span className="eyebrow">Or enter custom</span>
          <div className="mt-2 flex items-center rounded-full border border-border bg-paper px-4 py-3">
            <span className="text-sm text-muted-foreground">Rs</span>
            <input
              type="number"
              min={500}
              step={100}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="3,500"
              className="ml-2 w-full bg-transparent text-sm outline-none"
            />
          </div>
        </label>

        <label className="mt-6 block">
          <span className="eyebrow">Recipient name (optional)</span>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Ayesha"
            className="mt-2 w-full rounded-full border border-border bg-paper px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </label>

        <label className="mt-4 block">
          <span className="eyebrow">Note (optional)</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Happy birthday — spend it wild."
            className="mt-2 w-full rounded-2xl border border-border bg-paper px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </label>

        <a
          href={waLink(waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-paper hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" /> Order via WhatsApp
        </a>
      </div>

      <div className="relative">
        <div className="sticky top-28">
          <div className="relative aspect-[1.6/1] overflow-hidden rounded-3xl bg-ink p-8 text-paper shadow-2xl">
            <div className="absolute inset-0 noise opacity-30" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <Gift className="h-6 w-6" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-70">
                  Gift card
                </span>
              </div>
              <div>
                <p className="font-display text-4xl font-semibold tracking-tight">
                  Closet by Junassan
                </p>
                {recipient && (
                  <p className="mt-1 text-sm opacity-90">For {recipient}</p>
                )}
                {message && (
                  <p className="mt-3 line-clamp-2 text-sm italic opacity-80">&ldquo;{message}&rdquo;</p>
                )}
              </div>
              <div className="flex items-end justify-between">
                <p className="font-display text-4xl font-semibold">{formatPKR(final)}</p>
                <span className="text-[10px] opacity-70">Valid 12 months</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Live preview of the card your recipient receives
          </p>
        </div>
      </div>
    </div>
  );
}
