const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
let locks=0,writes=0;const sql=async(parts)=>{const q=parts.join('');if(q.includes('pg_advisory'))locks++;if(q.includes('INSERT'))writes++;return [];};sql.json=x=>x;sql.begin=async fn=>fn(sql);
const out={};const modules={postgres:{default:()=>sql},'node:async_hooks':require('node:async_hooks'),'node:fs/promises':require('node:fs/promises'),'node:path':{default:require('node:path')}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/cloud-store.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:out,require:n=>modules[n],process:{env:{DATABASE_URL:'mock'}},Response,console});
const req={cookies:{get:()=>({value:'test-room'})}};
(async()=>{
 await out.withStorage(req,()=>out.readDocument('store'),true);assert.equal(locks,0);
 await out.withStorage(req,()=>out.writeDocument('store',{}));assert.equal(locks,1);assert.equal(writes,1);
 await assert.rejects(()=>out.withStorage(req,()=>out.writeDocument('store',{}),true),/read-only/);assert.equal(writes,1);
 await Promise.all([out.withStorage(req,()=>out.readDocument('store'),true),out.withStorage(req,()=>out.writeDocument('store',{}))]);assert.equal(locks,2);assert.equal(writes,2);
 console.log('PASS: reads skip write lock, writes retain lock, read-only writes rejected, mixed requests remain isolated');
})().catch(e=>{console.error(e);process.exitCode=1;});
