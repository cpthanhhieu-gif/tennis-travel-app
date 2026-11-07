"use client";

import {useEffect,useState} from "react";
import {CarFront,Check,Clock3,MapPin,Plus,Route} from "lucide-react";
import type {AncillarySelection,AncillaryService} from "@/lib/ancillary-catalog";
import {formatVND} from "@/lib/mock-data";

export default function BookingTripAddOnPicker({packageId,guests,departureDate,selections,onChange}:{packageId:string;guests:number;departureDate:string;selections:AncillarySelection[];onChange:(next:AncillarySelection[])=>void}){
 const [catalog,setCatalog]=useState<AncillaryService[]>([]),[catalogState,setCatalogState]=useState<"loading"|"ready"|"error">("loading"),[attempt,setAttempt]=useState(0);
 useEffect(()=>{if(packageId!=="sbu1"){setCatalogState("ready");return;}let active=true;setCatalogState("loading");fetch("/api/local",{cache:"no-store"}).then(async response=>{const data=await response.json();if(!response.ok)throw Error("catalog");return data;}).then(data=>{if(active){setCatalog(Array.isArray(data.serviceCatalog)?data.serviceCatalog:[]);setCatalogState("ready");}}).catch(()=>{if(active)setCatalogState("error");});return()=>{active=false;}},[attempt,packageId]);
 const options=catalog.filter(item=>item.packageIds.includes(packageId)&&item.unit==="vehicle"&&item.status!=="inactive");
 if(catalogState==="loading")return <section className="trip-addon-panel" aria-labelledby="trip-addon-title" aria-busy="true"><header className="trip-addon-heading"><div><span className="ds-eyebrow">CÁ NHÂN HÓA HÀNH TRÌNH</span><h3 id="trip-addon-title">Thêm cho chuyến đi</h3></div></header><p className="trip-addon-message" role="status">Đang tải lựa chọn xe và giá…</p></section>;
 if(catalogState==="error")return <section className="trip-addon-panel" aria-labelledby="trip-addon-title"><header className="trip-addon-heading"><div><span className="ds-eyebrow">CÁ NHÂN HÓA HÀNH TRÌNH</span><h3 id="trip-addon-title">Thêm cho chuyến đi</h3></div></header><p className="trip-addon-message" role="alert">Chưa tải được giá xe đưa đón.</p><button className="ui-text-button" type="button" onClick={()=>setAttempt(value=>value+1)}>Thử tải lại</button></section>;
 if(!options.length)return null;
 const selected=options.find(option=>selections.some(item=>item.id===option.id));
 const date=departureDate?new Intl.DateTimeFormat("vi-VN",{day:"numeric",month:"long",year:"numeric"}).format(new Date(`${departureDate}T12:00:00`)):"Ngày tour đã chọn";
 const toggle=(id:string,capacity:number)=>{
  if(selected?.id===id){onChange(selections.filter(item=>item.id!==id));return;}
  onChange([...selections.filter(item=>!options.some(option=>option.id===item.id)),{id,quantity:Math.max(1,Math.ceil(guests/capacity))}]);
 };
 return <section className="trip-addon-panel" aria-labelledby="trip-addon-title">
  <header className="trip-addon-heading"><div><span className="ds-eyebrow">CÁ NHÂN HÓA HÀNH TRÌNH</span><h3 id="trip-addon-title">Thêm cho chuyến đi</h3><p>Tour tennis vẫn là trải nghiệm chính. Chọn xe phù hợp với nhóm của bạn.</p></div>{selected&&<span className="trip-addon-selected"><Check size={14}/> Đã thêm</span>}</header>
  <div className="trip-addon-rail" aria-label="Các lựa chọn xe đưa đón, cuộn ngang">{options.map(option=>{
   const active=selected?.id===option.id,quantity=active?selections.find(item=>item.id===option.id)?.quantity??1:Math.max(1,Math.ceil(guests/(option.vehicleCapacity??1)));
   return <article className={`trip-addon-card${active?" is-selected":""}`} key={option.id}>
    <div className="trip-addon-card-top"><span className="trip-addon-icon"><CarFront size={21}/></span><span className="trip-addon-kind">ĐƯA ĐÓN SÂN BAY</span></div>
    <h4>{option.name}</h4><strong className="trip-addon-price">{formatVND(option.unitPrice)} <small>/ xe / chiều</small></strong>
    <p className="trip-addon-route"><MapPin size={15}/> Liên Khương ↔ trung tâm Đà Lạt</p>
    <p className="trip-addon-time"><Clock3 size={15}/> {option.durationLabel}</p>
    <p className="trip-addon-meta">Tối đa {option.vehicleCapacity} khách/xe · Đã gồm VAT</p>
    <p className="trip-addon-meta">Ngày {date}</p>
    {active&&quantity>1&&<p className="trip-addon-quantity">{quantity} xe · {formatVND(quantity*option.unitPrice)}</p>}
    <button type="button" className={`trip-addon-action${active?" is-added":""}`} aria-pressed={active} onClick={()=>toggle(option.id,option.vehicleCapacity??1)}>{active?<><Check size={16}/> Đã thêm · Bỏ chọn</>:<><Plus size={16}/> Thêm cho chuyến đi</>}</button>
   </article>;
  })}</div>
  <p className="trip-addon-footnote"><Route size={14}/> Giá pilot ban ngày; chưa gồm phụ thu giờ đêm/ngày lễ. Chưa kết nối tồn xe trực tiếp.</p>
 </section>;
}
