export default function Sparkline({
  values,
  height = 40,
  width = 140,
}: {
  values: number[];
  height?: number;
  width?: number;
}) {
  const max = Math.max(1, ...values);
  const n = Math.max(1, values.length - 1);
  const pts = values.map((v, i) => ({
    x: (i / n) * width,
    y: height - (v / max) * (height - 4) - 2,
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <path d={d} fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" />
      {last && <circle cx={last.x} cy={last.y} r={2} fill="var(--ink)" />}
    </svg>
  );
}
