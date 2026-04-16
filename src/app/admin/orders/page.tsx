import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createAdminClient, hasAdminEnv } from "@/lib/supabase/admin";
import { updateOrderStatus } from "@/lib/admin-actions";
import { formatPKR } from "@/lib/format";
import AdminForm from "@/components/admin/AdminForm";
import SubmitButton from "@/components/admin/SubmitButton";
import { siteConfig } from "@/lib/site-config";

interface OrderRow {
  id: string;
  public_code: string | null;
  full_name: string;
  phone: string;
  city: string;
  address: string;
  notes: string | null;
  subtotal_pkr: number;
  status: string;
  created_at: string;
}

interface OrderItemRow {
  order_id: string;
  name: string;
  price_pkr: number;
  quantity: number;
  size: string | null;
}

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  let orders: OrderRow[] = [];
  const itemsByOrder: Record<string, OrderItemRow[]> = {};

  if (hasAdminEnv()) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      orders = (data ?? []) as OrderRow[];
      if (orders.length > 0) {
        const ids = orders.map((o) => o.id);
        const { data: items } = await supabase
          .from("order_items")
          .select("*")
          .in("order_id", ids);
        for (const it of (items ?? []) as OrderItemRow[]) {
          (itemsByOrder[it.order_id] ??= []).push(it);
        }
      }
    } catch (err) {
      console.error("[admin/orders]", err);
    }
  }

  const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

  return (
    <>
      <div className="mb-8">
        <p className="eyebrow">Admin · Operations</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Orders</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {orders.length} orders · newest first.
        </p>
      </div>

      {!hasAdminEnv() && (
        <p className="rounded-xl border border-border bg-paper p-6 text-sm text-muted-foreground">
          Supabase is not configured. Orders are only visible once you set
          {" "}<code>SUPABASE_SERVICE_ROLE_KEY</code> on the server.
        </p>
      )}

      {orders.length === 0 && hasAdminEnv() && (
        <p className="rounded-xl border border-border bg-paper p-6 text-sm text-muted-foreground">
          No orders yet.
        </p>
      )}

      <div className="space-y-4">
        {orders.map((o) => (
          <details key={o.id} className="rounded-2xl border border-border bg-paper">
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="font-display text-base font-semibold">
                  {o.public_code ?? o.id.slice(0, 8).toUpperCase()} · {o.full_name}
                </p>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  {new Date(o.created_at).toLocaleString("en-PK")} · {o.city} · {o.phone}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold">{formatPKR(o.subtotal_pkr)}</p>
                <StatusBadge status={o.status} />
              </div>
            </summary>

            <div className="grid gap-6 border-t border-border px-5 py-5 lg:grid-cols-[1fr_280px]">
              <div>
                <p className="eyebrow mb-3">Items</p>
                <ul className="divide-y divide-border text-sm">
                  {(itemsByOrder[o.id] ?? []).map((it, i) => (
                    <li key={i} className="flex justify-between py-2">
                      <span>
                        {it.name}
                        {it.size && <span className="text-muted-foreground"> · size {it.size}</span>}
                        <span className="text-muted-foreground"> × {it.quantity}</span>
                      </span>
                      <span className="font-medium">{formatPKR(it.price_pkr * it.quantity)}</span>
                    </li>
                  ))}
                </ul>

                <p className="eyebrow mt-5 mb-2">Delivery address</p>
                <p className="text-sm">{o.address}</p>
                {o.notes && (
                  <>
                    <p className="eyebrow mt-5 mb-2">Notes</p>
                    <p className="text-sm">{o.notes}</p>
                  </>
                )}
              </div>

              <div>
                <p className="eyebrow mb-3">Update status</p>
                <AdminForm action={updateOrderStatus} className="space-y-3">
                  <input type="hidden" name="id" value={o.id} />
                  <select
                    name="status"
                    defaultValue={o.status}
                    className="w-full rounded-full border border-border bg-paper px-4 py-2.5 text-xs font-semibold uppercase tracking-widest"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <SubmitButton
                    pendingText="Saving…"
                    className="w-full rounded-full bg-ink py-2.5 text-xs font-semibold uppercase tracking-widest text-paper disabled:opacity-60"
                  >
                    Save
                  </SubmitButton>
                </AdminForm>

                <a
                  href={`https://wa.me/${o.phone.replace(/^0/, "92")}?text=${encodeURIComponent(`Hi ${o.full_name}, this is ${siteConfig.name}. Your order ${o.public_code ?? ""} is being processed.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block rounded-full border border-ink py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-ink hover:bg-ink hover:text-paper"
                >
                  WhatsApp customer
                </a>
              </div>
            </div>
          </details>
        ))}
      </div>
    </>
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
      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${map[status] ?? "bg-cream text-ink"}`}
    >
      {status}
    </span>
  );
}
