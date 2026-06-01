"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, ChevronDown, RefreshCw } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */
type Role = "bot" | "user";
interface Message {
  id: number;
  role: Role;
  text: string;
  chips?: string[];
}

/* ─── Flows ──────────────────────────────────────────────────── */
const FLOWS: Record<string, Message[]> = {
  ntrp: [{ id: 10, role: "bot", text: "Để xác định trình độ NTRP, cho tôi hỏi nhanh:\n\n**Bạn chơi tennis được bao lâu rồi?**", chips: ["Dưới 1 năm", "1–3 năm", "3–5 năm", "5+ năm"] }],
  ntrp_step2: [{ id: 20, role: "bot", text: "Bạn có thể duy trì rally bao nhiêu cú liên tục?", chips: ["3–5 cú", "6–10 cú", "10–20 cú", "20+ cú"] }],
  ntrp_result_low: [{ id: 30, role: "bot", text: "✅ **NTRP 1.5–2.5 — Beginner/Novice**\n\nRecommend **Leisure & Learning (SBU 1)**:\n• Huấn luyện từ cơ bản cùng HLV\n• Sân ITF chuẩn, môi trường thân thiện\n• Giá từ **4.200.000 đ/người**", chips: ["Xem gói SBU 1 →", "Hỏi thêm về FEI 🍜"] }],
  ntrp_result_mid: [{ id: 31, role: "bot", text: "✅ **NTRP 3.0–3.5 — Intermediate**\n\nRecommend **Tournament Travel (SBU 2)**:\n• Giải đấu nội bộ có ELO ranking\n• Live score + ảnh chuyên nghiệp\n• Giá từ **8.500.000 đ/người**", chips: ["Xem gói SBU 2 →", "Hỏi thêm về FEI 🍜"] }],
  ntrp_result_high: [{ id: 32, role: "bot", text: "✅ **NTRP 4.0–5.0 — Advanced/Expert**\n\nRecommend **Sportcation Premium (SBU 3)**:\n• HLV quốc tế 1-1, phân tích video kỹ thuật\n• Resort 5★ Private Wing\n• Giá từ **26.500.000 đ/người**", chips: ["Xem gói SBU 3 →", "Hỏi về menu FEI 🍜"] }],
  tour_step1: [{ id: 40, role: "bot", text: "Bạn đi tour theo kiểu nào?", chips: ["Một mình / cặp đôi", "Nhóm 5–10 người", "CLB 10–20 người"] }],
  tour_step2_solo: [{ id: 50, role: "bot", text: "Budget của bạn khoảng bao nhiêu?", chips: ["4–8 triệu/người", "8–18 triệu/người", "25+ triệu/người"] }],
  tour_step2_group: [{ id: 51, role: "bot", text: "Nhóm của bạn chủ yếu muốn trải nghiệm gì?", chips: ["Thi đấu & ranking", "Nghỉ dưỡng & networking", "Học kỹ thuật cùng nhau"] }],
  tour_result_leisure: [{ id: 60, role: "bot", text: "🏖️ **Leisure & Learning — Đà Nẵng 3N2D**\n\n• Giá: **4.200.000 – 5.800.000 đ**\n• Resort: Fusion Maia Đà Nẵng\n• FEI ≥ 88 mọi bữa ăn\n\n*Khởi hành: 13/06/2026*", chips: ["Đặt tour ngay →", "Xem Phú Quốc thay thế"] }],
  tour_result_premium: [{ id: 61, role: "bot", text: "🌟 **Sportcation Premium — Phú Quốc 4N3D**\n\n• Giá: **26.500.000 – 38.500.000 đ**\n• Resort: InterContinental Phú Quốc\n• HLV quốc tế 1-1, Private Wing", chips: ["Đặt tour ngay →", "Tư vấn thêm"] }],
  tour_result_tournament: [{ id: 62, role: "bot", text: "🏆 **Tournament Travel — Đà Nẵng / Phú Quốc**\n\n• Giá: **8.500.000 – 17.800.000 đ/người**\n• Giải đấu nội bộ chuẩn ELO ranking\n• Ưu đãi nhóm: giảm **10–15%**", chips: ["Báo giá nhóm →", "Xem lịch giải"] }],
  fei_step1: [{ id: 70, role: "bot", text: "Bạn có dị ứng hoặc yêu cầu đặc biệt về thực phẩm không?", chips: ["Không có", "Không ăn hải sản", "Ăn chay", "Không lactose"] }],
  fei_step2: [{ id: 80, role: "bot", text: "NTRP của bạn để tôi tính lượng protein & carb phục hồi:", chips: ["Beginner 1.5–2.0", "Intermediate 3.0–3.5", "Advanced 4.0+"] }],
  fei_result: [{ id: 90, role: "bot", text: "🍜 **Menu FEI cá nhân hoá cho bạn:**\n\n**NPI 88** — Protein 35g/bữa\n**LAI 92** — 100% nguyên liệu trong 50km\n**EII 87** — Cooking class với Chef Thanh\n**RWI 90** — Trà gừng & kháng viêm\n**LPI 88** — Private dining view biển\n\n⭐ **FEI Tổng: 89/100 — Signature**", chips: ["Tuyệt vời! Đặt tour →", "Xem lịch trình đầy đủ"] }],
};

const QUICK_PROMPTS = [
  { label: "Tôi thuộc NTRP nào? 🎾", flowKey: "ntrp" },
  { label: "Gợi ý gói tour 🏖️",      flowKey: "tour_step1" },
  { label: "Menu FEI cho tôi 🍜",    flowKey: "fei_step1" },
];

const CHIP_FLOW: Record<string, string> = {
  "Tôi thuộc NTRP nào? 🎾": "ntrp", "Gợi ý gói tour 🏖️": "tour_step1", "Menu FEI cho tôi 🍜": "fei_step1",
  "Dưới 1 năm": "ntrp_step2", "1–3 năm": "ntrp_step2", "3–5 năm": "ntrp_step2", "5+ năm": "ntrp_step2",
  "3–5 cú": "ntrp_result_low", "6–10 cú": "ntrp_result_mid", "10–20 cú": "ntrp_result_high", "20+ cú": "ntrp_result_high",
  "Một mình / cặp đôi": "tour_step2_solo", "Nhóm 5–10 người": "tour_step2_group", "CLB 10–20 người": "tour_step2_group",
  "4–8 triệu/người": "tour_result_leisure", "8–18 triệu/người": "tour_result_tournament", "25+ triệu/người": "tour_result_premium",
  "Thi đấu & ranking": "tour_result_tournament", "Nghỉ dưỡng & networking": "tour_result_premium", "Học kỹ thuật cùng nhau": "tour_result_leisure",
  "Không có": "fei_step2", "Không ăn hải sản": "fei_step2", "Ăn chay": "fei_step2", "Không lactose": "fei_step2",
  "Beginner 1.5–2.0": "fei_result", "Intermediate 3.0–3.5": "fei_result", "Advanced 4.0+": "fei_result",
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

/* ─── Typing dots ─────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-[0.4rem] px-[1.2rem] py-[1rem] bg-neutral-05 rounded-[1.2rem] rounded-tl-[0.3rem] w-fit">
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
        text: "Xin chào! Tôi là **Ace** 🎾 — trợ lý AI của Vietravel Tennis Travel.\n\nTôi có thể giúp bạn:",
        chips: ["Tôi thuộc NTRP nào? 🎾", "Gợi ý gói tour 🏖️", "Menu FEI cho tôi 🍜"],
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
      setMessages((prev) => [...prev, ...flow]);
    }, delay);
  };

  const handleChip = (chip: string) => {
    setMessages((prev) => [...prev, { id: msgId.current++, role: "user", text: chip }]);
    const next = CHIP_FLOW[chip];
    if (next) {
      pushBotFlow(next);
    } else {
      setTyping(true);
      window.setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [...prev, {
          id: msgId.current++, role: "bot",
          text: "Cảm ơn bạn! Đội ngũ Vietravel sẽ liên hệ trong vòng **15 phút**. 😊",
          chips: ["Đặt tour ngay →"],
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
        text: "Cảm ơn câu hỏi! Tôi đang kết nối với tư vấn viên.\n\nBạn có muốn thử gợi ý nhanh không?",
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
        <span className="absolute rounded-full bg-brand-primary/20 animate-ping"
          style={{ inset: "-0.4rem", animationDuration: "2s" }} />
        <span className="relative w-[5.2rem] h-[5.2rem] rounded-full bg-brand-primary flex items-center justify-center shadow-[rgba(0,80,200,0.45)_0px_6px_24px]">
          <Bot size={22} className="text-white" />
          <span className="absolute -top-[0.3rem] -right-[0.3rem] w-[2rem] h-[2rem] rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white text-[0.85rem] font-extrabold">
            AI
          </span>
        </span>
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
            className="flex flex-col bg-white rounded-t-[2.4rem] shadow-[rgba(0,0,0,0.3)_0px_-8px_40px] transition-transform duration-300 ease-out"
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
                  className="w-[3.4rem] h-[3.4rem] rounded-full bg-neutral-05 hover:bg-neutral-10 flex items-center justify-center transition-colors"
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
                        className="w-full text-left px-[1.4rem] py-[1.2rem] rounded-[1.2rem] bg-neutral-03 border border-neutral-10 text-[1.3rem] font-medium text-neutral-70 hover:bg-brand-tint hover:border-brand-primary hover:text-brand-primary transition-all duration-200">
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
              <div className="flex items-center gap-[1rem] bg-neutral-03 rounded-[4rem] px-[1.6rem] py-[0.8rem]">
                <input ref={inputRef} type="text" value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="flex-1 bg-transparent text-[1.3rem] text-neutral-90 placeholder:text-neutral-30 outline-none"
                  aria-label="Nhập câu hỏi" />
                <button onClick={handleSend} disabled={!inputVal.trim()} aria-label="Gửi"
                  className={`w-[3.6rem] h-[3.6rem] rounded-full flex items-center justify-center transition-all duration-200 ${
                    inputVal.trim() ? "bg-brand-primary hover:bg-brand-primary-dark" : "bg-neutral-10"
                  }`}>
                  <Send size={15} className={inputVal.trim() ? "text-white" : "text-neutral-30"} />
                </button>
              </div>
              <p className="text-neutral-30 text-[1.1rem] text-center mt-[0.8rem]">
                Powered by Vietravel AI · Phản hồi trong vài giây
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
