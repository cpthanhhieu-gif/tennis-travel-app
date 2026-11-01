import {randomUUID} from "node:crypto";
import {readDocument,writeDocument,withStorage,cloudMode} from "./cloud-store";
import {NextRequest} from "next/server";
import type {GroupRequest,GroupQuote} from "./group-request";
export type GroupPlan={token:string;tourName:string;request:GroupRequest;quote:GroupQuote;deadline:string;responses:Record<string,{dates:string[];status:"interested"|"joining"}>};

export async function getGroupPlan(token:string):Promise<GroupPlan|null>{if(!/^[a-f0-9-]{36}$/.test(token))return null;return readDocument<GroupPlan>(`global/group-plans/${token}`);}
export async function publishGroupPlan(input:Omit<GroupPlan,"token"|"responses">&{token?:string}){const p={...input,token:input.token??randomUUID(),responses:{}} as GroupPlan;await writeDocument(`global/group-plans/${p.token}`,p);return p.token;}
let queue:Promise<unknown>=Promise.resolve();
export async function respondGroupPlan(token:string,key:string,dates:string[],status:string){const run=()=>withStorage(new NextRequest("http://localhost"),async()=>{const p=await getGroupPlan(token);if(!p)throw Error("Phương án không tồn tại");if(Date.parse(p.deadline)<=Date.now())throw Error("Đã hết hạn phản hồi");if(!Array.isArray(dates)||!dates.length||dates.length>3||new Set(dates).size!==dates.length||!dates.every(d=>p.request.dates.includes(d))||!["interested","joining"].includes(status))throw Error("Chọn ngày và trạng thái hợp lệ");p.responses[key]={dates,status:status as "interested"|"joining"};await writeDocument(`global/group-plans/${p.token}`,p);});if(cloudMode())return run();const result=queue.then(run,run);queue=result.catch(()=>{});return result;}
export function publicGroupPlan(p:GroupPlan){const r=Object.values(p.responses);return {tourName:p.tourName,request:p.request,quote:p.quote,deadline:p.deadline,responded:r.length,interested:r.filter(v=>v.status==="interested").length,joining:r.filter(v=>v.status==="joining").length,remaining:Math.max(0,p.request.max-r.length),dates:p.request.dates.map(date=>({date,count:r.filter(v=>v.dates.includes(date)).length}))};}
