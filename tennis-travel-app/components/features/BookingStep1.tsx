"use client";

import Image from "next/image";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { useBooking } from "@/lib/BookingContext";
import Link from "next/link";
import { tours, tourPackages, formatVNDShort, leiEsgTours, type Tour, type ESGTier } from "@/lib/mock-data";
import { Check, Hash, ChevronDown, Calendar, MapPin, Clock, Target, ArrowRight } from "lucide-react";


const ESG_TEASER: Record<ESGTier, { emoji: string; label: string; bg: string; text: string }> = {
  "Green Champion": { emoji: "🟢", label: "Green Champion", bg: "bg-success-light", text: "text-success"     },
  "Eco Friendly":   { emoji: "🟡", label: "Eco Friendly",   bg: "bg-yellow-light",  text: "text-yellow-dark" },
  "Standard":       { emoji: "⚪", label: "Standard",       bg: "bg-neutral-03",    text: "text-neutral-40"  },
};

interface Props { onNext: () => void }

const PKG_FILTERS = [
  { id: "all",  label: "Tất cả" },
  { id: "sbu1", label: "Khám phá" },
  { id: "sbu2", label: "Chinh phục" },
  { id: "sbu3", label: "Đẳng cấp" },
];

const DEST_FILTERS = [
  { id: "all",       label: "Tất cả" },
  { id: "danang",    label: "Đà Nẵng" },
  { id: "phuquoc",   label: "Phú Quốc" },
  { id: "nhatrang",  label: "Nha Trang" },
  { id: "phanthiet", label: "Phan Thiết" },
];

const BADGE_STYLES: Record<string, string> = {
  "Phổ biến":   "bg-brand-tint text-brand-primary border-brand-light",
  "Hot":        "bg-yellow-light text-yellow-dark border-yellow-accent/40",
  "Mới":        "bg-success-light text-success border-success/30",
  "Còn ít chỗ": "bg-error-light text-error border-error/30",
};

const PKG_COLORS: Record<string, string> = {
  sbu1: "bg-navy-800 text-neutral-01",
  sbu2: "bg-bronze-600 text-neutral-01",
  sbu3: "bg-tier-diamond text-neutral-01",
};

function DepartureList({
  tour,
  selectedCode,
  onSelect,
}: {
  tour: Tour;
  selectedCode: string;
  onSelect: (code: string) => void;
}) {
  return (
    <div className="mt-2 rounded-md border border-neutral-10 overflow-hidden shadow-card">
      <div className="bg-neutral-03 px-4 pt-2.5 pb-3 border-b border-neutral-10">
        <div className="w-[3.2rem] h-[0.4rem] rounded-full bg-neutral-10 mx-auto mb-2.5" aria-hidden="true" />
        <p className="font-bold text-[1.4rem] text-neutral-90">Lịch trình khởi hành</p>
      </div>
      <div className="bg-neutral-01 divide-y divide-neutral-10">
        {tour.departureSchedules.map((s) => {
          const isSel = s.code === selectedCode;
          return (
            <article
              key={s.code}
              className={`px-4 py-3 transition-colors duration-150 ${isSel ? "bg-brand-tint" : "hover:bg-neutral-03"}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold text-[1.5rem] text-neutral-90">{s.dateLabel}</span>
                  <span className="text-neutral-40 text-[1.2rem]">{s.dayOfWeek}</span>
                </div>
                <span className="font-bold text-[1.4rem] text-brand-secondary whitespace-nowrap">
                  {formatVNDShort(s.price)}
                </span>
              </div>
              <div className="h-px bg-neutral-10 mb-1.5" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Hash size={11} className="text-neutral-30 shrink-0" />
                  <span className="text-neutral-30 text-[1.1rem] font-mono">{s.code}</span>
                </div>
                {isSel ? (
                  <div className="flex items-center gap-1 text-brand-primary">
                    <Check size={13} />
                    <span className="text-[1.2rem] font-semibold">Đã chọn</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelect(s.code)}
                    className="px-3 py-1 rounded-xs border border-neutral-10 text-neutral-50 text-[1.2rem] font-semibold hover:border-brand-primary hover:text-brand-primary hover:bg-brand-tint transition-all duration-150 min-h-11"
                  >
                    Chọn
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function BookingStep1({ onNext }: Props) {
  const { booking, updateBooking } = useBooking();
  const searchParams = useSearchParams();

  const [pkgFilter, setPkgFilter]   = useState("all");
  const [destFilter, setDestFilter] = useState(searchParams.get("dest") ?? "all");
  const leiTourIdParam = searchParams.get("leiTourId") ?? undefined;
  const [selectedTourId, setSelectedTourId] = useState(booking.tourId || "dn-sbu1");
  const [scheduleOpen, setScheduleOpen]     = useState(false);
  const [people, setPeople]                 = useState(booking.numPeople || 2);

  const filtered = tours.filter((t) => {
    const pkgOk  = pkgFilter  === "all" || t.packageId     === pkgFilter;
    const destOk = destFilter === "all" || t.destinationId === destFilter;
    return pkgOk && destOk;
  });

  const selectedTour = tours.find((t) => t.id === selectedTourId) ?? tours[0];
  const firstSchedule = selectedTour.departureSchedules[0];
  const [scheduleCode, setScheduleCode] = useState(booking.departureCode || firstSchedule.code);

  const selectedSchedule =
    selectedTour.departureSchedules.find((s) => s.code === scheduleCode) ?? firstSchedule;

  const handleSelectTour = (tour: Tour) => {
    setSelectedTourId(tour.id);
    setScheduleCode(tour.departureSchedules[0].code);
    setScheduleOpen(true);
  };

  const handleSelectSchedule = (code: string) => {
    setScheduleCode(code);
    setScheduleOpen(false);
  };

  const handleNext = () => {
    const pkg = tourPackages.find((p) => p.id === selectedTour.packageId);
    const activeLeiTour = leiTourIdParam
      ? leiEsgTours.find((l) => l.id === leiTourIdParam)
      : undefined;
    updateBooking({
      tourId: selectedTour.id,
      packageId: selectedTour.packageId,
      destination: selectedTour.destinationId,
      departureDate: selectedSchedule.date,
      departureCode: selectedSchedule.code,
      numPeople: people,
      totalPrice: (pkg?.priceRange.min ?? selectedSchedule.price) * people,
      leiTourId: activeLeiTour?.id,
      leiScore:  activeLeiTour?.lei.total,
      esgTier:   activeLeiTour?.esg.tier,
    });
    onNext();
  };

  const contextLeiTour = leiTourIdParam
    ? leiEsgTours.find((l) => l.id === leiTourIdParam)
    : undefined;

  return (
    <div>
      <h2 className="text-[2.2rem] font-bold text-neutral-90 mb-5">
        Chọn hành trình &amp; ngày khởi hành
      </h2>

      {/* Context banner — chỉ hiện khi user đến từ LEI tour detail */}
      {contextLeiTour && (
        <div className="flex items-center gap-2.5 bg-brand-tint border border-brand-light/40 rounded-lg px-3 py-2.5 mb-5">
          <span className="text-brand-primary text-[1.4rem] shrink-0">⭐</span>
          <div className="min-w-0">
            <p className="text-brand-primary font-semibold text-[1.3rem] truncate">
              {contextLeiTour.name}
            </p>
            <p className="text-neutral-40 text-[1.2rem]">
              LEI {contextLeiTour.lei.total}/100 · {contextLeiTour.esg.tier}
            </p>
          </div>
        </div>
      )}

      {/* Filter chips — Package */}
      <div className="mb-3">
        <p className="text-[1.2rem] font-semibold text-neutral-40 mb-2 uppercase tracking-wide">
          Loại hành trình
        </p>
        <div className="flex gap-2 flex-wrap">
          {PKG_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setPkgFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-[1.3rem] font-semibold border transition-all duration-150 min-h-11 ${
                pkgFilter === f.id
                  ? "bg-brand-primary text-neutral-01 border-brand-primary"
                  : "bg-neutral-01 text-neutral-50 border-neutral-10 hover:border-brand-light hover:text-brand-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter chips — Destination */}
      <div className="mb-5">
        <p className="text-[1.2rem] font-semibold text-neutral-40 mb-2 uppercase tracking-wide">
          Điểm đến
        </p>
        <div className="flex gap-2 flex-wrap">
          {DEST_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setDestFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-[1.3rem] font-semibold border transition-all duration-150 min-h-11 ${
                destFilter === f.id
                  ? "bg-brand-primary text-neutral-01 border-brand-primary"
                  : "bg-neutral-01 text-neutral-50 border-neutral-10 hover:border-brand-light hover:text-brand-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="text-neutral-40 text-[1.3rem] mb-4">
        {filtered.length} hành trình phù hợp
      </p>

      {/* Tour catalog */}
      <div className="space-y-3 mb-6">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-neutral-30 text-[1.4rem]">
            Không có tour phù hợp với bộ lọc này.
          </div>
        )}

        {filtered.map((tour) => {
          const isSelected = tour.id === selectedTourId;
          const pkgInfo    = tourPackages.find((p) => p.id === tour.packageId);
          const leiTour = leiTourIdParam
            ? leiEsgTours.find((l) => l.id === leiTourIdParam)
            : leiEsgTours.find((l) => l.bookingDestinationId === tour.destinationId);

          return (
            <div key={tour.id}>
              <article
                className={`rounded-md border-2 overflow-hidden transition-all duration-200 ${
                  isSelected
                    ? "border-brand-primary shadow-floating"
                    : "border-neutral-10 hover:border-brand-light"
                }`}
              >
                {/* Image */}
                <div className="relative h-[13rem] w-full">
                  <Image
                    src={tour.image}
                    alt={tour.name}
                    fill
                    className="object-cover"
                    sizes="311px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-90/55 via-transparent to-transparent" />
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-xs text-[1.1rem] font-bold ${PKG_COLORS[tour.packageId]}`}>
                    {pkgInfo?.name}
                  </div>
                  {tour.badge && (
                    <span className={`absolute top-2 right-2 px-2 py-1 rounded-full border text-[1.1rem] font-semibold ${BADGE_STYLES[tour.badge]}`}>
                      {tour.badge}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 flex items-end justify-between">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-neutral-03 shrink-0" aria-hidden="true" />
                      <span className="text-neutral-03 text-[1.2rem] font-semibold">{tour.destinationName}</span>
                      <span className="text-neutral-30 text-[1.1rem] ml-0.5">· {tour.duration}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-30 text-[1rem]">từ </span>
                      <span className="font-extrabold text-[1.4rem] text-neutral-01">
                        {formatVNDShort(tour.departureSchedules[0].price)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-neutral-01 px-3 pt-2.5 pb-3">
                  <p className="font-bold text-[1.5rem] text-neutral-90 leading-snug mb-1.5">
                    {tour.name}
                  </p>
                  <div className="flex items-start gap-1 mb-1.5">
                    <MapPin size={12} className="text-neutral-30 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-neutral-40 text-[1.2rem] leading-tight">{tour.resort}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    <div className="flex items-center gap-1 bg-neutral-03 rounded-full px-2 py-1">
                      <Clock size={11} className="text-neutral-40" aria-hidden="true" />
                      <span className="text-neutral-50 text-[1.1rem] font-medium">{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-neutral-03 rounded-full px-2 py-1">
                      <Target size={11} className="text-neutral-40" aria-hidden="true" />
                      <span className="text-neutral-50 text-[1.1rem] font-medium">{tour.ntrpLabel}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2.5 pb-2.5 border-b border-neutral-10">
                      {tour.highlights.map((h) => (
                        <span key={h} className="flex items-center gap-1 text-brand-primary text-[1.2rem]">
                          <Check size={11} aria-hidden="true" />
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* LEI & ESG teaser — chỉ hiện khi tour được chọn và có leiTour tương ứng */}
                  {isSelected && leiTour && (() => {
                    const esg = ESG_TEASER[leiTour.esg.tier];
                    return (
                      <div className="mb-2.5 p-2.5 rounded-lg bg-brand-tint-light border border-brand-tint">
                        {/* Title row */}
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-brand-primary uppercase tracking-wide">
                            ⭐ Điểm bản địa &amp; xanh
                          </p>
                          <Link
                            href={`/tour/${leiTour.id}`}
                            className="flex items-center gap-0.5 text-xs font-semibold text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1 rounded min-h-[44px] px-1"
                            aria-label={`Xem chi tiết LEI và ESG của tour ${leiTour.name}`}
                          >
                            Chi tiết
                            <ArrowRight size={11} aria-hidden="true" />
                          </Link>
                        </div>

                        {/* Scores row */}
                        <div className="flex items-center gap-3">
                          {/* LEI mini bar */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-neutral-40 uppercase tracking-wide">LEI</span>
                              <span className="text-xs font-extrabold text-brand-primary">{leiTour.lei.total}/100</span>
                            </div>
                            <div className="h-1 rounded-full bg-brand-tint overflow-hidden">
                              <div
                                className="h-full bg-brand-primary rounded-full"
                                style={{ width: `${leiTour.lei.total}%` }}
                              />
                            </div>
                          </div>

                          {/* ESG badge */}
                          <div className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full ${esg.bg}`}>
                            <span className="text-xs leading-none" aria-hidden="true">{esg.emoji}</span>
                            <span className={`text-xs font-semibold leading-none ${esg.text}`}>{esg.label}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-neutral-30 text-[1.2rem]">Từ </span>
                      <span className="font-extrabold text-[1.8rem] text-brand-secondary">
                        {formatVNDShort(tour.departureSchedules[0].price)}
                      </span>
                      <span className="text-neutral-30 text-[1.2rem]">/người</span>
                    </div>
                    {isSelected ? (
                      <div className="flex items-center gap-1 text-brand-primary text-[1.3rem] font-semibold">
                        <Check size={14} />
                        Đã chọn
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSelectTour(tour)}
                        className="px-4 py-2 rounded-md bg-brand-primary text-neutral-01 text-[1.3rem] font-semibold hover:bg-brand-primary-dark transition-colors duration-150 min-h-11"
                      >
                        Chọn hành trình
                      </button>
                    )}
                  </div>
                </div>
              </article>

              {isSelected && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setScheduleOpen((v) => !v)}
                    aria-expanded={scheduleOpen}
                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-md border-2 transition-all duration-150 min-h-11 ${
                      scheduleOpen
                        ? "border-brand-primary bg-brand-tint"
                        : "border-neutral-10 bg-neutral-03 hover:border-brand-light"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Calendar size={15} className="text-brand-primary shrink-0" />
                      <div className="text-left min-w-0">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="font-bold text-[1.4rem] text-neutral-90 whitespace-nowrap">
                            {selectedSchedule.dateLabel}
                          </span>
                          <span className="text-neutral-40 text-[1.2rem] whitespace-nowrap">
                            {selectedSchedule.dayOfWeek}
                          </span>
                        </div>
                        <p className="text-brand-secondary font-semibold text-[1.2rem]">
                          {formatVNDShort(selectedSchedule.price)}/người
                        </p>
                        <p className="text-neutral-30 text-[1rem] font-mono truncate">
                          {selectedSchedule.code}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-neutral-40 transition-transform duration-200 shrink-0 ${scheduleOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {scheduleOpen && (
                    <DepartureList
                      tour={selectedTour}
                      selectedCode={scheduleCode}
                      onSelect={handleSelectSchedule}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* People counter */}
      <div className="mb-8">
        <label htmlFor="num-people" className="block text-[1.4rem] font-bold text-neutral-50 mb-3">
          Số người tham gia
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setPeople(Math.max(1, people - 1))}
            className="w-11 h-11 rounded-full bg-neutral-03 border border-neutral-10 text-neutral-90 font-bold text-[2rem] hover:bg-brand-tint hover:border-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors duration-150"
            aria-label="Giảm số người"
          >
            −
          </button>
          <input
            id="num-people"
            type="number"
            min={1}
            max={20}
            value={people}
            onChange={(e) => setPeople(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-[8rem] text-center px-3 py-3 rounded-md bg-neutral-03 text-neutral-90 font-bold text-[1.8rem] focus:outline-none focus:ring-2 focus:ring-brand-light min-h-11 border-0"
          />
          <button
            type="button"
            onClick={() => setPeople(Math.min(20, people + 1))}
            className="w-11 h-11 rounded-full bg-neutral-03 border border-neutral-10 text-neutral-90 font-bold text-[2rem] hover:bg-brand-tint hover:border-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors duration-150"
            aria-label="Tăng số người"
          >
            +
          </button>
          <span className="text-neutral-30 text-[1.4rem]">(tối đa 20)</span>
        </div>
      </div>

      <Button variant="primary" size="lg" className="w-full" onClick={handleNext}>
        Tiếp theo — Đánh giá trình độ
      </Button>
    </div>
  );
}
