const ts=require('typescript'),fs=require('fs'),os=require('os'),path=require('path'),Module=require('module'),assert=require('node:assert/strict');
const root=process.cwd(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'tt-api-'));
function compile(file){const m=new Module(file,module);m.filename=file;m.paths=module.paths;const orig=m.require.bind(m);m.require=(id)=>id.startsWith('@/lib/')?compile(path.join(root,id.slice(2)+'.ts')):id.startsWith('./')&&fs.existsSync(path.join(path.dirname(file),id+'.ts'))?compile(path.join(path.dirname(file),id+'.ts')):orig(id);m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,file);return m.exports;}
(async()=>{process.chdir(temp);const api=compile(path.join(root,'app/api/local/route.ts'));const {NextRequest}=require('next/server');let cookie='';const post=(b,origin='http://localhost:8081')=>api.POST(new NextRequest('http://localhost:8081/api/local',{method:'POST',headers:{origin,cookie,'content-type':'application/json'},body:JSON.stringify(b)}));
assert.equal((await post({action:'book'})).status,401);
assert.equal((await post({action:'login'},'https://other.example')).status,403);
const login=await post({action:'login'});assert.equal(login.status,200,await login.clone().text());cookie=login.headers.get('set-cookie').split(';')[0];

const request={desiredDate:'2027-05-20',flexibility:'Linh hoạt ±3 ngày',priority:'Nghỉ dưỡng',services:['Xe riêng','Buổi HLV riêng']};
const booking={tourId:'pq-sbu3',departureCode:'VTR-SIG-TNS-03-PQ4-200527',numPeople:2,numCompanions:1,name:'Premium QA',phone:'0901234567',email:'qa@example.com',ntrpLevel:3.5,premiumRequest:request};
const {tours}=compile(path.join(root,'lib/mock-data.ts'));booking.tourId=tours.find(t=>t.packageId==='sbu3').id;
assert.equal((await post({action:'book',key:'invalid',booking:{...booking,premiumRequest:{...request,services:['Unknown']}}})).status,400);
let r=await post({action:'book',key:'premium',booking});assert.equal(r.status,200,await r.clone().text());let data=await r.json(),o=data.order;assert.equal(o.total,52800000);assert.deepEqual(o.premiumRequest,request);
await post({action:'offer',id:o.id});let read=await api.GET(new NextRequest('http://localhost:8081/api/local',{headers:{cookie}}));o=(await read.json()).orders[0];const old=o.offer.id;

const details={court:'Sân QA',surface:'Hard court',amenities:'Phòng thay đồ',hours:'08:00–10:00',coach:'HLV QA',coachBio:'Clinic theo nhóm',groupName:'Nhóm QA',ntrpMin:2.5,ntrpMax:4,size:2,confirmed:true};
assert.equal((await post({action:'saveOperations',id:o.id,details})).status,403);
assert.equal((await post({action:'saveOperations',source:'operations',id:o.id,details:{...details,size:99}})).status,400);
assert.equal((await post({action:'saveOperations',source:'operations',id:o.id,details})).status,200);
const send=(baseOfferId,total)=>post({action:'sendOfferVersion',source:'operations',id:o.id,baseOfferId,total,program:'Lịch hai người',included:'Sân và clinic',extras:'Không',pending:'HLV riêng',changeNote:'Thay đổi theo yêu cầu'});
let sent=await send(old,54000000);assert.equal(sent.status,200,await sent.clone().text());let current=(await sent.json()).orders[0];assert.equal(current.offerVersions.length,1);const v1=current.offer.id;
assert.equal((await send(old,55000000)).status,409);sent=await send(v1,55000000);assert.equal(sent.status,200);current=(await sent.json()).orders[0];assert.equal(current.offerVersions.length,2);assert.equal(current.operations.court,'Sân QA');assert.equal(current.total,55000000);
assert.equal((await post({action:'acceptOffer',id:o.id,offerId:v1})).status,409);
assert.equal((await post({action:'acceptOffer',id:o.id,offerId:current.offer.id})).status,200);
assert.equal((await send(current.offer.id,56000000)).status,409);
console.log('PASS operations: validation, stored assignments, version history, stale updates, acceptance lock');
})().catch(e=>{console.error(e);process.exitCode=1;});
