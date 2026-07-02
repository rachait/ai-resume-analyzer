import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  label?: string;
}

const TICKS = [0, 25, 50, 75, 100];

export default function ScoreGauge({ score, label = "ATS MATCH" }: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const clamped = Math.max(0, Math.min(100, score));
  const angle = -90 + (clamped / 100) * 180;

  useEffect(() => {
    const id = requestAnimationFrame(() => setDisplayScore(clamped));
    return () => cancelAnimationFrame(id);
  }, [clamped]);

  const color = clamped >= 70 ? "#2E9E76" : clamped >= 40 ? "#C9962F" : "#D9714B";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 220 130" width="220" height="130">
        <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="#262A30" strokeWidth="1.5" />
        {TICKS.map((t) => {
          const a = (-90 + (t / 100) * 180) * (Math.PI / 180);
          const x1 = 110 + 80 * Math.cos(a), y1 = 110 + 80 * Math.sin(a);
          const x2 = 110 + 90 * Math.cos(a), y2 = 110 + 90 * Math.sin(a);
          return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8A877F" strokeWidth="1" />;
        })}
        <line
          x1="110" y1="110"
          x2={110 + 75 * Math.cos((angle * Math.PI) / 180)}
          y2={110 + 75 * Math.sin((angle * Math.PI) / 180)}
          stroke={color}
          strokeWidth="2"
          style={{ transition: "all 900ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
        <circle cx="110" cy="110" r="4" fill="#F2EFE8" />
      </svg>
      <div className="font-mono text-3xl font-medium leading-none" style={{ color }}>
        {Math.round(displayScore)}
      </div>
      <div className="font-mono text-xs tracking-widest text-mute">{label}</div>
    </div>
  );
}
