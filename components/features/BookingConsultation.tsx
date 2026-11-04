"use client";
import { useEffect, useState } from "react";
import { useBooking } from "@/lib/BookingContext";
import { readAceSession, saveAceSession, normalizeAcePreferences, type AceSession } from "@/lib/ace-session";
import { preferenceSummary } from "@/lib/ace-conversation";
import { consultationBookingPatch, consultationSignature } from "@/lib/ace-booking";
import { getNtrpLevel, ntrpQuiz, tours } from "@/lib/mock-data";
export default function BookingConsultation() {
  const { booking, updateBooking, updateNtrpQuizState, ntrpQuizState, restoredDraft } = useBooking();
  const [session, setSession] = useState<AceSession | null>(null);
  const [count, setCount] = useState(""); const [companions, setCompanions] = useState("");
  const [allowParty, setAllowParty] = useState(false); const [error, setError] = useState("");
  useEffect(() => { const load = () => { const next = readAceSession(); setSession(next); }; load(); window.addEventListener("ace:session", load); return () => window.removeEventListener("ace:session", load); }, []);
  useEffect(() => { setCount(session?.state.preferences.numPeople?.toString() ?? ""); setCompanions(session?.state.preferences.numCompanions?.toString() ?? ""); }, [session?.state.preferences.numPeople, session?.state.preferences.numCompanions]);
  useEffect(() => { if(session?.state.preferences.numPeople && booking.entrySource==="ace" && !restoredDraft) setAllowParty(true); }, [session?.id]);
  if (!session || !preferenceSummary(session.state.preferences)) return null;
  const p = session.state.preferences;
  const selected = session.selection ? tours.find(t => t.packageId === session.selection?.packageId) : undefined;
  const departure = selected?.departureSchedules.find(d => d.code === session.selection?.departureCode);
  const applied = booking.aceConsultation?.signature === consultationSignature(p);
  function apply() {
    setError("");
    try {
      if (allowParty && (!count || !Number.isInteger(Number(count)) || Number(count) < 1 || Number(count) > 20 || companions !== "" && (!Number.isInteger(Number(companions)) || Number(companions) < 0 || Number(companions) >= Number(count)))) throw Error("Kiểm tra số khách và số người đi cùng trước khi áp dụng.");
      const preferences = normalizeAcePreferences({ ...p, ...(allowParty ? { numPeople: Number(count), numCompanions: companions === "" ? booking.numCompanions : Number(companions) } : {}) });
      const patch = consultationBookingPatch(booking, preferences, allowParty);
      if (Object.keys(ntrpQuizState.answers).length && !ntrpQuizState.showResult) { delete patch.ntrpLevel; delete patch.ntrpLabel; }
      updateBooking(patch);
      if (patch.ntrpLevel && preferences.quizAnswers.length === ntrpQuiz.length) updateNtrpQuizState({ answers: Object.fromEntries(ntrpQuiz.map((q, i) => [q.id, preferences.quizAnswers[i]])), ntrpResult: getNtrpLevel(patch.ntrpLevel), showResult: true, originalPackageId: booking.packageId, packageDecision: null });
      const next = { ...session!, state: { ...session!.state, preferences } };
      saveAceSession(next);
    } catch (e) { setError(e instanceof Error ? e.message : "Chưa áp dụng được thông tin."); }
  }
  return <section className="rounded-[1.2rem] border border-brand-primary/20 bg-brand-tint p-[1.6rem] mb-[2rem] text-[1.3rem]" aria-label="Thông tin từ cuộc tư vấn"><h2 className="font-bold text-[1.6rem]">Thông tin từ cuộc tư vấn</h2><p className="whitespace-pre-line my-[1rem]">{preferenceSummary(p)}</p>{selected && <p>Đang quan tâm: {selected.name}{departure ? ` · ${departure.dateLabel}` : ""}</p>}
    {applied ? <p role="status" className="font-semibold mt-[1rem]">Đã áp dụng. Bạn vẫn có thể sửa thông tin ở các bước đặt chuyến.</p> : <><p className="mt-[1rem]">Kiểm tra trước khi áp dụng. Nhu cầu được bổ sung vào ghi chú; thông tin liên hệ, lịch đã chọn và các trường đã nhập được giữ nguyên.</p>
      <label className="flex items-center gap-[0.8rem] my-[1rem]"><input type="checkbox" checked={allowParty} disabled={!!booking.participants?.length||booking.groupRequestEdited} onChange={e => setAllowParty(e.target.checked)}/>Áp dụng số khách từ tư vấn {restoredDraft ? "(booking đang có bản nháp)" : ""}</label>
      {booking.participants?.length||booking.groupRequestEdited ? <p>Đã có danh sách hoặc quy mô đoàn bạn nhập; chỉnh số khách tại bước chọn gói.</p> : allowParty && <div className="flex flex-wrap gap-[1rem]"><label>Số khách chính xác<input aria-label="Số khách từ tư vấn" type="number" min={1} max={20} value={count} onChange={e => setCount(e.target.value)} className="block border rounded p-[0.8rem] bg-white"/></label><label>Người đi cùng không chơi<input aria-label="Người đi cùng từ tư vấn" type="number" min={0} max={19} value={companions} onChange={e => setCompanions(e.target.value)} placeholder={`Giữ ${booking.numCompanions} người`} className="block border rounded p-[0.8rem] bg-white"/></label></div>}
      {!p.numPeople && <p className="text-[1.2rem] my-[0.6rem]">Khoảng quy mô nhóm chưa được coi là số khách chính xác. Bạn có thể bổ sung ở đây hoặc giữ số khách đang chọn.</p>}
      <button type="button" onClick={apply} className="bg-brand-primary text-white font-semibold rounded-full px-[1.6rem] min-h-[4.4rem] mt-[1rem]">Xác nhận & áp dụng thông tin</button>
      <button type="button" onClick={() => window.dispatchEvent(new Event("ace:open"))} className="text-brand-primary font-semibold px-[1.2rem] min-h-[4.4rem]">Sửa nhu cầu cùng Ace</button></>}
    {error && <p role="alert" className="mt-[1rem]">{error}</p>}
  </section>;
}
