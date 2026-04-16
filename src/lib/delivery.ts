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
