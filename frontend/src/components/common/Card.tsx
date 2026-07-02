import { ReactNode } from "react";

export default function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border border-hairline rounded-sm p-5 bg-ink-900 ${className}`}>
      {children}
    </div>
  );
}
