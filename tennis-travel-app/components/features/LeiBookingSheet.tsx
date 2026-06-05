"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, MapPin, Clock, Hash } from "lucide-react";
import { type LEIESGTour, tours, formatVNDShort } from "@/lib/mock-data";
import Button from "@/components/ui/Button";

interface Props {
  tour: LEIESGTour;
  isOpen: boolean;
  onClose: () => void;
  showLeiBreakdown?: boolean;
}

export default function LeiBookingSheet({ tour, isOpen, onClose, showLeiBreakdown = false }: Props) {
  const [numPeople, setNumPeople] = useState(2);
  const router = useRouter();

  const matchedTour = tours.find((t) => t.id === tour.bookingTourId);
  const firstSchedule = matchedTour?.departureSchedules[0];

  if (!isOpen) return null;

  const totalPrice = firstSchedule ? firstSchedule.price * numPeople : 0;

  const handleConfirm = () => {
    if (!matchedTour || !firstSchedule) return;
    const params = new URLSearchParams({
      startStep: "2",
      tourId: matchedTour.id,
      leiTourId: tour.id,
      numPeople: String(numPeople),
      departureCode: firstSchedule.code,
    });
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-90/40 z-[300]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[300] bg-neutral-01 rounded-t-2xl shadow-elevated"
        role="dialog"
        aria-modal="true"
        aria-label="Chọn số người tham gia"
      >
        {/* Handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-neutral-10" aria-hidden="true" />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-3 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-neutral-05 hover:bg-neutral-10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
        >
          <X size={14} className="text-neutral-50" aria-hidden="true" />
        </button>

        <div className="px-4 pb-8 pt-2">

          {/* Tour info card */}
          <div className="mb-4 p-3 rounded-xl bg-neutral-03 border border-neutral-05">
            <div className="flex items-start gap-3">

              {/* LEI score block */}
              <div className="shrink-0 flex flex-col items-center justify-center gap-0.5 bg-neutral-90 rounded-xl px-3 py-2.5 min-w-[52px]">
                <span className="text-[10px] font-semibold text-neutral-01/50 uppercase tracking-wide">LEI</span>
                <span className="text-2xl font-extrabold text-yellow-accent leading-none">{tour.lei.total}</span>
                <span className="text-[10px] text-neutral-01/40">/100</span>
              </div>

              {/* Tour details */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-neutral-90 leading-snug mb-1.5">{tour.name}</p>
                <div className="flex items-center gap-1 mb-1">
                  <MapPin size={11} className="text-neutral-30 shrink-0" aria-hidden="true" />
                  <span className="text-xs text-neutral-40">{tour.location}</span>
                </div>
                {matchedTour && (
                  <div className="flex items-center gap-1">
                    <Clock size={11} className="text-neutral-30 shrink-0" aria-hidden="true" />
                    <span className="text-xs text-neutral-40">{matchedTour.duration}</span>
                  </div>
                )}
                {/* LEI badge label */}
                <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full bg-brand-tint text-brand-primary text-[10px] font-semibold">
                  ⭐ {tour.lei.badge}
                </span>
              </div>
            </div>
          </div>

          {/* LEI breakdown */}
          {showLeiBreakdown && (
            <div className="mb-4 rounded-xl border border-neutral-05 bg-neutral-03 px-3 py-3">
              <p className="text-[10px] font-semibold text-neutral-40 uppercase tracking-wide mb-2.5">
                Chỉ số LEI chi tiết
              </p>
              <div className="flex flex-col gap-2">
                {([
                  { label: "Sân tennis địa phương", value: tour.lei.breakdown.localCourt },
                  { label: "HLV / Partner bản địa",  value: tour.lei.breakdown.localPro },
                  { label: "Ẩm thực & văn hóa",      value: tour.lei.breakdown.localCulture },
                  { label: "Di chuyển bản địa",       value: tour.lei.breakdown.localTransport },
                ] as { label: string; value: number }[]).map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-neutral-50">{label}</span>
                      <span className="text-xs font-bold text-brand-primary">{value}</span>
                    </div>
                    <div className="h-1 rounded-full bg-neutral-10 overflow-hidden">
                      <div
                        className="h-full bg-brand-primary rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Departure info */}
          {firstSchedule && (
            <div className="mb-4 rounded-lg bg-brand-tint border border-brand-light/30 px-3 py-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Hash size={12} className="text-brand-primary shrink-0" aria-hidden="true" />
                <span className="text-xs font-mono text-neutral-50 truncate">{firstSchedule.code}</span>
              </div>
              <span className="text-xs text-neutral-40 shrink-0">
                {firstSchedule.dateLabel} · {firstSchedule.dayOfWeek}
              </span>
            </div>
          )}

          {/* People picker */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-neutral-90 mb-3">Số người tham gia</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setNumPeople((n) => Math.max(1, n - 1))}
                disabled={numPeople <= 1}
                aria-label="Giảm số người"
                className="w-11 h-11 rounded-full border border-neutral-10 flex items-center justify-center text-neutral-50 hover:border-brand-primary hover:text-brand-primary transition-all duration-150 ease-out disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              >
                <Minus size={16} aria-hidden="true" />
              </button>

              <span
                className="text-2xl font-bold text-neutral-90 w-8 text-center"
                aria-live="polite"
                aria-label={`${numPeople} người`}
              >
                {numPeople}
              </span>

              <button
                onClick={() => setNumPeople((n) => Math.min(20, n + 1))}
                disabled={numPeople >= 20}
                aria-label="Tăng số người"
                className="w-11 h-11 rounded-full border border-neutral-10 flex items-center justify-center text-neutral-50 hover:border-brand-primary hover:text-brand-primary transition-all duration-150 ease-out disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              >
                <Plus size={16} aria-hidden="true" />
              </button>

              {/* Total price */}
              <div className="ml-auto text-right">
                <p className="text-xs text-neutral-40">Tổng từ</p>
                <p className="text-lg font-extrabold text-brand-secondary leading-tight">
                  {firstSchedule ? formatVNDShort(totalPrice) : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleConfirm}
          >
            Tiếp tục — Khám phá trình độ
          </Button>
        </div>
      </div>
    </>
  );
}
