export default function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee border-y border-border bg-ink py-3 text-paper">
      <div className="marquee__track text-xs font-semibold uppercase tracking-[0.2em]">
        {doubled.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-12">
            <span>{t}</span>
            <span aria-hidden className="text-paper/40">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
