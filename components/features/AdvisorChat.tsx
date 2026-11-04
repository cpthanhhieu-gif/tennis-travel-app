"use client";
import { useEffect, useRef, useState } from "react";
import { browserStorageKey } from "@/lib/demo-scope";
import type { SupportThread } from "@/lib/support-inbox";
const statuses = { new: "Đã gửi · Chờ tư vấn viên", processing: "Tư vấn viên đang xử lý", replied: "Tư vấn viên đã phản hồi" };
export default function AdvisorChat({ context, suggestedQuestion }: { context: string; suggestedQuestion: string }) {
  const [expanded, setExpanded] = useState(false);
  const [thread, setThread] = useState<SupportThread | null>(null);
  const [text, setText] = useState("");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [unread, setUnread] = useState(false);
  const token = useRef("");
  const sending = useRef(false);
  const pendingMessage = useRef<{ text: string; id: string } | null>(null);
  const active = useRef(true);
  const storageKey = () => browserStorageKey("ace-support-token-v1");
  const seenKey = () => browserStorageKey("ace-support-seen-v1");
  function accept(next: SupportThread) {
    setThread(current => current && current.updatedAt > next.updatedAt ? current : next);
    const latest = next.messages.filter(m => m.role === "advisor").at(-1);
    if (latest) { try { setUnread(localStorage.getItem(seenKey()) !== latest.id); } catch { setUnread(true); } }
  }
  useEffect(() => {
    active.current = true;
    try { const saved = localStorage.getItem(storageKey()); if (saved && /^[a-f0-9]{64}$/.test(saved)) token.current = saved; } catch {}
    const controller = new AbortController();
    const poll = async () => {
      if (!token.current || sending.current || document.hidden) return;
      try { const r = await fetch("/api/support", { headers: { "x-support-token": token.current }, cache: "no-store", signal: controller.signal }); const b = await r.json(); if (active.current && r.ok && b.thread) { accept(b.thread); setContact(current => current || b.thread.contact); } }
      catch { /* A transient polling failure must not replace the latest conversation. */ }
    };
    void poll(); const timer = window.setInterval(poll, 10000);
    return () => { active.current = false; controller.abort(); window.clearInterval(timer); };
  }, []);
  useEffect(() => {
    if (!expanded || !thread) return;
    const latest = thread.messages.filter(m => m.role === "advisor").at(-1);
    if (latest) { try { localStorage.setItem(seenKey(), latest.id); } catch {} setUnread(false); }
  }, [expanded, thread]);
  async function send() {
    if (!text.trim() || sending.current) return;
    if (!token.current) token.current = Array.from(crypto.getRandomValues(new Uint8Array(32)), value => value.toString(16).padStart(2, "0")).join("");
    // Persist before sending so a successful server save remains recoverable if the response is interrupted.
    try { localStorage.setItem(storageKey(), token.current); } catch { setError("Trình duyệt chưa cho lưu mã hội thoại; hãy cho phép lưu dữ liệu trang để nhận lại phản hồi."); return; }
    if (!pendingMessage.current || pendingMessage.current.text !== text.trim()) pendingMessage.current = { text: text.trim(), id: crypto.randomUUID() };
    sending.current = true; setBusy(true); setError(""); setSent(false);
    try {
      const r = await fetch("/api/support", { method: "POST", headers: { "Content-Type": "application/json", "x-support-token": token.current }, body: JSON.stringify({ action: "send", requestId: pendingMessage.current.id, text: text.trim(), contact, context: context.slice(-16000) }), signal: AbortSignal.timeout(20000) });
      const b = await r.json().catch(() => null);
      if (!r.ok || !b?.thread) throw Error(b?.error || "Chưa gửi được câu hỏi. Bạn thử lại nhé.");
      if (active.current) { accept(b.thread); setText(""); pendingMessage.current = null; setSent(true); }
    } catch (e) { if (active.current) setError(e instanceof Error && e.name === "Error" ? e.message : "Chưa xác nhận được câu hỏi đã gửi. Bạn kiểm tra hội thoại trước khi gửi lại nhé."); }
    finally { sending.current = false; if (active.current) setBusy(false); }
  }
  return <section className="border border-neutral-10 rounded-[1.2rem] bg-white p-[1.2rem] text-[1.3rem]" aria-label="Tư vấn viên">
    <button type="button" aria-expanded={expanded} onClick={() => { setExpanded(!expanded); if (!expanded && !thread && !text) setText(suggestedQuestion.slice(0, 2000)); }} className="w-full min-h-[4.4rem] text-left font-bold text-brand-primary">Nhắn tư vấn viên {unread ? "· Có phản hồi mới" : thread ? "· Xem hội thoại" : ""}</button>
    {expanded && <div className="space-y-[1rem]">
      <p>Gửi câu hỏi để đội ngũ tư vấn xem và trả lời. Bạn có thể xem phản hồi tại đây khi quay lại bằng cùng trình duyệt.</p>
      {thread && <><p role="status" className="font-semibold">{statuses[thread.status]}</p><div className="max-h-[30rem] overflow-auto space-y-[0.8rem]">{thread.messages.map(m => <div key={m.id} className={`rounded-[1rem] p-[1rem] ${m.role === "advisor" ? "bg-brand-tint" : "bg-neutral-05"}`}><strong>{m.role === "advisor" ? "Tư vấn viên" : "Bạn"}</strong><p className="whitespace-pre-wrap">{m.text}</p></div>)}</div></>}
      <form onSubmit={e => { e.preventDefault(); void send(); }} className="space-y-[1rem]">
        <label className="block">Câu hỏi của bạn<textarea rows={3} maxLength={2000} required value={text} onChange={e => { setText(e.target.value); setSent(false); }} className="block w-full border border-neutral-10 rounded-[0.8rem] p-[1rem] mt-[0.6rem]" /></label>
        <label className="block">Email hoặc số điện thoại (không bắt buộc)<input type="text" maxLength={200} value={contact} onChange={e => setContact(e.target.value)} className="block w-full border border-neutral-10 rounded-[0.8rem] p-[1rem] mt-[0.6rem]" placeholder="Để tư vấn viên liên hệ lại nếu bạn muốn" /></label>
        <p className="text-[1.2rem] text-neutral-50">Khi gửi, câu hỏi, nhu cầu và phần trao đổi gần đây trong Ace sẽ được chuyển tới hộp thư tư vấn.</p>
        <button type="submit" disabled={busy || !text.trim()} className="min-h-[4.4rem] px-[1.4rem] rounded-full bg-brand-primary text-white font-semibold">{busy ? "Đang gửi…" : "Gửi câu hỏi cho tư vấn viên"}</button>
      </form>
      {sent && <p role="status">Đã gửi câu hỏi thành công. Phản hồi sẽ hiển thị trong hội thoại này.</p>}
      {error && <p role="alert">{error}</p>}
    </div>}
  </section>;
}
