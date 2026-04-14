"use client";

import { useEffect } from "react";

export function useKeyboard(
  handler: (e: KeyboardEvent) => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    const fn = (e: KeyboardEvent) => handler(e);
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [handler, enabled]);
}
