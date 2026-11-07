"use client";
import {requestErrorMessage} from "@/lib/request-error";

import { useEffect, useState as useLocalState } from "react";
import Button from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import { useBooking } from "@/lib/BookingContext";
import { ntrpQuiz, getNtrpLevel } from "@/lib/mock-data";
import BookingTripAddOnPicker from "./BookingTripAddOnPicker";

interface Props { onNext: () => void }

export default function BookingStep2({ onNext }: Props) {
  const { booking, updateBooking, ntrpQuizState, updateNtrpQuizState } = useBooking();
  const { answers, showResult, ntrpResult } = ntrpQuizState;
  const tripAddOns=<BookingTripAddOnPicker packageId={booking.packageId} guests={booking.numPeople} departureDate={booking.departureDate} selections={booking.serviceSelections??[]} onChange={serviceSelections=>updateBooking({serviceSelections})}/>;

  const [currentQ, setCurrentQ] = useLocalState(0); // index 0–4
  const advancing=false;

  const [saved,setSaved]=useLocalState<{level:number;label:string;assessedAt:string}|null>(null);
  const [saving,setSaving]=useLocalState(false),[saveError,setSaveError]=useLocalState("");
  const [assessingOther,setAssessingOther]=useLocalState(false);
  useEffect(()=>{fetch("/api/local").then(r=>r.ok?r.json():null).then(d=>setSaved(d?.ntrpProfile??null)).catch(()=>{});},[setSaved]);
  const applyResult=(result:ReturnType<typeof getNtrpLevel>)=>{updateNtrpQuizState({ntrpResult:result,showResult:true,packageDecision:null,originalPackageId:booking.packageId});updateBooking({ntrpLevel:result.level,ntrpLabel:result.label,ntrpDeferred:false});};
  const allAnswered = ntrpQuiz.every((q) => answers[q.id] !== undefined);

  const handleCalculate = async () => {
    if(saving||!allAnswered)return;
    if(assessingOther){applyResult(getNtrpLevel(Object.values(answers).reduce((sum,n)=>sum+n,0)/ntrpQuiz.length));return;}
    setSaving(true);setSaveError("");
    try{const r=await fetch("/api/local",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"ntrp",answers})});const d=await r.json();if(r.status===401||r.status===403){applyResult(getNtrpLevel(Object.values(answers).reduce((sum,n)=>sum+n,0)/ntrpQuiz.length));return;}if(!r.ok)throw Error(d.error);setSaved(d.ntrpProfile);applyResult(getNtrpLevel(d.ntrpProfile.level));}catch(e){setSaveError(requestErrorMessage(e));}finally{setSaving(false);}
  };

  if (showResult && ntrpResult) {
    return (
      <div className="ntrp-result">
        {tripAddOns}
        <header className="ntrp-result-heading"><span className="ds-eyebrow">HỒ SƠ TENNIS</span><h2>Kết quả trình độ tennis</h2><p>Kết quả tự đánh giá để HLV xác nhận trình độ và tư vấn nhóm chơi.</p></header>
        <section className="ntrp-score-panel" aria-label="Kết quả tự đánh giá">
          <div className="ntrp-score"><span>NTRP</span><strong>{ntrpResult.level.toFixed(1)}</strong></div>
          <div><h3>{ntrpResult.label}</h3><p>{ntrpResult.description}</p><small>Trình độ sẽ được xác nhận riêng theo chuyến.</small></div>
        </section>
        <label className="group-advice-choice ntrp-result-advice"><input type="checkbox" checked={booking.groupAdviceRequested===true} onChange={e=>updateBooking({groupAdviceRequested:e.target.checked})}/><span>Tôi muốn được tư vấn thêm về nhóm tập<small>Vietravel sẽ liên hệ theo thông tin bạn cung cấp ở bước tiếp theo.</small></span></label>
        <div className="booking-result-actions">
          <Button variant="primary" size="lg" onClick={onNext}>Tiếp tục — Nhập thông tin</Button>
          <Button variant="secondary" size="lg" onClick={()=>{setCurrentQ(0);updateNtrpQuizState({showResult:false,answers:{}});}}>Đánh giá lại</Button>
        </div>
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
      {tripAddOns}
      <h2 className="text-[2.2rem] font-bold text-neutral-90 mb-[0.4rem]">
        Đánh giá trình độ tennis
      </h2>
      <label className="group-advice-choice"><input type="checkbox" checked={assessingOther} onChange={e=>setAssessingOther(e.target.checked)}/>Đánh giá giúp cho người khác</label>
      {saved&&!assessingOther&&<section className="ds-quality mb-[2.4rem]"><h3 className="text-[2rem] font-bold">Trình độ đã lưu: {saved.level} — {saved.label}</h3><p>Đánh giá ngày {new Date(saved.assessedAt).toLocaleDateString("vi-VN")}.</p><Button onClick={()=>applyResult(getNtrpLevel(saved.level))}>Dùng kết quả đã lưu</Button><p>Hoặc trả lời lại 5 câu bên dưới để cập nhật.</p></section>}
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
        className={`bg-neutral-01 rounded-[var(--ds-radius-card)] border border-neutral-10 shadow-[rgba(0,0,0,0.08)_0px_2px_8px] p-[2rem] mb-[2.4rem] transition-opacity duration-200 ${
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
              className={`flex items-center gap-[1.2rem] p-[1.2rem] rounded-[var(--ds-radius-card)] cursor-pointer transition-all duration-150 min-h-[44px] ${
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
          className="flex items-center gap-[0.4rem] px-[1.4rem] py-[1rem] rounded-[var(--ds-radius-card)] border border-neutral-10 text-neutral-40 text-[1.4rem] hover:border-brand-light hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px]"
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
            className="flex-1 py-[1rem] rounded-[var(--ds-radius-card)] bg-neutral-03 border border-neutral-10 text-neutral-70 font-semibold text-[1.4rem] hover:border-brand-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px]"
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
              ? "Xem kết quả trình độ"
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
