import {createHmac,timingSafeEqual} from "node:crypto";
import type {NextRequest} from "next/server";
import {cloudMode,currentRoom} from "./cloud-store";
export function adminToken(room:string,expires:number){return `${expires}.`+createHmac("sha256",process.env.DEMO_ADMIN_PASSWORD??"").update(`${room}:${expires}`).digest("hex");}
export function isAdmin(req:NextRequest){if(!cloudMode())return true;if(!process.env.DEMO_ADMIN_PASSWORD)return false;const token=req.cookies.get("tt-admin")?.value??"";const expiry=Number(token.split(".")[0]);if(!Number.isFinite(expiry)||expiry<Date.now()||expiry>Date.now()+86400001)return false;const expected=Buffer.from(adminToken(currentRoom(),expiry)),actual=Buffer.from(token);return expected.length===actual.length&&timingSafeEqual(expected,actual);}
export function passwordMatches(value:unknown){if(typeof value!=="string"||value.length>256||!process.env.DEMO_ADMIN_PASSWORD||process.env.DEMO_ADMIN_PASSWORD.length<16)return false;const a=Buffer.from(value),b=Buffer.from(process.env.DEMO_ADMIN_PASSWORD);return a.length===b.length&&timingSafeEqual(a,b);}
