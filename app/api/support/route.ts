import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { apiStorage, readDocument, writeDocument } from "@/lib/cloud-store";
import { isAdmin } from "@/lib/demo-auth";
import { supportSummary, supportText, validSupportToken, type SupportThread, type SupportSummary } from "@/lib/support-inbox";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };
const json = (value: unknown, status = 200) => NextResponse.json(value, { status, headers });
const hash = (text: string) => createHash("sha256").update(text).digest("hex");
const indexKey = "global/support-index-v1";
let queue: Promise<unknown> = Promise.resolve();
function locked<T>(fn: () => Promise<T>) { const next = queue.then(fn, fn); queue = next.catch(() => {}); return next; }
function identity(req: NextRequest) { const token = req.headers.get("x-support-token"); return validSupportToken(token) ? hash(token) : null; }
export async function GET(req: NextRequest) {
  return apiStorage(req, async () => {
    if (req.nextUrl.searchParams.get("admin") === "1") {
      if (!isAdmin(req)) return json({ error: "Đăng nhập quản trị để xem hộp thư." }, 403);
      const id = req.nextUrl.searchParams.get("id");
      if (id) { if (!/^[a-f0-9]{64}$/.test(id)) return json({ error: "Hội thoại không hợp lệ." }, 400); return json({ thread: await readDocument<SupportThread>(`global/support/${id}`) }); }
      const threads = await readDocument<SupportSummary[]>(indexKey) ?? [];
      return json({ threads: threads.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) });
    }
    const id = identity(req);
    if (!id) return json({ error: "Chưa có mã hội thoại hợp lệ." }, 401);
    return json({ thread: await readDocument<SupportThread>(`global/support/${id}`) });
  }, true);
}
export async function POST(req: NextRequest) {
  if (req.headers.get("origin") !== req.nextUrl.origin) return json({ error: "Yêu cầu không hợp lệ." }, 403);
  let body: Record<string, unknown>;
  try {
    const reader = req.body?.getReader(); if (!reader) return json({ error: "Thiếu nội dung." }, 400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const part = await reader.read(); if (part.done) break; size += part.value.byteLength; if (size > 80000) { await reader.cancel(); return json({ error: "Nội dung quá dài." }, 413); } chunks.push(part.value); }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "Nội dung không hợp lệ." }, 400);
  } catch { return json({ error: "Nội dung không hợp lệ." }, 400); }
  return locked(() => apiStorage(req, async () => {
    const adminAction = body.action === "reply" || body.action === "status";
    if (adminAction && !isAdmin(req)) return json({ error: "Cần đăng nhập quản trị." }, 403);
    if (!adminAction && body.action !== "send") return json({ error: "Thao tác không hợp lệ." }, 400);
    const id = adminAction ? typeof body.id === "string" && /^[a-f0-9]{64}$/.test(body.id) ? body.id : null : identity(req);
    if (!id) return json({ error: "Mã hội thoại không hợp lệ." }, 401);
    const requestId = body.action === "send" && typeof body.requestId === "string" && /^[a-f0-9-]{36}$/.test(body.requestId) ? body.requestId : null;
    if (body.action === "send" && !requestId) return json({ error: "Mã tin nhắn không hợp lệ." }, 400);
    const text = supportText(body.text, 2000);
    if (body.action !== "status" && !text) return json({ error: "Nhập nội dung tối đa 2.000 ký tự." }, 400);
    if (body.action === "status" && !["new", "processing", "replied"].includes(String(body.status))) return json({ error: "Trạng thái không hợp lệ." }, 400);
    const key = `global/support/${id}`;
    const existing = await readDocument<SupportThread>(key);
    if (requestId && existing?.messages.some(m => m.id === requestId)) {
      if (existing.messages.find(m => m.id === requestId)?.text !== text) return json({ error: "Mã tin nhắn đã được sử dụng." }, 409);
      return json({ thread: existing });
    }
    if (adminAction && !existing) return json({ error: "Không tìm thấy hội thoại." }, 404);
    const index = await readDocument<SupportSummary[]>(indexKey) ?? [];
    if (!existing && index.length >= 500) return json({ error: "Hộp thư đang đầy. Vui lòng thử lại sau." }, 429);
    if ((existing?.messages.length ?? 0) >= 100 && body.action !== "status") return json({ error: "Hội thoại đã đạt giới hạn. Vui lòng liên hệ theo thông tin đã cung cấp." }, 409);
    if (!adminAction) {
      const ip = hash(req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local");
      const limiterKey = `global/support-limit/${ip}`;
      const now = Date.now(); const limiter = await readDocument<{ count: number; until: number }>(limiterKey);
      const bucket = limiter && limiter.until > now ? limiter : { count: 0, until: now + 60000 };
      if (bucket.count >= 8) return json({ error: "Bạn gửi hơi nhanh. Thử lại sau một phút nhé." }, 429);
      bucket.count++; await writeDocument(limiterKey, bucket);
    }
    const now = new Date().toISOString();
    const thread: SupportThread = existing ?? { id, status: "new", createdAt: now, updatedAt: now, contact: "", context: "", messages: [] };
    if (body.action === "send") {
      thread.contact = typeof body.contact === "string" ? body.contact.trim().slice(0, 200) : thread.contact;
      thread.context = typeof body.context === "string" ? body.context.slice(0, 16000) : thread.context;
      thread.messages.push({ id: requestId!, role: "customer", text: text!, at: now }); thread.status = "new";
    } else if (body.action === "reply") { thread.messages.push({ id: randomUUID(), role: "advisor", text: text!, at: now }); thread.status = "replied"; }
    else thread.status = body.status as SupportThread["status"];
    thread.updatedAt = now;
    await writeDocument(key, thread);
    const position = index.findIndex(item => item.id === id);
    if (position < 0) index.push(supportSummary(thread)); else index[position] = supportSummary(thread);
    await writeDocument(indexKey, index);
    return json({ thread });
  }));
}
