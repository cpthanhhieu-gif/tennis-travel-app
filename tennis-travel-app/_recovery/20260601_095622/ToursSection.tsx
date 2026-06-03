"use client";

import Link from "next/link";
import { tourPackages } from "@/lib/mock-data";
import TourPackageCard from "@/components/ui/TourPackageCard";

const DEST_LABEL: Record<string, string> = {
  danang: "đà nẵng", phuquoc: "phú quốc", nhatrang: "nha trang", phanthiet: "phan thiết",
};

const TABS = [
  { key: "all",  label: "Tất cả",      count: tourPackages.length },
  { key: "sbu1", label: "Leisure",     count: tourPackages.filter((p) => p.sbu === 1).length },
  { key: "sbu2", label: "Tournament",  count: tourPackages.filter((p) => p.sbu === 2).length },
  { key: "sbu3", label: "Premium",     count: tourPackages.filter((p) => p.sbu === 3).length },
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
    <section id="tours" className="pt-[2.4rem] pb-[0.8rem] bg-neutral-01" aria-labelledby="tours-title">
      {/* Header */}
      <div className="px-[1.6rem] mb-[1.2rem] flex items-center justify-between">
        <div>
          <h2 id="tours-title" className="text-[1.8rem] font-bold text-neutral-90">
            Gói tour <span className="text-brand-primary">phù hợp</span>
          </h2>
          <p className="text-neutral-40 text-[1.3rem] mt-[0.2rem]">
            {q || filterSbu !== "all"
              ? `${filtered.length} kết quả${q ? ` cho "${searchQuery}"` : ""}`
              : "3 phân khúc · từ cơ bản đến Premium"}
          </p>
        </div>
        <Link href="/booking" className="text-brand-primary text-[1.3rem] font-semibold shrink-0">
          Xem tất cả
        </Link>
      </div>

      {/* Tabs — ẩn khi đang search */}
      {!q && (
        <div className="flex gap-[0.8rem] px-[1.6rem] mb-[1.6rem] overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {TABS.map((tab) => {
            const active = filterSbu === tab.key;
            return (
              <button
                key={tab.key}
                disabled
                className={`shrink-0 flex items-center gap-[0.5rem] px-[1.4rem] py-[0.7rem] rounded-full text-[1.3rem] font-semibold border transition-all duration-200 ${
                  active
                    ? "bg-brand-primary text-white border-brand-primary shadow-md"
                    : "bg-white text-neutral-50 border-neutral-10"
                }`}
              >
                {tab.label}
                <span className={`text-[1.1rem] font-bold px-[0.5rem] py-[0.1rem] rounded-full ${
                  active ? "bg-white/25 text-white" : "bg-neutral-05 text-neutral-40"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Cards */}
      <div className="px-[1.6rem] overflow-hidden">
        {filtered.length > 0 ? (
          <div className="flex gap-[1.2rem] overflow-x-auto pb-[2rem] snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
            {filtered.map((pkg) => (
              <TourPackageCard key={pkg.id} pkg={pkg} className="snap-start flex-shrink-0 w-[25rem]" />
            ))}
          </div>
        ) : (
          <div className="py-[3.2rem] text-center">
            <p className="text-neutral-40 text-[1.5rem] font-semibold mb-[0.4rem]">Không tìm thấy kết quả</p>
            <p className="text-neutral-30 text-[1.3rem]">Thử từ khoá khác hoặc xoá bộ lọc</p>
          </div>
        )}
      </div>
    </section>
  );
}
