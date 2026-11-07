"use client";
import {useCallback,useState,type ReactNode} from "react";
import Link from "next/link";
import TourDeparturePicker from "@/components/features/TourDeparturePicker";
import type {DepartureSchedule} from "@/lib/mock-data";
import SectionTabs from "./SectionTabs";
export default function TourDetailTabs({overview,conditions,bookingHref,bookingLabel,basePrice,packageId,schedules,referral,aceSource}:{overview:ReactNode;conditions:ReactNode;bookingHref:string;bookingLabel:string;basePrice:string;packageId:string;schedules:DepartureSchedule[];referral:string;aceSource:string}){
 const [tab,setTab]=useState("overview");
 const [booking,setBooking]=useState({href:bookingHref,price:basePrice});
 const updateBooking=useCallback((href:string,price:string)=>setBooking(current=>current.href===href&&current.price===price?current:{href,price}),[]);
 const dates=<TourDeparturePicker packageId={packageId} schedules={schedules} referral={referral} aceSource={aceSource} onBookingChange={updateBooking}/>;
 return <><SectionTabs label="Thông tin tour" value={tab} onChange={setTab} items={[{id:"overview",label:"Tổng quan",content:overview},{id:"dates",label:"Lịch khởi hành",content:dates},{id:"conditions",label:"Điều kiện",content:conditions}]}/><div className="app-tour-mobile-booking"><span><small>Từ / người</small><strong>{booking.price}</strong></span><Link className="ds-cta" href={booking.href}>{bookingLabel}</Link></div></>;
}
