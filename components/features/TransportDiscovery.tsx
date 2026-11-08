"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, BusFront, CalendarDays, CarFront, TrainFront, Plane, Search, Users } from "lucide-react";
import Button from "@/components/ui/Button";

const modes = [
  { id: "train", label: "Tàu hỏa", Icon: TrainFront },
  { id: "bus", label: "Xe buýt", Icon: BusFront },
  { id: "rental", label: "Thuê xe", Icon: CarFront },
  { id: "airport", label: "Xe sân bay", Icon: Plane },
  { id: "private_car", label: "Xe riêng", Icon: CarFront },
];

export default function TransportDiscovery({ initialSearch = {} }: { initialSearch?: Record<string, string | undefined> }) {
  const router = useRouter();
  const [mode, setMode] = useState(initialSearch.mode ?? "train");
  const [from, setFrom] = useState(initialSearch.from ?? "");
  const [to, setTo] = useState(initialSearch.to ?? "");
  const [date, setDate] = useState(initialSearch.date ?? "");
  const [passengers, setPassengers] = useState(initialSearch.passengers ?? "1");

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new URLSearchParams({ mode, from: from.trim(), to: to.trim(), date, passengers });
    router.push(`/transport/results?${query.toString()}`);
  }

  return <div className="ds-container transport-page">
    <header className="transport-heading">
      <span className="ui-kicker">DỊCH VỤ CHUYẾN ĐI</span>
      <h1>Di chuyển</h1>
      <p>{mode === "private_car" ? "Đặt xe riêng cho hoạt động ngoài lịch đoàn. Dịch vụ tự nguyện, không ảnh hưởng đến booking tour." : "Tìm phương tiện phù hợp cho hành trình của bạn."}</p>
    </header>
    <div className="transport-mode-rail" role="group" aria-label="Loại phương tiện">
      {modes.map(({ id, label, Icon }) => <button type="button" key={id} aria-pressed={mode === id} onClick={() => setMode(id)}>
        <Icon size={22} aria-hidden="true"/><span>{label}</span>
      </button>)}
    </div>
    <section className="transport-search-card" aria-labelledby="transport-search-title">
      <div className="transport-form-heading"><div><span className="ui-kicker">{modes.find(item => item.id === mode)?.label.toUpperCase()}</span><h2 id="transport-search-title">Bạn muốn đi đâu?</h2></div><span className="transport-form-icon"><Search size={21}/></span></div>
      <form onSubmit={search}>
        <div className="transport-location-fields">
          <label><span>{mode === "airport" || mode === "private_car" ? "Đón tại" : "Từ"}</span><input required value={from} onChange={event => setFrom(event.target.value)} placeholder={mode === "airport" ? "Sân bay / khách sạn" : mode === "private_car" ? "Khách sạn / điểm hẹn" : "Điểm khởi hành"} autoComplete="off"/></label>
          <button className="transport-swap" type="button" aria-label="Đổi điểm đi và điểm đến" onClick={() => { setFrom(to); setTo(from); }}><ArrowLeftRight size={19}/></button>
          <label><span>{mode === "airport" ? "Đến" : "Đến"}</span><input required value={to} onChange={event => setTo(event.target.value)} placeholder={mode === "airport" ? "Khách sạn / sân bay" : "Điểm đến"} autoComplete="off"/></label>
        </div>
        <label className="transport-date-field"><span><CalendarDays size={17}/> Ngày khởi hành</span><input required type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={event => setDate(event.target.value)}/></label>
        <label className="transport-date-field"><span><Users size={17}/> Số khách</span><input required type="number" min="1" max="16" value={passengers} onChange={event => setPassengers(event.target.value)}/></label>
        <Button type="submit" className="transport-submit"><Search size={18}/> Tìm chuyến</Button>
      </form>
    </section>
    <p className="transport-flow-note">Kết quả hiện là dữ liệu demo; chưa liên kết nhà cung cấp, tình trạng chỗ hoặc thanh toán.</p>
  </div>;
}
