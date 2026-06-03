"use client";

import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive" | "confirm" | "outline-danger" | "ghost-danger" | "neutral";
  size?: "xs" | "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * Button — Vietravel Design System
 * Shape: pill (border-radius: 4rem)
 * Size base: padding 1.2rem, font 1.4rem / 600
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-full)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] min-w-[44px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer select-none";

    const variants: Record<string, string> = {
      // Primary Blue — CTA chính
      primary:
        "bg-[var(--color-brand-primary)] text-[var(--color-neutral-01)] hover:bg-[var(--color-brand-primary-dark)] focus:ring-[var(--color-brand-primary)]",
      // Secondary — CTA thứ 2
      secondary:
        "bg-[var(--color-brand-primary)] text-[var(--color-neutral-01)] hover:bg-[var(--color-brand-primary-dark)] focus:ring-[var(--color-brand-primary)]",
      // Outline — viền xanh, nền trong
      outline:
        "border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] bg-transparent hover:bg-[var(--color-brand-tint)] focus:ring-[var(--color-brand-primary)]",
      // Ghost — text only
      ghost:
        "text-[var(--color-brand-primary)] bg-transparent hover:bg-[var(--color-brand-tint)] focus:ring-[var(--color-brand-primary)]",
      // Link — text với underline
      link:
        "text-[var(--color-brand-primary)] bg-transparent underline-offset-4 hover:underline focus:ring-[var(--color-brand-primary)] px-0",
      // Destructive — nguy hiểm
      destructive:
        "bg-[var(--color-error)] text-[var(--color-neutral-01)] hover:bg-[var(--color-error-dark)] focus:ring-[var(--color-error)]",
      // Confirm Blue — xác nhận, đã chọn (giữ cho app)
      confirm:
        "bg-[var(--color-brand-light)] text-[var(--color-neutral-01)] hover:opacity-90 focus:ring-[var(--color-brand-light)]",
      // Outline Danger (giữ cho app)
      "outline-danger":
        "border border-[var(--color-brand-secondary)] text-[var(--color-brand-secondary)] bg-transparent hover:bg-[var(--color-error-light)] focus:ring-[var(--color-brand-secondary)]",
      // Ghost Danger (giữ cho app)
      "ghost-danger":
        "text-[var(--color-brand-secondary)] bg-transparent hover:bg-[var(--color-error-light)] focus:ring-[var(--color-brand-secondary)]",
      // Neutral — cancel, mute
      neutral:
        "bg-[var(--color-neutral-03)] text-[var(--color-neutral-40)] hover:bg-[var(--color-neutral-05)] focus:ring-[var(--color-neutral-10)]",
    };

    const sizes: Record<string, string> = {
      xs: "h-7 px-3 text-xs gap-1",
      sm: "h-8 px-3 text-sm gap-1.5",
      md: "h-9 px-4 text-sm gap-2",
      lg: "h-10 px-6 text-base gap-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={`${base} ${variants[variant] ?? variants.primary} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
