/**
 * Badge / Tag — Vietravel Design System
 * Base: border-radius 20px, padding 4px 12px, font-size 1.2rem, font-weight 800
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
  Bronze: "bg-[#FFE0C0] text-[#7A3800]",
  Silver: "bg-[#E8E8E8] text-[#3D3D3D]",
  Gold:   "bg-[#FFF3CC] text-[#7A5C00]",
  Diamond:"bg-purple-light text-purple",
};

export default function Badge({
  variant = "brand",
  tier,
  children,
  className = "",
  pulse = false,
}: BadgeProps) {
  const base =
    "inline-flex items-center gap-1 rounded-[20px] px-[1.2rem] py-[4px] text-[1.2rem] font-extrabold leading-none whitespace-nowrap";

  const variants: Record<string, string> = {
    brand:      "bg-brand-tint text-brand-primary",
    "hot-deal": "bg-neutral-01 text-error-dark border border-error-light",
    error:      "bg-error-light text-error-dark",
    success:    "bg-success-light text-success",
    yellow:     "bg-yellow-light text-yellow-dark",
    purple:     "bg-purple-light text-purple",
    // Sport / gamification
    live:       "bg-error text-neutral-01",
    tier:       tier ? tierStyles[tier] : "bg-neutral-03 text-neutral-50",
    xp:         "bg-brand-tint text-brand-primary",
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
