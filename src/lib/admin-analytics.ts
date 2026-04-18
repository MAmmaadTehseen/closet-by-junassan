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

export type VelocityRow = {
  product_id: string;
  name: string;
  units_30d: number;
  revenue_30d: number;
  in_stock: number;
  weeks_of_cover: number | null;
};

/**
 * Compute 30-day unit velocity per product from order_items.
 * Joins with products to get name + current stock.
 */
export async function getProductVelocity(): Promise<{
  topSellers: VelocityRow[];
  runningLow: VelocityRow[];
  slowMovers: VelocityRow[];
}> {
  const empty = { topSellers: [], runningLow: [], slowMovers: [] };
  if (!hasAdminEnv()) return empty;

  const since = new Date();
  since.setDate(since.getDate() - 30);

  try {
    const supabase = createAdminClient();
    // Fetch recent delivered/confirmed/shipped orders' items.
    const { data: orders } = await supabase
      .from("orders")
      .select("id,created_at,status")
      .gte("created_at", since.toISOString())
      .neq("status", "cancelled");
    const orderIds = (orders ?? []).map((o) => o.id);
    if (orderIds.length === 0) return empty;

    const { data: items } = await supabase
      .from("order_items")
      .select("product_id,quantity,price_pkr")
      .in("order_id", orderIds);

    const agg = new Map<string, { units: number; revenue: number }>();
    for (const it of items ?? []) {
      if (!it.product_id) continue;
      const e = agg.get(it.product_id) ?? { units: 0, revenue: 0 };
      e.units += it.quantity ?? 0;
      e.revenue += (it.price_pkr ?? 0) * (it.quantity ?? 0);
      agg.set(it.product_id, e);
    }

    const { data: products } = await supabase
      .from("products")
      .select("id,name,stock")
      .limit(500);

    const rows: VelocityRow[] = (products ?? []).map((p) => {
      const a = agg.get(p.id) ?? { units: 0, revenue: 0 };
      const weeklyRate = a.units / (30 / 7);
      return {
        product_id: p.id as string,
        name: p.name as string,
        units_30d: a.units,
        revenue_30d: a.revenue,
        in_stock: p.stock as number,
        weeks_of_cover: weeklyRate > 0 ? +(p.stock / weeklyRate).toFixed(1) : null,
      };
    });

    const withSales = rows.filter((r) => r.units_30d > 0);

    return {
      topSellers: [...withSales].sort((a, b) => b.revenue_30d - a.revenue_30d).slice(0, 5),
      runningLow: withSales
        .filter((r) => r.weeks_of_cover !== null && r.weeks_of_cover < 2 && r.in_stock > 0)
        .sort((a, b) => (a.weeks_of_cover ?? 0) - (b.weeks_of_cover ?? 0))
        .slice(0, 5),
      slowMovers: rows
        .filter((r) => r.units_30d === 0 && r.in_stock > 2)
        .slice(0, 5),
    };
  } catch {
    return empty;
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
