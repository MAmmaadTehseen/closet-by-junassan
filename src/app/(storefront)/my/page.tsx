import Link from "next/link";
import { ArrowUpRight, Coins, Gift, MapPin, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";
import { getBalance, normalizePhoneKey, tierFor } from "@/lib/loyalty";
import { ensureReferralCode } from "@/lib/referrals";
import { formatPKR } from "@/lib/format";
import ReferralShare from "@/components/checkout/ReferralShare";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "My Closet",
  description: "Your orders, Closet Coins, and referral code.",
  robots: { index: false, follow: false },
};

type SP = Promise<{ phone?: string }>;

interface Order {
  public_code: string;
  status: string;
  subtotal_pkr: number;
  created_at: string;
  full_name: string;
  city: string;
}

async function fetchOrdersForPhone(phone: string): Promise<{
  orders: Order[];
  lifetime: number;
  firstName: string;
}> {
  if (!hasAdminEnv()) return { orders: [], lifetime: 0, firstName: "" };
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("orders")
      .select("public_code,status,subtotal_pkr,created_at,full_name,city")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(50);
    const orders = (data ?? []) as Order[];
    const lifetime = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((n, o) => n + (o.subtotal_pkr ?? 0), 0);
    const firstName = orders[0]?.full_name?.split(/\s+/)[0] ?? "";
    return { orders, lifetime, firstName };
  } catch {
    return { orders: [], lifetime: 0, firstName: "" };
  }
}

export default async function MyPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const raw = (sp.phone ?? "").trim();
  const phone = raw ? normalizePhoneKey(raw) : "";
  const validPhone = /^03\d{9}$/.test(phone);

  let orders: Order[] = [];
  let lifetime = 0;
  let firstName = "";
  let balance = 0;
  let referralCode: string | null = null;

  if (validPhone) {
    const [data, bal, ref] = await Promise.all([
      fetchOrdersForPhone(phone),
      getBalance(phone),
      ensureReferralCode(phone),
    ]);
    orders = data.orders;
    lifetime = data.lifetime;
    firstName = data.firstName;
    balance = bal;
    referralCode = ref;
  }

  const tier = validPhone ? tierFor(lifetime) : null;

  return (
    <>
      {/* Masthead */}
      <section className="relative overflow-hidden border-b border-border bg-paper">
        <div className="pointer-events-none absolute inset-0 noise opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 pt-16 pb-10 sm:px-6 lg:pt-24 lg:pb-14">
          <p className="eyebrow">Your account · Closet Coins</p>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.96] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
            {validPhone && firstName ? (
              <>
                Welcome back, <span className="italic text-ink/70">{firstName}.</span>
              </>
            ) : (
              <>
                My <span className="italic text-ink/70">closet.</span>
              </>
            )}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
            No password, no accounts. Enter your WhatsApp number to see your order history, your
            Closet Coins balance, and your referral code.
          </p>

          {/* Phone lookup */}
          <form className="mt-8 flex flex-wrap gap-2" action="/my" method="get">
            <input
              type="tel"
              name="phone"
              inputMode="numeric"
              defaultValue={raw}
              placeholder="03XXXXXXXXX"
              className="min-w-60 flex-1 rounded-full border border-border bg-paper px-5 py-3.5 text-sm focus:border-ink focus:outline-none"
              required
              pattern="03\d{9}"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper hover:opacity-90"
            >
              Look up
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </form>
          {raw && !validPhone && (
            <p className="mt-3 text-xs text-accent-red">
              That doesn&apos;t look like a Pakistani mobile. Try 03XXXXXXXXX.
            </p>
          )}
          {validPhone && orders.length === 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              No orders found for this number yet.
            </p>
          )}
        </div>
      </section>

      {validPhone && orders.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
          {/* Stat grid */}
          <div className="mb-10 grid gap-3 sm:grid-cols-3">
            <StatCard
              icon={<ShoppingBag className="h-4 w-4" />}
              label="Orders"
              value={orders.length.toString()}
              hint={`${formatPKR(lifetime)} lifetime`}
            />
            <StatCard
              icon={<Coins className="h-4 w-4" />}
              label="Closet Coins"
              value={balance.toString()}
              hint="100 coins = Rs 100 off"
            />
            <StatCard
              icon={<Gift className="h-4 w-4" />}
              label="Your tier"
              value={tier ?? "Bronze"}
              hint={
                tier === "Gold"
                  ? "Top 10% · enjoy"
                  : tier === "Silver"
                    ? `${formatPKR(10000 - lifetime)} to Gold`
                    : `${formatPKR(3000 - lifetime)} to Silver`
              }
            />
          </div>

          {/* Referral card */}
          {referralCode && (
            <ReferralShare
              code={referralCode}
              shareUrl={`${siteConfig.url}/?ref=${referralCode}`}
            />
          )}

          {/* Order history */}
          <div className="mt-12">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="eyebrow">Your orders</p>
                <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                  Recent history
                </h2>
              </div>
            </div>
            <ul className="space-y-3">
              {orders.map((o) => (
                <li
                  key={o.public_code}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-paper p-5 transition hover:border-ink"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-semibold tabular-nums">
                      {o.public_code}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">
                      {new Date(o.created_at).toLocaleDateString("en-PK", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      · {o.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold tabular-nums">{formatPKR(o.subtotal_pkr)}</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${statusClasses(o.status)}`}
                    >
                      {o.status}
                    </span>
                  </div>
                  <Link
                    href={`/track?code=${o.public_code}`}
                    className="ml-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition group-hover:border-ink group-hover:text-ink"
                    aria-label="Track order"
                  >
                    <MapPin className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-paper p-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function statusClasses(status: string) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-900";
    case "confirmed":
      return "bg-blue-100 text-blue-900";
    case "shipped":
      return "bg-indigo-100 text-indigo-900";
    case "delivered":
      return "bg-emerald-100 text-emerald-900";
    case "cancelled":
      return "bg-red-100 text-red-900";
    default:
      return "bg-cream text-ink";
  }
}
