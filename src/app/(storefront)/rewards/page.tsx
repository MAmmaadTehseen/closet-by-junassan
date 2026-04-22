import type { Metadata } from "next";
import { Coins, ShoppingBag, UserPlus, Star, MessageCircle, Gift } from "lucide-react";
import CoinsWidget from "@/components/rewards/CoinsWidget";

export const metadata: Metadata = {
  title: "Rewards",
  description:
    "Closet Coins — earn points on every order, redeem at checkout, unlock exclusive perks.",
};

const WAYS_TO_EARN = [
  {
    icon: <ShoppingBag className="h-4 w-4" />,
    title: "Shop",
    amount: "1 coin / Rs 100",
    body: "Every order earns coins automatically on confirmation.",
  },
  {
    icon: <UserPlus className="h-4 w-4" />,
    title: "Refer a friend",
    amount: "500 coins",
    body: "When their first order ships, we credit you instantly.",
  },
  {
    icon: <Star className="h-4 w-4" />,
    title: "Leave a review",
    amount: "50 coins",
    body: "Honest reviews with a photo — approved & credited within 48h.",
  },
  {
    icon: <MessageCircle className="h-4 w-4" />,
    title: "Tag us on Instagram",
    amount: "100 coins",
    body: "Share a wear-story mentioning @closetbyjunassan.",
  },
];

const PERKS = [
  { label: "Rs 100 off", cost: 100, hint: "Classic starter — stacks with any order." },
  { label: "Rs 300 off", cost: 280, hint: "Best value on orders over Rs 2,000." },
  { label: "Free delivery upgrade", cost: 350, hint: "Priority 2-day delivery across PK." },
  { label: "Rs 1,000 off", cost: 900, hint: "Drop this on that perfect splurge." },
  { label: "Early access to new drops", cost: 1500, hint: "Shop 24 hours before the crowd." },
];

export default function RewardsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <Coins className="h-3 w-3" /> Closet Coins
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Earn as you shop. <span className="italic">Spend</span> on what you love.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            A no-nonsense loyalty program. No card, no app — just coins that
            stack up and knock off real rupees at checkout.
          </p>

          <div className="mt-8">
            <CoinsWidget />
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-semibold">Ways to earn</h2>
          <div className="mt-5 grid gap-3">
            {WAYS_TO_EARN.map((w) => (
              <div key={w.title} className="flex items-start gap-4 rounded-2xl border border-border bg-paper p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-ink">
                  {w.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{w.title}</p>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                      {w.amount}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{w.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="mb-6 flex items-center gap-2">
          <Gift className="h-4 w-4" />
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Redeem your coins</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PERKS.map((p) => (
            <div
              key={p.label}
              className="flex items-start justify-between gap-3 rounded-2xl border border-dashed border-border bg-paper p-5"
            >
              <div>
                <p className="font-display text-xl font-semibold">{p.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.hint}</p>
              </div>
              <span className="shrink-0 rounded-full bg-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-paper">
                {p.cost} ⊙
              </span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[11px] text-muted-foreground">
          Redeeming: share your coin balance with us over WhatsApp when placing your order — we apply the discount manually. Self-serve redemption in checkout is coming soon.
        </p>
      </div>
    </div>
  );
}
