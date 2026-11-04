import type {AceMessage} from "./ace-session";
import type {LocalData,LocalOrder} from "./use-local-account";
import {tours} from "./mock-data";
import {participants,surveyMeals} from "./pilot";
import {nextRequestAction,requestBlocked} from "./request-flow";
export type AceJourneyContext={order:LocalOrder;key:string;title:string;text:string;actions:{label:string;href:string}[]};
export function journeyFeedback(o:LocalOrder){
 const people=participants(o),ids=new Set(people.map(p=>p.id));
 const meals=o.startedAt?surveyMeals(o).filter(m=>o.activityUpdates?.[m.id]?.status==="done"):[];
 const mealIds=new Set(meals.map(m=>m.id));
 const nps=o.completedAt?people.filter(p=>!o.npsResponses?.some(r=>r.participant===p.id)).length:0;
 const submitted=new Set(o.feiResponses?.filter(r=>ids.has(r.participant)&&mealIds.has(r.mealId)).map(r=>`${r.participant}:${r.mealId}`));
 return {nps,fei:Math.max(0,people.length*meals.length-submitted.size),meals:meals.length};
}
export function chooseJourneyOrder(data:LocalData|null,requested?:string|null):LocalOrder|undefined{
 if(!data?.account)return;
 if(requested){const explicit=data.orders.find(o=>o.id===requested);if(explicit)return explicit;}
 const priority=(o:LocalOrder)=>o.startedAt&&!o.completedAt?0:!o.completedAt&&o.paid>=o.deposit?1:!o.completedAt?2:journeyFeedback(o).nps+journeyFeedback(o).fei>0?3:4;
 const date=(o:LocalOrder)=>tours.find(t=>t.id===o.tourId)?.departureSchedules.find(d=>d.code===o.departureCode)?.date??"9999";
 return [...data.orders].sort((a,b)=>priority(a)-priority(b)||(a.completedAt&&b.completedAt?b.completedAt.localeCompare(a.completedAt):date(a).localeCompare(date(b))))[0];
}
export function aceJourneyContext(data:LocalData|null,requested?:string|null):AceJourneyContext|undefined{
 const o=chooseJourneyOrder(data,requested);if(!o)return;
 const t=tours.find(t=>t.id===o.tourId),d=t?.departureSchedules.find(d=>d.code===o.departureCode);
 const href=(tab:string)=>`/pre-tour?booking=${encodeURIComponent(o.id)}&tab=${tab}`;
 const title=`${t?.name??"Chuyến đi"}${d?` · ${d.dateLabel}`:""}`;
 const feedback=journeyFeedback(o);
 if(o.completedAt){
  const pending=feedback.nps+feedback.fei>0;
  return {order:o,key:`${o.id}:completed:${pending?"feedback":"reviewed"}`,title,text:pending?`Chuyến đã hoàn thành. ${feedback.nps?"NPS sau tour đang mở. ":""}${feedback.fei?`Có phản hồi bữa ăn đã hoàn tất có thể bổ sung. `:""}Mỗi người chọn đúng vị trí của mình để tự đánh giá; bữa bị hủy hoặc chưa diễn ra không mở FEI.`:"Chuyến đã hoàn thành và các phản hồi đủ điều kiện đã được ghi nhận. Bạn có thể xem lại tổng kết hoặc tìm chuyến mới.",actions:[{label:pending?"Đánh giá sau tour":"Xem phản hồi & tổng kết",href:href("feedback")}]};
 }
 if(o.startedAt)return {order:o,key:`${o.id}:live:${feedback.fei?"meal-feedback":"timeline"}`,title,text:`Chuyến đang diễn ra. Bạn có thể mở lịch Tour Live${feedback.fei?" và tự đánh giá những bữa đã hoàn tất":""}. NPS sẽ mở sau khi điều hành xác nhận hoàn thành tour.`,actions:[{label:"Mở Tour Live",href:`/in-tour?booking=${encodeURIComponent(o.id)}`},...(feedback.fei?[{label:"Đánh giá bữa đã hoàn tất",href:href("feedback")}]:[]),...(o.paid<o.total?[{label:o.balancePayment==="awaiting_confirmation"?"Xem đối soát thanh toán":"Xem phần tiền còn lại",href:href("payment")}]:[])]};
 if(o.paid>=o.deposit)return {order:o,key:`${o.id}:upcoming:${o.paid>=o.total?"paid":o.balancePayment==="awaiting_confirmation"?"balance-pending":"balance"}`,title,text:`Chuyến đã được xác nhận sau khi nhận cọc. Bạn có thể xem lịch, chuẩn bị thông tin và mã check-in.${o.paid<o.total?(o.balancePayment==="awaiting_confirmation"?" Điều hành đang đối chiếu phần tiền còn lại bạn đã báo chuyển.":" Còn khoản thanh toán cần hoàn tất trước khi kết thúc tour."):""} Ace giữ cuộc trò chuyện, không cần khai nhu cầu từ đầu.`,actions:[{label:"Chuẩn bị & check-in",href:href("preparation")},{label:"Xem lịch trình",href:href("schedule")},...(o.paid<o.total?[{label:"Xem thanh toán",href:href("payment")}]:[])]};
 const next=nextRequestAction(o,t?.packageId,d?.date);
 const stage=requestBlocked(o)?`${o.issue?.type}:needs-response`:o.offerRevision?"offer-revision":o.payment==="awaiting_confirmation"?"deposit-pending":o.offer?.acceptedAt?"deposit":o.offer?"offer":"request";
 return {order:o,key:`${o.id}:pending:${stage}:${o.offer?.id??"none"}:${o.payment}:${o.offerRevision?.at??"none"}`,title,text:`Bạn đã gửi đăng ký cho chuyến này. ${next.title}. ${next.body} Đăng ký chỉ được xác nhận sau khi điều hành nhận đủ cọc.`,actions:[{label:requestBlocked(o)?"Xem & bổ sung yêu cầu":next.label??"Xem tiến độ đăng ký",href:href(requestBlocked(o)?"overview":next.tab??(o.offer?"payment":"overview"))}]};
}
export function journeyDeepLink(data:LocalData|null,params:URLSearchParams){
 if(!data?.account)return;
 const booking=params.get("booking"),index=data.orders.findIndex(o=>o.id===booking);if(index<0)return;
 const tab=params.get("tab")??"overview";
 return {id:data.orders[index].id,page:Math.floor(index/6),tab:["overview","schedule","team","payment","preparation","feedback"].includes(tab)?tab:"overview"};
}

export function appendJourneyNotice(messages:AceMessage[],context:AceJourneyContext,at:string):AceMessage[]{
 const id=`journey:${context.key}`;
 return messages.some(m=>m.id===id)?messages:[...messages,{id,role:"bot",at,text:`**${context.title}**\n${context.text}`}];
}
