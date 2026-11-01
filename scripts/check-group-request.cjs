const ts=require('typescript'),fs=require('fs'),os=require('os'),path=require('path'),Module=require('module'),assert=require('node:assert/strict');
const root=process.cwd(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'tt-api-'));
function compile(file){const m=new Module(file,module);m.filename=file;m.paths=module.paths;const orig=m.require.bind(m);m.require=(id)=>id.startsWith('@/lib/')?compile(path.join(root,id.slice(2)+'.ts')):id.startsWith('./')&&fs.existsSync(path.join(path.dirname(file),id+'.ts'))?compile(path.join(path.dirname(file),id+'.ts')):orig(id);m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,file);return m.exports;}
(async()=>{process.chdir(temp);const api=compile(path.join(root,'app/api/local/route.ts'));const {NextRequest}=require('next/server');let cookie='';const post=(b,origin='http://localhost:8081')=>api.POST(new NextRequest('http://localhost:8081/api/local',{method:'POST',headers:{origin,cookie,'content-type':'application/json'},body:JSON.stringify(b)}));
assert.equal((await post({action:'book'})).status,401);
assert.equal((await post({action:'login'},'https://other.example')).status,403);
const login=await post({action:'login'});assert.equal(login.status,200,await login.clone().text());cookie=login.headers.get('set-cookie').split(';')[0];


const request={min:12,max:16,dates:['2027-05-07','2027-05-21'],budget:15000000,format:'Đánh đôi',courts:4,gala:true,companions:2};
const {tours}=compile(path.join(root,'lib/mock-data.ts'));const t=tours.find(t=>t.packageId==='sbu2');const booking={tourId:t.id,departureCode:t.departureSchedules[0].code,numPeople:16,numCompanions:2,name:'CLB QA',phone:'0901234567',email:'qa@example.com',groupRequest:request};
assert.equal((await post({action:'book',key:'bad',booking:{...booking,groupRequest:{...request,min:18}}})).status,400);
const created=await post({action:'book',key:'group',booking});assert.equal(created.status,200,await created.clone().text());const o=(await created.json()).order;assert.deepEqual(o.groupRequest,request);
assert.equal((await post({action:'offer',id:o.id})).status,409);
assert.equal((await post({action:'approveGroupQuote',id:o.id,fixed:10000000,perPerson:10000000,options:'Gala theo phương án',sourceNote:'Báo giá mẫu'})).status,409);
assert.equal((await post({action:'approveGroupQuote',source:'test-controls',id:o.id,fixed:10000000,perPerson:10000000,options:'Gala theo phương án',sourceNote:'Báo giá mẫu'})).status,200);
const pub=await post({action:'publishGroupPlan',id:o.id,deadline:'2027-01-01T00:00:00.000Z'});assert.equal(pub.status,200);const order=(await pub.json()).orders[0];assert.equal(order.total,170000000);assert.ok(order.groupPlanToken);
const plans=compile(path.join(root,'lib/group-plans.ts'));await plans.respondGroupPlan(order.groupPlanToken,'member1',[request.dates[0]],'interested');await plans.respondGroupPlan(order.groupPlanToken,'member1',[request.dates[1]],'joining');const plan=plans.publicGroupPlan(await plans.getGroupPlan(order.groupPlanToken));assert.equal(plan.responded,1);assert.equal(plan.joining,1);assert.equal(plan.interested,0);assert.equal(plan.remaining,15);assert.ok(!JSON.stringify(plan).includes('qa@example.com'));assert.ok(!JSON.stringify(plan).includes('member1'));
await assert.rejects(()=>plans.respondGroupPlan(order.groupPlanToken,'member2',['2028-01-01'],'joining'));
console.log('PASS group: validation, persistence, approved pricing, public plan, response update, privacy');
})().catch(e=>{console.error(e);process.exitCode=1;});
