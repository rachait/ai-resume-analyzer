import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="px-8 py-20 max-w-3xl mx-auto">
      <div className="font-mono text-xs tracking-widest text-mute mb-4">
        RESUME / ATS CALIBRATION
      </div>
      <h1 className="text-5xl leading-tight text-paper mb-5">
        Find out what the filter sees<br />before the recruiter does.
      </h1>
      <p className="text-base text-mute max-w-md leading-relaxed">
        Upload a resume and a job description. Get a calibrated match score,
        the exact keywords you're missing, and what to fix — in under a minute.
      </p>
      <Link
        to="/upload"
        className="inline-block mt-8 px-6 py-3 bg-paper text-ink-950 rounded-sm text-sm font-medium hover:bg-paper-dim transition-colors"
      >
        Scan a resume →
      </Link>
    </section>
  );
}
