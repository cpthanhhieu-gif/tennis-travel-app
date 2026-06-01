"use client";

import { useState } from "react";
import { MapPin, Bell, Trophy, Search, AlignJustify, ChevronDown, X } from "lucide-react";
import { mockUser } from "@/lib/mock-data";

const TIER_COLOR: Record<string, string> = {
  Bronze: "bg-amber-700",
  Silver: "bg-slate-400",
  Gold: "bg-yellow-500",
  Diamond: "bg-cyan-400",
};

const FILTER_OPTIONS = [
  { key: "all",  label: "Tất cả",     desc: "Hiển thị mọi gói tour" },
  { key: "sbu1", label: "Leisure",    desc: "Học - Chơi - Khám phá" },
  { key: "sbu2", label: "Tournament", desc: "Thi đấu - Cạnh tranh - Kết nối" },
  { key: "sbu3", label: "Premium",    desc: "Khổ luyện - Phục hồi - Luxury" },
];

interface Props {
  searchQuery: string;
  onSearch: (q: string) => void;
  filterSbu: string;
  onFilter: (sbu: string) => void;
}

export default function HeroSection({ searchQuery, onSearch, filterSbu, onFilter }: Props) {
  const tierBg = TIER_COLOR[mockUser.tier] ?? "bg-brand-primary";
  const [filterOpen, setFilterOpen] = useState(false);

  const activeLabel = FILTER_OPTIONS.find(o => o.key === filterSbu)?.label ?? "Tất cả";
  const hasFilter = filterSbu !== "all";

  return (
    <>
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #dbeafe 0%, #eff6ff 40%, #f0fdf4 100%)" }}
      >
        <div className="absolute top-[-4rem] right-[-3rem] w-[18rem] h-[18rem] rounded-full bg-white/60 blur-2xl pointer-events-none" />
        <div className="absolute top-[6rem] left-[-4rem] w-[14rem] h-[14rem] rounded-full bg-sky-100/80 blur-2xl pointer-events-none" />

        {/* Top bar */}
        <div
          className="relative z-10 flex items-center justify-between px-[2rem] pb-[1.2rem]"
          style={{ paddingTop: "max(5.4rem, calc(env(safe-area-inset-top, 0px) + 1.2rem))" }}
        >
          <button aria-label="Menu" className="w-[3.8rem] h-[3.8rem] rounded-2xl bg-white shadow-sm flex items-center justify-center">
            <AlignJustify size={20} className="text-neutral-700" />
          </button>
          <button className="flex items-center gap-[0.5rem] bg-white rounded-full px-[1.2rem] py-[0.6rem] shadow-sm">
            <MapPin size={13} className="text-brand-primary" />
            <span className="text-neutral-800 text-[1.2rem] font-semibold">TP. Hồ Chí Minh</span>
          </button>
          <div className="flex items-center gap-[0.8rem]">
            <button aria-label="Thông báo" className="relative w-[3.8rem] h-[3.8rem] rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <Bell size={18} className="text-neutral-700" />
              <span className="absolute top-[0.7rem] right-[0.7rem] w-[0.75rem] h-[0.75rem] bg-red-500 rounded-full border-[1.5px] border-white" />
            </button>
          </div>
        </div>

        {/* Greeting */}
        <div className="relative z-10 px-[2rem] pb-[1.6rem]">
          <div className="flex items-center gap-[1rem] mb-[1.2rem]">
            <div className={`w-[4rem] h-[4rem] rounded-full flex items-center justify-center text-white font-bold text-[1.5rem] shadow-md ${tierBg}`}>
              {mockUser.firstName.charAt(0)}
            </div>
            <div>
              <p className="text-neutral-500 text-[1.1rem] leading-tight">Xin chào</p>
              <p className="text-neutral-900 font-bold text-[1.6rem] leading-tight">{mockUser.name}</p>
            </div>
            <span className={`ml-auto inline-flex items-center gap-[0.4rem] ${tierBg} text-white text-[1.0rem] font-bold px-[1rem] py-[0.4rem] rounded-full shadow-sm`}>
              <Trophy size={11} />
              {mockUser.tier}
            </span>
          </div>

          {/* Search + Filter */}
          <div className="flex items-center gap-[0.8rem] mb-[1.6rem]">
            <div className="flex-1 flex items-center gap-[0.8rem] bg-white rounded-2xl shadow-md px-[1.4rem] py-[1.1rem]">
              <Search size={18} className="text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Tìm tour, điểm đến..."
                className="flex-1 bg-transparent text-[1.35rem] text-neutral-800 placeholder:text-neutral-400 outline-none"
                aria-label="Tìm kiếm tour"
              />
              {searchQuery && (
                <button onClick={() => onSearch("")} aria-label="Xóa tìm kiếm">
                  <X size={16} className="text-neutral-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setFilterOpen(true)}
              aria-label="Bộ lọc"
              className={`relative w-[4.8rem] h-[4.8rem] rounded-2xl shadow-md flex items-center justify-center shrink-0 transition-colors ${
                hasFilter ? "bg-brand-secondary" : "bg-brand-primary"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              {hasFilter && (
                <span className="absolute -top-[0.4rem] -right-[0.4rem] w-[1.6rem] h-[1.6rem] bg-white rounded-full border-2 border-brand-secondary flex items-center justify-center">
                  <span className="w-[0.7rem] h-[0.7rem] rounded-full bg-brand-secondary" />
                </span>
              )}
            </button>
          </div>

          {/* Active filter chip */}
          {hasFilter && (
            <div className="flex items-center gap-[0.6rem] pb-[0.4rem]">
              <span className="text-neutral-50 text-[1.2rem]">Lọc theo:</span>
              <button
                onClick={() => onFilter("all")}
                className="inline-flex items-center gap-[0.5rem] bg-brand-primary text-white text-[1.2rem] font-semibold px-[1rem] py-[0.4rem] rounded-full"
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
          <div onClick={() => setFilterOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" style={{ zIndex: 56 }} />
          <div
            role="dialog" aria-modal="true" aria-label="Bộ lọc gói tour"
            className="fixed left-0 right-0 bottom-0 bg-white rounded-t-[2.4rem] shadow-[rgba(0,0,0,0.3)_0px_-8px_40px]"
            style={{ zIndex: 60 }}
          >
            <div className="flex justify-center pt-[1.2rem] pb-[0.8rem]">
              <div className="w-[4rem] h-[0.4rem] bg-neutral-10 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-[2rem] pb-[1.4rem] border-b border-neutral-05">
              <p className="font-bold text-[1.7rem] text-neutral-90">Lọc theo gói tour</p>
              <button onClick={() => setFilterOpen(false)} className="w-[3.4rem] h-[3.4rem] rounded-full bg-neutral-05 flex items-center justify-center">
                <ChevronDown size={18} className="text-neutral-50" />
              </button>
            </div>
            <div className="px-[2rem] py-[1.6rem] flex flex-col gap-[1rem]">
              {FILTER_OPTIONS.map(({ key, label, desc }) => {
                const active = filterSbu === key;
                return (
                  <button
                    key={key}
                    onClick={() => { onFilter(key); setFilterOpen(false); }}
                    className={`flex items-center justify-between px-[1.6rem] py-[1.4rem] rounded-[1.4rem] border-2 transition-all ${
                      active ? "border-brand-primary bg-brand-tint" : "border-neutral-10 bg-white hover:border-neutral-30"
                    }`}
                  >
                    <div className="text-left">
                      <p className={`font-bold text-[1.5rem] ${active ? "text-brand-primary" : "text-neutral-90"}`}>{label}</p>
                      <p className="text-neutral-40 text-[1.2rem]">{desc}</p>
                    </div>
                    {active && (
                      <div className="w-[2rem] h-[2rem] rounded-full bg-brand-primary flex items-center justify-center shrink-0">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="px-[2rem] pb-[2.8rem]" />
          </div>
        </>
      )}
    </>
  );
}
