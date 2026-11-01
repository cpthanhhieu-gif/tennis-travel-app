import {NextRequest,NextResponse} from "next/server";
import {randomUUID} from "node:crypto";
import {cloudMode,apiStorage,currentRoom,writeDocument,readDocument,roomExists} from "@/lib/cloud-store";
import {adminToken,isAdmin,passwordMatches} from "@/lib/demo-auth";
import {isScenarioId} from "@/lib/demo-scope";
export async function GET(req:NextRequest){return apiStorage(req,async()=>{if(cloudMode()&&isAdmin(req))await writeDocument("room",{created:true});return NextResponse.json({admin:isAdmin(req),room:currentRoom(),cloud:cloudMode()},{headers:{"Cache-Control":"no-store"}});});}
export async function POST(req:NextRequest){
 if(req.headers.get("origin")!==req.nextUrl.origin)return NextResponse.json({error:"Yêu cầu không hợp lệ"},{status:403});
 return apiStorage(req,async()=>{const b=await req.json();const secure=req.nextUrl.protocol==="https:";const options={httpOnly:true,secure,sameSite:"strict" as const,path:"/",maxAge:86400};
 if(b.action==="join"){
 if(typeof b.room!=="string"||!/^[-a-f0-9]{36}$/.test(b.room)||!isScenarioId(b.scenario)||!await roomExists(b.room))return NextResponse.json({error:"Link phiên demo không hợp lệ"},{status:400});
 const r=NextResponse.json({ok:true});r.cookies.set("tt-room",b.room,options);r.cookies.set("tt-scenario",b.scenario,{...options,httpOnly:false});r.cookies.set("tt-demo-revision",randomUUID(),{...options,httpOnly:false});r.cookies.set("tt-session","",{...options,maxAge:0});r.cookies.set("tt-admin","",{...options,maxAge:0});return r;
 }
 if(b.action==="logout"){const r=NextResponse.json({ok:true});r.cookies.set("tt-admin","",{...options,maxAge:0});return r;}
 if(!cloudMode())return NextResponse.json({ok:true});
 if(!process.env.DEMO_ADMIN_PASSWORD||process.env.DEMO_ADMIN_PASSWORD.length<16)return NextResponse.json({error:"Cấu hình DEMO_ADMIN_PASSWORD ít nhất 16 ký tự trên Vercel."},{status:503});
 // A global durable rate limit avoids bypass by changing cookies or server instances.
 const limiter=await readDocument<{attempts:number;until:number}>("global/admin-attempts")??{attempts:0,until:0};
 if(limiter.until<Date.now()){limiter.attempts=0;limiter.until=Date.now()+60000;}
 if(limiter.attempts>=10)return NextResponse.json({error:"Thử lại sau một phút."},{status:429});
 if(!passwordMatches(b.password)){limiter.attempts++;await writeDocument("global/admin-attempts",limiter);return NextResponse.json({error:"Mật khẩu không đúng."},{status:401});}
 let room=currentRoom();if(room==="local"||b.action==="new")room=randomUUID();
 const r=NextResponse.json({ok:true});r.cookies.set("tt-room",room,options);r.cookies.set("tt-demo-revision",randomUUID(),{...options,httpOnly:false});r.cookies.set("tt-admin",adminToken(room,Date.now()+86400000),options);
 // Create the room marker within its own context on the next authenticated request.
 r.cookies.set("tt-session","",{...options,maxAge:0});return r;
 });
}
