"use client";

import {useEffect,useState} from "react";
import QRCode from "qrcode";
import type {LocalOrder} from "@/lib/use-local-account";
import {participants} from "@/lib/pilot";
import {latestPreparation,checkInMissing} from "@/lib/preparation";

export default function PreparationPanel({order,busy,act}:{order:LocalOrder;busy:boolean;act:(b:object)=>Promise<boolean>}){
 const people=participants(order);
 const [person,setPerson]=useState(people[0]?.id??"");
 const [operational,setOperational]=useState(false),[marketing,setMarketing]=useState(false),[photo,setPhoto]=useState(false),[parq,setParq]=useState("needs_review"),[self,setSelf]=useState(false),[notice,setNotice]=useState(""),[qr,setQr]=useState("");
 const selected=people.find(p=>p.id===person)??people[0];
 const saved=latestPreparation(order,person),pass=order.checkInPasses?.find(p=>p.participant===person&&Date.parse(p.expiresAt)>Date.now()),check=order.checkIns?.find(p=>p.participant===person);
 useEffect(()=>{setOperational(saved?.operational??false);setMarketing(saved?.marketing??false);setPhoto(saved?.photo??false);setParq(saved?.parq??(selected?.player?"needs_review":"not_applicable"));setSelf(false);setNotice("");},[person,saved?.at,saved?.operational,saved?.marketing,saved?.photo,saved?.parq,selected?.player]);
 const missing=selected?checkInMissing(order,person,selected.player):[];
 const passUrl=pass?`${typeof window!=="undefined"?window.location.origin:""}/check-in?booking=${encodeURIComponent(order.id)}&person=${person}&token=${pass.token}`:"";
 useEffect(()=>{let active=true;setQr("");if(passUrl)QRCode.toDataURL(passUrl,{width:240,margin:2}).then(url=>{if(active)setQr(url);}).catch(()=>{if(active)setNotice("Không tạo được ảnh QR; dùng mã bên dưới.");});return()=>{active=false;};},[passUrl]);
 if(!selected)return <section className="ds-section preparation-panel"><h2>Chuẩn bị & check-in</h2><p>Chưa có thành viên trong booking.</p></section>;
 const ready=order.paid>=order.deposit&&missing.length===0;
 return <section className="ds-section pilot-form preparation-panel">
  <header className="preparation-heading"><span className="ds-eyebrow">TRƯỚC CHUYẾN ĐI</span><h2>Chuẩn bị & check-in</h2><p>Hoàn tất thông tin cho từng thành viên, sau đó lấy mã check-in cá nhân.</p></header>
  <div className={`preparation-status${ready?" is-ready":""}`} role="status"><strong>{order.paid<order.deposit?"Chờ xác nhận tiền cọc":ready?"Đã sẵn sàng check-in":`${missing.length} mục còn thiếu`}</strong>{order.paid>=order.deposit&&missing.length>0&&<span>{missing.slice(0,2).join(" · ")}{missing.length>2?` · +${missing.length-2} mục khác`:""}</span>}</div>
  <label className="preparation-person">Thành viên<select value={person} onChange={e=>setPerson(e.target.value)}>{people.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label>
  {selected.player?<section className="preparation-card"><h3>PAR-Q+</h3><p>Tự hoàn tất biểu mẫu sức khỏe chính thức; không nhập câu trả lời y tế vào ứng dụng.</p><a className="ds-link" href="https://eparmedx.com/" target="_blank" rel="noreferrer">Mở biểu mẫu PAR-Q+</a><label>Trạng thái<select value={parq} onChange={e=>setParq(e.target.value)}><option value="needs_review">Chưa hoàn tất hoặc cần tham vấn</option><option value="declared">Đã hoàn tất các bước được yêu cầu</option></select></label><small>Đây là tự khai, không thay cho xác nhận y tế.</small></section>:<section className="preparation-card"><h3>Người đi cùng</h3><p>Không cần khai PAR-Q+ cho tennis. Hoạt động vận động tùy chọn được tư vấn riêng.</p></section>}
  <form className="preparation-card preparation-consents" onSubmit={async e=>{e.preventDefault();setNotice("");if(await act({action:"savePreparation",id:order.id,participant:person,operational,marketing,photo,parq:selected.player?parq:"not_applicable",self}))setNotice("Đã lưu lựa chọn cho thành viên này.");}}>
   <h3>Quyền riêng tư & đồng thuận</h3><p>Mỗi người tự khai và chọn đồng thuận cho chính mình.</p><fieldset disabled={busy}>
    <label className="pilot-check"><input type="checkbox" checked={operational} onChange={e=>setOperational(e.target.checked)}/><span>Lưu mã thành viên và trạng thái chuẩn bị/check-in để điều phối chuyến đi. Không lưu hồ sơ y tế.</span></label>
    <details className="preparation-optional"><summary>Tùy chọn</summary><label className="pilot-check"><input type="checkbox" checked={marketing} onChange={e=>setMarketing(e.target.checked)}/><span>Nhận thông tin tour và ưu đãi</span></label><label className="pilot-check"><input type="checkbox" checked={photo} onChange={e=>setPhoto(e.target.checked)}/><span>Cho phép sử dụng hình ảnh chuyến đi</span></label></details>
    <label className="pilot-check preparation-self"><input type="checkbox" checked={self} onChange={e=>setSelf(e.target.checked)}/><span>Tôi tự khai cho chính mình và đã đọc mục đích xử lý.</span></label>
    <button className="ds-cta" disabled={!self}>Lưu đồng thuận</button>
   </fieldset>
  </form>
  {saved&&<p className="preparation-saved">Đã lưu {new Date(saved.at).toLocaleString("vi-VN")} · Điều phối: {saved.operational?"Đồng ý":"Chưa đồng ý"} · Tiếp thị: {saved.marketing?"Đồng ý":"Không"} · Hình ảnh: {saved.photo?"Đồng ý":"Không"}.</p>}
  <section className="preparation-card preparation-checkin"><h3>Check-in cá nhân</h3>{check?<p role="status">Đã check-in {new Date(check.at).toLocaleString("vi-VN")}.</p>:<button className="ds-link" disabled={busy||order.paid<order.deposit} onClick={async()=>{setNotice("");if(await act({action:"checkInPass",id:order.id,participant:person}))setNotice("Mã check-in có hiệu lực 24 giờ.");}}>Lấy mã check-in</button>}{qr&&<div className="preparation-qr"><img src={qr} width={200} height={200} alt="Mã QR check-in cá nhân"/><p>Mã có hiệu lực đến {new Date(pass!.expiresAt).toLocaleString("vi-VN")}.</p><p className="ds-caption">Chỉ đưa mã cho nhân sự check-in.</p><input readOnly aria-label="Mã check-in để nhập tại bàn" value={passUrl} onFocus={e=>e.target.select()}/></div>}{check&&!qr&&<p>Trạng thái check-in đã được lưu cho thành viên này.</p>}</section>
  <p className="preparation-notice" role="status">{notice}</p>
 </section>;
}