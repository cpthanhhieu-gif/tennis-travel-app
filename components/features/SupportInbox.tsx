"use client";
import { useEffect, useState } from "react";
import type { SupportSummary, SupportThread, SupportStatus } from "@/lib/support-inbox";
const labels = { new: "Mới", processing: "Đang xử lý", replied: "Đã trả lời" };
export default function SupportInbox() {
  const [threads, setThreads] = useState<SupportSummary[]>([]);
  const [selected, setSelected] = useState<SupportThread | null>(null);
  const [filter, setFilter] = useState("all");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [allowed, setAllowed] = useState(false);
  async function refresh() {
    try { const r = await fetch("/api/support?admin=1", { cache: "no-store" }); const b = await r.json(); if (!r.ok) { setAllowed(false); throw Error(b.error); } setAllowed(true); setThreads(b.threads); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Chưa tải được hộp thư."); } finally { setLoaded(true); }
  }
  useEffect(() => { void refresh(); const timer = window.setInterval(() => { if (!document.hidden) void refresh(); }, 15000); return () => window.clearInterval(timer); }, []);
  useEffect(() => {
    if (!selected?.id) return;
    const id = selected.id;
    const controller = new AbortController();
    const timer = window.setInterval(async () => {
      if (document.hidden) return;
      try { const r = await fetch(`/api/support?admin=1&id=${id}`, { cache: "no-store", signal: controller.signal }); const b = await r.json(); if (r.ok && b.thread) setSelected(current => current?.id === id && current.updatedAt < b.thread.updatedAt ? b.thread : current); } catch {}
    }, 10000);
    return () => { controller.abort(); window.clearInterval(timer); };
  }, [selected?.id]);
  async function open(id: string) {
    try { const r = await fetch(`/api/support?admin=1&id=${id}`, { cache: "no-store" }); const b = await r.json(); if (!r.ok || !b.thread) throw Error(b.error || "Không tìm thấy hội thoại."); setSelected(b.thread); setReply(""); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Chưa tải được hội thoại."); }
  }
  async function act(action: "reply" | "status", status?: SupportStatus) {
    if (!selected || busy) return; setBusy(true);
    try { const r = await fetch("/api/support", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, id: selected.id, text: reply, status }) }); const b = await r.json(); if (!r.ok) throw Error(b.error); setSelected(b.thread); if (action === "reply") setReply(""); await refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : "Chưa lưu được phản hồi."); } finally { setBusy(false); }
  }
  return <section className="ds-section" aria-label="Hộp thư tư vấn"><div className="flex flex-wrap items-center justify-between gap-[1rem]"><div><h2>Hộp thư tư vấn</h2><p>Câu hỏi khách gửi từ Ace · {threads.filter(t => t.status === "new").length} hội thoại mới</p></div><button className="ds-link" onClick={() => { void refresh(); if (selected) void open(selected.id); }}>Làm mới hộp thư</button></div>
    {error && <p role="alert" className="my-[1rem]">{error}</p>}
    {!loaded ? <p>Đang tải hộp thư…</p> : !allowed ? <p>Đăng nhập quản trị tại mục Phiên demo, rồi làm mới hộp thư.</p> : <div className="grid md:grid-cols-2 gap-[2rem] mt-[1.6rem]">
      <div><label className="block mb-[1rem]">Trạng thái <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded p-[0.8rem]"><option value="all">Tất cả</option>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <div className="space-y-[0.8rem] max-h-[60rem] overflow-auto">{threads.filter(t => filter === "all" || t.status === filter).map(t => <button key={t.id} className={`block w-full text-left border rounded-[1rem] p-[1.2rem] ${selected?.id === t.id ? "border-brand-primary bg-brand-tint" : "border-neutral-10"}`} onClick={() => void open(t.id)}><strong>{labels[t.status]}</strong><p>{t.preview}</p><small>{t.contact || "Khách chưa để lại liên hệ"} · {new Date(t.updatedAt).toLocaleString("vi-VN")}</small></button>)}{!threads.filter(t => filter === "all" || t.status === filter).length && <p>Chưa có hội thoại ở trạng thái này.</p>}</div></div>
      <div>{selected ? <><h3>Chi tiết hội thoại</h3><p>Liên hệ: {selected.contact || "Chưa cung cấp"}</p><label>Trạng thái <select disabled={busy} value={selected.status} onChange={e => void act("status", e.target.value as SupportStatus)} className="border rounded p-[0.8rem] my-[1rem]">{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><details><summary className="cursor-pointer min-h-[4.4rem]">Nhu cầu và trao đổi trước khi gửi</summary><p className="whitespace-pre-wrap text-[1.3rem]">{selected.context || "Chưa có thông tin bổ sung."}</p></details><div className="space-y-[1rem] max-h-[40rem] overflow-auto my-[1.2rem]">{selected.messages.map(m => <div key={m.id} className="bg-neutral-05 rounded-[1rem] p-[1rem]"><strong>{m.role === "customer" ? "Khách hàng" : "Tư vấn viên"}</strong><p className="whitespace-pre-wrap">{m.text}</p><small>{new Date(m.at).toLocaleString("vi-VN")}</small></div>)}</div><form onSubmit={e => { e.preventDefault(); void act("reply"); }}><label className="block">Trả lời khách<textarea value={reply} onChange={e => setReply(e.target.value)} maxLength={2000} rows={4} className="block w-full border rounded-[1rem] p-[1rem] mt-[0.6rem]" required /></label><button type="submit" disabled={busy || !reply.trim()} className="ds-cta mt-[1rem]">{busy ? "Đang gửi…" : "Gửi phản hồi"}</button><p className="text-[1.2rem] mt-[0.6rem]">Phản hồi sẽ xuất hiện trong Ace khi khách mở lại trên cùng trình duyệt.</p></form></> : <p>Chọn hội thoại để xem và trả lời.</p>}</div>
    </div>}
  </section>;
}
