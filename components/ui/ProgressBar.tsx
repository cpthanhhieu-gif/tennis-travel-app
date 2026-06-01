"use client";

/**
 * ProgressBar — Vietravel Design System
 * Track: neutral-03 (#F7F7F7) or semi-transparent
 * Fill: brand-primary / brand-light / success
 */
interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercent?: boolean;
  color?: "primary" | "light" | "success" | "gold";
  animate?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  max,
  label,
  showPercent = false,
  color = "primary",
  animate = true,
  className = "",
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));

  const fills: Record<string, string> = {
    primary: "bg-brand-primary",
    light:   "bg-brand-light",
    success: "bg-success",
    gold:    "bg-gold-500",
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between text-[1.2rem] mb-[0.4rem]">
          {label && <span className="text-neutral-40">{label}</span>}
          {showPercent && <span className="text-neutral-40">{pct}%</span>}
        </div>
      )}
      <div
        className="h-[0.8rem] bg-neutral-03 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={`h-full rounded-full ${fills[color] ?? fills.primary} ${
            animate ? "transition-all duration-1000 ease-out" : ""
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
