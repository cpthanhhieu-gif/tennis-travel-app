"use client";
import {useEffect,useState} from "react";
import type {TripDay} from "@/lib/trip-itinerary";
import {activityStatusLabels,type ActivityStatus} from "@/lib/trip-runtime";
type Shared={name:string;companion:boolean;days:(Omit<TripDay,"activities">&{activities:(TripDay["activities"][number]&{status:ActivityStatus;reason?:string})[]})[]};
export default function SharedJourney(){
 const [data,setData]=useState<Shared|null>(null),[error,setError]=useState("");
 useEffect(()=>{let active=true;async function load(){try{const token=new URLSearchParams(window.location.search).get("token")??"";const r=await fetch(`/api/shared-journey?token=${encodeURIComponent(token)}`,{cache:"no-store"});const d=await r.json();if(!active)return;if(!r.ok){setData(null);throw Error(d.error);}setData(d);setError("");}catch(e){if(active){setData(null);setError((e as Error).message);}}}void load();const timer=setInterval(load,5000);return()=>{active=false;clearInterval(timer);};},[]);
 return <main className="ds-container ds-profile"><p className="ds-eyebrow">HÀNH TRÌNH CHUNG</p><h1>{data?.name??"Theo dõi chuyến đi"}</h1>{error&&<p role="alert">{error}</p>}{!data&&!error&&<p>Đang tải…</p>}{data&&<><p>Lịch chung tự cập nhật mỗi 5 giây. Thay đổi đăng ký hoặc thanh toán qua người đặt chuyến.</p>{data.companion&&<p>Người đi cùng tham gia hoạt động chung theo phương án; buổi sân và thi đấu dành cho người chơi.</p>}{data.days.map(day=><section className="ds-summary" key={day.day}><h2>Ngày {day.day} · {day.title}</h2><p>{day.date}</p>{day.activities.map(a=><article className="ds-summary" key={a.id}><strong>{a.time} · {a.title}</strong><p>{a.location} · {activityStatusLabels[a.status]}</p>{a.reason&&<p>{a.reason}</p>}</article>)}</section>)}</>}</main>;
}
