"use client";

import { useState } from "react";
import { Gift, MessageCircle, Sparkles } from "lucide-react";
import { formatPKR } from "@/lib/format";
import { waLink, siteConfig } from "@/lib/site-config";

const AMOUNTS = [1000, 2000, 3500, 5000, 10000, 25000];
const THEMES = [
  { id: "classic", name: "Classic", from: "#0a0a0a", to: "#1c1917" },
  { id: "rose", name: "Rose", from: "#be185d", to: "#831843" },
  { id: "linen", name: "Linen", from: "#d7c9a7", to: "#f1ede4" },
  { id: "emerald", name: "Emerald", from: "#065f46", to: "#064e3b" },
];

export default function GiftCardConfigurator() {
  const [amount, setAmount] = useState<number>(2000);
  const [theme, setTheme] = useState(THEMES[0]);
  const [custom, setCustom] = useState("");
  const [recipient, setRecipient] = useState("");
  const [note, setNote] = useState("");

  const effective = custom
    ? Math.max(500, Math.min(50000, Number(custom) || amount))
    : amount;

  const msg =
    `Hi ${siteConfig.shortName}! I'd like to buy a digital gift card.\n\n` +
    `Amount: Rs ${effective}\n` +
    `For: ${recipient || "(fill in)"}\n` +
    `Note: ${note || "(none)"}\n` +
    `Theme: ${theme.name}`;

  const isLight = theme.id === "linen";

  return (
    <div className="space-y-6">
      <div
        className="relative aspect-[1.586] w-full overflow-hidden rounded-3xl p-6 shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
          color: isLight ? "#0a0a0a" : "#f5f1e8",
        }}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] opacity-80">
                Closet by Junassan
              </p>
              <p className="mt-2 font-display text-2xl font-semibold">Gift Card</p>
            </div>
            <Gift className="h-6 w-6 opacity-80" />
          </div>
          {note && <p className="max-w-xs text-xs italic opacity-90">&ldquo;{note}&rdquo;</p>}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70">
                Value
              </p>
              <p className="font-display text-3xl font-semibold">{formatPKR(effective)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70">
                To
              </p>
              <p className="font-display text-base">{recipient || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-paper p-5">
        <p className="eyebrow mb-3">Amount</p>
        <div className="grid grid-cols-3 gap-2">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => {
                setAmount(a);
                setCustom("");
              }}
              className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                amount === a && !custom
                  ? "border-ink bg-ink text-paper"
                  : "border-border bg-paper hover:border-ink"
              }`}
            >
              {formatPKR(a)}
            </button>
          ))}
        </div>
        <input
          type="number"
          inputMode="numeric"
          min={500}
          max={50000}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Or custom amount (Rs 500 – 50,000)"
          className="mt-3 w-full rounded-xl border border-border bg-paper px-4 py-3 text-sm focus:border-ink focus:outline-none"
        />

        <p className="eyebrow mt-5 mb-3">Theme</p>
        <div className="grid grid-cols-4 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t)}
              className={`aspect-square rounded-xl border-2 transition ${
                theme.id === t.id ? "border-ink" : "border-transparent"
              }`}
              style={{
                background: `linear-gradient(135deg, ${t.from}, ${t.to})`,
              }}
              aria-label={t.name}
            />
          ))}
        </div>

        <label className="mt-5 block">
          <span className="eyebrow mb-1.5 block">Recipient&apos;s name</span>
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            maxLength={32}
            placeholder="e.g. Ayesha"
            className="w-full rounded-xl border border-border bg-paper px-4 py-3 text-sm focus:border-ink focus:outline-none"
          />
        </label>
        <label className="mt-3 block">
          <span className="eyebrow mb-1.5 block">Personal note (optional)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={140}
            rows={2}
            placeholder="Happy birthday! Go wild."
            className="w-full rounded-xl border border-border bg-paper px-4 py-3 text-sm focus:border-ink focus:outline-none"
          />
          <span className="mt-1 block text-right text-[10px] text-muted-foreground">
            {note.length}/140
          </span>
        </label>

        <a
          href={waLink(msg)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-xs font-semibold uppercase tracking-[0.18em] text-paper hover:opacity-90"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Confirm on WhatsApp
          <Sparkles className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
