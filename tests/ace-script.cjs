const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),ts=require("typescript");
function load(file,deps={}){const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{module,exports:module.exports,require:n=>deps[n],Intl});return module.exports;}
const data=load("lib/mock-data.ts"),router=load("lib/ace-script.ts",{"./mock-data":data});const group=load("lib/ace-group.ts",{"./mock-data":data});const ace=load("lib/ace-conversation.ts",{"./mock-data":data,"./ace-script":router,"./ace-group":group});
const state=()=>ace.initialAceState();
assert.equal(router.matchAceScript(state(),"tôi muốn tour khác"),"Xem tất cả gói tour");
assert.equal(router.matchAceScript(state(),"toi thuoc ntrp nao"),ace.aceStarts[1]);
assert.equal(router.matchAceScript(state(),"Tôi muốn hủy tour đã đặt"),undefined);
assert.equal(router.matchAceScript(state(),"Có tour Nhật Bản không?"),undefined);
const quiz={...state(),step:"quiz"};assert.equal(router.matchAceScript(quiz,"mới chơi"),data.ntrpQuiz[0].options[0].label);
assert.equal(router.matchAceScript(quiz,data.ntrpQuiz[0].options[1].label),data.ntrpQuiz[0].options[1].label);
assert.equal(router.matchAceScript(quiz,"Tôi muốn đổi lịch khởi hành"),undefined);
const diet={...state(),step:"diet"};assert.equal(router.matchAceScript(diet,"Tôi dị ứng đậu phộng"),"Tôi dị ứng đậu phộng");assert.equal(router.matchAceScript(diet,"ăn chay có được không?"),undefined);assert.equal(router.matchAceScript(diet,"Tôi muốn hoàn tiền"),undefined);
const budget={...state(),step:"budget"};for(const [text,value]of [["7 triệu",7000000],["6,9 triệu",6900000],["6.9tr",6900000],["6.900.000 đ",6900000]]){assert.equal(router.parseAceBudget(text),value);const match=router.matchAceScript(budget,text);assert.equal(ace.aceRespond(budget,match).state.preferences.budget,value);}
assert.equal(router.matchAceScript(budget,"Tại sao giá tăng?"),undefined);
assert.equal(router.matchAceScript({...state(),step:"group"},"8 người"),"8 người");
assert.equal(router.matchAceScript({...state(),step:"group"},"Nhóm mình cần xuất hóa đơn"),undefined);
assert.equal(quiz.preferences.quizAnswers.length,0);
const ongoing={step:"quiz",preferences:{quizAnswers:[2.5],diet:"Ăn chay"}};
const resumed=ace.aceRespond(ongoing,"Tiếp tục kịch bản");assert.equal(resumed.state.step,"quiz");assert.equal(resumed.state.preferences.quizAnswers.length,1);assert.equal(resumed.reply.text,data.ntrpQuiz[1].question);assert.equal(resumed.state.preferences.diet,"Ăn chay");

console.log("Passed: scripted options/aliases, contextual quiz/diet/budget inputs, decimal amounts, out-of-script questions and unchanged flow state.");
