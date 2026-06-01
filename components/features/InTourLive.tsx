"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Toast from "@/components/ui/Toast";
import { danangItinerary } from "@/lib/mock-data";
import { Radio, MessageCircle, CheckCircle2, CircleDot, Clock, Trophy, Zap } from "lucide-react";
import VietravelIcon from "@/components/ui/VietravelIcon";

const LIVE_DAY = 2;

const coachTips: Record<number, string> = {
  1: "Ngày đầu tiên — tập trung khởi động nhẹ và cảm nhận sân. Không cần ép mình, cơ thể cần thích nghi với thời tiết Đà Nẵng.",
  2: "Tăng tốc cú serve, hướng vào góc T của đối thủ. Giữ vị trí sau baseline khi đối phương ở lưới.",
  3: "Ngày cuối — cool-down quan trọng hơn tập nặng. Ghi nhớ kỹ thuật đã học để áp dụng khi về nhà.",
};

const dayXp: Record<number, { current: number; max: number }> = {
  1: { current: 550, max: 550 },
  2: { current: 720, max: 1000 },
  3: { current: 0, max: 800 },
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "done") return <CheckCircle2 size={14} className="text-success shrink-0" aria-hidden="true" />;
  if (status === "live") return <CircleDot size={14} className="text-error animate-pulse shrink-0" aria-hidden="true" />;
  return <Clock size={14} className="text-neutral-30 shrink-0" aria-hidden="true" />;
};

export default function InTourLive() {
  const [currentDay, setCurrentDay] = useState(LIVE_DAY);
  const [toastVisible, setToastVisible] = useState(false);
  const [currentXp, setCurrentXp] = useState(dayXp[LIVE_DAY].current);
  const [activityRatings, setActivityRatings] = useState<Record<string, number>>({});

  const today = danangItinerary[currentDay - 1];
  const xpData = currentDay === LIVE_DAY
    ? { current: currentXp, max: dayXp[LIVE_DAY].max }
    : dayXp[currentDay];

  const handleRate = (activityIndex: number, stars: number) => {
    const key = String(activityIndex);
    if (activityRatings[key]) return;
    setActivityRatings((prev) => ({ ...prev, [key]: stars }));
    if (stars >= 4) {
      setCurrentXp((prev) => prev + 30);
      setToastVisible(true);
    }
  };

  const handleDayChange = (day: number) => {
    setCurrentDay(day);
  };

  return (
    <div className="min-h-screen px-[1.6rem] md:px-[2.4rem] lg:px-[3.2rem] pt-[5.4rem] pb-[3.2rem] max-w-3xl mx-auto">

      {/* Day selector tabs */}
      <div
        className="flex gap-[0.8rem] mb-[2.4rem]"
        role="tablist"
        aria-label="Chọn ngày trong tour"
      >
        {danangItinerary.map((d) => {
          const isActive = currentDay === d.day;
          const isLive = d.day === LIVE_DAY;
          const isDone = d.day < LIVE_DAY;
          return (
            <button
              key={d.day}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleDayChange(d.day)}
              className={`flex-1 py-[1.0rem] px-[0.8rem] rounded-[4rem] text-[1.3rem] font-semibold transition-all duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-brand-primary border flex flex-col items-center gap-[0.2rem] ${
                isActive
                  ? "bg-neutral-100 text-neutral-01 border-neutral-100"
                  : "bg-neutral-03 text-neutral-50 border-neutral-10 hover:border-neutral-30"
              }`}
            >
              <span>Ngày {d.day}</span>
              <span
                className={`text-[1.1rem] font-normal ${
                  isActive
                    ? "text-neutral-20"
                    : isDone
                    ? "text-success"
                    : isLive
                    ? "text-error"
                    : "text-neutral-30"
                }`}
              >
                {isDone ? "Xong" : isLive ? "Live" : "Sắp tới"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-[0.8rem]">
        <div>
          <p className="text-neutral-40 text-[1.4rem]">Ngày {currentDay} / 3</p>
          <h1 className="text-[2.2rem] font-bold text-neutral-90">{today.dateLabel}</h1>
        </div>
        {currentDay < LIVE_DAY && (
          <Badge variant="success">
            <CheckCircle2 size={10} aria-hidden="true" />
            Hoàn thành
          </Badge>
        )}
        {currentDay === LIVE_DAY && (
          <Badge variant="live" pulse>
            <Radio size={10} aria-hidden="true" />
            Đang diễn ra
          </Badge>
        )}
        {currentDay > LIVE_DAY && (
          <Badge variant="default">
            <Clock size={10} aria-hidden="true" />
            Ngày cuối
          </Badge>
        )}
      </div>
      <p className="text-brand-primary font-bold text-[1.6rem] mb-[3.2rem]">{today.title}</p>

      {/* Day 1 — First Serve intro card */}
      {currentDay === 1 && (
        <section className="mb-[3.2rem] bg-brand-tint-light rounded-[0.8rem] border border-brand-tint p-[2rem] flex gap-[1.6rem]">
          <div className="w-[4rem] h-[4rem] rounded-full bg-brand-primary flex items-center justify-center shrink-0">
            <Zap size={20} className="text-neutral-01" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-[1.6rem] text-neutral-90 mb-[0.4rem]">Chào mừng đến Đà Nẵng!</p>
            <p className="text-neutral-50 text-[1.4rem] leading-relaxed">
              Ngày 1 hoàn thành xuất sắc — nhận badge <strong>First Serve</strong>, tổng kết{" "}
              <strong className="text-brand-primary">550 XP</strong> và FEI trung bình <strong>89/100</strong>.
            </p>
          </div>
        </section>
      )}

      {/* Day 2 — Live Score Box */}
      {currentDay === LIVE_DAY && (
        <section
          aria-labelledby="live-score-title"
          className="mb-[3.2rem] bg-neutral-01 rounded-[0.8rem] border-2 border-error/30 shadow-[rgba(0,0,0,0.08)_0px_2px_8px] p-[2rem]"
        >
          <div className="flex items-center gap-[0.8rem] mb-[1.6rem] flex-wrap">
            <h2 id="live-score-title" className="font-bold text-[1.7rem] text-neutral-90">
              Trận đấu nội bộ
            </h2>
            <Badge variant="live" pulse>
              <span className="w-[0.8rem] h-[0.8rem] bg-neutral-01 rounded-full animate-pulse" aria-hidden="true" />
              LIVE
            </Badge>
            <span className="inline-flex items-center gap-[0.4rem] px-[0.8rem] py-[0.3rem] rounded-full bg-[#1a3a6b] text-white text-[1.0rem] font-bold">
              🏆 MyLeague.vn
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-[2.4rem] mb-[1.2rem]">
              <div className="text-center">
                <p className="font-bold text-[1.6rem] text-neutral-90">Minh Khoa</p>
                <p className="text-[1.2rem] text-neutral-40">NTRP 3.5</p>
              </div>
              <div>
                <p className="text-[3.2rem] font-extrabold text-brand-primary">6–4 · 3–2</p>
                <p className="text-[1.2rem] text-neutral-40 text-center">Đang chơi set 2</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-[1.6rem] text-neutral-90">Tuấn Anh</p>
                <p className="text-[1.2rem] text-neutral-40">NTRP 3.5</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Day 3 — Farewell intro */}
      {currentDay === 3 && (
        <section className="mb-[3.2rem] bg-neutral-03 rounded-[0.8rem] border border-neutral-10 p-[2rem] flex gap-[1.6rem]">
          <div className="w-[4rem] h-[4rem] rounded-full bg-neutral-10 flex items-center justify-center shrink-0">
            <Trophy size={20} className="text-neutral-50" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-[1.6rem] text-neutral-90 mb-[0.4rem]">Ngày cuối của hành trình</p>
            <p className="text-neutral-50 text-[1.4rem] leading-relaxed">
              Cool-down, nhận feedback 1-1 từ HLV, tự generate <strong>Share Card</strong> và lên đường về nhà với{" "}
              <strong className="text-brand-primary">+800 XP</strong> tiềm năng.
            </p>
          </div>
        </section>
      )}

      {/* XP Bar */}
      <section aria-labelledby="xp-title" className="mb-[3.2rem]">
        <div className="flex items-center justify-between mb-[0.8rem]">
          <h2 id="xp-title" className="font-bold text-[1.6rem] text-neutral-90">XP Hôm nay</h2>
          <span className="text-brand-primary font-bold text-[1.4rem]">
            {xpData.current.toLocaleString("vi-VN")} / {xpData.max.toLocaleString("vi-VN")} XP
          </span>
        </div>
        <ProgressBar value={xpData.current} max={xpData.max} color="primary" />
        {currentDay === LIVE_DAY ? (
          <p className="text-neutral-30 text-[1.2rem] mt-[0.4rem]">
            Cần thêm {(xpData.max - xpData.current).toLocaleString("vi-VN")} XP để hoàn thành ngày hôm nay
          </p>
        ) : currentDay < LIVE_DAY ? (
          <p className="text-success text-[1.2rem] mt-[0.4rem] font-semibold">
            Đã hoàn thành toàn bộ XP ngày {currentDay}
          </p>
        ) : (
          <p className="text-neutral-30 text-[1.2rem] mt-[0.4rem]">
            {xpData.max.toLocaleString("vi-VN")} XP đang chờ bạn hôm nay
          </p>
        )}
      </section>

      {/* Coach Tip */}
      <section className="mb-[3.2rem]">
        <div className="bg-brand-tint-light rounded-[0.8rem] border border-brand-tint p-[1.6rem] flex gap-[1.2rem]">
          <MessageCircle size={20} className="text-brand-primary shrink-0 mt-[0.2rem]" aria-hidden="true" />
          <div>
            <p className="text-brand-primary text-[1.4rem] font-bold mb-[0.4rem]">
              Tip từ HLV Trần Văn Hùng
            </p>
            <p className="text-neutral-50 text-[1.4rem] leading-relaxed">
              &ldquo;{coachTips[currentDay]}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Activity timeline */}
      <section aria-labelledby="timeline-title" className="mb-[3.2rem]">
        <h2 id="timeline-title" className="text-[1.7rem] font-bold text-neutral-90 mb-[1.6rem]">
          Lịch hôm nay
        </h2>
        <div className="space-y-[1.2rem]">
          {today.activities.map((act, i) => {
            const isLive = act.isLive;
            const isDone = act.status === "done";
            const canRate = isDone && currentDay === LIVE_DAY;
            return (
              <div
                key={i}
                className={`rounded-[0.8rem] p-[1.6rem] border transition-all duration-200 ${
                  isLive
                    ? "bg-error-light border-error/40 shadow-[rgba(0,0,0,0.08)_0px_2px_8px]"
                    : isDone
                    ? "bg-neutral-03 border-neutral-10"
                    : "bg-neutral-01 border-neutral-10"
                }`}
              >
                <div className="flex items-start gap-[1.2rem]">
                  <span className="text-brand-primary text-[1.2rem] font-mono w-[4.8rem] shrink-0 mt-[0.2rem]">
                    {act.time}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-[0.8rem] mb-[0.4rem]">
                      <StatusIcon status={act.status} />
                      <p
                        className={`text-[1.4rem] font-medium ${
                          isDone ? "text-neutral-30 line-through" : "text-neutral-90"
                        }`}
                      >
                        {act.activity}
                      </p>
                    </div>
                    <p className="text-neutral-30 text-[1.2rem]">{act.location}</p>
                    {act.xp > 0 && !isDone && (
                      <span className="text-brand-light text-[1.2rem] mt-[0.4rem] block">
                        +{act.xp} XP
                      </span>
                    )}
                  </div>

                  {/* Star rating — only for Day 2 done items */}
                  {canRate && !activityRatings[String(i)] && (
                    <div className="shrink-0">
                      <p className="text-neutral-30 text-[1.2rem] mb-[0.4rem]">Đánh giá</p>
                      <div className="flex gap-[0.4rem]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleRate(i, s)}
                            className="text-neutral-10 hover:text-yellow-accent transition-colors focus:outline-none focus:ring-1 focus:ring-yellow-accent rounded min-w-[20px] min-h-[20px]"
                            aria-label={`Đánh giá ${s} sao`}
                          >
                            <VietravelIcon id="star-linear" size={14} className="hover:hidden" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {canRate && activityRatings[String(i)] && (
                    <div className="shrink-0 flex gap-[0.2rem]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <VietravelIcon
                          key={s}
                          id={s <= activityRatings[String(i)] ? "star-bold" : "star-linear"}
                          size={14}
                          className={s <= activityRatings[String(i)] ? "text-yellow-accent" : "text-neutral-10"}
                        />
                      ))}
                    </div>
                  )}

                  {/* Day 1 ratings (static, all done) */}
                  {currentDay === 1 && isDone && (
                    <div className="shrink-0 flex gap-[0.2rem]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <VietravelIcon
                          key={s}
                          id={s <= 5 ? "star-bold" : "star-linear"}
                          size={14}
                          className="text-yellow-accent"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Day 1 — First Serve badge card */}
      {currentDay === 1 && (
        <section className="mb-[3.2rem]">
          <div className="bg-neutral-01 rounded-[0.8rem] border border-brand-primary shadow-[rgba(0,70,193,0.15)_0px_2px_8px] p-[2.4rem] text-center">
            <div className="flex justify-center mb-[1.2rem]">
              <div className="w-[5.6rem] h-[5.6rem] rounded-full bg-brand-tint flex items-center justify-center">
                <Zap size={28} className="text-brand-primary" aria-hidden="true" />
              </div>
            </div>
            <p className="font-bold text-[1.7rem] text-neutral-90 mb-[0.4rem]">Badge mở khoá!</p>
            <p className="text-brand-primary font-extrabold text-[2rem] mb-[0.4rem]">First Serve</p>
            <p className="text-neutral-40 text-[1.4rem] mb-[1.6rem]">
              Hoàn thành buổi đầu tiên cùng đội tennis Vietravel
            </p>
            <Link href="/gamification">
              <Button variant="outline-danger" size="sm">
                Xem tất cả thành tích
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Day 3 — Farewell CTA */}
      {currentDay === 3 && (
        <section className="mb-[3.2rem] space-y-[1.2rem]">
          <div className="bg-brand-tint-light rounded-[0.8rem] border border-brand-tint p-[2rem] text-center">
            <div className="flex justify-center mb-[1.2rem]">
              <VietravelIcon id="medal-star-linear" size={32} className="text-brand-primary" />
            </div>
            <p className="font-bold text-[1.6rem] text-neutral-90 mb-[0.4rem]">
              Hành trình sắp kết thúc
            </p>
            <p className="text-neutral-40 text-[1.4rem] mb-[1.6rem]">
              Nhận thẻ thành tích và voucher 10% cho tour tiếp theo
            </p>
            <div className="flex gap-[1.2rem]">
              <Link href="/gamification" className="flex-1">
                <Button variant="outline-danger" size="sm" className="w-full">
                  Xem thành tích XP
                </Button>
              </Link>
              <Link href="/share-card" className="flex-1">
                <Button variant="primary" size="sm" className="w-full">
                  Nhận Share Card
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      {currentDay === LIVE_DAY && (
        <Link href="/gamification">
          <Button variant="primary" size="lg" className="w-full">
            Xem Thành tích &amp; XP
          </Button>
        </Link>
      )}
      {currentDay !== LIVE_DAY && (
        <button
          onClick={() => setCurrentDay(LIVE_DAY)}
          className="w-full py-[1.4rem] rounded-[4rem] border-2 border-brand-primary text-brand-primary font-semibold text-[1.6rem] hover:bg-brand-tint transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          Về Ngày 2 — Đang diễn ra
        </button>
      )}

      <Toast
        message="Đã cộng +30 XP cho đánh giá!"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
        type="xp"
      />
    </div>
  );
}
