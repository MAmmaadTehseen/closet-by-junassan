import type { Metadata } from "next";
import Link from "next/link";
import { Package, Phone, Truck, CheckCircle2, XCircle, Clock, MessageCircle } from "lucide-react";
import { createAdminClient, hasAdminEnv } from "@/lib/supabase/admin";
import { formatPKR } from "@/lib/format";
import { getDeliveryWindow } from "@/lib/delivery";
import { waLink } from "@/lib/site-config";
import TrackingForm from "./TrackingForm";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track the status of your Closet by Junassan order.",
  robots: { index: false, follow: false },
};

type SP = Promise<{ code?: string }>;

interface OrderRow {
  id: string;
  public_code: string | null;
  full_name: string;
  phone: string;
  city: string;
  address: string;
  subtotal_pkr: number;
  status: string;
  created_at: string;
}

interface OrderItemRow {
  name: string;
  price_pkr: number;
  quantity: number;
  size: string | null;
}

const STEPS: { key: string; label: string; icon: React.ReactNode }[] = [
  { key: "pending", label: "Order placed", icon: <Clock className="h-4 w-4" /> },
  { key: "confirmed", label: "Confirmed", icon: <Phone className="h-4 w-4" /> },
  { key: "shipped", label: "Shipped", icon: <Truck className="h-4 w-4" /> },
  { key: "delivered", label: "Delivered", icon: <CheckCircle2 className="h-4 w-4" /> },
];

const STATUS_INDEX: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

export default async function TrackPage({ searchParams }: { searchParams: SP }) {
  const { code: rawCode } = await searchParams;
  const code =
    rawCode && /^CBJ-[A-Z0-9]+$/.test(rawCode.trim().toUpperCase())
      ? rawCode.trim().toUpperCase()
      : null;

  // No code → show search form
  if (!code) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 sm:px-6">
        <p className="eyebrow">Order Status</p>
        <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Track your order</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter the order code from your confirmation message (e.g. CBJ-AB12CD34).
        </p>
        <TrackingForm />
      </div>
    );
  }

  // Fetch order from Supabase
  let order: (OrderRow & { order_items: OrderItemRow[] }) | null = null;
  if (hasAdminEnv()) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("orders")
        .select("id, public_code, full_name, phone, city, address, subtotal_pkr, status, created_at, order_items(name, price_pkr, quantity, size)")
        .eq("public_code", code)
        .single();
      order = data as (OrderRow & { order_items: OrderItemRow[] });
    } catch {
      // fall through to not-found state
    }
  }

  // Not found
  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-paper">
          <XCircle className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold">Order not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We couldn&apos;t find order <span className="font-mono font-semibold">{code}</span>.
          Double-check your code from the confirmation message.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <TrackingForm defaultCode={code} />
        </div>
        <a
          href={waLink(`Hi! I'm looking for order ${code} — can you help?`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-ink"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Ask us on WhatsApp
        </a>
      </div>
    );
  }

  const stepIndex = STATUS_INDEX[order.status] ?? 0;
  const isCancelled = order.status === "cancelled";
  const createdAt = new Date(order.created_at);
  const deliveryWindow = getDeliveryWindow(createdAt);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      {/* Header */}
      <p className="eyebrow">Order Status</p>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            {order.public_code ?? code}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {createdAt.toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Stepper */}
      {!isCancelled ? (
        <div className="mt-10 overflow-x-auto">
          <ol className="flex min-w-[480px] items-start gap-0">
            {STEPS.map((step, i) => {
              const done = i < stepIndex;
              const current = i === stepIndex;
              const future = i > stepIndex;
              return (
                <li key={step.key} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-center">
                    {i > 0 && (
                      <div className={`h-0.5 flex-1 ${done || current ? "bg-ink" : "bg-border"}`} />
                    )}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        done
                          ? "border-ink bg-ink text-paper"
                          : current
                          ? "border-ink bg-paper text-ink"
                          : "border-border bg-paper text-muted-foreground"
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-4 w-4" /> : step.icon}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`h-0.5 flex-1 ${done ? "bg-ink" : "bg-border"}`} />
                    )}
                  </div>
                  <span
                    className={`text-center text-[11px] font-semibold uppercase tracking-widest ${
                      future ? "text-muted-foreground" : "text-ink"
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      ) : (
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-accent-red/30 bg-accent-red/5 px-5 py-4">
          <XCircle className="h-5 w-5 shrink-0 text-accent-red" />
          <p className="text-sm font-medium text-accent-red">This order has been cancelled.</p>
        </div>
      )}

      {/* Delivery estimate */}
      {!isCancelled && stepIndex < 3 && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-cream/50 px-5 py-4">
          <Truck className="h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-sm">
            <span className="font-semibold">Est. delivery:</span>{" "}
            <span className="text-muted-foreground">{deliveryWindow}</span>
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* Items */}
        <div className="rounded-2xl border border-border bg-paper p-5">
          <p className="eyebrow mb-3">Items</p>
          <ul className="divide-y divide-border text-sm">
            {(order.order_items ?? []).map((it, i) => (
              <li key={i} className="flex items-start justify-between gap-2 py-2.5">
                <span className="flex-1">
                  {it.name}
                  {it.size && (
                    <span className="text-muted-foreground"> · {it.size}</span>
                  )}
                  <span className="text-muted-foreground"> × {it.quantity}</span>
                </span>
                <span className="shrink-0 font-medium">
                  {formatPKR(it.price_pkr * it.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-semibold">
            <span>Total</span>
            <span>{formatPKR(order.subtotal_pkr)}</span>
          </div>
        </div>

        {/* Delivery info */}
        <div className="rounded-2xl border border-border bg-paper p-5">
          <p className="eyebrow mb-3">Delivery</p>
          <dl className="space-y-2 text-sm">
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Name</dt>
              <dd>{order.full_name}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">City</dt>
              <dd>{order.city}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Address</dt>
              <dd className="text-muted-foreground">{order.address}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <a
          href={waLink(`Hi! I have a question about order ${code}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-paper"
        >
          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp support
        </a>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90"
        >
          <Package className="h-3.5 w-3.5" /> Continue shopping
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-900",
    confirmed: "bg-blue-100 text-blue-900",
    shipped: "bg-indigo-100 text-indigo-900",
    delivered: "bg-green-100 text-green-900",
    cancelled: "bg-red-100 text-red-900",
  };
  return (
    <span
      className={`self-start rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest ${map[status] ?? "bg-cream text-ink"}`}
    >
      {status}
    </span>
  );
}
