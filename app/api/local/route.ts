import {readDocument,writeDocument,apiStorage,cloudMode,currentRoom,roomExists} from "@/lib/cloud-store";
import {isAdmin} from "@/lib/demo-auth";
import {type OperationDetails,type OfferVersion,validOperations} from "@/lib/operations";
import {type GroupRequest,type GroupQuote,validGroupRequest} from "@/lib/group-request";
import {type PremiumRequest,validPremiumRequest} from "@/lib/premium-request";
import {publishGroupPlan} from "@/lib/group-plans";
import {scenarioKey,ensureScenario,resetScenario} from "@/lib/demo-store";
import {isScenarioId} from "@/lib/demo-scope";
import {latestPreparation,preparationReady,checkInMissing,type PreparationFields} from "@/lib/preparation";
import {FEI_CRITERIA,participants,surveyMeals,validFei,feiMean,type PilotFields} from "@/lib/pilot";
import {coupleTotal,companionRate} from "@/lib/couple-pricing";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID, createHash } from "node:crypto";
import { packageCapacity, tours, ntrpQuiz, getNtrpLevel } from "@/lib/mock-data";
import { awardOnce, type PointEntry } from "@/lib/ace-points";
import {tripItinerary,validChecklistItem} from "@/lib/trip-itinerary";
import {addRequestEvent,requestBlocked,requestExamples,type RequestEvent,type RequestIssue} from "@/lib/request-flow";
import {validActivityTime,type ActivityUpdate,type TripNotice,type ActivityStatus} from "@/lib/trip-runtime";
import {trainingGroups,type GroupChange} from "@/lib/training-groups";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Order = PreparationFields & PilotFields & {publication?:{token:string;alias:string;createdAt:string;expiresAt:string};referral?:{sourceOrderId:string;token:string;at:string};trainingGroup?:{key:string;assignedAt:string};groupChange?:GroupChange;activityUpdates?:Record<string,ActivityUpdate>;notices?:TripNotice[];history?:RequestEvent[];issue?:RequestIssue;id:string; key:string; tourId:string; name:string;phone?:string;email?:string;ntrpLevel?:number;ntrpLabel?:string;
  operations?:OperationDetails;offerVersions?:OfferVersion[];groupRequest?:GroupRequest; groupQuote?:GroupQuote; groupPlanToken?:string; groupAdviceRequested?:boolean; premiumRequest?:PremiumRequest; offerRevision?:{reason:string;at:string}; departureCode:string; numPeople:number;numCompanions?:number;playerRate?:number;companionRate?:number; total:number; deposit:number; paid:number; status:string; payment:string; points:number;activityChecks?:Record<string,boolean>;startedAt?:string;completedAt?:string;feiRating?:number;balancePayment?:string;offer?:{id:string;createdAt:string;acceptedAt?:string;total:number;deposit:number;departureCode:string}};
type Store = {sessions: Record<string,number>; orders:Order[];ledger:PointEntry[];profile?:{name:string;phone:string;email:string};ntrpProfile?:{level:number;label:string;assessedAt:string}};

let queue:Promise<unknown>=Promise.resolve();
async function load(scope?:string):Promise<Store>{
 if(isScenarioId(scope))await ensureScenario(scope);
 try{
  const s=(await readDocument<Store>(scenarioKey(scope)))??{sessions:{},orders:[],ledger:[]};
  if(!s.ledger){s.ledger=[];for(const o of s.orders){if(o.points>0)s.ledger.push({key:`${o.id}:opening`,orderId:o.id,kind:"opening",amount:o.points,createdAt:new Date().toISOString()});}}
  return s;
 }catch(e){if((e as NodeJS.ErrnoException).code==="ENOENT")return {sessions:{},orders:[],ledger:[]};throw e;}
}
async function save(s:Store,scope?:string){await writeDocument(scenarioKey(scope),s);for(const o of s.orders){if(o.publication){const t=tours.find(t=>t.id===o.tourId);await writeDocument(`global/cards/${o.publication.token}`,{alias:o.publication.alias,packageId:t?.packageId,tourName:t?.name,completedAt:o.completedAt,expiresAt:o.publication.expiresAt});}}}
const hash=(s:string)=>createHash("sha256").update(s).digest("hex");
function view(s:Store){return {account:s.profile??{name:"Tennis Member"},orders:s.orders,points:s.ledger.reduce((n,e)=>n+e.amount,0),ledger:s.ledger,profile:s.profile??null,ntrpProfile:s.ntrpProfile??null};}
async function getLocal(req:NextRequest){await queue;const scope=req.cookies.get("tt-scenario")?.value;const s=await load(scope);const token=req.cookies.get("tt-session")?.value;return NextResponse.json(token&&s.sessions[hash(token)]>Date.now()?view(s):{account:null,orders:[],points:0},{headers:{"Cache-Control":"no-store"}});}
async function postLocal(req:NextRequest){
 if(req.headers.get("origin")!==req.nextUrl.origin)return NextResponse.json({error:"Yêu cầu không hợp lệ"},{status:403});
 const run=async()=>{try{const b=await req.json();
 if(cloudMode()&&(!/^[a-f0-9-]{36}$/.test(currentRoom())||!await roomExists(currentRoom())))return NextResponse.json({error:"Mở link phiên demo do người trình diễn cung cấp."},{status:403});
 const privileged=["demoSelect","demoReset","demoOperate","seedRequestExamples","checkIn","saveOperations","sendOfferVersion","approveGroupQuote","publishGroupPlan","replyPremiumRevision","offer","updateActivity","assignTrainingGroup","resolveGroupChange","pay","start","complete"];
 if((privileged.includes(b.action)||b.source==="test-controls"||b.source==="operations")&&!isAdmin(req))return NextResponse.json({error:"Cần đăng nhập quản trị Demo để thực hiện thao tác này."},{status:403});
 let scope=req.cookies.get("tt-scenario")?.value;
 if(b.action==="demoSelect"||b.action==="demoReset"){
  if(b.scenario!=="legacy"&&!isScenarioId(b.scenario))return NextResponse.json({error:"Kịch bản không hợp lệ"},{status:400});
  scope=b.scenario==="legacy"?undefined:b.scenario;
  if(b.action==="demoReset"){if(!isScenarioId(scope))return NextResponse.json({error:"Không đặt lại dữ liệu hiện tại"},{status:400});await resetScenario(scope);}
 }
 const s=await load(scope);const token=req.cookies.get("tt-session")?.value;
 if(b.action==="login"||b.action==="demoSelect"||b.action==="demoReset"){const t=randomUUID();s.sessions[hash(t)]=Date.now()+86400000;await save(s,scope);const r=NextResponse.json(view(s));if(b.action!=="login"){r.cookies.set("tt-scenario",scope??"",{sameSite:"strict",path:"/",maxAge:scope?86400*30:0});if(b.action==="demoReset"&&scope)r.cookies.set(`tt-revision-${scope}`,randomUUID(),{sameSite:"strict",path:"/",maxAge:86400*30});}r.cookies.set("tt-session",t,{httpOnly:true,sameSite:"strict",secure:req.nextUrl.protocol==="https:",path:"/",maxAge:86400});return r;}
 if(!token||!(s.sessions[hash(token)]>Date.now()))return NextResponse.json({error:"Vui lòng đăng nhập tại Cá nhân"},{status:401});
 if(b.action==="demoOperate"){
  if(!isScenarioId(scope)||b.scenario!==scope)return NextResponse.json({error:"Chọn đúng kịch bản đang hoạt động trước khi mô phỏng."},{status:409});
  const o=s.orders.find(o=>o.id===b.id);if(!o)return NextResponse.json({error:"Chưa có booking trong kịch bản này."},{status:404});
  if(o.completedAt)return NextResponse.json({error:"Chuyến đã hoàn thành, không thể đổi phương án/lịch."},{status:409});
  if(b.event==="needsInfo"){
   if(o.paid>0||o.offer?.acceptedAt)return NextResponse.json({error:"Chỉ yêu cầu bổ sung trước khi chấp thuận hoặc thanh toán."},{status:409});
   if(o.issue?.type!=="needsInfo"||o.issue.response){o.issue={type:"needsInfo",reason:"Mô phỏng: vui lòng bổ sung giờ đến dự kiến và lựa chọn phòng đôi/twin trong phần phản hồi yêu cầu."};o.status="Cần bổ sung thông tin";addRequestEvent(o,"created","Mô phỏng vận hành: yêu cầu bổ sung thông tin");}
   await save(s,scope);return NextResponse.json(view(s));
  }
  if(b.event==="group") {b.action="assignTrainingGroup";b.source="test-controls";}
  else if(b.event==="offer")b.action="offer";
  else if(b.event==="schedule"){
   const a=tripItinerary(o).flatMap(d=>d.activities).find(a=>["court","clinic","competition"].includes(a.kind))??tripItinerary(o)[0]?.activities[0];
   if(!a)return NextResponse.json({error:"Chuyến chưa có lịch."},{status:409});
   if(o.activityUpdates?.[a.id]?.reason==="Mô phỏng: điều phối xác nhận chuyển sân theo phương án dự phòng.")return NextResponse.json(view(s));
   Object.assign(b,{action:"updateActivity",source:"test-controls",activityId:a.id,status:"changed",time:a.time,location:"Sân dự phòng · địa điểm demo",reason:"Mô phỏng: điều phối xác nhận chuyển sân theo phương án dự phòng."});
  }else return NextResponse.json({error:"Sự kiện không hợp lệ."},{status:400});
 }
 if(b.action==="logout"){delete s.sessions[hash(token)];await save(s,scope);const r=NextResponse.json({account:null,orders:[],points:0});r.cookies.set("tt-session","",{path:"/",maxAge:0});return r;}
 if(b.action==="ntrp"){
  if(!b.answers||!ntrpQuiz.every(q=>q.options.some(o=>o.value===b.answers[q.id])))return NextResponse.json({error:"Cần trả lời đúng định dạng cả 5 câu NTRP"},{status:400});
  const average=ntrpQuiz.reduce((sum,q)=>sum+b.answers[q.id],0)/ntrpQuiz.length;
  const result=getNtrpLevel(average);s.ntrpProfile={level:result.level,label:result.label,assessedAt:new Date().toISOString()};await save(s,scope);return NextResponse.json(view(s));
 }
 if(b.action==="profile"){
  const name=typeof b.name==="string"?b.name.trim():"";
  const phone=typeof b.phone==="string"?b.phone.replace(/[\s().-]/g,""):"";
  const email=typeof b.email==="string"?b.email.trim():"";
  if(!name||name.length>100||phone.length>30||email.length>254||(phone&&!/^(?:0\d{9,10}|\+[1-9]\d{7,14})$/.test(phone))||(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))return NextResponse.json({error:"Kiểm tra tên, số điện thoại và email."},{status:400});
  s.profile={name,phone,email};await save(s,scope);return NextResponse.json(view(s));
 }
 if(b.action==="seedRequestExamples"){
  if(b.source!=="test-controls")return NextResponse.json({error:"Thao tác chỉ có trong điều khiển thử nghiệm"},{status:403});
  for(const example of requestExamples){const key=`request-example-v1:${example.packageId}:${example.type}`;if(s.orders.some(o=>o.key===key))continue;const t=tours.find(t=>t.packageId===example.packageId)!;const d=t.departureSchedules[0];const total=d.price*example.people;
   const o:Order={id:randomUUID(),key,tourId:t.id,name:example.name,phone:"0901234567",email:"travel@example.com",departureCode:d.code,numPeople:example.people,total,deposit:Math.round(total*(t.packageId==="sbu2"?.5:.3)),paid:0,status:example.type==="needsInfo"?"Cần bổ sung thông tin":"Không đáp ứng được",payment:"pending",points:0,issue:{type:example.type,reason:example.reason}};
   addRequestEvent(o,"created","Đã gửi yêu cầu");addRequestEvent(o,"reviewed",o.status);s.orders.unshift(o);
  }await save(s,scope);return NextResponse.json(view(s));
 }
 if(b.action==="supplement"){
  const o=s.orders.find(o=>o.id===b.id);if(!o)return NextResponse.json({error:"Không tìm thấy yêu cầu"},{status:404});
  if(o.issue?.type!=="needsInfo"||o.paid>0)return NextResponse.json({error:"Yêu cầu này không chờ bổ sung thông tin"},{status:409});
  if(typeof b.response!=="string"||!b.response.trim()||b.response.trim().length>1000)return NextResponse.json({error:"Nhập thông tin bổ sung từ 1 đến 1.000 ký tự"},{status:400});
  if(!o.issue.response){o.issue.response=b.response.trim();o.issue.respondedAt=new Date().toISOString();o.status="Đã nhận thông tin bổ sung";addRequestEvent(o,"supplemented","Đã nhận thông tin bổ sung");}
  await save(s,scope);return NextResponse.json(view(s));
 }
 if(["savePreparation","checkInPass","checkIn"].includes(b.action)){
  const o=s.orders.find(o=>o.id===b.id);if(!o)return NextResponse.json({error:"Không tìm thấy chuyến"},{status:404});
  const person=participants(o).find(p=>p.id===b.participant);if(!person)return NextResponse.json({error:"Người tham gia không thuộc chuyến"},{status:400});
  if(o.completedAt)return NextResponse.json({error:"Chuyến đã hoàn thành"},{status:409});
  if(b.action==="savePreparation"){
   if(b.self!==true||typeof b.operational!=="boolean"||typeof b.marketing!=="boolean"||typeof b.photo!=="boolean"||!(person.player?["declared","needs_review"]:["not_applicable"]).includes(b.parq))return NextResponse.json({error:"Kiểm tra đồng thuận và trạng thái PAR-Q của chính bạn"},{status:400});
   const next={participant:person.id,operational:b.operational,marketing:b.marketing,photo:b.photo,parq:b.parq,version:"prep-v1" as const,at:new Date().toISOString()};
   const previous=latestPreparation(o,person.id);
   if(!previous||["operational","marketing","photo","parq"].some(k=>previous[k as keyof typeof previous]!==next[k as keyof typeof next])){o.preparation??=[];o.preparation.push(next);o.checkInPasses=o.checkInPasses?.filter(x=>x.participant!==person.id);}
  }else{
   if(requestBlocked(o))return NextResponse.json({error:"Yêu cầu chuyến đi còn chờ xử lý. Xem tab Tổng quan trước khi check-in."},{status:409});
   const missing=checkInMissing(o,person.id,person.player);
   if(missing.length)return NextResponse.json({error:`Chưa thể lấy mã check-in. Cần bổ sung: ${missing.join("; ")}.`,missing},{status:409});
   o.checkInPasses??=[];
   if(b.action==="checkInPass"){
    let pass=o.checkInPasses.find(p=>p.participant===person.id&&Date.parse(p.expiresAt)>Date.now());if(!pass){pass={participant:person.id,token:randomUUID(),expiresAt:new Date(Date.now()+24*3600000).toISOString()};o.checkInPasses=o.checkInPasses.filter(x=>x.participant!==person.id);o.checkInPasses.push(pass);}
   }else{
    if(b.source!=="test-controls")return NextResponse.json({error:"Cần xác nhận tại bàn check-in"},{status:403});
    const pass=o.checkInPasses.find(p=>p.participant===person.id&&p.token===b.token&&Date.parse(p.expiresAt)>Date.now());if(!pass)return NextResponse.json({error:"Mã check-in sai, hết hạn hoặc đã được thu hồi"},{status:400});
    o.checkIns??=[];if(!o.checkIns.some(p=>p.participant===person.id))o.checkIns.push({participant:person.id,at:new Date().toISOString(),source:"test-controls"});
   }
  }await save(s,scope);return NextResponse.json(view(s));
 }
 if(b.action==="surveyFei"||b.action==="surveyNps"){
  const o=s.orders.find(o=>o.id===b.id);if(!o)return NextResponse.json({error:"Không tìm thấy chuyến"},{status:404});
  if(!participants(o).some(p=>p.id===b.participant)||b.self!==true)return NextResponse.json({error:"Chọn đúng người tham gia và xác nhận tự đánh giá"},{status:400});
  if(b.action==="surveyFei"){
   const meal=surveyMeals(o).find(a=>a.id===b.mealId);if(!meal||!validFei(b.scores))return NextResponse.json({error:"Chọn bữa và nhập đủ 5 tiêu chí từ 0 đến 100"},{status:400});
   if(!o.completedAt&&(!o.startedAt||o.activityUpdates?.[meal.id]?.status!=="done"))return NextResponse.json({error:"Bữa ăn chưa hoàn tất theo lịch vận hành"},{status:409});
   o.feiResponses??=[];const previous=o.feiResponses.find(x=>x.participant===b.participant&&x.mealId===meal.id);
   if(previous&&FEI_CRITERIA.some(c=>previous.scores[c.key]!==b.scores[c.key]))return NextResponse.json({error:"Bữa này đã được gửi, không ghi đè phản hồi đã nộp"},{status:409});
   if(!previous)o.feiResponses.push({participant:b.participant,mealId:meal.id,scores:b.scores,score:feiMean(b.scores),version:"fei-pilot-v1",at:new Date().toISOString()});
   awardOnce(s.ledger,o,"fei");
  }else{
   if(!o.completedAt)return NextResponse.json({error:"NPS mở sau khi hành trình hoàn thành"},{status:409});
   if(!Number.isInteger(b.score)||b.score<0||b.score>10||typeof b.reason!=="string"||b.reason.length>1000)return NextResponse.json({error:"Chọn NPS 0–10; lý do tối đa 1.000 ký tự"},{status:400});
   o.npsResponses??=[];const previous=o.npsResponses.find(x=>x.participant===b.participant);
   if(previous&&(previous.score!==b.score||previous.reason!==b.reason.trim()))return NextResponse.json({error:"NPS đã được gửi; không ghi đè phản hồi"},{status:409});
   if(!previous)o.npsResponses.push({participant:b.participant,score:b.score,reason:b.reason.trim(),version:"nps-v1",at:new Date().toISOString()});
  }await save(s,scope);return NextResponse.json(view(s));
 }
 if(b.action==="publishCard"||b.action==="revokeCard"){
  const o=s.orders.find(o=>o.id===b.id);if(!o)return NextResponse.json({error:"Không tìm thấy chuyến"},{status:404});
  if(b.action==="revokeCard"){if(o.publication)await writeDocument(`global/cards/${o.publication.token}`,null);delete o.publication;await save(s,scope);return NextResponse.json(view(s));}
  if(!o.completedAt)return NextResponse.json({error:"Chỉ chia sẻ chuyến đã hoàn thành"},{status:409});
  if(b.consent!==true||typeof b.alias!=="string"||!b.alias.trim()||b.alias.trim().length>60)return NextResponse.json({error:"Nhập tên hiển thị tối đa 60 ký tự và đồng ý tạo liên kết công khai"},{status:400});
  if(!o.publication||Date.parse(o.publication.expiresAt)<=Date.now()||o.publication.alias!==b.alias.trim())o.publication={token:randomUUID(),alias:b.alias.trim(),createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+30*86400000).toISOString()};
  await save(s,scope);return NextResponse.json(view(s));
 }
 if(b.action==="book"){
 const level=b.booking?.ntrpLevel;
 if(level!==undefined&&level!==0&&![1.5,2.5,3.5,4.5,5].includes(level))return NextResponse.json({error:"Kết quả NTRP không hợp lệ"},{status:400});
 const t=tours.find(t=>t.id===b.booking?.tourId);const d=t?.departureSchedules.find(d=>d.code===b.booking?.departureCode);const n=b.booking?.numPeople;const companions=b.booking?.numCompanions??0;const name=b.booking?.name;
 if(!t||!d||!Number.isInteger(n)||n<1||n>packageCapacity(t.packageId)||!Number.isInteger(companions)||companions<0||companions>=n||typeof name!=="string"||!name.trim()||name.length>100||typeof b.key!=="string"||!b.key.trim()||b.key.length>100)return NextResponse.json({error:"Thông tin đặt chỗ không hợp lệ"},{status:400});
 const ref=b.booking?.referralToken??"";let referral:Order["referral"];
 const previousOrder=s.orders.find(o=>o.key===b.key);
 if(ref&&previousOrder&&previousOrder.referral&&previousOrder.referral.token===ref)referral=previousOrder.referral;
 else if(ref){if(typeof ref!=="string")return NextResponse.json({error:"Mã giới thiệu không hợp lệ"},{status:400});const source=s.orders.find(x=>x.completedAt&&x.publication?.token===ref&&Date.parse(x.publication.expiresAt)>Date.now());if(!source)return NextResponse.json({error:"Liên kết giới thiệu đã hết hạn hoặc bị thu hồi. Bạn có thể xóa mã để tiếp tục."},{status:400});
 const email=typeof b.booking.email==="string"?b.booking.email.trim().toLowerCase():"",phone=typeof b.booking.phone==="string"?b.booking.phone.replace(/\D/g,""):"";
 if(email&&email===source.email?.trim().toLowerCase()||phone&&phone===source.phone?.replace(/\D/g,""))return NextResponse.json({error:"Không ghi nhận tự giới thiệu. Xóa mã giới thiệu để tiếp tục đặt cho chính bạn."},{status:400});
 referral={sourceOrderId:source.id,token:ref,at:new Date().toISOString()};}
 if(t.packageId==="sbu2"&&b.booking.groupRequest!==undefined&&!validGroupRequest(b.booking.groupRequest))return NextResponse.json({error:"Kiểm tra quy mô, 2–3 ngày đi và nhu cầu đoàn"},{status:400});
 if(t.packageId==="sbu3"&&b.booking.premiumRequest!==undefined&&!validPremiumRequest(b.booking.premiumRequest))return NextResponse.json({error:"Kiểm tra ngày mong muốn và nhu cầu Premium"},{status:400});
 let o=s.orders.find(o=>o.key===b.key);if(o&&(o.tourId!==t.id||o.departureCode!==d.code||o.numPeople!==n||JSON.stringify(o.groupRequest)!==JSON.stringify(t.packageId==="sbu2"?b.booking.groupRequest:undefined)||JSON.stringify(o.premiumRequest)!==JSON.stringify(t.packageId==="sbu3"?b.booking.premiumRequest:undefined)||(o.groupAdviceRequested??false)!==(b.booking.groupAdviceRequested===true)||(o.referral?.token??"")!==ref||(o.numCompanions??0)!==companions||o.name!==name.trim()||(o.phone??"")!==(b.booking.phone??"")||(o.email??"")!==(b.booking.email??"")||(o.ntrpLevel??0)!==(t.packageId==="sbu2"?0:(level??0))))return NextResponse.json({error:"Thông tin đã thay đổi. Vui lòng quay lại bước trước rồi xác nhận lại."},{status:409});if(!o){const total=coupleTotal(t.packageId,d.price,n,companions);o={id:randomUUID(),key:b.key,tourId:t.id,name:name.trim(),phone:typeof b.booking.phone==="string"?b.booking.phone.slice(0,30):undefined,email:typeof b.booking.email==="string"?b.booking.email.slice(0,254):undefined,ntrpLevel:t.packageId!=="sbu2"&&level?level:undefined,ntrpLabel:t.packageId!=="sbu2"&&level?getNtrpLevel(level).label:undefined,groupRequest:t.packageId==="sbu2"?b.booking.groupRequest:undefined,premiumRequest:t.packageId==="sbu3"?b.booking.premiumRequest:undefined,groupAdviceRequested:b.booking.groupAdviceRequested===true,departureCode:d.code,numPeople:n,numCompanions:companions,referral,playerRate:d.price,companionRate:companionRate(t.packageId),total,deposit:Math.round(total*(t.packageId==="sbu2"?.5:.3)),paid:0,status:t.packageId==="sbu2"?"Chờ báo giá":t.packageId==="sbu3"?"Chờ xác nhận trong 24 giờ":"Chờ đặt cọc",payment:"pending",points:0};addRequestEvent(o,"created",t.packageId==="sbu1"?"Đã tạo booking, chờ đặt cọc":"Đã gửi yêu cầu");s.orders.unshift(o);await save(s,scope);}return NextResponse.json({...view(s),order:o});}
 if(b.action==="saveOperations"||b.action==="sendOfferVersion"){
 if(b.source!=="operations")return NextResponse.json({error:"Mở công cụ vận hành cục bộ để cập nhật"},{status:403});
 const o=s.orders.find(o=>o.id===b.id);if(!o)return NextResponse.json({error:"Không tìm thấy yêu cầu"},{status:404});
 if(o.completedAt)return NextResponse.json({error:"Chuyến đã kết thúc"},{status:409});
 if(b.action==="saveOperations"){
 if(!validOperations(b.details)||b.details.size>o.numPeople)return NextResponse.json({error:"Kiểm tra thông tin sân, HLV và quy mô nhóm"},{status:400});
 o.operations={...b.details,updatedAt:new Date().toISOString()};if(o.groupChange?.status==="pending"){o.groupChange.status="accepted";o.groupChange.resolution="Điều phối đã cập nhật thông tin nhóm theo chuyến.";o.groupChange.resolvedAt=new Date().toISOString();}addRequestEvent(o,"created","Đã cập nhật sân, HLV và phân nhóm theo lịch");
 }else{
 if(o.paid>0||o.offer?.acceptedAt||o.groupPlanToken)return NextResponse.json({error:"Không sửa báo giá đã chấp thuận, thanh toán hoặc chia sẻ thành viên"},{status:409});
 if(b.baseOfferId!==(o.offer?.id??null))return NextResponse.json({error:"Phương án đã thay đổi; tải lại trước khi gửi"},{status:409});
 if(!Number.isSafeInteger(b.total)||b.total<=0||b.total>10000000000||![b.program,b.included,b.extras,b.pending,b.changeNote].every(v=>typeof v==="string"&&v.trim().length>0&&v.length<=2000))return NextResponse.json({error:"Điền đầy đủ nội dung, lý do thay đổi và tổng giá hợp lệ"},{status:400});
 const pkg=tours.find(t=>t.id===o.tourId)?.packageId;if(pkg==="sbu1")return NextResponse.json({error:"Leisure không dùng luồng báo giá"},{status:409});
 if(pkg==="sbu2"&&(!o.groupQuote||b.total!==o.groupQuote.fixed+o.groupQuote.perPerson*o.numPeople))return NextResponse.json({error:"Giá đoàn phải khớp bảng chi phí đã duyệt"},{status:409});
 o.offerVersions??=[];const v:OfferVersion={id:randomUUID(),version:o.offerVersions.length+1,createdAt:new Date().toISOString(),total:b.total,deposit:Math.round(b.total*(pkg==="sbu2"?.5:.3)),departureCode:o.departureCode,program:b.program.trim(),included:b.included.trim(),extras:b.extras.trim(),pending:b.pending.trim(),changeNote:b.changeNote.trim()};o.offerVersions.push(v);o.offer={id:v.id,createdAt:v.createdAt,total:v.total,deposit:v.deposit,departureCode:v.departureCode};o.total=v.total;o.deposit=v.deposit;o.offerRevision=undefined;o.status="Phương án sẵn sàng";addRequestEvent(o,"offered",`Đã gửi phương án phiên bản ${v.version}`);
 }
 await save(s,scope);return NextResponse.json(view(s));
 }
 if(b.action==="approveGroupQuote"||b.action==="publishGroupPlan"){
 const o=s.orders.find(o=>o.id===b.id);if(!o||tours.find(t=>t.id===o.tourId)?.packageId!=="sbu2")return NextResponse.json({error:"Không tìm thấy yêu cầu đoàn"},{status:404});
 if(b.action==="approveGroupQuote"){
 if(b.source!=="test-controls"||o.paid>0||o.offer?.acceptedAt)return NextResponse.json({error:"Chỉ duyệt mẫu trước khi chấp thuận"},{status:409});
 if(!Number.isInteger(b.fixed)||b.fixed<0||!Number.isInteger(b.perPerson)||b.perPerson<=0||typeof b.options!=="string"||b.options.length>500||typeof b.sourceNote!=="string"||!b.sourceNote.trim()||b.sourceNote.length>200)return NextResponse.json({error:"Kiểm tra chi phí và nguồn báo giá"},{status:400});
 if(o.groupPlanToken)return NextResponse.json({error:"Phương án đã gửi thành viên; cần thu hồi trước khi đổi giá"},{status:409});
 o.groupQuote={fixed:b.fixed,perPerson:b.perPerson,options:b.options,source:b.sourceNote.trim(),approvedAt:new Date().toISOString()};o.total=b.fixed+b.perPerson*o.numPeople;o.deposit=Math.round(o.total*.5);o.offer=undefined;
 }else{
 if(!o.groupQuote||!o.groupRequest||typeof b.deadline!=="string"||isNaN(Date.parse(b.deadline))||Date.parse(b.deadline)<=Date.now())return NextResponse.json({error:"Cần nhu cầu đoàn, giá đã duyệt và hạn phản hồi tương lai"},{status:400});
 if(o.groupPlanToken)return NextResponse.json(view(s));
 o.groupPlanToken=await publishGroupPlan({token:o.groupPlanToken,tourName:tours.find(t=>t.id===o.tourId)!.name,request:o.groupRequest,quote:o.groupQuote,deadline:b.deadline});
 }
 await save(s,scope);return NextResponse.json(view(s));
 }
 if(b.action==="replyPremiumRevision"){
 if(b.source!=="test-controls")return NextResponse.json({error:"Chỉ dùng trong điều khiển thử nghiệm"},{status:403});
 const o=s.orders.find(o=>o.id===b.id);if(!o||!o.offerRevision||o.offer?.acceptedAt||o.paid>0)return NextResponse.json({error:"Không có điều chỉnh đang chờ"},{status:409});
 o.offerRevision=undefined;o.offer={id:randomUUID(),createdAt:new Date().toISOString(),total:o.total,deposit:o.deposit,departureCode:o.departureCode};o.status="Phương án sẵn sàng";addRequestEvent(o,"offered","Mô phỏng phản hồi: giữ lịch và giá cơ bản; dịch vụ riêng chưa xác nhận");await save(s,scope);return NextResponse.json(view(s));
 }
 if(b.action==="revisePremiumOffer"){
 const o=s.orders.find(o=>o.id===b.id);if(!o)return NextResponse.json({error:"Không tìm thấy chuyến"},{status:404});
 if(tours.find(t=>t.id===o.tourId)?.packageId!=="sbu3"||!o.offer||o.offer.acceptedAt||o.paid>0)return NextResponse.json({error:"Chỉ điều chỉnh Premium trước khi chấp thuận và thanh toán"},{status:409});
 if(typeof b.reason!=="string"||!b.reason.trim()||b.reason.trim().length>1000)return NextResponse.json({error:"Nhập nội dung từ 1–1000 ký tự"},{status:400});
 o.offerRevision={reason:b.reason.trim(),at:new Date().toISOString()};o.status="Chờ điều chỉnh phương án";addRequestEvent(o,"created","Đã yêu cầu điều chỉnh phương án");await save(s,scope);return NextResponse.json(view(s));
 }
 if(["offer","acceptOffer"].includes(b.action)){
  const o=s.orders.find(o=>o.id===b.id);if(!o)return NextResponse.json({error:"Không tìm thấy yêu cầu"},{status:404});
  if(requestBlocked(o))return NextResponse.json({error:"Cần xử lý thông tin yêu cầu trước khi tiếp tục"},{status:409});
  const t=tours.find(t=>t.id===o.tourId);if(!t||t.packageId==="sbu1")return NextResponse.json({error:"Gói này không cần phương án riêng"},{status:409});
  if(b.action==="offer"){
   if(t.packageId==="sbu2"&&!o.groupQuote)return NextResponse.json({error:"Chờ nhân viên duyệt chi phí đoàn trước khi lập báo giá"},{status:409});
   if(!o.offer){o.offer={id:randomUUID(),createdAt:new Date().toISOString(),total:o.total,deposit:o.deposit,departureCode:o.departureCode};o.status=t.packageId==="sbu2"?"Báo giá sẵn sàng":"Phương án sẵn sàng";addRequestEvent(o,"offered",o.status);}
  }else{
   if(o.offerRevision)return NextResponse.json({error:"Đang chờ phản hồi điều chỉnh; chưa thể chấp thuận"},{status:409});
   if(!o.offer||b.offerId!==o.offer.id)return NextResponse.json({error:"Vui lòng xem lại phương án hiện tại trước khi chấp thuận"},{status:409});
   if(!o.offer.acceptedAt){o.offer.acceptedAt=new Date().toISOString();o.status="Chờ đặt cọc";addRequestEvent(o,"accepted","Đã chấp thuận phương án/báo giá");}
  }
  await save(s,scope);return NextResponse.json(view(s));
 }
 if(b.action==="updateActivity"){
  if(b.source!=="test-controls")return NextResponse.json({error:"Chỉ cập nhật trong điều khiển thử nghiệm"},{status:403});
  const o=s.orders.find(o=>o.id===b.id);if(!o)return NextResponse.json({error:"Không tìm thấy chuyến"},{status:404});
  const activity=tripItinerary(o).flatMap(d=>d.activities).find(a=>a.id===b.activityId);
  if(!activity||!["upcoming","live","done","changed","cancelled"].includes(b.status))return NextResponse.json({error:"Hoạt động hoặc trạng thái không hợp lệ"},{status:400});
  if(o.completedAt||o.paid<o.deposit||(!o.startedAt&&["live","done"].includes(b.status)))return NextResponse.json({error:"Trạng thái chuyến chưa cho phép cập nhật"},{status:409});
  const previous=o.activityUpdates?.[activity.id];const before={time:previous?.time??activity.time,location:previous?.location??activity.location,status:previous?.status??"upcoming" as ActivityStatus};
  const time=typeof b.time==="string"&&b.time.trim()?b.time.trim():before.time;const location=typeof b.location==="string"&&b.location.trim()?b.location.trim():before.location;const reason=typeof b.reason==="string"?b.reason.trim():"";
  if(!validActivityTime(time)||location.length>160||reason.length>500||(["changed","cancelled"].includes(b.status)&&!reason))return NextResponse.json({error:"Kiểm tra giờ, địa điểm và lý do điều chỉnh"},{status:400});
  if(b.status==="live"&&Object.entries(o.activityUpdates??{}).some(([id,u])=>id!==activity.id&&u.status==="live"))return NextResponse.json({error:"Hoàn tất hoạt động đang diễn ra trước khi bắt đầu hoạt động khác"},{status:409});
  const after={time,location,status:b.status as ActivityStatus};
  if(JSON.stringify(before)!==JSON.stringify(after)||(previous?.reason??"")!==reason){
   const now=new Date().toISOString();o.activityUpdates??={};o.activityUpdates[activity.id]={...after,reason,updatedAt:now};
   if(before.time!==time||before.location!==location||b.status==="cancelled"||b.status==="changed"||before.status==="cancelled"){
    o.notices??=[];o.notices.push({id:randomUUID(),activityId:activity.id,reason:reason||"Điều chỉnh lịch hoạt động",createdAt:now,before,after});
   }
  }
  await save(s,scope);return NextResponse.json(view(s));
 }
 if(b.action==="ackTripNotice"){
  const o=s.orders.find(o=>o.id===b.id);const notice=o?.notices?.find(n=>n.id===b.noticeId);if(!notice)return NextResponse.json({error:"Không tìm thấy thông báo của chuyến"},{status:404});notice.seenAt??=new Date().toISOString();await save(s,scope);return NextResponse.json(view(s));
 }
 if(b.action==="assignTrainingGroup"||b.action==="resolveGroupChange"){
  if(b.source!=="test-controls")return NextResponse.json({error:"Chỉ điều phối cập nhật nhóm"},{status:403});
  const o=s.orders.find(o=>o.id===b.id);if(!o)return NextResponse.json({error:"Không tìm thấy chuyến"},{status:404});
  if(o.completedAt||o.paid<o.deposit)return NextResponse.json({error:"Chuyến chưa đủ điều kiện cập nhật nhóm"},{status:409});
  const pkg=tours.find(t=>t.id===o.tourId)?.packageId;
  if(b.action==="resolveGroupChange"){
   if(!["accepted","declined"].includes(b.result))return NextResponse.json({error:"Phản hồi không hợp lệ"},{status:400});
   if(!o.groupChange||b.requestId!==o.groupChange.id)return NextResponse.json({error:"Yêu cầu điều chỉnh đã thay đổi, vui lòng tải lại"},{status:409});
   if(o.groupChange.status!=="pending"){
    if(o.groupChange.status===b.result&&(b.result==="declined"||o.trainingGroup?.key===b.groupKey))return NextResponse.json(view(s));
    return NextResponse.json({error:"Yêu cầu đã được xử lý"},{status:409});
   }
  }
  if(b.action==="resolveGroupChange"&&b.result==="declined"){
   if(typeof b.reason!=="string"||!b.reason.trim()||b.reason.length>500)return NextResponse.json({error:"Cần lý do phản hồi"},{status:400});
   o.groupChange!.status="declined";o.groupChange!.resolution=b.reason.trim();o.groupChange!.resolvedAt=new Date().toISOString();
  }else{
   const group=trainingGroups(o).find(g=>g.key===b.groupKey);if(!group)return NextResponse.json({error:"Nhóm không thuộc gói của chuyến"},{status:400});
   if(pkg!=="sbu2"&&!o.ntrpLevel)return NextResponse.json({error:"Khách chưa có NTRP, chờ đánh giá trước khi phân nhóm"},{status:409});
   if(b.action==="assignTrainingGroup"&&o.groupChange?.status==="pending")return NextResponse.json({error:"Xử lý yêu cầu điều chỉnh đang chờ trước"},{status:409});
   o.trainingGroup={key:group.key,assignedAt:new Date().toISOString()};
   if(b.action==="resolveGroupChange"){o.groupChange!.status="accepted";o.groupChange!.resolution="Đã cập nhật nhóm theo điều phối.";o.groupChange!.resolvedAt=new Date().toISOString();}
  }
  await save(s,scope);return NextResponse.json(view(s));
 }
 if(b.action==="requestGroupChange"){
  const o=s.orders.find(o=>o.id===b.id);if(!o)return NextResponse.json({error:"Không tìm thấy chuyến"},{status:404});
  if((!o.trainingGroup&&!o.operations)||o.completedAt||o.paid<o.deposit)return NextResponse.json({error:"Chưa có nhóm để điều chỉnh hoặc chuyến đã kết thúc"},{status:409});
  if(typeof b.reason!=="string"||!b.reason.trim()||b.reason.trim().length>500)return NextResponse.json({error:"Nhập lý do từ 1 đến 500 ký tự"},{status:400});
  if(o.groupChange?.status!=="pending")o.groupChange={id:randomUUID(),reason:b.reason.trim(),status:"pending",createdAt:new Date().toISOString()};
  await save(s,scope);return NextResponse.json(view(s));
 }
 if(b.action==="checkActivity"){
  const o=s.orders.find(o=>o.id===b.id);if(!o)return NextResponse.json({error:"Không tìm thấy chuyến"},{status:404});
  if(typeof b.itemId!=="string"||typeof b.checked!=="boolean"||!validChecklistItem(o,b.itemId))return NextResponse.json({error:"Hoạt động không thuộc chuyến này"},{status:400});
  if(o.completedAt||o.paid<o.deposit||(!b.itemId.startsWith("prepare:")&&!o.startedAt))return NextResponse.json({error:"Chưa thể cập nhật checklist ở trạng thái này"},{status:409});
  o.activityChecks??={};o.activityChecks[b.itemId]=b.checked;await save(s,scope);return NextResponse.json(view(s));
 }
 if(["pay","start","complete","fei","share"].includes(b.action)){
  const o=s.orders.find(o=>o.id===b.id);
  if(!o)return NextResponse.json({error:"Không tìm thấy booking"},{status:404});
  if(b.action==="pay"){
   if(requestBlocked(o))return NextResponse.json({error:"Yêu cầu chưa đủ điều kiện thanh toán"},{status:409});
   const previousPayment=JSON.stringify([o.paid,o.payment,o.balancePayment]);
   if(!["success","failed","cancelled"].includes(b.result)||![undefined,"deposit","balance"].includes(b.phase))return NextResponse.json({error:"Trạng thái không hợp lệ"},{status:400});
   const t=tours.find(t=>t.id===o.tourId)!;
   if(t.packageId!=="sbu1"&&!o.offer?.acceptedAt)return NextResponse.json({error:"Vui lòng chờ xác nhận hoặc báo giá trước khi đặt cọc"},{status:409});
   if(b.phase==="balance"){
    if(o.paid<o.deposit)return NextResponse.json({error:"Vui lòng hoàn tất đặt cọc trước"},{status:409});
    if(o.paid<o.total){o.balancePayment=b.result;if(b.result==="success")o.paid=o.total;}
   }else if(o.payment!=="success"){
    o.payment=b.result;if(b.result==="success"){o.paid=o.deposit;o.status="Đã xác nhận";}
   }
   if(previousPayment!==JSON.stringify([o.paid,o.payment,o.balancePayment]))addRequestEvent(o,`pay:${b.phase??"deposit"}:${b.result}`,`${b.phase==="balance"?"Thanh toán còn lại":"Đặt cọc"}: ${b.result==="success"?"thành công":b.result==="failed"?"thất bại":"đã hủy"}`);
   awardOnce(s.ledger,o,"tour");
  }else{
   if(b.action==="start"){
    if(b.source!=="test-controls")return NextResponse.json({error:"Thao tác chỉ có trong điều khiển thử nghiệm"},{status:403});
    if(o.completedAt||o.paid<o.deposit)return NextResponse.json({error:"Chuyến chưa đủ điều kiện bắt đầu hoặc đã hoàn thành"},{status:409});
    o.startedAt ??= new Date().toISOString();o.status="Đang đi";
   }else if(b.action==="complete"){
    if(b.source!=="test-controls")return NextResponse.json({error:"Thao tác chỉ có trong điều khiển thử nghiệm"},{status:403});
    if(!o.startedAt&&!o.completedAt)return NextResponse.json({error:"Chuyến chưa bắt đầu"},{status:409});
    if(o.paid<o.total)return NextResponse.json({error:"Cần thanh toán đủ trước khi hoàn thành hành trình"},{status:409});
    o.completedAt ??= new Date().toISOString();o.status="Đã hoàn thành";awardOnce(s.ledger,o,"tour");awardOnce(s.ledger,o,"fei");
   }else{
    if(!o.completedAt)return NextResponse.json({error:"Hành trình chưa hoàn thành"},{status:409});
    if(b.action==="fei"){
     if(!Number.isInteger(b.rating)||b.rating<1||b.rating>5)return NextResponse.json({error:"Chọn FEI rating từ 1 đến 5"},{status:400});
     o.feiRating ??= b.rating;awardOnce(s.ledger,o,"fei");
    }else{
     if(b.result!=="success")return NextResponse.json({error:"Chỉ ghi nhận sau khi chia sẻ thành công"},{status:400});
     awardOnce(s.ledger,o,"share");
    }
   }
  }
  await save(s,scope);return NextResponse.json(view(s));
 }
 return NextResponse.json({error:"Thao tác không hỗ trợ"},{status:400});
 }catch(error){console.error("Local API failed", error);return NextResponse.json({error:"Không xử lý được yêu cầu. Vui lòng thử lại."},{status:500});}};
 if(cloudMode())return run();const result=queue.then(run,run);queue=result.then(()=>{},()=>{});return result;
}


export async function GET(req:NextRequest){return apiStorage(req,()=>getLocal(req));}
export async function POST(req:NextRequest){return apiStorage(req,()=>postLocal(req));}
