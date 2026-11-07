"use client";

import {useMemo,useState} from "react";
import {BedDouble,Dumbbell,HeartPulse,Map,Plus,Minus,Ticket} from "lucide-react";
import type {AncillarySelection,AncillaryService} from "@/lib/ancillary-catalog";
import {formatVND} from "@/lib/mock-data";

type Category="all"|"rooms"|"tennis"|"wellness"|"experiences";
const tabs:{id:Category;label:string}[]=[{id:"all",label:"Tất cả"},{id:"rooms",label:"Phòng"},{id:"tennis",label:"Tennis"},{id:"wellness",label:"Sức khỏe"},{id:"experiences",label:"Trải nghiệm"}];
function categoryFor(item:AncillaryService):Category{
 if(item.unit==="room")return "rooms";
 if(item.id.includes("ace-check")||item.id.includes("spa"))return "wellness";
 if(item.id.includes("ambassador")||item.id.includes("ace-lab")||item.id.includes("pickleball"))return "tennis";
 return "experiences";
}
function iconFor(category:Category){
 if(category==="rooms")return BedDouble;
 if(category==="tennis")return Dumbbell;
 if(category==="wellness")return HeartPulse;
 return category==="experiences"?Ticket:Map;
}
function unitLabel(unit:AncillaryService["unit"]){return ({room:"phòng/tour",hour:"giờ",visit:"lần", "player-session":"người/buổi"})[unit];}

export default function BookingAncillaryPicker({packageId,guests,selections,onChange,catalog,onCatalogRetry,loading,error}:{packageId:string;guests:number;selections:AncillarySelection[];onChange:(next:AncillarySelection[])=>void;catalog:AncillaryService[];onCatalogRetry:()=>void;loading:boolean;error:string}){
 const [tab,setTab]=useState<Category>("all");
 const available=useMemo(()=>catalog.filter(item=>item.packageIds.includes(packageId)),[catalog,packageId]);
 const filtered=tab==="all"?available:available.filter(item=>categoryFor(item)===tab);
 const visibleTabs=tabs.filter(item=>item.id==="all"||available.some(service=>categoryFor(service)===item.id));
 function quantity(id:string){return selections.find(item=>item.id===id)?.quantity??0;}
 function setQuantity(service:AncillaryService,next:number){
  if(service.id.startsWith("phu-quoc-room-")&&next>0){
   onChange([...selections.filter(item=>!item.id.startsWith("phu-quoc-room-")&&item.id!==service.id),{id:service.id,quantity:Math.min(next,guests*service.maxPerGuest)}]);
   return;
  }
  onChange(next<1?selections.filter(item=>item.id!==service.id):[...selections.filter(item=>item.id!==service.id),{id:service.id,quantity:Math.min(next,guests*service.maxPerGuest)}]);
 }
 if(loading)return <section className="ancillary-panel" aria-label="Dịch vụ mua thêm" aria-busy="true"><header><div><span className="ds-eyebrow">TÙY CHỌN THÊM THEO TOUR</span><h3>Thêm trải nghiệm cho chuyến đi</h3></div></header><p className="ancillary-empty" role="status">Đang tải dịch vụ và giá…</p></section>;
 if(error)return <section className="ancillary-panel" aria-label="Dịch vụ mua thêm"><header><div><span className="ds-eyebrow">TÙY CHỌN THÊM THEO TOUR</span><h3>Thêm trải nghiệm cho chuyến đi</h3></div></header><p className="ancillary-empty" role="alert">{error}</p><button type="button" className="ui-text-button" onClick={onCatalogRetry}>Thử tải lại</button></section>;
 if(!catalog.length)return <section className="ancillary-panel" aria-label="Dịch vụ mua thêm"><header><div><span className="ds-eyebrow">CÁ NHÂN HÓA CHUYẾN ĐI</span><h3>Dịch vụ mua thêm</h3></div></header><p className="ancillary-empty" role="status">Danh mục dịch vụ đang tạm ẩn.</p><button type="button" className="ui-text-button" onClick={onCatalogRetry}>Tải lại danh mục</button></section>;
 return <section className="ancillary-panel" aria-label="Chọn dịch vụ mua thêm">
  <header className="ancillary-panel-heading"><div><span className="ds-eyebrow">TÙY CHỌN THÊM THEO TOUR</span><h3>Thêm trải nghiệm cho chuyến đi</h3><p>Chỉ trả thêm cho dịch vụ bạn chọn. Quyền lợi đã nằm trong gói được giữ nguyên.</p></div><span className="ancillary-count">{selections.reduce((sum,item)=>sum+item.quantity,0)} mục</span></header>
  <nav className="ancillary-tabs" aria-label="Nhóm dịch vụ">{visibleTabs.map(item=><button type="button" key={item.id} aria-pressed={tab===item.id} onClick={()=>setTab(item.id)}>{item.label}</button>)}</nav>
  <div className="ancillary-track" aria-label="Danh sách dịch vụ cuộn ngang">{filtered.map(service=>{
   const category=categoryFor(service),Icon=iconFor(category),qty=quantity(service.id),inactive=service.status==="inactive",max=guests*service.maxPerGuest;
   return <article className={`ancillary-card${qty?" is-selected":""}${inactive?" is-unavailable":""}`} key={service.id}>
    <div className="ancillary-card-top"><span className="ancillary-card-icon"><Icon size={19} aria-hidden="true"/></span><span className={`ancillary-status ${inactive?"is-muted":service.status==="provisional"?"is-estimate":""}`}>{inactive?"Chưa mở":service.status==="provisional"?"Giá dự toán":"Theo hồ sơ"}</span></div>
    <h4>{service.name}</h4><p className="ancillary-price">{formatVND(service.unitPrice)} <small>/ {unitLabel(service.unit)}</small></p>
    {service.note&&<p className="ancillary-note">{service.note}</p>}
    <details><summary>Giá và điều kiện</summary><p>{service.priceBasis}</p><p>{service.changeCancellation}</p></details>
    {inactive?<button type="button" disabled className="ancillary-unavailable-button">Chưa thể thêm</button>:<div className="ancillary-stepper" role="group" aria-label={`Số lượng ${service.name}`}>
     <button type="button" aria-label={`Bớt ${service.name}`} disabled={qty===0} onClick={()=>setQuantity(service,qty-1)}><Minus size={16} aria-hidden="true"/></button>
     <span aria-live="polite">{qty===0?"Thêm":qty}</span>
     <button type="button" aria-label={`Thêm ${service.name}`} disabled={qty>=max} onClick={()=>setQuantity(service,qty+1)}><Plus size={16} aria-hidden="true"/></button>
    </div>}
   </article>;
  })}</div>
  {!available.length&&<p className="ancillary-empty">Tour này hiện chưa có dịch vụ mua thêm được cấu hình.</p>}
  <p className="ancillary-scroll-hint">Vuốt ngang để xem thêm dịch vụ <span aria-hidden="true">→</span></p>
 </section>;
}
