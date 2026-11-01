"use client";

import { useEffect, useState, useRef } from "react";
import PremiumRequestFields from "./PremiumRequestFields";
import {validPremiumRequest} from "@/lib/premium-request";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useBooking } from "@/lib/BookingContext";

interface Props { onNext: () => void }

export default function BookingStep3({ onNext }: Props) {
  const { booking, updateBooking } = useBooking();
  const [name, setName] = useState(booking.name || "");
  const [phone, setPhone] = useState(booking.phone || "");
  const [email, setEmail] = useState(booking.email || "");
  const [notes, setNotes] = useState(booking.notes || "");
  const [submitted, setSubmitted] = useState(false);

  const edited=useRef({name:false,phone:false,email:false});
  const currentContact=useRef({name,phone,email});
  currentContact.current={name,phone,email};
  const [autoFilled,setAutoFilled]=useState(false);
  const [savedContact,setSavedContact]=useState<{name:string;phone:string;email:string}|null>(null);
  useEffect(()=>{let active=true;
    fetch("/api/local",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(d=>{
      if(!active)return;
      const profile=d?.profile;
      setSavedContact(profile??null);
      if(!profile)return;
      const patch:Partial<{name:string;phone:string;email:string}>={};
      for(const key of ["name","phone","email"] as const){
        if(!edited.current[key]&&!currentContact.current[key].trim()&&typeof profile[key]==="string"&&profile[key].trim())patch[key]=profile[key];
      }
      if(patch.name!==undefined)setName(patch.name);
      if(patch.phone!==undefined)setPhone(patch.phone);
      if(patch.email!==undefined)setEmail(patch.email);
      if(Object.keys(patch).length){updateBooking(patch);setAutoFilled(true);}
    }).catch(()=>{});
    return()=>{active=false;};
  },[updateBooking]);
  const cleanPhone = phone.replace(/[\s().-]/g, "");
  const errors = {
    name: name.trim() && name.trim().length <= 100 ? "" : "Nhập họ và tên từ 1 đến 100 ký tự.",
    phone: /^(?:0\d{9,10}|\+[1-9]\d{7,14})$/.test(cleanPhone)
      ? "" : "Nhập số điện thoại hợp lệ (ví dụ 0901234567 hoặc +84901234567).",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? "" : "Vui lòng nhập email đúng định dạng.",
  };

  const handleNext = () => {
    setSubmitted(true);
    const invalidField = (["name", "phone", "email"] as const).find(key => errors[key]);
    if (invalidField) {
      document.getElementById(invalidField)?.focus();
      return;
    }
    if(booking.packageId==="sbu3") {const request=booking.premiumRequest??{desiredDate:booking.departureDate,flexibility:"Đúng ngày",priority:"Nghỉ dưỡng",services:[]};if(!validPremiumRequest(request)){requestAnimationFrame(()=>document.getElementById("premium-date-error")?.focus());return;}updateBooking({premiumRequest:request});}
    updateBooking({ name: name.trim(), phone: cleanPhone, email: email.trim(), notes });
    onNext();
  };

  return (
    <form className="booking-contact" noValidate onSubmit={(event) => { event.preventDefault(); handleNext(); }}>
      <h2 className="text-[2.2rem] font-bold text-neutral-90 mb-[0.8rem]">
        {booking.packageId === "sbu2" ? "Liên hệ đại diện đoàn" : "Thông tin cá nhân"}
      </h2>
      <p className="text-neutral-40 text-[1.4rem] mb-[2.4rem]">
        {booking.packageId === "sbu2" ? "Cung cấp liên hệ đại diện để nhận báo giá; hồ sơ từng thành viên được bổ sung sau." : "Thông tin để chúng tôi liên hệ xác nhận tour của bạn"}
      </p>

      {autoFilled&&<p role="status">Đã tự điền thông tin từ hồ sơ. Bạn kiểm tra lại và bổ sung các mục còn thiếu trước khi tiếp tục.</p>}
      {savedContact&&<button type="button" className="ds-link mb-[1.6rem]" onClick={()=>{setName(savedContact.name);setPhone(savedContact.phone);setEmail(savedContact.email);updateBooking({name:savedContact.name,phone:savedContact.phone,email:savedContact.email});}}>Dùng liên hệ đã lưu trong hồ sơ</button>}
      <div className="booking-contact-fields">
        <Input
          label="Họ và tên"
          id="name"
          error={submitted ? errors.name : undefined}
          value={name}
          onChange={(e) => {edited.current.name=true;setName(e.target.value);updateBooking({name:e.target.value});}}
          placeholder="Nguyễn Minh Khoa"
          required
          autoComplete="name"
        />
        <Input
          label="Số điện thoại"
          id="phone"
          error={submitted ? errors.phone : undefined}
          type="tel"
          value={phone}
          onChange={(e) => {edited.current.phone=true;setPhone(e.target.value);updateBooking({phone:e.target.value});}}
          placeholder="0901 234 567"
          required
          autoComplete="tel"
        />
        <Input
          label="Email"
          id="email"
          error={submitted ? errors.email : undefined}
          type="email"
          value={email}
          onChange={(e) => {edited.current.email=true;setEmail(e.target.value);updateBooking({email:e.target.value});}}
          placeholder="email@example.com"
          required
          autoComplete="email"
        />

        {/* Textarea — custom to match Input style */}
        <div className="w-full">
          <label
            htmlFor="notes"
            className="block text-[1.2rem] mb-[0.4rem] text-neutral-30 font-medium"
          >
            Ghi chú đặc biệt (tùy chọn)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Yêu cầu ăn chay, dị ứng thực phẩm, phòng loại đặc biệt..."
            className="w-full px-[1.6rem] py-[1.2rem] rounded-[0.8rem] bg-neutral-03 text-[1.6rem] text-neutral-90 placeholder-neutral-30 focus:outline-none focus:ring-2 focus:ring-brand-light resize-none border-0"
          />
        </div>
      </div>

      {booking.packageId==="sbu3"&&<><PremiumRequestFields/>{submitted&&booking.premiumRequest&&!validPremiumRequest(booking.premiumRequest)&&<p id="premium-date-error" tabIndex={-1} role="alert">Kiểm tra ngày mong muốn và lựa chọn Premium.</p>}</>}
      <div className="booking-step-action"><p>Kiểm tra thông tin và giá trước khi gửi.</p><Button
        variant="primary"
        size="lg"
        className="w-full"
        type="submit"
      >
        Tiếp tục — Xem lại thông tin
      </Button></div>
    </form>
  );
}
