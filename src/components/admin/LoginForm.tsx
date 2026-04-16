"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/lib/admin-actions";

function UnlockButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-ink py-3 text-xs font-semibold uppercase tracking-widest text-paper transition hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Checking…" : "Unlock"}
    </button>
  );
}

export default function LoginForm() {
  const [state, action] = useActionState(loginAction, null);
  return (
    <form action={action} className="mt-8 space-y-4">
      <label className="block">
        <span className="sr-only">Password</span>
        <input
          type="password"
          name="password"
          autoFocus
          required
          placeholder="••••••••"
          className={`w-full rounded-xl border bg-paper px-4 py-3 text-sm focus:outline-none ${
            state && !state.ok ? "border-red-400 focus:border-red-500" : "border-border focus:border-ink"
          }`}
        />
      </label>
      {state && !state.ok && (
        <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{state.error}</p>
      )}
      <UnlockButton />
    </form>
  );
}
