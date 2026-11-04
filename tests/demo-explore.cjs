const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),ts=require("typescript"),crypto=require("node:crypto");
class NextRequest extends Request{constructor(url,options){super(url,options);this.nextUrl=new URL(url);this.jar=new Map((this.headers.get("cookie")??"").split("; ").filter(Boolean).map(c=>{const i=c.indexOf("=");return [c.slice(0,i),c.slice(i+1)];}));this.cookies={get:k=>this.jar.has(k)?{value:this.jar.get(k)}:undefined,set:(k,v)=>{this.jar.set(k,v);this.headers.set("cookie",[...this.jar].map(([a,b])=>`${a}=${b}`).join("; "));}};}}
class NextResponse extends Response{static json(value,options){const r=new NextResponse(JSON.stringify(value),options);r.cookies={values:new Map(),set(k,v,o){this.values.set(k,{value:v,options:o});}};return r;}}
function load(file,deps={}){const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{module,exports:module.exports,require:n=>deps[n],Intl,Date,URL});return module.exports;}
const writes=[];let seenRoom;
const cloud={cloudMode:()=>true,apiStorage:async(req,fn)=>{seenRoom=req.cookies.get("tt-room")?.value??"local";return fn();},roomExists:async()=>true,writeDocument:async(k,v)=>writes.push({room:seenRoom,k,v}),currentRoom:()=>seenRoom,readDocument:async()=>({scenario:"couple",revision:"different"})};
const route=load("app/api/demo-explore/route.ts",{"next/server":{NextRequest,NextResponse},"node:crypto":crypto,"@/lib/cloud-store":cloud});
function req(body,cookie="",origin="https://app.test"){return new NextRequest("https://app.test/api/demo-explore",{method:"POST",headers:{origin,cookie,"content-type":"application/json"},body:JSON.stringify(body)});}
(async()=>{
 assert.equal((await route.POST(req({mode:"explore"},"","https://other.test"))).status,403);
 assert.equal((await route.POST(req({mode:"bad"}))).status,400);
 const r=await route.POST(req({mode:"explore"}));assert.equal(r.status,200);
 const room=r.cookies.values.get("tt-room").value;assert.equal(/^[a-f0-9-]{36}$/.test(room),true);
 assert.equal(writes[0].room,room);assert.equal(writes[0].k,"room");
 assert.equal(r.cookies.values.get("tt-admin").value,"");assert.equal(r.cookies.values.get("tt-session").value,"");assert.equal(r.cookies.values.get("tt-demo-mode").value,"explore");
 const reuse=await route.POST(req({mode:"explore"},`tt-room=${room}; tt-admin=existing`));assert.equal(reuse.cookies.values.get("tt-room").value,room);assert.equal(reuse.cookies.values.has("tt-admin"),false);
 const exit=await route.POST(req({mode:"scenario"},`tt-room=${room}`));assert.equal(exit.cookies.values.get("tt-demo-mode").value,"scenario");
 const sync=load("app/api/demo-sync/route.ts",{"next/server":{NextResponse},"node:crypto":crypto,"@/lib/cloud-store":cloud,"@/lib/demo-store":{},"@/lib/demo-scope":{},"@/lib/training-groups":{}});
 const before=writes.length;const s=await sync.GET(new NextRequest("https://app.test/api/demo-sync",{headers:{cookie:`tt-room=${room}; tt-demo-mode=explore; tt-scenario=personal`}}));
 const b=await s.json();assert.equal(b.mode,"explore");assert.equal(b.changed,false);assert.equal(b.scenario,null);assert.equal(s.cookies.values.size,0);assert.equal(writes.length,before);
 console.log("Passed: explicit exploration entry, valid private room, no admin/login grant, room reuse, mode switch and no scripted sync override.");
})().catch(e=>{console.error(e);process.exitCode=1;});
