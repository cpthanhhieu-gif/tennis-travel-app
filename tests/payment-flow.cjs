const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript'),crypto=require('node:crypto');
const docs=new Map(),cache=new Map();
class JsonResponse extends Response {static json(v,i){return new JsonResponse(JSON.stringify(v),i);}}
const storage={apiStorage:async(_r,f)=>f(),readDocument:async k=>structuredClone(docs.get(k)??null),writeDocument:async(k,v)=>docs.set(k,structuredClone(v)),cloudMode:()=>false};
function load(f){f=path.resolve(f);if(cache.has(f))return cache.get(f).exports;const m={exports:{}};cache.set(f,m);const req=n=>{if(n==='next/server')return{NextResponse:JsonResponse};if(n.endsWith('/cloud-store'))return storage;if(n==='@/lib/demo-auth')return{isAdmin:r=>r.testAdmin};if(n.startsWith('@/')||n.startsWith('.'))return load((n.startsWith('@/')?path.resolve(n.slice(2)):path.resolve(path.dirname(f),n))+'.ts');return require(n)};vm.runInNewContext(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{module:m,exports:m.exports,require:req,Date,Intl,URL,Buffer,process,Response,Request,structuredClone});return m.exports;}
const route=load('app/api/local/route.ts'),data=load('lib/mock-data.ts'),token='customer';
async function call(body,admin=false){const r=new Request('https://app.test/api/local',{method:'POST',headers:{origin:'https://app.test'},body:JSON.stringify(body)});r.nextUrl=new URL(r.url);r.cookies={get:k=>k==='tt-session'?{value:token}:undefined};r.testAdmin=admin;const res=await route.POST(r);return{status:res.status,body:await res.json()};}
function seed(extra={}){const t=data.tours[0];docs.set('store',{sessions:{[crypto.createHash('sha256').update(token).digest('hex')]:Date.now()+60000},orders:[{id:'one',tourId:t.id,departureCode:t.departureSchedules[0].code,numPeople:1,total:1000,deposit:300,paid:300,payment:'success',points:0,...extra}],ledger:[]});}
(async()=>{seed();assert.equal((await call({action:'reportBalance',id:'one'})).status,200);let o=docs.get('store').orders[0];assert.equal(o.paid,300);assert.equal(o.balancePayment,'awaiting_confirmation');await call({action:'reportBalance',id:'one'});assert.equal(docs.get('store').orders[0].history.length,1);assert.equal((await call({action:'pay',id:'one',phase:'balance',result:'success'})).status,403);assert.equal((await call({action:'pay',id:'one',phase:'balance',result:'failed'},true)).status,200);assert.equal((await call({action:'reportBalance',id:'one'})).status,200);await call({action:'pay',id:'one',phase:'balance',result:'success'},true);assert.equal(docs.get('store').orders[0].paid,1000);seed({paid:0});assert.equal((await call({action:'reportBalance',id:'one'})).status,409);seed({completedAt:new Date().toISOString()});assert.equal((await call({action:'reportBalance',id:'one'})).status,409);seed({paid:1000,startedAt:new Date().toISOString()});
let blocked=await call({action:'complete',id:'one',source:'test-controls'},true);
assert.equal(blocked.status,409);assert.ok(blocked.body.warnings.length);assert.equal(docs.get('store').orders[0].completedAt,undefined);
assert.equal((await call({action:'complete',id:'one',source:'test-controls',completionOverride:{warnings:[],reason:'Demo'}} ,true)).status,409);
assert.equal((await call({action:'complete',id:'one',source:'test-controls',completionOverride:{warnings:blocked.body.warnings,reason:'Demo skip explicitly'}} ,true)).status,200);
assert.equal(docs.get('store').orders[0].completionReview.reason,'Demo skip explicitly');
const pilot=load('lib/pilot.ts'),itinerary=load('lib/trip-itinerary.ts'),completion=load('lib/tour-completion.ts');
const meal=pilot.surveyMeals(docs.get('store').orders[0])[0];
const fei={action:'surveyFei',id:'one',participant:'p1',mealId:meal.id,scores:{NPI:80,LAI:80,EII:80,RWI:80,LPI:80},self:true};
assert.equal((await call(fei)).status,409);
docs.get('store').orders[0].activityUpdates={[meal.id]:{status:'cancelled'}};
assert.equal((await call(fei)).status,409);
docs.get('store').orders[0].activityUpdates[meal.id].status='done';
assert.equal((await call(fei)).status,200);
seed({paid:1000,startedAt:new Date().toISOString(),checkIns:[{participant:'p1'}]});
o=docs.get('store').orders[0];o.activityUpdates=Object.fromEntries(itinerary.tripItinerary(o).flatMap(d=>d.activities).map(a=>[a.id,{status:'done'}]));
assert.deepEqual(Array.from(completion.completionWarnings(o)),[]);
assert.equal((await call({action:'complete',id:'one',source:'test-controls'},true)).status,200);
const premium={...o,tourId:data.tours.find(t=>t.packageId==='sbu3').id,departureCode:data.tours.find(t=>t.packageId==='sbu3').departureSchedules[0].code};
assert.ok(completion.completionWarnings(premium).some(w=>w.includes('bảo hiểm')));
assert.ok(completion.completionWarnings(premium).some(w=>w.includes('kit')));
console.log('Passed: balance reporting, admin confirmation, completion guards/explicit demo override, completed/cancelled meal FEI restrictions and Premium warnings.');})().catch(e=>{console.error(e);process.exitCode=1});
