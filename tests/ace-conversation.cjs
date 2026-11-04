const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
function load(file, deps = {}) {
  const module = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { module, exports: module.exports, require: name => deps[name] ?? (name === "./ace-recommendation" ? load("lib/ace-recommendation.ts", {"./mock-data":deps["./mock-data"],"./couple-pricing":load("lib/couple-pricing.ts")}) : undefined), Intl });
  return module.exports;
}
const data = load("lib/mock-data.ts");
const ace = load("lib/ace-conversation.ts", {"./ace-script":load("lib/ace-script.ts",{"./mock-data":data}),"./mock-data":data,"./ace-group":load("lib/ace-group.ts",{"./mock-data":data})});
function run(inputs, state = ace.initialAceState()) {
  let response;
  for (const input of inputs) { response = ace.aceRespond(state, input); state = response.state; }
  return response;
}
const tour = (goal, diet = "Ăn chay") => run([ace.aceStarts[0], "Một mình / cặp đôi", goal, "Linh hoạt theo trải nghiệm", diet]);
assert.equal(tour("Học kỹ thuật cùng nhau").reply.packageIds[0], "sbu1");
assert.equal(tour("Thi đấu & giao lưu").reply.packageIds[0], "sbu1");
assert.match(tour("Thi đấu & giao lưu").reply.text,/Chưa rõ số khách/);
assert.equal(tour("Nghỉ dưỡng & kết nối").reply.packageIds[0], "sbu3");
const club = tour("Thi đấu & giao lưu", "Không ăn hải sản");
assert.match(club.reply.text, /Không ăn hải sản/);
assert.match(club.reply.text, /chưa phải thực đơn/);
const changed = run(["Điều chỉnh ăn uống", "Không lactose"], club.state);
assert.equal(changed.state.preferences.party, "Một mình / cặp đôi");
assert.equal(changed.reply.packageIds[0], "sbu1");
assert.match(changed.reply.text, /Không lactose/);
assert.equal(club.state.preferences.diet, "Không ăn hải sản");
const budget = run([ace.aceStarts[0], "Một mình / cặp đôi", "Thi đấu & giao lưu", `Tối đa ${data.tourPackages[0].priceRange.min.toLocaleString("vi-VN")} đ/người`, "Ăn chay"]);
assert.match(budget.reply.text, /vượt ngân sách/);
assert.equal(budget.reply.packageIds.includes("sbu1"), true);
const quiz = run([ace.aceStarts[1], ...data.ntrpQuiz.map(q => q.options[0].label)], club.state);
assert.equal(quiz.state.preferences.quizAnswers.length, data.ntrpQuiz.length);
assert.equal(quiz.state.preferences.goal, "compete");
assert.equal(quiz.state.preferences.diet, "Không ăn hải sản");
assert.equal(quiz.reply.packageIds[0], "sbu1");
assert.match(quiz.reply.text, /mới bắt đầu/);
const high = run([ace.aceStarts[1], ...data.ntrpQuiz.map(q => q.options[3].label)]);
assert.equal(high.state.preferences.level > quiz.state.preferences.level, true);
assert.equal(high.state.step, "party");
assert.equal(high.reply.packageIds, undefined);
const solo = run([ace.aceStarts[0],"Đi một mình","Thi đấu & giao lưu","Linh hoạt theo trải nghiệm","Ăn chay"]);
assert.equal(solo.reply.packageIds.includes("sbu2"),false);
assert.match(solo.reply.text,/8 khách/);
const couple = run([ace.aceStarts[0],"Một người chơi, một người đi cùng","Thi đấu & giao lưu","Linh hoạt theo trải nghiệm","Ăn chay"]);
assert.equal(couple.reply.packageIds.includes("sbu2"),false);
const custom = run([ace.aceStarts[2], "Yêu cầu ăn uống khác", "Dị ứng đậu phộng"], club.state);
assert.match(custom.reply.text, /Dị ứng đậu phộng/);
assert.equal(custom.state.preferences.goal, "compete");
const fresh = ace.initialAceState();
assert.equal(fresh.preferences.diet, undefined);
assert.equal(fresh.preferences.quizAnswers.length, 0);
console.log("Passed: distinct goals, budget mismatch, dietary changes/custom allergies, cross-journey memory, NTRP assessment and fresh reset.");
