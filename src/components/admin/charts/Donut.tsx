type Slice = { label: string; value: number; color: string };

export default function Donut({ data, size = 140 }: { data: Slice[]; size?: number }) {
  const total = data.reduce((n, d) => n + d.value, 0);
  const r = 52;
  const C = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-5">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="shrink-0">
        <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
          <circle r={r} fill="none" stroke="var(--cream)" strokeWidth="16" />
          {total > 0 &&
            data.map((d, i) => {
              const frac = d.value / total;
              const dash = frac * C;
              const el = (
                <circle
                  key={i}
                  r={r}
                  fill="none"
                  stroke={d.color}
                  strokeWidth="16"
                  strokeDasharray={`${dash} ${C - dash}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += dash;
              return el;
            })}
        </g>
        <text
          x={size / 2}
          y={size / 2 - 2}
          textAnchor="middle"
          fontSize="22"
          fontWeight="600"
          fill="var(--ink)"
        >
          {total}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 14}
          textAnchor="middle"
          fontSize="9"
          fill="var(--muted-fg)"
        >
          TOTAL
        </text>
      </svg>
      <ul className="flex flex-1 flex-col gap-2 text-xs">
        {data.map((d, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
            <span className="flex-1 capitalize text-ink">{d.label}</span>
            <span className="tabular-nums text-muted-foreground">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
