import {tours} from "./mock-data";
import {tripItinerary,type Activity} from "./trip-itinerary";
export type TrainingGroup={key:string;name:string;ntrpMin:number;ntrpMax:number;coach:string;court:number;players:{name:string;ntrp:number}[]};
export type GroupChange={id:string;reason:string;status:"pending"|"accepted"|"declined";createdAt:string;resolvedAt?:string;resolution?:string};
export type GroupOrder={tourId:string;departureCode:string;ntrpLevel?:number;trainingGroup?:{key:string;assignedAt:string};activityUpdates?:Record<string,{location:string}>};
const names=["Minh Anh","Quang Huy","Thu Hà","Bảo Ngọc","Gia Bảo","Hoàng Nam"];
const data:Record<string,TrainingGroup[]>={
 sbu1:[{key:"leisure-foundation",name:"Foundation — Làm quen tennis",ntrpMin:1.5,ntrpMax:2.5,coach:"HLV Minh An",court:1,players:names.slice(0,5).map((name,i)=>({name,ntrp:i%2?2:1.5}))},{key:"leisure-rally",name:"Rally — Củng cố kỹ thuật",ntrpMin:2.5,ntrpMax:3.5,coach:"HLV Thanh Trúc",court:2,players:names.slice(0,5).map((name,i)=>({name,ntrp:i%2?3:2.5}))}],
 sbu2:[{key:"club-doubles",name:"Club Doubles — Phối hợp đánh đôi",ntrpMin:2.5,ntrpMax:3.5,coach:"HLV Quốc Bình",court:1,players:names.map((name,i)=>({name,ntrp:i%2?3.5:3}))},{key:"club-match",name:"Match Play — Chiến thuật thi đấu",ntrpMin:3.5,ntrpMax:4.5,coach:"HLV Hoàng Phúc",court:2,players:[...names].reverse().map((name,i)=>({name,ntrp:i%2?4:3.5}))}],
 sbu3:[{key:"premium-performance",name:"Performance — Hoàn thiện kỹ thuật",ntrpMin:3.5,ntrpMax:4.5,coach:"HLV Tuấn Khang",court:1,players:names.slice(0,4).map((name,i)=>({name,ntrp:i%2?4:3.5}))},{key:"premium-proam",name:"Pro-Am — Nâng cao chiến thuật",ntrpMin:4,ntrpMax:5,coach:"HLV Ngọc Mai",court:2,players:names.slice(0,4).map((name,i)=>({name,ntrp:i%2?4.5:4}))}]
};
export function trainingGroups(order:{tourId:string}){const t=tours.find(t=>t.id===order.tourId);return data[t?.packageId??""]??[];}
export function selectedTrainingGroup(order:GroupOrder){return trainingGroups(order).find(g=>g.key===order.trainingGroup?.key);}
export function sessionAssignment(order:GroupOrder,activity:Activity){
 const g=selectedTrainingGroup(order);if(!g||!["court","clinic","competition"].includes(activity.kind))return null;
 const t=tours.find(t=>t.id===order.tourId)!;const base=tripItinerary(order).flatMap(d=>d.activities).find(a=>a.id===activity.id);const override=order.activityUpdates?.[activity.id]?.location;
 return {coach:g.coach,court:override&&override!==base?.location?override:`${t.destinationName} · Sân số ${g.court}`,group:g.name};
}
