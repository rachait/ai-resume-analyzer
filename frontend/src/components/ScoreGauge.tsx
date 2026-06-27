interface ScoreGaugeProps {
  label: string;
  score: number; // 0-100
}

export default function ScoreGauge({ label, score }: ScoreGaugeProps) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 80 ? "#5FA88A" : score >= 60 ? "#E8A23D" : "#C8694C";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#1E4D54" strokeWidth="8" />
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <text
          x="55"
          y="60"
          textAnchor="middle"
          className="font-mono"
          fontSize="22"
          fill="#FAF8F4"
          fontWeight="600"
        >
          {Math.round(score)}
        </text>
      </svg>
      <p className="font-mono text-xs uppercase tracking-wider text-paper-100/60 text-center">{label}</p>
    </div>
  );
}
