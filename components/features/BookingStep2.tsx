"use client";

import { useState as useLocalState } from "react";
import Button from "@/components/ui/Button";
import { Target, AlertTriangle, CheckCircle2, ChevronLeft } from "lucide-react";
import { useBooking } from "@/lib/BookingContext";
import { ntrpQuiz, getNtrpLevel, tourPackages } from "@/lib/mock-data";

interface Props { onNext: () => void }

export default function BookingStep2({ onNext }: Props) {
  const { booking, updateBooking, ntrpQuizState, updateNtrpQuizState } = useBooking();
  const { answers, showResult, ntrpResult, originalPackageId, packageDecision } = ntrpQuizState;

  const [currentQ, setCurrentQ] = useLocalState(0); // index 0–4
  const [advancing, setAdvancing] = useLocalState(false);

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
    const selectedPkg = tourPackages.find((p) => p.id === originalPackageId);
    const hasMismatch = originalPackageId !== ntrpResult.recommendedSBU;
    const canProceed = !hasMismatch || packageDecision !== null;

    return (
      <div className="text-center">
        <h2 className="text-[2.2rem] font-bold text-neutral-90 mb-[2.4rem]">
          Kết quả đánh giá NTRP
        </h2>

        {/* Result card */}
        <div className="bg-brand-tint-light rounded-[0.8rem] border border-brand-tint p-[3.2rem] mb-[2.4rem] shadow-[rgba(0,0,0,0.08)_0px_2px_8px]">
          <p className="text-[5.6rem] font-extrabold text-brand-primary mb-[0.8rem]">
            {ntrpResult.level}
          </p>
          <p className="text-[2.2rem] font-bold text-neutral-90 mb-[0.8rem]">
            NTRP — {ntrpResult.label}
          </p>
          <p className="text-neutral-50 text-[1.4rem] mb-[2.4rem]">{ntrpResult.description}</p>

          {/* Recommended package */}
          <div className="bg-neutral-01 border border-neutral-10 rounded-[0.8rem] p-[1.6rem]">
            <p className="text-brand-primary text-[1.4rem] font-bold mb-[0.4rem] flex items-center gap-[0.6rem] justify-center">
              <Target size={14} aria-hidden="true" /> Gói AI đề xuất cho bạn
            </p>
            <p className="text-neutral-90 font-bold text-[1.6rem]">{recommendedPkg?.name}</p>
            <p className="text-neutral-40 text-[1.4rem]">{recommendedPkg?.tagline}</p>
          </div>
        </div>

        {/* Mismatch banner */}
        {hasMismatch && packageDecision === null && (
          <div className="bg-warning-light border border-warning/40 rounded-[0.8rem] p-[2rem] mb-[2.4rem] text-left">
            <div className="flex items-start gap-[1.2rem] mb-[1.6rem]">
              <AlertTriangle size={20} className="text-warning shrink-0 mt-[0.2rem]" aria-hidden="true" />
              <div>
                <p className="font-bold text-[1.5rem] text-neutral-90 mb-[0.4rem]">
                  Gói bạn chọn chưa phù hợp trình độ
                </p>
                <p className="text-neutral-50 text-[1.3rem]">
                  Bạn đã chọn <strong className="text-neutral-90">{selectedPkg?.name}</strong>, nhưng với NTRP {ntrpResult.level} ({ntrpResult.label}), AI đề xuất{" "}
                  <strong className="text-brand-primary">{recommendedPkg?.name}</strong>.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-[1rem]">
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
          <div className="flex items-center gap-[1rem] bg-success-light border border-success/30 rounded-[0.8rem] p-[1.6rem] mb-[2.4rem]">
            <CheckCircle2 size={18} className="text-success shrink-0" aria-hidden="true" />
            <p className="text-[1.4rem] text-success font-medium text-left">
              {packageDecision
                ? `Đã đổi sang gói ${recommendedPkg?.name}`
                : `Giữ nguyên gói ${selectedPkg?.name}`}
            </p>
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={onNext}
          disabled={!canProceed}
        >
          Tiếp tục — Nhập thông tin
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
    }
  };

  return (
    <div>
      <h2 className="text-[2.2rem] font-bold text-neutral-90 mb-[0.4rem]">
        Đánh giá NTRP của bạn
      </h2>
      <p className="text-neutral-40 text-[1.4rem] mb-[2.4rem]">
        AI gợi ý gói tour phù hợp nhất với trình độ của bạn
      </p>

      {/* Progress dots */}
      <div className="flex items-center gap-[0.8rem] mb-[2.8rem]">
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
      <div className="flex items-center gap-[1.2rem] mb-[2.4rem]">
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
            disabled={!allAnswered}
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
