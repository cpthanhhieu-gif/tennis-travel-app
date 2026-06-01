/**
 * Input — Vietravel Design System
 * Background: #F7F7F7 (neutral-03), no border
 * Label empty: color #999999 / weight 500
 * Label filled: color #0391FF (brand-light) / weight 700
 * Error: red outline + message
 */
"use client";

import { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export default function Input({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(props.value || props.defaultValue);
  const isActive = focused || hasValue;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className={`block text-[1.2rem] mb-[0.4rem] transition-colors duration-150 ${
          isActive
            ? "text-brand-light font-bold"
            : "text-neutral-30 font-medium"
        }`}
      >
        {label}
        {props.required && (
          <span className="text-error ml-1" aria-hidden="true">*</span>
        )}
      </label>
      <input
        id={inputId}
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
        className={`w-full px-[1.6rem] py-[1.2rem] rounded-[0.8rem] bg-neutral-03 border-0 text-[1.6rem] text-neutral-90 placeholder-neutral-30 focus:outline-none focus:ring-2 min-h-[44px] transition-shadow duration-150 ${
          error
            ? "ring-2 ring-error"
            : focused
            ? "ring-2 ring-brand-light"
            : "ring-0"
        } ${className}`}
        {...props}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-[0.4rem] text-[1.2rem] text-neutral-30">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-[0.4rem] text-[1.2rem] text-error flex items-center gap-1"
        >
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}
