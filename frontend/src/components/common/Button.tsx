import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base = "px-6 py-3 rounded-sm text-sm font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-paper text-ink-950 hover:bg-paper-dim"
      : "border border-hairline text-paper hover:bg-ink-900";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
