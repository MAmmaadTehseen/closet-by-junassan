"use client";

import { useEffect, useState } from "react";
import { useCurrency, formatAmount } from "@/lib/currency-store";
import { formatPKR } from "@/lib/format";

/**
 * Renders a PKR amount, auto-switching to a USD preview when the user
 * has flipped the currency toggle. Checkout always uses PKR.
 */
export default function Price({
  amount,
  className = "",
}: {
  amount: number;
  className?: string;
}) {
  const currency = useCurrency((s) => s.currency);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const label = mounted ? formatAmount(amount, currency) : formatPKR(amount);
  return (
    <span className={className} suppressHydrationWarning>
      {label}
    </span>
  );
}
