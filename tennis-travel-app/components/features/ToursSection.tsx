"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tourPackages } from "@/lib/mock-data";
import TourPackageCard from "@/components/ui/TourPackageCard";

const DEST_LABEL: Record<string, string> = {
  danang: "đà nẵng", phuquoc: "phú quốc", nhatrang: "nha trang", phanthiet: "phan thiết",
};

const TABS = [
  { key: "all",  label: "Tất cả",      count: tourPackages.length },
  { key: "sbu1", label: "Khám phá",    count: tourPackages.filter((p) => p.sbu === 1).length },
  { key: "sbu2", label: "Chinh phục",  count: tourPackages.filter((p) => p.sbu === 2).length },
  { key: "sbu3", label: "Đẳng cấp",   count: tourPackages.filter((p) => p.sbu === 3).length },
];

interface Props {
  searchQuery?: string;
  filterSbu?: string;
}

export default function ToursSection({ searchQuery = "", filterSbu = "all" }: Props) {
  const q = searchQuery.trim().toLowerCase();

  const filtered = tourPackages.filter((pkg) => {
    const matchSbu = filterSbu === "all" || pkg.id === filterSbu;
    if (!matchSbu) return false;
    if (!q) return true;
    return (
      pkg.name.toLowerCase().includes(q) ||
      pkg.tagline.toLowerCase().includes(q) ||
      pkg.highlights.some((h) => h.toLowerCase().includes(q)) ||
      pkg.destinations.some((d) => (DEST_LABEL[d] ?? d).includes(q))
    );
  });

  return (
    <section id="tours" className="pt-10 pb-2 bg-neutral-01" aria-labelledby="tours-title">
      {/* Header */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <div>
          <h2 id="tours-title" className="text-lg font-bold text-neutral-90">
            Hành trình <span className="text-brand-primary">phù hợp với bạn</span>
          </h2>
          <p className="text-neutral-40 text-sm mt-0.5">
            {q || filterSbu !== "all"
              ? `${filtered.length} kết quả${q ? ` cho "${searchQuery}"` : ""}`
              : "3 hành trình · Vietravel lo từ A đến Z"}
          </p>
        </div>
        <Link
          href="/booking"
          className="text-brand-primary shrink-0 focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded p-1 flex items-center justify-center min-h-11 min-w-11"
          aria-label="Khám phá thêm"
        >
          <ArrowRight size={20} aria-hidden />
        </Link>
      </div>

      {/* Tabs — ẩn khi đang search */}
      {!q && (
        <div className="flex gap-2 px-4 mb-4 overflow-x-auto scroll-x-hidden">
          {TABS.map((tab) => {
            const active = filterSbu === tab.key;
            return (
              <button
                key={tab.key}
                disabled
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 min-h-11 rounded-full text-sm font-semibold border transition-all duration-200 ease-in-out ${
                  active
                    ? "bg-brand-primary text-neutral-01 border-brand-primary shadow-card"
                    : "bg-neutral-01 text-neutral-50 border-neutral-10"
                }`}
              >
                {tab.label}
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  active ? "bg-neutral-01/25 text-neutral-01" : "bg-neutral-05 text-neutral-40"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Cards */}
      <div className="px-4 overflow-hidden">
        {filtered.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-5 snap-x snap-mandatory scroll-x-hidden">
            {filtered.map((pkg) => (
              <TourPackageCard key={pkg.id} pkg={pkg} className="snap-start flex-shrink-0 w-[25rem]" />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-neutral-50 text-base font-semibold mb-1">Không tìm thấy kết quả</p>
            <p className="text-neutral-30 text-sm">Thử từ khoá khác hoặc xoá bộ lọc</p>
          </div>
        )}
      </div>
    </section>
  );
}
