"use client";

import { useState } from "react";
import { Sparkles, Heart, Gift, PartyPopper } from "lucide-react";
import { formatPKR } from "@/lib/format";
import { siteConfig, waLink } from "@/lib/site-config";

const DENOMINATIONS = [1000, 2000, 3500, 5000, 10000];

const THEMES = [
  { id: "noir",   label: "Noir",   icon: Sparkles,     from: "from-ink",          to: "to-charcoal",     fg: "text-paper" },
  { id: "rose",   label: "Rose",   icon: Heart,        from: "from-[#c1121f]",    to: "to-[#7a0a13]",    fg: "text-paper" },
  { id: "cream",  label: "Cream",  icon: Gift,         from: "from-cream",        to: "to-[#d9d1be]",    fg: "text-ink" },
  { id: "party",  label: "Party",  icon: PartyPopper,  from: "from-[#f59e0b]",    to: "to-[#c1121f]",    fg: "text-paper" },
] as const;

export default function GiftCardBuilder() {
  const [amount, setAmount] = useState(2000);
  const [customAmount, setCustomAmount] = useState("");
  const [theme, setTheme] = useState<(typeof THEMES)[number]>(THEMES[0]);
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");

  const amt = customAmount ? Math.max(500, Math.min(50000, Number(customAmount) || 0)) : amount;
  const Icon = theme.icon;

  const whatsappMsg = `Hi! I'd like to buy a ${formatPKR(amt)} gift card for ${recipient || "a friend"}. From: ${sender || "(me)"} · Message: "${message || "—"}"`;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-4">
        <div className={`relative aspect-[1.6/1] overflow-hidden rounded-3xl bg-gradient-to-br ${theme.from} ${theme.to} ${theme.fg} shadow-2xl`}>
          <div className="pointer-events-none absolute inset-0 noise opacity-20" aria-hidden />
          <div className="relative flex h-full flex-col justify-between p-7 sm:p-10">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] opacity-80">
                {siteConfig.name}
              </p>
              <Icon className="h-5 w-5 opacity-80" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] opacity-70">A gift for</p>
              <p className="mt-1 font-display text-2xl font-semibold">{recipient || "Your favourite person"}</p>
              {message && (
                <p className="mt-3 max-w-md text-sm italic opacity-90 line-clamp-3">&ldquo;{message}&rdquo;</p>
              )}
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] opacity-70">Value</p>
                  <p className="mt-0.5 font-display text-4xl font-semibold">{formatPKR(amt)}</p>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] opacity-60">
                  From {sender || "a secret admirer"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-2">Card style</p>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                  theme.id === t.id ? "border-ink bg-ink text-paper" : "border-border bg-paper hover:border-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="eyebrow mb-3">Amount</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {DENOMINATIONS.map((d) => (
              <button
                key={d}
                onClick={() => { setAmount(d); setCustomAmount(""); }}
                className={`rounded-2xl border p-3 text-sm font-semibold transition ${
                  amt === d && !customAmount ? "border-ink bg-ink text-paper" : "border-border bg-paper hover:border-ink"
                }`}
              >
                {formatPKR(d)}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-full border border-border bg-paper p-1.5">
            <span className="pl-3 text-xs text-muted-foreground">Custom</span>
            <input
              type="number"
              inputMode="numeric"
              min={500}
              max={50000}
              placeholder="e.g. 2500"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="flex-1 bg-transparent px-2 py-2 text-sm focus:outline-none"
            />
            <span className="pr-3 text-xs text-muted-foreground">PKR</span>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">Min Rs 500 · Max Rs 50,000</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="To" placeholder="Recipient name" value={recipient} onChange={setRecipient} />
          <Field label="From" placeholder="Your name" value={sender} onChange={setSender} />
        </div>

        <div>
          <label className="eyebrow mb-2 block">Message (optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 140))}
            rows={3}
            placeholder="Happy birthday! Spend this on something you love."
            className="w-full rounded-2xl border border-border bg-paper p-4 text-sm focus:border-ink focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">{message.length}/140</p>
        </div>

        <a
          href={waLink(whatsappMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90"
        >
          Order on WhatsApp · {formatPKR(amt)}
        </a>
        <p className="text-center text-[11px] text-muted-foreground">
          Delivered via WhatsApp as a PDF voucher within 24 hours. Valid for 12 months. Cash on Delivery available.
        </p>
      </div>
    </div>
  );
}

function Field({ label, placeholder, value, onChange }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 40))}
        placeholder={placeholder}
        className="w-full rounded-full border border-border bg-paper px-4 py-3 text-sm focus:border-ink focus:outline-none"
      />
    </label>
  );
}
