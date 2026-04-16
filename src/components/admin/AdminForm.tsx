"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "@/components/ui/Toaster";
import type { ActionResult } from "@/lib/admin-actions";

type BoundAction = (_prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;

interface Props {
  action: BoundAction;
  className?: string;
  children: React.ReactNode;
  /** Show an inline banner in addition to the toast (useful for small standalone forms). */
  showInline?: boolean;
}

export default function AdminForm({ action, className, children, showInline = false }: Props) {
  const [state, formAction] = useActionState(action, null);
  const prev = useRef<ActionResult | null>(null);

  useEffect(() => {
    if (!state || state === prev.current) return;
    prev.current = state;
    if (state.ok) toast.success(state.message);
    else toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className={className}>
      {children}
      {showInline && state && !state.ok && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{state.error}</p>
      )}
      {showInline && state?.ok && (
        <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">{state.message}</p>
      )}
    </form>
  );
}
