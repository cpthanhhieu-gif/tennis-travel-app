"use client";
import InfoPanel from "@/components/ui/InfoPanel";
import {requestErrorMessage} from "@/lib/request-error";
import {useEffect,useState} from "react";
import TripTimeline from "./TripTimeline";
import type {LocalOrder} from "@/lib/use-local-account";
import Link from "next/link";
import {tours} from "@/lib/mock-data";
import {journeyPhase} from "@/lib/journey";
type Order=LocalOrder;
export default function InTourLive(){
 const [order,setOrder]=useState<Order|null>(null),[error,setError]=useState(""),[loading,setLoading]=useState(true);
 async function load(){setLoading(true);setError("");try{const id=new URLSearchParams(window.location.search).get("booking");if(!id)throw Error("Chọn chuyến từ Hành trình để mở Tour Live.");const r=await fetch("/api/local",{cache:"no-store"});if(!r.ok)throw Error("Không tải được hành trình.");const d=await r.json();if(!d.account)throw Error("Vui lòng đăng nhập để xem chuyến đi.");const o=d.orders.find((o:Order)=>o.id===id);if(!o)throw Error("Không tìm thấy hành trình.");setOrder(o);}catch(e){setError(requestErrorMessage(e));}finally{setLoading(false);}}
 useEffect(()=>{void load();},[]);
 const tour=tours.find(t=>t.id===order?.tourId);const schedule=tour?.departureSchedules.find(d=>d.code===order?.departureCode);
 return <div className="ds-container ds-profile ui-live-page"><header className="ui-live-header"><div><Link className="ui-text-button" href="/pre-tour">← Hành trình</Link><p className="ui-kicker">TOUR LIVE</p><h1>{tour?.name??"Chuyến đi của bạn"}</h1>{order&&<p>{schedule?.dateLabel} · {order.numPeople} khách · {tour?.duration}</p>}</div><div className="ui-header-actions">{order&&<span className="ui-badge">{journeyPhase(order)}</span>}<button className="ds-link" disabled={loading} onClick={load}>{loading?"Đang tải…":"Cập nhật"}</button></div></header>{error&&<p role="alert">{error}<button className="ds-link" onClick={load}>Thử lại</button></p>}{!loading&&order&&<>{order.completedAt&&<Link className="ds-link" href={`/share-card?booking=${order.id}`}>Xem thẻ thành tích</Link>}<TripTimeline key={order.id} order={order}/><div className="ui-secondary-grid"><InfoPanel title="Thông tin chuyến đi" description={`${order.numPeople-(order.numCompanions??0)} người chơi · ${order.numCompanions??0} người đi cùng`}><p>{order.name}</p><p>Mã chuyến: {order.departureCode}</p><p>{tour?.destinationName} · {schedule?.dateLabel}</p></InfoPanel>{!!order.numCompanions&&<InfoPanel title="Dành cho người đi cùng" description="Nghỉ dưỡng và hoạt động chung theo phương án"><p>Người đi cùng tham gia nghỉ dưỡng, bữa ăn và tham quan theo phương án chung phòng; không tham gia các buổi sân, NTRP hoặc Ace Cup. Có thể cổ vũ và tham gia hoạt động chung đã xác nhận. Spa và hoạt động mua thêm theo quyền lợi từng gói.</p></InfoPanel>}</div></>}</div>;
}
