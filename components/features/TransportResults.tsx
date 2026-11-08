"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BusFront, CarFront, Check, Clock3, Plane, TrainFront } from "lucide-react";
import Button from "@/components/ui/Button";
import { TRANSPORT_ACTIVITY, TRANSPORT_DRAFT_KEY } from "@/lib/transport-order";
import { transportRidesByMode, type TransportMode } from "@/lib/transport-catalog";

type Mode = TransportMode;
const modeInfo: Record<Mode, { label: string; Icon: typeof TrainFront }> = {
  train: { label: "Tàu hỏa", Icon: TrainFront },
  bus: { label: "Xe buýt", Icon: BusFront },
  rental: { label: "Thuê xe", Icon: CarFront },
  airport: { label: "Xe sân bay", Icon: Plane },
  private_car: { label: "Xe riêng ngoài lịch đoàn", Icon: CarFront },
};
const validModes: Mode[] = ["train", "bus", "rental", "airport", "private_car"];
const money = (amount: number) => `${amount.toLocaleString("vi-VN")} đ`;

export default function TransportResults({ initialSearch }: { initialSearch: Record<string, string | undefined> }) {
  const router = useRouter();
  const mode = validModes.includes(initialSearch.mode as Mode) ? initialSearch.mode as Mode : "train";
  const { label, Icon } = modeInfo[mode];
  const rides = transportRidesByMode[mode];
  const requestedRide = rides.find(ride => ride.id === initialSearch.rideId);
  const requestedPassengers = Math.max(1, Math.trunc(Number(initialSearch.passengers) || 1));
  const defaultRide = requestedRide ?? (mode === "private_car" ? rides.find(ride => (ride.maxPassengers ?? 16) >= requestedPassengers) : undefined) ?? rides[0];
  const [selectedId, setSelectedId] = useState(defaultRide.id);
  const [passengers, setPassengers] = useState(requestedPassengers);
  const [date, setDate] = useState(initialSearch.date ?? "");
  const selected = rides.find(ride => ride.id === selectedId) ?? rides[0];
  const maxPassengers = selected.maxPassengers ?? 16;
  const total = selected.unit === "person" ? selected.price * passengers : selected.price;

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
      const saved = JSON.parse(sessionStorage.getItem(TRANSPORT_DRAFT_KEY) ?? "null") as Partial<typeof draft> | null;
      if (saved?.mode === mode && saved.from === draft.from && saved.to === draft.to && saved.date === date) {
        draft.activityCount = mode === "private_car" ? 0 : Math.max(0, Math.min(passengers, Number(saved.activityCount) || 0));
        if (draft.activityCount) draft.activityId = typeof saved.activityId === "string" ? saved.activityId : TRANSPORT_ACTIVITY.id;
      }
      sessionStorage.setItem(TRANSPORT_DRAFT_KEY, JSON.stringify(draft));
    } catch { /* Browser storage may be disabled in private mode. */ }
    router.push("/transport/review");
  }

  const editParams = new URLSearchParams({ mode, from: initialSearch.from ?? "", to: initialSearch.to ?? "", date, passengers: String(passengers) });
  if (initialSearch.bookingId) editParams.set("bookingId", initialSearch.bookingId);
  if (initialSearch.tourId) editParams.set("tourId", initialSearch.tourId);

  return <div className="ds-container transport-page transport-results-page">
    <Link className="transport-back-link" href={`/transport?${editParams.toString()}`}><ArrowLeft size={17}/> Sửa tìm kiếm</Link>
    <header className="transport-results-heading"><div className="transport-results-title"><span className="transport-results-icon"><Icon size={21}/></span><div><span className="ui-kicker">{label.toUpperCase()}</span><h1>{initialSearch.from || "Điểm đi"}<ArrowRight size={19}/>{initialSearch.to || "Điểm đến"}</h1></div></div><p>{date || "Chưa chọn ngày"} · {mode === "private_car" ? "Giá demo theo thời lượng thuê" : "Giá demo cho một lượt"}</p></header>
    <div className="transport-results-layout">
      <section className="transport-ride-list" aria-label={mode === "private_car" ? "Danh sách xe phù hợp" : "Các chuyến phù hợp"}>
        {mode !== "private_car" && <div className="transport-results-section-heading"><div><span className="ui-kicker">{mode === "train" || mode === "bus" ? "CHỌN CHUYẾN" : "CHỌN XE"}</span><h2 id="transport-ride-list-title">{rides.length} {mode === "train" || mode === "bus" ? "chuyến phù hợp" : "phương án xe"}</h2></div><span className="transport-count-badge">Dữ liệu demo</span></div>}
        {rides.map(ride => <button type="button" key={ride.id} className={`transport-ride-card${selectedId === ride.id ? " is-selected" : ""}`} aria-pressed={selectedId === ride.id} onClick={() => setSelectedId(ride.id)}>
          <span className="transport-ride-radio" aria-hidden="true">{selectedId === ride.id && <Check size={14}/>}</span>
          <span className="transport-ride-main"><strong>{ride.time}</strong><span className="transport-ride-line"/><span className="transport-ride-duration"><Clock3 size={14}/>{ride.duration}</span></span>
          <span className="transport-ride-copy"><strong>{ride.name}</strong><small>{ride.detail}</small><small>{initialSearch.from || "Điểm đi"} → {initialSearch.to || "Điểm đến"}</small></span>
          <span className="transport-ride-price"><strong>{money(ride.price)}</strong><small>{ride.unit === "person" ? "/ khách" : mode === "private_car" ? "/ xe · giá demo" : "/ xe"}</small></span>
        </button>)}
        {passengers > maxPassengers && <p className="transport-price-disclaimer" role="status">Xe đang chọn tối đa {maxPassengers} khách. Hãy chọn xe phù hợp với số khách.</p>}
      </section>
      <aside className="transport-selection-card" aria-label={`Tổng tạm tính cho ${selected.name}`}>
        <div className="transport-total"><span>Tổng tạm tính</span><strong>{money(total)}</strong></div>
        <Button className="transport-confirm-button" disabled={passengers > maxPassengers} onClick={confirmSelection}>Chọn chuyến này</Button>
      </aside>
    </div>
  </div>;
}
