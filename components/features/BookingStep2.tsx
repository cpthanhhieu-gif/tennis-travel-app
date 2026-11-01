"use client";
import {coupleTotal} from "@/lib/couple-pricing";
import {requestErrorMessage} from "@/lib/request-error";

import { useEffect, useState as useLocalState } from "react";
import Button from "@/components/ui/Button";
import { Target, CheckCircle2, ChevronLeft } from "lucide-react";
import { useBooking } from "@/lib/BookingContext";
import { packageCapacity, ntrpQuiz, getNtrpLevel, tourPackages, tours } from "@/lib/mock-data";

interface Props { onNext: () => void }

export default function BookingStep2({ onNext }: Props) {
  const { booking, updateBooking, ntrpQuizState, updateNtrpQuizState } = useBooking();
  const { answers, showResult, ntrpResult, originalPackageId, packageDecision } = ntrpQuizState;

  const [currentQ, setCurrentQ] = useLocalState(0); // index 0–4
  const advancing=false;

  const [saved,setSaved]=useLocalState<{level:number;label:string;assessedAt:string}|null>(null);
  const [saving,setSaving]=useLocalState(false),[saveError,setSaveError]=useLocalState("");
  const [switchTour,setSwitchTour]=useLocalState<string|null>(null),[switchCode,setSwitchCode]=useLocalState("");
  useEffect(()=>{fetch("/api/local").then(r=>r.ok?r.json():null).then(d=>setSaved(d?.ntrpProfile??null)).catch(()=>{});},[]);
  const applyResult=(result:ReturnType<typeof getNtrpLevel>)=>{updateNtrpQuizState({ntrpResult:result,showResult:true,packageDecision:null,originalPackageId:booking.packageId});updateBooking({ntrpLevel:result.level,ntrpLabel:result.label});};
  const allAnswered = ntrpQuiz.every((q) => answers[q.id] !== undefined);

  const handleCalculate = async () => {
    if(saving||!allAnswered)return;setSaving(true);setSaveError("");
    try{const r=await fetch("/api/local",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"ntrp",answers})});const d=await r.json();if(!r.ok)throw Error(d.error);setSaved(d.ntrpProfile);applyResult(getNtrpLevel(d.ntrpProfile.level));}catch(e){setSaveError(requestErrorMessage(e));}finally{setSaving(false);}
  };

  const handleKeepPackage = () => {
    updateNtrpQuizState({ packageDecision: false });
  };

  const handleSwitchPackage = (recommendedId: string, recommendedPkgData: typeof tourPackages[0]) => {
    const recommendedTour = tours.find((tour) => tour.packageId === recommendedId) ?? tours[0];
    setSwitchTour(recommendedTour.id);setSwitchCode("");
  };

  if (showResult && ntrpResult) {
    const recommendedPkg = tourPackages.find((p) => p.id === ntrpResult.recommendedSBU);
    const selectedPkg = tourPackages.find((p) => p.id === originalPackageId);
    const hasMismatch = originalPackageId !== "sbu3" && originalPackageId !== ntrpResult.recommendedSBU;
    const canProceed = !hasMismatch || packageDecision !== null;

    return (
      <div className="ntrp-result">
        <header className="ntrp-result-heading"><span className="ds-eyebrow">HỒ SƠ TENNIS</span><h2>Kết quả NTRP của bạn</h2><p>Kết quả tự đánh giá để tham khảo cách chọn trải nghiệm và ghép nhóm.</p></header>
        <section className="ntrp-score-panel" aria-label="Kết quả tự đánh giá">
          <div className="ntrp-score"><span>NTRP</span><strong>{ntrpResult.level.toFixed(1)}</strong></div>
          <div><h3>{ntrpResult.label}</h3><p>{ntrpResult.description}</p><small>Trình độ sẽ được xác nhận riêng theo chuyến.</small></div>
        </section>
        <p className="ntrp-profile-note">Kết quả dành cho người chơi đang khai hồ sơ. Người đi cùng không chơi tennis không cần đánh giá NTRP.</p>
        <section className="ntrp-recommendation"><h3>Tham gia {selectedPkg?.name}</h3><p>{originalPackageId==="sbu1"?"Bạn có thể tiếp tục đăng ký Leisure. HLV sẽ xác nhận trình độ và điều phối nhóm trong buổi đầu theo phương án chuyến đi.":"Kết quả này giúp điều phối xem xét nhóm phù hợp trong gói bạn chọn. Khả năng tham gia và nhóm tập cần xác nhận theo chuyến."}</p><p>Chưa có nhóm chơi được xác nhận cho lịch đang chọn.</p><label className="group-advice-choice"><input type="checkbox" checked={booking.groupAdviceRequested===true} onChange={e=>updateBooking({groupAdviceRequested:e.target.checked})}/><span>Nhờ tư vấn nhóm chơi phù hợp<small>Nhu cầu được gửi cùng yêu cầu đặt chuyến khi bạn hoàn tất bước xác nhận.</small></span></label></section>
        {recommendedPkg&&<section className="ntrp-recommendation" aria-labelledby="ntrp-recommendation-title">
          <div className="ntrp-section-label"><Target size={20} aria-hidden="true"/><span>Lựa chọn tham khảo khác</span></div>
          <h3 id="ntrp-recommendation-title">{recommendedPkg.name}</h3><p>{recommendedPkg.tagline}</p>
          {hasMismatch&&packageDecision===null&&<>
            <div className="ntrp-current-choice"><span>Gói bạn đang chọn</span><strong>{selectedPkg?.name}</strong></div>
            <p className="ntrp-decision-help">Bạn có thể giữ gói hiện tại hoặc xem lịch và giá của gói gợi ý trước khi quyết định đổi.</p>
            <div className="ntrp-decision-actions">
              <Button variant="primary" size="md" onClick={handleKeepPackage}>Giữ gói hiện tại</Button>
              <Button variant="secondary" size="md" aria-expanded={!!switchTour} onClick={()=>handleSwitchPackage(ntrpResult.recommendedSBU,recommendedPkg)}>Xem lịch &amp; giá gói gợi ý</Button>
            </div>
          </>}
        </section>}
        {switchTour&&packageDecision===null&&(()=>{const t=tours.find(t=>t.id===switchTour)!;const schedule=t.departureSchedules.find(d=>d.code===switchCode);return <section className="ntrp-switch-panel"><h3 className="text-[2rem] font-bold">Lịch và giá gói gợi ý</h3><label htmlFor="switch-schedule">Lịch khởi hành {t.name}</label><select id="switch-schedule" className="w-full border p-[1.2rem] text-[1.6rem]" value={switchCode} onChange={e=>setSwitchCode(e.target.value)}><option value="">Chọn ngày khởi hành</option>{t.departureSchedules.map(d=><option key={d.code} value={d.code}>{d.dateLabel} · {d.price.toLocaleString("vi-VN")}đ/người</option>)}</select>{schedule&&<p>Tổng mới: {(coupleTotal(t.packageId,schedule.price,booking.numPeople,booking.numCompanions)).toLocaleString("vi-VN")}đ / {booking.numPeople} người.</p>}{booking.numPeople>packageCapacity(t.packageId)&&<p role="alert">Gói này tối đa {packageCapacity(t.packageId)} khách. Quay lại bước chọn tour để điều chỉnh số người.</p>}<Button disabled={!schedule||booking.numPeople>packageCapacity(t.packageId)} onClick={()=>{if(!schedule||booking.numPeople>packageCapacity(t.packageId))return;updateBooking({tourId:t.id,packageId:t.packageId,destination:t.destinationId,departureDate:schedule.date,departureCode:schedule.code,totalPrice:coupleTotal(t.packageId,schedule.price,booking.numPeople,booking.numCompanions)});updateNtrpQuizState({packageDecision:true});setSwitchTour(null);onNext();}}>Áp dụng gói & lịch đã chọn</Button></section>;})()}
        {/* Decision confirmed feedback */}
        {hasMismatch && packageDecision !== null && (
          <div className="flex items-center gap-[1rem] bg-success-light border border-success/30 rounded-[0.8rem] p-[1.6rem] mb-[2.4rem]">
            <CheckCircle2 size={18} className="text-success shrink-0" aria-hidden="true" />
            <p className="text-[1.4rem] text-success font-medium text-left">
              {packageDecision
                ? `Đã đổi sang gói ${recommendedPkg?.name}`
                : `Giữ nguyên gói ${selectedPkg?.name}`}
            </p>
          </div>
        )}

        {canProceed && <Button variant="primary" size="lg" className="w-full" onClick={onNext}>Tiếp tục — Nhập thông tin</Button>}
      </div>
    );
  }

  const q = ntrpQuiz[currentQ];
  const isLast = currentQ === ntrpQuiz.length - 1;
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [q.id]: value };
    updateNtrpQuizState({ answers: newAnswers });


  };

  return (
    <div>
      <h2 className="text-[2.2rem] font-bold text-neutral-90 mb-[0.4rem]">
        Đánh giá NTRP của người chơi
      </h2>
      <p className="text-neutral-40 text-[1.4rem] mb-[2.4rem]">
        Người chơi đang khai hồ sơ thực hiện đánh giá; người đi cùng không cần NTRP. Trình độ những người chơi khác được xác nhận riêng theo chuyến.
      </p>

      {saved&&<section className="ds-quality mb-[2.4rem]"><h3 className="text-[2rem] font-bold">NTRP đã lưu: {saved.level} — {saved.label}</h3><p>Đánh giá ngày {new Date(saved.assessedAt).toLocaleDateString("vi-VN")}.</p><Button onClick={()=>applyResult(getNtrpLevel(saved.level))}>Dùng kết quả đã lưu</Button><p>Hoặc trả lời lại 5 câu bên dưới để cập nhật.</p></section>}
      {saveError&&<p role="alert">{saveError}</p>}
      {/* Progress dots */}
      <div className="flex items-center gap-[0.8rem] mb-[2.8rem]">
        {ntrpQuiz.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentQ(i)}
            aria-label={`Câu ${i + 1}`}
            aria-current={i===currentQ?"step":undefined}
            className={`booking-question-index ${i===currentQ?"is-current":""}`}
          >{i+1}</button>
        ))}
        <span className="ml-auto text-neutral-40 text-[1.3rem] font-medium">
          {currentQ + 1} / {ntrpQuiz.length}
        </span>
      </div>

      {/* Single question card */}
      <fieldset
        key={q.id}
        className={`bg-neutral-01 rounded-[0.8rem] border border-neutral-10 shadow-[rgba(0,0,0,0.08)_0px_2px_8px] p-[2rem] mb-[2.4rem] transition-opacity duration-200 ${
          advancing ? "opacity-40" : "opacity-100"
        }`}
      >
        <legend className="font-bold text-[1.6rem] text-neutral-90 mb-[1.6rem] w-full">
          <span className="text-brand-primary mr-[0.8rem]">{currentQ + 1}.</span>
          {q.question}
        </legend>
        <div className="space-y-[0.8rem]">
          {q.options.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-[1.2rem] p-[1.2rem] rounded-[0.8rem] cursor-pointer transition-all duration-150 min-h-[44px] ${
                answers[q.id] === opt.value
                  ? "bg-brand-tint border border-brand-primary"
                  : "hover:bg-neutral-03 border border-transparent"
              }`}
            >
              <input
                type="radio"
                name={`q${q.id}`}
                value={opt.value}
                checked={answers[q.id] === opt.value}
                onChange={() => handleAnswer(opt.value)}
                className="sr-only"
              />
              <div
                className={`w-[1.8rem] h-[1.8rem] rounded-full border-2 shrink-0 transition-colors ${
                  answers[q.id] === opt.value
                    ? "border-brand-primary bg-brand-primary"
                    : "border-neutral-30"
                }`}
                aria-hidden="true"
              />
              <span className="text-[1.4rem] text-neutral-90">{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Prev / Next nav */}
      <div className="booking-quiz-actions flex items-center gap-[1.2rem] mb-[2.4rem]">
        <button
          type="button"
          onClick={() => setCurrentQ((i) => Math.max(0, i - 1))}
          disabled={currentQ === 0}
          className="flex items-center gap-[0.4rem] px-[1.4rem] py-[1rem] rounded-[0.8rem] border border-neutral-10 text-neutral-40 text-[1.4rem] hover:border-brand-light hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          aria-label="Câu trước"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Trước
        </button>

        {!isLast ? (
          <button
            type="button"
            onClick={() => setCurrentQ((i) => Math.min(ntrpQuiz.length - 1, i + 1))}
            disabled={answers[q.id] === undefined}
            className="flex-1 py-[1rem] rounded-[0.8rem] bg-neutral-03 border border-neutral-10 text-neutral-70 font-semibold text-[1.4rem] hover:border-brand-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          >
            Câu tiếp theo
          </button>
        ) : (
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            onClick={handleCalculate}
            disabled={!allAnswered||saving}
          >
            {allAnswered
              ? "Xem kết quả NTRP"
              : `Còn ${ntrpQuiz.length - answeredCount} câu chưa trả lời`}
          </Button>
        )}
      </div>

      {/* Answered summary dots (bottom) */}
      <p className="text-center text-neutral-30 text-[1.2rem]">
        Đã trả lời {answeredCount} / {ntrpQuiz.length} câu
      </p>
    </div>
  );
}
