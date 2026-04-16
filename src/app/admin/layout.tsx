import Link from "next/link";
import { Boxes, ClipboardList, LogOut, LayoutDashboard } from "lucide-react";
import { isAdminAuthed, getAdminPassword } from "@/lib/admin-auth";
import { logoutAction } from "@/lib/admin-actions";
import { hasAdminEnv } from "@/lib/supabase/admin";
import { siteConfig } from "@/lib/site-config";
import Toaster from "@/components/ui/Toaster";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!getAdminPassword()) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Admin not configured</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Set <code className="rounded bg-cream px-2 py-0.5">ADMIN_PASSWORD</code> in your
          environment to enable the admin panel.
        </p>
      </div>
    );
  }

  // Login page gets special handling — it's not authed.
  return <AdminGate>{children}</AdminGate>;
}

async function AdminGate({ children }: { children: React.ReactNode }) {
  const authed = await isAdminAuthed();
  // children may include /admin/login which should be accessible pre-auth.
  // We detect that by letting the login page render its own content above this gate.
  // Simplest: if not authed, redirect everything except /admin/login (handled by the page itself).
  if (!authed) {
    // Don't redirect here — let individual pages decide, since /admin/login should render.
    return <>{children}</>;
  }

  return (
    <div className="min-h-dvh bg-cream/30">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-paper lg:flex">
        <div className="border-b border-border px-6 py-5">
          <Link href="/" className="font-display text-lg font-semibold">
            {siteConfig.shortName} · Admin
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4 text-sm">
          <AdminLink href="/admin" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
          <AdminLink href="/admin/products" icon={<Boxes className="h-4 w-4" />} label="Products" />
          <AdminLink href="/admin/orders" icon={<ClipboardList className="h-4 w-4" />} label="Orders" />
        </nav>
        <form action={logoutAction} className="border-t border-border p-4">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:bg-cream hover:text-ink"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </form>
      </aside>

      <div className="lg:pl-64">
        <header className="flex items-center justify-between border-b border-border bg-paper px-5 py-4 lg:hidden">
          <Link href="/admin" className="font-display text-lg font-semibold">
            Admin
          </Link>
          <form action={logoutAction}>
            <button className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Log out
            </button>
          </form>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
          {!hasAdminEnv() && (
            <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <strong className="font-semibold">Read-only mode.</strong> Supabase is not
              configured — set <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> to enable editing.
            </div>
          )}
          {children}
        </div>
        <Toaster />
      </div>
    </div>
  );
}

function AdminLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-ink/80 hover:bg-cream hover:text-ink"
    >
      {icon} {label}
    </Link>
  );
}

