"use client";
import {useEffect,useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {demoScenarios} from "@/lib/demo-registry";
import {browserStorageKey} from "@/lib/demo-scope";
type Sync={room:string;scenario:string|null;entryPath?:string;changed?:boolean;customer?:string;booking?:string;stage?:string;coach?:string;syncedAt?:string};
export default function DemoBanner(){
 const pathname=usePathname(),[sync,setSync]=useState<Sync|null>(null),[offline,setOffline]=useState(false);
 useEffect(()=>{let stopped=false,running=false;async function check(){if(running||document.visibilityState!=="visible")return;running=true;try{const r=await fetch("/api/demo-sync",{cache:"no-store"});if(!r.ok)throw Error();const d:Sync=await r.json();if(stopped)return;setSync(d);setOffline(false);if(d.changed&&!pathname.startsWith("/demo")){window.location.assign(d.entryPath??"/");}}catch{if(!stopped)setOffline(true);}finally{running=false;}}void check();const timer=setInterval(check,4000);window.addEventListener("focus",check);return()=>{stopped=true;clearInterval(timer);window.removeEventListener("focus",check);};},[pathname]);
 useEffect(()=>{if(sync?.scenario)try{sessionStorage.setItem(browserStorageKey("last-path"),window.location.pathname+window.location.search);}catch{}},[pathname,sync?.scenario]);
 const name=demoScenarios.find(s=>s.id===sync?.scenario)?.name;
 return <div className="demo-banner" style={{flexWrap:"wrap",gap:"0.6rem",overflowWrap:"anywhere"}}><span>{name?`Demo: ${name}`:"Trải nghiệm ứng dụng"}{sync?.scenario&&<> · Phiên {sync.room} · {sync.customer} · Booking {sync.booking??"chưa có"} · {sync.stage??"Chưa đặt chuyến"} · {sync.coach??"Chưa phân công HLV"}</>}</span><span role="status">{offline?"Mất kết nối đồng bộ · đang thử lại":sync?.scenario&&sync?.syncedAt?`Đã đồng bộ ${new Date(sync.syncedAt).toLocaleTimeString("vi-VN")}`:"Chưa chọn kịch bản chung · vào Quản lý kịch bản"}</span><Link href="/">Xem cả 3 gói</Link><Link href="/demo">Quản lý kịch bản →</Link></div>;
}
