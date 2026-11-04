import type { AceMessage } from "./ace-session";
import type { SupportThread } from "./support-inbox";
export function mergeAdvisorMessages(messages: AceMessage[], thread: SupportThread): AceMessage[] {
  const next = [...messages]; const ids = new Set(next.map(m => String(m.id)));
  for (const m of thread.messages) {
    const id = m.clientMessageId ?? `support:${m.id}`;
    if (ids.has(id)) continue;
    next.push({ id, role: m.role === "advisor" ? "advisor" : "user", text: m.text, at: m.at }); ids.add(id);
  }
  return next.sort((a, b) => (a.at ?? "").localeCompare(b.at ?? ""));
}
