"use client";
import BookingDeposit from "./BookingDeposit";
import {coupleTotal,companionRate} from "@/lib/couple-pricing";
import {requestErrorMessage} from "@/lib/request-error";

import { useEffect, useRef, useState } from "react";
import { BookingLogin } from "./BookingAccess";
import Button from "@/components/ui/Button";
import { useBooking } from "@/lib/BookingContext";
import { tourPackages, tours, formatVND } from "@/lib/mock-data";
// destinations import removed — Step4 now reads from tours[]
import { Check } from "lucide-react";

interface Props { onConfirm: () => void }

export default function BookingStep4({ onConfirm }: Props) {
  const { booking,updateBooking,setStep } = useBooking();
  const [registrationId,setRegistrationId]=useState("");
  const [needsLogin,setNeedsLogin]=useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const key = useRef(booking.submissionKey??"");

  useEffect(()=>{if(!booking.submissionKey)return;let active=true;fetch("/api/local",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(d=>{const existing=d?.orders?.find((o:{key:string;id:string})=>o.key===booking.submissionKey);if(active&&existing)setRegistrationId(existing.id);}).catch(()=>{});return()=>{active=false;};},[booking.submissionKey]);
  const pkg  = tourPackages.find((p) => p.id === booking.packageId) ?? tourPackages[0];
  const tour = tours.find((t) => t.id === booking.tourId) ?? tours[0];
  const selectedSchedule = tour.departureSchedules.find((s) => s.code === booking.departureCode)
    ?? tour.departureSchedules[0];
  const pricePerPerson = selectedSchedule.price;
  const total = coupleTotal(booking.packageId,pricePerPerson,booking.numPeople,booking.numCompanions);

  const rows = [
    ...(booking.groupRequest?[{label:"Ngân sách dự kiến / khách",value:formatVND(booking.groupRequest.budget)},{label:"Nhu cầu đoàn",value:`${booking.groupRequest.min}–${booking.groupRequest.max} khách · ${booking.groupRequest.dates.join(" / ")} · ${booking.groupRequest.format} · ${booking.groupRequest.courts} buổi sân · ${booking.groupRequest.gala?"Có gala":"Không gala"}`}]:[]),
    ...(booking.packageId==="sbu3"&&booking.premiumRequest?[{label:"Mong muốn Premium",value:`${booking.premiumRequest.desiredDate} · ${booking.premiumRequest.flexibility} · ${booking.premiumRequest.priority}`},{label:"Dịch vụ cần báo giá",value:booking.premiumRequest.services.join(", ")||"Không yêu cầu"}]:[]),
    { label: "Tour", value: tour.name },
    { label: "Gói", value: pkg.name },
    { label: "Mã chuyến", value: booking.departureCode || tour.tourCode },
    { label: "Điểm đến", value: tour.destinationName },
    { label: "Ngày khởi hành", value: `${selectedSchedule.dayOfWeek}, ${selectedSchedule.dateLabel}` },
    { label: "Số người", value: booking.packageId==="sbu2"&&booking.groupRequest?`${booking.groupRequest.min}–${booking.groupRequest.max} khách dự kiến · ${booking.groupRequest.companions} người đi cùng dự kiến`:`${booking.numPeople-booking.numCompanions} người chơi + ${booking.numCompanions} người đi cùng` },
    ...(booking.groupAdviceRequested ? [{label:"Nhóm chơi",value:"Có nhu cầu tư vấn nhóm phù hợp"}] : []),
    ...(booking.packageId === "sbu2" ? [] : [{ label: "NTRP", value: booking.ntrpLabel ? `${booking.ntrpLevel} — ${booking.ntrpLabel}` : "Bổ sung sau; HLV xác nhận trước khi phân nhóm" }]),
    ...(booking.packageId==="sbu2"?[{label:"Danh sách thành viên",value:"Bổ sung sau khi thống nhất phương án; chưa cần khai đủ khi gửi yêu cầu báo giá."}]:[]),
    ...(booking.packageId!=="sbu2"&&booking.participants?.length?[{label:"Người tham gia",value:booking.participants.map((p,i)=>`${i+1}. ${p.name} (${p.role==="player"?"Chơi tennis":"Đi cùng"})${p.roomPreference?` · Phòng: ${p.roomPreference}`:""}`).join("; ")}]:[]),
    { label: "Người đăng ký / liên hệ", value: booking.name || "Chưa nhập" },
    { label: "Điện thoại", value: booking.phone || "Chưa nhập" },
    { label: "Email", value: booking.email || "Chưa nhập" },
    ...(booking.notes ? [{ label: "Nhu cầu & ghi chú", value: booking.notes }] : []),
  ];

  const handleConfirm = async () => {
    if(loading)return;
    setLoading(true);setError("");
    try {
      const auth=await fetch("/api/local",{cache:"no-store"});const account=auth.ok?await auth.json():null;
      if(!account?.account){setNeedsLogin(true);return;}
      if(!key.current){key.current=crypto.randomUUID();updateBooking({submissionKey:key.current});}
      const r=await fetch("/api/local",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"book",booking,key:key.current})});
      const data=await r.json();if(r.status===401){setNeedsLogin(true);setError("");return;}if(!r.ok)throw Error(data.error);setRegistrationId(data.order.id);
    } catch(e){setError(requestErrorMessage(e));}finally{setLoading(false);}
  };

  if(registrationId)return <BookingDeposit id={registrationId} onComplete={onConfirm}/>;
  return (
    <div className="booking-review">
      <h2 className="text-[2.2rem] font-bold text-neutral-90 mb-[2.4rem]">
        {pkg.id === "sbu2" ? "Xem lại yêu cầu đoàn" : pkg.id === "sbu3" ? "Xem lại yêu cầu chuyến đi" : "Tiếp tục đặt cọc"}
      </h2>

      {booking.referralToken&&<section className="ds-quality"><p>Đơn này có nguồn giới thiệu từ thẻ chia sẻ. Mã không phải ưu đãi giảm giá.</p><button className="ds-link" onClick={()=>updateBooking({referralToken:""})}>Bỏ mã giới thiệu</button></section>}
      <div className="booking-review-summary">
        {[{title:"Chuyến đi & người tham gia",step:1,items:rows.slice(0,-3)},{title:"Thông tin liên hệ",step:3,items:rows.slice(-3)}].map(group=><section className="booking-review-group" key={group.title}><header><h3>{group.title}</h3><button type="button" className="ui-text-button" onClick={()=>setStep(group.step)}>Chỉnh sửa</button></header><dl>{group.items.map(({label,value})=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>)}
        {/* Total */}
        {pkg.id==="sbu2"?<section className="ds-quality"><h3>Chờ báo giá theo nhu cầu đoàn</h3><p>Chi phí phụ thuộc quy mô được chốt, lịch và các dịch vụ yêu cầu. Chưa cần đặt cọc khi gửi yêu cầu.</p></section>:<div className="border-t border-neutral-10 mt-[1.6rem] pt-[1.6rem]">
          <div className="booking-price-total">
            <span className="text-neutral-50 font-semibold text-[1.6rem]">{pkg.id==="sbu3"?"Chi phí gói cơ bản tham khảo":"Tổng giá gói đã chọn"}</span>
            <span className="booking-price-amount">
              {formatVND(total)}
            </span>
          </div>
          <div className="booking-price-breakdown" aria-label="Chi tiết giá gói">
            {booking.numPeople>booking.numCompanions&&<p><span>{booking.numPeople-booking.numCompanions} người chơi × {formatVND(pricePerPerson)}</span><strong>{formatVND(pricePerPerson*(booking.numPeople-booking.numCompanions))}</strong></p>}
            {booking.numCompanions>0&&<p><span>{booking.numCompanions} người đi cùng × {formatVND(companionRate(booking.packageId))}</span><strong>{formatVND(companionRate(booking.packageId)*booking.numCompanions)}</strong></p>}
          </div>
          {pkg.id==="sbu3"&&<p>Chưa gồm dịch vụ bổ sung, phụ thu phòng; giá cuối cùng theo phương án được xác nhận. Chưa cần thanh toán khi gửi yêu cầu.</p>}
        </div>}
      </div>

      {/* Guarantees */}
      <div className="bg-success-light border border-success/30 rounded-[var(--ds-radius-card)] p-[1.6rem] mb-[2.4rem]">
        <ul className="space-y-[0.8rem]">
          {[
            pkg.id === "sbu2" ? "Báo giá trong 1 ngày làm việc" : pkg.id === "sbu3" ? "Xác nhận trong 24 giờ" : "Xác nhận sau khi đặt cọc",
            pkg.id!=="sbu1"?"Khoản cọc và điều kiện thay đổi/hủy được thông báo trong báo giá hoặc phương án trước khi bạn chấp thuận.":"Hủy trước D-30: hoàn 100% trừ 500.000đ; D-30 đến D-15: mất cọc 30%; D-14 đến D-7: mất 70%; dưới D-7: mất 100%.",
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

      {needsLogin&&<><p role="status">Đăng nhập để gửi yêu cầu. Gói, số khách và nhu cầu đã nhập vẫn được giữ.</p><BookingLogin onSuccess={()=>{setNeedsLogin(false);setError("");}}/></>}
      {error && <p role="alert" className="mb-[1.6rem]">{error}</p>}
      <div className="booking-step-action"><p>{pkg.id==="sbu2"?"Nhận báo giá trong 1 ngày làm việc.":pkg.id==="sbu3"?"Nhận phương án trong tối đa 24 giờ.":"Tiếp tục thanh toán cọc 30% để hoàn tất đăng ký."}</p><Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleConfirm}
        loading={loading}
        disabled={needsLogin}
      >
        {loading ? "Đang xử lý..." : pkg.id === "sbu2" ? "Gửi yêu cầu báo giá" : pkg.id === "sbu3" ? "Gửi yêu cầu phương án" : "Tiếp tục đặt cọc"}
      </Button></div>
    </div>
  );
}
