import { tourPackages, packageCapacity, formatVND } from "./mock-data";
import type { AcePreferences, AceReply } from "./ace-conversation";
export const groupLevelLabels = { beginner: "Mới chơi", intermediate: "Trung cấp", advanced: "Nâng cao", unknown: "Chưa xác định" };
export const groupGoalLabels = { learn: "Học kỹ thuật", compete: "Thi đấu & giao lưu", relax: "Tennis & nghỉ dưỡng", balanced: "Cân bằng nhu cầu nhóm" };
export const dietaryLabels = { vegetarian: "Ăn chay", seafood: "Không ăn hải sản", lactose: "Không lactose", other: "Yêu cầu riêng / dị ứng" };
export type GroupCohort = { count: number; level: keyof typeof groupLevelLabels; goal: "learn" | "compete" | "relax" };
export type GroupDietary = { count: number; kind: keyof typeof dietaryLabels; note: string };
export type GroupNeeds = { total: number; companions: number; cohorts: GroupCohort[]; mainGoal: keyof typeof groupGoalLabels; dietary: GroupDietary[]; budget?: number };
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const count = (v: unknown, min=0): v is number => typeof v === "number" && Number.isInteger(v) && v >= min && v <= 20;
export function groupNeedsError(value: unknown): string | null {
 if (!object(value) || !count(value.total,2)) return "Nhập tổng số khách từ 2 đến 20.";
 if (!count(value.companions) || value.companions >= value.total) return "Số người đi cùng phải nhỏ hơn tổng số khách; cần ít nhất một người chơi.";
 if (!Array.isArray(value.cohorts) || !value.cohorts.length || value.cohorts.length>8) return "Thêm ít nhất một nhóm người chơi (tối đa 8 nhóm).";
 let players=0;
 for(const row of value.cohorts){if(!object(row)||!count(row.count,1)||!Object.hasOwn(groupLevelLabels,String(row.level))||!["learn","compete","relax"].includes(String(row.goal)))return "Kiểm tra số người, trình độ và mục tiêu của từng nhóm.";players+=row.count;}
 if(players!==value.total-value.companions)return `Tổng các nhóm phải bằng ${value.total-value.companions} người chơi, hiện đang là ${players}.`;
 if(!Object.hasOwn(groupGoalLabels,String(value.mainGoal)))return "Chọn ưu tiên chung của đoàn.";
 if(value.budget!=null&&(typeof value.budget!=="number"||!Number.isFinite(value.budget)||value.budget<=0||value.budget>1e10))return "Ngân sách phải lớn hơn 0, hoặc để trống nếu linh hoạt.";
 if(!Array.isArray(value.dietary)||value.dietary.length>6)return "Kiểm tra danh sách yêu cầu ăn uống (tối đa 6 loại).";
 const kinds=new Set<string>();
 for(const row of value.dietary){
  if(!object(row)||!count(row.count,1)||row.count>value.total||!Object.hasOwn(dietaryLabels,String(row.kind))||typeof row.note!=="string"||row.note.length>150)return "Mỗi yêu cầu ăn uống cần số người từ 1 đến tổng số khách; ghi chú tối đa 150 ký tự.";
  if(row.kind==="other"&&!row.note.trim())return "Mô tả yêu cầu riêng hoặc dị ứng cần lưu ý.";
  if(row.kind!=="other"&&kinds.has(String(row.kind)))return "Gộp số người có cùng một loại yêu cầu ăn uống vào một dòng.";
  kinds.add(String(row.kind));
 }
 return null;
}
export function parseGroupNeeds(value: unknown): GroupNeeds | undefined {
 if(groupNeedsError(value))return;
 const g=value as GroupNeeds;
 return {total:g.total,companions:g.companions,mainGoal:g.mainGoal,cohorts:g.cohorts.map(c=>({count:c.count,level:c.level,goal:c.goal})),dietary:g.dietary.map(d=>({count:d.count,kind:d.kind,note:d.note.trim()})),...(typeof g.budget==="number"?{budget:g.budget}:{})};
}
export function groupNeedsSummary(g: GroupNeeds): string {
 return [`${g.total} khách · ${g.total-g.companions} người chơi · ${g.companions} người đi cùng`,...g.cohorts.map(c=>`• ${c.count} người ${groupLevelLabels[c.level].toLowerCase()} · ${groupGoalLabels[c.goal].toLowerCase()}`),`Ưu tiên chung: ${groupGoalLabels[g.mainGoal]}`,g.budget?`Ngân sách: tối đa ${formatVND(g.budget)}/người chơi`:"Ngân sách linh hoạt",g.dietary.length?`Ăn uống (có thể trùng người giữa các loại): ${g.dietary.map(d=>`${d.count} người ${dietaryLabels[d.kind].toLowerCase()}${d.note?` — ${d.note}`:""}`).join("; ")}`:"Chưa có yêu cầu ăn uống riêng"].join("\n");
}
export function applyGroupNeeds(previous: AcePreferences, needs: GroupNeeds): AcePreferences {
 const next={...previous,groupNeeds:needs,numPeople:needs.total,numCompanions:needs.companions,party:"Nhóm theo nhu cầu",budget:needs.budget,diet:needs.dietary.length?needs.dietary.map(d=>`${d.count} người ${dietaryLabels[d.kind]}${d.note?`: ${d.note}`:""}`).join("; "):"Không có yêu cầu đặc biệt",goal:needs.mainGoal==="balanced"?undefined:needs.mainGoal};
 delete next.packageId;
 return next;
}
export function groupRecommendation(g: GroupNeeds, preferences?: AcePreferences): AceReply {
 const goals={learn:0,compete:0,relax:0};for(const c of g.cohorts)goals[c.goal]+=c.count;
 const mixed=new Set([...g.cohorts.map(c=>c.goal),...(g.mainGoal!=="balanced"?[g.mainGoal]:[])]).size>1;
 const priority=g.mainGoal==="balanced"?(goals.compete>goals.learn&&goals.compete>=goals.relax?"compete":goals.relax>goals.learn?"relax":"learn"):g.mainGoal;
 const explicitlySelected=preferences?.packageId&&tourPackages.some(p=>p.id===preferences.packageId)?preferences.packageId:undefined;
 const id=explicitlySelected??(priority==="compete"?"sbu2":priority==="relax"?"sbu3":"sbu1");
 const pkg=tourPackages.find(p=>p.id===id)!;
 const met:string[]=[],gaps:string[]=[];
 met.push(...pkg.highlights.map(h=>`• ${h}`));
 if(id==="sbu1"&&goals.learn)met.unshift(`• Hướng học kỹ thuật của ${goals.learn} người phù hợp nội dung huấn luyện cơ bản của gói.`);
 if(id==="sbu2"&&goals.compete)met.unshift(`• ${goals.compete} người muốn thi đấu có chương trình vòng bảng và playoff để tham khảo.`);
 if(id==="sbu3")met.unshift("• Phù hợp ưu tiên kết hợp tennis, nghỉ dưỡng và phục hồi.");
 if(mixed)gaps.push("Nhóm có nhiều mục tiêu; chưa có gói nào trong danh mục được xác nhận đáp ứng trọn vẹn tất cả các nhóm.");
 if(id!=="sbu2"&&goals.compete)gaps.push(`${goals.compete} người muốn thi đấu: cần xác nhận thể thức phù hợp; không xem các buổi sân thông thường là quyền lợi giải đấu đã có.`);
 if(id!=="sbu1"&&goals.learn)gaps.push(`${goals.learn} người muốn học: cần xác nhận nội dung clinic và cách chia nhóm tập, không tự thêm buổi học vào gói.`);
 const beginners=g.cohorts.filter(c=>c.level==="beginner").reduce((s,c)=>s+c.count,0);
 if(id==="sbu2"&&beginners)gaps.push(`${beginners} người mới chơi: cần HLV xác nhận trình độ, nhóm tập và phương án tham gia; không mặc định tất cả đủ điều kiện thi đấu.`);
 if(g.cohorts.some(c=>c.level==="advanced")&&id==="sbu1")gaps.push("Có người nâng cao trong nhóm; huấn luyện cơ bản chưa đảm bảo đáp ứng mục tiêu nâng cao.");
 if(g.cohorts.some(c=>c.level==="unknown"))gaps.push("Cần xác nhận trình độ những người chưa xác định trước khi xếp nhóm.");
 if(g.total>packageCapacity(id))gaps.push(`${g.total} khách vượt quy mô ${packageCapacity(id)} khách/chuyến của gói; cần phương án khác, chưa thể đặt nguyên nhóm theo cấu hình này.`);
 if(id==="sbu2"&&g.total<8)gaps.push("Gói đoàn yêu cầu ít nhất 8 khách; nhóm hiện tại chưa đủ quy mô gửi yêu cầu theo luồng này.");
 if(g.budget&&pkg.priceRange.min>g.budget)gaps.push(`Giá từ ${formatVND(pkg.priceRange.min)}/người chơi vượt ngân sách ${formatVND(g.budget)}; cần điều chỉnh ngân sách hoặc chọn gói thay thế.`);
 for(const d of g.dietary)gaps.push(`${d.count} người ${dietaryLabels[d.kind].toLowerCase()}${d.note?` (${d.note})`:""}: cần đơn vị tổ chức xác nhận thực đơn/cooking class; chưa cam kết đáp ứng.`);
 if(g.budget&&tourPackages.every(p=>p.priceRange.min>g.budget!))gaps.push("Chưa có gói nào trong danh mục nằm trong ngân sách/người chơi này; cần điều chỉnh ngân sách, chưa có lựa chọn thay thế đã đáp ứng mức giá.");
 if(g.companions)gaps.push(`${g.companions} người đi cùng: cần xác nhận lịch hoạt động, quyền lợi và giá riêng; không tự tính là người chơi tennis.`);
 const alternatives:string[]=[];
 if(mixed){for(const goal of ["learn","compete","relax"] as const){const alt=goal==="learn"?"sbu1":goal==="compete"?"sbu2":"sbu3";if(goals[goal]&&alt!==id)alternatives.push(alt);}}
 if(g.budget&&pkg.priceRange.min>g.budget&&id!=="sbu1")alternatives.push("sbu1");
 if(g.total>packageCapacity(id)&&id!=="sbu1")alternatives.push("sbu1");
 if(id==="sbu2"&&(beginners||g.total<8))alternatives.push("sbu1");
 const distinct=[...new Set(alternatives)];
 const alternativeText=distinct.map(alt=>{const item=tourPackages.find(p=>p.id===alt)!;return `• ${item.name}: ${alt==="sbu1"?"ưu tiên học kỹ thuật cơ bản":alt==="sbu2"?"ưu tiên thi đấu cho đoàn từ 8 khách":"ưu tiên tennis và nghỉ dưỡng"}, từ ${formatVND(item.priceRange.min)}/người chơi; vẫn cần đối chiếu các nhu cầu còn lại.`;});
 return {text:`**Gợi ý cho nhóm của bạn**\n${groupNeedsSummary(g)}\n\n**Đề xuất: ${pkg.name}**\nChọn theo ${explicitlySelected?"gói bạn đã chủ động chọn":g.mainGoal==="balanced"?"mục tiêu được nhiều người trong nhóm ưu tiên nhất (nếu bằng nhau, ưu tiên học kỹ thuật)":"ưu tiên chung bạn đã chọn"}.\n\n**Nội dung phù hợp trong gói hiện có**\n${met.join("\n")}\n\n**Chưa đáp ứng / cần xác nhận**\n${gaps.length?gaps.map(s=>`• ${s}`).join("\n"):"• Lịch, sân và cách xếp nhóm cần xác nhận theo chuyến."}${alternativeText.length?`\n\n**Lựa chọn thay thế**\n${alternativeText.join("\n")}`:""}`,packageIds:[id,...distinct].slice(0,3),preferences:preferences?{...preferences}:undefined,chips:["Sửa nhu cầu nhóm","Xem tất cả gói tour"]};
}
