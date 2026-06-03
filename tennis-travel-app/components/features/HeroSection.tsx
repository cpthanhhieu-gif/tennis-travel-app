"use client";

import { useState } from "react";
import { MapPin, Bell, Trophy, Search, AlignJustify, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { mockUser } from "@/lib/mock-data";

const TIER_COLOR: Record<string, string> = {
  Bronze: "bg-amber-700",
  Silver: "bg-slate-400",
  Gold: "bg-yellow-500",
  Diamond: "bg-cyan-400",
};

const FILTER_OPTIONS = [
  { key: "all",  label: "Tất cả",      desc: "Hiển thị mọi hành trình" },
  { key: "sbu1", label: "Khám phá",    desc: "Hành trình thư giãn cho tay vợt mới" },
  { key: "sbu2", label: "Chinh phục",  desc: "Thi đấu cùng cộng đồng tennis toàn quốc" },
  { key: "sbu3", label: "Đẳng cấp",   desc: "Trải nghiệm tennis 5 sao tại resort cao cấp" },
];

interface Props {
  searchQuery: string;
  onSearch: (q: string) => void;
  filterSbu: string;
  onFilter: (sbu: string) => void;
  onMenuOpen: () => void;
}

export default function HeroSection({ searchQuery, onSearch, filterSbu, onFilter, onMenuOpen }: Props) {
  const tierBg = TIER_COLOR[mockUser.tier] ?? "bg-brand-primary";
  const [filterOpen, setFilterOpen] = useState(false);

  const activeLabel = FILTER_OPTIONS.find(o => o.key === filterSbu)?.label ?? "Tất cả";
  const hasFilter = filterSbu !== "all";

  return (
    <>
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute top-[-4rem] right-[-3rem] w-[18rem] h-[18rem] rounded-full bg-neutral-01/60 blur-2xl pointer-events-none" />
        <div className="absolute top-[6rem] left-[-4rem] w-[14rem] h-[14rem] rounded-full bg-sky-100/80 blur-2xl pointer-events-none" />

        {/* Top bar */}
        <div
          className="relative z-10 flex items-center justify-between px-5 pb-3"
          style={{ paddingTop: "max(5.4rem, calc(env(safe-area-inset-top, 0px) + 1.2rem))" }}
        >
          <button
            aria-label="Menu"
            onClick={onMenuOpen}
            className="w-11 h-11 rounded-2xl bg-neutral-01 shadow-card flex flex-col items-center justify-center gap-[5px] px-3 transition-all duration-150 ease-out active:scale-[0.98] focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
          >
            <span className="w-full h-[2px] bg-neutral-90 rounded-full" />
            <span className="w-3/4 h-[2px] bg-neutral-90 rounded-full self-end" />
            <span className="w-full h-[2px] bg-neutral-90 rounded-full" />
          </button>

          <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all duration-150 ease-out active:scale-[0.98] focus:ring-2 focus:ring-brand-primary focus:ring-offset-2">
            <MapPin size={13} className="text-brand-primary" />
            <span className="text-neutral-90 text-xs font-semibold">TP. Hồ Chí Minh</span>
          </button>

          <button
            aria-label="Thông báo"
            className="relative w-11 h-11 rounded-2xl bg-neutral-01 shadow-card flex items-center justify-center transition-all duration-150 ease-out active:scale-[0.98] focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
          >
            <Bell size={18} className="text-neutral-50" />
            <span className="absolute top-2 right-2 w-[0.75rem] h-[0.75rem] bg-brand-secondary rounded-full border-[1.5px] border-neutral-01" />
          </button>
        </div>

        {/* Greeting */}
        <div className="relative z-10 px-5 pb-4">
          <div className="flex items-center gap-2.5 mb-3">
            <div>
              <p className="text-neutral-40 text-xs leading-tight">Xin chào</p>
              <p className="text-neutral-90 font-bold text-base leading-tight">{mockUser.name}</p>
            </div>
            <span className={`ml-auto inline-flex items-center gap-1 ${tierBg} text-neutral-01 text-xs font-bold px-2.5 py-1 rounded-full shadow-card`}>
              <Trophy size={11} />
              {mockUser.tier}
            </span>
          </div>

          {/* Search + Filter */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-[62%] flex items-center gap-2 bg-neutral-01 rounded-2xl shadow-floating px-3.5 py-3">
              <Search size={18} className="text-neutral-30 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Tìm hành trình..."
                className="flex-1 bg-transparent text-sm text-neutral-90 placeholder:text-neutral-30 outline-none focus:ring-0"
                aria-label="Tìm kiếm tour"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearch("")}
                  aria-label="Xóa tìm kiếm"
                  className="focus:ring-2 focus:ring-brand-primary focus:ring-offset-1 rounded"
                >
                  <X size={16} className="text-neutral-30" />
                </button>
              )}
            </div>
            <button
              onClick={() => setFilterOpen(true)}
              aria-label="Bộ lọc"
              className={`relative w-12 h-12 rounded-2xl shadow-floating flex items-center justify-center shrink-0 transition-all duration-150 ease-out active:scale-[0.98] focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${
                hasFilter ? "bg-brand-secondary" : "bg-brand-primary"
              }`}
            >
              <SlidersHorizontal size={20} color="white" />
              {hasFilter && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-neutral-01 rounded-full border-2 border-brand-secondary flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                </span>
              )}
            </button>
          </div>

          {/* Active filter chip */}
          {hasFilter && (
            <div className="flex items-center gap-1.5 pb-1">
              <span className="text-neutral-50 text-xs">Lọc theo:</span>
              <button
                onClick={() => onFilter("all")}
                className="inline-flex items-center gap-1 bg-brand-primary text-neutral-01 text-xs font-semibold px-2.5 py-1 rounded-full focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all duration-150 ease-out active:scale-[0.98]"
              >
                {activeLabel}
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Filter bottomsheet */}
      {filterOpen && (
        <>
          <div
            onClick={() => setFilterOpen(false)}
            className="fixed inset-0 z-[100]"
            style={{ background: "var(--color-backdrop)", backdropFilter: "blur(2px)" }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Bộ lọc gói tour"
            className="fixed left-0 right-0 bottom-0 z-[300] bg-neutral-01 shadow-dialog"
            style={{ borderRadius: "var(--radius-bottom-sheet)" }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="handle-bar" />
            </div>
            <div className="flex items-center justify-between px-5 pb-3.5 border-b border-neutral-10">
              <p className="font-bold text-lg text-neutral-90">Lọc theo gói tour</p>
              <button
                onClick={() => setFilterOpen(false)}
                aria-label="Đóng bộ lọc"
                className="w-11 h-11 rounded-full bg-neutral-05 flex items-center justify-center focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all duration-150 ease-out active:scale-[0.98]"
              >
                <ChevronDown size={18} className="text-neutral-50" />
              </button>
            </div>
            <div className="px-5 py-4 flex flex-col gap-2.5">
              {FILTER_OPTIONS.map(({ key, label, desc }) => {
                const active = filterSbu === key;
                return (
                  <button
                    key={key}
                    onClick={() => { onFilter(key); setFilterOpen(false); }}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-[1.4rem] border-2 transition-all duration-150 ease-out focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${
                      active
                        ? "border-brand-primary bg-brand-tint"
                        : "border-neutral-10 bg-neutral-01 hover:border-neutral-30"
                    }`}
                  >
                    <div className="text-left">
                      <p className={`font-bold text-base ${active ? "text-brand-primary" : "text-neutral-90"}`}>{label}</p>
                      <p className="text-neutral-40 text-xs">{desc}</p>
                    </div>
                    {active && (
                      <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="px-5 pb-7" />
          </div>
        </>
      )}
    </>
  );
}
