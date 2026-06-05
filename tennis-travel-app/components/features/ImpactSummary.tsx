"use client";

import { useState, useCallback } from "react";
import { Share2, Leaf, Users, Zap, Star } from "lucide-react";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import type { LEIESGTour } from "@/lib/mock-data";

interface ImpactSummaryProps {
  tour: LEIESGTour;
  userName: string;
  hideShareButton?: boolean;
}

const ESG_TIER_COLOR: Record<string, string> = {
  "Green Champion": "text-green-600",
  "Eco Friendly": "text-yellow-600",
  Standard: "text-neutral-40",
};

const ESG_TIER_BG: Record<string, string> = {
  "Green Champion": "bg-green-50 border-green-200",
  "Eco Friendly": "bg-yellow-50 border-yellow-200",
  Standard: "bg-neutral-03 border-neutral-10",
};

export default function ImpactSummary({ tour, userName, hideShareButton = false }: ImpactSummaryProps) {
  const [shared, setShared] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const leiPercent = Math.round((tour.lei.total / 100) * 100);
  const { impact } = tour.esg;

  const shareText = `${userName} vừa hoàn thành ${tour.name} với LEI ${tour.lei.total}/100 — "${tour.lei.badge}"!\n🌱 Tiết kiệm ${impact.co2Saved} kg CO₂ · 🤝 Hỗ trợ ${impact.localFamiliesSupported} gia đình · 🎾 ${impact.localProSessions} buổi HLV bản địa\n#TennisTravelVN #${tour.lei.badge.replace(/\s/g, "")}`;

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      await navigator
        .share({
          title: `${tour.name} — LEI Impact`,
          text: shareText,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      await navigator.clipboard.writeText(shareText).catch(() => {});
    }
    setShared(true);
    setToastVisible(true);
    setTimeout(() => setShared(false), 2000);
  }, [shareText, tour.name]);

  return (
    <section
      aria-labelledby="impact-summary-title"
      className="rounded-xl border border-neutral-10 shadow-card p-8 mb-10"
      style={{ background: "var(--gradient-tint-radial)" }}
    >
      {/* Header */}
      <p className="text-xs font-medium text-neutral-40 uppercase tracking-widest mb-3">
        Chuyến đi của bạn đã tạo ra
      </p>

      {/* True Local Badge */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
          <Star size={20} className="text-amber-500" aria-hidden="true" />
        </div>
        <div>
          <p className="font-bold text-neutral-90 text-lg leading-tight">
            {tour.lei.badge} Badge đạt được!
          </p>
          <p className="text-neutral-40 text-sm">
            Bạn đã trải nghiệm {tour.location} như người bản địa
          </p>
        </div>
      </div>

      {/* LEI Score bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-neutral-90">LEI Tổng kết</span>
          <span className="text-sm font-extrabold text-brand-primary">{tour.lei.total}/100</span>
        </div>
        <div
          className="w-full h-3 bg-neutral-03 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={tour.lei.total}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`LEI score ${tour.lei.total} trên 100`}
        >
          <div
            className="h-full bg-brand-primary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${leiPercent}%` }}
          />
        </div>
      </div>

      {/* ESG Tier Badge */}
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold mb-6 ${ESG_TIER_BG[tour.esg.tier] ?? "bg-neutral-03 border-neutral-10"} ${ESG_TIER_COLOR[tour.esg.tier] ?? "text-neutral-40"}`}
      >
        <Leaf size={14} aria-hidden="true" />
        {tour.esg.tier} · ESG {tour.esg.total}/100
      </div>

      {/* Impact items */}
      <div className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3 bg-neutral-03 rounded-xl px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <Leaf size={16} className="text-green-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-90">Tiết kiệm {impact.co2Saved} kg CO₂</p>
            <p className="text-xs text-neutral-40">So với tour resort thông thường</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-neutral-03 rounded-xl px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Users size={16} className="text-blue-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-90">
              Hỗ trợ {impact.localFamiliesSupported} gia đình địa phương
            </p>
            <p className="text-xs text-neutral-40">
              {impact.localRevenuePercent}% doanh thu đến tay người bản địa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-neutral-03 rounded-xl px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-brand-tint flex items-center justify-center shrink-0">
            <Zap size={16} className="text-brand-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-90">
              {tour.localPro.name} có thêm {impact.localProSessions} buổi dạy
            </p>
            <p className="text-xs text-neutral-40">HLV bản địa · {tour.localPro.experience} năm kinh nghiệm</p>
          </div>
        </div>
      </div>

      {/* Share CTA — ẩn khi đã có share button ở trang cha */}
      {!hideShareButton && (
        <>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleShare}
          >
            <Share2 size={18} aria-hidden="true" />
            {shared ? "Đã chia sẻ!" : "Chia sẻ impact của bạn"}
          </Button>
          <p className="text-xs text-neutral-40 text-center mt-3">
            Không phải tour resort — đây mới là {tour.location} thật.
          </p>
        </>
      )}

      <Toast
        message="+150 XP · Cảm ơn bạn đã lan toả impact!"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
        type="xp"
      />
    </section>
  );
}
