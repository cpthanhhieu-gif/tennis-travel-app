"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { mockUser, tiers, xpActions, badges, feiScoreData, danangItinerary, questMapNodes, destinations, avatarLevel } from "@/lib/mock-data";
import { Trophy, Share2, Lock, Gem, Flag, ChefHat, Zap, CheckCircle2, UtensilsCrossed, Users, Star, ArrowRight, Sparkles, MapPin, Calendar, X, RotateCcw } from "lucide-react";
import VietravelIcon from "@/components/ui/VietravelIcon";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

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

const MAP_CONNECTIONS: [string, string][] = [
  ["danang", "nhatrang"],
  ["danang", "phuquoc"],
  ["nhatrang", "hanoi"],
];

const NODE_RESORTS: Record<string, string> = {
  danang: "Fusion Maia Resort · 13/06/2026",
  phuquoc: "InterContinental Phú Quốc",
  nhatrang: "Vinpearl Resort Nha Trang",
  hanoi: "Sofitel Legend Metropole",
};

function QuestMapSection({ showToast }: { showToast: (msg: string, type: "info" | "success" | "xp", xp?: number) => void }) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const completedCount = questMapNodes.filter((n) => n.status === "completed").length;

  const handleNodeClick = (node: typeof questMapNodes[0]) => {
    if (node.status === "completed") {
      setActiveNode(activeNode === node.id ? null : node.id);
    } else {
      const xpRequired = "xpRequired" in node ? node.xpRequired : 0;
      showToast(`Cần ${xpRequired.toLocaleString("vi-VN")} XP để mở khóa ${node.name}`, "info");
    }
  };

  const activeNodeData = questMapNodes.find((n) => n.id === activeNode);

  return (
    <section className="px-4 pt-5 pb-2" aria-label="Bản đồ hành trình">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-neutral-90">🗺️ Bản đồ Hành trình</h2>
        <span className="text-xs text-neutral-40 font-semibold">
          <span className="text-brand-primary font-bold">{completedCount}</span>/{questMapNodes.length} điểm
        </span>
      </div>
      <div className="relative w-full bg-neutral-03 border border-neutral-10 rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <svg className="absolute inset-0 w-full h-full opacity-30" aria-hidden>
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#9ca3af" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
        <svg className="absolute inset-0 w-full h-full" aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none">
          {MAP_CONNECTIONS.map(([fromId, toId]) => {
            const from = questMapNodes.find((n) => n.id === fromId);
            const to = questMapNodes.find((n) => n.id === toId);
            if (!from || !to) return null;
            const bothCompleted = from.status === "completed" && to.status === "completed";
            return (
              <line key={`${fromId}-${toId}`} x1={from.position.x} y1={from.position.y} x2={to.position.x} y2={to.position.y}
                stroke={bothCompleted ? "#0046C1" : "#d1d5db"} strokeWidth="0.8" strokeDasharray={bothCompleted ? "none" : "2 2"} />
            );
          })}
        </svg>
        {questMapNodes.map((node, i) => {
          const isCompleted = node.status === "completed";
          const isActive = activeNode === node.id;
          return (
            <button key={node.id} onClick={() => handleNodeClick(node)}
              className="absolute flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-full"
              style={{ left: `${node.position.x}%`, top: `${node.position.y}%`, transform: "translate(-50%, -50%)",
                opacity: mounted ? 1 : 0, transition: `opacity 400ms ease ${i * 120}ms, transform 400ms ease ${i * 120}ms` }}
              aria-label={`${node.name} — ${isCompleted ? "Đã chinh phục" : "Chưa mở"}`}>
              <div className="relative">
                {isCompleted && <span className="absolute inset-0 rounded-full bg-brand-primary/30 animate-ping" style={{ animationDuration: "2s" }} />}
                <div className={`relative w-11 h-11 rounded-full flex items-center justify-center shadow-card border-2 transition-all duration-200 ${isCompleted ? isActive ? "bg-brand-primary border-brand-primary scale-110" : "bg-brand-primary border-brand-primary" : "bg-white border-neutral-10"}`}>
                  {isCompleted ? <CheckCircle2 size={20} className="text-white" aria-hidden /> : <Lock size={16} className="text-neutral-30" aria-hidden />}
                </div>
              </div>
              <span className={`text-[1rem] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${isCompleted ? "bg-brand-primary text-white" : "bg-white text-neutral-40 border border-neutral-10"}`} style={{ fontSize: "0.65rem" }}>
                {node.name}
              </span>
            </button>
          );
        })}
      </div>
      {activeNodeData && activeNodeData.status === "completed" && (
        <div className="mt-3 bg-brand-tint border border-brand-primary/20 rounded-xl p-4 flex items-start gap-3 transition-all duration-200">
          <div className="shrink-0 w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
            <CheckCircle2 size={18} className="text-white" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-neutral-90 text-sm">{activeNodeData.name}</p>
            <p className="text-neutral-50 text-xs mt-0.5">{NODE_RESORTS[activeNodeData.id]}</p>
            {"xpEarned" in activeNodeData && (
              <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 bg-brand-primary/10 rounded-full text-brand-primary text-xs font-bold">
                <Sparkles size={10} aria-hidden /> +{(activeNodeData.xpEarned as number).toLocaleString("vi-VN")} XP earned
              </span>
            )}
          </div>
          <button onClick={() => setActiveNode(null)} className="shrink-0 w-7 h-7 rounded-full bg-neutral-10 flex items-center justify-center hover:bg-neutral-20 transition-colors duration-150 focus:ring-2 focus:ring-brand-primary" aria-label="Đóng">
            <X size={12} className="text-neutral-50" aria-hidden />
          </button>
        </div>
      )}
    </section>
  );
}

const CARD_FEI: Record<string, number> = { danang: 89, phuquoc: 91, nhatrang: 88, hanoi: 90 };
const CARD_RATING: Record<string, string> = { danang: "5.0", phuquoc: "4.8", nhatrang: "4.7", hanoi: "4.9" };

function DestinationCardStack({ showToast }: { showToast: (msg: string, type: "info" | "success" | "xp", xp?: number) => void }) {
  const completedNodes = questMapNodes.filter((n) => n.status === "completed");
  const [topIndex, setTopIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-12, 12]);
  const opacity = useTransform(x, [-150, -80, 0, 80, 150], [0.4, 1, 1, 1, 0.4]);

  if (completedNodes.length === 0) return null;

  const currentNode = completedNodes[topIndex % completedNodes.length];
  const dest = destinations.find((d) => d.id === currentNode.id);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (Math.abs(info.offset.x) > 80) {
      setFlipped(false);
      setTopIndex((i) => (i + 1) % completedNodes.length);
      showToast("Đã lật sang điểm đến tiếp theo", "info");
    }
  };

  return (
    <section className="px-4 pt-2 pb-4" aria-label="Bộ sưu tập điểm đến">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-neutral-90">🏆 Bộ sưu tập Điểm đến</h2>
        <span className="text-xs text-neutral-40 font-semibold">
          <span className="text-brand-primary font-bold">{completedNodes.length}</span> điểm đã chinh phục
        </span>
      </div>
      <div className="relative flex justify-center" style={{ height: "28rem" }}>
        <div className="absolute inset-x-4 rounded-2xl overflow-hidden shadow-card bg-neutral-10" style={{ top: "1.6rem", transform: "rotate(6deg) scale(0.94)", zIndex: 1 }} aria-hidden />
        <div className="absolute inset-x-4 rounded-2xl overflow-hidden shadow-card bg-neutral-05" style={{ top: "0.8rem", transform: "rotate(3deg) scale(0.97)", zIndex: 2 }} aria-hidden />
        <AnimatePresence mode="wait">
          <motion.div key={currentNode.id} className="absolute inset-x-0 rounded-2xl overflow-hidden shadow-elevated bg-neutral-01"
            style={{ x, rotate, opacity, zIndex: 3, cursor: "grab", perspective: "1000px", top: 0 }}
            drag="x" dragConstraints={{ left: -200, right: 200 }} onDragEnd={handleDragEnd}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }} whileTap={{ cursor: "grabbing" }} onClick={() => !flipped && setFlipped(true)}>
            <div className="w-full h-full transition-transform duration-500" style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", height: "28rem" }}>
              <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
                <div className="relative h-52 w-full bg-neutral-10">
                  {dest?.image && <img src={dest.image} alt={currentNode.name} className="w-full h-full object-cover" />}
                  <span className="absolute top-3 left-3 px-3 py-1.5 bg-brand-primary text-white text-xs font-extrabold rounded-full tracking-widest uppercase">CONQUERED</span>
                  <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                    <Star size={11} fill="currentColor" className="text-yellow-400" aria-hidden /> {CARD_RATING[currentNode.id] ?? "5.0"}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-extrabold text-neutral-90 leading-tight">{currentNode.name}</h3>
                      <p className="text-neutral-40 text-sm flex items-center gap-1 mt-0.5"><MapPin size={12} aria-hidden /> {dest?.resort ?? ""}</p>
                    </div>
                    {"xpEarned" in currentNode && (
                      <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-brand-tint rounded-full text-brand-primary text-xs font-bold">
                        <Sparkles size={10} aria-hidden /> +{(currentNode.xpEarned as number).toLocaleString("vi-VN")} XP
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <Link href="/share-card" onClick={(e) => e.stopPropagation()}>
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white text-sm font-bold rounded-full hover:bg-brand-primary/90 transition-colors duration-150 focus:ring-2 focus:ring-brand-primary">
                        Xem thẻ <ArrowRight size={13} aria-hidden />
                      </button>
                    </Link>
                    <button onClick={(e) => { e.stopPropagation(); setFlipped(true); }}
                      className="flex items-center gap-1 text-neutral-40 text-xs font-medium hover:text-neutral-60 transition-colors duration-150 focus:ring-2 focus:ring-brand-primary rounded"
                      aria-label="Xem chi tiết XP">
                      <RotateCcw size={12} aria-hidden /> Lật xem XP
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-8 text-center"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(135deg, #0046C1, #0391FF)" }}
                onClick={() => setFlipped(false)}>
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4"><Trophy size={32} className="text-white" aria-hidden /></div>
                <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Đã chinh phục</p>
                <h3 className="text-white font-extrabold text-2xl mb-5">{currentNode.name}</h3>
                <div className="w-full space-y-3">
                  {[
                    { label: "XP Earned", value: `+${("xpEarned" in currentNode ? currentNode.xpEarned as number : 0).toLocaleString("vi-VN")}` },
                    { label: "FEI Score", value: `${CARD_FEI[currentNode.id] ?? 89}/100` },
                    { label: "Thời gian", value: dest?.duration ?? "3N2D" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between bg-white/15 rounded-lg px-4 py-2.5">
                      <span className="text-white/70 text-sm">{row.label}</span>
                      <span className="text-white font-extrabold text-sm">{row.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-white/50 text-xs mt-5">Tap để lật lại</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="text-center text-neutral-30 text-xs mt-2">← Kéo để xem điểm tiếp theo · Tap để lật card →</p>
    </section>
  );
}

export default function GamificationView() {
  const xpCount = useCountUp(mockUser.xp, 1500);
  const [activeTab, setActiveTab] = useState<"badges" | "fei">("badges");
  const [showActivitySheet, setShowActivitySheet] = useState(false);
  const [activeBadge, setActiveBadge] = useState<typeof badges[0] | null>(null);
  const [showTierSheet, setShowTierSheet] = useState(false);
  const [showFeiSheet, setShowFeiSheet] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const [showReviewSheet, setShowReviewSheet] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [uploadDone, setUploadDone] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "info" | "xp"; xp?: number }>({
    visible: false, message: "", type: "info",
  });

  const currentTier   = tiers.find((t) => t.name === mockUser.tier)!;
  const nextTier      = tiers[tiers.indexOf(currentTier) + 1];
  const xpToNext      = nextTier ? nextTier.xpMin - mockUser.xp : 0;
  const referXpPerFriend = 800;
  const friendsNeeded = Math.ceil(xpToNext / referXpPerFriend);
  const gradient      = TIER_GRADIENTS[currentTier.name] ?? "from-slate-500 to-slate-400";

  const showToast = useCallback((message: string, type: "success" | "info" | "xp" = "info", xp?: number) => {
    setToast({ visible: true, message, type, xp });
  }, []);
  const hideToast = useCallback(() => setToast((t) => ({ ...t, visible: false })), []);

  return (
    <div className="min-h-screen pb-24 max-w-3xl mx-auto">

      {/* ── Explorer Profile Hero ── */}
      <section aria-labelledby="profile-title" className="bg-neutral-01 border-b border-neutral-10 px-5 pt-16 pb-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="relative shrink-0">
            <div className={`w-[7.2rem] h-[7.2rem] rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-3xl font-extrabold shadow-card`}>
              {mockUser.firstName.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-[2.4rem] h-[2.4rem] rounded-full bg-white border-2 border-neutral-10 flex items-center justify-center shadow-card">
              <Star size={12} className="text-amber-500" fill="currentColor" />
            </div>
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-neutral-40 text-xs font-medium mb-0.5">@explorer_{mockUser.firstName.toLowerCase()}</p>
            <h1 id="profile-title" className="text-xl font-extrabold text-neutral-90 leading-tight">{mockUser.name}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <button
                onClick={() => setShowTierSheet(true)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r ${gradient} rounded-full text-white text-xs font-bold animate-pulse focus:outline-none focus:ring-2 focus:ring-white/60`}
                aria-label="Xem cấp bậc thành viên"
              >
                <TierIcon name={currentTier.name} size={12} className="text-white" />
                {currentTier.name} Member
              </button>
              <span className="text-neutral-40 text-xs">NTRP {mockUser.ntrpLevel}</span>
            </div>
          </div>
          <Link href="/share-card" className="shrink-0" onClick={() => showToast("Đang tải thẻ thành tích…", "info")}>
            <button className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-05 border border-neutral-10 rounded-full text-neutral-70 text-sm font-semibold hover:bg-neutral-10 transition-colors duration-150 focus:ring-2 focus:ring-brand-primary" aria-label="Chia sẻ thành tích">
              <Share2 size={14} aria-hidden="true" />
            </button>
          </Link>
        </div>

        {/* FEI inline */}
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 size={14} className="text-brand-light shrink-0" aria-hidden />
          <p className="text-brand-light text-xs font-semibold">
            FEI {feiScoreData.totalFEI}/100 · PASSED · Vượt mục tiêu +{feiScoreData.totalFEI - feiScoreData.targetFEI} điểm
          </p>
        </div>

        {/* XP Pill */}
        <button
          onClick={() => setShowActivitySheet(true)}
          className="w-full flex items-center justify-between bg-brand-tint border border-brand-primary/20 rounded-full px-5 py-3 mb-5 hover:bg-brand-primary/10 transition-colors duration-150 focus:ring-2 focus:ring-brand-primary"
          aria-label="Xem chi tiết XP"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🪙</span>
            <span className="text-brand-primary font-extrabold text-lg">{xpCount.toLocaleString("vi-VN")}</span>
            <span className="text-brand-primary/60 text-sm font-normal">XP</span>
          </div>
          <div className="flex items-center gap-1 text-brand-primary text-sm font-semibold">
            Kiếm thêm
            <ArrowRight size={14} aria-hidden />
          </div>
        </button>

        {/* Stats grid 2×2 */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { icon: <Sparkles size={16} className="text-yellow-500" aria-hidden />, bg: "bg-yellow-50 border-yellow-100", value: `Lv ${avatarLevel.level}`, label: "Cấp độ" },
            { icon: <Calendar size={16} className="text-blue-500" aria-hidden />,   bg: "bg-blue-50 border-blue-100",   value: "3 ngày",                  label: "Đã trải nghiệm" },
            { icon: <Trophy size={16} className="text-amber-500" aria-hidden />,    bg: "bg-amber-50 border-amber-100", value: `${badges.length} badges`,  label: "Đã nhận" },
            { icon: <MapPin size={16} className="text-green-500" aria-hidden />,    bg: "bg-green-50 border-green-100", value: "1 tour",                   label: "Hoàn thành" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border rounded-xl px-4 py-3 flex items-center gap-3`}>
              <div className="shrink-0 w-9 h-9 rounded-full bg-white shadow-card flex items-center justify-center">{s.icon}</div>
              <div>
                <p className="text-neutral-90 font-extrabold text-base leading-none">{s.value}</p>
                <p className="text-neutral-40 text-xs mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Chờ XP ── */}
      {(!reviewDone || !uploadDone) && (
        <section className="px-4 pt-4 pb-2" aria-label="Chờ XP">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" aria-label="Chọn ảnh hành trình"
            onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; setUploadPreview(URL.createObjectURL(file)); }} />
          <div className="grid grid-cols-2 gap-3">
            {!reviewDone ? (
              <button onClick={() => setShowReviewSheet(true)}
                className="bg-neutral-01 border border-neutral-10 rounded-xl p-4 flex flex-col items-start gap-2 shadow-card hover:bg-neutral-03 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary text-left">
                <span className="text-xl">✍️</span>
                <p className="text-sm font-semibold text-neutral-90 leading-tight">Viết review hành trình</p>
              </button>
            ) : (
              <div className="bg-brand-tint border border-brand-light/30 rounded-xl p-4 flex flex-col items-start gap-2">
                <CheckCircle2 size={16} className="text-brand-light" aria-hidden />
                <p className="text-xs font-semibold text-brand-light">Review đã gửi</p>
              </div>
            )}
            {!uploadDone ? (
              <div className="bg-neutral-01 border border-neutral-10 rounded-xl p-4 flex flex-col items-start gap-2 shadow-card">
                {uploadPreview
                  ? <img src={uploadPreview} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-neutral-10" />
                  : <span className="text-xl">📸</span>
                }
                <p className="text-sm font-semibold text-neutral-90 leading-tight flex-1">Upload ảnh hành trình</p>
                {!uploadPreview ? (
                  <button onClick={() => fileInputRef.current?.click()}
                    className="text-brand-primary text-xs font-bold hover:underline focus:outline-none focus:ring-1 focus:ring-brand-primary rounded min-h-11">
                    Chọn ảnh
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => { setUploadPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="text-neutral-30 text-xs hover:text-neutral-50 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-brand-primary rounded min-h-11">
                      Đổi
                    </button>
                    <button onClick={() => { setUploadDone(true); showToast("+100 XP · Ảnh hành trình đã lưu!", "xp"); }}
                      className="text-brand-light text-xs font-bold hover:underline focus:outline-none focus:ring-1 focus:ring-brand-light rounded min-h-11">
                      Xác nhận
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-brand-tint border border-brand-light/30 rounded-xl p-4 flex flex-col items-start gap-2">
                <CheckCircle2 size={16} className="text-brand-light" aria-hidden />
                <p className="text-xs font-semibold text-brand-light">Ảnh đã lưu</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Destination Card Stack ── */}
      <DestinationCardStack showToast={showToast} />

      {/* ── FEI Card — standalone ── */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => setShowFeiSheet(true)}
          className="w-full bg-neutral-01 rounded-xl border border-neutral-10 shadow-card p-5 flex items-center gap-5 hover:bg-neutral-03 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary text-left"
          aria-label="Xem FEI Score chi tiết"
        >
          <div className="relative shrink-0">
            <ArcProgress score={feiScoreData.totalFEI} size={80} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xl font-extrabold text-neutral-90 leading-none">{feiScoreData.totalFEI}</p>
              <p className="text-neutral-40 text-[0.6rem]">/100</p>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-neutral-40 text-xs uppercase tracking-widest mb-1">Food Experience Index</p>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-tint border border-brand-light/30 rounded-full text-brand-light font-bold text-xs mb-2">
              <CheckCircle2 size={11} aria-hidden /> PASSED
            </span>
            <p className="text-neutral-50 text-xs">
              Mục tiêu {feiScoreData.targetFEI}/100 · <span className="font-bold text-brand-light">+{feiScoreData.totalFEI - feiScoreData.targetFEI} vượt</span>
            </p>
          </div>
          <ArrowRight size={16} className="text-neutral-30 shrink-0" aria-hidden />
        </button>
      </div>

      {/* ── Badges ── */}
      <div className="px-4 pt-4">
        <section aria-label="Badges">
          <div className="flex gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-tint border border-brand-light/30 rounded-full text-brand-light text-xs font-bold">
              <CheckCircle2 size={12} aria-hidden /> {badges.length} đã nhận
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-05 border border-neutral-10 rounded-full text-neutral-40 text-xs font-bold">
              <Lock size={12} aria-hidden /> {LOCKED_BADGES.length} chờ mở
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {badges.map((badge, i) => {
              const colors = badgeColors[badge.id] ?? { bg: "bg-brand-tint", ring: "ring-brand-tint", icon: "text-brand-primary" };
              const isNewest = i === badges.length - 1;
              const glowName = badge.id === "first_serve" ? "Blue" : badge.id === "fei_master" ? "Amber" : "Purple";
              return (
                <button key={badge.id} onClick={() => setActiveBadge(badge)}
                  className={`relative ${colors.bg} rounded-xl ring-2 ${colors.ring} p-3 text-center hover:-translate-y-1 hover:shadow-elevated transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary`}
                  style={{ animation: `badgeGlow${glowName} 3s ease-in-out infinite` }}
                  aria-label={`${badge.name} — tap để xem chi tiết`}>
                  {isNewest && (
                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-brand-secondary text-white text-[0.55rem] font-extrabold rounded-full uppercase tracking-wide">NEW</span>
                  )}
                  <div className="flex justify-center mb-2">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-card">
                      {badgeIconMap[badge.icon]?.(22, colors.icon)}
                    </div>
                  </div>
                  <p className="font-bold text-neutral-90 text-xs leading-tight">{badge.name}</p>
                </button>
              );
            })}
          </div>
          <p className="text-neutral-40 text-xs font-bold uppercase tracking-widest mb-3">Chờ mở khóa</p>
          <div className="space-y-2.5">
            {LOCKED_BADGES.map((b) => {
              const pct = Math.min(100, Math.round((b.progress / b.total) * 100));
              return (
                <button key={b.id}
                  className="w-full bg-neutral-03 rounded-xl border border-neutral-10 px-4 py-3 flex items-center gap-3 text-left hover:bg-neutral-05 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  onClick={() => showToast(b.hint, "info")}
                  aria-label={`${b.name} — ${b.hint}`}>
                  <div className="shrink-0 w-10 h-10 rounded-full bg-neutral-10 flex items-center justify-center text-lg opacity-50">{b.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="font-semibold text-neutral-50 text-sm">{b.name}</p>
                      <span className="text-neutral-30 text-xs">{b.progress}{b.unit ?? ""}/{b.total}{b.unit ?? ""}</span>
                    </div>
                    <div className="h-1.5 bg-neutral-10 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── Sticky CTA ── */}
      <div className="fixed left-0 right-0 z-[100] px-4 pb-2.5 pt-3" style={{ bottom: "53px", background: "linear-gradient(to top, rgba(255,255,255,1) 60%, rgba(255,255,255,0))" }}>
        <Link href="/share-card">
          <button className={`w-full py-4 bg-gradient-to-r ${gradient} text-white font-extrabold text-[1.6rem] rounded-lg shadow-elevated hover:opacity-90 transition-opacity duration-150 flex items-center justify-center gap-2 focus:ring-2 focus:ring-white/60`}>
            <Trophy size={18} aria-hidden />
            Xem thẻ hành trình · Ưu đãi 10%
          </button>
        </Link>
      </div>

      {/* ── Badge glow keyframes ── */}
      <style>{`
        @keyframes badgeGlowBlue { 0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); } 50% { box-shadow: 0 0 16px 4px rgba(59,130,246,0.25); } }
        @keyframes badgeGlowAmber { 0%, 100% { box-shadow: 0 0 0 0 rgba(217,119,6,0); } 50% { box-shadow: 0 0 16px 4px rgba(217,119,6,0.25); } }
        @keyframes badgeGlowPurple { 0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0); } 50% { box-shadow: 0 0 16px 4px rgba(124,58,237,0.25); } }
      `}</style>

      {/* ── Badge Detail Modal ── */}
      <AnimatePresence>
        {activeBadge && (
          <>
            <motion.div className="fixed inset-0 bg-black/40 z-[300]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setActiveBadge(null)} aria-hidden />
            <motion.div className="fixed left-4 right-4 z-[300] bg-neutral-01 rounded-2xl shadow-elevated p-6 text-center" style={{ top: "50%", transform: "translateY(-50%)" }}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}
              role="dialog" aria-modal="true" aria-label={activeBadge.name}>
              {(() => {
                const colors = badgeColors[activeBadge.id] ?? { bg: "bg-brand-tint", ring: "ring-brand-tint", icon: "text-brand-primary" };
                return (
                  <>
                    <button onClick={() => setActiveBadge(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-neutral-05 flex items-center justify-center hover:bg-neutral-10 transition-colors focus:ring-2 focus:ring-brand-primary" aria-label="Đóng">
                      <X size={14} className="text-neutral-50" aria-hidden />
                    </button>
                    <div className={`w-24 h-24 rounded-full ${colors.bg} ring-4 ${colors.ring} flex items-center justify-center mx-auto mb-4 shadow-elevated`}>
                      {badgeIconMap[activeBadge.icon]?.(36, colors.icon)}
                    </div>
                    <h3 className="text-xl font-extrabold text-neutral-90 mb-1">{activeBadge.name}</h3>
                    <p className="text-neutral-50 text-sm mb-2">{activeBadge.description}</p>
                    <span className="inline-block px-3 py-1 bg-neutral-05 rounded-full text-neutral-40 text-xs font-medium mb-5">Nhận ngày {activeBadge.earnedAt}</span>
                    <Link href="/share-card" onClick={() => setActiveBadge(null)}>
                      <button className="w-full py-3 bg-brand-primary text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-colors focus:ring-2 focus:ring-brand-primary">
                        <Share2 size={15} aria-hidden /> Chia sẻ thành tích
                      </button>
                    </Link>
                  </>
                );
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── FEI Bottom Sheet ── */}
      <AnimatePresence>
        {showFeiSheet && (
          <>
            <motion.div className="fixed inset-0 bg-black/40 z-[300]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setShowFeiSheet(false)} aria-hidden />
            <motion.div className="fixed left-0 right-0 bottom-0 z-[300] bg-neutral-01 rounded-t-2xl shadow-elevated max-h-[85vh] flex flex-col"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              role="dialog" aria-modal="true" aria-label="FEI 5 chỉ số chi tiết">
              <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="w-10 h-1 bg-neutral-10 rounded-full" /></div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-10 shrink-0">
                <h2 className="text-base font-bold text-neutral-90">5 Chỉ số FEI</h2>
                <button onClick={() => setShowFeiSheet(false)} className="w-8 h-8 rounded-full bg-neutral-05 flex items-center justify-center hover:bg-neutral-10 transition-colors duration-150 focus:ring-2 focus:ring-brand-primary" aria-label="Đóng">
                  <X size={14} className="text-neutral-50" aria-hidden />
                </button>
              </div>
              <div className="overflow-y-auto px-4 py-4 space-y-3 pb-8">
                {feiScoreData.subIndices.map((idx) => {
                  const color = FEI_COLOR(idx.score);
                  const bgClass = idx.score >= 90 ? "bg-green-50 border-green-100" : idx.score >= 85 ? "bg-blue-50 border-blue-100" : "bg-amber-50 border-amber-100";
                  return (
                    <div key={idx.code} className={`rounded-xl border ${bgClass} p-4`}>
                      <div className="flex items-start justify-between mb-2.5">
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-extrabold text-neutral-90 text-sm">{idx.code}</span>
                            <span className="text-neutral-50 text-sm">{idx.name}</span>
                          </div>
                          <p className="text-neutral-40 text-xs">{idx.description}</p>
                        </div>
                        <span className="font-extrabold text-2xl shrink-0" style={{ color }}>{idx.score}</span>
                      </div>
                      <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${idx.score}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Tier Bottom Sheet ── */}
      <AnimatePresence>
        {showTierSheet && (
          <>
            <motion.div className="fixed inset-0 bg-black/40 z-[300]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setShowTierSheet(false)} aria-hidden />
            <motion.div className="fixed left-0 right-0 bottom-0 z-[300] bg-neutral-01 rounded-t-2xl shadow-elevated max-h-[85vh] flex flex-col"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              role="dialog" aria-modal="true" aria-label="Cấp bậc thành viên">
              <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="w-10 h-1 bg-neutral-10 rounded-full" /></div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-10 shrink-0">
                <h2 className="text-base font-bold text-neutral-90">Cấp bậc thành viên</h2>
                <button onClick={() => setShowTierSheet(false)} className="w-8 h-8 rounded-full bg-neutral-05 flex items-center justify-center hover:bg-neutral-10 transition-colors duration-150 focus:ring-2 focus:ring-brand-primary" aria-label="Đóng">
                  <X size={14} className="text-neutral-50" aria-hidden />
                </button>
              </div>
              <div className="overflow-y-auto px-4 py-4 space-y-3.5 pb-8">
                {tiers.map((tier) => {
                  const isCurrent = tier.name === mockUser.tier;
                  const isLocked = tiers.indexOf(tier) > tiers.indexOf(currentTier);
                  const tierGrad = TIER_GRADIENTS[tier.name] ?? "from-slate-400 to-slate-300";
                  return (
                    <div key={tier.name} className={`rounded-xl border overflow-hidden transition-all duration-200 ${isCurrent ? "border-transparent shadow-elevated" : isLocked ? "border-neutral-10 opacity-60" : "border-neutral-10"}`}>
                      <div className={`bg-gradient-to-r ${tierGrad} px-5 py-3.5 flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <TierIcon name={tier.name} size={22} className="text-white" />
                          <div>
                            <p className="font-extrabold text-base text-white">{tier.name}</p>
                            <p className="text-white/70 text-xs">{tier.xpMin.toLocaleString("vi-VN")} – {tier.xpMax >= 999999 ? "∞" : tier.xpMax.toLocaleString("vi-VN")} XP</p>
                          </div>
                        </div>
                        {isCurrent && <span className="px-3 py-1 bg-white/25 border border-white/40 text-white text-xs font-bold rounded-full">Hiện tại ✓</span>}
                        {isLocked && <Lock size={16} className="text-white/60" aria-hidden />}
                      </div>
                      <div className="px-5 py-3.5 bg-neutral-01">
                        <ul className="space-y-2">
                          {tier.perks.map((perk) => (
                            <li key={perk} className="flex items-center gap-2.5 text-sm">
                              <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isCurrent ? "bg-brand-tint" : "bg-neutral-05"}`}>
                                <Trophy size={10} className={isCurrent ? "text-brand-primary" : "text-neutral-30"} aria-hidden />
                              </div>
                              <span className={isLocked ? "text-neutral-40" : "text-neutral-50"}>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Review Bottom Sheet ── */}
      <AnimatePresence>
        {showReviewSheet && (
          <>
            <motion.div className="fixed inset-0 bg-black/40 z-[300]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setShowReviewSheet(false)} aria-hidden />
            <motion.div className="fixed left-0 right-0 bottom-0 z-[300] bg-neutral-01 rounded-t-2xl shadow-elevated max-h-[80vh] flex flex-col"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              role="dialog" aria-modal="true" aria-label="Viết review hành trình">
              <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="w-10 h-1 bg-neutral-10 rounded-full" /></div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-10 shrink-0">
                <h2 className="text-base font-bold text-neutral-90">Cảm nhận của bạn</h2>
                <button onClick={() => setShowReviewSheet(false)} className="w-8 h-8 rounded-full bg-neutral-05 flex items-center justify-center hover:bg-neutral-10 transition-colors duration-150 focus:ring-2 focus:ring-brand-primary" aria-label="Đóng">
                  <X size={14} className="text-neutral-50" aria-hidden />
                </button>
              </div>
              <div className="px-5 py-5 flex flex-col gap-4">
                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Chia sẻ cảm nhận về hành trình Đà Nẵng của bạn…" rows={5}
                  className="w-full resize-none rounded-lg border border-neutral-10 bg-neutral-03 px-4 py-3 text-sm text-neutral-90 placeholder-neutral-30 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors duration-150"
                  aria-label="Nội dung review" />
                <p className="text-neutral-30 text-xs">{reviewText.length} / 20 ký tự tối thiểu</p>
                <button disabled={reviewText.trim().length < 20}
                  onClick={() => { setShowReviewSheet(false); setReviewDone(true); showToast("+150 XP · Cảm ơn bạn đã review!", "xp"); }}
                  className="w-full py-3.5 bg-brand-primary text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-colors duration-150 focus:ring-2 focus:ring-brand-primary disabled:opacity-40 disabled:cursor-not-allowed">
                  Gửi review · +150 XP
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Activity Bottom Sheet ── */}
      <AnimatePresence>
        {showActivitySheet && (
          <>
            <motion.div className="fixed inset-0 bg-black/40 z-[300]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setShowActivitySheet(false)} aria-hidden />
            <motion.div className="fixed left-0 right-0 bottom-0 z-[300] bg-neutral-01 rounded-t-2xl shadow-elevated max-h-[80vh] flex flex-col"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              role="dialog" aria-modal="true" aria-label="Hoạt động XP">
              <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="w-10 h-1 bg-neutral-10 rounded-full" /></div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-10 shrink-0">
                <h2 className="text-base font-bold text-neutral-90">Hoạt động</h2>
                <button onClick={() => setShowActivitySheet(false)} className="w-8 h-8 rounded-full bg-neutral-05 flex items-center justify-center hover:bg-neutral-10 transition-colors duration-150 focus:ring-2 focus:ring-brand-primary" aria-label="Đóng">
                  <X size={14} className="text-neutral-50" aria-hidden />
                </button>
              </div>
              <div className="overflow-y-auto px-4 py-4 space-y-2.5 pb-8">
                {xpActions.map((action) => (
                  <button key={action.action}
                    className={`w-full flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-11 ${action.earned ? "bg-neutral-01 border-brand-light/30 shadow-[rgba(3,145,255,0.08)_0px_2px_8px]" : "bg-neutral-03 border-neutral-10 hover:bg-neutral-05"}`}
                    onClick={() => { if (!action.earned) showToast(`Hoàn thành tour để mở khóa +${action.xp} XP`, "info"); }}
                    aria-label={`${action.action} — ${action.earned ? "Đã hoàn thành" : `Chưa mở, +${action.xp} XP`}`}>
                    <span className={`shrink-0 flex items-center justify-center w-[4.4rem] h-[4.4rem] rounded-lg ${action.earned ? "bg-brand-tint" : "bg-neutral-05"}`}>
                      {xpIconMap[action.icon]?.(20, action.earned ? "text-brand-light" : "text-neutral-30")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm leading-snug ${action.earned ? "text-neutral-90" : "text-neutral-40"}`}>{action.action}</p>
                      <p className={`text-xs mt-0.5 font-bold ${action.earned ? "text-brand-light" : "text-neutral-30"}`}>+{action.xp.toLocaleString("vi-VN")} XP</p>
                    </div>
                    {action.earned ? (
                      <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-brand-tint border border-brand-light/30 rounded-full text-brand-light text-xs font-bold">
                        <CheckCircle2 size={12} aria-hidden /> Xong
                      </span>
                    ) : (
                      <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-neutral-05 border border-neutral-10 rounded-full text-neutral-30 text-xs font-bold">
                        <Lock size={11} aria-hidden /> Khóa
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Toast visible={toast.visible} message={toast.message} type={toast.type} xp={toast.xp} onHide={hideToast} />
    </div>
  );
}
