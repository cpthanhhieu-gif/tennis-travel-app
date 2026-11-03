const ts=require('typescript'),fs=require('fs'),os=require('os'),path=require('path'),Module=require('module'),assert=require('node:assert/strict');
const root=process.cwd(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'tt-api-'));
function compile(file){const m=new Module(file,module);m.filename=file;m.paths=module.paths;const orig=m.require.bind(m);m.require=(id)=>id.startsWith('@/lib/')?compile(path.join(root,id.slice(2)+'.ts')):id.startsWith('./')&&fs.existsSync(path.join(path.dirname(file),id+'.ts'))?compile(path.join(path.dirname(file),id+'.ts')):orig(id);m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,file);return m.exports;}
(async()=>{process.chdir(temp);const api=compile(path.join(root,'app/api/local/route.ts'));const {NextRequest}=require('next/server');let cookie='';const post=(b,origin='http://localhost:8081')=>api.POST(new NextRequest('http://localhost:8081/api/local',{method:'POST',headers:{origin,cookie,'content-type':'application/json'},body:JSON.stringify(b)}));
{const probe=await post({action:'book'});assert.equal(probe.status,400,await probe.text());}
assert.equal((await post({action:'login'},'https://other.example')).status,403);
const login=await post({action:'login'});assert.equal(login.status,200,await login.clone().text());cookie=login.headers.get('set-cookie').split(';')[0];

const request={desiredDate:'2027-05-20',flexibility:'Linh hoạt ±3 ngày',priority:'Nghỉ dưỡng',services:['Xe riêng','Buổi HLV riêng']};
const booking={tourId:'pq-sbu3',departureCode:'VTR-SIG-TNS-03-PQ4-200527',numPeople:2,numCompanions:1,name:'Premium QA',phone:'0901234567',email:'qa@example.com',ntrpLevel:3.5,premiumRequest:request,participants:[{name:'Player QA',role:'player',roomPreference:''},{name:'Companion QA',role:'companion',roomPreference:''}]};
const {tours}=compile(path.join(root,'lib/mock-data.ts'));booking.tourId=tours.find(t=>t.packageId==='sbu3').id;
assert.equal((await post({action:'book',key:'invalid',booking:{...booking,premiumRequest:{...request,services:['Unknown']}}})).status,400);
let r=await post({action:'book',key:'premium',booking});assert.equal(r.status,200,await r.clone().text());let data=await r.json(),o=data.order;assert.equal(o.total,52800000);assert.deepEqual(o.premiumRequest,request);

const {SERVICE_RIGHTS}=compile(path.join(root,'lib/service-plan.ts'));
const plan={schedule:'Ngày 1 08:00 sân A, HLV B; ngày 2 sân A; ngày 3 Ace Cup',rights:SERVICE_RIGHTS.map(([key,label])=>({key,detail:label+' theo xác nhận QA',confirmed:true})),insurance:{provider:'Đơn vị QA',coverage:'Hai khách, tennis, ngày tour',limits:'Theo hợp đồng QA',exclusions:'Theo điều khoản QA',contact:'Đầu mối QA'},kitContents:'Khăn, bình nước',kitPickup:'Ngày 1 tại resort'};
const publish=(basePlanId,p=plan)=>post({action:'publishServicePlan',source:'operations',id:o.id,basePlanId,plan:p});
assert.equal((await publish(null,{...plan,rights:plan.rights.slice(1)})).status,400);
let pub=await publish(null);assert.equal(pub.status,200,await pub.clone().text());o=(await pub.json()).orders[0];const first=o.servicePlan.id;
assert.equal((await publish(null)).status,409);
await post({action:'offer',id:o.id,source:'test-controls'});
let read=await api.GET(new NextRequest('http://localhost:8081/api/local',{headers:{cookie}}));o=(await read.json()).orders[0];const oldOffer=o.offer.id;
assert.equal((await post({action:'acceptOffer',id:o.id,offerId:oldOffer})).status,409);
pub=await publish(first,{...plan,schedule:'Ngày 1 giờ sân cập nhật 09:00'});assert.equal(pub.status,200);o=(await pub.json()).orders[0];assert.equal(o.offer,undefined);
assert.equal((await post({action:'acceptOffer',id:o.id,offerId:oldOffer,planId:first})).status,409);
let sent=await post({action:'sendOfferVersion',source:'operations',id:o.id,baseOfferId:null,total:o.total,program:'Theo lịch đã xác nhận',included:'9 quyền lợi theo bản xác nhận',extras:'Không',pending:'Chờ cấp chứng từ',changeNote:'Xác nhận đầy đủ'});
assert.equal(sent.status,200,await sent.clone().text());o=(await sent.json()).orders[0];
assert.equal(o.offerVersions[0].servicePlan.id,o.servicePlan.id);
assert.equal((await post({action:'acceptOffer',id:o.id,offerId:o.offer.id,planId:first})).status,409);
assert.equal((await post({action:'acceptOffer',id:o.id,offerId:o.offer.id,planId:o.servicePlan.id})).status,200);
assert.equal((await publish(o.servicePlan.id)).status,409);
const issue=(url)=>post({action:'issueInsurance',source:'operations',id:o.id,reference:'POLICY-QA',documentUrl:url});
assert.equal((await issue('javascript:alert(1)')).status,400);
assert.equal((await issue('https://example.com/policy-qa')).status,200);
assert.equal((await issue('https://example.com/overwrite')).status,409);
assert.equal((await post({action:'handoverKit',source:'operations',id:o.id,participant:'p1',recipient:'QA'})).status,409);
assert.equal((await post({action:'pay',source:'test-controls',id:o.id,result:'success'})).status,200);
assert.equal((await post({action:'receiveKit',id:o.id,participant:'p1',self:true})).status,409);
assert.equal((await post({action:'handoverKit',source:'operations',id:o.id,participant:'c1',recipient:'QA'})).status,400);
const handover=()=>post({action:'handoverKit',source:'operations',id:o.id,participant:'p1',recipient:'QA'});
assert.equal((await handover()).status,200);assert.equal((await handover()).status,200);
assert.equal((await post({action:'receiveKit',id:o.id,participant:'p1'})).status,400);
assert.equal((await post({action:'receiveKit',id:o.id,participant:'p1',self:true})).status,200);
read=await api.GET(new NextRequest('http://localhost:8081/api/local',{headers:{cookie}}));o=(await read.json()).orders[0];
assert.equal(o.kitHandovers.length,1);assert.ok(o.kitHandovers[0].receivedAt);assert.equal(o.insuranceIssue.reference,'POLICY-QA');
console.log('PASS service flow: validation, stale versions, offer snapshot, acceptance binding, policy URL, deposit gate, kit roles, retries, persistence');
})().catch(e=>{console.error(e);process.exitCode=1;});
