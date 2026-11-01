import {trainingGroups} from "@/lib/training-groups";
import {NextRequest,NextResponse} from "next/server";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {SCENARIO_IDS} from "@/lib/demo-scope";
import {storeDirectory} from "@/lib/demo-store";
export const dynamic="force-dynamic";
export async function GET(req:NextRequest){
 const scenarios=await Promise.all(SCENARIO_IDS.map(async id=>{
 try{const s=JSON.parse(await readFile(path.join(storeDirectory(id),"store.json"),"utf8"));
 const orders=s.orders??[];const o=orders[0];
 const stage=!o?"Chưa gửi đặt chỗ":o.completedAt?"Đã hoàn thành tour":o.startedAt?"Đang trong chuyến":o.paid>=o.deposit?"Đã đặt cọc":o.offer?.acceptedAt?"Đã chấp thuận phương án":o.offer?"Đã nhận phương án":"Chờ xử lý / đặt cọc";
 return {id,bookings:orders.map((o:{id:string;status:string;completedAt?:string;tourId:string;paid:number;deposit:number;trainingGroup?:{key:string}})=>({id:o.id,status:o.status,completed:!!o.completedAt,paidDeposit:o.paid>=o.deposit,groupKey:o.trainingGroup?.key??"",groups:trainingGroups(o).map(g=>({key:g.key,label:`${g.name} · ${g.coach} · Sân ${g.court} · NTRP ${g.ntrpMin}–${g.ntrpMax}`}))})),exists:true,orders:orders.length,points:(s.ledger??[]).reduce((n:number,e:{amount:number})=>n+e.amount,0),stage,feedback:!!o?.feiRating||!!o?.feiResponses?.length,shared:(s.ledger??[]).some((e:{kind:string})=>e.kind==="share")};
 }catch(e){if((e as NodeJS.ErrnoException).code!=="ENOENT")throw e;return {id,exists:false,orders:0,points:0,stage:"Chưa khởi tạo",feedback:false,shared:false};}
 }));
 return NextResponse.json({active:req.cookies.get("tt-scenario")?.value??null,scenarios},{headers:{"Cache-Control":"no-store"}});
}
