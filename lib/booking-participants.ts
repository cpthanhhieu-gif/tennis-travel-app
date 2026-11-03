export type BookingParticipant={name:string;role:"player"|"companion";roomPreference:string};
export function validBookingParticipants(value:unknown,total:number,companions:number):value is BookingParticipant[]{
 return Array.isArray(value)&&value.length===total&&value.filter(p=>p?.role==="companion").length===companions&&value.every(p=>p&&typeof p.name==="string"&&p.name.trim().length>0&&p.name.length<=100&&(p.role==="player"||p.role==="companion")&&typeof p.roomPreference==="string"&&p.roomPreference.length<=200);
}
