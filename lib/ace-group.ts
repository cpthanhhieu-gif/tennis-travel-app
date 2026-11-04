import {explainAceRecommendation} from "./ace-recommendation";
import { formatVND } from "./mock-data";
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
 const next={...previous,groupNeeds:needs,numPeople:needs.total,numCompanions:needs.companions,party:"Nhóm theo nhu cầu",budget:needs.budget,budgetFlexible:needs.budget===undefined,diet:needs.dietary.length?needs.dietary.map(d=>`${d.count} người ${dietaryLabels[d.kind]}${d.note?`: ${d.note}`:""}`).join("; "):"Không có yêu cầu đặc biệt",goal:needs.mainGoal==="balanced"?undefined:needs.mainGoal};
 delete next.packageId;delete next.dietCount;
 return next;
}
export function groupRecommendation(g: GroupNeeds, preferences?: AcePreferences): AceReply {
 const p:AcePreferences={...preferences,quizAnswers:preferences?.quizAnswers??[],groupNeeds:g,numPeople:g.total,numCompanions:g.companions,budget:g.budget};
 return explainAceRecommendation(p,groupNeedsSummary(g));
}
