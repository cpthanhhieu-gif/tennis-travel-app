import {mkdir,readFile,writeFile,rename} from "node:fs/promises";
import path from "node:path";
import {isScenarioId,type ScenarioId} from "./demo-scope";
import {tours,getNtrpLevel} from "./mock-data";
import {coupleTotal,companionRate} from "./couple-pricing";
export function storeDirectory(scope?:string){return isScenarioId(scope)?path.join(process.cwd(),".local-data","scenarios",scope):path.join(process.cwd(),".local-data");}
export function seedScenario(id:ScenarioId){
 const profile={name:({personal:"Khách Cá nhân Demo",couple:"Khách Cặp Đôi Demo",club:"Đại diện CLB Demo",returning:"Khách Sau Tour Demo"})[id],phone:"",email:""};
 const level=id==="couple"?3.5:id==="returning"?3.5:null;
 const t=tours.find(t=>t.packageId===(id==="club"?"sbu2":"sbu1"))!;const d=t.departureSchedules[0];
 const count=id==="club"?16:1,total=coupleTotal(t.packageId,d.price,count,0);
 const completedAt=new Date().toISOString();
 const order={id:`demo-${id}-primary`,key:`demo-${id}-primary`,tourId:t.id,name:profile.name,departureCode:d.code,numPeople:count,numCompanions:0,playerRate:d.price,companionRate:companionRate(t.packageId),total,deposit:Math.round(total*(id==="club"?.5:.3)),paid:id==="returning"?total:0,status:id==="returning"?"Đã hoàn thành":"Chờ báo giá đoàn",payment:id==="returning"?"success":"pending",points:id==="returning"?Math.floor(total*2/100000):0,...(id==="returning"?{startedAt:completedAt,completedAt,ntrpLevel:3.5,ntrpLabel:getNtrpLevel(3.5).label}:{})};
 return {sessions:{},profile,orders:id==="club"||id==="returning"?[order]:[],ledger:id==="returning"?[{key:`${order.id}:tour`,orderId:order.id,kind:"tour",amount:order.points,createdAt:completedAt}]:[],...(level?{ntrpProfile:{level,label:getNtrpLevel(level).label,assessedAt:completedAt}}:{}),demo:{scenario:id,seedVersion:1,createdAt:completedAt,bookingPreset:id==="couple"?{packageId:"sbu3",numPeople:2,numCompanions:1}:null}};
}
export async function ensureScenario(id:ScenarioId){const dir=storeDirectory(id);await mkdir(dir,{recursive:true});
 try{await readFile(path.join(dir,"store.json"),"utf8");return;}catch(e){if((e as NodeJS.ErrnoException).code!=="ENOENT")throw e;}
 const seed=JSON.stringify(seedScenario(id));
 try{await writeFile(path.join(dir,"original.json"),seed,{flag:"wx",mode:0o600});}catch(e){if((e as NodeJS.ErrnoException).code!=="EEXIST")throw e;}
 const original=await readFile(path.join(dir,"original.json"),"utf8");
 try{await writeFile(path.join(dir,"store.json"),original,{flag:"wx",mode:0o600});}catch(e){if((e as NodeJS.ErrnoException).code!=="EEXIST")throw e;}
}
export async function resetScenario(id:ScenarioId){await ensureScenario(id);const dir=storeDirectory(id);const original=await readFile(path.join(dir,"original.json"),"utf8");await writeFile(path.join(dir,"reset.tmp"),original,{mode:0o600});await rename(path.join(dir,"reset.tmp"),path.join(dir,"store.json"));}
