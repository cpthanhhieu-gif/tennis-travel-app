import {parseGroupNeeds,applyGroupNeeds} from "./ace-group";
import { initialAceState, type AceState, type AcePreferences } from "./ace-conversation";
import { tours, tourPackages } from "./mock-data";
import { browserStorageKey } from "./demo-scope";
export type AceMessage = { id: string | number; role: "bot" | "user" | "advisor"; text: string; at?: string; chips?: string[]; packageIds?: string[]; preferences?: AcePreferences };
export type AceSelection = { packageId: string; departureCode: string };
export type AceSession = { version: 1; id: string; state: AceState; messages: AceMessage[]; selection?: AceSelection; humanMode: boolean; open: boolean };
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
export function normalizeAcePreferences(v: unknown): AcePreferences {
  const p: AcePreferences = { quizAnswers: [] }; if (!object(v)) return p;
  for (const k of ["party", "diet"] as const) if (typeof v[k] === "string" && v[k].trim()) p[k] = v[k].slice(0, 500);
  if (["learn", "compete", "relax"].includes(String(v.goal))) p.goal = v.goal as AcePreferences["goal"];
  if(v.budgetFlexible===true)p.budgetFlexible=true;
  if (typeof v.budget === "number" && Number.isFinite(v.budget) && v.budget > 0 && v.budget <= 1e10) p.budget = v.budget;
  if (typeof v.level === "number" && [1.5, 2.5, 3.5, 4.5, 5].includes(v.level)) p.level = v.level;
  if (typeof v.packageId === "string" && tourPackages.some(p => p.id === v.packageId)) p.packageId = v.packageId;
  if (typeof v.numPeople === "number" && Number.isInteger(v.numPeople) && v.numPeople >= 1 && v.numPeople <= 20) p.numPeople = v.numPeople;
  if (typeof v.numCompanions === "number" && Number.isInteger(v.numCompanions) && v.numCompanions >= 0 && v.numCompanions < (p.numPeople ?? 21)) p.numCompanions = v.numCompanions;
  if(typeof v.dietCount==="number"&&Number.isInteger(v.dietCount)&&v.dietCount>=1&&p.numPeople!==undefined&&v.dietCount<=p.numPeople&&p.diet&&p.diet!=="Không có yêu cầu đặc biệt")p.dietCount=v.dietCount;
  if (Array.isArray(v.quizAnswers)) p.quizAnswers = v.quizAnswers.filter((n): n is number => typeof n === "number" && Number.isFinite(n) && n >= 1 && n <= 5).slice(0, 5);
  const group=parseGroupNeeds(v.groupNeeds);
  if(!group)return p;const normalized=applyGroupNeeds(p,group);if(p.packageId)normalized.packageId=p.packageId;return normalized;
}
export function normalizeSelection(v: unknown): AceSelection | undefined {
  if (!object(v)) return; const t = tours.find(t => t.packageId === v.packageId);
  if (t?.departureSchedules.some(d => d.code === v.departureCode)) return { packageId: t.packageId, departureCode: v.departureCode as string };
}
export function parseAceSession(raw: string | null): AceSession | null {
  try {
    const v: unknown = JSON.parse(raw ?? "null"); if (!object(v) || v.version !== 1 || typeof v.id !== "string" || v.id.length > 80 || !object(v.state) || !Array.isArray(v.messages)) return null;
    const state = initialAceState(); state.preferences = normalizeAcePreferences(v.state.preferences);
    if (["idle", "party", "goal", "budget", "quiz", "diet", "group"].includes(String(v.state.step))) state.step = v.state.step as AceState["step"];
    if (state.step === "quiz" && state.preferences.quizAnswers.length >= 5) state.step = "idle";
    const pending=v.state.partyClarification;
    if(object(pending)&&["negative","conditional","conflict","uncertain"].includes(String(pending.reason))&&typeof pending.attempts==="number"&&Number.isInteger(pending.attempts)&&pending.attempts>=1&&pending.attempts<=2){
      state.partyClarification={reason:pending.reason as NonNullable<AceState["partyClarification"]>["reason"],attempts:pending.attempts};
      if(pending.reason==="uncertain"&&object(pending.candidate)&&pending.candidate.total===1&&pending.candidate.companions===0)state.partyClarification.candidate={total:1,companions:0};
    }
    const messages: AceMessage[] = [];
    for (const m of v.messages.slice(-150)) {
      if (!object(m) || !["bot", "user", "advisor"].includes(String(m.role)) || typeof m.text !== "string" || typeof m.id !== "string" && typeof m.id !== "number") continue;
      messages.push({ id: m.id, role: m.role as AceMessage["role"], text: m.text.slice(0, 6000), at: typeof m.at === "string" && Number.isFinite(Date.parse(m.at)) ? m.at : undefined, chips: Array.isArray(m.chips) ? m.chips.filter((s): s is string => typeof s === "string").slice(0, 10) : undefined, packageIds: Array.isArray(m.packageIds) ? m.packageIds.filter((id): id is string => tourPackages.some(p => p.id === id)) : undefined, preferences: object(m.preferences) ? normalizeAcePreferences(m.preferences) : undefined });
    }
    return { version: 1, id: v.id, state, messages, selection: normalizeSelection(v.selection), humanMode: v.humanMode === true, open: v.open === true };
  } catch { return null; }
}
export const aceSessionKey = () => browserStorageKey("ace-session-v1");
export function readAceSession(): AceSession | null { try { return parseAceSession(localStorage.getItem(aceSessionKey())); } catch { return null; } }
export function saveAceSession(value: AceSession, source = "external") { try { localStorage.setItem(aceSessionKey(), JSON.stringify({ ...value, messages: value.messages.slice(-150) })); window.dispatchEvent(new CustomEvent("ace:session", { detail: { source } })); return true; } catch { return false; } }
