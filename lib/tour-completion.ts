import {tripItinerary} from "./trip-itinerary";
import {tours} from "./mock-data";
import type {LocalOrder} from "./use-local-account";
export function completionWarnings(o:Pick<LocalOrder,"tourId"|"departureCode"|"activityUpdates"|"numPeople"|"numCompanions"|"checkIns"|"insuranceIssue"|"kitHandovers"|"servicePlan">):string[]{
 const warnings:string[]=[];
 const pending=tripItinerary(o).flatMap(d=>d.activities).filter(a=>!a.optional&&!["done","cancelled"].includes(o.activityUpdates?.[a.id]?.status??"upcoming"));
 if(pending.length)warnings.push(`${pending.length} hoạt động bắt buộc chưa kết thúc: ${pending.map(a=>a.title).join(", ")}`);
 const checked=new Set(o.checkIns?.map(p=>p.participant));
 const players=o.numPeople-(o.numCompanions??0);
 const missing=Array.from({length:o.numPeople},(_,i)=>i<players?`p${i+1}`:`c${i-players+1}`).filter(id=>!checked.has(id));
 if(missing.length)warnings.push(`${missing.length} khách chưa được ghi nhận check-in.`);
 if(tours.find(t=>t.id===o.tourId)?.packageId==="sbu3"){
  if(!o.insuranceIssue||o.insuranceIssue.planId!==o.servicePlan?.id)warnings.push("Chưa có chứng từ bảo hiểm của phương án hiện tại.");
  const kits=Array.from({length:players},(_,i)=>`p${i+1}`).filter(id=>!o.kitHandovers?.some(k=>k.participant===id&&k.planId===o.servicePlan?.id&&k.receivedAt));
  if(kits.length)warnings.push(`${kits.length} người chơi chưa xác nhận nhận kit.`);
 }
 return warnings;
}
