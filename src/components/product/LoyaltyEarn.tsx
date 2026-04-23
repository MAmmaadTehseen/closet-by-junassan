import { Coins } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/**
 * Tiny widget that tells the shopper how many loyalty coins this purchase
 * will earn. Computed on the server from `siteConfig.loyalty` so the rate
 * lives in one place.
 */
export default function LoyaltyEarn({ price }: { price: number }) {
  const coins = Math.floor(price / siteConfig.loyalty.rupeesPerCoin);
  if (coins <= 0) return null;
  const value = coins * siteConfig.loyalty.coinValueInRupees;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-paper px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cream">
        <Coins className="h-4 w-4 text-ink" />
      </div>
      <div className="text-xs">
        <p className="font-semibold text-ink">
          Earn <span className="text-accent-red">{coins}</span> {siteConfig.loyalty.name}
        </p>
        <p className="text-muted-foreground">
          Worth Rs {value.toLocaleString("en-PK")} on your next order.
        </p>
      </div>
    </div>
  );
}
