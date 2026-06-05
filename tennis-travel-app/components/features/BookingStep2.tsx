"use client";

import { useState as useLocalState, useRef } from "react";
import Button from "@/components/ui/Button";
import { Target, AlertTriangle, CheckCircle2, ChevronLeft } from "lucide-react";
import { useBooking } from "@/lib/BookingContext";
import { ntrpQuiz, getNtrpLevel, tourPackages } from "@/lib/mock-data";

interface Props { onNext: () => void }

export default function BookingStep2({ onNext }: Props) {
  const { booking, updateBooking, ntrpQuizState, updateNtrpQuizState } = useBooking();
  const { answers, showResult, ntrpResult, originalPackageId, packageDecision } = ntrpQuizState;

  const [currentQ, setCurrentQ] = useLocalState(0);
  const [advancing, setAdvancing] = useLocalState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  const allAnswered = ntrpQuiz.every((q) => answers[q.id] !== undefined);

  const handleCalculate = () => {
    const values = Object.values(answers);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const result = getNtrpLevel(avg);
    updateNtrpQuizState({
      ntrpResult: result,
      showResult: true,
      packageDecision: null,
      originalPackageId: booking.packageId,
    });
    updateBooking({ ntrpLevel: result.level, ntrpLabel: result.label });
  };

  const handleKeepPackage = () => {
    updateNtrpQuizState({ packageDecision: false });
  };

  const handleSwitchPackage = (recommendedId: string, recommendedPkgData: typeof tourPackages[0]) => {
    updateBooking({
      packageId: recommendedId,
      totalPrice: recommendedPkgData.priceRange.min * booking.numPeople,
    });
    updateNtrpQuizState({ packageDecision: true });
  };

  if (showResult && ntrpResult) {
    const recommendedPkg = tourPackages.find((p) => p.id === ntrpResult.recommendedSBU);
    const selectedPkg    = tourPackages.find((p) => p.id === originalPackageId);
    const hasMismatch    = originalPackageId !== ntrpResult.recommendedSBU;
    const canProceed     = !hasMismatch || packageDecision !== null;

    return (
      <div className="text-center">
        <h2 className="text-[2.2rem] font-bold text-neutral-90 mb-6">
          Kết quả đánh giá NTRP
        </h2>

        {/* Result card */}
        <div className="bg-brand-tint-light rounded-md border border-brand-tint p-8 mb-6 shadow-card">
          <p className="text-[5.6rem] font-extrabold text-brand-primary mb-2">
            {ntrpResult.level}
          </p>
          <p className="text-[2.2rem] font-bold text-neutral-90 mb-2">
            NTRP — {ntrpResult.label}
          </p>
          <p className="text-neutral-50 text-[1.4rem] mb-6">{ntrpResult.description}</p>

          <div className="bg-neutral-01 border border-neutral-10 rounded-md p-4">
            <p className="text-brand-primary text-[1.4rem] font-bold mb-1 flex items-center gap-1.5 justify-center">
              <Target size={14} aria-hidden="true" /> Hành trình Vietravel đề xuất cho bạn
            </p>
            <p className="text-neutral-90 font-bold text-[1.6rem]">{recommendedPkg?.name}</p>
            <p className="text-neutral-40 text-[1.4rem]">{recommendedPkg?.tagline}</p>
          </div>
        </div>

        {/* Mismatch banner */}
        {hasMismatch && packageDecision === null && (
          <div className="bg-warning-light border border-warning/40 rounded-md p-5 mb-6 text-left">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={20} className="text-warning shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold text-[1.5rem] text-neutral-90 mb-1">
                  Gói dịch vụ bạn chọn chưa phù hợp trình độ
                </p>
                <p className="text-neutral-50 text-[1.3rem]">
                  Với NTRP {ntrpResult.level} ({ntrpResult.label}), Vietravel đề xuất đổi sang gói{" "}
                  <strong className="text-brand-primary">{recommendedPkg?.name}</strong> — tour và điểm đến giữ nguyên.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => recommendedPkg && handleSwitchPackage(ntrpResult.recommendedSBU, recommendedPkg)}
              >
                Đổi sang {recommendedPkg?.name}
              </Button>
              <Button
                variant="ghost"
                size="md"
                className="w-full"
                onClick={handleKeepPackage}
              >
                Giữ nguyên {selectedPkg?.name}
              </Button>
            </div>
          </div>
        )}

        {/* Decision confirmed feedback */}
        {hasMismatch && packageDecision !== null && (
          <div className="flex items-center gap-2.5 bg-success-light border border-success/30 rounded-md p-4 mb-6">
            <CheckCircle2 size={18} className="text-success shrink-0" aria-hidden="true" />
            <p className="text-[1.4rem] text-success font-medium text-left">
              {packageDecision
                ? `Đã đổi sang gói ${recommendedPkg?.name}`
                : `Giữ nguyên gói ${selectedPkg?.name}`}
            </p>
          </div>
        )}

        <Button variant="primary" size="lg" className="w-full" onClick={onNext} disabled={!canProceed}>
          Tiếp theo — Điền thông tin
        </Button>
      </div>
    );
  }

  const q = ntrpQuiz[currentQ];
  const isLast = currentQ === ntrpQuiz.length - 1;
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [q.id]: value };
    updateNtrpQuizState({ answers: newAnswers });

    if (!isLast) {
      setAdvancing(true);
      setTimeout(() => {
        setCurrentQ((i) => i + 1);
        setAdvancing(false);
      }, 350);
    } else {
      setTimeout(() => {
        ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 400);
    }
  };

  return (
    <div>
      <h2 className="text-[2.2rem] font-bold text-neutral-90 mb-1">
        Khám phá trình độ của bạn
      </h2>
      <p className="text-neutral-40 text-[1.4rem] mb-6">
        Xác nhận gói dịch vụ phù hợp với trình độ của bạn
      </p>

      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-7">
        {ntrpQuiz.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentQ(i)}
            aria-label={`Câu ${i + 1}`}
            className={`h-[0.6rem] rounded-full transition-all duration-300 ${
              i === currentQ
                ? "w-[2.4rem] bg-brand-primary"
                : answers[ntrpQuiz[i].id] !== undefined
                ? "w-[0.8rem] bg-brand-light"
                : "w-[0.8rem] bg-neutral-10"
            }`}
          />
        ))}
        <span className="ml-auto text-neutral-40 text-[1.3rem] font-medium">
          {currentQ + 1} / {ntrpQuiz.length}
        </span>
      </div>

      {/* Single question card */}
      <fieldset
        key={q.id}
        className={`bg-neutral-01 rounded-md border border-neutral-10 shadow-card p-5 mb-6 transition-opacity duration-200 ${
          advancing ? "opacity-40" : "opacity-100"
        }`}
      >
        <legend className="font-bold text-[1.6rem] text-neutral-90 mb-4 w-full">
          <span className="text-brand-primary mr-2">{currentQ + 1}.</span>
          {q.question}
        </legend>
        <div className="space-y-2">
          {q.options.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all duration-150 min-h-11 ${
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
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setCurrentQ((i) => Math.max(0, i - 1))}
          disabled={currentQ === 0}
          className="flex items-center gap-1 px-3.5 py-2.5 rounded-md border border-neutral-10 text-neutral-40 text-[1.4rem] hover:border-brand-light hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 min-h-11"
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
            className="flex-1 py-2.5 rounded-md bg-neutral-03 border border-neutral-10 text-neutral-50 font-semibold text-[1.4rem] hover:border-brand-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 min-h-11"
          >
            Câu tiếp theo
          </button>
        ) : (
          <div ref={ctaRef} className="flex-1">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleCalculate}
              disabled={!allAnswered}
            >
              {allAnswered
                ? "Xem kết quả trình độ"
                : `Còn ${ntrpQuiz.length - answeredCount} câu chưa trả lời`}
            </Button>
          </div>
        )}
      </div>

      <p className="text-center text-neutral-30 text-[1.2rem]">
        Đã trả lời {answeredCount} / {ntrpQuiz.length} câu
      </p>
    </div>
  );
}
