"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3 } from "lucide-react";
import Button from "@/components/ui/Button";
import { TRANSPORT_DRAFT_KEY } from "@/lib/transport-order";
import { transportRidesByMode, type TransportMode } from "@/lib/transport-catalog";

type Mode = TransportMode;
const modeInfo: Record<Mode, { label: string }> = {
  train: { label: "Tàu hỏa" },
  bus: { label: "Xe buýt" },
  rental: { label: "Thuê xe" },
  airport: { label: "Xe sân bay" },
  private_car: { label: "Xe riêng ngoài lịch đoàn" },
};
const validModes: Mode[] = ["train", "bus", "rental", "airport", "private_car"];
const money = (amount: number) => `${amount.toLocaleString("vi-VN")} đ`;
const timeRanges = [
  { id: "morning", label: "00:00–08:59", start: 0, end: 8 },
  { id: "late-morning", label: "09:00–11:59", start: 9, end: 11 },
  { id: "afternoon", label: "12:00–16:59", start: 12, end: 16 },
  { id: "evening", label: "17:00 trở đi", start: 17, end: 23 },
];

function localDateString(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

function shiftDate(value: string, amount: number) {
  const shifted = new Date(`${value}T12:00:00`);
  shifted.setDate(shifted.getDate() + amount);
  return localDateString(shifted);
}

export default function TransportResults({ initialSearch }: { initialSearch: Record<string, string | undefined> }) {
  const router = useRouter();
  const mode = validModes.includes(initialSearch.mode as Mode) ? initialSearch.mode as Mode : "train";
  const { label } = modeInfo[mode];
  const rides = transportRidesByMode[mode];
  const requestedRide = rides.find(ride => ride.id === initialSearch.rideId);
  const requestedPassengers = Math.max(1, Math.trunc(Number(initialSearch.passengers) || 1));
  const defaultRide = requestedRide ?? (mode === "private_car" ? rides.find(ride => (ride.maxPassengers ?? 16) >= requestedPassengers) : undefined) ?? rides[0];
  const [selectedId, setSelectedId] = useState(defaultRide.id);
  const [passengers, setPassengers] = useState(requestedPassengers);
  const [date, setDate] = useState(initialSearch.date ?? "");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string | null>(null);
  const filteredRides = rides.filter(ride => {
    if (!selectedTimeRange) return true;
    const range = timeRanges.find(item => item.id === selectedTimeRange);
    const hour = Number(ride.time.slice(0, 2));
    return !!range && hour >= range.start && hour <= range.end;
  });
  const activeSelectedId = filteredRides.some(ride => ride.id === selectedId) ? selectedId : filteredRides[0]?.id ?? selectedId;
  const selected = rides.find(ride => ride.id === activeSelectedId) ?? rides[0];
  const maxPassengers = selected.maxPassengers ?? 16;
  const total = selected.unit === "person" ? selected.price * passengers : selected.price;
  const today = localDateString(new Date());
  const dateAnchor = date || today;
  const firstDate = shiftDate(dateAnchor, -2) < today ? today : shiftDate(dateAnchor, -2);
  const dateChoices = Array.from({ length: 7 }, (_, index) => shiftDate(firstDate, index));

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(TRANSPORT_DRAFT_KEY) ?? "null") as Partial<{ mode: Mode; from: string; to: string; date: string; rideId: string; passengers: number }> | null;
      if (saved?.mode === mode && saved.from === initialSearch.from && saved.to === initialSearch.to && saved.date === initialSearch.date && rides.some(ride => ride.id === saved.rideId)) {
        if (!requestedRide) setSelectedId(saved.rideId!);
        const ride = rides.find(item => item.id === saved.rideId)!;
        if (!initialSearch.passengers) setPassengers(Math.max(1, Math.min(ride.maxPassengers ?? 16, Number(saved.passengers) || 1)));
        if (saved.date) setDate(saved.date);
      }
    } catch { /* Use default results if browser storage is unavailable. */ }
  }, [initialSearch, mode, rides, requestedRide]);
  function confirmSelection() {
    const draft = { version: 1, mode, from: initialSearch.from ?? "", to: initialSearch.to ?? "", date, rideId: selected.id, rideName: selected.name, time: selected.time, passengers, unitPrice: selected.price, unit: selected.unit, total, relatedTourBookingId: initialSearch.bookingId, relatedTourId: initialSearch.tourId, activityId: undefined as string | undefined, activityCount: 0 };
    try {
      sessionStorage.setItem(TRANSPORT_DRAFT_KEY, JSON.stringify(draft));
    } catch { /* Browser storage may be disabled in private mode. */ }
    router.push("/transport/payment");
  }

  const editParams = new URLSearchParams({ mode, from: initialSearch.from ?? "", to: initialSearch.to ?? "", date, passengers: String(passengers) });
  if (initialSearch.bookingId) editParams.set("bookingId", initialSearch.bookingId);
  if (initialSearch.tourId) editParams.set("tourId", initialSearch.tourId);

  return <div className="ds-container transport-page transport-results-page">
    <div className="transport-step-progress" aria-label="Bước 2 trên 3"><div className="transport-step-progress-top"><Link href={`/transport?${editParams.toString()}`}><ArrowLeft size={15}/> Sửa tìm kiếm</Link><strong>Bước 2 / 3</strong></div><div className="transport-step-progress-bars transport-step-progress-bars-three" aria-hidden="true"><i className="is-complete"/><i className="is-current"/><i/></div></div>
    <header className="transport-results-heading"><div className="transport-results-title"><div><span className="ui-kicker">{label.toUpperCase()}</span><h1>{initialSearch.from || "Điểm đi"}<ArrowRight size={19}/>{initialSearch.to || "Điểm đến"}</h1><p className="transport-results-route-meta">{date || "Chưa chọn ngày"} · {mode === "private_car" ? "Giá demo theo thời lượng thuê" : "Giá demo cho một lượt"}</p></div></div></header>
    <div className="transport-results-layout">
      <section className="transport-ride-list" aria-label={mode === "private_car" ? "Danh sách xe phù hợp" : "Các chuyến phù hợp"}>
        <div className="transport-results-section-heading"><div><span className="ui-kicker">{mode === "private_car" || mode === "rental" || mode === "airport" ? "CHỌN XE" : "CHỌN CHUYẾN"}</span><h2 id="transport-ride-list-title">{filteredRides.length} {mode === "private_car" || mode === "rental" || mode === "airport" ? "phương án xe phù hợp" : "chuyến phù hợp"}</h2></div><span className="transport-count-badge">Dữ liệu demo</span></div>
        <div className="transport-schedule-filter" aria-label="Lọc chuyến theo ngày và giờ">
          <div className="transport-date-rail" aria-label="Chọn ngày đi">
            {dateChoices.map(day => {
              const parsed = new Date(`${day}T12:00:00`);
              return <button type="button" key={day} className={`transport-date-choice${date === day ? " is-selected" : ""}`} aria-pressed={date === day} onClick={() => setDate(day)}>
                <strong>{parsed.getDate()}</strong><span>{String(parsed.getDate()).padStart(2, "0")}/{String(parsed.getMonth() + 1).padStart(2, "0")}</span><small>{new Intl.DateTimeFormat("vi-VN", { weekday: "short" }).format(parsed)}</small>
              </button>;
            })}
            <label className="transport-calendar-picker" aria-label="Chọn ngày khác"><CalendarDays size={19}/><input type="date" value={date} min={today} onChange={event => setDate(event.target.value)}/></label>
          </div>
          <div className="transport-time-rail" role="group" aria-label="Lọc theo khung giờ">
            {timeRanges.map(range => <button type="button" key={range.id} aria-pressed={selectedTimeRange === range.id} className={selectedTimeRange === range.id ? "is-selected" : ""} onClick={() => setSelectedTimeRange(selectedTimeRange === range.id ? null : range.id)}>{range.label}</button>)}
          </div>
        </div>
        {filteredRides.map(ride => <button type="button" key={ride.id} className={`transport-ride-card${activeSelectedId === ride.id ? " is-selected" : ""}`} aria-pressed={activeSelectedId === ride.id} onClick={() => setSelectedId(ride.id)}>
          <span className="transport-ride-radio" aria-hidden="true">{activeSelectedId === ride.id && <Check size={14}/>}</span>
          <span className="transport-ride-main"><strong>{ride.time}</strong><span className="transport-ride-line"/><span className="transport-ride-duration"><Clock3 size={14}/>{ride.duration}</span></span>
          <span className="transport-ride-copy"><strong>{ride.name}</strong><small>{ride.detail}</small><small>{initialSearch.from || "Điểm đi"} → {initialSearch.to || "Điểm đến"}</small></span>
          <span className="transport-ride-price"><strong>{money(ride.price)}</strong><small>{ride.unit === "person" ? "/ khách" : mode === "private_car" ? "/ xe · giá demo" : "/ xe"}</small></span>
        </button>)}
        {!filteredRides.length && <div className="transport-filter-empty"><p>Không có chuyến trong khung giờ này.</p><button type="button" onClick={() => setSelectedTimeRange(null)}>Xem tất cả khung giờ</button></div>}
        {passengers > maxPassengers && <p className="transport-price-disclaimer" role="status">Xe đang chọn tối đa {maxPassengers} khách. Hãy chọn xe phù hợp với số khách.</p>}
      </section>
      <aside className="transport-selection-card" aria-label={`Tổng tạm tính cho ${selected.name}`}>
        <div className="transport-total"><span>Tổng tạm tính</span><strong>{money(total)}</strong></div>
        <Button className="transport-confirm-button" disabled={!filteredRides.length || passengers > maxPassengers} onClick={confirmSelection}>Chọn chuyến này</Button>
      </aside>
    </div>
  </div>;
}
