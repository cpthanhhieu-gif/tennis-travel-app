"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BusFront, CarFront, Check, Clock3, Plane, TrainFront, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import { TRANSPORT_ACTIVITY, TRANSPORT_DRAFT_KEY } from "@/lib/transport-order";
import { transportRidesByMode, type TransportMode } from "@/lib/transport-catalog";

type Mode = TransportMode;
const modeInfo: Record<Mode, { label: string; Icon: typeof TrainFront }> = {
  train: { label: "Tàu hỏa", Icon: TrainFront },
  bus: { label: "Xe buýt", Icon: BusFront },
  rental: { label: "Thuê xe", Icon: CarFront },
  airport: { label: "Xe sân bay", Icon: Plane },
};
const validModes: Mode[] = ["train", "bus", "rental", "airport"];
const money = (amount: number) => `${amount.toLocaleString("vi-VN")} đ`;

export default function TransportResults({ initialSearch }: { initialSearch: Record<string, string | undefined> }) {
  const router = useRouter();
  const mode = validModes.includes(initialSearch.mode as Mode) ? initialSearch.mode as Mode : "train";
  const { label, Icon } = modeInfo[mode];
  const rides = transportRidesByMode[mode];
  const [selectedId, setSelectedId] = useState(rides[0].id);
  const [passengers, setPassengers] = useState(1);
  const [date, setDate] = useState(initialSearch.date ?? "");
  const selected = rides.find(ride => ride.id === selectedId) ?? rides[0];
  const maxPassengers = selected.maxPassengers ?? 16;
  const total = selected.unit === "person" ? selected.price * passengers : selected.price;

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(TRANSPORT_DRAFT_KEY) ?? "null") as Partial<{ mode: Mode; from: string; to: string; date: string; rideId: string; passengers: number }> | null;
      if (saved?.mode === mode && saved.from === initialSearch.from && saved.to === initialSearch.to && saved.date === initialSearch.date && rides.some(ride => ride.id === saved.rideId)) {
        setSelectedId(saved.rideId!);
        const ride = rides.find(item => item.id === saved.rideId)!;
        setPassengers(Math.max(1, Math.min(ride.maxPassengers ?? 16, Number(saved.passengers) || 1)));
        if (saved.date) setDate(saved.date);
      }
    } catch { /* Use default results if browser storage is unavailable. */ }
  }, [initialSearch, mode, rides]);
  function confirmSelection() {
    const draft = { version: 1, mode, from: initialSearch.from ?? "", to: initialSearch.to ?? "", date, rideId: selected.id, rideName: selected.name, time: selected.time, passengers, unitPrice: selected.price, unit: selected.unit, total, activityId: undefined as string | undefined, activityCount: 0 };
    try {
      const saved = JSON.parse(sessionStorage.getItem(TRANSPORT_DRAFT_KEY) ?? "null") as Partial<typeof draft> | null;
      if (saved?.mode === mode && saved.from === draft.from && saved.to === draft.to && saved.date === date) {
        draft.activityCount = Math.max(0, Math.min(passengers, Number(saved.activityCount) || 0));
        if (draft.activityCount) draft.activityId = typeof saved.activityId === "string" ? saved.activityId : TRANSPORT_ACTIVITY.id;
      }
      sessionStorage.setItem(TRANSPORT_DRAFT_KEY, JSON.stringify(draft));
    } catch { /* Browser storage may be disabled in private mode. */ }
    router.push("/transport/review");
  }

  return <div className="ds-container transport-page transport-results-page">
    <Link className="transport-back-link" href="/transport"><ArrowLeft size={17}/> Sửa tìm kiếm</Link>
    <header className="transport-results-heading"><div className="transport-results-title"><span className="transport-results-icon"><Icon size={21}/></span><div><span className="ui-kicker">{label.toUpperCase()}</span><h1>{initialSearch.from || "Điểm đi"}<ArrowRight size={19}/>{initialSearch.to || "Điểm đến"}</h1></div></div><p>{date || "Chưa chọn ngày"} · Giá demo cho một lượt</p></header>
    <div className="transport-results-layout">
      <section className="transport-ride-list" aria-labelledby="transport-ride-list-title">
        <div className="transport-results-section-heading"><div><span className="ui-kicker">CHỌN PHƯƠNG ÁN</span><h2 id="transport-ride-list-title">{rides.length} chuyến / xe phù hợp</h2></div><span className="transport-count-badge">Dữ liệu demo</span></div>
        {rides.map(ride => <button type="button" key={ride.id} className={`transport-ride-card${selectedId === ride.id ? " is-selected" : ""}`} aria-pressed={selectedId === ride.id} onClick={() => { setSelectedId(ride.id); setPassengers(value => Math.min(value, ride.maxPassengers ?? 16)); }}>
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
        <p className="transport-price-disclaimer">Giá minh họa để xem luồng. Chưa xác nhận với nhà cung cấp và không phải giá đặt bán.</p>
      </aside>
    </div>
  </div>;
}
