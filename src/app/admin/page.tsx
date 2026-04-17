import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  ExternalLink,
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Users,
  Tag,
} from "lucide-react";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasAdminEnv } from "@/lib/supabase/admin";
import { fetchProducts } from "@/lib/products";
import { formatPKR } from "@/lib/format";
import {
  getRevenueAndOrdersByDay,
  getTopProducts,
  getStatusMix,
} from "@/lib/admin-analytics";
import AreaChart from "@/components/admin/charts/AreaChart";
import BarChart from "@/components/admin/charts/BarChart";
import Donut from "@/components/admin/charts/Donut";
import Sparkline from "@/components/admin/charts/Sparkline";

const STATUS_COLORS: Record<string, string> = {
  pending: "#d97706",
  confirmed: "#2563eb",
  shipped: "#7c3aed",
  delivered: "#059669",
  cancelled: "#9ca3af",
};

export default async function AdminDashboard() {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  const [products, { revenue, orders }, topProducts, statusMix] = await Promise.all([
    fetchProducts({ limit: 200 }),
    getRevenueAndOrdersByDay(30),
    getTopProducts(5),
    getStatusMix(),
  ]);

  const revenue30 = revenue.reduce((n, d) => n + d.value, 0);
  const orders30 = orders.reduce((n, d) => n + d.value, 0);
  const aov = orders30 > 0 ? Math.round(revenue30 / orders30) : 0;
  const pending = statusMix.find((s) => s.status === "pending")?.count ?? 0;

  const prev = orders.slice(0, 15).reduce((n, d) => n + d.value, 0);
  const curr = orders.slice(15).reduce((n, d) => n + d.value, 0);
  const orderTrend = prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);

  const lowStock = products
    .filter((p) => p.stock <= 1)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);

  const categoryCounts = new Map<string, number>();
  for (const p of products) {
    categoryCounts.set(p.category, (categoryCounts.get(p.category) ?? 0) + 1);
  }
  const categorySlices = Array.from(categoryCounts.entries())
    .map(([label, count], i) => ({
      label,
      value: count,
      color: ["#0a0a0a", "#c1121f", "#7c6f5a", "#3b3530", "#a3987e", "#d4c8a8"][i % 6],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-5xl">Dashboard</h1>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-ink"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Open storefront
        </Link>
      </div>

      {lowStock.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-300/70 bg-amber-50 px-5 py-3 text-sm text-amber-950">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="font-semibold">Low stock:</span>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}/edit`}
                className="rounded-full border border-amber-300 bg-paper px-2.5 py-0.5 text-[11px] font-medium hover:border-amber-500"
              >
                {p.name} · {p.stock === 0 ? "OUT" : `${p.stock} left`}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Revenue · 30d"
          value={formatPKR(revenue30)}
          icon={<TrendingUp className="h-4 w-4" />}
          spark={<Sparkline values={revenue.map((d) => d.value)} width={100} />}
        />
        <Kpi
          label="Orders · 30d"
          value={orders30.toString()}
          icon={<ShoppingBag className="h-4 w-4" />}
          hint={`${orderTrend >= 0 ? "+" : ""}${orderTrend}% vs prior 15d`}
          hintTone={orderTrend >= 0 ? "good" : "bad"}
        />
        <Kpi
          label="Avg order value"
          value={aov > 0 ? formatPKR(aov) : "—"}
          icon={<Tag className="h-4 w-4" />}
        />
        <Kpi
          label="Pending to fulfil"
          value={pending.toString()}
          icon={<ClipboardList className="h-4 w-4" />}
          hint={pending > 0 ? "Action needed" : "All clear"}
          hintTone={pending > 0 ? "bad" : "good"}
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Panel title="Revenue · last 30 days" subtitle="Confirmed + delivered orders">
          <AreaChart data={revenue} format={(n) => `Rs ${(n / 1000).toFixed(0)}k`} />
        </Panel>
        <Panel title="Orders by status" subtitle="All-time">
          <Donut
            data={statusMix
              .filter((s) => s.count > 0)
              .map((s) => ({
                label: s.status,
                value: s.count,
                color: STATUS_COLORS[s.status] ?? "#9ca3af",
              }))}
          />
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title="Top sellers · by units" subtitle="From order items">
          <BarChart
            data={topProducts.map((t) => ({
              label: t.name,
              value: t.quantity,
              hint: "sold",
            }))}
          />
        </Panel>
        <Panel title="Catalogue mix" subtitle={`${products.length} products total`}>
          <Donut data={categorySlices} />
        </Panel>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminCard href="/admin/products" icon={<Boxes className="h-4 w-4" />} title="Products" />
        <AdminCard href="/admin/orders" icon={<ClipboardList className="h-4 w-4" />} title="Orders" />
        <AdminCard href="/admin/categories" icon={<Tag className="h-4 w-4" />} title="Categories" />
        <AdminCard href="/admin/customers" icon={<Users className="h-4 w-4" />} title="Customers" />
      </div>

      {!hasAdminEnv() && (
        <p className="mt-8 text-xs text-muted-foreground">
          Charts show zeros — Supabase env not configured.
        </p>
      )}
    </>
  );
}

function Kpi({
  label,
  value,
  icon,
  hint,
  hintTone,
  spark,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  hint?: string;
  hintTone?: "good" | "bad";
  spark?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-paper p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-[28px]">{value}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        {hint && (
          <p
            className={`text-[11px] font-medium ${
              hintTone === "bad"
                ? "text-accent-red"
                : hintTone === "good"
                  ? "text-emerald-600"
                  : "text-muted-foreground"
            }`}
          >
            {hint}
          </p>
        )}
        {spark && <div className="ml-auto">{spark}</div>}
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-paper p-5">
      <header className="mb-4">
        <p className="font-display text-lg font-semibold">{title}</p>
        {subtitle && <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

function AdminCard({
  href,
  icon,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-border bg-paper p-4 transition hover:-translate-y-0.5 hover:border-ink"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper">
        {icon}
      </div>
      <p className="font-display text-base font-semibold">{title}</p>
    </Link>
  );
}
