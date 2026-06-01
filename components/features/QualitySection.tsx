"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { qualityIndices, esgBreakdown } from "@/lib/mock-data";

function SignatureBottomsheet({ onClose }: { onClose: () => void }) {
  const indices = Object.values(qualityIndices);

  const ROWS = [
    {
      key: "LEI", fullName: "Living Experience Index", score: indices.find(i => i.label === "LEI")?.value ?? 84, max: 100, threshold: 75,
      desc: "Trải nghiệm lưu trú tại resort 5 sao, spa phục hồi sau thi đấu và private dining view biển — đo trực tiếp từng chuyến đi.",
    },
    {
      key: "FEI", fullName: "Food Experience Index", score: indices.find(i => i.label === "FEI")?.value ?? 89, max: 100, threshold: 85,
      desc: "Menu phục hồi cá nhân hoá theo NTRP, chef bản địa với nguyên liệu trong bán kính 50km, cooking class tùy chọn.",
    },
    {
      key: "ESG", fullName: "ESG Score", score: esgBreakdown.total, max: 100, threshold: 80,
      desc: `Bù carbon mỗi tour, sân LED tiết kiệm điện, 100% HLV và chef địa phương. E ${esgBreakdown.e.score}/${esgBreakdown.e.max} · S ${esgBreakdown.s.score}/${esgBreakdown.s.max} · G ${esgBreakdown.g.score}/${esgBreakdown.g.max}.`,
    },
  ];

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" style={{ zIndex: 56 }} />
      <div
        role="dialog" aria-modal="true" aria-label="Tiêu chuẩn Signature"
        className="fixed left-0 right-0 bottom-0 flex flex-col bg-white rounded-t-[2.4rem] shadow-[rgba(0,0,0,0.3)_0px_-8px_40px]"
        style={{ zIndex: 60, maxHeight: "82%" }}
      >
        {/* Drag handle */}
        <div className="shrink-0 flex justify-center pt-[1.2rem] pb-[0.8rem]">
          <div className="w-[4rem] h-[0.4rem] bg-neutral-10 rounded-full" />
        </div>

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-[2rem] pb-[1.4rem] border-b border-neutral-05">
          <div>
            <p className="font-bold text-[1.7rem] text-neutral-90">Tiêu chuẩn Signature</p>
            <p className="text-neutral-40 text-[1.2rem] mt-[0.2rem]">Chuẩn chất lượng độc quyền Vietravel Tennis</p>
          </div>
          <button
            onClick={onClose}
            className="w-[3.4rem] h-[3.4rem] rounded-full bg-neutral-05 hover:bg-neutral-10 flex items-center justify-center transition-colors"
            aria-label="Đóng"
          >
            <ChevronDown size={18} className="text-neutral-50" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-[2rem] py-[1.6rem] space-y-[1.6rem]" style={{ scrollbarWidth: "none" }}>
          {ROWS.map(({ key, fullName, score, max, threshold, desc }) => (
            <div key={key} className="flex gap-[1.6rem] p-[1.6rem] bg-neutral-03 rounded-[1.4rem] border border-neutral-05">
              <div className="shrink-0 flex flex-col items-center justify-center w-[5.6rem]">
                <span className="text-[2.2rem] font-extrabold text-brand-primary leading-none">{score}</span>
                <span className="text-[1.0rem] text-neutral-40">/{max}</span>
                <span className="mt-[0.4rem] text-[1.0rem] font-semibold text-neutral-50 bg-white px-[0.5rem] py-[0.15rem] rounded-full border border-neutral-10">
                  ≥{threshold}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[1.4rem] text-neutral-90 mb-[0.2rem]">{key}</p>
                <p className="text-neutral-40 text-[1.2rem] mb-[0.6rem]">{fullName}</p>
                <p className="text-neutral-60 text-[1.3rem] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="shrink-0 px-[2rem] pt-[1rem] pb-[2.8rem] border-t border-neutral-05">
          <Link href="/booking" onClick={onClose}>
            <button className="w-full py-[1.4rem] rounded-[4rem] bg-brand-primary text-white font-bold text-[1.5rem] flex items-center justify-center gap-[0.6rem] hover:bg-brand-primary-dark transition-colors">
              Đặt tour ngay
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default function QualitySection() {
  const [open, setOpen] = useState(false);
  const indices = Object.values(qualityIndices);
  const composite = Math.round(
    indices.reduce((sum, idx) => sum + idx.value, 0) / indices.length
  );
  const compositePass = indices.every((idx) => idx.value >= idx.threshold);

  return (
    <section className="pt-[2.4rem] pb-[2.4rem] bg-neutral-01 border-t border-neutral-05" aria-labelledby="quality-title">
      <div className="px-[1.6rem]">
        <h2 id="quality-title" className="text-[1.8rem] font-bold text-neutral-90 mb-[0.3rem]">
          Tại sao chọn <span className="text-brand-primary">Vietravel Tennis</span>?
        </h2>
        <p className="text-neutral-40 text-[1.3rem] mb-[1.6rem]">
          Chuẩn chất lượng độc quyền — đo thực tế từng chuyến đi
        </p>

        <div className="bg-white rounded-[2rem] border border-neutral-05 shadow-[rgba(0,0,0,0.08)_0px_4px_16px] overflow-hidden">
          {/* Score row */}
          <div
            className="flex items-center gap-[1.6rem] px-[2rem] py-[2rem]"
            style={{ background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)" }}
          >
            <div className="relative w-[7.2rem] h-[7.2rem] shrink-0">
              <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="7" />
                <circle
                  cx="40" cy="40" r="34" fill="none" stroke="#2563eb" strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - composite / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[2.2rem] font-extrabold text-brand-primary leading-none">{composite}</span>
                <span className="text-[1.0rem] text-neutral-40 leading-none">/100</span>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-[1.2rem] text-neutral-50 mb-[0.2rem]">Signature Score</p>
              <p className="text-[1.8rem] font-extrabold text-neutral-90 leading-tight">Vượt chuẩn<br />3 chỉ số</p>
              {compositePass && (
                <span className="inline-flex items-center gap-[0.4rem] bg-green-50 text-green-700 text-[1.1rem] font-bold px-[0.8rem] py-[0.3rem] rounded-full mt-[0.6rem]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5.5" fill="#16a34a"/>
                    <path d="M3.5 6l1.7 1.7 3.3-3.3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Đạt chuẩn Signature
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="px-[2rem] py-[1.6rem]">
            <button
              onClick={() => setOpen(true)}
              className="w-full py-[1.3rem] rounded-[4rem] border-2 border-brand-primary text-brand-primary font-bold text-[1.4rem] hover:bg-brand-tint transition-colors flex items-center justify-center gap-[0.6rem]"
            >
              Xem tiêu chuẩn
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && <SignatureBottomsheet onClose={() => setOpen(false)} />}
    </section>
  );
}
