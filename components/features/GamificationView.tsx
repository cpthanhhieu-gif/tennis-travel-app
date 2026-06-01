"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { mockUser, tiers, xpActions, badges, feiScoreData, danangItinerary } from "@/lib/mock-data";
import { Trophy, Share2, Lock, Gem, Flag, ChefHat, Zap, CheckCircle2, UtensilsCrossed, Users, Star, ArrowRight, Sparkles } from "lucide-react";
import VietravelIcon from "@/components/ui/VietravelIcon";

type IconRenderer = (size: number, className: string) => React.ReactNode;

const xpIconMap: Record<string, IconRenderer> = {
  Flag:            (s, c) => <Flag size={s} className={c} aria-hidden />,
  UtensilsCrossed: (s, c) => <VietravelIcon id="cuisine-bold" size={s} className={c} />,
  MapPin:          (s, c) => <VietravelIcon id="location-bold" size={s} className={c} />,
  Trophy:          (s, c) => <VietravelIcon id="medal-star-linear" size={s} className={c} />,
  ChefHat:         (s, c) => <ChefHat size={s} className={c} aria-hidden />,
  Users:           (s, c) => <VietravelIcon id="group-people-linear" size={s} className={c} />,
};

const badgeIconMap: Record<string, IconRenderer> = {
  Zap:             (s, c) => <Zap size={s} className={c} aria-hidden />,
  UtensilsCrossed: (s, c) => <VietravelIcon id="cuisine-bold" size={s} className={c} />,
  Trophy:          (s, c) => <VietravelIcon id="medal-star-linear" size={s} className={c} />,
};

const badgeColors: Record<string, { bg: string; ring: string; icon: string }> = {
  first_serve:  { bg: "bg-blue-50",   ring: "ring-blue-200",   icon: "text-blue-600" },
  fei_master:   { bg: "bg-amber-50",  ring: "ring-amber-200",  icon: "text-amber-600" },
  court_warrior:{ bg: "bg-purple-50", ring: "ring-purple-200", icon: "text-purple-600" },
};

const LOCKED_BADGES = [
  { id: "tour_collector", name: "Tour Collector", description: "Hoàn thành 3 tours", progress: 1, total: 3, icon: "🗺️", hint: "Đặt thêm 2 tours để mở khóa" },
  { id: "refer_master",   name: "Refer Master",   description: "Giới thiệu 5 bạn bè",  progress: 0, total: 5, icon: "👥", hint: "Chia sẻ link giới thiệu để bắt đầu" },
  { id: "fei_legend",     name: "FEI Legend",     description: "Đạt FEI >95/100",       progress: feiScoreData.totalFEI, total: 95, icon: "⭐", unit: "/100", hint: `Còn ${95 - feiScoreData.totalFEI} điểm nữa — tham gia thêm bữa ăn FEI cao cấp` },
];

const TIER_GRADIENTS: Record<string, string> = {
  Bronze:  "from-amber-700 to-amber-500",
  Silver:  "from-slate-500 to-slate-400",
  Gold:    "from-yellow-600 to-yellow-400",
  Diamond: "from-purple-700 to-purple-500",
};

const FEI_COLOR = (score: number) =>
  score >= 90 ? "#10b981" : score >= 85 ? "#3b82f6" : "#f59e0b";

function ArcProgress({ score, size = 120 }: { score: number; size?: number }) {
  const r = 44;
  const cx = 60;
  const cy = 60;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference * 0.75;
  const gap  = circumference - dash;
  const rotation = -225;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="10"
        strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
        strokeLinecap="round"
        transform={`rotate(${rotation} ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={FEI_COLOR(score)} strokeWidth="10"
        strokeDasharray={`${dash} ${gap + circumference * 0.25}`}
        strokeLinecap="round"
        transform={`rotate(${rotation} ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)" }} />
    </svg>
  );
}

function MilestoneTrack({ current, min, max }: { current: number; min: number; max: number }) {
  const range = max - min;
  const milestones = [min, Math.round(min + range * 0.25), Math.round(min + range * 0.5), Math.round(min + range * 0.75), max];
  const pct = Math.min(100, ((current - min) / range) * 100);

  return (
    <div className="pt-[0.4rem] pb-[1.2rem]">
      <div className="relative flex items-center" style={{ height: "2.8rem" }}>
        <div className="absolute left-0 right-0 h-[0.5rem] bg-white/30 rounded-full" style={{ top: "50%", transform: "translateY(-50%)" }} />
        <div className="absolute left-0 h-[0.5rem] bg-white rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{ width: `${pct}%`, top: "50%", transform: "translateY(-50%)" }} />
        {milestones.map((xp, i) => {
          const dotPct = ((xp - min) / range) * 100;
          const passed = current >= xp;
          return (
            <div key={xp} className="absolute flex items-center justify-center"
              style={{ left: `${dotPct}%`, transform: "translateX(-50%)", top: "50%", marginTop: "-0.9rem" }}>
              <div className={`w-[1.8rem] h-[1.8rem] rounded-full border-2 transition-all duration-500 ${
                passed ? "bg-white border-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" : "bg-white/20 border-white/50"
              }`} />
            </div>
          );
        })}
        <div className="absolute w-[2.6rem] h-[2.6rem] rounded-full bg-white border-[3px] border-white/50 shadow-[0_0_0_3px_rgba(255,255,255,0.4)] transition-all duration-700"
          style={{ left: `${pct}%`, transform: "translateX(-50%)", top: "50%", marginTop: "-1.3rem" }}
          aria-label={`${current.toLocaleString("vi-VN")} XP`} />
      </div>
      <div className="relative flex mt-[0.8rem]">
        {milestones.map((xp, i) => {
          const dotPct = ((xp - min) / range) * 100;
          const passed = current >= xp;
          return (
            <span key={xp}
              className={`absolute text-[1.0rem] whitespace-nowrap font-semibold transition-colors ${passed ? "text-white" : "text-white/50"}`}
              style={{ left: `${dotPct}%`, transform: i === 0 ? "none" : i === milestones.length - 1 ? "translateX(-100%)" : "translateX(-50%)" }}>
              {(xp / 1000).toFixed(xp % 1000 === 0 ? 0 : 1)}k
            </span>
          );
        })}
      </div>
    </div>
  );
}

function TierIcon({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) {
  if (name === "Diamond") return <Gem size={size} className={className} aria-hidden />;
  return <VietravelIcon id="medal-star-linear" size={size} className={className} />;
}

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * ease));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return count;
}

const tourTotalXp = danangItinerary.reduce((s, d) => s + d.totalXp, 0);

export default function GamificationView() {
  const xpCount = useCountUp(mockUser.xp, 1500);
  const [activeTab, setActiveTab] = useState<"xp" | "badges" | "tiers" | "fei">("xp");
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "info" | "xp"; xp?: number }>({
    visible: false, message: "", type: "info",
  });

  const currentTier = tiers.find((t) => t.name === mockUser.tier)!;
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  const xpToNext = nextTier ? nextTier.xpMin - mockUser.xp : 0;
  const referXpPerFriend = 800;
  const friendsNeeded = Math.ceil(xpToNext / referXpPerFriend);
  const gradient = TIER_GRADIENTS[currentTier.name] ?? "from-slate-500 to-slate-400";

  const showToast = useCallback((message: string, type: "success" | "info" | "xp" = "info", xp?: number) => {
    setToast({ visible: true, message, type, xp });
  }, []);

  const hideToast = useCallback(() => setToast((t) => ({ ...t, visible: false })), []);

  const TABS: { key: "xp" | "badges" | "tiers" | "fei"; label: string }[] = [
    { key: "xp",     label: "XP" },
    { key: "badges", label: `Badges (${badges.length})` },
    { key: "tiers",  label: "Cấp bậc" },
    { key: "fei",    label: "FEI" },
  ];

  return (
    <div className="min-h-screen pb-[9.6rem] max-w-3xl mx-auto">

      {/* ── Hero Profile Banner ── */}
      <section aria-labelledby="profile-title" className={`bg-gradient-to-br ${gradient} px-[2rem] pt-[6.4rem] pb-[3.2rem]`}>
        <div className="flex items-start gap-[1.6rem] mb-[2.4rem]">
          {/* Avatar with tier ring */}
          <div className="relative shrink-0">
            <div className="w-[7.2rem] h-[7.2rem] rounded-full bg-white/20 backdrop-blur-sm border-[3px] border-white/60 flex items-center justify-center text-white text-[2.8rem] font-extrabold shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
              {mockUser.firstName.charAt(0)}
            </div>
            <div className="absolute -bottom-[0.4rem] -right-[0.4rem] w-[2.4rem] h-[2.4rem] rounded-full bg-white flex items-center justify-center shadow-sm">
              <Star size={12} className="text-amber-500" fill="currentColor" />
            </div>
          </div>

          <div className="flex-1 min-w-0 pt-[0.4rem]">
            <h1 id="profile-title" className="text-[2rem] font-extrabold text-white leading-tight">
              {mockUser.name}
            </h1>
            <div className="flex items-center gap-[0.8rem] mt-[0.6rem] flex-wrap">
              <span className="inline-flex items-center gap-[0.4rem] px-[1.0rem] py-[0.3rem] bg-white/20 backdrop-blur-sm rounded-full text-white text-[1.2rem] font-bold border border-white/30">
                <TierIcon name={currentTier.name} size={12} />
                {currentTier.name} Member
              </span>
              <span className="text-white/70 text-[1.2rem]">NTRP {mockUser.ntrpLevel}</span>
            </div>
          </div>

          <Link href="/share-card" className="shrink-0" onClick={() => showToast("Đang tải thẻ thành tích…", "info")}>
            <button className="flex items-center gap-[0.6rem] px-[1.4rem] py-[0.8rem] bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-[1.3rem] font-semibold hover:bg-white/30 transition-colors">
              <Share2 size={14} aria-hidden="true" />
              Chia sẻ
            </button>
          </Link>
        </div>

        {/* XP Counter */}
        <div className="mb-[0.8rem]">
          <div className="flex justify-between items-end mb-[1.2rem]">
            <div>
              <p className="text-white/60 text-[1.2rem] mb-[0.2rem] uppercase tracking-widest font-medium">Tổng XP</p>
              <p className="text-[5.2rem] font-extrabold text-white leading-none drop-shadow-sm" aria-label={`${mockUser.xp} XP`}>
                {xpCount.toLocaleString("vi-VN")}
                <span className="text-[2rem] text-white/60 font-normal"> XP</span>
              </p>
            </div>
            {nextTier && (
              <div className="text-right bg-white/10 backdrop-blur-sm rounded-[1rem] px-[1.4rem] py-[0.8rem] border border-white/20">
                <p className="text-white/60 text-[1.1rem] uppercase tracking-wide">Lên {nextTier.name}</p>
                <p className="text-white font-extrabold text-[1.8rem]">
                  {xpToNext.toLocaleString("vi-VN")} XP
                </p>
              </div>
            )}
          </div>
          <MilestoneTrack current={mockUser.xp} min={currentTier.xpMin} max={currentTier.xpMax} />
        </div>

        {/* Mini stats strip */}
        <div className="grid grid-cols-3 gap-[0.8rem] mt-[0.4rem]">
          {[
            { value: feiScoreData.totalFEI, unit: "/100", label: "FEI Score", emoji: "⭐" },
            { value: badges.length,          unit: " badges", label: "Đã nhận",  emoji: "🏅" },
            { value: 1,                      unit: " tour",   label: "Completed", emoji: "🗺️" },
          ].map((s) => (
            <div key={s.label} className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-[1rem] px-[1.2rem] py-[1rem] text-center">
              <p className="text-[1.4rem] mb-[0.2rem]">{s.emoji}</p>
              <p className="text-white font-extrabold text-[1.8rem] leading-none">
                {s.value}<span className="text-white/60 font-normal text-[1.1rem]">{s.unit}</span>
              </p>
              <p className="text-white/60 text-[1.0rem] mt-[0.2rem]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEI + next-tier tips strip */}
      <div className="px-[1.6rem] pt-[1.6rem] pb-[0.4rem] space-y-[1rem]">
        <div className="flex items-center gap-[1rem] bg-green-50 border border-green-200 rounded-[1rem] px-[1.4rem] py-[1rem]">
          <CheckCircle2 size={18} className="text-green-600 shrink-0" aria-hidden />
          <p className="text-green-800 text-[1.3rem] font-semibold flex-1">
            FEI {feiScoreData.totalFEI}/100 · PASSED · Vượt mục tiêu +{feiScoreData.totalFEI - feiScoreData.targetFEI} điểm
          </p>
          <span className="text-green-600 text-[1.2rem] font-bold">✓</span>
        </div>
        {nextTier && (
          <div className="flex items-center gap-[1rem] bg-amber-50 border border-amber-200 rounded-[1rem] px-[1.4rem] py-[1rem]">
            <span className="text-[1.8rem] shrink-0">💡</span>
            <p className="text-amber-800 text-[1.3rem] flex-1">
              Refer <strong>{friendsNeeded} bạn bè</strong> = +{(friendsNeeded * referXpPerFriend).toLocaleString("vi-VN")} XP → lên <strong>{nextTier.name}</strong>
            </p>
            <ArrowRight size={14} className="text-amber-500 shrink-0" />
          </div>
        )}
      </div>

      {/* ── Pill Tabs ── */}
      <div className="px-[1.6rem] pt-[1.6rem] pb-[0.8rem]">
        <div className="flex gap-[0.8rem] bg-neutral-05 rounded-[1.2rem] p-[0.4rem]" role="tablist">
          {TABS.map(({ key, label }) => {
            const active = activeTab === key;
            return (
              <button key={key} role="tab" aria-selected={active}
                onClick={() => setActiveTab(key)}
                className={`flex-1 py-[1rem] px-[0.4rem] text-[1.3rem] font-semibold rounded-[1rem] transition-all duration-200 min-h-[44px] focus:outline-none ${
                  active ? "bg-neutral-01 text-brand-primary shadow-[rgba(0,0,0,0.08)_0px_1px_4px]" : "text-neutral-40 hover:text-neutral-70"
                }`}>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-[1.6rem]">

        {/* ── Tab: XP ── */}
        {activeTab === "xp" && (
          <section aria-label="Chi tiết XP">

            {/* Tour breakdown card */}
            <div className="bg-neutral-01 rounded-[1.2rem] border border-neutral-10 shadow-[rgba(0,0,0,0.06)_0px_2px_12px] p-[2rem] mb-[2rem]">
              <div className="flex items-center justify-between mb-[1.6rem]">
                <h2 className="font-bold text-neutral-90 text-[1.5rem]">📍 Tour Đà Nẵng — Tổng kết XP</h2>
                <span className="inline-flex items-center gap-[0.4rem] px-[1.2rem] py-[0.4rem] bg-brand-tint rounded-full text-brand-primary font-extrabold text-[1.4rem]">
                  <Sparkles size={12} />
                  +{tourTotalXp.toLocaleString("vi-VN")}
                </span>
              </div>
              <div className="space-y-[1.2rem]">
                {danangItinerary.map((day, i) => (
                  <div key={day.day} className="flex items-center gap-[1.4rem]">
                    <div className={`shrink-0 w-[3.6rem] h-[3.6rem] rounded-full flex items-center justify-center text-[1.3rem] font-extrabold ${
                      i === 0 ? "bg-green-100 text-green-700" : i === 1 ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    }`}>N{day.day}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-neutral-90 text-[1.4rem] font-semibold truncate">{day.title}</p>
                      <p className="text-neutral-40 text-[1.1rem]">{day.dateLabel.split(",")[0]}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-brand-secondary font-extrabold text-[1.5rem]">+{day.totalXp.toLocaleString("vi-VN")}</p>
                      <p className="text-neutral-30 text-[1.0rem]">XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* XP Actions */}
            <p className="text-neutral-40 text-[1.2rem] font-bold mb-[1.2rem] uppercase tracking-widest">Hoạt động</p>
            <div className="space-y-[1rem] mb-[2.4rem]">
              {xpActions.map((action) => (
                <button
                  key={action.action}
                  className={`w-full flex items-center gap-[1.4rem] p-[1.6rem] rounded-[1.2rem] border text-left transition-all duration-200 focus:outline-none ${
                    action.earned
                      ? "bg-neutral-01 border-green-200 shadow-[rgba(16,185,129,0.08)_0px_2px_8px] hover:shadow-[rgba(16,185,129,0.14)_0px_4px_16px]"
                      : "bg-neutral-03 border-neutral-10 hover:bg-neutral-05 cursor-pointer"
                  }`}
                  onClick={() => {
                    if (!action.earned) {
                      showToast(`Hoàn thành tour để mở khóa +${action.xp} XP`, "info");
                    }
                  }}
                  aria-label={`${action.action} — ${action.earned ? "Đã hoàn thành" : `Chưa mở, +${action.xp} XP`}`}
                >
                  <span className={`shrink-0 flex items-center justify-center w-[4.4rem] h-[4.4rem] rounded-[1rem] ${
                    action.earned ? "bg-green-100" : "bg-neutral-05"
                  }`}>
                    {xpIconMap[action.icon]?.(20, action.earned ? "text-green-600" : "text-neutral-30")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-[1.4rem] leading-snug ${action.earned ? "text-neutral-90" : "text-neutral-40"}`}>
                      {action.action}
                    </p>
                    <p className={`text-[1.2rem] mt-[0.2rem] font-bold ${action.earned ? "text-green-600" : "text-neutral-30"}`}>
                      +{action.xp.toLocaleString("vi-VN")} XP
                    </p>
                  </div>
                  {action.earned ? (
                    <span className="shrink-0 flex items-center gap-[0.4rem] px-[1.0rem] py-[0.5rem] bg-green-100 border border-green-200 rounded-full text-green-700 text-[1.1rem] font-bold">
                      <CheckCircle2 size={12} aria-hidden /> Xong
                    </span>
                  ) : (
                    <span className="shrink-0 flex items-center gap-[0.4rem] px-[1.0rem] py-[0.5rem] bg-neutral-05 border border-neutral-10 rounded-full text-neutral-30 text-[1.1rem] font-bold">
                      <Lock size={11} aria-hidden /> Khóa
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Refer CTA */}
            <div className={`bg-gradient-to-br ${gradient} rounded-[1.2rem] p-[2.4rem] text-center`}>
              <div className="flex justify-center mb-[1rem]">
                <div className="w-[5.6rem] h-[5.6rem] bg-white/20 rounded-full flex items-center justify-center">
                  <VietravelIcon id="group-people-linear" size={28} className="text-white" />
                </div>
              </div>
              <p className="font-extrabold text-[1.8rem] text-white mb-[0.4rem]">Refer bạn bè · +800 XP / người</p>
              <p className="text-white/70 text-[1.3rem] mb-[2rem]">Mỗi bạn đăng ký thành công = +800 XP cho bạn</p>
              <button
                onClick={() => showToast("Đã copy link giới thiệu!", "success")}
                className="w-full py-[1.4rem] bg-white rounded-[1rem] font-bold text-[1.5rem] shadow-[rgba(0,0,0,0.2)_0px_4px_16px] hover:bg-white/90 transition-colors"
                style={{ color: currentTier.color }}
              >
                Chia sẻ link giới thiệu
              </button>
            </div>
          </section>
        )}

        {/* ── Tab: Badges ── */}
        {activeTab === "badges" && (
          <section aria-label="Badges">
            <p className="text-neutral-40 text-[1.3rem] mb-[1.6rem]">
              Đã nhận <span className="font-bold text-neutral-90">{badges.length}</span> · còn <span className="font-bold text-neutral-90">{LOCKED_BADGES.length}</span> đang khóa
            </p>

            {/* Earned badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[1.4rem] mb-[2.8rem]">
              {badges.map((badge) => {
                const colors = badgeColors[badge.id] ?? { bg: "bg-brand-tint", ring: "ring-brand-tint", icon: "text-brand-primary" };
                return (
                  <div key={badge.id}
                    className={`${colors.bg} rounded-[1.4rem] ring-2 ${colors.ring} p-[2rem] text-center hover:-translate-y-1 hover:shadow-[rgba(0,0,0,0.12)_0px_8px_24px] transition-all duration-200 cursor-default`}>
                    <div className={`flex justify-center mb-[1.2rem]`}>
                      <div className="w-[6rem] h-[6rem] rounded-full bg-white flex items-center justify-center shadow-sm">
                        {badgeIconMap[badge.icon]?.(28, colors.icon)}
                      </div>
                    </div>
                    <p className="font-bold text-neutral-90 text-[1.5rem] mb-[0.4rem]">{badge.name}</p>
                    <p className="text-neutral-50 text-[1.2rem] mb-[1.0rem]">{badge.description}</p>
                    <span className="inline-block px-[1.2rem] py-[0.4rem] bg-white/70 rounded-full text-neutral-40 text-[1.1rem] font-medium">
                      {badge.earnedAt}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Locked badges */}
            <p className="text-neutral-40 text-[1.2rem] font-bold uppercase tracking-widest mb-[1.2rem]">Chờ mở khóa</p>
            <div className="space-y-[1.2rem]">
              {LOCKED_BADGES.map((b) => {
                const pct = Math.min(100, Math.round((b.progress / b.total) * 100));
                return (
                  <button
                    key={b.id}
                    className="w-full bg-neutral-03 rounded-[1.2rem] border border-neutral-10 p-[1.6rem] flex items-center gap-[1.4rem] text-left hover:bg-neutral-05 transition-colors focus:outline-none"
                    onClick={() => showToast(b.hint, "info")}
                    aria-label={`${b.name} — ${b.hint}`}
                  >
                    <div className="shrink-0 w-[5rem] h-[5rem] rounded-full bg-neutral-05 border-2 border-neutral-15 flex items-center justify-center text-[2.2rem] opacity-40">
                      {b.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-[0.6rem] mb-[0.4rem]">
                        <Lock size={12} className="text-neutral-30 shrink-0" aria-hidden />
                        <p className="font-bold text-neutral-50 text-[1.4rem]">{b.name}</p>
                      </div>
                      <p className="text-neutral-40 text-[1.2rem] mb-[0.8rem]">{b.description}</p>
                      <div className="flex items-center gap-[0.8rem]">
                        <div className="flex-1 h-[0.6rem] bg-neutral-10 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-primary/40 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="shrink-0 text-neutral-40 text-[1.2rem] font-semibold">
                          {b.progress}{b.unit ?? ""}/{b.total}{b.unit ?? ""}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Tab: Tiers ── */}
        {activeTab === "tiers" && (
          <section aria-label="Cấp bậc thành viên" className="space-y-[1.4rem]">
            {tiers.map((tier) => {
              const isCurrent = tier.name === mockUser.tier;
              const isLocked = tiers.indexOf(tier) > tiers.indexOf(currentTier);
              const tierGrad = TIER_GRADIENTS[tier.name] ?? "from-slate-400 to-slate-300";
              return (
                <div key={tier.name}
                  className={`rounded-[1.4rem] border overflow-hidden transition-all duration-200 ${
                    isCurrent ? "border-transparent shadow-[rgba(0,0,0,0.15)_0px_4px_20px]" : isLocked ? "border-neutral-10 opacity-60" : "border-neutral-10"
                  }`}>
                  {/* Tier header */}
                  <div className={`bg-gradient-to-r ${tierGrad} px-[2rem] py-[1.4rem] flex items-center justify-between`}>
                    <div className="flex items-center gap-[1.2rem]">
                      <TierIcon name={tier.name} size={24} className="text-white" />
                      <div>
                        <p className="font-extrabold text-[1.8rem] text-white">{tier.name}</p>
                        <p className="text-white/70 text-[1.2rem]">
                          {tier.xpMin.toLocaleString("vi-VN")} – {tier.xpMax >= 999999 ? "∞" : tier.xpMax.toLocaleString("vi-VN")} XP
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[0.8rem]">
                      {isCurrent && (
                        <span className="px-[1.2rem] py-[0.4rem] bg-white/25 border border-white/40 text-white text-[1.2rem] font-bold rounded-full">
                          Hiện tại ✓
                        </span>
                      )}
                      {isLocked && <Lock size={16} className="text-white/60" aria-hidden />}
                    </div>
                  </div>
                  {/* Perks */}
                  <div className={`px-[2rem] py-[1.4rem] ${isCurrent ? "bg-neutral-01" : "bg-neutral-01"}`}>
                    <ul className="space-y-[0.8rem]">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-[1rem] text-[1.4rem]">
                          <div className={`shrink-0 w-[2rem] h-[2rem] rounded-full flex items-center justify-center ${
                            isCurrent ? "bg-brand-tint" : isLocked ? "bg-neutral-05" : "bg-neutral-05"
                          }`}>
                            <Trophy size={10} className={isCurrent ? "text-brand-primary" : "text-neutral-30"} aria-hidden />
                          </div>
                          <span className={isLocked ? "text-neutral-40" : "text-neutral-60"}>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* ── Tab: FEI Score ── */}
        {activeTab === "fei" && (
          <section aria-label="FEI Score">
            {/* Hero score card */}
            <div className="bg-neutral-01 rounded-[1.4rem] border border-neutral-10 shadow-[rgba(0,0,0,0.08)_0px_4px_16px] p-[2.4rem] mb-[2.4rem]">
              <div className="flex items-center gap-[2.4rem]">
                {/* Arc */}
                <div className="relative shrink-0">
                  <ArcProgress score={feiScoreData.totalFEI} size={120} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[2.4rem] font-extrabold text-neutral-90 leading-none">{feiScoreData.totalFEI}</p>
                    <p className="text-neutral-40 text-[1.0rem]">/100</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-neutral-40 text-[1.2rem] uppercase tracking-widest mb-[0.4rem]">Food Experience Index</p>
                  <div className="flex items-center gap-[0.8rem] mb-[0.8rem] flex-wrap">
                    <span className="inline-flex items-center gap-[0.4rem] px-[1.4rem] py-[0.6rem] bg-green-50 border border-green-200 rounded-full text-green-700 font-bold text-[1.4rem]">
                      <CheckCircle2 size={14} aria-hidden /> PASSED
                    </span>
                  </div>
                  <p className="text-neutral-50 text-[1.3rem]">
                    Mục tiêu: {feiScoreData.targetFEI}/100{" "}
                    <span className="font-bold text-green-600">+{feiScoreData.totalFEI - feiScoreData.targetFEI} điểm vượt</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 5 sub-indices */}
            <p className="text-neutral-40 text-[1.2rem] font-bold uppercase tracking-widest mb-[1.2rem]">5 Chỉ số chi tiết</p>
            <div className="space-y-[1.2rem]">
              {feiScoreData.subIndices.map((idx) => {
                const color = FEI_COLOR(idx.score);
                const bgClass = idx.score >= 90 ? "bg-green-50 border-green-100" : idx.score >= 85 ? "bg-blue-50 border-blue-100" : "bg-amber-50 border-amber-100";
                return (
                  <div key={idx.code} className={`rounded-[1.2rem] border ${bgClass} p-[1.6rem]`}>
                    <div className="flex items-start justify-between mb-[1rem]">
                      <div className="flex-1 min-w-0 pr-[1.2rem]">
                        <div className="flex items-center gap-[0.8rem] mb-[0.2rem]">
                          <span className="font-extrabold text-neutral-90 text-[1.4rem]">{idx.code}</span>
                          <span className="text-neutral-50 text-[1.3rem]">{idx.name}</span>
                        </div>
                        <p className="text-neutral-40 text-[1.1rem]">{idx.description}</p>
                      </div>
                      <span className="font-extrabold text-[2.2rem] shrink-0" style={{ color }}>{idx.score}</span>
                    </div>
                    <div className="h-[0.8rem] bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${idx.score}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>

      {/* ── Sticky CTA ── */}
      <div
        className="fixed left-0 right-0 z-30 px-[1.6rem] pb-[1rem] pt-[1.2rem]"
        style={{ bottom: "53px", background: "linear-gradient(to top, rgba(255,255,255,1) 60%, rgba(255,255,255,0))" }}
      >
        <Link href="/share-card">
          <button className={`w-full py-[1.6rem] bg-gradient-to-r ${gradient} text-white font-extrabold text-[1.6rem] rounded-[1.2rem] shadow-[rgba(0,0,0,0.25)_0px_4px_20px] hover:opacity-90 transition-opacity flex items-center justify-center gap-[0.8rem]`}>
            <Trophy size={18} aria-hidden />
            Xem thẻ thành tích · Voucher 10%
          </button>
        </Link>
      </div>

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        xp={toast.xp}
        onHide={hideToast}
      />
    </div>
  );
}
