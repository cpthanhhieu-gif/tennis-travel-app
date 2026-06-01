"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { useBooking } from "@/lib/BookingContext";
import { tours, tourPackages, formatVNDShort, type Tour } from "@/lib/mock-data";
import { Check, Hash, ChevronDown, Calendar, MapPin, Clock, Target } from "lucide-react";

interface Props { onNext: () => void }

const PKG_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "sbu1", label: "Leisure" },
  { id: "sbu2", label: "Tournament" },
  { id: "sbu3", label: "Premium" },
];

const DEST_FILTERS = [
  { id: "all", label: "Tất cả" },
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
  sbu1: "bg-[#1e3a5f] text-white",
  sbu2: "bg-[#b45309] text-white",
  sbu3: "bg-[#7c3aed] text-white",
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
    <div className="mt-[0.8rem] rounded-[0.8rem] border border-neutral-10 overflow-hidden shadow-[rgba(0,0,0,0.06)_0px_4px_12px]">
      <div className="bg-neutral-03 px-[1.6rem] pt-[1rem] pb-[1.2rem] border-b border-neutral-10">
        <div className="w-[3.2rem] h-[0.4rem] rounded-full bg-neutral-10 mx-auto mb-[1rem]" aria-hidden="true" />
        <p className="font-bold text-[1.4rem] text-neutral-90">Lịch trình khởi hành</p>
      </div>
      <div className="bg-neutral-01 divide-y divide-neutral-10">
        {tour.departureSchedules.map((s) => {
          const isSel = s.code === selectedCode;
          return (
            <article
              key={s.code}
              className={`px-[1.6rem] py-[1.2rem] transition-colors ${isSel ? "bg-brand-tint" : "hover:bg-neutral-03"}`}
            >
              <div className="flex items-center justify-between mb-[0.6rem]">
                <div className="flex items-baseline gap-[0.6rem]">
                  <span className="font-bold text-[1.5rem] text-neutral-90">{s.dateLabel}</span>
                  <span className="text-neutral-40 text-[1.2rem]">{s.dayOfWeek}</span>
                </div>
                <span className="font-bold text-[1.4rem] text-brand-secondary whitespace-nowrap">
                  {formatVNDShort(s.price)}
                </span>
              </div>
              <div className="h-[1px] bg-neutral-10 mb-[0.6rem]" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[0.4rem]">
                  <Hash size={11} className="text-neutral-30 shrink-0" />
                  <span className="text-neutral-30 text-[1.1rem] font-mono">{s.code}</span>
                </div>
                {isSel ? (
                  <div className="flex items-center gap-[0.4rem] text-brand-primary">
                    <Check size={13} />
                    <span className="text-[1.2rem] font-semibold">Đã chọn</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelect(s.code)}
                    className="px-[1.2rem] py-[0.5rem] rounded-[0.6rem] border border-neutral-10 text-neutral-50 text-[1.2rem] font-semibold hover:border-brand-primary hover:text-brand-primary hover:bg-brand-tint transition-all min-h-[34px]"
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

  const [pkgFilter, setPkgFilter]   = useState("all");
  const [destFilter, setDestFilter] = useState("all");
  const [selectedTourId, setSelectedTourId] = useState(booking.tourId || "dn-sbu1");
  const [scheduleOpen, setScheduleOpen]     = useState(false);
  const [people, setPeople]                 = useState(booking.numPeople || 2);

  const filtered = tours.filter((t) => {
    const pkgOk  = pkgFilter  === "all" || t.packageId      === pkgFilter;
    const destOk = destFilter === "all" || t.destinationId  === destFilter;
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
    updateBooking({
      tourId: selectedTour.id,
      packageId: selectedTour.packageId,
      destination: selectedTour.destinationId,
      departureDate: selectedSchedule.date,
      departureCode: selectedSchedule.code,
      numPeople: people,
      totalPrice: (pkg?.priceRange.min ?? selectedSchedule.price) * people,
    });
    onNext();
  };

  return (
    <div>
      <h2 className="text-[2.2rem] font-bold text-neutral-90 mb-[2rem]">
        Chọn tour &amp; ngày đi
      </h2>

      {/* Filter chips — Package */}
      <div className="mb-[1.2rem]">
        <p className="text-[1.2rem] font-semibold text-neutral-40 mb-[0.8rem] uppercase tracking-wide">
          Loại tour
        </p>
        <div className="flex gap-[0.8rem] flex-wrap">
          {PKG_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setPkgFilter(f.id)}
              className={`px-[1.4rem] py-[0.6rem] rounded-full text-[1.3rem] font-semibold border transition-all min-h-[34px] ${
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
      <div className="mb-[2rem]">
        <p className="text-[1.2rem] font-semibold text-neutral-40 mb-[0.8rem] uppercase tracking-wide">
          Điểm đến
        </p>
        <div className="flex gap-[0.8rem] flex-wrap">
          {DEST_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setDestFilter(f.id)}
              className={`px-[1.4rem] py-[0.6rem] rounded-full text-[1.3rem] font-semibold border transition-all min-h-[34px] ${
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
      <p className="text-neutral-40 text-[1.3rem] mb-[1.6rem]">
        {filtered.length} tour phù hợp
      </p>

      {/* Tour catalog */}
      <div className="space-y-[1.2rem] mb-[2.4rem]">
        {filtered.length === 0 && (
          <div className="text-center py-[4rem] text-neutral-30 text-[1.4rem]">
            Không có tour phù hợp với bộ lọc này.
          </div>
        )}

        {filtered.map((tour) => {
          const isSelected = tour.id === selectedTourId;
          const pkgInfo = tourPackages.find((p) => p.id === tour.packageId);

          return (
            <div key={tour.id}>
              <article
                className={`rounded-[0.8rem] border-2 overflow-hidden transition-all duration-200 ${
                  isSelected
                    ? "border-brand-primary shadow-[rgba(0,74,130,0.15)_0px_4px_16px]"
                    : "border-neutral-10 hover:border-brand-light"
                }`}
              >
                {/* Image — full width, fixed height */}
                <div className="relative h-[13rem] w-full">
                  <Image
                    src={tour.image}
                    alt={tour.name}
                    fill
                    className="object-cover"
                    sizes="311px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,14,26,0.55)] via-transparent to-transparent" />
                  {/* Top-left: package type badge */}
                  <div className={`absolute top-[0.8rem] left-[0.8rem] px-[0.8rem] py-[0.3rem] rounded-[0.4rem] text-[1.1rem] font-bold ${PKG_COLORS[tour.packageId]}`}>
                    {pkgInfo?.name}
                  </div>
                  {/* Top-right: status badge */}
                  {tour.badge && (
                    <span className={`absolute top-[0.8rem] right-[0.8rem] px-[0.8rem] py-[0.3rem] rounded-full border text-[1.1rem] font-semibold ${BADGE_STYLES[tour.badge]}`}>
                      {tour.badge}
                    </span>
                  )}
                  {/* Bottom overlay: destination + price */}
                  <div className="absolute bottom-0 left-0 right-0 px-[1.2rem] py-[1rem] flex items-end justify-between">
                    <div className="flex items-center gap-[0.4rem]">
                      <MapPin size={12} className="text-neutral-03 shrink-0" aria-hidden="true" />
                      <span className="text-neutral-03 text-[1.2rem] font-semibold">{tour.destinationName}</span>
                      <span className="text-neutral-30 text-[1.1rem] ml-[0.2rem]">· {tour.duration}</span>
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
                <div className="bg-neutral-01 px-[1.2rem] pt-[1rem] pb-[1.2rem]">
                  {/* Title */}
                  <p className="font-bold text-[1.5rem] text-neutral-90 leading-snug mb-[0.6rem]">
                    {tour.name}
                  </p>

                  {/* Resort — full name, no truncation */}
                  <div className="flex items-start gap-[0.4rem] mb-[0.6rem]">
                    <MapPin size={12} className="text-neutral-30 shrink-0 mt-[0.2rem]" aria-hidden="true" />
                    <span className="text-neutral-40 text-[1.2rem] leading-tight">{tour.resort}</span>
                  </div>

                  {/* Meta chips */}
                  <div className="flex flex-wrap gap-[0.6rem] mb-[1rem]">
                    <div className="flex items-center gap-[0.3rem] bg-neutral-03 rounded-full px-[0.8rem] py-[0.3rem]">
                      <Clock size={11} className="text-neutral-40" aria-hidden="true" />
                      <span className="text-neutral-50 text-[1.1rem] font-medium">{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-[0.3rem] bg-neutral-03 rounded-full px-[0.8rem] py-[0.3rem]">
                      <Target size={11} className="text-neutral-40" aria-hidden="true" />
                      <span className="text-neutral-50 text-[1.1rem] font-medium">{tour.ntrpLabel}</span>
                    </div>
                  </div>

                  {/* Highlights — selected only */}
                  {isSelected && (
                    <div className="flex flex-wrap gap-x-[1.2rem] gap-y-[0.3rem] mb-[1rem] pb-[1rem] border-b border-neutral-10">
                      {tour.highlights.map((h) => (
                        <span key={h} className="flex items-center gap-[0.4rem] text-brand-primary text-[1.2rem]">
                          <Check size={11} aria-hidden="true" />
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-neutral-30 text-[1.2rem]">Từ </span>
                      <span className="font-extrabold text-[1.8rem] text-brand-secondary">
                        {formatVNDShort(tour.departureSchedules[0].price)}
                      </span>
                      <span className="text-neutral-30 text-[1.2rem]">/người</span>
                    </div>
                    {isSelected ? (
                      <div className="flex items-center gap-[0.4rem] text-brand-primary text-[1.3rem] font-semibold">
                        <Check size={14} />
                        Đã chọn
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSelectTour(tour)}
                        className="px-[1.6rem] py-[0.8rem] rounded-[0.6rem] bg-brand-primary text-neutral-01 text-[1.3rem] font-semibold hover:bg-[#003DA8] transition-colors min-h-[40px]"
                      >
                        Chọn tour
                      </button>
                    )}
                  </div>
                </div>
              </article>

              {/* Departure schedule — inline below selected card */}
              {isSelected && (
                <div className="mt-[0.8rem]">
                  <button
                    type="button"
                    onClick={() => setScheduleOpen((v) => !v)}
                    aria-expanded={scheduleOpen}
                    className={`w-full flex items-center justify-between gap-[1.2rem] px-[1.4rem] py-[1.2rem] rounded-[0.8rem] border-2 transition-all min-h-[44px] ${
                      scheduleOpen
                        ? "border-brand-primary bg-brand-tint"
                        : "border-neutral-10 bg-neutral-03 hover:border-brand-light"
                    }`}
                  >
                    <div className="flex items-center gap-[1rem] min-w-0">
                      <Calendar size={15} className="text-brand-primary shrink-0" />
                      <div className="text-left min-w-0">
                        <div className="flex items-baseline gap-[0.6rem] flex-wrap">
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
                    <div className="flex items-center shrink-0">
                      <ChevronDown
                        size={16}
                        className={`text-neutral-40 transition-transform duration-200 ${scheduleOpen ? "rotate-180" : ""}`}
                      />
                    </div>
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
      <div className="mb-[3.2rem]">
        <label htmlFor="num-people" className="block text-[1.4rem] font-bold text-neutral-50 mb-[1.2rem]">
          Số người tham gia
        </label>
        <div className="flex items-center gap-[1.6rem]">
          <button
            type="button"
            onClick={() => setPeople(Math.max(1, people - 1))}
            className="w-[4.4rem] h-[4.4rem] rounded-full bg-neutral-03 border border-neutral-10 text-neutral-90 font-bold text-[2rem] hover:bg-brand-tint hover:border-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors"
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
            className="w-[8rem] text-center px-[1.2rem] py-[1.2rem] rounded-[0.8rem] bg-neutral-03 text-neutral-90 font-bold text-[1.8rem] focus:outline-none focus:ring-2 focus:ring-brand-light min-h-[44px] border-0"
          />
          <button
            type="button"
            onClick={() => setPeople(Math.min(20, people + 1))}
            className="w-[4.4rem] h-[4.4rem] rounded-full bg-neutral-03 border border-neutral-10 text-neutral-90 font-bold text-[2rem] hover:bg-brand-tint hover:border-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors"
            aria-label="Tăng số người"
          >
            +
          </button>
          <span className="text-neutral-30 text-[1.4rem]">(tối đa 20)</span>
        </div>
      </div>

      <Button variant="primary" size="lg" className="w-full" onClick={handleNext}>
        Tiếp tục — Đánh giá NTRP
      </Button>
    </div>
  );
}
