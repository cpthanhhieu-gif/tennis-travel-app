"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, BusFront, CarFront, Check, Clock3, Plane, TrainFront, Users } from "lucide-react";
import Button from "@/components/ui/Button";

type Mode = "train" | "bus" | "rental" | "airport";
type Ride = { id: string; name: string; time: string; duration: string; detail: string; price: number; unit: "person" | "vehicle"; maxPassengers?: number };

const ridesByMode: Record<Mode, Ride[]> = {
  train: [
    { id: "train-0600", name: "Tàu tiêu chuẩn", time: "06:00", duration: "3 giờ 45 phút", detail: "Ghế mềm · Có điều hòa", price: 240000, unit: "person" },
    { id: "train-0930", name: "Tàu nhanh", time: "09:30", duration: "3 giờ 20 phút", detail: "Ghế mềm · Có điều hòa", price: 315000, unit: "person" },
    { id: "train-1400", name: "Tàu tiêu chuẩn", time: "14:00", duration: "3 giờ 45 phút", detail: "Ghế mềm · Có điều hòa", price: 240000, unit: "person" },
  ],
  bus: [
    { id: "bus-0730", name: "Xe giường nằm", time: "07:30", duration: "4 giờ 15 phút", detail: "Điều hòa · Hành lý xách tay", price: 185000, unit: "person" },
    { id: "bus-1230", name: "Limousine", time: "12:30", duration: "3 giờ 50 phút", detail: "Ghế ngả · Wifi", price: 265000, unit: "person" },
    { id: "bus-1900", name: "Xe giường nằm", time: "19:00", duration: "4 giờ 15 phút", detail: "Điều hòa · Hành lý xách tay", price: 185000, unit: "person" },
  ],
  rental: [
    { id: "rental-4", name: "Xe tự lái 4 chỗ", time: "08:00", duration: "Theo ngày", detail: "Tối đa 4 khách · Tự lái", price: 950000, unit: "vehicle", maxPassengers: 4 },
    { id: "rental-7", name: "Xe tự lái 7 chỗ", time: "08:00", duration: "Theo ngày", detail: "Tối đa 7 khách · Tự lái", price: 1250000, unit: "vehicle", maxPassengers: 7 },
    { id: "rental-16", name: "Xe tự lái 16 chỗ", time: "08:00", duration: "Theo ngày", detail: "Tối đa 16 khách · Tự lái", price: 2100000, unit: "vehicle", maxPassengers: 16 },
  ],
  airport: [
    { id: "airport-4", name: "Xe đưa đón 4 chỗ", time: "08:00", duration: "Một chiều", detail: "Tối đa 3 khách · 2 kiện hành lý", price: 350000, unit: "vehicle", maxPassengers: 3 },
    { id: "airport-7", name: "Xe đưa đón 7 chỗ", time: "08:00", duration: "Một chiều", detail: "Tối đa 6 khách · 4 kiện hành lý", price: 480000, unit: "vehicle", maxPassengers: 6 },
    { id: "airport-16", name: "Xe đưa đón 16 chỗ", time: "08:00", duration: "Một chiều", detail: "Tối đa 12 khách · 10 kiện hành lý", price: 950000, unit: "vehicle", maxPassengers: 12 },
  ],
};
const modeInfo: Record<Mode, { label: string; Icon: typeof TrainFront }> = {
  train: { label: "Tàu hỏa", Icon: TrainFront },
  bus: { label: "Xe buýt", Icon: BusFront },
  rental: { label: "Thuê xe", Icon: CarFront },
  airport: { label: "Xe sân bay", Icon: Plane },
};
const validModes: Mode[] = ["train", "bus", "rental", "airport"];
const money = (amount: number) => `${amount.toLocaleString("vi-VN")} đ`;

export default function TransportResults({ initialSearch }: { initialSearch: Record<string, string | undefined> }) {
  const mode = validModes.includes(initialSearch.mode as Mode) ? initialSearch.mode as Mode : "train";
  const { label, Icon } = modeInfo[mode];
  const rides = ridesByMode[mode];
  const [selectedId, setSelectedId] = useState(rides[0].id);
  const [passengers, setPassengers] = useState(1);
  const [date, setDate] = useState(initialSearch.date ?? "");
  const [message, setMessage] = useState("");
  const selected = rides.find(ride => ride.id === selectedId) ?? rides[0];
  const maxPassengers = selected.maxPassengers ?? 16;
  const total = selected.unit === "person" ? selected.price * passengers : selected.price;
  function confirmSelection() {
    const draft = { version: 1, mode, from: initialSearch.from ?? "", to: initialSearch.to ?? "", date, rideId: selected.id, time: selected.time, passengers, unitPrice: selected.price, total };
    try { sessionStorage.setItem("travel-ace-transport-draft-v1", JSON.stringify(draft)); } catch { /* Browser storage may be disabled in private mode. */ }
    setMessage("Đã lưu lựa chọn trong phiên demo. Chưa tạo đơn, giữ chỗ hay thanh toán.");
  }

  return <div className="ds-container transport-page transport-results-page">
    <Link className="transport-back-link" href="/transport"><ArrowLeft size={17}/> Sửa tìm kiếm</Link>
    <header className="transport-results-heading"><div className="transport-results-title"><span className="transport-results-icon"><Icon size={21}/></span><div><span className="ui-kicker">{label.toUpperCase()}</span><h1>{initialSearch.from || "Điểm đi"}<ArrowRight size={19}/>{initialSearch.to || "Điểm đến"}</h1></div></div><p>{date || "Chưa chọn ngày"} · Giá demo cho một lượt</p></header>
    <div className="transport-results-layout">
      <section className="transport-ride-list" aria-labelledby="transport-ride-list-title">
        <div className="transport-results-section-heading"><div><span className="ui-kicker">CHỌN PHƯƠNG ÁN</span><h2 id="transport-ride-list-title">{rides.length} chuyến / xe phù hợp</h2></div><span className="app-service-count">Dữ liệu demo</span></div>
        {rides.map(ride => <button type="button" key={ride.id} className={`transport-ride-card${selectedId === ride.id ? " is-selected" : ""}`} aria-pressed={selectedId === ride.id} onClick={() => { setSelectedId(ride.id); setPassengers(value => Math.min(value, ride.maxPassengers ?? 16)); setMessage(""); }}>
          <span className="transport-ride-radio" aria-hidden="true">{selectedId === ride.id && <Check size={14}/>}</span>
          <span className="transport-ride-main"><strong>{ride.time}</strong><span className="transport-ride-line"/><span className="transport-ride-duration"><Clock3 size={14}/>{ride.duration}</span></span>
          <span className="transport-ride-copy"><strong>{ride.name}</strong><small>{ride.detail}</small><small>{initialSearch.from || "Điểm đi"} → {initialSearch.to || "Điểm đến"}</small></span>
          <span className="transport-ride-price"><strong>{money(ride.price)}</strong><small>{ride.unit === "person" ? "/ khách" : "/ xe"}</small></span>
        </button>)}
      </section>
      <aside className="transport-selection-card" aria-label="Thông tin lựa chọn">
        <span className="ui-kicker">TÙY CHỌN CHUYẾN ĐI</span><h2>Số khách</h2>
        <label className="transport-result-date"><span>Ngày khởi hành</span><input type="date" required min={new Date().toISOString().slice(0, 10)} value={date} onChange={event => setDate(event.target.value)}/></label>
        <p className="transport-passenger-note"><Users size={17}/> Khách đi cùng chuyến</p>
        <div className="transport-passenger-stepper"><button type="button" aria-label="Giảm số khách" disabled={passengers <= 1} onClick={() => setPassengers(value => Math.max(1, value - 1))}>−</button><strong aria-live="polite">{passengers}</strong><button type="button" aria-label="Tăng số khách" disabled={passengers >= maxPassengers} onClick={() => setPassengers(value => Math.min(maxPassengers, value + 1))}>+</button></div>
        <div className="transport-selection-summary"><span>{selected.name}</span><strong>{money(selected.price)} <small>{selected.unit === "person" ? "× khách" : "/ xe"}</small></strong>{selected.unit === "person" && <span>{passengers} khách</span>}<span className="transport-selection-date">Ngày {date || "chưa chọn"} · {selected.time}</span></div>
        <div className="transport-total"><span>Tổng tạm tính</span><strong>{money(total)}</strong></div>
        <Button className="transport-confirm-button" onClick={confirmSelection}>Chọn chuyến này</Button>
        {message && <p className="transport-demo-notice" role="status">{message}</p>}
        <p className="transport-price-disclaimer">Giá minh họa để xem luồng. Chưa xác nhận với nhà cung cấp và không phải giá đặt bán.</p>
      </aside>
    </div>
  </div>;
}
