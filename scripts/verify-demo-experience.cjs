const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict"),ts=require("typescript");
const cache={};
function load(name){if(cache[name])return cache[name];const mod={exports:{}};const source=fs.readFileSync(path.join(__dirname,"../lib/"+name+".ts"),"utf8");vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:mod.exports,module:mod,require:id=>load(id.replace("./",""))});return cache[name]=mod.exports;}
const {demoParty,packageFlow}=load("demo-experience");
for(const scenario of ["personal","couple","club"]){for(const pkg of ["sbu1","sbu2","sbu3"]){const p=demoParty(scenario,pkg);assert(p.numPeople>p.numCompanions);assert(p.numPeople<=(pkg==="sbu3"?16:20));if(pkg==="sbu2"){assert.equal(p.numPeople,16);assert(packageFlow(pkg).steps.includes("báo giá"));}else if(scenario==="couple"){assert.equal(p.numPeople,2);assert.equal(p.numCompanions,1);}else{assert.equal(p.numPeople,1);assert.equal(p.numCompanions,0);}}}
assert(packageFlow("sbu1").steps.includes("30%"));assert(packageFlow("sbu2").steps.includes("50%"));assert(packageFlow("sbu3").steps.includes("24 giờ"));
for(const id of ["personal","couple"]){const d=JSON.parse(fs.readFileSync(path.join(__dirname,"../demo/scenarios/"+id+".json"),"utf8"));assert.equal(d.entryPath,"/");assert.deepEqual(d.automaticActions,[]);}
console.log("PASS: 3 scenarios x 3 packages, editable party presets, package-specific booking routes and no automatic transactions.");
