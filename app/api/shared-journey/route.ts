import {NextRequest,NextResponse} from "next/server";
import {apiStorage,readDocument} from "@/lib/cloud-store";
import {scenarioKey} from "@/lib/demo-store";
import {effectiveItinerary} from "@/lib/trip-runtime";
import {tours} from "@/lib/mock-data";
import type {LocalOrder} from "@/lib/use-local-account";
export async function GET(req:NextRequest){
 const token=req.nextUrl.searchParams.get("token")??"";
 const missing=()=>NextResponse.json({error:"Link đã thu hồi, hết hiệu lực hoặc chuyến đã kết thúc."},{status:404,headers:{"Cache-Control":"no-store"}});
 if(!/^[a-f0-9-]{36}$/.test(token))return missing();
 let link:{room:string;scope:string|null;id:string}|null=null;
 const lookup=await apiStorage(req,async()=>{link=await readDocument(`global/journeys/${token}`);return new Response(null);});if(!lookup.ok)return lookup;if(!link)return missing();
 const target=link as {room:string;scope:string|null;id:string};
 // Resolve only the linked booking in its original room; do not change visitor cookies.
 return apiStorage(new NextRequest(req.url,{headers:{cookie:`tt-room=${target.room}`}}),async()=>{
 const store=await readDocument<{orders:LocalOrder[]}>(scenarioKey(target.scope??undefined));
 const o=store?.orders.find(o=>o.id===target.id);
 if(!o?.startedAt||o.completedAt||o.journeyShare?.token!==token)return missing();
 return NextResponse.json({name:tours.find(t=>t.id===o.tourId)?.name,days:effectiveItinerary(o),companion:!!o.numCompanions},{headers:{"Cache-Control":"no-store"}});
 });
}
