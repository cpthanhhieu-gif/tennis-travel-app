export type SupportStatus = "new" | "processing" | "replied";
export type SupportMessage = { id: string; role: "customer" | "advisor"; text: string; at: string };
export type SupportThread = { id: string; status: SupportStatus; createdAt: string; updatedAt: string; contact: string; context: string; messages: SupportMessage[] };
export type SupportSummary = Pick<SupportThread, "id" | "status" | "createdAt" | "updatedAt" | "contact"> & { preview: string };
export function supportSummary(t: SupportThread): SupportSummary { return { id: t.id, status: t.status, createdAt: t.createdAt, updatedAt: t.updatedAt, contact: t.contact, preview: t.messages.filter(m => m.role === "customer").at(-1)?.text.slice(0, 140) ?? "" }; }
export function supportText(value: unknown, max: number): string | null { return typeof value === "string" && value.trim().length > 0 && value.trim().length <= max ? value.trim() : null; }
export function validSupportToken(value: unknown): value is string { return typeof value === "string" && /^[a-f0-9]{64}$/.test(value); }
