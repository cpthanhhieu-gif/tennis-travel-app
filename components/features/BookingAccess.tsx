"use client";
import { useState, type ReactNode } from "react";
import { readAceSession,saveAceSession } from "@/lib/ace-session";
import Button from "@/components/ui/Button";
export function BookingLogin({onSuccess,compact=false}:{onSuccess:()=>void;compact?:boolean}){
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 async function login(){if(busy)return;setBusy(true);setError("");try{const access=await fetch("/api/demo-access",{cache:"no-store"});const a=access.ok?await access.json():null;if(a?.cloud&&a.room==="local"){const session=readAceSession();const setup=await fetch("/api/demo-explore",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"explore"})});if(!setup.ok)throw Error("Chưa mở được phiên khám phá tự do.");if(session)saveAceSession(session);window.dispatchEvent(new Event("demo:mode"));}const r=await fetch("/api/local",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"login"})});const d=await r.json();if(!r.ok||!d.account)throw Error(d.error||"Không đăng nhập được. Vui lòng thử lại.");onSuccess();}catch(e){setError(e instanceof Error?e.message:"Không đăng nhập được. Vui lòng thử lại.");}finally{setBusy(false);}}
 const content=<><p>Lưu thông tin đặt chỗ và theo dõi xác nhận trong Hành trình. Tour, khách và dịch vụ đã chọn sẽ được giữ lại.</p>{error&&<p role="alert">{error}</p>}<Button loading={busy} onClick={login}>Đăng nhập tài khoản thử</Button></>;
 return compact?<div className="booking-login-compact">{content}</div>:<section className="ds-quality"><h2>Đăng nhập để tiếp tục</h2>{content}</section>;
}
export default function BookingAccess({children}:{children:ReactNode}){ return <>{children}</>; }
