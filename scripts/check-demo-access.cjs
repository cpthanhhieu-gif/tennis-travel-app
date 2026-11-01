// Exercises real route handlers with an in-memory storage substitute; no live database is claimed.
const ts=require('typescript'),fs=require('fs'),path=require('path'),Module=require('module'),assert=require('node:assert/strict');
const root=process.cwd(),cache=new Map(),documents=new Map();const room='11111111-1111-4111-8111-111111111111';
const storage={cloudMode:()=>true,currentRoom:()=>room,roomExists:async()=>true,apiStorage:async(req,fn)=>fn(),withStorage:async(req,fn)=>fn(),readDocument:async key=>structuredClone(documents.get(key)??null),writeDocument:async(key,value)=>documents.set(key,structuredClone(value))};
function compile(file){if(cache.has(file))return cache.get(file).exports;const m=new Module(file,module);cache.set(file,m);m.filename=file;m.paths=module.paths;const orig=m.require.bind(m);m.require=id=>{if(id==='@/lib/cloud-store'||id==='./cloud-store')return storage;if(id.startsWith('@/lib/'))return compile(path.join(root,id.slice(2)+'.ts'));if(id.startsWith('./')&&fs.existsSync(path.join(path.dirname(file),id+'.ts')))return compile(path.join(path.dirname(file),id+'.ts'));return orig(id);};m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,file);return m.exports;}
(async()=>{process.env.DEMO_ADMIN_PASSWORD='only-test-password-for-demo';const {NextRequest}=require('next/server');const api=compile(path.join(root,'app/api/local/route.ts'));const auth=compile(path.join(root,'lib/demo-auth.ts'));let cookie='';const post=b=>api.POST(new NextRequest('http://localhost/api/local',{method:'POST',headers:{origin:'http://localhost',cookie,'content-type':'application/json'},body:JSON.stringify(b)}));
const login=await post({action:'login'});assert.equal(login.status,200);cookie='tt-session='+login.cookies.get('tt-session').value;
const before=JSON.stringify([...documents]);
for(const action of ['demoSelect','demoReset','demoOperate','seedRequestExamples','checkIn','saveOperations','sendOfferVersion','approveGroupQuote','publishGroupPlan','replyPremiumRevision','offer','updateActivity','assignTrainingGroup','resolveGroupChange','pay','start','complete'])assert.equal((await post({action,source:'test-controls',scenario:'personal'})).status,403,action);
assert.equal(JSON.stringify([...documents]),before,'forbidden actions must not change data');
assert.equal((await post({action:'profile',name:'Guest Demo',phone:'',email:''})).status,200);
assert.equal((await post({action:'profile',source:'operations',name:'forged'})).status,403);
cookie+='; tt-admin='+auth.adminToken(room,Date.now()+60000);
assert.equal((await post({action:'demoSelect',scenario:'personal'})).status,200);
const {GET}=compile(path.join(root,'app/api/demo/route.ts'));assert.equal((await GET(new NextRequest('http://localhost/api/demo'))).status,401);assert.equal((await GET(new NextRequest('http://localhost/api/demo',{headers:{cookie}}))).status,200);
console.log('PASS demo access: guest login/profile, 17 protected actions, forged source, no forbidden writes, admin scenario selection, protected demo listing');
})().catch(e=>{console.error(e);process.exitCode=1;});
