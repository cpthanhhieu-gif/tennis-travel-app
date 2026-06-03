/**
 * Card — Vietravel Design System
 * Variants: default · elevated · outlined · ghost · filter · tint · sport
 * Sub-components: CardHeader · CardTitle · CardDescription · CardAction · CardContent · CardFooter
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined" | "ghost" | "filter" | "tint" | "sport";
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
    // Standard white card — border + shadow-card
    default:
      "bg-[var(--color-neutral-01)] rounded-[var(--radius-lg)] border border-[rgba(0,0,0,0.05)] shadow-[var(--shadow-card)] p-6",
    // Elevated — no border, stronger shadow
    elevated:
      "bg-[var(--color-neutral-01)] rounded-[var(--radius-lg)] shadow-[var(--shadow-elevated)] p-6",
    // Outlined — border only, no shadow
    outlined:
      "bg-[var(--color-neutral-01)] rounded-[var(--radius-lg)] border border-[var(--color-neutral-10)] p-6",
    // Ghost — transparent, no border, no shadow
    ghost:
      "bg-transparent rounded-[var(--radius-lg)] p-6",
    // Filter/List card (tour, hotel)
    filter:
      "bg-[var(--color-neutral-01)] rounded-[var(--radius-sm)] border border-[var(--color-neutral-05)] overflow-hidden",
    // Light brand-tint background card
    tint:
      "bg-[var(--color-brand-tint-light)] rounded-[var(--radius-lg)] border border-[var(--color-brand-tint)] p-6",
    // Dark sport card (gamification, achievement)
    sport:
      "bg-[var(--color-navy-800)] rounded-[var(--radius-lg)] border border-[var(--color-navy-700)] shadow-[var(--shadow-elevated)] p-6",
  };

  const interactive = onClick
    ? "cursor-pointer hover:shadow-[var(--shadow-floating)] hover:-translate-y-0.5 active:scale-[0.99] active:shadow-[var(--shadow-card)]"
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

// ── Sub-components ──────────────────────────────────────────

interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardSectionProps) {
  return (
    <div className={`flex flex-col gap-2 px-6 py-6 pb-0 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: CardSectionProps) {
  return (
    <h3 className={`text-base font-semibold leading-tight text-[var(--color-neutral-90)] ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "" }: CardSectionProps) {
  return (
    <p className={`text-sm text-[var(--color-neutral-40)] ${className}`}>
      {children}
    </p>
  );
}

export function CardAction({ children, className = "" }: CardSectionProps) {
  return (
    <div className={`ml-auto ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }: CardSectionProps) {
  return (
    <div className={`px-6 py-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "" }: CardSectionProps) {
  return (
    <div className={`flex items-center px-6 pb-6 ${className}`}>
      {children}
    </div>
  );
}
