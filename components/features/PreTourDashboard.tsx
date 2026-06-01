"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { danangItinerary, feiScoreData, mockUser } from "@/lib/mock-data";
import { ChevronDown, ChevronUp, MessageCircle, MapPin, CheckCircle, GraduationCap } from "lucide-react";
import VietravelIcon from "@/components/ui/VietravelIcon";

const checklistItems = [
  "Vợt tennis (2–3 cây)",
  "Giày tennis chuyên dụng",
  "Trang phục thể thao",
  "Kem chống nắng SPF 50+",
  "Bình nước cá nhân",
  "Dụng cụ phục hồi (băng, dầu nóng)",
];

const SCHEDULE_TABS = [
  { key: "all", label: "Tất cả", count: 12 },
  { key: "upcoming", label: "Sắp tới", count: 2 },
  { key: "past", label: "Đã đi", count: 8 },
];

export default function PreTourDashboard() {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [scheduleTab, setScheduleTab] = useState("all");

  const toggleChecklist = (item: string) => {
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const checkedCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="min-h-screen px-[1.6rem] md:px-[2.4rem] lg:px-[3.2rem] pt-[5.4rem] pb-[3.2rem] max-w-3xl mx-auto">
      {/* ── Greeting + Schedule tabs (như App 3 reference) ── */}
      <div className="flex items-start justify-between mb-[1.2rem]">
        <div>
          <p className="text-neutral-40 text-[1.3rem] leading-tight">
            Thứ Sáu, 13 Tháng 6, 2026
          </p>
          <h1 className="text-[2.2rem] md:text-[3.2rem] font-bold text-neutral-90">
            Chào {mockUser.firstName} 👋
          </h1>
        </div>
        {/* Avatar */}
        <div className="w-[4.2rem] h-[4.2rem] rounded-full bg-slate-400 flex items-center justify-center text-white font-bold text-[1.6rem] shadow-sm shrink-0">
          {mockUser.firstName.charAt(0)}
        </div>
      </div>

      {/* Schedule filter tabs */}
      <div className="flex gap-[0.8rem] mb-[2.4rem] overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {SCHEDULE_TABS.map((tab) => {
          const active = scheduleTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setScheduleTab(tab.key)}
              className={`shrink-0 flex items-center gap-[0.5rem] px-[1.4rem] py-[0.6rem] rounded-full text-[1.3rem] font-semibold border transition-all duration-200 ${
                active
                  ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                  : "bg-white text-neutral-50 border-neutral-10"
              }`}
            >
              {tab.label}
              <span className={`text-[1.1rem] font-bold px-[0.5rem] py-[0.1rem] rounded-full ${active ? "bg-white/25 text-white" : "bg-neutral-05 text-neutral-40"}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-neutral-40 text-[1.4rem] mb-[2.4rem]">
        Tour Đà Nẵng 3N2D · 13–15/06/2026 · Khởi hành sau{" "}
        <strong className="text-brand-primary">7 ngày nữa</strong>
      </p>

      {/* FEI Menu Card */}
      <section aria-labelledby="fei-title" className="mb-[3.2rem]">
        <h2 id="fei-title" className="text-[1.7rem] font-bold text-neutral-90 mb-[1.6rem] flex items-center gap-[0.8rem]">
          <VietravelIcon id="cuisine-bold" size={18} className="text-success shrink-0" />
          Menu FEI cá nhân hoá
        </h2>
        <div className="bg-neutral-01 rounded-[0.8rem] border border-neutral-10 shadow-[rgba(0,0,0,0.08)_0px_2px_8px] p-[2.4rem]">
          <p className="text-neutral-40 text-[1.4rem] mb-[2rem]">
            Thiết kế riêng cho NTRP {mockUser.ntrpLevel} — {mockUser.ntrpLabel}
          </p>
          <div className="space-y-[1.6rem] mb-[2.4rem]">
            {feiScoreData.subIndices.map((idx) => (
              <div key={idx.code}>
                <div className="flex justify-between text-[1.4rem] mb-[0.4rem]">
                  <span className="text-neutral-50 font-medium">
                    {idx.code} — {idx.name}
                  </span>
                  <span className="text-brand-primary font-bold">{idx.score}/100</span>
                </div>
                <ProgressBar value={idx.score} max={100} color="primary" />
                <p className="text-neutral-30 text-[1.2rem] mt-[0.4rem]">{idx.description}</p>
              </div>
            ))}
          </div>

          {/* Total FEI */}
          <div className="flex items-center justify-between p-[1.6rem] bg-brand-tint rounded-[0.8rem] border border-brand-tint">
            <div>
              <p className="text-neutral-40 text-[1.2rem]">Tổng FEI Score</p>
              <p className="text-[3.2rem] font-extrabold text-brand-primary">
                {feiScoreData.totalFEI}
                <span className="text-[1.6rem] text-neutral-30">/100</span>
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-[0.4rem] px-[1.2rem] py-[0.4rem] bg-success-light text-success rounded-[20px] text-[1.2rem] font-extrabold">
                <VietravelIcon id="check-linear" size={12} className="text-success" /> Signature
              </span>
              <p className="text-neutral-30 text-[1.2rem] mt-[0.4rem]">
                Vượt chuẩn ≥{feiScoreData.targetFEI}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section aria-labelledby="itinerary-title" className="mb-[3.2rem]">
        <h2 id="itinerary-title" className="text-[1.7rem] font-bold text-neutral-90 mb-[1.6rem] flex items-center gap-[0.8rem]">
          <VietravelIcon id="calendar-tick-bold" size={18} className="text-brand-primary shrink-0" />
          Lịch trình chi tiết
        </h2>
        <div className="space-y-[1.2rem]">
          {danangItinerary.map((day) => (
            <div
              key={day.day}
              className="bg-neutral-01 rounded-[0.8rem] border border-neutral-10 shadow-[rgba(0,0,0,0.08)_0px_2px_8px] overflow-hidden"
            >
              <button
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                className="w-full flex items-center justify-between p-[1.6rem] text-left hover:bg-neutral-03 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-inset min-h-[56px]"
                aria-expanded={expandedDay === day.day}
              >
                <div>
                  <p className="font-bold text-[1.6rem] text-neutral-90">
                    Ngày {day.day} — {day.title}
                  </p>
                  <p className="text-neutral-40 text-[1.4rem]">{day.dateLabel}</p>
                </div>
                <div className="flex items-center gap-[1.2rem]">
                  <span className="text-brand-primary text-[1.4rem] font-bold">
                    +{day.totalXp} XP
                  </span>
                  {expandedDay === day.day ? (
                    <ChevronUp size={18} className="text-neutral-40" aria-hidden="true" />
                  ) : (
                    <ChevronDown size={18} className="text-neutral-40" aria-hidden="true" />
                  )}
                </div>
              </button>

              {expandedDay === day.day && (
                <div className="px-[1.6rem] pb-[1.6rem]">
                  <div className="border-t border-neutral-10 pt-[1.6rem] space-y-[1.2rem]">
                    {day.activities.map((act, i) => (
                      <div key={i} className="flex gap-[1.2rem]">
                        <span className="text-brand-primary text-[1.2rem] font-mono shrink-0 w-[4.8rem]">
                          {act.time}
                        </span>
                        <div className="flex-1">
                          <p className="text-neutral-90 text-[1.4rem] leading-relaxed">
                            {act.activity}
                          </p>
                          <p className="text-neutral-30 text-[1.2rem] flex items-center gap-[0.4rem] mt-[0.2rem]">
                            <MapPin size={10} aria-hidden="true" />
                            {act.location}
                            {act.xp > 0 && (
                              <span className="text-brand-light ml-[0.8rem]">+{act.xp} XP</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Coach card */}
      <section aria-labelledby="coach-title" className="mb-[3.2rem]">
        <h2 id="coach-title" className="text-[1.7rem] font-bold text-neutral-90 mb-[1.6rem] flex items-center gap-[0.8rem]">
          <GraduationCap size={18} className="text-brand-primary shrink-0" aria-hidden="true" />
          HLV được phân công
        </h2>
        <div className="bg-neutral-01 rounded-[0.8rem] border border-neutral-10 shadow-[rgba(0,0,0,0.08)_0px_2px_8px] p-[2rem] flex items-center gap-[1.6rem]">
          <div className="relative w-[6.4rem] h-[6.4rem] rounded-full overflow-hidden shrink-0">
            <Image
              src="https://i.pravatar.cc/150?img=33"
              alt="HLV Trần Văn Hùng"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="flex-1">
            <p className="font-bold text-[1.6rem] text-neutral-90">HLV Trần Văn Hùng</p>
            <p className="text-neutral-40 text-[1.4rem]">8 năm kinh nghiệm · NTRP 5.0</p>
            <p className="text-brand-primary text-[1.2rem] mt-[0.4rem]">
              Chuyên gia phát triển NTRP 3.0–4.0
            </p>
          </div>
          <Button variant="outline-danger" size="sm" className="shrink-0">
            <MessageCircle size={14} aria-hidden="true" />
            Nhắn tin
          </Button>
        </div>
      </section>

      {/* Checklist */}
      <section aria-labelledby="checklist-title" className="mb-[3.2rem]">
        <h2 id="checklist-title" className="text-[1.7rem] font-bold text-neutral-90 mb-[0.8rem] flex items-center gap-[0.8rem]">
          <VietravelIcon id="tick-linear" size={18} className="text-brand-primary shrink-0" />
          Checklist chuẩn bị
        </h2>
        <p className="text-neutral-40 text-[1.4rem] mb-[1.6rem]">
          {checkedCount}/{checklistItems.length} mục đã chuẩn bị
        </p>
        <ProgressBar value={checkedCount} max={checklistItems.length} color="primary" className="mb-[1.6rem]" />
        <div className="bg-neutral-01 rounded-[0.8rem] border border-neutral-10 shadow-[rgba(0,0,0,0.08)_0px_2px_8px] p-[2rem]">
          <ul className="space-y-[1.2rem]">
            {checklistItems.map((item) => (
              <li key={item}>
                <label className="flex items-center gap-[1.2rem] cursor-pointer min-h-[44px] group">
                  <input
                    type="checkbox"
                    checked={!!checklist[item]}
                    onChange={() => toggleChecklist(item)}
                    className="sr-only"
                    aria-label={item}
                  />
                  <span
                    className={`w-[2.4rem] h-[2.4rem] rounded-[0.4rem] border-2 flex items-center justify-center shrink-0 transition-colors duration-150 ${
                      checklist[item]
                        ? "bg-brand-primary border-brand-primary"
                        : "border-neutral-30 group-hover:border-brand-light"
                    }`}
                    aria-hidden="true"
                  >
                    {checklist[item] && (
                      <CheckCircle size={14} className="text-neutral-01" />
                    )}
                  </span>
                  <span
                    className={`text-[1.4rem] ${
                      checklist[item]
                        ? "line-through text-neutral-30"
                        : "text-neutral-90"
                    }`}
                  >
                    {item}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <div className="flex gap-[1.2rem]">
        <Link href="/in-tour" className="flex-1">
          <Button variant="primary" size="lg" className="w-full">
            Vào Tour Live
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" size="lg">
            Trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
}
