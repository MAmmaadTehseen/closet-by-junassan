type Row = { label: string; value: number; hint?: string };

export default function BarChart({
  data,
  format = (n: number) => n.toString(),
}: {
  data: Row[];
  format?: (n: number) => string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      {data.map((d) => {
        const pct = Math.max(4, (d.value / max) * 100);
        return (
          <div key={d.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="line-clamp-1 pr-3 font-medium text-ink">{d.label}</span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {format(d.value)}
                {d.hint && <span className="ml-1 text-[10px]">{d.hint}</span>}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-cream">
              <div
                className="h-full rounded-full bg-ink transition-[width] duration-700 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
      {data.length === 0 && (
        <p className="text-xs text-muted-foreground">No data yet.</p>
      )}
    </div>
  );
}
