"use client";

import { useEffect, useState } from "react";

/**
 * Toast — Vietravel Design System
 * Floating pill, bottom-centered, white bg with shadow-dialog
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
      ? "text-brand-primary"
      : type === "success"
      ? "text-success"
      : "text-brand-light";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-[8rem] left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="bg-neutral-01 rounded-[4rem] px-[2rem] py-[1.2rem] shadow-[rgba(0,0,0,0.2)_0px_0px_10px] flex items-center gap-[0.8rem] text-[1.4rem] font-semibold whitespace-nowrap border border-neutral-05">
        {xp !== undefined && (
          <span className={`font-extrabold ${accent}`}>+{xp} XP</span>
        )}
        <span className="text-neutral-90">{message}</span>
      </div>
    </div>
  );
}
