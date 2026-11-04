import { tours, packageCapacity } from "./mock-data";
import { coupleTotal } from "./couple-pricing";
import { bookingSource, initialParty } from "./booking-entry";
import type { ScenarioId } from "./demo-scope";
import type { BookingState, NtrpQuizState } from "./BookingContext";
export function initializeBooking(params: URLSearchParams, exploring: boolean, scenario: ScenarioId | undefined, defaults: BookingState, raw: string | null) {
 const source=bookingSource(params.get("from")==="ace",exploring,scenario);
 const t=tours.find(t=>(!params.get("package")||t.packageId===params.get("package"))&&(!params.get("destination")||t.destinationId===params.get("destination")))??tours[0];
 let party=initialParty(source,t.packageId,scenario);
 const players=Number(params.get("players")),companions=Number(params.get("companions"));
 if(params.has("players")&&Number.isInteger(players)&&players>=1&&Number.isInteger(companions)&&companions>=0&&players+companions<=packageCapacity(t.packageId))party={numPeople:players+companions,numCompanions:companions};
 else if(t.packageId==="sbu3"&&params.get("couple")==="1")party={numPeople:2,numCompanions:1};
 const d=t.departureSchedules.find(d=>d.code===params.get("departure"))??t.departureSchedules[0];
 let booking:BookingState={...defaults,...party,entrySource:source,originScenario:scenario,tourId:t.id,packageId:t.packageId,destination:t.destinationId,departureCode:d.code,departureDate:d.date,referralToken:params.get("ref")??"",totalPrice:coupleTotal(t.packageId,d.price,party.numPeople,party.numCompanions)};
 if(t.packageId==="sbu2"&&source!=="scenario")booking.groupRequest={min:Math.max(8,party.numPeople),max:Math.max(8,party.numPeople),dates:[d.date,""],budget:d.price,format:"Đánh đôi",courts:4,gala:true,companions:party.numCompanions};
 let quiz:Partial<NtrpQuizState>|undefined;let step=1,restored=false;let draftConflict:{savedDate:string;requestedDate:string}|undefined;
 try{const saved=JSON.parse(raw??"null");const tour=tours.find(t=>t.id===saved?.booking?.tourId);const schedule=tour?.departureSchedules.find(d=>d.code===saved?.booking?.departureCode);
 if(saved?.version===1&&tour&&schedule&&Number.isInteger(saved.booking.numPeople)&&saved.booking.numPeople>=1&&saved.booking.numPeople<=packageCapacity(tour.packageId)){
 if(params.has("departure")&&t.departureSchedules.some(x=>x.code===params.get("departure"))&&(tour.id!==t.id||schedule.code!==d.code))draftConflict={savedDate:schedule.dateLabel,requestedDate:d.dateLabel};
 const b=saved.booking;const c=Number.isInteger(b.numCompanions)&&b.numCompanions>=0&&b.numCompanions<b.numPeople?b.numCompanions:0;
 booking={...booking,...b,entrySource:source,originScenario:scenario,tourId:tour.id,packageId:tour.packageId,destination:tour.destinationId,departureCode:schedule.code,departureDate:schedule.date,numCompanions:c,notes:typeof b.notes==="string"?b.notes.slice(0,2000):"",totalPrice:coupleTotal(tour.packageId,schedule.price,b.numPeople,c)};
 if(saved.quiz?.answers&&typeof saved.quiz.answers==="object")quiz=saved.quiz;
 if(Number.isInteger(saved.step)&&saved.step>=1&&saved.step<=4)step=tour.packageId==="sbu2"&&saved.step===2?3:saved.step;
 restored=true;
 }}catch{}
 return {booking,quiz,step,restored,draftConflict};
}
export function bookingDraftName(params:URLSearchParams){return `tennis-booking-draft-v2:${params.get("package")??"all"}:${params.get("destination")??"all"}:${params.get("ref")??"direct"}:${params.get("from")==="ace"?`ace:${params.get("consultation")??"current"}`:"normal"}`;}
