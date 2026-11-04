import {aceRecommendation, type AceState, type AcePreferences} from "./ace-conversation";
import {continueAceConversation} from "./ace-natural";
export type AceQuickEdit =
 | {field:"party";total:number;companions:number}
 | {field:"goal";goal:NonNullable<AcePreferences["goal"]>}
 | {field:"budget";amount?:number;flexible:boolean}
 | {field:"diet";text:string;count?:number};
const goalLabels={learn:"học kỹ thuật",compete:"thi đấu & giao lưu",relax:"nghỉ dưỡng"};
export function compactAceNeeds(p:AcePreferences){
 const parts:string[]=[];
 if(p.numPeople!==undefined){parts.push(`${p.numPeople} khách`);if(p.numCompanions!==undefined)parts.push(`${p.numPeople-p.numCompanions} người chơi`,`${p.numCompanions} người đi cùng`);else parts.push("chưa rõ vai trò");}
 if(p.groupNeeds)parts.push(p.groupNeeds.mainGoal==="balanced"?"nhiều mục tiêu":`ưu tiên ${goalLabels[p.groupNeeds.mainGoal]}`);
 else if(p.goal)parts.push(`ưu tiên ${goalLabels[p.goal]}`);
 return parts.join(" · ");
}
export function applyAceQuickEdit(state:AceState,edit:AceQuickEdit):{state:AceState;reply:ReturnType<typeof aceRecommendation>}{
 const p:AcePreferences={...state.preferences,quizAnswers:[...state.preferences.quizAnswers]};
 if(p.groupNeeds&&edit.field!=="budget")throw Error("Sửa quy mô, mục tiêu và ăn uống trong bản tóm tắt nhóm để giữ đúng từng nhóm nhu cầu.");
 let note="";
 if(edit.field==="party"){
  if(!Number.isInteger(edit.total)||edit.total<1||edit.total>20||!Number.isInteger(edit.companions)||edit.companions<0||edit.companions>=edit.total)throw Error("Nhập từ 1–20 khách và ít nhất 1 người chơi; người đi cùng phải nằm trong tổng số khách.");
  p.numPeople=edit.total;p.numCompanions=edit.companions;p.party=edit.total===1?"Đi một mình":`${edit.total-edit.companions} người chơi, ${edit.companions} người đi cùng`;delete p.packageId;
  if(p.dietCount!==undefined&&p.dietCount>edit.total){delete p.dietCount;note=" Số người có yêu cầu ăn uống cần được xác nhận lại theo quy mô mới.";}
 }else if(edit.field==="goal"){
  if(!Object.hasOwn(goalLabels,edit.goal))throw Error("Chọn mục tiêu phù hợp.");p.goal=edit.goal;delete p.packageId;
 }else if(edit.field==="budget"){
  if(!edit.flexible&&(typeof edit.amount!=="number"||!Number.isSafeInteger(edit.amount)||edit.amount<100000||edit.amount>1e10))throw Error("Nhập ngân sách từ 100.000 đ đến 10 tỷ đ mỗi người hoặc chọn Linh hoạt.");
  p.budget=edit.flexible?undefined:edit.amount;p.budgetFlexible=edit.flexible;
  if(p.groupNeeds)p.groupNeeds={...p.groupNeeds,budget:p.budget};
 }else{
  const text=edit.text.trim();if(!text||text.length>500)throw Error("Nhập yêu cầu ăn uống từ 1–500 ký tự.");
  const none=text==="Không có yêu cầu đặc biệt";
  if(!none&&edit.count!==undefined&&(!Number.isInteger(edit.count)||edit.count<1||p.numPeople===undefined||edit.count>p.numPeople))throw Error("Số người có yêu cầu ăn uống phải từ 1 đến tổng số khách đã ghi nhận.");
  p.diet=text;p.dietCount=none?undefined:edit.count;
 }
 const labels={party:"số khách và vai trò",goal:"mục tiêu",budget:"ngân sách",diet:"yêu cầu ăn uống"};
 const ack=`Đã cập nhật ${labels[edit.field]}. Các nhu cầu khác được giữ nguyên.${note}`;
 if(state.step==="quiz"){const next={...state,preferences:p};if(edit.field==="party")delete next.partyClarification;return {state:next,reply:{text:`${ack}\nBạn có thể tiếp tục câu NTRP đang trả lời.`,chips:["Tiếp tục kịch bản"]}};}
 if(p.groupNeeds){const reply=aceRecommendation(p);return {state:{step:"idle",preferences:p},reply:{...reply,text:`${ack}\n\n${reply.text}`}};}
 return continueAceConversation({step:state.step,preferences:p},ack);
}
