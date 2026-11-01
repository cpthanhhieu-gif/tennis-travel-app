import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const legacy=await readFile('.local-data/store.json');const personal=await readFile('.local-data/scenarios/personal/store.json');const cookies=new Map();
async function call(body,status=200){const r=await fetch('http://localhost:8081/api/local',{method:'POST',headers:{Origin:'http://localhost:8081','Content-Type':'application/json',Cookie:[...cookies].map(([k,v])=>`${k}=${v}`).join('; ')},body:JSON.stringify(body)});for(const c of r.headers.getSetCookie()){const [kv]=c.split(';');const i=kv.indexOf('=');cookies.set(kv.slice(0,i),kv.slice(i+1));}const d=await r.json();assert.equal(r.status,status,JSON.stringify(d));return d;}
const d=await call({action:'demoSelect',scenario:'club'});const o=d.orders[0];assert.ok(o);
await call({action:'demoOperate',scenario:'personal',id:o.id,event:'offer'},409);
await call({action:'demoOperate',scenario:'club',id:'not-in-this-scenario',event:'offer'},404);
if(!o.paid&&!o.offer?.acceptedAt){
 const n=await call({action:'demoOperate',scenario:'club',id:o.id,event:'needsInfo'});assert.equal(n.orders[0].issue.type,'needsInfo');
 await call({action:'demoOperate',scenario:'club',id:o.id,event:'offer'},409);
 await call({action:'supplement',id:o.id,response:'Demo test: đoàn đến lúc 09:00, phòng twin.'});
 const offered=await call({action:'demoOperate',scenario:'club',id:o.id,event:'offer'});assert.ok(offered.orders[0].offer);assert.equal(offered.orders[0].paid,0);
 await call({action:'demoOperate',scenario:'club',id:o.id,event:'schedule'},409);
}
const current=await call({action:'demoSelect',scenario:'club'});const offer=current.orders[0].offer;
if(offer){await call({action:'acceptOffer',id:o.id,offerId:offer.id});await call({action:'pay',id:o.id,result:'success'});
const changed=await call({action:'demoOperate',scenario:'club',id:o.id,event:'schedule'});const updated=changed.orders.find(x=>x.id===o.id);assert.ok(updated.notices.length);assert.equal(updated.notices.at(-1).after.location,'Sân dự phòng · địa điểm demo');
const repeated=await call({action:'demoOperate',scenario:'club',id:o.id,event:'schedule'});assert.equal(repeated.orders.find(x=>x.id===o.id).notices.length,updated.notices.length);}
assert.deepEqual(await readFile('.local-data/store.json'),legacy);assert.deepEqual(await readFile('.local-data/scenarios/personal/store.json'),personal);
console.log('PASS: active scope guard, foreign booking guard, needs info, blocked offer, supplement then offer, unpaid schedule guard, unrelated data unchanged.');
