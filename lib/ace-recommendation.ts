import {tourPackages,tours,packageCapacity,formatVND} from "./mock-data";
import {companionRate,coupleTotal} from "./couple-pricing";
import type {AcePreferences,AceReply} from "./ace-conversation";
const goalNames={learn:"học kỹ thuật",compete:"thi đấu & giao lưu",relax:"nghỉ dưỡng"};
export type AcePackageAssessment={packageId:string;name:string;score:number;eligible:boolean;affordable:boolean;goalMatch:boolean;beginnerRisk:boolean;levelGap:boolean;playerRate?:number;companionRate:number;estimatedTotal?:number;met:string[];gaps:string[]};
function context(p:AcePreferences){
 const g=p.groupNeeds,total=g?.total??p.numPeople,companions=g?.companions??p.numCompanions,budget=g?g.budget:(p.budgetFlexible?undefined:p.budget);
 const goals={learn:0,compete:0,relax:0};
 if(g)for(const c of g.cohorts)goals[c.goal]+=c.count;
 else if(p.goal)goals[p.goal]=total!==undefined&&companions!==undefined?total-companions:1;
 const priority=g?(g.mainGoal!=="balanced"?g.mainGoal:goals.compete>goals.learn&&goals.compete>=goals.relax?"compete":goals.relax>goals.learn?"relax":"learn"):(p.goal??"learn");
 const players=total!==undefined&&companions!==undefined?total-companions:undefined;
 const beginners=g?g.cohorts.filter(c=>c.level==="beginner").reduce((n,c)=>n+c.count,0):p.level!==undefined&&p.level<3?(players??1):0;
 return {g,total,companions,budget,players,goals,priority,beginners,mixed:Object.values(goals).filter(n=>n>0).length>1};
}
export function assessAcePackage(p:AcePreferences,packageId:string,departureCode?:string):AcePackageAssessment{
 const pkg=tourPackages.find(t=>t.id===packageId);if(!pkg)throw Error("Gói không tồn tại");
 const c=context(p),policy=pkg.discovery,tour=tours.find(t=>t.packageId===pkg.id);
 const schedules=tour?.departureSchedules.filter(d=>Number.isFinite(d.price)&&d.price>0)??[];
 const chosen=departureCode?schedules.find(d=>d.code===departureCode):undefined;
 const rate=departureCode?chosen?.price:schedules.length?Math.min(...schedules.map(d=>d.price)):undefined;
 const result:AcePackageAssessment={packageId:pkg.id,name:pkg.name,score:0,eligible:true,affordable:true,goalMatch:policy.primaryGoal===c.priority,beginnerRisk:false,levelGap:false,playerRate:rate,companionRate:companionRate(pkg.id),met:[],gaps:[]};
 if(rate===undefined){result.eligible=false;result.gaps.push("Chưa có lịch và mức giá hợp lệ để đăng ký.");}
 if(c.total!==undefined&&(c.total<policy.minGuests||c.total>packageCapacity(pkg.id))){result.eligible=false;result.gaps.push(c.total<policy.minGuests?`Gói đoàn yêu cầu ít nhất ${policy.minGuests} khách; hiện có ${c.total} khách, chưa thể đăng ký đoàn độc lập.`:`${c.total} khách vượt quy mô ${packageCapacity(pkg.id)} khách/chuyến; cần phương án khác.`);}
 if(c.total===undefined&&policy.minGuests>1){result.eligible=false;result.gaps.push(`Chưa rõ số khách; gói đoàn yêu cầu từ ${policy.minGuests} khách, Ace chưa mặc định bạn đi cùng đoàn.`);}
 if(c.total!==undefined&&c.companions!==undefined&&(c.companions<0||c.companions>=c.total)){result.eligible=false;result.gaps.push("Cơ cấu phải có ít nhất 1 người chơi; cần xác nhận lại số người đi cùng.");}
 if(rate!==undefined){
  if(c.budget!==undefined&&rate>c.budget){result.affordable=false;result.gaps.push(`Giá người chơi ${formatVND(rate)} vượt ngân sách ${formatVND(c.budget)}: vượt ${formatVND(rate-c.budget)}/người chơi.`);}
  else if(c.budget!==undefined)result.met.push(`Giá người chơi ${formatVND(rate)} nằm trong ngân sách ${formatVND(c.budget)}/người.`);
  if(c.companions&&c.budget!==undefined&&result.companionRate>c.budget){result.affordable=false;result.gaps.push(`Giá người đi cùng ${formatVND(result.companionRate)} vượt ngân sách ${formatVND(c.budget)}/người đi cùng.`);}
  if(c.total!==undefined&&c.companions!==undefined&&c.players!==undefined&&c.players>0)result.estimatedTotal=coupleTotal(pkg.id,rate,c.total,c.companions);
 }
 result.score=result.goalMatch?60:0;
 const goalPlayers=Object.values(c.goals).reduce((a,b)=>a+b,0)||1;
 result.score+=35*c.goals[policy.primaryGoal]/goalPlayers;
 if(result.goalMatch)result.met.push(`Ưu tiên ${goalNames[c.priority]} phù hợp định hướng gói.`);
 else result.gaps.push(`Gói thiên về ${goalNames[policy.primaryGoal]}; chưa đáp ứng trọn vẹn ưu tiên ${goalNames[c.priority]}.`);
 if(c.goals.learn&&policy.primaryGoal!=="learn")result.gaps.push(`${c.goals.learn} người muốn học: cần xác nhận nội dung clinic và cách chia nhóm; không tự bổ sung buổi học.`);
 if(c.goals.compete&&policy.primaryGoal!=="compete")result.gaps.push(`${c.goals.compete} người muốn thi đấu: chương trình này chưa được xác nhận tương đương vòng bảng/playoff của Tournament.`);
 if(c.beginners){
  if(policy.beginnerFriendly){result.score+=35;result.met.push(`${c.beginners} người mới bắt đầu: phù hợp huấn luyện tennis cơ bản với HLV.`);}
  else if(policy.primaryGoal==="compete"){result.beginnerRisk=true;result.score-=85*c.beginners/goalPlayers;result.gaps.push(`${c.beginners} người mới chơi: cần HLV xác nhận trước khi tham gia thi đấu; nên ưu tiên học kỹ thuật trước.`);}
  else result.gaps.push(`${c.beginners} người mới chơi: cần xác nhận nhóm tập và nội dung huấn luyện phù hợp, chưa coi gói nghỉ dưỡng là khóa nhập môn.`);
 }
 const range=tour?.ntrpRange.match(/([\d.]+)\s*[–-]\s*([\d.]+)/);
 if(!c.g&&p.level!==undefined&&range&&(p.level<Number(range[1])||p.level>Number(range[2]))){result.levelGap=true;result.score-=20;result.gaps.push(`NTRP tự đánh giá ${p.level} ngoài khoảng tham khảo ${tour!.ntrpRange}; HLV cần xác nhận nhóm phù hợp.`);}
 if(c.g?.cohorts.some(row=>row.level==="advanced")&&policy.primaryGoal==="learn")result.gaps.push("Có người nâng cao trong nhóm; nội dung huấn luyện cơ bản chưa bảo đảm đáp ứng nhu cầu nâng cao.");
 if(c.mixed)result.gaps.push("Nhóm có nhiều mục tiêu; chưa có gói nào được xác nhận đáp ứng trọn vẹn tất cả các nhóm.");
 if(c.g?.cohorts.some(row=>row.level==="unknown"))result.gaps.push("Cần xác nhận trình độ những người chưa xác định trước khi xếp nhóm.");
 if(c.total!==undefined&&c.companions===undefined)result.gaps.push("Chưa rõ số người chơi và người đi cùng; chưa thể tính tổng giá nhóm.");
 if(c.companions)result.met.push(`${c.companions} người đi cùng được tính giá riêng ${formatVND(result.companionRate)}/người; không gồm quyền lợi tennis.`);
 const dietary=c.g?.dietary;
 if(dietary?.length)for(const d of dietary){const names={vegetarian:"ăn chay",seafood:"không ăn hải sản",lactose:"không lactose",other:"có yêu cầu riêng"};result.gaps.push(`${d.count} người ${names[d.kind]}${d.note?` (${d.note})`:""}: cần đơn vị tổ chức xác nhận thực đơn; chưa cam kết đáp ứng.`);}
 else if(p.diet&&p.diet!=="Không có yêu cầu đặc biệt")result.gaps.push(`Ăn uống đã ghi nhận: ${p.diet}. Thực đơn và cooking class cần xác nhận điều chỉnh với đơn vị tổ chức; chưa phải thực đơn được xác nhận đáp ứng.`);
 result.met.push(...pkg.highlights.slice(0,2));
 if(pkg.id!=="sbu1")result.gaps.push("Tổng chi phí là tham khảo; phương án/báo giá cuối cùng cần xác nhận trước khi đặt cọc.");
 result.gaps.push("NTRP là kết quả tự đánh giá; lịch, sân, HLV và nhóm tập cần xác nhận theo chuyến.");
 return result;
}
export function rankAcePackages(p:AcePreferences){return tourPackages.map(t=>assessAcePackage(p,t.id)).sort((a,b)=>Number(b.eligible)-Number(a.eligible)||Number(b.affordable)-Number(a.affordable)||(!a.affordable&&!b.affordable?(a.playerRate??Infinity)-(b.playerRate??Infinity):0)||b.score-a.score||(a.playerRate??Infinity)-(b.playerRate??Infinity));}
export function explainAceRecommendation(p:AcePreferences,summary:string):AceReply{
 const c=context(p),ranked=rankAcePackages(p),eligible=ranked.filter(a=>a.eligible),top=eligible[0];
 const header=p.groupNeeds?"Gợi ý cho nhóm của bạn":"Gợi ý theo nhu cầu của bạn";
 if(!top)return {text:`**${header}**\n${summary}\n\nChưa có gói đáp ứng điều kiện quy mô/lịch để đăng ký.\n${ranked.map(a=>`• ${a.name}: ${a.gaps[0]}`).join("\n")}\nBạn điều chỉnh quy mô hoặc nhờ tư vấn viên lập phương án riêng.`,packageIds:[],preferences:{...p},chips:[p.groupNeeds?"Sửa nhu cầu nhóm":"Gợi ý gói tour 🏖️"]};
 const qualified=eligible.filter(a=>a.affordable&&a.goalMatch&&!a.beginnerRisk&&!a.levelGap&&!c.mixed);
 const lead=qualified.length?"Đề xuất sơ bộ":"Lựa chọn gần nhất · Có điểm chưa đáp ứng";
 const notes:string[]=[];
 if(!eligible.some(a=>a.affordable))notes.push("Chưa có gói nào trong danh mục nằm trong ngân sách này. Lựa chọn dưới đây vẫn vượt ngân sách, không phải gói đã đáp ứng mức giá.");
 const desired=ranked.find(a=>a.goalMatch);
 if(desired&&desired.packageId!==top.packageId)notes.push(`Gói theo mục tiêu ban đầu — ${desired.name}: ${desired.gaps.filter(g=>/vượt|ít nhất|Chưa rõ|mới chơi/.test(g)).join(" ")||"cần xác nhận mức phù hợp trước khi lựa chọn."}`);
 if(p.packageId){const selected=ranked.find(a=>a.packageId===p.packageId);if(selected&&selected.packageId!==top.packageId)notes.push(`Gói bạn đang quan tâm ${selected.name} được đối chiếu lại, không tự ưu tiên hơn điều kiện ngân sách và quy mô mới.`);}
 const alternatives=eligible.filter(a=>a.packageId!==top.packageId).slice(0,2);
 const price=top.playerRate!==undefined?`Giá từ ${formatVND(top.playerRate)}/người chơi${c.companions?` · ${formatVND(top.companionRate)}/người đi cùng`:""}.${top.estimatedTotal!==undefined?` Tổng giá cơ bản tham khảo cho ${c.total} khách: ${formatVND(top.estimatedTotal)}.`:""} Chưa gồm phụ thu/dịch vụ bổ sung; giá từng lịch có thể khác.`:"";
 return {text:`**${header}**\n${summary}\n\n**${lead}: ${top.name}**\nSo sánh theo điều kiện quy mô và lịch → ngân sách mỗi người → mục tiêu và trình độ.\n${notes.join("\n")}\n${price}\n\n**Nội dung phù hợp trong gói hiện có**\n${top.met.map(s=>`• ${s}`).join("\n")}\n\n**Chưa đáp ứng / cần xác nhận**\n${top.gaps.map(s=>`• ${s}`).join("\n")}${alternatives.length?`\n\n**Lựa chọn thay thế**\n${alternatives.map(a=>`• ${a.name}: từ ${formatVND(a.playerRate!)}; ${a.affordable?"trong ngân sách hiện tại":"vẫn vượt ngân sách"}; ${a.goalMatch?"cùng hướng mục tiêu":"khác ưu tiên chính"}. ${a.gaps.find(s=>/mới chơi|người muốn|chưa đáp ứng/.test(s))??"Cần đối chiếu các quyền lợi và nhu cầu còn lại."}`).join("\n")}`:""}`,packageIds:[top.packageId,...alternatives.map(a=>a.packageId)],preferences:{...p},chips:p.groupNeeds?["Sửa nhu cầu nhóm","Xem tất cả gói tour"]:["Điều chỉnh ăn uống","Gợi ý gói tour 🏖️","Tôi thuộc NTRP nào? 🎾"]};
}
