export const SERVICE_RIGHTS=[
["court","3 buổi sân trong Court Hours"],["ambassador","HLV đại sứ 1 buổi"],["cup","Giải Ace Cup"],["meals","5 bữa FEI gồm 1 private dining"],["spa","1 spa recovery"],["kit","Recovery kit"],["passport","Tennis Passport"],["insurance","Bảo hiểm thể thao"],["app","App & share card"]
] as const;
export type ServiceRight={key:string;detail:string;confirmed:boolean};
export type ServicePlan={id:string;publishedAt:string;schedule:string;rights:ServiceRight[];insurance:{provider:string;coverage:string;limits:string;exclusions:string;contact:string};kitContents:string;kitPickup:string};
export type ServiceFields={servicePlan?:ServicePlan;insuranceIssue?:{reference:string;documentUrl:string;issuedAt:string;planId:string};kitHandovers?:{participant:string;recipient:string;deliveredAt:string;receivedAt?:string;planId:string}[]};
const text=(v:unknown,max=2000)=>typeof v==="string"&&v.trim().length>0&&v.length<=max;
export function validServicePlan(v:unknown):v is ServicePlan{
 if(!v||typeof v!=="object")return false;const p=v as ServicePlan;
 return text(p.schedule)&&text(p.kitContents)&&text(p.kitPickup)&&!!p.insurance&&[p.insurance.provider,p.insurance.coverage,p.insurance.limits,p.insurance.exclusions,p.insurance.contact].every(s=>text(s))&&Array.isArray(p.rights)&&p.rights.length===SERVICE_RIGHTS.length&&SERVICE_RIGHTS.every(([key])=>p.rights.filter(r=>r?.key===key&&r.confirmed===true&&text(r.detail,1000)).length===1);
}
export function safeDocumentUrl(v:unknown){if(typeof v!=="string"||v.length>2000)return false;try{const u=new URL(v);return u.protocol==="https:"&&!u.username&&!u.password;}catch{return false;}}
