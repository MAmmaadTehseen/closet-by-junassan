import Link from "next/link";
import { redirect } from "next/navigation";
import { Boxes, ClipboardList, ExternalLink } from "lucide-react";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";
import { fetchProducts } from "@/lib/products";

export default async function AdminDashboard() {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  const products = await fetchProducts({ limit: 200 });

  let orderCount = 0;
  let pendingCount = 0;
  let revenue = 0;
  if (hasAdminEnv()) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase.from("orders").select("id,status,subtotal_pkr");
      orderCount = data?.length ?? 0;
      pendingCount = data?.filter((o) => o.status === "pending").length ?? 0;
      revenue = (data ?? []).reduce((n, o) => n + (o.subtotal_pkr ?? 0), 0);
    } catch {}
  }

  const lowStock = products.filter((p) => p.stock <= 1).length;
  const discounted = products.filter(
    (p) => p.original_price_pkr && p.original_price_pkr > p.price_pkr,
  ).length;

  return (
    <>
      <div className="mb-8">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-5xl">Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Products" value={products.length.toString()} />
        <Stat label="Low / sold out" value={lowStock.toString()} hint="≤ 1 piece" />
        <Stat label="On discount" value={discounted.toString()} />
        <Stat label="Pending orders" value={pendingCount.toString()} hint={`of ${orderCount} total`} />
      </div>

      {hasAdminEnv() && (
        <div className="mt-8 rounded-2xl border border-border bg-paper p-6">
          <p className="eyebrow mb-2">All-time</p>
          <p className="font-display text-3xl font-semibold">
            Rs {revenue.toLocaleString("en-PK")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">in completed order subtotals</p>
        </div>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <AdminCard
          href="/admin/products"
          icon={<Boxes className="h-5 w-5" />}
          title="Products"
          copy="Manage prices, stock, and discounts."
        />
        <AdminCard
          href="/admin/orders"
          icon={<ClipboardList className="h-5 w-5" />}
          title="Orders"
          copy="Review incoming orders and update their status."
        />
      </div>

      <div className="mt-8">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-ink"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Open storefront
        </Link>
      </div>
    </>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-paper p-5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function AdminCard({
  href,
  icon,
  title,
  copy,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-border bg-paper p-6 transition hover:-translate-y-0.5 hover:border-ink"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper">
        {icon}
      </div>
      <div>
        <p className="font-display text-lg font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
      </div>
    </Link>
  );
}
