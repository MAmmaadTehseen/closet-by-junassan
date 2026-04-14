"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { Check, X, AlertCircle } from "lucide-react";

export type ToastKind = "success" | "error" | "info";

interface Toast {
  id: string;
  kind: ToastKind;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (t) =>
    set((s) => ({
      toasts: [...s.toasts, { ...t, id: Math.random().toString(36).slice(2) }],
    })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

export const toast = {
  success: (message: string) =>
    useToastStore.getState().push({ kind: "success", message }),
  error: (message: string) => useToastStore.getState().push({ kind: "error", message }),
  info: (message: string) => useToastStore.getState().push({ kind: "info", message }),
};

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    if (toasts.length === 0) return;
    const last = toasts[toasts.length - 1];
    const t = setTimeout(() => dismiss(last.id), 3500);
    return () => clearTimeout(t);
  }, [toasts, dismiss]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast-in pointer-events-auto flex min-w-[260px] max-w-md items-center gap-3 rounded-full border border-border bg-ink px-5 py-3 text-sm font-medium text-paper shadow-xl"
          role="status"
        >
          <span className="flex h-5 w-5 items-center justify-center">
            {t.kind === "success" && <Check className="h-4 w-4 text-green-400" />}
            {t.kind === "error" && <AlertCircle className="h-4 w-4 text-red-400" />}
            {t.kind === "info" && <Check className="h-4 w-4 text-paper/80" />}
          </span>
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="text-paper/60 hover:text-paper"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
