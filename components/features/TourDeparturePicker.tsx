"use client";

import {useEffect,useState} from "react";
import {Check,Minus,Plus,Users} from "lucide-react";
import {companionRate} from "@/lib/couple-pricing";
import {formatVND,packageCapacity,type DepartureSchedule} from "@/lib/mock-data";

const monthLabel=(date:string)=>`Tháng ${Number(date.slice(5,7))}`;
export default function TourDeparturePicker({packageId,schedules,referral="",aceSource="",onBookingChange}:{packageId:string;schedules:DepartureSchedule[];referral?:string;aceSource?:string;onBookingChange?:(href:string,price:string)=>void}){
 const first=schedules[0];
 const [departureCode,setDepartureCode]=useState(first.code);
 const [players,setPlayers]=useState(packageId==="sbu2"?8:1);
 const [companions,setCompanions]=useState(0);
 const selected=schedules.find(schedule=>schedule.code===departureCode)??first;
 const max=packageCapacity(packageId),minimumPlayers=packageId==="sbu2"?8:1;
 const total=selected.price*players+companionRate(packageId)*companions;
 const bookingHref=`/booking?package=${packageId}&departure=${encodeURIComponent(selected.code)}&players=${players}&companions=${companions}${referral}${aceSource}`;
 useEffect(()=>{onBookingChange?.(bookingHref,packageId==="sbu2"?"Chờ báo giá":formatVND(total));},[bookingHref,onBookingChange,packageId,total]);
 const changePlayers=(delta:number)=>setPlayers(current=>Math.min(max-companions,Math.max(minimumPlayers,current+delta)));
 const changeCompanions=(delta:number)=>setCompanions(current=>Math.min(max-players,Math.max(0,current+delta)));
 return <section className="ds-section tour-departure-picker" aria-labelledby="departure-picker-title">
  <header className="tour-picker-heading"><div><span className="ds-eyebrow">CHỌN LỊCH & SỐ KHÁCH</span><h2 id="departure-picker-title">Lịch khởi hành</h2></div>{packageId!=="sbu1"&&<span className="tour-picker-confirm"><Check size={15} aria-hidden="true"/>{packageId==="sbu2"?"Báo giá trong 1 ngày làm việc":"Xác nhận trong 24 giờ"}</span>}</header>
  <div className="tour-date-rail" aria-label="Ngày khởi hành, cuộn ngang">{schedules.map(schedule=>{
   const [,month,day]=schedule.date.split("-");const active=schedule.code===departureCode;
   return <button type="button" key={schedule.code} className={`tour-date-card${active?" is-selected":""}`} aria-pressed={active} onClick={()=>setDepartureCode(schedule.code)}>
    <span>{monthLabel(schedule.date)}</span><strong>{Number(day)}</strong><small>{schedule.dateLabel.slice(-4)} · {schedule.dayOfWeek}</small><b>{packageId==="sbu2"?"Báo giá đoàn":formatVND(schedule.price)}</b>{active&&<em><Check size={13}/>Đã chọn</em>}
   </button>;
  })}</div>
  <p className="tour-picker-scroll">Vuốt ngang để xem các ngày khác <span aria-hidden="true">→</span></p>
  <section className="tour-party-picker" aria-labelledby="tour-party-title"><h3 id="tour-party-title"><Users size={18} aria-hidden="true"/> Chọn số khách</h3>
   <div className="tour-party-row"><span><strong>Người chơi tennis</strong><small>{packageId==="sbu2"?"Tối thiểu 8 khách đoàn":"Ít nhất 1 người chơi"}</small></span><div className="tour-party-stepper"><button type="button" aria-label="Giảm số người chơi" disabled={players<=minimumPlayers} onClick={()=>changePlayers(-1)}><Minus size={16}/></button><strong aria-live="polite">{players}</strong><button type="button" aria-label="Tăng số người chơi" disabled={totalGuests>=max} onClick={()=>changePlayers(1)}><Plus size={16}/></button></div></div>
   <div className="tour-party-row"><span><strong>Người đi cùng</strong><small>Không tham gia sân tennis</small></span><div className="tour-party-stepper"><button type="button" aria-label="Giảm người đi cùng" disabled={companions===0} onClick={()=>changeCompanions(-1)}><Minus size={16}/></button><strong aria-live="polite">{companions}</strong><button type="button" aria-label="Tăng người đi cùng" disabled={totalGuests>=max} onClick={()=>changeCompanions(1)}><Plus size={16}/></button></div></div>
  </section>
 </section>;
}
