"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { mockUser, badges, feiScoreData } from "@/lib/mock-data";
import { Download, Link2, Share2, Timer, Trophy, Zap, UtensilsCrossed, Star, ArrowRight } from "lucide-react";
import VietravelIcon from "@/components/ui/VietravelIcon";
import { tourPackages, getNtrpLevel, formatVNDShort } from "@/lib/mock-data";

function useCountdown(days: number) {
  const [secondsLeft, setSecondsLeft] = useState(days * 24 * 60 * 60);
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const d = Math.floor(secondsLeft / 86400);
  const h = Math.floor((secondsLeft % 86400) / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;
  return { d, h, m, s, total: secondsLeft };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-neutral-03 rounded-[0.8rem] px-[1.0rem] py-[0.8rem] min-w-[4.8rem] border border-neutral-10">
      <span className="text-[2rem] font-extrabold text-brand-primary tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-neutral-40 text-[1.1rem]">{label}</span>
    </div>
  );
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  Zap: <Zap size={16} aria-hidden="true" />,
  UtensilsCrossed: <UtensilsCrossed size={16} aria-hidden="true" />,
  Trophy: <Trophy size={16} aria-hidden="true" />,
};

const TOUR_HIGHLIGHTS = [
  { emoji: "🎾", title: "2 trận thắng", desc: "Giải nội bộ Court A" },
  { emoji: "🍜", title: "8 bữa FEI", desc: "Điểm TB 89/100" },
  { emoji: "🏝️", title: "Đà Nẵng 3N2D", desc: "13–15/06/2026" },
];

const SOCIAL_PLATFORMS = [
  { name: "Facebook", bg: "#1877F2", color: "#fff" },
  { name: "Instagram", bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", color: "#fff" },
  { name: "Zalo", bg: "#0068FF", color: "#fff" },
];

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-[0.8rem]" role="group" aria-label="Chọn số sao đánh giá">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            aria-label={`${star} sao`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none focus:ring-2 focus:ring-brand-primary rounded"
          >
            <Star
              size={28}
              fill={active ? "#f59e0b" : "none"}
              stroke={active ? "#f59e0b" : "#d1d5db"}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

function NextTourSuggestion() {
  const { recommendedSBU, label: ntrpLabel } = getNtrpLevel(mockUser.ntrpLevel);
  const pkg = tourPackages.find((p) => p.id === recommendedSBU);
  if (!pkg) return null;
  const bgColor = pkg.color ?? "#0f4c2a";
  return (
    <section aria-labelledby="next-tour-title" className="mb-[2.4rem]">
      <h2 id="next-tour-title" className="font-bold text-neutral-90 text-[1.7rem] mb-[1.2rem]">
        Gợi ý cho bạn
      </h2>
      <div className="rounded-[1.6rem] overflow-hidden relative" style={{ background: `linear-gradient(135deg, ${bgColor}cc 0%, ${bgColor} 50%, ${bgColor}cc 100%)` }}>
        <div className="p-[2rem]">
          <span className="inline-block px-[1.0rem] py-[0.4rem] rounded-[2rem] bg-white/20 text-white text-[1.1rem] font-semibold mb-[1.2rem]">
            🎾 Phù hợp với NTRP {mockUser.ntrpLevel} — {ntrpLabel}
          </span>
          <h3 className="text-white text-[1.8rem] font-extrabold mb-[0.4rem]">{pkg.name}</h3>
          <p className="text-white/70 text-[1.3rem] mb-[1.6rem]">{pkg.tagline}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-[1.1rem]">Từ</p>
              <p className="text-white text-[2rem] font-extrabold">{formatVNDShort(pkg.priceRange.min)}</p>
            </div>
            <Link href={`/booking?package=${pkg.id}`}>
              <button className="flex items-center gap-[0.6rem] bg-white font-bold text-[1.3rem] px-[1.6rem] py-[1.0rem] rounded-[4rem] hover:bg-white/90 transition-colors min-h-[44px]" style={{ color: bgColor }}>
                Xem tour
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ShareCardView() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [voucherCopied, setVoucherCopied] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const countdown = useCountdown(30);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a1628",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `tennis-travel-${mockUser.name.replace(/\s/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Không thể tải ảnh. Vui lòng dùng chức năng chụp màn hình.");
    } finally {
      setDownloading(false);
    }
  }, []);

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleCopyVoucher = useCallback(async () => {
    await navigator.clipboard.writeText("TENNIS10").catch(() => {});
    setVoucherCopied(true);
    setTimeout(() => setVoucherCopied(false), 2000);
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      await navigator
        .share({
          title: "Tennis Travel Experience — Thẻ thành tích",
          text: `${mockUser.name} đã hoàn thành Tour Đà Nẵng 3N2D với ${mockUser.xp} XP và FEI ${feiScoreData.totalFEI}/100! #TennisTravelVN`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      handleCopyLink();
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  }, [handleCopyLink]);

  const handleSubmitRating = useCallback(() => {
    if (rating === 0) return;
    setRatingSubmitted(true);
  }, [rating]);

  return (
    <div className="min-h-screen px-[1.6rem] md:px-[2.4rem] lg:px-[3.2rem] pt-[5.4rem] pb-[3.2rem] max-w-2xl mx-auto">

      {/* ── Personalised header ── */}
      <div className="mb-[2.4rem]">
        <div className="flex items-center gap-[0.8rem] mb-[0.4rem]">
          <span className="text-[2.8rem] leading-none">🎉</span>
          <h1 className="text-[2.2rem] font-bold text-neutral-90">
            Chúc mừng, {mockUser.firstName}!
          </h1>
        </div>
        <p className="text-neutral-40 text-[1.4rem]">
          Bạn đã hoàn thành <span className="font-semibold text-neutral-70">Tour Đà Nẵng 3N2D</span> · 13–15/06/2026
        </p>
      </div>

      {/* ── Achievement Card ── */}
      <div
        ref={cardRef}
        className="rounded-[1.6rem] overflow-hidden mb-[2.0rem] select-none relative"
        aria-label="Thẻ thành tích cá nhân"
        style={{ aspectRatio: "3/4" }}
      >
        <Image
          src="/the-thanh-tich.png"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-end p-[2rem]">
          <div
            style={{
              background: "rgba(20, 35, 20, 0.75)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              borderRadius: "1.4rem",
              border: "1px solid rgba(255,255,255,0.14)",
              padding: "20px",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>
              SPORT
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
              <div>
                <h2 style={{ color: "white", fontSize: "26px", fontWeight: 800, lineHeight: 1.1, marginBottom: "4px" }}>
                  {mockUser.name}
                </h2>
                <p style={{ color: "#86efac", fontSize: "12px" }}>Tour Đà Nẵng 3N2D · 13–15/06/2026</p>
              </div>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "white", fontWeight: 800, fontSize: "16px" }}>{mockUser.name.charAt(0)}</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "16px", marginBottom: "16px" }}>
              {[
                { icon: "🏆", value: mockUser.xp.toLocaleString("vi-VN"), sub: "xp", label: "tổng hợp" },
                { icon: "🎯", value: `${feiScoreData.totalFEI}/100`, sub: "", label: "fei score" },
                { icon: "🎖️", value: "2", sub: "", label: "trận thắng" },
              ].map(({ icon, value, sub, label }) => (
                <div key={label} style={{ backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: "16px", marginBottom: "4px" }}>{icon}</div>
                  <p style={{ color: "white", fontSize: "16px", fontWeight: 800, lineHeight: 1 }}>
                    {value}<span style={{ fontSize: "10px", fontWeight: 500, marginLeft: "2px" }}>{sub}</span>
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", marginTop: "2px" }}>{label}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "14px" }}>
              <div style={{ fontSize: "24px" }}>🥇</div>
              <div>
                <p style={{ color: "white", fontWeight: 700, fontSize: "14px" }}>Chúc mừng!</p>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px" }}>Bạn đã hoàn thành giải đấu thành công.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3 nút hành động ── */}
      <div className="grid grid-cols-3 gap-[1.2rem] mb-[3.2rem]">
        <Button
          variant="primary"
          onClick={handleDownload}
          loading={downloading}
          className="flex-col py-[1.4rem] gap-[0.6rem] text-[1.2rem]"
        >
          <Download size={20} aria-hidden="true" />
          Tải về
        </Button>
        <Button
          variant="neutral"
          onClick={handleCopyLink}
          className="flex-col py-[1.4rem] gap-[0.6rem] text-[1.2rem]"
        >
          <Link2 size={20} aria-hidden="true" />
          {copied ? "Đã copy!" : "Copy link"}
        </Button>
        <Button
          variant="ghost"
          onClick={handleShare}
          className="flex-col py-[1.4rem] gap-[0.6rem] text-[1.2rem]"
        >
          <Share2 size={20} aria-hidden="true" />
          {shared ? "Đã chia sẻ!" : "Chia sẻ"}
        </Button>
      </div>

      {/* ── Hành trình nổi bật ── */}
      <section aria-labelledby="highlights-title" className="mb-[2.4rem]">
        <h2 id="highlights-title" className="font-bold text-neutral-90 text-[1.7rem] mb-[1.2rem]">
          Hành trình nổi bật
        </h2>
        <div className="grid grid-cols-3 gap-[1.0rem]">
          {TOUR_HIGHLIGHTS.map(({ emoji, title, desc }) => (
            <div
              key={title}
              className="bg-neutral-01 rounded-[1.2rem] border border-neutral-10 p-[1.2rem] flex flex-col items-center text-center gap-[0.4rem] shadow-[rgba(0,0,0,0.05)_0px_1px_4px]"
            >
              <span className="text-[2.4rem] leading-none">{emoji}</span>
              <p className="font-bold text-neutral-90 text-[1.3rem] leading-tight">{title}</p>
              <p className="text-neutral-40 text-[1.1rem] leading-snug">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Đánh giá tour ── */}
      <section
        aria-labelledby="rating-title"
        className="bg-neutral-01 rounded-[1.2rem] border border-neutral-10 p-[2rem] mb-[2.4rem] shadow-[rgba(0,0,0,0.05)_0px_1px_4px]"
      >
        {ratingSubmitted ? (
          <div className="text-center py-[0.8rem]">
            <p className="text-[2.4rem] mb-[0.4rem]">🙏</p>
            <p className="font-bold text-neutral-90 text-[1.5rem]">Cảm ơn bạn đã đánh giá!</p>
            <p className="text-neutral-40 text-[1.3rem] mt-[0.4rem]">Ý kiến của bạn giúp Vietravel cải thiện trải nghiệm.</p>
          </div>
        ) : (
          <>
            <h2 id="rating-title" className="font-bold text-neutral-90 text-[1.6rem] mb-[0.4rem]">
              Bạn thấy tour thế nào?
            </h2>
            <p className="text-neutral-40 text-[1.3rem] mb-[1.6rem]">
              Ý kiến của bạn giúp cộng đồng chọn tour tốt hơn
            </p>
            <StarRating value={rating} onChange={setRating} />
            {rating > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitRating}
                className="mt-[1.4rem]"
              >
                Gửi đánh giá
              </Button>
            )}
          </>
        )}
      </section>

      {/* ── Thành tựu đã mở khóa ── */}
      <section aria-labelledby="badges-title" className="mb-[2.4rem]">
        <h2 id="badges-title" className="font-bold text-neutral-90 text-[1.7rem] mb-[1.2rem]">
          Thành tựu đã mở khóa
        </h2>
        <div className="flex flex-col gap-[0.8rem]">
          {badges.map((b) => (
            <div
              key={b.id}
              className="bg-neutral-01 rounded-[1.2rem] border border-neutral-10 px-[1.6rem] py-[1.2rem] flex items-center gap-[1.2rem] shadow-[rgba(0,0,0,0.05)_0px_1px_4px]"
            >
              <div className="shrink-0 w-[4rem] h-[4rem] rounded-full bg-brand-tint flex items-center justify-center text-brand-primary">
                {BADGE_ICONS[b.icon]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-neutral-90 text-[1.4rem]">{b.name}</p>
                <p className="text-neutral-40 text-[1.2rem]">{b.description}</p>
              </div>
              <span className="shrink-0 text-neutral-30 text-[1.1rem]">{b.earnedAt}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Voucher section ── */}
      <section
        aria-labelledby="voucher-title"
        className="bg-neutral-01 rounded-[0.8rem] border border-neutral-10 shadow-[rgba(0,0,0,0.08)_0px_2px_8px] p-[2.4rem] mb-[2.4rem]"
      >
        <div className="flex items-start gap-[1.2rem] mb-[2rem]">
          <div className="shrink-0 w-[4rem] h-[4rem] rounded-full bg-brand-tint flex items-center justify-center">
            <VietravelIcon id="gift-bold" size={20} className="text-brand-primary" />
          </div>
          <div>
            <h2 id="voucher-title" className="font-bold text-neutral-90 text-[1.7rem] leading-tight">
              Voucher <span className="text-brand-secondary">10% OFF</span> cho tour tiếp theo
            </h2>
            <p className="text-neutral-40 text-[1.4rem] mt-[0.4rem]">
              Đã được kích hoạt tự động cho tài khoản của bạn
            </p>
          </div>
        </div>

        <div className="mb-[2rem]">
          <p className="text-neutral-40 text-[1.2rem] mb-[0.8rem] flex items-center gap-[0.4rem]">
            <Timer size={12} aria-hidden="true" />
            Voucher hết hạn sau:
          </p>
          <div
            className="grid grid-cols-4 gap-[0.6rem]"
            role="timer"
            aria-label={`Hết hạn sau ${countdown.d} ngày ${countdown.h} giờ ${countdown.m} phút`}
            aria-live="off"
          >
            <CountdownUnit value={countdown.d} label="ngày" />
            <CountdownUnit value={countdown.h} label="giờ" />
            <CountdownUnit value={countdown.m} label="phút" />
            <CountdownUnit value={countdown.s} label="giây" />
          </div>
        </div>

        <div className="bg-brand-tint rounded-[0.8rem] border border-brand-tint p-[1.6rem] mb-[2rem] flex items-center justify-between gap-[1.2rem]">
          <div className="min-w-0">
            <p className="text-neutral-40 text-[1.2rem] mb-[0.4rem]">Mã voucher</p>
            <p className="text-brand-primary font-mono font-extrabold text-[2.4rem] tracking-widest">
              TENNIS10
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCopyVoucher}
            className="shrink-0"
          >
            {voucherCopied ? "Đã copy!" : "Copy mã"}
          </Button>
        </div>

        <Link href="/booking">
          <Button variant="primary" size="lg" className="w-full">
            <Trophy size={18} aria-hidden="true" />
            Đặt tour tiếp theo ngay
          </Button>
        </Link>
      </section>

      {/* ── Gợi ý tour tiếp theo ── */}
      <NextTourSuggestion />

      {/* ── Social share ── */}
      <div className="text-center">
        <p className="text-neutral-40 text-[1.4rem] mb-[0.4rem]">Chia sẻ lên mạng xã hội và nhận</p>
        <p className="text-brand-primary font-extrabold text-[1.6rem] flex items-center justify-center gap-[0.4rem] mb-[1.0rem]">
          +100 XP <Share2 size={14} aria-hidden="true" />
        </p>
        <p className="text-neutral-40 text-[1.2rem] mb-[1.4rem]">
          🔥 47 người đã chia sẻ thẻ này tuần qua
        </p>
        <div className="flex justify-center gap-[1.0rem]">
          {SOCIAL_PLATFORMS.map(({ name, bg, color }) => (
            <button
              key={name}
              type="button"
              onClick={handleShare}
              style={{ background: bg, color }}
              className="px-[1.6rem] py-[0.8rem] rounded-[4rem] font-semibold text-[1.3rem] min-h-[44px] transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary cursor-pointer"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
