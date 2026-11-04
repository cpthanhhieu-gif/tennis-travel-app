"use client";
import { useState } from "react";
export default function DemoExploreEntry({ mode="explore", dashboard=false }: { mode?:"explore"|"scenario";dashboard?:boolean }) {
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 async function enter(){setBusy(true);setError("");try{const r=await fetch("/api/demo-explore",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode})});const b=await r.json();if(!r.ok)throw Error(b.error||"Chưa đổi được chế độ.");window.location.assign(dashboard?`/operations${window.location.hash}`:mode==="explore"?"/?ace=open":"/demo#scenarios");}catch(e){setError(e instanceof Error?e.message:"Chưa mở được chế độ.");setBusy(false);}}
 return <span className="inline-flex flex-col gap-[0.4rem]"><button type="button" disabled={busy} onClick={()=>void enter()} className="ds-link min-h-[4.4rem]">{busy?"Đang mở…":mode==="explore"?dashboard?"Xem booking khám phá tự do":"Khám phá tự do cùng Ace":"Xem booking kịch bản"}</button>{error&&<span role="alert" className="text-[1.2rem]">{error}</span>}</span>;
}
