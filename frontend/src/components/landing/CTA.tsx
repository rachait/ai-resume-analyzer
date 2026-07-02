import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="px-8 py-16 max-w-3xl mx-auto text-center border-t border-hairline">
      <h2 className="text-3xl mb-4 text-paper">Ready to see your score?</h2>
      <Link
        to="/upload"
        className="inline-block px-6 py-3 bg-signal text-ink-950 rounded-sm text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Scan a resume →
      </Link>
    </section>
  );
}
