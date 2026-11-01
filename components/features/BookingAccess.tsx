"use client";
import { useEffect, useState, type ReactNode } from "react";
import Button from "@/components/ui/Button";
export function BookingLogin({onSuccess}:{onSuccess:()=>void}){
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 async function login(){if(busy)return;setBusy(true);setError("");try{const r=await fetch("/api/local",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"login"})});const d=await r.json();if(!r.ok||!d.account)throw Error(d.error||"Không đăng nhập được. Vui lòng thử lại.");onSuccess();}catch{setError("Không đăng nhập được. Vui lòng thử lại.");}finally{setBusy(false);}}
 return <section className="ds-quality"><h2>Đăng nhập để tiếp tục</h2><p>Lưu thông tin đặt chỗ và theo dõi xác nhận trong Hành trình. Bạn sẽ tiếp tục với gói đã chọn sau khi đăng nhập.</p>{error&&<p role="alert">{error}</p>}<Button loading={busy} onClick={login}>Đăng nhập tài khoản thử</Button></section>;
}
export default function BookingAccess({children}:{children:ReactNode}){
 const [state,setState]=useState<"loading"|"guest"|"ready"|"error">("loading");
 async function check(){setState("loading");try{const r=await fetch("/api/local",{cache:"no-store"});if(!r.ok)throw Error();const d=await r.json();setState(d.account?"ready":"guest");}catch{setState("error");}}
 useEffect(()=>{void check();},[]);
 if(state==="ready")return children;
 return <div className="ds-container ds-booking"><header className="ds-booking-title"><p className="ds-eyebrow">ĐẶT HÀNH TRÌNH</p><h1>Đặt chuyến đi</h1></header>{state==="loading"?<p role="status">Đang kiểm tra đăng nhập…</p>:state==="error"?<div role="alert"><p>Chưa kiểm tra được đăng nhập.</p><Button onClick={check}>Thử lại</Button></div>:<BookingLogin onSuccess={()=>setState("ready")}/>}</div>;
}
