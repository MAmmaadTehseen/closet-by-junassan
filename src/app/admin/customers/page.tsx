import Link from "next/link";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";
import { formatPKR } from "@/lib/format";
import { waLink } from "@/lib/site-config";
import { getBalancesForPhones, normalizePhoneKey, tierFor } from "@/lib/loyalty";

type Row = {
  phone: string;
  name: string;
  cities: Set<string>;
  orders: number;
  spend: number;
  lastOrder: string;
  pending: number;
};

export default async function AdminCustomers() {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  const rows: Row[] = [];
  let totalRevenue = 0;
  let repeatCount = 0;

  if (hasAdminEnv()) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("orders")
        .select("phone,full_name,city,subtotal_pkr,status,created_at")
        .order("created_at", { ascending: false })
        .limit(1000);

      const map = new Map<string, Row>();
      for (const o of data ?? []) {
        const phone = o.phone ?? "—";
        const existing = map.get(phone) ?? {
          phone,
          name: o.full_name ?? "",
          cities: new Set<string>(),
          orders: 0,
          spend: 0,
          lastOrder: o.created_at,
          pending: 0,
        };
        existing.orders += 1;
        existing.spend += o.subtotal_pkr ?? 0;
        if (o.city) existing.cities.add(o.city);
        if (o.status === "pending") existing.pending += 1;
        if (o.created_at > existing.lastOrder) existing.lastOrder = o.created_at;
        map.set(phone, existing);
      }
      rows.push(...Array.from(map.values()).sort((a, b) => b.spend - a.spend));
      totalRevenue = rows.reduce((n, r) => n + r.spend, 0);
      repeatCount = rows.filter((r) => r.orders > 1).length;
    } catch {}
  }

  // Attach loyalty balances.
  const balances = await getBalancesForPhones(rows.map((r) => r.phone));

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-5xl">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} unique buyers · {repeatCount} repeat · {formatPKR(totalRevenue)} lifetime
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-paper p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-display text-xl">No customers yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Customers appear here once orders are placed.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-paper">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-cream/40 text-left">
                <tr>
                  <Th>Name</Th>
                  <Th>Phone</Th>
                  <Th>Tier</Th>
                  <Th className="text-right">Orders</Th>
                  <Th className="text-right">Lifetime</Th>
                  <Th className="text-right">Coins</Th>
                  <Th>Last order</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const date = new Date(r.lastOrder);
                  const balance = balances.get(normalizePhoneKey(r.phone)) ?? 0;
                  const tier = tierFor(r.spend);
                  const tierColor =
                    tier === "Gold"
                      ? "bg-amber-100 text-amber-900"
                      : tier === "Silver"
                        ? "bg-slate-200 text-slate-800"
                        : "bg-orange-100 text-orange-900";
                  return (
                    <tr key={r.phone} className="border-b border-border last:border-0 hover:bg-cream/30">
                      <td className="px-4 py-3">
                        <p className="font-medium">{r.name || "—"}</p>
                        {r.orders > 1 && (
                          <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-800">
                            Repeat · {r.orders}×
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{r.phone}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${tierColor}`}>
                          {tier}
                        </span>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {Array.from(r.cities).join(", ")}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {r.orders}
                        {r.pending > 0 && (
                          <span className="ml-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">
                            {r.pending} pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold">
                        {formatPKR(r.spend)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {balance > 0 ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-ink">
                            {balance}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {date.toLocaleDateString("en-PK", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <a
                            href={waLink(`Hi ${r.name?.split(" ")[0] ?? "there"}! Thanks for shopping with Closet by Junassan.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border hover:border-ink"
                            aria-label="WhatsApp"
                          >
                            <WhatsAppIcon mono className="h-3.5 w-3.5" />
                          </a>
                          <Link
                            href={`/admin/orders?q=${encodeURIComponent(r.phone)}`}
                            className="rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest hover:border-ink"
                          >
                            Orders
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground ${className}`}>
      {children}
    </th>
  );
}
