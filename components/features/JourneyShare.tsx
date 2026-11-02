"use client";
import {useState} from "react";
import type {LocalOrder} from "@/lib/use-local-account";
export default function JourneyShare({order,onUpdated}:{order:LocalOrder;onUpdated?:()=>void}){
 const [token,setToken]=useState(order.journeyShare?.token??""),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 if(!order.startedAt||order.numPeople<2||order.completedAt)return null;
 async function change(action:string){setBusy(true);try{const r=await fetch("/api/local",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,id:order.id})});const d=await r.json();if(!r.ok)throw Error(d.error);setToken(d.orders.find((o:LocalOrder)=>o.id===order.id)?.journeyShare?.token??"");setMessage(action==="revokeJourney"?"Đã thu hồi link cũ.":"Đã tạo link hành trình chung.");onUpdated?.();}catch(e){setMessage((e as Error).message);}finally{setBusy(false);}}
 const active=token;const url=active&&typeof window!=="undefined"?`${window.location.origin}/journey-share?token=${active}`:"";
 return <section className="ds-summary"><h3>Chia sẻ hành trình chung</h3><p>{order.numPeople===2?"Gửi cho người thứ hai để cùng theo dõi chuyến đi.":"Gửi cho thành viên đoàn để cùng theo dõi lịch trình."} Link chỉ cho xem lịch và cập nhật điều phối, không gồm thông tin liên hệ hay thanh toán. Ai có link đều xem được đến khi thu hồi hoặc kết thúc chuyến.</p>{url?<><label>Link hành trình<input className="w-full" readOnly value={url} onFocus={e=>e.target.select()}/></label><button className="ds-link" onClick={async()=>{try{await navigator.clipboard.writeText(url);setMessage("Đã sao chép link.");}catch{setMessage("Chọn link và sao chép thủ công.");}}}>Sao chép link</button><button className="ds-link" disabled={busy} onClick={()=>change("revokeJourney")}>Thu hồi link</button></>:<button className="ds-cta" disabled={busy} onClick={()=>change("shareJourney")}>Tạo link chia sẻ hành trình</button>}<p role="status">{message}</p></section>;
}
