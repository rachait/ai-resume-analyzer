import KeywordCard from "./KeywordCard";

export default function MissingSkills({ keywords }: { keywords: string[] }) {
  if (keywords.length === 0) {
    return <p className="text-sm text-mute font-mono">No major gaps detected.</p>;
  }

  return (
    <div className="space-y-2">
      <h3 className="font-mono text-xs tracking-widest text-mute mb-3">MISSING KEYWORDS</h3>
      <div className="grid grid-cols-2 gap-2">
        {keywords.map((kw) => (
          <KeywordCard key={kw} keyword={kw} matched={false} />
        ))}
      </div>
    </div>
  );
}
