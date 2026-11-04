import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { apiStorage, cloudMode, roomExists, writeDocument } from "@/lib/cloud-store";
export const runtime="nodejs";
export async function POST(req:NextRequest){
 if(req.headers.get("origin")!==req.nextUrl.origin)return NextResponse.json({error:"Yêu cầu không hợp lệ."},{status:403});
 let body;try{body=await req.json();}catch{return NextResponse.json({error:"Nội dung không hợp lệ."},{status:400});}
 if(!["explore","scenario"].includes(body?.mode))return NextResponse.json({error:"Chế độ không hợp lệ."},{status:400});
 const oldRoom=req.cookies.get("tt-room")?.value;
 const room=oldRoom&&/^[a-f0-9-]{36}$/.test(oldRoom)?oldRoom:randomUUID();
 const scoped=new NextRequest(req.url,{headers:req.headers});scoped.cookies.set("tt-room",room);
 return apiStorage(scoped,async()=>{
   const changed=room!==oldRoom;
   if(cloudMode()&&!changed&&!await roomExists(room))return NextResponse.json({error:"Phiên demo không còn tồn tại. Mở lại link phiên demo."},{status:403});
   if(changed)await writeDocument("room",{created:true,mode:"explore"});
   const r=NextResponse.json({ok:true,mode:body.mode},{headers:{"Cache-Control":"no-store"}});
   const options={path:"/",sameSite:"strict" as const,secure:req.nextUrl.protocol==="https:",maxAge:86400};
   r.cookies.set("tt-room",room,{...options,httpOnly:true});r.cookies.set("tt-demo-mode",body.mode,{...options,httpOnly:false});
   if(changed){r.cookies.set("tt-session","",{...options,httpOnly:true,maxAge:0});r.cookies.set("tt-admin","",{...options,httpOnly:true,maxAge:0});r.cookies.set("tt-scenario","",{...options,maxAge:0});r.cookies.set("tt-demo-revision",randomUUID(),options);}
   return r;
 });
}
