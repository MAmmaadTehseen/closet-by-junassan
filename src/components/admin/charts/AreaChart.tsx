type Point = { label: string; value: number };

export default function AreaChart({
  data,
  height = 160,
  format = (n: number) => n.toString(),
}: {
  data: Point[];
  height?: number;
  format?: (n: number) => string;
}) {
  const width = 640;
  const pad = { t: 12, r: 12, b: 22, l: 44 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const max = Math.max(1, ...data.map((d) => d.value));
  const n = Math.max(1, data.length - 1);

  const pts = data.map((d, i) => ({
    x: pad.l + (innerW * i) / n,
    y: pad.t + innerH - (d.value / max) * innerH,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${pts[pts.length - 1]?.x ?? pad.l + innerW},${pad.t + innerH} L${pts[0]?.x ?? pad.l},${pad.t + innerH} Z`;

  const ticks = 3;
  const gridlines = Array.from({ length: ticks + 1 }, (_, i) => {
    const v = (max * (ticks - i)) / ticks;
    const y = pad.t + (innerH * i) / ticks;
    return { v, y };
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ink)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--ink)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridlines.map((g, i) => (
        <g key={i}>
          <line x1={pad.l} y1={g.y} x2={width - pad.r} y2={g.y} stroke="var(--line)" strokeDasharray="2 3" />
          <text x={pad.l - 6} y={g.y + 3} textAnchor="end" fontSize="9" fill="var(--muted-fg)">
            {format(Math.round(g.v))}
          </text>
        </g>
      ))}
      <path d={areaPath} fill="url(#areaFill)" />
      <path d={linePath} fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={1.5} fill="var(--ink)" />
      ))}
      {data.map((d, i) => {
        if (data.length > 10 && i % Math.ceil(data.length / 8) !== 0) return null;
        return (
          <text
            key={`l${i}`}
            x={pts[i].x}
            y={height - 6}
            textAnchor="middle"
            fontSize="9"
            fill="var(--muted-fg)"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
