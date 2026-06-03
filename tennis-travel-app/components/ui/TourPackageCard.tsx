"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { type TourPackage, formatVNDShort } from "@/lib/mock-data";
import { Clock, Users, MapPin, Check } from "lucide-react";

const SBU_LABEL: Record<number, string> = { 1: "Leisure", 2: "Tournament", 3: "Premium" };

const DEST_LABEL: Record<string, string> = {
  danang:    "Đà Nẵng",
  phuquoc:   "Phú Quốc",
  nhatrang:  "Nha Trang",
  phanthiet: "Phan Thiết",
};

interface Props {
  pkg: TourPackage;
  className?: string;
}

export default function TourPackageCard({ pkg, className = "" }: Props) {
  return (
    <article
      className={`rounded-xl overflow-hidden bg-neutral-01 border border-neutral-05 shadow-card flex flex-col ${className}`}
    >
      {/* Image */}
      <div className="relative h-[var(--tour-card-image-height)]">
        <Image
          src={pkg.image}
          alt={`Gói tour ${pkg.name}`}
          fill
          className="object-cover"
          sizes="250px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,14,26,0.70)] to-transparent" />

        {/* Category badge */}
        <span
          className="absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-extrabold text-white shadow-sm"
          style={{ backgroundColor: pkg.color }}
        >
          {SBU_LABEL[pkg.sbu] ?? `SBU ${pkg.sbu}`}
        </span>

        {/* Arrow icon */}
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white font-bold text-sm leading-tight">{pkg.name}</p>
          <p className="text-white/70 text-xs italic">{pkg.tagline}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Meta: duration + segment */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-neutral-40 text-xs mb-3">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Clock size={12} aria-hidden="true" />
            {pkg.duration.join(" – ")}
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Users size={12} aria-hidden="true" />
            {pkg.targetSegment.split("(")[0].trim()}
          </span>
        </div>

        {/* Destinations */}
        <div className="flex items-center gap-1 flex-wrap mb-3">
          <MapPin size={11} className="text-neutral-30 shrink-0" aria-hidden="true" />
          {pkg.destinations.map((d) => (
            <span key={d} className="text-xs text-neutral-50 bg-neutral-03 px-2 py-0.5 rounded-full">
              {DEST_LABEL[d] ?? d}
            </span>
          ))}
        </div>

        {/* MyLeague badge — SBU2 only */}
        {pkg.sbu === 2 && (
          <div className="flex items-center gap-1 mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--color-myleague-bg)] text-white text-xs font-bold">
              🏆 Tích hợp MyLeague.vn
            </span>
          </div>
        )}

        {/* Highlights — top 2 */}
        <div className="flex flex-col gap-1 mb-3">
          {pkg.highlights.slice(0, 2).map((h) => (
            <span key={h} className="flex items-start gap-1 text-xs text-[var(--color-neutral-40)] leading-snug">
              <Check size={11} className="text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
              {h}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between mt-auto pt-3 border-t border-neutral-05 gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-neutral-40 text-xs">Từ</p>
            <p className="text-sm font-extrabold text-brand-secondary leading-tight">
              {formatVNDShort(pkg.priceRange.min)}
              <span className="text-neutral-40 text-xs font-normal">/người</span>
            </p>
          </div>
          <Link href={`/booking?package=${pkg.id}`} className="shrink-0">
            <Button variant="primary" size="sm">Đặt ngay</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
