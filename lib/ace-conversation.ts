import { getNtrpLevel, ntrpQuiz, tourPackages } from "./mock-data";

export type AcePreferences = {
  party?: string;
  numPeople?: number;
  numCompanions?: number;
  goal?: "learn" | "compete" | "relax";
  budget?: number;
  quizAnswers: number[];
  level?: number;
  diet?: string;
  packageId?: string;
};
export type AceState = { step: "idle" | "party" | "goal" | "budget" | "quiz" | "diet"; preferences: AcePreferences };
export type AceReply = { text: string; chips?: string[]; packageIds?: string[]; preferences?: AcePreferences };
export const initialAceState = (): AceState => ({ step: "idle", preferences: { quizAnswers: [] } });
export const aceStarts = ["Gợi ý gói tour 🏖️", "Tôi thuộc NTRP nào? 🎾", "Trải nghiệm trong tour", "Menu FEI cho tôi 🍜"];
const parties = ["Đi một mình", "Hai người cùng chơi", "Một người chơi, một người đi cùng", "Nhóm 5–10 người", "CLB 10–20 người"];
const goals = ["Học kỹ thuật cùng nhau", "Thi đấu & giao lưu", "Nghỉ dưỡng & kết nối"];
const diets = ["Không có yêu cầu đặc biệt", "Ăn chay", "Không ăn hải sản", "Không lactose", "Yêu cầu ăn uống khác"];
const goalNames = { learn: "học kỹ thuật", compete: "thi đấu & giao lưu", relax: "nghỉ dưỡng & kết nối" };
export function preferenceSummary(p: AcePreferences): string {
  return [p.numPeople && `Số khách: ${p.numPeople}${p.numCompanions !== undefined ? ` (${p.numCompanions} người đi cùng)` : ""}`, p.party && `Đi cùng: ${p.party}`, p.goal && `Mục tiêu: ${goalNames[p.goal]}`, p.level && `NTRP tự đánh giá: ${p.level}`, p.budget && `Ngân sách: tối đa ${p.budget.toLocaleString("vi-VN")} đ/người`, p.diet && `Ăn uống: ${p.diet}`].filter(Boolean).join("\n");
}
function result(p: AcePreferences): AceReply {
  const packageId = p.packageId ?? (p.goal === "compete" ? "sbu2" : p.goal === "relax" ? "sbu3" : "sbu1");
  const selected = tourPackages.find(item => item.id === packageId)!;
  const overBudget = p.budget && selected.priceRange.min > p.budget;
  const beginnerCompetition = p.goal === "compete" && p.level && p.level < 3;
  return {
    text: `**Gợi ý theo nhu cầu của bạn**\n${preferenceSummary(p)}\n\n${selected.name} được gợi ý theo ${p.packageId ? "gói bạn chọn" : p.goal ? "mục tiêu chuyến đi" : "nhu cầu học và chơi"}.${overBudget ? "\nGói phù hợp mục tiêu đang vượt ngân sách. Bạn có thể xem thêm gói học & chơi có giá thấp hơn hoặc điều chỉnh ngân sách." : ""}${beginnerCompetition ? "\nBạn đang ở mức mới bắt đầu; nên ưu tiên học kỹ thuật trước. Hãy kiểm tra nhóm chơi phù hợp với HLV nếu vẫn muốn tham gia thi đấu." : ""}${p.level ? "\nNTRP là kết quả tự đánh giá; HLV xác nhận nhóm tập theo chuyến." : ""}${p.diet && p.diet !== diets[0] ? `\n\n**Yêu cầu ăn uống đã ghi nhận: ${p.diet}.** Các bữa ăn và cooking class cần được điều chỉnh, xác nhận với đơn vị tổ chức. Đây chưa phải thực đơn đã được xác nhận đáp ứng yêu cầu.` : ""}`,
    packageIds: [...new Set([...(beginnerCompetition ? ["sbu1"] : []), packageId, ...(overBudget && packageId !== "sbu1" ? ["sbu1"] : [])])],
    chips: ["Điều chỉnh ăn uống", "Gợi ý gói tour 🏖️", "Tôi thuộc NTRP nào? 🎾", "Xem tất cả gói tour"],
    preferences: { ...p },
  };
}
export function aceRespond(state: AceState, input: string): { state: AceState; reply: AceReply } {
  const p = { ...state.preferences, quizAnswers: [...state.preferences.quizAnswers] };
  const answer = (step: AceState["step"], reply: AceReply) => ({ state: { step, preferences: p }, reply });
  if (input === aceStarts[0]) { delete p.packageId; return answer("party", { text: "Bạn dự định đi cùng ai?", chips: parties }); }
  if (input === aceStarts[1]) { p.quizAnswers = []; delete p.level; return answer("quiz", { text: ntrpQuiz[0].question, chips: ntrpQuiz[0].options.map(o => o.label) }); }
  if (input === "Xem tất cả gói tour") return answer("idle", { text: "Các gói hiện có. Nhu cầu của bạn vẫn được giữ trong cuộc trò chuyện.", packageIds: tourPackages.map(item => item.id), preferences: { ...p }, chips: ["Điều chỉnh ăn uống", ...aceStarts.slice(0, 2)] });
  if (input === aceStarts[2] || input === aceStarts[3] || input === "Điều chỉnh ăn uống") return answer("diet", { text: "Bạn có yêu cầu ăn uống nào cho các bữa ăn và trải nghiệm trong tour? Bạn có thể chọn hoặc nhập yêu cầu cụ thể.", chips: diets });
  const selected = tourPackages.find(item => item.name === input);
  if (selected) { p.packageId = selected.id; return answer("idle", result(p)); }
  if (state.step === "party" && [...parties, "Một mình / cặp đôi"].includes(input)) { p.party = input;
    if(input===parties[0]){p.numPeople=1;p.numCompanions=0;}else if(input===parties[1]){p.numPeople=2;p.numCompanions=0;}else if(input===parties[2]){p.numPeople=2;p.numCompanions=1;}else{delete p.numPeople;delete p.numCompanions;} return answer("goal", { text: "Mục tiêu chính của chuyến đi là gì?", chips: goals }); }
  if (state.step === "goal" && goals.includes(input)) { p.goal = (["learn", "compete", "relax"] as const)[goals.indexOf(input)]; return answer("budget", { text: "Ngân sách dự kiến mỗi người là bao nhiêu?", chips: [...tourPackages.map(item => `Tối đa ${item.priceRange.min.toLocaleString("vi-VN")} đ/người`), "Linh hoạt theo trải nghiệm"] }); }
  if (state.step === "budget") {
    const budgetPackage = tourPackages.find(item => input === `Tối đa ${item.priceRange.min.toLocaleString("vi-VN")} đ/người`);
    if (budgetPackage || input === "Linh hoạt theo trải nghiệm") { p.budget = budgetPackage?.priceRange.min; return answer("diet", { text: "Bạn có yêu cầu ăn uống nào không?", chips: diets }); }
  }
  if (state.step === "quiz") {
    const question = ntrpQuiz[p.quizAnswers.length];
    const option = question?.options.find(item => item.label === input);
    if (option) {
      p.quizAnswers.push(option.value);
      if (p.quizAnswers.length < ntrpQuiz.length) { const next = ntrpQuiz[p.quizAnswers.length]; return answer("quiz", { text: next.question, chips: next.options.map(item => item.label) }); }
      p.level = getNtrpLevel(p.quizAnswers.reduce((a, b) => a + b, 0) / p.quizAnswers.length).level;
      if (!p.goal) p.goal = option.value >= 3.5 ? "compete" : "learn";
      return answer("idle", result(p));
    }
    return answer("quiz", { text: "Chọn câu trả lời gần nhất để tiếp tục tự đánh giá nhé.", chips: question.options.map(item => item.label) });
  }
  if (state.step === "diet") {
    if (input === diets[4]) return answer("diet", { text: "Bạn nhập giúp Ace yêu cầu cụ thể, ví dụ dị ứng đậu phộng hoặc chế độ ăn riêng." });
    p.diet = input.slice(0, 500);
    return answer("idle", result(p));
  }
  if (state.step === "party") return answer("party", { text: "Chọn hình thức đi phù hợp nhé.", chips: parties });
  if (state.step === "goal") return answer("goal", { text: "Bạn ưu tiên trải nghiệm nào?", chips: goals });
  if (state.step === "budget") return answer("budget", { text: "Chọn mức ngân sách để Ace so với giá gói hiện có.", chips: [...tourPackages.map(item => `Tối đa ${item.priceRange.min.toLocaleString("vi-VN")} đ/người`), "Linh hoạt theo trải nghiệm"] });
  return answer("idle", { text: "Bạn muốn bắt đầu hành trình nào? Ace sẽ giữ các nhu cầu đã ghi nhận trong cuộc trò chuyện này.", chips: aceStarts });
}
