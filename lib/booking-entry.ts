import type { ScenarioId } from "./demo-scope";
export type BookingSource = "ace" | "explore" | "scenario" | "direct";
export function bookingSource(fromAce: boolean, exploring: boolean, scenario?: ScenarioId): BookingSource { return fromAce ? "ace" : exploring ? "explore" : scenario ? "scenario" : "direct"; }
export function initialParty(source: BookingSource, packageId: string, scenario?: ScenarioId) {
  if (source === "scenario") return packageId === "sbu2" ? { numPeople: 16, numCompanions: 0 } : { numPeople: scenario === "couple" ? 2 : 1, numCompanions: scenario === "couple" ? 1 : 0 };
  return { numPeople: packageId === "sbu2" ? 8 : 1, numCompanions: 0 };
}
export function bookingSourceLabel(source?: string, scenario?: string) {
  const names: Record<string,string> = { personal: "Cá nhân", couple: "Cặp đôi", club: "CLB", returning: "Sau tour" };
  return source === "ace" ? "Tư vấn Ace" : source === "explore" ? "Khám phá tự do" : source === "direct" ? "Đặt trực tiếp" : source === "scenario" ? `Kịch bản ${names[scenario ?? ""] ?? "mẫu"}` : "Dữ liệu mẫu / booking trước đây";
}
