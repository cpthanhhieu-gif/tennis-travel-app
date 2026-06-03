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

type ActivityType = "tennis" | "food" | "recovery" | "logistics";

function getActivityType(text: string): ActivityType {
  const t = text.toLowerCase();
  if (/tập luyện|giải đấu|warm-up|serve|orientation|buổi tập|drills|match/.test(t)) return "tennis";
  if (/bữa sáng|bữa trưa|bữa tối|dining|ẩm thực|chef|workshop ẩm/.test(t)) return "food";
  if (/spa|massage|hydrotherapy|phục hồi buổi/.test(t)) return "recovery";
  return "logistics";
}

const ACTIVITY_TYPE_LABEL: Record<ActivityType, string> = {
  tennis: "tennis",
  food: "ẩm thực",
  recovery: "phục hồi",
  logistics: "di chuyển",
};

const coachTips: Record<number, string> = {
  1: "Ngày đầu tiên quan trọng hơn bạn nghĩ — cơ thể cần thời gian thích nghi với sân mới, độ ẩm và ánh nắng Đà Nẵng. Hãy khởi động nhẹ, cảm nhận mặt sân và kết nối với đồng đội. Đừng cố ép kỹ thuật ngay hôm nay. Tối ngủ đủ giấc, uống đủ nước điện giải — đó là nền tảng cho ngày 2.",
  2: "Đây là ngày chinh phục — nhưng hãy tập trung từng điểm, không phải cả set. Breathing rhythm quan trọng hơn tốc độ. Giữa các game, lắc nhẹ cổ tay và vai để tránh cứng cơ. HLV sẽ sát cánh từng set, hãy tin vào chỉ dẫn và đừng thay đổi kỹ thuật giữa chừng khi đang vào form tốt.",
  3: "Ngày cuối là ngày của cảm xúc và tổng kết — đừng cố thêm khối lượng tập. Cool-down kỹ, ghi lại 3 điều bạn cải thiện được trong hành trình này. Buổi feedback 1-1 với HLV là vàng — hãy hỏi thẳng điểm yếu cần fix nhất. Mang những kỹ năng và kỷ niệm này về nhà cùng bạn.",
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
  const [toastMessage, setToastMessage] = useState("Đã cộng +30 XP!");
  const [currentXp, setCurrentXp] = useState(dayXp[LIVE_DAY].current);
  const [activityRatings, setActivityRatings] = useState<Record<string, number>>({});
  const [tipExpanded, setTipExpanded] = useState(false);

  const today = danangItinerary[currentDay - 1];
  const xpData = currentDay === LIVE_DAY
    ? { current: currentXp, max: dayXp[LIVE_DAY].max }
    : dayXp[currentDay];

  const handleRate = (activityIndex: number, stars: number, isFei: boolean) => {
    const key = String(activityIndex);
    if (activityRatings[key]) return;
    setActivityRatings((prev) => ({ ...prev, [key]: stars }));
    if (isFei || stars >= 4) {
      setCurrentXp((prev) => prev + 30);
      setToastMessage(isFei ? "+30 XP · FEI ghi nhận" : "Đã cộng +30 XP!");
      setToastVisible(true);
    }
  };

  const handleDayChange = (day: number) => {
    setCurrentDay(day);
  };

  return (
    <div className="min-h-screen px-6 md:px-10 lg:px-12 pt-[var(--navbar-height)] pb-12 max-w-3xl mx-auto">

      {/* Day selector tabs */}
      <div
        className="flex gap-2 mb-10"
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
              className={`flex-1 py-3 px-2 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out min-h-11 focus:outline-none focus:ring-2 focus:ring-brand-primary border flex flex-col items-center gap-1 ${
                isActive
                  ? "bg-neutral-100 text-neutral-01 border-neutral-100"
                  : "bg-neutral-03 text-neutral-50 border-neutral-10 hover:border-neutral-30"
              }`}
            >
              <span>Ngày {d.day}</span>
              <span
                className={`text-xs font-normal ${
                  isActive
                    ? "text-neutral-10"
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
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-neutral-40 text-sm">Ngày {currentDay} / 3</p>
          <h1 className="text-2xl font-bold text-neutral-90">{today.dateLabel}</h1>
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
          <Badge variant="yellow">
            <Clock size={10} aria-hidden="true" />
            Ngày cuối
          </Badge>
        )}
      </div>
      <p className="text-brand-primary font-bold text-base mb-12">{today.title}</p>

      {/* Day 1 — First Serve intro card */}
      {currentDay === 1 && (
        <section className="mb-12 bg-brand-tint-light rounded-xl border border-brand-tint p-8 flex gap-6">
          <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
            <Zap size={20} className="text-neutral-01" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-base text-neutral-90 mb-1">Chào mừng đến Đà Nẵng!</p>
            <p className="text-neutral-50 text-sm leading-relaxed">
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
          className="mb-12 bg-neutral-01 rounded-xl border-2 border-error/30 shadow-card p-8"
        >
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <h2 id="live-score-title" className="font-bold text-lg text-neutral-90">
              Trận đấu nội bộ
            </h2>
            <Badge variant="live" pulse>
              <span className="w-2 h-2 bg-neutral-01 rounded-full animate-pulse" aria-hidden="true" />
              LIVE
            </Badge>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--color-myleague-bg)] text-neutral-01 text-xs font-bold">
              🏆 MyLeague.vn
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-10 mb-4">
              <div className="text-center">
                <p className="font-bold text-base text-neutral-90">Minh Khoa</p>
                <p className="text-xs text-neutral-40">NTRP 3.5</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-brand-primary">6–4 · 3–2</p>
                <p className="text-xs text-neutral-40 text-center">Đang chơi set 2</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-base text-neutral-90">Tuấn Anh</p>
                <p className="text-xs text-neutral-40">NTRP 3.5</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Day 3 — Farewell intro */}
      {currentDay === 3 && (
        <section className="mb-12 bg-neutral-03 rounded-xl border border-neutral-10 p-8 flex gap-6">
          <div className="w-16 h-16 rounded-full bg-neutral-10 flex items-center justify-center shrink-0">
            <Trophy size={20} className="text-neutral-50" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-base text-neutral-90 mb-1">Ngày cuối của hành trình</p>
            <p className="text-neutral-50 text-sm leading-relaxed">
              Cool-down, nhận feedback 1-1 từ HLV, tự generate <strong>Share Card</strong> và lên đường về nhà với{" "}
              <strong className="text-brand-primary">+800 XP</strong> tiềm năng.
            </p>
          </div>
        </section>
      )}

      {/* XP Bar */}
      <section aria-labelledby="xp-title" className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <h2 id="xp-title" className="font-bold text-base text-neutral-90">Điểm hành trình hôm nay</h2>
          <span className="text-brand-primary font-bold text-sm">
            {xpData.current.toLocaleString("vi-VN")} / {xpData.max.toLocaleString("vi-VN")} XP
          </span>
        </div>
        <ProgressBar value={xpData.current} max={xpData.max} color="primary" />
        {currentDay === LIVE_DAY ? (
          <p className="text-neutral-30 text-xs mt-1">
            Cần thêm {(xpData.max - xpData.current).toLocaleString("vi-VN")} XP để hoàn thành ngày hôm nay
          </p>
        ) : currentDay < LIVE_DAY ? (
          <p className="text-success text-xs mt-1 font-semibold">
            Đã hoàn thành toàn bộ XP ngày {currentDay}
          </p>
        ) : (
          <p className="text-neutral-30 text-xs mt-1">
            {xpData.max.toLocaleString("vi-VN")} XP đang chờ bạn hôm nay
          </p>
        )}
      </section>

      {/* Coach Tip */}
      <section className="mb-12">
        <div className="bg-brand-tint-light rounded-xl border border-brand-tint p-6 flex gap-4">
          <MessageCircle size={20} className="text-brand-primary shrink-0 mt-1" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-brand-primary text-sm font-bold mb-1">
              Tip từ HLV Trần Văn Hùng
            </p>
            <p className={`text-neutral-50 text-sm leading-relaxed ${tipExpanded ? "" : "line-clamp-3"}`}>
              &ldquo;{coachTips[currentDay]}&rdquo;
            </p>
            <button
              onClick={() => setTipExpanded((v) => !v)}
              className="text-brand-primary text-xs font-semibold mt-1.5 hover:underline focus:outline-none focus:ring-1 focus:ring-brand-primary rounded"
            >
              {tipExpanded ? "Thu gọn" : "Xem thêm"}
            </button>
          </div>
        </div>
      </section>

      {/* Activity timeline */}
      <section aria-labelledby="timeline-title" className="mb-12">
        <div className="mb-6">
          <h2 id="timeline-title" className="text-lg font-bold text-neutral-90 mb-1">
            Lịch hôm nay
          </h2>
          {(() => {
            const counts = today.activities.reduce<Record<ActivityType, number>>(
              (acc, act) => { const t = getActivityType(act.activity); acc[t]++; return acc; },
              { tennis: 0, food: 0, recovery: 0, logistics: 0 }
            );
            const total = today.activities.length;
            const parts = (["tennis", "food", "recovery", "logistics"] as ActivityType[])
              .filter((t) => counts[t] > 0)
              .map((t) => `${counts[t]} ${ACTIVITY_TYPE_LABEL[t]}`);
            return (
              <p className="text-xs text-neutral-40">
                {total} hoạt động · {parts.join(" · ")}
              </p>
            );
          })()}
        </div>
        <div className="space-y-4">
          {today.activities.map((act, i) => {
            const isLive = act.isLive;
            const isDone = act.status === "done";
            const canRate = isDone && currentDay === LIVE_DAY;
            return (
              <div
                key={i}
                className={`rounded-xl p-6 border transition-all duration-200 ease-in-out ${
                  isLive
                    ? "bg-error-light border-error/40 shadow-card"
                    : isDone
                    ? "bg-neutral-03 border-neutral-10"
                    : "bg-neutral-01 border-neutral-10"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-brand-primary text-xs font-mono w-[4.8rem] shrink-0 mt-1">
                    {act.time}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusIcon status={act.status} />
                      <p
                        className={`text-sm font-medium ${
                          isDone ? "text-neutral-30 line-through" : "text-neutral-90"
                        }`}
                      >
                        {act.activity}
                      </p>
                    </div>
                    <p className="text-neutral-30 text-xs">{act.location}</p>
                    {act.xp > 0 && !isDone && (
                      <span className="text-brand-light text-xs mt-1 block">
                        +{act.xp} XP
                      </span>
                    )}

                    {/* Star rating — only for Day 2 done items */}
                    {canRate && !activityRatings[String(i)] && (() => {
                      const isFei = getActivityType(act.activity) === "food";
                      return (
                        <div className="mt-2">
                          <p className="text-neutral-30 text-xs mb-1">
                            {isFei ? "FEI Rating" : "Đánh giá"}
                          </p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                onClick={() => handleRate(i, s, isFei)}
                                className="text-neutral-10 hover:text-yellow-accent transition-colors duration-150 ease-out focus:outline-none focus:ring-1 focus:ring-yellow-accent rounded min-w-[20px] min-h-[20px]"
                                aria-label={`Đánh giá ${s} sao`}
                              >
                                <VietravelIcon id="star-linear" size={14} className="hover:hidden" />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                    {canRate && activityRatings[String(i)] && (
                      <div className="flex gap-1 mt-2">
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
                      <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <VietravelIcon
                            key={s}
                            id="star-bold"
                            size={14}
                            className="text-yellow-accent"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Day 1 — First Serve badge card */}
      {currentDay === 1 && (
        <section className="mb-12">
          <div className="bg-neutral-01 rounded-xl border border-brand-primary shadow-card p-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-[5.6rem] h-[5.6rem] rounded-full bg-brand-tint flex items-center justify-center">
                <Zap size={28} className="text-brand-primary" aria-hidden="true" />
              </div>
            </div>
            <p className="font-bold text-lg text-neutral-90 mb-1">Badge mở khoá!</p>
            <p className="text-brand-primary font-extrabold text-xl mb-1">First Serve</p>
            <p className="text-neutral-40 text-sm mb-6">
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
        <section className="mb-12 space-y-4">
          <div className="bg-brand-tint-light rounded-xl border border-brand-tint p-8 text-center">
            <div className="flex justify-center mb-4">
              <VietravelIcon id="medal-star-linear" size={32} className="text-brand-primary" />
            </div>
            <p className="font-bold text-base text-neutral-90 mb-1">
              Hành trình sắp kết thúc
            </p>
            <p className="text-neutral-40 text-sm mb-6">
              Nhận thẻ thành tích và ưu đãi 10% cho hành trình tiếp theo
            </p>
            <div className="flex gap-4">
              <Link href="/gamification" className="flex-1">
                <Button variant="outline-danger" size="sm" className="w-full">
                  Xem thành tích XP
                </Button>
              </Link>
              <Link href="/share-card" className="flex-1">
                <Button variant="primary" size="sm" className="w-full">
                  Chia sẻ hành trình
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
            Xem thành tích hành trình
          </Button>
        </Link>
      )}
      {currentDay !== LIVE_DAY && (
        <button
          onClick={() => setCurrentDay(LIVE_DAY)}
          className="w-full py-4 rounded-full border-2 border-brand-primary text-brand-primary font-semibold text-base hover:bg-brand-tint transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-11"
        >
          Về Ngày 2 — Đang diễn ra
        </button>
      )}

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
        type="xp"
      />
    </div>
  );
}
