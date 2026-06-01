"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** On mobile: slides up as a Bottom Sheet */
  bottomSheet?: boolean;
}

/**
 * Modal / Bottom Sheet — Vietravel Design System
 * Desktop: centered dialog, white bg, radius-md
 * Mobile with bottomSheet=true: slides up from bottom, radius 1.6rem 1.6rem 0 0
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  bottomSheet = true,
}: ModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        bottomSheet ? "items-end md:items-center" : "items-center"
      } justify-center ${bottomSheet ? "p-0 md:p-4" : "p-4"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.4)]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative z-10 w-full bg-neutral-01 shadow-[rgba(0,0,0,0.2)_0px_0px_10px] ${
          bottomSheet
            ? "rounded-[1.6rem_1.6rem_0_0] max-h-[90dvh] overflow-y-auto p-6 md:rounded-[0.8rem] md:max-w-md"
            : "rounded-[0.8rem] max-w-md p-6"
        }`}
      >
        {/* Handle bar (mobile bottom sheet only) */}
        {bottomSheet && (
          <div className="handle-bar md:hidden" aria-hidden="true" />
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-[1.6rem]">
          {title && (
            <h2
              id="modal-title"
              className="text-[2.4rem] font-bold text-neutral-90 pr-4 leading-tight"
            >
              {title}
            </h2>
          )}
          <button
            ref={closeRef}
            onClick={onClose}
            className="ml-auto p-[0.8rem] rounded-full text-neutral-40 hover:text-neutral-90 hover:bg-neutral-03 focus:outline-none focus:ring-2 focus:ring-brand-primary min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
            aria-label="Đóng"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
