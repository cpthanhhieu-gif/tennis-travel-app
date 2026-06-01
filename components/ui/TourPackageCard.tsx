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
      className={`rounded-[1.6rem] overflow-hidden bg-neutral-01 border border-neutral-05 shadow-[rgba(0,0,0,0.08)_0px_2px_12px] flex flex-col ${className}`}
    >
      {/* Image */}
      <div className="relative h-[15rem]">
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
          className="absolute top-[1rem] left-[1rem] px-[0.9rem] py-[0.35rem] rounded-full text-[1.1rem] font-extrabold text-white shadow-sm"
          style={{ backgroundColor: pkg.color }}
        >
          {SBU_LABEL[pkg.sbu] ?? `SBU ${pkg.sbu}`}
        </span>
        {/* Arrow icon */}
        <div className="absolute top-[1rem] right-[1rem] w-[3rem] h-[3rem] rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
        <div className="absolute bottom-[1rem] left-[1rem] right-[1rem]">
          <p className="text-white font-bold text-[1.5rem] leading-tight">{pkg.name}</p>
          <p className="text-white/70 text-[1.2rem] italic">{pkg.tagline}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-[1.4rem] flex flex-col flex-1">
        {/* Meta: duration range + target segment */}
        <div className="flex flex-wrap items-center gap-x-[1.2rem] gap-y-[0.4rem] text-neutral-40 text-[1.2rem] mb-[1rem]">
          <span className="flex items-center gap-[0.3rem] whitespace-nowrap">
            <Clock size={12} aria-hidden="true" />
            {pkg.duration.join(" – ")}
          </span>
          <span className="flex items-center gap-[0.3rem] whitespace-nowrap">
            <Users size={12} aria-hidden="true" />
            {pkg.targetSegment.split("(")[0].trim()}
          </span>
        </div>

        {/* Destinations */}
        <div className="flex items-center gap-[0.5rem] flex-wrap mb-[1rem]">
          <MapPin size={11} className="text-neutral-30 shrink-0" aria-hidden="true" />
          {pkg.destinations.map((d) => (
            <span key={d} className="text-[1.1rem] text-neutral-50 bg-neutral-03 px-[0.7rem] py-[0.2rem] rounded-full">
              {DEST_LABEL[d] ?? d}
            </span>
          ))}
        </div>

        {/* MyLeague badge — SBU2 only */}
        {pkg.sbu === 2 && (
          <div className="flex items-center gap-[0.5rem] mb-[0.8rem]">
            <span className="inline-flex items-center gap-[0.4rem] px-[0.8rem] py-[0.3rem] rounded-full bg-[#1a3a6b] text-white text-[1.0rem] font-bold">
              🏆 Tích hợp MyLeague.vn
            </span>
          </div>
        )}

        {/* Highlights — top 2 */}
        <div className="flex flex-col gap-[0.4rem] mb-[1.2rem]">
          {pkg.highlights.slice(0, 2).map((h) => (
            <span key={h} className="flex items-start gap-[0.5rem] text-[1.2rem] text-neutral-60 leading-snug">
              <Check size={11} className="text-brand-primary shrink-0 mt-[0.2rem]" aria-hidden="true" />
              {h}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between mt-auto pt-[1rem] border-t border-neutral-05 gap-[0.8rem]">
          <div className="min-w-0">
            <p className="text-neutral-40 text-[1.1rem]">Từ</p>
            <p className="text-[1.6rem] font-extrabold text-brand-secondary leading-tight whitespace-nowrap">
              {formatVNDShort(pkg.priceRange.min)}
              <span className="text-neutral-40 text-[1.1rem] font-normal">/người</span>
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
