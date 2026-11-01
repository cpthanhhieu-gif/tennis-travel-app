"use client";
import {coupleTotal,companionRate} from "@/lib/couple-pricing";
import {requestErrorMessage} from "@/lib/request-error";

import { useRef, useState } from "react";
import { BookingLogin } from "./BookingAccess";
import Button from "@/components/ui/Button";
import { useBooking } from "@/lib/BookingContext";
import { tourPackages, tours, formatVND, formatVNDShort } from "@/lib/mock-data";
// destinations import removed — Step4 now reads from tours[]
import { Check } from "lucide-react";

interface Props { onConfirm: () => void }

export default function BookingStep4({ onConfirm }: Props) {
  const { booking,updateBooking,setStep } = useBooking();
  const [needsLogin,setNeedsLogin]=useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const key = useRef(booking.submissionKey??"");

  const pkg  = tourPackages.find((p) => p.id === booking.packageId) ?? tourPackages[0];
  const tour = tours.find((t) => t.id === booking.tourId) ?? tours[0];
  const selectedSchedule = tour.departureSchedules.find((s) => s.code === booking.departureCode)
    ?? tour.departureSchedules[0];
  const pricePerPerson = selectedSchedule.price;
  const total = coupleTotal(booking.packageId,pricePerPerson,booking.numPeople,booking.numCompanions);

  const rows = [
    ...(booking.groupRequest?[{label:"Nhu cầu đoàn",value:`${booking.groupRequest.min}–${booking.groupRequest.max} khách · ${booking.groupRequest.dates.join(" / ")} · ${booking.groupRequest.format} · ${booking.groupRequest.courts} buổi sân · ${booking.groupRequest.gala?"Có gala":"Không gala"}`}]:[]),
    ...(booking.packageId==="sbu3"&&booking.premiumRequest?[{label:"Mong muốn Premium",value:`${booking.premiumRequest.desiredDate} · ${booking.premiumRequest.flexibility} · ${booking.premiumRequest.priority}`},{label:"Dịch vụ cần báo giá",value:booking.premiumRequest.services.join(", ")||"Không yêu cầu"}]:[]),
    { label: "Tour", value: tour.name },
    { label: "Gói", value: pkg.name },
    { label: "Mã chuyến", value: booking.departureCode || tour.tourCode },
    { label: "Điểm đến", value: tour.destinationName },
    { label: "Ngày khởi hành", value: `${selectedSchedule.dayOfWeek}, ${selectedSchedule.dateLabel}` },
    { label: "Số người", value: `${booking.numPeople-booking.numCompanions} người chơi + ${booking.numCompanions} người đi cùng` },
    ...(booking.groupAdviceRequested ? [{label:"Nhóm chơi",value:"Có nhu cầu tư vấn nhóm phù hợp"}] : []),
    ...(booking.packageId === "sbu2" ? [] : [{ label: "NTRP", value: booking.ntrpLabel ? `${booking.ntrpLevel} — ${booking.ntrpLabel}` : "Chưa đánh giá" }]),
    { label: "Liên hệ", value: booking.name || "Chưa nhập" },
    { label: "Điện thoại", value: booking.phone || "Chưa nhập" },
    { label: "Email", value: booking.email || "Chưa nhập" },
  ];

  const handleConfirm = async () => {
    if(loading)return;
    setLoading(true);setError("");
    try {
      if(!key.current){key.current=crypto.randomUUID();updateBooking({submissionKey:key.current});}
      const r=await fetch("/api/local",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"book",booking,key:key.current})});
      const data=await r.json();if(r.status===401){setNeedsLogin(true);setError("");return;}if(!r.ok)throw Error(data.error);onConfirm();
    } catch(e){setError(requestErrorMessage(e));}finally{setLoading(false);}
  };

  return (
    <div className="booking-review">
      <h2 className="text-[2.2rem] font-bold text-neutral-90 mb-[2.4rem]">
        {pkg.id === "sbu2" ? "Xem lại yêu cầu đoàn" : pkg.id === "sbu3" ? "Xem lại yêu cầu chuyến đi" : "Xác nhận đặt tour"}
      </h2>

      {booking.referralToken&&<section className="ds-quality"><p>Đơn này có nguồn giới thiệu từ thẻ chia sẻ. Mã không phải ưu đãi giảm giá.</p><button className="ds-link" onClick={()=>updateBooking({referralToken:""})}>Bỏ mã giới thiệu</button></section>}
      <div className="booking-review-summary">
        {[{title:"Chuyến đi & người tham gia",step:1,items:rows.slice(0,booking.packageId==="sbu2"?6:7)},{title:"Thông tin liên hệ",step:3,items:rows.slice(booking.packageId==="sbu2"?6:7)}].map(group=><section className="booking-review-group" key={group.title}><header><h3>{group.title}</h3><button type="button" className="ui-text-button" onClick={()=>setStep(group.step)}>Chỉnh sửa</button></header><dl>{group.items.map(({label,value})=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>)}
        {/* Total */}
        <div className="border-t border-neutral-10 mt-[1.6rem] pt-[1.6rem]">
          <div className="flex justify-between items-baseline">
            <span className="text-neutral-50 font-semibold text-[1.6rem]">Tổng dự kiến</span>
            <span className="text-[2.6rem] font-extrabold text-brand-secondary">
              {formatVNDShort(total)}
            </span>
          </div>
          <p className="text-neutral-30 text-[1.2rem] mt-[0.4rem] text-right">
            {formatVND(pricePerPerson)} × {booking.numPeople-booking.numCompanions} người chơi + {formatVND(companionRate(booking.packageId))} × {booking.numCompanions} người đi cùng
          </p>
        </div>
      </div>

      {/* Guarantees */}
      <div className="bg-success-light border border-success/30 rounded-[0.8rem] p-[1.6rem] mb-[2.4rem]">
        <ul className="space-y-[0.8rem]">
          {[
            pkg.id === "sbu2" ? "Báo giá trong 1 ngày làm việc" : pkg.id === "sbu3" ? "Xác nhận trong 24 giờ" : "Xác nhận sau khi đặt cọc",
            "Hủy trước D-30: hoàn 100% trừ 500.000đ; D-30 đến D-15: mất cọc 30%; D-14 đến D-7: mất 70%; dưới D-7: mất 100%.",
            "Hỗ trợ 24/7 trong suốt hành trình",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-[0.8rem] text-[1.4rem] text-success"
            >
              <Check size={14} className="shrink-0 text-success" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {needsLogin&&<><p role="status">Phiên đăng nhập đã hết hạn. Thông tin đặt gói của bạn vẫn được giữ.</p><BookingLogin onSuccess={()=>{setNeedsLogin(false);setError("");}}/></>}
      {error && <p role="alert" className="mb-[1.6rem]">{error}</p>}
      <div className="booking-step-action"><p>{pkg.id==="sbu2"?"Nhận báo giá trong 1 ngày làm việc.":pkg.id==="sbu3"?"Nhận phương án trong tối đa 24 giờ.":"Xem trạng thái và đặt cọc tại Hành trình sau khi gửi."}</p><Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleConfirm}
        loading={loading}
        disabled={needsLogin}
      >
        {loading ? "Đang xử lý..." : pkg.id === "sbu2" ? "Gửi yêu cầu báo giá" : pkg.id === "sbu3" ? "Gửi yêu cầu xác nhận" : "Xác nhận đặt tour"}
      </Button></div>
    </div>
  );
}
