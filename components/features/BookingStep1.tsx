"use client";

import {coupleTotal,companionRate} from "@/lib/couple-pricing";
import { useEffect, useState } from "react";
import GroupRequestFields from "./GroupRequestFields";
import {validGroupRequest} from "@/lib/group-request";
import Button from "@/components/ui/Button";
import { useBooking } from "@/lib/BookingContext";
import { tours, packageCapacity, formatVNDShort, type Tour } from "@/lib/mock-data";
import { Check, Calendar, MapPin } from "lucide-react";

interface Props { onNext: () => void }

const PKG_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "sbu1", label: "Leisure" },
  { id: "sbu2", label: "Tournament" },
  { id: "sbu3", label: "Premium" },
];

const DEST_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "dalat",     label: "Đà Lạt" },
  { id: "danang",    label: "Đà Nẵng" },
  { id: "phuquoc",   label: "Phú Quốc" },
];

export default function BookingStep1({ onNext }: Props) {
  const { booking, updateBooking, restoredDraft } = useBooking();

  const [groupError,setGroupError]=useState(false);
  const [changeTour,setChangeTour]=useState(false);
  const [pkgFilter, setPkgFilter]   = useState("all");
  const [destFilter, setDestFilter] = useState("all");
  const [selectedTourId, setSelectedTourId] = useState(booking.tourId || "dl-sbu1");
  const [companions,setCompanions]=useState(booking.numCompanions??0);
  const [people, setPeople]                 = useState(booking.numPeople || 2);

  const filtered = tours.filter((t) => {
    const pkgOk  = pkgFilter  === "all" || t.packageId      === pkgFilter;
    const destOk = destFilter === "all" || t.destinationId  === destFilter;
    return pkgOk && destOk;
  });

  const selectedTour = tours.find((t) => t.id === selectedTourId) ?? tours[0];
  const maxPeople = packageCapacity(selectedTour.packageId);
  const firstSchedule = selectedTour.departureSchedules[0];
  const [scheduleCode, setScheduleCode] = useState(booking.departureCode || firstSchedule.code);

  useEffect(() => {
    if(restoredDraft)return;
    const params = new URLSearchParams(window.location.search);
    const packageId = params.get("package");
    const destinationId = params.get("destination");
    const linkedTour = tours.find((tour) =>
      (packageId ? tour.packageId === packageId : true) &&
      (destinationId ? tour.destinationId === destinationId : true)
    );
    if (!linkedTour || (!packageId && !destinationId)) return;
    const linkedSchedule = linkedTour.departureSchedules.find(s => s.code === params.get("departure")) ?? linkedTour.departureSchedules[0];
    if(packageId==="sbu3"&&params.get("couple")==="1"){setPeople(2);setCompanions(1);}
    setPkgFilter(packageId ?? "all");
    setDestFilter(destinationId ?? "all");
    updateBooking({tourId:linkedTour.id,packageId:linkedTour.packageId,destination:linkedTour.destinationId,departureCode:linkedSchedule.code,departureDate:linkedSchedule.date,numCompanions:companions,totalPrice:coupleTotal(linkedTour.packageId,linkedSchedule.price,people,companions)});
    setSelectedTourId(linkedTour.id);
    setScheduleCode(linkedSchedule.code);
  }, []);

  const selectedSchedule =
    selectedTour.departureSchedules.find((s) => s.code === scheduleCode) ?? firstSchedule;

  useEffect(()=>{updateBooking({tourId:selectedTour.id,packageId:selectedTour.packageId,destination:selectedTour.destinationId,departureDate:selectedSchedule.date,departureCode:selectedSchedule.code,numPeople:people,numCompanions:companions,totalPrice:coupleTotal(selectedTour.packageId,selectedSchedule.price,people,companions)});},[selectedTourId,scheduleCode,people,companions,updateBooking]);

  const handleSelectTour = (tour: Tour) => {
    updateBooking({tourId:tour.id,packageId:tour.packageId,destination:tour.destinationId,departureCode:tour.departureSchedules[0].code,departureDate:tour.departureSchedules[0].date,numCompanions:companions,totalPrice:coupleTotal(tour.packageId,tour.departureSchedules[0].price,people,companions)});
    setSelectedTourId(tour.id);
    setScheduleCode(tour.departureSchedules[0].code);
    setChangeTour(false);
  };

  const handleSelectSchedule = (code: string) => {
    setScheduleCode(code);

  };

  const handleNext = () => {
    if(selectedTour.packageId==="sbu2"&&!validGroupRequest(booking.groupRequest)){setGroupError(true);requestAnimationFrame(()=>{const field=document.querySelector<HTMLElement>('.premium-request-fields [aria-invalid="true"]');field?.focus({preventScroll:true});field?.scrollIntoView({behavior:"smooth",block:"center"});});return;}
    if(!Number.isInteger(people)||!Number.isInteger(companions)||people<1||companions<0||people-companions<1||people > maxPeople)return;
    updateBooking({
      tourId: selectedTour.id,
      packageId: selectedTour.packageId,
      destination: selectedTour.destinationId,
      departureDate: selectedSchedule.date,
      departureCode: selectedSchedule.code,
      numPeople: people,
      numCompanions: companions,
      totalPrice: coupleTotal(selectedTour.packageId,selectedSchedule.price,people,companions),
    });
    if(selectedTour.packageId==="sbu2"&&booking.groupRequest)updateBooking({numPeople:booking.groupRequest.max,numCompanions:booking.groupRequest.companions,totalPrice:coupleTotal(selectedTour.packageId,selectedSchedule.price,booking.groupRequest.max,booking.groupRequest.companions)});
    onNext();
  };

  return (
    <div className="booking-config">
      <div className="booking-selected"><div><span className="ds-eyebrow">TOUR ĐÃ CHỌN</span><h2>{selectedTour.name}</h2><p>{selectedTour.destinationName} · {selectedTour.duration} · {selectedTour.ntrpLabel}</p></div><button type="button" aria-expanded={changeTour} className="ui-text-button" onClick={()=>setChangeTour(!changeTour)}>{changeTour?"Đóng":"Đổi tour"}</button></div>
      {changeTour && <section className="booking-change-tour" aria-label="Đổi tour">
        <h3>Chọn trải nghiệm</h3>
        <div className="booking-tour-filters">
          <label>Loại trải nghiệm<select value={pkgFilter} onChange={e=>setPkgFilter(e.target.value)}>{PKG_FILTERS.map(f=><option key={f.id} value={f.id}>{f.label}</option>)}</select></label>
          <label>Điểm đến<select value={destFilter} onChange={e=>setDestFilter(e.target.value)}>{DEST_FILTERS.map(f=><option key={f.id} value={f.id}>{f.label}</option>)}</select></label>
        </div>
        <p className="booking-field-help" role="status">{filtered.length} tour phù hợp</p>
        <div className="booking-tour-options">{filtered.map(tour=><button type="button" key={tour.id} aria-pressed={tour.id===selectedTourId} onClick={()=>handleSelectTour(tour)}>
          <span><strong>{tour.name}</strong><small><MapPin size={16} aria-hidden="true"/>{tour.destinationName} · {tour.duration}</small><small>{tour.ntrpLabel}</small></span>
          <span><b>{formatVNDShort(Math.min(...tour.departureSchedules.map(d=>d.price)))}</b><small>Từ / người chơi</small>{tour.id===selectedTourId&&<small><Check size={16} aria-hidden="true"/>Đã chọn</small>}</span>
        </button>)}</div>
        {!filtered.length&&<p className="booking-field-help">Thử chọn điểm đến hoặc loại trải nghiệm khác.</p>}
      </section>}
      <fieldset className="booking-departures"><legend><Calendar size={20} aria-hidden="true"/> Ngày khởi hành</legend>
        <p className="booking-field-help" id="departure-help">Chọn một ngày đi. Giá hiển thị cho một người chơi tennis.</p>
        <div>{selectedTour.departureSchedules.map(d=><label key={d.code} className={selectedSchedule.code===d.code?"is-selected":""}>
          <input type="radio" name="departure" value={d.code} checked={selectedSchedule.code===d.code} aria-describedby="departure-help" onChange={()=>handleSelectSchedule(d.code)}/>
          <span className="booking-departure-info"><strong>{d.dateLabel}</strong><small>{d.dayOfWeek}</small><small className="booking-departure-code">Mã lịch: {d.code}</small></span>
          <span className="booking-departure-price"><b>{formatVNDShort(d.price)}</b><small>/ người chơi</small>{selectedSchedule.code===d.code&&<small className="booking-selection-status"><Check size={16} aria-hidden="true"/>Đã chọn</small>}</span>
        </label>)}</div>
      </fieldset>
      {selectedTour.packageId==="sbu2"&&<><GroupRequestFields showErrors={groupError}/></>}
      {selectedTour.packageId!=="sbu2"&&<section className="mb-[3.2rem]" aria-labelledby="couple-heading">
        <h3 id="couple-heading" className="text-[2rem] font-bold">Ai cùng tham gia?</h3>
        <div className="ds-summary-row"><label htmlFor="num-players">Người chơi tennis</label><input id="num-players" type="number" min={1} max={maxPeople-companions} value={people-companions} className="border p-[1.2rem] w-[9rem] text-[1.6rem]" onChange={event=>setPeople(Math.max(1,Math.min(maxPeople-companions,parseInt(event.target.value)||1))+companions)}/></div>
        <p className="text-[1.4rem]">Giá người chơi: {selectedSchedule.price.toLocaleString("vi-VN")}đ/người.</p>
        <div className="ds-summary-row"><label htmlFor="num-companions">Người đi cùng không chơi</label><input id="num-companions" type="number" min={0} max={Math.max(0,maxPeople-(people-companions))} value={companions} className="border p-[1.2rem] w-[9rem] text-[1.6rem]" onChange={event=>{const players=people-companions;const next=Math.max(0,Math.min(Math.max(0,maxPeople-players),parseInt(event.target.value)||0));setCompanions(next);setPeople(players+next);}}/></div>
        <p className="text-[1.4rem]">Couple Mode: {companionRate(selectedTour.packageId).toLocaleString("vi-VN")}đ/người, chung phòng. Không bao gồm sân và HLV; không cần NTRP cho người đi cùng.</p>
        <details className="booking-companion-details"><summary>Hoạt động & điều kiện người đi cùng</summary><p className="text-[1.4rem]">{selectedTour.packageId==="sbu3"?"Nghỉ dưỡng, spa, ẩm thực và tham quan theo phương án; có thể cùng cooking class, gala và cổ vũ Ace Cup.":"Nghỉ dưỡng, ẩm thực và tham quan theo phương án. Spa và hoạt động cụ thể cần xác nhận theo chuyến."} Hoạt động tùy chọn và phụ thu phòng được báo giá riêng.</p></details>
        <p className="mt-[1.6rem]">Tổng: {people} khách · {people-companions} người chơi + {companions} người đi cùng (tối đa {maxPeople}). Cần ít nhất một người chơi.</p>
      </section>}
      {people > maxPeople && <p role="alert">Gói này tối đa {maxPeople} khách. Vui lòng điều chỉnh số người trước khi tiếp tục.</p>}
      <div className="booking-continue">{groupError&&selectedTour.packageId==="sbu2"&&!validGroupRequest(booking.groupRequest)&&<p role="alert" className="booking-field-error">Chưa thể tiếp tục. Vui lòng bổ sung hoặc sửa các ô được đánh dấu phía trên.</p>}<div><span>{selectedTour.packageId==="sbu2"?`Quy mô dự kiến · ${booking.groupRequest?.min??12}–${booking.groupRequest?.max??16} khách`:`Tổng dự kiến · ${people} khách`}</span><strong>{selectedTour.packageId==="sbu2"?"Chờ báo giá đoàn":`${coupleTotal(selectedTour.packageId,selectedSchedule.price,people,companions).toLocaleString("vi-VN")} ₫`}</strong></div><Button variant="primary" size="lg" className="w-full" disabled={people > maxPeople} onClick={handleNext}>
        {selectedTour.packageId === "sbu2" ? "Tiếp tục — Liên hệ đại diện" : "Tiếp tục — Đánh giá NTRP"}
      </Button></div>
    </div>
  );
}
