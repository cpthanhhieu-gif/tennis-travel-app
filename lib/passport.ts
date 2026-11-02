export type PassportStamp={id:string;orderId:string;tourId:string;departureCode:string;tourName:string;destination:string;departureDate:string;completedAt:string;verifiedAt:string;source:"operator-complete"|"operator-review"};
export type PostTripRecord={note:string;nextPackage:string;updatedAt:string};
export type PassportFields={passportStamp?:PassportStamp;postTrip?:PostTripRecord};
type Completion={id:string;tourId:string;departureCode:string;startedAt?:string;completedAt?:string;paid:number;total:number};
export function reliableCompletion(o:Completion){
 const start=Date.parse(o.startedAt??""),end=Date.parse(o.completedAt??"");
 return Number.isFinite(start)&&Number.isFinite(end)&&start<=end&&Number.isSafeInteger(o.total)&&o.total>0&&Number.isSafeInteger(o.paid)&&o.paid>=o.total;
}
export function validPassport(o:Completion&PassportFields){
 const s=o.passportStamp;
 return reliableCompletion(o)&&!!s&&typeof s.id==="string"&&typeof s.destination==="string"&&typeof s.tourName==="string"&&typeof s.departureDate==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(s.departureDate)&&Number.isFinite(Date.parse(s.departureDate))&&s.orderId===o.id&&s.tourId===o.tourId&&s.departureCode===o.departureCode&&s.completedAt===o.completedAt&&Number.isFinite(Date.parse(s.verifiedAt))&&["operator-complete","operator-review"].includes(s.source);
}
