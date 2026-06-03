"use client";

/**
 * ProgressBar — Vietravel Design System
 * Track: --color-neutral-03 · Fill: brand/success/gold gradient
 * Gold: linear-gradient via --gradient-gold-bar
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
    primary: "bg-[var(--color-brand-primary)]",
    light:   "bg-[var(--color-brand-light)]",
    success: "bg-[var(--color-success)]",
    gold:    "",
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between text-xs mb-1">
          {label && <span className="text-[var(--color-neutral-40)]">{label}</span>}
          {showPercent && <span className="text-[var(--color-neutral-40)]">{pct}%</span>}
        </div>
      )}
      <div
        className="h-[var(--progress-bar-height)] bg-[var(--color-neutral-03)] rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={`h-full rounded-full ${fills[color] ?? fills.primary} ${
            animate ? "transition-all duration-[var(--duration-expressive)] ease-out" : ""
          }`}
          style={{
            width: `${pct}%`,
            ...(color === "gold" && { background: "var(--gradient-gold-bar)" }),
          }}
        />
      </div>
    </div>
  );
}
