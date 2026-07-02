import ScoreGauge from "./ScoreGauge";
import ResumeStrengths from "./ResumeStrengths";
import MissingSkills from "./MissingSkills";
import SuggestionsCard from "./SuggestionsCard";

interface ATSBreakdownProps {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export default function ATSBreakdown({
  score,
  matchedKeywords,
  missingKeywords,
  suggestions,
}: ATSBreakdownProps) {
  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-8">
      <div className="flex justify-center md:justify-start">
        <ScoreGauge score={score} />
      </div>
      <div className="space-y-6">
        <ResumeStrengths keywords={matchedKeywords} />
        <MissingSkills keywords={missingKeywords} />
        <SuggestionsCard suggestions={suggestions} />
      </div>
    </div>
  );
}
