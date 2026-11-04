import {readPartyLanguage,partyText,type PartyReading} from "./ace-party-language";
import {aceLanguageExamples,type AceLanguageIntent} from "./ace-language-data";
import {aceRespond,aceRecommendation,preferenceSummary,type AceState,type AcePreferences} from "./ace-conversation";
import {matchAceScript,parseAceBudget} from "./ace-script";

type Response=ReturnType<typeof aceRespond>;
type Fact={intent:AceLanguageIntent}|{intent:"partyCount";count:number;companions?:number}|{intent:"budget";amount:number;basis:"person"|"total"|"unknown"}|{intent:"dietText";text:string}|{intent:"clarify";text:string};
const fold=(text:string)=>text.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[đĐ]/g,"d").toLowerCase();
export function normalizeAceLanguage(text:string){return fold(text).replace(/\b(?:ko|khong|hok|k)\b/g,"khong").replace(/\btui\b/g,"toi").replace(/\b(?:2|hai) vc\b/g,"2 vo chong").replace(/\bhai vo chong\b/g,"2 vo chong").replace(/(\d)\s*ng\b/g,"$1 nguoi").replace(/\bvs\b/g,"voi").replace(/[^a-z0-9]+/g," ").trim().replace(/^(?:(?:ace oi|minh|toi|em|tui minh|bon minh) )+/,"").replace(/(?: (?:nhe|nha|a|thoi))+$/,"");}
const examples=new Map<string,AceLanguageIntent>();
for(const row of aceLanguageExamples)for(const text of row.examples){const key=normalizeAceLanguage(text);const existing=examples.get(key);if(existing&&existing!==row.intent)throw Error(`Conflicting Ace language example: ${text}`);examples.set(key,row.intent);}
const globals={tour:"Gợi ý gói tour 🏖️",quiz:"Tôi thuộc NTRP nào? 🎾",catalog:"Xem tất cả gói tour"} as const;
function fact(text:string):Fact|undefined{
 const s=normalizeAceLanguage(text);const intent=examples.get(s);if(intent)return {intent};
 const party=readPartyLanguage(text);if(party?.kind==="known")return {intent:"partyCount",count:party.total,companions:party.companions};
 const count=s.match(/^(?:(?:nhom|doan|clb)(?: minh)?(?: co| di)?|di|co)?\s*(\d+) (?:nguoi|khach)$/);
 if(count){const n=Number(count[1]);return n<1||n>20?{intent:"clarify",text:"Ace hiện hỗ trợ ghi nhận từ 1–20 khách. Bạn xác nhận lại tổng số người giúp mình nhé."}:{intent:"partyCount",count:n};}
 const raw=fold(text).trim().replace(/[!?]$/,"").replace(/\b(?:nhe|nha|a|thoi)$/,"").trim();
 if(/\d+\s*(?:-|den|toi)\s*\d+\s*(?:trieu|tr)\b/.test(s))return {intent:"clarify",text:"Bạn muốn lấy mức tối đa nào để Ace so sánh? Ví dụ “15 triệu mỗi người”."};
 const money=raw.match(/^(?:(?:minh|toi|em) )?(?:(?:tong ngan sach|tong|ngan sach|chi phi|du kien|tam|khoang|toi da|chi|co|ngan sach tam|ngan sach khoang|ngan sach toi da)\s*(?:la|khoang|tam)?\s*)?(\d+(?:[.,]\d+)*)\s*(trieu(?: dong)?|tr|cu|dong|d|vnd)\b\s*(.*)$/);
 if(money){
  const suffix=money[3].trim();
  const person=/^(?:\/\s*(?:nguoi|khach)|(?:cho )?(?:moi|mot|1) (?:nguoi|khach)|mot nguoi choi)$/;
  const total=/^(?:cho )?(?:ca nhom|ca hai|hai nguoi|2 nguoi|tong cong|ca chuyen)$/;
  if(suffix&&!person.test(suffix)&&!total.test(suffix))return;
  const amount=parseAceBudget(`${money[1]} ${money[2].replace(/^cu$/,"trieu").replace(/^vnd$/,"dong")}`);
  if(amount===undefined)return {intent:"clarify",text:"Mình chưa đọc rõ số tiền. Bạn nhập ví dụ “7 triệu mỗi người” giúp Ace nhé."};
  return {intent:"budget",amount,basis:person.test(suffix)?"person":total.test(suffix)||/^tong\b/.test(s)?"total":"unknown"};
 }

 // Full-clause matching avoids treating a question or a booking operation as a dietary answer.
 if(/^(?:(?:vo|chong|nguoi di cung)(?: minh| toi)? |minh |toi |em )?(?:di ung|kieng|khong an|khong uong|khong dung) (?:dau phong|lac|tom|cua|trung|sua|hai san|lactose|thit bo)$/.test(s))return {intent:"dietText",text:text.trim()};
 if(/^(?:khong phai|khong di|khong muon|chua chac|co the|neu|hoac)\b/.test(s))return {intent:"clarify",text:"Ace chưa chắc bạn đang muốn thay đổi điều gì. Bạn nói rõ số khách, mục tiêu hoặc yêu cầu mới giúp mình nhé; nhu cầu trước đó vẫn được giữ."};
}
function unchanged(state:AceState,text:string,chips?:string[]):Response{return {state,reply:{text,chips}};}
export function continueAceConversation(state:AceState,ack:string):Response{
 const p=state.preferences;
 if(p.numPeople===undefined)return {state:{...state,step:"party"},reply:{text:`${ack}\nBạn dự định đi bao nhiêu người?`,chips:["Đi một mình","Hai người cùng chơi","Một người chơi, một người đi cùng","Nhóm 5–10 người","CLB 10–20 người"]}};
 if(p.numPeople>2)return {state:{...state,step:"group"},reply:{text:`${ack}\nAce đã ghi nhận ${p.numPeople} khách. Bạn xác nhận số người chơi, người đi cùng và từng nhóm nhu cầu trong bản tóm tắt bên dưới; Ace chưa mặc định tất cả đều chơi tennis.`}};
 if(p.numCompanions===undefined)return {state:{...state,step:"party"},reply:{text:`${ack}\nHai người đều chơi tennis hay một người chơi và một người đi cùng?`,chips:["Hai người cùng chơi","Một người chơi, một người đi cùng"]}};
 if(!p.goal)return {state:{...state,step:"goal"},reply:{text:`${ack}\nBạn ưu tiên mục tiêu nào?`,chips:["Học kỹ thuật cùng nhau","Thi đấu & giao lưu","Nghỉ dưỡng & kết nối"]}};
 if(!p.budget&&!p.budgetFlexible)return {state:{...state,step:"budget"},reply:{text:`${ack}\nNgân sách tối đa mỗi người khoảng bao nhiêu? Bạn có thể nhập “7 triệu mỗi người”.`,chips:["Linh hoạt theo trải nghiệm"]}};
 if(!p.diet)return {state:{...state,step:"diet"},reply:{text:`${ack}\nBạn hoặc người đi cùng có yêu cầu ăn uống nào không?`,chips:["Không có yêu cầu đặc biệt","Ăn chay","Không ăn hải sản"]}};
 const reply=aceRecommendation(p);return {state:{...state,step:"idle"},reply:{...reply,text:`${ack}\n\n${reply.text}`}};
}
function clarifyParty(state:AceState,reading:Extract<PartyReading,{kind:"ask"}>):Response{
 const pending={reason:reading.reason,attempts:Math.min(2,(state.partyClarification?.attempts??0)+1),...(reading.candidate?{candidate:reading.candidate}:{})};
 const copy={negative:"Ace hiểu bạn không muốn đi theo hình thức vừa nhắc. Bạn dự định đi tổng cộng bao nhiêu người?",conditional:"Bạn đang hỏi một tình huống giả định hay muốn đăng ký chuyến thực tế? Ace chưa thay đổi số khách.",conflict:"Tin nhắn vừa nói đi một mình, vừa nhắc thêm người đi cùng. Bạn xác nhận tổng số khách và số người chơi giúp Ace nhé.",uncertain:reading.candidate?`Bạn muốn đăng ký cho ${reading.candidate.total} người, đúng không?`:"Ace chưa rõ bạn đi cùng ai. Bạn cho biết tổng số khách và có bao nhiêu người chơi tennis nhé."};
 return {state:{...state,partyClarification:pending},reply:{text:copy[reading.reason]+(pending.attempts>=2?" Bạn có thể chọn phương án bên dưới hoặc nhờ tư vấn viên hỗ trợ; thông tin cũ vẫn được giữ.":""),chips:[...(reading.candidate?["Đúng, đăng ký 1 người"]:[]),"Đi một mình","Hai người cùng chơi","Một người chơi, một người đi cùng",...(reading.reason==="conditional"?["Chỉ đang tìm hiểu"]:[]),...(pending.attempts>=2?["Nhờ tư vấn viên hỗ trợ"]:[])]}};
}
/** Resolve only fully covered statements. Unknown/partly understood requests keep the advisor fallback. */
export function respondToAceText(state:AceState,text:string):Response|undefined{
 if(!text.trim()||text.length>2000)return;
 if(/\b(?:huy|hoan tien|doi lich|hoa don|visa)\b/.test(fold(text)))return;
 const pending=state.partyClarification;
 const answer=partyText(text);
 if(pending&&["chi dang tim hieu","de minh suy nghi them","bo qua cau hoi nay"].includes(answer)){const next={...state};delete next.partyClarification;return {state:next,reply:{text:"Mình giữ nguyên nhu cầu trước đó. Khi chốt người tham gia, bạn có thể nhập số khách hoặc chọn hình thức đi.",chips:["Gợi ý gói tour 🏖️","Xem tất cả gói tour"]}};}
 if(pending&&["dung","dung roi","vang","ok","dong y","dung dang ky 1 nguoi"].includes(answer)){
  if(pending.candidate){const clean={...state};delete clean.partyClarification;return respondToAceText(clean,"Đi một mình");}
  return clarifyParty(state,{kind:"ask",reason:pending.reason});
 }
 const party=readPartyLanguage(text);
 const direct=fact(text);
 if(party?.kind==="ask"&&(party.reason!=="uncertain"||!/[;,\n]|\s+(?:và|va)\s+/i.test(text))&&(!direct||direct.intent==="clarify")&&!(state.step==="quiz"&&matchAceScript(state,text)))return clarifyParty(state,party);
 if(pending&&["khong","khong phai","chua ro","chua biet","chua hieu","sao","khong biet"].includes(answer))return clarifyParty(state,{kind:"ask",reason:pending.reason});
 if(direct&&direct.intent in globals)return aceRespond(state,globals[direct.intent as keyof typeof globals]);
 if(direct?.intent==="greeting")return unchanged(state,"Chào bạn! Bạn có thể kể kế hoạch bằng lời của mình, ví dụ “Hai vợ chồng đi, chỉ mình chơi tennis”.",["Gợi ý gói tour 🏖️","Tôi thuộc NTRP nào? 🎾"]);
 // The quiz has question-specific meanings; do not infer an NTRP level from a general statement.
 if(state.step==="quiz"&&party?.kind==="known"&&!state.preferences.groupNeeds){const p={...state.preferences,quizAnswers:[...state.preferences.quizAnswers],numPeople:party.total,numCompanions:party.companions,party:party.total===1?"Đi một mình":`${party.total} khách`};delete p.packageId;const response=aceRespond({step:"quiz",preferences:p},"Tiếp tục kịch bản");response.reply.text=`Đã ghi nhận ${party.total} khách; giữ nguyên câu trả lời NTRP.\n${response.reply.text}`;return response;}
 if(state.step==="quiz"){const match=matchAceScript(state,text);return match?aceRespond(state,match):undefined;}
 const clauses=direct?[text]:text.split(/;|\n|(?<!\d)\.(?!\d)/).flatMap(part=>fact(part.trim())?[part]:part.split(/(?<!\d),(?!\d)|\s+(?:và|va)\s+/i)).map(s=>s.trim()).filter(Boolean);
 const facts=clauses.map(clause=>fact(clause));
 if(facts.some(f=>!f)){
  // Multi-clause input must not be partially applied or silently discard a request.
  const unresolved=clauses.filter((_,i)=>!facts[i]);
  if(unresolved.every(clause=>readPartyLanguage(clause)?.kind==="ask")){const reading=readPartyLanguage(unresolved[0]);if(reading?.kind==="ask")return clarifyParty(state,reading);}
  if(clauses.length>1)return;
  const scripted=matchAceScript(state,text);return scripted?aceRespond(state,scripted):undefined;
 }
 const known=facts as Fact[];
 const clarification=known.find(f=>f.intent==="clarify");
 if(clarification?.intent==="clarify")return unchanged(state,clarification.text);
 if(known.some(f=>f.intent==="clarifyGoal"))return unchanged(state,"Ace chưa xác định được một ưu tiên chính. Bạn muốn học kỹ thuật, thi đấu hay nghỉ dưỡng?",["Học kỹ thuật cùng nhau","Thi đấu & giao lưu","Nghỉ dưỡng & kết nối"]);
 if(state.step==="group"||state.preferences.groupNeeds)return {...unchanged(state,"Nhóm đã có nhiều nhu cầu riêng. Bạn sửa trong bản tóm tắt nhóm để Ace giữ đúng số người và yêu cầu của từng nhóm nhé.",["Sửa nhu cầu nhóm"])};
 const p:AcePreferences={...state.preferences,quizAnswers:[...state.preferences.quizAnswers]};
 let count:number|undefined,companions:number|undefined,goal:AcePreferences["goal"],budget:number|undefined,flexible=false;const diets:string[]=[];
 let conflict=false;const setCount=(n:number,c?:number)=>{if(count!==undefined&&count!==n)conflict=true;if(c!==undefined&&companions!==undefined&&companions!==c)conflict=true;count=n;if(c!==undefined)companions=c;};
 for(let i=0;i<known.length;i++){const f=known[i];
  if(f.intent==="greeting"||f.intent==="tour")continue;
  if(f.intent==="solo")setCount(1,0);
  else if(f.intent==="bothPlayers")setCount(2,0);
  else if(f.intent==="onePlayer")setCount(2,1);
  else if(f.intent==="coupleUnknown")setCount(2);
  else if(f.intent==="partyCount")setCount(f.count,f.companions??(f.count===1?0:undefined));
  else if(["learn","compete","relax"].includes(f.intent)){const next=f.intent as AcePreferences["goal"];if(goal&&goal!==next)conflict=true;goal=next;}
  else if(f.intent==="flexible")flexible=true;
  else if(f.intent==="budget"){
   if(f.basis==="total")return unchanged(state,"Ace đã hiểu đây là ngân sách tổng, nhưng giá gói được so theo mỗi người chơi và người đi cùng. Bạn cho biết mức tối đa mỗi người để mình gợi ý chính xác; chưa tự chia ngân sách tổng nhé.");
   if(f.basis==="unknown"&&state.step!=="budget")return unchanged(state,`Bạn muốn nói ${f.amount.toLocaleString("vi-VN")} đ mỗi người hay cho cả nhóm? Hãy xác nhận ngân sách mỗi người để Ace so giá.`,[`${f.amount.toLocaleString("vi-VN")} đ/người`]);
   if(budget!==undefined&&budget!==f.amount)conflict=true;budget=f.amount;
  }
  else if(f.intent==="noDiet")diets.push("Không có yêu cầu đặc biệt");
  else if(["vegetarian","seafood","lactose","dietText"].includes(f.intent))diets.push(clauses[i].trim());
  else return; // A mixed control command is not a preference update.
 }
 if(conflict||(flexible&&budget!==undefined)||(diets.includes("Không có yêu cầu đặc biệt")&&diets.length>1))return unchanged(state,"Trong tin nhắn có thông tin chưa thống nhất. Bạn xác nhận lại số khách, ưu tiên chính hoặc ngân sách giúp Ace nhé; mình chưa thay đổi nhu cầu đã lưu.");
 if(count!==undefined){p.numPeople=count;p.numCompanions=companions??(count===state.preferences.numPeople?state.preferences.numCompanions:undefined);p.party=count===1?"Đi một mình":count===2?(p.numCompanions===0?"Hai người cùng chơi":p.numCompanions===1?"Một người chơi, một người đi cùng":"Hai người — chờ xác nhận vai trò"):`Nhóm ${count} người`;delete p.packageId;}
 if(p.dietCount!==undefined&&p.numPeople!==undefined&&p.dietCount>p.numPeople)delete p.dietCount;
 if(goal){p.goal=goal;delete p.packageId;}
 if(budget!==undefined||flexible){p.budget=budget;p.budgetFlexible=flexible;}
 if(diets.length){delete p.dietCount;const none=diets.includes("Không có yêu cầu đặc biệt");const previous=p.diet&&p.diet!=="Không có yêu cầu đặc biệt"?[p.diet]:[];p.diet=none?"Không có yêu cầu đặc biệt":[...new Set([...previous,...diets])].join("; ");if(p.diet.length>500)return unchanged(state,"Yêu cầu ăn uống quá dài để lưu đầy đủ. Bạn rút gọn hoặc nhờ tư vấn viên ghi nhận giúp nhé.");}
 const summary=preferenceSummary(p);
 return continueAceConversation({step:state.step,preferences:p},`Ace đã ghi nhận:\n${summary}`);
}
