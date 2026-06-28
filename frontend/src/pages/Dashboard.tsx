import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { runFullAnalysis, getReview } from "../services/api";
import type { FullAnalysisResponse, ReviewResult } from "../types";
import ScoreGauge from "../components/ScoreGauge";

export default function DashboardPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [analysis, setAnalysis] = useState<FullAnalysisResponse | null>(null);
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      try {
        const result = await runFullAnalysis(sessionId);
        setAnalysis(result);
        setLoading(false);
        // AI review is slower (LLM call) — fetch it after the fast scoring lands
        try {
          const reviewResult = await getReview(sessionId);
          setReview(reviewResult);
        } catch {
          // Review is best-effort; the rest of the dashboard still works without it.
        }
      } catch (e: any) {
        setError(e?.response?.data?.detail || "Failed to analyze. Please try again.");
        setLoading(false);
      } finally {
        setTimeout(() => setScanning(false), 600);
      }
    })();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <div className="scanline-track w-64 h-40 rounded-lg border border-ink-700 bg-ink-900 flex items-center justify-center">
          <div className="scanline-beam animate-scan" />
          <p className="font-mono text-amber-400 text-xs uppercase tracking-widest">Scanning resume…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center text-paper-50">
        <p className="text-signal-red font-mono">{error}</p>
      </div>
    );
  }

  if (!analysis) return null;

  const breakdownData = [
    { name: "Skills", value: analysis.ats.breakdown.skills_match },
    { name: "Sections", value: analysis.ats.breakdown.section_completeness },
    { name: "Formatting", value: analysis.ats.breakdown.formatting },
    { name: "Experience", value: analysis.ats.breakdown.experience_relevance },
  ];

  return (
    <div className="min-h-screen bg-ink-950 text-paper-50 font-body pb-20">
      <header className="border-b border-ink-800 px-8 py-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">
          Scan <span className="text-amber-400">Results</span>
        </h1>
        <span className="font-mono text-xs text-paper-100/40">session: {sessionId?.slice(0, 8)}</span>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 grid gap-10">
        {/* Score gauges */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-center bg-ink-900 border border-ink-800 rounded-xl p-8">
          <ScoreGauge label="ATS Score" score={analysis.ats.overall_ats_score} />
          <ScoreGauge label="Semantic Match" score={analysis.semantic.overall_semantic_score} />
          {review && <ScoreGauge label="AI Review Score" score={review.overall_score} />}
        </section>

        {/* ATS breakdown chart */}
        <section className="bg-ink-900 border border-ink-800 rounded-xl p-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-amber-400 mb-4">
            ATS Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={breakdownData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E4D54" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="#FAF8F4" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="#FAF8F4" fontSize={12} width={90} />
              <Tooltip
                contentStyle={{ background: "#0F2A2E", border: "1px solid #1E4D54", color: "#FAF8F4" }}
              />
              <Bar dataKey="value" fill="#E8A23D" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Keyword gaps */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-ink-900 border border-ink-800 rounded-xl p-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-signal-green mb-4">
              Matched Keywords ({analysis.keywords.matched.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.matched.map((kw) => (
                <span key={kw} className="px-3 py-1 rounded-full bg-signal-green/10 text-signal-green text-xs font-mono border border-signal-green/30">
                  {kw}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-ink-900 border border-ink-800 rounded-xl p-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-signal-red mb-4">
              Missing Keywords ({analysis.keywords.missing.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.missing.map((kw) => (
                <span key={kw} className="px-3 py-1 rounded-full bg-signal-red/10 text-signal-red text-xs font-mono border border-signal-red/30">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* AI Review */}
        {review && (
          <section className="bg-ink-900 border border-ink-800 rounded-xl p-6 grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-signal-green mb-3">Strengths</h2>
              <ul className="space-y-2 text-sm text-paper-100/80">
                {review.strengths.map((s, i) => (
                  <li key={i}>· {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-amber-400 mb-3">Suggestions</h2>
              <ul className="space-y-2 text-sm text-paper-100/80">
                {review.suggestions.map((s, i) => (
                  <li key={i}>· {s}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Semantic match detail */}
        <section className="bg-ink-900 border border-ink-800 rounded-xl p-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-amber-400 mb-4">
            Requirement Coverage (lowest match first)
          </h2>
          <div className="space-y-3">
            {analysis.semantic.details.slice(0, 8).map((d, i) => (
              <div key={i} className="border-b border-ink-800 pb-3 last:border-0">
                <p className="text-sm text-paper-50">{d.jd_requirement}</p>
                <p className="text-xs text-paper-100/50 mt-1">
                  closest match: "{d.best_matching_resume_line}" · similarity {Math.round(d.similarity * 100)}%
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
