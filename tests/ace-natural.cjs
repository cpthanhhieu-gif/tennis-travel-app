const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const cache=new Map();function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;const module={exports:{}};cache.set(file,module);vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{module,exports:module.exports,require:n=>n.startsWith('.')?load(path.resolve(path.dirname(file),n)+'.ts'):require(n),Intl,Date,console});return module.exports;}
const {respondToAceText:respond}=load('lib/ace-natural.ts'),data=load('lib/ace-language-data.ts'),ace=load('lib/ace-conversation.ts');
let count=0;
for(const row of data.aceLanguageExamples)for(const text of row.examples)for(const variant of [text,text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toUpperCase()]){
 const initial=ace.initialAceState(),r=respond(initial,variant);assert.ok(r,variant);const p=r.state.preferences;
 if(row.intent==='solo'){assert.equal(p.numPeople,1,variant);assert.equal(p.numCompanions,0,variant);}
 if(row.intent==='bothPlayers'){assert.equal(p.numPeople,2,variant);assert.equal(p.numCompanions,0,variant);}
 if(row.intent==='onePlayer'){assert.equal(p.numPeople,2,variant);assert.equal(p.numCompanions,1,variant);}
 if(row.intent==='coupleUnknown'){assert.equal(p.numPeople,2,variant);assert.equal(p.numCompanions,undefined,variant);assert.equal(r.state.step,'party');}
 if(['learn','compete','relax'].includes(row.intent))assert.equal(p.goal,row.intent,variant);
 if(row.intent==='noDiet')assert.equal(p.diet,'Không có yêu cầu đặc biệt',variant);
 if(['vegetarian','seafood','lactose'].includes(row.intent))assert.ok(p.diet,variant);
 if(row.intent==='clarifyGoal')assert.deepEqual(r.state,initial,variant);
 count++;
}
for(const text of data.aceNaturalDemoPrompts){const r=respond(ace.initialAceState(),text);assert.ok(r,text);if(text.startsWith('Hai')){assert.equal(r.state.preferences.numCompanions,1);assert.equal(r.state.preferences.goal,'relax');assert.equal(r.state.preferences.budget,30000000);assert.match(r.state.preferences.diet,/vợ mình ăn chay/);assert.equal(r.reply.packageIds[0],'sbu3');}if(text.startsWith('Nhóm'))assert.equal(r.state.step,'group');}
console.log(`Passed ${count} runtime-corpus utterances/variants and ${data.aceNaturalDemoPrompts.length} in-product multi-clause examples.`);
const fixtures=JSON.parse(fs.readFileSync('tests/fixtures/ace-natural-cases.json','utf8'));
for(const item of fixtures.cases){const state={...ace.initialAceState(),step:item.step};const before=JSON.stringify(state),r=respond(state,item.text);assert.equal(JSON.stringify(state),before,'Must not mutate input: '+item.text);if(item.outcome==='advisor'){assert.equal(r,undefined,item.text);continue;}assert.ok(r,item.text);if(item.outcome==='clarify'){assert.deepEqual(r.state.preferences,state.preferences,item.text);assert.equal(r.state.step,state.step,item.text);}else for(const [key,value] of Object.entries(item.expected))assert.equal(r.state.preferences[key],value,item.text);}
let current=ace.initialAceState();for(const text of ['Mình đi với vợ','Một người chơi, một người đi cùng','Mình muốn nghỉ dưỡng','Ngân sách linh hoạt','Vợ mình ăn chay']){const r=respond(current,text);assert.ok(r,text);current=r.state;}
assert.equal(current.preferences.numPeople,2);assert.equal(current.preferences.numCompanions,1);assert.equal(current.preferences.budgetFlexible,true);assert.equal(current.preferences.goal,'relax');assert.match(current.preferences.diet,/Vợ mình ăn chay/);
let update=respond(current,'Mình muốn học kỹ thuật');assert.equal(update.state.preferences.numPeople,2);assert.equal(update.state.preferences.goal,'learn');assert.match(update.state.preferences.diet,/ăn chay/);assert.equal(update.reply.packageIds[0],'sbu1');
update=respond(update.state,'Mình dị ứng tôm');assert.match(update.state.preferences.diet,/ăn chay/);assert.match(update.state.preferences.diet,/dị ứng tôm/);
const quiz={step:'quiz',preferences:{quizAnswers:[2.5],diet:'Ăn chay'}};assert.equal(respond(quiz,'Vợ mình ăn chay'),undefined);assert.equal(quiz.preferences.quizAnswers.length,1);
const partial=respond(current,'Mình đi một mình; tôi muốn hủy tour');assert.equal(partial,undefined);assert.equal(current.preferences.numPeople,2);
console.log(`Passed ${fixtures.cases.length} additional acceptance/ambiguity/advisor fixtures, preference correction, role clarification, diet accumulation and quiz preservation.`);
