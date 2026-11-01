import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const original=await readFile('.local-data/store.json');
const cookies=new Map();
async function call(body){const r=await fetch('http://localhost:8081/api/local',{method:'POST',headers:{Origin:'http://localhost:8081','Content-Type':'application/json',Cookie:[...cookies].map(([k,v])=>`${k}=${v}`).join('; ')},body:JSON.stringify(body)});for(const c of r.headers.getSetCookie()){const [kv]=c.split(';');const i=kv.indexOf('=');cookies.set(kv.slice(0,i),kv.slice(i+1));}const d=await r.json();assert.equal(r.status,200,JSON.stringify(d));return d;}
const a=await call({action:'demoSelect',scenario:'personal'});assert.equal(a.orders.length,0);assert.equal(a.points,0);
await call({action:'profile',name:'Isolation test',phone:'',email:''});
const b=await call({action:'demoSelect',scenario:'club'});assert.equal(b.orders.length,1);assert.equal(b.orders[0].numPeople,16);assert.notEqual(b.account.name,'Isolation test');
assert.equal((await call({action:'demoSelect',scenario:'personal'})).account.name,'Isolation test');
assert.equal((await call({action:'demoReset',scenario:'personal'})).account.name,a.account.name);
assert.equal((await call({action:'demoSelect',scenario:'club'})).orders[0].id,b.orders[0].id);
const c=await call({action:'demoSelect',scenario:'couple'});assert.equal(c.orders.length,0);assert.equal(c.ntrpProfile.level,3.5);
const d=await call({action:'demoSelect',scenario:'returning'});assert.equal(d.orders.length,1);assert.ok(d.orders[0].completedAt);assert.equal(d.points,d.ledger.reduce((n,e)=>n+e.amount,0));assert.equal(d.orders[0].paid,d.orders[0].total);
assert.deepEqual(await readFile('.local-data/store.json'),original);
console.log('PASS: A/B isolation, resume, reset, four seeds, points consistency, legacy file unchanged.');
