"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { danangItinerary, mockUser } from "@/lib/mock-data";
import { ChevronDown, ChevronUp, MessageCircle, MapPin, CheckCircle, GraduationCap, Zap, UtensilsCrossed, Heart, Navigation } from "lucide-react";
import VietravelIcon from "@/components/ui/VietravelIcon";

const checklistItems = [
  "Vợt tennis (2–3 cây)",
  "Giày tennis chuyên dụng",
  "Trang phục thể thao",
  "Kem chống nắng SPF 50+",
  "Bình nước cá nhân",
  "Dụng cụ phục hồi (băng, dầu nóng)",
];

// ── Activity type helpers ────────────────────────────────────────────────────
type ActivityType = "tennis" | "food" | "recovery" | "logistics";

function getActivityType(text: string): ActivityType {
  const t = text.toLowerCase();
  if (/tập luyện|giải đấu|warm-up|serve|orientation|buổi tập|drills|match/.test(t)) return "tennis";
  if (/bữa sáng|bữa trưa|bữa tối|dining|ẩm thực|chef|workshop ẩm/.test(t)) return "food";
  if (/spa|massage|hydrotherapy|phục hồi buổi/.test(t)) return "recovery";
  return "logistics";
}

const ACTIVITY_ICON: Record<ActivityType, React.ReactNode> = {
  tennis:    <Zap size={13} className="text-brand-primary shrink-0 mt-px" aria-hidden="true" />,
  food:      <UtensilsCrossed size={13} className="text-success shrink-0 mt-px" aria-hidden="true" />,
  recovery:  <Heart size={13} className="text-purple shrink-0 mt-px" aria-hidden="true" />,
  logistics: <Navigation size={13} className="text-neutral-30 shrink-0 mt-px" aria-hidden="true" />,
};

const ACTIVITY_TYPE_CONFIG: Record<ActivityType, { dot: string; bar: string; chip: string; label: string; icon: React.ReactNode }> = {
  tennis:    { dot: "bg-brand-primary", bar: "border-l-2 border-brand-primary",  chip: "bg-brand-tint text-brand-primary",    label: "Tennis",    icon: <Zap size={10} aria-hidden="true" /> },
  food:      { dot: "bg-success",       bar: "border-l-2 border-success",         chip: "bg-success-light text-success",        label: "Ẩm thực",   icon: <UtensilsCrossed size={10} aria-hidden="true" /> },
  recovery:  { dot: "bg-purple",        bar: "border-l-2 border-purple",          chip: "bg-purple-light text-purple",          label: "Phục hồi",  icon: <Heart size={10} aria-hidden="true" /> },
  logistics: { dot: "bg-neutral-30",    bar: "border-l-2 border-neutral-10",      chip: "bg-neutral-03 text-neutral-40",        label: "Di chuyển", icon: <Navigation size={10} aria-hidden="true" /> },
};

function stripFei(text: string): string {
  return text
    .replace(/\s*FEI\s*#\d+/g, "")
    .replace(/\s*·\s*FEI:\s*\d+\/100/g, "")
    .trim();
}

function parseActivity(text: string): { title: string; detail: string | null } {
  const match = text.match(/^(.+?)\s*[–—·]\s*(.+)$/);
  if (!match) return { title: text, detail: null };
  return { title: match[1].trim(), detail: match[2].trim() };
}
// ────────────────────────────────────────────────────────────────────────────

const DEPARTURE = new Date("2026-06-13T08:00:00+07:00");

function useCountdown(target: Date) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  useEffect(() => {
    const calc = () => Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
    setSecondsLeft(calc());
    const id = setInterval(() => setSecondsLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (secondsLeft === null) return { d: null, h: null, m: null, s: null };
  return {
    d: Math.floor(secondsLeft / 86400),
    h: Math.floor((secondsLeft % 86400) / 3600),
    m: Math.floor((secondsLeft % 3600) / 60),
    s: secondsLeft % 60,
  };
}

const NAV_TABS = [
  { key: "itinerary", label: "Lịch trình chi tiết" },
  { key: "coach",     label: "HLV" },
  { key: "checklist", label: "Chuẩn bị trước khi đi" },
];

export default function PreTourDashboard() {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("itinerary");
  const countdown = useCountdown(DEPARTURE);

  const scrollToSection = (key: string) => {
    setActiveTab(key);
    document.getElementById(`section-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleChecklist = (item: string) => {
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const checkedCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="min-h-screen px-6 md:px-10 lg:px-12 pt-0 md:pt-[var(--navbar-height)] pb-12 max-w-3xl mx-auto">
      {/* ── Greeting + Schedule tabs ── */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-neutral-40 text-xs leading-tight">
            Thứ Sáu, 13 Tháng 6, 2026
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-90">
            Chào {mockUser.firstName} 👋
          </h1>
        </div>
      </div>

      {/* Nav tabs — scroll to section */}
      <div className="flex gap-2 mb-6 overflow-x-auto scroll-x-hidden">
        {NAV_TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => scrollToSection(tab.key)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 min-h-11 ${
                active
                  ? "bg-brand-primary text-neutral-01 border-brand-primary shadow-card"
                  : "bg-neutral-01 text-neutral-50 border-neutral-10"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Countdown banner */}
      <div
        className="relative mb-10 rounded-2xl p-5 overflow-hidden"
        style={{
          background: "radial-gradient(ellipse 110% 90% at 50% -10%, #D9EEFF 0%, #F1F9FF 55%, #ffffff 100%)",
          border: "1px solid #D9EEFF",
        }}
      >
        {/* Arc decorative circle — tạo depth như hình ref */}
        <div
          className="absolute top-[-60%] left-1/2 -translate-x-1/2 w-[160%] aspect-square rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(217,238,255,0.55) 0%, transparent 65%)" }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10">
          <p className="text-xs text-neutral-40 mb-0.5">Đà Nẵng 3N2D · 13–15/06/2026</p>
          <p className="text-sm font-bold text-brand-primary mb-4">🎾 Khởi hành sau</p>
          <div
            className="flex gap-2"
            role="timer"
            aria-label={`Khởi hành sau ${countdown.d} ngày ${countdown.h} giờ ${countdown.m} phút`}
            aria-live="off"
          >
            {[
              { value: countdown.d, label: "ngày" },
              { value: countdown.h, label: "giờ" },
              { value: countdown.m, label: "phút" },
              { value: countdown.s, label: "giây" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex-1 flex flex-col items-center rounded-xl py-3"
                style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(217,238,255,0.8)" }}
              >
                <span className="text-2xl font-extrabold text-brand-primary tabular-nums leading-none">
                  {value === null ? "--" : String(value).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-neutral-40 mt-1 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <section id="section-itinerary" aria-labelledby="itinerary-title" className="mb-12">
        <h2 id="itinerary-title" className="text-xl font-bold text-neutral-90 mb-6 flex items-center gap-2">
          <VietravelIcon id="calendar-tick-bold" size={18} className="text-brand-primary shrink-0" />
          Lịch trình chi tiết
        </h2>
        <div className="space-y-4">
          {danangItinerary.map((day) => (
            <div
              key={day.day}
              className="bg-neutral-01 rounded-xl border border-neutral-10 shadow-card overflow-hidden"
            >
              <button
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-03 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-inset min-h-11"
                aria-expanded={expandedDay === day.day}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-base text-neutral-90">
                    Ngày {day.day} — {day.title}
                  </p>
                  <p className="text-neutral-40 text-sm mt-0.5">{day.dateLabel}</p>
                </div>
                <div className="shrink-0 ml-3">
                  {expandedDay === day.day ? (
                    <ChevronUp size={16} className="text-neutral-40" aria-hidden="true" />
                  ) : (
                    <ChevronDown size={16} className="text-neutral-40" aria-hidden="true" />
                  )}
                </div>
              </button>

              {expandedDay === day.day && (
                <div className="px-6 pb-4">
                  <div className="border-t border-neutral-10 pt-4">
                    {/* Vertical timeline */}
                    <div className="relative">
                      {/* Connector line chạy dọc qua tất cả dot */}
                      <div className="absolute top-2 bottom-2 w-px bg-neutral-10" style={{ left: "3.6rem" }} />

                      {day.activities.map((act, i) => {
                        const type = getActivityType(act.activity);
                        const cfg = ACTIVITY_TYPE_CONFIG[type];
                        const { title, detail } = parseActivity(stripFei(act.activity));
                        return (
                          <div key={i} className="relative flex items-start gap-3 py-2.5">
                            {/* Time */}
                            <span className="shrink-0 w-12 text-brand-primary text-xs font-mono font-semibold text-right pt-1 leading-none">
                              {act.time}
                            </span>
                            {/* Dot — nằm trên connector line */}
                            <div className="shrink-0 w-4 flex justify-center pt-1.5 z-10">
                              <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                            </div>
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              {/* Location */}
                              <p className="text-neutral-40 text-xs flex items-center gap-1 mb-0.5">
                                <MapPin size={10} aria-hidden="true" />
                                {act.location}
                              </p>
                              {/* Title */}
                              <p className="text-neutral-90 text-sm font-medium leading-snug">
                                {title}
                              </p>
                              {/* Detail */}
                              {detail && (
                                <p className="text-neutral-40 text-xs leading-snug mt-0.5">
                                  {detail}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Coach card */}
      <section id="section-coach" aria-labelledby="coach-title" className="mb-12">
        <h2 id="coach-title" className="text-xl font-bold text-neutral-90 mb-6 flex items-center gap-2">
          <GraduationCap size={18} className="text-brand-primary shrink-0" aria-hidden="true" />
          HLV được phân công
        </h2>
        <div className="bg-neutral-01 rounded-xl border border-neutral-10 shadow-card p-6 flex items-start gap-6">
          <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
            <Image
              src="https://i.pravatar.cc/150?img=33"
              alt="HLV Trần Văn Hùng"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base text-neutral-90">HLV Trần Văn Hùng</p>
            <p className="text-neutral-40 text-sm">8 năm kinh nghiệm · NTRP 5.0</p>
            <p className="text-brand-primary text-xs mt-1">
              Chuyên gia phát triển NTRP 3.0–4.0
            </p>
            <Button variant="outline-danger" size="sm" className="mt-3">
              <MessageCircle size={14} aria-hidden="true" />
              Nhắn tin
            </Button>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section id="section-checklist" aria-labelledby="checklist-title" className="mb-12">
        <h2 id="checklist-title" className="text-xl font-bold text-neutral-90 mb-2 flex items-center gap-2">
          <VietravelIcon id="tick-linear" size={18} className="text-brand-primary shrink-0" />
          Chuẩn bị trước hành trình
        </h2>
        <p className="text-neutral-40 text-sm mb-6">
          {checkedCount}/{checklistItems.length} mục đã chuẩn bị
        </p>
        <ProgressBar value={checkedCount} max={checklistItems.length} color="primary" className="mb-6" />
        <div className="bg-neutral-01 rounded-xl border border-neutral-10 shadow-card p-8">
          <ul className="space-y-4">
            {checklistItems.map((item) => (
              <li key={item}>
                <label className="flex items-center gap-4 cursor-pointer min-h-11 group">
                  <input
                    type="checkbox"
                    checked={!!checklist[item]}
                    onChange={() => toggleChecklist(item)}
                    className="sr-only"
                    aria-label={item}
                  />
                  <span
                    className={`w-[2.4rem] h-[2.4rem] rounded-xs border-2 flex items-center justify-center shrink-0 transition-colors duration-150 ${
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
                    className={`text-sm ${
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
      <div className="flex gap-4">
        <Link href="/in-tour" className="flex-1">
          <Button variant="primary" size="lg" className="w-full">
            Bắt đầu trải nghiệm
          </Button>
        </Link>
      </div>
    </div>
  );
}
