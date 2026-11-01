const ts=require('typescript'),fs=require('fs'),os=require('os'),path=require('path'),Module=require('module'),assert=require('node:assert/strict');
const root=process.cwd(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'tt-api-'));
function compile(file){const m=new Module(file,module);m.filename=file;m.paths=module.paths;const orig=m.require.bind(m);m.require=(id)=>id.startsWith('@/lib/')?compile(path.join(root,id.slice(2)+'.ts')):id.startsWith('./')&&fs.existsSync(path.join(path.dirname(file),id+'.ts'))?compile(path.join(path.dirname(file),id+'.ts')):orig(id);m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,file);return m.exports;}
(async()=>{process.chdir(temp);const api=compile(path.join(root,'app/api/local/route.ts'));const {NextRequest}=require('next/server');let cookie='';const post=(b,origin='http://localhost:8081')=>api.POST(new NextRequest('http://localhost:8081/api/local',{method:'POST',headers:{origin,cookie,'content-type':'application/json'},body:JSON.stringify(b)}));
assert.equal((await post({action:'book'})).status,401);
assert.equal((await post({action:'login'},'https://other.example')).status,403);
const login=await post({action:'login'});assert.equal(login.status,200,await login.clone().text());cookie=login.headers.get('set-cookie').split(';')[0];
assert.equal((await post({action:'profile',name:'',phone:'abc',email:'bad'})).status,400);
assert.equal((await post({action:'profile',name:'QA Profile',phone:'0901 234 567',email:'qa@example.com'})).status,200);
const profileRead=await (await api.GET(new NextRequest('http://localhost:8081/api/local',{headers:{cookie}}))).json();
assert.equal(profileRead.account.name,'QA Profile');assert.equal(profileRead.account.phone,'0901234567');assert.equal(profileRead.account.email,'qa@example.com');
const {ntrpQuiz}=compile(path.join(root,'lib/mock-data.ts'));
const lowAnswers=Object.fromEntries(ntrpQuiz.map(q=>[q.id,q.options[0].value]));
assert.equal((await post({action:'ntrp',answers:{}})).status,400);
const ntrpSaved=await (await post({action:'ntrp',answers:lowAnswers})).json();assert.equal(ntrpSaved.ntrpProfile.level,1.5);assert.equal(ntrpSaved.account.name,'QA Profile');
const booking={groupAdviceRequested:true,tourId:'dl-sbu1',departureCode:'VTR-SIG-TNS-01-DL2-240427',numPeople:2,name:'Test',phone:'0901234567',email:'test@example.com',ntrpLevel:1.5,ntrpLabel:'untrusted'};
assert.equal((await post({action:'book',key:'bad',booking:{...booking,numPeople:-2}})).status,400);
const create=()=>post({action:'book',key:'unique',booking});const [a,b]=await Promise.all([create(),create()]);const data=await a.json();assert.equal((await post({action:'start',id:data.order.id})).status,403);assert.equal((await post({action:'start',id:data.order.id,source:'test-controls'})).status,409);assert.equal(data.order.groupAdviceRequested,true);assert.equal((await post({action:'book',key:'unique',booking:{...booking,groupAdviceRequested:false}})).status,409);assert.equal(data.order.total,13800000);assert.equal(data.order.deposit,4140000);assert.equal((await b.json()).orders.length,1);
for(const result of ['failed','cancelled','success','success']){const r=await post({action:'pay',id:data.order.id,result});assert.equal(r.status,200);const d=await r.json();assert.equal(d.orders[0].payment,result);if(result==='success')assert.equal(d.orders[0].paid,4140000);}
assert.equal((await post({action:'book',key:'unique',booking:{...booking,name:'Other'}})).status,409);
const {tours}=compile(path.join(root,'lib/mock-data.ts'));
for(const [pkg,max] of [['sbu1',20],['sbu2',20],['sbu3',16]]){
 const tour=tours.find(t=>t.packageId===pkg);
 const booking={groupAdviceRequested:true,tourId:tour.id,departureCode:tour.departureSchedules[0].code,numPeople:max+1,name:'Capacity test'};
 assert.equal((await post({action:'book',key:'capacity-over-'+pkg,booking})).status,400);
 assert.equal(compile(path.join(root,'lib/mock-data.ts')).packageCapacity(pkg),max);
}
const {balanceReminder,nextRequestAction:nextActionCheck}=compile(path.join(root,'lib/request-flow.ts'));
const reminderOrder={paid:30,total:100,deposit:30,payment:'success'};
assert.match(balanceReminder(reminderOrder,'2027-05-20',new Date('2027-05-04T17:00:00Z')),/5\/5\/2027/);
assert.match(balanceReminder(reminderOrder,'2027-05-20',new Date('2027-05-05T17:00:00Z')),/quá hạn/);
assert.doesNotMatch(balanceReminder({...reminderOrder,startedAt:'test'},'2027-05-20'),/D-15/);
assert.equal(balanceReminder({...reminderOrder,paid:100},'2027-05-20'),'Đã thanh toán đủ.');
assert.equal(nextActionCheck({...reminderOrder,startedAt:'test'},'sbu3').title,'Hoàn tất thanh toán còn lại');

for(const [pkg,people,total,deposit,status] of [['sbu2',2,25800000,12900000,'Chờ báo giá'],['sbu3',3,89700000,26910000,'Chờ xác nhận trong 24 giờ']]){
 const t=tours.find(t=>t.packageId===pkg);const d=t.departureSchedules[0];
 const r=await post({action:'book',key:pkg,booking:{tourId:t.id,departureCode:d.code,numPeople:people,name:'QA '+pkg}});assert.equal(r.status,200);const v=(await r.json()).order;assert.equal(v.total,total);assert.equal(v.deposit,deposit);assert.equal(v.status,status);assert.equal((await post({action:'pay',id:v.id,result:'success'})).status,409);
 assert.equal((await post({action:'acceptOffer',id:v.id,offerId:'missing'})).status,409);
 const prepared=await (await post({action:'offer',id:v.id})).json();const offer=prepared.orders.find(o=>o.id===v.id).offer;assert.equal(offer.total,total);assert.equal(offer.deposit,deposit);
 assert.equal((await post({action:'pay',id:v.id,result:'success'})).status,409);
 assert.equal((await post({action:'acceptOffer',id:v.id,offerId:'wrong'})).status,409);
 for(let n=0;n<2;n++)assert.equal((await post({action:'acceptOffer',id:v.id,offerId:offer.id})).status,200);
 for(const result of ['failed','cancelled','success','success']){const r=await post({action:'pay',id:v.id,result});assert.equal(r.status,200);const paid=(await r.json()).orders.find(o=>o.id===v.id);assert.equal(paid.paid,result==='success'?deposit:0);}
 const after=await (await post({action:'offer',id:v.id})).json();assert.equal(after.orders.find(o=>o.id===v.id).status,'Đã xác nhận');
 await post({action:'pay',id:v.id,phase:'balance',result:'success'});
 assert.equal((await (await post({action:'acceptOffer',id:v.id,offerId:offer.id})).json()).orders.find(o=>o.id===v.id).paid,total);

}
const highAnswers=Object.fromEntries(ntrpQuiz.map(q=>[q.id,q.options.at(-1).value]));
const updatedProfile=await (await post({action:'ntrp',answers:highAnswers})).json();
const originalOrder=updatedProfile.orders.find(o=>o.id===data.order.id);assert.equal(originalOrder.ntrpLevel,1.5);assert.equal(originalOrder.ntrpLabel,'Beginner');assert.equal(originalOrder.phone,'0901234567');assert.equal(originalOrder.email,'test@example.com');assert.notEqual(updatedProfile.ntrpProfile.level,1.5);
assert.equal((await post({action:'book',key:'unique',booking:{...booking,ntrpLevel:4.5}})).status,409);
assert.equal(data.order.trainingGroup,undefined);
const orderId=data.order.id;
const state=async()=>await (await api.GET(new NextRequest('http://localhost:8081/api/local',{headers:{cookie}}))).json();
assert.equal((await state()).points,0);
assert.equal((await post({action:'complete',id:orderId,source:'test-controls'})).status,409);
assert.equal((await post({action:'fei',id:orderId,rating:5})).status,409);
assert.equal((await post({action:'share',id:orderId,result:'success'})).status,409);
for(const result of ['failed','cancelled']){await post({action:'pay',id:orderId,phase:'balance',result});assert.equal((await state()).points,0);assert.equal((await state()).orders.find(o=>o.id===orderId).paid,4140000);}
await post({action:'pay',id:orderId,phase:'balance',result:'success'});
assert.equal((await state()).points,0);
assert.equal((await post({action:'complete',id:orderId})).status,403);
assert.equal((await post({action:'complete',id:orderId,source:'test-controls'})).status,409);
const {journeyPhase}=compile(path.join(root,'lib/journey.ts'));
assert.equal(journeyPhase((await state()).orders.find(o=>o.id===orderId)),'Sắp đi');
await Promise.all([post({action:'start',id:orderId,source:'test-controls'}),post({action:'start',id:orderId,source:'test-controls'})]);
assert.equal(journeyPhase((await state()).orders.find(o=>o.id===orderId)),'Đang đi');
assert.equal((await state()).points,0);
const {tripItinerary}=compile(path.join(root,'lib/trip-itinerary.ts'));
const plans=(await state()).orders.map(o=>tripItinerary(o));assert.deepEqual(plans.map(p=>p.length).sort(),[2,3,4]);
for(const pkg of ['sbu1','sbu2','sbu3']){
 const t=tours.find(t=>t.packageId===pkg);const all=tripItinerary({tourId:t.id,departureCode:t.departureSchedules[0].code}).flatMap(d=>d.activities);
 assert.equal(all.filter(a=>a.kind==='court').length,({sbu1:2,sbu2:4,sbu3:3})[pkg]);
 if(pkg==='sbu1'){assert.equal(all.filter(a=>a.kind==='clinic').length,1);assert.equal(all.filter(a=>a.kind==='cooking').length,1);assert.equal(all.some(a=>a.title.includes('Spa')),false);}
 if(pkg==='sbu2'){assert.equal(all.filter(a=>a.kind==='explore'&&!a.optional).length,1);assert.equal(all.some(a=>a.title.includes('Spa')||a.title.includes('Private Dining')),false);}
 if(pkg==='sbu3'){assert.equal(all.filter(a=>a.kind==='fei').length,5);assert.equal(all.filter(a=>a.kind==='competition').length,2);assert.ok(all.some(a=>a.title.includes('Spa recovery')));assert.ok(all.some(a=>a.optional));}
 const alternative=tripItinerary({tourId:t.id,departureCode:t.departureSchedules[1].code}).flatMap(d=>d.activities);
 assert.notDeepEqual(all.map(a=>a.title),alternative.map(a=>a.title));assert.equal(all.length,new Set(all.map(a=>a.id)).size);
}
const plan=tripItinerary((await state()).orders.find(o=>o.id===orderId));assert.equal(plan[0].date,'2027-04-24');assert.equal(plan[1].date,'2027-04-25');
assert.equal((await post({action:'checkActivity',id:orderId,itemId:'sbu3:day1:item1',checked:true})).status,400);
assert.equal((await post({action:'checkActivity',id:orderId,itemId:plan[0].activities[0].id,checked:true})).status,200);
await post({action:'checkActivity',id:orderId,itemId:'prepare:0',checked:true});
const checked=await state();assert.equal(checked.points,0);assert.equal(checked.orders.find(o=>o.id===orderId).activityChecks['prepare:0'],true);assert.equal(checked.orders.filter(o=>o.id!==orderId).some(o=>o.activityChecks?.['prepare:0']),false);
const {currentAndNext}=compile(path.join(root,'lib/trip-runtime.ts'));
const edit=(body)=>post({action:'updateActivity',source:'test-controls',id:orderId,...body});
const firstActivity=plan[0].activities[0], secondActivity=plan[0].activities[1];
assert.equal((await post({action:'updateActivity',id:orderId,activityId:firstActivity.id,status:'live'})).status,403);
assert.equal((await edit({activityId:'wrong',status:'live'})).status,400);
assert.equal((await edit({activityId:firstActivity.id,status:'live'})).status,200);
assert.equal(currentAndNext((await state()).orders.find(o=>o.id===orderId)).current.id,firstActivity.id);
assert.equal((await edit({activityId:secondActivity.id,status:'live'})).status,409);
await edit({activityId:firstActivity.id,status:'done'});
const change={activityId:secondActivity.id,status:'changed',time:'09:45–10:45',location:'Sân tennis số 2',reason:'Dời giờ và đổi sân sau mưa'};
assert.equal((await edit({...change,time:'99:99'})).status,400);
assert.equal((await edit({...change,reason:''})).status,400);
await edit(change);await edit(change);
let runtimeOrder=(await state()).orders.find(o=>o.id===orderId);assert.equal(runtimeOrder.notices.length,1);assert.equal(currentAndNext(runtimeOrder).next.id,secondActivity.id);assert.equal(currentAndNext(runtimeOrder).next.location,'Sân tennis số 2');
const noticeId=runtimeOrder.notices[0].id;
assert.equal((await post({action:'ackTripNotice',id:'wrong',noticeId})).status,404);
await post({action:'ackTripNotice',id:orderId,noticeId});const seenAt=(await state()).orders.find(o=>o.id===orderId).notices[0].seenAt;await post({action:'ackTripNotice',id:orderId,noticeId});assert.equal((await state()).orders.find(o=>o.id===orderId).notices[0].seenAt,seenAt);
await edit({...change,status:'cancelled',reason:'Không đủ điều kiện tổ chức'});
runtimeOrder=(await state()).orders.find(o=>o.id===orderId);assert.equal(runtimeOrder.notices.length,2);assert.notEqual(currentAndNext(runtimeOrder).next.id,secondActivity.id);assert.equal(runtimeOrder.activityChecks['prepare:0'],true);assert.equal((await state()).points,0);
const {trainingGroups,sessionAssignment}=compile(path.join(root,'lib/training-groups.ts'));
const availableGroups=trainingGroups((await state()).orders.find(o=>o.id===orderId));assert.equal(availableGroups.length,2);assert.ok(availableGroups.every(g=>g.players.length<=6));
assert.equal((await post({action:'assignTrainingGroup',id:orderId,groupKey:availableGroups[0].key})).status,403);
assert.equal((await post({action:'assignTrainingGroup',source:'test-controls',id:orderId,groupKey:'wrong'})).status,400);
await post({action:'assignTrainingGroup',source:'test-controls',id:orderId,groupKey:availableGroups[0].key});
const courtActivity=plan.flatMap(d=>d.activities).find(a=>a.kind==='court');assert.equal(sessionAssignment((await state()).orders.find(o=>o.id===orderId),courtActivity).coach,availableGroups[0].coach);
await post({action:'requestGroupChange',id:orderId,reason:'Muốn tập nhóm có nhịp độ chậm hơn'});
let grouped=(await state()).orders.find(o=>o.id===orderId);assert.equal(grouped.trainingGroup.key,availableGroups[0].key);assert.equal(grouped.groupChange.status,'pending');const requestId=grouped.groupChange.id;
await post({action:'requestGroupChange',id:orderId,reason:'Retry'});assert.equal((await state()).orders.find(o=>o.id===orderId).groupChange.id,requestId);
assert.equal((await post({action:'assignTrainingGroup',source:'test-controls',id:orderId,groupKey:availableGroups[1].key})).status,409);
assert.equal((await post({action:'resolveGroupChange',source:'test-controls',id:orderId,requestId:'wrong',result:'accepted',groupKey:availableGroups[1].key})).status,409);
for(let i=0;i<2;i++)assert.equal((await post({action:'resolveGroupChange',source:'test-controls',id:orderId,requestId,result:'accepted',groupKey:availableGroups[1].key})).status,200);
grouped=(await state()).orders.find(o=>o.id===orderId);assert.equal(grouped.trainingGroup.key,availableGroups[1].key);assert.equal(grouped.groupChange.status,'accepted');assert.equal((await state()).points,0);
const another=await (await post({action:'requestGroupChange',id:orderId,reason:'Muốn thay nhóm lần nữa'})).json();const anotherRequest=another.orders.find(o=>o.id===orderId).groupChange;
await post({action:'resolveGroupChange',source:'test-controls',id:orderId,requestId:anotherRequest.id,result:'declined',reason:'Giữ nhóm hiện tại theo lịch sân đã thống nhất'});
assert.equal((await state()).orders.find(o=>o.id===orderId).trainingGroup.key,availableGroups[1].key);

await Promise.all([post({action:'complete',id:orderId,source:'test-controls'}),post({action:'complete',id:orderId,source:'test-controls'})]);
assert.equal(journeyPhase((await state()).orders.find(o=>o.id===orderId)),'Đã hoàn thành');
assert.equal((await post({action:'start',id:orderId,source:'test-controls'})).status,409);
assert.equal((await state()).points,276);
assert.equal((await post({action:'fei',id:orderId,rating:0})).status,400);
await Promise.all([post({action:'fei',id:orderId,rating:1}),post({action:'fei',id:orderId,rating:5})]);
assert.equal((await state()).points,296);
assert.equal((await state()).orders.find(o=>o.id===orderId).feiRating,1);
assert.equal((await post({action:'share',id:orderId,result:'cancelled'})).status,400);
await Promise.all([post({action:'share',id:orderId,result:'success'}),post({action:'share',id:orderId,result:'success'})]);
assert.equal((await state()).points,306);
assert.equal((await state()).ledger.length,3);
await post({action:'pay',id:orderId,phase:'balance',result:'failed'});
await post({action:'complete',id:orderId,source:'test-controls'});
assert.equal((await state()).points,306);
const apiReloaded=compile(path.join(root,'app/api/local/route.ts'));
const persisted=await (await apiReloaded.GET(new NextRequest('http://localhost:8081/api/local',{headers:{cookie}}))).json();
assert.equal(journeyPhase(persisted.orders.find(o=>o.id===orderId)),"Đã hoàn thành");assert.equal(persisted.points,306);assert.equal(persisted.ledger.length,3);
const reload=await api.GET(new NextRequest('http://localhost:8081/api/local',{headers:{cookie}}));assert.equal((await reload.json()).orders.length,3);
const s=JSON.parse(fs.readFileSync(path.join(temp,'.local-data/store.json')));assert.equal(s.orders.length,3);
assert.equal((await post({action:'seedRequestExamples'})).status,403);
const examples=await (await post({action:'seedRequestExamples',source:'test-controls'})).json();assert.equal(examples.orders.length,7);
const repeated=await (await post({action:'seedRequestExamples',source:'test-controls'})).json();assert.equal(repeated.orders.length,7);
const info=examples.orders.find(o=>o.issue?.type==='needsInfo');const declined=examples.orders.find(o=>o.issue?.type==='unavailable');
const {requestBlocked,nextRequestAction}=compile(path.join(root,'lib/request-flow.ts'));
assert.equal(requestBlocked(info),true);assert.equal(requestBlocked(declined),true);
assert.equal(nextRequestAction(declined).title,'Chọn lịch hoặc gói khác');
assert.equal((await post({action:'offer',id:info.id})).status,409);assert.equal((await post({action:'pay',id:declined.id,result:'success'})).status,409);
assert.equal((await post({action:'supplement',id:info.id,response:' '})).status,400);
const supplied=await (await post({action:'supplement',id:info.id,response:'Đoàn đến 09:00; liên hệ đại diện đã cung cấp.'})).json();assert.equal(requestBlocked(supplied.orders.find(o=>o.id===info.id)),false);
const duplicateSupply=await (await post({action:'supplement',id:info.id,response:'Retry'})).json();assert.equal(duplicateSupply.orders.find(o=>o.id===info.id).history.length,3);
assert.equal((await post({action:'supplement',id:declined.id,response:'abc'})).status,409);
const reopened=await (await post({action:'offer',id:info.id})).json();const proposal=reopened.orders.find(o=>o.id===info.id).offer;
await post({action:'acceptOffer',id:info.id,offerId:proposal.id});
await post({action:'pay',id:info.id,result:'failed'});await post({action:'pay',id:info.id,result:'success'});const repeatedPayment=await (await post({action:'pay',id:info.id,result:'success'})).json();
const audited=repeatedPayment.orders.find(o=>o.id===info.id);assert.equal(audited.history.length,new Set(audited.history.map(e=>e.key)).size);assert.ok(audited.history.some(e=>e.key==='pay:deposit:failed'));assert.ok(audited.history.some(e=>e.key==='pay:deposit:success'));assert.equal(repeatedPayment.points,306);
const unknown=await (await post({action:'book',key:'unknown-ntrp',booking:{...booking,name:'Chưa đánh giá',ntrpLevel:0}})).json();await post({action:'pay',id:unknown.order.id,result:'success'});
assert.equal((await post({action:'assignTrainingGroup',source:'test-controls',id:unknown.order.id,groupKey:availableGroups[0].key})).status,409);

for(const [pkg,total] of [['sbu1',12300000],['sbu2',22800000],['sbu3',52800000]]){
 const t=tours.find(t=>t.packageId===pkg);const c={tourId:t.id,departureCode:t.departureSchedules[0].code,numPeople:2,numCompanions:1,name:'Couple QA',totalPrice:1};
 const result=await (await post({action:'book',key:'couple-'+pkg,booking:c})).json();assert.equal(result.order.total,total);assert.equal(result.order.numCompanions,1);assert.equal(result.order.deposit,Math.round(total*(pkg==='sbu2'?.5:.3)));
 assert.equal((await post({action:'book',key:'couple-'+pkg,booking:c})).status,200);
 assert.equal((await post({action:'book',key:'couple-'+pkg,booking:{...c,numCompanions:0}})).status,409);
 for(const invalid of [-1,2,1.5,'1'])assert.equal((await post({action:'book',key:'invalid-couple-'+pkg+invalid,booking:{...c,numCompanions:invalid}})).status,400);
 if(pkg!=='sbu1'){const offered=await (await post({action:'offer',id:result.order.id})).json();assert.equal(offered.orders.find(o=>o.id===result.order.id).offer.total,total);}
 const read=await (await api.GET(new NextRequest('http://localhost:8081/api/local',{headers:{cookie}}))).json();assert.equal(read.orders.find(o=>o.id===result.order.id).numCompanions,1);
}

const {surveyMeals}=compile(path.join(root,'lib/pilot.ts'));const evaluated=await (await api.GET(new NextRequest('http://localhost:8081/api/local',{headers:{cookie}}))).json();const finished=evaluated.orders.find(o=>o.id===data.order.id);const mealId=surveyMeals(finished)[0].id;
const detailed={action:'surveyFei',id:finished.id,participant:'p1',mealId,scores:{NPI:80,LAI:90,EII:70,RWI:85,LPI:95},self:true};
assert.equal((await post({...detailed,scores:{NPI:80}})).status,400);assert.equal((await post({...detailed,participant:'p999'})).status,400);
assert.equal((await post({...detailed,self:false})).status,400);assert.equal((await post({...detailed,mealId:'unknown'})).status,400);
let surveyResult=await (await post(detailed)).json();assert.equal(surveyResult.orders.find(o=>o.id===finished.id).feiResponses[0].score,84);
surveyResult=await (await post(detailed)).json();assert.equal(surveyResult.orders.find(o=>o.id===finished.id).feiResponses.length,1);
assert.equal((await post({...detailed,scores:{...detailed.scores,NPI:1}})).status,409);
const npsPayload={action:'surveyNps',id:finished.id,participant:'p1',score:0,reason:'Khó chọn lịch',self:true};
assert.equal((await post({...npsPayload,score:11})).status,400);assert.equal((await post({...npsPayload,id:unknown.order.id})).status,409);
assert.equal((await post(npsPayload)).status,200);assert.equal((await post(npsPayload)).status,200);assert.equal((await post({...npsPayload,score:10})).status,409);

const prepId=unknown.order.id,prepPayload={action:'savePreparation',id:prepId,participant:'p1',self:true,operational:true,marketing:false,photo:false,parq:'declared'};
assert.equal((await post({action:'checkInPass',id:prepId,participant:'p1'})).status,409);
assert.equal((await post({...prepPayload,self:false})).status,400);assert.equal((await post({...prepPayload,parq:'diagnosed'})).status,400);
assert.equal((await post({...prepPayload,parq:'needs_review'})).status,200);assert.equal((await post({action:'checkInPass',id:prepId,participant:'p1'})).status,409);
assert.equal((await post(prepPayload)).status,200);const firstPass=await (await post({action:'checkInPass',id:prepId,participant:'p1'})).json();const passToken=firstPass.orders.find(o=>o.id===prepId).checkInPasses[0].token;
assert.equal((await post({action:'checkIn',id:prepId,participant:'p1',token:passToken})).status,403);
assert.equal((await post({action:'checkIn',id:prepId,participant:'p1',token:'wrong',source:'test-controls'})).status,400);
const checkPayload={action:'checkIn',id:prepId,participant:'p1',token:passToken,source:'test-controls'};
assert.equal((await post(checkPayload)).status,200);const checkinResult=await (await post(checkPayload)).json();assert.equal(checkinResult.orders.find(o=>o.id===prepId).checkIns.length,1);
await post({...prepPayload,operational:false});assert.equal((await post(checkPayload)).status,409);
const restored=await (await post(prepPayload)).json();assert.equal(restored.orders.find(o=>o.id===prepId).checkInPasses.length,0);

assert.equal((await post({action:'publishCard',id:finished.id,alias:'Tennis Friend',consent:false})).status,400);
assert.equal((await post({action:'publishCard',id:unknown.order.id,alias:'Tennis Friend',consent:true})).status,409);
const published=await (await post({action:'publishCard',id:finished.id,alias:'Tennis Friend',consent:true})).json();const publicToken=published.orders.find(o=>o.id===finished.id).publication.token;
const {getPublicCard}=compile(path.join(root,'lib/public-card.ts'));const publicResult=await getPublicCard(publicToken);assert.deepEqual(Object.keys(publicResult).sort(),['alias','completedAt','expiresAt','packageId','tourName'].sort());assert.equal(publicResult.alias,'Tennis Friend');assert.equal(await getPublicCard('bad'),null);
const refBooking={...booking,name:'New referred guest',phone:'0912345678',email:'ref-guest@example.com',referralToken:publicToken};
const referred=await (await post({action:'book',key:'referred-guest',booking:refBooking})).json();assert.equal(referred.order.referral.sourceOrderId,finished.id);assert.equal(referred.order.total,13800000);
assert.equal((await post({action:'book',key:'self-ref',booking:{...booking,referralToken:publicToken}})).status,400);
assert.equal((await post({action:'book',key:'bad-ref',booking:{...refBooking,referralToken:'invalid'}})).status,400);
await post({action:'revokeCard',id:finished.id});assert.equal(await getPublicCard(publicToken),null);
assert.equal((await post({action:'book',key:'revoked-ref',booking:refBooking})).status,400);
assert.equal((await post({action:'book',key:'referred-guest',booking:refBooking})).status,200);
await post({action:'logout'});assert.equal((await post({action:'pay',id:data.order.id,result:'success'})).status,401);
console.log('PASS: FEI5 per-meal validation/dedupe, NPS 0–10, consent/withdrawal, PAR-Q declaration gates, check-in token/idempotency, public-card privacy/revoke, referral attribution/self-referral/retry;  session, origin, validation, server price, duplicate booking, payment retry, persistence, logout, three SBU states/prices, payment gating, changed-payload conflict, points eligibility, concurrent awards, FEI validation, share cancel, ledger persistence, offer review/acceptance/payment gating for Premium and Tournament, start/complete transition guards, persisted journey phases, profile validation/persistence, saved NTRP/server scoring, immutable booking contact/NTRP snapshots, package itinerary entitlement counts and departure variants, request supplement/decline, processing history idempotency, activity runtime states/current-next/change notices/acknowledgement, manual training groups and change approval');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{process.chdir(root);fs.rmSync(temp,{recursive:true,force:true})});



