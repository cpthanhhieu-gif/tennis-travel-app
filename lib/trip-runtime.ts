import {tripItinerary} from "./trip-itinerary";
export type ActivityStatus="upcoming"|"live"|"done"|"changed"|"cancelled";
export const activityStatusLabels:Record<ActivityStatus,string>={upcoming:"Sắp tới",live:"Đang diễn ra",done:"Hoàn tất",changed:"Đổi lịch",cancelled:"Hủy"};
export type ActivityUpdate={status:ActivityStatus;time:string;location:string;reason:string;updatedAt:string};
export type TripNotice={id:string;activityId:string;reason:string;createdAt:string;seenAt?:string;before:{time:string;location:string;status:ActivityStatus};after:{time:string;location:string;status:ActivityStatus}};
export type RuntimeOrder={tourId:string;departureCode:string;startedAt?:string;completedAt?:string;activityUpdates?:Record<string,ActivityUpdate>;notices?:TripNotice[]};
export function effectiveItinerary(order:RuntimeOrder){return tripItinerary(order).map(d=>({...d,activities:d.activities.map(a=>({...a,...order.activityUpdates?.[a.id],status:order.activityUpdates?.[a.id]?.status??"upcoming" as ActivityStatus})).sort((a,b)=>a.time.localeCompare(b.time))}));}
export function currentAndNext(order:RuntimeOrder){
 const items=effectiveItinerary(order).flatMap(d=>d.activities.map(a=>({...a,day:d.day,date:d.date})));
 if(order.completedAt)return {current:undefined,next:undefined};
 const current=order.startedAt?items.find(a=>a.status==="live"):undefined;
 const candidates=items.filter(a=>!a.optional&&!["done","cancelled","live"].includes(a.status));
 const anchor=current?items.indexOf(current):Math.max(-1,...items.map((a,i)=>a.status==="done"?i:-1));
 const next=candidates.find(a=>items.indexOf(a)>anchor);
 // Filter creates a new array but retains item references.
 return {current,next};
}
export function validActivityTime(value:string){
 if(!/^\d{2}:\d{2}(?:[–-]\d{2}:\d{2})?$/.test(value))return false;
 const parts=value.split(/[–-]/).map(t=>t.split(":").map(Number));
 if(!parts.every(([h,m])=>h<24&&m<60))return false;
 return parts.length===1||parts[1][0]*60+parts[1][1]>parts[0][0]*60+parts[0][1];
}
