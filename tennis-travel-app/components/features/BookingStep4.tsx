"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useBooking } from "@/lib/BookingContext";
import { tourPackages, tours, promoCoupons, formatVND, formatVNDShort, type PromoCoupon } from "@/lib/mock-data";
import { Check, Tag, X } from "lucide-react";

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
  const [promoInput, setPromoInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<PromoCoupon | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const pkg  = tourPackages.find((p) => p.id === booking.packageId) ?? tourPackages[0];
  const tour = tours.find((t) => t.id === booking.tourId) ?? tours[0];
  const pricePerPerson = tour.departureSchedules.find((s) => s.code === booking.departureCode)?.price
    ?? pkg.priceRange.min;
  const total = pricePerPerson * booking.numPeople;

  const discount = appliedCoupon
    ? appliedCoupon.discountType === "percent"
      ? Math.round(total * appliedCoupon.discountValue / 100)
      : appliedCoupon.discountType === "fixed"
        ? appliedCoupon.discountValue
        : 0
    : 0;
  const finalTotal = total - discount;

  function handleApplyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (!code) { setPromoError("Vui lòng nhập mã ưu đãi."); return; }
    const found = promoCoupons.find((c) => c.code === code);
    if (!found) { setPromoError("Mã không hợp lệ hoặc đã hết hạn."); return; }
    setAppliedCoupon(found);
    setPromoError(null);
    setPromoInput("");
  }

  function handleRemovePromo() {
    setAppliedCoupon(null);
    setPromoError(null);
  }

  const rows = [
    { label: "Hành trình",     value: tour.name },
    { label: "Gói",            value: pkg.name },
    { label: "Mã chuyến",      value: booking.departureCode || tour.tourCode },
    { label: "Điểm đến",       value: tour.destinationName },
    { label: "Ngày khởi hành", value: dateLabels[booking.departureDate] || booking.departureDate },
    { label: "Số người",       value: `${booking.numPeople} người` },
    { label: "NTRP",           value: booking.ntrpLabel ? `${booking.ntrpLevel} — ${booking.ntrpLabel}` : "Chưa đánh giá" },
    { label: "Liên hệ",        value: booking.name  || "Nguyễn Minh Khoa" },
    { label: "Điện thoại",     value: booking.phone || "0901 234 567" },
    { label: "Email",          value: booking.email || "minhkhoa@gmail.com" },
  ];

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    onConfirm();
  };

  return (
    <div>
      <h2 className="text-[2.2rem] font-bold text-neutral-90 mb-6">
        Xác nhận hành trình của bạn
      </h2>

      {/* Summary card */}
      <div className="bg-neutral-01 rounded-md border border-neutral-10 shadow-card p-6 mb-6">
        <h3 className="font-bold text-[1.6rem] text-brand-primary mb-4">
          Tóm tắt hành trình
        </h3>
        <dl className="space-y-3">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-neutral-40 text-[1.4rem] shrink-0">{label}</dt>
              <dd className="text-neutral-90 text-[1.4rem] font-semibold text-right">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Promo code */}
        <div className="border-t border-neutral-10 mt-4 pt-4">
          <p className="text-neutral-50 font-semibold text-[1.4rem] mb-2 flex items-center gap-1.5">
            <Tag size={14} aria-hidden /> Mã ưu đãi
          </p>
          {appliedCoupon ? (
            <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-brand-tint border border-brand-light/30 rounded-lg">
              <div className="flex items-center gap-2 min-w-0">
                <Check size={14} className="text-brand-light shrink-0" aria-hidden />
                <span className="font-mono text-sm font-bold text-brand-primary tracking-wider">{appliedCoupon.code}</span>
                <span className="text-brand-primary text-xs truncate">— {appliedCoupon.title}</span>
              </div>
              <button
                onClick={handleRemovePromo}
                className="shrink-0 text-neutral-30 hover:text-neutral-50 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-brand-primary rounded p-0.5 min-h-11 min-w-11 flex items-center justify-center"
                aria-label="Xoá mã ưu đãi"
              >
                <X size={14} aria-hidden />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                placeholder="Nhập mã ưu đãi..."
                className="flex-1 px-3 py-2 border border-neutral-10 rounded-lg text-sm font-mono font-semibold text-neutral-90 placeholder:text-neutral-30 focus:outline-none focus:ring-2 focus:ring-brand-primary bg-neutral-01 min-h-11 tracking-wider uppercase"
                aria-label="Mã ưu đãi"
              />
              <button
                onClick={handleApplyPromo}
                className="shrink-0 px-4 py-2 bg-brand-primary text-neutral-01 text-sm font-bold rounded-lg hover:bg-brand-primary-dark transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-11"
              >
                Áp dụng
              </button>
            </div>
          )}
          {promoError && (
            <p className="text-error text-xs mt-1.5 flex items-center gap-1" role="alert">
              {promoError}
            </p>
          )}
        </div>

        {/* Total */}
        <div className="border-t border-neutral-10 mt-4 pt-4">
          {discount > 0 && (
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-neutral-40 text-[1.4rem]">Giá gốc</span>
              <span className="text-neutral-40 text-[1.4rem] line-through">{formatVNDShort(total)}</span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-brand-light text-[1.4rem] font-semibold">Giảm giá</span>
              <span className="text-brand-light text-[1.4rem] font-bold">−{formatVNDShort(discount)}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline">
            <span className="text-neutral-50 font-semibold text-[1.6rem]">Tổng thanh toán</span>
            <span className="text-[2.6rem] font-extrabold text-brand-primary">
              {formatVNDShort(discount > 0 ? finalTotal : total)}
            </span>
          </div>
          <p className="text-neutral-30 text-[1.2rem] mt-1 text-right">
            {formatVND(pricePerPerson)} × {booking.numPeople} người
          </p>
        </div>
      </div>

      {/* Guarantees */}
      <div className="bg-success-light border border-success/30 rounded-md p-4 mb-6">
        <ul className="space-y-2">
          {[
            "Xác nhận qua email trong 24 giờ",
            "Hoàn tiền 100% nếu hủy trước 7 ngày",
            "Hỗ trợ 24/7 trong suốt hành trình",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-[1.4rem] text-success">
              <Check size={14} className="shrink-0 text-success" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <Button variant="primary" size="lg" className="w-full" onClick={handleConfirm} loading={loading}>
        {loading ? "Đang xử lý..." : "Xác nhận hành trình của tôi"}
      </Button>
    </div>
  );
}
