"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "./ace-chat.css";
import {matchAceScript,advisorFollowups} from "@/lib/ace-script";
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
import { Send, ChevronDown, RefreshCw, Maximize2, Minimize2, Sparkles } from "lucide-react";

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
      {p.id==="sbu2"&&preferences?.numPeople!==undefined&&preferences.numPeople<8 ? <p>Đăng ký đoàn từ 8 khách. Nhờ tư vấn viên kiểm tra khả năng tham gia cùng đoàn.</p> : departure && <Link onClick={() => { remember(); onNavigate(); }} href={`/booking?package=${p.id}&departure=${encodeURIComponent(departure.code)}&from=ace&consultation=${encodeURIComponent(entryId)}`} className="min-h-[4.4rem] inline-flex items-center bg-brand-primary text-white rounded-full px-[1.2rem]">{action}</Link>}
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
  const typing = false;
  const [inputVal, setInputVal] = useState("");
  const [expanded,setExpanded]=useState(false);
  const dialogRef=useRef<HTMLDivElement>(null);
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
        text: "Xin chào! Tôi là **Ace**, trợ lý du lịch tennis của bạn. Bạn muốn tìm chuyến đi phù hợp hay khám phá trình độ tennis?",
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
    if (phase === "open" && window.matchMedia("(min-width: 640px)").matches) window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 350);
  }, [phase]);

  useEffect(()=>{
    if(phase!=="open")return;
    const viewport=window.visualViewport;
    const resize=()=>{dialogRef.current?.style.setProperty("--ace-vh",`${viewport?.height??window.innerHeight}px`);dialogRef.current?.style.setProperty("--ace-top",`${viewport?.offsetTop??0}px`);};
    resize();viewport?.addEventListener("resize",resize);viewport?.addEventListener("scroll",resize);
    const key=(event:KeyboardEvent)=>{
      if(event.key==="Escape"){setPhase("closing");window.setTimeout(()=>setPhase("closed"),310);}
      if(event.key==="Tab"&&dialogRef.current){const elements=Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],summary')).filter(el=>el.getClientRects().length);const first=elements[0],last=elements.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}
    };
    document.addEventListener("keydown",key);
    const lock=window.matchMedia("(max-width: 639px)").matches||expanded;const previous=document.body.style.overflow;if(lock)document.body.style.overflow="hidden";
    return()=>{viewport?.removeEventListener("resize",resize);viewport?.removeEventListener("scroll",resize);document.removeEventListener("keydown",key);if(lock)document.body.style.overflow=previous;};
  },[phase,expanded]);

  /* ─── Handlers ─── */
  const handleOpen = () => setPhase("opening");

  const handleClose = () => {
    setPhase("closing");
    window.setTimeout(() => setPhase("closed"), 310);
  };

  const handleReset = () => {
    advisor.reset();
    sessionId.current = crypto.randomUUID();
    setEditingGroup(false);
    setSelection(undefined); setHumanMode(false); setContact(""); setSupportRetry(null);
    conversation.current = initialAceState();
    setMessages([]);
    setInputVal("");
  };

  const handleChip = (text: string, displayText = text) => {
    if (advisor.busy) return;
    setHumanMode(false);
    setEditingGroup(false);
    const response = aceRespond(conversation.current, text);
    conversation.current = response.state;
    setMessages(prev => [...prev,
      { id: `${sessionId.current}:${msgId.current++}`, at: new Date().toISOString(), role: "user", text: displayText },
      { id: `${sessionId.current}:${msgId.current++}`, at: new Date().toISOString(), role: "bot", ...response.reply },
    ]);
  };
  const saveGroupNeeds = (needs:GroupNeeds) => {
    const preferences=applyGroupNeeds(conversation.current.preferences,needs);
    conversation.current={step:"idle",preferences};setEditingGroup(false);setSelection(undefined);
    const reply=groupRecommendation(needs,preferences);
    setMessages(prev=>[...prev,{id:`${sessionId.current}:${msgId.current++}`,at:new Date().toISOString(),role:"bot",...reply}]);
  };
  const cancelGroupNeeds = () => {
    conversation.current={...conversation.current,step:"idle"};setEditingGroup(false);
    setMessages(prev=>[...prev,{id:`${sessionId.current}:${msgId.current++}`,at:new Date().toISOString(),role:"bot",text:"Bạn có thể sửa nhu cầu nhóm khi sẵn sàng. Thông tin đã xác nhận trước đó vẫn được giữ.",chips:["Sửa nhu cầu nhóm","Gợi ý gói tour 🏖️"]}]);
  };
  const handleQuickPrompt = (_flowKey: string, label: string) => handleChip(label);
  const sendToAdvisor = async (text?: string) => {
    if (advisor.busy) return;
    const lastUser = messages.filter(m => m.role === "user").at(-1);
    const pending = text ? { text, clientMessageId: `${sessionId.current}:${msgId.current++}` } : supportRetry ?? (lastUser ? { text: lastUser.text.slice(0, 2000), clientMessageId: String(lastUser.id) } : { text: "Mình muốn được tư vấn thêm về chuyến đi.", clientMessageId: `${sessionId.current}:${msgId.current++}` });
    if (!messages.some(m => String(m.id) === pending.clientMessageId)) setMessages(prev => [...prev, { id: pending.clientMessageId, role: "user", text: pending.text, at: new Date().toISOString() }]);
    setSupportRetry(pending);
    const context = messages.slice(-12).map(m => `${m.role === "user" ? "Khách" : m.role === "advisor" ? "Tư vấn viên" : "Ace"}: ${m.text.slice(0, 1000)}`).join("\n\n");
    const sent = await advisor.send({ ...pending, contact, context, needs: conversation.current.preferences, selection });
    if (sent) {
      setHumanMode(true); setSupportRetry(null);
      const id=`handoff:${pending.clientMessageId}`;
      setMessages(prev=>prev.some(m=>m.id===id)?prev:[...prev,{id,role:"bot",text:"Đã gửi câu hỏi đến nhân viên tư vấn. Phản hồi sẽ xuất hiện trong cuộc trò chuyện này.",at:new Date().toISOString()}]);
    }
  };
  const handleSend = () => {
    const text = inputVal.trim();
    if (!text || advisor.busy) return;
    setInputVal("");
    const scripted=matchAceScript(conversation.current,text);
    if(scripted)handleChip(scripted,text);
    else void sendToAdvisor(text);
  };

  /* ─── Derived values ─── */
  const latestMessage=messages.at(-1);
  const continuationChips=latestMessage&&(latestMessage.role==="advisor"||String(latestMessage.id).startsWith("handoff:"))?advisorFollowups(conversation.current):undefined;
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
          <div onClick={handleClose} className={`ace-chat-backdrop ${expanded?"is-expanded":""}`} />
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Chat tư vấn AI — Ace"
            className={`ace-chat ${slideUp?"is-open":""} ${expanded?"is-expanded":""}`}>
            <header className="ace-chat-header">
              <Image src="/vietravel-chatbot-icon.png" alt="" width={40} height={40} className="ace-chat-avatar"/>
              <div className="ace-chat-identity"><strong>Ace</strong><span><i/>{humanMode?"Tư vấn viên đồng hành":"Trợ lý du lịch tennis của bạn"}</span></div>
              <div className="ace-chat-header-actions">
                <button type="button" onClick={handleReset} aria-label="Bắt đầu lại cuộc trò chuyện" title="Bắt đầu lại"><RefreshCw size={15}/></button>
                <button type="button" className="ace-chat-expand" onClick={()=>setExpanded(v=>!v)} aria-label={expanded?"Thu nhỏ cửa sổ chat":"Mở rộng cửa sổ chat"} title={expanded?"Thu nhỏ":"Mở rộng"}>{expanded?<Minimize2 size={16}/>:<Maximize2 size={16}/>}</button>
                <button type="button" onClick={handleClose} aria-label="Đóng chat" title="Thu gọn"><ChevronDown size={20}/></button>
              </div>

            </header>

            {/* Messages */}
            <div className="ace-chat-messages"
              style={{ scrollbarWidth: "none" }}>

              <div className="ace-chat-welcome"><Sparkles size={18} aria-hidden="true"/><strong>Mỗi chuyến đi đáng nhớ<br/>bắt đầu từ một lời chào.</strong><p>Chia sẻ kế hoạch ra sân cùng Ace nhé.</p></div>
              <div className="ace-chat-day"><span>{messages[0]?.at&&new Date(messages[0].at).toDateString()!==new Date().toDateString()?new Date(messages[0].at).toLocaleDateString("vi-VN"):"Hôm nay"}</span></div>
              {messages.length === 0 && !typing && (
                <div className="flex flex-col items-center pt-[2rem] pb-[1rem]">
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
                  <div className={`ace-chat-bubble ${msg.role === "user" ? "is-user" : "is-assistant"}`}>
                    <p className={`text-[1rem] font-semibold mb-[0.4rem] ${msg.role === "user" ? "text-white/80" : "text-neutral-50"}`}>{msg.role === "user" ? "Bạn" : msg.role === "advisor" ? "Tư vấn viên" : "Ace"}</p>
                    {msg.role === "user"
                      ? <p className="text-[1.3rem] text-white leading-relaxed">{msg.text}</p>
                      : <BotText text={msg.text} />}
                    {msg.at&&<time className="ace-chat-time" dateTime={msg.at}>{new Date(msg.at).toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"})}</time>}
                  </div>
                  {msg.role === "bot" && msg.packageIds?.map(packageId => <ProductCard key={packageId} packageId={packageId} onNavigate={handleClose} preferences={msg.preferences} selection={selection} onChoose={chooseSelection} entryId={sessionId.current} />)}
                  {((msg.role === "bot" && !humanMode && msg.chips)||continuationChips) && msg.id === latestMessage?.id && (
                    <div className="ace-chat-chips">
                      {(continuationChips??msg.chips??[]).map((chip) => (
                        <button key={chip} disabled={typing||advisor.busy} onClick={() => handleChip(matchAceScript(conversation.current,chip)??chip,chip)}
                          className="ace-chat-chip">
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {(editingGroup||conversation.current.step==="group")&&<div hidden={humanMode}><GroupNeedsEditor key={`${sessionId.current}:group`} preferences={conversation.current.preferences} busy={typing||advisor.busy} onSave={saveGroupNeeds} onCancel={cancelGroupNeeds}/></div>}
              {!humanMode&&conversation.current.preferences.groupNeeds&&conversation.current.step!=="group"&&!editingGroup&&<button type="button" disabled={typing||advisor.busy} onClick={()=>setEditingGroup(true)} className="text-brand-primary text-[1.3rem] font-semibold min-h-[4.4rem]">Sửa bản tóm tắt nhu cầu nhóm</button>}
              {advisor.error && <div role="alert" className="text-[1.3rem] bg-neutral-05 rounded-[1rem] p-[1rem]"><p>{advisor.error}</p><button type="button" disabled={advisor.busy} onClick={() => void sendToAdvisor()} className="text-brand-primary min-h-[4.4rem] font-semibold">Thử gửi lại</button></div>}
              {(typing || advisor.busy) && <div className="flex items-start"><TypingDots /></div>}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="ace-chat-footer">
              <div className="ace-chat-footer-tools">
                <details className="ace-chat-contact"><summary>Liên hệ tùy chọn</summary><label>Email hoặc số điện thoại<input aria-label="Email hoặc số điện thoại cho tư vấn viên" value={contact} maxLength={200} onChange={e=>setContact(e.target.value)} placeholder="Để tư vấn viên liên hệ lại"/></label><p>Khi nhờ hỗ trợ, nhu cầu và trao đổi gần đây sẽ được chuyển cùng câu hỏi.</p></details>
                <button type="button" disabled={typing||advisor.busy} onClick={()=>humanMode?handleChip("Tiếp tục kịch bản","Quay lại Ace"):void sendToAdvisor()}>{humanMode?"Quay lại Ace":"Nhờ tư vấn viên hỗ trợ"}</button>
              </div>
              <div className="ace-chat-composer">
                <input ref={inputRef} type="text" value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  maxLength={2000}
                  placeholder={humanMode ? "Nhắn cho tư vấn viên..." : "Hỏi Ace về chuyến đi của bạn..."}
                  className="ace-chat-input"
                  aria-label="Nhập câu hỏi" />
                <button onClick={handleSend} disabled={!inputVal.trim() || typing || advisor.busy} aria-label="Gửi"
                  className="ace-chat-send">
                  <Send size={17}/>
                </button>
              </div>
              <p className="ace-chat-credit">
                Ace · Hỗ trợ khám phá Travel Ace
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
