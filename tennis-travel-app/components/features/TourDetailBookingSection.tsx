"use client";

import { useState } from "react";
import { type LEIESGTour, tours, formatVNDShort } from "@/lib/mock-data";
import Button from "@/components/ui/Button";
import LeiBookingSheet from "@/components/features/LeiBookingSheet";
import { Clock, MapPin, Users } from "lucide-react";

interface Props {
  tour: LEIESGTour;
}

export default function TourDetailBookingSection({ tour }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const matchedTour = tours.find((t) => t.id === tour.bookingTourId);
  const firstSchedule = matchedTour?.departureSchedules[0];

  return (
    <>
      <div className="mt-2 px-4 pb-8">
        {/* Summary card */}
        {matchedTour && firstSchedule && (
          <div className="mb-3 rounded-xl bg-neutral-03 border border-neutral-05 p-4">
            <p className="text-xs font-semibold text-neutral-40 uppercase tracking-wide mb-3">
              Thông tin đặt tour
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-neutral-30 shrink-0" aria-hidden="true" />
                <span className="text-sm text-neutral-50">{matchedTour.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-neutral-30 shrink-0" aria-hidden="true" />
                <span className="text-sm text-neutral-50">{matchedTour.resort}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={13} className="text-neutral-30 shrink-0" aria-hidden="true" />
                <span className="text-sm text-neutral-50">{matchedTour.ntrpLabel}</span>
              </div>
            </div>
            <div className="flex items-end justify-between pt-2 border-t border-neutral-10">
              <div>
                <p className="text-xs text-neutral-40">Giá từ</p>
                <p className="text-lg font-extrabold text-brand-secondary leading-tight">
                  {formatVNDShort(firstSchedule.price)}
                  <span className="text-xs font-normal text-neutral-40 ml-1">/người</span>
                </p>
              </div>
              <p className="text-xs text-neutral-30">
                Khởi hành sớm nhất: {firstSchedule.dateLabel}
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => setSheetOpen(true)}
          className="w-full min-h-[52px] rounded-full bg-brand-primary text-neutral-01 text-base font-semibold shadow-card transition-all duration-150 ease-out active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
          aria-label={`Đặt tour ${tour.name}`}
        >
          Đặt tour ngay
        </button>
        <p className="text-xs text-neutral-30 text-center mt-2">
          Hoàn tiền 100% nếu hủy trước 7 ngày
        </p>
      </div>

      <LeiBookingSheet
        tour={tour}
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
