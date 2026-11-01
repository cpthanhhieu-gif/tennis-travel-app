import {tripItinerary} from "./trip-itinerary";
export const FEI_CRITERIA=[{key:"NPI",label:"Dinh dưỡng theo nhịp vận động"},{key:"LAI",label:"Bản sắc ẩm thực địa phương"},{key:"EII",label:"Mức độ tham gia trải nghiệm"},{key:"RWI",label:"Hỗ trợ nghỉ ngơi và phục hồi"},{key:"LPI",label:"Cá nhân hóa bữa ăn"}] as const;
export type FeiScores=Record<typeof FEI_CRITERIA[number]["key"],number>;
export type FeiResponse={participant:string;mealId:string;scores:FeiScores;score:number;version:"fei-pilot-v1";at:string};
export type NpsResponse={participant:string;score:number;reason:string;at:string;version:"nps-v1"};
export type PilotFields={feiResponses?:FeiResponse[];npsResponses?:NpsResponse[]};
export function participants(o:{numPeople:number;numCompanions?:number}){const players=o.numPeople-(o.numCompanions??0);return Array.from({length:o.numPeople},(_,i)=>({id:i<players?`p${i+1}`:`c${i-players+1}`,label:i<players?`Người chơi ${i+1}`:`Người đi cùng ${i-players+1}`,player:i<players}));}
export function surveyMeals(o:{tourId:string;departureCode:string}){return tripItinerary(o).flatMap(d=>d.activities.filter(a=>a.kind==="fei"||a.kind==="meal").map(a=>({...a,day:d.day,date:d.date})));}
export function validFei(value:unknown):value is FeiScores{return !!value&&typeof value==="object"&&Object.keys(value).length===5&&FEI_CRITERIA.every(c=>{const v=(value as Record<string,unknown>)[c.key];return typeof v==="number"&&Number.isInteger(v)&&v>=0&&v<=100;});}
export function feiMean(scores:FeiScores){return FEI_CRITERIA.reduce((sum,c)=>sum+scores[c.key],0)/5;}
