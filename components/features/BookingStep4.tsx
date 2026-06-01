"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useBooking } from "@/lib/BookingContext";
import { tourPackages, tours, formatVND, formatVNDShort } from "@/lib/mock-data";
// destinations import removed — Step4 now reads from tours[]
import { Check } from "lucide-react";

interface Props { onConfirm: () => void }

const dateLabels: Record<string, string> = {
  "2026-06-13": "Thứ Sáu, 13/06/2026",
  "2026-06-20": "Thứ Sáu, 20/06/2026",
  "2026-07-04": "Thứ Bảy, 04/07/2026",
  "2026-07-11": "Thứ Bảy, 11/07/2026",
  "2026-07-18": "Thứ Bảy, 18/07/2026",
};

export default function BookingStep4({ onConfirm }: Props) {
  const { booking } = useBooking();
  const [loading, setLoading] = useState(false);

  const pkg  = tourPackages.find((p) => p.id === booking.packageId) ?? tourPackages[0];
  const tour = tours.find((t) => t.id === booking.tourId) ?? tours[0];
  const pricePerPerson = tour.departureSchedules.find((s) => s.code === booking.departureCode)?.price
    ?? pkg.priceRange.min;
  const total = pricePerPerson * booking.numPeople;

  const rows = [
    { label: "Tour", value: tour.name },
    { label: "Gói", value: pkg.name },
    { label: "Mã chuyến", value: booking.departureCode || tour.tourCode },
    { label: "Điểm đến", value: tour.destinationName },
    { label: "Ngày khởi hành", value: dateLabels[booking.departureDate] || booking.departureDate },
    { label: "Số người", value: `${booking.numPeople} người` },
    { label: "NTRP", value: booking.ntrpLabel ? `${booking.ntrpLevel} — ${booking.ntrpLabel}` : "Chưa đánh giá" },
    { label: "Liên hệ", value: booking.name || "Nguyễn Minh Khoa" },
    { label: "Điện thoại", value: booking.phone || "0901 234 567" },
    { label: "Email", value: booking.email || "minhkhoa@gmail.com" },
  ];

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    onConfirm();
  };

  return (
    <div>
      <h2 className="text-[2.2rem] font-bold text-neutral-90 mb-[2.4rem]">
        Xác nhận đặt tour
      </h2>

      {/* Summary card */}
      <div className="bg-neutral-01 rounded-[0.8rem] border border-neutral-10 shadow-[rgba(0,0,0,0.08)_0px_2px_8px] p-[2.4rem] mb-[2.4rem]">
        <h3 className="font-bold text-[1.6rem] text-brand-primary mb-[1.6rem]">
          Tóm tắt đặt chỗ
        </h3>
        <dl className="space-y-[1.2rem]">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-[1.6rem]">
              <dt className="text-neutral-40 text-[1.4rem] shrink-0">{label}</dt>
              <dd className="text-neutral-90 text-[1.4rem] font-semibold text-right">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Total */}
        <div className="border-t border-neutral-10 mt-[1.6rem] pt-[1.6rem]">
          <div className="flex justify-between items-baseline">
            <span className="text-neutral-50 font-semibold text-[1.6rem]">Tổng thanh toán</span>
            <span className="text-[2.6rem] font-extrabold text-brand-secondary">
              {formatVNDShort(total)}
            </span>
          </div>
          <p className="text-neutral-30 text-[1.2rem] mt-[0.4rem] text-right">
            {formatVND(pkg.priceRange.min)} × {booking.numPeople} người
          </p>
        </div>
      </div>

      {/* Guarantees */}
      <div className="bg-success-light border border-success/30 rounded-[0.8rem] p-[1.6rem] mb-[2.4rem]">
        <ul className="space-y-[0.8rem]">
          {[
            "Xác nhận qua email trong 24 giờ",
            "Hoàn tiền 100% nếu hủy trước 7 ngày",
            "Hỗ trợ 24/7 trong suốt hành trình",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-[0.8rem] text-[1.4rem] text-success"
            >
              <Check size={14} className="shrink-0 text-success" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleConfirm}
        loading={loading}
      >
        {loading ? "Đang xử lý..." : "Xác nhận đặt tour"}
      </Button>
    </div>
  );
}
