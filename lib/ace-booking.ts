import type { BookingState } from "./BookingContext";
import type { AcePreferences } from "./ace-conversation";
import { preferenceSummary } from "./ace-conversation";
import { getNtrpLevel, ntrpQuiz, packageCapacity } from "./mock-data";
import { coupleTotal } from "./couple-pricing";
import { tours } from "./mock-data";
export function consultationSignature(p: AcePreferences) { return JSON.stringify(p); }
export function consultationBookingPatch(booking: BookingState, preferences: AcePreferences, allowParty: boolean): Partial<BookingState> {
  const p = preferences; const summary = preferenceSummary(p); const patch: Partial<BookingState> = {};
  const signature = consultationSignature(p);
  if (booking.aceConsultation?.signature === signature) return patch;
  const previousBlock = booking.aceConsultation?.summary ? `Thông tin từ Ace:\n${booking.aceConsultation.summary}` : "";
  const customerNotes = previousBlock && booking.notes.includes(previousBlock) ? booking.notes.replace(previousBlock, "").trim() : booking.notes.trim();
  const notes = summary && !customerNotes.includes(summary) ? [customerNotes, `Thông tin từ Ace:\n${summary}`].filter(Boolean).join("\n\n") : customerNotes;
  if (notes.length > 2000) throw Error("Ghi chú hiện tại và phần tư vấn vượt 2.000 ký tự. Bạn rút gọn ghi chú trước khi áp dụng nhé.");
  patch.notes = notes;
  patch.aceConsultation = { signature, summary };
  if (!booking.ntrpLevel && p.quizAnswers.length === ntrpQuiz.length && ntrpQuiz.every((q, i) => q.options.some(o => o.value === p.quizAnswers[i]))) {
    const result = getNtrpLevel(p.quizAnswers.reduce((a, b) => a + b, 0) / p.quizAnswers.length);
    patch.ntrpLevel = result.level; patch.ntrpLabel = result.label;
  }
  if (allowParty && p.numPeople !== undefined && !booking.participants?.length) {
    if (booking.packageId === "sbu2" && p.numPeople < 8) throw Error("Gói đoàn cần ít nhất 8 khách. Giữ số khách đang chọn hoặc quay lại chọn gói phù hợp.");
    const companions = p.numCompanions ?? booking.numCompanions;
    if (p.numPeople > packageCapacity(booking.packageId) || companions >= p.numPeople || companions < 0) throw Error("Số khách hoặc người đi cùng chưa phù hợp với gói đang chọn.");
    patch.numPeople = p.numPeople; patch.numCompanions = companions;
    const t = tours.find(t => t.id === booking.tourId); const d = t?.departureSchedules.find(d => d.code === booking.departureCode);
    if (d) patch.totalPrice = coupleTotal(booking.packageId, d.price, p.numPeople, companions);
  }
  if (booking.packageId === "sbu2" && !booking.groupRequest && p.budget) {
    const n = patch.numPeople ?? booking.numPeople;
    patch.groupRequest = { min: Math.max(8, n), max: Math.max(8, n), dates: [booking.departureDate, ""], budget: p.budget, format: "Đánh đôi", courts: 4, gala: true, companions: patch.numCompanions ?? booking.numCompanions };
  }
  if (booking.packageId === "sbu3" && !booking.premiumRequest && p.goal) patch.premiumRequest = { desiredDate: booking.departureDate, flexibility: "Đúng ngày", priority: p.goal === "relax" ? "Nghỉ dưỡng" : "Tennis", services: [] };
  return patch;
}
