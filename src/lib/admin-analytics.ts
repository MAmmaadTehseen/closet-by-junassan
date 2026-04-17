import "server-only";
import { createAdminClient, hasAdminEnv } from "@/lib/supabase/admin";

export type DayBucket = { date: string; label: string; value: number };
export type TopProduct = { name: string; quantity: number; revenue: number };
export type CategorySlice = { slug: string; label: string; count: number };
export type StatusMix = { status: string; count: number };

function toDayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function shortLabel(d: Date): string {
  return d.toLocaleDateString("en-PK", { month: "short", day: "numeric" });
}

function buildDayBuckets(days: number): DayBucket[] {
  const out: DayBucket[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    out.push({ date: toDayKey(d), label: shortLabel(d), value: 0 });
  }
  return out;
}

export async function getRevenueAndOrdersByDay(days = 30): Promise<{
  revenue: DayBucket[];
  orders: DayBucket[];
}> {
  const revenue = buildDayBuckets(days);
  const orders = buildDayBuckets(days);
  if (!hasAdminEnv()) return { revenue, orders };

  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("orders")
      .select("created_at,subtotal_pkr,status")
      .gte("created_at", since.toISOString())
      .neq("status", "cancelled");

    const revIdx = new Map(revenue.map((b, i) => [b.date, i]));
    for (const row of data ?? []) {
      const key = toDayKey(new Date(row.created_at));
      const i = revIdx.get(key);
      if (i === undefined) continue;
      revenue[i].value += row.subtotal_pkr ?? 0;
      orders[i].value += 1;
    }
  } catch {
    // swallow
  }
  return { revenue, orders };
}

export async function getTopProducts(limit = 5): Promise<TopProduct[]> {
  if (!hasAdminEnv()) return [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("order_items")
      .select("name,quantity,price_pkr")
      .limit(2000);
    const map = new Map<string, TopProduct>();
    for (const row of data ?? []) {
      const existing = map.get(row.name) ?? { name: row.name, quantity: 0, revenue: 0 };
      existing.quantity += row.quantity ?? 0;
      existing.revenue += (row.price_pkr ?? 0) * (row.quantity ?? 0);
      map.set(row.name, existing);
    }
    return Array.from(map.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function getStatusMix(): Promise<StatusMix[]> {
  const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  const out: StatusMix[] = statuses.map((status) => ({ status, count: 0 }));
  if (!hasAdminEnv()) return out;
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("orders").select("status");
    for (const row of data ?? []) {
      const match = out.find((s) => s.status === row.status);
      if (match) match.count += 1;
    }
  } catch {}
  return out;
}
