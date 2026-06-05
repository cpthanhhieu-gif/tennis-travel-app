"use client";

import Link from "next/link";
import { MapPin, CheckCircle, Users, Leaf, X } from "lucide-react";
import type { LEIESGTour } from "@/lib/mock-data";

export default function LEIModal({ tour, onClose }: { tour: LEIESGTour; onClose: () => void }) {
  const { breakdown } = tour.lei;
  const criteria = [
    { label: "Sân tennis địa phương",   score: breakdown.localCourt,     weight: "30%", icon: <MapPin size={16} /> },
    { label: "HLV / Partner bản địa",   score: breakdown.localPro,       weight: "30%", icon: <CheckCircle size={16} /> },
    { label: "Ẩm thực & văn hóa local", score: breakdown.localCulture,   weight: "25%", icon: <Users size={16} /> },
    { label: "Di chuyển bản địa",        score: breakdown.localTransport, weight: "15%", icon: <Leaf size={16} /> },
  ];

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-neutral-90/70" />
      <div
        className="relative w-full bg-neutral-01 rounded-t-2xl px-4 pt-5 pb-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-neutral-10 mx-auto mb-4" />

        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-medium text-neutral-30 uppercase tracking-wide mb-1">Chỉ số</p>
            <p className="text-xl font-bold text-neutral-90">LEI Score</p>
            <p className="text-xs text-neutral-40 mt-1">{tour.name}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-2 rounded-full hover:bg-neutral-03 transition-all duration-150 ease-out focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
          >
            <X size={18} className="text-neutral-50" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4 p-3 bg-brand-tint-light rounded-xl">
          <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
            <span className="text-xl font-extrabold text-neutral-01">{tour.lei.total}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-90">{tour.lei.badge}</p>
            <p className="text-xs text-neutral-40">Điểm trải nghiệm bản địa của tour này</p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          {criteria.map((c) => (
            <div key={c.label} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-tint flex items-center justify-center text-brand-primary shrink-0">
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-neutral-90 truncate">{c.label}</p>
                  <span className="text-xs text-neutral-30 ml-2 shrink-0">{c.weight}</span>
                </div>
                <div className="h-1 bg-neutral-05 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${c.score}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-bold text-brand-primary w-6 text-right shrink-0">{c.score}</span>
            </div>
          ))}
        </div>

        <Link
          href={`/booking?dest=${tour.bookingDestinationId}`}
          onClick={onClose}
          className="flex items-center justify-center w-full bg-brand-primary text-neutral-01 font-bold text-base rounded-lg py-4 transition-all duration-150 ease-out active:scale-95 focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
        >
          Đặt tour ngay
        </Link>
      </div>
    </div>
  );
}
