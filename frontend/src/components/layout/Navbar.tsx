import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-hairline">
      <Link to="/" className="no-underline">
        <span className="font-display text-lg font-semibold text-paper">
          Resume<span className="text-signal">Scan</span>
        </span>
      </Link>
      <div className="font-mono flex gap-6 text-sm text-mute">
        <Link to="/upload" className="hover:text-paper transition-colors">upload</Link>
        <Link to="/dashboard" className="hover:text-paper transition-colors">dashboard</Link>
        <Link to="/chat" className="hover:text-paper transition-colors">chat</Link>
      </div>
    </nav>
  );
}
