import { ntrpQuiz, tourPackages } from "./mock-data";
import type { AceState } from "./ace-conversation";
const normalize=(s:string)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[đĐ]/g,"d").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const starts=["Gợi ý gói tour 🏖️","Tôi thuộc NTRP nào? 🎾","Trải nghiệm trong tour","Menu FEI cho tôi 🍜","Xem tất cả gói tour","Sửa nhu cầu nhóm","Điều chỉnh ăn uống","Tiếp tục kịch bản"];
const aliases:Record<string,string>={"goi y tour":starts[0],"tim tour":starts[0],"tu van tour":starts[0],"trinh do tennis":starts[1],"toi thuoc ntrp nao":starts[1],"kiem tra ntrp":starts[1],"xem tour khac":starts[4],"toi muon tour khac":starts[4],"toi muon doi tour":starts[4],"doi tour":starts[4],"xem goi khac":starts[4],"sua nhu cau nhom":starts[5]};
export function parseAceBudget(text:string):number|undefined{
 const raw=text.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[đĐ]/g,"d").toLowerCase().trim().replace(/^(?:toi co|ngan sach|toi da)\s*/,"").replace(/\s/g,"");
 const match=raw.match(/^(\d+(?:[.,]\d+)*)(trieu(?:dong)?|tr|dong|d)?(?:\/nguoi(?:choi)?)?$/);if(!match)return;
 let amount:number;
 if(match[2]?.startsWith("tr")){if(!/^\d+(?:[.,]\d{1,3})?$/.test(match[1]))return;amount=Number(match[1].replace(",","."))*1000000;}
 else {if(!/^\d+$/.test(match[1])&&!/^\d{1,3}(?:[.,]\d{3})+$/.test(match[1]))return;amount=Number(match[1].replace(/[.,]/g,""));}
 return Number.isFinite(amount)&&amount>=100000&&amount<=1e10?Math.round(amount):undefined;
}
export function matchAceScript(state:AceState,text:string):string|undefined{
 const input=normalize(text);if(!input)return;
 const global=[...starts,...tourPackages.map(p=>p.name)].find(s=>normalize(s)===input);
 if(global)return global;if(aliases[input])return aliases[input];
 let options:string[]=[];
 if(state.step==="party"){
  const party:Record<string,string>={"1 nguoi":"Đi một mình","di 1 minh":"Đi một mình","mot minh":"Đi một mình","2 nguoi cung choi":"Hai người cùng chơi","ca hai cung choi":"Hai người cùng chơi","1 nguoi choi 1 nguoi di cung":"Một người chơi, một người đi cùng"};if(party[input])return party[input];
  options=["Đi một mình","Hai người cùng chơi","Một người chơi, một người đi cùng","Nhóm 5–10 người","CLB 10–20 người","Một mình / cặp đôi"];
 }
 if(state.step==="goal")options=["Học kỹ thuật cùng nhau","Thi đấu & giao lưu","Nghỉ dưỡng & kết nối"];
 if(state.step==="budget"){
  if(["linh hoat","chua ro ngan sach","linh hoat theo trai nghiem"].includes(input))return "Linh hoạt theo trải nghiệm";
  if(parseAceBudget(text)!==undefined)return text;
  options=tourPackages.map(p=>`Tối đa ${p.priceRange.min.toLocaleString("vi-VN")} đ/người`);
 }
 if(state.step==="quiz"&&state.preferences.quizAnswers.length===0&&["moi choi","chua choi","chua tung choi","moi bat dau"].includes(input))return ntrpQuiz[0].options[0].label;
 if(state.step==="quiz")options=ntrpQuiz[state.preferences.quizAnswers.length]?.options.map(o=>o.label)??[];
 if(state.step==="diet"){
  options=["Không có yêu cầu đặc biệt","Ăn chay","Không ăn hải sản","Không lactose","Yêu cầu ăn uống khác"];
  if(/\?|co duoc|duoc khong|tai sao|bao nhieu|the nao/.test(input+text))return;
  if(/^(?:toi |minh )?(?:di ung|kieng|khong an|khong uong|an chay|an kieng|khong lactose)\b/.test(input))return text;
 }
 if(state.step==="group"&&/^\d+ ?(?:nguoi|khach)?$/.test(input))return text;
 const exact=options.find(s=>normalize(s)===input);if(exact)return exact;
 const partial=input.length>=6?options.filter(s=>normalize(s).includes(input)):[];
 return partial.length===1?partial[0]:undefined;
}
