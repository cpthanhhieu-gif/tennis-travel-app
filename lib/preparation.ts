export const PREP_VERSION="prep-v1";
export type PreparationRecord={participant:string;operational:boolean;marketing:boolean;photo:boolean;parq:"declared"|"needs_review"|"not_applicable";at:string;version:"prep-v1"};
export type PreparationFields={preparation?:PreparationRecord[];checkInPasses?:{participant:string;token:string;expiresAt:string}[];checkIns?:{participant:string;at:string;source:"test-controls"}[]};
export function latestPreparation(o:PreparationFields,participant:string){return [...(o.preparation??[])].reverse().find(p=>p.participant===participant);}
export function preparationReady(o:PreparationFields,participant:string,player:boolean){const p=latestPreparation(o,participant);return !!p?.operational&&(!player||p.parq==="declared");}

export function checkInMissing(o:PreparationFields&{paid:number;deposit:number},participant:string,player:boolean){
 const missing:string[]=[];const p=latestPreparation(o,participant);
 if(o.paid<o.deposit)missing.push("Thanh toán đủ tiền cọc");
 if(!p?.operational)missing.push("Lưu đồng thuận điều phối trong tab Chuẩn bị");
 if(player&&p?.parq!=="declared")missing.push("Hoàn tất và lưu trạng thái tự khai PAR-Q+ trong tab Chuẩn bị");
 return missing;
}
