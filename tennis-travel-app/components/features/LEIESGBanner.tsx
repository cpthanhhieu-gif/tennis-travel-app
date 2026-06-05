"use client";

import { useState } from "react";
import { MapPin, Shield, Leaf, Users } from "lucide-react";
import { leiEsgTours, LEIESGTour, ESGTier } from "@/lib/mock-data";
import LEIModal from "@/components/features/LEIModal";

// ── ESG tier config ────────────────────────────────────────────────────────
const ESG_TIER: Record<ESGTier, { label: string; emoji: string; bgClass: string; textClass: string }> = {
  "Green Champion": { label: "Green", emoji: "🟢", bgClass: "bg-success-light", textClass: "text-success" },
  "Eco Friendly":   { label: "Eco",   emoji: "🟡", bgClass: "bg-yellow-light",  textClass: "text-yellow-dark" },
  "Standard":       { label: "Std",   emoji: "⚪", bgClass: "bg-neutral-03",    textClass: "text-neutral-40" },
};

// ── ESG Breakdown row in card ──────────────────────────────────────────────
function ESGMiniBreakdown({ breakdown }: { breakdown: LEIESGTour["esg"]["breakdown"] }) {
  const items = [
    { icon: <Leaf size={12} />, label: "E", score: breakdown.environmental },
    { icon: <Users size={12} />, label: "S", score: breakdown.social },
    { icon: <Shield size={12} />, label: "G", score: breakdown.governance },
  ];
  return (
    <div className="flex gap-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1">
          <span className="text-neutral-30">{item.icon}</span>
          <span className="text-xs text-neutral-40">{item.label} {item.score}</span>
        </div>
      ))}
    </div>
  );
}

// ── Tour Card ──────────────────────────────────────────────────────────────
function LEIESGTourCard({
  tour,
  rank,
  onPress,
}: {
  tour: LEIESGTour;
  rank: number;
  onPress: (t: LEIESGTour) => void;
}) {
  const esgCfg = ESG_TIER[tour.esg.tier];
  const isFeatured = rank === 1;

  return (
    <button
      onClick={() => onPress(tour)}
      aria-label={`Xem chi tiết tour ${tour.name}`}
      className={`text-left w-full bg-neutral-01 rounded-xl shadow-card overflow-hidden transition-all duration-200 ease-in-out active:scale-95 focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${isFeatured ? "ring-2 ring-brand-primary" : ""}`}
    >
      {/* Image */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay cho readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-90/40 to-transparent" />

        {/* LEI badge — top-left */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-neutral-90/75 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-xs font-semibold text-neutral-01">LEI</span>
          <span className="text-sm font-extrabold text-yellow-accent">{tour.lei.total}</span>
        </div>

        {/* ESG tier — chỉ emoji + label ngắn, bottom-right */}
        <div className={`absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full ${esgCfg.bgClass}`}>
          <span className="text-xs">{esgCfg.emoji}</span>
          <span className={`text-xs font-semibold ${esgCfg.textClass}`}>{esgCfg.label}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-1">
        <div className="flex items-center gap-1">
          <MapPin size={10} className="text-neutral-30 shrink-0" />
          <span className="text-xs text-neutral-30">{tour.location}</span>
        </div>
        <p className="text-xs font-bold text-neutral-90 leading-snug line-clamp-2">
          {tour.name}
        </p>
        <div className="flex items-center gap-1">
          <CheckCircle size={10} className="text-success shrink-0" />
          <span className="text-xs text-neutral-40 truncate">{tour.localPro.name} · {tour.localPro.experience} năm</span>
        </div>
      </div>
    </button>
  );
}

// ── Main Banner ────────────────────────────────────────────────────────────
export default function LEIESGBanner() {
  const [selectedTour, setSelectedTour] = useState<LEIESGTour | null>(null);

  return (
    <>
      <section className="py-4">
        {/* Header */}
        <div className="px-4 mb-3">
          <p className="text-xs font-semibold text-brand-primary uppercase tracking-wide mb-1">
            Trải nghiệm bản địa đích thực
          </p>
          <p className="text-xl font-bold text-neutral-90">Tour LEI &amp; ESG nổi bật</p>
          <p className="text-sm text-neutral-40 mt-1">
            App duy nhất tại Đông Nam Á tích hợp chỉ số bản địa &amp; xanh
          </p>
        </div>

        {/* Horizontal scroll strip */}
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 scroll-smooth" style={{ scrollbarWidth: "none" }}>
          {leiEsgTours.slice(0, 4).map((tour, i) => (
            <div key={tour.id} className="w-[260px] shrink-0">
            <LEIESGTourCard
              tour={tour}
              rank={i + 1}
              onPress={setSelectedTour}
            /></div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedTour && (
        <LEIModal
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
        />
      )}
    </>
  );
}
