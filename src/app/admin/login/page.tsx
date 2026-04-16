import { redirect } from "next/navigation";
import { isAdminAuthed, getAdminPassword } from "@/lib/admin-auth";
import { ShieldCheck } from "lucide-react";
import LoginForm from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  if (!getAdminPassword()) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p>Set ADMIN_PASSWORD to enable the admin panel.</p>
      </div>
    );
  }
  if (await isAdminAuthed()) redirect("/admin");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream/30 px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-paper p-8 shadow-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h1 className="mt-5 text-center font-display text-2xl font-semibold">Admin Login</h1>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Enter the password to manage products and orders.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
