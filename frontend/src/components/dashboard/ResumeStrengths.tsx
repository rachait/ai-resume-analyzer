import KeywordCard from "./KeywordCard";

export default function ResumeStrengths({ keywords }: { keywords: string[] }) {
  if (keywords.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-mono text-xs tracking-widest text-mute mb-3">MATCHED KEYWORDS</h3>
      <div className="grid grid-cols-2 gap-2">
        {keywords.map((kw) => (
          <KeywordCard key={kw} keyword={kw} matched={true} />
        ))}
      </div>
    </div>
  );
}
