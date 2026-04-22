/**
 * Returns a formatted delivery window string like "Tuesday, April 22 – Thursday, April 24".
 * Adds 3 calendar days (earliest) and 5 calendar days (latest) from the given date.
 */
export function getDeliveryWindow(from?: Date): string {
  const base = from ? new Date(from) : new Date();

  const earliest = new Date(base);
  earliest.setDate(earliest.getDate() + 3);

  const latest = new Date(base);
  latest.setDate(latest.getDate() + 5);

  const fmt = new Intl.DateTimeFormat("en-PK", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return `${fmt.format(earliest)} – ${fmt.format(latest)}`;
}

/**
 * Daily dispatch cutoff — orders placed before this time ship the same day.
 * Anything after rolls into the next day's dispatch.
 */
export const DISPATCH_CUTOFF_HOUR = 17; // 5:00 PM PKT

/** Next dispatch cutoff as a Date in the local time zone. */
export function nextDispatchCutoff(now: Date = new Date()): Date {
  const cutoff = new Date(now);
  cutoff.setHours(DISPATCH_CUTOFF_HOUR, 0, 0, 0);
  if (now.getTime() >= cutoff.getTime()) {
    cutoff.setDate(cutoff.getDate() + 1);
  }
  return cutoff;
}

/** Human-readable time-to-cutoff, e.g. "3h 24m". */
export function formatTimeToCutoff(now: Date = new Date()): {
  hours: number;
  minutes: number;
  label: string;
} {
  const diffMs = nextDispatchCutoff(now).getTime() - now.getTime();
  const total = Math.max(0, Math.floor(diffMs / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const label = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  return { hours, minutes, label };
}

/** Expected-arrival-by date: tomorrow if before cutoff, else day after. */
export function expectedArrivalBy(now: Date = new Date()): string {
  const cutoff = nextDispatchCutoff(now);
  const arrival = new Date(cutoff);
  arrival.setDate(arrival.getDate() + 3);
  return new Intl.DateTimeFormat("en-PK", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(arrival);
}
