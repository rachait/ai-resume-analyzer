interface KeywordCardProps {
  keyword: string;
  matched: boolean;
}

export default function KeywordCard({ keyword, matched }: KeywordCardProps) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-2.5 border rounded-sm font-mono text-sm ${
        matched ? "border-signal/30 bg-signal-soft text-signal" : "border-alert/30 bg-alert-soft text-alert"
      }`}
    >
      <span>{keyword}</span>
      <span className="text-xs">{matched ? "FOUND" : "MISSING"}</span>
    </div>
  );
}
