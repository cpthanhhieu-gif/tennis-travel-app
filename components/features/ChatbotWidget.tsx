"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import GroupNeedsEditor from "./GroupNeedsEditor";
import {applyGroupNeeds,groupRecommendation,type GroupNeeds} from "@/lib/ace-group";
import { useAdvisorConversation } from "./use-advisor-conversation";
import { readAceSession, saveAceSession, type AceMessage, type AceSelection } from "@/lib/ace-session";
import { mergeAdvisorMessages } from "@/lib/ace-timeline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tourPackages, tours, formatVND } from "@/lib/mock-data";
import { packageBenefits, tripItinerary } from "@/lib/trip-itinerary";
import { aceRespond, initialAceState, preferenceSummary, type AcePreferences } from "@/lib/ace-conversation";
import { Send, Bot, ChevronDown, RefreshCw } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */
type Message = AceMessage;

const QUICK_PROMPTS = [
  { label: "Tôi thuộc NTRP nào? 🎾", flowKey: "ntrp" },
  { label: "Gợi ý gói tour 🏖️", flowKey: "tour" },
  { label: "Trải nghiệm trong tour", flowKey: "experience" },
];

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

function ProductCard({ packageId, onNavigate, preferences, selection, onChoose, entryId }: { entryId: string; packageId: string; onNavigate: () => void; preferences?: AcePreferences; selection?: AceSelection; onChoose: (selection: AceSelection) => void }) {
  const p = tourPackages.find(item => item.id === packageId)!;
  const tour = tours.find(item => item.packageId === packageId)!;
  const [departureCode, setDepartureCode] = useState(selection?.packageId === packageId ? selection.departureCode : tour.departureSchedules[0]?.code ?? "");
  useEffect(() => { if (selection?.packageId === packageId) setDepartureCode(selection.departureCode); }, [selection, packageId]);
  const remember = () => onChoose({ packageId, departureCode });
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
    {preferences?.diet && <p className="text-[1.2rem] bg-brand-tint rounded-[0.8rem] p-[1rem]">Ăn uống: {preferences.diet}. {preferences.diet !== "Không có yêu cầu đặc biệt" && "Cần xác nhận điều chỉnh thực đơn với đơn vị tổ chức; lịch trình bên dưới là chương trình gốc."}</p>}
    {preferences && <details className="text-[1.2rem]"><summary className="cursor-pointer">Nhu cầu đã ghi nhận</summary><p className="whitespace-pre-line mt-[0.6rem]">{preferenceSummary(preferences)}</p></details>}
    <ul className="text-[1.2rem] text-neutral-60 list-disc pl-[1.6rem]">{p.highlights.map(h => <li key={h}>{h}</li>)}</ul>
    {tour.departureSchedules.length > 0 ? <label className="block text-[1.3rem] font-semibold">Lịch khởi hành
      <select aria-label={`Lịch khởi hành ${p.name}`} value={departureCode} onChange={e => { setDepartureCode(e.target.value); onChoose({ packageId, departureCode: e.target.value }); }} className="block w-full min-h-[4.4rem] border border-neutral-10 rounded-[0.8rem] px-[0.8rem] mt-[0.6rem] bg-white">
        {tour.departureSchedules.map(d => <option key={d.code} value={d.code}>{d.dateLabel} · {formatVND(d.price)} / người</option>)}
      </select>
    </label> : <p className="text-[1.3rem]">Chưa có lịch khởi hành. Xem chi tiết gói để tìm hiểu thêm.</p>}
    {days.length > 0 && <details className="text-[1.3rem]"><summary className="cursor-pointer min-h-[4.4rem] flex items-center font-semibold">Xem lịch trình theo ngày</summary><div className="space-y-[1rem]">{days.map(day => <section key={day.day}><h4 className="font-bold">Ngày {day.day} · {day.title}</h4><ul className="space-y-[0.6rem] mt-[0.6rem] text-neutral-60">{day.activities.map(a => <li key={a.id}>{a.time} · {a.title}{a.optional ? " (tùy chọn)" : ""}</li>)}</ul></section>)}</div></details>}
    <div className="flex flex-wrap gap-[0.8rem] text-[1.3rem] font-semibold">
      <Link onClick={() => { remember(); onNavigate(); }} href={`/tours/${p.id}?from=ace&consultation=${encodeURIComponent(entryId)}`} className="min-h-[4.4rem] inline-flex items-center border border-brand-primary text-brand-primary rounded-full px-[1.2rem]">Xem chi tiết tour</Link>
      {departure && <Link onClick={() => { remember(); onNavigate(); }} href={`/booking?package=${p.id}&departure=${encodeURIComponent(departure.code)}&from=ace&consultation=${encodeURIComponent(entryId)}`} className="min-h-[4.4rem] inline-flex items-center bg-brand-primary text-white rounded-full px-[1.2rem]">{action}</Link>}
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
  const pathname = usePathname();
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
  const conversation = useRef(initialAceState());
  const sessionId = useRef("");
  const [hydrated, setHydrated] = useState(false);
  const [selection, setSelection] = useState<AceSelection>();
  const [humanMode, setHumanMode] = useState(false);
  const [editingGroup,setEditingGroup]=useState(false);
  const [contact, setContact] = useState("");
  const [supportRetry, setSupportRetry] = useState<{ text: string; clientMessageId: string } | null>(null);
  const advisor = useAdvisorConversation(thread => {
    setMessages(prev => {
      const merged = mergeAdvisorMessages(prev, thread);
      return merged.length === prev.length ? prev : merged;
    });
    setContact(current => current || thread.contact);
  }, hydrated);
  useEffect(() => {
    const saved = readAceSession();
    sessionId.current = saved?.id ?? crypto.randomUUID();
    msgId.current = Date.now();
    if (saved) {
      conversation.current = saved.state; setMessages(saved.messages); setSelection(saved.selection); setHumanMode(saved.humanMode);
      welcomeFiredRef.current = saved.messages.length > 0;
      if (saved.open) setPhase("opening");
    }
    if(new URLSearchParams(window.location.search).get("ace")==="open")setPhase("opening");
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) saveAceSession({ version: 1, id: sessionId.current, state: conversation.current, messages, selection, humanMode, open: phase === "open" || phase === "opening" }, "chat");
  }, [hydrated, messages, selection, humanMode, phase]);
  useEffect(() => {
    const synchronize = (event: Event) => {
      if ((event as CustomEvent).detail?.source === "chat") return;
      const saved = readAceSession(); if (!saved || saved.id !== sessionId.current) return;
      conversation.current = saved.state; setMessages(saved.messages); setSelection(saved.selection); setHumanMode(saved.humanMode);
    };
    window.addEventListener("ace:session", synchronize);
    return () => window.removeEventListener("ace:session", synchronize);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams(window.location.search);
    const packageId = pathname.startsWith("/tours/") ? pathname.split("/")[2] : pathname === "/booking" ? params.get("package") : null;
    const tour = tours.find(t => t.packageId === packageId); if (!tour) return;
    const code = tour.departureSchedules.find(d => d.code === params.get("departure"))?.code ?? (selection?.packageId === tour.packageId ? selection.departureCode : tour.departureSchedules[0]?.code);
    if (code) setSelection({ packageId: tour.packageId, departureCode: code });
  }, [pathname, hydrated]);
  const chooseSelection = (next: AceSelection) => {
    conversation.current = { ...conversation.current, preferences: { ...conversation.current.preferences, packageId: next.packageId } };
    setSelection(next);
    saveAceSession({ version: 1, id: sessionId.current, state: conversation.current, messages, selection: next, humanMode, open: false }, "chat");
  };
  const requestRef = useRef<AbortController | null>(null);
  const retryRef = useRef<unknown>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  useEffect(() => () => requestRef.current?.abort(), []);

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
    if (!hydrated || phase !== "open" || welcomeFiredRef.current) return;
    welcomeFiredRef.current = true;
    setMessages([{
        id: msgId.current++, role: "bot",
        text: "Xin chào! Tôi là **Ace** 🎾 — trợ lý AI của Vietravel Tennis Travel.\n\nCùng tôi chọn chuyến tennis, khám phá trình độ và tìm hiểu trải nghiệm trong tour. Bạn muốn bắt đầu từ đâu?",
        chips: ["Gợi ý gói tour 🏖️", "Tôi thuộc NTRP nào? 🎾", "Trải nghiệm trong tour"],
      }]);
  }, [phase, hydrated]);

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
    requestRef.current?.abort();
    requestRef.current = null;
    retryRef.current = null;
    setAiError(null);
    advisor.reset();
    sessionId.current = crypto.randomUUID();
    setEditingGroup(false);
    setSelection(undefined); setHumanMode(false); setContact(""); setSupportRetry(null);
    conversation.current = initialAceState();
    setMessages([]);
    setTyping(false);
    setInputVal("");
  };

  const handleChip = (text: string) => {
    if (requestRef.current || advisor.busy) return;
    setHumanMode(false);
    setAiError(null);
    retryRef.current = null;
    const response = aceRespond(conversation.current, text);
    conversation.current = response.state;
    setMessages(prev => [...prev,
      { id: `${sessionId.current}:${msgId.current++}`, at: new Date().toISOString(), role: "user", text },
      { id: `${sessionId.current}:${msgId.current++}`, at: new Date().toISOString(), role: "bot", ...response.reply },
    ]);
  };
  const saveGroupNeeds = (needs:GroupNeeds) => {
    const preferences=applyGroupNeeds(conversation.current.preferences,needs);
    conversation.current={step:"idle",preferences};setEditingGroup(false);setSelection(undefined);setAiError(null);
    const reply=groupRecommendation(needs,preferences);
    setMessages(prev=>[...prev,{id:`${sessionId.current}:${msgId.current++}`,at:new Date().toISOString(),role:"bot",...reply}]);
  };
  const cancelGroupNeeds = () => {
    conversation.current={...conversation.current,step:"idle"};setEditingGroup(false);
    setMessages(prev=>[...prev,{id:`${sessionId.current}:${msgId.current++}`,at:new Date().toISOString(),role:"bot",text:"Bạn có thể sửa nhu cầu nhóm khi sẵn sàng. Thông tin đã xác nhận trước đó vẫn được giữ.",chips:["Sửa nhu cầu nhóm","Gợi ý gói tour 🏖️"]}]);
  };
  const handleQuickPrompt = (_flowKey: string, label: string) => handleChip(label);
  const sendAI = async (text?: string) => {
    if (requestRef.current) return;
    let payload = retryRef.current;
    if (text) {
      const history = messages.map(message => ({ role: message.role === "user" ? "user" : "assistant", content: message.text.slice(0, 6000) }));
      history.push({ role: "user", content: text });
      const recent = history.slice(-24);
      while (recent.length > 1 && recent.reduce((sum, turn) => sum + turn.content.length, 0) > 30000) recent.shift();
      payload = { messages: recent, preferences: conversation.current.preferences };
      retryRef.current = payload;
      setMessages(prev => [...prev, { id: `${sessionId.current}:${msgId.current++}`, at: new Date().toISOString(), role: "user", text }]);
    }
    if (!payload) return;
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    setAiError(null);
    setTyping(true);
    let failureMessage = "Chưa kết nối được với Ace. Bạn thử lại nhé.";
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: controller.signal });
      const reply = await response.json().catch(() => null);
      if (requestRef.current !== controller) return;
      if (!response.ok || !reply || typeof reply.text !== "string" || !Array.isArray(reply.packageIds)) {
        failureMessage = typeof reply?.error === "string" ? reply.error : "Ace chưa trả lời được. Bạn thử lại nhé.";
        throw new Error("AI_REQUEST_FAILED");
      }
      if (reply.preferences) conversation.current = { ...conversation.current, preferences: reply.preferences };
      const packageIds = reply.packageIds.filter((id: unknown) => typeof id === "string" && tourPackages.some(p => p.id === id));
      setMessages(prev => [...prev, { id: `${sessionId.current}:${msgId.current++}`, at: new Date().toISOString(), role: "bot", text: reply.text, packageIds, preferences: reply.preferences, chips: reply.chips }]);
      retryRef.current = null;
    } catch {
      if (requestRef.current !== controller) return;
      setAiError(controller.signal.aborted ? "Ace phản hồi lâu hơn dự kiến. Bạn thử lại hoặc dùng các lựa chọn bên dưới nhé." : failureMessage);
    } finally {
      window.clearTimeout(timeout);
      if (requestRef.current === controller) { requestRef.current = null; setTyping(false); }
    }
  };
  const sendToAdvisor = async (text?: string) => {
    if (advisor.busy || requestRef.current) return;
    const lastUser = messages.filter(m => m.role === "user").at(-1);
    const pending = text ? { text, clientMessageId: `${sessionId.current}:${msgId.current++}` } : supportRetry ?? (lastUser ? { text: lastUser.text.slice(0, 2000), clientMessageId: String(lastUser.id) } : { text: "Mình muốn được tư vấn thêm về chuyến đi.", clientMessageId: `${sessionId.current}:${msgId.current++}` });
    if (!messages.some(m => String(m.id) === pending.clientMessageId)) setMessages(prev => [...prev, { id: pending.clientMessageId, role: "user", text: pending.text, at: new Date().toISOString() }]);
    setSupportRetry(pending); setAiError(null);
    const context = messages.slice(-12).map(m => `${m.role === "user" ? "Khách" : m.role === "advisor" ? "Tư vấn viên" : "Ace"}: ${m.text.slice(0, 1000)}`).join("\n\n");
    const sent = await advisor.send({ ...pending, contact, context, needs: conversation.current.preferences, selection });
    if (sent) { setHumanMode(true); setSupportRetry(null); }
  };
  const handleSend = () => {
    const text = inputVal.trim();
    if (!text || requestRef.current || advisor.busy) return;
    setInputVal("");
    if (humanMode) { void sendToAdvisor(text); return; }
    const last = messages[messages.length - 1];
    if (last?.chips?.includes(text) || QUICK_PROMPTS.some(item => item.label === text) || ["diet","group"].includes(conversation.current.step)) handleChip(text);
    else void sendAI(text);
  };

  /* ─── Derived values ─── */
  const inDOM     = phase !== "closed";
  const slideUp   = phase === "open";   // translateY(0) khi open, translateY(100%) các phase khác

  return (
    <>
      {/* Floating button */}
      <button
        onClick={handleOpen}
        disabled={!hydrated}
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
                <p className="text-green-600 text-[1.2rem] font-medium">{humanMode ? "● Đang trao đổi với tư vấn viên" : "● Tư vấn cùng Ace"}</p>
              </div>
              <div className="flex items-center gap-[0.6rem]">
                <button onClick={handleReset}
                  className="flex items-center gap-[0.5rem] text-neutral-40 hover:text-neutral-60 text-[1.2rem] font-medium px-[0.8rem] py-[0.4rem] rounded-full hover:bg-neutral-05 transition-colors"
                  aria-label="Bắt đầu lại cuộc trò chuyện">
                  <RefreshCw size={13} />Bắt đầu lại
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
                    <p className={`text-[1rem] font-semibold mb-[0.4rem] ${msg.role === "user" ? "text-white/80" : "text-neutral-50"}`}>{msg.role === "user" ? "Bạn" : msg.role === "advisor" ? "Tư vấn viên" : "Ace"}</p>
                    {msg.role === "user"
                      ? <p className="text-[1.3rem] text-white leading-relaxed">{msg.text}</p>
                      : <BotText text={msg.text} />}
                  </div>
                  {msg.role === "bot" && msg.packageIds?.map(packageId => <ProductCard key={packageId} packageId={packageId} onNavigate={handleClose} preferences={msg.preferences} selection={selection} onChoose={chooseSelection} entryId={sessionId.current} />)}
                  {msg.role === "bot" && !humanMode && msg.chips && msg.id === messages[messages.length - 1]?.id && (
                    <div className="flex flex-wrap gap-[0.6rem] max-w-[90%]">
                      {msg.chips.map((chip) => (
                        <button key={chip} disabled={typing} onClick={() => handleChip(chip)}
                          className="px-[1.2rem] py-[0.7rem] rounded-full border border-brand-primary text-brand-primary text-[1.2rem] font-semibold bg-white hover:bg-brand-tint transition-colors">
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {!humanMode&&(editingGroup||conversation.current.step==="group")&&<GroupNeedsEditor key={`${sessionId.current}:group`} preferences={conversation.current.preferences} busy={typing||advisor.busy} onSave={saveGroupNeeds} onCancel={cancelGroupNeeds}/>}
              {!humanMode&&conversation.current.preferences.groupNeeds&&conversation.current.step!=="group"&&!editingGroup&&<button type="button" disabled={typing||advisor.busy} onClick={()=>setEditingGroup(true)} className="text-brand-primary text-[1.3rem] font-semibold min-h-[4.4rem]">Sửa bản tóm tắt nhu cầu nhóm</button>}
              {aiError && <div role="status" className="rounded-[1.2rem] bg-neutral-05 p-[1.4rem] text-[1.3rem] space-y-[1rem]">
                <p>{aiError}</p>
                <button type="button" disabled={typing} onClick={() => void sendAI()} className="text-brand-primary font-semibold min-h-[4.4rem]">Thử lại câu hỏi</button>
                <div className="flex flex-wrap gap-[0.8rem]">{["Gợi ý gói tour 🏖️", "Tôi thuộc NTRP nào? 🎾", "Trải nghiệm trong tour"].map(label => <button key={label} type="button" disabled={typing} onClick={() => handleChip(label)} className="border border-brand-primary text-brand-primary rounded-full px-[1.2rem] min-h-[4.4rem]">{label}</button>)}</div>
              </div>}
              {advisor.error && <div role="alert" className="text-[1.3rem] bg-neutral-05 rounded-[1rem] p-[1rem]"><p>{advisor.error}</p><button type="button" disabled={advisor.busy} onClick={() => void sendToAdvisor()} className="text-brand-primary min-h-[4.4rem] font-semibold">Thử gửi lại</button></div>}
              {(typing || advisor.busy) && <div className="flex items-start"><TypingDots /></div>}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 px-[1.6rem] pt-[1rem] pb-[2.4rem] border-t border-neutral-05">
              <div className="text-[1.2rem] mb-[0.8rem]">
                <div className="flex items-center justify-between gap-[1rem]"><span>{humanMode ? advisor.thread?.status === "replied" ? "Tư vấn viên đã phản hồi" : "Đã chuyển · Chờ tư vấn viên" : "Đang trò chuyện với Ace"}</span><button type="button" disabled={typing || advisor.busy} onClick={() => humanMode ? setHumanMode(false) : void sendToAdvisor()} className="text-brand-primary font-semibold min-h-[4.4rem]">{humanMode ? "Quay lại Ace" : "Nhờ tư vấn viên hỗ trợ"}</button></div>
                {!humanMode && <details><summary className="cursor-pointer text-neutral-50">Để lại liên hệ (không bắt buộc)</summary><input aria-label="Email hoặc số điện thoại cho tư vấn viên" value={contact} maxLength={200} onChange={e => setContact(e.target.value)} placeholder="Email hoặc số điện thoại" className="w-full border border-neutral-10 rounded-[0.8rem] p-[0.8rem] mt-[0.4rem]"/></details>}
                <p className="text-neutral-40 text-[1rem]">{humanMode ? "Nhập bên dưới để tiếp tục cùng tư vấn viên." : "Khi nhờ hỗ trợ, nhu cầu và trao đổi gần đây được chuyển cùng câu hỏi."}</p>
              </div>
              <div className="flex items-center gap-[1rem] bg-[var(--ds-canvas)] rounded-[var(--ds-radius-control)] px-[1.6rem] py-[0.8rem]">
                <input ref={inputRef} type="text" value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  maxLength={2000}
                  placeholder={humanMode ? "Nhắn cho tư vấn viên..." : "Hỏi Ace về chuyến đi của bạn..."}
                  className="flex-1 min-w-0 bg-transparent text-[1.6rem] text-neutral-90 placeholder:text-neutral-40 outline-none"
                  aria-label="Nhập câu hỏi" />
                <button onClick={handleSend} disabled={!inputVal.trim() || typing || advisor.busy} aria-label="Gửi"
                  className={`w-[4.4rem] h-[4.4rem] rounded-full flex items-center justify-center transition-all duration-200 ${
                    inputVal.trim() ? "bg-brand-primary hover:bg-brand-primary-dark" : "bg-neutral-10"
                  }`}>
                  <Send size={15} className={inputVal.trim() ? "text-white" : "text-neutral-40"} />
                </button>
              </div>
              <p className="text-neutral-40 text-[1.2rem] text-center mt-[0.8rem]">
                Ace · Hỗ trợ khám phá Travel Ace
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
