/**
 * Badge / Tag — Vietravel Design System
 * Shape: rounded-full · Size: text-xs · Weight: extrabold
 */
interface BadgeProps {
  variant?:
    | "brand"
    | "hot-deal"
    | "error"
    | "success"
    | "yellow"
    | "purple"
    | "live"
    | "tier"
    | "xp";
  tier?: "Bronze" | "Silver" | "Gold" | "Diamond";
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
}

const tierStyles: Record<string, string> = {
  Bronze:  "bg-[var(--color-tier-bronze-bg)]  text-[var(--color-tier-bronze-text)]",
  Silver:  "bg-[var(--color-tier-silver-bg)]  text-[var(--color-tier-silver-text)]",
  Gold:    "bg-[var(--color-tier-gold-bg)]    text-[var(--color-tier-gold-text)]",
  Diamond: "bg-[var(--color-purple-light)]     text-[var(--color-purple)]",
};

export default function Badge({
  variant = "brand",
  tier,
  children,
  className = "",
  pulse = false,
}: BadgeProps) {
  const base =
    "inline-flex items-center gap-1 rounded-[var(--radius-full)] px-3 py-0.5 text-xs font-extrabold leading-none whitespace-nowrap";

  const variants: Record<string, string> = {
    brand:      "bg-[var(--color-brand-tint)]    text-[var(--color-brand-primary)]",
    "hot-deal": "bg-[var(--color-neutral-01)]    text-[var(--color-error-dark)] border border-[var(--color-error-light)]",
    error:      "bg-[var(--color-error-light)]   text-[var(--color-error-dark)]",
    success:    "bg-[var(--color-success-light)]  text-[var(--color-success)]",
    yellow:     "bg-[var(--color-yellow-light)]   text-[var(--color-yellow-dark)]",
    purple:     "bg-[var(--color-purple-light)]   text-[var(--color-purple)]",
    live:       "bg-[var(--color-error)]          text-[var(--color-neutral-01)]",
    tier:       tier ? tierStyles[tier] : "bg-[var(--color-neutral-03)] text-[var(--color-neutral-50)]",
    xp:         "bg-[var(--color-brand-tint)]    text-[var(--color-brand-primary)]",
  };

  return (
    <span
      className={`${base} ${variants[variant] ?? variants.brand} ${pulse ? "animate-pulse" : ""} ${className}`}
      aria-label={variant === "live" ? "Đang diễn ra trực tiếp" : undefined}
    >
      {children}
    </span>
  );
}
