"use client";

import { useEffect, useState } from "react";

/**
 * Toast — Vietravel Design System
 * z-[400] · fade-up animation · bottom-centered
 */
interface ToastProps {
  message: string;
  xp?: number;
  visible: boolean;
  onHide: () => void;
  type?: "success" | "info" | "xp";
}

export default function Toast({
  message,
  xp,
  visible,
  onHide,
  type = "success",
}: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const t = setTimeout(() => {
        setShow(false);
        setTimeout(onHide, 300);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [visible, onHide]);

  const accent =
    type === "xp"
      ? "text-[var(--color-brand-primary)]"
      : type === "success"
      ? "text-[var(--color-success)]"
      : "text-[var(--color-brand-light)]";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-[var(--toast-bottom-offset)] left-1/2 -translate-x-1/2 z-[var(--z-toast)] transition-all duration-[var(--duration-slow)] ease-in-out ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="bg-[var(--color-neutral-01)] rounded-[var(--radius-full)] px-5 py-3 shadow-[var(--shadow-dialog)] flex items-center gap-2 text-sm font-semibold whitespace-nowrap border border-[var(--color-neutral-05)]">
        {xp !== undefined && (
          <span className={`font-extrabold ${accent}`}>+{xp} XP</span>
        )}
        <span className="text-[var(--color-neutral-90)]">{message}</span>
      </div>
    </div>
  );
}
