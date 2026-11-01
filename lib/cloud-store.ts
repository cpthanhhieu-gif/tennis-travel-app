import postgres from "postgres";
import {AsyncLocalStorage} from "node:async_hooks";
import {mkdir,readFile,writeFile,rename} from "node:fs/promises";
import path from "node:path";
import type {NextRequest} from "next/server";
const context=new AsyncLocalStorage<{room:string;sql?:postgres.TransactionSql}>();
let client:ReturnType<typeof postgres>|undefined;
export const cloudMode=()=>!!(process.env.VERCEL||process.env.DATABASE_URL);
function database(){if(!process.env.DATABASE_URL)throw Error("Chưa cấu hình DATABASE_URL");return client??=postgres(process.env.DATABASE_URL,{max:3,prepare:false,idle_timeout:20,connect_timeout:10});}
let ready:Promise<unknown>|undefined;
async function init(){if(!ready)ready=database()`CREATE TABLE IF NOT EXISTS tennis_demo_documents (key text PRIMARY KEY, data jsonb NOT NULL)` .catch(e=>{ready=undefined;throw e;});await ready;}
export function currentRoom(){return context.getStore()?.room??"local";}
export async function withStorage<T>(req:NextRequest,fn:()=>Promise<T>):Promise<T>{
 if(context.getStore()?.sql)return fn();
 const room=req.cookies.get("tt-room")?.value??"local";
 if(!cloudMode())return context.run({room},fn);
 await init();
 class RollbackResponse extends Error{constructor(public response:Response){super("Rollback response");}}
 try{return await database().begin(async sql=>{await sql`SELECT pg_advisory_xact_lock(77102931)`;const result=await context.run({room,sql},fn);if(result instanceof Response&&result.status>=500)throw new RollbackResponse(result);return result;}) as T;}catch(e){if(e instanceof RollbackResponse)return e.response as T;throw e;}
}
function key(name:string){return name.startsWith("global/")?name:`${currentRoom()}:${name}`;}
export async function readDocument<T>(name:string):Promise<T|null>{
 if(cloudMode()){await init();const sql=context.getStore()?.sql??database();const rows=await sql`SELECT data FROM tennis_demo_documents WHERE key=${key(name)}`;const data=rows[0]?.data;
 // Earlier deployments encoded the JSON payload twice. Decode those documents
 // on read; the next successful save writes the corrected JSONB representation.
 if(typeof data==="string"){try{const decoded=JSON.parse(data);if(decoded===null||typeof decoded==="object")return decoded as T;}catch{/* Leave a genuine JSON string unchanged. */}}
 return data as T??null;}
 try{return JSON.parse(await readFile(path.join(process.cwd(),".local-data",name+".json"),"utf8"));}catch(e){if((e as NodeJS.ErrnoException).code==="ENOENT")return null;throw e;}
}
export async function writeDocument(name:string,value:unknown){
 if(cloudMode()){await init();const sql=context.getStore()?.sql??database();await sql`INSERT INTO tennis_demo_documents (key,data) VALUES (${key(name)},${sql.json(value as postgres.JSONValue)}::jsonb) ON CONFLICT (key) DO UPDATE SET data=EXCLUDED.data`;return;}
 const file=path.join(process.cwd(),".local-data",name+".json");await mkdir(path.dirname(file),{recursive:true});await writeFile(file+".tmp",JSON.stringify(value),{mode:0o600});await rename(file+".tmp",file);
}
export async function roomExists(room:string){await init();const sql=context.getStore()?.sql??database();const rows=await sql`SELECT key FROM tennis_demo_documents WHERE key=${room+":room"}`;return !!rows.length;}

export async function apiStorage(req:NextRequest,fn:()=>Promise<Response>):Promise<Response>{
 try{return await withStorage(req,fn);}catch(error){
 const missing=cloudMode()&&!process.env.DATABASE_URL;
 const code=missing?"DATABASE_NOT_CONFIGURED":"DATABASE_UNAVAILABLE";
 // Log only a bounded error code; connection strings and credentials must never appear in logs.
 const dbCode=(error as {code?:unknown})?.code;
 const detailCode=typeof dbCode==="string"&&/^[A-Z0-9_]{1,40}$/.test(dbCode)?dbCode:"UNKNOWN";
 console.error("Demo storage unavailable",{code,dbCode:detailCode});
 return Response.json({code,detailCode,error:missing?"Bản triển khai này chưa có DATABASE_URL. Kết nối Neon vào đúng môi trường Production hoặc Preview, rồi Redeploy bản mới.":"Chưa kết nối được dữ liệu Demo. Kiểm tra kết nối Neon và DATABASE_URL của bản triển khai này trên Vercel."},{status:503,headers:{"Cache-Control":"no-store"}});
 }
}
