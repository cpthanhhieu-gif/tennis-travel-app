import {NextRequest,NextResponse} from "next/server";
import {randomUUID,createHash} from "node:crypto";
import {apiStorage,readDocument,writeDocument,currentRoom,cloudMode,roomExists} from "@/lib/cloud-store";
import {scenarioKey,ensureScenario} from "@/lib/demo-store";
import {isScenarioId} from "@/lib/demo-scope";
import {selectedTrainingGroup} from "@/lib/training-groups";
import type {LocalOrder} from "@/lib/use-local-account";
export const dynamic="force-dynamic";
export async function GET(req:NextRequest){return apiStorage(req,async()=>{
 const room=currentRoom();
 if(cloudMode()&&!await roomExists(room))return NextResponse.json({error:"Chưa tham gia phiên demo"},{status:403});
 const shared=await readDocument<{scenario:string|null;revision:string}>("demo-context");
 const scenario=shared?shared.scenario:req.cookies.get("tt-scenario")?.value;
 if(!shared&&!isScenarioId(scenario))return NextResponse.json({room,scenario:null},{headers:{"Cache-Control":"no-store"}});
 const scope=isScenarioId(scenario)?scenario:undefined;
 if(scope)await ensureScenario(scope);
 const store=await readDocument<{sessions:Record<string,number>;orders:LocalOrder[];profile?:{name:string}}>(scenarioKey(scope));
 if(!store)return NextResponse.json({error:"Chưa có dữ liệu"},{status:404});
 const changed=req.cookies.get("tt-scenario")?.value!==scope||!!shared&&req.cookies.get("tt-context")?.value!==shared.revision;
 const token=req.cookies.get("tt-session")?.value;
 const authenticated=!!token&&store.sessions[createHash("sha256").update(token).digest("hex")]>Date.now();
 const order=store.orders.find(o=>!o.completedAt)??store.orders[0];
 const response=NextResponse.json({room,scenario:scope??null,changed,revision:shared?.revision,customer:store.profile?.name,booking:order?.id,stage:order?.status,coach:order?.operations?.coach??(order?selectedTrainingGroup(order)?.coach:undefined),syncedAt:new Date().toISOString()},{headers:{"Cache-Control":"no-store"}});
 const options={path:"/",sameSite:"strict" as const,secure:req.nextUrl.protocol==="https:",maxAge:86400};
 if(changed||!authenticated){
  // The room link is the existing demo capability; never grant admin rights here.
  const session=randomUUID();store.sessions[createHash("sha256").update(session).digest("hex")]=Date.now()+86400000;
  await writeDocument(scenarioKey(scope),store);
  response.cookies.set("tt-session",session,{...options,httpOnly:true});
 }
 response.cookies.set("tt-scenario",scope??"",{...options,maxAge:scope?86400:0});
 if(shared){response.cookies.set("tt-context",shared.revision,{...options,httpOnly:true});response.cookies.set("tt-demo-revision",shared.revision,options);}
 return response;
 });}
