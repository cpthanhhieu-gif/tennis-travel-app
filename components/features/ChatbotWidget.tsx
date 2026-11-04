"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { tourPackages, tours, formatVND } from "@/lib/mock-data";
import { packageBenefits, tripItinerary } from "@/lib/trip-itinerary";
import { Send, Bot, ChevronDown, RefreshCw } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */
type Role = "bot" | "user";
interface Message {
  id: number;
  role: Role;
  text: string;
  chips?: string[];
  packageIds?: string[];
}

/* ─── Flows ──────────────────────────────────────────────────── */
const FLOWS: Record<string, Message[]> = {
  ntrp: [{ id: 10, role: "bot", text: "Để xác định trình độ NTRP, cho tôi hỏi nhanh:\n\n**Bạn chơi tennis được bao lâu rồi?**", chips: ["Dưới 1 năm", "1–3 năm", "3–5 năm", "5+ năm"] }],
  ntrp_step2: [{ id: 20, role: "bot", text: "Bạn có thể duy trì rally bao nhiêu cú liên tục?", chips: ["3–5 cú", "6–10 cú", "10–20 cú", "20+ cú"] }],
  tour_step1: [{ id: 40, role: "bot", text: "Bạn đi tour theo kiểu nào?", chips: ["Một mình / cặp đôi", "Nhóm 5–10 người", "CLB 10–20 người"] }],
  tour_step2_group: [{ id: 51, role: "bot", text: "Nhóm của bạn chủ yếu muốn trải nghiệm gì?", chips: ["Thi đấu & ranking", "Nghỉ dưỡng & networking", "Học kỹ thuật cùng nhau"] }],
};

const recommendations: Record<string, string> = {
  ntrp_result_low: "sbu1", ntrp_result_mid: "sbu2", ntrp_result_high: "sbu3",
  tour_result_leisure: "sbu1", tour_result_tournament: "sbu2", tour_result_premium: "sbu3",
};
for (const [key, packageId] of Object.entries(recommendations)) {
  FLOWS[key] = [{ id: 0, role: "bot", text: "Bạn có thể tham khảo gói sau và kiểm tra lịch, trình độ phù hợp trước khi tiếp tục:", packageIds: [packageId], chips: ["Xem tất cả gói tour"] }];
}
FLOWS.tour_step2_solo = [{ id: 0, role: "bot", text: "Bạn muốn khám phá gói nào?", chips: tourPackages.map(p => p.name) }];
FLOWS.experience = [{ id: 0, role: "bot", text: "Các trải nghiệm hiện có trong Travel Ace:", packageIds: tourPackages.map(p => p.id) }];
FLOWS.fei_step1 = [{ id: 0, role: "bot", text: "Chọn gói để xem ẩm thực và các hoạt động trong lịch trình của ứng dụng.", chips: tourPackages.map(p => p.name) }];

const QUICK_PROMPTS = [
  { label: "Tôi thuộc NTRP nào? 🎾", flowKey: "ntrp" },
  { label: "Gợi ý gói tour 🏖️",      flowKey: "tour_step1" },
  { label: "Trải nghiệm trong tour", flowKey: "experience" },
];

const CHIP_FLOW: Record<string, string> = {
  "Trải nghiệm trong tour": "experience",
  "Tôi thuộc NTRP nào? 🎾": "ntrp", "Gợi ý gói tour 🏖️": "tour_step1", "Menu FEI cho tôi 🍜": "fei_step1",
  "Dưới 1 năm": "ntrp_step2", "1–3 năm": "ntrp_step2", "3–5 năm": "ntrp_step2", "5+ năm": "ntrp_step2",
  "3–5 cú": "ntrp_result_low", "6–10 cú": "ntrp_result_mid", "10–20 cú": "ntrp_result_high", "20+ cú": "ntrp_result_high",
  "Một mình / cặp đôi": "tour_step2_solo", "Nhóm 5–10 người": "tour_step2_group", "CLB 10–20 người": "tour_step2_group",
  "Thi đấu & ranking": "tour_result_tournament", "Nghỉ dưỡng & networking": "tour_result_premium", "Học kỹ thuật cùng nhau": "tour_result_leisure",
};

/* ─── Bold markdown ───────────────────────────────────────────── */
function BotText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="text-[1.3rem] leading-relaxed whitespace-pre-line text-neutral-80">
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i} className="font-bold text-neutral-90">{p.slice(2, -2)}</strong>
          : p
      )}
    </p>
  );
}

function ProductCard({ packageId, onNavigate }: { packageId: string; onNavigate: () => void }) {
  const p = tourPackages.find(item => item.id === packageId)!;
  const tour = tours.find(item => item.packageId === packageId)!;
  const [departureCode, setDepartureCode] = useState(tour.departureSchedules[0]?.code ?? "");
  const departure = tour.departureSchedules.find(item => item.code === departureCode);
  const days = departure ? tripItinerary({ tourId: tour.id, departureCode }) : [];
  const action = p.id === "sbu2" ? "Yêu cầu báo giá đoàn" : p.id === "sbu3" ? "Gửi yêu cầu chuyến đi" : "Chọn lịch & tiếp tục";
  return <article className="w-full max-w-[42rem] rounded-[1.4rem] border border-neutral-10 bg-white p-[1.4rem] space-y-[1rem]">
    <p className="text-[1.2rem] text-neutral-50">{tour.destinationName} · {tour.duration}</p>
    <h3 className="text-[1.5rem] font-bold text-neutral-90">{p.name}</h3>
    <p className="text-[1.3rem] text-neutral-60">{p.tagline}</p>
    <p className="text-[1.4rem] font-bold text-brand-primary">Từ {formatVND(p.priceRange.min)} / người</p>
    <p className="text-[1.2rem] text-neutral-60">{tour.ntrpLabel}</p>
    <p className="text-[1.3rem]">{packageBenefits[p.id as keyof typeof packageBenefits]}</p>
    <ul className="text-[1.2rem] text-neutral-60 list-disc pl-[1.6rem]">{p.highlights.map(h => <li key={h}>{h}</li>)}</ul>
    {tour.departureSchedules.length > 0 ? <label className="block text-[1.3rem] font-semibold">Lịch khởi hành
      <select aria-label={`Lịch khởi hành ${p.name}`} value={departureCode} onChange={e => setDepartureCode(e.target.value)} className="block w-full min-h-[4.4rem] border border-neutral-10 rounded-[0.8rem] px-[0.8rem] mt-[0.6rem] bg-white">
        {tour.departureSchedules.map(d => <option key={d.code} value={d.code}>{d.dateLabel} · {formatVND(d.price)} / người</option>)}
      </select>
    </label> : <p className="text-[1.3rem]">Chưa có lịch khởi hành. Xem chi tiết gói để tìm hiểu thêm.</p>}
    {days.length > 0 && <details className="text-[1.3rem]"><summary className="cursor-pointer min-h-[4.4rem] flex items-center font-semibold">Xem lịch trình theo ngày</summary><div className="space-y-[1rem]">{days.map(day => <section key={day.day}><h4 className="font-bold">Ngày {day.day} · {day.title}</h4><ul className="space-y-[0.6rem] mt-[0.6rem] text-neutral-60">{day.activities.map(a => <li key={a.id}>{a.time} · {a.title}{a.optional ? " (tùy chọn)" : ""}</li>)}</ul></section>)}</div></details>}
    <div className="flex flex-wrap gap-[0.8rem] text-[1.3rem] font-semibold">
      <Link onClick={onNavigate} href={`/tours/${p.id}`} className="min-h-[4.4rem] inline-flex items-center border border-brand-primary text-brand-primary rounded-full px-[1.2rem]">Xem chi tiết tour</Link>
      {departure && <Link onClick={onNavigate} href={`/booking?package=${p.id}&departure=${encodeURIComponent(departure.code)}`} className="min-h-[4.4rem] inline-flex items-center bg-brand-primary text-white rounded-full px-[1.2rem]">{action}</Link>}
    </div>
  </article>;
}

/* ─── Typing dots ─────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-[0.4rem] px-[1.2rem] py-[1rem] bg-neutral-05 rounded-[var(--ds-radius-card)] rounded-tl-[0.3rem] w-fit">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-[0.6rem] h-[0.6rem] bg-neutral-30 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }} />
      ))}
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────────── */
export default function ChatbotWidget() {
  /*
   * phase controls cả DOM presence lẫn animation:
   *   "closed"  → không render dialog (không có trong DOM, không có shadow)
   *   "opening" → dialog mount với translateY(100%), ngay lập tức transition → translateY(0)
   *   "open"    → dialog hiển thị đầy đủ
   *   "closing" → dialog transition từ translateY(0) → translateY(100%), rồi về "closed"
   */
  const [phase, setPhase] = useState<"closed" | "opening" | "open" | "closing">("closed");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping]     = useState(false);
  const [inputVal, setInputVal] = useState("");
  const messagesEndRef  = useRef<HTMLDivElement>(null);
  const inputRef        = useRef<HTMLInputElement>(null);
  const msgId           = useRef(1000);
  const welcomeFiredRef = useRef(false);

  useEffect(() => {
    const open = () => setPhase("opening");
    window.addEventListener("ace:open", open);
    return () => window.removeEventListener("ace:open", open);
  }, []);

  const isOpen = phase === "open" || phase === "opening";

  /* opening → open sau 1 frame (để CSS transition animate slide-up) */
  useEffect(() => {
    if (phase !== "opening") return;
    const id = window.requestAnimationFrame(() => setPhase("open"));
    return () => window.cancelAnimationFrame(id);
  }, [phase]);

  /* Welcome message — chỉ chạy 1 lần khi lần đầu phase = open */
  useEffect(() => {
    if (phase !== "open" || welcomeFiredRef.current) return;
    welcomeFiredRef.current = true;
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages([{
        id: msgId.current++, role: "bot",
        text: "Xin chào! Tôi là **Ace** 🎾 — trợ lý AI của Vietravel Tennis Travel.\n\nCùng tôi chọn chuyến tennis, khám phá trình độ và tìm hiểu trải nghiệm trong tour. Bạn muốn bắt đầu từ đâu?",
        chips: ["Gợi ý gói tour 🏖️", "Tôi thuộc NTRP nào? 🎾", "Trải nghiệm trong tour"],
      }]);
    }, 800);
  }, [phase]);

  /* Auto-scroll */
  useEffect(() => {
    const el = messagesEndRef.current;
    if (el) el.parentElement?.scrollTo({ top: el.parentElement.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  /* Focus input khi mở */
  useEffect(() => {
    if (phase === "open") window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 350);
  }, [phase]);

  /* ─── Handlers ─── */
  const handleOpen = () => setPhase("opening");

  const handleClose = () => {
    setPhase("closing");
    window.setTimeout(() => setPhase("closed"), 310);
  };

  const handleReset = () => {
    welcomeFiredRef.current = false;
    setMessages([]);
    setTyping(false);
    setInputVal("");
  };

  const pushBotFlow = (flowKey: string, delay = 650) => {
    const flow = FLOWS[flowKey];
    if (!flow) return;
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, ...flow.map(message => ({ ...message, id: msgId.current++ }))]);
    }, delay);
  };

  const handleChip = (chip: string) => {
    setMessages((prev) => [...prev, { id: msgId.current++, role: "user", text: chip }]);
    const selected = tourPackages.find(p => p.name === chip);
    if (selected || chip === "Xem tất cả gói tour") {
      setMessages(prev => [...prev, { id: msgId.current++, role: "bot", text: selected ? `Thông tin ${selected.name}:` : "Các gói tour hiện có:", packageIds: selected ? [selected.id] : tourPackages.map(p => p.id) }]);
      return;
    }
    const next = CHIP_FLOW[chip];
    if (next) {
      pushBotFlow(next);
    } else {
      setTyping(true);
      window.setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [...prev, {
          id: msgId.current++, role: "bot",
          text: "Bạn muốn tìm hiểu gói nào?",
          chips: tourPackages.map(p => p.name),
        }]);
      }, 700);
    }
  };

  const handleQuickPrompt = (flowKey: string, label: string) => {
    setMessages((prev) => [...prev, { id: msgId.current++, role: "user", text: label }]);
    pushBotFlow(flowKey);
  };

  const handleSend = () => {
    const text = inputVal.trim();
    if (!text) return;
    setInputVal("");
    setMessages((prev) => [...prev, { id: msgId.current++, role: "user", text }]);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, {
        id: msgId.current++, role: "bot",
        text: "Chọn gói để xem thông tin, lịch trình và tiếp tục đặt chuyến.",
        packageIds: tourPackages.map(p => p.id),
      }]);
    }, 900);
  };

  /* ─── Derived values ─── */
  const inDOM     = phase !== "closed";
  const slideUp   = phase === "open";   // translateY(0) khi open, translateY(100%) các phase khác

  return (
    <>
      {/* Floating button */}
      <button
        onClick={handleOpen}
        aria-label="Mở chat tư vấn AI"
        className="transition-all duration-300"
        style={{
          position: "fixed", bottom: "9.6rem", right: "1.6rem", zIndex: 55,
          opacity: isOpen ? 0 : 1,
          pointerEvents: isOpen ? "none" : "auto",
          transform: isOpen ? "scale(0.75)" : "scale(1)",
        }}
      >
        <Image
          src="/vietravel-chatbot.gif"
          alt="Chatbot Vietravel"
          width={88}
          height={88}
          unoptimized
          className="w-[14rem] h-[14rem] sm:w-[8.8rem] sm:h-[8.8rem] object-contain"
        />
      </button>

      {/* Backdrop + Dialog — chỉ trong DOM khi cần */}
      {inDOM && (
        <>
          <div
            onClick={handleClose}
            style={{ position: "fixed", inset: 0, zIndex: 56 }}
            className="bg-black/40 backdrop-blur-[2px]"
          />
          <div
            role="dialog" aria-modal="true" aria-label="Chat tư vấn AI — Ace"
            className="flex flex-col bg-white rounded-t-[1.2rem] shadow-none transition-transform duration-300 ease-out"
            style={{
              position: "fixed", left: 0, right: 0, bottom: 0,
              zIndex: 60, height: "74%",
              transform: slideUp ? "translateY(0)" : "translateY(100%)",
              pointerEvents: slideUp ? "auto" : "none",
            }}
          >
            {/* Drag handle */}
            <div className="shrink-0 flex justify-center pt-[1.2rem] pb-[0.4rem]">
              <div className="w-[4rem] h-[0.4rem] bg-neutral-10 rounded-full" />
            </div>

            {/* Header */}
            <div className="shrink-0 flex items-center gap-[1.2rem] px-[2rem] pb-[1.4rem] border-b border-neutral-05">
              <div className="relative shrink-0">
                <div className="w-[4.4rem] h-[4.4rem] rounded-full bg-brand-primary flex items-center justify-center">
                  <Bot size={22} className="text-white" />
                </div>
                <span className="absolute -bottom-[0.2rem] -right-[0.2rem] w-[1.4rem] h-[1.4rem] rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[1.5rem] text-neutral-90 leading-tight">Ace — Trợ lý AI</p>
                <p className="text-green-600 text-[1.2rem] font-medium">● Đang hoạt động 24/7</p>
              </div>
              <div className="flex items-center gap-[0.6rem]">
                <button onClick={handleReset}
                  className="flex items-center gap-[0.5rem] text-neutral-40 hover:text-neutral-60 text-[1.2rem] font-medium px-[0.8rem] py-[0.4rem] rounded-full hover:bg-neutral-05 transition-colors"
                  aria-label="Làm mới cuộc trò chuyện">
                  <RefreshCw size={13} />Làm mới
                </button>
                <button onClick={handleClose}
                  className="w-[4.4rem] h-[4.4rem] rounded-full bg-neutral-05 hover:bg-neutral-10 flex items-center justify-center transition-colors"
                  aria-label="Đóng chat">
                  <ChevronDown size={18} className="text-neutral-50" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-[1.6rem] py-[1.6rem] space-y-[1.2rem]"
              style={{ scrollbarWidth: "none" }}>

              {messages.length === 0 && !typing && (
                <div className="flex flex-col items-center pt-[2rem] pb-[1rem]">
                  <div className="w-[5.6rem] h-[5.6rem] rounded-full bg-brand-tint flex items-center justify-center mb-[1.2rem]">
                    <Bot size={28} className="text-brand-primary" />
                  </div>
                  <p className="text-neutral-90 font-bold text-[1.5rem] mb-[0.4rem]">Xin chào! Tôi là Ace 🎾</p>
                  <p className="text-neutral-40 text-[1.3rem] text-center mb-[2.4rem]">Trợ lý AI của Vietravel Tennis Travel</p>
                  <p className="text-neutral-50 text-[1.2rem] font-semibold mb-[1rem] self-start">Bắt đầu với:</p>
                  <div className="flex flex-col gap-[0.8rem] w-full">
                    {QUICK_PROMPTS.map(({ label, flowKey }) => (
                      <button key={flowKey}
                        onClick={() => handleQuickPrompt(flowKey, label)}
                        className="w-full text-left px-[1.4rem] py-[1.2rem] rounded-[var(--ds-radius-card)] bg-[var(--ds-canvas)] border border-[var(--ds-border)] text-[1.3rem] font-medium text-neutral-70 hover:bg-brand-tint hover:border-brand-primary hover:text-brand-primary transition-all duration-200">
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id}
                  className={`flex flex-col gap-[0.8rem] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[85%] px-[1.4rem] py-[1rem] rounded-[1.4rem] ${
                    msg.role === "user" ? "bg-brand-primary rounded-tr-[0.3rem]" : "bg-neutral-05 rounded-tl-[0.3rem]"
                  }`}>
                    {msg.role === "user"
                      ? <p className="text-[1.3rem] text-white leading-relaxed">{msg.text}</p>
                      : <BotText text={msg.text} />}
                  </div>
                  {msg.role === "bot" && msg.packageIds?.map(packageId => <ProductCard key={packageId} packageId={packageId} onNavigate={handleClose} />)}
                  {msg.role === "bot" && msg.chips && (
                    <div className="flex flex-wrap gap-[0.6rem] max-w-[90%]">
                      {msg.chips.map((chip) => (
                        <button key={chip} onClick={() => handleChip(chip)}
                          className="px-[1.2rem] py-[0.7rem] rounded-full border border-brand-primary text-brand-primary text-[1.2rem] font-semibold bg-white hover:bg-brand-tint transition-colors">
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {typing && <div className="flex items-start"><TypingDots /></div>}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 px-[1.6rem] pt-[1rem] pb-[2.4rem] border-t border-neutral-05">
              <div className="flex items-center gap-[1rem] bg-[var(--ds-canvas)] rounded-[var(--ds-radius-control)] px-[1.6rem] py-[0.8rem]">
                <input ref={inputRef} type="text" value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="flex-1 min-w-0 bg-transparent text-[1.6rem] text-neutral-90 placeholder:text-neutral-40 outline-none"
                  aria-label="Nhập câu hỏi" />
                <button onClick={handleSend} disabled={!inputVal.trim()} aria-label="Gửi"
                  className={`w-[4.4rem] h-[4.4rem] rounded-full flex items-center justify-center transition-all duration-200 ${
                    inputVal.trim() ? "bg-brand-primary hover:bg-brand-primary-dark" : "bg-neutral-10"
                  }`}>
                  <Send size={15} className={inputVal.trim() ? "text-white" : "text-neutral-40"} />
                </button>
              </div>
              <p className="text-neutral-40 text-[1.2rem] text-center mt-[0.8rem]">
                Powered by Vietravel AI · Phản hồi trong vài giây
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
