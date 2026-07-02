export default function SuggestionsCard({ suggestions }: { suggestions: string[] }) {
  return (
    <div className="border border-hairline rounded-sm p-5 bg-ink-900">
      <h3 className="font-mono text-xs tracking-widest text-mute mb-4">SUGGESTIONS</h3>
      <ul className="space-y-3">
        {suggestions.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm text-paper leading-relaxed">
            <span className="font-mono text-signal">{String(i + 1).padStart(2, "0")}</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
