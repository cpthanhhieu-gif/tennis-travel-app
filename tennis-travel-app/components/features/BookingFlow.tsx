"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, PartyPopper } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useBooking } from "@/lib/BookingContext";
import BookingStep1 from "./BookingStep1";
import BookingStep2 from "./BookingStep2";
import BookingStep3 from "./BookingStep3";
import BookingStep4 from "./BookingStep4";

const STEPS = ["Chọn gói tour", "Đánh giá NTRP", "Thông tin", "Xác nhận"];

export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { booking, resetBooking } = useBooking();
  const router = useRouter();

  const handleBack = () => {
    if (step >= 3) {
      setShowCancelDialog(true);
    } else if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/");
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else setShowSuccess(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelDialog(false);
    setStep(step - 1);
  };

  const handleViewPreTour = () => {
    resetBooking();
    router.push("/pre-tour");
  };

  return (
    <div className="min-h-screen px-4 md:px-6 lg:px-8 py-8 max-w-2xl mx-auto">

      {/* Step progress */}
      <div className="mb-8">
        {/* Top row: back + step count */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-neutral-40 hover:text-brand-primary transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-md p-2 min-h-11 min-w-11"
            aria-label="Quay lại bước trước"
          >
            <ChevronLeft size={20} aria-hidden="true" />
            <span className="text-[1.4rem] font-medium">Quay lại</span>
          </button>
          <p className="text-brand-primary font-bold text-[1.4rem]">
            Bước {step} / {STEPS.length}
          </p>
        </div>

        {/* Progress bar segments */}
        <div
          className="flex gap-2"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={4}
          aria-label={`Bước ${step} trên 4`}
        >
          {STEPS.map((label, i) => {
            const num = i + 1;
            const state = num < step ? "done" : num === step ? "active" : "upcoming";
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full h-[0.6rem] rounded-full transition-all duration-300 ${
                    state === "done"
                      ? "bg-brand-primary"
                      : state === "active"
                      ? "bg-brand-light"
                      : "bg-neutral-10"
                  }`}
                />
                <span
                  className={`text-[1.1rem] font-medium hidden sm:block ${
                    state === "active"
                      ? "text-brand-primary"
                      : state === "done"
                      ? "text-neutral-50"
                      : "text-neutral-30"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="mb-8">
        {step === 1 && <BookingStep1 onNext={handleNext} />}
        {step === 2 && <BookingStep2 onNext={handleNext} />}
        {step === 3 && <BookingStep3 onNext={handleNext} />}
        {step === 4 && <BookingStep4 onConfirm={handleNext} />}
      </div>

      {/* Cancel confirm */}
      <Modal
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        title="Bạn có chắc muốn quay lại?"
        bottomSheet
      >
        <p className="text-neutral-50 text-[1.4rem] mb-6">
          Thông tin bạn đã nhập ở bước này có thể bị mất. Bạn có muốn tiếp tục không?
        </p>
        <div className="flex gap-3">
          <Button variant="outline-danger" onClick={handleConfirmCancel} className="flex-1">
            Quay lại
          </Button>
          <Button variant="primary" onClick={() => setShowCancelDialog(false)} className="flex-1">
            Ở lại
          </Button>
        </div>
      </Modal>

      {/* Success modal */}
      <Modal
        isOpen={showSuccess}
        onClose={handleViewPreTour}
        title="Đặt tour thành công!"
        bottomSheet
      >
        <div className="text-center py-4">
          <div className="flex justify-center mb-4">
            <PartyPopper size={48} className="text-brand-secondary" aria-hidden="true" />
          </div>
          <p className="text-neutral-50 text-[1.6rem] mb-2">
            Hành trình của{" "}
            <strong className="text-neutral-90">Nguyễn Minh Khoa</strong> bắt đầu!
          </p>
          <p className="text-neutral-40 text-[1.4rem] mb-6">
            Tour Đà Nẵng 3N2D · 13–15/06/2026
            <br />
            Chúng tôi sẽ liên hệ xác nhận trong vòng 24 giờ.
          </p>
          <Button variant="primary" onClick={handleViewPreTour} className="w-full" size="lg">
            Xem Pre-tour Dashboard
          </Button>
        </div>
      </Modal>
    </div>
  );
}
