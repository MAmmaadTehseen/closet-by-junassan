"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  Search,
  Tag,
  Users,
} from "lucide-react";
import { formatPKR } from "@/lib/format";

type AdminProduct = {
  id: string;
  name: string;
  brand: string;
  slug: string;
  stock: number;
  category: string;
};
type AdminOrder = {
  public_code: string;
  full_name: string;
  status: string;
  subtotal_pkr: number;
  created_at: string;
};

type Item = {
  kind: "page" | "product" | "order";
  title: string;
  subtitle?: string;
  href: string;
  icon: React.ReactNode;
  keywords: string;
};

const STATIC_PAGES: Item[] = [
  {
    kind: "page",
    title: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-4 w-4" />,
    keywords: "dashboard home overview",
  },
  {
    kind: "page",
    title: "Products",
    href: "/admin/products",
    icon: <Boxes className="h-4 w-4" />,
    keywords: "products catalog inventory",
  },
  {
    kind: "page",
    title: "New product",
    href: "/admin/products/new",
    icon: <PackagePlus className="h-4 w-4" />,
    keywords: "new create product add",
  },
  {
    kind: "page",
    title: "Orders",
    href: "/admin/orders",
    icon: <ClipboardList className="h-4 w-4" />,
    keywords: "orders sales",
  },
  {
    kind: "page",
    title: "Customers",
    href: "/admin/customers",
    icon: <Users className="h-4 w-4" />,
    keywords: "customers buyers clients ltv",
  },
  {
    kind: "page",
    title: "Categories",
    href: "/admin/categories",
    icon: <Tag className="h-4 w-4" />,
    keywords: "categories taxonomy",
  },
];

export default function AdminCommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open && !loaded) {
      fetch("/admin/command-data")
        .then((r) => r.json())
        .then((d) => {
          setProducts(d.products ?? []);
          setOrders(d.orders ?? []);
          setLoaded(true);
        })
        .catch(() => setLoaded(true));
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 20);
  }, [open, loaded]);

  const items = useMemo<Item[]>(() => {
    const all: Item[] = [
      ...STATIC_PAGES,
      ...products.map<Item>((p) => ({
        kind: "product",
        title: p.name,
        subtitle: `${p.brand} · ${p.category} · ${p.stock === 0 ? "SOLD OUT" : `${p.stock} left`}`,
        href: `/admin/products/${p.id}/edit`,
        icon: <Boxes className="h-4 w-4" />,
        keywords: `${p.name} ${p.brand} ${p.slug} ${p.category}`.toLowerCase(),
      })),
      ...orders.map<Item>((o) => ({
        kind: "order",
        title: o.public_code,
        subtitle: `${o.full_name} · ${o.status} · ${formatPKR(o.subtotal_pkr)}`,
        href: `/admin/orders?q=${encodeURIComponent(o.public_code)}`,
        icon: <ClipboardList className="h-4 w-4" />,
        keywords: `${o.public_code} ${o.full_name} ${o.status}`.toLowerCase(),
      })),
    ];
    const term = q.trim().toLowerCase();
    if (!term) return all.slice(0, 12);
    return all.filter((it) => it.keywords.includes(term) || it.title.toLowerCase().includes(term)).slice(0, 18);
  }, [q, products, orders]);

  useEffect(() => {
    setSelected(0);
  }, [q, open]);

  const openItem = (it: Item) => {
    router.push(it.href);
    setOpen(false);
    setQ("");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/40 px-4 pt-24 fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-paper shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelected((s) => Math.min(s + 1, items.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelected((s) => Math.max(s - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                const it = items[selected];
                if (it) openItem(it);
              }
            }}
            placeholder="Search products, orders, or jump to a page…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <kbd className="rounded border border-border px-1.5 text-[10px] text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {items.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">No matches.</p>
          )}
          {items.map((it, i) => (
            <button
              key={`${it.kind}-${it.href}`}
              onMouseEnter={() => setSelected(i)}
              onClick={() => openItem(it)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                i === selected ? "bg-cream" : "hover:bg-cream/50"
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink/5 text-ink">
                {it.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 block text-sm font-medium text-ink">{it.title}</span>
                {it.subtitle && (
                  <span className="line-clamp-1 block text-[11px] text-muted-foreground">{it.subtitle}</span>
                )}
              </span>
              <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                {it.kind}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-border bg-cream/40 px-4 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-border bg-paper px-1.5 py-0.5">↑↓</kbd> navigate
            <kbd className="rounded border border-border bg-paper px-1.5 py-0.5">↵</kbd> select
          </span>
          <form action="/admin/logout" method="post" className="flex">
            <button type="button" className="inline-flex items-center gap-1 hover:text-ink" disabled>
              <LogOut className="h-3 w-3" /> Cmd+K to toggle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
