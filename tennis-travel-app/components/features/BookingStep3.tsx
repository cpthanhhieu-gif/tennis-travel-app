"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useBooking } from "@/lib/BookingContext";

interface Props { onNext: () => void }

export default function BookingStep3({ onNext }: Props) {
  const { booking, updateBooking } = useBooking();
  const [name,  setName]  = useState(booking.name  || "Nguyễn Minh Khoa");
  const [phone, setPhone] = useState(booking.phone || "0901 234 567");
  const [email, setEmail] = useState(booking.email || "minhkhoa@gmail.com");
  const [notes, setNotes] = useState(booking.notes || "");

  const isValid = name.trim() && phone.trim() && email.trim();

  const handleNext = () => {
    updateBooking({ name, phone, email, notes });
    onNext();
  };

  return (
    <div>
      <h2 className="text-[2.2rem] font-bold text-neutral-90 mb-2">
        Thông tin cá nhân
      </h2>
      <p className="text-neutral-40 text-[1.4rem] mb-6">
        Để Vietravel liên hệ xác nhận hành trình của bạn
      </p>

      <div className="space-y-5 mb-8">
        <Input
          label="Họ và tên"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nguyễn Minh Khoa"
          required
          autoComplete="name"
        />
        <Input
          label="Số điện thoại"
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0901 234 567"
          required
          autoComplete="tel"
        />
        <Input
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
          autoComplete="email"
        />

        {/* Textarea */}
        <div className="w-full">
          <label
            htmlFor="notes"
            className="block text-[1.2rem] mb-1 text-neutral-30 font-medium"
          >
            Ghi chú đặc biệt (tùy chọn)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Yêu cầu ăn chay, dị ứng thực phẩm, phòng loại đặc biệt..."
            className="w-full px-4 py-3 rounded-md bg-neutral-03 text-[1.6rem] text-neutral-90 placeholder-neutral-30 focus:outline-none focus:ring-2 focus:ring-brand-light resize-none border-0"
          />
        </div>
      </div>

      <Button variant="primary" size="lg" className="w-full" onClick={handleNext} disabled={!isValid}>
        Tiếp theo — Xem tóm tắt hành trình
      </Button>
    </div>
  );
}
