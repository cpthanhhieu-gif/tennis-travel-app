"use client";

import { useState } from "react";
import { MapPin, CheckCircle, SlidersHorizontal, ArrowRight } from "lucide-react";
import { leiEsgTours, type ESGTier, type LEIESGTour } from "@/lib/mock-data";
import Modal from "@/components/ui/Modal";
import LEIModal from "@/components/features/LEIModal";

// ── ESG tier config ──────────────────────────────────────────────────────────
const ESG_CFG: Record<ESGTier, { label: string; emoji: string; bg: string; text: string; activeBorder: string; bgClass: string; textClass: string }> = {
  "Green Champion": { label: "Green",    emoji: "🟢", bg: "bg-success-light", text: "text-success",     activeBorder: "border-success",    bgClass: "bg-success-light", textClass: "text-success"     },
  "Eco Friendly":   { label: "Eco",      emoji: "🟡", bg: "bg-yellow-light",  text: "text-yellow-dark", activeBorder: "border-yellow-dark", bgClass: "bg-yellow-light",  textClass: "text-yellow-dark" },
  "Standard":       { label: "Standard", emoji: "⚪", bg: "bg-neutral-03",    text: "text-neutral-50",  activeBorder: "border-neutral-10",  bgClass: "bg-neutral-03",    textClass: "text-neutral-50"  },
};

const ESG_ORDER: ESGTier[] = ["Green Champion", "Eco Friendly", "Standard"];

type SortBy = "default" | "lei" | "esg";

function leiMinLabel(v: number) {
  return v === 0 ? "Tất cả" : `≥ ${v}`;
}

// ── Portrait card (horizontal scroll) ──────────────────────────────────────
function PortraitCard({ tour, rank, onPress }: { tour: LEIESGTour; rank: number; onPress: (t: LEIESGTour) => void }) {
  const cfg = ESG_CFG[tour.esg.tier];
  return (
    <button
      onClick={() => onPress(tour)}
      aria-label={`Xem chi tiết LEI tour ${tour.name}`}
      className={`text-left w-full bg-neutral-01 rounded-xl overflow-hidden transition-all duration-200 ease-in-out active:scale-95 focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${rank === 1 ? "ring-2 ring-brand-primary" : ""}`}
    >
      <div className="relative h-36 overflow-hidden">
        <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-90/40 to-transparent" />
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-neutral-90/75 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-xs font-semibold text-neutral-01">LEI</span>
          <span className="text-sm font-extrabold text-yellow-accent">{tour.lei.total}</span>
        </div>
        <div className={`absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full ${cfg.bgClass}`}>
          <span className="text-xs">{cfg.emoji}</span>
          <span className={`text-xs font-semibold ${cfg.textClass}`}>{cfg.label}</span>
        </div>
      </div>
      <div className="p-3 space-y-1">
        <div className="flex items-center gap-1">
          <MapPin size={10} className="text-neutral-30 shrink-0" aria-hidden="true" />
          <span className="text-xs text-neutral-30">{tour.location}</span>
        </div>
        <p className="text-xs font-bold text-neutral-90 leading-snug line-clamp-2">{tour.name}</p>
        <div className="flex items-center gap-1">
          <CheckCircle size={10} className="text-success shrink-0" aria-hidden="true" />
          <span className="text-xs text-neutral-40 truncate">{tour.localPro.name} · {tour.localPro.experience} năm</span>
        </div>
      </div>
    </button>
  );
}

// ── Landscape card (vertical list) ─────────────────────────────────────────
function LandscapeCard({ tour, onPress }: { tour: LEIESGTour; onPress: (t: LEIESGTour) => void }) {
  const cfg = ESG_CFG[tour.esg.tier];
  return (
    <button
      onClick={() => onPress(tour)}
      aria-label={`Xem chi tiết LEI tour ${tour.name}`}
      className="w-full flex rounded-xl overflow-hidden bg-neutral-01 border border-neutral-05 transition-all duration-150 ease-out active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 text-left"
    >
      <div className="relative w-40 shrink-0">
        <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
        <div className={`absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1 px-2 py-0.5 rounded-full ${cfg.bg}`}>
          <span className="text-xs leading-none" aria-hidden="true">{cfg.emoji}</span>
          <span className={`text-xs font-semibold leading-none ${cfg.text}`}>{cfg.label}</span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-3 min-w-0">
        <div className="flex items-center gap-1 mb-1">
          <MapPin size={10} className="text-neutral-30 shrink-0" aria-hidden="true" />
          <span className="text-xs text-neutral-30">{tour.location}</span>
        </div>
        <p className="text-sm font-bold text-neutral-90 line-clamp-2 leading-snug mb-2">{tour.name}</p>
        <div className="flex items-center gap-1 mb-2">
          <CheckCircle size={10} className="text-success shrink-0" aria-hidden="true" />
          <span className="text-xs text-neutral-40 truncate">{tour.localPro.name} · {tour.localPro.experience} năm KN</span>
        </div>
        <div className="mt-auto pt-2 border-t border-neutral-05 flex items-center justify-between">
          <span className="text-xs font-semibold text-brand-primary flex items-center gap-0.5">
            LEI {tour.lei.total}/100
          </span>
          <span className="text-xs font-semibold text-brand-primary flex items-center gap-0.5">
            Chi tiết <ArrowRight size={10} aria-hidden="true" />
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Main Section ─────────────────────────────────────────────────────────────
export default function LEIToursSection() {
  const [leiMin,      setLeiMin]      = useState(0);
  const [esgFilter,   setEsgFilter]   = useState<ESGTier | "all">("all");
  const [sortBy,      setSortBy]      = useState<SortBy>("default");
  const [filterOpen,  setFilterOpen]  = useState(false);
  const [expandList,  setExpandList]  = useState(false);
  const [selectedTour, setSelectedTour] = useState<LEIESGTour | null>(null);

  const [pendingLei,  setPendingLei]  = useState(0);
  const [pendingEsg,  setPendingEsg]  = useState<ESGTier | "all">("all");
  const [pendingSort, setPendingSort] = useState<SortBy>("default");

  const hasActiveFilter = leiMin > 0 || esgFilter !== "all" || sortBy !== "default";
  const activeCount = (leiMin > 0 ? 1 : 0) + (esgFilter !== "all" ? 1 : 0) + (sortBy !== "default" ? 1 : 0);

  const displayed = [...leiEsgTours]
    .filter((t) => t.lei.total >= leiMin)
    .filter((t) => esgFilter === "all" || t.esg.tier === esgFilter)
    .sort((a, b) => sortBy === "esg" ? b.esg.total - a.esg.total : b.lei.total - a.lei.total);

  const showVertical = hasActiveFilter || expandList;

  function openFilter() {
    setPendingLei(leiMin); setPendingEsg(esgFilter); setPendingSort(sortBy);
    setFilterOpen(true);
  }

  function applyFilter() {
    setLeiMin(pendingLei); setEsgFilter(pendingEsg); setSortBy(pendingSort);
    setExpandList(false);
    setFilterOpen(false);
  }

  function resetFilters() {
    setLeiMin(0); setEsgFilter("all"); setSortBy("default");
    setPendingLei(0); setPendingEsg("all"); setPendingSort("default");
    setExpandList(false);
  }

  function resetAndClose() { resetFilters(); setFilterOpen(false); }

  return (
    <section aria-labelledby="lei-tours-title" className="pt-6 pb-2">

      {/* Header row */}
      <div className="px-4 mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-brand-primary uppercase tracking-wide mb-1">Bản Địa &amp; Xanh</p>
          <h2 id="lei-tours-title" className="text-lg font-bold text-neutral-90">
            Tour Tennis <span className="text-brand-primary">Bản Địa</span>
          </h2>
          <p className="text-sm text-neutral-40 mt-0.5">
            {displayed.length} hành trình
            {hasActiveFilter
              ? <span className="text-brand-primary font-semibold"> · Đang lọc</span>
              : " · LEI & ESG verified"
            }
          </p>
        </div>
        <button
          onClick={openFilter}
          aria-label="Mở bộ lọc tour"
          className={`shrink-0 mt-1 flex items-center gap-1.5 px-3 min-h-[44px] rounded-full text-xs font-semibold border transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${
            hasActiveFilter
              ? "bg-brand-primary text-neutral-01 border-brand-primary shadow-card"
              : "bg-neutral-01 text-neutral-50 border-neutral-10"
          }`}
        >
          <SlidersHorizontal size={14} aria-hidden="true" />
          Lọc
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-neutral-01 text-brand-primary text-[10px] font-extrabold flex items-center justify-center leading-none">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Active filter chips */}
      {hasActiveFilter && (
        <div className="px-4 mb-3 flex flex-wrap gap-2">
          {leiMin > 0 && (
            <button onClick={() => { setLeiMin(0); setPendingLei(0); }} aria-label="Xóa lọc LEI"
              className="flex items-center gap-1 px-3 h-8 rounded-full bg-brand-tint border border-brand-primary text-xs font-semibold text-brand-primary transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1">
              LEI ≥ {leiMin}<span className="text-brand-primary/60 font-normal ml-0.5">×</span>
            </button>
          )}
          {esgFilter !== "all" && (
            <button onClick={() => { setEsgFilter("all"); setPendingEsg("all"); }} aria-label="Xóa lọc ESG"
              className="flex items-center gap-1 px-3 h-8 rounded-full bg-brand-tint border border-brand-primary text-xs font-semibold text-brand-primary transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1">
              {ESG_CFG[esgFilter].emoji} {ESG_CFG[esgFilter].label}<span className="text-brand-primary/60 font-normal ml-0.5">×</span>
            </button>
          )}
          {sortBy !== "default" && (
            <button onClick={() => { setSortBy("default"); setPendingSort("default"); }} aria-label="Xóa sắp xếp"
              className="flex items-center gap-1 px-3 h-8 rounded-full bg-brand-tint border border-brand-primary text-xs font-semibold text-brand-primary transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1">
              {sortBy === "lei" ? "LEI cao nhất" : "ESG cao nhất"}<span className="text-brand-primary/60 font-normal ml-0.5">×</span>
            </button>
          )}
        </div>
      )}

      {/* Card area */}
      {displayed.length > 0 ? (
        <>
          {!showVertical ? (
            /* ── Horizontal scroll strip ── */
            <>
              <div className="flex gap-3 overflow-x-auto px-4 pb-2 scroll-smooth" style={{ scrollbarWidth: "none" }}>
                {displayed.map((tour, i) => (
                  <div key={tour.id} className="w-[260px] shrink-0">
                    <PortraitCard tour={tour} rank={i + 1} onPress={setSelectedTour} />
                  </div>
                ))}
              </div>
              <button
                onClick={() => setExpandList(true)}
                className="mx-4 mt-3 w-[calc(100%-2rem)] min-h-[44px] flex items-center justify-center gap-1 text-sm font-semibold text-brand-primary transition-all duration-150 ease-out active:opacity-70 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded"
              >
                Xem tất cả {displayed.length} tour <ArrowRight size={14} aria-hidden="true" />
              </button>
            </>
          ) : (
            /* ── Vertical list ── */
            <div className="px-4 flex flex-col gap-4">
              {displayed.map((tour) => (
                <LandscapeCard key={tour.id} tour={tour} onPress={setSelectedTour} />
              ))}
              {!hasActiveFilter && (
                <button
                  onClick={() => setExpandList(false)}
                  className="w-full min-h-[44px] flex items-center justify-center gap-1 text-sm font-semibold text-brand-primary transition-all duration-150 ease-out active:opacity-70 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded"
                >
                  Thu gọn <span aria-hidden="true" className="rotate-180 inline-block">↓</span>
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        /* ── Empty state ── */
        <div className="mx-4 py-8 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-neutral-03 flex items-center justify-center">
            <SlidersHorizontal size={24} className="text-neutral-30" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-90 mb-1">Không có tour phù hợp</p>
            <p className="text-xs text-neutral-40 leading-snug">Thử giảm LEI tối thiểu<br />hoặc chọn ESG tier khác</p>
          </div>
          <button
            onClick={resetFilters}
            className="mt-1 px-4 min-h-[44px] rounded-full text-xs font-semibold border border-brand-primary text-brand-primary bg-transparent transition-all duration-150 ease-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
          >
            Reset bộ lọc
          </button>
        </div>
      )}

      {/* ── Bottom sheet filter ── */}
      <Modal isOpen={filterOpen} onClose={() => setFilterOpen(false)} title="Bộ lọc" bottomSheet>
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-neutral-90">LEI tối thiểu</span>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full transition-all duration-150 ease-out ${pendingLei > 0 ? "bg-brand-primary text-neutral-01" : "bg-neutral-05 text-neutral-40"}`}>
                {leiMinLabel(pendingLei)}
              </span>
            </div>
            <input type="range" min={0} max={100} step={5} value={pendingLei}
              onChange={(e) => setPendingLei(Number(e.target.value))}
              aria-label="LEI tối thiểu" aria-valuenow={pendingLei} aria-valuemin={0} aria-valuemax={100}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-neutral-10"
              style={{ accentColor: "var(--color-brand-primary)" }}
            />
            <div className="flex justify-between mt-1">
              {[0, 50, 70, 80, 90].map((v) => (
                <button key={v} onClick={() => setPendingLei(v)} aria-label={`Đặt LEI tối thiểu ${v === 0 ? "tất cả" : v}`}
                  className={`text-xs min-h-[44px] min-w-[44px] flex items-end justify-center pb-1 transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1 rounded ${pendingLei === v ? "text-brand-primary font-bold" : "text-neutral-30 font-medium"}`}>
                  {v === 0 ? "0" : v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-90 mb-3">ESG Tier</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setPendingEsg("all")} aria-pressed={pendingEsg === "all"}
                className={`flex items-center px-4 min-h-[44px] rounded-full text-sm font-semibold border transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1 ${pendingEsg === "all" ? "bg-brand-primary text-neutral-01 border-brand-primary shadow-card" : "bg-neutral-01 text-neutral-50 border-neutral-10"}`}>
                Tất cả
              </button>
              {ESG_ORDER.map((tier) => {
                const cfg = ESG_CFG[tier];
                const active = pendingEsg === tier;
                return (
                  <button key={tier} onClick={() => setPendingEsg(active ? "all" : tier)} aria-pressed={active}
                    className={`flex items-center gap-1.5 px-4 min-h-[44px] rounded-full text-sm font-semibold border transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1 ${active ? `${cfg.bg} ${cfg.text} ${cfg.activeBorder} shadow-card` : "bg-neutral-01 text-neutral-50 border-neutral-10"}`}>
                    <span aria-hidden="true">{cfg.emoji}</span>{cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-90 mb-3">Sắp xếp theo</p>
            <div className="flex flex-wrap gap-2">
              {([{ value: "default", label: "Mặc định" }, { value: "lei", label: "LEI cao nhất" }, { value: "esg", label: "ESG cao nhất" }] as { value: SortBy; label: string }[]).map(({ value, label }) => (
                <button key={value} onClick={() => setPendingSort(value)} aria-pressed={pendingSort === value}
                  className={`flex items-center px-4 min-h-[44px] rounded-full text-sm font-semibold border transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1 ${pendingSort === value ? "bg-brand-primary text-neutral-01 border-brand-primary shadow-card" : "bg-neutral-01 text-neutral-50 border-neutral-10"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={resetAndClose}
              className="flex-1 min-h-[48px] rounded-xl border border-neutral-10 text-sm font-semibold text-neutral-50 bg-neutral-01 transition-all duration-150 ease-out active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2">
              Reset
            </button>
            <button onClick={applyFilter}
              className="flex-[2] min-h-[48px] rounded-xl bg-brand-primary text-neutral-01 text-sm font-semibold shadow-card transition-all duration-150 ease-out active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2">
              Áp dụng
            </button>
          </div>
        </div>
      </Modal>

      {/* LEI Detail Modal */}
      {selectedTour && <LEIModal tour={selectedTour} onClose={() => setSelectedTour(null)} />}

    </section>
  );
}
