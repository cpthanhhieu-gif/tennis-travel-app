import { createHash } from "node:crypto";
import { AceAIError, answerWithAI, parseChatRequest } from "@/lib/ace-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;
const hits = new Map<string, { count: number; expires: number }>();
const headers = { "Cache-Control": "no-store" };
export async function POST(req: Request) {
  if (req.headers.get("origin") !== new URL(req.url).origin) return Response.json({ error: "Yêu cầu không hợp lệ." }, { status: 403, headers });
  try {
    if (Number(req.headers.get("content-length") ?? 0) > 65536) return Response.json({ error: "Nội dung quá dài." }, { status: 413, headers });
    // Bound the actual streamed body as well; content-length is optional/untrusted.
    const reader = req.body?.getReader();
    if (!reader) throw new AceAIError("INVALID_INPUT", 400, "Thiếu nội dung câu hỏi.");
    const chunks: Uint8Array[] = []; let length = 0;
    while (true) { const part = await reader.read(); if (part.done) break; length += part.value.byteLength; if (length > 65536) { await reader.cancel(); throw new AceAIError("INVALID_INPUT", 413, "Nội dung quá dài."); } chunks.push(part.value); }
    let body: unknown;
    try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new AceAIError("INVALID_INPUT", 400, "Nội dung câu hỏi không hợp lệ."); }
    const input = parseChatRequest(body);
    const now = Date.now();
    for (const [key, value] of hits) if (value.expires <= now) hits.delete(key);
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const id = createHash("sha256").update(ip).digest("hex");
    const bucket = hits.get(id) ?? { count: 0, expires: now + 60000 };
    if (bucket.count >= 15 || (!hits.has(id) && hits.size >= 5000)) return Response.json({ error: "Bạn gửi hơi nhanh. Hãy thử lại sau một phút.", code: "RATE_LIMITED" }, { status: 429, headers: { ...headers, "Retry-After": "60" } });
    bucket.count++; hits.set(id, bucket);
    return Response.json(await answerWithAI(input), { headers });
  } catch (error) {
    if (error instanceof AceAIError) return Response.json({ code: error.code, error: error.message }, { status: error.status, headers });
    return Response.json({ code: "AI_UNAVAILABLE", error: "Ace tạm thời chưa trả lời được. Bạn thử lại nhé." }, { status: 503, headers });
  }
}
