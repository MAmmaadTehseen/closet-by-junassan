"use client";

import { useEffect, useState, type ReactNode } from "react";

export default function IdleMount({
  children,
  timeout = 2000,
}: {
  children: ReactNode;
  timeout?: number;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setReady(true), { timeout });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setReady(true), timeout);
    return () => window.clearTimeout(id);
  }, [timeout]);

  return ready ? <>{children}</> : null;
}
