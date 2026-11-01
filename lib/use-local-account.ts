"use client";
import {type OperationDetails,type OfferVersion,validOperations} from "@/lib/operations";

import {type GroupRequest,type GroupQuote,validGroupRequest} from "@/lib/group-request";

import type {PremiumRequest} from "@/lib/premium-request";
import {latestPreparation,preparationReady,type PreparationFields} from "@/lib/preparation";
import type {PilotFields} from "./pilot";
import {requestErrorMessage} from "@/lib/request-error";
import {useEffect,useState,useRef} from "react";
import type {PointEntry} from "./ace-points";
import type {RequestEvent,RequestIssue} from "./request-flow";
import type {ActivityUpdate,TripNotice} from "./trip-runtime";
import type {GroupChange} from "./training-groups";
export type LocalOrder=PreparationFields & PilotFields & {publication?:{token:string;alias:string;createdAt:string;expiresAt:string};referral?:{sourceOrderId:string;token:string;at:string};trainingGroup?:{key:string;assignedAt:string};groupChange?:GroupChange;activityUpdates?:Record<string,ActivityUpdate>;notices?:TripNotice[];history?:RequestEvent[];issue?:RequestIssue;id:string;tourId:string;name:string;phone?:string;email?:string;ntrpLevel?:number;ntrpLabel?:string;
  operations?:OperationDetails;offerVersions?:OfferVersion[];groupRequest?:GroupRequest; groupQuote?:GroupQuote; groupPlanToken?:string; groupAdviceRequested?:boolean; premiumRequest?:PremiumRequest; offerRevision?:{reason:string;at:string};departureCode:string;numPeople:number;numCompanions?:number;playerRate?:number;companionRate?:number;total:number;deposit:number;paid:number;status:string;payment:string;points:number;activityChecks?:Record<string,boolean>;startedAt?:string;completedAt?:string;feiRating?:number;balancePayment?:string;offer?:{id:string;createdAt:string;acceptedAt?:string;total:number;deposit:number;departureCode:string}};
export type LocalData={account:{name:string;phone?:string;email?:string}|null;profile?:{name:string;phone:string;email:string}|null;ntrpProfile?:{level:number;label:string;assessedAt:string}|null;orders:LocalOrder[];points:number;ledger?:PointEntry[]};
export function useLocalAccount(){
 const acting=useRef(false),requestVersion=useRef(0);
 const [needsLogin,setNeedsLogin]=useState(false);
 const [data,setData]=useState<LocalData|null>(null),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 async function refresh(silent=false){if(acting.current)return;const version=++requestVersion.current;try{const r=await fetch("/api/local",{cache:"no-store"});const next=await r.json();if(!r.ok)throw Error(next.error||"Không tải được dữ liệu");if(version!==requestVersion.current||acting.current)return;setData(next);if(!silent){setError("");setNeedsLogin(false);}}catch(e){if(!silent)setError(e instanceof Error?e.message:"Không tải được dữ liệu. Vui lòng thử lại.");}}
 useEffect(()=>{void refresh();const timer=setInterval(()=>{if(document.visibilityState==="visible")void refresh(true);},5000);return()=>clearInterval(timer);},[]);
 async function act(body:object){if(acting.current)return false;acting.current=true;requestVersion.current++;setBusy(true);setError("");try{const r=await fetch("/api/local",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const d=await r.json();if(r.status===401)setNeedsLogin(true);if(!r.ok)throw Error(d.error);setData(d);return true;}catch(e){setError(requestErrorMessage(e));return false;}finally{acting.current=false;setBusy(false);}}
 return {data,error,busy,refresh:()=>refresh(),act,needsLogin,clearError:()=>setError("")};
}
