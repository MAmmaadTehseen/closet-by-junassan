"use client";

import { useEffect, useState } from "react";
import { useCurrency, formatMoney } from "@/lib/currency-store";
import { formatPKR } from "@/lib/format";

export default function PriceDisplay({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  const code = useCurrency((s) => s.code);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  return (
    <span className={className}>
      {mounted ? formatMoney(amount, code) : formatPKR(amount)}
    </span>
  );
}
