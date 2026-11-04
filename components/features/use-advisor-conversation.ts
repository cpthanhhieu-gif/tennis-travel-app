"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { browserStorageKey } from "@/lib/demo-scope";
import type { SupportThread } from "@/lib/support-inbox";
const tokenKey = () => browserStorageKey("ace-support-token-v1");
export function useAdvisorConversation(onThread: (thread: SupportThread) => void, enabled: boolean) {
  const callback = useRef(onThread); useEffect(() => { callback.current = onThread; }, [onThread]);
  const [thread, setThread] = useState<SupportThread | null>(null);
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const token = useRef(""); const request = useRef<AbortController | null>(null); const generation = useRef(0);
  const pending = useRef<{ text: string; clientId: string; id: string } | null>(null);
  useEffect(() => {
    if (!enabled) return;
    try { token.current = localStorage.getItem(tokenKey()) ?? ""; } catch {}
    const controller = new AbortController(); let alive = true;
    const poll = async () => {
      const version = generation.current;
      if (!/^[a-f0-9]{64}$/.test(token.current) || document.hidden || request.current) return;
      try { const r = await fetch("/api/support", { cache: "no-store", headers: { "x-support-token": token.current }, signal: controller.signal }); const b = await r.json(); if (alive && version === generation.current && r.ok && b.thread) { setThread(b.thread); callback.current(b.thread); } } catch {}
    };
    void poll(); const timer = window.setInterval(poll, 10000); window.addEventListener("focus", poll);
    return () => { alive = false; controller.abort(); request.current?.abort(); window.clearInterval(timer); window.removeEventListener("focus", poll); };
  }, [enabled]);
  const reset = useCallback(() => { generation.current++; request.current?.abort(); request.current = null; token.current = ""; pending.current = null; try { localStorage.removeItem(tokenKey()); } catch {} setThread(null); setError(""); setBusy(false); }, []);
  async function send(payload: { text: string; clientMessageId: string; contact: string; context: string; needs: unknown; selection: unknown }) {
    if (request.current) return false;
    if (!/^[a-f0-9]{64}$/.test(token.current)) token.current = Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, "0")).join("");
    try { localStorage.setItem(tokenKey(), token.current); } catch { setError("Chưa lưu được mã hội thoại. Hãy cho phép lưu dữ liệu trang rồi thử lại."); return false; }
    if (!pending.current || pending.current.clientId !== payload.clientMessageId) pending.current = { text: payload.text, clientId: payload.clientMessageId, id: crypto.randomUUID() };
    const controller = new AbortController(); request.current = controller; const version = generation.current;
    const timeout = window.setTimeout(() => controller.abort(), 20000); setBusy(true); setError("");
    try {
      const r = await fetch("/api/support", { method: "POST", headers: { "Content-Type": "application/json", "x-support-token": token.current }, body: JSON.stringify({ action: "send", requestId: pending.current.id, ...payload }), signal: controller.signal });
      const b = await r.json().catch(() => null);
      if (version !== generation.current) return false;
      if (!r.ok || !b?.thread) { setError(b?.error || "Chưa gửi được câu hỏi. Bạn thử lại nhé."); return false; }
      if (version !== generation.current) return false;
      setThread(b.thread); callback.current(b.thread); pending.current = null; return true;
    } catch { if (version === generation.current) setError("Chưa xác nhận được tin nhắn đã gửi. Bạn có thể thử lại; app sẽ kiểm tra để tránh gửi trùng."); return false; }
    finally { window.clearTimeout(timeout); if (request.current === controller) { request.current = null; setBusy(false); } }
  }
  return { thread, busy, error, send, reset };
}
