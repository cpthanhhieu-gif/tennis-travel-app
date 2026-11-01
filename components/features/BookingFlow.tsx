"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check, CalendarDays, Users, Clock3, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useBooking } from "@/lib/BookingContext";
import BookingStep1 from "./BookingStep1";
import BookingStep2 from "./BookingStep2";
import BookingStep3 from "./BookingStep3";
import BookingStep4 from "./BookingStep4";
import {coupleTotal,companionRate} from "@/lib/couple-pricing";
import { tours } from "@/lib/mock-data";



export default function BookingFlow() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { booking,step,setStep,clearDraft } = useBooking();
  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[step]);
  const isGroup = booking.packageId === "sbu2";
  const STEPS = isGroup ? ["Gói & quy mô đoàn", "Liên hệ đại diện", "Gửi yêu cầu"] : ["Chọn gói tour", "Đánh giá NTRP", "Thông tin", "Xác nhận"];
  const visibleStep = isGroup && step > 1 ? step - 1 : step;
  const previousStep = isGroup && step === 3 ? 1 : step - 1;
  const router = useRouter();
  const selectedTour = tours.find((tour) => tour.id === booking.tourId) ?? tours[0];
  const selectedSchedule = selectedTour.departureSchedules.find((schedule) => schedule.code === booking.departureCode)
    ?? selectedTour.departureSchedules[0];

  const handleBack = () => {
    if (step > 1) setStep(previousStep);
    else router.push(`/tours/${booking.packageId}`);
  };

  const handleNext = () => {
    if (step === 1 && isGroup) setStep(3);
    else if (step < 4) setStep(step + 1);
    else {clearDraft();setShowSuccess(true);}
  };

  const handleConfirmCancel = () => {
    setShowCancelDialog(false);
    setStep(previousStep);
  };

  const handleViewPreTour = () => {
    router.push("/pre-tour");
  };

  return (
    <div className={`ds-container ds-booking booking-unified ${step===1?"booking-compact":""}`}>

      <header className="ds-booking-title"><p className="ds-eyebrow">ĐẶT CHUYẾN ĐI</p><h1>{STEPS[visibleStep - 1]}</h1><p>{isGroup ? "Quy mô đoàn · Liên hệ đại diện · Yêu cầu báo giá" : "Chọn lịch · Đánh giá trình độ · Xem lại thông tin"}</p></header>
      {/* Step progress */}
      <div className="mb-[3.2rem]">
        {/* Top row: back + step count */}
        <div className="flex items-center justify-between mb-[1.6rem]">
          <button
            onClick={handleBack}
            className="flex items-center gap-[0.4rem] text-neutral-40 hover:text-brand-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-[0.8rem] p-[0.8rem] min-h-[44px] min-w-[44px]"
            aria-label="Quay lại bước trước"
          >
            <ChevronLeft size={20} aria-hidden="true" />
            <span className="text-[1.4rem] font-medium">Quay lại</span>
          </button>
          <p className="text-brand-primary font-bold text-[1.4rem]">
            Bước {visibleStep} / {STEPS.length}
          </p>
        </div>

        {/* Progress bar segments */}
        <div
          className="flex gap-[0.8rem]"
          role="progressbar"
          aria-valuenow={visibleStep}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-label={`Bước ${visibleStep} trên ${STEPS.length}`}
        >
          {STEPS.map((label, i) => {
            const num = i + 1;
            const state = num < visibleStep ? "done" : num === visibleStep ? "active" : "upcoming";
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-[0.4rem]">
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

      <div className="ds-booking-grid">
      {/* Step content */}
      <div className="mb-[3.2rem]">
        <div hidden={step !== 1}><BookingStep1 onNext={handleNext} /></div>
        {step === 2 && <BookingStep2 onNext={handleNext} />}
        {step === 3 && <BookingStep3 onNext={handleNext} />}
        {step === 4 && <BookingStep4 onConfirm={handleNext} />}
      </div>

      {step>1&&<aside className="booking-context-strip"><div><span className="ds-eyebrow">CHUYẾN ĐANG ĐẶT</span><strong>{selectedTour.name}</strong><p>{selectedSchedule.dateLabel} · {booking.numPeople} khách</p></div><div><span>Tổng dự kiến</span><strong>{coupleTotal(booking.packageId,selectedSchedule.price,booking.numPeople,booking.numCompanions).toLocaleString("vi-VN")} ₫</strong></div></aside>}</div>
      {/* Cancel confirm — Bottom Sheet on mobile */}
      <Modal
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        title="Bạn có chắc muốn quay lại?"
        bottomSheet
      >
        <p className="text-neutral-50 text-[1.4rem] mb-[2.4rem]">
          Thông tin đã nhập được giữ để bạn kiểm tra hoặc chỉnh sửa. Bạn muốn quay lại bước trước?
        </p>
        <div className="flex gap-[1.2rem]">
          <Button
            variant="outline-danger"
            onClick={handleConfirmCancel}
            className="flex-1"
          >
            Quay lại
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowCancelDialog(false)}
            className="flex-1"
          >
            Ở lại
          </Button>
        </div>
      </Modal>

      {/* Success modal */}
      <Modal
        isOpen={showSuccess}
        onClose={handleViewPreTour}
        title={booking.packageId === "sbu1" ? "Đã tiếp nhận đặt chỗ" : "Đã tiếp nhận yêu cầu"}
        bottomSheet
      >
        <div className="booking-received">
          <div className="booking-received-status"><span className="booking-received-icon"><Check size={24} aria-hidden="true"/></span><div><strong>Gửi thông tin thành công</strong><p>Cảm ơn {booking.name}. Yêu cầu của bạn đã được lưu.</p></div></div>
          <section className="booking-received-trip" aria-label="Thông tin chuyến đi"><span className="ds-eyebrow">CHUYẾN BẠN ĐÃ CHỌN</span><h3>{selectedTour.name}</h3><p><CalendarDays size={18} aria-hidden="true"/>{selectedSchedule.dateLabel} · {selectedTour.duration}</p><p><Users size={18} aria-hidden="true"/>{booking.numPeople-booking.numCompanions} người chơi · {booking.numCompanions} người đi cùng</p></section>
          <section className="booking-received-next" aria-label="Bước tiếp theo"><Clock3 size={20} aria-hidden="true"/><div><h3>{booking.packageId==="sbu3"?"Chờ phương án chuyến đi":booking.packageId==="sbu2"?"Chờ báo giá đoàn":"Kiểm tra đặt chỗ & khoản cọc"}</h3><p>{booking.packageId==="sbu3"?"Thời gian phản hồi dự kiến: tối đa 24 giờ. Xem phương án và dịch vụ cần xác nhận trước khi chấp thuận, đặt cọc.":booking.packageId==="sbu2"?"Thời gian phản hồi dự kiến: 1 ngày làm việc. Kiểm tra báo giá theo quy mô đoàn trước khi chấp thuận.":"Mở Hành trình để kiểm tra trạng thái đặt chỗ, khoản cọc 30% và hướng dẫn tiếp theo."}</p></div></section>
          <p className="booking-received-note">Tiếp nhận yêu cầu chưa đồng nghĩa chuyến đi đã được xác nhận hoặc thanh toán.</p>
          <Button variant="primary" onClick={handleViewPreTour} className="w-full" size="lg">Theo dõi trong Hành trình <ArrowRight size={18} aria-hidden="true"/></Button>
        </div>
      </Modal>
    </div>
  );
}
