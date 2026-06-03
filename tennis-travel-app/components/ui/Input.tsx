"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  error?: string;
  hint?: string;
  size?: "sm" | "default" | "lg";
}

export default function Input({
  label,
  error,
  hint,
  id,
  size = "default",
  className = "",
  disabled,
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(props.value || props.defaultValue);
  const isActive = focused || hasValue;

  const sizes = {
    sm:      "h-8  px-3 text-sm",
    default: "h-9  px-4 text-sm",
    lg:      "h-10 px-4 text-base",
  };

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className={`block text-xs mb-1 transition-colors duration-150 ${
          isActive
            ? "text-[var(--color-brand-light)] font-bold"
            : "text-[var(--color-neutral-30)] font-medium"
        }`}
      >
        {label}
        {props.required && (
          <span className="text-[var(--color-error)] ml-1" aria-hidden="true">*</span>
        )}
      </label>

      <input
        id={inputId}
        disabled={disabled}
        aria-required={props.required}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        aria-invalid={!!error}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        className={`w-full rounded-[var(--radius-md)] bg-[var(--color-neutral-03)] border-0 text-[var(--color-neutral-90)] placeholder:text-[var(--color-neutral-30)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 min-h-[44px] transition-shadow duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
          sizes[size]
        } ${
          error
            ? "ring-2 ring-[var(--color-error)]"
            : focused
            ? "ring-2 ring-[var(--color-brand-light)]"
            : "ring-0"
        } ${className}`}
        {...props}
      />

      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1 text-xs text-[var(--color-neutral-30)]">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-1 text-xs text-[var(--color-error)] flex items-center gap-1"
        >
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
