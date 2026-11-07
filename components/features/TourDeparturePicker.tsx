"use client";

import {useEffect,useMemo,useState} from "react";
import {ChevronLeft,ChevronRight,Minus,Plus,Users} from "lucide-react";
import {companionRate} from "@/lib/couple-pricing";
import {formatVND,packageCapacity,type DepartureSchedule} from "@/lib/mock-data";
import Modal from "@/components/ui/Modal";
import {departureTimeSlots} from "@/lib/departure-times";

const weekdayLabels=["CN","T2","T3","T4","T5","T6","T7"];
const monthLabel=(date:string)=>`Tháng ${Number(date.slice(5,7))}`;
const isoDate=(year:number,month:number,day:number)=>`${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
const monthTitle=(year:number,month:number)=>new Intl.DateTimeFormat("vi-VN",{month:"long",year:"numeric"}).format(new Date(year,month-1,1));

export default function TourDeparturePicker({packageId,schedules,referral="",aceSource="",onBookingChange}:{packageId:string;schedules:DepartureSchedule[];referral?:string;aceSource?:string;onBookingChange?:(href:string,price:string,ready:boolean,hasDate:boolean)=>void}){
 const [departureCode,setDepartureCode]=useState<string|null>(null);
 const [departureTime,setDepartureTime]=useState<string|null>(null);
 const [players,setPlayers]=useState(packageId==="sbu2"?8:1);
 const [companions,setCompanions]=useState(0);
 const [calendarOpen,setCalendarOpen]=useState(false);
 const [calendarMonth,setCalendarMonth]=useState(schedules[0]?.date.slice(0,7)??"2027-04");
 const [validationMessage,setValidationMessage]=useState("");
 const selected=schedules.find(schedule=>schedule.code===departureCode)??null;
 const max=packageCapacity(packageId),minimumPlayers=packageId==="sbu2"?8:1;
 const totalGuests=players+companions;
 const total=(selected?.price??schedules[0]?.price??0)*players+companionRate(packageId)*companions;
 const ready=!!selected&&!!departureTime;
 const bookingHref=ready&&selected&&departureTime?`/booking?package=${packageId}&departure=${encodeURIComponent(selected.code)}&departureTime=${encodeURIComponent(departureTime)}&players=${players}&companions=${companions}${referral}${aceSource}`:"";
 const priceLabel=packageId==="sbu2"?"Chờ báo giá":formatVND(total);
 useEffect(()=>{onBookingChange?.(bookingHref,priceLabel,ready,!!selected);},[bookingHref,onBookingChange,priceLabel,ready,selected]);
 const availableByDate=useMemo(()=>new Map(schedules.map(schedule=>[schedule.date,schedule])),[schedules]);
 const [year,month]=calendarMonth.split("-").map(Number);
 const dayCount=new Date(year,month,0).getDate();
 const firstWeekday=new Date(year,month-1,1).getDay();
 const calendarCells=[...Array(firstWeekday).fill(null),...Array.from({length:dayCount},(_,i)=>i+1)];
 const selectSchedule=(schedule:DepartureSchedule)=>{setDepartureCode(schedule.code);setDepartureTime(null);setValidationMessage("");setCalendarOpen(false);};
 const changePlayers=(delta:number)=>setPlayers(current=>Math.min(max-companions,Math.max(minimumPlayers,current+delta)));
 const changeCompanions=(delta:number)=>setCompanions(current=>Math.min(max-players,Math.max(0,current+delta)));
 const shiftMonth=(delta:number)=>{const next=new Date(year,month-1+delta,1);setCalendarMonth(`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,"0")}`);};
 return <section className="ds-section tour-departure-picker" aria-labelledby="departure-picker-title">
  <header className="tour-picker-heading"><div><span className="ds-eyebrow">CHỌN LỊCH & SỐ KHÁCH</span><h2 id="departure-picker-title">Lịch khởi hành</h2></div>{packageId!=="sbu1"&&<span className="tour-picker-confirm">{packageId==="sbu2"?"Báo giá trong 1 ngày làm việc":"Xác nhận trong 24 giờ"}</span>}</header>
  <div className="tour-date-rail" aria-label="Ngày khởi hành, cuộn ngang">{schedules.map(schedule=>{
   const [, ,day]=schedule.date.split("-"),active=schedule.code===departureCode;
   return <button type="button" key={schedule.code} className={`tour-date-card${active?" is-selected":""}`} aria-pressed={active} onClick={()=>selectSchedule(schedule)}>
    <span>{monthLabel(schedule.date)}</span><strong>{Number(day)}</strong><small>{schedule.dateLabel.slice(-4)} · {schedule.dayOfWeek}</small><b>{packageId==="sbu2"?"Báo giá đoàn":formatVND(schedule.price)}</b>{active&&<em>Đã chọn</em>}
   </button>;
  })}</div>
  <div className="tour-calendar-action"><span>{selected?`Ngày đã chọn: ${selected.dateLabel}`:"Chưa chọn ngày khởi hành"}</span><button type="button" onClick={()=>setCalendarOpen(true)}>Xem tất cả lịch</button></div>
  {selected&&<section className="tour-time-picker" aria-labelledby="tour-time-title"><h3 id="tour-time-title">Chọn khung giờ</h3><div>{departureTimeSlots.map(slot=><button type="button" key={slot} aria-pressed={departureTime===slot} className={departureTime===slot?"is-selected":""} onClick={()=>{setDepartureTime(slot);setValidationMessage("");}}>{slot}</button>)}</div>{validationMessage&&<p role="alert">{validationMessage}</p>}</section>}
  {!selected&&validationMessage&&<p className="tour-picker-validation" role="alert">{validationMessage}</p>}
  <p className="tour-picker-scroll">Vuốt ngang để xem các ngày khác <span aria-hidden="true">→</span></p>
  <section className="tour-party-picker" aria-labelledby="tour-party-title"><h3 id="tour-party-title"><Users size={18} aria-hidden="true"/> Chọn số khách</h3>
   <div className="tour-party-row"><span><strong>Người chơi tennis</strong><small>{packageId==="sbu2"?"Tối thiểu 8 khách đoàn":"Ít nhất 1 người chơi"}</small></span><div className="tour-party-stepper"><button type="button" aria-label="Giảm số người chơi" disabled={players<=minimumPlayers} onClick={()=>changePlayers(-1)}><Minus size={16}/></button><strong aria-live="polite">{players}</strong><button type="button" aria-label="Tăng số người chơi" disabled={totalGuests>=max} onClick={()=>changePlayers(1)}><Plus size={16}/></button></div></div>
   <div className="tour-party-row"><span><strong>Người đi cùng</strong><small>Không tham gia sân tennis</small></span><div className="tour-party-stepper"><button type="button" aria-label="Giảm người đi cùng" disabled={companions===0} onClick={()=>changeCompanions(-1)}><Minus size={16}/></button><strong aria-live="polite">{companions}</strong><button type="button" aria-label="Tăng người đi cùng" disabled={totalGuests>=max} onClick={()=>changeCompanions(1)}><Plus size={16}/></button></div></div>
  </section>
  <Modal isOpen={calendarOpen} onClose={()=>setCalendarOpen(false)} title="Xem trạng thái lịch" bottomSheet>
   <div className="tour-calendar"><div className="tour-calendar-month"><button type="button" aria-label="Tháng trước" onClick={()=>shiftMonth(-1)}><ChevronLeft size={20}/></button><h3>{monthTitle(year,month)}</h3><button type="button" aria-label="Tháng sau" onClick={()=>shiftMonth(1)}><ChevronRight size={20}/></button></div><div className="tour-calendar-grid" role="grid" aria-label={monthTitle(year,month)}>{weekdayLabels.map(day=><span className="tour-calendar-weekday" key={day}>{day}</span>)}{calendarCells.map((day,index)=>{if(!day)return <span key={`blank-${index}`}/>;const date=isoDate(year,month,day),schedule=availableByDate.get(date),active=schedule?.code===departureCode;return schedule?<button key={date} type="button" className={active?"is-selected":""} aria-label={`${schedule.dayOfWeek} ${schedule.dateLabel}, còn lịch`} onClick={()=>selectSchedule(schedule)}><strong>{day}</strong><small>Còn lịch</small></button>:<span className="is-unavailable" key={date}>{day}</span>;})}</div><p className="tour-calendar-legend"><span/>Ngày có lịch khả dụng</p></div>
  </Modal>
 </section>;
}
