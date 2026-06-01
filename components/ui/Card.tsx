/**
 * Card — Vietravel Design System
 * Default: white bg, elevation-1 shadow, radius-md (8px)
 * Filter: border neutral-05, tighter radius
 * Sport (dark): legacy navy bg for gamification/share sections
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** White card with border + shadow (default) */
  variant?: "default" | "filter" | "sport" | "tint";
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  variant = "default",
  onClick,
}: CardProps) {
  const base = "transition-all duration-200";

  const variants: Record<string, string> = {
    // Standard white card
    default:
      "bg-neutral-01 rounded-[0.8rem] border border-[rgba(0,0,0,0.05)] shadow-[rgba(0,0,0,0.08)_0px_2px_8px] p-6",
    // Filter/List card (tour, hotel)
    filter:
      "bg-neutral-01 rounded-[0.5rem] border border-neutral-05 overflow-hidden",
    // Light brand-tint background card
    tint:
      "bg-brand-tint-light rounded-[0.8rem] border border-brand-tint p-6",
    // Dark sport card (gamification, achievement)
    sport:
      "bg-navy-800 rounded-[0.8rem] border border-navy-700 shadow-elevated p-6",
  };

  const interactive = onClick
    ? "cursor-pointer hover:shadow-[rgba(0,0,0,0.14)_0px_4px_16px] hover:-translate-y-0.5"
    : "";

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
        className={`${base} ${variants[variant]} ${interactive} ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
