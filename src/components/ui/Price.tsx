"use client";

import { useEffect, useState } from "react";
import { formatPKR } from "@/lib/format";
import { formatMoney, useCurrency } from "@/lib/currency-store";

export default function Price({
  amount,
  className,
  strike,
}: {
  amount: number;
  className?: string;
  strike?: boolean;
}) {
  const code = useCurrency((s) => s.code);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const text = mounted && code !== "PKR" ? formatMoney(amount, code) : formatPKR(amount);
  return (
    <span className={`${className ?? ""} ${strike ? "line-through" : ""}`}>{text}</span>
  );
}
