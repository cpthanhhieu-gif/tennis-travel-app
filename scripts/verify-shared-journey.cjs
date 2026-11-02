const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');const ts=require('typescript');
const token='11111111-1111-4111-8111-111111111111';let room='visitor';let order={id:'booking',tourId:'tour',startedAt:'now',journeyShare:{token},phone:'private',paid:100,activityUpdates:{}};
class Request{constructor(url,options={}){this.url=url;this.nextUrl=new URL(url);this.room=options.headers?.cookie?.replace('tt-room=','')??'visitor';}}
const json=(body,opts={})=>({status:opts.status??200,body,ok:(opts.status??200)<400});
const modules={
 'next/server':{NextRequest:Request,NextResponse:{json}},
 '@/lib/cloud-store':{apiStorage:async(req,fn)=>{const previous=room;room=req.room;try{return await fn();}finally{room=previous;}},readDocument:async key=>key.startsWith('global/')?{room:'owner',scope:'couple',id:'booking'}:room==='owner'?{orders:order?[order]:[]}:null},
 '@/lib/demo-store':{scenarioKey:scope=>`scenarios/${scope}/store`},
 '@/lib/trip-runtime':{effectiveItinerary:o=>[{title:o.activityUpdates.title??'Original schedule'}]},
 '@/lib/mock-data':{tours:[{id:'tour',name:'Shared tour'}]}
};
const output=ts.transpileModule(fs.readFileSync('app/api/shared-journey/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const routeExports={};
vm.runInNewContext(output,{exports:routeExports,require:name=>{assert.ok(modules[name],name);return modules[name];},Response,URL});
async function read(value=token){return routeExports.GET(new Request(`https://demo.test/api/shared-journey?token=${value}`));}
(async()=>{
 assert.equal((await read('invalid')).status,404);
 let r=await read();assert.equal(r.status,200);assert.equal(r.body.name,'Shared tour');assert.ok(!('paid' in r.body));assert.ok(!('phone' in r.body));assert.equal(room,'visitor');
 order.activityUpdates.title='Moved court';assert.equal((await read()).body.days[0].title,'Moved court');
 order.journeyShare=undefined;assert.equal((await read()).status,404);
 order.journeyShare={token};order.completedAt='done';assert.equal((await read()).status,404);
 delete order.completedAt;delete order.startedAt;assert.equal((await read()).status,404);
 order=null;assert.equal((await read()).status,404);
 console.log('PASS: invalid links, correct room, limited fields, live updates, revocation, completion, pre-start and reset');
})().catch(e=>{console.error(e);process.exitCode=1;});