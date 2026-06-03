"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, Copy, Check, Info, X, Clock } from "lucide-react";
import { promoCoupons, type PromoCat, type PromoCoupon } from "@/lib/mock-data";

const TABS: { key: PromoCat; label: string }[] = [
  { key: "tour",   label: "Tour" },
  { key: "resort", label: "Resort" },
  { key: "fei",    label: "Ẩm thực FEI" },
  { key: "member", label: "Thành viên" },
];

const BADGE_STYLE: Record<string, string> = {
  "Sắp hết mã": "bg-warning-light text-warning",
  "Mới":        "bg-brand-tint text-brand-primary",
  "Độc quyền":  "bg-purple-light text-purple",
};

export default function PromoSection() {
  const [activeTab, setActiveTab] = useState<PromoCat>("tour");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<PromoCoupon | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = promoCoupons.filter((c) => c.category === activeTab);

  function handleCopy(id: string, code: string) {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedId(id);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopiedId(null), 2000);
  }

  // Khoá scroll body khi sheet mở
  useEffect(() => {
    if (selectedCoupon) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedCoupon]);

  return (
    <>
      <section className="pt-8 pb-2" aria-labelledby="promo-title">
        {/* Header */}
        <div className="px-4 flex items-center justify-between mb-4">
          <h2 id="promo-title" className="text-xl font-bold text-neutral-90">
            Ưu đãi mã giảm giá
          </h2>
          <button
            className="flex items-center gap-1 text-brand-primary text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary rounded min-h-11 px-1"
            aria-label="Xem tất cả ưu đãi"
          >
            Tất cả <ArrowRight size={14} aria-hidden />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-2 px-4 mb-4 overflow-x-auto scrollbar-hide"
          role="tablist"
          aria-label="Danh mục ưu đãi"
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-11 ${
                activeTab === tab.key
                  ? "bg-brand-primary text-neutral-01 shadow-sm"
                  : "bg-neutral-03 text-neutral-50 hover:bg-neutral-05"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cards horizontal scroll */}
        <div
          className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-2"
          role="tabpanel"
          aria-labelledby="promo-title"
        >
          {filtered.map((coupon) => (
            <article
              key={coupon.id}
              className="shrink-0 w-[260px] bg-neutral-01 border border-neutral-10 rounded-xl shadow-card flex flex-col"
            >
              {/* Top */}
              <div className="p-4 flex-1">
                {coupon.badge && (
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold mb-2 ${BADGE_STYLE[coupon.badge]}`}>
                    {coupon.badge}
                  </span>
                )}
                <div className="flex items-start gap-1">
                  <p className="text-sm font-semibold text-neutral-90 leading-snug line-clamp-1 flex-1">
                    {coupon.title}
                  </p>
                  <button
                    onClick={() => setSelectedCoupon(coupon)}
                    className="shrink-0 text-neutral-30 hover:text-brand-primary transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-brand-primary rounded p-0.5 mt-0.5 min-h-11 min-w-11 flex items-center justify-center"
                    aria-label={`Thông tin: ${coupon.title}`}
                  >
                    <Info size={14} aria-hidden />
                  </button>
                </div>
                <p className="text-neutral-40 text-xs mt-1.5 leading-relaxed line-clamp-1">
                  {coupon.condition}
                </p>
              </div>

              {/* Divider dashed */}
              <div className="mx-4 border-t border-dashed border-neutral-10" />

              {/* Code + Copy */}
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Copy size={14} className="text-neutral-30 shrink-0" aria-hidden />
                  <span className="font-mono text-sm font-bold text-neutral-90 tracking-wider truncate">
                    {coupon.code}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(coupon.id, coupon.code)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-11 ${
                    copiedId === coupon.id
                      ? "bg-blue-50 text-blue-600"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200 active:scale-95"
                  }`}
                  aria-label={`Sao chép mã ${coupon.code}`}
                >
                  {copiedId === coupon.id ? (
                    <><Check size={12} aria-hidden /> Đã copy</>
                  ) : (
                    "COPY"
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Bottom Sheet chi tiết ưu đãi ── */}
      {selectedCoupon && (
        <div className="fixed inset-0 z-[300] flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-neutral-90/50"
            onClick={() => setSelectedCoupon(null)}
            aria-hidden
          />

          {/* Sheet */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Chi tiết ưu đãi"
            className="relative bg-neutral-01 rounded-t-2xl px-4 pt-3 pb-8 flex flex-col gap-4 animate-in slide-in-from-bottom duration-300"
          >
            {/* Drag handle */}
            <div className="w-10 h-1 bg-neutral-10 rounded-full mx-auto mb-1" aria-hidden />

            {/* Close */}
            <button
              onClick={() => setSelectedCoupon(null)}
              className="absolute top-4 right-4 text-neutral-30 hover:text-neutral-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-full p-1 min-h-11 min-w-11 flex items-center justify-center"
              aria-label="Đóng"
            >
              <X size={18} aria-hidden />
            </button>

            {/* Badge */}
            {selectedCoupon.badge && (
              <span className={`self-start px-2.5 py-1 rounded-full text-xs font-bold ${BADGE_STYLE[selectedCoupon.badge]}`}>
                {selectedCoupon.badge}
              </span>
            )}

            {/* Title */}
            <h3 className="text-base font-bold text-neutral-90 leading-snug pr-8">
              {selectedCoupon.title}
            </h3>

            {/* Divider */}
            <div className="border-t border-neutral-05" />

            {/* Info rows */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <Info size={15} className="text-neutral-30 shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="text-xs font-semibold text-neutral-50 mb-0.5">Điều kiện áp dụng</p>
                  <p className="text-sm text-neutral-90">{selectedCoupon.condition}</p>
                </div>
              </div>
              {selectedCoupon.expiry && (
                <div className="flex items-start gap-2">
                  <Clock size={15} className="text-neutral-30 shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <p className="text-xs font-semibold text-neutral-50 mb-0.5">Hạn sử dụng</p>
                    <p className="text-sm text-neutral-90">{selectedCoupon.expiry}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Divider dashed */}
            <div className="border-t border-dashed border-neutral-10" />

            {/* Code + Copy */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Copy size={15} className="text-neutral-30 shrink-0" aria-hidden />
                <span className="font-mono text-base font-bold text-neutral-90 tracking-widest">
                  {selectedCoupon.code}
                </span>
              </div>
              <button
                onClick={() => handleCopy(selectedCoupon.id, selectedCoupon.code)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-11 ${
                  copiedId === selectedCoupon.id
                    ? "bg-blue-50 text-blue-600"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200 active:scale-95"
                }`}
                aria-label={`Sao chép mã ${selectedCoupon.code}`}
              >
                {copiedId === selectedCoupon.id ? (
                  <><Check size={14} aria-hidden /> Đã copy</>
                ) : (
                  "COPY"
                )}
              </button>
            </div>

            {/* Đóng button */}
            <button
              onClick={() => setSelectedCoupon(null)}
              className="w-full py-3 rounded-xl border border-neutral-10 text-sm font-semibold text-neutral-50 hover:bg-neutral-03 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-11"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}
