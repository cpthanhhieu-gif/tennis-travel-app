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
 * Desktop: centered dialog · z-[300] · fade + scale animation
 * Mobile bottomSheet=true: slides up from bottom
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
      className={`fixed inset-0 z-[var(--z-modal)] flex ${
        bottomSheet ? "items-end md:items-center" : "items-center"
      } justify-center ${bottomSheet ? "p-0 md:p-4" : "p-4"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--color-backdrop)]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative z-10 w-full bg-[var(--color-neutral-01)] shadow-[var(--shadow-dialog)] transition-all duration-[var(--duration-slow)] ease-in-out ${
          bottomSheet
            ? "rounded-[var(--radius-bottom-sheet)] max-h-[90dvh] overflow-y-auto p-6 md:rounded-[var(--radius-md)] md:max-w-md"
            : "rounded-[var(--radius-md)] max-w-md p-6"
        }`}
      >
        {/* Handle bar (mobile bottom sheet only) */}
        {bottomSheet && (
          <div className="handle-bar md:hidden" aria-hidden="true" />
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          {title && (
            <h2
              id="modal-title"
              className="text-2xl font-bold text-[var(--color-neutral-90)] pr-4 leading-tight"
            >
              {title}
            </h2>
          )}
          <button
            ref={closeRef}
            onClick={onClose}
            className="ml-auto p-2 rounded-full text-[var(--color-neutral-40)] hover:text-[var(--color-neutral-90)] hover:bg-[var(--color-neutral-03)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors duration-[var(--duration-fast)]"
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
