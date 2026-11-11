"use client";
import {useCallback,useEffect,useState,type ReactNode} from "react";
import Link from "next/link";
import TourDeparturePicker from "@/components/features/TourDeparturePicker";
import {PremiumDayPlan} from "@/components/features/PremiumCouplePlan";
import type {DepartureSchedule} from "@/lib/mock-data";
import SectionTabs from "./SectionTabs";
export default function TourDetailTabs({overview,conditions,bookingHref,bookingLabel,basePrice,packageId,schedules,referral,aceSource}:{overview:ReactNode;conditions:ReactNode;bookingHref:string;bookingLabel:string;basePrice:string;packageId:string;schedules:DepartureSchedule[];referral:string;aceSource:string}){
 const [tab,setTab]=useState("overview"),[required,setRequired]=useState(false);
 useEffect(()=>{if(new URLSearchParams(window.location.search).get("tab")==="dates")setTab("dates");},[]);
 const [booking,setBooking]=useState({href:bookingHref,price:basePrice,ready:false,hasDate:false});
 const updateBooking=useCallback((href:string,price:string,ready:boolean,hasDate:boolean)=>setBooking(current=>current.href===href&&current.price===price&&current.ready===ready&&current.hasDate===hasDate?current:{href,price,ready,hasDate}),[]);
 const dates=<TourDeparturePicker packageId={packageId} schedules={schedules} referral={referral} aceSource={aceSource} onBookingChange={updateBooking}/>;
 const items=[{id:"overview",label:"Tổng quan",content:overview},{id:"dates",label:"Lịch khởi hành",content:dates},{id:"conditions",label:"Điều kiện",content:conditions},...(packageId==="sbu3"?[{id:"players",label:"Lịch người chơi",content:<section className="ds-section premium-player-schedule" aria-labelledby="premium-player-schedule-title"><h2 id="premium-player-schedule-title">Lịch người chơi &amp; người đi cùng</h2><p>Chương trình dự kiến 4 ngày · xem riêng lịch tennis, nghỉ dưỡng và hoạt động chung.</p><PremiumDayPlan/></section>}]:[])];
 return <><SectionTabs label="Thông tin tour" value={tab} onChange={next=>{setTab(next);setRequired(false);}} items={items}/><div className="app-tour-mobile-booking"><span><small>Từ / người</small><strong>{booking.price}</strong><small className="app-tour-loyalty">ACE +5 điểm khi đặt tour</small></span>{booking.ready?<Link className="ds-cta" href={booking.href}>{bookingLabel}</Link>:<button className="ds-cta" type="button" onClick={()=>{setTab("dates");setRequired(true);document.getElementById("departure-picker-title")?.scrollIntoView({behavior:"smooth",block:"center"});}}>{bookingLabel}</button>}{required&&!booking.ready&&<p className="app-tour-booking-error" role="alert">{booking.hasDate?"Vui lòng chọn khung giờ trước khi tiếp tục.":"Vui lòng chọn ngày khởi hành và khung giờ trước khi tiếp tục."}</p>}</div></>;
}
