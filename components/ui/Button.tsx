"use client";

import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "confirm" | "secondary" | "outline-danger" | "ghost" | "ghost-danger" | "neutral";
  size?: "sm" | "md" | "lg";
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
      "inline-flex items-center justify-center gap-2 font-semibold rounded-[4rem] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] min-w-[44px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none";

    const variants: Record<string, string> = {
      // Primary Blue — CTA chính
      primary:
        "bg-brand-primary text-neutral-01 hover:bg-brand-primary-dark focus:ring-brand-primary",
      // Confirm Blue (xác nhận, đã chọn)
      confirm:
        "bg-brand-light text-neutral-01 hover:opacity-90 focus:ring-brand-light",
      // Secondary Red (CTA thứ 2, giá)
      secondary:
        "bg-brand-secondary text-neutral-01 hover:opacity-90 focus:ring-brand-secondary",
      // Outline Danger
      "outline-danger":
        "border border-brand-secondary text-brand-secondary bg-transparent hover:bg-error-light focus:ring-brand-secondary",
      // Ghost Primary (text only)
      ghost:
        "text-brand-primary bg-transparent hover:bg-brand-tint focus:ring-brand-primary",
      // Ghost Danger
      "ghost-danger":
        "text-brand-secondary bg-transparent hover:bg-error-light focus:ring-brand-secondary",
      // Neutral (cancel, mute)
      neutral:
        "bg-neutral-03 text-neutral-40 hover:bg-neutral-05 focus:ring-neutral-10",
    };

    const sizes: Record<string, string> = {
      sm: "px-[1.0rem] py-[0.8rem] text-[1.2rem]",
      md: "px-[1.6rem] py-[1.2rem] text-[1.4rem]",
      lg: "px-[2.4rem] py-[1.4rem] text-[1.6rem]",
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
